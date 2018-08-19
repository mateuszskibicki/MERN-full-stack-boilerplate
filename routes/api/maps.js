const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const _ = require('lodash');
const validator = require('validator');

const axios = require('axios');

const googleAPI = require('../../config/keys').googleAPI;



// @route   GET api/maps/location
// @desc    POST location and GET latitude and longitude  from google api
// @access  Private
router.get(
	'/location/:address',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${req.params.address}&key=${googleAPI}`)
			.then(req => {
				let latitude = req.data.results[0].geometry.location.lat;
				let longitude = req.data.results[0].geometry.location.lng;
				return axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=gym&key=${googleAPI}`);
			})
			.then(req => {
				res.json(req.data.results);
			})
			.catch(e => res.status(404).json(e));
	});
module.exports = router;





