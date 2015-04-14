var testData = require('../data/compute-config.js');
var computeConfig = require('../../module/compute-config.js');

var dbUnsupported = testData.mandatory.dbUnsupported;
var dbMandatory = testData.mandatory.db;

var appUnsupported = testData.mandatory.appUnsupported;
var appMandatory = testData.mandatory.app;

var appConfig = testData.app;
var appDefault = testData.appDefault;

var intervalData = testData.intervalData;
var alertData = testData.alertData;
var handleErrorData = testData.handleErrorData;

var expect = require('chai').expect;
function testConfig(){
	describe("mandatory config", function(){
        // If alteast one mandatory field is not of specified type, it should throw error
        it("should throw error if db mandatory properties are not set", function() {
        	Object.keys(dbMandatory).forEach(function(property){
				var oldValue = dbMandatory[property];
				for(var i=0;i<dbUnsupported.length;i++){
					dbMandatory[property] = dbUnsupported[i];
					expect(function(){ computeConfig({}, appMandatory, dbMandatory) }).to.throw(Error);
				}
				dbMandatory[property] = oldValue;
			});
	    });
	    it("should throw error if app mandatory properties are not set", function() {
        	Object.keys(appMandatory).forEach(function(property){
				var oldValue = appMandatory[property];
				for(var i=0;i<appUnsupported.length;i++){
					appMandatory[property] = appUnsupported[i];
					expect(function(){ computeConfig({}, appMandatory, dbMandatory) }).to.throw(Error);
				}
				appMandatory[property] = oldValue;
			});
	    });
	    it("should generate config object", function() {
	    	var computedConfig = {};
	    	var appMandatory = testData.mandatory.app;
	    	var dbMandatory = testData.mandatory.db;
        	computeConfig(computedConfig, appMandatory, dbMandatory);
        	Object.keys(dbMandatory).forEach(function(property){
				expect(dbMandatory[property].name).to.equal(computedConfig.db[property].name);
			});

			Object.keys(appMandatory).forEach(function(property){
				expect(appMandatory[property]).to.equal(computedConfig[property]);
			});
			
			Object.keys(appDefault).forEach(function(property){
				if(typeof appMandatory[property] == 'undefined' ){
					expect(appDefault[property]).to.eql(computedConfig[property]);
				}
			});
	    });
    });
	describe("optional config", function(){
		testApiConfig()
		testIntervalConfig()
		testHandleErrorConfig()
		testAlertConfig()
		it("should throw error for instanceDataHandler for non functions", function(){
			var unSupported = getUnsupported('function', true, false);
			for(var i=0;i < unSupported.length;i++){
				var computedConfig = {};
				appConfig.instanceDataHandler = unSupported[i];				
				expect(function(){computeConfig(computedConfig, appConfig, dbMandatory)}).to.throw(Error);
			}
		})
		it("should set instanceDataHandler function", function(){
			var computedConfig = {};
			appConfig.instanceDataHandler = function instanceDataHandler(){};
			computeConfig(computedConfig, appConfig, dbMandatory);
			expect(computedConfig.instanceDataHandler.name).to.equal('instanceDataHandler');
		})

		it("should throw error for aggregateDataHandler for non functions", function(){
			var unSupported = getUnsupported('function', true, false);
			for(var i=0;i < unSupported.length;i++){
				var computedConfig = {};
				appConfig.aggregateDataHandler = unSupported[i];				
				expect(function(){computeConfig(computedConfig, appConfig, dbMandatory)}).to.throw(Error);
			}
		})
		it("should set aggregateDataHandler function", function(){
			var computedConfig = {};
			appConfig.aggregateDataHandler = function aggregateDataHandler(){};
			computeConfig(computedConfig, appConfig, dbMandatory);
			expect(computedConfig.aggregateDataHandler.name).to.equal('aggregateDataHandler');
		})
	});
}

