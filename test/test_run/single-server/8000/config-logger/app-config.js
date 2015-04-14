var util = require('../../../util.js')();
var checkInstanceHandler = util.checkInstanceHandler;
var checkAggregationHandler = util.checkAggregationHandler;
var configInterval = require('../../../config.js').interval;
module.exports = {
    aggregatorToken : 'logger-token',
    aggregatorUrl: 'http://localhost:8000/aggregate',
    alertHandlerUrl : 'http://localhost:8000/alert',
    interval : configInterval,
    // It will be called on each instance
    // User can know count by instance
    instanceDataHandler : function(config, serverInfo, data){
        checkInstanceHandler('ss', data, serverInfo)
    },
    aggregateDataHandler : function(config, serverInfo, data){
        checkAggregationHandler('ss', data, serverInfo)
    }
};