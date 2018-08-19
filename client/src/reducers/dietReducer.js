import {
	GET_DIET,
	GET_DIETS,
	GET_DIET_BY_ID,
	DIET_LOADING,
	ADD_COMMENT_DIET,
	DELETE_COMMENT_DIET,
	LIKE_DIET,
	ADD_DIET,
	DELETE_DIET,
	UPDATE_DIET,
	UPDATE_DIET_SINGLE_PAGE,
	GET_DIET_BY_ID_WITHOUT_LOADING
} from '../actions/types';

const initialState = {
	diets: [],
	diet: {},
	loading: false
};

export default function(state = initialState, action) {
	switch (action.type) {
	case DIET_LOADING:
		return {
			...state,
			loading: true
		};
	case GET_DIETS:
		return {
			...state,
			loading: false,
			diets: action.payload	
		};
	case GET_DIET_BY_ID:
		return {
			...state,
			loading: false,
			diet: action.payload	
		};
	case GET_DIET_BY_ID_WITHOUT_LOADING:
		return {
			...state,
			diet: action.payload	
		};
	case ADD_DIET:
		return {
			...state,
			loading: false,
			diets: action.payload.reverse()
		};
	case UPDATE_DIET:
		return {
			...state,
			loading: false,
			diets: action.payload.reverse()
		};
	case UPDATE_DIET_SINGLE_PAGE:
		return {
			...state,
			loading: false,
			diet: action.payload
		};
	case DELETE_DIET:
		return {
			loading: false,
			diets: action.payload.reverse()
		};
	case LIKE_DIET:
		return {
			...state,
			diet: action.payload
		};
	case ADD_COMMENT_DIET:
		return {
			...state,
			diet: action.payload
		};
	case DELETE_COMMENT_DIET:
		return {
			...state,
			diet: action.payload
		};
	default:
		return state;
	}
}
