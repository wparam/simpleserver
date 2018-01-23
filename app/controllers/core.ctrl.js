const sherpa = require('../../modules/sherpa-proxy');
const loadbalancer = require('../../modules/loadbalancer');
const proxy = sherpa.createProxyServer({removeFirst: '/sherpa'});
const chalk = require('chalk');
const http = require('http');
const master = chalk.green;
const clu = chalk.yellow;

module.exports = {
    handleProxy: (req, res) => {
        var url = req.url;
        console.log(clu(chalk.url));
        
        var balancerId = '1sherpa';
        var userId= req.query.user;
        var server = loadbalancer.serverForUser(balancerId, userId);
        var servers = loadbalancer.activeServerList(balancerId);
        if(req.method === 'POST'){

        }

        console.log(server);

        if(typeof(server)==='string' ){
            proxy.web(req, res, {target: server + '/v1/data'}, function(err, req, res, target){
                console.log(clu('This is error in proxy'));
                console.log(clu(err));
            });
    
            proxy.on('proxyRes', (proxyRes, req, res)=>{
                res.setHeader('server', server);
            });

            proxy.on('close', () => {
                console.log(clu('Proxy is closed'));
            });
        }else{
            
            for(var i = 0, l=server.length; i<l; i++){
                console.log(clu('Running server:' + server[i]));
                process.nextTick(function () {
                    proxy.web(req, res, {target: server[i] + '/v1/data'}, function(err, req, res, target){
                        console.log(clu('This is error in proxy'));
                        console.log(clu(err));
                    });
                });
                
        
                // proxy.on('proxyRes', (proxyRes, req, res)=>{
                //     res.setHeader('server', server);
                // });
            }
        }
        
    }
};