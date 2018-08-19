import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/authActions';

import InputForm from '../common/InputForm';
import TextAreaForm from '../common/TextAreaForm';

class Register extends Component {
	constructor() {
		super();
		this.state = {
			name: '',
			email: '',
			password: '',
			password2: '',
			facebook: '',
			instagram: '',
			twitter: '',
			linkedin: '',
			website: '',
			bio: '',
			errors: {}
		};
	}

	componentDidMount() {
		if (this.props.auth.isAuthenticated) {
			this.props.history.push('/');
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.errors) {
			this.setState({ errors: nextProps.errors });
		}
	}

	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	}

	onSubmit = (e) => {
		e.preventDefault();

		const newUser = {
			name: this.state.name,
			email: this.state.email,
			nickname: this.state.nickname,
			password: this.state.password,
			password2: this.state.password2
		};

		!_.isEmpty(this.state.facebook) ? newUser.facebook = this.state.facebook : null;
		!_.isEmpty(this.state.instagram) ? newUser.instagram = this.state.instagram : null;
		!_.isEmpty(this.state.twitter) ? newUser.twitter = this.state.twitter : null;
		!_.isEmpty(this.state.linkedin) ? newUser.linkedin = this.state.linkedin : null;
		!_.isEmpty(this.state.website) ? newUser.website = this.state.website : null;
		!_.isEmpty(this.state.bio) ? newUser.bio = this.state.bio : null;

		this.props.registerUser(newUser, this.props.history);
	}

	render() {
		const { errors } = this.state;
		//
		return (
			<div className="login-bg">
				<div className="login-page mb-5 ">
					<div className="form fade-in-left">
						<form 
							className="login-form" 
							onSubmit={this.onSubmit} 
							autoComplete="off"
						>
							<h4 className="display-3">Register</h4>
							<p className="lead">Beat Calories | Mateusz Skibicki</p>
							<p className="lead">* - required</p>
							<hr />
							<InputForm
								type = "text"
								placeholder = "Full Name *"
								name = "name"
								value = {this.state.name}
								onChange = {this.onChange}
								error = {errors.name}
								icon = {<i className="fa fa-user-circle" aria-hidden="true"></i>}
							/>

							<InputForm
								type = "text"
								placeholder = "Your nickname *"
								name = "nickname"
								value = {this.state.nickname}
								onChange = {this.onChange}
								error = {errors.nickname}
							/>
							<InputForm
								type = "email"
								placeholder = "Email *"
								name = "email"
								value = {this.state.email}
								onChange = {this.onChange}
								error = {errors.email}
							/>
							<InputForm
								type = "password"
								placeholder = "Password *"
								name = "password"
								value = {this.state.password}
								onChange = {this.onChange}
								error = {errors.password}
							/>
							<InputForm
								type = "password"
								placeholder = "Confirm Password *"
								name = "password2"
								value = {this.state.password2}
								onChange = {this.onChange}
								error = {errors.password2}	
							/>
							<hr />
							<p className="lead">This part is not required but I recommend to paste some info about you :)</p>
							<hr />
							<p>
								<i className="fab fa-facebook-square mr-2 fa-lg"></i>
								<i className="fab fa-instagram mr-2 fa-lg"></i>
								<i className="fab fa-twitter-square mr-2 fa-lg"></i>
								<i className="fab fa-linkedin mr-2 fa-lg"></i>
								<i className="fas fa-paperclip mr-2 fa-lg"></i>
								<i className="fas fa-user-circle mr-2 fa-lg"></i>

							</p>
							<InputForm
								type = "text"
								placeholder = "Link to your Facebook account"
								name = "facebook"
								value = {this.state.facebook}
								onChange = {this.onChange}
								error = {errors.facebook}
							/>
							<InputForm
								type = "text"
								placeholder = "Link to your Instagram account"
								name = "instagram"
								value = {this.state.instagram}
								onChange = {this.onChange}
								error = {errors.instagram}
							/>
							<InputForm
								type = "text"
								placeholder = "Link to your Twitter account"
								name = "twitter"
								value = {this.state.twitter}
								onChange = {this.onChange}
								error = {errors.twitter}
							/>
							<InputForm
								type = "text"
								placeholder = "Link to your LinkedIn account"
								name = "linkedin"
								value = {this.state.linkedin}
								onChange = {this.onChange}
								error = {errors.linkedin}
							/>
							<InputForm					
								type = "text"
								placeholder = "Link to your website"
								name = "website"
								value = {this.state.website}
								onChange = {this.onChange}
								error = {errors.website}
							/>
							<TextAreaForm	
								type = "text"
								placeholder = "Short bio"
								name = "bio"
								value = {this.state.bio}
								onChange = {this.onChange}
								error = {errors.bio}
							/>
							{!_.isEmpty(errors) ? (
								<div className="alert alert-danger" role="alert">
									Something went wrong, check your details.
								</div>
							) : null}
							<button className="button-green">register</button>
							<p className="message">Already have account ? <Link to="/login">Sign in</Link></p>
						</form>
					</div>
				</div>
			</div>

		);
	}
}

Register.propTypes = {
	registerUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors
});

export default connect(mapStateToProps ,{registerUser})(withRouter(Register));
