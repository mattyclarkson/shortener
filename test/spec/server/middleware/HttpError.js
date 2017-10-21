import HttpError from '../../../../lib/server/middleware/HttpError.js';

describe('server', () => {
  describe('middleware', () => {
    describe('HttpError', () => {
      it('can be converted to a string', () => {
        const error = new HttpError();
        error.toString().should.equal('HttpError');
      });
    });
  });
});
