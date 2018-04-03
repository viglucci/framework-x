const { expect } = require('chai');
const framework = require('../index.js');

describe('module', () => {

    it('exposes Router', () => {
        expect(framework.Router).to.not.be.null;
    });
});
