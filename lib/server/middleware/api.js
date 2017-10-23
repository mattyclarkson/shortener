import Database from '../Database.js';
import HttpError from './HttpError.js';

/**
 * Exposes an API that allows URL shortening
 * @returns {Function} a middleware function that can handle HTTP requests
 */
export default function(database) {
  if (!(database instanceof (Database))) {
    throw new TypeError(`Must provide a database to the middleware API: ${database}`);
  }

  async function get(request) {
    const url = new URL(`http://localhost${request.url}`);
    const {pathname} = url;
    const identifier = pathname.substr(1);

    if (!identifier) {
      const options = {};
      const amount = parseInt(url.searchParams.get('amount'));
      const page = parseInt(url.searchParams.get('page'));
      if (!isNaN(amount)) {
        options.amount = amount;
      }
      if (!isNaN(page)) {
        options.page = page;
      }
      return await database.query(options);
    }

    try {
      return await database.get(identifier);
    } catch (err) {
      if (err instanceof RangeError) {
        throw new HttpError(404, `Failed to find the shortened URL: ${identifier}`);
      }
      throw err;
    }
  }

  async function post(request) {
    const contentType = request.headers['content-type'] || 'Specify the Content-Type header';
    if (contentType !== 'application/json') {
      throw new HttpError(415, `Unsupported media type: ${contentType}`);
    }

    const promise = new Promise((resolve, reject) => {
      let json = '';

      request.on('error', reject);

      request.on('data', data => {
        json += data;

        if (json.length > 1024) {
          throw new HttpError(415, `Sent data too large: ${json.length}`);
        }
      });

      request.on('end', () => resolve(JSON.parse(json)));
    });

    const json = await promise;
    return await database.insert(json);
  }

  async function erase(request) {
    const contentType = request.headers['content-type'] || 'Specify the Content-Type header';
    if (contentType !== 'application/json') {
      throw new HttpError(415, `Unsupported media type: ${contentType}`);
    }

    const promise = new Promise((resolve, reject) => {
      let json = '';

      request.on('error', reject);

      request.on('data', data => {
        json += data;

        if (json.length > 1024) {
          throw new HttpError(415, `Sent data too large: ${json.length}`);
        }
      });

      request.on('end', () => resolve(JSON.parse(json)));
    });

    const json = await promise;
    return await database.delete(json);
  }

  async function handle(request, response) {
    const {method} = request;

    let status = 200, value = null;

    if (method === 'POST' ) {
      value = await post(request);
    } else if (method === 'DELETE' ) {
      value = await erase(request);
    } else if (method === 'GET' ) {
      value = await get(request);
    } else {
      throw new HttpError(405, `Unsupported method: ${method}`);
    }

    const {accept} = request.headers;
    if (['application/x-capnp-schema-binary', 'application/*', '*/*'].indexOf(accept) === -1) {
      throw new HttpError(406, `Invalid accept: ${accept}`);
    }

    response.writeHead(status, {'Content-Type': 'application/json'});
    response.end(JSON.stringify(value));
  }

  return function(request, response, next) {
    function basket(err) {
      if (err instanceof HttpError) {
        response.writeHead(err.status, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({error: `${err}`}));
      } else {
        response.writeHead(500, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({error: `${err.message}`}));
      }
    }

    const nothing = () => {};
    const followThrough = next || nothing;
    const catcher = next || basket;

    handle(request, response)
      .then(followThrough)
      .catch(catcher);
  }
}
