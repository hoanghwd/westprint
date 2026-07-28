import { 
    LOG_IN, 
    LOG_OUT, 
    
    TOGGLE_LOAD_ORDERS, 
    UPDATE_SEARCH_ORDERS_OPTIONS, 
    
    TOGGLE_LOAD_LOGS, 
    UPDATE_SEARCH_LOGS_OPTIONS, 

    TOGGLE_LOAD_CLIENTS, 
    UPDATE_SEARCH_CLIENTS_OPTIONS,

    SET_OPTIONS,

    NEXT,
    SELECT,
    SKIP,
    APPROVE,
    START,
    STAGE,
    GO_LIVE,
    CLEAR,
    UPDATE_FROM_DB
} from '../constants/actionTypes';


/**************Login*************/ 
export const doLogIn = ({userId, userName, apiKey, phone, email, street, city, zip, state, country, shipUrl, level, userStatus, clientPortalStatuses, jwt, company, asUser, orderOrigin}) => (
    {
        type: LOG_IN,
        session:
            {
            logged: true,
            userId: userId,
            userName: userName,
            apiKey: apiKey,
            phone: phone,
            email: email,
            street: street,
            city: city,
            state: state,
            zip: zip,
            country: country,
            shipUrl: shipUrl,
            level: level,
            userStatus: userStatus,
            clientPortalStatuses: clientPortalStatuses,
            jwt: jwt,
            company: company,
            asUser: asUser,
            orderOrigin: orderOrigin            
        }
    }

)

export const doLogOut = () => (
    {
    type: LOG_OUT,
    session:
            {
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
            asUser: false,
            orderOrigin: null
        }   
    }
)
/*************************/


/**************Orders*************/ 
export const doToggleLoadOrders = () => (
    {type: TOGGLE_LOAD_ORDERS}
)

export const doUpdateSearchOrdersOptions = ({dateFrom, dateTo, orderId, trackingNumber, status, locId}) => (
    {
        type: UPDATE_SEARCH_ORDERS_OPTIONS,
        newOptions: { dateFrom, dateTo, orderId, trackingNumber, status, locId }   
    }
)
/*******************************/ 


/**************Logs*************/ 
export const doToggleLoadLogs = () => (
    {
        type: TOGGLE_LOAD_LOGS
    }
)

export const doUpdateSearchLogsOptions = ({ dateFrom, dateTo, poNumber, status }) => (
    {
        type: UPDATE_SEARCH_LOGS_OPTIONS,
        newOptions: { dateFrom, dateTo, poNumber, status }
    }
)
/*******************************/ 


/**************Clients*************/ 
export const doToggleLoadClients = () => (
    {type: TOGGLE_LOAD_CLIENTS}
)

export const doUpdateSearchClientsOptions = ({userName, companyName, clientStatus}) => (
    {
        type: UPDATE_SEARCH_CLIENTS_OPTIONS,
        newOptions: { userName, companyName, clientStatus }
    }
)

/*******************************/ 

export const doSetOptions = options => (
    {
        type: SET_OPTIONS,
        options: options
    }
)

/*******************************/ 



/**************State*************/ 

export const handleNext = (nextPage, score) => (
    {
        type: NEXT,
        nextPage: nextPage,
        score: score
    }
)

export const handleSkip = (nextStage, score, orderOrigin) => (
    {
        type: SKIP,        
        nextStage: nextStage,
        score: score,
        orderOrigin: orderOrigin
    }
)

export const handleSelect = (nextPage) => (
    {
        type: SELECT,
        nextPage: nextPage,
    }
) 

export const handleApprove = (nextStage, orderOrigin) => (
    {
        type: APPROVE,  
        nextStage: nextStage,
        orderOrigin: orderOrigin
    }
)

export const handleStart = (orderOrigin) => (
    {
        type: START,
        orderOrigin: orderOrigin
    }
)


export const changeStage = (nextStage, orderOrigin) => (
    {
        type: STAGE,
        nextStage: nextStage,
        orderOrigin: orderOrigin
    }
)

export const handleGoLive = (sectionStatus) => (
    {
        type: GO_LIVE,
        sectionStatus: sectionStatus
    }
)

export const clearState = () => (
    {
        type: CLEAR,
    }
)

export const doSetStateFromDB = (sectionStatus, curStage, curPage, progress) => (
    {
        type: UPDATE_FROM_DB,
        sectionStatus,
        curPage,
        curStage,
        progress
    }
)

/*******************************/ 
