import { TOGGLE_LOAD_CLIENTS, UPDATE_SEARCH_CLIENTS_OPTIONS, CLEAR } from '../constants/actionTypes';

const  INITIAL_STATE = {
    searchOptions : { 
        userName:'', 
        clientStatus:'', 
        page:0, 
        limit:20, 
        orderBy:'id', 
        descAsc:'desc'
      },
      loadNewData: false,
      error: "" 
    }

const searchClientsStatus = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case UPDATE_SEARCH_CLIENTS_OPTIONS:
        return applyUpdate(state, action.newOptions);
      case TOGGLE_LOAD_CLIENTS:
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

export default searchClientsStatus