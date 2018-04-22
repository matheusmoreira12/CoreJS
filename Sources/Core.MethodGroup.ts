///<reference path="Core.Validation.ts"/>

namespace Core {

    export type Method = (target: any, args: Object) => void;

    export class MethodGroup {

        /**
         * Initializes a new instance of the class <MethodGroup>.
         * @param target The target that gets passed to the listeners when this <MethodGroup> is invoked.
         * @param defaultListener The default listener for this <MethodGroup>.
         */
        constructor(target, defaultListener?) {
            //Initialization
            this.target = target;
            if (defaultListener)
                this.attach(defaultListener);
        }

        /**
         * Detaches the specified <MethodGroup> from this <MethodGroup>.
         */
        private attachedListeners = new Array<Method>();
        /**
         * Detaches the specified method from this <MethodGroup>.
         */
        private attachedHandlers = new Array<MethodGroup>();
        private propagationStopped: boolean;

        protected target;

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
        invoke(args: Object) {
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
        attach(listener: MethodGroup | Method) {
            if (listener instanceof MethodGroup)
                this.attachedHandlers.push(listener);
            else
                this.attachedListeners.push(listener);
        }

        private _detachHandler(handler: MethodGroup) {
            let index = this.attachedHandlers.indexOf(handler);
            this.attachedHandlers.splice(index, 1);
        }

        private _detachListener(listener: Method) {
            let index = this.attachedListeners.indexOf(listener);
            this.attachedListeners.splice(index, 1);
        }

        /**
         * Detaches the specified method or <MethodGroup> from this <MethodGroup>.
         * @param listener The method or <MethodGroup> to be detached.
         */
        detach(listener: MethodGroup | Method) {
            if (listener instanceof MethodGroup)
                this._detachHandler(listener);
            else
                this._detachListener(listener);
        }
    }
}