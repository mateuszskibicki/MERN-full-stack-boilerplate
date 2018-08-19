const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');
const validator = require('validator');

// Post model
const Recipe = require('../../models/Recipe');
const User = require('../../models/User');

// @route   GET api/recipes
// @desc    GET all recipies
// @access  Private
router.get(
	'/',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		// find all and populate with user
		// return just id, avatar, name and nickname of user
		Recipe.find().populate('user').sort({date: 1})
			.then(recipes => {
				let allRecipes = []; // empty array
				recipes.map(recipe => { // map through array
					let recipeWithUser = {
						...recipe._doc,
						user: {
							_id: recipe.user._id,
							avatar: recipe.user.avatar,
							name: recipe.user.name,
							nickname: recipe.user.nickname
						}
					};
					allRecipes.unshift(recipeWithUser);
				});
				res.json(allRecipes);
			})
			.catch(e => res.json(e));
	});


// @route   GET api/recipes/:id
// @desc    GET recipe by ID
// @access  Private
router.get(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		// find all and populate with user
		// return just id, avatar, name and nickname of user
		Recipe.findById(req.params.id)
			.populate('user')
			//.populate({path: 'comments.user'})
			.then(recipe => {
				let recipeWithUser = {
					...recipe._doc,
					user: {
						_id: recipe.user._id,
						avatar: recipe.user.avatar,
						name: recipe.user.name,
						nickname: recipe.user.nickname
					}
				};
				res.json(recipeWithUser);
			})
			.catch(e => res.json(e));
	});
  

// @route   POST api/recipes
// @desc    Add recipe
// @access  Private
router.post(
	'/',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		// required: title*, kcal*, dishType*, cookingMethod*, cousines*, lifestyle*, 
		// preparationTime*, cookingTime*, shortDescription*, longDescription*, price*
		// if tags* or ingredients* >> comma separated values >> array
		// default date
		let recipeFields = {};
		let recipeTags = [];
		let recipeIngredients = [];
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
		} else if (!_.isNumber(Number(req.body.kcal))) {
			errors.kcal = 'Calories must be a number.';
		}

	
		if(_.isEmpty(req.body.dishType)) {
			errors.dishType = 'Type of meal is required.';
		}
    
		if(_.isEmpty(req.body.cookingMethod)) {
			errors.cookingMethod = 'Cooking method is required.';
		}
    
		if(_.isEmpty(req.body.cuisine)) {
			errors.cuisine = 'Cuisine is required.';
		}

		if(_.isEmpty(req.body.lifestyle)) {
			errors.lifestyle = 'Info about lifestyle is required, people have to know what type of meal it is.';
		}

		if(_.isEmpty(req.body.preparationTime)) {
			errors.preparationTime = 'Preparation time is required.';
		}

		if(_.isEmpty(req.body.cookingTime)) {
			errors.cookingTime = 'Cooking time is required.';
		}

		if(_.isEmpty(req.body.price)) {
			errors.price = 'Price is required.';
		}

		if(_.isEmpty(req.body.shortDescription)) {
			errors.shortDescription = 'Short description is required, 10-200 characters. Define shortly what people can expect with this recipe';
		} else if (
			req.body.shortDescription.trim().length < 10 || 
			req.body.shortDescription.trim().length > 200 
		) {
			errors.shortDescription = 'Short description must be between 10 and 200 characters (letters, numbers, spaces).';
		}

		if(_.isEmpty(req.body.longDescription)) {
			errors.longDescription = 'Long description is required, 50-3000 characters. Explain how to prepare meal and what ingradients are needed.';
		} else if (
			req.body.longDescription.trim().length < 50 || 
			req.body.longDescription.trim().length > 3000 
		) {
			errors.longDescription = 'Long description must be between 50 and 3000 characters (letters, numbers, spaces).';
		}

		if(!_.isEmpty(req.body.tags)) {
			recipeTags = req.body.tags.trim().split(',');
			recipeTags = recipeTags.map(tag => {return tag.trim();});
			recipeTags = _.uniq(recipeTags);
		}

		if(!_.isEmpty(req.body.ingredients)) {
			recipeIngredients = req.body.ingredients.trim().split(',');
			recipeIngredients = recipeIngredients.map(ingredient => {return ingredient.trim();});
			recipeIngredients = _.uniq(recipeIngredients);
		}

		
	
		if(!_.isEmpty(errors)) {
			return res.status(404).json(errors);
		} else {
			// create object with key value pairs
			// required
			recipeFields.title = req.body.title.trim();
			recipeFields.kcal = req.body.kcal;
			recipeFields.dishType = req.body.dishType;
			recipeFields.cookingMethod = req.body.cookingMethod;
			recipeFields.cuisine = req.body.cuisine;
			recipeFields.lifestyle = req.body.lifestyle;
			recipeFields.preparationTime = req.body.preparationTime;
			recipeFields.cookingTime = req.body.cookingTime;
			recipeFields.price = req.body.price;
			recipeFields.shortDescription = req.body.shortDescription.trim();
			recipeFields.longDescription = req.body.longDescription.trim();
			recipeFields.user = req.user._id;
			// optional
			recipeTags.length > 0 ? recipeFields.tags = recipeTags : null;
			recipeIngredients.length > 0 ? recipeFields.ingredients = recipeIngredients : null;

			new Recipe(recipeFields).save()
				.then(recipe => res.status(200).json(recipe))
				.catch(e => res.status(400).json(e));
		}
	});

