const express = require('express');
const router = express.Router();
const passport = require('passport');

const _ = require('lodash');

const axios = require('axios');
const nodemailer = require('nodemailer');

const gmailUser = require('../../config/keys').gmailUser;
const gmailPassword = require('../../config/keys').gmailPassword;

const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user: gmailUser, // Your email id
		pass: gmailPassword // Your password
	},
	tls: {
		// do not fail on invalid certs
		rejectUnauthorized: false
	}
});



// @route   POST api/contact
// @desc    POST contact with me
// @access  Private
router.post(
	'/',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		//req.user => email, name, nickname, _id
		//req.body.message.length > 50
		//req.body.topic 
    
		let html = `
     <h3>User nickname: ${req.user.nickname}</h3>
     <h3>User name: ${req.user.name}</h3>
     <h3>User email: ${req.user.email}</h3>
     <h4>User id: ${req.user._id}</h4>
     <h4>Topic : ${req.body.topic}</h4>
     <h4>Message : ${req.body.message}</h4>
    `;

		var mailOptions = {
			from: `BeatCalories Contact ${req.user.nickname}`,
			to: 'papukengland@gmail.com',
			subject: `BeatCalories Contact ${req.user.nickname}`,
			text: 'Hello ' + req.body.message + '✔',
			html: html,
			bcc: 'papukengland@gmail.com'
		};
		transporter.sendMail(mailOptions, function(error, info){
			if(error){
				console.log(error);
				res.status(404).json({status: false});
			}else{
				//console.log('Message sent: ' + info.response);
				console.log('wyslane');
				res.json({status: true});
			}
		});

	});
  
module.exports = router;
