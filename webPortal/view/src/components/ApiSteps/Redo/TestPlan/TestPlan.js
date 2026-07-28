import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import Skip from '../../Shared/Skip';
import { connect } from 'react-redux'
import axios from "axios";
import Table from 'react-bootstrap/Table'

const getTestPlan = async (userName, jwt) => {
    const section = 'Redo Order' 
    const searchParams = `?userName=${userName}&section=${section}`;
  
    return await axios.get(
      process.env.REACT_APP_WESTPRINT_API +
      process.env.REACT_APP_GET_TEST_PLAN +
      searchParams,  {headers: {'Authorization': 'Bearer '+jwt}}
    );

};

const p = `Submit the orders listed below for testing via our API. Once you have submitted all of the test orders listed, click the Next to continue. 
           If you click Next before submitting any test orders, no results will be shown in the next step.`

class TestPlan extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
    
        this.state = {
          testPlan: []
        };
    
    }

    // update the table when submit search form
    async componentDidMount() {
        this._isMounted = true;

        const { userName, jwt } = this.props;

        const response = await getTestPlan(userName, jwt)
        
        if (this._isMounted) {
            if (response.data.error) {
                this.setState({error: response.data.error});               
            } else {
                this.setState({ testPlan: response.data.cases});
            }
        }        
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidUpdate() {
        window.scrollTo(0, 0);
    }

    render() {
        const {testPlan} = this.state
        const nextPage = 'testPlanStatus_redo';
        const skip = (this.props.skipped || this.props.approved) ? '' : (<Skip nextStage='status' score={75} />);
        var increasePercentage = this.props.asUser? 0 : 4 ;

        if (testPlan == null || testPlan.length === 0) {
            return (
                <div className="OrdersTable">
                    No test orders found for this account. To test Redo Order feature, please submit a few test orders.
                    <div className="d-flex mt-5 mb-3" style={{justifyContent:"space-between"}}>
                        <Button
                            size="lg"
                            variant="primary"
                            onClick={() => this.props.handleNext('errors2_redo', 0) }
                        >
                            PREVIOUS
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
            <p>{p}</p>
                <hr />
                <Table striped bordered hover>
                    <thead variant="dark">
                        <tr>
                        <th className="table-header-balck" colSpan="3">API TEST PLAN</th>
                        </tr>
                    </thead>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Test Case</th>
                        </tr>
                    </thead>
                    <tbody>
                    {testPlan.map( (item, i) => {
                        return (
                            <tr key = {i}>
                                <td>{i + 1}</td>
                                <td>{`1 ${item.testCase}`}</td>
                            </tr>
                        )
                    })}
                    </tbody>    
                </Table>

                <div className="d-flex mt-5 mb-3" style={{justifyContent:"space-between"}}>
                    <Button
                        size="lg"
                        variant="primary"
                        onClick={() => this.props.handleNext('errors2_redo', 0) }
                    >
                        PREVIOUS
                    </Button>
                    <div style={{display:"inline-flex"}}>
                        <Button size="lg" variant="primary" onClick={(e) => this.props.handleNext(nextPage, increasePercentage, e)}>NEXT</Button>
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
