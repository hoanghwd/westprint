import React, { Component } from "react"
import { connect } from 'react-redux'
import axios from "axios"
import Skip from '../../Shared/Skip'
import CommentBox from '../../Shared/Comment/CommentBox'
import Approve from '../../Shared/Approve'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import { Link } from 'react-router-dom'
import Modal from "react-bootstrap/Modal"


const getTestPlan = async (userName, jwt, review ) => {
   
    const searchParams = `?userName=${userName}&testMode=1&statusUpdate=1&review=${review}`;
  
    return await axios.get(
      process.env.REACT_APP_WESTPRINT_API +
      process.env.REACT_APP_GET_ORDERS +
      searchParams,  {headers: {'Authorization': 'Bearer ' + jwt}}
    );

}

const getTestPlan2 = async (userName, jwt ) => {
    
    const section = 'Status Update' 
    const searchParams = `?userName=${userName}&section=${section}`;
         
    return axios.post(
       process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_UPDATE_TEST_PLAN,
        { userName },  {headers: {'Authorization': 'Bearer '+jwt}} 
      ).then( () =>{

        return axios.get(
            process.env.REACT_APP_WESTPRINT_API +
            process.env.REACT_APP_GET_TEST_PLAN +
            searchParams,  {headers: {'Authorization': 'Bearer '+jwt}}
        )
        
      })
}

const checkForSkip = async (userName, jwt) => {
    const section = 'status' 
    const searchParams = `?userName=${userName}&sectionName=${section}`;
  
    return await axios.get(
      process.env.REACT_APP_WESTPRINT_API +
      process.env.REACT_APP_CHECK_FOR_SKIP +
      searchParams,  {headers: {'Authorization': 'Bearer '+jwt}}
    )
}


class TestPlan extends Component {
    
