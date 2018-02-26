///<reference path="Core.Exceptions.ts"/>
var Core;
(function (Core) {
    var Collections;
    (function (Collections) {
        class GenericCollection extends Array {
            constructor(...items) {
                //Initialization
                super(...items);
                this.itemAddedEvent = new Core.MethodGroup(this);
                this.itemRemovedEvent = new Core.MethodGroup(this);
                this.itemMovedEvent = new Core.MethodGroup(this);
                this.itemChangedEvent = new Core.MethodGroup(this);
            }
            invokeOnItemAdded(item, index) {
                this.itemAddedEvent.invoke(null, item, index);
            }
            invokeOnItemRemoved(item) {
                this.itemRemovedEvent.invoke(null, item);
            }
            invokeOnItemMoved(item, oldIndex, newIndex) {
                this.itemAddedEvent.invoke(null, item, oldIndex, newIndex);
            }
            invokeOnItemChanged(oldItem, newItem, index) {
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
            addMultiple(...items) {
                items.forEach((item, index) => this.invokeOnItemAdded(item, this.length));
                super.push(...items);
            }
            //Adds an item to this collection
            add(item) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("item", item, [], true);
                this.invokeOnItemAdded(item, this.length - 1);
                super.push(item);
            }
            //Inserts multiple items into this collection, starting at the specified zero-based position
            insertMultiple(index, ...items) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("index", index, Core.NUMBER, true);
                Core.Validation.RuntimeValidator.validateParameter("items", items, Array, true, false);
                items.forEach((item, _index) => this.invokeOnItemAdded(item, _index + index));
                super.splice(index, 0, ...items);
            }
            //Inserts an item into this collection at the specified zero-based position
            insert(item, index) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("item", item, [], true);
                Core.Validation.RuntimeValidator.validateParameter("index", index, Core.NUMBER, true, false);
                this.invokeOnItemAdded(item, index);
                super.splice(index, 0, item);
            }
            moveAt(oldIndex, newIndex) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("oldIndex", oldIndex, Core.NUMBER, true, false);
                Core.Validation.RuntimeValidator.validateParameter("newIndex", newIndex, Core.NUMBER, true, false);
                let item = this.removeAt(oldIndex);
                this.invokeOnItemMoved(item, oldIndex, newIndex);
                this.insert(item, newIndex);
            }
            move(item, newIndex) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("item", item, [], true);
                Core.Validation.RuntimeValidator.validateParameter("newIndex", newIndex, Core.NUMBER, true, false);
                let itemIndex = this.indexOf(item);
                if (itemIndex == -1)
                    throw new Core.Exceptions.Exception("Could not move item because it is not contained within this" +
                        " <type>GenericCollection</type>.");
                this.move(itemIndex, newIndex);
            }
            //Removes the item at the specified zero-based position from this collection
            removeAt(index) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("index", index, Core.NUMBER, true, false);
                return super.splice(index, 1)[0];
            }
            //Removes an specific item from this collection
            remove(item) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("item", item, [], true);
                let itemIndex = this.indexOf(item);
                if (itemIndex == -1)
                    throw new Core.Exceptions.Exception("Could not remove item because it is not contained within this" +
                        " <type>GenericCollection</type>.");
                this.removeAt(itemIndex);
            }
            //Removes a set of specific items from this collection
            removeMultiple(...items) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("items", items, Array, true);
                items.forEach((item) => this.remove(item));
            }
            //Selects a value from each of the collection elements with the specified function
            select(selectFn, thisArg) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("selectFn", selectFn, Function, true);
                let result = new Array();
                this.forEach((item, i) => result.push(selectFn.call(thisArg, this[i])));
                return result;
            }
        }
        Collections.GenericCollection = GenericCollection;
        class GenericTreeItem extends GenericCollection {
            constructor(value, ...items) {
                super(...items);
                this.value = value || null;
                this.parent = null;
            }
            add(treeItem) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("treeItem", treeItem, GenericTreeItem, true);
                //Make sure the tree item is correctly detached from its parent
                if (treeItem.parent != null)
                    treeItem.parent.remove(treeItem);
                treeItem.parent = this;
                super.add(treeItem);
            }
            remove(treeItem) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("treeItem", treeItem, GenericTreeItem, true);
                treeItem.parent = null;
                super.remove(treeItem);
            }
            selectRecursive(selectFn, thisArg) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("selectFn", selectFn, Function, true);
                let result = this.select(selectFn, thisArg);
                //Next recursion level
                this.forEach((item) => {
                    result = result.concat(item.selectRecursive(selectFn, thisArg));
                });
                return result;
            }
            filterRecursive(testFn, thisArg) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("testFn", testFn, Function, true);
                let result = this.filter(testFn, thisArg);
                //Next recursion level
                this.forEach((item) => {
                    result = result.concat(item.filterRecursive(testFn, thisArg));
                });
                return result;
            }
            someRecursive(testFn, thisArg) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("testFn", testFn, Function, true);
                let result = this.some(testFn);
                //Next recursion level
                this.forEach((item) => { result = result || item.someRecursive(testFn, thisArg); });
                return result;
            }
            everyRecursive(testFn, thisArg) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("testFn", testFn, Function, true);
                let result = this.every(testFn);
                //Next recursion level
                this.forEach((item) => { result = result && item.everyRecursive(testFn, thisArg); });
                return result;
            }
            getByValue(value) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("value", value, [], true);
                return this.filter((item) => { return Object.is(value, item.value); });
            }
        }
        Collections.GenericTreeItem = GenericTreeItem;
    })(Collections = Core.Collections || (Core.Collections = {}));
})(Core || (Core = {}));
