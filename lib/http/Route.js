class Route {
  constructor(path, method, handler) {
    this.path = path;
    this.method = method;
    this.handler = handler;
  }
}

module.exports = Route;
