const ExpressRouter = require('express').Router;
const ClosureRouteHanlderResolver = require('./ClosureRouteHandlerResolver');
const assert = require('assert');

let resolvers = {
  'function': new ClosureRouteHanlderResolver()
};

class ExpressRouterFactory {
  static create(router) {
    return this._buildRouter(new ExpressRouter(), router);
  }

  static _buildRouter(expressRouter, router, nestedRouterPrefix) {
    const prefix = nestedRouterPrefix || '';
    if (router.middlewares) {
      while (router.middlewares.length) {
        expressRouter.use(prefix, router.middlewares.shift());
      }
    }
    if (router.routes) {
      this._bindRoutes(expressRouter, router, prefix);
    }
    if (router.routers) {
      this._bindRouters(expressRouter, router, prefix);
    }
    return expressRouter;
  }

  static _bindRoutes(expressRouter, router, prefix) {
    Object.keys(router.routes).forEach((path) => {
      const route = router.routes[path];
      const expressRoute = expressRouter.route(prefix + route.path);
      const verb = route.method.toLowerCase();
      const method = expressRoute[verb];
      const handlerResolver = this._getHandlerResolverForType(typeof route.handler);
      method.call(expressRoute, handlerResolver.resolve(route.handler));
    });
  }

  static _bindRouters(expressRouter, router, prefix) {
    Object.keys(router.routers).forEach((subRouterPrefix) => {
      const affix = prefix + subRouterPrefix;
      const subRouter = router.routers[subRouterPrefix];
      const subExpressRouter = new ExpressRouter();
      const boundSubExpressRouter = this._buildRouter(subExpressRouter, subRouter, affix);
      expressRouter.use(boundSubExpressRouter);
    });
  }

  static _getHandlerResolverForType(type) {
    const handlerResolver = resolvers[type];
    if (!handlerResolver) {
      throw new Error(`No registered handler resolver for type ${type}`);
    }
    return handlerResolver;
  }

  static registerResolver(type, resolver) {
    resolvers[type] = resolver;
  }
}

module.exports = ExpressRouterFactory;
