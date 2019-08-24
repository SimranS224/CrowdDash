import os
import uuid

from flask import jsonify, request

from api.app import app, db
from api import utils
from api.models import Report, Video


@app.route('/api/report/', methods=['GET', 'POST'], defaults={'report_id': None})
@app.route('/api/report/<int:report_id>', methods=['GET', 'PUT'])
def report(report_id):
    if request.method == 'GET':
        return 'GET'
    
    elif request.method == 'POST':
        data = request.json

        if 'user_id' not in data:
            return 'No user_id given.'
        if 'timestamp' not in data:
            return 'No timestamp given.'
        if 'location' not in data:
            return 'No location given.'
        
        user_id = data['user_id']
        timestamp = data['timestamp']
        location = data['location']

        if 'longitude' not in location:
            return 'No longitude given.'
        if 'latitude' not in location:
            return 'No latitude given.'

        report = Report(user_id,
                        timestamp,
                        location['longitude'],
                        location['latitude'])
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
            return jsonify({'message': 'Request does not have a file'}), 400
        
        file = request.files['video']
        
        if file.filename == '':
            return jsonify({'message': 'Request does not have a file'}), 400
        
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
        return 'DELETE'