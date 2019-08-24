import os
import uuid

from flask import jsonify, request

from api.app import app, db
from api import utils
from api.models import Report, Video


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
            report = Report.query.filter_by(id=report_id).first()

            return jsonify({
                'data': report.to_dict()
            })

    elif request.method == 'POST':
        data = request.json

        valid, missing = Report.validate_json(data)

        if not valid:
            return jsonify({
                'message': '{} not given in request.'.format(', '.join(missing))
            }), 422

        report = Report(data['user_id'],
                        data['timestamp'],
                        data['location']['longitude'],
                        data['location']['latitude'])
        db.session.add(report)
        db.session.commit()

        return jsonify({
            'message': 'Successfully created report.',
            'data': {
                'id': report.id
            }
        })

    elif request.method == 'PUT':
        if 'video' not in request.files:
            return jsonify({'message': 'Request does not have a file'}), 422
        
        file = request.files['video']
        
        if file.filename == '':
            return jsonify({'message': 'Request does not have a file'}), 422
        
        if file and utils.allowed_file(file.filename):
            ext = utils.get_ext(file.filename)
            filename = str(uuid.uuid4().int) + '.' + ext
            fpath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(fpath)

            video = Video(url=fpath)
            db.session.add(video)
            db.session.commit()

            report = Report.query.filter_by(id=report_id).first()
            report.video_id = video.id
            db.session.commit()

            return jsonify({'message': 'Successfully uploaded video.'})

    elif request.method == 'DELETE':
        report = Report.query.filter_by(id=report_id).first()
        db.session.delete(report)
        db.session.commit()
        return jsonify({
            'message': 'Successfully deleted.'
        })