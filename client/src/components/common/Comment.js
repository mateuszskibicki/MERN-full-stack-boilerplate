import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {deleteCommentDiet} from '../../actions/dietActions';
import {deleteCommentRecipe} from '../../actions//recipeActions';
import _ from 'lodash';
import Moment from 'moment';

class Comment extends Component {

	deleteComment = (e) => {
		const commentId = e.target.getAttribute('data-comment');
		const dataId = e.target.getAttribute('data-id');

		if(this.props.match.path === '/recipes/:id') {
			this.props.deleteCommentRecipe(dataId, commentId);
		}

		if(this.props.match.path === '/diets/:id') {
			this.props.deleteCommentDiet(dataId, commentId);
		}
	}

	render() {
		const {comment, id} = this.props;
		return (
			<div className="card comment text-muted">
				<div className="card-body">
					<Link to={`/profile/${comment.nickname}`}><h4 className="comment-user">{comment.nickname}</h4></Link>
					<small>{Moment(comment.date).format('Do MMMM YYYY, h:mm a')}</small>
					<hr />
					<p className="lead comment-body">{comment.body}</p>
					{this.props.auth.user.id.toString() === comment.user.toString() ? (
						<button 
							className="btn btn-red d-block-inline float-right pl-4 pr-4"
							data-comment={comment._id}
							data-id={id}
							onClick={this.deleteComment}
						>
							<i 
								className="fas fa-trash-alt"
								data-comment={comment._id}
								data-id={id}
							></i>
						</button>
					) : null}
				</div>
        
			</div>
		);
	}
}

Comment.propTypes = {
	auth: PropTypes.object.isRequired,
	deleteCommentDiet: PropTypes.func.isRequired,
	deleteCommentRecipe: PropTypes.func.isRequired,
	comment: PropTypes.object.isRequired,
	id: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(mapStateToProps, {deleteCommentDiet, deleteCommentRecipe})(withRouter(Comment));
