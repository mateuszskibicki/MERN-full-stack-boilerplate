import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {getProfileByHandle} from '../../actions/profileActions';

import _ from 'lodash';

import Loading from '../common/Loading';
import ProfileContent from './ProfileContent';

import sadFace from '../../images/sad-face.png';

class Profile extends Component {

	componentDidMount() {
		this.props.getProfileByHandle(this.props.match.params.nickname);
		window.scrollTo(0,0);
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps && nextProps.match.params.nickname !== this.props.match.params.nickname)
		{
			this.props.getProfileByHandle(nextProps.match.params.nickname);
			window.scrollTo(0,0);
		}
	}

	render() {
		const {profile, loading} = this.props.profile;
		let profileContent;
		
		if (loading) {
			profileContent = <Loading />;

		} else if (_.isEmpty(profile) && !loading && !this.props.errors.success) {
			profileContent = (
				<div className="mt-5 fade-in-left">
					<div className="container">
						<div className="row">			

							<div className="col-12 mb-3">
								<Link to='/users' className="btn btn-outline-secondary">Go back</Link>
							</div>
							<div className="col-12 text-center alert alert-danger box-shadow">
								<img src={sadFace} alt="Sad face, 404 erorr." className="mt-2 mb-2"/>
								<h5>Ups... we can't find user with nickname : {this.props.match.params.nickname}</h5>
									Go back and try again.
							</div>
						
						</div>
					</div>
				</div>
			);
		} else {
			profileContent = (<ProfileContent profile={profile}/>);
		}

		return (
			<div id="profile">
				<div className="mt-5">
					<div className="container">
						{profileContent}
					</div>
				</div>
			</div>
		);
	}
}

Profile.propTypes = {
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	profile: PropTypes.object.isRequired,
	getProfileByHandle: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors,
	profile: state.profile
});

export default connect(mapStateToProps, {getProfileByHandle})(Profile);
