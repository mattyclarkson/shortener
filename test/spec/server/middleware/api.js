import fetch from '../../../fetch.js';

describe('server', () => {
  describe('middleware', () => {
    describe('api', () => {
      before(function() {
        this.send = function(url, data, {method=null, headers={'Content-Type': 'application/json'}} = {}) {
          method = method || this.test.parent.title;
          const body = JSON.stringify(data);
          return fetch(url, {method, body, headers});
        };

        return fetch('').catch(err => {
          if (err.response.status === 501) {
            this.skip();
          }
        });
      });

      it('correctly reports not found identifiers', () => {
        return fetch('/ade').catch(err => err.should.be.an('FetchError').and.to.have.property('status', 404));
      });

      describe('POST', () => {
        it('can add a entry', async function() {
          const data = 'https://developer.mozilla.org/';
          const entry = await this.send('', data);
          entry.should.have.property('full').that.equals(data);
          return await this.send('', entry.identifier, {method: 'DELETE'});
        });
      });

      describe('GET', () => {
        beforeEach(async function() {
          try {
            const data = 'https://developer.mozilla.org/';
            const entry = await this.send('', data, {method: 'POST'});
            const deleted = await this.send('', entry.identifier, {method: 'DELETE'});
            entry.should.deep.equal(deleted);
            this.entry = await this.send('', data, {method: 'POST'});
          } catch (err) {
            this.skip();
          }
        });

        afterEach(async function() {
          const {entry} = this;
          if (entry) {
            return await this.send('', entry.identifier, {method: 'DELETE'});
          }
        });

        it('rejects an invalid accept header', async function() {
          const headers = {'Accept': ''};
          try {
            await fetch(`/${this.entry.identifier}`, headers);
          } catch (err) {
            err.should.be.an('FetchError').and.to.have.property('status', 406);
          }
        });

        it('can retrieve the list of shortened URLs', () => {
          return fetch(``).then(response => response.should.be.a('array').that.have.lengthOf(1));
        });

        it('can retrieve the inserted identifier', async function() {
          const entry = await fetch(`/${this.entry.identifier}`);
          entry.should.deep.equal(this.entry);
        });
      });

      describe('DELETE', () => {
        beforeEach(async function() {
          try {
            const data = 'https://developer.mozilla.org/';
            this.entry = await this.send('', data, {method: 'POST'});
          } catch (err) {
            this.skip();
          }
        });

        it('can insert and delete and entry', async function() {
          const data = 'https://developer.mozilla.org/';
          const entry = await this.send('', data, {method: 'POST'});
          const deleted = await this.send('', entry.identifier);
          entry.should.deep.equal(deleted);
        });
      });
    });
  });
});
