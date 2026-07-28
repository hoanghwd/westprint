import { TOGGLE_LOAD_ORDERS, UPDATE_SEARCH_ORDERS_OPTIONS, CLEAR } from '../constants/actionTypes';

const  INITIAL_STATE = {
    searchOptions : { 
        dateFrom:'', 
        dateTo:'', 
        orderId:'',
        trackingNumber:'', 
        status:'',  
        locId:'',
      },
      loadNewData: false,
      error: "" 
    }

const searchOrdersStatus = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case UPDATE_SEARCH_ORDERS_OPTIONS:
        return applyUpdate(state, action.newOptions);
      case TOGGLE_LOAD_ORDERS:
        return applyToggle(state);
      case CLEAR:
        return INITIAL_STATE;
      default:
        return state
    }
}
  
function applyUpdate(state, newOptions) {
    return {
            ...state, 
            searchOptions:{...state.searchOptions, ...newOptions}
        };
}

function applyToggle(state) {
    return {
      ...state, 
      loadNewData: !state.loadNewData
    };
}

export default searchOrdersStatus