import { NEXT, SKIP, SELECT, APPROVE, START, STAGE, GO_LIVE, CLEAR, UPDATE_FROM_DB } from '../constants/actionTypes';

/*console.log("Order Origin");
const session = localStorage.getItem('userData');
const sessionJson = JSON.parse(session);
console.log(sessionJson.asUser);*/

const INITIAL_STATE = {
    create: {
        token: false,
        sample: false,
        //xml: false,
        errors: false,
        testPlan: false,
        testPlanStatus: false,
        review: false,
        approved: false,
        skipped: false
    },
    cancel: {
        token: false,
        sample: false,
        //xml: false,
        errors: false,
        testPlan: false,
        testPlanStatus: false,
        review: false,
        approved: false,
        skipped: false
    },
    redo: {
        token: false,
        sample: false,
        //xml: false,
        errors: false,
        errors2: false,
        testPlan: false,
        testPlanStatus: false,
        review: false,
        approved: false,
        skipped: false
    },
    status: {
        sample: false,
        //xml: false,
        errors: false,
        testPlan: false,
        testPlanStatus: false,
        review: false,
        approved: false,
        skipped: false
    },
    curPage: '',
    curPageShow: '',
    curStage: '',
    appStatus: 'start',
    progress: 0,
    stages: {
        create: false,
        cancel: false,
        redo: false,
        status: false
    }
}

const handler = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case NEXT:
            return handleNext(state, action.nextPage, action.score);
        case SKIP:
            return handleSkip(state, action.nextStage, action.score, action.orderOrigin);
        case SELECT:
            return handleSelect(state, action.nextPage);
        case APPROVE:
            return handleApprove(state, action.nextStage, action.orderOrigin);
        case START:
            return handleStart(state, action.orderOrigin);
        case STAGE:
            return changeStage(state, action.nextStage, action.orderOrigin);
        case GO_LIVE:
            return handleGoLive(state);
        case UPDATE_FROM_DB:
            return handleUpdateFromDB(state, action.sectionStatus, action.curStage, action.curPage, action.progress);    
        case CLEAR:
            return INITIAL_STATE;
        default:
            return state;
    }
}

function handleNext(state, nextPage, score) {
    const arr = nextPage.split("_");
    const page = arr[0];
    const stage = arr[1];

    var scoreIsZero = score;
    
    if (stage === 'create' && state.progress >= 25){
        score = 0
    }else if (stage === 'cancel' && state.progress >= 50){
        score = 0
    }else if (stage === 'redo' && state.progress >= 75){
        score = 0
    }
    
    
    if ( (state.appStatus === 'inProgress' && !state[stage][page]) || scoreIsZero !== 0) {
        return {
            ...state,
            [stage]: {
                ...state[stage],
                [page]: true
            },
            curPage: nextPage,
            curPageShow: nextPage,
            progress: state.progress + score
        }
    } else {
        return {
            ...state,
            //curPage: nextPage,
            curPageShow: nextPage,
        }
    }
}

function handleApprove(state, nextStage, orderOrigin) {
    let nextPage;
    let stage;
    let returnObject = {};

    if (orderOrigin === 'orderDesk') {
        stage = 'testPlan';
    } else {
        if (nextStage !== 'status') {
            stage = 'token';
        } else {
            stage = 'sample';
        }
    }

    nextPage = stage + '_' + nextStage;

    let score = 25
    
    if (nextStage === 'cancel') {
        score = 25
    } else if (nextStage === 'redo') {
        score = 50
    } else if (nextStage === 'status') {
        score = 75
    }

    if (orderOrigin === 'orderDesk') {
        returnObject = {
            ...state,
            [state.curStage]: {
                sample: true,
                //xml: true,
                errors: true,
                errors2: true,
                testPlan: true,
                testPlanStatus: true,
                review: true,
                approved: true,
                skipped: false
            },
            [nextStage]: {
                ...state[nextStage],
                sample: true,
                errors: true,
                errors2: true,
                testPlan: true
            },
            progress: score,
            curStage: nextStage,
            curPage: nextPage,
            curPageShow: nextPage,
            stages: {
                ...state.stages,
                [nextStage]: true
            }
        }
    } else {
        returnObject = {
            ...state,
                [state.curStage]: {
                sample: true,
                    //xml: true,
                    errors: true,
                    errors2: true,
                    testPlan: true,
                    testPlanStatus: true,
                    review: true,
                    approved: true,
                    skipped: false
            },
                [nextStage]: {
            ...state[nextStage],
                    sample: true,
            },
                progress: score,
                    curStage: nextStage,
                curPage: nextPage,
                curPageShow: nextPage,
                stages: {
            ...state.stages,
                    [nextStage]: true
            }
        }
    }

    return returnObject;
}

