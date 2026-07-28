import { createStore, applyMiddleware  } from 'redux'
import { createLogger } from 'redux-logger';
//import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import {watchStart, watchNext, watchSkip, watchApprove, watchGoLive } from '../sagas';
import rootReducer from '../reducers'

const logger = createLogger();
const saga = createSagaMiddleware();

//const store = createStore(rootReducer, undefined, applyMiddleware(thunk, logger));
const store = createStore(rootReducer, undefined, applyMiddleware(saga, logger));

saga.run(watchStart);
saga.run(watchNext);
saga.run(watchSkip);
saga.run(watchApprove);
saga.run(watchGoLive);

export default store;

