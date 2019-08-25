import React, { Component } from 'react';

import "./history.css";

const vehicleToString = {
    "SUV": "SUV",
    "car": "Sedan"
}

export class VehicleInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: 47.444,
            lng: -122.176,
            isLoading: true,
            selection: undefined,
            stores: [],
        }

        console.log("constructed")
    }

    componentDidMount = async () => {
        this.setState({ isLoading: false })
    }

    getLatestDate = () => {
        const violations = this.props.selection.violations
        const latest = violations.reduce((d, acc) => {
            console.log(d, acc)
            return Number(acc.timestamp) >= Number(d.timestamp) ? acc : d
        })
        return this.toDateString(latest.timestamp)
    }

    toDateString = (date) => {
        const d = new Date(date * 1000)
        console.log(d.toISOString())
        return d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear();
    }

    render = () => {
        if (this.state.isLoading) return <div className="cardLoading">Loading...</div>
        return (
            <div id="container">
                <div className="infoBlock">
                    <h2 className="field">Vehicle:</h2>
                    <h2 className="content">{vehicleToString[this.props.selection.vehicle]}</h2>
                </div>
                <div className="infoBlock">
                    <h2 className="field">License Plate:</h2>
                    <h2 className="content">{this.props.selection.licensePlate}</h2>
                </div>
                <div className="infoBlock">
                    <h2 className="field">Number Of Violation:</h2>
                    <h2 className="content">{this.props.selection.numViolations}</h2>
                </div>
                <div className="infoBlock">
                    <h2 className="field">Most Recent Violation:</h2>
                    <h2 className="content">{this.getLatestDate()}</h2>
                </div>
            </div>
        );
    }
}

export default VehicleInfo;