function handleSkip(state, nextStage, score, orderOrigin) {
    let nextPage;
    let stage;
    let returnObject = {};

    if (orderOrigin === 'orderDesk') {
        stage = 'testPlan';
    } else {
        if (nextStage !== 'status') {
            stage = 'token';
        } else {
            stage = 'sample';
        }
    }

    nextPage = stage + '_' + nextStage;

    returnObject = {
        ...state,
        [state.curStage]: {
            sample: true,
            //xml: true,
            errors: true,
            errors2: true,
            testPlan: true,
            testPlanStatus: true,
            review: true,
            approved: false, //approved: true,
            skipped: true
        },
        curPage: nextPage,
        curPageShow: nextPage,
        curStage: nextStage,
        progress: score,
        stages: {
            ...state.stages,
            [nextStage]: true
        }
    };

    if (orderOrigin === 'orderDesk') {
        returnObject[nextStage] = {
            ...state[nextStage],
            sample: true,
            errors: true,
            errors2: true,
            testPlan: true
        };
    }

    return returnObject;
}

function handleSelect(state, nextPage) {
    return {
        ...state,
        curPage: nextPage,
        curPageShow: nextPage,
    }
}

function handleStart(state, orderOrigin) {
    
    let DefatulCurPage =  'token_create';
    let DefatulCurPageShow =  'token_create';
    let DefaultProgress = 0;
    let DefaultToken = true;
    let DefaultSample = false;
    let DefaultErrors = false;
    let DefaultTestPlan = false;

    //console.log('orderOrigin in handleStart: ' + orderOrigin)
    if(orderOrigin === 'orderDesk'){
        DefatulCurPage =  'testPlan_create';
        DefatulCurPageShow =  'testPlan_create';
        DefaultProgress = 6;
        DefaultSample = true;
        DefaultErrors = true;
        DefaultTestPlan = true;
    }
    //console.log('DefatulCurPage: ' + DefatulCurPage)
    return {
        ...state,
        curPage: DefatulCurPage,
        curPageShow: DefatulCurPageShow,
        progress: DefaultProgress,
        curStage: 'create',
        appStatus: 'inProgress',
        create: {
            ...state.create,
            'token': DefaultToken,
            'sample': DefaultSample,
            'errors': DefaultErrors,
            'testPlan': DefaultTestPlan
        },
        stages: {
            ...state.stages,
            create: true
        }
    }
}

function changeStage(state, nextStage, orderOrigin) {
    //const nextPage = 'sample_' + nextStage;

    let nextPage;
    let stage;
    let returnObject = {};

    if (orderOrigin === 'orderDesk') {
        stage = 'testPlan';

        nextPage = stage + '_' + nextStage;

        returnObject = {
            ...state,
            curStage: nextStage,
            curPage: nextPage,
            curPageShow: nextPage,
        }

        returnObject[nextStage] = {
            ...state[nextStage],
            sample: true,
            errors: true,
            errors2: true,
            testPlan: true
        }

        returnObject.stages = {
            ...state.stages,
            [nextStage]: true
        };

    } else {
        if (nextStage !== 'status') {
            stage = 'token';
        } else {
            stage = 'sample';
        }

        nextPage = stage + '_' + nextStage;

        returnObject = {
            ...state,
            curStage: nextStage,
            curPage: nextPage,
            curPageShow: nextPage,
        }
    }

    return returnObject;
}

function handleGoLive(state) {
    return {
        ...state,
        curStage: 'golive',
        curPage: 'home',
        curPageShow:'home',
        appStatus: 'live',
        progress: 100,
    }
}

