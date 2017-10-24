import Identifier from '../../lib/Identifier.js';
import Url from '../../lib/Url.js';
import {URL} from '../../lib/compatibility.js';

const full = new URL('https://en.wikipedia.org/wiki/Half-Life_(video_game)');
const identifier = new Identifier(1337);
const clicks = 8008;

describe('Url', () => {
  it('should be constructible', function() {
    const url = new Url({full, identifier, clicks});
    url.full.should.deep.equal(full);
    url.identifier.should.equal(identifier);
    url.clicks.should.equal(clicks);
  });

  describe('identifier', () => {
    it('should allow strings', function() {
      const url = new Url({full, identifier: 'abe', clicks});
      url.full.should.deep.equal(full);
      url.clicks.should.equal(clicks);
    });

    it('should allow integers', function() {
      const url = new Url({full, identifier: 5007, clicks});
      url.full.should.deep.equal(full);
      url.clicks.should.equal(clicks);
    });
  });

  describe('clicks', () => {
    it('should reject strings', function() {
      const thrower = () => {new Url({full, identifier, clicks: 'whut'});};
      thrower.should.throw(TypeError, /^The click count must be an Integer: /);
    });

    it('should reject floats', function() {
      const thrower = () => {new Url({full, identifier, clicks: 19.5});};
      thrower.should.throw(TypeError, /^The click count must be an Integer: /);
    });
  });

  describe('url', () => {
    it('should allow strings', function() {
      const url = new Url({full: full.toString(), identifier, clicks});
      url.full.should.deep.equal(full);
      url.identifier.should.equal(identifier);
      url.clicks.should.equal(clicks);
    });

    it('reject invalid URLs', function() {
      const thrower = () => {new Url({full: 'Wubba Lubba Dub Dub', identifier, clicks});};
      thrower.should.throw(TypeError, /^Invalid URL: /);
    });
  });
});
