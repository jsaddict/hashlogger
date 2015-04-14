var testData = require('../data/app-util.js');
var objData = testData.objData;
var errData = testData.errData;
var appUtil = require('../../module/app-util.js');
var expect = require('chai').expect;
var defaultUtil = appUtil({handleError : 'throw-error'});
var getError = defaultUtil.getError;
var isValidObject = defaultUtil.isValidObject;
var isValidNumber = defaultUtil.isValidNumber;
var isValidArray = defaultUtil.isValidArray;
var extendObj = defaultUtil.extendObj;
var cloneObj = defaultUtil.cloneObj;
function testUtil(){
	describe("moduleErrorHandler", function(){
        it("should be throw-error", function() {
        	var throwErrorfn = appUtil({handleError : 'throw-error'}).moduleErrorHandler;
        	expect(throwErrorfn.name).to.equal('throwError');
	    });
	    it("should be log-error", function() {
        	var logMessagefn = appUtil({handleError : 'log-error'}).moduleErrorHandler;
        	expect(logMessagefn.name).to.equal('logMessage')
	    });
	    it("should be function", function() {
        	var customfn = appUtil({handleError : function customFunction(){}}).moduleErrorHandler;
        	expect(customfn.name).to.equal('customFunction')
	    });	    
    });
	describe("getError", function(){
        it("should get error object", function() {
        	var errObj;
        	for(var i=0;i<errData.length;i++){
        		errObj = getError.call(null, errData[i].param);
        		expect(errObj).to.be.an.instanceof(Error);
        		expect(errObj.tag).to.equal(errData[i].tag);
        		expect(errObj.name).to.equal(errData[i].name);
        	}
	    });  
    });
    describe("extendObj", function(){
        it("should extend object", function() {
        	var testData;
        	for(var i=0 ;i<objData.length;i++){
        		testData = objData[i];
        		expect(extendObj(testData.target, testData.source)).to.eql(testData.result);
        	}
	    });  
    });
    describe("cloneObj", function(){
        it("should clone object", function() {
        	var testData;
        	for(var i=0 ;i<objData.length;i++){
        		expect(cloneObj(objData[i])).to.eql(objData[i]);
        		Object.keys(objData[i]).forEach(function(property){
                    expect(cloneObj(objData[i][property])).to.eql(objData[i][property]);
                });
        	}

	    });  
    });
	describe("isValidObject", function(){
        it("should return false", function() {
        	var unSupported = getUnsupported('object',true,true);
        	for(var i=0;i<unSupported.length;i++){
        		expect(isValidObject(unSupported[i])).to.equal(false);
        	}
	    });  
	    it("should return true", function() {
        	expect(isValidObject({})).to.equal(true);
        	expect(isValidObject({ hello: 'world'})).to.equal(true);
	    });  
    });
    describe("isValidNumber", function(){
        it("should return false", function() {
        	var unSupported = getUnsupported('number',true,true);
        	for(var i=0;i<unSupported.length;i++){
        		expect(isValidNumber(unSupported[i])).to.equal(false);
        	}
	    });  
	    it("should return true", function() {
        	expect(isValidNumber(0)).to.equal(true);
        	expect(isValidNumber(-3)).to.equal(true);
        	expect(isValidNumber(2.4)).to.equal(true);
	    });  
    });
    describe("isValidArray", function(){
        it("should return false", function() {
        	var unSupported = getUnsupported('array',true,true);
        	for(var i=0;i<unSupported.length;i++){
        		expect(isValidArray(unSupported[i])).to.equal(false);
        	}
	    });  
	    it("should return true", function() {
        	expect(isValidArray([])).to.equal(true);
        	expect(isValidArray([1,3])).to.equal(true);
	    });  
    });
}
function getUnsupported(type, includeNull, includeUndefined){
	var returnArray = [undefined, null, '', 'string', 0, 5.5, 5, false, true, {}, {hello : 'world'}, function fn(){}];	
	switch(type) {
	    case 'boolean':
	        returnArray.splice(6,2);
	        break;
	    case 'number':
	        returnArray.splice(4,3);
	        break;
	    case 'string':
	        returnArray.splice(2,2);
	        break;
	    case 'object':
	        returnArray.splice(9,2);
	        break;
	    case 'function':
	        returnArray.splice(11,1);
	        break;
	}
	if(typeof includeNull == 'undefined' || includeNull == false){
		returnArray.splice(1,1)
	}
	if(typeof includeUndefined == 'undefined' || includeUndefined == false){
		returnArray.splice(0,1)
	}
	return returnArray;
}
module.exports = testUtil;