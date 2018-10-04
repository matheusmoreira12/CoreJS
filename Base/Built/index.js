var Core;
(function (Core) {
    var Collections;
    (function (Collections) {
        class SimpleList extends Array {
            constructor(...items) {
                super(...items);
            }
            remove(item) {
                let index = this.indexOf(item);
                if (index == -1)
                    throw new Error("Cannot remove item. Item not found.");
                this.splice(index, 1);
            }
        }
        Collections.SimpleList = SimpleList;
    })(Collections = Core.Collections || (Core.Collections = {}));
})(Core || (Core = {}));
///<reference path="Collections.SimpleList.ts"/>
var Core;
(function (Core) {
    const thisArgKey = Symbol("thisArg");
    const attachedGroupsKey = Symbol("attachedGroups");
    const attachedMethodsKey = Symbol("attachedMethods");
    const isPropagationStoppedKey = Symbol("isPropagationStopped");
    class MethodGroup {
        constructor(thisArg) {
            this[thisArgKey] = thisArg;
            this[attachedGroupsKey] = new Core.Collections.SimpleList();
            this[attachedMethodsKey] = new Core.Collections.SimpleList();
            //Set propagation stopped flag
            this[isPropagationStoppedKey] = false;
        }
        attach(method) {
            if (method instanceof MethodGroup)
                this.attachedGroups.push(method);
            else if (method instanceof Function)
                this.attachedMethods.push(method);
            else
                throw new Error("Invalid value for parameter \"method\". A Function or a MethodGroup was expected.");
        }
        detach(method) {
            if (method instanceof MethodGroup)
                this.attachedGroups.remove(method);
            else if (method instanceof Function)
                this.attachedMethods.remove(method);
            else
                throw new Error("Invalid value for parameter \"method\". A Function or a MethodGroup was expected.");
        }
        invoke(...args) {
            //Set propagation stopped flag
            this[isPropagationStoppedKey] = false;
            for (let method of this.attachedMethods)
                method.call(this.thisArg, ...args);
            for (let group of this.attachedGroups)
                group.invoke(...args);
        }
        stopPropagation() {
            //Set propagation stopped flag
            this[isPropagationStoppedKey] = true;
        }
        get thisArg() { return this[thisArgKey]; }
        get attachedGroups() { return this[attachedGroupsKey]; }
        get attachedMethods() { return this[attachedMethodsKey]; }
        get isPropagationStopped() { return this[isPropagationStoppedKey]; }
    }
    Core.MethodGroup = MethodGroup;
})(Core || (Core = {}));
///<reference path="MethodGroup.ts"/>
var Core;
(function (Core) {
    class Event extends Core.MethodGroup {
        constructor(thisArg, defaultListener) {
            super(thisArg);
            if (defaultListener)
                this.attach(defaultListener);
        }
        attach(listener) {
            super.attach(listener);
        }
        detach(listener) {
            super.detach(listener);
        }
        watch(node, domEvtName, argTrans = (...args) => args) {
        }
        unwatch(node, domEvtName) {
        }
        invoke(sender, e) {
            super.invoke(sender, e);
        }
    }
    Core.Event = Event;
})(Core || (Core = {}));
///<reference path="Events.ts"/>
///<reference path="Collections.SimpleList.ts"/>
var Core;
(function (Core) {
    var Collections;
    (function (Collections) {
        let ListChangeMode;
        (function (ListChangeMode) {
            ListChangeMode[ListChangeMode["Added"] = 1] = "Added";
            ListChangeMode[ListChangeMode["Removed"] = 2] = "Removed";
        })(ListChangeMode = Collections.ListChangeMode || (Collections.ListChangeMode = {}));
        class ListChangedEvent extends Core.Event {
            constructor(thisArg, defaultListener) {
                super(thisArg, defaultListener);
            }
            attach(listener) {
                super.attach(listener);
            }
            detach(listener) {
                super.attach(listener);
            }
            invoke(sender, e) {
                super.invoke(sender, e);
            }
        }
        Collections.ListChangedEvent = ListChangedEvent;
        function notifyListChange(list, itemsWereRemoved, itemsWereAdded, oldIndex, oldItems, newIndex, newItems) {
            list.invokeOnListChanged({
                mode: (itemsWereRemoved ? ListChangeMode.Removed : 0) |
                    (itemsWereAdded ? ListChangeMode.Added : 0),
                oldIndex: itemsWereRemoved ? oldIndex : null,
                oldItems: itemsWereRemoved ? oldItems : null,
                newIndex: itemsWereAdded ? newIndex : null,
                newItems: itemsWereAdded ? newItems : null
            });
        }
        class List extends Collections.SimpleList {
            constructor(...items) {
                super(...items);
                this.listChangedEvent = new ListChangedEvent(this, this._onListChanged);
            }
            push(...items) {
                let length = super.push(...items);
                notifyListChange(this, false, true, null, null, length - 1, items);
                return length;
            }
            splice(start, deleteCount, ...items) {
                let oldItems = super.splice(start, deleteCount, ...items);
                let itemsWereRemoved = deleteCount > 0;
                let itemsWereAdded = items.length > 0;
                notifyListChange(this, itemsWereRemoved, itemsWereAdded, null, null, length - 1, items);
                return oldItems;
            }
            _onListChanged(sender, e) { }
            invokeOnListChanged(e) {
                if (this.listChangedEvent)
                    this.listChangedEvent.invoke(this, e);
            }
        }
        Collections.List = List;
    })(Collections = Core.Collections || (Core.Collections = {}));
})(Core || (Core = {}));
///<reference path="Events.ts"/>
///<reference path="Collections.List.ts"/>
var Core;
(function (Core) {
    var Collections;
    (function (Collections) {
        class KeyValuePair {
            constructor(key, value) {
                this.key = key;
                this.value = value;
            }
        }
        Collections.KeyValuePair = KeyValuePair;
        class Dictionary extends Collections.List {
            indexOfKey(key) { return this.findIndex(i => Object.is(i.key, key)); }
            containsKey(key) { return this.indexOfKey(key) > -1; }
            getValue(key) {
                let index = this.indexOfKey(key);
                if (index == -1)
                    return undefined;
                return this[index].value;
            }
            setValue(key, value) {
                let index = this.findIndex(i => i.key == key);
                if (index > -1)
                    this[index].value = value;
                else
                    this.push(new KeyValuePair(key, value));
            }
        }
        Collections.Dictionary = Dictionary;
    })(Collections = Core.Collections || (Core.Collections = {}));
})(Core || (Core = {}));
///<reference path="Collections.List.ts"/>
var Core;
(function (Core) {
    var Collections;
    (function (Collections) {
        let parentTreeItemKey = Symbol("parentTreeItem");
        function setParent(item, parent) {
            item.items.listChangedEvent.attach(parent.items.listChangedEvent);
            item[parentKey] = parent;
        }
        function unsetParent(item) {
            item.items.listChangedEvent.detach(item.parent.items.listChangedEvent);
            item[parentKey] = null;
        }
        class TreeItemList extends Collections.List {
            constructor(parentTreeItem, ...items) {
                super(...items);
                this[parentTreeItemKey] = parentTreeItem;
            }
            _onListChanged(sender, e) {
                super._onListChanged(sender, e);
                if (e.mode & Collections.ListChangeMode.Added)
                    for (let item of e.newItems)
                        setParent(item, this.parentTreeItem);
                if (e.mode & Collections.ListChangeMode.Removed)
                    for (let item of e.oldItems)
                        unsetParent(item);
            }
            get parentTreeItem() { return this[parentTreeItemKey]; }
        }
        Collections.TreeItemList = TreeItemList;
        let parentKey = Symbol("parent");
        let itemsKey = Symbol("items");
        class TreeItem {
            constructor(...items) {
                this[itemsKey] = new TreeItemList(this, ...items);
                this[parentKey] = null;
            }
            *listItemsWithRecursion() {
                yield* this.items;
                for (let item of this.items)
                    yield* item.items;
            }
            get items() { return this[itemsKey]; }
            get parent() { return this[parentKey]; }
        }
        Collections.TreeItem = TreeItem;
    })(Collections = Core.Collections || (Core.Collections = {}));
})(Core || (Core = {}));
//# sourceMappingURL=index.js.map