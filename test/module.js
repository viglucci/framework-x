const { expect } = require('chai');
const framework = require('../index.js');

describe('module', () => {
    describe('http', () => {

        it('exposes Router ', () => {
            expect(framework.http.Router).to.not.be.null;
        });

        it('exposes ExpressRouterFactory ', () => {
            expect(framework.http.ExpressRouterFactory).to.not.be.null;
        });
    });
});
