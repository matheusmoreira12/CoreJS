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
         * Gets invoked every time a new item gets added to this list.
         */
        itemAddedEvent: ListEvent<T>;
        protected invokeOnItemAdded(args: ListEventArgs<T>): void;
        /**
         * Gets invoked every time an item gets removed from this list.
         */
        itemRemovedEvent: ListEvent<T>;
        protected invokeOnItemRemoved(args: ListEventArgs<T>): void;
        /**
         * Gets invoked every time an item gets replaced by a new one in this list.
         */
        itemChangedEvent: ListEvent<T>;
        protected invokeOnItemChanged(args: ListEventArgs<T>): void;
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
    type ListEventArgs<T> = {
        oldItem: T;
        newItem: T;
        oldIndex: number;
        newIndex: number;
    };
    type ListEventListener<T> = (target: List<T>, args: ListEventArgs<T>) => void;
    class ListEvent<T> extends MethodGroup {
        constructor(target: List<T>, defaultListener?: ListEventListener<T>);
        target: List<T>;
        attach(listener: ListEventListener<T> | ListEvent<T>): void;
        detach(listener: ListEventListener<T> | ListEvent<T>): void;
        invoke(args: ListEventArgs<T>): void;
    }
}
declare namespace Core.Exceptions {
    class ExceptionData extends Collections.Generic.Dictionary<any, any> {
    }
    class Exception {
        constructor(message?: string, innerException?: Error);
        readonly data: ExceptionData;
        toString(): void;
    }
    /**The exception that is thrown when one of the arguments provided to a method is not valid. */
    class ArgumentException extends Exception {
        constructor(argumentName: string, message?: string, innerException?: Error);
    }
    /**The exception that is thrown when no reference is passed to a method that requires an argument. */
    class ArgumentMissingException extends Exceptions.ArgumentException {
    }
    /**The exception that is thrown when a null reference is passed to a method that does not accept it as a valid
     * argument. */
    class ArgumentNullException extends ArgumentException {
    }
    /**The exception that is thrown when the value of an argument is outside the allowable range of values as defined
     * by the invoked method. */
    class ArgumentOutOfRangeException extends ArgumentException {
    }
    /**The exception that is thrown when the format of an argument is invalid, or when a composite format string is
     * not well formed. */
    class FormatException extends Exception {
    }
    /**The exception that is thrown when an attempt is made to access an element of an array or collection with an
     * index that is outside its bounds. */
    class IndexOutOfRangeException extends Exception {
    }
    /**A exce��o que � gerada quando uma chamada de m�todo � inv�lida para o estado atual do objeto. */
    class InvalidOperationException extends Exception {
    }
    /**The exception that is thrown when the key specified for accessing an element in a collection does not match
     * any key in the collection. */
    class KeyNotFoundException extends Exception {
    }
    /**The exception that is thrown when an invoked method is not supported, or when there is an attempt to read,
     * seek, or write to a stream that does not support the invoked functionality. */
    class NotSupported extends Exception {
    }
    /**The exception that is thrown when a requested method or operation is not implemented. */
    class NotImplemented extends Exception {
    }
    /**The exception that is thrown when the time allotted for a process or operation has expired. */
    class TimeoutException extends Exception {
    }
}
declare namespace Core {
    namespace Validation {
        type ExpectedType = Type | Type[];
        class RuntimeValidator {
            private static _parameterTypeIsValid(paramValue, paramExpectedType);
            static validateParameter(paramName: string, paramValue: any, paramExpectedType: ExpectedType, isRequired?: boolean, isNullable?: boolean): void;
            static validateArrayParameter(paramName: string, paramValue: any[], memberExpectedType: ExpectedType, itemIsNullable?: boolean, arrayIsRequired?: boolean, arrayIsNullable?: boolean): void;
        }
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
declare namespace Core.CSS {
}
declare namespace Core.Decorators {
    function enumerable<T>(isEnumerable: boolean): (target: object, key: string, descriptor: PropertyDescriptor) => void;
    function writable(isWritable: boolean): (target: object, key: string, descriptor: PropertyDescriptor) => void;
    function configurable(isConfigurable: boolean): (target: object, key: string, descriptor: PropertyDescriptor) => void;
}
declare namespace Core.HashCode {
    function fromString(str: string): number;
    function concatenate(hashCodes: Iterable<number>): number;
}
declare namespace Core.ObjectiveXML {
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
        private static _propertyFromName;
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
declare namespace Core.ObjectManipulation {
    function cloneObject(obj: object): object;
}
declare namespace Core {
    class StringScannerBranchList extends Collections.Generic.List<StringScannerBranch> {
    }
    class StringScannerBranch {
        constructor(parentBranch: StringScannerBranch, startIndex: number);
        /**Gets a string representing the current character.*/
        readonly currentChar: string;
        /**Returns the partial string from the start position up to, but not including, the current index,
         * trimming the start and end by the specified amount.
         * @param trimEnd The number of characters being removed from the start of the string. If negative, the string
         * is extended instead.
         * @param trimStart The number of characters being removed from the end of the string. If negative, the string
         * is extended instead.*/
        getPartialString(trimStart: number, trimEnd: number): string;
        /**Gets the partial string from the start position up to, but not including, the current index.*/
        readonly partialString: string;
        /**Gets the content being scanned, by reflecting the content of the parent branch.*/
        readonly content: string;
        /**Creates a sub-branch from this branch. */
        derive(): StringScannerBranch;
        /**Writes the current index to the parent branch. */
        update(): void;
        /**Gets the current zero-based position inside the content.*/
        readonly index: number;
        /**Gets the relative recursion from the start index to the current index. */
        readonly count: number;
        /**Gets length of the content being scanned. */
        readonly length: number;
        /**Gets the current zero-based position inside the content.*/
        readonly startIndex: number;
        /**Gets the parent branch this commits to, or null if this is the main branch.*/
        readonly parentBranch: StringScannerBranch;
        /**Advances the current index by the specified amount.
         * @param steps
         */
        advance(steps?: number): void;
        /**
         * Jumps the current index to the spcified index.
         * @param index
         */
        jump(index: number): void;
        /**Resets the current index to the start index. */
        reset(): void;
    }
    class StringScanner extends StringScannerBranch {
        /**Gets the content being scanned*/
        readonly content: string;
        /**
         * Creates a new instance of the StringScanner class.
         * @param content The content being scanned.
         * @param startIndex The zero-based position at which to start scanning.
         */
        constructor(content: string, startIndex?: number);
    }
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
        function getCharRange(startChar: string, endChar: string): string[];
        /**
         * Gets the char range denoted by a RegEx-like [] notation.
         * @param representation
         */
        function toCharRange(representation: string): string[];
        function indexOfAny(str: string, searchStrings: string[], position?: number): number;
        function lastIndexOfAny(str: string, searchStrings: string[], position?: number): number;
        function matchString(str: string, regex: RegExp): string;
        function indexOfRegex(str: string, regex: RegExp, fromIndex: number): number;
        function indexOfRegexOrDefault(str: string, regex: RegExp, fromIndex: number, defaultIndex: number): number;
    }
}
declare namespace Core {
    const UNDEF = "undefined";
    const STRING = "string";
    const NUMBER = "number";
    const BOOL = "boolean";
    interface ICloneable<T> {
        clone(): T;
    }
}
declare namespace Core {
    class Type {
        private static _getConstructor(obj);
        private static _getParentType(constr);
        /**
         * Returns a value indicating whether the specified source type is equivalent to the specified reference type.
         * @param tSrc The source type.
         * @param tRef The reference type.
         */
        static equals(tSrc: Type, tRef: Type): boolean;
        /**
         * Creates a new instance of Type from the specified instance or constructor.
         * @param obj The instance or constructor the Type is being created from.
         */
        constructor(obj: Object | Function);
        private _typeConstructor;
        /** Returns the name of this Type.*/
        readonly name: string;
        /** Returns the parent type of this Type.*/
        readonly parentType: Type;
        /**
         * Returns a value indicating whether the specified source type is equivalent to the specified reference type.
         * @param tRef The reference type.
         */
        equals(tRef: Type): boolean;
        /**Returns a string representing the inheritance tree for this type. */
        inheritanceToString(): string;
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
    class Percentage extends Number {
        static parse(str: string): number;
        toString(): string;
    }
    enum ColorType {
        RGB = 0,
        RGBA = 1,
        CMYK = 2,
        HSL = 3,
        HSV = 4,
    }
    abstract class Color {
        static fromInt(value: number): ColorRGB;
        static parse(str: string): Color;
        constructor(type: ColorType);
        toString(): string;
        type: ColorType;
    }
    class ColorRGB extends Color {
        constructor(r: string, g: string, b: string);
        r: Number;
        g: Number;
        b: Number;
    }
    class ColorRGBA extends Color {
        static parse(str: string): any;
        constructor(r: string, g: string, b: string, a: string);
        r: Number;
        g: Number;
        b: Number;
        a: Number;
    }
    class ColorCMYK extends Color {
        constructor(c: string, m: string, y: string, k: string);
        c: Number;
        m: Number;
        y: Number;
        k: Number;
    }
    class ColorHSL extends Color {
        constructor(h: string, s: string, l: string);
        h: Number;
        s: Number;
        l: Number;
    }
    class ColorHSV extends Color {
        constructor(h: string, s: string, v: string);
        h: Number;
        s: Number;
        v: Number;
    }
    class BrushList extends Collections.Generic.List<Brush> {
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
    class GradientStopList extends Collections.Generic.List<GradientStop> {
    }
    class GradientStop {
        constructor(color: Color, offset: string);
        color: Color;
        offset: Number;
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
