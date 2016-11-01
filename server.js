const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

function Run(){
    var server = http.createServer((req, res)=>{
        //res.statusCode = 200;
        //res.setHeader('Content-Type', 'text/plain');
        res.end('hello, world\n');
    });

    server.listen(port, hostname, ()=>{
        console.log(`Server running at http://${hostname}:${port}/`);
    });

    server.on('connect', (req, res)=>{
        console.log('on connect');
    });

    var request = http.request({
        port: 3000,
        hostname: '127.0.0.1',
        method: 'GET'
    });
    request.on('response', (res)=>{
        console.log('hit response');
    });
    request.on('socket', ()=>{
        console.log('socket event');
    });
    request.end();
    // http.request().on('response', function(res){
    //     res.on('data', function(data){
            
    //     });
    // });
}

Run();