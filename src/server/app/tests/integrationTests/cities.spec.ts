import { login, logout, testDB, testData, adminUser, regularUser } from '../utils';
import * as request from 'supertest';
import app from '../../../app';

const newCityId = '123456';
const newCity = {
  name : 'Sventoji',
  description : '',
  types : ['abc'],
  alias : 'sventoji',
  id: newCityId,
};

const existingCity = testData.collections.cities[0];

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
        .expect(401);
    });

    it('should not be able to update existing city', () => {
      return request(app)
        .put(`/api/cities/city/${newCityId}`)
        .send({
          ...newCity,
          name: 'Nida',
        })
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
      login(request(app), adminUser, (token) => {
        accessToken = token;
        done();
      });
    });

    afterAll((done) => {
      logout(request(app), adminUser.id, () => {
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
          expect(response.body.name).toBe('Sventoji');
        });
    });

    it('should be able to update existing city', () => {
      return request(app)
        .put(`/api/cities/city/${newCityId}`)
        .send({
          ...newCity,
          name: 'Nida',
        })
        .set('Cookie', `jwt=${accessToken}`)
        .expect(200)
        .then(response => {
          expect(response.body.name).toBe('Nida');
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
      login(request(app), regularUser, (token) => {
        accessToken = token;
        done();
      });
    });

    afterAll((done) => {
      logout(request(app), regularUser.id, () => {
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
        .send({
          ...existingCity,
          name: 'Nida',
        })
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
