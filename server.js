const http = require('http');

const hostname = '127.0.0.1';
const port = 4000;

function Run(){
    var server = http.createServer((req, res)=>{
        req.on('data', (chunk)=>{
            console.log('received data from request');
            console.log(chunk.toString('utf8'));
        });
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('MyHeader', 'newValue');
        res.writeHead(200, {'MyHeader': 'oldValue'});
        res.end('hello, world\n');
    });

    server.listen(port, hostname, ()=>{
        console.log(`Server running at http://${hostname}:${port}/`);
    });

    server.on('connect', (req, res)=>{
        // console.log('on connect');
    });

    server.on('request', (req, res)=>{
        console.log('in 2nd request event');
        req.on('readable', ()=>{
            // console.log('hit readable');
        });
        req.on('data', (chunk)=>{
            console.log('received data from request');
            console.log(chunk.toString('utf8'));
        });
        req.on('end', ()=>{
            // console.log('request ended');
        });
    });

    var request = http.request({
        port: port,
        hostname: hostname,
        method: 'GET'
    });
    request.on('response', (res)=>{
        res.on('data', (chunk)=>{
            // console.log('request got response');
            // console.log(chunk.toString('utf8'));
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