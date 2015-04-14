var mandatory = {
    appUnsupported : [undefined, null, '', 0, {}, function fn(){}, 5, {hello : 'world'}],
    app : {
        aggregatorToken : 'logger-token',
        aggregatorUrl: 'http://localhost:8000/aggregate'
    },
    dbUnsupported : [undefined, null, '', 0, {}, 'stringg', 5, {hello : 'world'}],
    db : {
        getTags : function getTags(){},
        updateTags : function updateTags(){},
        getData : function getData(){},
        storeData : function storeData(){},
        getDataForAggregator : function getDataForAggregator(){},
        getRecentData : function getRecentData(){}
    }
}
var app = {
    api: {
        err : 'errr',
        warn : 'warnn',
        info : 'infoo'
    },
    aggregatorToken : 'logger-token',
    aggregatorUrl: 'http://localhost:8000/aggregate',
    instanceDataHandler : function instanceDataHandler(){},
    aggregateDataHandler : function aggregateDataHandler(){},
    interval: {
        seconds : [5, 15, 30],
        minutes : [5, 15, 30],
        hours : [1, 6, 12],
        days : [1, 7],
        months : [1, 3]
    },
    // handleError :  'throw-error'/'log-error',
    // handleError :  function handleError({
                        //     name : 'critical/no-track/no-info/no-plot',
                        //     type : 'err/warn/info',
                        //     message : 'message',
                        //     errorObj : {}
                        // }){},
    handleError :  function handleError(){},
    err : {
        track : false,
        defaultTagType : 'globalErrorr',
        defaultMessage : 'Error occuredd',
        msgSeparator : ' ->> '
    },
    info : {
        track : false,
        defaultTagType : 'globalInfoo',
        defaultMessage : 'Infoo'
    },
    warn : {
        track : false,
        defaultTagType : 'globalWarnn',
        defaultMessage : 'Warnn'
    },
    alert : {
        'err@type1e#no-tag' : { max : 70, min: 30},
        'info@type2i#tag-total' : { max : 300}
    }
}
var appDefault = {
    api: {
        err : 'err',
        warn : 'warn',
        info : 'info'
    },
    aggregatorToken : null,
    aggregatorUrl: null,
    instanceDataHandler : null,
    aggregateDataHandler : null,
    interval: {
        seconds : [5, 15, 30],
        minutes : [5, 15, 30],
        hours : [1, 6, 12],
        days : [1, 7],
        months : [1, 3]
    },
    handleError : 'throw-error',
    err : {
        track : true,
        defaultTagType : 'globalError',
        defaultMessage : 'Error!!',
        msgSeparator : ' -> '
    },
    info : {
        track : true,
        defaultTagType : 'globalInfo',
        defaultMessage : 'Info'
    },
    warn : {
        track : true,
        defaultTagType : 'globalWarn',
        defaultMessage : 'Warn'
    },
    alert : null
};
var intervalData = {
    error : {
        // minInterval vaules are not divisible
        error1 : {
            seconds : [5, 7, 30],
            minutes : [5, 15, 30],
            hours : [1, 6, 12],
            days : [1, 7],
            months : [1, 3]
        },
        // non integers
        error2 : {
            seconds : [5, 15, 30],
            minutes : [5, 15, 30],
            hours : [1, 6.5, 12],
            days : [1, 7],
            months : [1, 3]
        },
        // more than max value
        error3 : {
            seconds : [5, 15, 70],
            minutes : [5, 15, 30],
            hours : [1, 6, 12],
            days : [1, 7],
            months : [1, 3]
        },
        // negative values
        error4 : {
            seconds : [5, 15, 30],
            minutes : [5, 15, 30],
            hours : [1, -1, 12],
            days : [1, 7],
            months : [1, 3]
        },
        // non array intervals
        error5 : {
            seconds : [5, 15, 30],
            minutes : [5, 15, 30],
            hours : 'string',
            days : [1, 7],
            months : [1, 3]
        }
    },
    valid : {
        valid1 : {
            seconds : [15, 5, 30],
            minutes : [15, 5, 30],
            hours : [1, 12, 6],
            days : [7, 1],
            months : [1, 3]
        },
        valid2 : {
            seconds : [15, 5, 30],
            minutes : [15, 5, 30],
            days : [7, 1],
            hours : [1, 12, 6],            
            months : [1, 3]
        }
    },
    result : {
        valid1 : {
            seconds : [5, 15, 30],
            minutes : [5, 15, 30],
            hours : [1, 6, 12],
            days : [1, 7],
            months : [1, 3]
        },
        valid2 : {
            seconds : [5, 15, 30],
            minutes : [5, 15, 30],
            hours : [1, 6, 12],
            days : [1, 7],
            months : [1, 3]
        }
    }
}
var alertData = {
    error : {
        // not object
        error1 : { max : '5'},
        error2 : { max : 5 , min : 'string'}
    },
    valid : {
        tag1 :{ max: 5, min: 10},
        tag2 : { max: 5, min: null},
        tag3 : { min: 5, max: null},
        tag4 : { max: 5},
        tag5 : { min: 5}
    },
    result : {
        tag1 : { max: 5, min: 10},
        tag2 : { max: 5, min: null},
        tag3 : { min: 5, max: null},
        tag4 : { max: 5, min: null},
        tag5 : { min: 5, max : null}
    }
}
var handleErrorData = {
    valid : {
        valid1 : 'throw-error',
        valid2 : 'log-error',
        valid3 : function handleError(){}
    },
    result : {
        valid1 : 'throw-error',
        valid2 : 'log-error',
        valid3 : function handleError(){}
    }
}
// module.exports = {
//     mandatory : mandatory,
//     app : app,
//     appDefault : appDefault,
//     intervalData : intervalData,
//     alertData : alertData,
//     handleErrorData : handleErrorData
// }
module.exports = {
    mandatory : mandatory,
    app : app,
    appDefault : appDefault,
    intervalData : intervalData,
    alertData : alertData,
    handleErrorData : handleErrorData
}
