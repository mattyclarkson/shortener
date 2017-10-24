let URL = null;

/**
 * Sets the WHATWG URL class for this library
 * @param {class} [cls=URL] the class to use for parsing URLs
 */
export function setUrl(cls=URL) {
  URL = cls;
}

try {
  setUrl();
} catch (err) {
  if (!(err instanceof ReferenceError)) {
    throw err;
  }
}

export {URL};
