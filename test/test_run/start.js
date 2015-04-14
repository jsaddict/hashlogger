/*
 * 1) node start.js ss app
 * 		test Single Server mode without db, only test instance and aggregator handlers
 *
 * 2) node start.js ms app
 * 		test Multi Server mode without db, only test instance and aggregator handlers
 *
 * 3) node start.js ss db
 * 		test Single Server and handlers and at the end (after specific time) it tests db data (tags and count)
 *
 * 4) node start.js ms db
 * 		test Multi Server and handlers and at the end (after specific time) it tests db data (tags and count)
 *
 * 5) node start.js both app
 * 		test both Single Server mode and Multi Server mode without db, only test instance and aggregator handlers
 *
 * 6) node start.js both db
 * 		test both Single Server mode and Multi Server mode and handlers and at the end (after specific time) it tests db data (tags and count)
 *
 *  Last Argument :: 
 *  	"all"   --> logs "instance data", "aggregation data", "expected aggregation data", "tags" and "expected tags"
 *      "track" --> It won't test aggregation. just to test start and stop of tracking and cron
 */
var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var config = require('./config.js');
var utilRef = require('./util.js');
var util = require('./util.js')();
var ss = require('./single-server/index.js');
var ms = require('./multi-server/index.js');

var servers = "both";
var type = "db";
var logData = false;
var argumentArray = process.argv;
var testDb = true;
var testTrack = false;
var numTestServers = 1;
var ssdb, msdb;
var dbList = config.db.list;
var ssdbList, msdbList;
var dbRef = config.db.reference;
var getTotalTags = util.getTotalTags;
var testDbCount = 0;
console.log(process.argv)
switch(argumentArray[2]) {
    case 'ss':
        servers = 'ss'
        break;
    case 'ms':
        servers = 'ms'
        break;
    case 'both':
        servers = 'both'
        break;
    default:
        servers = 'both'
}
switch(argumentArray[3]) {
    case 'app':
        type = 'app'
        break;
    case 'db':
        type = "db"
        break;
    default:
        type = "db"
}
if(typeof argumentArray[4] == 'string' && argumentArray[4] == 'all'){
	logData = true;
}
if(typeof argumentArray[4] == 'string' && argumentArray[4] == 'track'){
    testTrack = true;
}
if(type == 'app'){
    testDb = false;
}
if(servers == 'both'){
    numTestServers = 2;
}
console.log(servers, type, logData);

