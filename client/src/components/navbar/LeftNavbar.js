import React, { Component } from 'react';
import {connect} from 'react-redux';
import {logoutUser} from '../../actions/authActions';
import {NavLink} from 'react-router-dom';
import LeftNavbarNavLink from './LeftNavbarNavLink';

class leftSide extends Component {

	componentDidMount() {
		document.querySelector('.fa-bars').click();
	}

	logoutClick = (e) => {
		e.preventDefault();
		this.props.logoutUser();
	}

	hideNavbar = (e) => {
		document.querySelector('.fa-bars').click();
	}


	render() {
		return (
			<nav className="nav flex-column d-sm-block fade-in-left" id="left-nav">

				<h5 className="nav-heading">User content</h5>
				<hr />

				<LeftNavbarNavLink 
					to="/users"
					icon="fas fa-users"
					name="Users"
				/>

				<LeftNavbarNavLink 
					to="/posts"
					icon="far fa-comment-alt"
					name="Posts"
				/>

				<LeftNavbarNavLink 
					to="/diets"
					icon="fas fa-utensils"
					name="Diets"
				/>

				<LeftNavbarNavLink 
					to="/recipes"
					icon="far fa-list-alt"
					name="Recipes"
				/>

				<LeftNavbarNavLink 
					to="/trainings"
					icon="fas fa-heartbeat"
					name="Trainings"
				/>

				<h5 className="nav-heading">Know your body</h5>
				<hr />

				<LeftNavbarNavLink 
					to="/calculators"
					icon="fas fa-calculator"
					name="Calculators"
				/>

				<LeftNavbarNavLink 
					to="/burncalories"
					icon="fab fa-gripfire"
					name="Burn calories"
				/>

				<LeftNavbarNavLink 
					to="/findgym"
					icon="fas fa-map-marker-alt"
					name="Find gym"
				/>

				<h5 className="nav-heading">About project</h5>
				<hr />

				<LeftNavbarNavLink 
					to="/"
					icon="fas fa-info-circle"
					name="About"
				/>

				<LeftNavbarNavLink 
					to="/contact"
					icon="far fa-envelope"
					name="Contact"
				/>

				<hr />

				<div className="nav-footer pt-2 pb-4">
					<p>2018 BeatCalories &copy; Mateusz Skibicki <br/> <a href="http://papuk.co.uk/" target="_blank" className="small-link">www.papuk.co.uk</a></p>
					<p>Icons made by Freepik from: <br/> <a href="https://www.flaticon.com" target="_blank" className="small-link">www.flaticon.com</a></p>
					<p>All photos from: <br/> <a href="https://www.pexels.com" target="_blank" className="small-link">www.pexels.com</a></p>
					<button
						className="btn-outline-success btn btn-sm"
						onClick={this.logoutClick}
					>
						Logout <i className="fas fa-sign-out-alt"></i>
					</button>
				</div>

			</nav>
		);
	}
}

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors
});

export default connect(mapStateToProps, {logoutUser})(leftSide);
