import os
import uuid

import cv2
import numpy as np

from api.app import app, db


class Video(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    path = db.Column(db.String)
    url = db.Column(db.String)
    ext = db.Column(db.String)

    @property
    def filename(self):
        return "{}.{}".format(self.id, self.ext)


class Image(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    path = db.Column(db.String)
    url = db.Column(db.String)
    ext = db.Column(db.String)
    report_id = db.Column(db.Integer, db.ForeignKey('report.id'), nullable=False)

    @classmethod
    def from_arr(cls, arr, report_id):
        arr = cv2.cvtColor(arr, cv2.COLOR_RGB2BGR)

        image = cls(report_id=report_id)
        db.session.add(image)
        db.session.commit()

        ext = '.jpg'
        file_id = uuid.uuid4().int
        filename = str(file_id) + '.' + ext

        abs_fpath = os.path.join(app.config['MEDIA_FOLDER'], filename)
        cv2.imwrite(abs_fpath, arr)

        rel_path = os.path.join(os.path.basename(app.config['MEDIA_FOLDER']), filename)
        url = os.path.join('image', str(image.id))
        
        image.path = rel_path
        image.url = url
        image.ext = ext
        db.session.commit()

        return image


class Report(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    reporter_id = db.Column(db.Integer)
    timestamp = db.Column(db.Integer)
    longitude = db.Column(db.Float)
    latitude = db.Column(db.Float)
    report_type = db.Column(db.String)
    description = db.Column(db.String)
    video_id = db.Column(db.Integer, db.ForeignKey('video.id'))
    video = db.relationship('Video', backref='report', uselist=False)
    images = db.relationship('Image', backref='report')
    analysis_complete = db.Column(db.Boolean, default=False)

    def __init__(self, reporter_id, report_type, timestamp, 
                 longitude, latitude, analysis_complete=False, video_id=None):
        self.reporter_id = reporter_id
        self.report_type = report_type
        self.timestamp = timestamp
        self.longitude = longitude
        self.latitude = latitude
        self.analysis_complete = analysis_complete
        self.video_id = video_id

    @staticmethod
    def validate_json(data):
        missing = []
        if 'user_id' not in data:
            missing.append('user_id')
        if 'timestamp' not in data:
            missing.append('timestamp')
        if 'report_type' not in data:
            missing.append('report_type')
        if 'location' not in data:
            missing.append('location')
        if 'longitude' not in data.get('location'):
            missing.append('longitude')
        if 'latitude' not in data.get('location'):
            missing.append('latitude')
        
        if len(missing):
            return False, missing
        else:
            return True, None

    def to_dict(self):
        obj = {}

        obj['reporter_id'] = self.reporter_id
        obj['timestamp'] = self.timestamp
        obj['location'] = {
            'longitude': self.longitude,
            'latitude': self.latitude
        }
        obj['video_url'] = self.video.url if self.video is not None else ''
        obj['image_urls'] = [image.url for image in self.images]
        obj['analysis_complete'] = self.analysis_complete

        return obj