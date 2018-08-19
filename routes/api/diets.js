const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');
const validator = require('validator');

// Post model
const Diet = require('../../models/Diet');
const User = require('../../models/User');

// @route   GET api/diets
// @desc    GET all diets
// @access  Private
router.get(
	'/',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		// find all and populate with user
		// return just id, avatar, name and nickname of user
		Diet.find().sort({date: 1}).populate('user')
			.then(diets => {
				let allDiets = []; // empty array
				diets.map(diet => { // map through array
					let dietWithUser = {
						...diet._doc,
						user: {
							_id: diet.user._id,
							avatar: diet.user.avatar,
							name: diet.user.name,
							nickname: diet.user.nickname
						}
					};
					allDiets.unshift(dietWithUser);
				});
				return res.json(allDiets);
			})
			.catch(e => res.json(e));
	});

// @route   GET api/diets/:id
// @desc    GET diet by id
// @access  Private
router.get(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		// find by ID and populate with user collection
		// return just id, avatar, name and nickname of user
		Diet.findById(req.params.id)
			.populate('user')
			.then(diet => {
				const dietWithUser = {
					...diet._doc,
					user: {
						_id: diet.user._id,
						avatar: diet.user.avatar,
						name: diet.user.name,
						nickname: diet.user.nickname
					}
				};
				res.json(dietWithUser);
			})
			.catch(e => res.json(e));
	});

// @route   GET api/diets/tags/:tag
// @desc    GET diet by tag
// @access  Private
router.get(
	'/tags/:tag',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		// find all and populate with user
		// return just id, avatar, name and nickname of user
		// check if tags contain tag
		Diet.find().populate('user')
			.then(diets => {
				let dietsByTags = []; // empty array
				diets.map(diet => { // map through array
					diet.tags.map((tag) => { // check if tags contains tag(req.params.tag)
						if(tag === req.params.tag) { // return diet with user
							let dietWithTagAndUser = {
								...diet._doc,
								user: {
									_id: diet.user._id,
									avatar: diet.user.avatar,
									name: diet.user.name,
									nickname: diet.user.nickname
								}
							};
							dietsByTags.unshift(dietWithTagAndUser);
						}
					});
				});
				res.json(dietsByTags);
			})
			.catch(e => res.json(e));
	});

// @route   GET api/diets/kcal/:min/:max
// @desc    GET diet by kcal min -> max
// @access  Private
router.get(
	'/kcal/:min/:max',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		// find all and populate with user
		// return just id, avatar, name and nickname of user
		// check if kcal between min and max
		Diet.find().populate('user')
			.then(diets => {
				let dietsByKcal = []; // empty array
				diets.map(diet => { // map through array
					parseInt(diet.kcal) >= parseInt(req.params.min) &&
					parseInt(diet.kcal) <= parseInt(req.params.max) ?
						dietsByKcal.unshift({
							...diet._doc,
							user: {
								_id: diet.user._id,
								avatar: diet.user.avatar,
								name: diet.user.name,
								nickname: diet.user.nickname
							}
						})
						: null;
				});
				res.json(dietsByKcal);
			})
			.catch(e => res.json(e));
	});

// @route   GET api/diets/type/:type
// @desc    GET diet by type
// @access  Private
router.get(
	'/type/:type',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		// find all and populate with user
		// return just id, avatar, name and nickname of user
		// check if type is equal req.params.type
		Diet.find().populate('user')
			.then(diets => {
				let dietsByTags = []; // empty array
				diets.map(diet => { // map through array
					diet.type === req.params.type ?
						dietsByTags.unshift({
							...diet._doc,
							user: {
								_id: diet.user._id,
								avatar: diet.user.avatar,
								name: diet.user.name,
								nickname: diet.user.nickname
							}
						})
						: null;
				});
				res.json(dietsByTags);
			})
			.catch(e => res.json(e));
	});

