import {NONE, ERROR, WARN, INFO, DEBUG} from '../../lib/logger/level.js';
import Logger from '../../lib/Logger.js';
import Console from '../Console.js';

describe('Logger', () => {
  beforeEach(function() {
    this.console = new Console();
    this.logger = new Logger({console: this.console});
  });

  describe('levels', () => {
    describe('NONE', function() {
      beforeEach(function() {
        this.logger.level = NONE;
      });

      it('should not honour the ERROR logging level', function() {
        const msg = 'test';
        this.logger.error(msg);
        this.console.buffer.should.be.empty;
      });

      it('should not honour the WARN logging level', function() {
        const msg = 'test';
        this.logger.warn(msg);
        this.console.buffer.should.be.empty;
      });

      it('should not honour the INFO logging level', function() {
        const msg = 'test';
        this.logger.info(msg);
        this.console.buffer.should.be.empty;
      });

      it('should not honour the DEBUG logging level', function() {
        const msg = 'test';
        this.logger.debug(msg);
        this.console.buffer.should.be.empty;
      });
    });

    describe('ERROR', function() {
      beforeEach(function() {
        this.logger.level = ERROR;
      });

      it('should honour the ERROR logging level', function() {
        const msg = 'test';
        this.logger.error(msg);
        this.console.buffer.should.equal(`error: ${msg}`);
      });

      it('should not honour the WARN logging level', function() {
        const msg = 'test';
        this.logger.warn(msg);
        this.console.buffer.should.be.empty;
      });

      it('should not honour the INFO logging level', function() {
        const msg = 'test';
        this.logger.info(msg);
        this.console.buffer.should.be.empty;
      });

      it('should not honour the DEBUG logging level', function() {
        const msg = 'test';
        this.logger.debug(msg);
        this.console.buffer.should.be.empty;
      });
    });

    describe('WARN', function() {
      beforeEach(function() {
        this.logger.level = WARN;
      });

      it('should honour the ERROR logging level', function() {
        const msg = 'test';
        this.logger.error(msg);
        this.console.buffer.should.equal(`error: ${msg}`);
      });

      it('should honour the WARN logging level', function() {
        const msg = 'test';
        this.logger.warn(msg);
        this.console.buffer.should.equal(`warn: ${msg}`);
      });

      it('should not honour the INFO logging level', function() {
        const msg = 'test';
        this.logger.info(msg);
        this.console.buffer.should.be.empty;
      });

      it('should not honour the DEBUG logging level', function() {
        const msg = 'test';
        this.logger.debug(msg);
        this.console.buffer.should.be.empty;
      });
    });

    describe('INFO', function() {
      beforeEach(function() {
        this.logger.level = INFO;
      });

      it('should honour the ERROR logging level', function() {
        const msg = 'test';
        this.logger.error(msg);
        this.console.buffer.should.equal(`error: ${msg}`);
      });

      it('should honour the WARN logging level', function() {
        const msg = 'test';
        this.logger.warn(msg);
        this.console.buffer.should.equal(`warn: ${msg}`);
      });

      it('should honour the INFO logging level', function() {
        const msg = 'test';
        this.logger.info(msg);
        this.console.buffer.should.equal(`info: ${msg}`);
      });

      it('should not honour the DEBUG logging level', function() {
        const msg = 'test';
        this.logger.debug(msg);
        this.console.buffer.should.be.empty;
      });
    });

    describe('DEBUG', function() {
      beforeEach(function() {
        this.logger.level = DEBUG;
      });

      it('should honour the ERROR logging level', function() {
        const msg = 'test';
        this.logger.error(msg);
        this.console.buffer.should.equal(`error: ${msg}`);
      });

      it('should honour the WARN logging level', function() {
        const msg = 'test';
        this.logger.warn(msg);
        this.console.buffer.should.equal(`warn: ${msg}`);
      });

      it('should honour the INFO logging level', function() {
        const msg = 'test';
        this.logger.info(msg);
        this.console.buffer.should.equal(`info: ${msg}`);
      });

      it('should honour the DEBUG logging level', function() {
        const msg = 'test';
        this.logger.debug(msg);
        this.console.buffer.should.equal(`debug: ${msg}`);
      });
    });
  });
});
