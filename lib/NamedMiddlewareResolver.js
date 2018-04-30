
class NamedMiddlewareResolver {

    constructor(container) {
        this.container = container;
    }

    resolve(middlewareName) {
        const middleware = this.container.resolve(middlewareName);
        if (!middleware) {
            throw new Error(`Could not resolve middleware with name ${middlewareName}`);
        }
        return middleware.handle.bind(middleware);
    }
}

module.exports = NamedMiddlewareResolver;
