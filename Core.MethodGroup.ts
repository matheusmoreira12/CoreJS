///<reference path="Core.Collections.ts"/>

namespace Core {

    export type EventListenerDecorator = (source : any, ...params : any[])=>void;

    export class MethodGroup {
        
        constructor(target) {
            //Run time validation
            if (target === null || typeof target === UNDEF)
                throw new Exceptions.ParameterMissingException("target");

            //Initialization
            this.target = target;
        }
        
        private attachedListeners = new Collections.GenericCollection<EventListenerDecorator>();
        private attachedHandlers = new Collections.GenericCollection<MethodGroup>();
        private propagationStopped: boolean;

        protected target;
        
        stopPropagation() {
            this.propagationStopped = true;
        }

        invoke(thisArg?: any, ...params: any[]) {
            thisArg = thisArg || null;
            this.propagationStopped = false;
            
            //Invoke all attached listeners
            for (let i = 0; i < this.attachedListeners.length && !this.propagationStopped; i++)
                this.attachedListeners[i](thisArg, [this.target, ...params]);
            
            //Invoke all attached handlers
            for (let i = 0; i < this.attachedHandlers.length && !this.propagationStopped; i++)
                this.attachedHandlers[i].invoke.apply(thisArg, [this.target, ...params]);
        }
        
        attach(listener : MethodGroup | EventListenerDecorator) {
            //Run time validation
            if (!(listener instanceof Function) && !(listener instanceof MethodGroup))
                throw new Exceptions.InvalidParameterTypeException("target", [Function, MethodGroup]);

            if (listener instanceof MethodGroup)
                this.attachedHandlers.add(listener);
            else
                this.attachedListeners.add(listener);
        }

        detach(listener: MethodGroup | EventListenerDecorator) {
            //Run time validation
            if (!(listener instanceof Function) && !(listener instanceof MethodGroup))
                throw new Exceptions.InvalidParameterTypeException("target", [Function, MethodGroup]);

            if (listener instanceof MethodGroup)
                this.attachedHandlers.remove(listener);
            else
                this.attachedListeners.remove(listener);
        }
    }
}