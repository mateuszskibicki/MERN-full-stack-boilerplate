import React, { Component } from 'react';
import {logoutUser} from '../../actions/authActions';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

class TopNavbar extends Component {

	logoutClick = (e) => {
		e.preventDefault();
		this.props.logoutUser();
	}

  showMenu = () => {
  	let navLeft = document.getElementById('left-nav');
  	if(navLeft.classList.contains('d-none')) {
  		navLeft.classList.remove('d-none');
  	} else {
  		navLeft.classList.add('d-none');
  	}
  	
  }

  render() {
  	return (
  		<div className="navbar-top">
  			<div className="row">
  				<div className="col-4 col-sm-3 col-xl-2 left">
  					<Link to='/' className="beat-logo"><span>Beat</span>Calories</Link>
  				</div>
  				<div className="col-8 col-sm-9 col-xl-10 right">
  					<div className="row">
  						<div className="col-6 navbar-top-item text-center d-sm-none">
  							<div onClick={this.showMenu} className="m-auto">
  								<i className="fas fa-bars m-auto d-block d-sm-none"></i>
  							</div>
  							
  						</div>
  						<div className="col-6 col-sm-12 navbar-top-item">
  							<div className="dropleft">
  								<img 
  									src={this.props.auth.user.avatar} 
  									id="dropdownTopNavbar" 
  									data-toggle="dropdown" 
  									aria-haspopup="true" 
  									aria-expanded="false"
  									alt="User avatar"
  								/>
  								<div className="dropdown-menu" aria-labelledby="dropdownTopNavbar">
  									<Link to={`/profile/${this.props.auth.user.nickname}`} className="dropdown-item">My profile</Link>
  									<a className="dropdown-item" onClick={this.logoutClick}>Logout</a>
  								</div>
  						</div>
  						</div>
  					</div>
  				</div>
  			</div>
  		</div>
  	);
  }
}

TopNavbar.propTypes = {
	auth: PropTypes.object.isRequired,
	logoutUser: PropTypes.func.isRequired
};



const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(mapStateToProps , {logoutUser})(TopNavbar);
