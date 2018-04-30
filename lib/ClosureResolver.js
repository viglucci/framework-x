
class ClosureResolver {
  resolve(handler) {
    return handler.bind(handler);
  }
}

module.exports = ClosureResolver;

