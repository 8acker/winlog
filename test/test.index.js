var assert = require('assert');
var fs = require('fs');
var Logger = require('./../index');
var logger = new Logger();

describe('Logger', function () {

    before(function (done) {
        this.timeout(60000);
        logger.info('logging statment: info');
        logger.error('logging statment: error');
        logger.debug('logging statment: debug');
        logger.warn('logging statment: warn');
        done();
    });

    it('#wrap()', function () {
        assert.equal(logger.wrap('logging statment: #wrap()'), 'logging statment: #wrap()');
    });

    it('#info(), #error(), #debug(), #warn()', function (done) {
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