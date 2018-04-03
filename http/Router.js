// TODO: Support middlewares

const Route = require('./Route');

class Router {

    constructor() {
        this._routers = {};
        this._routes = {};
        this._middlewares = [];
    }

    get(path, closure) {
        this._routes[path] = new Route(path, 'GET', closure);
        return this;
    }

    post(path, closure) {
        this._routes[path] = new Route(path, 'POST', closure);
        return this;
    }

    group(name, closure) {
        const router = new Router();
        this._routers[name] = router;
        closure.call(closure, router);
        return this;
    }

    middleware(name) {
        this._middlewares.push(name);
        return this;
    }

    bind(expressRouter) {
        this._bindRoutes(expressRouter);
        return expressRouter;
    }

    _bindRoutes(expressRouter, router, prefix) {
        router = router || this;
        prefix = prefix || '';
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
                const subRouter = router._routers[subRouterPrefix];
                this._bindRoutes(expressRouter, subRouter, prefix + subRouterPrefix);
            });
        }
    }
}

module.exports = Router;
