import React, { Component } from 'react';
import Modal from 'react-modal';
import { Card } from 'react-bootstrap'
import { Table } from 'react-bootstrap';
import Loading from '../../Components/Loading';
import MenuBar from "../../Components/MenuBar";
import ViolationMap from "../../Components/ViolationMap";
import ViolationHistory from "../../Components/ViolationHistory";
import VehicleInfo from "../../Components/VehicleInfo";
import axios from "axios";

import { serverUrl } from "../../config";

import "./insurance.css";

class InsuranceView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSignedIn: props.isSignedIn,
            isLoading: true,
            licensePlate: undefined,
            modal: {
                open: false,
                component: undefined,
            },
            isSignUp: false,
            violations: undefined,
            profiles: undefined,
            reports: [],
            selection: undefined,
        }
    }

    componentDidMount = async () => {
        const endpoint = serverUrl + "/api/report/"
        console.log(endpoint)
        try {
            const response = await fetch(endpoint);
            const data = await response.json();
            console.log(data)
            this.setState({ reports: data.data })
        } catch (err) {
            this.handleError(err)
        }
        const profiles = await require("../../generatedData");
        this.setState({ profiles: profiles.profiles })
        setTimeout(() => {
            this.setState({ isLoading: false })
        }, 100)
    }

    handleError = (err) => {
        console.log("Error", err)
    }

    searchFor = (searchString) => {
        console.log("searchfor", searchString)
        let found = false
        this.state.profiles.forEach(profile => {
            if (profile.licensePlate === searchString) {
                found = true;
                this.setState({ selection: profile })
            }
        })

        if (!found) this.setState({ selection: false })
    }

    createModal = () => {
        return (
            <Modal>
                this.state.openComponent
            </Modal>
        )
    }

    openModal = (type) => {
        return true;
    }

    handleMarkerClick = (report) => {
        window.location.href = `/report/${report.id}`
    }

    render = () => {
        if (this.state.isLoading) return <Loading />
        if (this.state.selection) {
            console.log("props in insurance", this.props)
            return (
                <div className="fullscreen dashboardBG">
                    {this.state.isLoading ? <Loading /> : null}
                    <MenuBar showSearch={true} searchFor={this.searchFor} setIsSignedIn={this.props.setIsSignedIn} title={"Search By License Plate"} />
                    <div className="cardRow">
                        <Card id="vehicleCard" onClick={() => this.openModal("history")} className="text-center card">
                            <Card.Header className="cardHeader">Vehicle Information</Card.Header>
                            <VehicleInfo selection={this.state.selection} className="informationCard" />
                        </Card>
                    </div>

                    <div className="cardRow">
                        <Card id="historyCard" onClick={() => this.openModal("history")} className="text-center card">
                            <Card.Header className="cardHeader">Logged Violations</Card.Header>
                            <ViolationHistory selection={this.state.selection} className="historyCard" />
                        </Card>

                        <Card id="mapCard" onClick={() => this.openModal("map")} className="text-center card">
                            <Card.Header className="cardHeader">Violation Locations</Card.Header>
                            <ViolationMap selection={this.state.selection} className="mapCard" />
                        </Card>
                    </div>
                    {this.createModal()}
                </div>
            )
        } else {
            return (
                <div className="fullscreen dashboardBG">
                    {this.state.isLoading ? <Loading /> : null}
                    <MenuBar showSearch={true} searchFor={this.searchFor} setIsSignedIn={this.props.setIsSignedIn} title={"Search By License Plate"} />
                    <h2 className="noSearchText">Open Reports</h2>
                    <div className="reportsWrapper">
                        <Table responsive id="table">
                            <thead className="headerRow">
                                <tr>
                                    <th className="tableheader">#</th>
                                    <th className="tableheader">Report ID</th>
                                    <th className="tableheader">Analysis Status</th>
                                    <th className="tableheader">Date</th>
                                </tr>
                            </thead>
                            <tbody className="tableBody">
                                {this.state.reports.map((report, i) => {
                                    return (
                                        <tr key={i} className="linkToViolation" onClick={() => this.handleMarkerClick(report)}>
                                            <td className="tabletext">{i + 1}</td>
                                            <td className="tabletext">{report.id}</td>
                                            <td className="tabletext">{report.analysis_complete ? "Complete" : "In Progress"}</td>
                                            <td className="tabletext">{new Date(1000 * Number(report.timestamp)).toUTCString()}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>

                    </div>
                </div>
            );
        }
        // else {
        //     return (
        //         <div className="fullscreen dashboardBG">
        //             {this.state.isLoading ? <Loading /> : null}
        //             <MenuBar showSearch={true} searchFor={this.searchFor} setIsSignedIn={this.props.setIsSignedIn} title={"Search By License Plate"} />
        //             <div className="noSearches">
        //                 <img src={Logo} alt="CrowdDash" className="logo" />
        //                 <h1 className="noSearchText">{"No Logs found for that license plate"}</h1>
        //             </div>
        //         </div>
        //     )
        // }
    }
}

export default InsuranceView;