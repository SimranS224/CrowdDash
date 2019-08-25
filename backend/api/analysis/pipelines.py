import cv2

from api.app import db
from api.io import VideoIO
from api.analysis import detection, color
from api.models import Image


def hit(report, video_path):
    print('Getting detections...')
    frame_detections = detection.get_frame_detections(video_path)
    
    print('Finding nested detections...')
    # Get a list of nested detection pairs by bounding box
    # pairs = detection.find_nested_detections(frame_detections)
    
    print('Finding target...')
    # The largest area is probably the car that hit us
    target = sorted(frame_detections, key=lambda x: x[0].area, reverse=True)[0]

    # Extract info from the target
    car_det = target[0]
    # license_det = target[1]

    print('Saving images...')
    # Save images
    car_img = Image.from_arr(car_det.img, report.id)
    # license_img = Image.from_arr(license_det.img, report.id)
    vid = VideoIO(video_path)
    frame = cv2.cvtColor(vid.get_frame(vid.length-1), cv2.COLOR_BGR2RGB)
    accident_img = Image.from_arr(frame, report.id)

    print('Adding images to report...')
    # Add images to the report
    report.images.append(car_img)
    # report.images.append(license_img)
    report.images.append(accident_img)
    db.session.commit()

    print('Completed hit analysis...')
    report.analysis_complete = True
    report.car_color = color.rgb_to_hex(*color.dominant_color(car_det.img))
    db.session.commit()

    return True


def witness(video_path):
    frame_detections = detections.get_frame_detections(video_path)

    colliders = sorted(frame_detections[-1], key=lambda x: x.area, reverse=True)[:2]
    