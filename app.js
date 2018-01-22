var express = require('express')
var path = require('path')
var app = express()
var router = require('./app/routers/core.router')(app)
const cluster = require('cluster');
const loadbalancer = require('./modules/loadbalancer');
const chalk = require('chalk');

const winston = require('winston');

const master = chalk.green;
const clu = chalk.yellow;

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
    console.log(master('----------Running in Master Process----------'));
    var cpus = require('os').cpus().length-1;
    console.log(master('-------system-------fork clusters on cpus: ' + cpus));
    for(var i = 0; i<cpus; i++){
        cluster.fork();
    }

    cluster.on('exit', function (worker, code, signal) {
        console.log(master('worker ' + worker.process.pid + ' died'));
        // cluster.fork();
    });
}else{
    console.log(clu('+++++++++++Running In Cluster Process+++++++++++'));
    var server = app.listen(3001, function () {
        console.log(clu('Express server listening on port 3001'));
    });
}

