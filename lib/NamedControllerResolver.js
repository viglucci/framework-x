
class NamedControllerResolver {

    constructor(container) {
        this.container = container;
    }

    resolve(handler) {
        const parts = handler.split('.');
        const controllerName = parts[0];
        const methodName = parts[1];
        const controller = this.container.resolve(controllerName);
        if (!controller) {
            throw new Error(`Could not resolve controller with name ${controllerName}`);
        }
        return controller[methodName].bind(controller);
    }
}

module.exports = NamedControllerResolver;
