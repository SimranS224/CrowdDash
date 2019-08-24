import os
import uuid

from flask import jsonify, request

from api.app import app
from api import utils


@app.route('/api/report/', methods=['GET', 'POST'], defaults={'report_id': None})
@app.route('/api/report/<int:report_id>', methods=['GET', 'PUT'])
def report(report_id):
    if request.method == 'GET':
        return 'GET'
    
    elif request.method == 'POST':
        data = request.json
        return jsonify(data)

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

            return fpath

    elif request.method == 'DELETE':
        return 'DELETE'