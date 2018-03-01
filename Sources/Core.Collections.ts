///<reference path="Core.ts"/>
///<reference path="Core.Exceptions.ts"/>
///<reference path="Core.Validation.ts"/>
///<reference path="Core.MethodGroup.ts"/>

namespace Core.Collections {

    export class GenericCollection<T> extends Array<T> {
        constructor(...items: T[]) {

            //Initialization
            super(...items);
        }

        itemAddedEvent: MethodGroup = new MethodGroup(this);
        protected invokeOnItemAdded(item, index) {
            this.itemAddedEvent.invoke(null, item, index);
        }

        itemRemovedEvent: MethodGroup = new MethodGroup(this);
        protected invokeOnItemRemoved(item) {
            this.itemRemovedEvent.invoke(null, item);
        }

        itemMovedEvent: MethodGroup = new MethodGroup(this);
        protected invokeOnItemMoved(item, oldIndex, newIndex) {
            this.itemAddedEvent.invoke(null, item, oldIndex, newIndex);
        }

        itemChangedEvent: MethodGroup = new MethodGroup(this);
        protected invokeOnItemChanged(oldItem, newItem, index) {
            this.itemChangedEvent.invoke(null, oldItem, newItem, index);
        }

        //Gets the first item in this GenericCollection
        get first() {
            if (length == 0)
                return null;

            return this[0];
        }

        //Gets the last item in this GenericCollection
        get last() {
            if (length == 0)
                return null;

            return this[this.length - 1];
        }

        //Adds multiple items to the end of this collection
        addMultiple(...items: T[]) {
            items.forEach((item, index) => this.invokeOnItemAdded(item, this.length));

            super.push(...items);
        }

        //Adds an item to this collection
        add(item: T) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("item", item, [], true);

            this.invokeOnItemAdded(item, this.length - 1);

            super.push(item);
        }

        //Inserts multiple items into this collection, starting at the specified zero-based position
        insertMultiple(index: number, ...items: T[]) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("index", index, NUMBER, true);
            Validation.RuntimeValidator.validateParameter("items", items, Array, true, false)

            items.forEach((item, _index) => this.invokeOnItemAdded(item, _index + index));

