import React, {Component} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import {Link} from "react-router-dom";
import {connect} from 'react-redux';
import './Navbar.css';


class NavBot extends Component {
    render() {
        const {level} = this.props;
        //const {userStatus} = this.props.userStatus;

        let progress = '';
        if (this.props.progress < 100 && this.props.userStatus != "ENABLED") {
            //progress = (<Link to="/api/steps" className="dropdown-item">  Initiate Step-by-Step API Process </Link>);
            progress = (<Link to="/api/steps" className="dropdown-item"> API Onboarding </Link>);

        }

        let adminTap = '';
        let catalogTap = '';
        let ordersTap = '';
        let statusTap = '';
        let userStatus = this.props.userStatus;

        if (level !== 'basic') {
            adminTap =
                <NavDropdown className="py-3 font-weight-bold basic-nav-dropdown" title="ADMIN" renderMenuOnMount={true}>
                    <Link to="/admin/list" className="dropdown-item"> Manage Customers</Link>
                </NavDropdown>
        }
        else {
            catalogTap =
                <NavDropdown className="py-3 font-weight-bold basic-nav-dropdown" title="CATALOG" renderMenuOnMount={true}>
                    <Link to="/orders/skus" className="dropdown-item"> Products </Link>
                </NavDropdown>

            ordersTap =
                <NavDropdown className="py-3 font-weight-bold basic-nav-dropdown" title="ORDERS" renderMenuOnMount={true}>
                    <Link to="/orders/search" className="dropdown-item"> Search Orders </Link>
                    <Link to="/orders/recent" className="dropdown-item"> Recent Orders </Link>
                </NavDropdown>

            /**
             * Huynh - 09/14/2021
             * https://app.clickup.com/t/1gu4174
             */
            statusTap = ( userStatus.toUpperCase() !== 'PORTAL_ACCESS_APPROVED' ) ?
                (
                    <NavDropdown className="py-3 font-weight-bold basic-nav-dropdown" title="API" renderMenuOnMount={true}>
                        {progress}
                        <Link to="/api/log/request" className="dropdown-item"> API Request Log </Link>
                        <Link to="/api/log/status" className="dropdown-item"> API Status Update Log</Link>
                    </NavDropdown>
                ): '';
            
        }

        return (
            <Navbar className="py-0" bg="light" id="nav-bot">
                <Container>
                    <Nav className="mx-auto my-0">
                        {catalogTap}
                        {ordersTap}
                        {statusTap}
                        <NavDropdown className="py-3 font-weight-bold basic-nav-dropdown" title="DOCUMENTATION" renderMenuOnMount={true}>
                            <Link to="/docs/api" className="dropdown-item"> Jondo API Documentation </Link>
                            <Link to="/docs/packingslip" className="dropdown-item"> Premium Branding Specs </Link>
                            <Link to="/api/downloadTemplates" className="dropdown-item"> Premium Branding Templates </Link>
                            <Link to="/docs/tool" className="dropdown-item"> API Sample Tool </Link>
                            <Link to="/api/downloads" className="dropdown-item"> API Code Samples</Link>
                            <Link to="/docs/testAddresses" className="dropdown-item"> Sample Addresses </Link>
                        </NavDropdown>
                        <NavDropdown className="py-3 font-weight-bold basic-nav-dropdown" title="SUPPORT" renderMenuOnMount={true}>
                            <Link to="/support/supportRequests" className="dropdown-item"> Support Requests </Link>
                            <Link to="/support/faqs" className="dropdown-item"> FAQs </Link>
                        </NavDropdown>
                        {adminTap}
                    </Nav>
                </Container>
            </Navbar>
        );
    }
}


const mapStateToProps = state => (
    {
        progress: state.handler.progress,
    }
);


//export default RecentOrders;
export default connect(
    mapStateToProps
)(NavBot);
