import Database from '../Database.js';
import Identifier from '../../Identifier.js';
import Url from '../../Url.js';

/**
 * Implements an inmemory JSON database. This should only be used for testing and **not** in production!
 */
export default class extends Database {
  constructor() {
    super();
    Object.defineProperties(this, {
      data: {value:  null, writable: true},
      id: {value: 0, writable: true}
    });
  }

  /**
   * Used when outputting the class to the console
   * @returns {string} the class name
   */
  get [Symbol.toStringTag]() {
    return 'Memory';
  }

  /**
   * Creates the database and performs any necessary migrations needed
   * @returns {Promise<>} when the operation completes
   */
  create() {
    this.data = this.data || new Map();
    this.id = 0;
    return Promise.resolve();
  }

  /**
   * Clears out all entries in the database
   * @returns {Promise<>} when the operation completes
   */
  clear() {
    this.data = new Map();
    this.id = 0;
    return Promise.resolve();
  }

  /**
   * Inserts a URL into the database
   * @param {URL|string} url the url to insert into the database and shorten into a identifier
   * @returns {Promise<Url>} the newly created entry in the database
   */
  insert(url) {
    const id = ++this.id;
    const identifier = new Identifier(id);
    const data = new Url({full: url, identifier, clicks: 0});
    this.data.set(id, data);

    /**
    * Inserted event
    *
    * @event insert
    * @type {Url}
    */
    this.emit('insert', data);
    return Promise.resolve(data);
  }

  /**
   * Finds an entry in the database
   * @param {Identifier} identifier the entry to lookup
   * @returns {Promise<Url>} the found entry
   * @throws {RangeError} raised when the entry cannot be found
   */
  get(identifier) {
    if (!(identifier instanceof Identifier)) {
      identifier = new Identifier(identifier);
    }

    const entry = this.data.get(identifier.id);

    if (!entry) {
      return Promise.reject(new RangeError(`Failed to find entry: ${identifier}`));
    }

    return Promise.resolve(entry);
  }

  /**
   * Retrieves a certain amount of entries
   * @param {Object} [options] the options for the query
   * @param {Integer} [amount=10] the number of entries to return
   * @param {Integer} [page=0] the page to jump to
   * @returns {Promise<Array<Promise<Url>>} the entries
   */
  async query({amount=10, page=0} = {}) {
    const self = this;
    function* skip(size) {
      let end = 1 + size - (amount * page);
      let start = end - amount - 1;
      for (const entry of self) {
        if (--start < 0) {
          yield entry;
        }
        if (!--end) {
          break;
        }
      }
    }
    const size = await this.size;
    return Promise.all(Array.from(skip(size)));
  }

  /**
   * Retrieves the number of entries in the database
   */
  get size() {
    return Promise.resolve(this.data.size);
  }

  /**
   * Erases an entry in the database
   * @param {Identifier} identifier the entry to lookup
   * @returns {Promise<Url>} the deleted entry
   * @throws {RangeError} raised when the entry cannot be found
   */
  async delete(identifier) {
    const entry = await this.get(identifier);

    this.data.delete(entry.identifier.id);

    /**
    * Deleted event
    *
    * @event delete
    * @type {Url}
    */
    this.emit('delete', entry);

    return entry;
  }

  /**
   * Iterates through the entries in the database
   * @returns {Promise<Url>} the entry
   */
  *[Symbol.iterator]() {
    for (const [_, entry] of this.data) {  // eslint-disable-line no-unused-vars
      yield Promise.resolve(entry);
    }
  }
}
