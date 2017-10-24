import Identifier from './Identifier.js';
import {URL} from './compatibility.js';

/**
 * Represents a shortened URL
 * @param {Object} options the values for the class
 * @param {URL|string} options.full the full URL for the class
 * @param {Identifier} options.identifier the identifier for the entry
 * @param {Integer} options.clicks the number of clicks this URL has received
 */
export default class {
  constructor({full, identifier, clicks}) {
    if (!(identifier instanceof Identifier)) {
      identifier = new Identifier(identifier);
    }

    if (!Number.isInteger(clicks)) {
      throw new TypeError(`The click count must be an Integer: ${clicks}`);
    }

    try{
      full = new URL(full);
    } catch (err) {
      if (err instanceof TypeError) {
        throw new TypeError(`Invalid URL: ${full}`);
      }
      throw err;
    }

    Object.defineProperties(this, {
      full: {value: full, enumerable: true},
      identifier: {value: identifier, enumerable: true},
      clicks: {value: clicks, enumerable: true},
    })
  }
}
