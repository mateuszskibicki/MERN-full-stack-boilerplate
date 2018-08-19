import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';

import SocialIcons from '../profile/SocialIcons';

class UserCard extends Component {

	render(){
		
		const {user} = this.props;

  	return (
  		<div className="col-12 col-md-6 col-xl-4">
  			<div className="card card-user text-muted">	
					<div className="card-body pt-1">

						<div className="text-center">
							<Link to={`/profile/${user.nickname}`}>
								<img 
									src={user.avatar} 
									className="card-user-img" 
									alt={`${user.nickname} profile photo`}
								/>
							</Link>
						</div>

						<div className="text-center mt-2">
							<Link to={`/profile/${user.nickname}`}>
								<h4>{user.nickname}</h4>
							</Link>
							<p className="small mb-1">{user.name}</p>
							<p className="small mb-1">Joined : {moment(user.date).format('DD MMM YYYY')}</p>
						</div>

						<div>
							<SocialIcons socialIcons={user.social} />
						</div>

						
						<div className="card-user-info-container">
							<div className='card-user-info'>
								<p className="icon"><i className="fas fa-utensils"></i></p>
								<p className="lead"><strong>{user.numberOfDiets}</strong></p>
							</div>

							<div className='card-user-info'>
								<p className="icon"><i className="far fa-list-alt"></i></p>
								<p className="lead"><strong>{user.numberOfRecipes}</strong></p>
							</div>

							<div className='card-user-info'>
								<p className="icon"><i className="fas fa-heartbeat"></i></p>
								<p className="lead"><strong>{user.numberOfTrainings}</strong></p>
							</div>

							<div className='card-user-info'>
								<p className="icon"><i className="far fa-comment-alt"></i></p>
								<p className="lead"><strong>{user.numberOfPosts}</strong></p>
							</div>
						</div>

						<div className="mt-3">
							<Link to={`/profile/${user.nickname}`}>
								<button className="btn btn-block btn-green">SHOW PROFILE</button>
							</Link>
						</div>

  				</div>
  			</div>
  		</div>
  	);
	}

}

UserCard.propTypes = {
	auth: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(mapStateToProps)(UserCard);
