import fetch, {Headers, Request, Response} from 'node-fetch';

export {Headers, Request, Response};

/**
 * Reports an error when fetching a URL
 * @param {String} message the error message for the error
 * @param {Response} response the result of the fetch request
 */
export class FetchError extends Error {
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

/**
 * Performs a fetch on the API
 * @async
 * @param {String} path the path to load from the API
 * @param {Object} options the options to pass to the request
 * @throws {FetchError} when the fetching of the URL fails with a error status code
 * @returns {Promise<string>} the returned JSON from the server
 */
export default async function(path, options) {
  const response = await fetch(`${location.origin}${path}`, options);

  const contentType = response.headers.get('content-type');
  if (contentType !== 'application/json') {
    throw new FetchError(`The returned content type was invalid: ${contentType}`, response);
  }

  if (!response.ok) {
    const json = await response.json();
    const {error} = json;
    throw new FetchError(error, response);
  }

  const json = await response.json();

  return json;
}
