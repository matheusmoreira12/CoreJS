///<reference path="MethodGroup.ts"/>

namespace Core {
    export type EventListener = (sender: any, e: object) => void;

    export type ArgumentTransformerFunction = (...args: any[]) => any[];

    export class Event extends MethodGroup {
        public constructor(thisArg?: any, defaultListener?: EventListener) {
            super(thisArg);

            if (defaultListener)
                this.attach(defaultListener);
        }

        public attach(listener: EventListener | Event): void {
            super.attach(listener);
        }

        public detach(listener: EventListener | Event): void {
            super.detach(listener);
        }

        public watch(node: Node, domEvtName: string, argTrans: ArgumentTransformerFunction
            = (...args) => args): void {

        }

        public unwatch(node: Node, domEvtName: string): void {

        }

        public invoke(sender: any, e: object): void {
            super.invoke(sender, e);
        }
    }
}