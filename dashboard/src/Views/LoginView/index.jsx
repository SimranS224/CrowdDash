import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Row, Col, Button } from 'react-bootstrap';
import Loading from '../../Components/Loading';
import Error from "../../Components/Error";
import Logo from "../../Assets/CrowdDashLogoCropped.png";

import './login.css';

class LoginView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSignedIn: false,
            isLoading: true,
            isSignUp: false,
            signInType: undefined,
            username: undefined,
            password: undefined,
        }
        this.insuranceUser = "simran@intactinsurance.com"
    }

    componentDidMount = () => {
        setTimeout(() => {
            this.setState({ isLoading: false })
        }, 1000)
    }

    onChange = (e, type) => {
        if (type === "username") {
            this.setState({ username: e.target.value })
        } else {
            this.setState({ password: e.target.value })
        }
    }

    onSubmit = () => {
        let isSignedIn = false;
        let signInType = undefined;
        let failedSignIn = false;
        if (this.state.username === this.insuranceUser && this.state.password) {
            console.log("insurance sign in valid")
            isSignedIn = true;
            signInType = "insurance"
        } else {
            console.log("invalid sign in")
            failedSignIn = true
        }
        this.props.setIsSignedIn(true, () => {
            this.setState({
                isSignedIn: isSignedIn,
                signInType: signInType,
                failedSignIn: failedSignIn
            })
        })
    }

    signUp = () => {
        this.setState({ isSignUp: true })
    }

    login = () => {
        this.setState({ isSignUp: false })
    }

    render = () => {
        console.log("state:", this.state)
        if (this.state.isSignedIn) {
            return <Redirect to="/insurance" />
        } else if (this.state.isLoading) {
            return <Loading />
        } else {
            const usernameProps = {
                onChange: event => this.onChange(event, "username"),
                type: "text",
                placeholder: "username",
                id: "username"
            }

            const passwordProps = {
                onChange: event => this.onChange(event, "password"),
                type: "password",
                placeholder: "password",
                id: "password"
            }

            return (
                <div className="fullscreen loginBackground">
                    {this.state.isLoading ? <Loading /> : null}
                    <img src={Logo} alt="CrowdDash" className="loginLogo" />
                    {/* <h1 className="loginHeader"> Welcome to CrowdDash </h1> */}
                    <div className="loginTab">
                        <h2 className="loginSubHeader">{this.state.isSignUp ? "Sign Up" : "Log In"}</h2>
                        <div className="loginForm" >
                            <Form.Group as={Row} className="formGroup" id="usernameFormGroup">
                                <Form.Label className="formLabel" column sm="10"> Username: </Form.Label>
                                <Col sm="30" className="column">
                                    <Form.Control {...usernameProps} />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="formGroup" id="passwordFormGroup">
                                <Form.Label className="formLabel" column sm="10"> Password: </Form.Label>
                                <Col sm="30" className="column">
                                    <Form.Control {...passwordProps} />
                                </Col>
                            </Form.Group>
                            <Button variant="submit" onClick={this.onSubmit} id="signInButton">{this.state.isSignUp ? "Sign Up" : "Log In"}</Button>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default LoginView;