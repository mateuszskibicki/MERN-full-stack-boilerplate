import {
	GET_MAPS,
	MAP_LOADING
} from '../actions/types';

const initialState = {
	map: null,
	maps: null,
	loading: false
};

export default function(state = initialState, action) {
	switch (action.type) {
	case MAP_LOADING:
		return {
			...state,
			loading: true
		};
	case GET_MAPS:
		return {
			...state,
			maps: action.payload,
			loading: false
		};
	default:
		return state;
	}
}