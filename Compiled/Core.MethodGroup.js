///<reference path="Core.Collections.ts"/>
var Core;
(function (Core) {
    class MethodGroup {
        constructor(target) {
            this.attachedListeners = new Core.Collections.GenericCollection();
            this.attachedHandlers = new Core.Collections.GenericCollection();
            //Run time validation
            if (target === null || typeof target === Core.UNDEF)
                throw new Core.Exceptions.ParameterMissingException("target");
            //Initialization
            this.target = target;
        }
        stopPropagation() {
            this.propagationStopped = true;
        }
        invoke(thisArg, ...params) {
            thisArg = thisArg || null;
            this.propagationStopped = false;
            //Invoke all attached listeners
            for (let i = 0; i < this.attachedListeners.length && !this.propagationStopped; i++)
                this.attachedListeners[i](thisArg, [this.target, ...params]);
            //Invoke all attached handlers
            for (let i = 0; i < this.attachedHandlers.length && !this.propagationStopped; i++)
                this.attachedHandlers[i].invoke.apply(thisArg, [this.target, ...params]);
        }
        attach(listener) {
            //Run time validation
            if (!(listener instanceof Function) && !(listener instanceof MethodGroup))
                throw new Core.Exceptions.InvalidParameterTypeException("target", [Function, MethodGroup]);
            if (listener instanceof MethodGroup)
                this.attachedHandlers.add(listener);
            else
                this.attachedListeners.add(listener);
        }
        detach(listener) {
            //Run time validation
            if (!(listener instanceof Function) && !(listener instanceof MethodGroup))
                throw new Core.Exceptions.InvalidParameterTypeException("target", [Function, MethodGroup]);
            if (listener instanceof MethodGroup)
                this.attachedHandlers.remove(listener);
            else
                this.attachedListeners.remove(listener);
        }
    }
    Core.MethodGroup = MethodGroup;
})(Core || (Core = {}));
