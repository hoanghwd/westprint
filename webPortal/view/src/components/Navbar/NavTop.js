import React, { Component } from "react";
import { connect } from 'react-redux';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import "./Navbar.css";

class NavTop extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = () => {
    this.props.handleLogin(false);
    //event.preventDefault();
  };

  render() {

    let logSrc = (process.env.REACT_APP_WESTPRINT_API) + 'public/images/logo.png';

    return (
      <Navbar id="nav-top">
         
         {this.props.level === 'basic'
              ? <Link to="/myaccount/info" >
                  <Navbar.Brand >
                    WESTPRINT EXPRESS
                  </Navbar.Brand>
                </Link>
              : <Link to="/admin/list" >
                  <Navbar.Brand >
                    <img width="66px" height="40px" src={logSrc} alt="logo" id="logo" />
                  </Navbar.Brand>
                </Link>
            }
         
          <Nav className="mx-auto">
            <Navbar.Text className="text-light">
              Welcome, {this.props.company}
            </Navbar.Text>
          </Nav>
          <Nav className="text-right">
            
            {this.props.level === 'basic'
              ? <Link to="/myaccount/info" className="text-light nav-link">
                  My Account
                </Link>
              : <Link to="/admin/list" className="text-light nav-link">
                  My Account
                </Link>
            }
            
            <Navbar.Text className="text-light"> | </Navbar.Text>
            <Link
              to="/"
              className="text-light nav-link"
              onClick={this.handleClick}
            >
              Log Out
            </Link>
          </Nav>
      </Navbar>
    );
  }
}

const mapStateToProps = state => (
  {     
    level: state.session.level,
    
  }
);


//export default NavTop;
export default connect(
  mapStateToProps,
  null
)(NavTop);
