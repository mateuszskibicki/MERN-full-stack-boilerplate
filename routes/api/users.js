const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const _ = require('lodash');
const validator = require('validator');

var fs = require('fs');
var busboy = require('connect-busboy');

// Load User model
const User = require('../../models/User');
const avatarDefault = 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png';

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.post('/test', (req, res) => {

	var fstream;
	req.pipe(req.busboy);
	req.busboy.on('file', function (fieldname, file, filename) {
		console.log('Uploading: ' + filename); 
		fstream = fs.createWriteStream(__dirname + '/../../client/src/images/profile-images/' + Date.now() + filename);
		file.pipe(fstream);
		fstream.on('close', function () {
			res.redirect('back');
		});
	});

});

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
	let errors = {};

	let newUser = {
		name: '',
		nickname: '',
		email: '',
		password: '',
		password2: ''
	};

	if(_.isEmpty(req.body.name)) {
		errors.name = 'Full name is required.';
	} else if(req.body.name.trim().length < 2 || req.body.name.trim().length > 30) {
		errors.name = 'Length between 2 and 30 characters.';
	} else {
		// Validated
		newUser.name = req.body.name.trim();
	}
	
	if(_.isEmpty(req.body.nickname)) {
		errors.nickname = 'Nickname is required.';
	} else if(req.body.nickname.trim().length < 6 || req.body.nickname.trim().length > 30) {
		errors.nickname = 'Length between 6 and 30 characters.';
	} else {
		// Validated
		newUser.nickname = req.body.nickname.trim();
	}
	
	if(_.isEmpty(req.body.email)) {
		errors.email = 'Email is required.';
	} else if (!validator.isEmail(req.body.email)) {
		errors.email = 'Email is incorrect.';
	} else {
		// Validated
		newUser.email = req.body.email.trim();
	}
	
	if(_.isEmpty(req.body.password)) {
		errors.password = 'Password is required.';
	} else if (req.body.password.trim().length < 6 || req.body.password.trim().length > 20) {
		errors.password = 'Password length between 6 and 20 characters.';
	} else {
		// Validated
		newUser.password = req.body.password.trim();
	}
	
	if(_.isEmpty(req.body.password2)) {
		errors.password2 = 'Confirm password is required.';
	} else if (req.body.password !== req.body.password2) {
		errors.password2 = 'Passwords must match.';
	} else {
		// Validated
		newUser.password2 = req.body.password2.trim();
	}

	let social = {};
	req.body.facebook ? social.facebook = req.body.facebook.trim() : null;
	req.body.twitter ? social.twitter = req.body.twitter.trim() : null;
	req.body.instagram ? social.instagram = req.body.instagram.trim() : null;
	req.body.linkedin ? social.linkedin = req.body.linkedin.trim() : null;
	req.body.website ? social.website = req.body.website.trim() : null;

	if(social.facebook) {
		!validator.isURL(social.facebook) ? errors.facebook = 'Facebook URL is not valid.' : null; 
	}

	if(social.twitter) {
		!validator.isURL(social.twitter) ? errors.twitter = 'Twitter URL is not valid.' : null; 
	}

	if(social.instagram) {
		!validator.isURL(social.instagram) ? errors.instagram = 'Instagram URL is not valid.' : null; 
	}

	if(social.linkedin) {
		!validator.isURL(social.linkedin) ? errors.linkedin = 'Facebook URL is not valid.' : null; 
	}

	if(social.website) {
		!validator.isURL(social.website) ? errors.website = 'Website URL is not valid.' : null; 
	}

	let bio = '';
	if(!_.isEmpty(req.body.bio)) {
		bio = req.body.bio.trim();
	}
	
	if (!_.isEmpty(errors)) {
		return res.status(400).json(errors);
	} else {
		// Validated and ready to register
		User.findOne({ nickname: req.body.nickname }).then(user => { // if username exists
			if (user) {
				errors.nickname = 'Nickname already exists in database.';
				return res.status(400).json(errors);
			} else {
				User.findOne({ email: req.body.email }).then(user => { // if email exists
					if(user) {
						errors.email = 'Email already exists in database.';
						return res.status(400).json(errors);
					} else {
						const avatar = gravatar.url(req.body.email, {
							s: '300', // Size
							r: 'pg', // Rating
							d: 'mm' // Default
						});
		
						//console.log(newUser);
			
						const userData = new User({
							name: newUser.name,
							nickname: newUser.nickname,
							email: newUser.email,
							password: newUser.password,
							avatar: avatar,
							social: social,
							bio: bio
						});
		
						//console.log(userData);
			
						bcrypt.genSalt(10, (err, salt) => {
							bcrypt.hash(userData.password, salt, (err, hash) => {
								if (err) {
									return res.status(400).json(err);
								}
								userData.password = hash;
								userData
									.save()
									.then(user => res.json(user)) // REGISTERED
									.catch(err => console.log(err));
							});
						});
					}
				});

			}
		});
	}
});

