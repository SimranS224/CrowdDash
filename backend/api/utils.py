from api.app import app


def get_ext(filename):
    return filename.rsplit('.', 1)[1].lower()


def allowed_file(filename):
    return '.' in filename and \
           get_ext(filename) in app.config['ALLOWED_EXTENSIONS']
