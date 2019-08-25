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

    handleMarkerClick = (violation) => {
        if (violation.violationID && violation.evidence.length > 0) {
            window.location.href = `/violation/${this.props.selection.licensePlate}/${violation.violationID}`
        } else {
            console.log("violation", violation.location)
        }
    }

    render = () => {
        if (this.state.isLoading) return <div className="cardLoading">Loading...</div>
        return (
            <Table responsive id="table">
                <thead className="headerRow">
                    <tr>
                        <th className="tableheader">#</th>
                        <th className="tableheader">Violation Type</th>
                        <th className="tableheader">Date</th>
                        <th className="tableheader">Confidence of Occurence</th>
                    </tr>
                </thead>
                <tbody className="tableBody">
                    {this.state.violations.map((violation, i) => {
                        return (
                            <tr key={i} className="linkToViolation" onClick={() => this.handleMarkerClick(violation)}>
                                <td className="tabletext">{i + 1}</td>
                                <td className="tabletext">{violationString[violation.type]}</td>
                                <td className="tabletext">{this.toDateString(violation.timestamp)}</td>
                                <td className="tabletext">{violation.probability}%</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        );
    }
}

export default History;