import axios from 'axios';

import {
	GET_DIET,
	ADD_DIET,
	GET_DIETS,
	GET_ERRORS,
	CLEAR_ERRORS,
	DIET_LOADING,
	GET_DIET_BY_ID,
	DELETE_DIET,
	DELETE_DIET_PROFILE_PAGE,
	ADD_COMMENT_DIET,
	DELETE_COMMENT_DIET,
	LIKE_DIET,
	UPDATE_DIET,
	UPDATE_DIET_SINGLE_PAGE,
	UPDATE_DIET_PROFILE_PAGE,
	GET_DIET_BY_ID_WITHOUT_LOADING
} from './types';

import {getProfileByHandle} from './profileActions';

// Get diets
export const getDiets = () => dispatch => {
	dispatch(clearErrors());
	dispatch(dietLoading());
	axios.get('/api/diets')
		.then(res => dispatch({type: GET_DIETS, payload: res.data }))
		.catch(err => dispatch({type: GET_ERRORS, payload: err.response.data}));
};

// Get diet by ID
export const getDietByID = (id) => dispatch => {
	dispatch(dietLoading());
	axios.get(`/api/diets/${id}`)
		.then(res => dispatch({type: GET_DIET_BY_ID, payload: res.data }))
		.catch(err => dispatch({type: GET_ERRORS, payload: err.response.data}));
};

// Get diet by ID without loading
export const getDietByIdWithoutLoading = (id) => dispatch => {
	axios.get(`/api/diets/${id}`)
		.then(res => dispatch({type: GET_DIET_BY_ID_WITHOUT_LOADING, payload: res.data }))
		.catch(err => dispatch({type: GET_ERRORS, payload: err.response.data}));
};

// Add diet
export const addDiet = (dietData) => dispatch => {
	axios.post('/api/diets', dietData)
		.then((res) => {
			dispatch(clearErrors());
			dispatch(getDiets());
			dispatch(updateUserWithNewDiet({dietID: res.data._id}));
		})
		.catch(err => dispatch({type: GET_ERRORS, payload: err.response.data}));
};

// Add diet to the user's diet array
export const updateUserWithNewDiet = (dietID) => dispatch => {
	axios.post('/api/diets/addDietToTheUser', dietID)
		.then(() => {
			console.log('Diet added to the user');
		})
		.catch(err => dispatch({type: GET_ERRORS, payload: err.response.data}));
};

// Update diet on main /diets page
export const updateDiet = (id ,dietData) => dispatch => {
	dispatch(clearErrors());
	axios.post(`/api/diets/${id}`, dietData)
		.then((res) => {
			dispatch({type: UPDATE_DIET, payload: res.data});
		})
		.catch(err => dispatch({type: GET_ERRORS, payload: err.response.data}));
};

// Update diet on profile page
export const updateDietOnProfilePage = (id ,dietData, userNickname) => dispatch => {
	dispatch(clearErrors());
	axios.post(`/api/diets/profilePage/${id}`, dietData)
		.then((res) => {
			dispatch(getProfileByHandle(userNickname));
		})
		.catch(err => dispatch({type: GET_ERRORS, payload: err.response.data}));
};

// Update diet on single page
export const updateDietSinglePage = (id ,dietData) => dispatch => {
	dispatch(clearErrors());
	axios.post(`/api/diets/${id}`, dietData)
		.then((res) => {
			dispatch(getDietByIdWithoutLoading(id));
		})
		.catch(err => dispatch({type: GET_ERRORS, payload: err.response.data}));
};

// Delete diet on diets page
export const deleteDiet = (id) => dispatch => {
	axios.delete(`/api/diets/${id}`)
		.then((res) => {
			dispatch({type: DELETE_DIET, payload: res.data});
		})
		.catch(err => dispatch({type: GET_ERRORS, payload: err.response.data}));
};


// Delete diet on single page
export const deleteDietSinglePage = (id, history) => dispatch => {
	axios.delete(`/api/diets/${id}`)
		.then((res) => history.push('/diets'))
		.catch(err => dispatch({type: GET_ERRORS, payload: err.response.data}));
};

// Delete diet on profile page
export const deleteDietProfilePage = (id) => dispatch => {
	axios.delete(`/api/diets/profilePage/${id}`)
		.then((res) => {
			dispatch({type: DELETE_DIET_PROFILE_PAGE, payload: res.data});
		})
		.catch(err => dispatch({type: GET_ERRORS, payload: err.response.data}));
};

// Like diet
export const likeDiet = (id) => dispatch => {
	axios.post(`/api/diets/likes/${id}`)
		.then(res =>dispatch({type: LIKE_DIET, payload: res.data})		)
		.catch(err => dispatch({type: GET_ERRORS, payload: err.response.data}));
};

// Add comment to diet
export const addComment = (id, data) => dispatch => {
	dispatch(clearErrors());
	axios.post(`/api/diets/comments/${id}`, data)
		.then(res => {
			dispatch(clearErrors());
			dispatch({type: ADD_COMMENT_DIET, payload: res.data});		
		})
		.catch(err => dispatch({type: GET_ERRORS, payload: err.response.data}));
};

// Delete comment in diet
export const deleteCommentDiet = (dietId, commentId) => dispatch => {
	axios.delete(`/api/diets/comments/${dietId}/${commentId}`)
		.then(res => {
			dispatch({type: DELETE_COMMENT_DIET, payload: res.data});		
		})
		.catch(err => dispatch({type: GET_ERRORS, payload: err.response.data}));
};



// Diet loading
export const dietLoading = () => {
	return { type: DIET_LOADING };
};

// Clear errors
export const clearErrors = () => {
	return { type: CLEAR_ERRORS };
};
