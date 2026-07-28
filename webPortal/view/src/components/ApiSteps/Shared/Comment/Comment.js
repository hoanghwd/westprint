import React, {Component} from 'react';
import Moment from 'react-moment';

class Comment extends Component {
  render() {
    return (
      <div className="Comment">
        <div>
          <b>{this.props.author}</b>
          <Moment className="support-text mx-1" unix fromNow>{this.props.createdAt}</Moment>
          <span className="support-text"> - #{this.props.id}</span>
        </div>
        
        <div className="commentNode mb-3">
          {
            this.props.children.split('\n').map((item, key) => {
              return (
                <span key={key}>{item} <br/></span>
              )
            })
          }
        </div>
      </div>
    );
  }
}

export default Comment;