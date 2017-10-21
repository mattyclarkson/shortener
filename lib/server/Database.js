import EventEmitter from '../EventEmitter.js';

/**
 * Provides the interface for database operations
 */
export default class extends EventEmitter {
  /**
   * Used when outputting the class to the console
   * @returns {string} the class name
   */
  get [Symbol.toStringTag]() {
    return 'Database';
  }
}
