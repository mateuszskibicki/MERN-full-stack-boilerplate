import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import InputForm from '../common/InputForm';
import TextAreaForm from '../common/TextAreaForm';
import SelectForm from '../common/SelectForm';


class CalculatorHarrisBenedict extends Component {
	constructor(props) {
		super(props);
		this.state={
			bmr : '',
			exercise: '',
			harrisBenedict: '',
			errors: {}
		};
	}

	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	}

	calculateHarrisBenedict = (e) => {
		e.preventDefault();
		let errors = {};
		_.isEmpty(this.state.bmr) && !_.isNumber(this.state.bmr) ? errors.bmr = 'BMR in calories is required.' : null;
		_.isEmpty(this.state.exercise) ? errors.exercise = 'Exercise is required.' : null;
		if(_.isEmpty(errors)) {
			let valueToMultiple;
			this.state.exercise === 'Little/no exercise' ? valueToMultiple = 1.2 : null;
			this.state.exercise === 'Light exercise' ? valueToMultiple = 1.375 : null;
			this.state.exercise === 'Moderate exercise (3-5 days/wk)' ? valueToMultiple = 1.55 : null;
			this.state.exercise === 'Very active (6-7 days/wk)' ? valueToMultiple = 1.725 : null;
			this.state.exercise === 'Extra active (very active & physical job)' ? valueToMultiple = 1.9 : null;
			this.setState({
				harrisBenedict : this.state.bmr * valueToMultiple,
				errors: {}
			});
		} else {
			this.setState({errors: errors});
		}
	}

	render() {
		const {errors} = this.state;
    
		let harrisBenedictContent = '';
		_.isNumber(this.state.harrisBenedict) ?
			harrisBenedictContent = (
				<div>
					<h2>
    Your daily calories : {Math.round(this.state.harrisBenedict * 100) / 100}			
					</h2>
				</div>
			) : 
			harrisBenedictContent = '';

		return (
			<div className="calculator-bmi">
				<h1 className="display-4 text-center">Harris Benedict</h1>

				<div className="row">
        
					<div className="col-12 col-xl-6 mt-3 mb-3">
						<p className="lead text-center">
            Once you've calculated your BMR, this is then put into the Harris Benedict Formula, which calculates your total calorie intake required to maintain your current weight (daily). Example: your BMR=1700 and you have some light exerices daily (1.375), your total amount of calories you need daily = 1700*1.375 = 2.337. This is as follows:
						</p>
      
						<ul className="list-group list-group-ranges max-500">
							<li className="list-group-item">Little/no exercise: <span className="badge badge-info">BMR * 1.2</span></li>
							<li className="list-group-item">Light exercise: <span className="badge badge-info">BMR * 1.375</span></li>
							<li className="list-group-item">Moderate exercise (3-5 days/wk): <span className="badge badge-info">BMR * 1.55</span></li>
							<li className="list-group-item">Very active (6-7 days/wk): <span className="badge badge-info">BMR * 1.725</span></li>
							<li className="list-group-item">Extra active (very active & physical job): <span className="badge badge-info">BMR * 1.9</span></li>
						</ul>
					</div>

					<div className="col-12 col-xl-6 mt-3 mb-3">
						<div className="form mt-5 max-500 m-auto">	
            			
							<InputForm
								type="number"
								placeholder="BMR in kcal *"
								name = "bmr"
								value = {this.state.bmr}
								onChange = {this.onChange}
								error = {errors.bmr}
							/>

              
							<SelectForm
								htmlForAndID='exercise'
								label="Exercise"
								name="exercise"
								optionArray={[
									'Little/no exercise',
									'Light exercise',
									'Moderate exercise (3-5 days/wk)',
									'Very active (6-7 days/wk)',
									'Extra active (very active & physical job)'
								]}
								value = {this.state.exercise}
								onChange = {this.onChange}
								error = {errors.exercise}
							/>

							{harrisBenedictContent}

							<button className='btn btn-green-medium' type='submit' onClick={this.calculateHarrisBenedict}>Calculate Benedict</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default CalculatorHarrisBenedict;
