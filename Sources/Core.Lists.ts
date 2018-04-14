///<reference path="Core.MethodGroup.ts"/>
///<reference path="Core.Validation.ts"/>

namespace Core.Lists {

    export type TestFunction<T> = (item: T, index: number, list: IGenericList<T>) => boolean;
    export type SelectFunction<T, U> = (item: T, index: number, list: IGenericList<T>) => U;
    export type CastFunction<T, U> = (item: T, index: number, list: IGenericList<T>) => U;

    export interface IGenericList<T> extends Iterable<T> {
        /**
         * Gets the number of elements inside this list.
         * @returns The number of elements in this list.
         */
        length: number;
        /**
         * Converts this list to an array.
         * @returns The resulting array.
         */
        toArray(): Array<T>;
        /**
         * Gets an item at the specified zero-based position.
         * @param index The index of the desired item.
         * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
         * bounds.
         */
        getItemAt(index: number): T;
            /**
         * Gets invoked every time a new item gets added to this list.
         */
        itemAddedEvent: Events.ListEvent<T>;
        invokeOnItemAdded(args: Events.ListEventArgs<T>): void;
        /**
         * Gets invoked every time an item gets removed from this list.
         */
        itemRemovedEvent: Events.ListEvent<T>;
        invokeOnItemRemoved(args: Events.ListEventArgs<T>): void;
        /**
         * Gets invoked every time an item gets replaced by a new one in this list.
         */
        itemChangedEvent: Events.ListEvent<T>;
        invokeOnItemChanged(args: Events.ListEventArgs<T>): void;
        /**
         * Gets the first item in this list.
         * @returns The first item in this list.
         */
        getFirst(): T;
        /**
         * Gets the last item in this list.
         * @returns The last item in this list.
         */
        getLast(): T;
        /**
         * Returns the zero-based position of the specified item in this list, or -1 if no match is found.
         * @param item The item being searched.
         * @param startIndex Optional. The index at which the search is started.
         * @returns The index of the matching item.
         */
        indexOf(item: T, startIndex?: number): number;
        /**
         * Returns the last zero-based position of the specified item in this list, or -1 if no match is 
         * found.
         * @param item The item being searched.
         * @param endIndex Optional. The index at which the search is stopped.
         * @returns The index of the last matching item.
         */
        lastIndexOf(item: T, endIndex?: number): number;
        /**
         * Adds multiple items to this list.
         * @param items The items being added.
         */
        addMultiple(items: T[]): void;
        /**
         * Adds an item to this list.
         * @param item The item being added.
         */
        add(item: T): void;
        /**
         * Inserts multiple items into this list, starting at the specified zero-based position.
         * @param items The items being inserted.
         * @param index The start position at which to start inserting the items.
         * @throws <Exceptions.InvalidOperationException> if no match is found.
         * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
         * bounds.
         */
        insertMultiple(items: T[], index: number): void;
        /**
         * Inserts an item into this list at the specified zero-based position.
         * @param item The item being inserted.
         * @param index The position at which the item is being inserted.
         * @throws <Exceptions.InvalidOperationException> if no match is found.
         * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
         * bounds.
         */
        insert(item: T, index: number): void;
        /**
         * Moves an item in this list from a zero-based position to another.
         * @param oldIndex The position the item is at.
         * @param newIndex The position the item is being moved to.
         * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
         * bounds.
         */
        moveAt(oldIndex: number, newIndex: number): void;
        /**
         * Moves an specific item to the specified zero-based position.
         * @param item The item being moved.
         * @param newIndex The position the item is being moved to.
         * @throws <Exceptions.InvalidOperationException> if no match is found.
         * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
         * bounds.
         */
        move(item: T, newIndex: number): void;
        /**
         * Swaps two items at two different zero-based positions.
         * @param index1 The position of the first item being swapped.
         * @param index2 The position of the second item being swapped.
         * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
         * bounds.
         */
        swap(index1: number, index2: number): void;
        /**
         * Removes an item at the specified zero-based position from this list and returns it.
         * @param index The position of the item being removed.
         * @returns The item being removed.
         * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
         * bounds.
         */
        removeAt(index: number): T;
        /**
         * Removes an specific item from this generic collection.
         * @param item The item being removed.
         * @throws <Exceptions.InvalidOperationException> if no match is found.
         */
        remove(item: T): void;
        /**
         * Removes the specified number of items from this list, starting at the specified 
         * zero-based position.
         * @param startIndex The position of the first item being removed.
         * @param removeCount The number of elements being removed, counting from the start position.
         * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
         * bounds.
         */
        removeMultipleAt(startIndex: number, removeCount: number): T[];
        /**
        * Removes specific items from this generic collection.
        * @param items The items being removed.
        * @throws <Exceptions.InvalidOperationException> if no match is found.
        */
        removeMultiple(items: T[]): void;
        /**
         * Replaces the item at the specified zero-based position by another, and returns it.
         * @param index The position of the item being replaced.
         * @param newItem The item replacing the current item at the specified position.
         * @returns The item being replaced.
         */
        replaceAt(index: number, newItem: T): T;
        /**
         * Replaces an specific item from this generic collection by another.
         * @param newItem
         * @param oldItem
         */
        replace(oldItem: T, newItem: T): void;
        /**
         * Returns an array containing the items that match the specified predicate.
         * @param testFn The predicate the items are being tested against.
         * @param thisArg The local context of the predicate function.
         */
        filter(testFn: TestFunction<T>, thisArg?);
        /**
         * Selects a property from each of the items, according to the specified predicate.
         * @param selectFn The predicate that determines which property is being selected from the 
         * list items.
         * @param thisArg The local context of the predicate function.
         * @param thisArg The local context of the predicate function.
         */
        select<U>(selectFn: SelectFunction<T, U>, thisArg?): U[];
        /**
         * Returns true if every one of the items in this list matches the specified predicate.
         * @param testFn The predicate the items are being tested against.
         * @param thisArg The local context of the predicate function.
         */
        every(testFn: TestFunction<T>, thisArg?): boolean;

