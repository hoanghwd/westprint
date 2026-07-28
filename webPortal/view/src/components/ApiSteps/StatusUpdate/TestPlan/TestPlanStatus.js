import React, { Component } from "react"
import { connect } from 'react-redux'
import axios from "axios";
import Skip from '../../Shared/Skip';

import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import Spinner from 'react-bootstrap/Spinner'
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'

//import "../Create.css";



const getTestPlan = async (userName, jwt) => {
    const section = 'Status Update' 
    const searchParams = `?userName=${userName}&section=${section}`;
    
    //const responseTestPlan =   
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
  
    /*
    return await axios.get(
      process.env.REACT_APP_WESTPRINT_API +
      process.env.REACT_APP_GET_TEST_PLAN +
      searchParams,  {headers: {'Authorization': 'Bearer '+jwt}}
    );
    */

};

const p = ``

class TestPlanStatus extends Component {
    _isMounted = false;

    _justMonted = false;
    _justUpdated = false;

    constructor(props) {
        super(props);
    
        this.state = {
          testPlan: [],
          loading: true,
          allTestsApproved: false      
        };
    
    }

    // update the table when submit search form
    async componentDidMount() {
    //async componentDidUpdate() {
        this._isMounted = true;
        this._justMonted = true;

        const { userName, jwt } = this.props;

        const response = await getTestPlan(userName, jwt)
        if (this._isMounted) {
            if (response.data.cases) {
                this.setState({ testPlan: response.data.cases, loading: false});
                this.props.handleSetAllTestsApproved(response.data.allTestsApproved)
                //this.props.handleSetAllTestsApproved(true)
            }
        }        
    }
        
    componentWillUnmount() {
        this._isMounted = false;
    }

    async componentDidUpdate() {
       
        if(!this._justMonted && !this._justUpdated){
            //alert(1)

            const { userName, jwt } = this.props;

            const response = await getTestPlan(userName, jwt)
           
            this._justUpdated = true;

            if (response.data.cases) {
                this.setState({ testPlan: response.data.cases, loading: false});
                this.props.handleSetAllTestsApproved(response.data.allTestsApproved)
            }
           
            
        }else{
            
            this._justUpdated = false;
        }
       
        window.scrollTo(0, 0);
        this._justMonted = false;
    }

    render() {
        
        const {testPlan, loading } = this.state
        var testCaseText;
        const nextPage = 'review_status';
        const skip = (this.props.skipped  || this.props.approved) ? '' : (<Skip nextStage='cancel' score={100} />);
        var increasePercentage = this.props.asUser? 0 : 5 ;

        if (loading) {
            return (
                <div className="spinn-container">
                    <Spinner animation="border" variant="primary" />
                </div>
            )
        } else if (testPlan === null || testPlan.length === 0) {
            return (
                <div className="OrdersTable">
                    No test orders found for this account. To test Place Order feature, please submit a few test orders.
                    <div className="d-flex justify-content-end mt-5 mb-3">
                        {skip}
                    </div>
                </div>
            )
        }      

        return (
            
            <div className="ErrorCodes p-3">
                
                <h3><b>Test Plan Status</b></h3>
                <p>{p}</p>
                <hr />
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>Test Case</th>
                        {/*<th>Category</th>*/}
                        <th className = 'center-align'>Approved</th>
                        </tr>
                    </thead>
                    <tbody>
                    {testPlan.map( (item, i) => {
                        
                        {/*
                        if (item.testingCatagory === 'Products' && item.section === 'Order Placement'){
                            testCaseText = `1 order / ${item.testCase}`
                            testCaseText = item.subTestCase !== '' ? testCaseText + ' - ' +item.subTestCase : testCaseText  
                        }else if (item.testingCatagory === 'Shipping Zones'){
                            testCaseText = `1 order  / ${item.testCase}`
                        }else if (item.testingCatagory === 'Shipping Types'){
                            var tmp = item.testCase.split(' - ')
                            if(typeof tmp[1] !== "undefined"){
                                var carrier = tmp.shift();
                                var type = tmp.join(' ')
                                testCaseText = `1 order / ${carrier + ' (Ex: ' + type + ')'}`
                            }else{
                                testCaseText = `1 order / ${item.testCase}`
                            }
                        }else if (item.testingCatagory === 'Validations'){
                            testCaseText = `Use ${item.testCase}`
                        }else if (item.section === 'Cancel Order' && item.testCase === 'Cancel Order' ){
                            testCaseText = 'Cancel an Order'
                        }else if (item.section === 'Redo Order' && item.testCase === 'Redo Order' ){
                            testCaseText = 'Redo an Order'
                        }else{
                            testCaseText = ''
                        }
                        */}

                        testCaseText = item.testCase
                        return (
                            <tr key = {i}>
                            <td>{i + 1}</td>
                            <td>{testCaseText}</td>
                            {/*<td>{item.testingCatagory}</td>*/}
                            <td className = 'center-align'><i className={'  fas '+ (item.isApproved === 'Y' ? 'fa-check color-blue' : 'fa-times color-red')} /></td>
                            </tr>
                        )
                    })}
                    </tbody>    
                </Table>

                <div className="d-flex justify-content-end mt-5 mb-3">
                    <Button size="lg" variant="primary" onClick={(e) => this.props.handleNext(nextPage, increasePercentage, e)}>NEXT</Button>
                    {skip}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => (
    {
        userName: state.session.userName, 
        jwt: state.session.jwt
    }
);

export default connect(
    mapStateToProps
)(TestPlanStatus);
//export default TestPlan;
