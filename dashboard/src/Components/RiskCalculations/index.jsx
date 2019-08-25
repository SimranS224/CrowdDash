import React, { Component } from 'react';

import "./risk.css";

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
            </div>
        )
    }
}

export default Loading;