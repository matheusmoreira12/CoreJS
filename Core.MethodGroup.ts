



namespace Core {

    export type EventListenerDecorator = (source : any, ...params : any[])=>void;

    export class MethodGroup {
        
        constructor(target, defaultListener?) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("target", target, [], true);
            Validation.RuntimeValidator.validateParameter("listener", defaultListener, [Function, MethodGroup]);

            //Initialization
            this.target = target;
            if (defaultListener)
                this.attach(defaultListener);
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
        
        attach(listener: MethodGroup | EventListenerDecorator) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("listener", listener, [Function, MethodGroup], true);

            if (listener instanceof MethodGroup)
                this.attachedHandlers.add(listener);
            else
                this.attachedListeners.add(listener);
        }

        detach(listener: MethodGroup | EventListenerDecorator) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("listener", listener, [Function, MethodGroup], true);

            if (listener instanceof MethodGroup)
                this.attachedHandlers.remove(listener);
            else
                this.attachedListeners.remove(listener);
        }
    }
}