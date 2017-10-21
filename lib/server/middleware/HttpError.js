/**
 * Reports an error when fetching a URL
 * @param {String} message the error message for the error
 * @param {Response} status the HTTP status code
 */
export default class extends Error {
  constructor(status, message) {
    super(message);
    Object.defineProperties(this, {
      name: {value: 'HttpError'},
      status: {value: status}
    });
  }

  /**
   * Used when outputting the class to the console
   * @returns {string} the class name
   */
  get [Symbol.toStringTag]() {
    return 'HttpError';
  }
}
