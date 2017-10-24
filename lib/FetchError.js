/**
 * Reports an error when fetching a URL
 * @param {String} message the error message for the error
 * @param {Response} response the result of the fetch request
 */
export default class extends Error {
  constructor(message, response) {
    super(message);
    Object.defineProperties(this, {
      name: {value: 'FetchError'},
      response: {value: response},
      status: {value: response.status},
      url: {value: response.url}
    });
  }

  /**
   * Used when outputting the class to the console
   * @returns {string} the class name
   */
  get [Symbol.toStringTag]() {
    return 'FetchError';
  }
}
