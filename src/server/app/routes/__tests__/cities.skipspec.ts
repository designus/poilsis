import { login, logout, testDB, testData, adminUser, regularUser } from '../../test-utils';
import { DEFAULT_LANGUAGE } from 'global-utils';
import app from '../../../app';

const supertest = require('supertest');

const newCityId = '123456';
const newCity = {
  name : 'Nida',
  description : '',
  types : ['abc'],
  alias : 'nida',
  id: newCityId
};

const existingCity = testData.collections.cities[0];
const request = supertest(app);

describe.skip('Integration tests: Cities', () => {

  beforeAll((done) => {
    testDB.initialize(done);
  });

  afterAll(done => {
    testDB.disconnect(done);
  });

  describe('Not logged user', () => {
    it('should get all cities', async (done) => {
      const response = await request.get('/api/cities');
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      done();
    });

    it('should not be able to add new city', () => {
      return request(app)
        .post('/api/cities')
        .send(newCity)
        .expect(401);
    });

    it('should not be able to update existing city', () => {
      return request(app)
        .put(`/api/cities/city/${newCityId}`)
        .send({ ...newCity, name: 'Klaipeda' })
        .expect(401);
    });

    it('should not be able to remove existing city', () => {
      return request(app)
        .delete(`/api/cities/city/${newCityId}`)
        .expect(401);
    });
  });

  describe('User: admin', () => {

    let accessToken;

    beforeAll((done) => {
      login(adminUser)
        .then(token => {
          accessToken = token;
          done();
        });
    });

    afterAll((done) => {
      logout(adminUser.id)
        .then(() => {
          accessToken = null;
          done();
        });
    });

    it('should be able to create new city', () => {
      return request(app)
        .post('/api/cities')
        .send(newCity)
        .set('Cookie', `jwt=${accessToken}`)
        .expect(200)
        .then(response => {
          expect(response.body.name[DEFAULT_LANGUAGE]).toBe(newCity.name);
        });
    });

    it('should be able to update existing city', () => {
      return request(app)
        .put(`/api/cities/city/${newCityId}`)
        .send({ ...newCity,  name: 'Klaipeda' })
        .set('Cookie', `jwt=${accessToken}`)
        .expect(200)
        .then(response => {
          expect(response.body.name).toBe('Klaipeda');
        });
    });

    it('should be able to remove existing city', () => {
      return request(app)
        .delete(`/api/cities/city/${newCityId}`)
        .set('Cookie', `jwt=${accessToken}`)
        .expect(200);
    });
  });

  describe('User: regular', () => {

    let accessToken;

    beforeAll((done) => {
      login(regularUser)
        .then(token => {
          accessToken = token;
          done();
        });
    });

    afterAll((done) => {
      logout(regularUser.id)
        .then(() => {
          accessToken = null;
          done();
        });
    });

    it('should not be able to create new city', () => {
      return request(app)
        .post('/api/cities')
        .send(newCity)
        .set('Cookie', `jwt=${accessToken}`)
        .expect(401);
    });

    it('should not be able to upate existing city', () => {
      return request(app)
        .put(`/api/cities/city/${existingCity.id}`)
        .send({ ...existingCity,  name: 'Klaipeda' })
        .set('Cookie', `jwt=${accessToken}`)
        .expect(401);
    });

    it('should not be able to delete existing city', () => {
      return request(app)
        .delete(`/api/cities/city/${existingCity.id}`)
        .set('Cookie', `jwt=${accessToken}`)
        .expect(401);
    });
  });
});
