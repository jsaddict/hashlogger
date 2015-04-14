var util = require('util');
var config;
var moduleErrorHandler;
var errDb = {};
/**
 * [moduleErrorHandler description]
 * If any error occur inside the module, there are two options.
 * Whether throw the error (If we do this whole application may be affected) or Inform with message
 *
 * In Testing or debugging mode, it is better to throw errors
 * and In production mode,
 * we can console the error
 */

/**
 * err Object format
 * {
 *      name : "critical" --> database connection not set "or" not configuring or  passing arguments
 *             "no-track" --> certain type is not tracked
 *             "no-info"  --> Cannot able to set or get certain value.
 *             "no-plot"  --> Cannot able to plot. Issue getting data from Db
 *      type : err, e, i, or w (specify where it occured.)
 *      message : it may the effect of that error like "it cannot be tracked" or "value not set"
 * }
 */

/**
 *
 * moduleErrorHandler implementation
 *
 */
function setModuleErrorHandler() {
    if (typeof config.handleError === "function") {
        moduleErrorHandler = config.handleError;
        return;
    }
    if (config.handleError === "throw-error") {
        moduleErrorHandler = throwError;
        return;
    }
    if (config.handleError === "log-error") {
        moduleErrorHandler = logMessage;
        return;
    }
}

function logMessage(obj) {
    var info = {};
    info.name = obj.name;
    info.type = obj.type;
    info.message = obj.message;
    if (typeof obj.errorObj !== 'undefined') {
        info.error = obj.errorObj;
    }
    console.log("Some Error Occured ", info);
}

function throwError(obj) {
    if (typeof obj.errorObj === 'undefined') {
        return (function() {
            throw (new constructError(obj.name, obj.type, obj.message));
        }());
    } else {
        var info = {};
        info.name = obj.name;
        info.type = obj.type;
        info.message = obj.message;
        obj.errorObj.errInfo = info;
        return (function() {
            throw obj.errorObj;
        }());
    }
}

function constructError(name, type, message) {
    this.message = message;
    this.name = name;
    this.type = type;
    Error.captureStackTrace(this, constructError);
}
util.inherits(constructError, Error);


function createError(type) {
    errDb[type] = function(type) {
        Error.call(this);
        Error.captureStackTrace(this, errDb[type]);
        this.name = type;
    }
    util.inherits(errDb[type], Error);
}

// tagDetails = {type : 'type1', tagString : 'tag1#tag2#tag3', tagList : ['tag1','tag2','tag3']};
function getError(tagDetails) {
    var type = tagDetails.type;
    var tagString = tagDetails.tagString;
    var errObj;
    if (typeof errDb[type] === 'undefined') {
        createError(type);
    }
    errObj = new errDb[type](type);
    errObj.tag = type + '@' + tagString;
    return errObj;
}

function isValidObject(obj) {
    if (typeof obj === 'object' && obj !== null) {
        return true;
    } else {
        return false;
    }
}

function isValidArray(arr) {
    if (typeof arr === 'object' && arr instanceof Array) {
        return true;
    } else {
        return false;
    }
}

function isValidNumber(num) {
    if (typeof num === 'number' && !isNaN(num)) {
        return true;
    } else {
        return false;
    }
}

function cloneObj(obj) {
    if(!isValidObject(obj)){
        // obj = {};
        return obj;
    }else{
        if (obj instanceof Array) {
            return obj.slice();
        } else {
            if(Object.keys(obj).length === 0){
                return {};
            }else{
                var cloned = extend({}, obj);
                return cloned;
            }
        }
    }
}

function extendObj(target, source) {
    if(!isValidObject(target)){
        target = {};
    }
    if(!isValidObject(source)){
        source = {};
    }
    var clonedTarget = extend({}, target);
    var extended = extend(clonedTarget, source)
    return extended;
}

function extend(target, source) {
    target = target || {};
    for (var prop in source) {
        if (isValidObject(source[prop])) {
            if (source[prop] instanceof Array) {
                target[prop] = source[prop].slice()
            } else {
                if(Object.keys(source[prop]).length === 0){
                    target[prop] = {};
                }else{
                    target[prop] = extend(target[prop], source[prop]);
                }
            }
        } else {
            target[prop] = source[prop];
        }
    }
    return target;
}

module.exports = function(appConfiguration) {
    config = appConfiguration;
    setModuleErrorHandler();
    return {
        moduleErrorHandler: moduleErrorHandler,
        getError: getError,
        isValidObject: isValidObject,
        isValidNumber: isValidNumber,
        isValidArray: isValidArray,
        extendObj: extendObj,
        cloneObj : cloneObj
    }
}