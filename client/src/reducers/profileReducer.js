import {
	GET_PROFILE,
	GET_PROFILES,
	PROFILE_LOADING,
	PROFILE_LOADING_FALSE,
	CLEAR_CURRENT_PROFILE,
	UPDATE_DIET_PROFILE_PAGE,
	DELETE_DIET_PROFILE_PAGE,
	GET_PROFILE_WITHOUT_LOADING
} from '../actions/types';

const initialState = {
	profile: null,
	profiles: null,
	loading: false
};

export default function(state = initialState, action) {
	switch (action.type) {
	case PROFILE_LOADING:
		return {
			...state,
			loading: true
		};
	case PROFILE_LOADING_FALSE:
		return {
			...state,
			loading: false
		};
	case GET_PROFILE:
		return {
			...state,
			profile: action.payload,
			loading: false
		};
	case GET_PROFILES:
		return {
			...state,
			profiles: action.payload,
			loading: false
		};
	case UPDATE_DIET_PROFILE_PAGE:
		return {
			...state,
			loading: false,
			profile: action.payload
		};
	case DELETE_DIET_PROFILE_PAGE:
		return {
			...state,
			loading: false,
			profile: action.payload
		};
	case CLEAR_CURRENT_PROFILE:
		return {
			...state,
			profile: null
		};
	default:
		return state;
	}
}
