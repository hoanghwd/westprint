import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Pagination from "react-bootstrap/Pagination";

class Footer extends Component {

  render() {
    const first = this.props.page * this.props.offset + 1;
    let last = this.props.page * this.props.offset + this.props.offset;
    last = last > this.props.total ? this.props.total : last;
    const pageCount = parseInt(this.props.pageCount);
    let items = [];
    let active  = parseInt(this.props.page) + 1;
    let start = 0;
    let end = 0;

    // ******************************************************************************************************************* //
    // Find the page range to show                                                                                         //
    // By default: we will show 2 pages before and 2 pages after active page. So total is 5 pages                          //
    // But there are some special cases. For example: When the first page or last page is within the page range,           //
    // so we need to show the first page instead of page #(active - 2) and/or the last page instead of page #(active + 2)  //
    // first page: page #1, last page: page #${pageCount}                                                                  //
    // ******************************************************************************************************************* //

    if (active - 2 <= 0 && active + 2 >= pageCount) {
      start = 1;
      end = pageCount;
    } else if (active - 2 <= 0) {
      start = 1;
      end = start + 4;
      end = end > pageCount ? pageCount : end;
    } else if (active + 2 >= pageCount) {
      start = pageCount - 4;
      start = start < 1 ? 1 : start;
      end = pageCount;
    } else {
      start = active - 2;
      end = active + 2;
    }

    let i = start;
    
    while (i <= end) {
      // if we have more than 2 pages after active page, we need to add '...' after element #4 and the last element should be the last page
      if ( active + 2 < pageCount && i - start === 4 ) {    
        i = pageCount;
        items.push(
          <Pagination.Ellipsis disabled key="Ellipsis1"/>
        )
      }

      // if we have more than 2 pages before active page, we need to add '...' after the first element and the first element should be the first page 
      if (active - 2 > 1 && i === start) {
        items.push(
          <Pagination.Item key={1} id={1} active={i === active} onClick={this.props.handleClick}>{1}</Pagination.Item>
        )
        items.push(
          <Pagination.Ellipsis disabled key="Ellipsis2"/>
        )
        i++;
      }

      items.push(
        <Pagination.Item key={i} id={i} active={i === active} onClick={this.props.handleClick}>{i}</Pagination.Item>
      )

      i++;
    }

    return (
      <Row>
        <Col sm={4}>
          <div>
            Showing Results {first} - {last} of {this.props.total}
          </div>
        </Col>
        <Col sm={8}>
          <Pagination className="justify-content-end">
            <Pagination.Prev onClick={this.props.handlePrevious} disabled={active <= 1} className="link">Prev</Pagination.Prev>
              {items}
            <Pagination.Next onClick={this.props.handleNext} disabled={active >= pageCount} className="link">Next</Pagination.Next>
          </Pagination>
        </Col>
      </Row>
    );
  }
}

export default Footer;
