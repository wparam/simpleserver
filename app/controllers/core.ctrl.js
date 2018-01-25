const sherpa = require('../../modules/sherpa-proxy');
const loadbalancer = require('../../modules/loadbalancer');
const proxy = sherpa.createProxyServer({removeFirst: '/sherpa'});
const chalk = require('chalk');
const http = require('http');
const master = chalk.green;
const clu = chalk.yellow;

const port = 3001;
const zlib = require('zlib');

const handleProxy = (req, res)=>{
    var url = req.url;
    var balancerId = '1sherpa';
    var userId= req.query.user;
    var server = loadbalancer.serverForUser(balancerId, userId);
    var servers = loadbalancer.activeServerList(balancerId);
    if(req.method === 'POST'){
    }
    var ps = [];
    if(req.headers["server-target"]){
        server = req.headers["server-target"];
        proxy.web(req, res, {target: server + '/v1/data'}, function(err, req, res, target){
            console.log(clu('This is error in proxy'));
            console.log(clu(err));
        });
    }else{
        for(var i = 1, l=servers.length; i<l; i++){
            ps.push(this.syncRequest(req, res, servers[i]));
        }
    
        Promise.all(ps).then((data) => {
            console.log(data);
            console.log(clu('Send request from server for browser: ' + servers[0]));
            proxy.web(req, res, {target: servers[0] + '/v1/data'}, function(err, req, res, target){
                console.log(clu(err));
            });
            // console.log(data);
            // for(var i=0, l=data.length; i<l; i++){
            //     console.log(data[i]);
            // }
        }).catch((err)=>{
            console.log('Promise error: ');
            console.log(err);
        });
        return;
    }
}
const syncRequest = (req, res, server)=>{
    var opt = {
        host: req.hostname,
        port: port,
        path: req.url,
        headers: Object.assign({}, req.headers, {"server-target": server} ),
        method: req.method,
        agent: false
    };
    return new Promise((resolve, reject) => {
        var connect = (req.protocol == 'http' ? http : https).request(opt, (response)=>{
            if(response.statusCode<200 || response.statusCode >= 400){
                reject(new Error("Fail to load page, status code: " + response.statusCode));
            }
            let gzip = zlib.createGunzip();
            let stream = response;
            console.log(response.headers['content-encoding']);
            if(response.headers['content-encoding'] && response.headers['content-encoding'].toLowerCase().indexOf('gzip') >-1){
                response.pipe(gzip);
                stream = gzip;
            }
            var body = [];
            stream.on('data', (chunk)=>{
                body.push(chunk.toString('utf8'));
            });
            stream.on('end', ()=>{
                // resolve(body.join(''));
                resolve(response.statusCode);
            });
        });
        connect.on('error', (err)=>{
            console.log('error on request');
            reject(err);
        });
        connect.end();
    });
}



exports.handleProxy = handleProxy;

exports.syncRequest = syncRequest;