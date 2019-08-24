import os
import uuid

import cv2
from flask import jsonify, request, Response, send_from_directory, abort

from api.app import app, db
from api import utils
from api.models import Report, Video
from api.io import VideoIO

import boto3
import PIL
from PIL import Image


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

            return jsonify({'message': 'Successfully uploaded video.'})

    elif request.method == 'DELETE':
        report = Report.query.filter_by(id=report_id).first()
        db.session.delete(report)
        db.session.commit()
        return jsonify({
            'message': 'Successfully deleted.'
        })


@app.route('/video/<video_id>')
def get_video(video_id):
    video = Video.query.filter_by(id=video_id).first()
    video_path = os.path.join(app.config['BASE_DIR'], video.path)
    
    try:
        return send_from_directory(os.path.dirname(video_path), filename=os.path.basename(video_path), as_attachment=True)
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

@app.route('/aws/recog/', methods=['POST'])
def send_photo_to_aws():
    print("here")
    bucket='bucket'
    # photo= 'photo'
    imageFile= './api/plate.png'
    client=boto3.client('rekognition')
   
    with open(imageFile, 'rb') as image:
        response = client.detect_text(Image={'Bytes': image.read()})
        
    print('Detected labels in ' + imageFile)    
    textDetections=response['TextDetections']
    print ('Detected text')
    for text in textDetections:
            print ('Detected text:' + text['DetectedText'])
            print ('Confidence: ' + "{:.2f}".format(text['Confidence']) + "%")
            print ('Id: {}'.format(text['Id']))
            if 'ParentId' in text:
                print ('Parent Id: {}'.format(text['ParentId']))
            print ('Type:' + text['Type'])


    # for label in response['Labels']:
    #     print (label['Name'] + ' : ' + str(label['Confidence']))

    # print('Done...')

    # client=boto3.client('rekognition')
    # response=client.detect_text(Image={'S3Object':{'Bucket':bucket,'Name':photo}})
                        
    # textDetections=response['TextDetections']
    # print ('Detected text')
    # for text in textDetections:
    #         print ('Detected text:' + text['DetectedText'])
    #         print ('Confidence: ' + "{:.2f}".format(text['Confidence']) + "%")
    #         print ('Id: {}'.format(text['Id']))
    #         if 'ParentId' in text:
    #             print ('Parent Id: {}'.format(text['ParentId']))
    #         print ('Type:' + text['Type'])
    #         print