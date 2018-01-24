const sherpa = require('../../modules/sherpa-proxy');
const loadbalancer = require('../../modules/loadbalancer');
const proxy = sherpa.createProxyServer({removeFirst: '/sherpa'});
const chalk = require('chalk');
const http = require('http');
const master = chalk.green;
const clu = chalk.yellow;

const port = 3001;
const zlib = require('zlib');

const syncR = (req, res, server)=>{
    var opt = {
        host: req.hostname,
        port: port,
        path: req.url,
        headers: Object.assign({}, req.headers, {'server-target': server} ),
        method: req.method,
        agent: false
    };
    console.log(opt);
    var connect = (req.protocol == 'http' ? http : https).request(opt, (response)=>{
        if(response.statusCode<200 || response.statusCode > 299){
            // reject(new Error("Fail to load page, status code: " + response.statusCode));
            console.log(clu("Fail to load page, status code: " + response.statusCode));
        }
        var body = [];
        response.on('data', (chunk)=>{
            body.push(chunk);
        });
        response.on('end', ()=>{
            // resolve(body.join(''));
            console.log(clu('Finish succesuflly'));
        });
    });
    connect.on('error', (err)=>{
        console.log('error on request');
        // reject(err);
    });
    connect.end();
}

const handleProxy = (req, res)=>{
    var url = req.url;
    console.log(clu('+++++++++++++++++++++++++++++++++start handle proxy++++++++++++++++++++++++++++++++'));
    console.log(req.headers);
    
    var balancerId = '1sherpa';
    var userId= req.query.user;
    var server = loadbalancer.serverForUser(balancerId, userId);
    var servers = loadbalancer.activeServerList(balancerId);
    if(req.method === 'POST'){

    }

    var ps = [];
    if(req.headers["server-target"]){
        console.log(clu('Request start from server'));
        server = req.headers["server-target"];
    }else{
        console.log(clu('Client Request from browser'));
        for(var i = 0, l=servers.length; i<l; i++){
            ps.push(this.syncRequest(req, res, servers[i]));
        }
    
        console.log('PS are: ');
        console.log(ps.length);
        Promise.all(ps).then((data) => {
            console.log(data.length);
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


    // proxy.on('open', function (proxySocket) {
    //     console.log('Proxy is openeedd');
    //     // listen for messages coming FROM the target here
    //     var ck = [];
    //     proxySocket.on('data', (data) => {
    //         ck.push(data);
    //     }); 
    //     proxySocket.on('end', () => {
    //         console.log(ck.join(''));
    //     });
    // });

    // proxy.on('proxyRes', function (proxyRes, req, res) {
    //     console.log('ProxyRes, req url:' + req.url);
    // });

    proxy.on('close', () => {
        console.log(clu('Proxy is closed'));
    });

    proxy.web(req, res, {target: server + '/v1/data'}, function(err, req, res, target){
        console.log(clu('This is error in proxy'));
        console.log(clu(err));
    });
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
            var body = [],
                bodyStr = '';
            response.on('data', (chunk)=>{
                body.push(chunk);
                bodyStr += chunk.toString('utf8');
            });
            response.on('end', ()=>{
                console.log(bodyStr);
                resolve(body.join(''));
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