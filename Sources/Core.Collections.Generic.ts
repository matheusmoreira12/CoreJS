namespace Core.Collections.Generic {

    export type TestFunction<T> = (item: T, index: number, list: IList<T>) => boolean;
    export type SelectFunction<T, U> = (item: T, index: number, list: IList<T>) => U;
    export type CastFunction<T, U> = (item: T, index: number, list: IList<T>) => U;

    export interface IList<T> extends Iterable<T> {
    }

    let propertyKeyIsIndex = k => (typeof k === NUMBER) || (typeof k === STRING && !isNaN(Number(k)));

    class ListProxyHandler<T> implements ProxyHandler<List<T>> {
        public set(target: List<T>, propertyKey: PropertyKey, value: T, receiver: any): boolean {
            if (propertyKeyIsIndex(propertyKey)) {
                target.setItemAt(<number>propertyKey, value);
                return true;
            }
            else
                return Reflect.set(target, propertyKey, value, receiver);
        }
        public get(target: List<T>, propertyKey: PropertyKey, receiver: any): T {
            if (propertyKeyIsIndex(propertyKey))
                return target.getItemAt(<number>propertyKey);
            else
                return Reflect.get(target, propertyKey, receiver);
        }
    }

    const rawArrayKey = Symbol.for("rawArray");

    export class List<T> implements IList<T> {

        /**
         * Creates a new list containing the specified items.
         * @param items
         */
        public constructor(items: Iterable<T>);
        /**
         * Creates a new list with the specified number of items.
         * @param items
         */
        public constructor(count: number);
        /**
         * Creates a new empty list.
         * @param items
         */
        public constructor();
        public constructor(arg?: Iterable<T> | number) {
            this[rawArrayKey] = new Array<T>();

            if (arg) {
                if (typeof arg === NUMBER)
                    this.fill(undefined, 0, <number>arg);
                else if (typeof arg[Symbol.iterator] !== UNDEF)
                    this.addRange(<Iterable<T>>arg);
            }

            return new Proxy<List<T>>(this, new ListProxyHandler());
        }
        /**
         * Returns an iterator for this list.
         */
        public [Symbol.iterator](): Iterator<T> {
            return (this[rawArrayKey] as T[]).values();
        }
        /**
         * Gets an item at the specified zero-based position.
         * @param index The index of the desired item.
         * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
         * bounds.
         */
        public getItemAt(index: number): T {
            if (index < 0 || index > this.count - 1)
                throw new Exceptions.ArgumentOutOfRangeException("index");

            return (this[rawArrayKey] as T[])[index];
        }
        /**
         * Gets an item at the specified zero-based position.
         * @param index The index of the desired item.
         * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
         * bounds.
         */
        public setItemAt(index: number, item: T): void {
            if (index < 0 || index > this.count - 1)
                throw new Exceptions.ArgumentOutOfRangeException("index");

            (this[rawArrayKey] as T[])[index] = item;
        }
        /**
         * Gets the number of elements inside this list.
         * @returns The number of elements in this list.
         */
        public get count(): number {
            return (this[rawArrayKey] as T[]).length;
        }
        /**
         * Converts this list to an array.
         * @returns The resulting array.
         */
        public toArray(): T[] {
            return (this[rawArrayKey] as T[]).slice();
        }
        /**
         * Gets invoked every time an item gets replaced by a new one in this list.
         */
        public listChangedEvent: Events.ListChangedEvent<T> = new Events.ListChangedEvent(this);
        protected invokeOnListChanged(args: Events.ListChangedEventArgs<T>): void {
            this.listChangedEvent.invoke(args);
        }
        /**
         * Gets the first item in this list.
         * @returns The first item in this list.
         */
        public getFirst(): T {
            return (this[rawArrayKey] as T[]).slice(0, 1)[0];
        }
        /**
         * Gets the last item in this list.
         * @returns The last item in this list.
         */
        public getLast(): T {
            return (this[rawArrayKey] as T[]).slice(-1)[0];
        }
        /**
         * Returns the zero-based position of the specified item in this list, or -1 if no match is found.
         * @param item The item being searched.
         * @param startIndex Optional. The index at which the search is started.
         * @returns The index of the matching item.
         */
        public indexOf(item: T, startIndex?: number): number {
            return (this[rawArrayKey] as T[]).indexOf(item, startIndex);
        }
        /**
         * Returns the last zero-based position of the specified item in this list, or -1 if no match is
         * found.
         * @param item The item being searched.
         * @param endIndex Optional. The index at which the search is stopped.
         * @returns The index of the last matching item.
         */
        public lastIndexOf(item: T, endIndex?: number): number {
            return (this[rawArrayKey] as T[]).lastIndexOf(item, endIndex);
        }
        /**
         * Adds multiple items to this list.
         * @param items The items being added.
         */
        public addRange(items: Iterable<T>): void {
            (this[rawArrayKey] as T[]).push(...items);
        }
        /**
         * Adds an item to this list.
         * @param item The item being added.
         */
        public add(item: T): void {
            (this[rawArrayKey] as T[]).push(item);
        }
        /**
         * Inserts multiple items into this list, starting at the specified zero-based position.
         * @param index The start position at which to start inserting the items.
         * @param items The items being inserted.
         * @throws <Exceptions.InvalidOperationException> if no match is found.
         * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
         * bounds.
         */
        public insertRange(index: number, items: Iterable<T>): void {
            (this[rawArrayKey] as T[]).splice(index, 0, ...items);
        }
        /**
         * Inserts an item into this list at the specified zero-based position.
         * @param index The position at which the item is being inserted.
         * @param item The item being inserted.
         * @throws <Exceptions.InvalidOperationException> if no match is found.
         * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
         * bounds.
         */
        public insert(index: number, item: T): void {
            (this[rawArrayKey] as T[]).splice(index, 0, item);
        }
        /**
         * Moves an item in this list from a zero-based position to another.
         * @param oldIndex The position the item is at.
         * @param newIndex The position the item is being moved to.
         * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
         * bounds.
         */
        public move(oldIndex: number, newIndex: number): void {
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
        public moveRange(oldIndex: number, newIndex: number, itemCount: number = 1): void {
            let array = (this[rawArrayKey] as T[]);

            array.splice(newIndex, 0, ...array.splice(oldIndex, itemCount));
        }
        /**
         * Swaps two items at two different zero-based positions.
         * @param index1 The position of the first item being swapped.
         * @param index2 The position of the second item being swapped.
         * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
         * bounds.
         */
        public swap(index1: number, index2: number): void {
            let item1 = this.getItemAt(index1),
                item2 = this.getItemAt(index2);

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
        public removeAt(index: number): T {
            return (this[rawArrayKey] as T[]).splice(index, 1)[0];
        }
        /**
         * Removes an specific item from this generic collection.
         * @param item The item being removed.
         * @throws <Exceptions.InvalidOperationException> if no match is found.
         */
        public remove(item: T): void {
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
        public removeRange(startIndex: number, removeCount: number): T[] {
            return (this[rawArrayKey] as T[]).splice(startIndex, removeCount);
        }
        /**
         * Replaces the item at the specified zero-based position by another, and returns it.
         * @param index The position of the item being replaced.
         * @param newItem The item replacing the current item at the specified position.
         * @returns The item being replaced.
         */
        public replaceAt(index: number, newItem: T): T {
            return (this[rawArrayKey] as T[]).splice(index, 1, newItem)[0];
        }
        /**
         * Replaces an specific item from this generic collection by another.
         * @param newItem
         * @param oldItem
         */
        public replace(oldItem: T, newItem: T): void {
            let index = this.indexOf(oldItem);

            this.replaceAt(index, newItem);
        }
        /**
         * Returns an array containing the items that match the specified predicate.
         * @param testFn The predicate the items are being tested against.
         */
        public * filter(testFn: TestFunction<T>): Iterable<T> {
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
        public * select<U>(selectFn: SelectFunction<T, U>): Iterable<T> {
            for (let i = 0; i < this.count; i++) {
                let item = this.getItemAt(i);

                yield selectFn.call(this, item);
            }
        }
        /**
         * Returns true if every one of the items in this list matches the specified predicate.
         * @param testFn The predicate the items are being tested against.
         */
        public every(testFn: TestFunction<T>): boolean {
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
        public any(testFn: TestFunction<T>): boolean {
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
        public first(testFn: TestFunction<T>): T {
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
        public last(testFn: TestFunction<T>): T {
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
        public fill(value: T, startIndex: number, count: number): void {
            while (this.count < count + startIndex)
                this.add(value);

            let rawArray = this[rawArrayKey] as T[];
            rawArray.fill(value, startIndex, count);
        }
    }

    export class KeyValuePair<Tkey, Tvalue> {
        constructor(key: Tkey, value: Tvalue) {
            this.key = key;
            this.value = value;
        }

        key: Tkey;
        value: Tvalue;
    }

    class DictionaryProxyHandler<Tkey, Tvalue> implements ProxyHandler<Dictionary<Tkey, Tvalue>> {
        public set(target: Dictionary<Tkey, Tvalue>, propertyKey: PropertyKey, value: KeyValuePair<Tkey, Tvalue>, receiver: any): boolean {
            if (propertyKeyIsIndex(propertyKey)) {
                target.setItemAt(<number>propertyKey, value);
                return true;
            }
            else
                return Reflect.set(target, propertyKey, value, receiver);
        }
        public get(target: Dictionary<Tkey, Tvalue>, propertyKey: PropertyKey, receiver: any): KeyValuePair<Tkey, Tvalue> {
            if (propertyKeyIsIndex(propertyKey))
                return target.getItemAt(<number>propertyKey);
            else
                return Reflect.get(target, propertyKey, receiver);
        }
    }

    export class Dictionary<Tkey, Tvalue> extends List<KeyValuePair<Tkey, Tvalue>> {
        /**
         * Creates a new dictionary containing the specified key-value pairs.
         * @param items
         */
        constructor(items: Iterable<KeyValuePair<Tkey, Tvalue>>);
        /**
         * Creates a new empty dictionary.
         * @param items
         */
        constructor();
        constructor(items?: Iterable<KeyValuePair<Tkey, Tvalue>>) {
            super(items);

            return new Proxy(this, new DictionaryProxyHandler<Tkey, Tvalue>());
        }

        public add(item: KeyValuePair<Tkey, Tvalue>) {
            if (!this.getByKey(item.key))
                super.add(item);
            else
                throw new Exceptions.InvalidOperationException("The specified key is already in use.");
        }

        public setByKey(key: Tkey, value: Tvalue): void {
            let matchingPair = this.first(item => Object.is(item.key, key));

            if (!(matchingPair instanceof KeyValuePair))
                throw new Exceptions.KeyNotFoundException();

            matchingPair.value = value;
        }

        public getByKey(key: Tkey): Tvalue {
            let matchingPair = this.first(item => Object.is(item.key, key));

            if (!(matchingPair instanceof KeyValuePair))
                throw new Exceptions.KeyNotFoundException();

            return matchingPair.value;
        }

        public hasKey(key: Tkey): boolean {
            let matchingPair = this.first(item => Object.is(item.key, key));

            return matchingPair instanceof KeyValuePair;
        }
    }

    export class GenericTreeItem<T> extends List<GenericTreeItem<T>> {
        value: T;
        parent: GenericTreeItem<T>;
    }

    export namespace Events {

        //List Item event
        export enum ListChangedEventMode { Add, Remove, Move, Replace }

        export type ListChangedEventArgs<T> = {
            mode: ListChangedEventMode;
            oldItem: T;
            newItem: T;
            oldIndex: number;
            newIndex: number;
        }

        export type ListChangedEventListener<T> = (target: List<T>, args: ListChangedEventArgs<T>) => void;

        export class ListChangedEvent<T> extends MethodGroup {
            constructor(target: List<T>, defaultListener?: ListChangedEventListener<T>) {
                super(target);
            }

            target: List<T>;

            attach(listener: ListChangedEventListener<T> | ListChangedEvent<T>) {
                super.attach(listener);
            }

            detach(listener: ListChangedEventListener<T> | ListChangedEvent<T>) {
                super.detach(listener);
            }

            invoke(args: ListChangedEventArgs<T>) {
                super.invoke(args);
            }
        }
    }
}