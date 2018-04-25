const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe('Auth API', () => {
    
    beforeEach(() => dropCollection('reviewers'));

    let token = null;

    beforeEach(() => {
        return request  
            .post('/auth/signup')
            .send({
                email: 'hi@hiya.com',
                password: '1234',
                company: 'review town',
                roles: ['admin']
            })
            .then(({ body }) => token = body.token);
    });

    it('signup', () => {
        assert.ok(token);
    });
});

