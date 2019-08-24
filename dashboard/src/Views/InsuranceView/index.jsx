import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Loading from '../../Components/Loading';

class InsuranceView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSignedIn: props.isSignedIn,
            isLoading: true,
            isSignUp: false
        }
    }

    render = () => {
        if (!this.state.isSignedIn) {
            return <Redirect to="/login" />
        } else if (this.state.isLoading) {
            return <Loading />
        } else {
            return (
                <div className="fullscreen">
                    Text
                </div>
            )
        }
    }
}

export default InsuranceView;