// @route   POST api/recipes/addRecipeToTheUser
// @desc    Add recipe id to the user's diets array
// @access  Private
router.post(
	'/addRecipeToTheUser',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		User.findById(req.user.id)
			.then(user => {
				user.recipes.unshift(req.body.recipeID);
				user.save().then((newUser) => {
					return res.json(newUser);
				});
			})
			.catch(e => res.status(404).json({succes: false}));
	});

// @route   POST api/recipes
// @desc    Update recipe
// @access  Private
router.post(
	'/update/:id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		// required: title*, kcal*, dishType*, cookingMethod*, cousines*, lifestyle*, 
		// preparationTime*, cookingTime*, shortDescription*, longDescription*, price*
		// if tags* or ingredients* >> comma separated values >> array
		// default date
		let recipeFields = {};
		let recipeTags = [];
		let recipeIngredients = [];
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
		} else if (!_.isNumber(Number(req.body.kcal))) {
			errors.kcal = 'Calories must be a number.';
		}

	
		if(_.isEmpty(req.body.dishType)) {
			errors.dishType = 'Type of meal is required.';
		}
    
		if(_.isEmpty(req.body.cookingMethod)) {
			errors.cookingMethod = 'Cooking method is required.';
		}
    
		if(_.isEmpty(req.body.cuisine)) {
			errors.cuisine = 'Cuisine is required.';
		}

		if(_.isEmpty(req.body.lifestyle)) {
			errors.lifestyle = 'Info about lifestyle is required, people have to know what type of meal it is.';
		}

		if(_.isEmpty(req.body.preparationTime)) {
			errors.preparationTime = 'Preparation time is required.';
		}

		if(_.isEmpty(req.body.cookingTime)) {
			errors.cookingTime = 'Cooking time is required.';
		}

		if(_.isEmpty(req.body.price)) {
			errors.price = 'Price is required.';
		}

		if(_.isEmpty(req.body.shortDescription)) {
			errors.shortDescription = 'Short description is required, 10-200 characters. Define shortly what people can expect with this recipe';
		} else if (
			req.body.shortDescription.trim().length < 10 || 
			req.body.shortDescription.trim().length > 200 
		) {
			errors.shortDescription = 'Short description must be between 10 and 200 characters (letters, numbers, spaces).';
		}

		if(_.isEmpty(req.body.longDescription)) {
			errors.longDescription = 'Long description is required, 50-3000 characters. Explain how to prepare meal and what ingradients are needed.';
		} else if (
			req.body.longDescription.trim().length < 50 || 
			req.body.longDescription.trim().length > 3000 
		) {
			errors.longDescription = 'Long description must be between 50 and 3000 characters (letters, numbers, spaces).';
		}

		if(!_.isEmpty(req.body.tags)) {
			recipeTags = req.body.tags.trim().split(',');
			recipeTags = recipeTags.map(tag => {return tag.trim();});
			recipeTags = _.uniq(recipeTags);
		}

		if(!_.isEmpty(req.body.ingredients)) {
			recipeIngredients = req.body.ingredients.trim().split(',');
			recipeIngredients = recipeIngredients.map(ingredient => {return ingredient.trim();});
			recipeIngredients = _.uniq(recipeIngredients);
		}

		
	
		if(!_.isEmpty(errors)) {
			return res.status(404).json(errors);
		} else {
			// create object with key value pairs
			// required
			recipeFields.title = req.body.title.trim();
			recipeFields.kcal = req.body.kcal;
			recipeFields.dishType = req.body.dishType;
			recipeFields.cookingMethod = req.body.cookingMethod;
			recipeFields.cuisine = req.body.cuisine;
			recipeFields.lifestyle = req.body.lifestyle;
			recipeFields.preparationTime = req.body.preparationTime;
			recipeFields.cookingTime = req.body.cookingTime;
			recipeFields.price = req.body.price;
			recipeFields.shortDescription = req.body.shortDescription.trim();
			recipeFields.longDescription = req.body.longDescription.trim();
			recipeFields.user = req.user._id;
			// optional
			recipeTags.length > 0 ? recipeFields.tags = recipeTags : null;
			recipeIngredients.length > 0 ? recipeFields.ingredients = recipeIngredients : null;

			Recipe.findOneAndUpdate(
				{_id: req.params.id},
				{$set: recipeFields},
				{new: true}
			).then(newDiet => {
				return res.status(200).json(newDiet);
			});
					
		}
	});
	

