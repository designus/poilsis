import * as request from 'supertest';
import app from '../../app';

export const login = (account: any) => {
  return request(app)
    .post('/api/users/login')
    .send(account)
    .then(res => res.body.accessToken)
    .catch(err => {
      throw err;
    });
};
