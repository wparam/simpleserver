var express = require('express')
var path = require('path')
var app = express()
var router = require('./app/routers/core.router')(app)
const cluster = require('cluster');
const loadbalancer = require('./modules/loadbalancer');

const winston = require('winston');

winston.level = 'debug';
const mockService = [
    {host: 'http://172.20.30.115:40014', orgId: 1, clientId: 1, endpoint:'/v1/configuration/healthcheckping', type:'sherpa'},
    {host: 'http://172.20.30.115:50015', orgId: 1, clientId: 1, endpoint:'/v1/configuration/healthcheckping', type:'sherpa'},
    {host: 'http://172.20.30.115:60016', orgId: 1, clientId: 1, endpoint:'/v1/configuration/healthcheckping', type:'sherpa'}
    // {host: 'http://172.20.30.115:50015', orgId: 2, clientId: 4, endpoint:'/v1/configuration/healthcheckping', type:'sherpa1'},
    // {host: 'http://172.20.30.115:50015', orgId: 2, clientId: 5, endpoint:'/v1/configuration/healthcheckping', type:'sherpa2'}
];


for (var key in mockService) {
    var server = mockService[key];
    loadbalancer.addServer(server.orgId + server.type, server.host, server.endpoint);
}
loadbalancer.start();

if(cluster.isMaster){
    console.log('---------------------------------------Running in Master Process---------------------------------------');
    var workers = [];
    for (let i=0; i<1; i++) {
        workers.push(cluster.fork());
    }
    var cleanExpired = function () {
        if(workers.length===0){
            logger.error('Worker List Is Empty!');
            return;
        }
        var workerId = Math.floor((Math.random() * workers.length));
        console.log('Worker: ' + workers[workerId].id + ' should be cleaning up expired sessions!');
        workers[workerId].send('cleanExpired');
    };

    setInterval(cleanExpired, 100000);

    cluster.on('exit', function (worker, code, signal) {
        logger.error('worker ' + worker.process.pid + ' died');
    });
}else{
    console.log('+++++++++++++++++++++++++++++++++++++++++++++++Running In Cluster Process+++++++++++++++++++++++++++++++++++++++++++++++');
    var server = app.listen(3001, function () {
        console.log('Express server listening on port 3001');
    });
}

