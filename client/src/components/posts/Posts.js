import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


class Posts extends Component {

	componentDidMount() {
		window.scrollTo(0,0);
	}

	render() {
		const { user } = this.props.auth;


		return (
			<div id="posts">
				<div className="mt-5 fade-in-left">
					<div className="container text-center text-muted">
						<h1 className="lead">This is POSTS page, this is going to be finished soon.</h1>
						<div>
							<Link to='/diets'>
								<button className="btn btn-green-medium">GO TO DIETS PAGE <i className="far fa-hand-point-left"></i></button>
							</Link>
						</div>
						<div>
							<Link to='/recipes'>
								<button className="btn btn-green-medium">GO TO RECIPES PAGE <i className="far fa-hand-point-left"></i></button>
							</Link>
						</div>
						<div>
							<Link to={`/profile/${this.props.auth.user.nickname}`}>
								<button className="btn btn-green-medium">GO TO YOUR PROFILE PAGE <i className="far fa-hand-point-left"></i></button>
							</Link>
						</div>
						<div>
							<Link to='/users'>
								<button className="btn btn-green-medium">FIND USERS <i className="far fa-hand-point-left"></i></button>
							</Link>
						</div>
						<div>
							<Link to='/calculators'>
								<button className="btn btn-green-medium">CALCULATORS <i className="far fa-hand-point-left"></i></button>
							</Link>
						</div>
						<div>
							<Link to='/burncalories'>
								<button className="btn btn-green-medium">BURN CALORIES <i className="far fa-hand-point-left"></i></button>
							</Link>
						</div>
						<div>
							<Link to='/findgym'>
								<button className="btn btn-green-medium">FIND GYM <i className="far fa-hand-point-left"></i></button>
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

Posts.propTypes = {
	auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(mapStateToProps)(Posts);
