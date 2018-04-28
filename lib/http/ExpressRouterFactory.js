const ExpressRouter = require('express').Router;

class ExpressRouterFactory {
  static create(router) {
    return this.buildRouter(new ExpressRouter(), router);
  }

  static buildRouter(expressRouter, router, nestedRouterPrefix) {
    const prefix = nestedRouterPrefix || '';
    if (router.middlewares) {
      while (router.middlewares.length) {
        expressRouter.use(prefix, router.middlewares.shift());
      }
    }
    if (router.routes) {
      this.bindRoutes(expressRouter, router, prefix);
    }
    if (router.routers) {
      this.bindRouters(expressRouter, router, prefix);
    }
    return expressRouter;
  }

  static bindRoutes(expressRouter, router, prefix) {
    Object.keys(router.routes).forEach((path) => {
      const route = router.routes[path];
      const expressRoute = expressRouter.route(prefix + route.path);
      const verb = route.method.toLowerCase();
      const method = expressRoute[verb];
      method.call(expressRoute, route.closure.bind(route.closure));
    });
  }

  static bindRouters(expressRouter, router, prefix) {
    Object.keys(router.routers).forEach((subRouterPrefix) => {
      const affix = prefix + subRouterPrefix;
      const subRouter = router.routers[subRouterPrefix];
      const subExpressRouter = new ExpressRouter();
      const boundSubExpressRouter = this.buildRouter(subExpressRouter, subRouter, affix);
      expressRouter.use(boundSubExpressRouter);
    });
  }
}

module.exports = ExpressRouterFactory;
