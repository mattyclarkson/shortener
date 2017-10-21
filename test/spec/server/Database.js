import Database from '../../../lib/server/Database.js';

describe('server', () => {
  describe('Database', () => {
    it('can be converted to a string', () => {
      const database = new Database();
      database.toString().should.equal('[object Database]');
    });
  });
});
