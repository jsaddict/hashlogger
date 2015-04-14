module.exports = {
	api: {
        err : 'err',
        warn : 'warn',
        info : 'info'
    },
    aggregatorToken : 'logger-token',
    aggregatorUrl: 'http://localhost:8000/aggregate',

    // It will be called on each instance
    // User can know count by instance
    instanceDataHandler : function(){},
    aggregateDataHandler : function(){},
    // Always minInterval type array elements should be divisible by first element
    // and minInterval should be a factor for 60 (if type is seconds, minutes) for 24 (if type is hours)
    interval: {
        seconds : [2, 10, 30],
        minutes : [1, 15, 30],
        hours : [1, 6, 12],
        days : [1, 7],
        months : [1, 3, 4],
        years : [1]
    },
    // Error handling inside module.
    // In testing mode, we can set 'throw-error'
    // In production, we can either set 'log-error'.
    // Or can set custom error handler.
    // If we set errorHandler, then all above cannot work and will be over written.
    // throw-error is default

    // handleError :  'throw-error'/'log-error',
    // handleError :  function handleError({
    //                         name : 'critical/no-track/no-info/no-plot',
    //                         type : 'err/warn/info',
    //                         message : 'message',
    //                         errorObj : {}
    //                     }){},
    handleError :  function handleError(){},
    err : {
        track : true,
        // customErrorData : null, --> If it is null then all custom properties are directly attached to error object.
        // If given any string then it creates object named with that string and store properties in it.
        customErrorData : 'mgInfo',
        // When "no arguments are passed to err" or 
        //   "arguments are passed with proper format" or
        //   "some error occured inside err function" then
        //   this is default error name, tag name and message.
        
        //  tagType is the error Name for convenience and easy analysis
        //  defaultErrorName is defaultTagType
        //   defaultErrorName : 'globalError',
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
    alert : {
        'err@type4#tag-total' : { max : 15, min : 10},
        'warn@type1#tag-total' : { max : 6},
        'info@type1#tag-total' : { max : 6}
    }
};