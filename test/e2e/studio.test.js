const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const Studio = require('../../lib/models/Studio');
const Film = require('../../lib/models/Film');

describe('studio api', () => {
    before(() => dropCollection('studios'));
    before(() => dropCollection('reviewers'));


    let studioA = {
        name: 'StudioA',
        address: {
            city: 'Portland',
            state: 'OR',
            country: 'USA'
        }
    };

    let studioB = {
        name: 'StudioB',
        address: {
            city: 'Olympia',
            state: 'Washington',
            country: 'USA'
        }
    };

    let starWars = {
        title: 'Star Wars',
        studio: null,
        released: 1977,
        cast: []
    };

    let token = '';
    const reviewer = {
        name: 'Guy',
        company: 'guytalksmovies',
        email: 'guy@guy.com',
        password: '1234',
        roles: ['admin']
    };

    before(() => {
        return request.post('/auth/signup')
            .send(reviewer)
            .then(({ body }) => {
                reviewer._id = body._id;
                token = body.token;
            });
    });

    it('saves and gets studio', () => {
        return request.post('/studios')
            .set('Authorization', token)
            .send(studioA)
            .then(({ body }) => {
                const { _id, __v } = body;
                assert.ok(_id);
                assert.deepEqual(body, {
                    ...studioA,
                    _id, __v
                });
                studioA = body;
            });
    });

    const roundTrip = doc => JSON.parse(JSON.stringify(doc.toJSON()));

    it('gets studio by id', () => {
        return Studio.create(studioB).then(roundTrip)
            .then(saved => {
                studioB = saved;
                return request.get(`/studios/${studioB._id}`);
            })
            .then(({ body }) => {
                assert.deepEqual(body, studioB);
            });
    });

    it('returns all the studios', () => {
        return request.get('/studios')
            .then(({ body }) => {
                const { _id, name } = studioA;
                let obj = {};
                obj._id = studioB._id;
                obj.name = studioB.name;
                assert.deepEqual(body, [{ _id, name }, obj]);
            });
    });

    it('update a studio', () => {
        studioA.name = 'New name';

        return request.put(`/studios/${studioA._id}`)
            .set('Authorization', token)
            .send(studioA)
            .then(({ body }) => {
                assert.deepEqual(body, studioA);
                return Studio.findById(studioA._id).then(roundTrip);
            })
            .then(updated => {
                assert.deepEqual(updated, studioA);
            });
    });

    it('deletes a studio', () => {
        starWars.studio = studioB._id;
        return Film.create(starWars).then(roundTrip)
            .then(saved => {
                starWars = saved;
            })
            .then(() => {  
                return request.delete(`/studios/${studioB._id}`)
                    .set('Authorization', token);    
            })
            .then(result => {
                assert.equal(result.status, 400);
            });
    });
});