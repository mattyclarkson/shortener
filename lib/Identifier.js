/**
 * The base that is used for the conversion of identifing numbers to string
 */
const base = 32;

/**
 * Performs the encoding of a identifing Number
 * @param {Integer} id the ID to encode
 * @returns {string} the encoded string
 */
export function encode(id) {
  if (!Number.isInteger(id)) {
    throw new TypeError(`The identifier ID must be be a integer: ${id}`);
  }

  return id.toString(base);
}

/**
 * Performs the decoding of a identifing Number
 * @param {string} id the ID to decode
 * @returns {Integer} the decoded ID
 */
export function decode(id) {
  return parseInt(id.toString(), base);
}

/**
 * A database identifier that is essentially a unique integer in the database. It can convert itself nicely into a
 * human readable string
 * @param {Integer|string} id the identifing number for this URL entry
 */
export default class {
  constructor(id) {
    if (!Number.isInteger(+id)) {
      id = decode(id);
    }
    Object.defineProperties(this, {
      id: {value: +id}
    })
  }

  /**
   * Encodes the identifier
   * @returns {string} the encoded ID number
   */
  encode() {
    return encode(this.id);
  }

  /**
   * Implements the `toString` interface
   * @returns {string} the encoded ID number
   */
  toString() {
    return this.encode();
  }

  /**
   * Implements the `toJSON` interface
   * @returns {string} the encoded ID number
   */
  toJSON() {
    return this.toString();
  }

  /**
   * When the class needs to be converted to a primitive value
   * @param {String} hint the type we are expected to convert to
   * @returns {Integer} the value of the identifier
   */
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') {
      return this.id;
    }

    return this.toString();
  }

  /**
   * Used when outputting the class to the console
   * @returns {string} the class name
   */
  get [Symbol.toStringTag]() {
    return 'Identifier';
  }
}
