import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import {getDiets} from '../../actions/dietActions';

import Loading from '../common/Loading';

import DietCard from './DietCard';
import DietForm from './DietForm';
import DietFormUpdate from './DietFormUpdate';

import Chart from 'chart.js';
import _ from 'lodash';


class Diets extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sortByType: '',
			sortByLikes: '',
			sortByComments: '',
			sortByDate: ''
		};
	}

	componentDidMount() {
		this.props.getDiets();
		window.scrollTo(0,0);
	}

	componentWillReceiveProps(nextProps) {
		if(this.props !== nextProps && nextProps.diet.diets.length > 0){
			document.getElementById('charts').innerHTML = `
				<div class="row">
					<div class="col-sm-6 text-center">
						<small><strong>BY TYPES</strong></small>
						<canvas id="dietsChart" width="320" height="320"></canvas>
					</div>		  
					<div class="col-sm-6 text-center">
						<small><strong>BY CALORIES</strong></small>
						<canvas id="kcalChart" width="320" height="320"></canvas>
					</div>
				</div>
			`;
			const {diets} = nextProps.diet;
			let dietsMeat = 0;
			let dietsVegetarian = 0;
			let dietsVegan = 0;
			let dietsLess2000 = 0;
			let diets2000to3000 = 0;
			let diets3000to4000 = 0;
			let diets4000to5000 = 0;
			let dietsMore5000 = 0;
			let dietConent;
			if(_.isEmpty(diets) && !diets.length) {
				dietConent = <Loading/>;
			} else {
				dietConent = diets.map(diet => diet.title);
				diets.map(diet => {
					diet.type === 'Meat' ? dietsMeat++ : null;
					diet.type === 'Vegetarian' ? dietsVegetarian++ : null;
					diet.type === 'Vegan' ? dietsVegan++ : null;
					Number(diet.kcal) < 2000 ? dietsLess2000++ : null;
					Number(diet.kcal) >= 2000 && Number(diet.kcal) < 3000 ? diets2000to3000++ : null;
					Number(diet.kcal) >= 3000 && Number(diet.kcal) < 4000 ? diets3000to4000++ : null;
					Number(diet.kcal) >= 4000 && Number(diet.kcal) < 5000 ? diets4000to5000++ : null;
					Number(diet.kcal) > 5000 ? dietsMore5000++ : null;
				});
				// $red-meat: #ff6347;
				// $green-vegan: #89da59;
				// $blue--vegetarian: #11998e;
				var dietsChart = document.getElementById('dietsChart');
				let dietChartData = {
					datasets: [{
						data: [dietsMeat, dietsVegetarian, dietsVegan],
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
				var myDoughnutChart = new Chart(dietsChart, {
					type: 'doughnut',
					data: dietChartData,
					options: null
				});
				var kcalChart = document.getElementById('kcalChart');
				let kcalChartData = {
					datasets: [{			
						data: [dietsLess2000,
							diets2000to3000,
							diets3000to4000,
							diets4000to5000,
							dietsMore5000],
						backgroundColor: [
							'rgba(255, 99, 132, 0.8)',
							'rgba(54, 162, 235, 0.8)',
							'rgba(255, 206, 86, 0.8)',
							'rgba(75, 192, 192, 0.8)',
							'rgba(153, 102, 255, 0.8)'
						],
					}],
					labels: [
						'2000--',
						'2000 - 3000',
						'3000 - 4000',
						'4000 - 5000',
						'5000++'
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
		this.setState({sortByType : e.target.getAttribute('data-sort')});
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
			sortByDate : 'Date'
		});
	}

	changeShowAll = (e) => {
		this.setState({sortByType : ''});
	}


	render() {

		let {diets, loading} = this.props.diet;
		let dietContent;

		if(diets === null || loading) {
			dietContent = (
				<div className="m-auto text-center">
					<Loading />
				</div>
			); //if loading true
		} else if(!_.isEmpty(this.state.sortByType)) { // if not empty

			if(!_.isEmpty(this.state.sortByLikes)) {
				diets = diets.sort((a,b) => b.likes.length - a.likes.length);
			}
			if(!_.isEmpty(this.state.sortByComments)) {
				diets = diets.sort((a,b) => b.comments.length - a.comments.length);
			}
			if(!_.isEmpty(this.state.sortByDate)) {
				diets = diets.sort((a,b) => new Date(b.date) - new Date(a.date));
			}

			diets = diets.map(diet => diet.type === this.state.sortByType ? diet : ''); //if === type in state
			dietContent = diets.map(diet => !_.isEmpty(diet.type) ? <DietCard key={diet._id} diet={diet}/> : null); //if not null add react component
			dietContent = dietContent.filter(diet => diet !== null); // if null remove from array

		} else {
			if(!_.isEmpty(this.state.sortByLikes)) {
				diets = diets.sort((a,b) => b.likes.length - a.likes.length);
			}
			if(!_.isEmpty(this.state.sortByComments)) {
				diets = diets.sort((a,b) => b.comments.length - a.comments.length);
			}
			if(!_.isEmpty(this.state.sortByDate)) {
				diets = diets.sort((a,b) => new Date(b.date) - new Date(a.date));
			}
			dietContent = diets.map(diet => <DietCard key={diet._id} diet={diet}/>);
		}

		let dietsLength = dietContent.length;

		dietContent = (
			<ReactCSSTransitionGroup
				className="row container ml-0 mr-0 pr-0 pl-0"
				transitionName="fade"
				transitionEnterTimeout={500}
				transitionLeaveTimeout={300}>
				{dietContent}
			</ReactCSSTransitionGroup>
		);


		return (
			<div className="mt-5">
				<div className="container">
					<ReactCSSTransitionGroup
						className="row"
						transitionName="fade"
						transitionEnterTimeout={500}
						transitionLeaveTimeout={10000}
						transitionAppear={true}
						transitionAppearTimeout={500}>	

						<div className="col-12 col-xl-4">
							<div className="add-container add-container-diet">
								<button type="button" className="button-add-modal" data-toggle="modal" data-target="#dietAddModal">
									ADD DIET
									<div className="d-block">
										<i className="far fa-plus-square"></i>
									</div>
								</button>		
							</div>
							<div className="modal fade p-0" id="dietAddModal" tabIndex={-1} role="dialog" aria-labelledby="dietAddModalLabel" aria-hidden="true">
								<div className="modal-dialog modal-lg" role="document">
									<div className="modal-content modal-form">
										<DietForm />
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
							<button className='btn btn-green-small float-left'>Diets : {dietsLength}</button>

							<div className="dropdown float-left ml-3">
								<button className="btn-green-small btn dropdown-toggle" type="button" id="dropdownSortByDiets" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
				CHANGE TYPE
								</button>
								<div className="dropdown-menu" aria-labelledby="dropdownSortByDiets">
									<a className="dropdown-item" onClick={this.changeShowAll}>Show all</a>
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

						</div>
						
						{dietContent}
							
					</div>
				</div>
			</div>

			

		);
	}
}

Diets.propTypes = {
	getDiets: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	diet: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	diet: state.diet
});

export default connect(mapStateToProps, {getDiets})(Diets);
