///<reference path="Collections.SimpleList.ts"/>

namespace Core {
    export type Method = (...args: any[]) => any;

    const thisArgKey = Symbol("thisArg");
    const attachedGroupsKey = Symbol("attachedGroups");
    const attachedMethodsKey = Symbol("attachedMethods");
    const isPropagationStoppedKey = Symbol("isPropagationStopped");

    export class MethodGroup {
        public constructor(thisArg?: any) {
            this[thisArgKey] = thisArg;
            this[attachedGroupsKey] = new Collections.SimpleList();
            this[attachedMethodsKey] = new Collections.SimpleList();

            //Set propagation stopped flag
            this[isPropagationStoppedKey] = false;
        }

        public attach(method: Method | MethodGroup): void {
            if (method instanceof MethodGroup)
                this.attachedGroups.push(method);
            else if (method instanceof Function)
                this.attachedMethods.push(method);
            else
                throw new Error("Invalid value for parameter \"method\". A Function or a MethodGroup was expected.");
        }

        public detach(method: Method | MethodGroup): void {
            if (method instanceof MethodGroup)
                this.attachedGroups.remove(method);
            else if (method instanceof Function)
                this.attachedMethods.remove(method);
            else
                throw new Error("Invalid value for parameter \"method\". A Function or a MethodGroup was expected.");
        }

        invoke(...args: any[]): void {
            //Set propagation stopped flag
            this[isPropagationStoppedKey] = false;

            for (let method of this.attachedMethods) method.call(this.thisArg, ...args);

            for (let group of this.attachedGroups) group.invoke(...args);
        }

        public stopPropagation() {
            //Set propagation stopped flag
            this[isPropagationStoppedKey] = true;
        }

        public get thisArg(): any { return this[thisArgKey]; }
        public get attachedGroups(): Collections.SimpleList<MethodGroup> { return this[attachedGroupsKey]; }
        public get attachedMethods(): Collections.SimpleList<Method> { return this[attachedMethodsKey]; }
        public get isPropagationStopped(): boolean { return this[isPropagationStoppedKey]; }
    }
}