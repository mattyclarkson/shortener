import Memory from '../../../../lib/server/database/Memory.js';

describe('server', () => {
  describe('database', () => {
    describe('Memory', () => {
      beforeEach(function() {
        this.db = new Memory();
        return this.db.create();
      });

      it('can insert a URL', function() {
        return this.db.insert('https://www.teamfortress.com');
      });

      it('can query results', async function() {
        for (let i = 0; i < 100; ++i) {
          await this.db.insert(`https://chaijs.com/${i}`);
        }
        const results = await this.db.query();
        results.length.should.equal(10);
        const sum = results.map(({full: {pathname}}) => {
          return parseInt(pathname.substr(1));
        }).reduce((sum, value) => sum + value, 0);
        sum.should.equal(945);
      });

      it('can clear all of entries', async function() {
        await this.db.insert('https://duckduckgo.com/');
        (await this.db.size).should.equal(1);
        await this.db.clear();
        (await this.db.size).should.equal(0);
      });

      it('can report the number of entries', async function() {
        await this.db.insert('https://www.mariowiki.com/Super_Mario_World');
        const {identifier} = await this.db.insert('https://www.mariowiki.com/Super_Nintendo_Entertainment_System');
        (await this.db.size).should.equal(2);
        await this.db.delete(identifier);
        (await this.db.size).should.equal(1);
      });

      it('can retrieve a URL', async function() {
        const inserted = await this.db.insert('https://www.html5rocks.com/en/');
        const retrieved = await this.db.get(inserted.identifier);
        inserted.should.deep.equal(retrieved);
        return retrieved;
      });

      it('can delete a URL', async function() {
        const inserted = await this.db.insert('https://developer.mozilla.org');
        await this.db.get(inserted.identifier);
        const deleted = await this.db.delete(inserted.identifier);
        inserted.should.deep.equal(deleted);
        try {
          return await this.db.get(inserted.identifier);
        } catch(err) {
          err.should.be.an('Error');
        }
      });

      it('can iterate through the entries', async function() {
        await this.db.insert('https://sonic2hd.com/');
        await this.db.insert('https://en.wikipedia.org/wiki/Sonic_Mania');
        for (const entry of this.db) {
          const url = await entry;
          url.full.protocol.should.equal('https:');
        }
      });

      describe('insert', () => {
        it('validates the URL', function() {
          const thrower = () => {
            this.db.insert('jungle inferno update');
          };
          thrower.should.throw(TypeError, /^Invalid URL: /);
        });
      });

      describe('get', () => {
        it('fails to find bad identifiers', async function() {
          try {
            return await this.db.get(4865);
          } catch(err) {
            err.should.be.an('Error');
          }
        });
      });

      describe('events', () => {
        it('insert', function() {
          const promise = new Promise(resolve => {
            this.db.on('insert', () => resolve());
          });
          return this.db.insert('https://www.teamfortress.com').then(() => promise);
        });

        it('delete', async function() {
          const promise = new Promise(resolve => {
            this.db.on('delete', () => resolve());
          });
          const {identifier} = await this.db.insert('https://www.teamfortress.com');
          await this.db.delete(identifier);
          return promise;
        });
      });
    });
  });
});
