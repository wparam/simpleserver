const http = require('http');

const hostname = '127.0.0.1';
const port = 4000;

function Run(){
    var server = http.createServer((req, res)=>{
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('MyHeader', 'newValue');
        res.writeHead(200, {'MyHeader': 'oldValue'});
        res.end('hello, world\n');
    });

    server.listen(port, hostname, ()=>{
        console.log(`Server running at http://${hostname}:${port}/`);
    });

    
    server.on('request', (req, res)=>{
        // req.on('readable', ()=>{
        //     console.log('----reqest test -------hit readable');
        // });
        // var body = '';
        // req.on('data', (chunk)=>{
        //     body += chunk;
        //     console.log('----reqest test -------received data from request');
        //     console.log(chunk.toString('utf8'));
        // });
        req.pause();
        req.on('end', ()=>{
            console.log('----reqest test -------request ended');
            console.log(arguments);
        });
    });

    /* self made mock request in sever
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

    */
}

Run();