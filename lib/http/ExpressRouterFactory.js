const ExpressRouter = require('express').Router;

class ExpressRouterFactory {
  static create(router) {
    return this.bindRoutes(new ExpressRouter(), router);
  }

  static bindRoutes(expressRouter, router, nestedRouterPrefix) {
    const prefix = nestedRouterPrefix || '';
    if (router.middlewares) {
      while (router.middlewares.length) {
        expressRouter.use(prefix, router.middlewares.shift());
      }
    }
    if (router.routes) {
      Object.keys(router.routes).forEach((path) => {
        const route = router.routes[path];
        const expressRoute = expressRouter.route(prefix + route.path);
        const verb = route.method.toLowerCase();
        const method = expressRoute[verb];
        method.call(expressRoute, route.closure.bind(route.closure));
      });
    }
    if (router.routers) {
      Object.keys(router.routers).forEach((subRouterPrefix) => {
        const affix = prefix + subRouterPrefix;
        const subRouter = router.routers[subRouterPrefix];
        const subExpressRouter = new ExpressRouter();
        const boundSubExpressRouter = this.bindRoutes(subExpressRouter, subRouter, affix);
        expressRouter.use(boundSubExpressRouter);
      });
    }
    return expressRouter;
  }
}

module.exports = ExpressRouterFactory;
