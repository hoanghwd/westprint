import React, { Component } from "react";
import NavTop from "./NavTop";
import NavBot from "./NavBot";
import "./Navbar.css";

class NavBar extends Component {
  render() {
    if (localStorage.getItem('userData') === null) {
      this.props.handleLogin(false);
    }

    return (
      <div className="Nav">
        <NavTop company={this.props.company} handleLogin = {this.props.handleLogin}/>
        <NavBot level={this.props.level} userStatus={this.props.userStatus}/>
      </div>
    );
  }
}

export default NavBar;
