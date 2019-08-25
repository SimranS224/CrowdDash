# InsureCam

# Backend
## Setup
```
$ cd backend
$ python3 -m venv pyenv
$ source pyenv/bin/activate
(pyenv) $ python -m pip install -r requirements
```

## Running
```
$ cd backend
$ source pyenv/bin/activate
(pyenv) $ ./run run # for running the flask server
(pyenv) $ ./run shell # for running the flask shell
```

## Database Setup
```
// in backend/
(pyenv) $ ./run db init
(pyenv) $ ./refresh_db.sh
```