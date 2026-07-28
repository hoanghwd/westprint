import { SET_OPTIONS } from '../constants/actionTypes';

const  INITIAL_STATE = {
    location: [],
    order: [],
    request: [],
    status: [],
    clientStatuses: []
}

const options = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case SET_OPTIONS:
        return setOptions(state, action.options);      
      default:
        return state
    }
}
  
function setOptions(state, options) {
    return {
            ...state, 
            locations: options.locations,
            order: options.order,
            request: options.request,
            status: options.status,
            clientStatuses: options.clientStatuses
        };
}

export default options