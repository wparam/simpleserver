const http = require('http');

const hostname = '127.0.0.1';
const port = 4000;

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

    server.on('request', (req, res)=>{
        console.log('there is a new request');
        req.on('readable', ()=>{
            console.log('hit readable');
        });
        req.on('data', (chunk)=>{
            console.log('received data from request');
            console.log(chunk);
        });
        req.on('end', ()=>{
            console.log('request ended');
        });
    });

    var request = http.request({
        port: port,
        hostname: hostname,
        method: 'GET'
    });
    request.on('response', (res)=>{
        console.log('hit response');
        res.on('data', (chunk)=>{
            console.log('got data from server');
            console.log(chunk.length);
            console.log(chunk.toString());
        });
    });
    
    request.write('A', 'utf8')
    request.end('ABCDE');
    // http.request().on('response', function(res){
    //     res.on('data', function(data){
            
    //     });
    // });
}

Run();