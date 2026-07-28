import axios from "axios";
import { takeEvery, select } from 'redux-saga/effects';
import {START, NEXT, SKIP, APPROVE, GO_LIVE} from '../constants/actionTypes';


export function* watchStart() {
    yield takeEvery(START, handleStart);
}

function* handleStart() {
  
    const state = yield select();
      
    const {userName, jwt} = state.session
    const {curStage, curPage, progress, stages} = state.handler
    
    const sectionName = curStage
    const sectionStatus = 'In Progress'
    
    yield updateClientPortalStatusesDB (userName, jwt, sectionName, sectionStatus, curStage, curPage, progress, stages)
  
}


export function* watchNext() {
    yield takeEvery(NEXT, handleNext)
}

function* handleNext() {
    
    const state = yield select()
        
    const {userName, jwt, asUser} = state.session
    const { curStage, curPage, progress, stages } = state.handler
    
    const sectionName = curStage
    const sectionStatus = 'In Progress'


    if(!asUser){
        if (!state.handler[curStage]['approved'] ) {
            yield updateClientPortalStatusesDB (userName, jwt, sectionName, sectionStatus, curStage, curPage, progress, stages)
        }
    }        
}


export function* watchSkip() {
    yield takeEvery(SKIP, handleSkip)
}
  
function* handleSkip() {

    const state = yield select();
        
    const {userName, jwt} = state.session;
    const {curStage, curPage, progress, stages} = state.handler;
    
    let sectionName = PREVIOUS_STAGE[curStage];
    let sectionStatus = 'Skipped';
    
    yield updateClientPortalStatusesDB (userName, jwt, sectionName, sectionStatus, curStage, curPage, progress, stages);

    if (curStage !== 'golive'){
        sectionName = curStage;
        sectionStatus = 'In Progress';
        
        yield updateClientPortalStatusesDB (userName, jwt, sectionName, sectionStatus, curStage, curPage, progress, stages)
    
    }
}


export function* watchApprove() {
    yield takeEvery(APPROVE, handleApprove);
}

function* handleApprove() {

    const state = yield select();
        
    const {userName, jwt} = state.session
    const {curStage, curPage, progress, stages} = state.handler
    
    let sectionName = PREVIOUS_STAGE[curStage]
    let sectionStatus = 'Approved'
    
    yield updateClientPortalStatusesDB (userName, jwt, sectionName, sectionStatus, curStage, curPage, progress, stages)

    if (curStage !== 'golive'){
        sectionName = curStage;
        sectionStatus = 'In Progress';
        yield updateClientPortalStatusesDB (userName, jwt, sectionName, sectionStatus, curStage, curPage, progress, stages)

    }
    
}

export function* watchGoLive() {
    yield takeEvery(GO_LIVE, handleGoLive);
}

function* handleGoLive(action) {
    const sectionStatus =  action.sectionStatus;

    const state = yield select();
        
    const {userName, jwt} = state.session;
    const {curStage, curPage, progress, stages} = state.handler;
    
    const sectionName = 'status';
    
    yield updateClientPortalStatusesDB (userName, jwt, sectionName, sectionStatus, curStage, curPage, progress, stages);
    
}

const updateClientPortalStatusesDB = async (userName, jwt, sectionName, sectionStatus, curStage, curPage, percentage, stages) => {
    const clientPortalStatuses = {sectionStatus: stages, curPage: curPage, curStage: curStage, integrationPercentage: percentage};
    localStorage.setItem('status', JSON.stringify(clientPortalStatuses));

    await axios.post(      
        process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_UPDATE_PORTAL_STATUS,
        {userName, sectionName, sectionStatus, curStage, curPage, percentage},  
        {headers: {'Authorization': 'Bearer '+ jwt}}
    )

}

const PREVIOUS_STAGE = { 
                        'create'    :   '',
                        'cancel'    :   'create',
                        'redo'      :   'cancel',
                        'status'    :   'redo',
                        'golive'    :   'status'
                    }  