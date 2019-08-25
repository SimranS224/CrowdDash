import React, { Component } from 'react';
import { Card } from 'react-bootstrap'
import Loading from '../../Components/Loading';
import MenuBar from "../../Components/MenuBar";
import ViolationMap from "../../Components/ViolationMap";
import Gallery from 'react-grid-gallery';// import RiskCalulations from "../../Components/RiskCalculations";
import { serverUrl } from "../../config";

import "./violation.css";

class ReportView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSignedIn: props.isSignedIn,
            isLoading: true,
            id: props.id,
            isSignUp: false,
            report: undefined
        }
    }

    componentDidMount = async () => {
        const endpoint = serverUrl + "/api/report/" + this.state.id
        console.log(endpoint)
        try {
            const response = await fetch(endpoint);
            const data = await response.json();
            console.log(response)
            this.setState({ report: data.data })
        } catch (err) {
            console.log("error", err)
        }
        // let vehicle;
        // let found = false;
        // profiles.profiles.forEach(profile => {
        //     if (profile.licensePlate === this.state.licensePlate) {
        //         found = true;
        //         vehicle = profile
        //     }
        // })
        // if (!found) this.setState({ selection: false, isLoading: false })
        // else {
        //     this.setState({ vehicle: vehicle })
        setTimeout(() => {
            this.setState({ isLoading: false })
        }, 1000)
    }

    render = () => {
        if (this.state.isLoading) return <Loading />
        console.log(this.state.report)
        const images = this.state.report.image_urls.map(link => ({
            src: serverUrl + "/" + link,
            thumbnail: serverUrl + "/" + link,
            thumbnailWidth: 320,
            thumbnailHeight: 180,
        }))
        return (
            <div className="fullscreen dashboardBG">
                {this.state.isLoading ? <Loading /> : null}
                {console.log('Report::::', this.state.report)}
                <MenuBar showSearch={false} setIsSignedIn={this.props.setIsSignedIn} title={"View Violation"} />
                <div className="cardRow" id="topRow">
                    <Card id="mapCard" className="text-center card">
                        <Card.Header className="cardHeader">Report Details</Card.Header>
                        <div className="violation">
                            <div className="violationInfoContainer">
                                <div className="infoBlock">
                                    <h2 className="field">Date:</h2>
                                    <h3 className="content">{new Date(1000 * this.state.report.timestamp).toUTCString()}</h3>
                                </div>
                            </div>
                            <div className="infoBlock">
                                <div className="infoBlock">
                                    <h2 className="field">Confidence Level:</h2>
                                    <h3 className="content">{this.state.report.probability ? this.state.report.probability : 90}%</h3>
                                </div>
                                <div className="infoBlock">
                                    <h2 className="field">Analysis:</h2>
                                    <h3 className="content">{this.state.report.analysis_complete ? "Completed" : "In Progress"}</h3>
                                </div>
                            </div>

                        </div>
                    </Card>

                    <Card id="mapCard" className="text-center card">
                        <Card.Header className="cardHeader">Report Locations</Card.Header>
                        <ViolationMap selection={this.state.report} className="mapCard" center={this.state.report.location} />
                    </Card>
                </div>
                <div className="cardRow" id="bottomRow">
                    <Card id="vehicleCard" className="text-center card">
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
            </div>
        )
    }
}

export default ReportView;