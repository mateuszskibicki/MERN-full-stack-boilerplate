import axios from 'axios';
import {logoutUser} from './authActions';

import {
	GET_PROFILE,
	GET_PROFILES,
	PROFILE_LOADING,
	PROFILE_LOADING_FALSE,
	CLEAR_CURRENT_PROFILE,
	GET_ERRORS,
	SET_CURRENT_USER,
	CLEAR_ERRORS
} from './types';
import { clearErrors } from './dietActions';

// Get current profile
export const getCurrentProfile = () => dispatch => {
	dispatch(setProfileLoading());
	axios
		.get('/api/profile')
		.then(res =>
			dispatch({
				type: GET_PROFILE,
				payload: res.data
			})
		)
		.catch(err =>
			dispatch({
				type: GET_PROFILE,
				payload: {}
			})
		);
};

// Get profile by handle
export const getProfileByHandle = handle => dispatch => {
	dispatch(setProfileLoading());
	axios
		.get(`/api/users/${handle}`)
		.then(res =>{
			dispatch(clearErrors());
			dispatch({
				type: GET_PROFILE,
				payload: res.data
			});
		}
		)
		.catch(err => {
			dispatch(setProfileLoadingFalse());
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			});
		}
		);
};

// Get profile by handle
export const getProfileByHandleWithoutLoading = handle => dispatch => {
	axios
		.get(`/api/users/${handle}`)
		.then(res =>{
			dispatch(clearErrors());
			dispatch({
				type: GET_PROFILE,
				payload: res.data
			});
		}
		)
		.catch(err => {
			dispatch(setProfileLoadingFalse());
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			});
		}
		);
};

// Get all profiles
export const getAllProfiles = handle => dispatch => {
	dispatch(setProfileLoading());
	axios
		.get('/api/users/all')
		.then(res =>
			dispatch({
				type: GET_PROFILES,
				payload: res.data
			})
		)
		.catch(err => {
			dispatch(setProfileLoadingFalse());
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			});
		}
		);
};

// Update profile by id
export const updateProfile = (id, userData) => dispatch => {
	axios
		.post(`/api/users/update/${id}`, userData)
		.then(res =>dispatch(logoutUser()))
		.catch(err => {
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			});
		}
		);
};

// Profile loading
export const setProfileLoading = () => {
	return {
		type: PROFILE_LOADING
	};
};

// Stop loading
export const setProfileLoadingFalse = () => {
	return {
		type: PROFILE_LOADING_FALSE
	};
};

// Clear profile
export const clearCurrentProfile = () => {
	return {
		type: CLEAR_CURRENT_PROFILE
	};
};
