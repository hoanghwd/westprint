import { combineReducers } from 'redux'
import session from './session'
import searchOrdersOption from './searchOrders'
import searchLogsOption from './searchLogs'
import searchClientsOption from './searchClients' 
import options from './options'
import handler from './handler'


export default combineReducers({
    session,
    searchOrdersOption,
    searchLogsOption,
    searchClientsOption,
    options,
    handler
})
