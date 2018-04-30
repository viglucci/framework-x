const ExpressRouter = require('express').Router;
const assert = require('assert');

let routeHandlerResolvers = {};
let middlewareResolvers = {};

class ExpressRouterFactory {
  static create(router) {
    return this._buildRouter(new ExpressRouter(), router);
  }

  static _buildRouter(expressRouter, router, nestedRouterPrefix) {
    const prefix = nestedRouterPrefix || '';
    if (router.middlewares) {
      this._bindMiddleware(expressRouter, router, prefix);
    }
    if (router.routes) {
      this._bindRoutes(expressRouter, router, prefix);
    }
    if (router.routers) {
      this._bindRouters(expressRouter, router, prefix);
    }
    return expressRouter;
  }

  static _bindMiddleware(expressRouter, router, prefix) {
    while (router.middlewares.length) {
      let middleware = router.middlewares.shift();
      let resolver = this._getMiddlewareResolverForType(typeof middleware);
      expressRouter.use(prefix, resolver.resolve(middleware));
    }
  }

  static _bindRoutes(expressRouter, router, prefix) {
    Object.keys(router.routes).forEach((path) => {
      const route = router.routes[path];
      const expressRoute = expressRouter.route(prefix + route.path);
      const verb = route.method.toLowerCase();
      const method = expressRoute[verb];
      const handlerResolver = this._getRouteHandlerResolverForType(typeof route.handler);
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

  static _getRouteHandlerResolverForType(type) {
    const resolver = routeHandlerResolvers[type];
    if (!resolver) {
      throw new Error(`No route handler resolver for type ${type} is registered`);
    }
    return resolver;
  }

  static _getMiddlewareResolverForType(type) {
    const resolver = middlewareResolvers[type];
    if (!resolver) {
      throw new Error(`No middleware resolver for type ${type} is registered`);
    }
    return resolver;
  }

  static registerRouterHandlerResolver(type, resolver) {
    routeHandlerResolvers[type] = resolver;
  }

  static registerMiddlewareResolver(type, resolver) {
    middlewareResolvers[type] = resolver;
  }
}

module.exports = ExpressRouterFactory;
