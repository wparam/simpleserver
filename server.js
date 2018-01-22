const http = require('http');
// const mog = require('./app/mongo.js');

const hostname = '127.0.0.1';
const port = 4000;

function Run() {
    var server = http.createServer((req, res) => {
        console.log('on server handler');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('MyHeader', 'newValue');
        res.writeHead(200, { 'MyHeader': 'oldValue' });
        // mog.Query(function(doc){
        //     res.end(JSON.stringify(doc));
        //     res.end();
        // });
        res.end('hello, world\n');
    });

    server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });


    server.on('request', (req, res) => {
        console.log('on seperate handler');
        req.on('readable', () => {
            console.log('----reqest test -------hit readable');
        });
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
            console.log('----reqest test -------received data from request');
            console.log(chunk.toString('utf8'));
        });
        req.on('end', () => {
            console.log(body);
        });
    });

    /* self made mock request in sever */
    var request = http.request({
        port: port,
        hostname: hostname,
        method: 'POST'
    });
    request.on('response', (res) => {
        res.on('data', (chunk) => {
            console.log('request got response');
            console.log(chunk.toString('utf8'));
        });
        console.log(res.headers);
        console.log(res);
    });


    request.end('ABCDE');


}

function mockReq() {
    var req = http.get('http://localhost:3001/sherpa/availability/availableDate.service?clientId=1&user=test1', (res) => {
        console.log('Finish response');
    });
    var result = '';
    req.on('response', (res) => {
        res.on('data', (chunk) => {
            result += chunk.toString('utf8');
        });
        res.on('end', () => {
            console.log(result);
        });
    });
    
}

mockReq();