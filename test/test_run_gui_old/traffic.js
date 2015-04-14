var request = require('request');
var delay;
var paths = [
    'http://localhost:8000',
    'http://localhost:8001',
    'http://localhost:8002',
    'http://localhost:8003',
    'http://localhost:8004',
    'http://localhost:8000'
];

var paths = [
    'http://localhost:8000',
    'http://localhost:8000',
    'http://localhost:8000',
    'http://localhost:8000',
    'http://localhost:8000',
    'http://localhost:8000'
];
function requester(){
    var url = paths[parseInt(Math.random() * 5)];
    request.get({uri:url});
    setTimeout(requester,delay);
}
function init(interval){
    delay = interval;
    setTimeout(requester,delay);
}
module.exports = {
    init : init
}