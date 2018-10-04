import { MongoClient, Db, Collection } from 'mongodb';
import { exists, mkdir, readFile, writeFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import { flatMap } from 'lodash';
import * as rimraf from 'rimraf';

import { IImage, IItemFields } from 'global-utils';
import { config } from '../../../../../config';

const checkIfExists = promisify(exists);
const createDirectory = promisify(mkdir);
const removeDirectory = promisify(rimraf);
const readFileFromDisk = promisify(readFile);
const writeFileToDisk = promisify(writeFile);

class Database {
  db: Db = null;

  connect = (done) => {
    return MongoClient
      .connect(config.db)
      .then((db: Db) => {
        this.db = db;
        return Promise.resolve();
      })
      .catch(() => done());
  }

  disconnect = (done) => {
    this.db.close()
      .then(() => done());
  }

  initialize = (testData, done) => {
    this.connect(done)
      .then(this.removeTestData(testData, done))
      .then(this.addTestData(testData, done));
  }

  dropCollection = testData => (collection: Collection) => {
    return collection.remove({}).then(() => {
      if (collection.collectionName === 'items') {
        const imagePaths = this.getImagePaths(testData.collections[collection.collectionName]);
        const removeDirectories = imagePaths.map(path => this.removeDirectory(path));
        return Promise.all(removeDirectories);
      } else {
        return Promise.resolve({});
      }
    });
  }

  removeTestData = (testData, done) => () => {
    return this.db.collections()
      .then((collections: Collection[]) => {
        return Promise.all(collections.map(this.dropCollection(testData)));
      })
      .catch(() => done());
  }

  createDirectory = (path: string) => {
    return checkIfExists(path)
      .then(exists => {
        if (exists) {
          return Promise.resolve();
        } else {
          return createDirectory(path);
        }
      });
  }

  removeDirectory = (path: string) => {
    return checkIfExists(path)
      .then(exists => {
        if (exists) {
          return removeDirectory(path);
        } else {
          return Promise.resolve();
        }
      });
  }

  copyFile = () => {
    return readFileFromDisk('testUploads/src.jpeg');
  }

  pasteFile = (filePath: string, fileName: string) => (data) => {
    return writeFileToDisk(join(filePath, fileName), data)
      .then(() => Promise.resolve(data));
  }

  createFilePipeline = (image: IImage) => {
    return this.copyFile()
      .then(this.pasteFile(image.path, image.fileName))
      .then(this.pasteFile(image.path, image.thumbName));
  }

  getImagePaths = (items) => {
    return flatMap(items, (item: IItemFields) => item.images[0].path);
  }

  addImages = (items) => {
    const paths = this.getImagePaths(items);
    const createDirectories = paths.map(path => this.createDirectory(path));
    return Promise.all(createDirectories)
      .then(() => {
        const images = flatMap(items, (item: IItemFields) => item.images);
        const createFiles = images.map(this.createFilePipeline);
        return Promise.all(createFiles);
      });
  }

  createCollection = (data, done) => name => {
    return this.db.createCollection(name)
      .then((collectionInstance: Collection<any>) => {
        const collectionItems = data.collections[name];
        return collectionInstance.insert(collectionItems)
          .then(() => {
            if (name === 'items') {
              return this.addImages(collectionItems);
            } else {
              return Promise.resolve({});
            }
          });
      })
      .catch(() => done());
  }

  addTestData = (data, done) => () => {
    const createCollections = Object.keys(data.collections).map(this.createCollection(data, done));
    return Promise.all(createCollections).then(() => done());
  }
}

export const testDB = new Database();
