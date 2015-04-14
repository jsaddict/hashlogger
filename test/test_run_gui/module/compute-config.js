var defaultConfig = require('./default-config.js');

function isValidObject(obj){
    if(typeof obj === 'object' && obj != null){
        return true;
    }else{
        return false;
    }
}
function isValidArray(arr){
    if(typeof arr === 'object' && arr instanceof Array){
        return true;
    }else{
        return false;
    }
}
function isValidNumber(num){
    if(typeof num === 'number' && !isNaN(num)){
        return true;
    }else{
        return false;
    }
}
function isInteger(num) {
    // return num % 1 === 0;
    return Math.round(num) === num;
}
function isFactor(factor, value){
    return value % factor === 0;
}

function computeAlertConfig(config, userConfig){
    config.alert = null;
    if(isValidObject(userConfig)){
        config.alert = {};
        Object.keys(userConfig).forEach(function(property){
            if(!isValidObject(userConfig[property])){
                throw new Error('alert configuration value should be an object');
            }else{
                config.alert[property] = {};
                if(isValidNumber(userConfig[property].max)){                 
                    config.alert[property].max = userConfig[property].max;
                }else
                if(typeof userConfig[property].max === 'undefined' || userConfig[property].max === null){
                    config.alert[property].max = null;
                }else{
                    throw new Error('alert max value should be a number');
                }

                if(isValidNumber(userConfig[property].min)){                    
                    config.alert[property].min = userConfig[property].min;
                }else
                if(typeof userConfig[property].min === 'undefined' || userConfig[property].min === null){
                    config.alert[property].min = null;
                }else{
                    throw new Error('alert min value should be a number');
                }
            }
        })        
    }else
    if(typeof userConfig === "undefined"){
        config.alert = null;
    }else{
        throw new Error('alert shoud be an object');
    }
}
// format for checking array, sort, Integers
function formatAndGetMinInterval(levels, userConfig){
    var interval = {};
    var minIntervalType = null;
    // Check for array and sort
    for(var i=0; i<levels.length;i++ ){
        if(typeof userConfig[levels[i]] !== 'undefined'){
            if(isValidArray(userConfig[levels[i]])){
                if(minIntervalType === null){
                    minIntervalType = levels[i];
                }
                interval[levels[i]] = userConfig[levels[i]].sort(function(a, b){return a-b});
            }else{
                throw new Error('interval type should be an array');
            }    
        } 
    }
    // check for Integers
    Object.keys(interval).forEach(function(type){
        var intervalArray = interval[type];
        for(var i=0;i< intervalArray.length;i++){
            if(!isInteger(intervalArray[i])){
                throw new Error('interval values should be an integer');
            }
        }
    });
    return minIntervalType;
}
function computeIntervalConfig(config, userConfig){
    config.interval = {};
    var tempInterval = {};
    var minIntervalType;
    var levels = ['seconds', 'minutes', 'hours', 'days', 'months', 'years'];
    var bounds = {
        seconds : {
            min : 1,
            max : 60,
            factorOf : 60
        },
        minutes : {
            min : 1,
            max : 60,
            factorOf : 60
        },
        hours : {
            min : 1,
            max : 24,
            factorOf : 24
        },
        days : {
            min : 1,
            max : 25,
            factorOf : null

        },
        months : {
            min : 1,
            max : 12,
            factorOf : null
        },
        years : {
            min : 1,
            max : 100,
            factorOf : null
        }
    };
    if(isValidObject(userConfig)){
        minIntervalType = formatAndGetMinInterval(levels, userConfig);

        Object.keys(userConfig).forEach(function(type){
            var intervalArray = userConfig[type];
            if(type == minIntervalType){
                if(bounds[type].factorOf != null){
                    if(bounds[type].factorOf % intervalArray[0] != 0){
                        throw new Error('Minimum Interval '+type+'Should be a factor of' +bounds[type].factorOf);
                    }
                }
            }
            for(var i=0;i< intervalArray.length;i++){
                if(intervalArray[i] >= bounds[type].max){
                    throw new Error(type+' interval values should be less than '+bounds[type].max);
                }
                if(intervalArray[i] < bounds[type].min){
                    throw new Error(type+' interval values should be greater than '+bounds[type].min);
                }
                if(type == minIntervalType){
                    if(intervalArray[i] % intervalArray[0] !=0){
                        throw new Error('Minimum interval values should be divisible by least interval');
                    }
                }
            }
        });
        config.interval = userConfig;
    }else
    if(typeof userConfig === 'undefined'){
        config.interval = defaultConfig.interval;
    }else{
        throw new Error('interval should be an object'); 
    }
}
function computeHandleErrorConfig(config, userConfig){
    config.handleError = 'throw-error';
    if(typeof userConfig === 'function'){
        config.handleError = userConfig;
        return;
    }else
    if(typeof userConfig === 'string' && userConfig === 'log-error'){
        config.handleError = 'log-error';
    }
}
function computeApiConfig(config, type, userConfig){
    var defaultConfiguration = defaultConfig[type];
    if(!isValidObject(userConfig)){
        if(typeof userConfig !== 'undefined'){
            throw new Error(type+' should be an object'); 
            return;
        }       
    }
    if(typeof userConfig === 'undefined'){
        userConfig = {};
    }       
    config[type] = {};
    Object.keys(defaultConfiguration).forEach(function(property){
        if(typeof defaultConfiguration[property] == typeof userConfig[property]){
            config[type][property] = userConfig[property];
        }else{
            config[type][property] = defaultConfiguration[property];
        }
    })
}
function computeDbConfig(config, userConfig){
    var functions = ['getTags', 'updateTags', 'getData', 'storeData', 'getDataForAggregator', 'getRecentData'];
    config.db = {};
    for(var i=0; i< functions.length; i++){
        if(typeof userConfig[functions[i]] !== 'function'){
            throw new Error(functions[i]+' function is not set.');
        }else{
            config.db[functions[i]] = userConfig[functions[i]];
        }
    }
}
function computeConfig(config, appConfig, dbConfig){
    computeDbConfig(config, dbConfig);
    var msg;
    Object.keys(defaultConfig).forEach(function(property){
        if(property === 'handleError'){
            return computeHandleErrorConfig(config, appConfig['handleError'])
        }
        if(property === 'alert'){
            return computeAlertConfig(config, appConfig['alert'])
        }
        if(property === 'interval'){
            return computeIntervalConfig(config, appConfig['interval'])
        }
        if(property === 'err'){
            return computeApiConfig(config, 'err', appConfig['err'])
        }
        if(property === 'warn'){
            return computeApiConfig(config, 'warn', appConfig['warn'])
        }
        if(property === 'info'){
            return computeApiConfig(config, 'info', appConfig['info'])
        }
        if(property === 'api'){
            config.api = defaultConfig.api;
            if(isValidObject(appConfig.api)){
                if(typeof appConfig.api.err === 'string'){
                    config.api.err = appConfig.api.err;
                }
                if(typeof appConfig.api.warn === 'string'){
                    config.api.warn = appConfig.api.warn;
                }
                if(typeof appConfig.api.info === 'string'){
                    config.api.info = appConfig.api.info;
                }
            }else
            if(typeof appConfig.api !== 'undefined'){
                throw new Error('api should be an object'); 
            }
            return;
        }
        if(property === 'instanceDataHandler'){
            config.instanceDataHandler = defaultConfig.instanceDataHandler;
            if(typeof appConfig['instanceDataHandler'] !== 'undefined'){
                if(typeof appConfig['instanceDataHandler'] !== 'function'){
                    throw new Error('instanceDataHandler should be a function');
                }else{
                    config['instanceDataHandler'] = appConfig['instanceDataHandler'];
                }
            }
            return;
        }
        if(property === 'aggregateDataHandler'){
            config.aggregateDataHandler = defaultConfig.aggregateDataHandler;
            if(typeof appConfig['aggregateDataHandler'] !== 'undefined'){
                if(typeof appConfig['aggregateDataHandler'] !== 'function'){
                    throw new Error('aggregateDataHandler should be a function');
                }else{
                    config['aggregateDataHandler'] = appConfig['aggregateDataHandler'];
                }
            }
            return;
        }
        if(defaultConfig[property] === 'mandatory'){
            if(typeof appConfig[property] === 'string' && appConfig[property] !== ''){
                config[property] = appConfig[property]
            }else{
                msg = property+' is not set (or) If set, it is not a string';
                throw new Error(msg);
            }
        }
        if(typeof appConfig[property] === 'undefined'){
            config[property] = defaultConfig[property];
        }
        if(isValidObject(defaultConfig[property])){
            if(isValidObject(appConfig[property])){ 
                config[property] = {};               
                Object.keys(defaultConfig[property]).forEach(function(subProperty){
                    if(typeof appConfig[property][subProperty] != typeof defaultConfig[property][subProperty]){
                        config[property][subProperty] = defaultConfig[property][subProperty];
                    }else{
                        config[property][subProperty] = appConfig[property][subProperty];
                    }
                })
            }else{
                msg = property+' is not set (or) If set, it is not an Object';
                throw new Error(msg);
            }
        }else{
            if(typeof appConfig[property] !== typeof defaultConfig[property]){
                config[property] = defaultConfig[property];
            }else{
                config[property] = appConfig[property];
            }
        }
    });
}
module.exports = computeConfig; 