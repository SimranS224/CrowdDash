def to_abs(bounding_box, w, h):
    top = bounding_box['Top']
    left = bounding_box['Left']
    width = bounding_box['Width']
    height = bounding_box['Height']

    top *= h
    left *= w
    width *= w
    height *= h

    return {
        'top': int(top),
        'left': int(left),
        'width': int(width),
        'height': int(height)
    }


def to_rect(bbox):
    top_left = (bbox['left'], bbox['top'])
    bottom_right = (bbox['left'] + bbox['width'], bbox['top'] + bbox['height'])

    return (top_left, bottom_right)


def get_surrounding_box(bbox1, bbox2):
    left = min(bbox1[0], bbox2[0])
    top = min(bbox1[1], bbox2[1])
    right = max(bbox1[0]+bbox1[2], bbox2[0]+bbox2[2])
    bottom = max(bbox1[1]+bbox1[3], bbox2[1]+bbox2[3])
    return (left, top, right-left, bottom-top)