module.exports = {
    // Names of api functions that are declared global
    api: {
        err : 'err',
        warn : 'warn',
        info : 'info'
    },
    // Anyone can access 'aggregatorUrl', to make it secure we use 'aggregatorToken'
    aggregatorToken : 'mandatory',
    // Url of the aggregation server
    aggregatorUrl: 'mandatory',

    // It will be called on each instance repeatedly at minimum cron interval
    // User can know count by instance
    // parameters (config, serverInfo, instanceData)
    // config : configuration object. can use database methods as 'config.db[dbMethodName]'
    // serverInfo : If init is called with 3rd argument as server details, you can get that as 'serverInfo' to identify count by instance
    // instanceData : count data for the particular instance
    // Should be a function
    instanceDataHandler : null,
    // It will be called only on aggregation server repeatedly at minimum cron interval
    // parameters (config, serverInfo, aggregationData)
    // Should be a function
    aggregateDataHandler : null,
    // Intervals the count has to be tracked
    // Always minInterval type array elements should be divisible by first element
    // and minInterval should be a factor for 60 (if type is seconds, minutes) for 24 (if type is hours)
    interval: {
        seconds : [5, 15, 30],
        minutes : [5, 15, 30],
        hours : [1, 6, 12],
        days : [1, 7],
        months : [1, 3]
    },
    // If any error occur inside the module, there are two options.
    // Whether throw the error (If we do this whole application may be affected) or Inform with message
    // In Testing or debugging mode, it is better to throw errors
    // and In production mode,
    // we can console the error
    // types 'throw-error', 'log-error' or function
    // The function takes parameter as object and the type
    //                      ({
    //                         name : 'critical/no-track/no-info/no-plot',
    //                         type : 'err/warn/info',
    //                         message : 'error while updating tags',
    //                         errorObj : err
    //                     })
    handleError : 'throw-error',
    // settings for err api
    // 
    err : {
        // control whole err tracking using this.
        // if track : false, it won't track any err tags.
        track : true,
        // When "no arguments are passed to err" or 
        //   "arguments are passed with proper format" or
        //   "some error occured inside err function" then
        //   this is default error name, tag name and message.
        //  tagType is the error Name for convenience and easy analysis
        defaultTagType : 'globalError',
        defaultMessage : 'Error!!',
        msgSeparator : ' -> '
    },
    info : {
        // control whole info tracking using this.
        // if track : false, it won't track any info tags.
        track : true,
        defaultTagType : 'globalInfo',
        defaultMessage : 'Info'
    },
    warn : {
        // control whole warn tracking using this.
        // if track : false, it won't track any warn tags.
        track : true,
        defaultTagType : 'globalWarn',
        defaultMessage : 'Warn'
    },
    // Sets the threshold for tag count. (for minimum interval) and those exceeds threshold will be tracked
    // alert : {
    //     'err@type4#tag-total' : { max : 15, min : 10},
    //     'warn@type1#tag-total' : { max : 6},
    //     'info@type1#tag-total' : { min : 6}
    // }
    alert : null
}