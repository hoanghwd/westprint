import React, { Component } from "react"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"

import "./ProductSkus.css";

class SearchForm extends Component {

  render() {
    let placeHolderId = '';
    const isReady = this.props.isReady;

    if(isReady) {
      placeHolderId = this.props.placeHolderId;
    }

    return (
      <Form onSubmit={this.props.handleSubmit}>
        <Form.Group as={Row}>
          <Form.Label column sm="2" className="text-right label">
            Product Code (ID)
          </Form.Label>
          <Col sm="9">
            <Form.Control
              className="input"
              name="id"
              onChange={this.props.handleChange}
              value={this.props.id}
              placeholder={placeHolderId}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm="2" className="text-right label">
            Description
          </Form.Label>
          <Col sm="9">
            <Form.Control
              className="input"
              name="description"
              onChange={this.props.handleChange}
              value={this.props.description}
              placeholder="Matte Canvas Framed (1.25): 12x16"
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm="2" className="text-right label">
            Category
          </Form.Label>
          <Col sm="9">
            <Form.Control
              className="input"
              name="category"
              onChange={this.props.handleChange}
              value={this.props.category}
              placeholder="Canvas Prints"
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm="2" className="text-right label">
            Subcategory
          </Form.Label>
          <Col sm="9">
            <Form.Control
              className="input"
              name="subcategory"
              onChange={this.props.handleChange}
              value={this.props.subcategory}
              placeholder="Matte Canvas Black Framed (1.25)"
            />
          </Col>
        </Form.Group>
        <Row>
          <Col sm={2} />
          <Col sm={9}>
            <Button className="mr-3" variant="primary" type="submit" size="lg">
              SEARCH
            </Button>
            <Button
              variant="outline-dark"
              size="lg"
              id="btn-clear"
              onClick={this.props.handleClear}
            >
              CLEAR
            </Button>
          </Col>
        </Row>
      </Form>

    );
  }
}

export default SearchForm;


