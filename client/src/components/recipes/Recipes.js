import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {getRecipes} from '../../actions/recipeActions';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import _ from 'lodash';
import moment from 'moment';

import Loading from '../common/Loading';
import RecipeForm from './RecipeForm';
import RecipeCard from './RecipeCard';


class Recipes extends Component {

	constructor(props) {
		super(props);
		this.state = {
			sortByType: '',
			sortByPrice: '',
			sortByLikes: '',
			sortByComments: '',
			sortByDate: '',
			sortByKcal: ''
		};
	}

	componentDidMount() {
		window.scrollTo(0,0);
		this.props.getRecipes();
	}

	componentWillReceiveProps(nextProps){
		if(this.props !== nextProps && nextProps.recipe.recipes.length > 0){
			document.getElementById('charts').innerHTML = `
				<div class="row">
					<div class="col-sm-6 text-center">
						<small><strong>BY TYPES</strong></small>
						<canvas id="recipesChart" width="320" height="320"></canvas>
					</div>		  
					<div class="col-sm-6 text-center">
						<small><strong>BY CALORIES</strong></small>
						<canvas id="kcalChart" width="320" height="320"></canvas>
					</div>
				</div>
			`;
			const {recipes} = nextProps.recipe;

			let recipesMeat = 0;
			let recipesVegetarian = 0;
			let recipesVegan = 0;
			let recipes0_300 = 0;
			let recipes300_600 = 0;
			let recipes600_1000 = 0;
			let recipes1000andMore = 0;


			if(_.isEmpty(recipes) && !recipes.length) {
				return null;
			} else {
				recipes.map(recipe => {
					recipe.lifestyle === 'Meat' ? recipesMeat++ : null;
					recipe.lifestyle === 'Vegetarian' ? recipesVegetarian++ : null;
					recipe.lifestyle === 'Vegan' ? recipesVegan++ : null;
					recipe.kcal === '0-300' ? recipes0_300++ : null;
					recipe.kcal === '300-600' ? recipes300_600++ : null;
					recipe.kcal === '600-1000' ? recipes600_1000++ : null;
					recipe.kcal === '1000+' ? recipes1000andMore++ : null;
				});
				// $red-meat: #ff6347;
				// $green-vegan: #89da59;
				// $blue--vegetarian: #11998e;
				var recipesChart = document.getElementById('recipesChart');
				let recipesChartData = {
					datasets: [{
						data: [recipesMeat, recipesVegetarian, recipesVegan],
						backgroundColor: [
							'#ff6347',
							'#11998e',
							'#89da59'
						],
					}],
					labels: [
						'Meat',
						'Vegetarian',
						'Vegan'
					]
				};
				var myDoughnutChart = new Chart(recipesChart, {
					type: 'doughnut',
					data: recipesChartData,
					options: null
				});


				var kcalChart = document.getElementById('kcalChart');
				let kcalChartData = {
					datasets: [{			
						data: [recipes0_300,
							recipes300_600,
							recipes600_1000,
							recipes1000andMore],
						backgroundColor: [
							'rgba(85, 239, 196, 0.8)',
							'rgba(108, 92, 231, 0.8)',
							'rgba(9, 132, 227, 0.8)',
							'rgba(214, 48, 49, 0.8)'
						],
					}],
					labels: [
						'0-300',
						'300-600',
						'600-1000',
						'1000+'
					],				
				};
				var myDoughnutChart2 = new Chart(kcalChart, {
					type: 'doughnut',
					data: kcalChartData,
					options: null
				});
			}
		}
	}

	changeSortByType = (e) => {
		e.preventDefault();
		this.setState({sortByType :  e.target.getAttribute('data-sort')});
	}

	changeSortByPrice = (e) => {
		e.preventDefault();
		this.setState({sortByPrice :  e.target.getAttribute('data-sort')});
	}

	changeSortByLikes = (e) => {
		this.setState({
			sortByComments : '',
			sortByLikes : e.target.getAttribute('data-sort'),
			sortByDate : ''
		});
	}

