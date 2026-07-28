import React, {Component} from "react";
import axios from "axios";
import {connect} from 'react-redux';
import {doToggleLoadClients, doUpdateSearchClientsOptions} from '../../actions'
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Autosuggest from 'react-autosuggest';

const theme = {
    container: {
        position: 'relative'
    },
    input: {
        width: 240,
        height: 30,
        padding: '10px 20px',
        fontFamily: 'Helvetica, sans-serif',
        fontWeight: 300,
        fontSize: 16,
        border: '1px solid #aaa',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
    },
    inputFocused: {
        outline: 'none'
    },
    inputOpen: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
    },
    suggestionsContainer: {
        display: 'none'
    },
    suggestionsContainerOpen: {
        display: 'block',
        position: 'absolute',
        top: 51,
        width: 280,
        border: '1px solid #aaa',
        backgroundColor: '#fff',
        fontFamily: 'Helvetica, sans-serif',
        fontWeight: 300,
        fontSize: 16,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        zIndex: 100
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    },
    suggestion: {
        cursor: 'pointer',
        padding: '10px 20px'
    },
    suggestionHighlighted: {
        backgroundColor: '#ddd'
    }
};

function getCookie(cName) {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(document.cookie); //to be careful
    const cArr = cDecoded .split('; ');
    let res;
    cArr.forEach(val => {
        if (val.indexOf(name) === 0) res = val.substring(name.length);
    })
    return res;
}

const getAllClients = async (adminName, jwt) => {
    const searchParams = `?orderBy=userName&descAsc=desc&adminName=${adminName}`;

    //http://hdo-jondo.jondodev.com/webPortal/api/listClients.php?userName=&companyName=undefined&clientStatus=&page=0&limit=20&orderBy=id&descAsc=desc&adminName=hdo
    return await axios.get(
        process.env.REACT_APP_WESTPRINT_API +
        process.env.REACT_APP_GET_CLIENTS +
        searchParams, {headers: {'Authorization': 'Bearer '+jwt}}
    );
};

class SearchForm extends Component {

    constructor(props) {
        super(props);

        console.log(this.props)

        this.state = {
            clientStatus: '',
            companyName: '',
            userName: '',

            allClients: [], //{"clients":[{}..{}],"total":123}
            companyNameSuggestionsList: [],
            userNameSuggestionsList: []
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClientStatusChange = this.handleClientStatusChange.bind(this);
        this.handleClearResults = this.handleClearResults.bind(this);
    }

    /// -- Common events ----

    // update the the table when first load
    async componentDidMount() {

        //let adminName = this.props.userName;
        //if(adminName == '') {
        let  adminName = getCookie('adminName');
        //}
        const jwt = this.props.jwt;
        const responseData = await getAllClients(adminName, jwt);

        if (responseData.data.error) {
            this.setState({error: responseData.data.error.text});
        }
        else {
            //responseData.data = {"clients":[{}..{}],"total":123}
            this.setState({ allClients: responseData.data.clients });
        }
    }

    handleSubmit = event => {
        event.preventDefault();
        const searchOptions = this.state;
        this.props.onUpdateSearchClientsOptions(searchOptions);
        this.props.onToggleLoadClientsFlag();
    };

    handleClientStatusChange = event => {
        this.setState({[event.target.name]: event.target.value});
    };

    handleClearResults = () => {
        this.setState({
            companyName: "",
            userName: "",
            clientStatus: ""
        });
    };

    // --- Company ---

    onCompanySuggestionsFetchRequested = ({ value }) => {
        this.setState({
            companyNameSuggestionsList: this.getCompanyNameSuggestions(value)
        });
    };

    getCompanyNameSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        const allClients = this.state.allClients;
        const selectedUser = this.state.userName.trim();
        const mySuggestList =
            inputLength === 0 ? [] :
                allClients.filter( client =>
                    client.companyName.toLowerCase().slice(0, inputLength) === inputValue
                );

        /**
         * Remove duplicated company Name
         * @type {*[]}
         */
        let dedupeCompanyList = [];
        let companyArray = [];
        let finalCompanyList = [];

        if( inputLength > 0 ) {
            for (let i = 0; i < mySuggestList.length; i++) {
                let currCompanyName = mySuggestList[i].companyName.trim();
                let index = companyArray.indexOf(currCompanyName);
                if (index < 0) {
                    companyArray.push(currCompanyName);
                    dedupeCompanyList.push(mySuggestList[i]);
                }
            }//for

            /**
             * Only suggest companies own these usernames
             */
            if( selectedUser !== '' ) {
                for (let i = 0; i < mySuggestList.length; i++) {
                    let currentUser = mySuggestList[i].userName.trim();
                    if( currentUser === selectedUser ) {
                        finalCompanyList.push(mySuggestList[i]);
                    }
                }//for

                //return finalCompanyList.sort((a,b)=> (a.companyName > b.companyName ? 1 : -1))
                return finalCompanyList.reverse();
            }
        }

        //return dedupeCompanyList.sort((a,b)=> (a.companyName > b.companyName ? 1 : -1))
        return dedupeCompanyList.reverse();
    };

