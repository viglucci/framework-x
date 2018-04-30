const express = require('express');
const { createContainer, asFunction } = require('awilix');
const { ExpressRouterFactory } = require('./http');
const NamedControllerResolver = require('./NamedControllerResolver');
const NamedMiddlewareResolver = require('./NamedMiddlewareResolver');
const ClosureResolver = require('./ClosureResolver');
const ContainerFacade = require('./ContainerFacade');

class ApplicationContextBuilder {
  constructor() {
    this.container = undefined;
    this.app = undefined;
    this.autoloadPaths = [];
    this.providers = [];
    return this;
  }

  withBaseDirectory(directory) {
    this.directory = directory;
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

  withServiceProviders(providers) {
    this.providers = providers;
    return this;
  }

  build() {
    this.initContainer();
    this.app = express();
    this.registerRouterFactoryResolvers();
    this.app.use(ExpressRouterFactory.create(this.router));
    this.app.resolve = name => this.container.resolve(name);
    return this.app;
  }

  initContainer() {
    this.container = createContainer();
    this.registerProviders();
    this.container.loadModules(this.autoloadPaths);
  }

  registerRouterFactoryResolvers() {
    ExpressRouterFactory.registerMiddlewareResolver('function', new ClosureResolver());
    ExpressRouterFactory.registerMiddlewareResolver('string', new NamedMiddlewareResolver(this.container));

    ExpressRouterFactory.registerRouterHandlerResolver('function', new ClosureResolver());
    ExpressRouterFactory.registerRouterHandlerResolver('string', new NamedControllerResolver(this.container));
  }

  registerProviders() {
    const facade = new ContainerFacade();
    for (let i = 0; i < this.providers.length; i++) {
      /* eslint-disable */
      const provider = new (require(this.providers[i]))();
      /* eslint-enable */
      provider.register(facade);
    }
    const reigstrations = facade.getRegistrations();
    const serviceNames = Object.keys(reigstrations);
    for (let i = 0; i < serviceNames.length; i++) {
      const serviceName = serviceNames[i];
      const registration = {};
      registration[serviceName] = asFunction(reigstrations[serviceName]);
      this.container.register(registration);
    }
  }
}

module.exports = ApplicationContextBuilder;
