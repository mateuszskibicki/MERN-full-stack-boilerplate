import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {getGyms} from '../../actions/mapActions';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import _ from 'lodash';

import InputForm from '../common/InputForm';
import Loading from '../common/Loading';

import Map from './Map';


class FindGym extends Component {
	constructor(props) {
		super(props);
		this.state={
			address: '',
			errors: {}
		};
	}

	componentDidMount() {
		window.scrollTo(0,0);
	}

	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	}
  
  findGyms = (e) => {
  	let {address, errors} = this.state;
    
  	_.isEmpty(address) ? this.setState({errors: {address: 'Address is required'}}) : null;
    
  	if(!_.isEmpty(address)) {
  		this.props.getGyms(address);
  		this.setState({errors: {}});
  	}
  }

  render() {
  	const { maps, loading } = this.props.map;
    
    
  	let mapContent = '';
    
  	loading ? mapContent = <Loading /> : null;
    
  	if(!_.isEmpty(maps) && !_.isNull(maps) & !loading) {
  		mapContent = (
  			<div className="mt-5 fade-in-left">
  				<Map 
  					latitude={maps[0].geometry.location.lat}
  					longitude={maps[0].geometry.location.lng}
  					markers={maps}
  				/>
  			</div>
  		);
  	} else if (_.isEmpty(maps) && !_.isNull(maps) & !loading) {
  		mapContent = (
  			<h4 className="text-center text-muted mt-4">Ups, sorry... we couldn't find any gym. Try again with diffrent area.</h4>
  		);
  	}

  	return (
  		<div id="find-gym">
  			<div className="mt-5 mb-5 fade-in-left">
  				<div className="container">

  					<div className="add-container add-container-calories mb-5">
  						<div className="jumbotron mt-3 mb-3">
  							<div className="display-4 text-center">Find perfect gym <i className="fas fa-map-marker-alt"></i></div>
  						</div>
  					</div>

  					<div className="form col-12 col-xl-6 m-auto">
  						<p className="lead text-mute">Put your address here.Format: Burnley, Blackburn King Street or postcode: BB11 4JE, M6 5QP.</p>
  						<InputForm
  							placeholder="Your address :"
  							name="address"
  							value = {this.state.address}
  							onChange = {this.onChange}
  							error={this.state.errors.address}
  						/>
  						<button className="btn btn-green-medium" onClick={this.findGyms}>Find gyms</button>
  					</div>
            
  					
            
  					{mapContent}

  				</div>
  			</div>
  		</div>
  	);
  }
}

FindGym.propTypes = {
	auth: PropTypes.object.isRequired,
	map: PropTypes.object.isRequired,
	getGyms: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	map: state.map
});

export default connect(mapStateToProps, {getGyms})(FindGym);
