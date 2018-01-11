var express = require('express')
var path = require('path')
var app = express()
var router = require('./app/routers/core.router')(app)

const mockService = [
    {host: '115:60016', orgId: 1, clientId: 1, endpoint:'/a'},
    {host: '115:60016', orgId: 1, clientId: 2, endpoint:'/a'},
    {host: '115:60016', orgId: 1, clientId: 3, endpoint:'/a'},
    {host: '115:50015', orgId: 1, clientId: 4, endpoint:'/a'},
    {host: '115:50015', orgId: 1, clientId: 5, endpoint:'/a'}
];

app.set('views', './app/views');
app.set('view engine', 'pug');

app.use('/static', express.static(path.join(__dirname, 'public')));

app.listen(3001, function(){
    console.log('server is running');
});


for (var key in mockService) {
    var server = mockService[key];
    loadbalancer.addServer(server.orgId, server.host, server.endpoint);
}
loadbalancer.start();