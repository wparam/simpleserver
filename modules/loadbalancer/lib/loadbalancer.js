'use strict';

var http = require('http'),
    async = require('async'),
    winston = require('winston'),
    os = require('os'),
    HashMap = require('hashmap').HashMap;

var LoadBalancer = function () {

    var lastRun;
    var serverList = {};
    var identifierList = new HashMap();
    var workingList = [];
    var timeout = 10000;
    var endpoint;

    /**
     * Preferably use the UserId to get one of the online servers.
     *
     * @param id
     * @returns {*}
     */
    this.getServerForId = function (id) {
        if (workingList.length === 0)
            throw new Error('LoadBalancerError, Working server list is empty!');

        if (!identifierList.has(id)) {
            identifierList.set(id, {count: identifierList.count()});//every user gets a unique id associated
        }
        if (identifierList.get(id).host && serverList[identifierList.get(id).host].working) {
            return identifierList.get(id).host;
        }

        identifierList.get(id).host = workingList[identifierList.get(id).count % workingList.length];
        return identifierList.get(id).host;
    };

    this.getServers = function () {
        if (workingList.length === 0)
            throw new Error('LoadBalancerError, Working server list is empty!');
        
        return workingList;
    };

    /**
     * Add a server to the current list of servers to be checked if its online.
     * If the server is found to be online during the next check it will be returned as one
     * of the proxy data providers.
     *
     * @param server
     * @param endpoint
     */
    this.addServer = function (server, endpoint) {
        if (!serverList[server]) {
            serverList[server] = {endpoint: endpoint, working: false};
        } else {

        }
    };

    /**
     * Use this method to check if a server is already queried in
     * this load balancer instance.
     *
     * @param server
     */
    this.contains = function (server) {
        return serverList[server] !== undefined && serverList[server] !== null;
    };

    /**
     * Use this method to remove servers from the current list.
     * The removal is not immediate and can take up to 'timeout' milliseconds.
     * @param server
     */
    this.remove = function (server) {
        if (serverList[server]) {
            delete serverList[server];
        }

        for (var index = 0; index < workingList.length; index++) {
            workingList.splice(index, 1);
        }
    };

    /**
     * Returns a list of all servers that are currently managed by this balancer.
     * The keys are the host addresses.
     * @returns {{}}
     */
    this.getServerList = function () {
        return serverList;
    };

    /**
     * Clears all stored servers!
     */
    this.clear = function () {
        serverList = {};
        workingList = [];
        identifierList = new HashMap();
    };

    /**
     * Returns the last timestamp when this balancer checked the health of its servers!
     * @returns {*}
     */
    this.getLastRun = function () {
        return lastRun;
    };

    this.setLastRun = function (timestamp) {
        lastRun = timestamp;
    }

    this.getWorkingList = function () {
        return this.workingList;
    };


    this.setWorkingList = function (newWorkingList) {
        workingList = newWorkingList;
        var workingListHash = {}
        for (var key in workingList) {
            var object = workingList[key];
            workingListHash[object] = true;
            if(serverList[object])
                serverList[object].working = true;
        }
        for(var key in serverList){
            if(!workingListHash[key])
                serverList[key].working = false;
            serverList[key].lastCheck = lastRun;
        }
    };

    //in a clustered node environment this needs to connect to
    //the node process that checks for working instances
    //TODO: make this method private
    this.checkServersThread = function (id, managerCallback) {
        if (lastRun) {
            winston.debug('Running service provider check, last run was at: ' + new Date(lastRun));
        } else {
            winston.debug('Starting continouous service provider check!');
        }
        var self = this;
        lastRun = new Date().getTime();
        var localTimeout = timeout;
        var serverArray = [];
        var localServerList = serverList;

        if (serverList.length === 0) {
            winston.error('Sherpa server list is currently empty, waiting for sherpa instances to be added on: ' + os.hostname() + ' and environment: ' + (process.env.NODE_ENV || 'development'));
            setTimeout(self.checkServersThread, timeout, id, managerCallback);
        }

        for (var server in serverList) {
            serverArray.push({host: server, endpoint: serverList[server].endpoint});
        }

        async.map(serverArray, function (item, callback) {
            var url = item.host + item.endpoint;
            if (url.indexOf('http') !== 0) {
                url = 'http://' + url;
            }
            var req = http.get(url,function (res) {

            }).on('error',function (e) {
                    winston.warn('Request to endpoint ' + url + ' failed: ', e);
                    callback(null, {host: item.host, working: false});
                }).on('response',function (response) {
                    if (response.statusCode === 200) {
                        callback(null, {host: item.host, working: true});
                    } else {
                        callback(null, {host: item.host, working: false});
                    }
                }).on('clientError', function (e) {
                    winston.warn('Request to endpoint ' + url + ' failed: ', e);
                    callback(null, {host: item.host, working: false});
                });

            req.setTimeout(localTimeout, function () {
                req.abort();
                winston.warn('Had to force request time out!! finally', item);
            });


        }.bind(self), function (err, results) {
            //here we set the status of the server
            var newWorkingList = [];
            var serverList = [];
            for (var key in results) {
                var server = results[key];
                if (localServerList[server.host]) {
                    localServerList[server.host].working = server.working;
                    localServerList[server.host].lastCheck = lastRun;
                }
                if (server.working) {
                    newWorkingList.push(server.host);
                }
                serverList.push(server.host);
            }
            workingList = newWorkingList;

            console.log('Finish running service check, available services number is :' + workingList.length);

            managerCallback(id, newWorkingList);

            if (workingList.length === 0) {
                winston.error('Working server list for ' + os.hostname() +
                    ' is empty, none of the following sherpa servers is available: ', serverList);
            }
            setTimeout(this.checkServersThread.bind(this), localTimeout, id, managerCallback);
        }.bind(self));
    };

    /**
     * Starts the continouous server checks.
     */
    this.start = function (balancer, cb) {
        winston.info('Starting Loadbalancer with the following servers: ', JSON.stringify(this.getServerList()));
        this.checkServersThread(balancer, cb);
    };


    this.getStatus = function () {
        return serverList;
    }


};

module.exports = LoadBalancer;