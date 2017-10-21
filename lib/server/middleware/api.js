/**
 * Exposes an API that allows URL shortening
 * @returns {Function} a middleware function that can handle HTTP requests
 */
export default function() {
  return function(request, response) {
    const {accept} = request.headers;
    if (['application/x-capnp-schema-binary', 'application/*', '*/*'].indexOf(accept) === -1) {
      response.writeHead(406, {'Content-Type': 'application/json'});
      response.end(JSON.stringify({error: `Invalid accept: ${accept}`}));
      return;
    }

    response.writeHead(501, {'Content-Type': 'application/json'});
    response.end(JSON.stringify({error: `No service is implemented yet 😭`}));
  }
}
