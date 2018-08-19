import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import InputForm from '../common/InputForm';
import TextAreaForm from '../common/TextAreaForm';
import SelectForm from '../common/SelectForm';


class CalculatorKgCm extends Component {
	constructor(props) {
		super(props);
		this.state={
			foots: '',
			pounds : '',
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


		return (
			<div className="calculator-bmi">
				<h1 className="display-4 text-center">Kilograms and centimetres</h1>
				<p className="lead text-center">
						Hello {this.props.auth.user.nickname}! I am working with kilograms and centimetres so feel free to change pounds and feets to my values.
				</p>

				<div className="row">


					<div className="col-12 col-md-6 mt-3 mb-3">
						<div className="form mt-5 max-500 m-auto">
            				
							<InputForm
								type="number"
								placeholder="Foots *"
								name = "foots"
								value = {this.state.foots}
								onChange = {this.onChange}
								error = {errors.foots}
							/>
              
							{!_.isEmpty(this.state.foots) ? (
								<div>
									<h3>
										{this.state.foots} foots = {Math.round((this.state.foots * 30.48)*100)/100}	cm		
									</h3>
								</div>
							) : null}
		
						</div>
					</div>

					<div className="col-12 col-md-6 mt-3 mb-3">
						<div className="form mt-5 max-500 m-auto">	
            			
							<InputForm
								type="number"
								placeholder="Pounds *"
								name = "pounds"
								value = {this.state.pounds}
								onChange = {this.onChange}
								error = {errors.pounds}
							/>

							{!_.isEmpty(this.state.pounds) ? (
								<div>
									<h3>
										{this.state.pounds} pounds = {Math.round((this.state.pounds * 0.453592)*100)/100} kg		
									</h3>
								</div>
							) : null}

						</div>
					</div>
          



				</div>
			</div>
		);
	}
}

CalculatorKgCm.propTypes = {
	auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(mapStateToProps)(CalculatorKgCm);