        /**
         * Returns true if any of the items in this list matches the specified predicate.
         * @param testFn The predicate the items are being tested against.
         * @param thisArg The local context of the predicate function.
         */
        some(testFn: TestFunction<T>, thisArg?): boolean;
        /**
         * Returns the first item in this list that matches the specified predicate.
         * @param testFn The predicate the items are being tested against.
         * @param thisArg The local context of the predicate function.
         */
        first(testFn: TestFunction<T>, thisArg?): T;
        /**
         * Returns the last item in this list that matches the specified predicate.
         * @param testFn The predicate the items are being tested against.
         * @param thisArg The local context of the predicate function.
         */
        last(testFn: TestFunction<T>, thisArg?): T;

        /**
         * Fills this list with the spcified value, starting at the specified zero-based position, for the specified
         * item count.
         * @param value The item filling this list. 
         * @param startIndex The zero-based start position.
         * @param count The number of times the specified item is filling this list.
         */
        fill(value: T, startIndex: number, count: number): void;
    }

    export namespace IGenericList {

        export function toArray<T>(list: IGenericList<T>): Array<T> {
            return Array.prototype.slice.apply(list);
        }

        export function getCount<T>(list: IGenericList<T>): number {
            return Array.prototype.push.apply(this);
        }

        export function getItemAt<T>(list: IGenericList<T>, index: number): T {
            return Array.prototype.slice.call(this, 0, 1)[0];
        }

        export function getFirst<T>(list: IGenericList<T>): T {
            return Array.prototype.slice.call(list, 0, 1)[0] || null;
        }

        export function getLast<T>(list: IGenericList<T>): T {
            return Array.prototype.slice.call(list, -1)[0] || null;
        }

        export function indexOf<T>(list: IGenericList<T>, item: T, startIndex?: number): number {
            return Array.prototype.indexOf.call(list, item, startIndex);
        }

        export function lastIndexOf<T>(list: IGenericList<T>, item: T, endIndex?: number): number {
            return Array.prototype.lastIndexOf.call(list, item, endIndex);
        }

        export function addMultiple<T>(list: IGenericList<T>, items: T[]): void {
            Array.prototype.push.call(list, ...items);
        }

        export function add<T>(list: IGenericList<T>, item: T): void {
            Array.prototype.push.call(list, item);
        }

        export function insertMultiple<T>(list: IGenericList<T>, items: T[], index: number): void {
            Array.prototype.splice.call(list, index, 0, ...items);
        }

        export function insert<T>(list: IGenericList<T>, item: T, index: number): void {
            Array.prototype.splice.call(list, index, 0, item);
        }

        export function moveAt<T>(list: IGenericList<T>, oldIndex: number, newIndex: number): void {
            let item = IGenericList.removeAt(list, oldIndex);

            if (oldIndex < newIndex)
                newIndex--;

            IGenericList.insert(list, item, newIndex);
        }

