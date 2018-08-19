import axios from 'axios';

import {
	GET_MAPS,
	MAP_LOADING,
	GET_ERRORS
} from '../actions/types';

// Get diets
export const getGyms = (address) => dispatch => {
	const encodedAddress = encodeURI(address);
	dispatch(setMapLoading());
	axios.get(`/api/maps/location/${encodedAddress}`)
		.then(res => dispatch({type: GET_MAPS, payload: res.data }))
		.catch(err => dispatch({type: GET_ERRORS, payload: err.response.data}));
};

// Set loading state
export const setMapLoading = () => {
	return { type: MAP_LOADING };
};