// @route   POST api/users/registerWithFacebook
// @desc    Register user with facebook ID and use avatar
// @access  Public
router.post('/registerWithFacebook', (req, res) => {
	User.findOne({facebook: req.body.userID})
		.then(user => {
			if(user) {
				const payload = { id: user.id, name: user.name, avatar: user.avatar, nickname: user.nickname }; // Create JWT Payload
				// Sign Token
				jwt.sign(
					payload,
					keys.secretOrKey,
					{ expiresIn: 36000 },
					(err, token) => {
						res.json({
							success: true,
							token: 'Bearer ' + token
						});
					}
				);
			} else {
				let date = new Date();
				let time = date.getTime();
				const userData = new User({
					name: req.body.name,
					nickname: req.body.name.split(' '),
					email: req.body.email,
					password: String(time),
					avatar: `https://graph.facebook.com/v3.1/${req.body.userID}/picture?type=large`,
					facebook: req.body.userID
				});
				userData
					.save()
					.then(newUser => {
						const payload = { id: newUser.id, name: newUser.name, avatar: newUser.avatar, nickname: newUser.nickname }; // Create JWT Payload
						// Sign Token
						jwt.sign(
							payload,
							keys.secretOrKey,
							{ expiresIn: 36000 },
							(err, token) => {
								res.json({
									success: true,
									token: 'Bearer ' + token
								});
							}
						);
					})
					.catch(err => res.status(404).json(err));
			}
		})
		.catch(e => console.log(e));
});

// @route   POST api/users/update/:id
// @desc    Update user by ID
// @access  Private

router.post(
	'/update/:id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		let errors = {};

		let updatedUser = {
			name: '',
			nickname: ''
		};
	
		if(_.isEmpty(req.body.name)) {
			errors.name = 'Full name is required.';
		} else if(req.body.name.trim().length < 2 || req.body.name.trim().length > 30) {
			errors.name = 'Length between 2 and 30 characters.';
		} else {
			// Validated
			updatedUser.name = req.body.name.trim();
		}
		
		if(_.isEmpty(req.body.nickname)) {
			errors.nickname = 'Nickname is required.';
		} else if(req.body.nickname.trim().length < 6 || req.body.nickname.trim().length > 30) {
			errors.nickname = 'Length between 6 and 30 characters.';
		} else {
			// Validated
			updatedUser.nickname = req.body.nickname.trim();
		}
	
		let social = {};
		req.body.facebook ? social.facebook = req.body.facebook.trim() : null;
		req.body.twitter ? social.twitter = req.body.twitter.trim() : null;
		req.body.instagram ? social.instagram = req.body.instagram.trim() : null;
		req.body.linkedin ? social.linkedin = req.body.linkedin.trim() : null;
		req.body.website ? social.website = req.body.website.trim() : null;
	
		if(social.facebook) {
			!validator.isURL(social.facebook) ? errors.facebook = 'Facebook URL is not valid.' : null; 
		}
	
		if(social.twitter) {
			!validator.isURL(social.twitter) ? errors.twitter = 'Twitter URL is not valid.' : null; 
		}
	
		if(social.instagram) {
			!validator.isURL(social.instagram) ? errors.instagram = 'Instagram URL is not valid.' : null; 
		}
	
		if(social.linkedin) {
			!validator.isURL(social.linkedin) ? errors.linkedin = 'LinkedIn URL is not valid.' : null; 
		}
	
		if(social.website) {
			!validator.isURL(social.website) ? errors.website = 'Website URL is not valid.' : null; 
		}
	
		let bio = '';
		if(!_.isEmpty(req.body.bio)) {
			bio = req.body.bio.trim();
		}
		
		if (!_.isEmpty(errors)) {
			return res.status(400).json(errors);
		} else {
			// Validated and ready to update
			User.findById(req.params.id)
				.then(user => {
					let userData = {
						name: updatedUser.name,
						nickname: updatedUser.nickname,
						email: user.email,
						password: user.password,
						avatar: user.avatar,
						social: social,
						bio: bio
					};
					User.findOneAndUpdate(
						{_id: req.params.id},
						{$set: userData},
						{new: true}
					).then((user) => {
						res.json(user);
					});
				})
				.catch(e => res.status(404));
		}
	}
);





// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
	let errors = {};
	const email = req.body.email;
	const password = req.body.password;

	if (email && password) {
		// Find user by email
		User.findOne({ email }).then(user => {
			// Check for user
			if (!user) {
				errors.email = 'User not found.';
				return res.status(404).json(errors);
			}

			// Check Password
			bcrypt.compare(password, user.password).then(isMatch => {
				if (isMatch) {
			
					// User Matched
					const payload = { id: user.id, name: user.name, avatar: user.avatar, nickname: user.nickname }; // Create JWT Payload
					// Sign Token
					jwt.sign(
						payload,
						keys.secretOrKey,
						{ expiresIn: 36000 },
						(err, token) => {
							res.json({
								success: true,
								token: 'Bearer ' + token
							});
						}
					);
				} else {
					errors.password = 'Password incorrect';
					return res.status(400).json(errors);
				}
			});
		});
	} else {
		errors.email = 'Email is required.';
		errors.password = 'Password is required.';
		return res.status(404).json(errors);
	}
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
	'/current',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		User.findById(req.user.id)
			.populate('recipes')
			.populate('diets')
			.populate({path: 'diets'})
			.populate('likedDiets')
			.populate({path: 'likedDiets', populate: {path: 'user'}})
			.populate('likedRecipes')
			.then(user => {
				const userData = {
					_id : user._id,
					name: user.name,
					nickname: user.nickname,
					social: user.social,
					avatar: user.avatar,
					bio: user.bio,
					date: user.date,
					diets: user.diets,
					numberOfDiets: user.diets.length,
					posts: user.posts,
					numberOfPosts: user.posts.length,
					recipes: user.recipes,
					numberOfRecipies: user.recipes.length,
					likedDiets: user.likedDiets,
					likedPosts: user.likedPosts,
					likedRecipes: user.likedRecipes,
					likedTrainings: user.likedTrainings
				};

				res.json(userData);
			});
	}
);

// @route   GET api/users/all
// @desc    Find all users
// @access  Private
router.get(
	'/all',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		User.find().sort({date: -1})
			.then(users => {
				const usersToDisplay = [];
				users.forEach(user => {
					usersToDisplay.push({
						_id : user._id,
						name: user.name,
						nickname: user.nickname,
						avatar: user.avatar,
						date: user.date,
						social: user.social,
						numberOfDiets: user.diets.length,
						numberOfPosts: user.posts.length,
						numberOfRecipes: user.recipes.length,
						numberOfTrainings: user.trainings.length,
					});
				});
				res.json(usersToDisplay);
			}
			);
	});


