declare namespace Core {
    namespace Validation {
        type ExpectedTypeDecorator = string | Function | (string | Function)[];
        class Utils {
            private static _expectedTypeNameAsMessageTags(expectedType);
            static expectedTypeNameAsMessageTags(expectedType: ExpectedTypeDecorator): string;
        }
        class RuntimeValidator {
            private static __parameterTypeIsValid(paramValue, paramExpectedType);
            private static _parameterTypeIsValid(paramValue, paramExpectedType);
            static validateParameter(paramName: string, paramValue: any, paramExpectedType: ExpectedTypeDecorator, isRequired?: boolean, isNullable?: boolean): void;
            static validateArrayParameter(paramName: string, paramValue: any[], memberExpectedType: ExpectedTypeDecorator, itemIsNullable?: boolean, arrayIsRequired?: boolean, arrayIsNullable?: boolean): void;
        }
    }
}
declare namespace Core {
    type Method = (target: any, args: Object) => void;
    class MethodGroup {
        /**
         * Initializes a new instance of the class <MethodGroup>.
         * @param target The target that gets passed to the listeners when this <MethodGroup> is invoked.
         * @param defaultListener The default listener for this <MethodGroup>.
         */
        constructor(target: any, defaultListener?: any);
        /**
         * Detaches the specified <MethodGroup> from this <MethodGroup>.
         */
        private attachedListeners;
        /**
         * Detaches the specified method from this <MethodGroup>.
         */
        private attachedHandlers;
        private propagationStopped;
        protected target: any;
        /**
         * Stops the propation of this <MethodGroup>.
         */
        stopPropagation(): void;
        /**
         * Invokes all the listeners associated with this <MethodGroup>.
         * @param args The method arguments object.
         */
        invoke(args: Object): void;
        /**
         * Attaches the specified method or <MethodGroup> to this <MethodGroup>.
         * @param listener The method or <MethodGroup> to be attached.
         */
        attach(listener: MethodGroup | Method): void;
        private _detachHandler(handler);
        private _detachListener(listener);
        /**
         * Detaches the specified method or <MethodGroup> from this <MethodGroup>.
         * @param listener The method or <MethodGroup> to be detached.
         */
        detach(listener: MethodGroup | Method): void;
    }
}
declare namespace Core.Events {
    type ProgressEventListener = (target: any, args: ProgressEventArgs) => void;
    type ProgressEventArgs = {
        done: number;
        total: number;
    };
    class ProgressEvent extends MethodGroup {
        protected target: any;
        stopPropagation(): void;
        invoke(args: ProgressEventArgs): void;
        attach(listener: ProgressEvent | ProgressEventListener): void;
        detach(listener: ProgressEvent | ProgressEventListener): void;
    }
    type PropertyChangedEventArgs = {
        propertyName: string;
        oldValue: any;
        newValue: any;
    };
    type PropertyChangedEventListener = (target: any, args: PropertyChangedEventArgs) => void;
    class PropertyChangedEvent extends MethodGroup {
        protected target: any;
        stopPropagation(): void;
        invoke(args: PropertyChangedEventArgs): void;
        attach(listener: PropertyChangedEvent | PropertyChangedEventListener): void;
        detach(listener: PropertyChangedEvent | PropertyChangedEventListener): void;
    }
}
declare namespace Core.APIs {
    enum APILoaderPendingStatus {
        Pending = 0,
        LoadError = 1,
        Invalid = 2,
        Loaded = 3,
    }
    class API {
    }
    class APILoader {
        constructor(apiName: string, apiURL: string);
        loadedEvent: Events.APILoaderEvent;
        errorEvent: Events.APILoaderEvent;
        private _applyAPI(loadedContent);
        private _loadAPI();
        private _apiName;
        private _apiURL;
        private _loadedContent;
        private _ajaxRequest;
    }
}
declare namespace Core.Events {
    type APILoaderEventListener = (src: APIs.APILoader) => void;
    class APILoaderEvent extends MethodGroup {
        constructor(target: APIs.APILoader, defaultListener?: APILoaderEventListener);
        target: APIs.APILoader;
        attach(listener: APILoaderEventListener | APILoaderEvent): void;
        detach(listener: APILoaderEventListener | APILoaderEvent): void;
        invoke(thisArg?: any): void;
    }
}
declare namespace Core {
    class ArrayUtils {
        static syncArrays(srcArray: any[], destArray: any[], removeCallback?: Function, insertCallback?: Function, changeCallback?: Function, thisArg?: any): void;
    }
}
declare namespace Core.Exceptions {
    class Exception extends Error {
        protected static getMessagePlainText(messageXml: string): string;
        static getMessageTag(tagName: string, content: string): string;
        constructor(messageXml?: string, innerException?: Error, ...extraParams: any[]);
        messageXml: string;
        innerException: Error;
        extraParams: any[];
    }
    class InvalidOperationException extends Exception {
        constructor(messageXml?: string, innerException?: Error, ...extraParams: any[]);
    }
    class InvalidTypeException extends Exception {
        constructor(varName: string, expectedType: Validation.ExpectedTypeDecorator, messageXml?: string, innerException?: Error, ...extraParams: any[]);
        varName: string;
    }
    class InvalidParameterException extends Exception {
        constructor(paramName: string, messageXml?: string, innerException?: Error, ...extraParams: any[]);
        paramName: string;
    }
    class ParameterOutOfRangeException extends Exception implements InvalidParameterException {
        constructor(paramName: string, messageXml?: string, innerException?: Error, ...extraParams: any[]);
        paramName: string;
    }
    class InvalidParameterTypeException extends Exception implements InvalidParameterException {
        constructor(paramName: string, expectedType: Validation.ExpectedTypeDecorator, messageXml?: string, innerException?: Error, ...extraParams: any[]);
        paramName: string;
        expectedType: string | string[] | Function;
    }
    class ParameterMissingException extends Exception implements InvalidParameterException {
        constructor(paramName: string, messageXml?: string, innerException?: Error, ...extraParams: any[]);
        paramName: string;
    }
}
declare namespace Core.Lists {
    type TestFunction<T> = (item: T, index: number, list: IGenericList<T>) => boolean;
    type SelectFunction<T, U> = (item: T, index: number, list: IGenericList<T>) => U;
    type CastFunction<T, U> = (item: T, index: number, list: IGenericList<T>) => U;
    interface IGenericList<T> extends Iterable<T> {
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
        filter(testFn: TestFunction<T>, thisArg?: any): any;
        /**
         * Selects a property from each of the items, according to the specified predicate.
         * @param selectFn The predicate that determines which property is being selected from the
         * list items.
         * @param thisArg The local context of the predicate function.
         * @param thisArg The local context of the predicate function.
         */
        select<U>(selectFn: SelectFunction<T, U>, thisArg?: any): U[];
        /**
         * Returns true if every one of the items in this list matches the specified predicate.
         * @param testFn The predicate the items are being tested against.
         * @param thisArg The local context of the predicate function.
         */
        every(testFn: TestFunction<T>, thisArg?: any): boolean;
        /**
         * Returns true if any of the items in this list matches the specified predicate.
         * @param testFn The predicate the items are being tested against.
         * @param thisArg The local context of the predicate function.
         */
        some(testFn: TestFunction<T>, thisArg?: any): boolean;
        /**
         * Returns the first item in this list that matches the specified predicate.
         * @param testFn The predicate the items are being tested against.
         * @param thisArg The local context of the predicate function.
         */
        first(testFn: TestFunction<T>, thisArg?: any): T;
        /**
         * Returns the last item in this list that matches the specified predicate.
         * @param testFn The predicate the items are being tested against.
         * @param thisArg The local context of the predicate function.
         */
        last(testFn: TestFunction<T>, thisArg?: any): T;
        /**
         * Fills this list with the spcified value, starting at the specified zero-based position, for the specified
         * item count.
         * @param value The item filling this list.
         * @param startIndex The zero-based start position.
         * @param count The number of times the specified item is filling this list.
         */
        fill(value: T, startIndex: number, count: number): void;
    }
    namespace IGenericList {
        function toArray<T>(list: IGenericList<T>): Array<T>;
        function getCount<T>(list: IGenericList<T>): number;
        function getItemAt<T>(list: IGenericList<T>, index: number): T;
        function getFirst<T>(list: IGenericList<T>): T;
        function getLast<T>(list: IGenericList<T>): T;
        function indexOf<T>(list: IGenericList<T>, item: T, startIndex?: number): number;
        function lastIndexOf<T>(list: IGenericList<T>, item: T, endIndex?: number): number;
        function addMultiple<T>(list: IGenericList<T>, items: T[]): void;
        function add<T>(list: IGenericList<T>, item: T): void;
        function insertMultiple<T>(list: IGenericList<T>, items: T[], index: number): void;
        function insert<T>(list: IGenericList<T>, item: T, index: number): void;
        function moveAt<T>(list: IGenericList<T>, oldIndex: number, newIndex: number): void;
        function move<T>(list: IGenericList<T>, item: T, newIndex: number): void;
        function swap<T>(list: IGenericList<T>, index1: number, index2: number): void;
        function removeAt<T>(list: IGenericList<T>, index: number): T;
        function remove<T>(list: IGenericList<T>, item: T): void;
        function removeMultipleAt<T>(list: IGenericList<T>, startIndex: number, removeCount: number): T[];
        function removeMultiple<T>(list: IGenericList<T>, items: T[]): void;
        function replaceAt<T>(list: IGenericList<T>, index: number, newItem: T): T;
        function replace<T>(list: IGenericList<T>, oldItem: T, newItem: T): void;
        function filter<T>(list: IGenericList<T>, predicate: TestFunction<T>, thisArg?: any): Array<T>;
        function select<T, U>(list: IGenericList<T>, predicate: SelectFunction<T, U>, thisArg?: any): Array<U>;
        function every<T>(list: IGenericList<T>, predicate: TestFunction<T>, thisArg?: any): boolean;
        function some<T>(list: IGenericList<T>, predicate: TestFunction<T>, thisArg?: any): boolean;
        function first<T>(list: IGenericList<T>, predicate: TestFunction<T>, thisArg?: any): T;
        function last<T>(list: IGenericList<T>, predicate: TestFunction<T>, thisArg?: any): T;
        function fill<T>(list: IGenericList<T>, value: T, startIndex: number, count: number): void;
    }
    class GenericList<T> implements IGenericList<T> {
        /**
         * Creates a new instance of <IGenericList> from the original array items.
         * @param original
         */
        constructor(...items: T[]);
        constructor(original: T[]);
        constructor(count: T[]);
        constructor();
        /**
         * Returns an iterator for this <IGenericList>.
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
         * Gets the number of elements inside this list.
         * @returns The number of elements in this list.
         */
        length: number;
        /**
         * Converts this list to an array.
         * @returns The resulting array.
         */
        toArray(): T[];
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
        filter(testFn: TestFunction<T>, thisArg?: any): any;
        /**
         * Selects a property from each of the items, according to the specified predicate.
         * @param selectFn The predicate that determines which property is being selected from the
         * list items.
         * @param thisArg The local context of the predicate function.
         */
        select<U>(selectFn: SelectFunction<T, U>, thisArg?: any): U[];
        /**
         * Returns true if every one of the items in this list matches the specified predicate.
         * @param testFn The predicate the items are being tested against.
         * @param thisArg The local context of the predicate function.
         */
        every(testFn: TestFunction<T>, thisArg?: any): boolean;
        /**
         * Returns true if any of the items in this list matches the specified predicate.
         * @param testFn The predicate the items are being tested against.
         * @param thisArg The local context of the predicate function.
         */
        some(testFn: TestFunction<T>, thisArg?: any): boolean;
        /**
         * Returns the first item in this list that matches the specified predicate.
         * @param testFn The predicate the items are being tested against.
         * @param thisArg The local context of the predicate function.
         */
        first(testFn: TestFunction<T>, thisArg?: any): T;
        /**
         * Returns the last item in this list that matches the specified predicate.
         * @param testFn The predicate the items are being tested against.
         * @param thisArg The local context of the predicate function.
         */
        last(testFn: TestFunction<T>, thisArg?: any): T;
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
    class GenericDictionary<Tkey, Tvalue> extends GenericList<KeyValuePair<Tkey, Tvalue>> {
    }
    class GenericTreeItem<T> extends GenericList<GenericTreeItem<T>> {
        value: T;
        parent: GenericTreeItem<T>;
    }
}
declare namespace Core.Events {
    type ListEventArgs<T> = {
        oldItem: T;
        newItem: T;
        oldIndex: number;
        newIndex: number;
    };
    type ListEventListener<T> = (target: Lists.GenericList<T>, args: ListEventArgs<T>) => void;
    class ListEvent<T> extends MethodGroup {
        constructor(target: Lists.GenericList<T>, defaultListener?: ListEventListener<T>);
        target: any;
        attach(listener: ListEventListener<T> | ListEvent<T>): void;
        detach(listener: ListEventListener<T> | ListEvent<T>): void;
        invoke(args: ListEventArgs<T>): void;
    }
}
declare namespace Core {
    class SearchMatch {
        constructor(value: string, startIndex: number);
        value: string;
        startIndex: number;
        endIndex: number;
        count: number;
    }
    class SearchMatchList extends Array<SearchMatch> {
        private static _getMatches(input, regexp);
        static searchString(input: string, regexp: RegExp): SearchMatchList;
        constructor(...matches: SearchMatch[]);
        input: string;
    }
    namespace StringUtils {
        function encodeBase64(inputStr: string): string;
        function isValidIdentifier(str: string): boolean;
        function capitalize(str: string): string;
        function toCamelCase(str: string): string;
        function fromCamelCase(str: any): any;
        function splice(str: string, start: number, delCount: number, newSubStr: string): string;
        function format(text: string, ...params: any[]): string;
        function searchRegExp(str: string, regexp: RegExp): SearchMatchList;
        function fromCharArray(arr: string[]): string;
        function toCharArray(str: string): any;
        function getCharRange(startChar: string, endChar: string): string[];
        function toCharRange(representation: string): string[];
        function indexOfAny(str: string, searchStrings: string[], position?: number): number;
        function lastIndexOfAny(str: string, searchStrings: string[], position?: number): number;
        function matchString(str: string, regex: RegExp): string;
        function getHashCode(str: string): number;
    }
}
declare namespace Core {
    const UNDEF = "undefined";
    const STRING = "string";
    const NUMBER = "number";
    const BOOL = "boolean";
    class Type {
        private static _iterateSuperclasses(obj);
        private static _stringifyType(obj);
        private static _hashifyType(obj);
        equals(targetType: Type): boolean;
        name: string;
        hashCode: number;
        constructor(obj: Object | Function);
    }
}
declare namespace Core {
    const KEYFRAMES_FADEIN: {
        filter: string[];
    };
    const KEYFRAMES_FADEOUT: {
        filter: string[];
    };
    const KEYFRAMES_BOUNCE: {
        transform: string[];
    };
    const KEYFRAMES_GROW: {
        transform: string[];
    };
    const KEYFRAMES_SHRINK: {
        transform: string[];
    };
    const KEYFRAMES_FLIP: {
        transform: string[];
    };
}
declare namespace Core.UserInterface {
    class AttributePropertyAssociator {
        constructor(target: Node);
        private _associations;
        protected target: Node;
        private _getAssociatedPropertyName(attributeName);
        private _getAssociatedAttributeName(propertyName);
        private _onPropertyChanged(target, args);
        propertyChangedEvent: Events.PropertyChangedEvent;
        onPropertyChanged(propertyName: string, args: Events.PropertyChangedEventArgs): void;
        private _onAttributeChanged(target, args);
        attributeChangedEvent: Events.PropertyChangedEvent;
        onAttributeChanged(propertyName: string, args: Events.PropertyChangedEventArgs): void;
        associate(propertyName: string, attributeName?: string): void;
    }
}
declare namespace Core.UserInterface {
    enum ContentType {
        Text = 0,
        HTML = 1,
    }
    class Content {
        constructor(value: string, type?: ContentType);
        value: string;
        type: ContentType;
    }
    enum FlexibleValueUnit {
        Number = 0,
        Percent = 1,
    }
    namespace FlexibleValueUnit {
        function parse(unitStr: string): FlexibleValueUnit;
        function toString(unit: FlexibleValueUnit): string;
    }
    class FlexibleValue {
        static infer(value: FlexibleValueDecorator): FlexibleValue;
        static parse(str: string): FlexibleValue;
        constructor(value: number, unit: FlexibleValueUnit);
        value: number;
        unit: FlexibleValueUnit;
        toString(): string;
    }
    type FlexibleValueDecorator = FlexibleValue | string | number;
    enum ColorType {
        RGB = 0,
        RGBA = 1,
        CMYK = 2,
        HSL = 3,
        HSV = 4,
    }
    namespace ColorType {
        function parse(str: string): ColorType;
        function toString(style: ColorType): string;
    }
    abstract class Color {
        private static _inferFromInt(value);
        static infer(value: string | number | Color): Color;
        static parse(str: string): Color;
        constructor(type: ColorType);
        toString(): string;
        type: ColorType;
    }
    class ColorRGB extends Color {
        constructor(r: FlexibleValueDecorator, g: FlexibleValueDecorator, b: FlexibleValueDecorator);
        r: FlexibleValue;
        g: FlexibleValue;
        b: FlexibleValue;
    }
    class ColorRGBA extends Color {
        constructor(r: FlexibleValueDecorator, g: FlexibleValueDecorator, b: FlexibleValueDecorator, a: FlexibleValueDecorator);
        r: FlexibleValue;
        g: FlexibleValue;
        b: FlexibleValue;
        a: FlexibleValue;
    }
    class ColorCMYK extends Color {
        constructor(c: FlexibleValueDecorator, m: FlexibleValueDecorator, y: FlexibleValueDecorator, k: FlexibleValueDecorator);
        c: FlexibleValue;
        m: FlexibleValue;
        y: FlexibleValue;
        k: FlexibleValue;
    }
    class ColorHSL extends Color {
        constructor(h: FlexibleValueDecorator, s: FlexibleValueDecorator, l: FlexibleValueDecorator);
        h: FlexibleValue;
        s: FlexibleValue;
        l: FlexibleValue;
    }
    class ColorHSV extends Color {
        constructor(h: FlexibleValueDecorator, s: FlexibleValueDecorator, v: FlexibleValueDecorator);
        h: FlexibleValue;
        s: FlexibleValue;
        v: FlexibleValue;
    }
    class BrushList extends Lists.GenericList<Brush> {
        static parse(str: string): BrushList;
        toString(): string;
        add(item: Brush): void;
        addMultiple(items: Brush[]): void;
        insert(item: Brush): void;
        insertMultiple(items: Brush[]): void;
        replace(oldItem: Brush, newItem: Brush): void;
        replaceAt(index: number, newItem: Brush): Brush;
    }
    enum BrushType {
        Image = 0,
        LinearGradient = 1,
        RadialGradient = 2,
        ConicGradient = 3,
    }
    namespace BrushType {
        function parse(str: string): BrushType.Image | BrushType.LinearGradient;
        function toString(type: BrushType): "url" | "linear-gradient" | "radial-gradient" | "conic-gradient";
    }
    abstract class Brush {
        static parse(str: string): Brush;
        constructor(type: BrushType);
        type: BrushType;
        toString(): string;
    }
    class ImageBrush extends Brush {
        constructor(source: string);
        source: string;
    }
    abstract class GradientBrush extends Brush {
        static parse(str: string): GradientBrush;
        constructor(type: BrushType, stops?: GradientStop[]);
        toString(): string;
        stops: GradientStopList;
    }
    class LinearGradientBrush extends GradientBrush {
        constructor(stops?: GradientStop[]);
    }
    class RadialGradientBrush extends GradientBrush {
        constructor(stops?: GradientStop[]);
    }
    class ConicGradientBrush extends GradientBrush {
        constructor(stops?: GradientStop[]);
    }
    class GradientStopList extends Lists.GenericList<GradientStop> {
        add(item: GradientStop): void;
        addMultiple(items: GradientStop[]): void;
        insert(item: GradientStop): void;
        insertMultiple(items: GradientStop[]): void;
        replace(oldItem: GradientStop, newItem: GradientStop): void;
        replaceAt(index: number, newItem: GradientStop): GradientStop;
    }
    class GradientStop {
        constructor(color: Color, offset: FlexibleValueDecorator);
        color: Color;
        offset: FlexibleValue;
    }
    enum LengthUnit {
        Number = 0,
        Pixels = 1,
        Percent = 2,
        Inches = 3,
        Millimeters = 4,
        Centimeters = 5,
        Points = 6,
        Picas = 7,
        Em = 8,
        Ex = 9,
    }
    namespace LengthUnit {
        function parse(str: string): LengthUnit;
        function toString(style: LengthUnit): string;
    }
    class Length {
        static getZero(): Length;
        static parse(str: string): Length;
        constructor(value: number, unit: LengthUnit);
        toString(): string;
        value: number;
        unit: LengthUnit;
    }
    enum BorderStyle {
        Hidden = 0,
        Dotted = 1,
        Dashed = 2,
        Solid = 3,
        Double = 4,
        Groove = 5,
        Ridge = 6,
        Inset = 7,
        Inherit = 8,
        Unset = 9,
    }
    namespace BorderStyle {
        function parse(str: string): BorderStyle;
        function toString(style: BorderStyle): string;
    }
}
declare namespace Core.UserInterface.Primitives {
    class ElementList extends Lists.GenericList<HTMLElement> {
        constructor(parentContainer: ElementContainer, original: HTMLElement[]);
        constructor(parentContainer: ElementContainer);
        add(item: HTMLElement): void;
        addMultiple(items: HTMLElement[]): void;
        insert(item: HTMLElement): void;
        insertMultiple(items: HTMLElement[]): void;
        replace(oldItem: HTMLElement, newItem: HTMLElement): void;
        replaceAt(index: number, newItem: HTMLElement): HTMLElement;
        parentContainer: ElementContainer;
    }
    class ElementContainer extends HTMLElement {
        constructor();
        private _adoptElement(elem, index);
        private _rejectElement(elem);
        private _onElementAdded(target, args);
        private _onElementChanged(target, args);
        private _onElementRemoved(target, args);
        elements: ElementList;
    }
    class ContentContainer extends HTMLElement {
        constructor();
        content: Content;
        _content: Content;
        private update();
    }
    class Label extends ContentContainer {
        setText(text: string, ...params: any[]): void;
    }
    class LabelableContainer extends HTMLElement {
        private createLabelElement();
        constructor();
        protected shadow: ShadowRoot;
        labelElement: Label;
        labelContent: Content;
        setLabelText(text: string, ...params: any[]): void;
    }
}
declare namespace Core.Events {
    import ElementContainer = UserInterface.Primitives.ElementContainer;
    type ElementContainerEventArgs = {
        oldItem: HTMLElement;
        newItem: HTMLElement;
        oldIndex: number;
        newIndex: number;
    };
    type ElementContainerEventListener = (target: ElementContainer, args: ElementContainerEventArgs) => void;
    class ElementContainerEvent extends MethodGroup {
        constructor(target: ElementContainer, defaultListener?: ElementContainerEventListener);
        target: any;
        attach(listener: ElementContainerEventListener | ElementContainerEvent): void;
        detach(listener: ElementContainerEventListener | ElementContainerEvent): void;
        invoke(args: ElementContainerEventArgs): void;
    }
}
declare namespace Core.UserInterface.Icons {
    class Icon {
        constructor(name: string, x: number, y: number, width?: number, height?: number);
        name: string;
        x: number;
        y: number;
        parentList: any;
        width: number;
        private _width;
        height: number;
        private _height;
        readonly spriteSrc: any;
    }
    class IconList extends Lists.GenericList<Icon> {
        constructor(name: string, spriteSrc: string, width: number, height: number, icons?: Icon[]);
        name: string;
        spriteSrc: string;
        width: number;
        height: number;
        private _rejectIcon(icon);
        private _adoptIcon(icon);
        private _onItemAdded(target, args);
        private _onItemRemoved(target, args);
        private _onItemChanged(target, args);
        getIconByName(name: string): any;
    }
    class IconManager {
        private static activeIconLists;
        static addList(iconList: IconList): void;
        static removeList(iconList: IconList): void;
        static getListByName(name: any): any;
        static getIconByNames(collectionName: any, iconName: any): any;
    }
}
declare namespace Core.UserInterface {
    class IconElement extends HTMLElement {
        constructor();
        icon: Icons.Icon;
        private _icon;
        private shadow;
        private spriteImageElement;
        updateSpriteImage(): void;
        private createSpriteImageElement();
    }
}
declare namespace Core.UserInterface {
    class Button extends HTMLButtonElement {
        private createIconElement();
        private createContentElement();
        constructor();
        attributePropertyAssociator: AttributePropertyAssociator;
        value: string;
        private _value;
        isDefault: boolean;
        private _isDefault;
        icon: Icons.Icon;
        private _icon;
        content: Content;
        protected shadow: ShadowRoot;
        private iconElement;
        private contentElement;
    }
    class CloseButton extends Button {
        constructor();
    }
}
declare namespace Core.UserInterface.Colors {
    const Pink: Color;
    const LightPink: Color;
    const HotPink: Color;
    const DeepPink: Color;
    const PaleVioletRed: Color;
    const MediumVioletRed: Color;
    const LightSalmon: Color;
    const Salmon: Color;
    const DarkSalmon: Color;
    const LightCoral: Color;
    const IndianRed: Color;
    const Crimson: Color;
    const FireBrick: Color;
    const DarkRed: Color;
    const Red: Color;
    const OrangeRed: Color;
    const Tomato: Color;
    const Coral: Color;
    const DarkOrange: Color;
    const Orange: Color;
    const Yellow: Color;
    const LightYellow: Color;
    const LemonChiffon: Color;
    const LightGoldenrodYellow: Color;
    const PapayaWhip: Color;
    const Moccasin: Color;
    const PeachPuff: Color;
    const PaleGoldenrod: Color;
    const Khaki: Color;
    const DarkKhaki: Color;
    const Gold: Color;
    const Cornsilk: Color;
    const BlanchedAlmond: Color;
    const Bisque: Color;
    const NavajoWhite: Color;
    const Wheat: Color;
    const BurlyWood: Color;
    const Tan: Color;
    const RosyBrown: Color;
    const SandyBrown: Color;
    const Goldenrod: Color;
    const DarkGoldenrod: Color;
    const Peru: Color;
    const Chocolate: Color;
    const SaddleBrown: Color;
    const Sienna: Color;
    const Brown: Color;
    const Maroon: Color;
    const DarkOliveGreen: Color;
    const Olive: Color;
    const OliveDrab: Color;
    const YellowGreen: Color;
    const LimeGreen: Color;
    const Lime: Color;
    const LawnGreen: Color;
    const Chartreuse: Color;
    const GreenYellow: Color;
    const SpringGreen: Color;
    const MediumSpringGreen: Color;
    const LightGreen: Color;
    const PaleGreen: Color;
    const DarkSeaGreen: Color;
    const MediumAquamarine: Color;
    const MediumSeaGreen: Color;
    const SeaGreen: Color;
    const ForestGreen: Color;
    const Green: Color;
    const DarkGreen: Color;
    const Aqua: Color;
    const Cyan: Color;
    const LightCyan: Color;
    const PaleTurquoise: Color;
    const Aquamarine: Color;
    const Turquoise: Color;
    const MediumTurquoise: Color;
    const DarkTurquoise: Color;
    const LightSeaGreen: Color;
    const CadetBlue: Color;
    const DarkCyan: Color;
    const Teal: Color;
    const LightSteelBlue: Color;
    const PowderBlue: Color;
    const LightBlue: Color;
    const SkyBlue: Color;
    const LightSkyBlue: Color;
    const DeepSkyBlue: Color;
    const DodgerBlue: Color;
    const CornflowerBlue: Color;
    const SteelBlue: Color;
    const RoyalBlue: Color;
    const Blue: Color;
    const MediumBlue: Color;
    const DarkBlue: Color;
    const Navy: Color;
    const MidnightBlue: Color;
    const Lavender: Color;
    const Thistle: Color;
    const Plum: Color;
    const Violet: Color;
    const Orchid: Color;
    const Fuchsia: Color;
    const Magenta: Color;
    const MediumOrchid: Color;
    const MediumPurple: Color;
    const BlueViolet: Color;
    const DarkViolet: Color;
    const DarkOrchid: Color;
    const DarkMagenta: Color;
    const Purple: Color;
    const Indigo: Color;
    const DarkSlateBlue: Color;
    const SlateBlue: Color;
    const MediumSlateBlue: Color;
    const White: Color;
    const Snow: Color;
    const Honeydew: Color;
    const MintCream: Color;
    const Azure: Color;
    const AliceBlue: Color;
    const GhostWhite: Color;
    const WhiteSmoke: Color;
    const Seashell: Color;
    const Beige: Color;
    const OldLace: Color;
    const FloralWhite: Color;
    const Ivory: Color;
    const AntiqueWhite: Color;
    const Linen: Color;
    const LavenderBlush: Color;
    const MistyRose: Color;
    const Gainsboro: Color;
    const LightGray: Color;
    const Silver: Color;
    const DarkGray: Color;
    const Gray: Color;
    const DimGray: Color;
    const LightSlateGray: Color;
    const SlateGray: Color;
    const DarkSlateGray: Color;
    const Black: Color;
    const Transparent: ColorRGBA;
    function fromName(name: string): any;
}
declare namespace Core.UserInterface {
    class ControlVisualPropertyManager {
    }
    class ControlStylesheetManager {
        constructor(target: Control);
        private _stylesheets;
        private _target;
        prependStylesheet(href: any): HTMLLinkElement;
        getStylesheetByHref(href: string): HTMLLinkElement;
        removeStylesheet(stylesheet: HTMLLinkElement): void;
    }
    class Control extends HTMLElement implements XAML.IDependencyObject {
        getValue(property: XAML.DependencyProperty): object;
        setValue(property: XAML.DependencyProperty, value: object): void;
        private _populateControl();
        constructor();
        protected _stylesheetManager: ControlStylesheetManager;
        protected _outerBox: ControlOuterBox;
        protected _innerBox: ControlInnerBox;
        widthProperty: XAML.DependencyProperty;
        width: Length;
        minimumWidthProperty: XAML.DependencyProperty;
        minimumWidth: Length;
        maximumWidthProperty: XAML.DependencyProperty;
        maximumWidth: Length;
        heightProperty: XAML.DependencyProperty;
        height: Length;
        minimumHeightProperty: XAML.DependencyProperty;
        minimumHeight: Length;
        maximumHeightProperty: XAML.DependencyProperty;
        maximumHeight: Length;
        backgroundColorProperty: XAML.DependencyProperty;
        backgroundColor: Color;
        backgroundImageProperty: XAML.DependencyProperty;
        backgroundImage: Brush;
        borderColorProperty: XAML.DependencyProperty;
        borderColor: Color;
        borderWidthProperty: XAML.DependencyProperty;
        borderWidth: Length;
    }
    class ControlOuterBox extends HTMLElement {
    }
    class ControlInnerBox extends HTMLElement {
    }
}
declare namespace Core.UserInterface {
    class DataGrid extends HTMLElement {
        private createTableElement();
        constructor();
        protected shadow: ShadowRoot;
        private tableElement;
        readonly head: DataGridSection;
        readonly body: DataGridSection;
    }
    class DataGridTable extends HTMLElement {
        private createHeadElement();
        private createBodyElement();
        constructor();
        head: DataGridSection;
        body: DataGridSection;
    }
    class DataGridSection extends Primitives.ElementContainer {
    }
    class DataGridRow extends Primitives.ElementContainer {
    }
    class DataGridCell extends Primitives.ElementContainer {
        constructor();
        selected: boolean;
    }
}
declare namespace Core.UserInterface.Dialogs {
    class DialogTitle extends Primitives.ContentContainer {
    }
    class DialogTitleBar extends HTMLDialogElement {
        constructor();
        _titleElement: DialogTitle;
        _closeButtonElement: CloseButton;
        titleContent: Content;
    }
    class DialogContent extends Primitives.ElementContainer {
    }
    class DialogMessage extends Primitives.ContentContainer {
    }
    class Dialog extends HTMLDialogElement {
        constructor();
        dialogTitle: Content;
        readonly messageElements: Primitives.ElementList;
        readonly buttonBarElements: Primitives.ElementList;
        _titleBarElement: DialogTitleBar;
        _contentElement: DialogContent;
        _buttonBarElement: Forms.ButtonBar;
        returnValue: string;
    }
    class Dialogs {
    }
}
declare namespace Core.UserInterface.Forms {
    class FormItem extends Primitives.LabelableContainer {
        element: HTMLElement;
        private _element;
    }
    class ButtonOptions {
        constructor(value?: string, content?: Content, icon?: Icons.Icon, title?: string, isDefault?: boolean);
        value: string;
        content: Content;
        icon: Icons.Icon;
        title: string;
    }
    class ButtonType {
        constructor(defaultValue?: string, ...buttons: ButtonOptions[]);
        buttons: ButtonOptions[];
        defaultValue: string;
    }
    const BTN_OPTIONS_YES: ButtonOptions;
    const BTN_OPTIONS_NO: ButtonOptions;
    const BTN_OPTIONS_CANCEL: ButtonOptions;
    const BTN_OPTIONS_OK: ButtonOptions;
    const BTN_TYPE_YESNO: ButtonType;
    const BTN_TYPE_YESNOCANCEL: ButtonType;
    const BTN_TYPE_YESCANCEL: ButtonType;
    const BTN_TYPE_NOCANCEL: ButtonType;
    const BTN_TYPE_OK: ButtonType;
    const BTN_TYPE_OKCANCEL: ButtonType;
    class ButtonBar extends Primitives.ElementContainer {
        private static _getButtonsFromType(type);
        constructor(buttonType?: ButtonType);
        defaultButton: HTMLButtonElement;
    }
}
declare namespace Core.UserInterface {
    class ProgressBar extends Control {
        private _populate();
        constructor();
        private _stylesheetElement;
        private _innerElement;
        private _fillElement;
        private _onProgress(target, args);
        progressEvent: Events.ProgressEvent;
        labelFormat: string;
        private _labelFormat;
        labelElement: Primitives.Label;
        indeterminate: boolean;
        private _indeterminate;
        value: number;
        private _value;
        min: number;
        _min: number;
        max: number;
        _max: number;
        private _updateLabel(done, total, percent);
        private _updateVisuals();
    }
}
declare namespace Core.UserInterface.Utils {
    function prependChild(elem: Node, child: Node): void;
}
declare namespace Core.Web {
    class AjaxRequestOptions {
        constructor(async?: boolean, data?: any, user?: string, password?: string);
        asynchronous: boolean;
        user: string;
        password: string;
        data: any;
    }
    class AjaxRequestInfo {
        constructor(method: string, url: string, options?: AjaxRequestOptions);
        method: string;
        url: string;
        options: AjaxRequestOptions;
    }
    class AjaxRequest {
        doneEvent: Events.AjaxEvent;
        loadedEvent: Events.AjaxEvent;
        errorEvent: Events.AjaxEvent;
        headersReceivedEvent: Events.AjaxEvent;
        loadingEvent: Events.AjaxEvent;
        openedEvent: Events.AjaxEvent;
        unsentEvent: Events.AjaxEvent;
        progressEvent: Events.ProgressEvent;
        private _requestReadyStateChanged();
        private _requestProgress(event);
        private _createAndOpenRequest(method, url, options);
        constructor(method: string, url: string, options?: AjaxRequestOptions);
        baseRequest: XMLHttpRequest;
        info: AjaxRequestInfo;
    }
    class Ajax {
        static get(url: string, options?: AjaxRequestOptions): AjaxRequest;
        static head(url: string, options?: AjaxRequestOptions): AjaxRequest;
        static post(url: string, options?: AjaxRequestOptions): AjaxRequest;
        static put(url: string, options?: AjaxRequestOptions): AjaxRequest;
        static delete(url: string, options?: AjaxRequestOptions): AjaxRequest;
        static connect(url: string, options?: AjaxRequestOptions): AjaxRequest;
        static options(url: string, options?: AjaxRequestOptions): AjaxRequest;
        static trace(url: string, options?: AjaxRequestOptions): AjaxRequest;
        static patch(url: string, options?: AjaxRequestOptions): AjaxRequest;
    }
}
declare namespace Core.Events {
    type AjaxEventArgs = {
        baseRequest: XMLHttpRequest;
        reqInfo: Web.AjaxRequestInfo;
    };
    type AjaxEventListener = (target: Web.AjaxRequest, args: AjaxEventArgs) => void;
    class AjaxEvent extends MethodGroup {
        constructor(target: Web.AjaxRequest, defaultListener?: AjaxEventListener);
        target: Web.AjaxRequest;
        attach(listener: AjaxEventListener | AjaxEvent): void;
        detach(listener: AjaxEventListener | AjaxEvent): void;
        invoke(args: AjaxEventArgs): void;
    }
}
declare namespace Core.Web {
    const METHOD_GET = "GET";
    const METHOD_HEAD = "HEAD";
    const METHOD_POST = "POST";
    const METHOD_PUT = "PUT";
    const METHOD_DELETE = "DELETE";
    const METHOD_CONNECT = "CONNECT";
    const METHOD_OPTIONS = "OPTIONS";
    const METHOD_TRACE = "TRACE";
    const METHOD_PATCH = "PATCH";
    const STATUS_CONTINUE = 100;
    const STATUS_SWITCHING_PROTOCOL = 101;
    const STATUS_PROCESSING = 102;
    const STATUS_OK = 200;
    const STATUS_CREATED = 201;
    const STATUS_ACCEPTED = 202;
    const STATUS_NON_AUTHORITATIVE_INFO = 203;
    const STATUS_NO_CONTENT = 204;
    const STATUS_RESET_CONTENT = 205;
    const STATUS_PARTIAL_CONTENT = 206;
    const STATUS_IM_USED = 226;
    const STATUS_MULTIPLE_CHOICE = 300;
    const STATUS_MOVED_PERMANENTLY = 301;
    const STATUS_FOUND = 302;
    const STATUS_SEE_OTHER = 303;
    const STATUS_NOT_MODIFIED = 304;
    const STATUS_TEMPORARY_REDIRECT = 307;
    const STATUS_PERMANENT_REDIRECT = 308;
    const STATUS_BAD_REQUEST = 400;
    const STATUS_PAYMENT_REQUIRED = 401;
    const STATUS_FORBIDDEN = 402;
    const STATUS_UNAUTHORIZED = 403;
    const STATUS_NOT_FOUND = 404;
    const STATUS_METHOD_NOT_ALLOWED = 405;
    const STATUS_NOT_ACCEPTABLE = 406;
    const STATUS_PROXY_AUTH_REQUIRED = 407;
    const STATUS_REQUEST_TIMEOUT = 408;
    const STATUS_CONFLICT = 409;
    const STATUS_GONE = 410;
    const STATUS_LENGTH_REQUIRED = 411;
    const STATUS_PRECONDITION_FAILED = 412;
    const STATUS_PAYLOAD_TOO_LARGE = 413;
    const STATUS_URI_TOO_LONG = 414;
    const STATUS_UNSUPPORTED_MEDIA_TYPE = 415;
    const STATUS_REQUESTED_RANGE_NOT_SATISFIABLE = 416;
    const STATUS_EXPECTATION_FAILED = 417;
    const STATUS_I_M_A_TEAPOT = 418;
    const STATUS_MISDIRECTED_REQUEST = 421;
    const STATUS_UNPROCESSABLE_ENTITY = 422;
    const STATUS_LOCKED = 423;
    const STATUS_FAILED_DEPENDENCY = 424;
    const STATUS_UPGRADE_REQUIRED = 426;
    const STATUS_PRECONDITION_REQUIRED = 428;
    const STATUS_TOO_MANY_REQUESTS = 429;
    const STATUS_REQUEST_HEADER_FIELDS_TOO_LARGE = 431;
    const STATUS_UNAVAILABLE_FOR_LEGAL_REASONS = 451;
    const STATUS_INTERNAL_SERVER_ERROR = 500;
    const STATUS_NOT_IMPLEMENTED = 501;
    const STATUS_BAD_GATEWAY = 502;
    const STATUS_SERVICE_UNAVAILABLE = 503;
    const STATUS_GATEWAY_TIMEOUT = 504;
    const STATUS_HTTP_VERSION_NOT_SUPPORTED = 505;
    const STATUS_VARIANT_ALSO_NEGOTIATES = 506;
    const STATUS_INSUFFICIENT_STORAGE = 507;
    const STATUS_LOOP_DETECTED = 508;
    const STATUS_NOT_EXTENDED = 510;
    const STATUS_NETWORK_AUTH_REQUIRED = 511;
    class LoadException extends Exceptions.Exception {
        constructor(ajax: AjaxRequest, message?: string);
    }
}
declare namespace Core.XAML {
    interface IValueConverter {
        convert(value: object): object;
        convertBack(value: object): object;
    }
    interface IDependencyObject extends Object {
        /**
         * Gets the value of the specified dependency property.
         * @param property The dependency property.
         */
        getValue(property: DependencyProperty): object;
        /**
         * Sets the value of the specified dependency property.
         * @param property The dependency property.
         * @param value The new value for the specified dependency property.
         */
        setValue(property: DependencyProperty, value: object): void;
    }
    namespace IDependencyObject {
        function getValue(owner: IDependencyObject, property: DependencyProperty): object;
        function setValue(owner: IDependencyObject, property: DependencyProperty, value: object): void;
    }
    class DependencyObject extends Object implements IDependencyObject {
        /**
         * Gets the value of the specified dependency property.
         * @param property The dependency property.
         */
        getValue(property: DependencyProperty): object;
        /**
         * Sets the value of the specified dependency property.
         * @param property The dependency property.
         * @param value The new value for the specified dependency property.
         */
        setValue(property: DependencyProperty, value: object): void;
    }
    class DependencyObjectType {
        private static _registeredTypes;
        private static _getUniqueId(type);
        static fromSystemType(type: Type): DependencyObjectType;
        private constructor();
        /**
         * Gets the DependencyObjectType of the immediate base class of the current DependencyObjectType.
         */
        readonly baseType: DependencyObjectType;
        /**
         * Gets a zero-based unique identifier for constant-time array lookup operations.
         */
        id: number;
        /**
         * Gets the name of the represented common language runtime (CLR) system type.
         */
        name: string;
        /**
         * Gets the common language runtime (CLR) system type represented by this DependencyObjectType.
         */
        environmentType: Type;
    }
    type DependencyPropertyChangedEventArgs = {
        property: DependencyProperty;
        oldValue: object;
        newValue: object;
    };
    type PropertyChangedCallback = (owner: IDependencyObject, args: DependencyPropertyChangedEventArgs) => void;
    type CoerceValueCallback = (owner: IDependencyObject, baseValue: object) => object;
    class PropertyMetadata {
        /**
         * Initializes a new instance of the PropertyMetadata class with the specified default value and callbacks.
         * @param defaultValue The default value of the dependency property, usually provided as a value of some
         * specific type.
         * @param propertyChangedCallback Reference to a handler implementation that is to be called by the property
         * system whenever the effective value of the property changes.
         * @param coerceValueCallback Reference to a handler implementation that is to be called whenever the property
         * system calls CoerceValue(DependencyProperty) against this property.
         */
        constructor(defaultValue?: object, propertyChangedCallback?: PropertyChangedCallback, coerceValueCallback?: CoerceValueCallback);
        /**Gets or sets a reference to a CoerceValueCallback implementation specified in this metadata. */
        coerceValueCallback: CoerceValueCallback;
        /**Gets or sets the default value of the dependency property. */
        defaultValue: object;
        /**Gets a value that determines whether the metadata has been applied to a property in some way, resulting
         * in the immutable state of that metadata instance. */
        isSealed: boolean;
        /**Gets or sets a reference to a PropertyChangedCallback implementation specified in this metadata. */
        propertyChangedCallback: PropertyChangedCallback;
        /**
         * Called when this metadata has been applied to a property, which indicates that the metadata is being sealed.
         * @param dp The dependency property to which the metadata has been applied.
         * @param targetType The type associated with this metadata if this is type-specific metadata. If this
         * is default metadata, this value is a null reference.
         */
        onApply(dp: DependencyProperty, targetType: Type): void;
        /**
         * Merges this metadata with the base metadata.
         * @param baseMetadata The base metadata to merge with this instance's values.
         * @param dp The dependency property to which this metadata is being applied.
         */
        merge(baseMetadata: PropertyMetadata, dp: DependencyProperty): void;
    }
    class DependencyPropertyRegistryEntry {
        property: DependencyProperty;
        metadata: PropertyMetadata;
        constructor(property: DependencyProperty, metadata: PropertyMetadata);
    }
    type ValidateValueCallback = (value: object) => boolean;
    class DependencyPropertyKey {
        property: DependencyProperty;
        /**
         * Overrides the metadata of a read-only dependency property that is represented by this dependency
         * property identifier.
         * @param ownerType
         * @param metadata
         */
        overrideMetadata(forType: Type, typeMetadata: PropertyMetadata): void;
    }
    class DependencyProperty {
        private static _registerCommon(name, propertyType, ownerType, metadata, validateValueCallback);
        /**
         * Registers a dependency property with the specified property name, property type, owner type,
         * property metadata, and a value validation callback for the property.
         * @param name
         * @param propertyType
         * @param ownerType
         * @param metadata
         * @param validateValueCallback
         */
        static register(name: string, propertyType: Type, ownerType: Type, metadata?: PropertyMetadata, validateValueCallback?: ValidateValueCallback): DependencyProperty;
        /**
         * Registers an attached property with the specified property type, owner type, property metadata,
         * and value validation callback for the property.
         * @param name
         * @param propertyType
         * @param ownerType
         * @param metadata
         * @param validateValueCallback
         */
        static registerAttached(name: string, propertyType: Type, ownerType: Type, metadata?: PropertyMetadata, validateValueCallback?: ValidateValueCallback): DependencyProperty;
        /**
         * Gets the name of the dependency property.
         */
        name: string;
        /**
         * Gets the type that the dependency property uses for its value.
         */
        propertyType: Type;
        /**
         * Gets the type of the object that registered the dependency property with the property system,
         * or added itself as owner of the property.
         */
        ownerType: Type;
        /**
         * Gets an internally generated value that uniquely identifies the dependency property.
         */
        globalIndex: number;
        /**
         * Gets a value that indicates whether the dependency property identified by this DependencyProperty
         * instance is a read-only dependency property.
         */
        readOnly: boolean;
        /**
         * Gets the default metadata of the dependency property.
         */
        defaultMetadata: PropertyMetadata;
        /**
         * Adds another type as an owner of a dependency property that has already been registered, providing
         * dependency property metadata for the dependency property as it will exist on the  provided owner type.
         * @param ownerType
         * @param metadata
         */
        addOwner(ownerType: Type, metadata?: PropertyMetadata): DependencyProperty;
        /**
         * Returns the metadata for this dependency property as it exists on a specified type.
         * @param owner
         */
        getMetadata(owner: IDependencyObject | DependencyObjectType): void;
        /**
         * Gets the value validation callback for the dependency property.
         */
        validateValueCallback: ValidateValueCallback;
    }
}
