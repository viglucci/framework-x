class Route {
  constructor(path, method, closure) {
    this.path = path;
    this.method = method;
    this.closure = closure;
  }
}

module.exports = Route;
