from api.app import db


class Video(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    path = db.Column(db.String)
    url = db.Column(db.String)
    ext = db.Column(db.String)

    @property
    def filename(self):
        return "{}.{}".format(self.id, self.ext)


class Report(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    reporter_id = db.Column(db.Integer)
    timestamp = db.Column(db.Integer)
    longitude = db.Column(db.Float)
    latitude = db.Column(db.Float)
    video_id = db.Column(db.Integer, db.ForeignKey('video.id'))
    video = db.relationship('Video', backref='report', uselist=False)

    def __init__(self, reporter_id, timestamp, 
                 longitude, latitude, video_id=None):
        self.reporter_id = reporter_id
        self.timestamp = timestamp
        self.longitude = longitude
        self.latitude = latitude
        self.video_id = video_id

    @staticmethod
    def validate_json(data):
        missing = []
        if 'user_id' not in data:
            missing.append('user_id')
        if 'timestamp' not in data:
            missing.append('timestamp')
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
        obj['video_url'] = self.video.url

        return obj