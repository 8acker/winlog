"use strict";

var winston = require('winston');
var _wrapper = require('./lib/cluster.wrapper');
var _ = require('lodash');

var default_winston_options = {
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
};

var default_daily_rotate_options = {
    filename: 'logs/winston_',
    datePattern: 'yyyy_MM_dd.log',
    json: false,
    maxsize: 1024 * 1024 * 10
};

module.exports = function(winston_options, daily_rotate_options) {
    var _logger = new (winston.Logger)(_.assign(default_winston_options, winston_options));

    _logger.add(require('winston-daily-rotate-file'), _.assign(default_daily_rotate_options, daily_rotate_options));

    _logger._debug = function (msg) {
        _logger.debug(_wrapper(msg));
    };
    _logger._info = function (msg) {
        _logger.info(_wrapper(msg));
    };

    _logger._warn = function (msg) {
        _logger.warn(_wrapper(msg));
    };

    _logger._error = function (msg) {
        _logger.error(_wrapper(msg));
    };

    process.on('uncaughtException', function (err) {
        _logger.error(_wrapper(err.stack));
        process.exit();
    });

    _logger._wrap = function(msg) {
        return _wrapper(msg);
    };

    return _logger;
}();