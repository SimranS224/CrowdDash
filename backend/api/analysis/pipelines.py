import cv2

from api.app import db
from api.io import VideoIO
from api.analysis import detection, color, utils
from api.models import Image


def hit(report, video_path):
    print('Getting detections...')
    frame_detections, last_frame = detection.get_frame_detections(video_path)
    
    print('Finding nested detections...')
    # Get a list of nested detection pairs by bounding box
    # pairs = detection.find_nested_detections(frame_detections)

    print(len(frame_detections))
    
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
    accident_img = Image.from_arr(last_frame, report.id)

    print('Adding images to report...')
    # Add images to the report
    report.images.append(car_img)
    # report.images.append(license_img)
    report.images.append(accident_img)
    db.session.commit()

    print('Reporting analysis...')
    report.analysis_complete = True
    report.car_color = color.rgb_to_hex(*color.dominant_color(car_det.img))
    db.session.commit()
    
    print('Completed analysis...')

    return True


def witness(report, video_path):
    print('Getting detections...')
    frame_detections, last_frame = detection.get_frame_detections(video_path)

    print('Getting colliders...')
    colliders = sorted(frame_detections[-1], key=lambda x: x.area, reverse=True)[:2]
    
    print('Getting surrounding bbox...')
    surr_bbox = utils.get_surrounding_box(colliders[0].bbox, colliders[1].bbox)
    surr_crop = last_frame[surr_bbox[1]:surr_bbox[1]+surr_bbox[3], surr_bbox[0]:surr_bbox[0]+surr_bbox[2], :]

    print('Saving images...')
    car1_img = Image.from_arr(colliders[0].img, report.id)
    car2_img = Image.from_arr(colliders[1].img, report.id)
    accident_img = Image.from_arr(last_frame, report.id)
    surr_img = Image.from_arr(surr_crop, report.id)

    report.images.append(car1_img)
    report.images.append(car2_img)
    report.images.append(accident_img)
    report.images.append(surr_img)

    report.analysis_complete = True
    report.car_color = "{},{}".format(color.rgb_to_hex(*color.dominant_color(colliders[0].img)), color.rgb_to_hex(*color.dominant_color(colliders[1].img)))
    db.session.commit()
    print('Completed analysis...')
    return True