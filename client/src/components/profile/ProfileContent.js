import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import ProfileFormUpdate from './ProfileFormUpdate';
import DietCard from '../diets/DietCard';
import RecipeCard from '../recipes/RecipeCard';

import SocialIcons from './SocialIcons';
import moment from 'moment';
import _ from 'lodash';

class ProfileContent extends Component {
	constructor(props){
		super(props);
		this.state = {
			showFormUpdate: false,
			showDiets: false,
			showLikedDiets: false,
			showRecipes: false,
			showLikedRecipes: false
		};
	}
  
  changeVisibility = (e) => {
  	e.preventDefault();
  	this.setState({showFormUpdate: !this.state.showFormUpdate});
  }
	
	showDiets = (e) => {
		this.setState({showDiets: !this.state.showDiets});
	}

	showLikedDiets = (e) => {
		this.setState({showLikedDiets: !this.state.showLikedDiets});
	}

	showRecipes = (e) => {
		this.setState({showRecipes: !this.state.showRecipes});
	}

	showLikedRecipes = (e) => {
		this.setState({showLikedRecipes: !this.state.showLikedRecipes});
	}

	render() {
  	const { profile } = this.props;
		let profileContent;

  	//if this is user's account - info about gravatar
  	let updateInfo;
  	{profile._id.toString() === this.props.auth.user.id.toString() ? updateInfo = (
  		<div className="mt-3">

  			<div className="profile-update-button" onClick={this.changeVisibility}>
  				<i className="fas fa-pencil-alt"></i>
  			</div>
      

  			{this.state.showFormUpdate ? <ProfileFormUpdate /> : null}
        
  			<small className="d-block text-muted">REMEMBER, after update you'll be redirected to login page.</small>
				<small className="d-block text-muted">Would you like to change your profile photo?</small>
				{profile.facebook ? (
					<small className="d-block text-muted">Your account is registed with facebook account and your profile photo depends on it.</small>
				) : (
					<div>
						<small className="d-block text-muted">Your account is registed with email <strong>{profile.email}</strong></small>
						<small className="d-block text-muted">Change your global avatar here: <a href="https://en.gravatar.com/" target="_blank" className="small-link">GRAVATAR</a></small>
					</div>
				)}
  		</div>
  	) : updateInfo = '';}
    
  	let dietContent;
  	!_.isEmpty(profile.diets) ? dietContent = profile.diets.map(diet => <DietCard key={diet._id} diet={diet}/>) : null;

  	let likedDietsContent;
		!_.isEmpty(profile.likedDiets) ? likedDietsContent = profile.likedDiets.map(diet => <DietCard key={diet._id} diet={diet}/>) : null;
		
		let recipesContent;
  	!_.isEmpty(profile.recipes) ? recipesContent = profile.recipes.map(recipe => <RecipeCard key={recipe._id} recipe={recipe}/>) : null;

  	let likedRecipesContent;
  	!_.isEmpty(profile.likedRecipes) ? likedRecipesContent = profile.likedRecipes.map(recipe => <RecipeCard key={recipe._id} recipe={recipe}/>) : null;

  	profileContent = (
  		<div className="row fade-in-left mb-5">
  			<div className="col-12 col-md-6 text-center">
  				<img src={profile.avatar} className="profile-img img-fluid rounded-circle" alt={`${profile.name} avatar`}/>
  				{updateInfo}
  				<SocialIcons  socialIcons={profile.social}/>
  			</div>
  			<div className="col-12 col-md-6 text-center mt-3 text-muted">
  				<small className="lead">Full name: </small>
  				<h4>{profile.name}</h4>
  				<small className="lead">Nickname: </small>
  				<h4>{profile.nickname}</h4>
  				<small className="lead">Joined: </small>
  				<h4>{moment(profile.date).format('MMMM Do YYYY')}</h4>
  				<small className="lead">Diets: </small>
  				<h4>{profile.numberOfDiets}</h4>
  				<small className="lead">Posts: </small>
  				<h4>{profile.numberOfPosts}</h4>
  				<small className="lead">Recipes: </small>
  				<h4>{profile.numberOfRecipes}</h4>
  				<small className="lead">Trainings: </small>
  				<h4>{profile.numberOfPosts}</h4>
  			</div>

  			{!_.isEmpty(profile.bio) ? (
  				<div className="col-12 text-center mt-3 text-muted">
  					<h2>About:</h2>
  					<p className="lead text-space">{profile.bio}</p>
  				</div>
  			) : null}
        
  			{!_.isEmpty(profile.diets) ? (
  				<div className="col-12 text-center mt-5 text-muted">
		
  					<h2>Diets: {profile.diets.length}</h2>
						
  					{!this.state.showDiets ? (
  						<button onClick={this.showDiets} className="btn btn-green-small">SHOW DIETS <i className="fas fa-arrow-down"></i></button>
  					) : (
  						<button onClick={this.showDiets} className="btn btn-green-small">HIDE DIETS <i className="fas fa-arrow-up"></i></button>
  					)}	

  					{this.state.showDiets ? (
  						<div className="row mt-4 fade-in-left">
  						{dietContent}
  						</div>
  					) : null}
							
  				</div>
  			) : null}
        
  			{!_.isEmpty(profile.likedDiets) && profile._id.toString() === this.props.auth.user.id.toString() ? (
					<div className="col-12 text-center mt-5 text-muted">
					
						<h2>Liked diets: {profile.likedDiets.length}</h2>
						
						{!this.state.showLikedDiets ? (
  						<button onClick={this.showLikedDiets} className="btn btn-green-small">SHOW LIKED DIETS <i className="fas fa-arrow-down"></i></button>
  					) : (
  						<button onClick={this.showLikedDiets} className="btn btn-green-small">HIDE LIKED DIETS <i className="fas fa-arrow-up"></i></button>
  					)}	

  					{this.state.showLikedDiets ? (
  						<div className="row mt-4 fade-in-left">
  						{likedDietsContent}
  						</div>
						) : null}
									
  				</div>
				) : null}
				
  			{!_.isEmpty(profile.recipes) ? (
  				<div className="col-12 text-center mt-5 text-muted">
		
  					<h2>Recipes: {profile.recipes.length}</h2>
						
  					{!this.state.showRecipes ? (
  						<button onClick={this.showRecipes} className="btn btn-green-small">SHOW RECIPES <i className="fas fa-arrow-down"></i></button>
  					) : (
  						<button onClick={this.showRecipes} className="btn btn-green-small">HIDE RECIPES <i className="fas fa-arrow-up"></i></button>
  					)}	

  					{this.state.showRecipes ? (
  						<div className="row mt-4 fade-in-left">
  						{recipesContent}
  						</div>
  					) : null}
							
  				</div>
				) : null}
				
  			{!_.isEmpty(profile.likedRecipes) && profile._id.toString() === this.props.auth.user.id.toString() ? (
					<div className="col-12 text-center mt-5 text-muted">
					
						<h2>Liked recipes: {profile.likedRecipes.length}</h2>
						
						{!this.state.showLikedRecipes ? (
  						<button onClick={this.showLikedRecipes} className="btn btn-green-small">SHOW LIKED RECIPES <i className="fas fa-arrow-down"></i></button>
  					) : (
  						<button onClick={this.showLikedRecipes} className="btn btn-green-small">HIDE LIKED RECIPES <i className="fas fa-arrow-up"></i></button>
  					)}	

  					{this.state.showLikedRecipes ? (
  						<div className="row mt-4 fade-in-left">
  						{likedRecipesContent}
  						</div>
						) : null}
									
  				</div>
				) : null}

  		</div>
  	);
    


  	return (
  		<div>
  			{profileContent}
  		</div>
  	);
	}
}

ProfileContent.propTypes = {
	auth: PropTypes.object.isRequired,
	profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(mapStateToProps)(ProfileContent);
