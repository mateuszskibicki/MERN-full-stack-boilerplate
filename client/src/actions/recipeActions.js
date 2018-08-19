import axios from 'axios';

import {
	GET_RECIPE_BY_ID,
	GET_RECIPE_BY_ID_WITHOUT_LOADING,
	GET_RECIPES,
	GET_ERRORS,
	RECIPE_LOADING,
	ADD_RECIPE,
	LIKE_RECIPE,
	CLEAR_ERRORS
} from '../actions/types';

import {getProfileByHandle, getProfileByHandleWithoutLoading} from './profileActions';

// Get recipes
export const getRecipes = () => dispatch => {
	dispatch(clearErrors());
	dispatch(recipeLoading());
	axios.get('/api/recipes')
		.then(res => dispatch({type: GET_RECIPES, payload: res.data }))
		.catch(err => dispatch({type: GET_ERRORS, payload: err.response.data}));
};

// Get recipes
export const getRecipeByID = (id) => dispatch => {
	dispatch(clearErrors());
	dispatch(recipeLoading());
	axios.get(`/api/recipes/${id}`)
		.then(res => dispatch({type: GET_RECIPE_BY_ID, payload: res.data }))
		.catch(err => dispatch({type: GET_ERRORS, payload: err.response.data}));
};

// Get recipes
export const getRecipeByIdWithoutLoading = (id) => dispatch => {
	axios.get(`/api/recipes/${id}`)
		.then(res => dispatch({type: GET_RECIPE_BY_ID_WITHOUT_LOADING, payload: res.data }))
		.catch(err => dispatch({type: GET_ERRORS, payload: err.response.data}));
};

// Add recipes
export const addRecipe = (recipeData) => dispatch => {
	axios.post('/api/recipes', recipeData)
		.then(res => {
			dispatch(clearErrors());
			dispatch(getRecipes());
			dispatch(updateUserWithNewRecipe({recipeID: res.data._id}));
		})
		.catch(err => dispatch({type: GET_ERRORS, payload: err.response.data}));
};

// Add recipe to the user's diet array
export const updateUserWithNewRecipe = (recipeID) => dispatch => {
	axios.post('/api/recipes/addRecipeToTheUser', recipeID)
		.then(() => {
			console.log('Recipe added to the user');
		})
		.catch(err => dispatch({type: GET_ERRORS, payload: err.response.data}));
};

// Update recipe on main /recipes page
export const updateRecipe = (id , recipeData) => dispatch => {
	axios.post(`/api/recipes/update/${id}`, recipeData)
		.then(() => {
			dispatch(getRecipes());
		})
		.catch(err => dispatch({type: GET_ERRORS, payload: err.response.data}));
};

// Update recipe on single page /recipes/:id
export const updateRecipeSinglePage = (id , recipeData) => dispatch => {
	axios.post(`/api/recipes/update/${id}`, recipeData)
		.then((res) => {
			dispatch(clearErrors());
			dispatch(getRecipeByIdWithoutLoading(id));
		})
		.catch(err => dispatch({type: GET_ERRORS, payload: err.response.data}));
};

// Update recipe on single page /recipes/:id
export const updateRecipeProfilePage = (id , recipeData, userNickname) => dispatch => {
	axios.post(`/api/recipes/update/${id}`, recipeData)
		.then((res) => {
			dispatch(clearErrors());
			dispatch(getProfileByHandle(userNickname));
		})
		.catch(err => dispatch({type: GET_ERRORS, payload: err.response.data}));
};

// Delete recipe on recipe page
export const deleteRecipe = (id) => dispatch => {
	axios.delete(`/api/recipes/${id}`)
		.then(() => {
			dispatch(getRecipes());
		})
		.catch(err => dispatch({type: GET_ERRORS, payload: err.response.data}));
};

// Delete recipe on profile page
export const deleteRecipeProfilePage = (id, nickname) => dispatch => {
	axios.delete(`/api/recipes/${id}`)
		.then(() => {
			dispatch(getProfileByHandleWithoutLoading(nickname));
		})
		.catch(err => dispatch({type: GET_ERRORS, payload: err.response.data}));
};

// Like recipe
export const likeRecipe = (id) => dispatch => {
	axios.post(`/api/recipes/likes/${id}`)
		.then(() => dispatch(getRecipeByIdWithoutLoading(id)))
		.catch(err => dispatch({type: GET_ERRORS, payload: err.response.data}));
};

// Add comment to recipe
export const addComment = (id, data) => dispatch => {
	dispatch(clearErrors());
	axios.post(`/api/recipes/comments/${id}`, data)
		.then(res => {
			dispatch(clearErrors());
			dispatch(getRecipeByIdWithoutLoading(id));
		})
		.catch(err => dispatch({type: GET_ERRORS, payload: err.response.data}));
};

// Delete comment in recipe
export const deleteCommentRecipe = (recipeId, commentId) => dispatch => {
	axios.delete(`/api/recipes/comments/${recipeId}/${commentId}`)
		.then(res => {
			dispatch(getRecipeByIdWithoutLoading(recipeId));	
		})
		.catch(err => dispatch({type: GET_ERRORS, payload: err.response.data}));
};

// Delete recipe on single page
export const deleteRecipeSinglePage = (id, history) => dispatch => {
	axios.delete(`/api/recipes/${id}`)
		.then((res) => history.push('/recipes'))
		.catch(err => dispatch({type: GET_ERRORS, payload: err.response.data}));
};


// Recipe loading
export const recipeLoading = () => {
	return { type: RECIPE_LOADING };
};

// Clear errors
export const clearErrors = () => {
	return { type: CLEAR_ERRORS };
};