// @route   POST api/diets
// @desc    Add diet
// @access  Private
router.post(
	'/',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		// required: title, calories, type, description
		// if tags >> comma separated values >> array
		let dietFields = {};
		let dietTags = [];
		let errors = {};
	
		if(_.isEmpty(req.body.title)) {
			errors.title = 'Title is required.';
		} else if (
			req.body.title.trim().length < 5 || 
			req.body.title.trim().length > 50) 
		{
			errors.title = 'Title length between 5 and 50 characters.';
		}
	
		if(_.isEmpty(req.body.kcal)) {
			errors.kcal = 'Calories are required.';
		} else if(!validator.isNumeric(req.body.kcal)){
			errors.kcal = 'Fill with correct data.';
		} else if (
			Number(req.body.kcal) < 1000 || 
			Number(req.body.kcal) > 10000) 
		{
			errors.kcal = 'Diets lower than 1000kcal or bigger than 10000kcal are unhelthy.';
		}
	
		if(_.isEmpty(req.body.type)) {
			errors.type = 'Type of diet is required.';
		}

		if(_.isEmpty(req.body.description)) {
			errors.description = 'Description is required.';
		} else if (
			req.body.description.trim().length < 50 ||
			req.body.description.trim().length > 5000 
		) {
			errors.description = 'Description between 50 and 5000 characters.';
		}

		if(!_.isEmpty(req.body.tags)) {
			dietTags = req.body.tags.trim().split(',');
			dietTags = dietTags.map(diet => {return diet.trim();});
			dietTags = _.uniq(dietTags);
		}

		
	
		if(!_.isEmpty(errors)) {
			return res.status(404).json(errors);
		} else {
			dietFields.title = req.body.title;
			dietFields.kcal = req.body.kcal;
			dietFields.type = req.body.type;
			dietFields.description = req.body.description;
			dietFields.user = req.user._id;
			dietTags.length > 0 ? dietFields.tags = dietTags : '';
			new Diet(dietFields).save()
				.then(diet => res.status(200).json(diet))
				.catch(e => res.status(404).json({succes: false}));
		}
	});

// @route   POST api/diets/addDietToTheUser
// @desc    Add diet id to the user's diets array
// @access  Private
router.post(
	'/addDietToTheUser',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		User.findById(req.user.id)
			.then(user => {
				user.diets.unshift(req.body.dietID);
				user.save().then((newUser) => {
					return res.json(newUser);
				});
			})
			.catch(e => res.status(404).json({succes: false}));
	});


// @route   POST update api/diets
// @desc    Update diet on diets page
// @access  Private
router.post(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		// required: title, calories, type, description
		// if tags >> comma separated values >> array
		Diet.findOne({_id: req.params.id})
			.then(diet => {
				if (diet) {
					if(diet.user.toString() === req.user._id.toString()){ // check if this is diet owner
						let dietFields = {};
						let dietTags = [];
						let errors = {};
				
						if(_.isEmpty(req.body.title)) {
							errors.title = 'Title is required.';
						} else if (
							req.body.title.trim().length < 5 || 
							req.body.title.trim().length > 50) 
						{
							errors.title = 'Title length between 5 and 50 characters.';
						}
				
						if(_.isEmpty(req.body.kcal)) {
							errors.kcal = 'Calories are required.';
						} else if(!validator.isNumeric(req.body.kcal)){
							errors.kcal = 'Fill with correct data.';
						} else if (
							Number(req.body.kcal) < 1000 || 
						Number(req.body.kcal) > 10000) 
						{
							errors.kcal = 'Diets lower than 1000kcal or bigger than 10000kcal are unhelthy.';
						}
				
						if(_.isEmpty(req.body.type)) {
							errors.type = 'Type of diet is required.';
						}
			
						if(_.isEmpty(req.body.description)) {
							errors.description = 'Description is required.';
						} else if (
							req.body.description.trim().length < 50 ||
						req.body.description.trim().length > 5000 
						) {
							errors.description = 'Description between 50 and 5000 characters.';
						}
			
						if(!_.isEmpty(req.body.tags)) {
							dietTags = req.body.tags.trim().split(',');
							dietTags = dietTags.map(diet => {return diet.trim();});
							dietTags = _.uniq(dietTags);
						}
			
					
				
						if(!_.isEmpty(errors)) {
							return res.status(404).json(errors);
						} else {
							dietFields.title = req.body.title;
							dietFields.kcal = req.body.kcal;
							dietFields.type = req.body.type;
							dietFields.description = req.body.description;
							dietFields.user = req.user._id;
							dietTags.length > 0 ? dietFields.tags = dietTags : '';
							Diet.findOneAndUpdate(
								{_id: req.params.id},
								{$set: dietFields},
								{new: true}
							)
								.then(() => {
									Diet.find().sort({date: -1}).populate('user').then(diets => {
										let allDiets = []; // empty array
										diets.map(diet => { // map through array
											let dietWithUser = {
												...diet._doc,
												user: {
													_id: diet.user._id,
													avatar: diet.user.avatar,
													name: diet.user.name,
													nickname: diet.user.nickname
												}
											};
											allDiets.unshift(dietWithUser);
										});
										return res.json(allDiets);
									});
								});
						}
					} else {
						return res.status(400).json({auth: 'This is not your diet'});
					}
				} else {
					return res.status(404).json({success: false});
				}
			})
			.catch(e => res.json({success: false}));
	});

