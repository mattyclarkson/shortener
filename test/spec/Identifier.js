import Identifier, {encode, decode} from '../../lib/Identifier.js';

describe('Identifier', () => {
  it('should be constructable with an ID', function() {
    const id = 3280;
    const identifier = new Identifier(id);
    identifier.id.should.equal(id);
  });

  it('should be constructable with itself', function() {
    const id = 3280;
    const inbetween = new Identifier(id);
    const identifier = new Identifier(inbetween);
    identifier.id.should.equal(id);
  });

  it('should be constructable with an string', function() {
    const identifier = new Identifier('abe');
    identifier.id.should.equal(10606);
  });

  it('should be encodable', function() {
    const identifier = new Identifier(10606);
    identifier.encode().should.equal('abe');
  });

  it('should be convertible to a string', function() {
    const identifier = new Identifier(10606);
    identifier.toString().should.equal('abe');
  });

  describe('encode', () => {
    it('should convert a ID to string', function() {
      encode(80085).should.equal('2e6l');
    });
  });

  describe('decode', () => {
    it('should convert a string to an ID', function() {
      decode('abe').should.equal(10606);
    });
  });

  it('should perform roundtrip conversion', function() {
    const value = 199;
    decode(encode(value)).should.equal(value);
  });
});
