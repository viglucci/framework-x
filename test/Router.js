const { expect } = require('chai');
const { Router, Route } = require('../app/Router');
const express = require('express');
const request = require('supertest');

describe('Router', () => {

    describe('get', () => {
        it('registers a new entry to the _paths map', () => {
            const router = new Router();
            router.get('/users', () => {});
            expect(router._routes).to.have.all.keys('/users');
        });

        it('registers a new entry as a instance of Route', () => {
            const router = new Router();
            router.get('/users', () => { });
            expect(router._routes['/users']).to.be.instanceof(Route);
        });

        it('registers a new entry as a instance of Route with method as GET', () => {
            const router = new Router();
            router.get('/users', () => { });
            expect(router._routes['/users'].method).to.equal('GET');
        });
    });

    describe('post', () => {
        it('registers a new entry to the _paths map', () => {
            const router = new Router();
            router.post('/api/user', () => { });
            expect(router._routes).to.have.all.keys('/api/user');
        });

        it('registers a new entry as a instance of Route', () => {
            const router = new Router();
            router.post('/api/user', () => { });
            expect(router._routes['/api/user']).to.be.instanceof(Route);
        });

        it('registers a new entry as a instance of Route with method as POST', () => {
            const router = new Router();
            router.post('/api/user', () => { });
            expect(router._routes['/api/user'].method).to.equal('POST');
        });
    });

    describe('group', () => {
        it('registers a new entry to the _routers map', () => {
            const router = new Router();
            router.group('/api', () => { });
            expect(router._routers).to.have.all.keys('/api');
        });

        it('registers a new entry to the _routers as a instance of Router', () => {
            const router = new Router();
            router.group('/api', () => { });
            expect(router._routers['/api']).to.be.instanceof(Router);
        });

        it('calls the provided closure with a new instance of Router', (done) => {
            const router = new Router();
            router.group('/api', (subRouter) => {
                expect(subRouter).to.be.instanceof(Router);
                done();
            });
            expect(router._routers['/api']).to.be.instanceof(Router);
        });
    });

    describe('middleware', () => {
        it('can append a string to the _middlewares array', () => {
            const router = new Router();
            router.middleware('auth');
            expect(router._middlewares).to.include('auth');
        });

        it('can append a callback function to the _middlewares array', () => {
            const router = new Router();
            const middleware = () => {};
            router.middleware(middleware);
            expect(router._middlewares[0]).to.eql(middleware);
        });
    });

    describe('bind', () => {
        it('registers top level routes to a given express router', (done) => {
            // arrange
            const router = new Router();
            const app = express();
            const expressRouter = express.Router();
            router.get('/users', (req, res, next) => {
                res.json([
                    {
                        id: 1,
                        name: 'Jane Doe'
                    }
                ]);
            });

            // act
            router.bind(expressRouter);
            app.use(expressRouter);

            // assert
            request(app)
                .get('/users')
                .set('Accept', 'application/json')
                .expect(200, done);
        });

        it('registers groups to a given express router', (done) => {
            // arrange
            const router = new Router();
            const app = express();
            const expressRouter = express.Router();
            router.group('/api', (apiRouter) => {
                apiRouter.get('/users', (req, res, next) => {
                    res.json([
                        {
                            id: 1,
                            name: 'Jane Doe'
                        }
                    ]);
                });
            });

            // act
            router.bind(expressRouter);
            app.use(expressRouter);

            // assert
            request(app)
                .get('/api/users')
                .set('Accept', 'application/json')
                .expect(200, done);
        });

        it('registers nested groups to a given express router', (done) => {
            // arrange
            const router = new Router();
            const app = express();
            const expressRouter = express.Router();
            router.group('/api', (apiRouter) => {
                apiRouter.group('/v1', (v1Router) => {
                    v1Router.get('/users', (req, res) => {
                        res.json([
                            {
                                id: 1,
                                name: 'Jane Doe'
                            }
                        ]);
                    });
                });
            });

            // act
            router.bind(expressRouter);
            app.use(expressRouter);

            // assert
            request(app)
                .get('/api/v1/users')
                .set('Accept', 'application/json')
                .expect(200, done);
        });
    });
});