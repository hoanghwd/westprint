import React, { Component } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import logo from "../../images/logo2.png";

import "./Register.css";

class Thanks extends Component {
  
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            errorFlag: null,
            dataLoaded:false
          };
    }

    async componentDidMount() {//Get Data On Load
        
        const response = await axios.get(process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_CONFIRM+'?userId='+this.props.match.params.id);

        if (response.data.error) {
            this.setState({errorFlag: true, dataLoaded:true});
           
        } else {
            const {email} = response.data
            this.setState({ 
                email: email, 
                dataLoaded:true
            });
        }
    
    }    

    render() {
       
        let textToShow = '';
        if(this.state.dataLoaded){
            
            if(this.state.errorFlag){
                textToShow =
                <div>
                <p className="sub-heading">OOPS! Something went wrong...</p>
                <p>Don't worry, we are here to help. Please contact our Customer Service.</p>
                <p>Tel: 714-279-2300</p>
                </div>;
            }else{
                textToShow =
                <div>
                <p className="sub-heading">EMAIL VERIFIED</p>
                <p>Thank you. Your email address {this.state.email} has been verified. We will email you your login credentials after your account has been validated and set up for our API Integration process.</p>
                </div>;
            }
        }

        return (
            <div className="my-account">
                <Container>
                <Row>
                    <Col md={8} className="mx-auto">
                    <Card className="my-5 text-left">
                        <Card.Header className="mx-0 px-0 text-center card-header-register">
                        <Card.Img
                            className="my-5 "
                            src={logo}
                        />
                        </Card.Header>
                        <Card.Body>
                        {textToShow}
                        </Card.Body>
                    </Card>
                    </Col>
                </Row>
                </Container>
            </div>
    
        );
  
    }

}
 
export default Thanks;