    onCompanySuggestionsClearRequested = () => {
        this.setState({
            companyNameSuggestionsList: []
        });
    };

    onCompanyChange = (event, { newValue }) => {
        this.setState({
            companyName: newValue
        });
    };

    getSuggestionCompanyValue = suggestion => {

        this.setState({companyName: suggestion.companyName});

        return suggestion.companyName;
    }

    renderCompanyNameSuggestion = suggestion => (
        <div>
            {suggestion.companyName}
        </div>
    );

    // --- User name ---

    onUsernameSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            userNameSuggestionsList: this.getUserNameSuggestions(value)
        });
    };

    getUserNameSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        const allClients = this.state.allClients;
        const selectedCompany = this.state.companyName;
        const mySuggestList =
            inputLength === 0 ? [] :
                allClients.filter( client => client.userName.toLowerCase().slice(0, inputLength) === inputValue );

        /**
         * We will only suggest those usernames that belong to the company
         */
        if( inputLength > 0 && selectedCompany !== '' ) {
            let newUsernameList = [];
            for (let i = 0; i < mySuggestList.length; i++) {
                let currCompanyName = mySuggestList[i].companyName.trim();
                if ( currCompanyName.trim() === selectedCompany.trim() ) {
                    newUsernameList.push(mySuggestList[i]);
                }
            }//for

            //return newUsernameList.sort((a,b)=> (a.userName > b.userName ? 1 : -1))
            return newUsernameList.reverse();
        }

        //return mySuggestList.sort((a,b)=> (a.userName > b.userName ? 1 : -1))
        return mySuggestList.reverse();
    };

    onUsernameSuggestionsClearRequested = () => {
        this.setState({
            userNameSuggestionsList: []
        });
    };

    onUsernameChange = (event, { newValue }) => {
        this.setState({
            userName: newValue
        });
    };

    getSuggestionUserNameValue = suggestion => {

        this.setState({userName: suggestion.userName});

        return suggestion.userName;
    }

    renderUserNameSuggestion = suggestion => (
        <div>
            {suggestion.userName}
        </div>
    );

    render() {
        const {
            companyName,
            companyNameSuggestionsList,
            userName,
            userNameSuggestionsList
        } = this.state;

        const companyNameInputProps = {
            placeholder: 'Search Company Name',
            value: companyName,
            onChange: this.onCompanyChange
        };

        const userNameInputProps = {
            placeholder: 'Search User Name',
            value: userName,
            onChange: this.onUsernameChange
        };

        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Group as={Row}>
                    <Form.Label column sm="2" className="text-right label">
                        Company Name
                    </Form.Label>
                    <Col sm="9">
                        <Autosuggest
                            suggestions={companyNameSuggestionsList}
                            onSuggestionsFetchRequested={this.onCompanySuggestionsFetchRequested}
                            onSuggestionsClearRequested={this.onCompanySuggestionsClearRequested}
                            getSuggestionValue={this.getSuggestionCompanyValue}
                            renderSuggestion={this.renderCompanyNameSuggestion}
                            inputProps={companyNameInputProps}
                            theme={theme}
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Form.Label column sm="2" className="text-right label">
                        User Name
                    </Form.Label>
                    <Col sm="9">
                        <Autosuggest
                            suggestions={userNameSuggestionsList}
                            onSuggestionsFetchRequested={this.onUsernameSuggestionsFetchRequested}
                            onSuggestionsClearRequested={this.onUsernameSuggestionsClearRequested}
                            getSuggestionValue={this.getSuggestionUserNameValue}
                            renderSuggestion={this.renderUserNameSuggestion}
                            inputProps={userNameInputProps}
                            theme={theme}
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Form.Label column sm="2" className="text-right label">
                        User Status
                    </Form.Label>
                    <Col sm="9">
                        <Form.Control
                            className="input"
                            as="select"
                            name="clientStatus"
                            value={this.state.clientStatus}
                            onChange={this.handleClientStatusChange}>
                            <option>ALL</option>
                            {this.props.clientStatuses.map(status => <option key={status}>{status}</option>)}
                        </Form.Control>
                    </Col>
                </Form.Group>

                <Row>
                    <Col sm={2}/>
                    <Col sm={9}>
                        <Button className="mr-3" variant="primary" type="submit" size="lg" onClick={this.handleSubmit}>
                            SEARCH
                        </Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}

const mapStateToProps = state => ({
        searchOptions: state.searchClientsOption.searchOptions,
        clientStatuses: state.options.clientStatuses,
        userName: state.session.userName,
        jwt: state.session.jwt
    }
);

const mapDispatchToProps = dispatch => ({
    onToggleLoadClientsFlag: () => dispatch(doToggleLoadClients()),
    onUpdateSearchClientsOptions: searchOptions => dispatch(doUpdateSearchClientsOptions(searchOptions))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchForm);
