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
                console.log('****************** body: ', body);
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
});

