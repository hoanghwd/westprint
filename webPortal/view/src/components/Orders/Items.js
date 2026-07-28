import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import "./Orders.css";

class Items extends Component {

    constructor(props) {

        super(props);

        this.state = {
            isDataReady: false,
            error: ""
        };
    }

    render() {
        const { items } = this.props.orderInfo;
        const { dataReady } = this.props;
        const header =
            <thead className="order-items-back-blue white-text" >
                <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Item Number</th>
                    <th>Size</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Product Code</th>
                </tr>
            </thead>;

        if (!dataReady) {
            return (
                <Container className="items-padding items-max-width" >
                    <Table striped bordered hover>
                        {header}
                        <tbody>
                            <tr><td colSpan="6">Loading ...</td></tr>
                        </tbody>
                    </Table>
                </Container>
            );
        }

        return (
            <Container className="items-padding items-max-width" >
                <Table striped bordered hover>
                    {header}
                    <tbody>{
                        items.map(
                            item =>
                                <tr key={item.id} className="center-middle">
                                    <td><img className="mr-3" alt="" src={item.thumbLocation} /></td>
                                    <td>{item.psTitle}</td>
                                    <td>{item.itemNumber}</td>
                                    <td>{item.x} x {item.y}</td>
                                    <td>{item.price} USD</td>
                                    <td>{item.qt}</td>
                                    <td>{item.itemCode}</td>
                                </tr>
                        )
                    }
                    </tbody>
                </Table>
            </Container>
        );
    }
}

export default Items;