import cv2
import imageio


class VideoIO():
    """
    Class for handling cv2 videos.

    Attributes:
    cap -- cv2.VideoCapture object
    """

    def __init__(self, fpath):
        """
        Initialize cv2Video from video file path.

        Attribute:
        fpath - file path to video
        """
        self._fpath = fpath

        self._load_video(fpath)

    def __len__(self):
        return self.length

    def _load_video(self, fpath):
        self.cap = cv2.VideoCapture(fpath)

    @property
    def length(self):
        """Video length in frames."""
        return int(self.cap.get(cv2.CAP_PROP_FRAME_COUNT))

    @property
    def fps(self):
        """Video fps."""
        return int(self.cap.get(cv2.CAP_PROP_FPS))

    def next_frame(self):
        """Get the next frame of video."""
        frame = None
        if self.cap.isOpened():
            ret, frame = self.cap.read()
            if not ret:
                return None
        else:
            return None
        return frame

    def save(self, fpath):
        """Save video to `fpath`."""
        imageio.mimsave(fpath, self.clip(0, -1).frames, fps=self.fps)

    def show(self, window_name="window"):
        """Play the video in a window named `window_name`."""
        cv2.namedWindow(window_name)

        while self.cap.isOpened():
            frame = self.next_frame()

            cv2.imshow(window_name, frame)

            k = cv2.waitKey(1) & 0xFF
            if k == ord('q'):
                break

        cv2.destroyWindow(window_name)

    def close(self):
        """Close video."""
        self.cap.release()
    
    def get_frame(self, frame_num):
        """Returns frame at `idx` or None if frame does not exist."""
        if frame_num >= 0 and frame_num <= self.length:
            self.cap.set(cv2.CAP_PROP_POS_FRAMES, frame_num)
        else:
            return None
        
        frame = self.next_frame()
        return frame