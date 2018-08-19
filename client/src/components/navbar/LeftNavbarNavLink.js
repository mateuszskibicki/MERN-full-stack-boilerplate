import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';
import PropTypes from 'prop-types';

class LeftNavbarNavLink extends Component {

	hideNavbar = (e) => {
		document.querySelector('.fa-bars').click();
	}

	render() {

		const {icon, to, name} = this.props;
    
		return (
			<NavLink className="nav-link pt-3 pb-3" exact activeClassName="active" to={to} onClick={this.hideNavbar}>
				<div className="row">
					<div className="col-2 nav-item">
						<i className={icon}></i>
					</div>
					<div className="col-7 nav-item pl-0">
						<span>{name}</span>
					</div>
					<div className="col-2 nav-item">
						<i className="fas fa-arrow-right d-none d-md-block"></i>
					</div>
				</div>
			</NavLink>
		);
	}
}

LeftNavbarNavLink.propTypes = {
	icon: PropTypes.string.isRequired,
	to: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired
};

export default LeftNavbarNavLink;