    constructor(props) {
        
        super(props);
    
        this.state = {
          orders: [],
          items:[],
          testPlan: [],
          totalOrders: 0,
          totalTestOrder: 0,
          loading: true,
          loading2: true,
          scrollUp: true,
          error:'',
          allTestsApproved: false,
          buttonTemporarilyDisable: false,
          skip:false
        };

        this.handleCheck = this.handleCheck.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.sendStatusUpdate = this.sendStatusUpdate.bind(this);
        this.handleShowModal = this.handleShowModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    // update the table when submit search form
    async componentDidMount() {
        const { userName, jwt } = this.props;

        const response = await getTestPlan(userName, jwt, 0)
        
        if (response.data.orders) {
            const orders = response.data.orders;
            orders.forEach(order => {
                this.setState({
                    [order.id]: {include: false, statusType: ''}
                })
                
            });
            this.setState({ orders: response.data.orders, totalOrders: response.data.orders.length, loading: false });
        }

        const response2 = await getTestPlan2(userName, jwt)
        //if (this._isMounted) {
            if (response2.data.cases) {
                //console.log('done loading2')
                this.setState({ testPlan: response2.data.cases, loading2: false, allTestsApproved: response2.data.allTestsApproved});
                //this.props.handleSetAllTestsApproved(true)
            }
        //}
        
        const response3 = await checkForSkip(userName, jwt)
               
        if (response3.data) {    
            //console.log("response.data", response.data)          
            //console.log("response.data.isAllow", response.data.isAllow)
            this.setState({ skip: response3.data.isAllow});
        }   


    }
    
    componentDidUpdate() {
        if(this.state.scrollUp){
            window.scrollTo(0, 0);
        }
    }  

    handleCheck(event, orderId) {
        
        if(event.target.checked){
            
            if(this.state[orderId].statusType === '' ){
               
                this.setState({
                    totalTestOrder: this.state.totalTestOrder + 1,
                    [orderId]: {...this.state[orderId], include: true,  statusType: 'Accepted'},
                    scrollUp: false
                });  
            
            }else{
                
                this.setState({
                    totalTestOrder: this.state.totalTestOrder + 1,
                    [orderId]: {...this.state[orderId], include: true},
                    scrollUp: false
                });

            }
            
        }else{
            
            this.setState({
                totalTestOrder: this.state.totalTestOrder - 1,
                [orderId]: {...this.state[orderId], include: false, statusType: ''},
                scrollUp: false
            });
            
        }
    }

    handleSelect(event, orderId) {
        this.setState({
            [orderId]: {...this.state[orderId], statusType: event.target.value},
            scrollUp: false
        });
    }

    async sendStatusUpdate(order, statusType) {   
        
        const { userName, jwt } = this.props;
        const searchParams =`?userName=${userName}&orderId=${order.id}&statusType=${statusType}`;

        //console.log(process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_SEND_STATUS + searchParams);

        const response = await axios.get(process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_SEND_STATUS + searchParams,
            {headers: {'Authorization': 'Bearer ' + jwt}});
        /*
        if (response.data.error) {
            this.setState({error: response.data.error});
        }
        */
       return response
        
    }    

    handleSubmit(e) {
        
        e.preventDefault(); 
        

        this.setState({buttonTemporarilyDisable: true}); 

        const orders = this.state.orders;
        const { userName, jwt } = this.props;

        var promises = [];

        orders.forEach(order => 
            {
                const orderState = this.state[order.id];
                if(orderState.include){
                    //console.log(order.id + " "+ orderState.statusType )
                    //this.sendStatusUpdate(order, orderState.statusType)
                    promises.push(this.sendStatusUpdate(order, orderState.statusType));
                }
            });

        console.log('promisses list',promises)
        Promise.all(promises)
        .then(async () => {
            console.log('after all promisses')
            const response = await getTestPlan2(userName, jwt)

            console.log('response ',response)
            
            if (response.data.error) {
                this.setState({error: response.data.error});               
            } else {
                //this.props.handleSetAllTestsApproved(response.data.allTestsApproved)
                this.setState({allTestsApproved: response.data.allTestsApproved, testPlan: response.data.cases});  
            }

            const responseAfter = await getTestPlan(userName, jwt, 1)

            const ordersAfter = responseAfter.data.orders

            console.log('state',this.state)

            ordersAfter.forEach(order => 
                {
                    console.log(order.id)
                    const orderState = this.state[order.id];
                    
                    if(orderState.include){
                        this.setState({
                            [order.id]: {...this.state[order.id], newOrderStatus: order.orderStatus, logId:order.logId, completeStatus:order.completeStatus}
                        });
                    }
                });
            //console.log(this.state)

            const response3 = await checkForSkip(userName, jwt)
               
            if (response3.data) {    
                //console.log("response.data", response.data)          
                //console.log("response.data.isAllow", response.data.isAllow)
                this.setState({ skip: response3.data.isAllow});
            } 


        }).then(() => {
            this.setState({buttonTemporarilyDisable: false}); 
            //this.props.handleNext('review_status', 10);
            window.scrollTo(0, 0);
        }) 
            
        //this.props.handleNext('review_status', 10);
    }

    handleShowModal(items) {
        this.setState({ items, showModal: true });
    }

    handleCloseModal() {
        this.setState({ showModal: false });
    }

    getResult(orderStatus, completeStatus) {
        const temp = orderStatus.split("_");
        orderStatus = temp[0];
        const isTest = temp[1];
        
        if (isTest === "Test") {
            if (orderStatus === "Accepted") {
                return "Success";
            } else {
                //return "Fail (Invalid Images)";
                return "Fail";
            }
        } 
        
        if (completeStatus === "UPDATED-TO-OWNER") {
            //console.log("Success")
            return "Success";
        } else if (completeStatus === "NOT-UPDATED-TO-OWNER") {
            //return "Pending";
            return "Fail";
        } else {
            return "Fail"
        }
    }

    render() {
        
        //console.log(this.state)

        //const skip = this.props.approved ? '' : (<Skip/>);
        const skip = ( this.props.skipped || this.props.approved || !this.state.skip) ? '' : (<Skip />);
        let options = ['Accepted', 'Shipped','Cancelled' ];                
        const {loading, orders, items, buttonTemporarilyDisable, testPlan, loading2} = this.state
        var testCaseText;
        const allTestsApprovedPrpos = this.props.allTestsApproved
        const allTestsApprovedState = this.state.allTestsApproved
        
        //console.log('allTestsApprovedPrpos:')
        //console.log(allTestsApprovedPrpos)
        //console.log('allTestsApprovedState:')
        //console.log(allTestsApprovedState)
                
        let allTestsApproved = allTestsApprovedPrpos || allTestsApprovedState
    
        //console.log('loading')
        //console.log(loading)
        //console.log('loading2')
        //console.log(loading2)

        //console.log('allTestsApproved:')
        //console.log(allTestsApproved)
        //console.log('this.props.approved:')
        //console.log(this.props.approved)

        if (loading || loading2) {
            return (
                <div className="spinn-container">
                    <Spinner animation="border" variant="primary" />
                </div>
            )
        }else if (orders === null || orders.length === 0) {
            return (
                <div className="OrdersTable">
                    No test orders found for this account. To test Status Update feature, please submit a few test orders.
                    <div className="d-flex mt-5 mb-3" style={{justifyContent:"space-between"}}>
                        <Button
                            size="lg"
                            variant="primary"
                            onClick={() => this.props.handleNext('testPlan_status', 0) }
                        >
                            Previous
                        </Button>
                        <div style={{display:"inline-flex"}}>
                            {skip}
                        </div>
                    </div>
                </div>
            )
        }
        let message = '';

        if (buttonTemporarilyDisable) {
            message = "Processing requests...";
        } else if (this.state.totalTestOrder !== 0 ){
            message = "Please add the Ship Url to receive your status update";
        } else {
            message = "You need to choose at least 1 test order";
        }

        const disabled = this.props.shipUrl === '' || this.state.totalTestOrder === 0 || buttonTemporarilyDisable;
        const disabledClass = disabled ? 'btn-disabled' : '';
    
        const btn = <Button size="lg" variant="primary" className={disabledClass} onClick={this.handleSubmit} disabled={disabled}>SUBMIT</Button>;

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
                    {btn}
                </div>
            </OverlayTrigger>;

        var submitBtn = disabled ? tooltipBtn : btn;
        
        if(this.props.asUser){
            submitBtn = ''    
        }

        let approveButton
        
        if(allTestsApproved || this.state.skip){
            approveButton = <Approve approved={this.props.approved} skipped={this.props.skipped} buttonText = 'Complete'/>
        }else{
            approveButton = <Approve approved={this.props.approved} skipped={this.props.skipped} disable={true} curStage = "Status Updates" buttonText = 'Complete'/>
        }

        let updateShipUrl = ''
        if (this.props.shipUrl === ''){
            updateShipUrl = <p className = "red">Note: Update your Ship Url <Link to="/myaccount/edit" className="link">here</Link></p>
        }

        return (
            
            <div className="StatusUpdate p-3">
                
                <Modal show={this.state.showModal} onHide={this.handleCloseModal} size="lg">
          
                    <Modal.Header closeButton>
                        <Modal.Title>Item Details</Modal.Title>
                    </Modal.Header>
                    
                    <Modal.Body>
                        <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Image</th>
                                {/*<th>Image File Type</th>*/}
                                <th>Final X</th>
                                <th>Final Y</th>
                                {/*<th>DPI</th>*/}
                                {/*<th>Orientation</th>*/}
                            </tr>
                        </thead>
                        <tbody>
                            {items.map( (item, i) => {
                                return (
                                    <tr key = {i}>
                                        <td><a target="_blank" rel="noopener noreferrer" href={item.imageUrl}>View</a></td>
                                        {/*<td>{item.imageType}</td>*/}
                                        <td>{item.finalX}</td>
                                        <td>{item.finalY}</td>                              
                                        {/*<td>{item.dpi}</td>*/}
                                        {/*<td>{item.orientation}</td>*/}
                                    </tr>
                                );
                            })}
                    </tbody>    
                        </Table>
                    </Modal.Body>

                    <Modal.Footer></Modal.Footer>
            
                </Modal>

                <h3><b>TEST PLAN STATUS</b></h3>
                <hr />
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>Test Case</th>
                       
                        <th className = 'center-align'>Approved</th>
                        </tr>
                    </thead>
                    <tbody>
                    {testPlan.map( (item, i) => {
                        
                        testCaseText = item.testCase
                        return (
                            <tr key = {i}>
                            <td>{i + 1}</td>
                            <td>{testCaseText}</td>
                           
                            <td className = 'center-align'><i className={'  fas '+ (item.isApproved === 'Y' ? 'fa-check color-blue' : 'fa-times color-red')} /></td>
                            </tr>
                        )
                    })}
                    </tbody>    
                </Table>
                <br></br>





                
                <h3><b>STATUS UPDATE TEST PLAN</b></h3>

                <Table striped bordered hover>
                <thead variant="dark">
                        <tr>
                        <th className="table-header-balck" colSpan="5">Test Status Update</th>
                        <th className="table-header-balck" colSpan="2">Review Results</th>
                        </tr>
                    </thead>
                    <thead>
                        <tr>
                            <th>PO/Order #</th>
                            <th>Items</th>
                            <th>Current Status</th>
                            <th>Choose Status Update</th>
                            <th>Test Status Update</th>
                            <th>Result</th>
                            <th>Request & Response</th>                        
                        </tr>
                    </thead>
                    <tbody>
                    {orders.map( (order, i) => {

                        let newSatus = ''
                        let logId = ''
                        let completeStatus = ''
                        let orderStatus = ''
                        let statusType = 'Select'
                        
                        orderStatus = order.orderStatus.split("_")[0]


                        if(order.logId === null){
                            logId = 'NA'
                        }else{
                            logId =  <a target="_blank" rel="noopener noreferrer" href={`#/viewXml/`+order.logId}>View</a>
                        }

                        if(this.state[order.id] && this.state[order.id].logId === null){
                            logId = 'NA'
                        }else if (this.state[order.id] && this.state[order.id].logId){
                            //logId = <Link to={"/viewXml/" + this.state[order.id].logId} className="link">View</Link>
                            logId =  <a target="_blank" rel="noopener noreferrer" href={`#/viewXml/`+this.state[order.id].logId}>View</a>
                        }

                        if(this.state[order.id] && this.state[order.id].newOrderStatus){
                            orderStatus = this.state[order.id].newOrderStatus.split("_")[0]
                            newSatus = this.state[order.id].newOrderStatus
                            completeStatus = this.state[order.id].completeStatus
                            newSatus = this.getResult(newSatus, completeStatus)
                            
                        }

                        if(this.state[order.id]){
                            statusType = this.state[order.id].statusType
                        }

                        return (
                            <tr key = {i}>
                                <td>{order.poNumber}</td>
                                <td><Button className="pl-0" variant="link" onClick={() => this.handleShowModal(order.items)}>View</Button></td>
                                {/*<td>{order.orderStatus.split("_")[0]}</td>*/}
                                <td>{orderStatus}</td>
                                <td>
                                    <Form.Control size="sm" as="select" value = {statusType} name="statusType" onChange={(e) => this.handleSelect(e, order.id)}>
                                        <option value = "">Select</option>
                                        { options.map( (option, i) => <option key={i}>{option}</option>) }
                                    </Form.Control>
                                </td>
                                <td><input type="checkbox" onChange={(e) => this.handleCheck(e, order.id)} /></td>
                                <td>
                                {newSatus}
                                </td>
                                <td>
                                {logId}
                                </td>
                            </tr>
                        )
                    })}
                    <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td className = 'button-right'>{submitBtn}</td>
                    </tr>
                    </tbody>    
                </Table>
                
                {updateShipUrl}

                <b><hr className="mt-5 mb-3"/></b>
                
               

                <CommentBox userId={this.props.userId} username={this.props.userName} jwt={this.props.jwt} section='Status'/>

                <div className="d-flex mt-5 mb-3" style={{justifyContent:"space-between"}}>
                    <Button
                        size="lg"
                        variant="primary"
                        onClick={() => this.props.handleNext('testPlan_status', 0) }
                    >
                        Previous
                    </Button>
                    <div style={{display:"inline-flex"}}>
                        {/*<Approve approved={this.props.approved} buttonText = 'Complete'/>*/}
                        {approveButton}
                        {skip}
                    </div>
                </div>
            </div>

        );

    }

}

const mapStateToProps = state => (
    {
        shipUrl: state.session.shipUrl,
        userId: state.session.userId,
        asUser: state.session.asUser,
        userName: state.session.userName, 
        jwt: state.session.jwt
    }
);

export default connect(
    mapStateToProps
)(TestPlan);
//export default Review;