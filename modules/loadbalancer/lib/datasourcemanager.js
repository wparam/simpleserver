'use strict';

var winston = require('winston'),
    cluster = require('cluster'),
    LoadBalancer = require('./loadbalancer'),
    nodeIpc = require('node-ipc');


var self = module.exports = {
    loadBalancers: {},
    ipc: nodeIpc,

    addServer: function (balancerId, server, endpoint) {
        console.log('~~~~~~~~~~~Adding Server~~~~~~~~~');
        console.log(balancerId);
        if (self.loadBalancers[balancerId] && self.loadBalancers[balancerId].contains(server)) {
            winston.warn('Trying to add existing server with configuration: ' + balancerId + ' server: ' + server);
            return;
        } else if (!self.loadBalancers[balancerId]) {
            self.loadBalancers[balancerId] = new LoadBalancer();
        }
        self.loadBalancers[balancerId].addServer(server, endpoint);
        /*
         if (cluster.isMaster) {
         console.log("EMITTING ADD SERVER LOADBALANCER")

         self.ipc.of.loadbalancer.emit('addServer', {
         id: ipc.config.id,
         server: server,
         endpoint: endpoint,
         balancer: balancerId
         }
         )
         }*/
    },

    start: function () {
        if (cluster.isMaster) {
            console.log('In Manager"s Master');
            self.ipc.config.id = 'loadbalancer';
            self.ipc.config.silent= true;
            self.ipc.serve(
                function () {
                    self.ipc.server.on(
                        'addServer',
                        function (data, socket) {
                            self.ipc.log('got a message from'.debug, (data.id).variable, (data).data);
                            console.log('DATA: ', data);

                        }
                    );
                }
            );

            for (var key in self.loadBalancers) {
                winston.info('Starting balancer with ID: ' + key);
                self.loadBalancers[key].start(key, function (id, workingList) {

                    self.ipc.server.broadcast('setWorkingList', {
                            id: self.ipc.config.id,
                            balancer: id,
                            workingList: workingList
                        }
                    )
                });
            }
            self.ipc.server.define.listen['addServer'] = 'This event type listens for message strings as value of data key.';
            self.ipc.server.start();
        } else {
            console.log('In Manager"s Cluster');
            self.ipc.config.id = 'loadbalancerClient';
            self.ipc.config.silent = true;
            self.ipc.config.retry = 1000;
            self.ipc.connectTo(
                'loadbalancer',
                function () {
                    self.ipc.of.loadbalancer.on('setWorkingList',
                        function (data) {
                            self.loadBalancers[data.balancer].setWorkingList(data.workingList);
                            self.loadBalancers[data.balancer].setLastRun(new Date().getTime());
                        }.bind(self)
                    );
                });
        }
    },

    removeServer: function (balancerId, server) {
        if (cluster.isMaster) {
            if (self.loadBalancers[balancerId]) {
                self.loadBalancers[balancerId].removeServer(server);
            } else {
                winston.error('Could not find load balancer for ID: ' + balancerId);
            }
        } else {
            console.log("EMITTING ADD SERVER LOADBALANCER");
            ipc.of.loadbalancer.emit('removeServer', {
                    id: ipc.config.id,
                    server: server,
                    balancer: balancerId
                }
            )
        }
    },

    serverForUser: function (balancerId, userId) {
        if (!self.loadBalancers[balancerId]) {
            winston.error('Missing load balancer for key: ' + balancerId + ' in keyset: ', Object.keys(self.loadBalancers));
            throw new Error('DatasourcManagerError', 'Missing load balancer for key: ' + balancerId);
        }
        return self.loadBalancers[balancerId].getServerForId(userId);
    },

    executionTimes: function () {
        var lastExecutionTimes = {};
        for (var key in self.loadBalancers) {
            lastExecutionTimes[key] = self.loadBalancers[key].getLastRun();
        }
        return lastExecutionTimes;
    },

    getStatus: function (balancerId) {
        return self.loadBalancers[balancerId].getStatus()
    }


};
