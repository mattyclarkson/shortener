import EventEmitter from '../../lib/EventEmitter.js';
import Logger from '../../lib/Logger.js';
import Console from '../Console.js';

describe('EventEmitter', () => {
  beforeEach(function() {
    this.console = new Console();
    const logger = new Logger({console: this.console});
    this.maxListeners = 5;
    this.emitter = new EventEmitter({maxListeners: this.maxListeners, logger});
  });

  it('should warn on too many bindings', function() {
    const name = 'test';
    for (let i = 0; i <= this.maxListeners; ++i) {
      const callback = () => {};
      this.emitter.on(name, callback);
    }
    this.console.buffer.should.equal(
      `warn: Max listeners (${this.maxListeners}) for event '${name}' have been reached`);
  });

  it('should warn on multiple bindings', function() {
    const callback = () => {};
    const name = 'test';
    this.emitter.on(name, callback);
    this.emitter.on(name, callback);
    this.console.buffer.should.equal(`warn: Event '${name}' already has the callback registered`);
  });

  it('should respond to emitted events', function(done) {
    this.emitter.on('test', done);
    this.emitter.emit('test');
  });

  it('should respond to emitted events with an argument', function() {
    const expected = 80085;
    const promise = new Promise(resolve => {
      this.emitter.on('test', value => resolve(value));
    });
    this.emitter.emit('test', expected);
    return promise.then(result => result.should.equal(expected));
  });

  it('should respond to emitted events with multiple argument', function() {
    const sum = (running, value) => running + value;
    const params = [10, 50, 60];
    const expected = params.reduce(sum, 0);
    const promise = new Promise(resolve => {
      this.emitter.on('test', (...args) => resolve(args.reduce(sum, 0)));
    });
    this.emitter.emit('test', ...params);
    return promise.then(result => result.should.equal(expected));
  });

  it('should allow constant callbacks until turned off', function() {
    const expected = 20;
    let result = 0;
    const promise = new Promise(resolve => {
      this.emitter.on('finish', resolve);
    });
    const callback = value => result += value;
    this.emitter.on('test', callback);
    this.emitter.emit('test', 10);
    this.emitter.emit('test', 10);
    this.emitter.off('test', callback);
    this.emitter.emit('test', 10);
    this.emitter.emit('finish');
    return promise.then(() => result.should.equal(expected));
  });

  it('should remove listeners that have registerd to be called back once', function() {
    const expected = 10;
    let result = 0;
    const promise = new Promise(resolve => {
      this.emitter.on('finish', resolve);
    });
    const callback = value => result += value;
    this.emitter.once('test', callback);
    this.emitter.emit('test', 10);
    this.emitter.emit('test', 10);
    this.emitter.emit('test', 10);
    this.emitter.emit('test', 10);
    this.emitter.emit('finish');
    return promise.then(() => result.should.equal(expected));
  });
});
