import random
import time

from api.app import db
from api.models import Report, Profile, Image

LAT = 43.655305
LNG = -79.402269

if __name__ == "__main__":
    for i in range(2):
        p = Profile()
        p.license_plate = ''.join([random.choice('ABCDEFGHIJKLMNOP1234567890') for i in range(8)])
        p.vehicle = ''.join(random.choice(['SUV', 'Sedan', 'Truck', 'Van']))

        for j in range(random.randint(2, 4)):
            r = Report(
                reporter_id=random.randint(0, 345245),
                report_type=random.choice(['hit', 'witness', 'red-light', 'collision']), 
                timestamp=1566682828+random.randint(-10000, 10000), 
                longitude=LNG+(random.random()), 
                latitude=LAT+(random.random()), 
                analysis_complete=False, 
                video_id=None
            )

            db.session.add(r)
            db.session.commit()

            p.reports.append(r)
       
        db.session.add(p)
        db.session.commit()