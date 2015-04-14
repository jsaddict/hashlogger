var expect = require('chai').expect;
var testConfig = require('./compute-config.js');
var testUtil = require('./app-util.js');
var testApi = require('./api.js');
describe("logg", function() {
    describe("config", function(){
        testConfig();
    });
    describe("util", function(){
        testUtil();
    });
    describe("api", function(){
        testApi();
    });
});