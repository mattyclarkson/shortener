describe('server', () => {
  describe('middleware', () => {
    describe('api', () => {
      describe('invalid', () => {
        it('rejects an invalid accept header', () => {
          const headers = {'Accept': ''};
          return fetch('', {headers}).catch(err => err.should.be.an('Error').and.to.have.property('status', 406));
        });
      });

      describe('request', () => {
        before(function() {
          return fetch('').catch(err => {
            if (err.response.status === 501) {
              this.skip();
            }
          });
        });

        it('can retrieve the list of shortened URLs', () => {
          return fetch('').then(response => response.to.be.a('array').that.is.empty);
        });
      });
    });
  });
});
