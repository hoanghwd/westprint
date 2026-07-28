// CommentList.js
import React, { Component } from 'react';
import Comment from './Comment';

class CommentList extends Component {
  render() {
    const length = Object.keys(this.props.data).length;

    const commentNodes = this.props.data.map((comment, key) => (
      <Comment createdAt={comment.createdAt} author={comment.author} key={key} id={length - key}>
        { comment.text }
      </Comment>
    ));
    return (
      <div className="CommentList">
        { commentNodes }
      </div>
    );
  }
}

export default CommentList;