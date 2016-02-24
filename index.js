"use strict";

var winston = require('winston');
var extend = require('extend-fn');
var cluster = require('cluster');
var winston_daily_rotate_file = require('winston-daily-rotate-file');

var default_options = {
    winston: {
        colors: {
            debug: 'magenta',
            info: 'green',
            warning: 'yellow',
            error: 'red'
        },
        transports: [
            new winston.transports.Console(
                {
                    level: 'debug',
                    json: false,
                    colorize: true,
                    prettyPrint: true,
                    handleExceptions: true
                }
            )
        ],
        exceptionHandlers: [
            new winston.transports.File(
                {
                    filename: 'logs/winston_exception_handlers.log',
                    json: false, maxsize: 1024 * 1024 * 10
                }
            )
        ]
    },
    daily_rotate: {
        filename: 'logs/winston_',
        datePattern: 'yyyy_MM_dd.log',
        json: false,
        maxsize: 1024 * 1024 * 10
    }
};

function Logger(options) {
    var self = this;

    options = options ? options : {};

    var winston_options = extend(default_options.winston, options.winston);
    this.logger = new (winston.Logger)(winston_options);

    var winston_daily_rotate_options = extend(default_options.daily_rotate, options.daily_rotate);
    this.logger.add(winston_daily_rotate_file, winston_daily_rotate_options);

    process.on('uncaughtException', function (err) {
        self.error(err.stack);
        process.exit();
    });
}

Logger.prototype.info = function (msg) {
    this.logger.info(this.wrap(msg));
};

Logger.prototype.error = function (msg) {
    this.logger.error(this.wrap(msg));
};

Logger.prototype.debug = function (msg) {
    this.logger.debug(this.wrap(msg));
};

Logger.prototype.warn = function (msg) {
    this.logger.warn(this.wrap(msg));
};

Logger.prototype.wrap = function (msg) {
    if (cluster.worker) {
        return 'cluster[' + cluster.worker.id + ']: ' + msg;
    }
    return msg;
};

module.exports = Logger;