// @route   GET api/users/:nickname
// @desc    Find user by nickname
// @access  Private
router.get(
	'/:nickname',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		User.findOne({ nickname: req.params.nickname })
			.populate('recipes')
			.populate({path: 'recipes', populate : {path: 'user'}})
			.populate('diets')
			.populate({path: 'diets', populate : {path: 'user'}})
			.populate('likedDiets')
			.populate({path: 'likedDiets', populate: {path: 'user'}})
			.populate('likedRecipes')
			.populate({path: 'likedRecipes', populate : {path: 'user'}})
			.then(user => {
				let dietsData = user.diets.map(diet => (
					{
						comments: diet.comments,
						date: diet.date,
						description: diet.description,
						kcal: diet.kcal,
						likes: diet.likes,
						tags: diet.tags,
						title: diet.title,
						type: diet.type,
						_id: diet._id,
						user: {
							name: diet.user.name,
							nickname: diet.user.nickname,
							avatar: diet.user.avatar,
							_id: diet.user._id
						}
					}
				));

				let likedDietsData = user.likedDiets.map(diet => (
					{
						comments: diet.comments,
						date: diet.date,
						description: diet.description,
						kcal: diet.kcal,
						likes: diet.likes,
						tags: diet.tags,
						title: diet.title,
						type: diet.type,
						_id: diet._id,
						user: {
							name: diet.user.name,
							nickname: diet.user.nickname,
							avatar: diet.user.avatar,
							_id: diet.user._id
						}
					}
				));

				let recipeData = user.recipes.map(recipe => (
					{
						comments: recipe.comments,
						date: recipe.date,
						shortDescription: recipe.shortDescription,
						longDescription: recipe.longDescription,
						kcal: recipe.kcal,
						likes: recipe.likes,
						tags: recipe.tags,
						ingredients: recipe.ingredients,
						title: recipe.title,
						cookingMethod: recipe.cookingMethod,
						lifestyle: recipe.lifestyle,
						cookingTime: recipe.cookingTime,
						preparationTime: recipe.preparationTime,
						price: recipe.price,
						cuisine: recipe.cuisine,
						dishType: recipe.dishType,
						_id: recipe._id,
						user: {
							name: recipe.user.name,
							nickname: recipe.user.nickname,
							avatar: recipe.user.avatar,
							_id: recipe.user._id
						}
					}
				));

				let likedRecipesData = user.likedRecipes.map(recipe => (
					{
						comments: recipe.comments,
						date: recipe.date,
						shortDescription: recipe.shortDescription,
						longDescription: recipe.longDescription,
						kcal: recipe.kcal,
						likes: recipe.likes,
						tags: recipe.tags,
						ingredients: recipe.ingredients,
						title: recipe.title,
						cookingMethod: recipe.cookingMethod,
						lifestyle: recipe.lifestyle,
						cookingTime: recipe.cookingTime,
						preparationTime: recipe.preparationTime,
						price: recipe.price,
						cuisine: recipe.cuisine,
						dishType: recipe.dishType,
						_id: recipe._id,
						user: {
							name: recipe.user.name,
							nickname: recipe.user.nickname,
							avatar: recipe.user.avatar,
							_id: recipe.user._id
						}
					}
				));


				const userData = {
					_id : user._id,
					name: user.name,
					nickname: user.nickname,
					facebook: user.facebook,
					social: user.social,
					avatar: user.avatar,
					bio: user.bio,
					date: user.date,
					diets: dietsData,
					numberOfDiets: user.diets.length,
					posts: user.posts,
					numberOfPosts: user.posts.length,
					recipes: recipeData,
					numberOfRecipes: user.recipes.length,
					likedDiets: likedDietsData,
					likedPosts: user.likedPosts,
					likedRecipes: likedRecipesData,
					likedTrainings: user.likedTrainings
				};

				user._id.toString() === req.user._id.toString() ? userData.email = user.email : null;

				res.status(200).json(userData);
			})
			.catch(err => res.status(404).json({success: false}));
	});


// @route   Delete api/users/:id
// @desc    Find all users
// @access  Private
router.delete(
	'/delete',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		User.findOneAndRemove({_id : req.user.id})
			.then(() => res.json({success: true}));
	});

module.exports = router;
