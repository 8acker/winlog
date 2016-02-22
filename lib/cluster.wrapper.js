"use strict";

var cluster = require('cluster');

module.exports = function (msg) {
    if (cluster.worker) {
        return 'cluster[' + cluster.worker.id + ']: ' + msg;
    }

    return msg;
};