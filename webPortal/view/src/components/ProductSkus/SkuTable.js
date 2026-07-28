import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import Footer from "../Misc/Footer";
import Spinner from 'react-bootstrap/Spinner'
import { CSVLink } from "react-csv";


class SkuTable extends Component {
       
    render() {

        const skus = Array.isArray(this.props.skus) ? this.props.skus : [];
        const csv = Array.isArray(this.props.csv) ? this.props.csv : [];
        const total = parseInt(this.props.total || 0);
        const pageCount = Math.ceil(total / this.props.limit);
        const fileName = this.props.userName + "_products.csv";
        
        if (!this.props.isReady) {
            return (
                <Spinner animation="border" />
            )
        }

        if (skus.length === 0) {
            return (
                <div className="SkuTable">
                    <p>No Records Found</p>
                </div>
            )
        }

        return (
            <div className="SkuTable" >
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Subcategory</th>
                            <th>Price</th>
                            <th>X"</th>
                            <th>Y"</th>
                            <th>Bleed"</th>
                            <th>X"+</th>
                            <th>Y"+</th>
                            <th width="100px">DPI Range</th>
                            <th>Piece(s)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {skus.map(sku => (
                            <tr key={sku.id}>
                                <td>{sku.id}</td>
                                <td>{sku.psTitle}</td>
                                <td>{sku.category}</td>
                                <td>{sku.subCategory}</td>
                                <td>{sku.price}</td>
                                <td>{sku.x}</td>
                                <td>{sku.y}</td>
                                <td>{sku.gwSize}</td>
                                <td>{sku.xPlus}</td>
                                <td>{sku.yPlus}</td>
                                <td>{sku.dpiRange}</td>
                                <td>{sku.pieces}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <Footer
                    page={this.props.page}
                    total={this.props.total}
                    offset={this.props.limit}
                    handleClick={this.props.handleClick}
                    handleNext={this.props.handleNext}
                    handlePrevious={this.props.handlePrevious}
                    pageCount={pageCount}
                />

                <CSVLink filename={fileName} className="btn btn-primary" data={csv}>Export To Excel</CSVLink>
            </div>
        );
    }
}

export default SkuTable;


