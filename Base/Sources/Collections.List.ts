///<reference path="Events.ts"/>
///<reference path="Collections.SimpleList.ts"/>

namespace Core.Collections {

    export enum ListChangeMode { Added = 1, Removed = 2 }

    export type ListChangedEventArgs<T> = {
        mode: ListChangeMode,
        oldItems: T[],
        oldIndex: number,
        newItems: T[],
        newIndex: number
    }

    export type ListChangedEventListener<T> = (sender: List<T>, e: ListChangedEventArgs<T>) => void;

    export class ListChangedEvent<T> extends Event {
        constructor(thisArg?: any, defaultListener?: ListChangedEventListener<T>) {
            super(thisArg, defaultListener);
        }

        attach(listener: ListChangedEventListener<T> | ListChangedEvent<T>): void {
            super.attach(listener);
        }

        detach(listener: ListChangedEventListener<T> | ListChangedEvent<T>): void {
            super.attach(listener);
        }

        invoke(sender: List<T>, e: ListChangedEventArgs<T>): void {
            super.invoke(sender, e);
        }
    }

    function notifyListChange<T>(list: List<T>, itemsWereRemoved: boolean, itemsWereAdded: boolean,
        oldIndex: number, oldItems: T[], newIndex: number, newItems: T[]) {

        list.invokeOnListChanged({
            mode: (itemsWereRemoved ? ListChangeMode.Removed : 0) |
                (itemsWereAdded ? ListChangeMode.Added : 0),
            oldIndex: itemsWereRemoved ? oldIndex : null,
            oldItems: itemsWereRemoved ? oldItems : null,
            newIndex: itemsWereAdded ? newIndex : null,
            newItems: itemsWereAdded ? newItems : null
        });
    }

    export class List<T> extends SimpleList<T> {

        public constructor(...items: T[]) {
            super(...items);
        }

        public push(...items: T[]): number {
            let length = super.push(...items);

            notifyListChange(this, false, true, null, null, length - 1, items);

            return length;
        }

        public splice(start: number, deleteCount: number, ...items: T[]) {
            let oldItems = super.splice(start, deleteCount, ...items);

            let itemsWereRemoved = deleteCount > 0;
            let itemsWereAdded = items.length > 0;

            notifyListChange(this, itemsWereRemoved, itemsWereAdded, null, null, length - 1, items);

            return oldItems;
        }

        protected _onListChanged(sender: List<T>, e: ListChangedEventArgs<T>): void { }

        public invokeOnListChanged(e: ListChangedEventArgs<T>) {
            if (this.listChangedEvent) this.listChangedEvent.invoke(this, e);
        }

        public listChangedEvent: ListChangedEvent<T> = new ListChangedEvent<T>(this, this._onListChanged);
    }

}