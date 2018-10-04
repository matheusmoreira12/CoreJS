///<reference path="Collections.List.ts"/>

namespace Core.Collections {

    let parentTreeItemKey = Symbol("parentTreeItem");

    function setParent<T extends TreeItem<any>>(item: T, parent: TreeItem<any>) {
        item.items.listChangedEvent.attach(parent.items.listChangedEvent);

        item[parentKey] = parent;
    }

    function unsetParent<T extends TreeItem<any>>(item: T) {
        item.items.listChangedEvent.detach(item.parent.items.listChangedEvent);

        item[parentKey] = null;
    }

    export class TreeItemList<T extends TreeItem<any>> extends List<T> {
        constructor(parentTreeItem: TreeItem<any>, ...items: T[]) {
            super(...items);

            this[parentTreeItemKey] = parentTreeItem;
        }

        protected _onListChanged(sender: List<T>, e: ListChangedEventArgs<T>): void {
            super._onListChanged(sender, e);

            if (e.mode & ListChangeMode.Added)
                for (let item of e.newItems)
                    setParent(item, this.parentTreeItem);

            if (e.mode & ListChangeMode.Removed)
                for (let item of e.oldItems)
                    unsetParent(item);
        }

        public get parentTreeItem() { return this[parentTreeItemKey]; }
    }

    let parentKey = Symbol("parent");
    let itemsKey = Symbol("items");

    export class TreeItem<T extends TreeItem<any>> {
        constructor(...items: T[]) {
            this[itemsKey] = new TreeItemList<T>(this, ...items);
            this[parentKey] = null;
        }

        public *listItemsWithRecursion(): Iterable<T> {
            yield* this.items;

            for (let item of this.items)
                yield* item.items;
        }

        public get items(): TreeItemList<T> { return this[itemsKey]; }
        public get parent(): TreeItem<T> { return this[parentKey]; }
    }

}