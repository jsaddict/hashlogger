var util = require('util');
var config, getError, cloneObj;

var msgSeparator,

	defaultErrMsg,
	defaultWarnMsg,
	defaultInfoMsg,

	defaultErrType,
	defaultWarnType,
	defaultInfoType,

	trackErr,
	trackWarn,
	trackInfo;

var instanceData = {
	err : {},
	warn : {},
	info : {}
};

var defaultErrTagDetails,
	defaultWarnTagDetails,
	defaultInfoTagDetails;
function trackTags(category, tagDetails){
	var tagType = tagDetails.type;
	var tagList = tagDetails.tagList;
	var tag = null;
	var len = tagList.length;
	if(typeof instanceData[category][tagType] === 'undefined'){
		instanceData[category][tagType] = {};
	}
	for(var i=0; i<len; i++){
		tag = tagList[i];
		if(typeof instanceData[category][tagType][tag] === 'undefined'){
			instanceData[category][tagType][tag] = 1;
		}else{
			instanceData[category][tagType][tag]++;
		}
	}
}
function getDetails(tagString){
	var split;
	var details = {
		type : null, 
		tagString : null, // all tags appended by '#'
		tagList : [] // all tags as an array
	}
	if(typeof tagString !== 'string'){
		details.type = 'global';
		details.tagString = 'no-tag';
		details.tagList = ['no-tag']; 
	}else{
		split = tagString.split('@');
		if(split.length == 1){
			details.type = split[0];
			details.tagString = 'no-tag';
			details.tagList = ['no-tag']; 
		}else{
			details.type = split[0];
			details.tagString = split[1];
			details.tagList = split[1].split('#'); 
		}
	}
	return details;
}
function buildError(destinationObj, tagString, track){
	destinationObj.isWrapper = false;
	if(tagString === null){
		tagString = defaultErrType;
	}
	var tagDetails = getDetails(tagString);
	destinationObj.errorObj = getError(tagDetails);
	destinationObj.errorObj.message = defaultErrMsg;
	if(track && trackErr){
		trackTags('err', tagDetails);
	}
}
function wrapError(destinationObj, errorObj, tagString, track){
	destinationObj.isWrapper = true;
	var tagDetails;
	destinationObj.errorObj = errorObj;
	if(tagString !== null){
		tagDetails = getDetails(tagString);
	}else{
		tagDetails = getDetails(defaultErrType)
	}
	if(track && trackErr){
		trackTags('err', tagDetails);
	}	
}
// arguments
// errObj(object), tagString(string), trackTags(boolean)
function err(){
	var returnObj = {};
	var infoObj = {
		isWrapper : false, // If it is false so, the error message supplied through m() should replace the default message.
		errorObj : null,		
		currentMsg : '' // currentMsg is the message entered by user
	};
	var argLen = arguments.length;
	switch(argLen) {
	    case 0:
	        buildError(infoObj, null, true);
	        break;
	    case 1:
	        if(typeof arguments[0] === 'string'){
	        	buildError(infoObj, arguments[0], true);
	        }else
	        if(typeof arguments[0] === 'object'){
	        	wrapError(infoObj, arguments[0], null, true);
	        }else{
	        	buildError(infoObj, null, true);
	        }
	        break;
	    case 2:
	        if(typeof arguments[0] === 'object'){
	        	if(typeof arguments[1] === 'string'){
	        		wrapError(infoObj, arguments[0], arguments[1], true);
	        	}else{
	        		wrapError(infoObj, arguments[0], null, true);
	        	}	        	
	        }else
	        if(typeof arguments[0] === 'string'){
	        	if(typeof arguments[1] === 'boolean'){
	        		buildError(infoObj, arguments[0], arguments[1]);
	        	}else{
	        		buildError(infoObj, arguments[0], true);
	        	}	
	        }else{
	        	buildError(infoObj, null, true);
	        }
	        break;
	    case 3:
	    default:
	        if(typeof arguments[0] === 'object'){
	        	if(typeof arguments[1] === 'string'){
	        		if(typeof arguments[2] === 'boolean'){
		        		wrapError(infoObj, arguments[0], arguments[1], arguments[2]);
		        	}else{
		        		wrapError(infoObj, arguments[0], arguments[1], true);
		        	}
	        	}else{
	        		wrapError(infoObj, arguments[0], null, true);
	        	}	        	
	        }else{
	        	buildError(infoObj, null, true);
	        }
	        break;
	}
	function m(){
		if(arguments.length !== 0){
			infoObj.currentMsg = util.format.apply({},arguments);
			if(infoObj.isWrapper){
				if(typeof infoObj.errorObj.message === 'string' && infoObj.errorObj.message !== ''){
					infoObj.errorObj.message = infoObj.currentMsg + msgSeparator + infoObj.errorObj.message;
				}else{
					infoObj.errorObj.message = infoObj.currentMsg;
				}
			}else{
				infoObj.errorObj.message = infoObj.currentMsg;				
			}
		}
		returnObj.obj = infoObj.errorObj;
		returnObj.msg = infoObj.errorObj.message;
		returnObj.currentMsg = infoObj.currentMsg;
		return returnObj;
	}
	returnObj.obj = infoObj.errorObj;
	returnObj.msg = infoObj.errorObj.message;
	returnObj.currentMsg = infoObj.currentMsg;
	returnObj.m = m;
	return returnObj;
}
// argumetns : only tagString.
function warn(){
	var tagDetails = defaultWarnTagDetails;
	var returnObj = {
		msg : defaultWarnMsg
	};
	var track = typeof arguments[1] === 'undefined' ? true : arguments[1];
	if(typeof arguments[0] === 'string'){
		tagDetails = getDetails(arguments[0]);
	}
	if(track && trackWarn){
		trackTags('warn', tagDetails);
	}
	function m(){
		if(arguments.length !== 0){
			returnObj.msg = util.format.apply({},arguments);
		}
		return returnObj;
	}
	returnObj.m = m;
	return returnObj;
}
function info(){
	var tagDetails = defaultInfoTagDetails;
	var returnObj = {
		msg : defaultInfoMsg
	};
	var track = typeof arguments[1] === 'undefined' ? true : arguments[1];
	if(typeof arguments[0] === 'string'){
		tagDetails = getDetails(arguments[0]);
	}
	if(track && trackWarn){
		trackTags('info', tagDetails);
	}
	function m(){
		if(arguments.length !== 0){
			returnObj.msg = util.format.apply({},arguments);
		}
		return returnObj;
	}
	returnObj.m = m;
	return returnObj;
}
function getInstanceData(){
	var data = cloneObj(instanceData);
	instanceData = {
		err : {},
		warn : {},
		info : {}
	};
	return data;
}
module.exports = function(appConfiguration, appUtilities, instanceData){
	config = appConfiguration;
	getError = appUtilities.getError;
	cloneObj = appUtilities.cloneObj;

	msgSeparator = config.err.msgSeparator;

	defaultErrMsg = config.err.defaultMessage;
	defaultWarnMsg = config.warn.defaultMessage;
	defaultInfoMsg = config.info.defaultMessage;
	
	defaultErrType = config.err.defaultTagType;
	defaultWarnType = config.warn.defaultTagType;
	defaultInfoType = config.info.defaultTagType;

	trackErr = config.err.track === false ? false : true;
	trackWarn = config.warn.track === false ? false : true;
	trackInfo = config.info.track === false ? false : true;

	defaultWarnTagDetails = getDetails(defaultWarnType);
	defaultInfoTagDetails = getDetails(defaultInfoType);
	return {
		err : err,
		warn : warn,
		info : info,
		getInstanceData : getInstanceData
	}
}
