'use strict';

var os = require('os');

module.exports = function(datasourceManager) {

    var monitor = {};

    monitor.name = 'uptime';

    monitor.report = function() {
        var executionTimes = datasourceManager.executionTimes();
        var nonHealthy = [];
        var status = {}
        for(var key in executionTimes){
            if(!executionTimes[key] || executionTimes[key] < (new Date().getTime() - 60000)){
                nonHealthy.push(key);
            }
            status[key] = datasourceManager.getStatus(key);

        }
        return {
            lastExecutionTimes: datasourceManager.executionTimes(),
            healthy: nonHealthy.length == 0,
            errors: nonHealthy,
            status: status
        };
    };
    return monitor;
};