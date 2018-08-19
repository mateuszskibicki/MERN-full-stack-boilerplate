import { 	
	SEND_EMAIL,
	EMAIL_LOADING, 
} from '../actions/types';

const initialState = {
	status: '',
	loading: false
};

export default function(state = initialState, action) {
	switch (action.type) {
	case SEND_EMAIL:
		return {
			...state,
			status: action.payload,
			loading: false
		};
	case EMAIL_LOADING:
		return {
			...state,
			loading: true
		};
	default:
		return state;
	}
}