// @route   POST update api/diets/single
// @desc    Update diet on single page
// @access  Private
router.post(
	'/single/:id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		// required: title, calories, type, description
		// if tags >> comma separated values >> array
		Diet.findOne({_id: req.params.id})
			.then(diet => {
				if (diet) {
					if(diet.user.toString() === req.user._id.toString()){ // check if this is diet owner
						let dietFields = {};
						let dietTags = [];
						let errors = {};
				
						if(_.isEmpty(req.body.title)) {
							errors.title = 'Title is required.';
						} else if (
							req.body.title.trim().length < 5 || 
							req.body.title.trim().length > 50) 
						{
							errors.title = 'Title length between 5 and 50 characters.';
						}
				
						if(_.isEmpty(req.body.kcal)) {
							errors.kcal = 'Calories are required.';
						} else if(!validator.isNumeric(req.body.kcal)){
							errors.kcal = 'Fill with correct data.';
						} else if (
							Number(req.body.kcal) < 1000 || 
						Number(req.body.kcal) > 10000) 
						{
							errors.kcal = 'Diets lower than 1000kcal or bigger than 10000kcal are unhelthy.';
						}
				
						if(_.isEmpty(req.body.type)) {
							errors.type = 'Type of diet is required.';
						}
			
						if(_.isEmpty(req.body.description)) {
							errors.description = 'Description is required.';
						} else if (
							req.body.description.trim().length < 50 ||
						req.body.description.trim().length > 5000 
						) {
							errors.description = 'Description between 50 and 5000 characters.';
						}
			
						if(!_.isEmpty(req.body.tags)) {
							dietTags = req.body.tags.trim().split(',');
							dietTags = dietTags.map(diet => {return diet.trim();});
							dietTags = _.uniq(dietTags);
						}
			
					
				
						if(!_.isEmpty(errors)) {
							return res.status(404).json(errors);
						} else {
							dietFields.title = req.body.title;
							dietFields.kcal = req.body.kcal;
							dietFields.type = req.body.type;
							dietFields.description = req.body.description;
							dietFields.user = req.user._id;
							dietTags.length > 0 ? dietFields.tags = dietTags : '';
							Diet.findOneAndUpdate(
								{_id: req.params.id},
								{$set: dietFields},
								{new: true}
							)
								.then(() => {
									Diet.findById(req.params.id).populate('name').then(diet => res.json(diet));
								});
						}
					} else {
						return res.status(400).json({auth: 'This is not your diet'});
					}
				} else {
					return res.status(404).json({success: false});
				}
			})
			.catch(e => res.json({success: false}));
	});

