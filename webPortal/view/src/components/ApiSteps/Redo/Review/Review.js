import React, { Component } from "react"
import { connect } from 'react-redux'
import axios from "axios"
import Skip from '../../Shared/Skip'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import Modal from "react-bootstrap/Modal"
import Approve from '../../Shared/Approve'
import CommentBox from '../../Shared/Comment/CommentBox'
import Spinner from 'react-bootstrap/Spinner'

const getTestOrders = async (userName, jwt) => {
   
    const searchParams = `?userName=${userName}&testMode=1&status=redo`;
  
    return await axios.get(
      process.env.REACT_APP_WESTPRINT_API +
      process.env.REACT_APP_GET_ORDERS +
      searchParams,  {headers: {'Authorization': 'Bearer '+jwt}}
    );

};

class Review extends Component {
    _isMounted = false;

    constructor(props) {
        
        super(props);
    
        this.state = {
          orders: [],
          items:[],
          showModal: false,
          goTonext: false,
          totalOrders:0,
          ordersApprovedNumber:0,
          error: '',
          scrollUp: true,
          loading: true           
        };

        this.handleShowModal = this.handleShowModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    // update the table when submit search form
    async componentDidMount() {
        this._isMounted = true;
            
        const { userName, jwt } = this.props;

        const response = await getTestOrders(userName, jwt)
        
        if (this._isMounted) {
            if (response.data.error) {
                this.setState({ error: response.data.error });
            } else {
                this.setState({ orders: response.data.orders, totalOrders: response.data.orders.length, loading: false});
            }
        }        
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    /*
    componentDidUpdate() {
        window.scrollTo(0, 0);
    }
    */

    componentDidUpdate() {
        if(this.state.scrollUp){
            window.scrollTo(0, 0);
        }
    }  

    handleShowModal(items) {
        this.setState({ items, showModal: true });
    }

    handleCloseModal() {
        this.setState({ showModal: false });
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
    
    render() {
        
        //const nextStage = 'cancel';
        //alert('this.props.approved: ' + this.props.approved)
        //alert('totalOrders and ordersApprovedNumber: '+ this.state.totalOrders + ' ' + this.state.ordersApprovedNumber)
        //alert('allTestsApproved: ' + this.props.allTestsApproved )
        const disableApprove = !this.props.allTestsApproved || this.state.totalOrders !== this.state.ordersApprovedNumber
        
        const skip = (this.props.skipped || this.props.approved) ? '' : (<Skip nextStage='status' score={75} />);
        const {orders, items, loading} = this.state;
        
        if (loading) {
            return (
                <div className="spinn-container">
                    <Spinner animation="border" variant="primary" />
                </div>
            )
        } else if (orders === null || orders.length === 0) {
            return (
                <div className = "OrdersTable">
                    No test orders found for this account. To test Redo Order feature, please submit a few test orders.
                    <div className="d-flex mt-5 mb-3" style={{justifyContent:"space-between"}}>
                        <Button
                            size="lg"
                            variant="primary"
                            onClick={() => this.props.handleNext('testPlanStatus_redo', 0) }
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
                        <Modal.Title>Order Details</Modal.Title>
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
                                    </tr>
                                );
                            })}
                    </tbody>    
                        </Table>
                    </Modal.Body>

                    <Modal.Footer></Modal.Footer>
                
                </Modal>                
                
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>PO/Order #</th>
                        <th>Order Date</th>
                        <th>Shipping Type</th>
                        <th>Shipping Address</th>
                        <th>Redo Type</th>
                        <th>Redo Code</th>
                        <th>Redo Reason</th>
                        <th>Total Price</th>
                        <th>Total Shipping</th>
                        <th>More</th>
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
                                <td>{`${order.address} ${order.state} ${order.zip} `}</td>
                                <td>{order.redoType}</td>
                                <td>{order.redoCode}</td>
                                <td>{order.redoReason}</td>
                                <td>${order.total}</td>
                                <td>${order.shipping}</td>
                                <td><Button variant="link" onClick={() => this.handleShowModal(order.items)}>More Info</Button></td>
                                <td><input name={"approve_"+i} type="checkbox" onChange={(e) => this.handleCheck(e)} /></td>
                            </tr>
                        );
                    })}
                    </tbody>    
                </Table>
                
                <b><hr className="mt-5 mb-3"/></b>

                <CommentBox userId={this.props.userId} username={this.props.userName} jwt={this.props.jwt} section='Redo'/>
                <div className="d-flex mt-5 mb-3" style={{justifyContent:"space-between"}}>
                    <Button
                        size="lg"
                        variant="primary"
                        onClick={() => this.props.handleNext('testPlanStatus_redo', 0) }
                    >
                        Previous
                    </Button>
                    <div style={{display:"inline-flex"}}>
                        <Approve approved={this.props.approved} skipped={this.props.skipped} disable={disableApprove} curStage = 'redo'/>
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