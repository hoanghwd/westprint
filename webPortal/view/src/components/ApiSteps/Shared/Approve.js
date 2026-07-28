import React, { Component } from "react";
import { connect } from 'react-redux';
import { handleApprove, handleGoLive } from '../../../actions';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

import "./Shared.css";

class Approve extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleApprove = this.handleApprove.bind(this);

    this.state = {
      show: false,
      error: '',
    };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  async handleApprove(){
    const { curStage, orderOrigin } = this.props;
    

    /*
    const sectionStatus = 'Approved';
    const response = await axios.post(      
      process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_UPDATE_PORTAL_STATUS,
      {userName, sectionName, sectionStatus, curStage, curPage, percentage},  
      {headers: {'Authorization': 'Bearer '+ jwt}}
    );
    */

    //if (response.data.error) {
    //    this.setState({ error: response.data.error });
    //} else {
      if (curStage === 'Status Updates' || curStage === 'status') {
        this.props.handleGoLive("Approved");
      } else if (curStage === 'Order Placement' || curStage === 'create') {
        this.props.handleApprove('cancel', orderOrigin);
      } else if (curStage === 'Cancel Order' || curStage === 'cancel') {
        this.props.handleApprove('redo', orderOrigin);
      } else if (curStage === 'redo') {
        this.props.handleApprove('status', orderOrigin)
      }
    //}
  }

  render() {

    // let alert = '';
    let message = '';
    let buttonText = 'Approve'
    let messageSkippedApproved = ''
    const { curStage } = this.props;

    if(this.props.buttonText){
      buttonText = this.props.buttonText
    }

    // if (this.state.error !== '') {
    //   alert = <Alert variant='dark'>
    //     {this.state.error}
    //   </Alert>
    // }
    //alert(curStage)
    if(curStage === "Order Placement"){
      //message = "You have to pass all the test cases";
      message = "You need to approve all the test cases above and satisfy all the requirements from the test plan";
    } if(curStage === "Status Updates" || curStage === "status"){
      message = "You need to satisfy all the requirements from the test plan";
    }  else {
      //message = "You have to approve all the test cases";
      message = "You need to approve all the test cases above and satisfy all the requirements from the test plan";
    }
    messageSkippedApproved = 'This section is either Approved or Skipped. Please use the Left Panel to navigate to other sections.'

    const disable = this.props.skipped || this.props.approved || this.props.disable;
    const disableClass = this.props.disable ? 'btn-disabled' : '';
    const btn = 
      <Button
        className = {disableClass}
        disabled={disable}
        variant="primary"
        size="lg"
        onClick={() => this.handleShow()}
      >
        {buttonText}
      </Button>;

    const tooltipBtn =
      <OverlayTrigger
        placement='top'
        overlay={
          <Tooltip id='tootip-top'>
            {message}
          </Tooltip>
        }
      >
        <div className = 'wrapper'>
          <Button
            className = {disableClass}
            disabled={true}
            variant="primary"
            size="lg"
            onClick={() => this.handleShow()}
          >
            {buttonText}
          </Button>
        </div>
      </OverlayTrigger>;

    const tooltipBtnSkippedApproved =
    <OverlayTrigger
      placement='top'
      overlay={
        <Tooltip id='tootip-top'>
          {messageSkippedApproved}
        </Tooltip>
      }
    >
      <div className = 'wrapper'>
        <Button
          className = 'btn-disabled'
          disabled={true}
          variant="primary"
          size="lg"
          onClick={() => this.handleShow()}
        >
          {buttonText}
        </Button>
      </div>
    </OverlayTrigger>;
    
    let apporveBtn = ''

    if(this.props.asUser){
      apporveBtn = ''
    }else if(this.props.skipped || this.props.approved){
      apporveBtn = tooltipBtnSkippedApproved
    }else if(this.props.disable){
      apporveBtn = tooltipBtn
    }else{
      apporveBtn = btn
    }

    //const apporveBtn = (this.props.disable && !this.props.approved) ? tooltipBtn : btn;

    let approveText = <p>By clicking Continue, you agree that all the test orders have been reviewed carefully and the information looks exactly as you would expect after going LIVE.</p>

    console.log(curStage)
    if(curStage === "Cancel Order" || curStage === "cancel"){
      approveText = <p>By clicking Continue, you agree that the order status, XML requests and responses of the cancelled orders look exactly as you would expect after going LIVE.</p>
    }else if(curStage === "status" ){
      approveText = <p>By clicking Continue, you agree that the status updates and their corresponding XML requests and responses look exactly as you would expect after going LIVE.</p>  
    }

    return (
      <div className="Approve">
        {apporveBtn}
  
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            {/*<p>By clicking Continue, you agree that all the test orders have been reviewed carefully and the information looks exactly as you would expect after going LIVE.</p>*/}
            {approveText}
            <Button variant="primary" className="mx-auto" onClick={this.handleApprove}>
              Continue
            </Button>

            {/* {alert} */}
            
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  handleApprove: (nextStage, orderOrigin) => dispatch(handleApprove(nextStage, orderOrigin)),
  handleGoLive: (sectionStatus) => dispatch(handleGoLive(sectionStatus))
});

const mapStateToProps = state => (
  {
    curStage: state.handler.curStage,
    userName: state.session.userName, 
    asUser: state.session.asUser,
    curPage: state.handler.curPage,
    percentage: state.handler.progress,
    jwt: state.session.jwt,
    orderOrigin: state.session.orderOrigin
  }
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Approve);