// @route   DIET update api/diets/profilePage
// @desc    Update diet on profile page
// @access  Private
router.post(
	'/profilePage/:id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		// required: title, calories, type, description
		// if tags >> comma separated values >> array
		Diet.findOne({_id: req.params.id})
			.then(diet => {
				if (diet) {
					if(diet.user.toString() === req.user._id.toString()){ // check if this is diet owner
						let dietFields = {};
						let dietTags = [];
						let errors = {};
				
						if(_.isEmpty(req.body.title)) {
							errors.title = 'Title is required.';
						} else if (
							req.body.title.trim().length < 5 || 
							req.body.title.trim().length > 50) 
						{
							errors.title = 'Title length between 5 and 50 characters.';
						}
				
						if(_.isEmpty(req.body.kcal)) {
							errors.kcal = 'Calories are required.';
						} else if(!validator.isNumeric(req.body.kcal)){
							errors.kcal = 'Fill with correct data.';
						} else if (
							Number(req.body.kcal) < 1000 || 
						Number(req.body.kcal) > 10000) 
						{
							errors.kcal = 'Diets lower than 1000kcal or bigger than 10000kcal are unhelthy.';
						}
				
						if(_.isEmpty(req.body.type)) {
							errors.type = 'Type of diet is required.';
						}
			
						if(_.isEmpty(req.body.description)) {
							errors.description = 'Description is required.';
						} else if (
							req.body.description.trim().length < 50 ||
						req.body.description.trim().length > 5000 
						) {
							errors.description = 'Description between 50 and 5000 characters.';
						}
			
						if(!_.isEmpty(req.body.tags)) {
							dietTags = req.body.tags.trim().split(',');
							dietTags = dietTags.map(diet => {return diet.trim();});
							dietTags = _.uniq(dietTags);
						}
			
					
				
						if(!_.isEmpty(errors)) {
							res.status(404).json(errors);
						} else {
							dietFields.title = req.body.title;
							dietFields.kcal = req.body.kcal;
							dietFields.type = req.body.type;
							dietFields.description = req.body.description;
							dietFields.user = req.user._id;
							dietTags.length > 0 ? dietFields.tags = dietTags : '';
							Diet.findOneAndUpdate(
								{_id: req.params.id},
								{$set: dietFields},
								{new: true}
							)
								.then(() => {
									User.findOne({ nickname: req.user.nickname })
										.populate('recipes')
										.populate('diets')
										.populate({path: 'diets', populate : {path: 'user'}})
										.populate('likedDiets')
										.populate({path: 'likedDiets', populate: {path: 'user'}})
										.populate('likedRecipes')
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
						
						
											const userData = {
												_id : user._id,
												name: user.name,
												nickname: user.nickname,
												social: user.social,
												avatar: user.avatar,
												bio: user.bio,
												date: user.date,
												diets: dietsData,
												numberOfDiets: user.diets.length,
												posts: user.posts,
												numberOfPosts: user.posts.length,
												recipes: user.recipes,
												numberOfRecipies: user.recipes.length,
												likedDiets: likedDietsData,
												likedPosts: user.likedPosts,
												likedRecipes: user.likedRecipes,
												likedTrainings: user.likedTrainings
											};
						
											user._id.toString() === req.user._id.toString() ? userData.email = user.email : null;
						
											return res.json(userData);
										})
										.catch(err => res.status(404).json({success: false}));
								});
						}
					} else {
						return res.status(400).json({auth: 'This is not your diet'});
					}
				} else {
					return res.status(404).json({success: false});
				}
			})
			.catch(e => res.json({success: false}));
	});

// @route   POST api/diets/likes/:id
// @desc    POST Like diet by ID
// @access  Private
router.post(
	'/likes/:id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {

		Diet.findById(req.params.id).populate('user').then(diet => {
			if(diet.likes.indexOf(req.user.id.toString()) === -1){
				diet.likes.unshift(req.user.id.toString());
				diet.save().then(newDiet => res.json(newDiet)); //liked
				User.findById(req.user.id).then(user => {
					user.likedDiets.unshift(diet._id);
					user.save();
				});
			} else {
				diet.likes.splice(diet.likes.indexOf(req.user.id.toString()), 1);
				diet.save().then(newDiet => res.json(newDiet)); //unliked
				User.findById(req.user.id).then(user => {
					let dietIndex = user.likedDiets.indexOf(req.params.id);
					dietIndex !== -1 ? user.likedDiets.splice(dietIndex, 1) : null;
					user.save();
				});
			}
		})
			.catch(e => res.json(e));
	});

