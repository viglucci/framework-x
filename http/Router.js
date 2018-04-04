// TODO: Support middlewares

const ExpressRouter = require('express').Router;
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
}

module.exports = Router;
