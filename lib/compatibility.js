let Url = null;

/**
 * Sets the WHATWG URL class for this library
 * @param {class} [cls=URL] the class to use for parsing URLs
 */
export function setUrl(cls=URL) {
  Url = cls;
}

try {
  setUrl();
} catch (err) {
  if (!(err instanceof ReferenceError)) {
    throw err;
  }
}

let fetcher = null;
let hdrs = null;
let req = null;
let res = null;

/**
 * Sets the WHATWG URL fetch API for this library
 * @param {function} [func=fetch] the global fetch function
 * @param {class} [headers=Headers] a collection of HTTP headers
 * @param {class} [request=Request] a request to the server
 * @param {class} [response=Response] a response from the server
 */
export function setFetch(func=fetch, headers=Headers, request=Request, response=Response) {
  fetcher = func;
  hdrs = headers;
  req = request;
  res = response;
}

try {
  setFetch();
} catch (err) {
  if (!(err instanceof ReferenceError)) {
    throw err;
  }
}

export {Url as URL, fetcher as fetch, hdrs as Headers, req as Request, res as Response};
