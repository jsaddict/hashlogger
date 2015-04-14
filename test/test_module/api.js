var expect = require('chai').expect;
var testData = require('../data/api.js')();
var testApi = require('../../module/api.js');

var appUtil = testData.appUtil;
var configData = testData.config;
var msgs = testData.msgs;
var tags = testData.tags;
var tagCount = testData.tagCount;
var errArgs = testData.errArgs;
var getErrorObj = testData.getErrorObj;

var testProperties = ['err', 'warn', 'info'];
var testConfigs = ['defaultConfig', 'customConfig', 'noTrackConfig'];
var defaultConfig = configData.defaultConfig;
function testApis(){
	for(var i=0; i<testConfigs.length ; i++){
		for(var j = 0; j<testProperties.length; j++){
			describe(testProperties[j],function(){
				var currentConfig = testConfigs[i];
				var currentProperty = testProperties[j];
				var apiObj, currentApiFn, getInstanceData;
				before(function(){					
					apiObj = testApi(configData[currentConfig], appUtil);
					currentApiFn = apiObj[currentProperty];
					getInstanceData = apiObj.getInstanceData;
				});
				it(" should return default message",function(){
					expect(currentApiFn.apply(null).msg).to.equal(configData[currentConfig][currentProperty].defaultMessage);
				});
				it("should track/no-track default args as per configuration",function(){
					var countData = getInstanceData();
					var emptyObj = { err: {}, warn: {}, info: {}};
					var instanceObj = { err: {}, warn: {}, info: {}};
					instanceObj[currentProperty][configData[currentConfig][currentProperty].defaultTagType] = {'no-tag' : 1};
					if(configData[currentConfig][currentProperty].track){
						expect(countData).to.eql(instanceObj)
					}else{
						expect(countData).to.eql(emptyObj)
					}					
				});
				it(" should return custom message",function(){
					if(currentProperty == 'err'){
						for(var k= 0; k<msgs.length; k++){
							expect(currentApiFn.apply(null).m.apply(null,msgs[k].param).currentMsg).to.equal(msgs[k].msg);
						}
					}else{
						for(var k= 0; k<msgs.length; k++){
							expect(currentApiFn.apply(null).m.apply(null,msgs[k].param).msg).to.equal(msgs[k].msg);
						}
					}										
				});
				it("should track/no-track custom args as per configuration",function(){
					// reset instance data.
					getInstanceData();
					var emptyObj = { err: {}, warn: {}, info: {}};
					var instanceObj = { err: {}, warn: {}, info: {}};
					for(var k= 0; k<tags.length; k++){
						if(currentProperty == 'err'){
							var errObj = currentApiFn.apply(null,tags[k].tag).obj;
							expect(errObj.name).to.equal(tags[k].errName);
							expect(errObj.tag).to.equal(tags[k].errTag);
						}else{
							currentApiFn.apply(null,tags[k].tag)
						}
						instanceObj[currentProperty] = tags[k].obj;
						if(configData[currentConfig][currentProperty].track){
							expect(getInstanceData()).to.eql(instanceObj)
						}else{
							expect(getInstanceData()).to.eql(emptyObj)
						}	
					}
					for(var k= 0; k<tags.length; k++){
						currentApiFn.apply(null,tags[k].tag)
					}
					if(configData[currentConfig][currentProperty].track){
						instanceObj = { err: {}, warn: {}, info: {}};
						instanceObj[currentProperty] = tagCount;
						expect(getInstanceData()).to.eql(instanceObj);
					}else{
						expect(getInstanceData()).to.eql(emptyObj)
					}					
				});
				it("should not track custom args",function(){
					// reset instance data.
					getInstanceData();
					var emptyObj = { err: {}, warn: {}, info: {}};
					var instanceObj = { err: {}, warn: {}, info: {}};
					var params;
					for(var k= 0; k<tags.length; k++){
						params = tags[k].tag.concat();
						params.push(false);
						if(currentProperty == 'err'){
							var errObj = currentApiFn.apply(null,params).obj;

							expect(errObj.name).to.equal(tags[k].errName);
							expect(errObj.tag).to.equal(tags[k].errTag);
						}else{
							currentApiFn.apply(null,params)
						}
						instanceObj[currentProperty] = tags[k].obj;
						expect(getInstanceData()).to.eql(emptyObj)
					}
					for(var k= 0; k<tags.length; k++){
						params = tags[k].tag.concat();
						params.push(false);
						currentApiFn.apply(null,params);
					}
					expect(getInstanceData()).to.eql(emptyObj)				
				});
				
				it('should wrap and track errors', function(){
					if(currentProperty == 'err'){
						var returnObj;
						var emptyObj = { err: {}, warn: {}, info: {}};
						var instanceData;
						emptyObj.err[configData[currentConfig].err.defaultTagType] = {'no-tag':1};
						for( var k=0; k<errArgs.length; k++){
							var numArgs = errArgs[k].err.length;
							var errObj = getErrorObj(errArgs[k].errObj);
							var instanceObj = { err: {}, warn: {}, info: {}};
							for(l =0;l<numArgs;l++){
								if(errArgs[k].msg == null){
									returnObj = currentApiFn.apply(null, [errObj].concat(errArgs[k].err[l]));
									errObj = returnObj.obj
								}else{
									returnObj = currentApiFn.apply(null, [errObj].concat(errArgs[k].err[l])).m.apply(null, errArgs[k].msg[l]);
									errObj = returnObj.obj
								}							
							}
							expect(returnObj.currentMsg).to.equal(errArgs[k].result.currentMsg);
							if(currentConfig == 'defaultConfig'){
								expect(returnObj.msg).to.equal(errArgs[k].result.defaultConfigMsg);
								expect(errObj.message).to.equal(errArgs[k].result.defaultConfigMsg);
							}else{
								expect(returnObj.msg).to.equal(errArgs[k].result.customConfigMsg);
								expect(errObj.message).to.equal(errArgs[k].result.customConfigMsg);
							}
							instanceData = getInstanceData();
							if(currentConfig != 'noTrackConfig'){
								if(errArgs[k].result.countObj != null){
									instanceObj[currentProperty] = errArgs[k].result.countObj;
									expect(instanceData).to.eql(instanceObj);								
								}else{
									expect(instanceData).to.eql(emptyObj);
								}		
							}else{
								expect(instanceData).to.eql({ err: {}, warn: {}, info: {}})
							}											
						}
					}
				})
			});
		}
	}
}
module.exports = testApis;