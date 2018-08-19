import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import InputForm from '../common/InputForm';
import TextAreaForm from '../common/TextAreaForm';
import SelectForm from '../common/SelectForm';
import {Link, withRouter} from 'react-router-dom';
import {updateRecipe, updateRecipeSinglePage, updateRecipeProfilePage} from '../../actions/recipeActions';
import _ from 'lodash';


class RecipeFormUpdate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: props.singleRecipe.title,
			kcal: props.singleRecipe.kcal,
			dishType: props.singleRecipe.dishType,
			cookingMethod: props.singleRecipe.cookingMethod,
			cuisine: props.singleRecipe.cuisine,
			lifestyle: props.singleRecipe.lifestyle,
			preparationTime: props.singleRecipe.preparationTime,
			cookingTime: props.singleRecipe.cookingTime,
			price: props.singleRecipe.price,
			shortDescription: props.singleRecipe.shortDescription,
			longDescription: props.singleRecipe.longDescription,
			tags: props.singleRecipe.tags.join(','),
			ingredients: props.singleRecipe.ingredients.join(','),
			errors: {}
		};
	}
  
	componentDidMount() {
		document.querySelector('.button-update-diet-modal').click();
	}


	componentWillReceiveProps(newProps) {
		if(!_.isEmpty(newProps.errors)) {
			this.setState({errors: newProps.errors});	
		} else {
			document.querySelector('.button-close-modal-diet-update').click();
			//console.log(newProps);
		}
	}

	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	}

	onSubmit = (e) => {
		e.preventDefault();
		this.props.match.path === '/recipes' ? this.props.updateRecipe(this.props.singleRecipe._id, this.state) : null;
		this.props.match.path === '/recipes/:id' ? this.props.updateRecipeSinglePage(this.props.singleRecipe._id, this.state) : null;
		this.props.match.path === '/profile/:nickname' ? this.props.updateRecipeProfilePage(this.props.singleRecipe._id, this.state, this.props.auth.user.nickname) : null;
	}

	formatButton = (e) => {
		e.preventDefault();
	}


	render() {
		const {errors} = this.state;

		return (
			<div className="col-12 pl-0 pr-0">
				<form className="form form-diet-update" autoComplete="off">
					<h1 className="display-4">Update recipe</h1>

					<InputForm
						type="text"
						placeholder="Title *"
						name = "title"
						value = {this.state.title}
						onChange = {this.onChange}
						error = {errors.title}
					/>
          
					<SelectForm
						htmlForAndID='kcal'
						label="Calories *"
						name="kcal"
						optionArray={['0-300', '300-600', '600-1000', '1000+']}
						value = {this.state.kcal}
						onChange = {this.onChange}
						error = {errors.kcal}
					/>

					<SelectForm
						htmlForAndID='dishType'
						label="Dish type *"
						name="dishType"
						optionArray={[
							'Pasta & risotto', 
							'Salad', 
							'Bread & doughs', 
							'Curry',
							'Vegetable sides',
							'Soup',
							'Antipasti',
							'Roast',
							'BBQ food',
							'Stew',
							'Pizza',
							'Sandwiches & wraps',
							'Cakes & tea time treats',
							'Pies & pastries',
							'Sauces & condiments',
							'Puddings & desserts',
							'Drinks',
							'Cookies',
							'Meatballs',
							'Other'
						]}
						value = {this.state.dishType}
						onChange = {this.onChange}
						error = {errors.dishType}
					/>
          
					<SelectForm
						htmlForAndID='cookingMethod'
						label="Cooking method *"
						name="cookingMethod"
						optionArray={[
							'Baking',
							'Boiling',
							'Steaming',
							'Broiling',
							'Frying',
							'Grilling',
							'Roasting',
							'Pickling',
							'Raw',
							'Other'
						]}
						value = {this.state.cookingMethod}
						onChange = {this.onChange}
						error = {errors.cookingMethod}
					/>

					<SelectForm
						htmlForAndID='cuisine'
						label="Cuisine *"
						name="cuisine"
						optionArray={[
							'American',
							'British',
							'Caribbean',
							'Chinese',
							'French',
							'Greek',
							'Indian',
							'Italy',
							'Japanese',
							'Mediterranean',
							'Mexican',
							'Spanish',
							'Thai',
							'Turkish',
							'Vietnamese',
							'Other'
						]}
						value = {this.state.cuisine}
						onChange = {this.onChange}
						error = {errors.cuisine}
					/>

					<SelectForm
						htmlForAndID='lifestyle'
						label="Lifestyle (food) *"
						name="lifestyle"
						optionArray={[
							'Meat',
							'Vegetarian',
							'Vegan'
						]}
						value = {this.state.lifestyle}
						onChange = {this.onChange}
						error = {errors.lifestyle}
					/>

					<SelectForm
						htmlForAndID='preparationTime'
						label="Preparation time *"
						name="preparationTime"
						optionArray={[
							'0-10 min',
							'10-30 min',
							'30-60 min',
							'60-120 min',
							'120+ min'
						]}
						value = {this.state.preparationTime}
						onChange = {this.onChange}
						error = {errors.preparationTime}
					/>

					<SelectForm
						htmlForAndID='cookingTime'
						label="Cooking time *"
						name="cookingTime"
						optionArray={[
							'0-10 min',
							'10-30 min',
							'30-60 min',
							'60-120 min',
							'120+ min'
						]}
						value = {this.state.cookingTime}
						onChange = {this.onChange}
						error = {errors.cookingTime}
					/>

					<SelectForm
						htmlForAndID='price'
						label="Price *"
						name="price"
						optionArray={[
							'Cheap $',
							'Average $$',
							'Expensive $$$'
						]}
						value = {this.state.price}
						onChange = {this.onChange}
						error = {errors.price}
					/>

					<TextAreaForm 
						type="text"
						placeholder="Short description 10-200 characters *"
						name = "shortDescription"
						value = {this.state.shortDescription}
						onChange = {this.onChange}
						error = {errors.shortDescription}
					/>

					<TextAreaForm 
						type="text"
						placeholder="Full (long) description 50-3000 characters *"
						name = "longDescription"
						value = {this.state.longDescription}
						onChange = {this.onChange}
						error = {errors.longDescription}
					/>

					<InputForm
						type="text"
						placeholder="Tags : comma separated ','"
						name = "tags"
						value = {this.state.tags}
						onChange = {this.onChange}
						error = {errors.tags}
					/>

					<InputForm
						type="text"
						placeholder="Ingredients : comma separated ','"
						name = "ingredients"
						value = {this.state.ingredients}
						onChange = {this.onChange}
						error = {errors.ingredients}
					/>
				
					{!_.isEmpty(errors) ? (
						<div className="alert alert-danger" role="alert">
						Something went wrong, check your data.
						</div>
					) : null}
					<button 
						className="button-green button-diet-update"
						onClick={this.onSubmit}
					>
            UPDATE RECIPE
					</button>
					<button 
						className="button-red button-close-modal-diet-update"
						type="button" 
						data-dismiss="modal" 
						aria-label="Close"
						onClick={this.props.showUpdateForm}
					>
						Cancel
					</button>
				</form>
			</div>
		);
	}
}

RecipeFormUpdate.propTypes = {
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	singleRecipe: PropTypes.object.isRequired,
	updateRecipe : PropTypes.func.isRequired,
	updateRecipeSinglePage : PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors
});



export default connect(mapStateToProps, {updateRecipe, updateRecipeSinglePage, updateRecipeProfilePage})(withRouter(RecipeFormUpdate));