        export function move<T>(list: IGenericList<T>, item: T, newIndex: number): void {
            let oldIndex = IGenericList.indexOf(list, item);

            IGenericList.moveAt(list, oldIndex, newIndex);
        }

        export function swap<T>(list: IGenericList<T>, index1: number, index2: number): void {
            let item1 = IGenericList.removeAt(list, index1);
            list[index1] = list[index2];
            list[index2] = item1;
        }

        export function removeAt<T>(list: IGenericList<T>, index: number): T {
            return Array.prototype.splice.call(list, index, 1);
        }

        export function remove<T>(list: IGenericList<T>, item: T): void {
            let index = IGenericList.indexOf(list, item);
            IGenericList.removeAt(list, index);
        }

        export function removeMultipleAt<T>(list: IGenericList<T>, startIndex: number, removeCount: number): T[] {
            return Array.prototype.slice.call(list, startIndex, removeCount);
        }

        export function removeMultiple<T>(list: IGenericList<T>, items: T[]): void {
            for (let item of items)
                IGenericList.remove(list, item);
        }

        export function replaceAt<T>(list: IGenericList<T>, index: number, newItem: T): T {
            return Array.prototype.splice.call(list, index, 1, newItem);
        }

        export function replace<T>(list: IGenericList<T>, oldItem: T, newItem: T): void {
            let index = IGenericList.indexOf(list, oldItem);
            IGenericList.replaceAt(list, index, newItem);
        }

        export function filter<T>(list: IGenericList<T>, predicate: TestFunction<T>, thisArg?)
            : Array<T> {
            return Array.prototype.filter.call(list, predicate, thisArg);
        }

        export function select<T, U>(list: IGenericList<T>, predicate: SelectFunction<T, U>, thisArg?)
            : Array<U> {
            return Array.prototype.map.call(list, predicate, thisArg);
        }

        export function every<T>(list: IGenericList<T>, predicate: TestFunction<T>, thisArg?): boolean {
            return Array.prototype.every.call(list, predicate, thisArg);
        }

        export function some<T>(list: IGenericList<T>, predicate: TestFunction<T>, thisArg?): boolean {
            return Array.prototype.some.call(list, predicate, thisArg);
        }

        export function first<T>(list: IGenericList<T>, predicate: TestFunction<T>, thisArg?): T {
            let array = IGenericList.toArray(list);

            for (let i = 0; i < array.length; i++) {
                let item = array[i];
                if (predicate.call(thisArg, item, i, list))
                    return item;
            }

            return null;
        }

        export function last<T>(list: IGenericList<T>, predicate: TestFunction<T>, thisArg?): T {
            let array = IGenericList.toArray(list);

            for (let i = array.length - 1; i >= 0; i++) {
                let item = array[i];
                if (predicate.call(thisArg, item, i, list))
                    return item;
            }

            return null;
        }

        export function fill<T>(list: IGenericList<T>, value: T, startIndex: number, count: number) {
            while (list.length < startIndex + count)
                list.add(null);

            Array.prototype.fill.call(list, value, startIndex, startIndex + count);
        }
    }

    export class GenericList<T> implements IGenericList<T> {
        /**
         * Creates a new instance of <IGenericList> from the original array items.
         * @param original
         */
        constructor(...items: T[])
        constructor(original: T[]);
        constructor(count: T[]);
        constructor();
        constructor(arg?: T[] | number) {
            if (typeof arg == NUMBER)
                this.fill(null, 0, <number>arg);
            else if (arg instanceof Array)
                this.addMultiple(<T[]>arg);

            this.itemAddedEvent = new Events.ListEvent(this);
            this.itemRemovedEvent = new Events.ListEvent(this);
            this.itemChangedEvent = new Events.ListEvent(this);
        }

        /**
         * Returns an iterator for this <IGenericList>.
         */
        [Symbol.iterator](): Iterator<T> {
            return Array.prototype.values.apply(this);
        }

        /**
         * Gets an item at the specified zero-based position.
         * @param index The index of the desired item.
         * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
         * bounds.
         */
        getItemAt(index: number): T {
            return IGenericList.getItemAt(this, index);
        }

        /**
         * Gets the number of elements inside this list.
         * @returns The number of elements in this list.
         */
        length: number = 0;

