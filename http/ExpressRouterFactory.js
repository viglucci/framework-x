const ExpressRouter = require('express').Router;

class ExpressRouterFactory {

    static create(router) {
        return this._bindRoutes(new ExpressRouter(), router);
    }

    static _bindRoutes(expressRouter, router, prefix) {
        prefix = prefix || '';
        if (router._middlewares) {
            while(router._middlewares.length) {
                expressRouter.use(prefix, router._middlewares.shift());
            }
        }
        if (router._routes) {
            Object.keys(router._routes).forEach((path) => {
                const route = router._routes[path];
                const expressRoute = expressRouter.route(prefix + route.path);
                const verb = route.method.toLowerCase();
                const method = expressRoute[verb];
                method.call(expressRoute, route.closure.bind(route.closure));
            });
        }
        if (router._routers) {
            Object.keys(router._routers).forEach((subRouterPrefix) => {
                const affix = prefix + subRouterPrefix;
                const subRouter = router._routers[subRouterPrefix];
                const subExpressRouter = new ExpressRouter();
                const boundSubExpressRouter = this._bindRoutes(subExpressRouter, subRouter, affix);
                expressRouter.use(boundSubExpressRouter);
            });
        }
        return expressRouter;
    }
}

module.exports = ExpressRouterFactory;
