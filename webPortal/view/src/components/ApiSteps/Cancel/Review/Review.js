import React, { Component } from "react"
import { connect } from 'react-redux'
import Skip from '../../Shared/Skip'
import axios from "axios"
import Table from 'react-bootstrap/Table'
import Approve from '../../Shared/Approve'
import CommentBox from '../../Shared/Comment/CommentBox'
import Spinner from 'react-bootstrap/Spinner'
import { Link } from 'react-router-dom';
import Button from "react-bootstrap/Button";

const getTestPlan = async (userName, jwt) => {
    //const searchParams = `?userName=${userName}&testMode=1&statusUpdate=1&review=1&status=cancelled`;
    const searchParams = `?userName=${userName}&status=cancelled&testMode=1`;
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
          totalOrders:0,
          ordersApprovedNumber:0,
          loading: true,
          error: '',
          scrollUp: true        
        };

    }

    // update the table when submit search form
    async componentDidMount() {
        this._isMounted = true;

        const { userName, jwt } = this.props;

        const response = await getTestPlan(userName, jwt)
        if (response.data.error) {
            this.setState({ error: response.data.error });
        } else {
            this.setState({ orders: response.data.orders, totalOrders: response.data.orders.length, loading: false});
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    
    componentDidUpdate() {
        if(this.state.scrollUp){
            window.scrollTo(0, 0);
        }
    }    

    handleCheck(event) {
        //alert(event.target.checked)
        //alert(this.state.ordersApprovedNumber)
        if(event.target.checked) {
            this.setState(state => {
                 return {ordersApprovedNumber: state.ordersApprovedNumber + 1, scrollUp:false}
            });
        } else {
            this.setState(state => {
                return {ordersApprovedNumber: state.ordersApprovedNumber - 1, scrollUp:false}
            });
        }
    }


    render() {
        const {orders, loading} = this.state
        const skip = (this.props.skipped || this.props.approved) ? '' : (<Skip nextStage='redo' score={50}/>);        
        

        //console.log('props ',this.props)
        //console.log('allTestsApproved ',this.props.allTestsApproved)
        //console.log('totalOrders ',this.state.totalOrders)
        //console.log('ordersApprovedNumber ',this.state.ordersApprovedNumber)
        //const disableApprove = !this.props.allTestsApproved || this.state.totalOrders !== this.state.ordersApprovedNumber;

        const disableApprove = !this.props.allTestsApproved && !this.props.approved;
        //console.log('approved ',this.props.approved)
        //console.log('disableApprove ',disableApprove)
        if (loading) {
            return (
                <div className="spinn-container">
                    <Spinner animation="border" variant="primary" />
                </div>
            )
        }else if (orders === null || orders.length === 0) {
            return (
                <div className="OrdersTable">
                    No test orders found for this account. To test Cancel Order feature, please submit a few test orders.
                    <div className="d-flex mt-5 mb-3" style={{justifyContent:"space-between"}}>
                        <Button
                            size="lg"
                            variant="primary"
                            onClick={() => this.props.handleNext('testPlanStatus_cancel', 0) }
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

        return (
            
            <div className="ErrorCodes p-3">
                <h3><b>Review Results</b></h3>

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Po Number</th>
                            <th>Order Status</th>
                            <th>Request & Response</th>
                            {/*<th>Approve</th>*/}
                        </tr>
                    </thead>

                    <tbody>
                    {orders.map( (order, i) => {
                        {/*<Link to={"/viewXml/" + order.logId} className="link">View</Link>*/}
                        return (
                            <tr key = {i}>
                                <td>{order.poNumber}</td>
                                <td>{order.status}</td>
                                <td>
                                  {order.logId ? (
                                    <a target="_blank" href={`#/viewXml/` + order.logId}>View</a>
                                  ) : (
                                    'NA' 
                                  )} 
                                </td>
                                {/*<td >
                                    
                                    <input name={"approve_"+i} type="checkbox" onChange={(e) => this.handleCheck(e)} />
                                    
                                </td>*/}
                            </tr>
                        );
                    })}
                    </tbody>    
                </Table>
                
                <b><hr className="mt-5 mb-3"/></b>

                <CommentBox userId={this.props.userId} username={this.props.userName} jwt={this.props.jwt} section='Status'/>

                <div className="d-flex mt-5 mb-3" style={{justifyContent:"space-between"}}>
                    <Button
                        size="lg"
                        variant="primary"
                        onClick={() => this.props.handleNext('testPlanStatus_cancel', 0) }
                    >
                        Previous
                    </Button>
                    <div style={{display:"inline-flex"}}>
                        <Approve approved={this.props.approved} skipped={this.props.skipped} disable={disableApprove} buttonText = 'Approve' curStage = "cancel" sectionName = 'Cancel Order'/>

                        {/*<Approve approved={false} disable={false} buttonText = 'Approve' curStage = "Cancel Order" />*/}

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