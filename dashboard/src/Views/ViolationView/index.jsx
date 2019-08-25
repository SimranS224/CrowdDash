import React, { Component } from 'react';
import Modal from 'react-modal';
import { Card } from 'react-bootstrap'
import Loading from '../../Components/Loading';
import MenuBar from "../../Components/MenuBar";
import ViolationMap from "../../Components/ViolationMap";
import Gallery from 'react-grid-gallery';// import RiskCalulations from "../../Components/RiskCalculations";
// import { serverUrl } from "../../config";

import "./violation.css";

const violationString = {
    "red-light": "Ran Red Light",
    "collision": "Collision"
}

class ViolationView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSignedIn: props.isSignedIn,
            isLoading: true,
            licensePlate: props.params.licensePlate,
            violationID: props.params.violationID,
            isSignUp: false,
            profiles: undefined,
        }
    }

    componentDidMount = async () => {
        const profiles = await require("../../generatedData");
        let vehicle;
        let found = false;
        profiles.profiles.forEach(profile => {
            if (profile.licensePlate === this.state.licensePlate) {
                found = true;
                vehicle = profile
            }
        })
        if (!found) this.setState({ selection: false, isLoading: false })
        else {
            this.setState({ vehicle: vehicle })
            setTimeout(() => {
                this.setState({ isLoading: false })
            }, 1000)
        }
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

    render = () => {
        if (this.state.isLoading) return <Loading />
        console.log(this.state)
        const selection = { ...this.state.vehicle }
        selection.violations = [...selection.violations.slice(0, 1)]
        const violation = selection.violations[0]
        const images = violation.evidence.map(link => ({
            src: link,
            thumbnail: link,
            thumbnailWidth: 320,
            thumbnailHeight: 180,
        }))
        return (
            <div className="fullscreen dashboardBG">
                {this.state.isLoading ? <Loading /> : null}
                <MenuBar showSearch={false} setIsSignedIn={this.props.setIsSignedIn} title={"View Violation"} />
                <div className="cardRow" id="topRow">
                    <Card id="mapCard" onClick={() => this.openModal("map")} className="text-center card">
                        <Card.Header className="cardHeader">Violation Details</Card.Header>
                        <div className="violation">
                            <div className="violationInfoContainer">
                                <div className="infoBlock">
                                    <h2 className="field">License Plate:</h2>
                                    <h3 className="content">{selection.licensePlate}</h3>
                                </div>
                                <div className="infoBlock">
                                    <h2 className="field">Date:</h2>
                                    <h3 className="content">{new Date(1000 * violation.timestamp).toUTCString()}</h3>
                                </div>
                            </div>
                            <div className="infoBlock">
                                <div className="infoBlock">
                                    <h2 className="field">Confidence Level:</h2>
                                    <h3 className="content">{violation.probability}%</h3>
                                </div>
                                <div className="infoBlock">
                                    <h2 className="field">Type of Violation:</h2>
                                    <h3 className="content">{violationString[violation.type]}</h3>
                                </div>
                            </div>

                        </div>
                    </Card>

                    <Card id="mapCard" onClick={() => this.openModal("map")} className="text-center card">
                        <Card.Header className="cardHeader">Violation Locations</Card.Header>
                        <ViolationMap selection={selection} className="mapCard" center={violation.location} />
                    </Card>
                </div>
                <div className="cardRow" id="bottomRow">
                    <Card id="vehicleCard" onClick={() => this.openModal("map")} className="text-center card">
                        <Card.Header className="cardHeader">Evidence Set</Card.Header>
                        <div className="fullscreen imageGalleryContainer">
                            <Gallery
                                images={images}
                                className="imageGallery"
                                lightboxWidth={1500}
                                onSelectImage={_ => true}
                                onClick={_ => true}
                                onTouchEnd={_ => true}
                                enableImageSelection={false}
                            />
                        </div>
                    </Card>
                </div>

                {/* <div className="cardRow">
                    <Card id="historyCard" onClick={() => this.openModal("history")} className="text-center card">
                        <Card.Header className="cardHeader">Logged Violations</Card.Header>
                        <ViolationHistory selection={this.state.selection} className="historyCard" />
                    </Card>

                    <Card id="mapCard" onClick={() => this.openModal("map")} className="text-center card">
                        <Card.Header className="cardHeader">Violation Locations</Card.Header>
                        <ViolationMap selection={this.state.selection} className="mapCard" />
                    </Card>
                </div> */}
                {this.createModal()}
            </div>
        )
    }
}

export default ViolationView;