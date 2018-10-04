declare namespace Core.Collections.Generic {
    type TestFunction<T> = (item: T, index: number, list: IList<T>) => boolean;
    type SelectFunction<T, U> = (item: T, index: number, list: IList<T>) => U;
    type CastFunction<T, U> = (item: T, index: number, list: IList<T>) => U;
    interface IList<T> extends Iterable<T> {
    }
    class List<T> implements IList<T> {
        /**
         * Creates a new list containing the specified items.
         * @param items
         */
        constructor(items: Iterable<T>);
        /**
         * Creates a new list with the specified number of items.
         * @param items
         */
        constructor(count: number);
        /**
         * Creates a new empty list.
         * @param items
         */
        constructor();
        /**
         * Returns an iterator for this list.
         */
        [Symbol.iterator](): Iterator<T>;
        /**
         * Gets an item at the specified zero-based position.
         * @param index The index of the desired item.
         * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
         * bounds.
         */
        getItemAt(index: number): T;
        /**
         * Gets an item at the specified zero-based position.
         * @param index The index of the desired item.
         * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
         * bounds.
         */
        setItemAt(index: number, item: T): void;
        /**
         * Gets the number of elements inside this list.
         * @returns The number of elements in this list.
         */
        readonly count: number;
        /**
         * Converts this list to an array.
         * @returns The resulting array.
         */
        toArray(): T[];
        /**
         * Gets invoked every time an item gets replaced by a new one in this list.
         */
        listChangedEvent: Events.ListChangedEvent<T>;
        protected invokeOnListChanged(args: Events.ListChangedEventArgs<T>): void;
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
        addRange(items: Iterable<T>): void;
        /**
         * Adds an item to this list.
         * @param item The item being added.
         */
        add(item: T): void;
        /**
         * Inserts multiple items into this list, starting at the specified zero-based position.
         * @param index The start position at which to start inserting the items.
         * @param items The items being inserted.
         * @throws <Exceptions.InvalidOperationException> if no match is found.
         * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
         * bounds.
         */
        insertRange(index: number, items: Iterable<T>): void;
        /**
         * Inserts an item into this list at the specified zero-based position.
         * @param index The position at which the item is being inserted.
         * @param item The item being inserted.
         * @throws <Exceptions.InvalidOperationException> if no match is found.
         * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
         * bounds.
         */
        insert(index: number, item: T): void;
        /**
         * Moves an item in this list from a zero-based position to another.
         * @param oldIndex The position the item is at.
         * @param newIndex The position the item is being moved to.
         * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
         * bounds.
         */
        move(oldIndex: number, newIndex: number): void;
        /**
         * Moves an item in this list from a zero-based position to another.
         * @param oldIndex The position the item is at.
         * @param newIndex The position the item is being moved to.
         * @param itemCount The number of items being moved.
         * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
         * bounds.
         */
        moveRange(oldIndex: number, newIndex: number, itemCount?: number): void;
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
        removeRange(startIndex: number, removeCount: number): T[];
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
         */
        filter(testFn: TestFunction<T>): Iterable<T>;
        /**
         * Selects a property from each of the items, according to the specified predicate.
         * @param selectFn The predicate that determines which property is being selected from the
         */
        select<U>(selectFn: SelectFunction<T, U>): Iterable<T>;
        /**
         * Returns true if every one of the items in this list matches the specified predicate.
         * @param testFn The predicate the items are being tested against.
         */
        every(testFn: TestFunction<T>): boolean;
        /**
         * Returns true if any of the items in this list matches the specified predicate.
         * @param testFn The predicate the items are being tested against.
         */
        any(testFn: TestFunction<T>): boolean;
        /**
         * Returns the first item in this list that matches the specified predicate.
         * @param testFn The predicate the items are being tested against.
         */
        first(testFn: TestFunction<T>): T;
        /**
         * Returns the last item in this list that matches the specified predicate.
         * @param testFn The predicate the items are being tested against.
         */
        last(testFn: TestFunction<T>): T;
        /**
         * Fills this list with the spcified value, starting at the specified zero-based position, for the specified
         * item count.
         * @param value The item filling this list.
         * @param startIndex The zero-based start position.
         * @param count The number of times the specified item is filling this list.
         */
        fill(value: T, startIndex: number, count: number): void;
    }
    class KeyValuePair<Tkey, Tvalue> {
        constructor(key: Tkey, value: Tvalue);
        key: Tkey;
        value: Tvalue;
    }
    class Dictionary<Tkey, Tvalue> extends List<KeyValuePair<Tkey, Tvalue>> {
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
        add(item: KeyValuePair<Tkey, Tvalue>): void;
        setByKey(key: Tkey, value: Tvalue): void;
        getByKey(key: Tkey): Tvalue;
        hasKey(key: Tkey): boolean;
    }
    class GenericTreeItem<T> extends List<GenericTreeItem<T>> {
        value: T;
        parent: GenericTreeItem<T>;
    }
    namespace Events {
        enum ListChangedEventMode {
            Add = 0,
            Remove = 1,
            Move = 2,
            Replace = 3,
        }
        type ListChangedEventArgs<T> = {
            mode: ListChangedEventMode;
            oldItem: T;
            newItem: T;
            oldIndex: number;
            newIndex: number;
        };
        type ListChangedEventListener<T> = (target: List<T>, args: ListChangedEventArgs<T>) => void;
        class ListChangedEvent<T> extends MethodGroup {
            constructor(target: List<T>, defaultListener?: ListChangedEventListener<T>);
            target: List<T>;
            attach(listener: ListChangedEventListener<T> | ListChangedEvent<T>): void;
            detach(listener: ListChangedEventListener<T> | ListChangedEvent<T>): void;
            invoke(args: ListChangedEventArgs<T>): void;
        }
    }
}
