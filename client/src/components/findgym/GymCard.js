import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import moment from 'moment';
import _ from 'lodash';
import { mapProps } from '../../../node_modules/recompose';

class GymCard extends Component {

	render(){

		console.log(this.props);
    
		const {singleGym} = this.props;
    
  	return (
  		<div className="col-12 col-md-6 col-xl-4 mt-3">
  			<div className="card">		
  				<div className="card-body pt-1">
  					<small className="text-muted text-right mb-0 d-block">User: {singleGym.name}</small>
  					<h3>Calories: <strong>{singleGym.name}</strong></h3>
  				</div>
  			</div>			
  		</div>
  	);
	}
}

export default GymCard;
