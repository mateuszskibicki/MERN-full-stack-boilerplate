import React, { Component } from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {updateProfile} from '../../actions/profileActions';
import {logoutUser} from '../../actions/authActions';

import InputForm from '../common/InputForm';
import TextAreaForm from '../common/TextAreaForm';

import _ from 'lodash';

class ProfileFormUpdate extends Component {
	constructor(props) {
		super(props);
		const {profile} = props.profile;
		this.state = {
			name: profile.name,
			nickname: profile.nickname,
			facebook: _.isEmpty(profile.social.facebook) ? '' : profile.social.facebook,
			instagram: _.isEmpty(profile.social.instagram) ? '' : profile.social.instagram,
			twitter: _.isEmpty(profile.social.twitter) ? '' : profile.social.twitter,
			linkedin: _.isEmpty(profile.social.linkedin) ? '' : profile.social.linkedin,
			website: _.isEmpty(profile.social.website) ? '' : profile.social.website,
			bio: _.isEmpty(profile.bio) ? '' : profile.bio
		};
	}
  
  onChange = (e) => {
  	this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit = (e) => {
  	e.preventDefault();
  	this.props.updateProfile(this.props.auth.user.id, this.state);
  }

  render() {
  	const {errors} = this.props;
  	return (
  		<form className="form mt-3 mb-3 fade-in-left">
      
  			<div className="m-0 p-0 text-left text-muted"><small className="m-0 p-0">Full name *</small></div>
  			<InputForm 
  				type="text"
  				placeholder="Full name *"
  				name = "name"
  				value = {this.state.name}
  				onChange = {this.onChange}
  				error = {errors.name}
  			/>
        
  			<div className="m-0 p-0 text-left text-muted"><small className="m-0 p-0">Nickname *</small></div>
  			<InputForm 
  				type="text"
  				placeholder="Nickname *"
  				name = "nickname"
  				value = {this.state.nickname}
  				onChange = {this.onChange}
  				error = {errors.nickname}
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

  			<div className="m-0 p-0 text-left text-muted"><small className="m-0 p-0">Facebook account</small></div>
  			<InputForm
  				type = "text"
  				placeholder = "Link to your Facebook account"
  				name = "facebook"
  				value = {this.state.facebook}
  				onChange = {this.onChange}
  				error = {errors.facebook}
  			/>
        
  			<div className="m-0 p-0 text-left text-muted"><small className="m-0 p-0">Instagram account</small></div>
  			<InputForm
  				type = "text"
  				placeholder = "Link to your Instagram account"
  				name = "instagram"
  				value = {this.state.instagram}
  				onChange = {this.onChange}
  				error = {errors.instagram}
  			/>
        
  			<div className="m-0 p-0 text-left text-muted"><small className="m-0 p-0">Twitter account</small></div>
  			<InputForm
  				type = "text"
  				placeholder = "Link to your Twitter account"
  				name = "twitter"
  				value = {this.state.twitter}
  				onChange = {this.onChange}
  				error = {errors.twitter}
  			/>
        
  			<div className="m-0 p-0 text-left text-muted"><small className="m-0 p-0">LinkedIn account</small></div>
  			<InputForm
  				type = "text"
  				placeholder = "Link to your LinkedIn account"
  				name = "linkedin"
  				value = {this.state.linkedin}
  				onChange = {this.onChange}
  				error = {errors.linkedin}
  			/>
        
  			<div className="m-0 p-0 text-left text-muted"><small className="m-0 p-0">Your website</small></div>
  			<InputForm					
  				type = "text"
  				placeholder = "Link to your website"
  				name = "website"
  				value = {this.state.website}
  				onChange = {this.onChange}
  				error = {errors.website}
  			/>
        
  			<div className="m-0 p-0 text-left text-muted"><small className="m-0 p-0">Short bio</small></div>
  			<TextAreaForm 
  				type="text"
  				placeholder="Tell something about you"
  				name = "bio"
  				value = {this.state.bio}
  				onChange = {this.onChange}
  			/>
  			{!_.isEmpty(errors) ? (
  				<div className="alert alert-danger" role="alert">
            Something went wrong, check your details.
  				</div>
  			) : null}
        
  			<div className="alert alert-info">
          REMEMBER, after update you'll be redirected to login page.
  			</div>
  			<button className="button-green" onClick={this.onSubmit}>UPDATE</button>
        
  		</form>
  	);
  }
}

ProfileFormUpdate.propTypes = {
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	profile: PropTypes.object.isRequired,
	updateProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors,
	profile: state.profile
});

export default connect(mapStateToProps, {updateProfile})(withRouter(ProfileFormUpdate));
