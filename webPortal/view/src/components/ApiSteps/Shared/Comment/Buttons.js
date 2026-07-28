
// CommentForm.js
import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';

class CommentForm extends Component {
  
  render() {
    return(
        <div className="Buttons">
            <Button className='mr-3' size="sm" variant="primary" type="submit">
                Add comment
            </Button>
            <Button size="sm" variant="outline-dark" onClick={this.props.handleExpand}>
                Cancel
            </Button>
        </div>    
    );
  }
}

export default CommentForm;
