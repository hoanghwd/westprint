import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from "axios";
import {doLogIn, doLogOut, doSetOptions, clearState, doSetStateFromDB} from './actions'
import './App.css';
import Routes from './Routes';

class App extends Component {
    constructor(props) {
        super(props);

        this.handleLogin = this.handleLogin.bind(this);
        this.clearData = this.clearData.bind(this);
        this.updateClientStatus = this.updateClientStatus.bind(this);
    }

    componentDidMount() {

        const session = localStorage.getItem('userData');
        const options = localStorage.getItem('options');
        let apiStatus = localStorage.getItem('status');
        const expire = localStorage.getItem('expire');

        if (expire !== null && expire > Date.now()) {
            if (session !== null) {
                this.props.logIn(JSON.parse(session));
            }

            if (apiStatus !== null) {
                apiStatus = JSON.parse(apiStatus);
                if (apiStatus !== null) {
                    this.props.setStateFromDB(apiStatus.sectionStatus, apiStatus.curStage, apiStatus.curPage, apiStatus.integrationPercentage)
                }
            }

            if (options !== null) {
                this.props.setOptions(JSON.parse(options));
            }
        } else {
            this.updateClientStatus();
            localStorage.clear();
            this.props.logOut();
        }
    }

    deleteCookie(name) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    async updateClientStatus() {
        const {userName, jwt} = this.props.session;
        const {sectionName, curStage, curPage, percentage} = this.props;
        const sectionStatus = 'In Progress';

        const response = await axios.post(
            process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_UPDATE_PORTAL_STATUS,
            {userName, sectionName, sectionStatus, curStage, curPage, percentage},
            {headers: {'Authorization': 'Bearer ' + jwt}}
        );

        if (response.data.errors) {
            this.setState({
                error: response.data.errors
            });
        }
    }

    clearData() {

        this.deleteCookie('jwt');
        this.deleteCookie('rememberMe');
        //localStorage.clear();
        localStorage.removeItem('status');
        localStorage.removeItem('userData');
        localStorage.removeItem('options');
        //localStorage.removeItem('expire');

        this.props.logOut();
        this.props.clearState();


        if (this.props.asUser) {
            console.log('in clearData as: ' + this.props.asUser)
            const sessionAs = localStorage.getItem('userDataAs');
            const expireAs = localStorage.getItem('expireAs');

            console.log(sessionAs);

            if (expireAs !== null && expireAs > Date.now()) {
                if (sessionAs !== null) {
                    console.log('login back AS')
                    console.log(sessionAs)
                    //this.props.logIn(JSON.parse(sessionAs));

                    const {
                        userId, apiKey, phone, email, street, city, zip, state, country, shipUrl, level, userStatus, clientPortalStatuses, jwt,
                        company, userName
                    } = JSON.parse(sessionAs);

                    console.log(userId)
                    console.log(apiKey)
                    console.log(phone)
                    console.log(userName)
                    console.log(email)
                    console.log(street)
                    console.log(city)
                    console.log(zip)
                    console.log(state)
                    console.log(country)
                    console.log(shipUrl)
                    console.log(level)
                    console.log(userStatus)
                    console.log(clientPortalStatuses)
                    console.log(jwt)
                    console.log(company)

                    this.handleLogin(
                        true,
                        userId,
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
                        company
                    );

                    const optionsAs = localStorage.getItem('optionsAs');
                    console.log('optionsAs')
                    console.log(optionsAs)
                    this.props.setOptions(JSON.parse(optionsAs));
                    localStorage.setItem('options', optionsAs);

                }
            }

        } else {
            localStorage.clear();
        }
    }

    handleLogin = (isLoged, userId = null, userName = null, apiKey = null, phone = null, email = null, street = null, city = null, zip = null,
                   state = null, country = null, shipUrl = null, level = null, userStatus = null, clientPortalStatuses = null, jwt = '', company = '', asUser = false, orderOrigin = null) => {

        if (isLoged) {

            //console.log('clientPortalStatuses: '+clientPortalStatuses);

            const session = {
                logged: true,
                userId: userId,
                userName: userName,
                apiKey: apiKey,
                phone: phone,
                email: email,
                street: street,
                city: city,
                state: state,
                zip: zip,
                country: country,
                shipUrl: shipUrl,
                level: level,
                userStatus: userStatus,
                clientPortalStatuses: clientPortalStatuses,
                jwt: jwt,
                company: company,
                asUser: asUser,
                orderOrigin: orderOrigin
            }

            // set expire time 1 hour
            const expire = Date.now() + 3600000;
            localStorage.setItem('status', JSON.stringify(clientPortalStatuses))
            localStorage.setItem('userData', JSON.stringify(session));
            localStorage.setItem('expire', expire);

            if (level !== 'basic') {

                console.log('create storage AS');
                const expireAs = Date.now() + 3600000;
                localStorage.setItem('statusAs', JSON.stringify(clientPortalStatuses))
                localStorage.setItem('userDataAs', JSON.stringify(session));
                localStorage.setItem('expireAs', expireAs);

                console.log(localStorage.getItem('userDataAs'));

            }


            //this.setState({ logged: true, userId, userName, apiKey, phone, email });
            this.props.logIn({
                userId,
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
                clientPortalStatuses,
                jwt,
                company,
                asUser,
                orderOrigin
            });

            if (clientPortalStatuses !== null) {

                this.props.setStateFromDB(clientPortalStatuses.sectionStatus, clientPortalStatuses.curStage, clientPortalStatuses.curPage, clientPortalStatuses.integrationPercentage);

            }

            // set expire time 1 hour
            //const expire = Date.now() + 3600000;

            //sessionStorage.setItem('userData', JSON.stringify(this.state));

            //localStorage.setItem('status', JSON.stringify(clientPortalStatuses))
            //localStorage.setItem('userData', JSON.stringify(this.props.session));
            //localStorage.setItem('expire', expire);

        } else {
            this.clearData();
        }

    }

    render() {
        let session = this.props.session;
        console.log('session')
        console.log(session)

        let localStorageSession = JSON.parse(localStorage.getItem('userData'));

        if (localStorageSession !== null && session.userId === null) {
            session = localStorageSession;
        }

        return (
            <div>
                <Routes
                    handleLogin={this.handleLogin}
                    userId={session.userId} {...session} />
            </div>
        );
    }
}

const mapStateToProps = state => (
    {
        session: state.session,
        sectionName: state.handler.curStage,
        curStage: state.handler.curStage,
        curPage: state.handler.curPage,
        percentage: state.handler.progress,
        handler: state.handler,
        asUser: state.session.asUser
    }
);

const mapDispatchToProps = dispatch => (
    {
        logIn: userData => dispatch(doLogIn(userData)),
        logOut: () => dispatch(doLogOut()),
        clearState: () => dispatch(clearState()),
        setStateFromDB: (sectionStatus, curStage, curPage, progress) => dispatch(doSetStateFromDB(sectionStatus, curStage, curPage, progress)),
        setOptions: options => dispatch(doSetOptions(options))
    }
);

//export default App;
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
