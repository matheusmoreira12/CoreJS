var Core;
(function (Core) {
    var Collections;
    (function (Collections) {
        var Generic;
        (function (Generic) {
            let propertyKeyIsIndex = k => (typeof k === Core.NUMBER) || (typeof k === Core.STRING && !isNaN(Number(k)));
            class ListProxyHandler {
                set(target, propertyKey, value, receiver) {
                    if (propertyKeyIsIndex(propertyKey)) {
                        target.setItemAt(propertyKey, value);
                        return true;
                    }
                    else
                        return Reflect.set(target, propertyKey, value, receiver);
                }
                get(target, propertyKey, receiver) {
                    if (propertyKeyIsIndex(propertyKey))
                        return target.getItemAt(propertyKey);
                    else
                        return Reflect.get(target, propertyKey, receiver);
                }
            }
            const rawArrayKey = Symbol.for("rawArray");
            class List {
                constructor(arg) {
                    /**
                     * Gets invoked every time an item gets replaced by a new one in this list.
                     */
                    this.listChangedEvent = new Events.ListChangedEvent(this);
                    this[rawArrayKey] = new Array();
                    if (arg) {
                        if (typeof arg === Core.NUMBER)
                            this.fill(undefined, 0, arg);
                        else if (typeof arg[Symbol.iterator] !== Core.UNDEF)
                            this.addRange(arg);
                    }
                    return new Proxy(this, new ListProxyHandler());
                }
                /**
                 * Returns an iterator for this list.
                 */
                [Symbol.iterator]() {
                    return this[rawArrayKey].values();
                }
                /**
                 * Gets an item at the specified zero-based position.
                 * @param index The index of the desired item.
                 * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
                 * bounds.
                 */
                getItemAt(index) {
                    if (index < 0 || index > this.count - 1)
                        throw new Core.Exceptions.ArgumentOutOfRangeException("index");
                    return this[rawArrayKey][index];
                }
                /**
                 * Gets an item at the specified zero-based position.
                 * @param index The index of the desired item.
                 * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
                 * bounds.
                 */
                setItemAt(index, item) {
                    if (index < 0 || index > this.count - 1)
                        throw new Core.Exceptions.ArgumentOutOfRangeException("index");
                    this[rawArrayKey][index] = item;
                }
                /**
                 * Gets the number of elements inside this list.
                 * @returns The number of elements in this list.
                 */
                get count() {
                    return this[rawArrayKey].length;
                }
                /**
                 * Converts this list to an array.
                 * @returns The resulting array.
                 */
                toArray() {
                    return this[rawArrayKey].slice();
                }
                invokeOnListChanged(args) {
                    this.listChangedEvent.invoke(args);
                }
                /**
                 * Gets the first item in this list.
                 * @returns The first item in this list.
                 */
                getFirst() {
                    return this[rawArrayKey].slice(0, 1)[0];
                }
                /**
                 * Gets the last item in this list.
                 * @returns The last item in this list.
                 */
                getLast() {
                    return this[rawArrayKey].slice(-1)[0];
                }
                /**
                 * Returns the zero-based position of the specified item in this list, or -1 if no match is found.
                 * @param item The item being searched.
                 * @param startIndex Optional. The index at which the search is started.
                 * @returns The index of the matching item.
                 */
                indexOf(item, startIndex) {
                    return this[rawArrayKey].indexOf(item, startIndex);
                }
                /**
                 * Returns the last zero-based position of the specified item in this list, or -1 if no match is
                 * found.
                 * @param item The item being searched.
                 * @param endIndex Optional. The index at which the search is stopped.
                 * @returns The index of the last matching item.
                 */
                lastIndexOf(item, endIndex) {
                    return this[rawArrayKey].lastIndexOf(item, endIndex);
                }
                /**
                 * Adds multiple items to this list.
                 * @param items The items being added.
                 */
                addRange(items) {
                    this[rawArrayKey].push(...items);
                }
                /**
                 * Adds an item to this list.
                 * @param item The item being added.
                 */
                add(item) {
                    this[rawArrayKey].push(item);
                }
                /**
                 * Inserts multiple items into this list, starting at the specified zero-based position.
                 * @param index The start position at which to start inserting the items.
                 * @param items The items being inserted.
                 * @throws <Exceptions.InvalidOperationException> if no match is found.
                 * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
                 * bounds.
                 */
                insertRange(index, items) {
                    this[rawArrayKey].splice(index, 0, ...items);
                }
                /**
                 * Inserts an item into this list at the specified zero-based position.
                 * @param index The position at which the item is being inserted.
                 * @param item The item being inserted.
                 * @throws <Exceptions.InvalidOperationException> if no match is found.
                 * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
                 * bounds.
                 */
                insert(index, item) {
                    this[rawArrayKey].splice(index, 0, item);
                }
                /**
                 * Moves an item in this list from a zero-based position to another.
                 * @param oldIndex The position the item is at.
                 * @param newIndex The position the item is being moved to.
                 * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
                 * bounds.
                 */
                move(oldIndex, newIndex) {
                    this.moveRange(oldIndex, newIndex, 1);
                }
                /**
                 * Moves an item in this list from a zero-based position to another.
                 * @param oldIndex The position the item is at.
                 * @param newIndex The position the item is being moved to.
                 * @param itemCount The number of items being moved.
                 * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
                 * bounds.
                 */
                moveRange(oldIndex, newIndex, itemCount = 1) {
                    let array = this[rawArrayKey];
                    array.splice(newIndex, 0, ...array.splice(oldIndex, itemCount));
                }
                /**
                 * Swaps two items at two different zero-based positions.
                 * @param index1 The position of the first item being swapped.
                 * @param index2 The position of the second item being swapped.
                 * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
                 * bounds.
                 */
                swap(index1, index2) {
                    let item1 = this.getItemAt(index1), item2 = this.getItemAt(index2);
                    this.setItemAt(index2, item1);
                    this.setItemAt(index1, item2);
                }
                /**
                 * Removes an item at the specified zero-based position from this list and returns it.
                 * @param index The position of the item being removed.
                 * @returns The item being removed.
                 * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
                 * bounds.
                 */
                removeAt(index) {
                    return this[rawArrayKey].splice(index, 1)[0];
                }
                /**
                 * Removes an specific item from this generic collection.
                 * @param item The item being removed.
                 * @throws <Exceptions.InvalidOperationException> if no match is found.
                 */
                remove(item) {
                    let index = this.indexOf(item);
                    this.removeAt(index);
                }
                /**
                 * Removes the specified number of items from this list, starting at the specified
                 * zero-based position.
                 * @param startIndex The position of the first item being removed.
                 * @param removeCount The number of elements being removed, counting from the start position.
                 * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
                 * bounds.
                 */
                removeRange(startIndex, removeCount) {
                    return this[rawArrayKey].splice(startIndex, removeCount);
                }
                /**
                 * Replaces the item at the specified zero-based position by another, and returns it.
                 * @param index The position of the item being replaced.
                 * @param newItem The item replacing the current item at the specified position.
                 * @returns The item being replaced.
                 */
                replaceAt(index, newItem) {
                    return this[rawArrayKey].splice(index, 1, newItem)[0];
                }
                /**
                 * Replaces an specific item from this generic collection by another.
                 * @param newItem
                 * @param oldItem
                 */
                replace(oldItem, newItem) {
                    let index = this.indexOf(oldItem);
                    this.replaceAt(index, newItem);
                }
                /**
                 * Returns an array containing the items that match the specified predicate.
                 * @param testFn The predicate the items are being tested against.
                 */
                *filter(testFn) {
                    for (let i = 0; i < this.count; i++) {
                        let item = this.getItemAt(i);
                        if (testFn.call(this, item))
                            yield item;
                    }
                }
                /**
                 * Selects a property from each of the items, according to the specified predicate.
                 * @param selectFn The predicate that determines which property is being selected from the
                 */
                *select(selectFn) {
                    for (let i = 0; i < this.count; i++) {
                        let item = this.getItemAt(i);
                        yield selectFn.call(this, item);
                    }
                }
                /**
                 * Returns true if every one of the items in this list matches the specified predicate.
                 * @param testFn The predicate the items are being tested against.
                 */
                every(testFn) {
                    for (let i = 0; i < this.count; i++) {
                        let item = this.getItemAt(i);
                        if (!testFn.call(this, item, i, this))
                            return false;
                    }
                    return true;
                }
                /**
                 * Returns true if any of the items in this list matches the specified predicate.
                 * @param testFn The predicate the items are being tested against.
                 */
                any(testFn) {
                    for (let i = 0; i < this.count; i++) {
                        let item = this.getItemAt(i);
                        if (testFn.call(this, item, i))
                            return true;
                    }
                    return false;
                }
                /**
                 * Returns the first item in this list that matches the specified predicate.
                 * @param testFn The predicate the items are being tested against.
                 */
                first(testFn) {
                    for (let i = 0; i < this.count; i++) {
                        let item = this.getItemAt(i);
                        if (testFn.call(this, item, i))
                            return item;
                    }
                    return undefined;
                }
                /**
                 * Returns the last item in this list that matches the specified predicate.
                 * @param testFn The predicate the items are being tested against.
                 */
                last(testFn) {
                    for (let i = this.count - 1; i >= 0; i++) {
                        let item = this.getItemAt(i);
                        if (testFn.call(this, item, i))
                            return item;
                    }
                    return undefined;
                }
                /**
                 * Fills this list with the spcified value, starting at the specified zero-based position, for the specified
                 * item count.
                 * @param value The item filling this list.
                 * @param startIndex The zero-based start position.
                 * @param count The number of times the specified item is filling this list.
                 */
                fill(value, startIndex, count) {
                    while (this.count < count + startIndex)
                        this.add(value);
                    let rawArray = this[rawArrayKey];
                    rawArray.fill(value, startIndex, count);
                }
            }
            Generic.List = List;
            class KeyValuePair {
                constructor(key, value) {
                    this.key = key;
                    this.value = value;
                }
            }
            Generic.KeyValuePair = KeyValuePair;
            class DictionaryProxyHandler {
                set(target, propertyKey, value, receiver) {
                    if (propertyKeyIsIndex(propertyKey)) {
                        target.setItemAt(propertyKey, value);
                        return true;
                    }
                    else
                        return Reflect.set(target, propertyKey, value, receiver);
                }
                get(target, propertyKey, receiver) {
                    if (propertyKeyIsIndex(propertyKey))
                        return target.getItemAt(propertyKey);
                    else
                        return Reflect.get(target, propertyKey, receiver);
                }
            }
            class Dictionary extends List {
                constructor(items) {
                    super(items);
                    return new Proxy(this, new DictionaryProxyHandler());
                }
                add(item) {
                    if (!this.getByKey(item.key))
                        super.add(item);
                    else
                        throw new Core.Exceptions.InvalidOperationException("The specified key is already in use.");
                }
                setByKey(key, value) {
                    let matchingPair = this.first(item => Object.is(item.key, key));
                    if (!(matchingPair instanceof KeyValuePair))
                        throw new Core.Exceptions.KeyNotFoundException();
                    matchingPair.value = value;
                }
                getByKey(key) {
                    let matchingPair = this.first(item => Object.is(item.key, key));
                    if (!(matchingPair instanceof KeyValuePair))
                        throw new Core.Exceptions.KeyNotFoundException();
                    return matchingPair.value;
                }
                hasKey(key) {
                    let matchingPair = this.first(item => Object.is(item.key, key));
                    return matchingPair instanceof KeyValuePair;
                }
            }
            Generic.Dictionary = Dictionary;
            class GenericTreeItem extends List {
            }
            Generic.GenericTreeItem = GenericTreeItem;
            let Events;
            (function (Events) {
                //List Item event
                let ListChangedEventMode;
                (function (ListChangedEventMode) {
                    ListChangedEventMode[ListChangedEventMode["Add"] = 0] = "Add";
                    ListChangedEventMode[ListChangedEventMode["Remove"] = 1] = "Remove";
                    ListChangedEventMode[ListChangedEventMode["Move"] = 2] = "Move";
                    ListChangedEventMode[ListChangedEventMode["Replace"] = 3] = "Replace";
                })(ListChangedEventMode = Events.ListChangedEventMode || (Events.ListChangedEventMode = {}));
                class ListChangedEvent extends Core.MethodGroup {
                    constructor(target, defaultListener) {
                        super(target);
                    }
                    attach(listener) {
                        super.attach(listener);
                    }
                    detach(listener) {
                        super.detach(listener);
                    }
                    invoke(args) {
                        super.invoke(args);
                    }
                }
                Events.ListChangedEvent = ListChangedEvent;
            })(Events = Generic.Events || (Generic.Events = {}));
        })(Generic = Collections.Generic || (Collections.Generic = {}));
    })(Collections = Core.Collections || (Core.Collections = {}));
})(Core || (Core = {}));
//# sourceMappingURL=Core.Collections.Generic.js.map