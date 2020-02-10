import * as request from 'supertest';
import app from '../../app';

export const logout = (userId: string) => {
  return request(app)
    .delete(`/api/users/logout/${userId}`)
    .catch(err => {
      throw err;
    });
};
