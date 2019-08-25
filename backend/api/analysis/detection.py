import cv2
import ffmpeg

from api.analysis import utils
from api.io import VideoIO
from api.analysis.rekognition import RekognitionService


SELECTED_LABELS = ['car', 'license plate']
DETECT_INTERVAL = 30


class Detection():
    def __init__(self, cls, bbox, img):
        self.cls = cls
        self.bbox = bbox
        self.img = img
        self.area = bbox[2] * bbox[3]
    
    def is_inside(self, bbox):
        # (x,y,w,h)
        if self.bbox[0] >= bbox[0]:
            return False
        
        if self.bbox[1] >= bbox[1]:
            return False
        
        if self.bbox[0]+self.bbox[2] <= bbox[0]+bbox[2]:
            return False
        
        if self.bbox[1]+self.bbox[3] <= bbox[1]+bbox[3]:
            return False
        
        return True


def get_frame_detections(video_path, detect_interval=DETECT_INTERVAL):
    def check_rotation(path_video_file):
        # this returns meta-data of the video file in form of a dictionary
        meta_dict = ffmpeg.probe(path_video_file)

        # from the dictionary, meta_dict['streams'][0]['tags']['rotate'] is the key
        # we are looking for
        rotateCode = None
        if int(meta_dict['streams'][0]['tags']['rotate']) == 90:
            rotateCode = cv2.ROTATE_90_CLOCKWISE
        elif int(meta_dict['streams'][0]['tags']['rotate']) == 180:
            rotateCode = cv2.ROTATE_180
        elif int(meta_dict['streams'][0]['tags']['rotate']) == 270:
            rotateCode = cv2.ROTATE_90_COUNTERCLOCKWISE

        return rotateCode

    # rotate_code = check_rotation(video_path)

    # Load video
    vid = VideoIO(video_path)
    # Init Rekognition service
    rekog = RekognitionService()

    # Init loop vars
    frame_detections = []
    frame_count = 0
    h, w = None, None
    while(True):
        # Get next frame
        next_frame = vid.next_frame()
        # Break when the video is over
        if next_frame is None:
            break
        frame = next_frame
        if h is None or w is None:
            h, w = frame.shape[:2]
        
        # if rotate_code is not None:
        #     frame = cv2.rotate(frame, rotate_code)

        # Convert from BGR to RGB
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Every `detect_interval` frames, send frame to AWS Rekognition
        if frame_count % detect_interval == 0:
            # Get labels from rekognition
            labels = rekog.get_labels(frame)
            
            # Add list to frame_detections            
            frame_detections.append([])
            for label in labels:
                # Check the detection is in the `SELECTED_LABELS`
                name = label['Name'].lower()
                if name in SELECTED_LABELS:
                    for instance in label['Instances']:
                        # Parse Rekognition result
                        bbox = instance.get('BoundingBox')
                        # conf = instance.get('Confidence')

                        # Convert rel bbox to absolute bbox
                        bbox = utils.to_abs(bbox, w, h)
                        bbox = (bbox['left'], bbox['top'], bbox['width'], bbox['height'])
                        
                        crop = frame[bbox[1]:bbox[1]+bbox[3], bbox[0]:bbox[0]+bbox[2], :]
                        
                        det = Detection(name, bbox, crop)
                        frame_detections[-1].append(det)
        
        # Increment frame count
        frame_count += 1
        # print(frame_count)

    # Close video
    vid.close()

    return frame_detections, frame


def find_nested_detections(frame_detections):
    pairs = []
    for dets in frame_detections:
        for i, _ in enumerate(dets):
            for j, _ in enumerate(dets[i+1:]):
                print(dets[i].cls, dets[j].cls)
                if dets[i].cls == 'car' and dets[j].cls == 'license plate':
                    if dets[i].is_inside(dets[j].bbox):
                        pairs.append((dets[i], dets[j]))
    return pairs