import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {addComment} from '../../actions/dietActions';
import TextAreaForm from '../common/TextAreaForm';
import _ from 'lodash';
import Moment from 'moment';

import Comment from '../common/Comment';

class DietCommentsContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			comment: '',
			errors: {}
		};
	}

	componentWillReceiveProps(nextProps){
		if (!_.isEmpty(nextProps.errors)) {
			this.setState({errors: nextProps.errors});
		}
		
		if (this.props.diet.comments.length < nextProps.diet.comments.length) {
			this.setState({errors: {}, comment: ''});
		}
	}

	onChange = (e) => {
		this.setState({comment: e.target.value});
	}

	onSubmit = () => {
		this.props.addComment(this.props.diet._id, this.state);
	}



	render() {

		const diet = this.props.diet;

		return (
			<div className="container comment-container mb-5">
				<hr/>
				<p className="text-center"><small className="text-muted">Comments : {diet.comments.length}</small></p>
				<div className="row">
					<div className="col-12">
						<TextAreaForm
							type='text'
							placeholder='Say something about this diet...'
							name='comment'
							value={this.state.comment}
							onChange={this.onChange}
							error={this.state.errors.comment}
						/>
					</div>
					<div className="col-12">
						<button className="btn-green btn d-block-inline btn-lg float-right pl-5 pr-5" onClick={this.onSubmit}>Send</button>
					</div>
					<hr />
					<div className="col-12">
						{diet.comments.map(comment => (
							<Comment comment={comment} id={diet._id} key={comment._id}/>
						))}
					</div>
				</div>
			</div>
		);
	}
	
}

DietCommentsContainer.propTypes = {
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	diet: PropTypes.object.isRequired,
	addComment : PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors
});


export default connect(mapStateToProps, { addComment})(DietCommentsContainer);
