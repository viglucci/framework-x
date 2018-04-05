const Route = require('./Route');

class Router {
  constructor() {
    this.routers = {};
    this.routes = {};
    this.middlewares = [];
  }

  get(path, closure) {
    this.routes[path] = new Route(path, 'GET', closure);
    return this;
  }

  post(path, closure) {
    this.routes[path] = new Route(path, 'POST', closure);
    return this;
  }

  group(name, closure) {
    const router = new Router();
    this.routers[name] = router;
    closure.call(closure, router);
    return this;
  }

  middleware(name) {
    this.middlewares.push(name);
    return this;
  }
}

module.exports = Router;
