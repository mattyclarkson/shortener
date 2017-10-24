import Api from '../../../lib/client/Api.js';

describe('client', () => {
  describe('Api', () => {
    before(function() {
      this.api = new Api({endpoint: ''});

      return this.api.query().catch(err => {
        if (err.response.status === 501) {
          this.skip();
        }
      });
    });

    beforeEach(async function() {
      this.entry = await this.api.shorten('https://stackoverflow.com');
    });

    afterEach(function() {
      return this.api.delete(this.entry.identifier);
    });

    it('raises a shorten event', async function() {
      const promise = new Promise(resolve => {
        this.api.on('shorten', value => resolve(value));
      });
      const entry = await this.api.shorten('https://stackoverflow.com');
      const value = await promise;
      value.should.equal(entry);
      const deleted = await this.api.delete(entry.identifier);
      deleted.should.deep.equal(entry);
    });

    it('can query the API', async function() {
      const array = await this.api.query();
      array.should.be.an('array').and.be.have.lengthOf(1);
    });

    it('can retrieve an entry from the API', async function() {
      const entry = await this.api.get(this.entry.identifier);
      entry.should.be.deep.equal(this.entry);
    });
  });
});
