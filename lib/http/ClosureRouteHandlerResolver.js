const RouteHandlerResolver = require('./RouteHandlerResolver');

class ClosureRouteHandlerResolver extends RouteHandlerResolver {

  constructor() {
    super();
  }

  resolve(handler) {
    return handler.bind(handler);
  }
}

module.exports = ClosureRouteHandlerResolver;