function testApiProperty(testProperty, customObject){
	var testString = "should overwrite default "+testProperty+" config";
	it(testString, function() {
		Object.keys(customObject).forEach(function(property){
			var computedConfig = {};
			appConfig[testProperty][property] = customObject[property];
			computeConfig(computedConfig, appConfig, dbMandatory);
			expect(computedConfig[testProperty][property]).to.equal(customObject[property]);
		});	
	});
	var errorString = "should throw error "+testProperty+"";
	it(errorString, function() {
		var unSupported = getUnsupported('object', true, false);
		var oldConfig = appConfig[testProperty];
		for(var i=0;i < unSupported.length;i++){
			var computedConfig = {};
			appConfig[testProperty] = unSupported[i];
			expect(function(){computeConfig(computedConfig, appConfig, dbMandatory)}).to.throw(Error);
		}
		appConfig[testProperty] = oldConfig;
	});
	
}
function testApiConfig(){
	describe("api settings", function(){
		testApiProperty('api', appConfig.api);
		testApiProperty('err', appConfig.err);
		testApiProperty('warn', appConfig.warn);
		testApiProperty('info', appConfig.info);
	})	
}
function testIntervalConfig(){
	describe("interval config", function(){
		it('should throw error for non object interval', function() {
			var unSupported = getUnsupported('object', true, false);
			for(var i=0;i < unSupported.length;i++){
				var computedConfig = {};
				appConfig.interval = unSupported[i];
				expect(function(){computeConfig(computedConfig, appConfig, dbMandatory)}).to.throw(Error);
			}
		});
		it('should overwrite default interval', function() {
			Object.keys(intervalData.valid).forEach(function(property){
				var computedConfig = {};
				appConfig.interval = intervalData.valid[property];
				computeConfig(computedConfig, appConfig, dbMandatory);
				expect(computedConfig.interval).to.eql(intervalData.valid[property]);
			});
		});
		it('should throw error for invalid custom config', function() {
			var oldInterval = appDefault.interval;
			Object.keys(intervalData.error).forEach(function(property){
				var computedConfig = {};
				appConfig.interval = intervalData.error[property];			
				expect(function(){computeConfig(computedConfig, appConfig, dbMandatory)}).to.throw(Error);
			});
			appConfig.interval = oldInterval;
		});
	})	
}
function testHandleErrorConfig(){
	describe("handleError config", function(){
		it('should default throw-error for invalid config', function() {
			var unSupported = getUnsupported('string', true, true);
			// remove function; function is a valid one
			unSupported.pop()
			for(var i=0;i < unSupported.length;i++){
				var computedConfig = {};
				appConfig.handleError = unSupported[i];
				computeConfig(computedConfig, appConfig, dbMandatory);
				expect(computedConfig.handleError).to.equal('throw-error');
			}
		});
		it('should overwrite default interval', function() {
			Object.keys(handleErrorData.valid).forEach(function(property){
				var computedConfig = {};
				appConfig.handleError = handleErrorData.valid[property];
				computeConfig(computedConfig, appConfig, dbMandatory);
				if(typeof handleErrorData.valid[property] == 'function'){
					expect(computedConfig.handleError.name).to.equal(handleErrorData.valid[property].name);
				}else{
					expect(computedConfig.handleError).to.equal(handleErrorData.valid[property]);
				}
			});
		});
	})	
}
function testAlertConfig(){
	describe("alert config", function(){
		it('should throw error for non object', function() {
			var unSupported = getUnsupported('object', true, false);
			var oldAlert = appConfig.alert;
			for(var i=0;i < unSupported.length;i++){
				var computedConfig = {};
				appConfig.alert = unSupported[i];
				expect(function(){computeConfig(computedConfig, appConfig, dbMandatory)}).to.throw(Error);
			}
			appConfig.alert = oldAlert;
		});
		it('should overwrite default interval', function() {
			appConfig.alert = {};
			Object.keys(alertData.valid).forEach(function(property){
				var computedConfig = {};
				appConfig.alert[property] = alertData.valid[property];
				computeConfig(computedConfig, appConfig, dbMandatory);
				expect(computedConfig.alert[property]).to.eql(alertData.result[property]);
			});
		});
		it('should throw error for invalid custom config', function() {
			var oldAlert = appConfig.alert;
			appConfig.alert = {};
			Object.keys(alertData.error).forEach(function(property){
				var computedConfig = {};
				appConfig.alert[property] = alertData.error[property];			
				expect(function(){computeConfig(computedConfig, appConfig, dbMandatory)}).to.throw(Error);
			});
			appConfig.alert = oldAlert;
		});
	})	
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
module.exports = testConfig;