function initDbConnection(fn){
    var dbCount = 0;
    MongoClient.connect(config.db.ss,function(err,db){
        if(err){
            console.log("Error creating new connection Single Server"+err);
        }
        else{
            console.log("created new db connection for Single Server");
            ssdb = db;
            dbCount++;
            if(dbCount == 2){
                return fn();
            }            
        }
    });
    MongoClient.connect(config.db.ms,function(err,db){
        if(err){
            console.log("Error creating new connection Multi Server"+err);
        }
        else{
            console.log("created new db connection for Multi Server");
            msdb = db;
            dbCount++;
            if(dbCount == 2){
                return fn();
            }            
        }
    }); 
}
function clearDb(fn){
    if(servers == 'both' || servers == 'ss'){
        for(var i=0; i<dbList.length; i++){
            (function(name){
                ssdb.collection(name).deleteMany({},null,function(err,numberRemoved){
                    if(err){
                        console.log('error while clearing db Single Server collection ',name)
                    }else{
                        console.log('cleared db Single Server collection ',name);
                    }                    
                });
            }(dbList[i]))            
        }
        ssdb.collection('tags').deleteMany({},null,function(err,numberRemoved){
            if(err){
                console.log('error while clearing db Single Server collection tags')
            }else{
                console.log('cleared db Single Server collection tags');
            }                    
        });
    }
    if(servers == 'both' || servers == 'ms'){
        for(var i=0; i<dbList.length; i++){
            (function(name){
                msdb.collection(name).deleteMany({},null,function(err,numberRemoved){
                    if(err){
                        console.log('error while clearing db Multi Server collection ',name)
                    }else{
                        console.log('cleared db Multi Server collection ',name);
                    }                    
                });
            }(dbList[i]))            
        }
        msdb.collection('tags').deleteMany({},null,function(err,numberRemoved){
            if(err){
                console.log('error while clearing db Multi Server collection tags')
            }else{
                console.log('cleared db Multi Server collection tags');
            }                    
        });
    }
    fn()
}
function startAppTest(){
    if(servers == 'both' || servers == 'ss'){
        ss.startTestServer();
    }
    if(servers == 'both' || servers == 'ms'){
        ms.startTestServer();
    }       
}
function stopAppTest(){
    if(servers == 'both' || servers == 'ss'){
        ss.stopTestServer();
    }
    if(servers == 'both' || servers == 'ms'){
        ms.stopTestServer();
    }       
}
function aggregate(dataArray){
    var len = dataArray.length;
    var total = {};
    for(var i=0;i<len;i++){
        var data = dataArray[i].data;
        Object.keys(data).forEach(function(category) {
            if(typeof total[category] == 'undefined'){
                total[category] = {};
            }
            Object.keys(data[category]).forEach(function(type) {
                if(typeof total[category][type] == 'undefined'){
                    total[category][type] = {};
                }
                Object.keys(data[category][type]).forEach(function(tag){
                    if(typeof total[category][type][tag] == 'undefined'){
                        total[category][type][tag] = data[category][type][tag];
                    }else
                    if((typeof total[category][type][tag] == 'number') && (typeof data[category][type][tag] == 'number')){
                        total[category][type][tag] = total[category][type][tag]+data[category][type][tag];
                    }
                });
            });
        });
    }
    return total;
}
function testTagCount(server, name, fn){
    if(typeof name == 'undefined'){
        testDbCount++;
        if(testDbCount == numTestServers){
            return fn('success');
        }else{
            return;
        }
    }
    console.log('testing collection ', name, server);
    var refDb = dbRef[name];
    var dbCon, testDbList, query;    
    var prevTimestamp = null, currentTimestamp = null;
    if(server == 'ss'){
        dbCon = ssdb;
        testDbList = ssdbList;
    }else{
        dbCon = msdb;
        testDbList = msdbList;
    }
    dbCon.collection(name).find({}).sort({_id:1}).each(function(err, data){
        if(err){
            console.log('error while finding documents in collection ',name, server);
        }else{
            if(data == null){
                console.log('  ===  tested equality of db till null', name, server);
                testTagCount(server, testDbList.shift(), fn);
            }else{
                currentTimestamp = data._id;
                var storedData = data.data;
                if(prevTimestamp == null){
                    query = {$lte: currentTimestamp};
                }else{
                    query = {$gt: prevTimestamp, $lte: currentTimestamp};
                }
                (function(prevTimestamp, currentTimestamp, name, server, query){
                    dbCon.collection(refDb).find( {_id:query}).toArray(function(err, docs) {
                        if(err){
                            console.log('error while finding documents in aggregator collection ',name, server, refDb);
                        }else{
                            var aggregatedData = aggregate(docs);
                            console.log('   ',prevTimestamp, currentTimestamp, name, server)
                            console.log(aggregatedData)
                            console.log(storedData)
                            if(prevTimestamp != null){
                                assert.deepEqual(aggregatedData, storedData);
                            }
                            // assert.deepEqual(aggregatedData, storedData);
                            console.log('  ===  tested equality of ',name, server);
                            // testTagCount(server, testDbList.shift(), fn);
                        }
                    });
                }(prevTimestamp, currentTimestamp, name, server, query))               
                prevTimestamp = currentTimestamp;
            }
        }
    })
}
function startDbTest(fn){
    ssdbList = dbList.slice();
    msdbList = dbList.slice();
    ssdbList.shift();
    msdbList.shift();
    // console.log('started db test ss ms',ssdbList, msdbList);
    // process.exit(0);
    if(servers == 'both' || servers == 'ss'){
        testTagCount('ss',ssdbList.shift(),fn)
    }
    if(servers == 'both' || servers == 'ms'){
        testTagCount('ms',msdbList.shift(),fn)
    }       
}
function startTest(){	
    initDbConnection(function(){
        clearDb(function(){
            utilRef(ssdb, msdb, logData, testTrack);
            startAppTest();
        });
    })
}
function testTags(){
    var testCount = 0;
    if(servers == 'both' || servers == 'ss'){
        ssdb.collection('tags').findOne({ name : 'tags'}, function(err, docs){
            if(err){
                console.log('Error while getting tags from ssdb')
            }else{
                console.log('ssdb tags-->', docs.tags);
                console.log('stored tags-->', util.getTotalTags().ss);
            }
            testCount++;
            if(testCount == numTestServers){
                process.exit(0);
            }
        })
    }
    if(servers == 'both' || servers == 'ms'){
        msdb.collection('tags').findOne({ name : 'tags'}, function(err, docs){
            if(err){
                console.log('Error while getting tags from msdb')
            }else{
                console.log('msdb tags-->', docs.tags);
                console.log('stored tags-->', util.getTotalTags().ms);
            }
            testCount++;
            if(testCount == numTestServers){
                process.exit(0);
            }
        })
    } 
}
process.on('SIGINT', function () {
    stopAppTest();
    if(testDb){       
        startDbTest(function(response){
            if(response == 'success'){
                console.log('successful !! db',servers, type);
            }else{
                console.log('Failed !! db',servers, type);
            }
            testTags();
        })
    }else{
        console.log('test done ',servers, type);
        testTags();
    }
});

