import log from '../logger/default.js';
import {fetch, URL} from '../compatibility.js';
import FetchError from '../FetchError.js';
import EventEmitter from '../EventEmitter.js';
import Url from '../Url.js';

/**
 * Implements a client side class for the shortener API
 *
 * @class EventEmitter
 */
export default class extends EventEmitter {
  /**
   * Implements a client side class for the shortener API
   *
   * @param {Object} options the options for the class
   * @param {number} [options.maxListeners=10] the maximum number of listeners
   * @param {Object} [options.logger=Logger] a console instance to log messages to
   * @public
   */
  constructor({endpoint = `${location.origin}/api/`, maxListeners = 10, logger = log} = {}) {
    super({maxListeners, logger});

    try {
      endpoint = new URL(endpoint);
    } catch (err) {
      if (err instanceof TypeError) {
        endpoint = new URL(`${location.origin}${endpoint}`);
      } else {
        throw err;
      }
    }

    Object.defineProperties(this, {
      endpoint: {value: endpoint}
    });
  }

  /**
   * Used when outputting the class to the console
   * @returns {string} the class name
   */
  get [Symbol.toStringTag]() {
    return 'Api';
  }

  /**
   * @~english
   * Performs a fetch from the server
   * @param {string} path the path to retrieve from the server
   * @param {Object} options the options to pass to the fetch call
   * @returns {Promise<Object>} the returned JSON
   * @throw {FetchError} the request failed to return a successful response code
   */
  async fetch(path, options = {}) {
    const {body} = options;
    if (options.body) {
      options.headers = options.headers || {};
      if (options.headers['Content-Type'] !== 'application/json') {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
      }
    }

    const response = await fetch(`${this.endpoint}${path}`, options);

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

  /**
   * @~english
   * Performs the shortening of a URL
   * @param {URL|string} url the URL to shorten
   * @returns {Url} the shortened URL information
   */
  async shorten(url) {
    const data = await this.fetch('', {method: 'POST', body: (new URL(url)).toString()});
    const entry = new Url(data);
    this.emit('shorten', entry);
    return entry;
  }

  /**
   * @~english
   * Erases a stored entry on the server
   * @param {Identifier|string} identifier the identifier of the URL to remove
   * @returns {Url} the shortened URL information that was erased
   */
  async delete(identifier) {
    const data = await this.fetch('', {method: 'DELETE', body: identifier});
    const entry = new Url(data);
    this.emit('delete', entry);
    return entry;
  }

  /**
   * @~english
   * Retrieves a shortened URL entry
   * @param {Identifier|string} identifier the identifier of the URL to get
   * @returns {Url} the shortened URL information
   */
  async get(identifier) {
    const data = await this.fetch(`${identifier}`);
    return new Url(data);
  }


  /**
   * @~english
   * Retrieves a set of shortened URLs from the server
   * @param {Object} [options] the options for the query
   * @param {Integer} [amount=10] the number of entries to return
   * @param {Integer} [page=0] the page to jump to
   * @returns {Array<Url>} the result of the query
   */
  async query({amount = 10, page = 0} = {}) {
    const array = await this.fetch(`?amount=${amount}&page=${page}`);
    return array.map(data => new Url(data));
  }
}
