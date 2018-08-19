import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';

import InputForm from '../common/InputForm';
import TextAreaForm from '../common/TextAreaForm';
import SelectForm from '../common/SelectForm';


class CalculatorDaily extends Component {
	constructor(props) {
		super(props);
		this.state={
			benedict : '',
			action : '',
			daily: '',
			errors: {}
		};
	}

	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	}

	calculateDaily = (e) => {
		e.preventDefault();
		let errors = {};
		_.isEmpty(this.state.benedict) ? errors.benedict = 'Daily in kcal (H.Benedict) is required.' : null;
		_.isEmpty(this.state.action) ? errors.action = 'Action is required.' : null;
    
		if(!_.isEmpty(errors)) {
			this.setState({errors: errors});
		} else if (this.state.action === 'Loose weight') {
			this.setState({
				errors: {},
				daily: Number(this.state.benedict) - 300
			});
		} else if (this.state.action === 'Gain weight') {
			this.setState({
				errors: {},
				daily: Number(this.state.benedict) + 300
			});
		}
	}

	render() {
		const {errors} = this.state;
    
		let dailyContent = '';
		_.isNumber(this.state.daily) ?
			dailyContent = (
				<div>
					<h2>
    Your daily calories : {Math.round(this.state.daily * 100) / 100}			
					</h2>
				</div>
			) : 
			dailyContent = '';

		return (
			<div className="calculator-bmi">
				<h1 className="display-4 text-center">Daily calories to loose or gain weight</h1>

				<div className="row">
        
					<div className="col-12 col-xl-6 mt-3 mb-3">
						<p className="lead text-center">
       Remember, everyone is diffrent. This is just calculator and it gives you approximate value how many calories do you need. If you have your Harris Benedict Formula value you have to add 300 kcal to healthy gain weight or subtract 300 kcal to loose weight. Remember, process of gaining or loosing weight is time-consuming, you can't do it too fast. Better slower than destroy your health.
						</p>
					</div>

					<div className="col-12 col-xl-6 mt-3 mb-3">
						<div className="form mt-5 max-500 m-auto">	
            			
							<InputForm
								type="number"
								placeholder="Daily H.Benedict in kcal *"
								name = "benedict"
								value = {this.state.benedict}
								onChange = {this.onChange}
								error = {errors.benedict}
							/>
              
							<SelectForm
								htmlForAndID='action'
								label="Action"
								name="action"
								optionArray={['Loose weight', 'Gain weight']}
								value = {this.state.action}
								onChange = {this.onChange}
								error = {errors.action}
							/>

							{dailyContent}

							<button className='btn btn-green-medium' type='submit' onClick={this.calculateDaily}>Calculate Daily</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default CalculatorDaily;
