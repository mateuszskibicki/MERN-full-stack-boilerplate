import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Link, withRouter} from 'react-router-dom';

import {getRecipeByID, likeRecipe, deleteRecipeSinglePage} from '../../actions/recipeActions';

import Loading from '../common/Loading';

import RecipeFormUpdate from './RecipeFormUpdate';
import RecipeCommentsContainer from './RecipeCommentsContainer';

import Moment from 'moment';
import _ from 'lodash';

import sadFace from '../../images/sad-face.png';


class RecipeSinglePage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isModalUpdateVisible: false
		};
	}

	componentDidMount() {
		this.props.getRecipeByID(this.props.match.params.id);
		window.scrollTo(0,0);
	}

	showUpdateForm = () => {
		let modalVisible = this.state.isModalUpdateVisible;
		this.setState({isModalUpdateVisible : !this.state.isModalUpdateVisible});
	}

	likeRecipe = () => {
		this.props.likeRecipe(this.props.recipe.recipe._id);
	}

	removeDiet = (e) => {
		this.props.deleteRecipeSinglePage(e.target.getAttribute('data-id'), this.props.history);
		//remove recipe and push to /recipes
	}

	render() {
		const {recipe, loading} = this.props.recipe;

		let componentRecipe;
		if(_.isEmpty(recipe) || loading) {
			componentRecipe = <Loading />;
		} else if (!_.isEmpty(recipe._id) && !loading) {

		 //recipe jumbotron bg
			let jumboBgClass;

			if(recipe.lifestyle === 'Meat') {
				jumboBgClass = 'jumbotron jumbotron-fluid jumbotron-recipe-single-meat jumbotron-recipe-single';
			}

			if(recipe.lifestyle === 'Vegan') {
				jumboBgClass = 'jumbotron jumbotron-fluid jumbotron-recipe-single-vegan jumbotron-recipe-single';
			}

			if(recipe.lifestyle === 'Vegetarian') {
				jumboBgClass = 'jumbotron jumbotron-fluid jumbotron-recipe-single-vegetarian jumbotron-recipe-single';
			}

			//like btn class
			let likeBtnClass;
			if (recipe.likes.length === 0) {
				likeBtnClass = 'button-like';
			} else {
				if(recipe.likes.includes(String(this.props.auth.user.id))) {
					likeBtnClass = 'button-liked';
				} else {
					likeBtnClass = 'button-like';
				}
			}

			//tags classes
			let tagsClass;
			if(recipe.lifestyle === 'Meat') {
				tagsClass = 'tag tag-meat';
			}

			if(recipe.lifestyle === 'Vegan') {
				tagsClass = 'tag tag-vegan';
			}

			if(recipe.lifestyle === 'Vegetarian') {
				tagsClass = 'tag tag-vegetarian';
			}

			componentRecipe = (
				<div className="mt-5 fade-in-left">
					<div className="container">
						<div className="row">			
							<div className="col-12">
								<div className="col-12 mb-3">
									<Link to='/recipes' className="btn btn-outline-secondary">Go back</Link>
								</div>

								<div className="row">
								
									<div className="col-12 col-xl-6">
										<div className={jumboBgClass}>
											<div className="container text-center">

												<h1 className="mb-1 fw-500">{recipe.title}</h1>
												<h2 className="m-0 fw-500">Calories: {recipe.kcal}</h2>
												<p className="lead m-0 fw-500">Author: <Link to={`/profile/${recipe.user.nickname}`}>{recipe.user.nickname}</Link></p>
												<Link to={`/profile/${recipe.user.nickname}`}><img src={recipe.user.avatar} className="diet-single-avatar"/></Link>
												<p className="lead m-0 fw-500">Date: {Moment(recipe.date).format('Do MMMM YYYY, h:mm a')}</p>
												<p className="lead m-0 fw-500">Type: {recipe.lifestyle}</p>
												<p className="lead m-0 fw-500">
													<i className="far fa-heart"></i> {recipe.likes.length} 
													<i className="ml-2 far fa-comments"></i> {recipe.comments.length}
												</p>

										
												{recipe.user._id.toString() === this.props.auth.user.id.toString() ? (
													<p className="lead mb-0 buttons-diet-single-page">
														<i 
															className="fas fa-trash-alt remove"  
															data-id={recipe._id}
															onClick={this.removeDiet}
														></i>
														<i 
															className="fas fa-pencil-alt update" 
															data-id={recipe._id}
															onClick={this.showUpdateForm}
														></i>
										 </p>
												) : null}
											</div>
										</div>
									</div>

									<div className="col-12 col-xl-6">
										<div className="jumbotron jumbotron-fluid jumbotron-recipe-info">
											<div className="container text-center">

												<h3>Price: {recipe.price}</h3>
												<h4>Cooking method: {recipe.cookingMethod}</h4>
												<h4>Cuisine: {recipe.cuisine}</h4>
												<h4>Preparation time: {recipe.preparationTime}</h4>
												<h4>Cooking time: {recipe.cookingTime}</h4>

												{_.isEmpty(recipe.tags) ? null : (
													<div className="mt-2 mb-2">
														<div className="h4">Tags:</div>
														<div className="tags">
															{recipe.tags.map(tag => <p key={tag} className={tagsClass}>{tag}</p>)}
														</div>
													</div>	
												)}

												{_.isEmpty(recipe.ingredients) ? null : (
													<div className="mt-2 mb-2">
														<div className="h4">Ingredients:</div>
														<div className="tags">
															{recipe.ingredients.map(ingredient => <p key={ingredient} className={tagsClass}>{ingredient}</p>)}
														</div>
													</div>	
												)}
											
											</div>
										</div>
									</div>

								</div>


							</div>
							<div className="container text-center">
								<small className="text-muted fw-500">Do you like this recipe?</small>
								<button className={likeBtnClass} onClick={this.likeRecipe}><i className="far fa-heart"></i></button>
							</div>
							<div className="container mt-5 text-center">
								<p className="lead recipe-text text-muted">{recipe.longDescription}</p>
							</div>

							<RecipeCommentsContainer recipe={recipe} />

						</div>
					</div>
					{this.state.isModalUpdateVisible === true ? (
						<div>
							<button type="button" className="button-update-diet-modal" hidden data-toggle="modal" data-target="#dietUpdateModal">
						Launch update
							</button>
							<div className="modal fade p-0" id="dietUpdateModal" tabIndex={-1} role="dialog" aria-labelledby="dietUpdateModal" aria-hidden="true">
								<div className="modal-dialog modal-lg" role="document">
									<div className="modal-content modal-form">
										<RecipeFormUpdate singleRecipe={recipe} showUpdateForm={this.showUpdateForm} />
									</div>
								</div>
							</div>
						</div>
					) : null}
				</div>
			);
		} else {
			componentRecipe = (
				<div className="mt-5 fade-in-left">
					<div className="container">
						<div className="row">			

							<div className="col-12 mb-3">
								<Link to='/recipes' className="btn btn-outline-secondary">Go back</Link>
							</div>
							<div className="col-12 text-center alert alert-danger box-shadow">
								<img src={sadFace} alt="Sad face, 404 erorr." className="mt-2 mb-2"/>
								<h5>Ups... we can't find recipe with ID : {this.props.match.params.id}</h5>
									Go back and try again.
							</div>
						
						</div>
					</div>
				</div>
			);
		}
		
		return (
			<div>
				{componentRecipe}
			</div>
		);
	}
}

RecipeSinglePage.propTypes = {
	auth: PropTypes.object.isRequired,
	recipe: PropTypes.object.isRequired,
	getRecipeByID: PropTypes.func.isRequired,
	likeRecipe: PropTypes.func.isRequired,
	deleteRecipeSinglePage: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	recipe: state.recipe
});

export default connect(mapStateToProps, {getRecipeByID, likeRecipe, deleteRecipeSinglePage})(withRouter(RecipeSinglePage));
