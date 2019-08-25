import React, { Component } from 'react';
import { Form, FormControl, Navbar, Nav, Button } from 'react-bootstrap';

import "./menubar.css";

class MenuBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signOut: false,
            searchTerm: undefined
        }
    }

    onChange = e => {
        this.setState({ searchTerm: e.target.value });
    }

    onSubmit = () => {
        this.props.searchFor(this.state.searchTerm, "byLicensePlate")
    }

    signOut = () => {
        console.log("props", this.props)
        this.props.setIsSignedIn(false)
    }

    render = () => {
        return (
            <div>
                <Navbar bg="light" variant="light" id="navbar">
                    <Nav className="mr-auto">
                        <Button id="title" variant="submit">CrowdDash</Button>
                        <Button id="search" variant="submit" onClick={this.signOut}>Sign Out</Button>

                    </Nav>
                    <Nav className="mr-auto">
                        <Button id="header" variant="submit">Searching By License Plate</Button>
                    </Nav>
                    <Form inline id="searchform">
                        <FormControl type="text" placeholder="License Plate" id="searchbar" className="mr-sm-5" onChange={this.onChange} />
                        <Button onClick={this.onSubmit} id="searchButton" variant="submit">Search</Button>
                    </Form>
                </Navbar>
            </div>
        )
    }
}

export default MenuBar;