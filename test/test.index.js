var assert = require('assert');
var fs = require('fs');
var path = require('path');
var wrapper = require('./../lib/cluster.wrapper');
var logger = require('./../index')();

describe('Logger', function () {

    before(function (done) {
        this.timeout(60000);
        logger._info('logging statment: info');
        logger._error('logging statment: error');
        logger._debug('logging statment: debug');
        logger._warn('logging statment: warn');
        done();
    });

    it('#_wrap()', function () {
        assert.equal(logger._wrap('logging statment: _wrap'), 'logging statment: _wrap');
    });

    it('#_info(), #_error(), #_debug(), #_warn()', function (done) {
        this.timeout = 60000;
        var filename = 'logs/winston_' + new Date().toISOString().slice(0,10).replace(/-/g,"_") + '.log';

        fs.readFile(filename, function(error, data) {
            assert.ifError(error);
            assert.ok(data);
            fs.unlink(filename, function(error) {
                assert.ifError(error);
                done();
            });
        });
    });
});