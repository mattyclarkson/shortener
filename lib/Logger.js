import {ERROR, WARN, INFO, DEBUG} from './logger/level.js';

const c = console;

/**
 * A logging class that can be used with most functions to provide status output
 * @param {Object} args the arguments for the class
 * @param {Object} [args.logger=console] the underlying logger that will be used to output the logging messages
 * @param {number} [args.level=logger.level.WARN] the logging level
 */
export default class {
  constructor({console=c, level=WARN} = {}) {
    Object.defineProperties(this, {
      level: {value: level, writable: true},
      console: {value: console}
    });
  }

  /**
   * Used when outputting the class to the console
   * @returns {string} the class name
   */
  get [Symbol.toStringTag]() {
    return 'Logger';
  }

  /**
   * Logs a debug message, this is usually useful to developers
   * @param {...*} args the objects to log
   */
  debug(...args) {
    if (DEBUG <= this.level) {
      this.console.debug(...args);
    }
  }

  /**
   * Logs a message that would be useful to a user
   * @param {...*} args the objects to log
   */
  info(...args) {
    if (INFO <= this.level) {
      this.console.info(...args);
    }
  }

  /**
   * Logs a recoverable error
   * @param {...*} args the objects to log
   */
  warn(...args) {
    if (WARN <= this.level) {
      this.console.warn(...args);
    }
  }

  /**
   * Logs a non-recoverable error
   * @param {...*} args the objects to log
   */
  error(...args) {
    if (ERROR <= this.level) {
      this.console.error(...args);
    }
  }
}
