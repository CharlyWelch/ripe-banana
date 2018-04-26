require('dotenv').config({ MONGODB_URI: './test/e2e/.env ' });
const connect = require('../../lib/connect');
const mongoose = require('mongoose');
const request = require('./request');

before(() => connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/banana_test'));
after(() => mongoose.connection.close());

module.exports = {
    dropCollection(name){
        return mongoose.connection.dropCollection(name)
            .catch(err => {
                if(err.codeName !== 'NamespaceNotFound') throw err;
            });
    },

    createToken(data = { email: 'hi@hiya.com', password: '1234' }) {
        return request
            .post('/auth/signup')
            .send(data)
            .then(res => res.body.token);
    }
};