const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe.only('Auth API', () => {
    
    beforeEach(() => dropCollection('reviewers'));

    let token = null;

    beforeEach(() => {
        return request  
            .post('/auth/signup')
            .send({
                name: 'TheDude',
                email: 'hi@hiya.com',
                password: '1234',
                company: 'review town',
                roles: []
            })
            .then(({ body }) => {
                token = body.token;
            });
    });

    it('signup', () => {
        assert.ok(token);
    });

    it('verifies a user', () => {
        return request  
            .get('/auth/verify')
            .set('authorization', token)
            .then(({ body }) => {
                assert.isOk(body.verified);
            });
    });

    it('signs a user in', () => {
        return request
            .post('/auth/signin')
            .send({
                email: 'hi@hiya.com',
                password: '1234',
            })
            .then(({ body }) => {
                assert.ok(body.token);
            });
    });

    it('Sends a 400 error if email already exists', () => {
        return request
            .post('/auth/signup')
            .send({
                name: 'TheDude',
                email: 'hi@hiya.com',
                password: '1234',
                company: 'review town',
                roles: []
            })
            .then(res => {
                assert.equal(res.status, 400);
                assert.equal(res.body.error, 'Email already in use');
            });
    });

    it('Sends 401 on non-existent email', () => {
        return request
            .post('/auth/signin')
            .send({
                email: 'bye@hiya.com',
                password: '1234',
            })
            .then(res => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'Invalid email or password');
            });
    });

    it('Sends 401 on bad password', () => {
        return request
            .post('/auth/signin')
            .send({
                email: 'hi@hiya.com',
                password: '1111',
            })
            .then(res => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'Invalid email or password');
            });
    });



});

