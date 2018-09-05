import { config } from '../../../../../config';
import { MongoClient, Db } from 'mongodb';

const async = require('async');

class Database {
  db: Db = null;

  connect = (done) => {
    if (this.db) {
      return done();
    }

    MongoClient.connect(config.db, (err, db: Db) => {
      if (err) {
        return done(err);
      }
      this.db = db;
      done();
    });
  }

  disconnect = (done) => {
    this.db.close().then(() => {
      console.log('Connection is closed');
      done();
    });
  }

  initialize = (fixtures, done) => {
    this.connect(() => {
      this.drop(() => {
        this.fixtures(fixtures, done);
      });
    });
  }

  drop = (done) => {
    if (!this.db) {
      return done();
    }
    this.db.collections((err, collections) => {
      async.each(collections, (collection, cb) => {
        if (collection.collectionName.indexOf('system') === 0) {
          return cb();
        }
        collection.remove(cb);
      }, done);
    });
  }

  fixtures = (data, done) => {
    if (!this.db) {
      return done(new Error('Missing database connection.'));
    }
    const names = Object.keys(data.collections);
    async.each(names, (name, cb) => {
      this.db.createCollection(name, function(err, collection) {
        if (err) {
          return cb(err);
        }
        collection.insert(data.collections[name], cb);
      });
    }, done);
  }
}

export const testDB = new Database();
