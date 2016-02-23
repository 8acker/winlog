"use strict";

var winston = require('winston');
var extend = require('extend-fn');
var _wrapper = require('./lib/cluster.wrapper');

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

module.exports = function(options) {

    options = options ? options : {};

    var winston_options = extend(default_options.winston, options.winston);
    var _logger = new (winston.Logger)(winston_options);

    var winston_daily_rotate_options = extend(default_options.daily_rotate, options.daily_rotate);
    _logger.add(require('winston-daily-rotate-file'), winston_daily_rotate_options);

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

    _logger._wrap = function(msg) {
        return _wrapper(msg);
    };

    process.on('uncaughtException', function (err) {
        _logger._error(err.stack);
        process.exit();
    });

    return _logger;
};