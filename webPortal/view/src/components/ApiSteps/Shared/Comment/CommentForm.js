
// CommentForm.js
import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
import Buttons from './Buttons';

class CommentForm extends Component {
  render() {
    const textBox = this.props.expand ? 
    <Form.Control 
      as="textarea" 
      rows="5" 
      autoFocus 
      placeholder="Write a comment" 
      onChange={this.props.handleChange} 
      value={this.props.comment}
    /> : 
    <Form.Control
      className="input-comment"
      size="sm" 
      type="text" 
      placeholder="Write a comment" 
      onChange={this.props.handleChange}
      onClick={this.props.handleExpand}
      value={this.props.comment}
    />;

    const buttons = this.props.expand ? <Buttons handleExpand={this.props.handleExpand} /> : '';

    return(
      <div className="CommentForm mb-3">
        <Form onSubmit={this.props.handleSubmit}>
          <Form.Group controlId="formComment">
            {textBox}
          </Form.Group>

        {buttons}
    
      </Form>
    </div>    
    );
  }
}

export default CommentForm;
