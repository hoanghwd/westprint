import React, { Component } from "react";
import Col from "react-bootstrap/Col";
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Row from "react-bootstrap/Row";


class FaqCategories extends Component {

    render() {

        const { faqs, logo, title } = this.props;

        let htmlFAQ = [];
        for(var i = 0; i < faqs.length; i++) {
            let catFaq = faqs[i];
            htmlFAQ.push(
                <Card key={i}>
                    <Accordion.Toggle as={Card.Header} eventKey={i+1}>
                        {catFaq.question}
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={i+1}>
                        <Card.Body>{catFaq.answer}</Card.Body>
                    </Accordion.Collapse>
                </Card>
            );
        }

        return (
            <Row className="mb-5">
                <Col>
                    <div className="faq-section mb-2">
                        <img className="sm-img  mr-2" src={logo} alt="logo" />
                        <h3 className="inline-text"><b>{title}</b></h3>
                    </div>
                    {typeof faqs !== "undefined" ? (
                        <Accordion>
                            {htmlFAQ}
                        </Accordion>
                    ):('')
                    }
                </Col>
            </Row>
        )
    }
}

export default FaqCategories;