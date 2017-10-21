import log from './logger/default.js';

/**
 * A weak map of data for the event emitter to prevent circular references when creating callbacks that need to operate
 * back onto the event emitter
 */
const weakMap = new WeakMap();

/**
 * Implements the Node `EventEmitter` API in ES2017
 *
 * @class EventEmitter
 */
export default class {
  /**
   * Implements the Node EventEmitter API
   *
   * @param {Object} options the options for the function
   * @param {number} [options.maxListeners=10] the maximum number of listeners
   * @param {Object} [options.logger=Logger] a console instance to log messages to
   * @public
   */
  constructor({maxListeners = 10, logger = log} = {}) {
    weakMap.set(this, {maxListeners, console: logger, callbacks: new Map()});
  }

  /**
   * Used when outputting the class to the console
   * @returns {string} the class name
   */
  get [Symbol.toStringTag]() {
    return 'EventEmitter';
  }

  /**
   * The list of callbacks assigned to this event listener
   * @private
   */
  get _callbacks() {
    const data = weakMap.get(this);
    if (data) {
      return data.callbacks;
    } else {
      return new Map();
    }
  }

  /**
   * The maximum number of listeners allowed on the event emitter
   * @private
   */
  get _maxListeners() {
    const data = weakMap.get(this);
    if (data) {
      return data.maxListeners;
    } else {
      return 10;
    }
  }

  /**
   * The console to use to create warning messages
   * @private
   */
  get _console() {
    const data = weakMap.get(this);
    if (data) {
      return data.console;
    } else {
      return console;
    }
  }

  /**
   * Adds a callback to the event emitter
   * @param {string} name the event name to fire
   * @param {Function} callback the function to invoke. The arguments passed with depend on the event
   * @example
   * const emitter = new EventEmitter();
   * emitter.on('resolved', (node, id) => {
   *   console.log(node, id);
   * });
   * @public
   */
  on(name, callback) {
    let callbacks = this._callbacks.get(name);

    if (!callbacks) {
      callbacks = new Set([callback]);
      this._callbacks.set(name, callbacks);
    } else if (callbacks.has(callback)) {
      this._console.warn(`Event '${name}' already has the callback registered`);
    } else {
      callbacks.add(callback);
    }

    if (callbacks.size > this._maxListeners) {
      this._console.warn(`Max listeners (${this._maxListeners}) for event '${name}' have been reached`);
    }
  }

  /**
   * Removes a single listener or all listeners of an event
   * @param {string} name the event name to operate on
   * @param {Function} [callback=null] the function to remove, leave blank to remove all listeners
   * @example
   * const emitter = new EventEmitter();
   * emitter.on('resolved', callback1);
   * emitter.on('resolved', callback2);
   * emitter.off('resolved', callback1);
   * emitter.off('resolved');
   * @public
   */
  off (name, callback = null) {
    if (!callback) {
      this._callbacks.delete(name);
    } else {
      const callbacks = this._callbacks.get(name);
      if (callbacks) {
        callbacks.delete(callback);
      }
    }
  }

  /**
   * Invoke the listeners for an event
   * @param {string} name the event name to operate on
   * @param {...Object} args the arguments to invoke the callback with
   * @example
   * const emitter = new EventEmitter();
   * emitter.on('test', console.log);
   * emitter.emit('test', 1, 2, 3);  // -> 1, 2, 3
   * emitter.off('test');
   * emitter.emit('test', 1, 2, 3);  // -> no logging
   * @public
   */
  emit(name, ...args) {
    const callbacks = this._callbacks.get(name);
    if (callbacks) {
      for (const callback of callbacks) {
        callback(...args);
      }
    }
  }

  /**
   * Attaches a callback for only one emitted event
   * @param {string} name the event name to operate on
   * @param {Function} [callback=null] the functionto invoke only once
   * @example
   * const emitter = new EventEmitter();
   * emitter.once('test', callback);
   * emitter.emit('test', 1, 2, 3);  // -> 1, 2, 3
   * emitter.emit('test', 1, 2, 3);  // Nothing
   * @public
   */
  once(name, callback) {
    const once = (...args) => {
      this.off(name, once);
      callback(...args);
    };
    this.on(name, once);
  }
}
