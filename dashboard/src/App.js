import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import LoginView from './Views/LoginView';
import LawEnforcementView from "./Views/LawEnforcementView";
import InsuranceView from "./Views/InsuranceView";

import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSignedIn: true
        }
    }

    render = () => {
        return (
            <div>
                <Switch>
                    <Route exact path='/login' render={() => <LoginView isSignedIn={this.state.isSignedIn}/>} />
                    <Route exact path='/insurance' render={() => <InsuranceView isSignedIn={this.state.isSignedIn} />} />
                    <Route exact path='/lawEnforcement' render={() => <LawEnforcementView isSignedIn={this.state.isSignedIn} />} />
                    <Route component={() => { return <Redirect exact to={'/login'} /> }} />
                </Switch>
            </div>
        );
    }
}

export default App;
