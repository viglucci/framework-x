class ContainerFacade {
  constructor() {
    this.registrations = {};
  }

  singleton(name, factory) {
    this.registrations[name] = factory;
  }

  getRegistrations() {
    return this.registrations;
  }
}

module.exports = ContainerFacade;
