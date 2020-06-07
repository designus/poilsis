
import * as request from 'supertest';

import { checkIfDirectoryExists, readDirectoryContent, getUploadPath } from '../../server-utils';
import { login, logout, testDB, testData, adminUser, regularUser } from '../../test-utils';
import app from '../../../app';

const adminItem  = testData.collections.items[0];
const userItem = testData.collections.items[1];
const newItem: any = {
  name: 'New item',
  description: '',
  types: ['sYrnfYEv', 'dogPzIz8', 'a4vhAoFG'],
  alias: 'new-item',
  id: 'newitem123',
  address: 'Geliu a.12',
  images: [],
  userId: adminUser.id,
  cityId: 'eWRhpRV',
  isEnabled: true
};

describe.skip('Integration tests: Items', () => {
  beforeAll((done) => {
    testDB.initialize(done);
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
        .get(`/api/items/view-item/${adminItem.alias}`)
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
        .put(`/api/items/item/main-info/${adminItem.id}`)
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
    let accessToken: any;

    beforeAll((done) => {
      testDB.swapTestData()
        .then(() => login(adminUser))
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

    it('should be able to create new item', () => {
      return request(app)
        .post('/api/items')
        .set('Cookie', `jwt=${accessToken}`)
        .send(newItem)
        .expect(200);
    });

    it('should be able to update main info of existing item', () => {
      return request(app)
        .put(`/api/items/item/main-info/${adminItem.id}`)
        .send({ ...adminItem, name: 'Almuka 2'})
        .set('Cookie', `jwt=${accessToken}`)
        .expect(200)
        .then(response => {
          expect(response.body.name).toBe('Almuka 2');
        });
    });

    it('should be able to upload photos', () => {
      const uploadDirectory = getUploadPath(newItem.id, 'items');

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
      const uploadDirectory = getUploadPath(adminItem.id, 'items');

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

  describe('User: regular', () => {
    let accessToken: string | null = null;

    beforeAll((done) => {
      testDB.swapTestData()
        .then(() => login(regularUser))
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

    it('should be able to create a new item', () => {
      return request(app)
        .post('/api/items')
        .set('Cookie', `jwt=${accessToken}`)
        .send({...newItem, userId: regularUser.id })
        .expect(200);
    });

    it('should be able to update main info of own item', () => {
      return request(app)
        .put(`/api/items/item/main-info/${userItem.id}`)
        .send({ ...userItem, name: 'Almuka 2'})
        .set('Cookie', `jwt=${accessToken}`)
        .expect(200)
        .then(response => {
          expect(response.body.name).toBe('Almuka 2');
        });
    });

    it('should not be able to update main info of other user item', () => {
      return request(app)
        .put(`/api/items/item/main-info/${adminItem.id}`)
        .send({ ...adminItem, name: 'Almuka 2'})
        .set('Cookie', `jwt=${accessToken}`)
        .expect(401);
    });

    it('should be able to upload photos to his own item', () => {
      const uploadDirectory = getUploadPath(userItem.id, 'items');
      return request(app)
        .put(`/api/items/item/upload-photos/${userItem.id}`)
        .attach('files[]', 'testUploads/src.jpeg')
        .set('Cookie', `jwt=${accessToken}`)
        .expect(200)
        .then(() => readDirectoryContent(uploadDirectory))
        .then(files => {
          expect(files.length).toBe(4);
        });
    });

    it('should not be able to upload photos to other user item', () => {
      // const uploadFile = join(__dirname, '../../../../../', 'testUploads', 'src.jpeg');
      return request(app)
        .put(`/api/items/item/upload-photos/${adminItem.id}`)
        // TODO: Find out why Test files if we try to attach file
        // .attach('files[]', uploadFile)
        .set('Cookie', `jwt=${accessToken}`)
        .expect(401);
    });

    it('should be able to update his own photos', () => {
      const uploadDirectory = getUploadPath(userItem.id, 'items');
      return request(app)
        .put(`/api/items/item/update-photos/${userItem.id}`)
        .set('Cookie', `jwt=${accessToken}`)
        .send({ images: [] })
        .expect(200)
        .then(() => readDirectoryContent(uploadDirectory))
        .then(files => {
          expect(files.length).toBe(0);
        });
    });

    it('should not be able to update other user content', () => {
      return request(app)
        .put(`/api/items/item/update-photos/${adminItem.id}`)
        .set('Cookie', `jwt=${accessToken}`)
        .send({ images: [] })
        .expect(401);
    });

    it('should be able to delete his own item', () => {
      return request(app)
        .delete(`/api/items/item/${userItem.id}`)
        .set('Cookie', `jwt=${accessToken}`)
        .expect(200)
        .then(() => checkIfDirectoryExists(userItem.images[0].path))
        .then(exists => {
          expect(exists).toBe(false);
        });
    });

    it('should not be able to delete other user item', () => {
      return request(app)
        .delete(`/api/items/item/${adminItem.id}`)
        .set('Cookie', `jwt=${accessToken}`)
        .expect(401);
    });

  });
});