	changeSortByComments = (e) => {
		this.setState({
			sortByComments : e.target.getAttribute('data-sort'),
			sortByLikes: '',
			sortByDate : ''
		});
	}

	changeSortByDate = (e) => {
		this.setState({
			sortByComments : '',
			sortByLikes: '',
			sortByDate : 'Newest'
		});
	}

	changeSortByKcal = (e) => {
		this.setState({
			sortByKcal: e.target.getAttribute('data-sort')
		});
	}



	render() {
		let {recipes} = this.props.recipe;

		//Sort by type/lifestyle
		this.state.sortByType === 'Meat' ? 
			recipes = recipes.filter(recipe => recipe.lifestyle === 'Meat') :
			null;

		this.state.sortByType === 'Vegetarian' ? 
			recipes = recipes.filter(recipe => recipe.lifestyle === 'Vegetarian') :
			null;

		this.state.sortByType === 'Vegan' ? 
			recipes = recipes.filter(recipe => recipe.lifestyle === 'Vegan') :
			null;

		this.state.sortByType === 'Show all' ? 
			recipes = recipes.filter(recipe => recipe) :
			null;
		
		//Sort by price
		this.state.sortByPrice === 'Cheap $' ? 
			recipes = recipes.filter(recipe => recipe.price === 'Cheap $') :
			null;

		this.state.sortByPrice === 'Average $$' ? 
			recipes = recipes.filter(recipe => recipe.price === 'Average $$') :
			null;

		this.state.sortByPrice === 'Expensive $$$' ? 
			recipes = recipes.filter(recipe => recipe.price === 'Expensive $$$') :
			null;

		this.state.sortByPrice === 'Show all' ? 
			recipes = recipes.filter(recipe => recipe) :
			null;

		//Sort by likes/comments/date
		if(!_.isEmpty(this.state.sortByLikes)) {
			recipes = recipes.sort((a,b) => b.likes.length - a.likes.length);
		}
		if(!_.isEmpty(this.state.sortByComments)) {
			recipes = recipes.sort((a,b) => b.comments.length - a.comments.length);
		}
		if(!_.isEmpty(this.state.sortByDate)) {
			recipes = recipes.sort((a,b) => new Date(b.date) - new Date(a.date));
		}

		//Sort by kcal
		this.state.sortByKcal === '0-300' ? 
			recipes = recipes.filter(recipe => recipe.kcal === 'Cheap $') :
			null;
	
		this.state.sortByKcal === '300-600' ? 
			recipes = recipes.filter(recipe => recipe.kcal === '300-600') :
			null;
	
		this.state.sortByKcal === '600-1000' ? 
			recipes = recipes.filter(recipe => recipe.kcal === '600-1000') :
			null;

		this.state.sortByKcal === '1000+' ? 
			recipes = recipes.filter(recipe => recipe.kcal === '1000+') :
			null;
	
		this.state.sortByKcal === 'Show all' ? 
			recipes = recipes.filter(recipe => recipe) :
			null;

		return (
			<div id="recipes">
				<div className="mt-5 mb-5">

					<div className="container">
						<ReactCSSTransitionGroup
							className="row"
							transitionName="fade"
							transitionEnterTimeout={500}
							transitionLeaveTimeout={10000}
							transitionAppear={true}
							transitionAppearTimeout={500}>

							<div className="col-12 col-xl-4">
								<div className="add-container add-container-recipe">
									<button type="button" className="button-add-modal" data-toggle="modal" data-target="#dietAddModal">
									ADD RECIPE
										<div className="d-block">
											<i className="far fa-plus-square"></i>
										</div>
									</button>		
								</div>
								<div className="modal fade p-0" id="dietAddModal" tabIndex={-1} role="dialog" aria-labelledby="dietAddModalLabel" aria-hidden="true">
									<div className="modal-dialog modal-lg" role="document">
										<div className="modal-content modal-form">
											<RecipeForm />
										</div>
									</div>
								</div>
							</div>

							<div className="col-12 col-xl-8 mt-5" id="charts">
								{
								//charts go here
								}
							</div>

						</ReactCSSTransitionGroup>
					</div>

					<div className="container">
						<div className="row user-content">

							<div className="col-12 mb-4 sort-by-buttons-container">
								<button className='btn btn-green-small float-left'>Recipes : {recipes.length}</button>

								<div className="dropdown float-left ml-3">
									<button className="btn-green-small btn dropdown-toggle" type="button" id="dropdownSortByDiets" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
				CHANGE TYPE
									</button>
									<div className="dropdown-menu" aria-labelledby="dropdownSortByDiets">
										<a className="dropdown-item" data-sort="Show all" onClick={this.changeSortByType}>Show all</a>
										<a className="dropdown-item" data-sort="Meat" onClick={this.changeSortByType}>Type: Meat</a>
										<a className="dropdown-item" data-sort="Vegetarian" onClick={this.changeSortByType}>Type: Vegetarian</a>
										<a className="dropdown-item" data-sort="Vegan" onClick={this.changeSortByType}>Type: Vegan</a>
									</div>
								</div>

								<div className="dropdown float-left ml-3">
									<button className="btn-green-small btn dropdown-toggle" type="button" id="dropdownSortByDiets" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
				SORT BY
									</button>
									<div className="dropdown-menu" aria-labelledby="dropdownSortByDiets">
										<a className="dropdown-item" onClick={this.changeSortByDate}>Newest</a>
										<a className="dropdown-item" data-sort="Likes" onClick={this.changeSortByLikes}>Most liked <i className="far fa-heart ml-2"></i></a>
										<a className="dropdown-item" data-sort="Comments" onClick={this.changeSortByComments}>Most commented <i className="far fa-comment-alt ml-2"></i></a>
									</div>
								</div>

								<div className="dropdown float-left ml-3">
									<button className="btn-green-small btn dropdown-toggle" type="button" id="dropdownSortByDiets" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
			PRICE
									</button>
									<div className="dropdown-menu" aria-labelledby="dropdownSortByDiets">
										<a className="dropdown-item" data-sort="Show all" onClick={this.changeSortByPrice}>Show all</a>
										<a className="dropdown-item" data-sort="Cheap $" onClick={this.changeSortByPrice}>Cheap $</a>
										<a className="dropdown-item" data-sort="Average $$" onClick={this.changeSortByPrice}>Average $$</a>
										<a className="dropdown-item" data-sort="Expensive $$$" onClick={this.changeSortByPrice}>Expensive $$$</a>
									</div>
								</div>

								<div className="dropdown float-left ml-3">
									<button className="btn-green-small btn dropdown-toggle" type="button" id="dropdownSortByDiets" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
			Calories
									</button>
									<div className="dropdown-menu" aria-labelledby="dropdownSortByDiets">
										<a className="dropdown-item" data-sort="Show all" onClick={this.changeSortByKcal}>Show all</a>
										<a className="dropdown-item" data-sort="0-300" onClick={this.changeSortByKcal}>0-300</a>
										<a className="dropdown-item" data-sort="300-600" onClick={this.changeSortByKcal}>300-600</a>
										<a className="dropdown-item" data-sort="600-1000" onClick={this.changeSortByKcal}>600-1000</a>
										<a className="dropdown-item" data-sort="1000+" onClick={this.changeSortByKcal}>1000+</a>
									</div>
								</div>

							</div>

							

							<ReactCSSTransitionGroup
								className="row container ml-0 mr-0 pr-0 pl-0 mb-4"
								transitionName="fade"
								transitionEnterTimeout={500}
								transitionLeaveTimeout={300}>
								{recipes.map(recipe => <RecipeCard recipe={recipe} key={recipe._id}/>)}
							</ReactCSSTransitionGroup>
									
								
						
						</div>
					</div>



				</div>
			</div>
		);
	}
}

// sortByType: '',
// sortByPrice: '',
// sortByLikes: '',
// sortByComments: '',
// sortByDate: ''

Recipes.propTypes = {
	auth: PropTypes.object.isRequired,
	recipe: PropTypes.object.isRequired,
	getRecipes: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	recipe: state.recipe
});

export default connect(mapStateToProps, {getRecipes})(Recipes);
