import React, { Component } from 'react';
import { Table } from 'react-bootstrap';

import "./history.css";

const violationString = {
    "red-light": "Ran Red Light",
    "collision": "Collision"
}

export class History extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: 47.444,
            lng: -122.176,
            isLoading: true,
            selection: undefined,
            stores: [],
        }
    }

    componentDidMount = async () => {
        await this.updateMarkers()
        this.setState({ isLoading: false })
    }

    toDateString = (date) => {
        const d = new Date(date * 1000)
        return d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear();
    }

    updateMarkers = async () => {
        const violations = Object.values(this.props.selection.violations)
        console.log("viols", violations)
        this.setState({ violations: violations, isLoading: false })
    }

    componentDidUpdate = async (prevState) => {
        // console.log("prevProps", prevProps.selection, "curr", this.props.selection)
        if (!prevState.selection || prevState.selection !== this.props.selection) {
            this.updateMarkers()
        }
    }

    render = () => {
        if (this.state.isLoading) return <div className="cardLoading">Loading...</div>
        return (
            <Table responsive id="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Violation Type</th>
                        <th>Date</th>
                        <th>Probability</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.violations.map((violation, i) => {
                        return <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{violationString[violation.type]}</td>
                            <td>{this.toDateString(violation.timestamp)}</td>
                            <td>{violation.probability}%</td>
                        </tr>

                    })}
                </tbody>
            </Table>
        );
    }
}

export default History;