import React, { Component } from "react";
import { connect } from 'react-redux';
import axios from "axios";
import Skip from '../../Shared/Skip';
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import Modal from "react-bootstrap/Modal";
import Approve from '../../Shared/Approve';
import CommentBox from '../../Shared/Comment/CommentBox';
import Spinner from 'react-bootstrap/Spinner'

import "../Create.css";

const getTestPlan = async (userName, jwt) => {
   
    const searchParams = `?userName=${userName}&testMode=1&status=create`;
   
    return await axios.get(
      process.env.REACT_APP_WESTPRINT_API +
      process.env.REACT_APP_GET_ORDERS +
      searchParams,  {headers: {'Authorization': 'Bearer '+jwt}}
    );

};

const checkForSkip = async (userName, jwt) => {
    const section = 'create' 
    const searchParams = `?userName=${userName}&sectionName=${section}`;
  
    return await axios.get(
      process.env.REACT_APP_WESTPRINT_API +
      process.env.REACT_APP_CHECK_FOR_SKIP +
      searchParams,  {headers: {'Authorization': 'Bearer '+jwt}}
    )
}

// const setSectionStatus = async (userName, jwt, sectionStatus) => {
   
//     return await axios.post(
//       process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_UPDATE_PORTAL_STATUS,
//       {userName, sectionName : 'Order Placement', sectionStatus },  
//       {headers: {'Authorization': 'Bearer '+jwt}}
//     );

// };


class Review extends Component {
    _isMounted = false;

    constructor(props) {
        
        super(props);
    
        this.state = {
          orders: [],
          items:[],
          showModal: false,
          showModal2: false,
          curOrder:{},
          goTonext: false,
          totalOrders:0,
          ordersApprovedNumber:0,
          error: '',
          scrollUp:true,
          loading: true,
          skip:false         
        };

        this.handleShowModal = this.handleShowModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleShowModal2 = this.handleShowModal2.bind(this);
        this.handleCloseModal2 = this.handleCloseModal2.bind(this);
        // this.handleApprove = this.handleApprove.bind(this);
    }

    // update the table when submit search form
    async componentDidMount() {
        this._isMounted = true;
            
        const { userName, jwt } = this.props;

        const response = await getTestPlan(userName, jwt)
        
        if (this._isMounted) {
            if (response.data.error) {
                this.setState({ error: response.data.error });
            } else {
                this.setState({ orders: response.data.orders, totalOrders: response.data.orders.length, loading: false});
            }
        }
        
        const response2 = await checkForSkip(userName, jwt)
               
        if (response2.data) {    
            //console.log("response2.data", response.data)          
            //console.log("response2.data.isAllow", response.data.isAllow)
            this.setState({ skip: response2.data.isAllow});
        }

    }

