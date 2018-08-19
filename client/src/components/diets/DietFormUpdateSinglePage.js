import React, { Component } from 'react';
import {connect} from 'react-redux';
import InputForm from '../common/InputForm';
import TextAreaForm from '../common/TextAreaForm';
import SelectForm from '../common/SelectForm';
import {Link, withRouter} from 'react-router-dom';
import {updateDietSinglePage} from '../../actions/dietActions';
import _ from 'lodash';

class DietFormUpdateSinglePage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: props.singleDiet.title,
			kcal: props.singleDiet.kcal,
			type: props.singleDiet.type,
			description: props.singleDiet.description,
			tags: props.singleDiet.tags.join(','),
			errors: {}
		};
	}
  
	componentDidMount() {
		document.querySelector('.button-update-diet-modal').click();
	}


	componentWillReceiveProps(nextProps) {
		if(!_.isEmpty(nextProps.errors)) {
			this.setState({errors: nextProps.errors});	
		} else {
			document.querySelector('.button-close-modal-diet-update').click();
		}
    
		if(this.props !== nextProps && !_.isEmpty(nextProps.errors)) {
			console.log('ok');
		}
	}

	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	}

	onSubmit = (e) => {
		e.preventDefault();
		let {title, kcal, type, description, tag} = this.state;
		let errors = {};
		if(title.length < 5 || title.length > 50) {
			errors.title = 'Title between 5 and 50.';
			this.setState({errors: {title: 'Title between 5 and 50 characters.'}});
		}
    
		if(Number(kcal) < 1000  || Number(kcal) > 10000) {
			errors.kcal = 'Calories between 1000 and 10000.';
			this.setState({errors: {kcal: 'Calories between 1000 and 10000.'}});
		}
    
		if(description.length < 50 || description.length > 5000) {
			errors.description = 'Description between 50 and 5000.';
			this.setState({errors: {description: 'Description between 5 and 5000 characters'}});
		}
  
		if(_.isEmpty(errors)){
			//console.log(this.props.auth.user.nickname);
			this.props.updateDietSinglePage(this.props.singleDiet._id, this.state, this.props.auth.user.nickname, this.props.history);
		}
	}

	formatButton = (e) => {
		e.preventDefault();
	}


	render() {
		const {errors} = this.state;
		const {diet} = this.props.singleDiet;

		return (
			<div className="col-12 pl-0 pr-0">
				<form className="form form-diet-update" onSubmit={this.onSubmit} autoComplete="off">
					<h1 className="display-4">Update diet</h1>

					<InputForm
						type="text"
						placeholder="Title *"
						name = "title"
						value = {this.state.title}
						onChange = {this.onChange}
						error = {errors.title}
					/>
					<InputForm
						type="text"
						placeholder="Calories *"
						name = "kcal"
						value = {this.state.kcal}
						onChange = {this.onChange}
						error = {errors.kcal}
					/>

					<SelectForm
						htmlForAndID='typeOfDiet'
						label="Type of diet"
						name="type"
						optionArray={['Meat', 'Vegetarian', 'Vegan']}
						value = {this.state.type}
						onChange = {this.onChange}
						error = {errors.type}
					/>

					<button 
						className="button-blue mb-2" 
						onClick={this.formatButton}
						type="button" 
						data-toggle="collapse" 
						data-target="#dietFormUpdateCollapse" 
						aria-expanded="false" 
						aria-controls="dietFormUpdateCollapse"
					>
						Recommended format
					</button>

					<div className="collapse mt-2 mb-2" id="dietFormUpdateCollapse">
						<p className="lead p-0 m-0">
							<strong>Title:</strong> short title giving the main points of your diet
							<br />
							<br />
							<strong>Calories:</strong> how many calories do you have in your diet, 
							you can calculate this online, for example here   
							<a 
								href="https://caloriecontrol.org/healthy-weight-tool-kit/food-calorie-calculator/" 
								target="_blank"
								className="ml-2"
							>
								CalorieControl
							</a>
							<br/>
							<br/>
							<strong>Type of diet:</strong> is this meat, vegetarian or vegan diet?
							<br/>
							<br/>
							<strong>Description:</strong> between 50 and 5000 characters, this is always nice if you leave details about proteins, fats and carbohydrates, meal hours and food replacements. Short example: 
							<br/>
							<br/>
							This is 2000 kcal diet.
							<br/>
							<strong>6-7am breakfast :</strong>  two slices of whole-grain toast, 1 tablespoon of peanut butter, four egg whites, one small orange and 1 cup of low-fat Greek yogurt.
							<br/>
							<strong>9am snack :</strong> 1.5 ounces of reduced-fat cheese and 1 cup of blueberries
							<br/>
							<strong>12pm lunch :</strong>  2.5 ounces of grilled chicken breast, 1 cup of brown rice and 1.25 cups of cooked broccoli
							<br/>
							<strong>3pm snack :</strong> two-thirds of an ounce of sunflower seeds and 2 cups of low-fat cottage cheese
							<br/>
							<strong>6pm dinner :</strong> 2.5 ounces of cooked lean beef; 1.25 cups of sautéed mushrooms, onions and peppers, 2 teaspoons of olive oil, and 1 cup of whole-wheat pasta.
							Diet found on : <a href="https://www.livestrong.com/article/121518-calorie-diets-men/" target="_blank" className="ml-2">Livestrong</a>
							<br/>
							<br/>
							<strong>Tags:</strong> type couple of comma separated tags giving the main points of your diet

						</p>
					</div>

					<TextAreaForm 
						type="text"
						placeholder="Description 50-5000 characters *"
						name = "description"
						value = {this.state.description}
						onChange = {this.onChange}
						error = {errors.description}
					/>

					<InputForm
						type="text"
						placeholder="Tags : comma separated ','"
						name = "tags"
						value = {this.state.tags}
						onChange = {this.onChange}
						error = {errors.tags}
					/>
				
					{!_.isEmpty(errors) ? (
						<div className="alert alert-danger" role="alert">
						Something went wrong, check your data.
						</div>
					) : null}
					<button 
						className="button-green button-diet-update" 
					>
            UPDATE DIET
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

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors,
	diet: state.diet
});



export default connect(mapStateToProps, {updateDietSinglePage})(withRouter(DietFormUpdateSinglePage));
