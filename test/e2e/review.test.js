const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { Types } = require('mongoose');
const Film = require('../../lib/models/Film');

describe('review tests', () => {
    before(() => dropCollection('reviews'));
    before(() => dropCollection('reviewers'));

    let token = '';

    const reviewer = {
        name: 'Guy',
        company: 'guytalksmovies',
        email: 'guy@guy.com',
        password: '1234',
        roles: ['admin']
    };

    let reviewA = {
        rating: 5,
        reviewer: Types.ObjectId(),
        review: 'this was good',
        film: Types.ObjectId(),
    };

    let reviewB = {
        rating: 4,
        reviewer: Types.ObjectId(),
        review: 'this was not good',
        film: Types.ObjectId(),
    };
    let filmC = {
        title: 'ToyStory',
        studio: Types.ObjectId(),
        released: 1995,
        cast: [],
    };

    before(() => {
        return request.post('/auth/signup')
            .send(reviewer)
            .then(({ body }) => {
                console.log('****** body: ', body);
                reviewer._id = body._id;
                token = body.token;
            });
    });

    const roundTrip = doc => JSON.parse(JSON.stringify(doc.toJSON()));

    before(() => {
        return Film.create(filmC).then(roundTrip)
            .then(saved => {
                filmC = saved;
                reviewA.film = saved._id;
                reviewB.film = saved._id;
            });
    });

    it('saves and gets review', () => {
        return request.post('/reviews')
            .set('Authorization', token)
            .send(reviewA)
            .then(({ body }) => {
                const { _id, __v, updatedAt, createdAt } = body;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.ok(updatedAt);
                assert.ok(createdAt);
                assert.equal(body.review, reviewA.review);
                reviewA = body;
            });
    });

    it('returns all the reviews', () => {
        return request.get('/reviews')
            .then(({ body }) => {
                assert.equal(body[0].film.title, 'ToyStory');
            });
    });
});