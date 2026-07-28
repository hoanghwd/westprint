import React, { Component } from "react";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button'
import { connect } from 'react-redux';

class TabContent extends Component {
    render() {
        const p = "This process will walk you step-by-step through all of the critical parts of our API to assist you in properly configuring your software to talk to ours. We encourage you to carefully review each stage without skipping to prevent any hiccups later on. When you are ready to begin, click the button below."

        return (
            <Col sm={10} className="d-flex flex-column">
                <h5><b>WELCOME TO THE JONDO API ONBOARDING PROCESS</b></h5>
                <p>{p}</p>
                <div className="d-flex justify-content-end mb-3">
                <Button size="lg" variant="primary" onClick={() => this.props.handleStart(this.props.orderOrigin)}>LET'S GET STARTED</Button>
                </div>
    
            </Col>
        );
    }
}

const mapStateToProps = state => (
    {
        orderOrigin: state.session.orderOrigin,      
    }
  );

  
//export default TabContent;
export default connect(
    mapStateToProps
  ) ( TabContent );