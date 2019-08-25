import os

import boto3
import cv2


class RekognitionService():
    def __init__(self):
        self.client = boto3.client(
            'rekognition', 
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name=os.getenv('AWS_REGION_NAME')
        )

    def get_labels(self, frame):
        frame_bytes = cv2.imencode('.jpg', frame)[1].tobytes()
        response = self.client.detect_labels(Image={'Bytes': frame_bytes})
        return response['Labels']
    
    def get_text(self, img):
        img_bytes = cv2.imencode('.jpg', cv2.cvtColor(img, cv2.COLOR_BGR2RGB))[1].tobytes()
        response = self.client.detect_text(Image={'Bytes': img_bytes})
        return response['TextDetections']