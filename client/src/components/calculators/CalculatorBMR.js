import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';

import InputForm from '../common/InputForm';
import TextAreaForm from '../common/TextAreaForm';
import SelectForm from '../common/SelectForm';


class CalculatorBMR extends Component {
	constructor(props) {
		super(props);
		this.state={
			height: '',
			weight : '',
			age : '',
			gender : '',
			bmr : '',
			errors: {}
		};
	}

	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	}

	calculateBMR = (e) => {
		e.preventDefault();
		let errors = {};
		_.isEmpty(this.state.height) ? errors.height = 'Height is required.' : null;
		_.isEmpty(this.state.weight) ? errors.weight = 'Weight is required.' : null;
		_.isEmpty(this.state.age) ? errors.age = 'Age is required.' : null;
		_.isEmpty(this.state.gender) ? errors.gender = 'Gender is required.' : null;
    
		if(!_.isEmpty(errors)) {
			this.setState({errors: errors});
		} else if (this.state.gender === 'Man') {
			this.setState({
				errors: {},
				bmr: 66.47 + (13.7 * this.state.weight) + (5 * this.state.height) - (6.8 * this.state.age)
			});
		} else if (this.state.gender === 'Woman') {
			this.setState({
				errors: {},
				bmr: 655.1 + (9.6 * this.state.weight) + (1.8 * this.state.height) - (4.7 * this.state.age)
			});
		}
	}

	render() {
		const {errors} = this.state;
    
		let bmrContent = '';
		_.isNumber(this.state.bmr) ?
			bmrContent = (
				<div>
					<h2>
    Your BMR : {Math.round(this.state.bmr * 100) / 100}			
					</h2>
				</div>
			) : 
			bmrContent = '';

		return (
			<div className="calculator-bmi">
				<h1 className="display-3 text-center">BMR</h1>

				<div className="row">
        
					<div className="col-12 col-xl-6 mt-3 mb-3">
						<p className="lead text-center">
        BMR is short for Basal Metabolic Rate. Your Basal Metabolic Rate is the number of calories required to keep your body functioning at rest, also known as your metabolism.
						</p>
      
						<h5 className="text-center">What affects my BMR?</h5>

						<p className="lead text-center">
      Anything that results in an increase to your metabolic rate will increase your BMR. This includes exercise, stress, fear and illnesses.
						</p>

						<p className="lead text-center">
      Your BMR is relative to body mass, age, weight and height. It is also affected by your gender; as it widely regarded that men need more calories than women.
						</p>
      
						<h5 className="text-center">BMR formula</h5>

						<p className="lead text-center">
      There are 2 formulae used to calculate BMR, in [kcal / 24hrs] for men and women respectively: <br/>
      BMR for Men = 66.47 + (13.7 * weight [kg]) + (5 * size [cm]) − (6.8 * age [years]) <br/>
      BMR for Women = 655.1 + (9.6 * weight [kg]) + (1.8 * size [cm]) − (4.7 * age [years])
						</p>
					</div>

					<div className="col-12 col-xl-6 mt-3 mb-3">
						<div className="form mt-5 max-500 m-auto">	
            			
							<InputForm
								type="number"
								placeholder="Height in cm *"
								name = "height"
								value = {this.state.height}
								onChange = {this.onChange}
								error = {errors.height}
							/>

							<InputForm
								type="number"
								placeholder="Weight in kg *"
								name = "weight"
								value = {this.state.weight}
								onChange = {this.onChange}
								error = {errors.weight}
							/>
              
							<InputForm
								type="number"
								placeholder="Age in years *"
								name = "age"
								value = {this.state.age}
								onChange = {this.onChange}
								error = {errors.age}
							/>
              
							<SelectForm
								htmlForAndID='gender'
								label="Gender"
								name="gender"
								optionArray={['Man', 'Woman']}
								value = {this.state.gender}
								onChange = {this.onChange}
								error = {errors.gender}
							/>

							{bmrContent}

							<button className='btn btn-green-medium' type='submit' onClick={this.calculateBMR}>Calculate BMR</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default CalculatorBMR;
