import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import Skip from '../../Shared/Skip';
import { connect } from 'react-redux'
import axios from "axios";
import Table from 'react-bootstrap/Table'
import Spinner from 'react-bootstrap/Spinner'
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'

const getTestPlan = async (userName, jwt) => {
    /*
    const section = 'Redo Order' 
    const searchParams = `?userName=${userName}&section=${section}`;
  
    return await axios.get(
      process.env.REACT_APP_WESTPRINT_API +
      process.env.REACT_APP_GET_TEST_PLAN +
      searchParams,  {headers: {'Authorization': 'Bearer '+jwt}}
    );
        */

    const section = 'Redo Order' 
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
};

/*
const p = `Submit the orders listed below for testing via our API. Once you have submitted all of the test orders listed, click the Next to continue. 
           If you click Next before submitting any test orders, no results will be shown in the next step.`
*/
class TestPlan extends Component {
    
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
        this._isMounted = true;
        this._justMonted = true;

        const { userName, jwt } = this.props;

        const response = await getTestPlan(userName, jwt)
        
        if (this._isMounted) {
            if (response.data.error) {
                this.setState({error: response.data.error});               
            } else {
                this.setState({ testPlan: response.data.cases, loading: false, allTestsApproved: response.data.allTestsApproved});
                this.props.handleSetAllTestsApproved(response.data.allTestsApproved)
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
        
        const {testPlan, loading, allTestsApproved} = this.state
        const nextPage = 'review_redo';
        const skip = (this.props.skipped  || this.props.approved) ? '' : (<Skip nextStage='status' score={75} />);
        var increasePercentage = this.props.asUser? 0 : 10 ;
        /*
        if (testPlan == null || testPlan.length === 0) {
            return (
                <div className="OrdersTable">
                    No test orders found for this account. To test Redo Order feature, please submit a few test orders.
                    <div className="d-flex justify-content-end mt-5 mb-3">
                        {skip}
                    </div>
                </div>
            )
        }
        */

        let nextButton;

        if(allTestsApproved || this.props.skipped  || this.props.approved){
            nextButton = <Button size="lg" variant="primary" onClick={(e) => this.props.handleNext(nextPage, increasePercentage, e)}>NEXT</Button>
        }else{
            nextButton = 
                    <OverlayTrigger
                        placement='top'
                        overlay={
                            <Tooltip id = 'tooltip-disabled' >
                                All the test cases should be approved.
                            </Tooltip>
                        }
                    >
                        <div className = 'wrapper'>
                            <Button className = 'btn-disabled' disabled = {true} size="lg" variant="primary">NEXT</Button>
                        </div>
                    </OverlayTrigger>
        }


        if (loading) {
            return (
                <div className="spinn-container">
                    <Spinner animation="border" variant="primary" />
                </div>
            )
        } else if (testPlan === null || testPlan.length === 0) {
            return (
                <div className="OrdersTable">
                    No test orders found for this account. To test Redo Order feature, please submit a few test orders.
                    <div className="d-flex justify-content-end mt-5 mb-3">
                        {skip}
                    </div>
                </div>
            )
        }

        return (
            <div className="ErrorCodes p-3">
            <h3><b>Test Plan Status</b></h3>    
            {/*<p>{p}</p>*/}
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
                        return (
                            <tr key = {i}>
                                <td>{i + 1}</td>
                                <td>{`1 ${item.testCase}`}</td>
                                <td className = 'center-align'><i className={'  fas '+ (item.isApproved === 'Y' ? 'fa-check color-blue' : 'fa-times color-red')} /></td>
                            </tr>
                        )
                    })}
                    </tbody>    
                </Table>

                <div className="d-flex mt-5 mb-3" style={{justifyContent:"space-between"}}>
                    <Button
                        size="lg"
                        variant="primary"
                        onClick={() => this.props.handleNext('testPlan_redo', 0) }
                    >
                        PREVIOUS
                    </Button>
                    {/*<Button size="lg" variant="primary" onClick={(e) => this.props.handleNext(nextPage, 10, e)}>NEXT</Button>*/}
                    <div style={{display:"inline-flex"}}>
                        {nextButton}
                        {skip}
                    </div>
                </div>
            </div>
        );
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
)(TestPlan);
