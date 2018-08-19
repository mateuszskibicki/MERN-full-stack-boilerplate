import {
	GET_RECIPE_BY_ID,
	GET_RECIPES,
	RECIPE_LOADING,
	ADD_RECIPE,
	LIKE_RECIPE,
	GET_RECIPE_BY_ID_WITHOUT_LOADING
} from '../actions/types';

const initialState = {
	recipes: [],
	recipe: {},
	loading: false
};

export default function(state = initialState, action) {
	switch (action.type) {
	case RECIPE_LOADING:
		return {
			...state,
			loading: true
		};
	case GET_RECIPES:
		return {
			...state,
			loading: false,
			recipes: action.payload	
		};
	case GET_RECIPE_BY_ID:
		return {
			...state,
			loading: false,
			recipe: action.payload	
		};
	case GET_RECIPE_BY_ID_WITHOUT_LOADING:
		return {
			...state,
			recipe: action.payload	
		};
	case ADD_RECIPE:
		return {
			...state,
			recipes: action.payload	
		};
	default:
		return state;
	}
}
