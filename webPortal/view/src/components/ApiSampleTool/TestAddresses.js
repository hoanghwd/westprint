import React, {Component} from "react";
import {Redirect} from "react-router-dom";

import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import ProgressBar from "react-bootstrap/ProgressBar";

/**
 * Added by Huynh Do - 06/23/2021
 */
import DOMPurify from 'dompurify';

import {Link} from "react-router-dom";

import Navbar from "../Navbar/NavBar";
import "../MyAccount/MyAccount.css";

import {connect} from 'react-redux';
import {doSetOptions} from '../../actions'
import axios from "axios";
import Table from "react-bootstrap/Table";

function getCookie(name) {
    var cookie = "; " + document.cookie;
    var parts = cookie.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}

class TestAddresses extends Component {
    constructor(props) {
        super(props);

        this.state = {
            progress      : 10,
            nextStep      : "8: Order XML elements structure & error codes",
            sign          : 'fas fa-minus',
            sampleAddHtml : '',
            isDataReady   : false,
            imgUrl        : '',
            zoneName      : '',
            description   : ''
        };

        // this.handleLogin = this.handleLogin.bind(this);
        this.toggleSign = this.toggleSign.bind(this);
    }

    toggleSign() {
        if (this.state.sign === "fas fa-minus") {
            this.setState({sign: "fas fa-plus"});
        }
        else {
            this.setState({sign: "fas fa-minus"})
        }
    }

    /**
     *
     * @param data
     * @returns {string}
     */
    _getZoneArrayHtml(data)
    {
        const {
            sampleAdd = [],
            zoneName = '',
            imgUrl = '',
            description = '',
            emptyMessage = 'No sample addresses found.'
        } = data || {};
        const sampleAddresses = Array.isArray(sampleAdd) ? sampleAdd : [];
        let ZoneArrayHtml = '';

        //console.log(imgUrl);
        this.setState({
            imgUrl      : imgUrl,
            zoneName    : zoneName,
            description : description
        })

        /**
         * When user has some sample addresses already set up
         */
        if ( sampleAddresses.length > 0 && emptyMessage == '' ) {
            ZoneArrayHtml = sampleAddresses.map((zone) =>
                <Card key={zone.zoneName} className="my-3 text-left">
                    <Card.Header className="card-header-account text-light">
                        Zone {zone.zoneName}
                    </Card.Header>
                    <Card.Body>
                        {<ul id="user-info" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(zone.testAddress)}}/>}
                    </Card.Body>
                </Card>
            );
        }
        else {
            ZoneArrayHtml =
                <Card className="my-3 text-left">
                    <Card.Body>
                        {<div id="user-info" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(emptyMessage)}}/>}
                    </Card.Body>
                </Card>
        }

        return ZoneArrayHtml;
    }

    /**
     * Created by Huynh Do - 06/18/2021
     */
    async componentDidMount()
    {
        const testAddressesUrl = process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_TEST_ADDRESS;
        const {userName, jwt} = this.props;
        const userNameParam = "?userName=" + userName;
        const response = await axios.get(
            testAddressesUrl + userNameParam,
            {headers: {'Authorization': 'Bearer ' + jwt}}
        ).catch(error => {
            console.log(error.response)
        });

        if (!response || !response.data) {
            this.setState({
                sampleAddHtml: this._getZoneArrayHtml({ emptyMessage: 'Unable to load sample addresses.' }),
                isDataReady: true
            });
            return;
        }

        /**
         * If user API is verified
         */
        if ( !response.data.error ) {
            this.setState({
                sampleAddHtml: this._getZoneArrayHtml(response.data),
                isDataReady: true
            })
        }
    }

    render() {
        if (!this.props.userId) {
            return <Redirect to={"/login"}/>;
        }

        let cardBodyHtml = this.state.isDataReady ?
            this.state.sampleAddHtml :
            (
                <Card className="my-3 text-left">
                    <Card.Body>
                        <div id="user-info">Loading...</div>
                    </Card.Body>
                </Card>
            );

        let imgDiv = '';
        if( this.state.isDataReady ) {
            let imgUrl = '';
            let zoneMapUser = 'Zone Map';

            if( this.state.imgUrl != '' ) {
                zoneMapUser += ' - ' + this.state.zoneName;
                imgUrl = '<img style=\'height: 100%; width: 100%; object-fit: contain\' title = "' + this.state.description + '" src="' + this.state.imgUrl + '" />';
            }
            else {
                imgUrl = "No maps available";
            }

            imgDiv =
                <Card className="my-3 text-left">
                    <Card.Header className="card-header-account text-light">
                        {zoneMapUser}
                    </Card.Header>
                    <Card.Body>
                        {<div id="user-info-image" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(imgUrl)}}/>}
                    </Card.Body>
                </Card>
        }

        return (
            <div className="my-account">
                <Navbar {...this.props} handleLogin={this.props.handleLogin}/>
                <Container>
                    <h2 className="text-monospace font-weight-bold text-left mt-3">
                        Sample Addresses
                    </h2>
                    {imgDiv}
                    {cardBodyHtml}
                </Container>
            </div>
        );
    }
}

export default TestAddresses;
