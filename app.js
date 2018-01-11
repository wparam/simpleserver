var express = require('express')
var path = require('path')
var app = express()
var router = require('./app/routers/core.router')(app)
const cluster = require('cluster');
const loadbalancer = require('./modules/loadbalancer');

const mockService = [
    {host: 'http://172.20.30.115:60016', orgId: 1, clientId: 1, endpoint:'/a', type:'sherpa1'},
    {host: 'http://172.20.30.115:60016', orgId: 1, clientId: 2, endpoint:'/a', type:'sherpa2'},
    {host: 'http://172.20.30.115:60016', orgId: 1, clientId: 3, endpoint:'/a', type:'sherpa3'},
    {host: 'http://172.20.30.115:50015', orgId: 1, clientId: 4, endpoint:'/a', type:'sherpa1'},
    {host: 'http://172.20.30.115:50015', orgId: 1, clientId: 5, endpoint:'/a', type:'sherpa2'}
];


for (var key in mockService) {
    var server = mockService[key];
    loadbalancer.addServer(server.orgId + server.type, server.host, server.endpoint);
}
loadbalancer.start();

if(cluster.isMaster){
    var workers = [];
    for (var id in cluster.workers) {
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
    var server = app.listen(3001, function () {
        logger.info('Express server listening on port 3001');
    });
}