            super.splice(index, 0, ...items);
        }

        //Inserts an item into this collection at the specified zero-based position
        insert(item: T, index: number) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("item", item, [], true);
            Validation.RuntimeValidator.validateParameter("index", index, NUMBER, true, false);

            this.invokeOnItemAdded(item, index);

            super.splice(index, 0, item);
        }

        moveAt(oldIndex, newIndex) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("oldIndex", oldIndex, NUMBER, true, false);
            Validation.RuntimeValidator.validateParameter("newIndex", newIndex, NUMBER, true, false);

            let item = this.removeAt(oldIndex);

            this.invokeOnItemMoved(item, oldIndex, newIndex);

            this.insert(item, newIndex);
        }

        move(item, newIndex) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("item", item, [], true);
            Validation.RuntimeValidator.validateParameter("newIndex", newIndex, NUMBER, true, false);

            let itemIndex = this.indexOf(item);
            if (itemIndex == -1)
                throw new Exceptions.Exception("Could not move item because it is not contained within this" +
                    " <type>GenericCollection</type>.")

            this.move(itemIndex, newIndex);
        }

        //Removes the item at the specified zero-based position from this collection
        removeAt(index: number): T {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("index", index, NUMBER, true, false);

            return super.splice(index, 1)[0];
        }

        //Removes an specific item from this collection
        remove(item: T) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("item", item, [], true);

            let itemIndex = this.indexOf(item);
            if (itemIndex == -1)
                throw new Exceptions.Exception("Could not remove item because it is not contained within this" +
                    " <type>GenericCollection</type>.")

            this.removeAt(itemIndex);
        }

        //Removes a set of specific items from this collection
        removeMultiple(...items: T[]) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("items", items, Array, true);

            items.forEach((item) => this.remove(item));
        }

        //Selects a value from each of the collection elements with the specified function
        select<U>(selectFn: (T) => U, thisArg) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("selectFn", selectFn, Function, true);

            let result: U[] = new Array<U>();

            this.forEach((item, i) => result.push(selectFn.call(thisArg, this[i])));

            return result;
        }
    }

    export class KeyValuePair<Tkey, Tvalue> {
        constructor(key: Tkey, value: Tvalue) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("key", key, [], true);
            Validation.RuntimeValidator.validateParameter("value", key, [], true);

            this.key = key;
            this.value = value;
        }

        key: Tkey;
        value: Tvalue;
    }

    export class GenericDictionary<Tkey, Tvalue> extends GenericCollection<KeyValuePair<Tkey, Tvalue>> {

        constructor(...items: KeyValuePair<Tkey, Tvalue>[]) {
            //Runtime validation
            Validation.RuntimeValidator.validateArrayParameter("items", items, KeyValuePair, false);

            //Initialization
            super(...items);
        }

        add(item: KeyValuePair<Tkey, Tvalue>) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("items", item, KeyValuePair, true, false);

            //Check for any other item with the same key before adding 
            let homonym = this.getValue(item.key);
            if (homonym !== null)
                throw new Exceptions.InvalidOperationException("Cannot add item. Another {0} with the same name has already" +
                    "been added.", null, Exceptions.Exception.getMessageTag("type", "KeyValuePair"));

            super.add(item);
        }

        remove(item: KeyValuePair<Tkey, Tvalue>) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("items", item, KeyValuePair, true, false);

            super.remove(item);
        }

        getValue(key: Tkey): Tvalue {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("key", key, STRING, true, false);

            let matches = this.filter((keyValuePair) => Object.is(keyValuePair.key, key));

            if (matches.length == 0)
                return null;

            return matches[0].value;
        }
    }

    export class GenericTreeItem<T> extends GenericCollection<GenericTreeItem<T>> {

        constructor(value?: T, ...items: GenericTreeItem<T>[]) {
            super(...items);

            this.value = value || null;
            this.parent = null;
        }

        value: T;
        parent: GenericTreeItem<T>;

        add(treeItem: GenericTreeItem<T>) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("treeItem", treeItem, GenericTreeItem, true);

            //Make sure the tree item is correctly detached from its parent
            if (treeItem.parent != null)
                treeItem.parent.remove(treeItem);

            treeItem.parent = this;

            super.add(treeItem);
        }

        remove(treeItem: GenericTreeItem<T>) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("treeItem", treeItem, GenericTreeItem, true);

            treeItem.parent = null;

            super.remove(treeItem);
        }

        selectRecursive<U>(selectFn: (T) => U, thisArg?): any[] {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("selectFn", selectFn, Function, true);

            let result: U[] = this.select<U>(selectFn, thisArg);

            //Next recursion level
            this.forEach((item: GenericTreeItem<T>) => {
                result = result.concat(item.selectRecursive(selectFn, thisArg));
            });

            return result;
        }

        filterRecursive(testFn: (T) => boolean, thisArg?): GenericTreeItem<T>[] {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("testFn", testFn, Function, true);

            let result: GenericTreeItem<T>[] = this.filter(testFn, thisArg);

            //Next recursion level
            this.forEach((item: GenericTreeItem<T>) => {
                result = result.concat(item.filterRecursive(testFn, thisArg));
            });

            return result;
        }

        someRecursive(testFn: (T) => boolean, thisArg?): boolean {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("testFn", testFn, Function, true);

            let result: boolean = this.some(testFn);

            //Next recursion level
            this.forEach((item: GenericTreeItem<T>) => { result = result || item.someRecursive(testFn, thisArg); });

            return result;
        }

        everyRecursive(testFn: (T) => boolean, thisArg?): boolean {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("testFn", testFn, Function, true);

            let result: boolean = this.every(testFn);

            //Next recursion level
            this.forEach((item: GenericTreeItem<T>) => { result = result && item.everyRecursive(testFn, thisArg); });

            return result;
        }

        getByValue(value: T): GenericTreeItem<T>[] {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("value", value, [], true);

            return this.filter((item: GenericTreeItem<T>) => { return Object.is(value, item.value); });
        }
    }
}