        /**
         * Converts this list to an array.
         * @returns The resulting array.
         */
        toArray(): T[] {
            return IGenericList.toArray(this);
        }
        /**
         * Gets invoked every time a new item gets added to this list.
         */
        itemAddedEvent: Events.ListEvent<T>;
        invokeOnItemAdded(args: Events.ListEventArgs<T>): void {
            this.itemAddedEvent.invoke(args);
        }
        /**
         * Gets invoked every time an item gets removed from this list.
         */
        itemRemovedEvent: Events.ListEvent<T>;
        invokeOnItemRemoved(args: Events.ListEventArgs<T>): void {
            this.itemRemovedEvent.invoke(args);
        }
        /**
         * Gets invoked every time an item gets replaced by a new one in this list.
         */
        itemChangedEvent: Events.ListEvent<T>;
        invokeOnItemChanged(args: Events.ListEventArgs<T>): void {
            this.itemChangedEvent.invoke(args);
        }
        /**
         * Gets the first item in this list.
         * @returns The first item in this list.
         */
        getFirst(): T {
            return IGenericList.getFirst(this);
        }
        /**
         * Gets the last item in this list.
         * @returns The last item in this list.
         */
        getLast(): T {
            return IGenericList.getLast(this);
        }
        /**
         * Returns the zero-based position of the specified item in this list, or -1 if no match is found.
         * @param item The item being searched.
         * @param startIndex Optional. The index at which the search is started.
         * @returns The index of the matching item.
         */
        indexOf(item: T, startIndex?: number): number {
            return IGenericList.indexOf(this, item, startIndex);
        }
        /**
         * Returns the last zero-based position of the specified item in this list, or -1 if no match is
         * found.
         * @param item The item being searched.
         * @param endIndex Optional. The index at which the search is stopped.
         * @returns The index of the last matching item.
         */
        lastIndexOf(item: T, endIndex?: number): number {
            return IGenericList.lastIndexOf(this, item, endIndex);
        }
        /**
         * Adds multiple items to this list.
         * @param items The items being added.
         */
        addMultiple(items: T[]): void {
            IGenericList.addMultiple(this, items);
        }
        /**
         * Adds an item to this list.
         * @param item The item being added.
         */
        add(item: T): void {
            IGenericList.add(this, item);
        }
        /**
         * Inserts multiple items into this list, starting at the specified zero-based position.
         * @param items The items being inserted.
         * @param index The start position at which to start inserting the items.
         * @throws <Exceptions.InvalidOperationException> if no match is found.
         * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
         * bounds.
         */
        insertMultiple(items: T[], index: number): void {
            IGenericList.insertMultiple(this, items, index);
        }
        /**
         * Inserts an item into this list at the specified zero-based position.
         * @param item The item being inserted.
         * @param index The position at which the item is being inserted.
         * @throws <Exceptions.InvalidOperationException> if no match is found.
         * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
         * bounds.
         */
        insert(item: T, index: number): void {
            IGenericList.insert(this, item, index);
        }
        /**
         * Moves an item in this list from a zero-based position to another.
         * @param oldIndex The position the item is at.
         * @param newIndex The position the item is being moved to.
         * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
         * bounds.
         */
        moveAt(oldIndex: number, newIndex: number): void {
            IGenericList.moveAt(this, oldIndex, newIndex);
        }
        /**
         * Moves an specific item to the specified zero-based position.
         * @param item The item being moved.
         * @param newIndex The position the item is being moved to.
         * @throws <Exceptions.InvalidOperationException> if no match is found.
         * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
         * bounds.
         */
        move(item: T, newIndex: number): void {
            IGenericList.move(this, item, newIndex);
        }
        /**
         * Swaps two items at two different zero-based positions.
         * @param index1 The position of the first item being swapped.
         * @param index2 The position of the second item being swapped.
         * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
         * bounds.
         */
        swap(index1: number, index2: number): void {
            IGenericList.swap(this, index1, index2);
        }
        /**
         * Removes an item at the specified zero-based position from this list and returns it.
         * @param index The position of the item being removed.
         * @returns The item being removed.
         * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
         * bounds.
         */
        removeAt(index: number): T {
            return IGenericList.removeAt(this, index);
        }
        /**
         * Removes an specific item from this generic collection.
         * @param item The item being removed.
         * @throws <Exceptions.InvalidOperationException> if no match is found.
         */
        remove(item: T): void {
            IGenericList.remove(this, item);
        }
        /**
         * Removes the specified number of items from this list, starting at the specified
         * zero-based position.
         * @param startIndex The position of the first item being removed.
         * @param removeCount The number of elements being removed, counting from the start position.
         * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
         * bounds.
         */
        removeMultipleAt(startIndex: number, removeCount: number): T[] {
            return IGenericList.removeMultipleAt(this, startIndex, removeCount)
        }
        /**
        * Removes specific items from this generic collection.
        * @param items The items being removed.
        * @throws <Exceptions.InvalidOperationException> if no match is found.
        */
        removeMultiple(items: T[]): void {
            IGenericList.removeMultiple(this, items);
        }
        /**
         * Replaces the item at the specified zero-based position by another, and returns it.
         * @param index The position of the item being replaced.
         * @param newItem The item replacing the current item at the specified position.
         * @returns The item being replaced.
         */
        replaceAt(index: number, newItem: T): T {
            return IGenericList.replaceAt(this, index, newItem);
        }
        /**
         * Replaces an specific item from this generic collection by another.
         * @param newItem
         * @param oldItem
         */
        replace(oldItem: T, newItem: T): void {
            return IGenericList.replace(this, oldItem, newItem);
        }
        /**
         * Returns an array containing the items that match the specified predicate.
         * @param testFn The predicate the items are being tested against.
         * @param thisArg The local context of the predicate function.
         */
        filter(testFn: TestFunction<T>, thisArg?: any) {
            return IGenericList.filter(this, testFn, thisArg);
        }
        /**
         * Selects a property from each of the items, according to the specified predicate.
         * @param selectFn The predicate that determines which property is being selected from the
         * list items.
         * @param thisArg The local context of the predicate function.
         */
        select<U>(selectFn: SelectFunction<T, U>, thisArg?: any): U[] {
            return IGenericList.select(this, selectFn, thisArg);
        }
        /**
         * Returns true if every one of the items in this list matches the specified predicate.
         * @param testFn The predicate the items are being tested against.
         * @param thisArg The local context of the predicate function.
         */
        every(testFn: TestFunction<T>, thisArg?: any): boolean {
            return IGenericList.every(this, testFn, thisArg);
        }
        /**
         * Returns true if any of the items in this list matches the specified predicate.
         * @param testFn The predicate the items are being tested against.
         * @param thisArg The local context of the predicate function.
         */
        some(testFn: TestFunction<T>, thisArg?: any): boolean {
            return IGenericList.some(this, testFn, thisArg);
        }
        /**
         * Returns the first item in this list that matches the specified predicate.
         * @param testFn The predicate the items are being tested against.
         * @param thisArg The local context of the predicate function.
         */
        first(testFn: TestFunction<T>, thisArg?: any): T {
            return IGenericList.first(this, testFn, thisArg);
        }
        /**
         * Returns the last item in this list that matches the specified predicate.
         * @param testFn The predicate the items are being tested against.
         * @param thisArg The local context of the predicate function.
         */
        last(testFn: TestFunction<T>, thisArg?: any): T {
            return IGenericList.last(this, testFn, thisArg);
        }
        /**
         * Fills this list with the spcified value, starting at the specified zero-based position, for the specified
         * item count.
         * @param value The item filling this list.
         * @param startIndex The zero-based start position.
         * @param count The number of times the specified item is filling this list.
         */
        fill(value: T, startIndex: number, count: number): void {
            IGenericList.fill(this, value, startIndex, count);
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

    export class GenericDictionary<Tkey, Tvalue> extends GenericList<KeyValuePair<Tkey, Tvalue>> {

    }

    export class GenericTreeItem<T> extends GenericList<GenericTreeItem<T>> {

        value: T;
        parent: GenericTreeItem<T>;
    }
}

namespace Core.Events {
    //List Item event
    export type ListEventArgs<T> = { oldItem: T, newItem: T, oldIndex: number, newIndex: number };
    export type ListEventListener<T> = (target: Lists.GenericList<T>, args: ListEventArgs<T>) => void;

    export class ListEvent<T> extends MethodGroup {
        constructor(target: Lists.GenericList<T>, defaultListener?: ListEventListener<T>) {
            super(target);
        }

        target: any;

        attach(listener: ListEventListener<T> | ListEvent<T>) {
            super.attach(listener);
        }

        detach(listener: ListEventListener<T> | ListEvent<T>) {
            super.detach(listener);
        }

        invoke(args: ListEventArgs<T>) {
            super.invoke(args);
        }
    }
}