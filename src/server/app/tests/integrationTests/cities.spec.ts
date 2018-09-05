import { login, logout, testDB, testData } from '../utils';
import app from '../../../app';

const request = require('supertest');
const superagent = require('superagent');

const adminUser = {
  id: 'a4Cs84LozK',
  username: 'testAdmin',
  password: 'testAdmin',
};

const newCity = {
  name : 'Sventoji',
  description : '',
  types : ['abc'],
  alias : 'sventoji',
};

describe('Integration tests: Cities', () => {
  beforeAll((done) => {
    testDB.initialize(testData, done);
  });

  afterAll(done => {
    testDB.disconnect(done);
  });

  describe('Not logged user', () => {
    it('should get all cities', () => {
      return request(app)
        .get('/api/cities')
        .expect(200)
        .then(response => {
          expect(response.body.length).toBe(1);
        });
    });

    it('should not be able to add new city', () => {
      return request(app)
        .post('/api/cities')
        .send(newCity)
        .expect(401)
        .then(response => {
          expect(response.body.name).toBe('AuthenticationError');
        });
    });
  });

  describe('User: admin', () => {

    let accessToken;

    beforeAll((done) => {
      login(request(app), adminUser, (token) => {
        accessToken = token;
        done();
      });
    });

    afterAll((done) => {
      logout(request(app), adminUser.id, () => {
        done();
      });
    });

    it('should create new city', () => {
      return request(app)
        .post('/api/cities')
        .send(newCity)
        .set('Cookie', `jwt=${accessToken}`)
        .expect(200)
        .then(response => {
          expect(response.body.name).toBe('Sventoji');
        });
    });
  });

});