function handleUpdateFromDB(state, sectionStatus, curStage, curPage,  progress) {
    
    console.log('sectionStatus')
    console.log(sectionStatus)
    let activeSection = {
        token: true,
        sample: true,
        //xml: true,
        errors: true,
        errors2: true,
        testPlan: true,
        testPlanStatus: true,
        review: true,
        approved: true,
        skipped: true
    }

    const disableSection = {
        token: false,
        sample: false,
        //xml: false,
        errors: false,
        errors2: false,
        testPlan: false,
        testPlanStatus: false,
        review: false,
        approved: false,
        skipped: false
    }

    let curSection = {
        token: false,
        sample: false,
        //xml: false,
        errors: false,
        errors2: false,
        testPlan: false,
        testPlanStatus: false,
        review: false,
        approved: false,
        skipped: false
    }

    //const pageArr = ['token','sample', 'xml', 'errors','testPlan', 'review', 'approved'];
    //const pageArr = ['token','sample', 'errors','testPlan', 'review', 'approved'];
    const pageArr = ['token','sample', 'errors', 'errors2','testPlan', 'testPlanStatus', 'review', 'approved'];
    let i = 0;
    let isBefore = true;

    while(i < pageArr.length) {
        if (pageArr[i] !== curPage.split("_")[0]) {
            curSection[pageArr[i]] = isBefore;
        } else {
            isBefore = false;
            curSection[pageArr[i]] = true;
        }
        i++;
    }
    
    //const create = sectionStatus.create ? (curStage === 'create' ? curSection :  activeSection) : disableSection;
    //const cancel = sectionStatus.cancel ? (curStage === 'cancel' ? curSection :  activeSection) : disableSection;
    //const redo = sectionStatus.redo ? (curStage === 'redo' ? curSection :  activeSection) : disableSection;
    //const status = sectionStatus.status ? (curStage === 'status' ? curSection :  activeSection) : disableSection;
    
    let curSectionTmp = {...curSection, skipped:false, approved:false }
    //console.log('inside handler');
    //console.log(sectionStatus);
    //console.log(curStage);
    //console.log(curSectionTmp);
    
    if (sectionStatus.create === 'Skipped'){
        curSectionTmp = {...curSectionTmp, skipped:true, approved:false }
        activeSection = {...activeSection, skipped:true, approved:false }
        
    }else if (sectionStatus.create === 'Approved'){
        curSectionTmp = {...curSectionTmp, skipped:false, approved:true }
        activeSection = {...activeSection, skipped:false, approved:true }
    }
    //console.log(curSectionTmp);
    const create = sectionStatus.create !== 'Started' ? (curStage === 'create' ? curSectionTmp :  activeSection) : disableSection;
    
    curSectionTmp = {...curSectionTmp, skipped:false, approved:false }
        
    if (sectionStatus.cancel === 'Skipped'){
        curSectionTmp = {...curSectionTmp, skipped:true, approved:false }
        activeSection = {...activeSection, skipped:true, approved:false }
    }else if (sectionStatus.cancel === 'Approved'){
        curSectionTmp = {...curSectionTmp, skipped:false, approved:true }
        activeSection = {...activeSection, skipped:false, approved:true }
    }
    //console.log(curSectionTmp);
    const cancel = sectionStatus.cancel !== 'Started' ? (curStage === 'cancel' ? curSectionTmp :  activeSection) : disableSection;
    
    curSectionTmp = {...curSection, skipped:false, approved:false }
    
    if (sectionStatus.redo === 'Skipped'){
        curSectionTmp = {...curSectionTmp, skipped:true, approved:false }
        activeSection = {...activeSection, skipped:true, approved:false }
    }else if (sectionStatus.redo === 'Approved'){
        curSectionTmp = {...curSectionTmp, skipped:false, approved:true }
        activeSection = {...activeSection, skipped:false, approved:true }
    }
    //console.log(curSectionTmp);
    const redo = sectionStatus.redo !== 'Started' ? (curStage === 'redo' ? curSectionTmp :  activeSection) : disableSection;
    curSectionTmp = {...curSectionTmp, skipped:false, approved:false }

    if (sectionStatus.status === 'Skipped'){
        curSectionTmp = {...curSectionTmp, skipped:true, approved:false }
        activeSection = {...activeSection, skipped:true, approved:false }
    }else if (sectionStatus.status === 'Approved'){
        curSectionTmp = {...curSectionTmp, skipped:false, approved:true }
        activeSection = {...activeSection, skipped:false, approved:true }
    }
    //console.log(curSectionTmp);
    const status = sectionStatus.status !== 'Started' ? (curStage === 'status' ? curSectionTmp :  activeSection) : disableSection;
    
    //console.log('create');
    //console.log(create);
    
    //console.log('cancel');
    //console.log(cancel);
    
    //console.log('redo');
    //console.log(redo);
    
    //console.log('state');
    //console.log(status);

    /*
    let create;
    let cancel;
    let redo;
    let status;
    
    if(curStage === 'create'){
        
        sectionStatus.create = true
        sectionStatus.cancel = false
        sectionStatus.redo = false
        sectionStatus.status = false
        
        create = curSection
        cancel = disableSection
        redo = disableSection
        status = disableSection

    }else if (curStage === 'cancel'){
        
        sectionStatus.create = true
        sectionStatus.cancel = true
        sectionStatus.redo = false
        sectionStatus.status = false
        
        create = activeSection
        cancel = curSection
        redo = disableSection
        status = disableSection

    }else if (curStage === 'redo'){

        sectionStatus.create = true
        sectionStatus.cancel = true
        sectionStatus.redo = true
        sectionStatus.status = false
        
        create = activeSection
        cancel = activeSection
        redo = curSection
        status = disableSection

    }else{//status

        sectionStatus.create = true
        sectionStatus.cancel = true
        sectionStatus.redo = true
        sectionStatus.status = true
        
        create = activeSection
        cancel = activeSection
        redo = activeSection
        status = curSection

    }
    */
    

    const appStatus = progress === 100 ? 'live' : 'inProgress';

    return {
        ...state,
        curPage: curPage,
        curPageShow:curPage,
        curStage: curStage,
        progress: progress,
        stages: sectionStatus,
        create: create,
        cancel: cancel,
        redo: redo,
        status: status,
        appStatus: appStatus
    }
}

export default handler