// @route   POST api/recipes/likes/:id
// @desc    POST Like recipe by ID
// @access  Private
router.post(
	'/likes/:id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {

		Recipe.findById(req.params.id).then(recipe => {
			if(recipe.likes.indexOf(req.user.id.toString()) === -1){
				recipe.likes.unshift(req.user.id.toString());
				recipe.save(() => res.json({success: true})); //liked
				User.findById(req.user.id).then(user => {
					user.likedRecipes.unshift(recipe._id);
					user.save();
				});
			} else {
				recipe.likes.splice(recipe.likes.indexOf(req.user.id.toString()), 1);
				recipe.save(() => res.json({success: false})); //unliked
				User.findById(req.user.id).then(user => {
					let recipeIndex = user.likedRecipes.indexOf(req.params.id);
					recipeIndex !== -1 ? user.likedRecipes.splice(recipeIndex, 1) : null;
					user.save();
				});
			}
		})
			.catch(e => res.json(e));
	});

// @route   DELETE api/recipe/:id
// @desc    DELETE recipe by id
// @access  Private
router.delete(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {

		Recipe.findById(req.params.id).then(recipe => {
			// if true this is your recipe and you can delete this
			if(req.user._id.toString() === recipe.user.toString()) {
				recipe.remove().then(() => {
					res.json({success: true});
					User.findById(req.user.id).then(user => {
						let newUser = user;
						let index = newUser.recipes.indexOf(recipe._id);
						newUser.recipes.splice(index, 1);
						user.save(newUser);
					});
				});
			} else {
				return res.status(400).json({success: false});
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
		}

		Recipe.findById(req.params.id).then(recipe => {
			let newComment = {
				user : Object(req.user._id),
				body: req.body.comment,
				nickname: req.user.nickname
			};
			recipe.comments.unshift(newComment);

			recipe.save().then((recipe) => res.json(recipe));
		})
			.catch(e => res.json(e));
	});

// @route   DELETE api/diets/comments/:recipeID/:commentID
// @desc    DELETE comment in diet by recipe id and comment id
// @access  Private
router.delete(
	'/comments/:recipeID/:commentID',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Recipe.findById(req.params.recipeID)
			.then(recipe => {
				let commentToDelete = recipe.comments.map(
					comment => comment._id.toString() === req.params.commentID.toString() ?
						recipe.comments.indexOf(comment) :
						null
				);

				commentToDelete.map(commentIndex => {
					if (commentIndex !== null && commentIndex > -1) {
						if (
							recipe.comments[commentIndex].user.toString() === req.user._id.toString()
						) { // user id === comment.user.id
							recipe.comments.splice(commentIndex, 1);
							recipe.save().then(() => res.json({success: true}));
						} else { // auth false
							res.status(404).json({success: false});
						}
					} else {
						res.json({
							errors: 'There is no comment with this ID'
						});
					}
				});
				
				
			})
			.catch(e => res.status(404).json(e));
	});

module.exports = router;
