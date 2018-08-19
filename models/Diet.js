const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const DietSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	kcal: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	tags: [{
		type: String
	}],
	likes: [{
		type: String
	}],
	comments: [
		{
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'users'
			},
			nickname: {
				type: String
			},
			body: {
				type: String
			},
			date: {
				type: Date,
				default: Date.now
			}
		}
	],
	date: {
		type: Date,
		default: Date.now
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users'
	}
});

module.exports = Diet = mongoose.model('diets', DietSchema);
