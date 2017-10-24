import Database from '../Database.js';
import {URL} from '../../compatibility.js';

/**
 * Provides redirection to the shortened URL entries
 * @returns {Function} a middleware function that can handle HTTP requests
 */
export default function(database) {
  if (!(database instanceof (Database))) {
    throw new TypeError(`Must provide a database to the middleware API: ${database}`);
  }

  return function(request, response, next) {
    const url = new URL(`http://localhost${request.url}`);
    const {pathname} = url;
    const identifier = pathname.replace(/^[/]+/, '');

    database.get(identifier)
      .then(entry => {
        response.writeHead(301, {'Location': entry.full});
        response.end();
      })
      .catch(err => {
        if (err instanceof RangeError) {
          next();
        } else {
          next(err);
        }
      });
  };
}
