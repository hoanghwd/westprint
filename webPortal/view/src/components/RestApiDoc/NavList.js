import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./RestApiDoc.css";


class Navigation extends Component {
  render() {
    return (
        <ul className="nav flex-column">
          {this.props.list
            .filter(item => !item["isChild"])
            .map(item => (
              <li key={item["id"]}>
                <Link
                  to={"/restApiDoc/" + item["id"]}
                  id={item["id"]}
                  className={
                    this.state.active === item["id"] ? "active" : "tab"
                  }
                  onClick={this.addActiveClass}
                >
                  {item["name"]}
                </Link>
              </li>
            ))}
        </ul>
    );
  }
}

export default Navigation;
