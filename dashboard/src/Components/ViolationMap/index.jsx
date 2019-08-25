import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

import "./map.css";

const GMAPSAPI = "AIzaSyDWr-o2geOZx5XESJBxJ2tsD9DTWjpKJwA";

const style = [
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "saturation": 36
            },
            {
                "color": "#000000"
            },
            {
                "lightness": 40
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#000000"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            },
            {
                "weight": 1.2
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 29
            },
            {
                "weight": 0.2
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 18
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 19
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            }
        ]
    }
]
// const style = [
//     {
//         "featureType": "water",
//         "elementType": "geometry",
//         "stylers": [
//             {
//                 "color": "#e9e9e9"
//             },
//             {
//                 "lightness": 17
//             }
//         ]
//     },
//     {
//         "featureType": "landscape",
//         "elementType": "geometry",
//         "stylers": [
//             {
//                 "color": "#f5f5f5"
//             },
//             {
//                 "lightness": 20
//             }
//         ]
//     },
//     {
//         "featureType": "road.highway",
//         "elementType": "geometry.fill",
//         "stylers": [
//             {
//                 "color": "#ffffff"
//             },
//             {
//                 "lightness": 17
//             }
//         ]
//     },
//     {
//         "featureType": "road.highway",
//         "elementType": "geometry.stroke",
//         "stylers": [
//             {
//                 "color": "#ffffff"
//             },
//             {
//                 "lightness": 29
//             },
//             {
//                 "weight": 0.2
//             }
//         ]
//     },
//     {
//         "featureType": "road.arterial",
//         "elementType": "geometry",
//         "stylers": [
//             {
//                 "color": "#ffffff"
//             },
//             {
//                 "lightness": 18
//             }
//         ]
//     },
//     {
//         "featureType": "road.local",
//         "elementType": "geometry",
//         "stylers": [
//             {
//                 "color": "#ffffff"
//             },
//             {
//                 "lightness": 16
//             }
//         ]
//     },
//     {
//         "featureType": "poi",
//         "elementType": "geometry",
//         "stylers": [
//             {
//                 "color": "#f5f5f5"
//             },
//             {
//                 "lightness": 21
//             }
//         ]
//     },
//     {
//         "featureType": "poi.park",
//         "elementType": "geometry",
//         "stylers": [
//             {
//                 "color": "#dedede"
//             },
//             {
//                 "lightness": 21
//             }
//         ]
//     },
//     {
//         "elementType": "labels.text.stroke",
//         "stylers": [
//             {
//                 "visibility": "on"
//             },
//             {
//                 "color": "#ffffff"
//             },
//             {
//                 "lightness": 16
//             }
//         ]
//     },
//     {
//         "elementType": "labels.text.fill",
//         "stylers": [
//             {
//                 "saturation": 36
//             },
//             {
//                 "color": "#333333"
//             },
//             {
//                 "lightness": 40
//             }
//         ]
//     },
//     {
//         "elementType": "labels.icon",
//         "stylers": [
//             {
//                 "visibility": "off"
//             }
//         ]
//     },
//     {
//         "featureType": "transit",
//         "elementType": "geometry",
//         "stylers": [
//             {
//                 "color": "#f2f2f2"
//             },
//             {
//                 "lightness": 19
//             }
//         ]
//     },
//     {
//         "featureType": "administrative",
//         "elementType": "geometry.fill",
//         "stylers": [
//             {
//                 "color": "#fefefe"
//             },
//             {
//                 "lightness": 20
//             }
//         ]
//     },
//     {
//         "featureType": "administrative",
//         "elementType": "geometry.stroke",
//         "stylers": [
//             {
//                 "color": "#fefefe"
//             },
//             {
//                 "lightness": 17
//             },
//             {
//                 "weight": 1.2
//             }
//         ]
//     }
// ]

const mapStyles = {
    width: '100%',
    height: '100%',
    disableDefaultUI: true,
}

export class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: 43.444,
            lng: -79.555,
            isLoading: true,
            selection: undefined,
            stores: [],
        }
    }

    componentDidMount = async () => {
        const coords = await this.getCurrentPosition();
        if (coords.latitude && coords.longitude) {
            this.setState({ lat: coords.latitude, lng: coords.longitude }, this.updateMarkers)
        } else {
            this.setState({ isLoading: false })
        }
    }

    updateMarkers = async () => {
        let locations
        if (this.props.selection.violations) {
            locations = Object.values(this.props.selection.violations)
        } else {
            locations = [this.props.selection]
            console.log(locations)
        }
        this.setState({ stores: locations, isLoading: false })
    }

    getCurrentPosition = () => {
        return new Promise((resolve, reject) =>
            navigator.geolocation ?
                navigator.geolocation.getCurrentPosition(({ coords }) => resolve(coords), (err) => reject(`Position not found. Error: ${Object.entries(err).join(" ")}`)) :
                reject("Device doesnt have position")
        )
    }

    componentDidUpdate = async (prevState) => {
        // console.log("prevProps", prevProps.selection, "curr", this.props.selection)
        if (!prevState.selection || prevState.selection !== this.props.selection) {
            this.updateMarkers()
        }
    }

    handleMarkerClick = (violation) => {
        if (violation.violationID && violation.evidence.length > 0) {
            window.location.href = `/violation/${this.props.selection.licensePlate}/${violation.violationID}`
        } else {
            console.log("violation", violation.location)
        }
    }


    displayMarkers = () => {
        console.log("displaying markers", this.state.selection);
        return this.state.stores.map((store, index) => {
            console.log("store", store)
            return <Marker key={index} id={index} position={{
                lat: store.location.lat,
                lng: store.location.lng
            }}
                onClick={() => this.handleMarkerClick(store)} />
        })
    }

    // displayCenter = () => {
    //     return <Marker id={"center"} position={{
    //         lat: this.state.lat,
    //         lng: this.state.lng
    //     }}
    //         onClick={() => console.log("You clicked me!")} />
    // }

    render = () => {
        console.log("center", this.props.center)
        if (this.state.isLoading) return <div className="cardLoading">Loading...</div>
        return (
            <Map
                className="map"
                google={this.props.google}
                zoom={12}
                style={mapStyles}
                styles={style}
                initialCenter={{ lat: this.state.lat, lng: this.state.lng }}
                disableDefaultUI={true}
                options={{
                    styles: style,
                    FullscreenControl: false,
                    panControl: false,
                    mapTypeControl: false,
                    scrollwheel: false,
                    streetViewControl: false,
                    disableDefaultUI: true,
                }}            >
                {this.displayMarkers()}
                {/* {this.displayCenter()} */}
            </Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: GMAPSAPI
})(MapContainer);;