var httpProxy = require('http-proxy');
var url = require('url');
var extend = require('util')._extend;

/**
 * Export the proxy "Server" as the main export.
 */
module.exports = {};

/**
 * Creates the proxy server.
 *
 * Examples:
 *
 *    httpProxy.createProxyServer({ .. }, 8000)
 *    // => '{ web: [Function], ws: [Function] ... }'
 *
 * @param {Object} Options Config object passed to the proxy
 *
 * @return {Object} Proxy Proxy object with handlers for `ws` and `web` requests
 *
 * @api public
 */

function urlJoin() {
    //
    // We do not want to mess with the query string. All we want to touch is the path.
    //
    var args = Array.prototype.slice.call(arguments),
        lastIndex = args.length - 1,
        last = args[lastIndex],
        lastSegs = last.split('?'),
        retSegs;

    args[lastIndex] = lastSegs.shift();

    //
    // Join all strings, but remove empty strings so we don't get extra slashes from
    // joining e.g. ['', 'am']
    //
    retSegs = [
        args.filter(Boolean).join('/').replace(/\/+/g, '/').replace(/:\//g, '://')
    ];

    // Only join the query string if it exists so we don't have trailing a '?'
    // on every request

    // Handle case where there could be multiple ? in the URL.
    retSegs.push.apply(retSegs, lastSegs);

    return retSegs.join('?')
};


module.exports.createProxyServer = function createProxyServer(options) {
    /*
     *  `options` is needed and it must have the following layout:
     *
     *  {
     *    target : <url string to be parsed with the url module>
     *    forward: <url string to be parsed with the url module>
     *    agent  : <object to be passed to http(s).request>
     *    ssl    : <object to be passed to https.createServer()>
     *    ws     : <true/false, if you want to proxy websockets>
     *    xfwd   : <true/false, adds x-forward headers>
     *    secure : <true/false, verify SSL certificate>
     *    toProxy: <true/false, explicitly specify if we are proxying to another proxy>
     *    prependPath: <true/false, Default: true - specify whether you want to prepend the target's path to the proxy path>
     *    localAddress : <Local interface string to bind for outgoing connections>
     *    changeOrigin: <true/false, Default: false - changes the origin of the host header to the target URL>
     *    auth   : Basic authentication i.e. 'user:password' to compute an Authorization header.
     *    hostRewrite: rewrites the location hostname on (301/302/307/308) redirects, Default: null.
     *  }
     *
     *  NOTE: `options.ws` and `options.ssl` are optional.
     *    `options.target and `options.forward` cannot be
     *    both missing
     *  }
     */

    var proxy = httpProxy.createProxyServer(options);
    proxy.on('start', function(req, res, target){

        if (options.overwrites) {
            for (key in options.overwrites) {
                req.headers[key] = options.overwrites[key];
                if(req.query)
                    req.query[key] = options.overwrites[key];
            }
        }

        var outgoingPath = !options.toProxy ? url.parse(req.url).path : req.url;
        outgoingPath = options.removeFirst ? outgoingPath.substring(options.removeFirst.length) : outgoingPath;
        req.url = urlJoin(target.path, outgoingPath);
    });

    proxy.on('open', function (proxySocket) {
        // listen for messages coming FROM the target here
    });


    proxy.on('error', function (err, req, res) {
        res.writeHead(500, {
            'Content-Type': 'text/plain'
        });

        res.end('Something went wrong! Please check the logs to further debug the issue.');
    });

    return proxy;
};

