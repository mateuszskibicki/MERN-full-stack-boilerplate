import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import profileReducer from './profileReducer';
import postReducer from './postReducer';
import dietReducer from './dietReducer';
import recipeReducer from './recipeReducer';
import mapReducer from './mapReducer';
import contactReducer from './contactReducer';

export default combineReducers({
	auth: authReducer,
	errors: errorReducer,
	profile: profileReducer,
	post: postReducer,
	diet : dietReducer,
	recipe: recipeReducer,
	map: mapReducer,
	contact: contactReducer
});
