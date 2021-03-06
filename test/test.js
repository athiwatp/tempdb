const assert = require('assert');

const redis = require('redis');

const TempDB = require('../tempdb');

describe('TempDB', () => {
  const key = 'key';
  const value = 'value';
  const expires = 1; // one second
  let tempDB = null;

  before(() => {
    const client = redis.createClient();
    client.flushdb();
  });

  describe('constructor()', () => {
    it('should connect given a config', (done) => {
      tempDB = new TempDB('redis://localhost:6379');
      assert(tempDB);
      done();
    });

    it('should connect without a config', (done) => {
      tempDB = new TempDB();
      assert(tempDB);
      done();
    });
  });

  describe('#add()', () => {
    it('should save a key/value pair', (done) => {
      tempDB.add(key, value).then((res) => {
        assert(res);
        done();
      });
    });

    it('should save an expiring key/value pair', (done) => {
      tempDB.add(key, value, expires).then((res) => {
        assert(res);
        done();
      });
    });
  });

  describe('#find()', () => {
    it('should find a value by key', (done) => {
      tempDB.find(key).then((res) => {
        assert.equal(value, res);
        done();
      });
    });

    it('should not find an expired value by key', (done) => {
      setTimeout(() => {
        tempDB.find(key).then((res) => {
          assert.equal(null, res);
          done();
        });
      }, 1500);
    });
  });
});
