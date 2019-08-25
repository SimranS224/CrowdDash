import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Modal from 'react-modal';
import { Card } from 'react-bootstrap'
import Loading from '../../Components/Loading';
import MenuBar from "../../Components/MenuBar";
import ViolationMap from "../../Components/ViolationMap";
import ViolationHistory from "../../Components/ViolationHistory";
import VehicleInfo from "../../Components/VehicleInfo";
import Logo from "../../Assets/CrowdDashLogoCropped.png";

// import RiskCalulations from "../../Components/RiskCalculations";
// import { serverUrl } from "../../config";

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
            selection: undefined,
        }
    }

    componentDidMount = async () => {
        const profiles = await require("../../generatedData");
        this.setState({ profiles: profiles.profiles })
        setTimeout(() => {
            this.setState({ isLoading: false })
        }, 1000)
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

        if (!found) this.setState({selection: false})
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

    render = () => {
        if (!this.props.isSignedIn) {
            return <Redirect to="/login" />
        } else if (this.state.selection) {
            console.log("props in insurance", this.props)
            return (
                <div className="fullscreen dashboardBG">
                    {this.state.isLoading ? <Loading /> : null}
                    <MenuBar searchFor={this.searchFor} setIsSignedIn={this.props.setIsSignedIn}/>
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
                    <MenuBar searchFor={this.searchFor} />
                    <div className="noSearches">
                        <img src={Logo} alt="CrowdDash" className="logo" />
                        <h1 className="noSearchText">{this.state.selection === false ? "No Logs found for that license plate" : "Search for a License Plate to See Logs"}</h1>
                    </div>
                </div>
            )

        }
    }
}

export default InsuranceView;