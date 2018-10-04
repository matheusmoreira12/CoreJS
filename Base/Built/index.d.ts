declare namespace Core.Collections {
    class SimpleList<T> extends Array<T> {
        constructor(...items: T[]);
        remove(item: T): void;
    }
}
declare namespace Core {
    type Method = (...args: any[]) => any;
    class MethodGroup {
        constructor(thisArg?: any);
        attach(method: Method | MethodGroup): void;
        detach(method: Method | MethodGroup): void;
        invoke(...args: any[]): void;
        stopPropagation(): void;
        readonly thisArg: any;
        readonly attachedGroups: Collections.SimpleList<MethodGroup>;
        readonly attachedMethods: Collections.SimpleList<Method>;
        readonly isPropagationStopped: boolean;
    }
}
declare namespace Core {
    type EventListener = (sender: any, e: object) => void;
    type ArgumentTransformerFunction = (...args: any[]) => any[];
    class Event extends MethodGroup {
        constructor(thisArg?: any, defaultListener?: EventListener);
        attach(listener: EventListener | Event): void;
        detach(listener: EventListener | Event): void;
        watch(node: Node, domEvtName: string, argTrans?: ArgumentTransformerFunction): void;
        unwatch(node: Node, domEvtName: string): void;
        invoke(sender: any, e: object): void;
    }
}
declare namespace Core.Collections {
    enum ListChangeMode {
        Added = 1,
        Removed = 2,
    }
    type ListChangedEventArgs<T> = {
        mode: ListChangeMode;
        oldItems: T[];
        oldIndex: number;
        newItems: T[];
        newIndex: number;
    };
    type ListChangedEventListener<T> = (sender: List<T>, e: ListChangedEventArgs<T>) => void;
    class ListChangedEvent<T> extends Event {
        constructor(thisArg?: any, defaultListener?: ListChangedEventListener<T>);
        attach(listener: ListChangedEventListener<T> | ListChangedEvent<T>): void;
        detach(listener: ListChangedEventListener<T> | ListChangedEvent<T>): void;
        invoke(sender: List<T>, e: ListChangedEventArgs<T>): void;
    }
    class List<T> extends SimpleList<T> {
        constructor(...items: T[]);
        push(...items: T[]): number;
        splice(start: number, deleteCount: number, ...items: T[]): T[];
        protected _onListChanged(sender: List<T>, e: ListChangedEventArgs<T>): void;
        invokeOnListChanged(e: ListChangedEventArgs<T>): void;
        listChangedEvent: ListChangedEvent<T>;
    }
}
declare namespace Core.Collections {
    class KeyValuePair<Tkey, Tvalue> {
        constructor(key: Tkey, value: Tvalue);
        key: Tkey;
        value: Tvalue;
    }
    class Dictionary<Tkey, Tvalue> extends List<KeyValuePair<Tkey, Tvalue>> {
        indexOfKey(key: Tkey): number;
        containsKey(key: Tkey): boolean;
        getValue(key: Tkey): Tvalue;
        setValue(key: Tkey, value: Tvalue): void;
    }
}
declare namespace Core.Collections {
    class TreeItemList<T extends TreeItem<any>> extends List<T> {
        constructor(parentTreeItem: TreeItem<any>, ...items: T[]);
        protected _onListChanged(sender: List<T>, e: ListChangedEventArgs<T>): void;
        readonly parentTreeItem: any;
    }
    class TreeItem<T extends TreeItem<any>> {
        constructor(...items: T[]);
        listItemsWithRecursion(): Iterable<T>;
        readonly items: TreeItemList<T>;
        readonly parent: TreeItem<T>;
    }
}
declare namespace Core {
    type PromiseResolve<T> = (value?: T | PromiseLike<T>) => void;
    type PromiseReject = (reason?: any) => void;
}
