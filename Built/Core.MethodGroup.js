var Core;
(function (Core) {
    class MethodGroup {
        /**
         * Initializes a new instance of the class <MethodGroup>.
         * @param target The target that gets passed to the listeners when this <MethodGroup> is invoked.
         * @param defaultListener The default listener for this <MethodGroup>.
         */
        constructor(target, defaultListener) {
            /**
             * Detaches the specified <MethodGroup> from this <MethodGroup>.
             */
            this.attachedListeners = new Array();
            /**
             * Detaches the specified method from this <MethodGroup>.
             */
            this.attachedHandlers = new Array();
            //Initialization
            this.target = target;
            if (defaultListener)
                this.attach(defaultListener);
        }
        /**
         * Stops the propation of this <MethodGroup>.
         */
        stopPropagation() {
            this.propagationStopped = true;
        }
        /**
         * Invokes all the listeners associated with this <MethodGroup>.
         * @param args The method arguments object.
         */
        invoke(args) {
            this.propagationStopped = false;
            //Invoke all attached listeners
            for (let listeners of this.attachedListeners) {
                if (this.propagationStopped)
                    break;
                listeners(this.target, args);
            }
            //Invoke all attached handlers
            for (let handler of this.attachedHandlers) {
                if (this.propagationStopped)
                    break;
                handler.invoke(args);
            }
        }
        /**
         * Attaches the specified method or <MethodGroup> to this <MethodGroup>.
         * @param listener The method or <MethodGroup> to be attached.
         */
        attach(listener) {
            if (listener instanceof MethodGroup)
                this.attachedHandlers.push(listener);
            else
                this.attachedListeners.push(listener);
        }
        _detachHandler(handler) {
            let index = this.attachedHandlers.indexOf(handler);
            this.attachedHandlers.splice(index, 1);
        }
        _detachListener(listener) {
            let index = this.attachedListeners.indexOf(listener);
            this.attachedListeners.splice(index, 1);
        }
        /**
         * Detaches the specified method or <MethodGroup> from this <MethodGroup>.
         * @param listener The method or <MethodGroup> to be detached.
         */
        detach(listener) {
            if (listener instanceof MethodGroup)
                this._detachHandler(listener);
            else
                this._detachListener(listener);
        }
    }
    Core.MethodGroup = MethodGroup;
})(Core || (Core = {}));
//# sourceMappingURL=Core.MethodGroup.js.map