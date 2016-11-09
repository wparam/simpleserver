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

    var request = http.request({
        port: port,
        hostname: hostname,
        method: 'GET'
    });
    request.on('response', (res)=>{
        console.log('hit response');
    });
    //request.write('A', 'utf8')
    request.end();
    // http.request().on('response', function(res){
    //     res.on('data', function(data){
            
    //     });
    // });
}

Run();