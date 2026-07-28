import { LOG_IN, LOG_OUT } from '../constants/actionTypes';

const  INITIAL_STATE = {
    logged: false,
    userId: null,
    userName: null,
    apiKey: null,
    phone: null,
    email: null,
    street: null,
    city: null,
    state: null,
    zip: null,
    country: null,
    shipUrl: null,
    level: null,
    userStatus: null,
    clientPortalStatuses: null,
    jwt:'',
    company: null,
    asUser: false,
    orderOrigin: null
    }

const session = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case LOG_IN:
        return applyLogId(state, action.session);
      case LOG_OUT:
        return applyLogOut();
      default:
        return state
    }
}
  
function applyLogId(state, session) {
    return {
            ...state, 
            logged: true,
            userId: session.userId,
            userName: session.userName,
            apiKey: session.apiKey,
            phone: session.phone,
            email: session.email,
            street: session.street,
            city: session.city,
            state: session.state,
            zip: session.zip,
            country: session.country,
            shipUrl: session.shipUrl,
            level: session.level,
            userStatus: session.userStatus,
            clientPortalStatuses: session.clientPortalStatuses, 
            jwt: session.jwt,
            company: session.company,
            asUser: session.asUser,
            orderOrigin: session.orderOrigin
        };
}

function applyLogOut(state) {
    return {
            ...state,
            logged: false,
            userId: null,
            userName: null,
            apiKey: null,
            phone: null,
            email: null,
            street: null,
            city: null,
            state: null,
            zip: null,
            country: null,
            shipUrl: null,
            level: null,
            userStatus: null,
            clientPortalStatuses: null,
            jwt: '',
            company: null,
            asUser:false,
            orderOrigin: null
        };
}

export default session