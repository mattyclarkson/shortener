import Database from '../Database.js';
import Identifier from '../../Identifier.js';
import Url from '../../Url.js';
import mysql from 'mysql';

/**
 * Communicates with an SQL database
 */
export default class extends Database {
  constructor({host='localhost', port=3306, user, password}) {
    super();
    const connection = mysql.createConnection({host, user, password, port});
    Object.defineProperties(this, {
      connection: {value: connection}
    });
  }

  /**
   * Used when outputting the class to the console
   * @returns {string} the class name
   */
  get [Symbol.toStringTag]() {
    return 'MySql';
  }

  /**
   * Creates the database and performs any necessary migrations needed
   * @returns {Promise<>} when the operation completes
   */
  create() {
    return new Promise((resolve, reject) => {
      this.connection.connect(err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
