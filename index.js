"use strict";

var winston = require('winston');
var _wrapper = require('./lib/cluster.wrapper');
var _logger = new (winston.Logger)(
    {
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
    }
);

_logger.add(require('winston-daily-rotate-file'), {
    filename: 'logs/winston_',
    datePattern: 'yyyy_MM_dd.log',
    json: false,
    maxsize: 1024 * 1024 * 10
});

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

module.exports = function(winston_options, daily_rotate_options) {
    var _logger = new (winston.Logger)( winston_options ? winston_options :
        {
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
        }
    );

    _logger.add(require('winston-daily-rotate-file'), daily_rotate_options ? daily_rotate_options : {
        filename: 'logs/winston_',
        datePattern: 'yyyy_MM_dd.log',
        json: false,
        maxsize: 1024 * 1024 * 10
    });

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

    return _logger;
}();