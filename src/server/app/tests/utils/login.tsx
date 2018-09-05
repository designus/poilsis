const superagent = require('superagent');

export const login = (request, account, done) => {
  request
    .post('/api/users/login')
    .send(account)
    .end((err, res) => {
      if (err) {
        throw err;
      }
      done(res.body.accessToken);
    });
};
