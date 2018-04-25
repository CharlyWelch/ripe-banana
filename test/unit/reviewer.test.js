const { assert } = require('chai');
const Reviewer = require('../../lib/models/Reviewer');

describe('reviewer model', () => {

    const data = {
        name: 'Roger Ebert',
        company: 'roger-ebert.com',
        email: 'roger@roger.com',
        roles: ['admin']
    };

    const password = '1234';

    let reviewer = null;

    beforeEach(() => {
        reviewer = new Reviewer(data);
        data._id = reviewer._id;
        reviewer.generateHash(password);
        data.hash = reviewer.hash;
    });

    
    it('generates a hash from password', () => {
        assert.ok(reviewer.hash);
        assert.notEqual(reviewer.hash, password);
    });

    it('compares password to hash', () => {
        assert.isOk(reviewer.comparePassword(password));
    });

    it('reviewer is a valid model', () => {
        assert.deepEqual(reviewer.toJSON(), data);
    });
                
    it('name and company are required', () => {
        const reviewer = new Reviewer({});
        const { errors } = reviewer.validateSync();
        assert.equal(errors.name.kind, 'required');
        assert.equal(errors.company.kind, 'required');
    });
});