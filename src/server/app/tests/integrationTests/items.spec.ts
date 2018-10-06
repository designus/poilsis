import { login, logout, testDB, testData, adminUser, regularUser } from '../utils';
import app from '../../../app';

const request = require('supertest');

const adminItem  = testData.collections.items[0];
const userItem = testData.collections.items[1];
const newItem = {
  name: 'New item',
  description: '',
  types: ['sYrnfYEv', 'dogPzIz8', 'a4vhAoFG'],
  alias: 'new-item',
  id: 'newitem123',
  address: 'Geliu a.12',
  images: [],
  userId: adminUser.id,
  cityId: 'eWRhpRV',
  isEnabled: true,
};

describe('Integration tests: Items', () => {
  beforeAll((done) => {
    testDB.initialize(testData, done);
  });

  afterAll(done => {
    testDB.disconnect(done);
  });

  describe('Not logged user', () => {
    it('should get all items', () => {
      return request(app)
        .get('/api/items')
        .expect(200)
        .then(response => {
          expect(response.body.length).toBe(2);
        });
    });

    it('should get a single item', () => {
      return request(app)
        .get(`/api/items/item/${adminItem.id}`)
        .expect(200)
        .then(response => {
          expect(response.body.name).toBe('Almuka');
        });
    });

    it('should not be able to add a new item', () => {
      return request(app)
        .post('/api/items')
        .send(newItem)
        .expect(401);
    });

    it('should not be able to delete existing item', () => {
      return request(app)
        .delete(`/api/items/item/${adminItem.id}`)
        .expect(401);
    });

    it('should not be able to update main info', () => {
      return request(app)
        .put(`/api/items/item/mainInfo/${adminItem.id}`)
        .send({ ...adminItem, name: 'Almuka updated' })
        .expect(401);
    });

    it('should not be able to update photos', () => {
      const images = adminItem.images.slice(0, 1);
      return request(app)
        .put(`/api/items/item/update-photos${adminItem.id}`)
        .send({ ...adminItem, images })
        .expect(401);
    });

    it('should not be able to upload photos', () => {
      
    });
  });

  // describe('User: admin', () => {
  //   let accessToken;

  //   beforeAll((done) => {
  //     login(request(app), adminUser, (token) => {
  //       accessToken = token;
  //       done();
  //     });
  //   });

  //   afterAll((done) => {
  //     logout(request(app), adminUser.id, () => {
  //       accessToken = null;
  //       done();
  //     });
  //   });
  // });
});
