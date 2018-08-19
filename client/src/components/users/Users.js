import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import _ from 'lodash';
import moment from 'moment';
import Loading from '../common/Loading';

import { getAllProfiles } from '../../actions/profileActions';
import UserCard from './UserCard';


class Users extends Component {
	constructor(props) {
		super(props);
		this.state= {
			findUser : ''
		};
	}

	componentDidMount() {
		this.props.getAllProfiles();
		window.scrollTo(0,0);
	}

	onChange = (e) => {
		e.preventDefault();
		this.setState({findUser: e.target.value});
	}

	render() {
		let {profiles, loading} = this.props.profile;
		
		let usersContent;



		if (profiles === null || _.isEmpty(profiles)) {
			usersContent = <div className="text-center m-auto"><Loading /></div>;
		} else {
			if(_.isEmpty(this.state.findUser)) {
				usersContent = profiles.map((user) => (<UserCard key={user._id} user={user}/>));
			} else {
				profiles = profiles.filter(
					(user) => 
						user.name.toLowerCase().includes(this.state.findUser.toLowerCase().trim()) || 
						user.nickname.toLowerCase().includes(this.state.findUser.toLowerCase().trim())
				);
				usersContent = profiles.map((user) => (<UserCard key={user._id} user={user}/>));
			}
		}

		return (
			<div id="users">
				<div className="mt-5 mb-5 fade-in-left">
					<div className="container">
						<div className="row">

							<div className="col-12">
								<div className="form">
									<div className="form-group">
										<input 
											type="text" 
											className="form-control" 
											aria-label="Sizing example input" 
											aria-describedby="inputGroup-sizing-default"
											value={this.state.findUser}
											onChange={this.onChange}
											placeholder={'Nickname or name..'}
										/>
									</div>
									<div className="btn btn-green small">Users in DB : <strong>{profiles === null ? '0' : profiles.length}</strong></div>
								</div>
							</div>
						

							<div className="col-12">


								<ReactCSSTransitionGroup
									className="row"
									transitionName="fade"
									transitionEnterTimeout={500}
									transitionLeaveTimeout={300}>
									{usersContent}
								</ReactCSSTransitionGroup>

								{profiles !== null & _.isEmpty(profiles) ? (
									<div className="mt-3 text-center info-no-user">
										<h3>Ooops.. we don't have any user with name or nickname including : <strong>{this.state.findUser}</strong> .</h3>
									</div>
										
								)  : null}
								
							</div>

						</div>
					</div>
				</div>
			</div>
		);
	}
}

Users.propTypes = {
	auth: PropTypes.object.isRequired,
	profile: PropTypes.object.isRequired,
	getAllProfiles: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	profile: state.profile
});

export default connect(mapStateToProps, {getAllProfiles})(Users);
