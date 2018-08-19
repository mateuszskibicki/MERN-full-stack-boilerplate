import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';

import InputForm from '../common/InputForm';
import TextAreaForm from '../common/TextAreaForm';
import SelectForm from '../common/SelectForm';


class CalculatorBMI extends Component {
	constructor(props) {
		super(props);
		this.state={
			heightBMI: '',
			weightBMI : '',
			bmi : '',
			errors: {}
		};
	}

	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	}

	calculateBMI = (e) => {
		e.preventDefault();
		let errors = {};
		_.isEmpty(this.state.heightBMI) ? errors.heightBMI = 'Height is required.' : null;
		_.isEmpty(this.state.weightBMI) ? errors.weightBMI = 'Weight is required.' : null;
		!_.isEmpty(errors) ? 
			this.setState({errors: errors}) : 
			this.setState({
				bmi: this.state.weightBMI / (this.state.heightBMI / 100) / (this.state.heightBMI / 100),
				errors: {}
			});
	}

	render() {
		const {errors} = this.state;

		let bmiContent = '';
		_.isNumber(this.state.bmi) ?
			bmiContent = (								
				<div>
					<h2>
				Your BMI : {Math.round(this.state.bmi * 100) / 100}			
					</h2>
				</div>
			) : bmiContent = '';


		return (
			<div className="calculator-bmi">
				<h1 className="display-3 text-center">BMI</h1>
				<p className="lead text-center">
						The body mass index (BMI) is a measure that uses your height and weight to work out if your weight is healthy.
					<br />
						The BMI calculation divides an adult's weight in kilograms by their height in metres squared. For example, A BMI of 25 means 25kg/m2.
				</p>

				<div className="row">

					<div className="col-12 col-xl-6 mt-3 mb-3">
						<h5 className="text-center">BMI Ranges :</h5>
						<ul className="list-group list-group-ranges max-500">
							<li className="list-group-item">Severe Thinness <span className="badge badge-danger">&lt; 16</span></li>
							<li className="list-group-item">Moderate Thinness <span className="badge badge-warning">16-17</span></li>
							<li className="list-group-item">Mild Thinness <span className="badge badge-success">17-18.5</span></li>
							<li className="list-group-item">Normal <span className="badge badge-success">18.5-25</span></li>
							<li className="list-group-item">Overweight <span className="badge badge-warning">25-30</span></li>
							<li className="list-group-item">Obese Class I <span className="badge badge-danger">30-35</span></li>
							<li className="list-group-item">Obese Class II <span className="badge badge-danger">35-40</span></li>
							<li className="list-group-item">Obese Class III <span className="badge badge-danger">&gt; 40</span></li>
						</ul>
					</div>

					<div className="col-12 col-xl-6 mt-3 mb-3">
						<div className="form mt-5 max-500 m-auto">				
							<InputForm
								type="number"
								placeholder="Height in cm *"
								name = "heightBMI"
								value = {this.state.heightBMI}
								onChange = {this.onChange}
								error = {errors.heightBMI}
							/>
							<InputForm
								type="number"
								placeholder="Weight in kg *"
								name = "weightBMI"
								value = {this.state.weightBMI}
								onChange = {this.onChange}
								error = {errors.weightBMI}
							/>

							{bmiContent}

							<button className='btn btn-green-medium' type='submit' onClick={this.calculateBMI}>Calculate BMI</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default CalculatorBMI;
