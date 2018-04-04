const { expect } = require('chai');
const express = require('express');
const request = require('supertest');
const sinon = require('sinon');
const ExpressRouterFactory = require('../../http/ExpressRouterFactory');
const Router = require('../../http/Router');

describe('ExpressRouterFactory', () => {

    describe('create', () => {
        it('creates a Express Router with registered top level routes', (done) => {
            // arrange
            const router = new Router();
            const app = express();

            router.get('/users', (req, res, next) => {
                res.json([
                    {
                        id: 1,
                        name: 'Jane Doe'
                    }
                ]);
            });

            // act
            app.use(ExpressRouterFactory.create(router));

            // assert
            request(app)
                .get('/users')
                .set('Accept', 'application/json')
                .expect(200, done);
        });

        it('creates a Express Router with registered route groups', (done) => {
            // arrange
            const router = new Router();
            const app = express();

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
            app.use(ExpressRouterFactory.create(router));

            // assert
            request(app)
                .get('/api/users')
                .set('Accept', 'application/json')
                .expect(200, done);
        });

        it('creates a Express Router with nested route groups', (done) => {
            // arrange
            const router = new Router();
            const app = express();

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
            app.use(ExpressRouterFactory.create(router));

            // assert
            request(app)
                .get('/api/v1/users')
                .set('Accept', 'application/json')
                .expect(200, done);
        });

        it('creates a Express Router with middleware that is registered before any top level routes', () => {
            // arrange
            const router = new Router();
            const app = express();

            const middleware = (req, res, next) => {
                next();
            };

            const middlewareSpy = sinon.spy(middleware);

            const routeHandler = (req, res, next) => {
                res.json([
                    {
                        id: 1,
                        name: 'Jane Doe'
                    }
                ]);
            };

            const routeHandlerSpy = sinon.spy(routeHandler);

            router.middleware(middlewareSpy);
            router.get('/api/users', routeHandlerSpy);

            // act
            app.use(ExpressRouterFactory.create(router));

            // assert
            return request(app)
                .get('/api/users')
                .set('Accept', 'application/json')
                .expect(200)
                .then(() => {
                    expect(middlewareSpy.called).to.be.true;
                    expect(routeHandlerSpy.called).to.be.true;
                    expect(middlewareSpy.calledBefore(routeHandlerSpy)).to.be.true;
                });
        });

        it('creates a Express Router with middleware that is applied before top level routes even if the middleware is registered after the top level route', () => {
            // arrange
            const router = new Router();
            const app = express();

            const middleware = (req, res, next) => next();

            const middlewareSpy = sinon.spy(middleware);

            const routeHandler = (req, res, next) => {
                res.json([
                    {
                        id: 1,
                        name: 'Jane Doe'
                    }
                ]);
            };

            const routeHandlerSpy = sinon.spy(routeHandler);

            router.get('/api/users', routeHandlerSpy);
            router.middleware(middlewareSpy);

            // act
            app.use(ExpressRouterFactory.create(router));

            // assert
            return request(app)
                .get('/api/users')
                .set('Accept', 'application/json')
                .expect(200)
                .then(() => {
                    expect(middlewareSpy.called).to.be.true;
                    expect(routeHandlerSpy.called).to.be.true;
                    expect(middlewareSpy.calledBefore(routeHandlerSpy)).to.be.true;
                });
        });

        it('creates a Express Router with middleware that is registered to a nested router', () => {
            // arrange
            const router = new Router();
            const app = express();

            const v1MiddlewareSpy = sinon.spy((req, res, next) => next());
            const v2MiddlewareSpy = sinon.spy((req, res, next) => next());

            router.group('/api', (apiRouter) => {

                apiRouter.group('/v1', (apiV1Router) => {
                    apiV1Router.middleware(v1MiddlewareSpy);
                    apiV1Router.get('/names', (req, res) => {
                        res.json([]);
                    });
                });

                apiRouter.group('/v2', (apiV2Router) => {
                    apiV2Router.middleware(v2MiddlewareSpy);
                    apiV2Router.get('/names', (req, res) => {
                        res.json([]);
                    });
                });
            });

            // act
            app.use(ExpressRouterFactory.create(router));

            // assert
            return request(app)
                .get('/api/v2/names')
                .set('Accept', 'application/json')
                .expect(200)
                .then(() => {
                    expect(v1MiddlewareSpy.called).to.be.false;
                    expect(v2MiddlewareSpy.called).to.be.true;
                });
        });
    });
});
