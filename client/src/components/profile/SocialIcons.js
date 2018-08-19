import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const SocialIcons = ({socialIcons}) => {

	if(_.isEmpty(socialIcons)) return null;

	let iconsToDisplay = {
		facebook: false,
		instagram: false,
		twitter: false,
		linkedin: false,
		website: false
	};

	!_.isEmpty(socialIcons.facebook) ? iconsToDisplay.facebook = true : null;
	!_.isEmpty(socialIcons.instagram) ? iconsToDisplay.instagram = true : null;
	!_.isEmpty(socialIcons.twitter) ? iconsToDisplay.twitter = true : null;
	!_.isEmpty(socialIcons.linkedin) ? iconsToDisplay.linkedin = true : null;
	!_.isEmpty(socialIcons.website) ? iconsToDisplay.website = true : null;



	return (
		<div className="mt-3 social-icons">
			{iconsToDisplay.facebook ? <a href={socialIcons.facebook} target="_blank"><i className="fab fa-facebook-square"></i></a> : null}
			{iconsToDisplay.instagram ? <a href={socialIcons.instagram} target="_blank"><i className="fab fa-instagram"></i></a> : null}
			{iconsToDisplay.twitter ? <a href={socialIcons.twitter} target="_blank"><i className="fab fa-twitter-square"></i></a> : null}
			{iconsToDisplay.linkedin ? <a href={socialIcons.linkedin} target="_blank"><i className="fab fa-linkedin"></i></a> : null}
			{iconsToDisplay.website ? <a href={socialIcons.website} target="_blank"><i className="fas fa-paperclip"></i></a> : null}
		</div>
	);
  
};

SocialIcons.propTypes = {
	socialIcons: PropTypes.object.isRequired
};

export default SocialIcons;
