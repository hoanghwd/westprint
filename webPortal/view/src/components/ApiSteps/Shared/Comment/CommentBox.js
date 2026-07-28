import React, { Component } from 'react';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import axios from "axios";
import './Comment.css';

class CommentBox extends Component {
  constructor() {
    super();
    this.state = { 
      data: [] ,
      newComment: '',
      expand: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getComment = this.getComment.bind(this);
    this.handleExpand = this.handleExpand.bind(this);
  }
  
  getComment() {
    const { userId, jwt, section } = this.props;
    const searchParams = '?userId=' + userId + '&section=' + section;

    axios.get(
      process.env.REACT_APP_WESTPRINT_API +
      process.env.REACT_APP_GET_COMMENTS +
      searchParams,  {headers: {'Authorization': 'Bearer '+jwt}}
    ).then( (response) => {
      if (!response.data.error) {
        const all = Object.keys(response.data).length === 10 ? '0' : '1';
        
        this.setState({
          data: response.data,
          all: all,
        })
      }  
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  componentDidMount() {
    this.getComment();
  }

  // componentDidUpdate() {
  //   this.getComment();
  // }

  handleChange(e) {
    this.setState({
      newComment: e.target.value
    })
  }

  handleExpand(e) {
    this.setState({
      expand: !this.state.expand
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    const newComment = this.state.newComment;
    const { userId, jwt, username} = this.props;
    axios.post(
      process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_ADD_COMMENT,
      {userId: userId, username: username, comment: newComment, section: this.props.section},
      {headers: {'Authorization': 'Bearer '+jwt}}
    )
    .then( (response) => {
      this.setState({
        newComment: '',
        expand: false,
      });
      this.getComment();
    })
    .catch ((error) => {
      console.log(error);
    });    
  }


  render() {
    return (
      <div className="CommentBox">
          <h5><b>Notes</b></h5>
          <CommentForm 
            handleChange={this.handleChange} 
            handleSubmit={this.handleSubmit} 
            comment={this.state.newComment}
            handleExpand={this.handleExpand}
            expand={this.state.expand}
          />
          <CommentList data={this.state.data} />
      </div>
    );
  }
}

export default CommentBox;