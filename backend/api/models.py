from api.app import db


class Video(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String)


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