// @route   POST api/diets/comment/:id
// @desc    POST Add comment to diet by ID
// @access  Private
router.post(
	'/comments/:id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		let errors = {};

		if(_.isEmpty(req.body.comment)) {
			errors.comment = 'Comment body is required, 10-500 characters';
		} else if (
			req.body.comment.trim().length < 10 ||
			req.body.comment.trim().length > 500 
		) {
			errors.comment = 'Length between 10 and 500 characters.';
		}

		if (!_.isEmpty(errors)) {
			return res.status(400).json(errors);
		} else {
			Diet.findById(req.params.id).populate('user').then(diet => {
				let newComment = {
					user : req.user._id,
					body: req.body.comment,
					nickname: req.user.nickname
				};
				diet.comments.unshift(newComment);
	
				diet.save().then((diet) => res.json(diet));
			})
				.catch(e => res.json(e));
		}

	});

// @route   DELETE api/diets/comments/:dietID/:commentID
// @desc    DELETE comment in diet with diet id and comment id
// @access  Private
router.delete(
	'/comments/:dietID/:commentID',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Diet.findById(req.params.dietID).populate('user')
			.then(diet => {
				let commentToDelete = diet.comments.map(
					comment => comment._id.toString() === req.params.commentID.toString() ?
						diet.comments.indexOf(comment) :
						null
				);

				commentToDelete.map(commentIndex => {
					if (commentIndex !== null && commentIndex > -1) {
						if (
							diet.comments[commentIndex].user.toString() === req.user._id.toString()
						) { // user id === comment.user.id
							diet.comments.splice(commentIndex, 1);
							diet.save().then(newDiet => res.json(newDiet));
						} else { // auth false
							res.json({success: false});
						}
					}
				});
				
				
			})
			.catch(e => res.json(e));
	});



// @route   DELETE api/diets/:id
// @desc    DELETE diet by id on diets page
// @access  Private
router.delete(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {

		Diet.findById(req.params.id).then(diet => {
			// if true this is your diet and you can delete this
			if(req.user._id.toString() === diet.user.toString()) {
				diet.remove().then(() => {
					User.findById(req.user.id).then(user => {
						let newUser = user;
						let index = newUser.diets.indexOf(diet._id);
						newUser.diets.splice(index, 1);
						user.save(newUser);
					});
					Diet.find().sort({date: -1}).populate('user').then(diets => {
						let allDiets = []; // empty array
						diets.map(diet => { // map through array
							let dietWithUser = {
								...diet._doc,
								user: {
									_id: diet.user._id,
									avatar: diet.user.avatar,
									name: diet.user.name,
									nickname: diet.user.nickname
								}
							};
							allDiets.unshift(dietWithUser);
						});
						return res.json(allDiets);
					});
				});
			} else {
				return res.status(400).json({success: false});
			}
		})
			.catch(e => res.json(e));
	});

// @route   DELETE api/diets/:id
// @desc    DELETE diet by id on profile page
// @access  Private
router.delete(
	'/profilePage/:id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {

		Diet.findById(req.params.id).then(diet => {
			// if true this is your diet and you can delete this
			if(req.user._id.toString() === diet.user.toString()) {
				diet.remove().then(() => {
					User.findById(req.user.id).then(user => {
						let newUser = user;
						let index = newUser.diets.indexOf(diet._id);
						newUser.diets.splice(index, 1);
						user.save(newUser).then(() => {
							User.findOne({ nickname: req.user.nickname })
								.populate('recipes')
								.populate('diets')
								.populate({path: 'diets', populate : {path: 'user'}})
								.populate('likedDiets')
								.populate({path: 'likedDiets', populate: {path: 'user'}})
								.populate('likedRecipes')
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


									const userData = {
										_id : user._id,
										name: user.name,
										nickname: user.nickname,
										social: user.social,
										avatar: user.avatar,
										bio: user.bio,
										date: user.date,
										diets: dietsData,
										numberOfDiets: user.diets.length,
										posts: user.posts,
										numberOfPosts: user.posts.length,
										recipes: user.recipes,
										numberOfRecipies: user.recipes.length,
										likedDiets: likedDietsData,
										likedPosts: user.likedPosts,
										likedRecipes: user.likedRecipes,
										likedTrainings: user.likedTrainings
									};

									user._id.toString() === req.user._id.toString() ? userData.email = user.email : null;

									return res.json(userData);
								})
								.catch(err => res.status(404).json({success: false}));
						});
					});
				});
		
			} else {
				return res.status(400).json({success: false});
			}
		})
			.catch(e => res.json(e));
	});

module.exports = router;





