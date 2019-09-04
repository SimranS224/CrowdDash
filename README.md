# InsureCam

CrowdDash is making communities safer by giving drivers the ability to instantly report dangerous behavior – and therefore increasing accountability of all those sharing the road

# Inspiration
We were inspired to create a solution to help increase safety in communities through applying machine learning to create an IoT solution.

# What it does
Traditionally people use dash-cams to help them when dealing with incidents on their drive. Our solution aims to create a network of data based on car type, license plate and driving style to help increase awareness for drivers. The users would use the app and mount their phone to their dash whenever they start their journey similar to a dash-cam. Upon the users detection of a crash they can speak to our app and say "hey CrowdDash I just witnessed a crash" and it will send the video to our cloud service which will use AWS Rekognition as well as our custom object detection service to help determine the type of accident, the likelihood of it being a particular vehicle involved and further details regarding the type of collision. This information can be used by the insurance company to help them assess what type of insurance someone should be eligible as well as risk.

# How we built it
We used an android app to create the app for the user, which was designed in adobe xd. We then used a multipart request to send video to our backend which is hosted on AWS, the backend then calls our ml service which uses AWS Rekognition, Kernelized Correlation Filter tracking, bounding box operations to recognize the car at fault, and the color of the car as well as a crop of the car is saved to Sqlalchemy. We then synthesize this data into a format that an insurance provider can query by a license plate to get details about a user of their insurance on a React front end hosted on an AWS EC2 instance. Additionally we incentive users by giving them a good citizen score similar to how Waze incentivizes users.

# Challenges we ran into
A large challenge we ran into was sending large video and segmenting it based on user audio input.

# Accomplishments that we're proud of
Adding voice commands to reduce distractions for a driver.

# Built With
amazon-web-services | rekognition | flask | react | java | android-studio | sqlalchemy | opencv | azure

# Contributers 
* [Jason Chin](https://github.com/jrobchin)
* [Kshitij Shah](https://github.com/KshitijShah-GitHub)
* [Nicolae Strincea](https://github.com/nicolae-stroncea)
* [Simran Singh](https://github.com/SimranS224)
    
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
