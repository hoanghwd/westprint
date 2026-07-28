import React, { Component } from "react";
import axios from "axios";
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import { doToggleLoadClients } from '../../actions'
import { doSetOptions } from '../../actions'
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button  from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import Footer from "../Misc/Footer";
import SortButton from "../Misc/SortButton";


function getCookie(cName) {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(document.cookie); //to be careful
    const cArr = cDecoded.split('; ');
    let res;
    cArr.forEach(val => {
        if (val.indexOf(name) === 0) res = val.substring(name.length);
    })
    return res;
}

// Set a Cookie
function setCookie(cName, cValue, expDays) {
    let date = new Date();
    date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
}

const normalizeResponseData = data => {
    if (typeof data === 'string') {
        return JSON.parse(data);
    }

    return data;
};

const getJsonp = url => new Promise((resolve, reject) => {
    const callbackName = `westprintPortalData_${Date.now()}_${Math.round(Math.random() * 100000)}`;
    const script = document.createElement('script');
    const separator = url.indexOf('?') === -1 ? '?' : '&';
    const timeoutId = setTimeout(() => {
        cleanup();
        reject(new Error('Customer list request timed out'));
    }, 60000);

    function cleanup() {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script.parentNode) {
            script.parentNode.removeChild(script);
        }
    }

    window[callbackName] = data => {
        cleanup();
        resolve(normalizeResponseData(data));
    };

    script.onerror = () => {
        cleanup();
        reject(new Error('Customer list request failed'));
    };

    script.src = `${url}${separator}callback=${callbackName}`;
    document.body.appendChild(script);
});

const getClients = async (searchData, adminName) => {
    const { userName, clientStatus, page, limit, orderBy, descAsc = "desc", companyName } = searchData;
    const searchParams = `?userName=${userName}&companyName=${companyName}&clientStatus=${clientStatus}&page=${page}&limit=${limit}&orderBy=${orderBy}&descAsc=${descAsc}&adminName=${adminName}`;

    return await getJsonp(
        process.env.REACT_APP_WESTPRINT_API +
        process.env.REACT_APP_GET_CLIENTS +
        searchParams
    );
};

class ClientsTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            clients:[],
            page: 0,
            total: 0,
            limit: 10,
            orderBy: "id",
            isDataReady: false,
            error: "",
            dsc_userName: true,
            dsc_clientStatus: true,
            dsc_id: true,
            showModal:false,
            updateId:'',
            updateEmail:'',
            updatePassword:'',
            updateNewUserName:'',
            updateOldUserName:'',
            //updateClientStatus:'SALES_APPROVED'
            updateClientStatus:'',
            errorSubmit: false,
            loginAs: false
        };

        this.handleSort = this.handleSort.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handlePrevious = this.handlePrevious.bind(this);
        this.updateTable = this.updateTable.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleShowModal = this.handleShowModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.loadClients = this.loadClients.bind(this);

    }

    async loadClients(searchOptions, adminName) {
        const requestId = Date.now();
        this.activeClientsRequestId = requestId;
        this.setState({ isDataReady: false, error: "" });

        const timeoutId = setTimeout(() => {
            if (this._isMounted && this.activeClientsRequestId === requestId) {
                this.setState({
                    error: "Unable to load customer list. Please refresh the page or log in again.",
                    clients: [],
                    total: 0,
                    isDataReady: true
                });
            }
        }, 60000);

        try {
            const data = await getClients(searchOptions, adminName);

            if (!this._isMounted || this.activeClientsRequestId !== requestId) {
                return;
            }

            if (data.error) {
                this.setState({ error: data.error.text, clients: [], total: 0, isDataReady: true });
            }
            else {
                this.setState({
                    clients: Array.isArray(data.clients) ? data.clients : [],
                    total: data.total || 0,
                    isDataReady: true
                });
            }
        }
        catch (error) {
            if (this._isMounted && this.activeClientsRequestId === requestId) {
                this.setState({ error: error.message, clients: [], total: 0, isDataReady: true });
            }
        }
        finally {
            clearTimeout(timeoutId);
        }
    }

    async updateTable() {
        const descAsc = this.state["dsc_" + this.state.orderBy] ? "desc" : "asc";
        const extraOptions = { page: this.state.page, orderBy: this.state.orderBy, descAsc: descAsc }

        // if the request come from recent order page, just use the default options
        const searchOptions = {...this.props.searchOptions, ...extraOptions};
        const adminName = this.props.userName;

        await this.loadClients(searchOptions, adminName);
    }

    // update the table when submit search form
    componentDidUpdate(prevProps) {
        if (!prevProps.loadNewData && this.props.loadNewData) {
            this.props.onToggleLoadClientsFlag();
            this.setState({
                page: 0
            }, () => this.updateTable());
        }
    }

    // update the the table when first load
    async componentDidMount() {

        this._isMounted = true;
        const searchOptions = this.props.searchOptions;
        let adminName = getCookie('adminName');
        if( !adminName ) {
            adminName = this.props.userName;
            setCookie('adminName', adminName, 30);
        }

        await this.loadClients(searchOptions, adminName);

    }

    componentWillUnmount() {
        this._isMounted = false;
        this.activeClientsRequestId = null;
    }

    // ***************************************** */
    // Function to handle events for Pagination  */
    // ***************************************** */
    handleClick(e) {
        window.scrollTo(0, 500);
        this.setState({
            page: e.target.id - 1
        }, () => this.updateTable());
    }

    handlePrevious(e) {
        window.scrollTo(0, 500);
        e.preventDefault();
        this.setState({
            page: parseInt(this.state.page) - 1
        }, () => this.updateTable());
    }

    handleNext(e) {
        window.scrollTo(0, 500);
        e.preventDefault();
        this.setState({
            page: parseInt(this.state.page) + 1
        }, () => this.updateTable());
    }
    // End of Pagination functions

    handleSort(e) {
        window.scrollTo(0, 500);
        e.preventDefault();
        this.setState({
            orderBy: e.target.id,
            ["dsc_" + e.target.id]: !this.state["dsc_" + e.target.id]
        }, () => this.updateTable());
    }

    handleSubmit = async event => {

        event.preventDefault();

        const userId = this.state.updateId;
        const email = this.state.updateEmail;
        //const password = this.state.updatePassword;
        //const newUserName = this.state.updateNewUserName;
        const userName = this.state.updateOldUserName;
        const clientStatus = this.state.updateClientStatus;


        if(clientStatus === ''){
            this.setState({ errorSubmit: true });
        }else{

            const response = await axios.post(
                process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_UPDATE_CLIENT_STATUS,
                /*{ userId, userName, newUserName, password, clientStatus, email }*/
                { userId, userName, clientStatus, email }
            );

            if (response.data.error) {
                this.setState({ error: response.data.error.text });
            } else {
                this.updateTable()
            }
            //alert('Client updated! \n\n An email was sent to '+newUserName+ ' with the new credentials.')
            this.handleCloseModal()
        }

    };

    handleCloseModal() {
        this.setState({ showModal: false, updateClientStatus:''});
    }

    handleShowModal(id, userName, email) {
        this.setState({ updateId: id, updateOldUserName: userName, updateEmail: email, showModal: true, errorSubmit: false });
    }

    async loginAs (userName){

        const { jwt } = this.props;

        const response = await axios.post(
            process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_LOGIN_AS,
            { loginAs:userName } , {headers: {'Authorization': 'Bearer '+jwt} }
        );

        if (response.data.error) {

            this.setState({ error: response.data.error.text });

        } else {

            if (this.state.rememberMe) {

                let d = new Date();
                d.setTime( d.getTime() + parseInt(response.data.JWTExpires)*1000 );
                const expires = "expires=" + d.toUTCString();
                const rememberMe = "rememberMe=" + this.state.rememberMe;
                const jwt = "jwt=" + response.data.jwt;
                document.cookie = rememberMe + ";" + expires + ";" + jwt + ";" + expires + ";";
            }

            const {id, apiKey, phone, email, street, city, zip, state, country, shipUrl, level, userStatus, clientPortalStatuses, jwt, locations, order, request, status,
                clientStatuses, company} = response.data;

            this.props.handleLogin(
                true,
                id,
                userName,
                apiKey,
                phone,
                email,
                street,
                city,
                zip,
                state,
                country,
                shipUrl,
                level,
                userStatus,
                //response.data.locations,
                //response.data.status,
                clientPortalStatuses,
                jwt,
                company,
                this.props.userName
            );

            const options = {locations, order, request, status, clientStatuses};

            this.props.setOptions(options);
            localStorage.setItem('options', JSON.stringify(options));
            this.setState({ loginAs: true });

        }

    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value, errorSubmit: false });
    };


    render() {


        console.log(this.props.clientStatuses);

        if (this.state.loginAs) {
            return (
                <Redirect
                    to={{
                        pathname: "/myaccount/info"
                    }}
                />
            );
        }

        const clients = Array.isArray(this.state.clients) ? this.state.clients : [];
        const { isDataReady } = this.state;
        const clientStatuses = Array.isArray(this.props.clientStatuses) ? this.props.clientStatuses : [];
        const limit = parseInt(this.props.searchOptions.limit) || this.state.limit || 20;
        const pageCount = Math.ceil(parseInt(this.state.total) / limit);

        let errMsg;
        errMsg = this.state.errorSubmit && (
            <Alert variant = 'danger' >
                <ul>
                    <li>Please select the Customer Status</li>
                </ul>
            </Alert>
        );

        const header = (
            <thead>
                <tr>
                    <th>User ID</th>
                    <th>User Name &nbsp;
                        <SortButton
                            id="userName"
                            handleSort={this.handleSort}
                            btnSort={this.state.dsc_poNumber ? "fas fa-caret-down" : "fas fa-caret-up"}
                        />
                    </th>
                    <th>Company</th>
                    <th>Status &nbsp;
                        <SortButton
                            id="clientStatus"
                            handleSort={this.handleSort}
                            btnSort={this.state.dsc_total ? "fas fa-caret-down" : "fas fa-caret-up"}
                        />
                    </th>
                    <th>Email</th>
                    {/*<th>Phone</th>*/}
                    <th>Integration %</th>
                    <th>Login As</th>
                    {/*<th>Edit</th>*/}
                </tr>
            </thead>
        );

        if (!isDataReady) {
            return (
                <Table striped bordered hover>
                    {header}
                    <tbody>
                        <tr>
                            <td colSpan="8">Loading ...</td>
                        </tr>
                    </tbody>
                </Table>
            );
        }

        if (this.state.error) {
            return (
                <Alert variant="danger">
                    {this.state.error}
                </Alert>
            );
        }

        if (clients.length === 0) {
            return (
                <div className="OrdersTable">
                    No records found
                </div>
            )
        }

        return (
            <div className="OrdersTable">

                <Modal show={this.state.showModal} onHide={this.handleCloseModal} size="lg">

                    <Modal.Header closeButton>
                        <Modal.Title>Update Customer Info</Modal.Title>
                    </Modal.Header>

                    <Form onSubmit={this.handleSubmit}>

                        <Modal.Body>
                            {/*
                <Form.Group as={Row}>

                    <Form.Label column sm="2" className="text-right label">
                        User Name
                    </Form.Label>
                    <Col sm="9">
                        <Form.Control
                        className="input"
                        placeholder="User Name"
                        name="updateNewUserName"
                        onChange={this.handleChange}
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Form.Label column sm="2" className="text-right label">
                        Password
                    </Form.Label>
                    <Col sm="9">
                        <Form.Control
                        className="input"
                        placeholder="Password"
                        name="updatePassword"
                        onChange={this.handleChange}
                        />
                    </Col>
                </Form.Group>
                */}
                            <Form.Group as={Row}>
                                <Form.Label column sm="2" className="text-right label">
                                    Customer Status
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Control
                                        className="input"
                                        as="select"
                                        name="updateClientStatus"
                                        placeholder="Select One"
                                        value={this.state.status}
                                        onChange={this.handleChange}
                                    >
                                        <option>Select One</option>
                                        {clientStatuses.filter(status => status=== 'ENABLED' || status=== 'DISABLED' || this.props.level === 'advanced')
                                            .map(status => <option key={status}>{status}</option>)}

                                    </Form.Control>
                                </Col>
                            </Form.Group>

                            {errMsg}

                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleCloseModal}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit" >
                                Update Changes
                            </Button>
                        </Modal.Footer>
                    </Form>

                </Modal>

                <Table striped bordered hover>
                    {header}
                    <tbody>
                        {clients.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.userName}</td>
                                <td>{item.companyName}</td>
                                <td>{item.clientStatus}</td>
                                <td>{item.email}</td>
                                {/*<td>{item.phone}</td>*/}
                                <td>{item.integrationPercentage}</td>
                                <td><Button variant="primary" onClick={() => this.loginAs(item.userName)} >Login As</Button></td>
                                {/*
                {item.clientStatus === 'SALES_APPROVED ' || item.clientStatus === 'REGISTERED'
                  ? <td><Button variant="primary" onClick={() => this.handleShowModal(item.id, item.userName, item.email)} >Edit</Button></td>
                  : <td><Button variant="secondary" disabled>Edit</Button></td>
                }
              */}
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <Footer
                    page={this.state.page}
                    total={this.state.total}
                    offset={limit}
                    handleClick={this.handleClick}
                    handleNext={this.handleNext}
                    handlePrevious={this.handlePrevious}
                    pageCount={pageCount}
                />

            </div>
        );
    }
}

const mapStateToProps = state => (
    {
        searchOptions: state.searchClientsOption.searchOptions,
        userName: state.session.userName,
        level: state.session.level,
        jwt: state.session.jwt,
        loadNewData: state.searchClientsOption.loadNewData,
        clientStatuses: state.options.clientStatuses
    }
);

const mapDispatchToProps = dispatch => (
    {
        onToggleLoadClientsFlag: () => dispatch(doToggleLoadClients()),
        setOptions: options => dispatch(doSetOptions(options))
    }
);

//export default RecentOrders;
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ClientsTable);