function startTrack(server, port){
    if(server == 'ss'){
        ss.startTracking(port)
    }else{
        ms.startTracking(port)
    }
}
function stopTrack(server, port){
    if(server == 'ss'){
        ss.stopTracking(port)
    }else{
        ms.stopTracking(port)
    }
}
/**
 * Start controller
 */
var app = express();
app.get('/stop-ss-8000',function(req, res, next){
    stopTrack('ss',8000);
    res.send('hi');
})
app.get('/stop-ms-8100',function(req, res, next){
    stopTrack('ms',8100);
    res.send('hi');
})
app.get('/stop-ms-8101',function(req, res, next){
    stopTrack('ms',8101);
    res.send('hi');
})
app.get('/stop-ms-8102',function(req, res, next){
    stopTrack('ms',8102);
    res.send('hi');
})
app.get('/stop-ms-8103',function(req, res, next){
    stopTrack('ms',8103);
    res.send('hi');
})

app.get('/start-ss-8000',function(req, res, next){
    startTrack('ss',8000);
    res.send('hi');
})
app.get('/start-ms-8100',function(req, res, next){
    startTrack('ms',8100);
    res.send('hi');
})
app.get('/start-ms-8101',function(req, res, next){
    startTrack('ms',8101);
    res.send('hi');
})
app.get('/start-ms-8102',function(req, res, next){
    startTrack('ms',8102);
    res.send('hi');
})
app.get('/start-ms-8103',function(req, res, next){
    startTrack('ms',8103);
    res.send('hi');
})
var server = app.listen(config.main.port, function() {
    console.log("Listening - ", server.address());
    startTest();
});
/*
process.on('SIGINT', function () {
  console.log('Got a SIGINT. Goodbye cruel world');
  process.exit(0);
});
kill -s SIGINT [process_id]
*/
/*
var cron = setInterval(function(){
    console.log('hi')
}.400)
var app = require('express')();
app.get('/stop', function(req, res){
    clearInterval(cron);
})
app.listen(9000);
*/
