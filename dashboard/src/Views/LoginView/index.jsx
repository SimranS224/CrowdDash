import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Loading from '../../Components/Loading';
import Error from "../../Components/Error";

import './login.css';

class LoginView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSignedIn: props.isSignedIn,
            isLoading: false,
            isSignUp: false,
            signInType: undefined
        }
    }

    render = () => {
        if (this.state.isSignedIn) {
            if (this.state.type === "insurance") {
                return <Redirect to="/login" />
            } else if (this.state.type === "lawEnforcement") {
                return <Redirect to="/login" />
            } else {
                return <Error message="Invalid Login Type" />
            }
        } else if (this.state.isLoading) {
            return <Loading />
        } else {
            return (
                <div className="fullscreen loginBackground">
                    <div className="loginTab">

                    </div>
                </div>
            )
        }
    }
}

export default LoginView;