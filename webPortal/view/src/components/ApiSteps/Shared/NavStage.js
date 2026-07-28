import React, { Component } from "react";
import Nav from "react-bootstrap/Nav";
import ProgressBar from "react-bootstrap/ProgressBar";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { changeStage } from '../../../actions'

class NavStage extends Component {
    render() {
        const disabledLink = "text-light nav-link disabled";
        const activeLink = "text-light nav-link";
        const disabledCircle = "nav-item-circle-disabled mx-1";
        const activeCircle = "nav-item-circle mx-1";

        return (
            <div className="mt-auto mt-5 mb-3">
                <Nav
                    defaultActiveKey="/home"
                    as="ul"
                    className="justify-content-center"
                >

                    <Nav.Item as="li" className={this.props.stages.create ? activeCircle : disabledCircle}>
                        <Link
                            to="/api/steps/create"
                            className={this.props.stages.create ? activeLink : disabledLink}
                            onClick={() => this.props.changeStage('create', this.props.orderOrigin)}
                        >
                            A
                        </Link>
                    </Nav.Item>

                    <Nav.Item as="li" className={this.props.stages.cancel ? activeCircle : disabledCircle}>
                        <Link
                            to="/api/steps/cancel"
                            className={this.props.stages.cancel ? activeLink : disabledLink}
                            onClick={() => this.props.changeStage('cancel', this.props.orderOrigin)}
                        >
                            B
                        </Link>
                    </Nav.Item>

                    <Nav.Item as="li" className={this.props.stages.redo ? activeCircle : disabledCircle}>
                        <Link
                            to="/api/steps/redo"
                            className={this.props.stages.redo ? activeLink : disabledLink}
                            onClick={() => this.props.changeStage('redo', this.props.orderOrigin)}
                        >
                            C
                        </Link>
                    </Nav.Item>

                    <Nav.Item as="li" className={this.props.stages.status ? activeCircle : disabledCircle}>
                        <Link
                            to="/api/steps/status"
                            className={this.props.stages.status ? activeLink : disabledLink}
                            onClick={() => this.props.changeStage('status', this.props.orderOrigin)}
                        >
                            D
                        </Link>
                    </Nav.Item>
                </Nav>

                <div className="text-center mt-3">
                    <b>Total Progress</b>
                </div>
                <ProgressBar now={this.props.progress} />
                <div className="text-center">{this.props.progress}% Complete</div>
            </div>
        );
    }
}

const mapStateToProps = state => (
    {
        stages: state.handler.stages,
        progress: state.handler.progress,
        orderOrigin: state.session.orderOrigin
    }
);

const mapDispatchToProps = dispatch => ({
    changeStage: (nextStage, orderOrigin) => dispatch(changeStage(nextStage,orderOrigin)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NavStage);