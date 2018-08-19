import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import CalculatorBMI from './CalculatorBMI';
import CalculatorBMR from './CalculatorBMR';
import CalculatorHarrisBenedict from './CalculatorHarrisBenedict';
import CalculatorDaily from './CalculatorDaily';
import CalculatorKgCm from './CalculatorKgCm';


class Calculators extends Component {
	componentDidMount() {
		window.scrollTo(0,0);
	}

	render() {
		const { user } = this.props.auth;


		return (
			<div id="calculators">
				<div className="mt-5 mb-5 fade-in-left">
					<div className="container">

						<div className="add-container add-container-calculators mb-5">
							<div className="jumbotron mt-3 mb-3">
								<div className="display-4 text-center">Calculators <i className="fas fa-calculator"></i></div>
							</div>
						</div>

						<CalculatorKgCm />

						<CalculatorBMI />

						<CalculatorBMR />

						<CalculatorHarrisBenedict />

						<CalculatorDaily />


					</div>
				</div>
			</div>
		);
	}
}

Calculators.propTypes = {
	auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(mapStateToProps)(Calculators);