    componentDidUpdate() {
        if(this.state.scrollUp){
            window.scrollTo(0, 0);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleShowModal(items) {
        this.setState({ items, showModal: true });
    }

    handleCloseModal() {
        this.setState({ showModal: false });
    }

    handleShowModal2(curOrder) {
        this.setState({ curOrder, showModal2: true });
    }

    handleCloseModal2() {
        this.setState({ showModal2: false });
    }

    handleCheck(event) {
        //alert(event.target.checked)
        //alert(this.state.ordersApprovedNumber)
        if(event.target.checked){
            this.setState(state => {
                return {ordersApprovedNumber: state.ordersApprovedNumber + 1, scrollUp: false}
            });
        }else{
            this.setState(state => {
                return {ordersApprovedNumber: state.ordersApprovedNumber - 1, scrollUp: false}
            });
        }
    }
    
    // async handleApprove(sectionStatus){

    //     const { userName, jwt } = this.props;
        
    //     const response = await setSectionStatus(userName, jwt, sectionStatus)

    //     if (response.data.error) {
                    
    //     } else {
    //         //console.log(response.data);
    //         alert('Thank you! Order Placement tests are completed.')
    //         //this.setState({ goTonext: true });
           
    //         this.props.handleApprove('cancel')

    //     }

    // }


    render() {
        
        //const nextStage = 'cancel';
        //alert('this.props.approved: ' + this.props.approved)
        //alert('totalOrders and ordersApprovedNumber: '+ this.state.totalOrders + ' ' + this.state.ordersApprovedNumber)
        //alert('allTestsApproved: ' + this.props.allTestsApproved )
        const disableApprove =  !this.props.allTestsApproved || this.state.totalOrders !== this.state.ordersApprovedNumber
        
        //const skip = this.props.approved ? '' : (<Skip nextStage='cancel' score={25} />);
        const skip = (this.props.skipped || this.props.approved || !this.state.skip) ? '' : (<Skip nextStage='cancel' score={25}/>);
        
        const {orders, items, curOrder, loading} = this.state;

        //console.log(curOrder)
        
        const frontPackingSlip = curOrder.frontPackingSlip !== '' ? <a target="_blank" href={curOrder.frontPackingSlip}>View</a>:'NA'
        const backPackingSlip = curOrder.backPackingSlip !== '' ? <a target="_blank" href={curOrder.backPackingSlip}>View</a>:'NA'
        const outsideInsertCard = curOrder.outsideInsertCard !== '' ? <a target="_blank" href={curOrder.outsideInsertCard}>View</a>:'NA'
        const insideInsertCard = curOrder.insideInsertCard !== '' ? <a target="_blank" href={curOrder.insideInsertCard}>View</a>:'NA'
        const frontSticker = curOrder.frontSticker !== '' ? <a target="_blank" href={curOrder.frontSticker}>View</a>:'NA'
        const customLogo = curOrder.customLogo !== '' ? <a target="_blank" href={curOrder.customLogo}>View</a>:'NA'



        if (loading) {
            return (
                <div className="spinn-container">
                    <Spinner animation="border" variant="primary" />
                </div>
            )
        } else if (orders === null || orders.length === 0) {
            return (
                <div className = "OrdersTable">
                    No test orders found for this account. To test Place Order feature, please submit a few test orders.
                    <div className="d-flex mt-5 mb-3" style={{justifyContent:"space-between"}}>
                        <Button
                            size="lg"
                            variant="primary"
                            onClick={() => this.props.handleNext('testPlanStatus_create', 0) }
                        >
                            Previous
                        </Button>
                        <div style={{display:"inline-flex"}}>
                            {skip}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            
            <div className="ErrorCodes p-3">
                <h3><b>Review Test Orders</b></h3>

                <Modal show={this.state.showModal} onHide={this.handleCloseModal} size="lg">
          
                    <Modal.Header closeButton>
                        <Modal.Title>Item Details</Modal.Title>
                    </Modal.Header>
                    
                    <Modal.Body>
                        <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>X size</th>
                                <th>Y size</th>
                                <th>Qt</th>
                                <th>Price</th>
                                <th>Code</th>
                                <th>Image </th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map( (item, i) => {
                                return (
                                    <tr key = {i}>
                                        <td>{item.psTitle}</td>
                                        <td>{item.x}</td>
                                        <td>{item.y}</td>
                                        <td>{item.qt}</td>
                                        <td>${item.price}</td>
                                        <td>{item.itemCode}</td>
                                        <td><a target="_blank" href={item.copy_img_loc}>View</a></td>
                                    </tr>
                                );
                            })}
                    </tbody>    
                        </Table>
                    </Modal.Body>

                    <Modal.Footer></Modal.Footer>
                
                </Modal>


                <Modal show={this.state.showModal2} onHide={this.handleCloseModal2} size="lg">
          
                    <Modal.Header closeButton>
                        <Modal.Title>Branding Info</Modal.Title>
                    </Modal.Header>
                    
                    <Modal.Body>
                        <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Document</th>
                                <th>Link</th>
                            </tr>
                        </thead>
                        <tbody>
                           <tr>
                                <td>frontPackingSlip</td>
                                <td>{frontPackingSlip}</td>
                           </tr>
                           <tr>
                                <td>backPackingSlip</td>
                                <td>{backPackingSlip}</td>
                           </tr>
                           <tr>
                                <td>outsideInsertCard</td>
                                <td>{outsideInsertCard}</td>
                           </tr>
                           <tr>
                                <td>insideInsertCard</td>
                                <td>{insideInsertCard}</td>
                           </tr>
                           <tr>
                                <td>frontSticker</td>
                                <td>{frontSticker}</td>
                           </tr>
                           <tr>
                                <td>customLogo</td>
                                <td>{customLogo}</td>
                           </tr>                      
                           
                    </tbody>    
                        </Table>
                    </Modal.Body>

                    <Modal.Footer></Modal.Footer>
                
                </Modal>

                
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>PO#</th>
                        <th>Order Date</th>
                        <th>Shipping Type</th>
                        <th>Shipping Address</th>
                        <th>Total Product Price</th>
                        <th>Total Shipping</th>
                        <th>Item Info</th>
                        <th>Branding Info</th>
                        <th>Approve</th>
                        </tr>
                    </thead>
                    <tbody>
                    {orders.map( (order, i) => {
                        return (
                            <tr key = {i}>
                                <td>{order.poNumber}</td>
                                <td>{order.orderTime}</td>
                                <td>{order.shippingType}</td>
                                <td>{`${order.address}, ${order.city}, ${order.state} ${order.zip} ${order.country}`}</td>
                                <td>${order.total}</td>
                                <td>${order.shipping}</td>
                                <td><Button variant="link" onClick={() => this.handleShowModal(order.items)}>View</Button></td>
                                <td><Button variant="link" onClick={() => this.handleShowModal2(order)}>View</Button></td>
                                <td><input name={"approve_"+i} type="checkbox" onChange={(e) => this.handleCheck(e)} /></td>
                            </tr>
                        );
                    })}
                    </tbody>    
                </Table>
                
                <b><hr className="mt-5 mb-3"/></b>

                <CommentBox userId={this.props.userId} username={this.props.userName} jwt={this.props.jwt} section='Create'/>
                <div className="d-flex mt-5 mb-3" style={{justifyContent:"space-between"}}>
                    <Button
                        size="lg"
                        variant="primary"
                        onClick={() => this.props.handleNext('testPlanStatus_create', 0) }
                    >
                        Previous
                    </Button>
                    <div style={{display:"inline-flex"}}>
                        <Approve sectionName='Order Placement' approved={this.props.approved}  skipped={this.props.skipped}    disable={disableApprove}/>
                        {skip}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => (
    {
        userId: state.session.userId,
        userName: state.session.userName, 
        jwt: state.session.jwt
    }
);

export default connect(
    mapStateToProps
)(Review);
//export default Review;