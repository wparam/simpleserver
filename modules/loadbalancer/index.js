'use strict';

var manager = require('./lib/datasourcemanager');

module.exports = manager;
module.exports.monitor = require('./lib/monitor')(manager);