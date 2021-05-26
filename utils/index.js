'use strict';

const crypto = require('crypto');
const mongo = require('mongodb').MongoClient;

module.exports = {
    hashString(str, type = 'md5' ) {
        return crypto.createHash(type).update(str).digest('hex');
    },
    async db(url) {
        try {
           const client = await mongo.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
          });
          return client;
        } catch(err) {
            return err;
        }
    }
};