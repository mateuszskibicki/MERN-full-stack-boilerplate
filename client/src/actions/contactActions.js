import axios from 'axios';

import {
	SEND_EMAIL,
	EMAIL_LOADING,
	GET_ERRORS,
	CLEAR_ERRORS
} from '../actions/types';

import { clearErrors } from './dietActions';

// Send email
export const sendEmail = (message) => dispatch => {
	dispatch(setEmailLoading());
	axios.post('/api/contact', message)
		.then(res => {
			dispatch({type: SEND_EMAIL, payload: res.data });
			dispatch(clearErrors());
		} 
		)
		.catch(err => dispatch({type: GET_ERRORS, payload: err.response.data}));
};

// Set loading state
export const setEmailLoading = () => {
	return { type: EMAIL_LOADING };
};