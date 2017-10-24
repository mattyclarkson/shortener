import {fetch, Headers, Request, Response} from '../lib/compatibility.js';
import FetchError from '../lib/FetchError.js';

export {Headers, Request, Response};

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
