import React, { Component } from 'react';
import Particles from "react-particles-js";
import params from "../../Assets/particles.json";

import "./loading.css";

params.particles.size.value = 6
class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opacity: 1
        }
    }
    compnentWillUnmount = () => {
        this.setState(prevstate => ({opacity: prevstate.opacity / 2}))
    }
    render = () => {
        return (
            <div className="fullscreen loadingBG">
                <Particles
                    params={params}
                    styles={{opacity: this.state.opacity}}
                    width={"100vw"}
                    height={"100vh"}
                    className="fullscreen loadingParticles" />
                <h1 className="title">Loading...</h1>
            </div>
        )
    }
}

export default Loading;