const { expect } = require('chai');
const express = require('express');
const request = require('supertest');
const sinon = require('sinon');
const Router = require('../../lib/http/Router');

describe('Router', () => {

    describe('get', () => {
        it('registers a entry for a route', () => {
            const router = new Router();
            router.get('/users', () => {});
            expect(router.routes).to.have.all.keys('/users');
        });

        it('registers a new entry as a instance of Route with method as GET', () => {
            const router = new Router();
            router.get('/users', () => { });
            expect(router.routes['/users'].method).to.equal('GET');
        });
    });

    describe('post', () => {
        it('registers a entry for a route', () => {
            const router = new Router();
            router.post('/api/user', () => { });
            expect(router.routes).to.have.all.keys('/api/user');
        });

        it('registers a new entry as a instance of Route with method as POST', () => {
            const router = new Router();
            router.post('/api/user', () => { });
            expect(router.routes['/api/user'].method).to.equal('POST');
        });
    });

    describe('group', () => {
        it('registers a new entry to the routers map', () => {
            const router = new Router();
            router.group('/api', () => { });
            expect(router.routers).to.have.all.keys('/api');
        });

        it('registers a new entry to the routers as a instance of Router', () => {
            const router = new Router();
            router.group('/api', () => { });
            expect(router.routers['/api']).to.be.instanceof(Router);
        });

        it('calls the provided closure with a new instance of Router', (done) => {
            const router = new Router();
            router.group('/api', (subRouter) => {
                expect(subRouter).to.be.instanceof(Router);
                done();
            });
            expect(router.routers['/api']).to.be.instanceof(Router);
        });
    });

    describe('middleware', () => {
        it('can append a string to the middlewares array', () => {
            const router = new Router();
            router.middleware('auth');
            expect(router.middlewares).to.include('auth');
        });

        it('can append a callback function to the middlewares array', () => {
            const router = new Router();
            const middleware = () => {};
            router.middleware(middleware);
            expect(router.middlewares[0]).to.eql(middleware);
        });
    });
});
