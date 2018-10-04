declare namespace Core {
    type Method = (target: any, args: Object) => void;
    class MethodGroup {
        /**
         * Initializes a new instance of the class <MethodGroup>.
         * @param target The target that gets passed to the listeners when this <MethodGroup> is invoked.
         * @param defaultListener The default listener for this <MethodGroup>.
         */
        constructor(target: any, defaultListener?: any);
        /**
         * Detaches the specified <MethodGroup> from this <MethodGroup>.
         */
        private attachedListeners;
        /**
         * Detaches the specified method from this <MethodGroup>.
         */
        private attachedHandlers;
        private propagationStopped;
        protected target: any;
        /**
         * Stops the propation of this <MethodGroup>.
         */
        stopPropagation(): void;
        /**
         * Invokes all the listeners associated with this <MethodGroup>.
         * @param args The method arguments object.
         */
        invoke(args: Object): void;
        /**
         * Attaches the specified method or <MethodGroup> to this <MethodGroup>.
         * @param listener The method or <MethodGroup> to be attached.
         */
        attach(listener: MethodGroup | Method): void;
        private _detachHandler(handler);
        private _detachListener(listener);
        /**
         * Detaches the specified method or <MethodGroup> from this <MethodGroup>.
         * @param listener The method or <MethodGroup> to be detached.
         */
        detach(listener: MethodGroup | Method): void;
    }
}
