
import * as request from 'supertest';

import { checkIfDirectoryExists, getUploadPath, readDirectoryContent } from '../../server-utils';
import { login, logout, testDB, testData, adminUser, regularUser } from '../utils';
import app from '../../../app';

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
        .put(`/api/items/item/update-photos/${adminItem.id}`)
        .send({ ...adminItem, images })
        .expect(401);
    });

    it('should get items filtered by cityId', () => {
      return request(app)
        .get(`/api/items/city/${userItem.cityId}`)
        .expect(200)
        .then(response => {
          expect(response.body.length).toBe(1);
          expect(response.body[0].name).toBe(userItem.name);
        });
    });

    it('should get items filtered by userId', () => {
      return request(app)
        .get(`/api/items/user/${userItem.userId}`)
        .expect(200)
        .then(response => {
          expect(response.body.length).toBe(1);
          expect(response.body[0].name).toBe(userItem.name);
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
        accessToken = null;
        done();
      });
    });

    it('should be able to create new item', () => {
      return request(app)
        .post('/api/items')
        .set('Cookie', `jwt=${accessToken}`)
        .send(newItem)
        .expect(200);
    });

    it('should be able to update main info of existing item', () => {
      return request(app)
        .put(`/api/items/item/mainInfo/${adminItem.id}`)
        .send({ ...adminItem, name: 'Almuka 2'})
        .set('Cookie', `jwt=${accessToken}`)
        .expect(200)
        .then(response => {
          expect(response.body.name).toBe('Almuka 2');
        });
    });

    it('should be able to upload photos', () => {
      const uploadDirectory = getUploadPath(newItem.id);

      return request(app)
        .put(`/api/items/item/upload-photos/${newItem.id}`)
        .attach('files[]', 'testUploads/src.jpeg')
        .set('Cookie', `jwt=${accessToken}`)
        .then(() => checkIfDirectoryExists(uploadDirectory))
        .then(exists => readDirectoryContent(uploadDirectory))
        .then(files => {
          expect(files.length).toBe(2);
        });
    });

    it('should be able to update photos', () => {
      const images = adminItem.images.slice(0, 1);
      const uploadDirectory = getUploadPath(adminItem.id);

      return request(app)
        .put(`/api/items/item/update-photos/${adminItem.id}`)
        .send({ images })
        .set('Cookie', `jwt=${accessToken}`)
        .expect(200)
        .then(() => readDirectoryContent(uploadDirectory))
        .then(files => {
          expect(files.length).toBe(2);
        });
    });

    it('should be able to toggle off an item', () => {
      return request(app)
        .patch(`/api/items/item/toggle/${adminItem.id}`)
        .set('Cookie', `jwt=${accessToken}`)
        .expect(200)
        .then(response => {
          expect(response.body.isEnabled).toBe(false);
        });
    });

    it('should be able to delete existing item', () => {
      return request(app)
        .delete(`/api/items/item/${adminItem.id}`)
        .set('Cookie', `jwt=${accessToken}`)
        .expect(200)
        .then(() => checkIfDirectoryExists(adminItem.images[0].path))
        .then(exists => {
          expect(exists).toBe(false);
        });
    });
  });
});
