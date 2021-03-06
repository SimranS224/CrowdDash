import os
import uuid

import cv2
from flask import jsonify, request, Response, send_from_directory, abort

from api.app import app, db
from api import utils
from api.models import Report, Video, Image, Profile
from api.io import VideoIO
from api.analysis import pipelines


@app.route('/api/report/', methods=['GET', 'POST'], defaults={'report_id': None})
@app.route('/api/report/<int:report_id>', methods=['GET', 'PUT', 'DELETE'])
def report(report_id):
    if request.method == 'GET':
        if report_id is None:
            reports = Report.query.all()
            reports = [r.to_dict() for r in reports]

            return jsonify({
                'data': reports
            })
        else:
            reports = Report.query.filter_by(id=report_id).first()

            return jsonify({
                'data': reports.to_dict()
            })

    elif request.method == 'POST':
        data = request.json
        print(data)
        valid, missing = Report.validate_json(data)

        if not valid:
            return jsonify({
                'message': '{} not given in request.'.format(', '.join(missing))
            }), 422

        report = Report(data['user_id'],
                        data['report_type'],
                        data['timestamp'],
                        data['location']['longitude'],
                        data['location']['latitude'])
        db.session.add(report)
        db.session.commit()

        return jsonify(report.id)

    elif request.method == 'PUT':
        print(request.headers)

        if 'video' not in request.files:
            return jsonify({'message': 'Request does not have a file'}), 422
        
        file = request.files['video']
        
        if file.filename == '':
            return jsonify({'message': 'Request does not have a file'}), 422
        
        if file and utils.allowed_file(file.filename):
            ext = utils.get_ext(file.filename)
            file_id = uuid.uuid4().int
            filename = str(file_id) + '.' + ext
            abs_fpath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(abs_fpath)

            rel_path = os.path.join(os.path.basename(app.config['UPLOAD_FOLDER']), filename)

            video = Video(path=rel_path, ext=ext)
            db.session.add(video)
            db.session.commit()

            url = os.path.join('video', str(video.id))
            video.url = url
            db.session.commit()

            report = Report.query.filter_by(id=report_id).first()
            report.video_id = video.id
            db.session.commit()

            if report.report_type == 'hit':
                pipelines.hit(report, abs_fpath)
            elif report.report_type == 'witness':
                pipelines.witness(report, abs_fpath)

            return jsonify({'message': 'Successfully uploaded video.'})

    elif request.method == 'DELETE':
        report = Report.query.filter_by(id=report_id).first()
        db.session.delete(report)
        db.session.commit()
        return jsonify({
            'message': 'Successfully deleted.'
        })


@app.route('/api/profile/', methods=['GET', 'POST'], defaults={"profile_id": None})
@app.route('/api/profile/<profile_id>', methods=['GET'])
def profile(profile_id):
    if request.method == 'GET':
        if profile_id is None:
            license_plate = request.args.get('license_plate')

            print(license_plate)
            if license_plate is not None:
                profile_ = Profile.query.filter_by(license_plate=license_plate).first()
                profile_ = profile_.to_dict()
                return jsonify({
                    'data': profile_
                })
            else:
                profiles = Profile.query.all()
                profiles = [p.to_dict() for p in profiles]

                return jsonify({
                    'data': profiles
                })
        else:
            profiles = Profile.query.filter_by(id=profile_id).first()
            
            return jsonify({
                'data': profiles.to_dict()
            })


@app.route('/video/<video_id>')
def get_video(video_id):
    video = Video.query.filter_by(id=video_id).first()
    if video is None:
        return "ERROR NO video WITH ID {}".format(video_id), 404
    video_path = os.path.join(app.config['BASE_DIR'], video.path)
    
    try:
        return send_from_directory(os.path.dirname(video_path), filename=os.path.basename(video_path), as_attachment=True)
    except FileNotFoundError:
        abort(404)


@app.route('/image/<image_id>')
def get_image(image_id):
    image = Image.query.filter_by(id=image_id).first()
    if image is None:
        return "ERROR NO IMAGE WITH ID {}".format(image_id), 404
    image_path = os.path.join(app.config['BASE_DIR'], image.path)
    
    try:
        return send_from_directory(os.path.dirname(image_path), filename=os.path.basename(image_path), as_attachment=True)
    except FileNotFoundError:
        abort(404)


@app.route('/stream/<video_id>')
def stream_video(video_id):
    def video_generator(video_io):
        while True:
            frame = video_io.next_frame()
            if frame is None:
                break

            img = cv2.imencode('.jpg', frame)[1].tobytes()
            yield (b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' + img + b'\r\n')


    video = Video.query.filter_by(id=video_id).first()
    video_path = os.path.join(app.config['BASE_DIR'], video.path)

    video_io = VideoIO(video_path)
    return Response(video_generator(video_io),
                    mimetype='multipart/x-mixed-replace; boundary=frame')