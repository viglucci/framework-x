const express = require('express');
const path = require('path');
const { ExpressRouterFactory } = require('./http');
const NamedControllerResolver = require('./NamedControllerResolver');
const NamedMiddlewareResolver = require('./NamedMiddlewareResolver');
const ClosureResolver = require('./ClosureResolver');

class ApplicationContextBuilder {

  constructor() {
    return this;
  }

  withBaseDirectory(directory) {
    this.directory = directory;
    this.autoloadPaths = [];
    return this;
  }

  withAutoloadPaths(autoloadPaths) {
    this.autoloadPaths = autoloadPaths;
    return this;
  }

  withRouter(router) {
    this.router = router;
    return this;
  }

  build() {
    const { createContainer } = require('awilix');
    const container = createContainer().loadModules(this.autoloadPaths);
    const app = express();

    ExpressRouterFactory.registerMiddlewareResolver('function', new ClosureResolver());
    ExpressRouterFactory.registerMiddlewareResolver('string', new NamedMiddlewareResolver(container));

    ExpressRouterFactory.registerRouterHandlerResolver('function', new ClosureResolver());
    ExpressRouterFactory.registerRouterHandlerResolver('string', new NamedControllerResolver(container));

    app.use(ExpressRouterFactory.create(this.router));

    return app;
  }
}

module.exports = ApplicationContextBuilder;
