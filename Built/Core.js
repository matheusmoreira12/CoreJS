///<reference path="Core.Collections.Generic.ts"/>
var Core;
///<reference path="Core.Collections.Generic.ts"/>
(function (Core) {
    var Exceptions;
    (function (Exceptions) {
        class ExceptionData extends Core.Collections.Generic.Dictionary {
        }
        Exceptions.ExceptionData = ExceptionData;
        let ExceptionSymbols;
        (function (ExceptionSymbols) {
            ExceptionSymbols.data = Symbol.for("data");
        })(ExceptionSymbols || (ExceptionSymbols = {}));
        class Exception {
            constructor(message = "", innerException = null) {
                this[ExceptionSymbols.data] = new Core.Collections.Generic.Dictionary();
                this.data["message"] = message;
                this.data["innerException"] = innerException;
            }
            get data() {
                return this[ExceptionSymbols.data];
            }
            toString() {
            }
        }
        Exceptions.Exception = Exception;
        /**The exception that is thrown when one of the arguments provided to a method is not valid. */
        class ArgumentException extends Exception {
            constructor(argumentName, message = "", innerException = null) {
                super(message, innerException);
                this.data["argumentName"] = argumentName;
            }
        }
        Exceptions.ArgumentException = ArgumentException;
        /**The exception that is thrown when no reference is passed to a method that requires an argument. */
        class ArgumentMissingException extends Exceptions.ArgumentException {
        }
        Exceptions.ArgumentMissingException = ArgumentMissingException;
        /**The exception that is thrown when a null reference is passed to a method that does not accept it as a valid
         * argument. */
        class ArgumentNullException extends ArgumentException {
        }
        Exceptions.ArgumentNullException = ArgumentNullException;
        /**The exception that is thrown when the value of an argument is outside the allowable range of values as defined
         * by the invoked method. */
        class ArgumentOutOfRangeException extends ArgumentException {
        }
        Exceptions.ArgumentOutOfRangeException = ArgumentOutOfRangeException;
        /**The exception that is thrown when the format of an argument is invalid, or when a composite format string is
         * not well formed. */
        class FormatException extends Exception {
        }
        Exceptions.FormatException = FormatException;
        /**The exception that is thrown when an attempt is made to access an element of an array or collection with an
         * index that is outside its bounds. */
        class IndexOutOfRangeException extends Exception {
        }
        Exceptions.IndexOutOfRangeException = IndexOutOfRangeException;
        /**A exce��o que � gerada quando uma chamada de m�todo � inv�lida para o estado atual do objeto. */
        class InvalidOperationException extends Exception {
        }
        Exceptions.InvalidOperationException = InvalidOperationException;
        /**The exception that is thrown when the key specified for accessing an element in a collection does not match
         * any key in the collection. */
        class KeyNotFoundException extends Exception {
        }
        Exceptions.KeyNotFoundException = KeyNotFoundException;
        /**The exception that is thrown when an invoked method is not supported, or when there is an attempt to read,
         * seek, or write to a stream that does not support the invoked functionality. */
        class NotSupported extends Exception {
        }
        Exceptions.NotSupported = NotSupported;
        /**The exception that is thrown when a requested method or operation is not implemented. */
        class NotImplemented extends Exception {
        }
        Exceptions.NotImplemented = NotImplemented;
        /**The exception that is thrown when the time allotted for a process or operation has expired. */
        class TimeoutException extends Exception {
        }
        Exceptions.TimeoutException = TimeoutException;
    })(Exceptions = Core.Exceptions || (Core.Exceptions = {}));
})(Core || (Core = {}));
///<reference path="Core.Exceptions.ts"/>
var Core;
///<reference path="Core.Exceptions.ts"/>
(function (Core) {
    let Validation;
    (function (Validation) {
        class RuntimeValidator {
            static _parameterTypeIsValid(paramValue, paramExpectedType) {
                function nonRecursive(paramValue, paramExpectedType) {
                    if (paramExpectedType instanceof Core.Type)
                        return new Core.Type(paramValue).equals(paramExpectedType);
                    else
                        throw new Core.Exceptions.ArgumentException("paramExpectedType", "The specified expected type is invalid.");
                }
                if (paramExpectedType instanceof Array) {
                    if (paramExpectedType.length == 0)
                        return true;
                    for (var i = 0; i < paramExpectedType.length; i++) {
                        let type = paramExpectedType[i];
                        if (nonRecursive(paramValue, type))
                            return true;
                    }
                }
                else
                    return nonRecursive(paramValue, paramExpectedType);
                return false;
            }
            static validateParameter(paramName, paramValue, paramExpectedType, isRequired = false, isNullable = true) {
                let isNull = paramValue === null, isUndefined = typeof paramValue == Core.UNDEF;
                if (isNull) {
                    if (!isNullable)
                        throw new Core.Exceptions.ArgumentNullException(paramName);
                }
                else if (isUndefined) {
                    if (isRequired)
                        throw new Core.Exceptions.ArgumentMissingException(paramName);
                }
                else {
                    if (!this._parameterTypeIsValid(paramValue, paramExpectedType))
                        throw new Core.Exceptions.ArgumentException(paramName);
                }
            }
            static validateArrayParameter(paramName, paramValue, memberExpectedType, itemIsNullable = true, arrayIsRequired = true, arrayIsNullable = false) {
                //Validate array
                this.validateParameter(paramName, paramValue, new Core.Type(Array), arrayIsRequired, arrayIsNullable);
                //Validate array items
                for (let i = 0; i < paramValue.length; i++) {
                    let member = paramValue[i];
                    this.validateParameter(`${paramName}[${i}]`, member, memberExpectedType, false, itemIsNullable);
                }
            }
        }
        Validation.RuntimeValidator = RuntimeValidator;
    })(Validation = Core.Validation || (Core.Validation = {}));
})(Core || (Core = {}));
///<reference path="Core.Validation.ts"/>
var Core;
///<reference path="Core.Validation.ts"/>
(function (Core) {
    class MethodGroup {
        /**
         * Initializes a new instance of the class <MethodGroup>.
         * @param target The target that gets passed to the listeners when this <MethodGroup> is invoked.
         * @param defaultListener The default listener for this <MethodGroup>.
         */
        constructor(target, defaultListener) {
            /**
             * Detaches the specified <MethodGroup> from this <MethodGroup>.
             */
            this.attachedListeners = new Array();
            /**
             * Detaches the specified method from this <MethodGroup>.
             */
            this.attachedHandlers = new Array();
            //Initialization
            this.target = target;
            if (defaultListener)
                this.attach(defaultListener);
        }
        /**
         * Stops the propation of this <MethodGroup>.
         */
        stopPropagation() {
            this.propagationStopped = true;
        }
        /**
         * Invokes all the listeners associated with this <MethodGroup>.
         * @param args The method arguments object.
         */
        invoke(args) {
            this.propagationStopped = false;
            //Invoke all attached listeners
            for (let listeners of this.attachedListeners) {
                if (this.propagationStopped)
                    break;
                listeners(this.target, args);
            }
            //Invoke all attached handlers
            for (let handler of this.attachedHandlers) {
                if (this.propagationStopped)
                    break;
                handler.invoke(args);
            }
        }
        /**
         * Attaches the specified method or <MethodGroup> to this <MethodGroup>.
         * @param listener The method or <MethodGroup> to be attached.
         */
        attach(listener) {
            if (listener instanceof MethodGroup)
                this.attachedHandlers.push(listener);
            else
                this.attachedListeners.push(listener);
        }
        _detachHandler(handler) {
            let index = this.attachedHandlers.indexOf(handler);
            this.attachedHandlers.splice(index, 1);
        }
        _detachListener(listener) {
            let index = this.attachedListeners.indexOf(listener);
            this.attachedListeners.splice(index, 1);
        }
        /**
         * Detaches the specified method or <MethodGroup> from this <MethodGroup>.
         * @param listener The method or <MethodGroup> to be detached.
         */
        detach(listener) {
            if (listener instanceof MethodGroup)
                this._detachHandler(listener);
            else
                this._detachListener(listener);
        }
    }
    Core.MethodGroup = MethodGroup;
})(Core || (Core = {}));
///<reference path="Core.MethodGroup.ts"/>
///<reference path="Core.Validation.ts"/>
var Core;
///<reference path="Core.MethodGroup.ts"/>
///<reference path="Core.Validation.ts"/>
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
            let ListSymbols;
            (function (ListSymbols) {
                ListSymbols.rawArray = Symbol.for("rawArray");
            })(ListSymbols || (ListSymbols = {}));
            class List {
                constructor(arg) {
                    /**
                     * Gets invoked every time a new item gets added to this list.
                     */
                    this.itemAddedEvent = new ListEvent(this);
                    /**
                     * Gets invoked every time an item gets removed from this list.
                     */
                    this.itemRemovedEvent = new ListEvent(this);
                    /**
                     * Gets invoked every time an item gets replaced by a new one in this list.
                     */
                    this.itemChangedEvent = new ListEvent(this);
                    this[ListSymbols.rawArray] = new Array();
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
                    return this[ListSymbols.rawArray].values();
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
                    return this[ListSymbols.rawArray][index];
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
                    this[ListSymbols.rawArray][index] = item;
                }
                /**
                 * Gets the number of elements inside this list.
                 * @returns The number of elements in this list.
                 */
                get count() {
                    return this[ListSymbols.rawArray].length;
                }
                /**
                 * Converts this list to an array.
                 * @returns The resulting array.
                 */
                toArray() {
                    return this[ListSymbols.rawArray].slice();
                }
                invokeOnItemAdded(args) {
                    this.itemAddedEvent.invoke(args);
                }
                invokeOnItemRemoved(args) {
                    this.itemRemovedEvent.invoke(args);
                }
                invokeOnItemChanged(args) {
                    this.itemChangedEvent.invoke(args);
                }
                /**
                 * Gets the first item in this list.
                 * @returns The first item in this list.
                 */
                getFirst() {
                    return this[ListSymbols.rawArray].slice(0, 1)[0];
                }
                /**
                 * Gets the last item in this list.
                 * @returns The last item in this list.
                 */
                getLast() {
                    return this[ListSymbols.rawArray].slice(-1)[0];
                }
                /**
                 * Returns the zero-based position of the specified item in this list, or -1 if no match is found.
                 * @param item The item being searched.
                 * @param startIndex Optional. The index at which the search is started.
                 * @returns The index of the matching item.
                 */
                indexOf(item, startIndex) {
                    return this[ListSymbols.rawArray].indexOf(item, startIndex);
                }
                /**
                 * Returns the last zero-based position of the specified item in this list, or -1 if no match is
                 * found.
                 * @param item The item being searched.
                 * @param endIndex Optional. The index at which the search is stopped.
                 * @returns The index of the last matching item.
                 */
                lastIndexOf(item, endIndex) {
                    return this[ListSymbols.rawArray].lastIndexOf(item, endIndex);
                }
                /**
                 * Adds multiple items to this list.
                 * @param items The items being added.
                 */
                addRange(items) {
                    this[ListSymbols.rawArray].push(...items);
                }
                /**
                 * Adds an item to this list.
                 * @param item The item being added.
                 */
                add(item) {
                    this[ListSymbols.rawArray].push(item);
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
                    this[ListSymbols.rawArray].splice(index, 0, ...items);
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
                    this[ListSymbols.rawArray].splice(index, 0, item);
                }
                /**
                 * Moves an item in this list from a zero-based position to another.
                 * @param oldIndex The position the item is at.
                 * @param newIndex The position the item is being moved to.
                 * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
                 * bounds.
                 */
                move(oldIndex, newIndex) {
                    let item = this.removeAt(oldIndex);
                    if (oldIndex < newIndex)
                        newIndex--;
                    this.insert(newIndex, item);
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
                    return this[ListSymbols.rawArray].splice(index, 1)[0];
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
                    return this[ListSymbols.rawArray].splice(startIndex, removeCount);
                }
                /**
                 * Replaces the item at the specified zero-based position by another, and returns it.
                 * @param index The position of the item being replaced.
                 * @param newItem The item replacing the current item at the specified position.
                 * @returns The item being replaced.
                 */
                replaceAt(index, newItem) {
                    return this[ListSymbols.rawArray].splice(index, 1, newItem)[0];
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
                    let rawArray = this[ListSymbols.rawArray];
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
                get(target, propertyKey, receiver) {
                    if (propertyKeyIsIndex)
                        return target.getItemAt(propertyKey);
                    else if (!(target[propertyKey] instanceof Function))
                        return target.getByKey(propertyKey);
                    else
                        return Reflect.get(target, propertyKey, receiver);
                }
                set(target, propertyKey, value, receiver) {
                    if (propertyKeyIsIndex) {
                        target.setItemAt(propertyKey, value);
                        return true;
                    }
                    else if (!(target[propertyKey] instanceof Function)) {
                        target.setByKey(propertyKey, value);
                        return true;
                    }
                    else
                        return Reflect.set(target, propertyKey, value, receiver);
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
            class ListEvent extends Core.MethodGroup {
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
            Generic.ListEvent = ListEvent;
        })(Generic = Collections.Generic || (Collections.Generic = {}));
    })(Collections = Core.Collections || (Core.Collections = {}));
})(Core || (Core = {}));
///<reference path="Core.Collections.Generic.ts"/>
var Core;
///<reference path="Core.Collections.Generic.ts"/>
(function (Core) {
    var Animations;
    (function (Animations) {
        let TimeStampUnit;
        (function (TimeStampUnit) {
            TimeStampUnit[TimeStampUnit["Milliseconds"] = 0] = "Milliseconds";
            TimeStampUnit[TimeStampUnit["Seconds"] = 1] = "Seconds";
            TimeStampUnit[TimeStampUnit["Minutes"] = 2] = "Minutes";
            TimeStampUnit[TimeStampUnit["Hours"] = 3] = "Hours";
            TimeStampUnit[TimeStampUnit["Percent"] = 4] = "Percent";
        })(TimeStampUnit || (TimeStampUnit = {}));
        class TimeStamp {
            static _parseUnit(unitStr) {
                switch (unitStr) {
                    case "h":
                        return TimeStampUnit.Hours;
                    case "min":
                        return TimeStampUnit.Minutes;
                    case "s":
                        return TimeStampUnit.Seconds;
                    case "ms":
                        return TimeStampUnit.Milliseconds;
                    case "%":
                        return TimeStampUnit.Percent;
                }
                return null;
            }
            static parse(str) {
                let valueStr = str.match(/^\d+/);
                if (valueStr === null)
                    throw new Core.Exceptions.InvalidOperationException("Cannot parse time stamp. Value is missing.");
                let value = Number(valueStr), unitStr = str.substring(valueStr.length), unit = this._parseUnit(unitStr);
                if (unit === null)
                    throw new Core.Exceptions.InvalidOperationException("Cannor parse time stamp. Invalid or missing unit.");
                return new TimeStamp(value, unit);
            }
            constructor(value, unit) {
                this.value = value;
                this.unit = unit;
            }
        }
        class AnimationScene {
        }
        class AnimationSceneList extends Core.Collections.Generic.List {
        }
        class AnimationStoryboard {
            constructor(...scenes) {
                this.scenes = new AnimationSceneList(scenes);
            }
            toKeyframes() {
                return null;
            }
        }
        Animations.KEYFRAMES_FADEIN = { filter: ["opacity(0)", "opacity(1)"] };
        Animations.KEYFRAMES_FADEOUT = { filter: ["opacity(1)", "opacity(0)"] };
        Animations.KEYFRAMES_BOUNCE = {
            transform: ["translate(0, 0)", "translate(10%, 0)", "translate(-10%, 0)",
                "translate(10%, 0)", "translate(-10%, 0)", "translate(0, 0)"]
        };
        Animations.KEYFRAMES_GROW = { transform: ["scale(.8)", "scale(1)"] };
        Animations.KEYFRAMES_SHRINK = { transform: ["scale(1.2)", "scale(1)"] };
        Animations.KEYFRAMES_FLIP = { transform: ["rotateX(90deg)", "rotateX(0deg)"] };
    })(Animations = Core.Animations || (Core.Animations = {}));
})(Core || (Core = {}));
///<reference path="Core.MethodGroup.ts"/>
var Core;
///<reference path="Core.MethodGroup.ts"/>
(function (Core) {
    var Events;
    (function (Events) {
        class ProgressEvent extends Core.MethodGroup {
            stopPropagation() {
                super.stopPropagation();
            }
            invoke(args) {
                super.invoke(args);
            }
            attach(listener) {
                super.attach(listener);
            }
            detach(listener) {
                super.detach(listener);
            }
        }
        Events.ProgressEvent = ProgressEvent;
        class PropertyChangedEvent extends Core.MethodGroup {
            stopPropagation() {
                super.stopPropagation();
            }
            invoke(args) {
                super.invoke(args);
            }
            attach(listener) {
                super.attach(listener);
            }
            detach(listener) {
                super.detach(listener);
            }
        }
        Events.PropertyChangedEvent = PropertyChangedEvent;
    })(Events = Core.Events || (Core.Events = {}));
})(Core || (Core = {}));
///<reference path="Core.Validation.ts"/>
///<reference path="Core.Events.ts"/>
var Core;
///<reference path="Core.Validation.ts"/>
///<reference path="Core.Events.ts"/>
(function (Core) {
    var APIs;
    (function (APIs) {
        const API_SCRIPT_PATTERN = "^\"use strict\";\nclass {0}API extends Core.APIs.API {\\.*}$";
        let APILoaderPendingStatus;
        (function (APILoaderPendingStatus) {
            APILoaderPendingStatus[APILoaderPendingStatus["Pending"] = 0] = "Pending";
            APILoaderPendingStatus[APILoaderPendingStatus["LoadError"] = 1] = "LoadError";
            APILoaderPendingStatus[APILoaderPendingStatus["Invalid"] = 2] = "Invalid";
            APILoaderPendingStatus[APILoaderPendingStatus["Loaded"] = 3] = "Loaded";
        })(APILoaderPendingStatus = APIs.APILoaderPendingStatus || (APIs.APILoaderPendingStatus = {}));
        class API {
        }
        APIs.API = API;
        class APILoader {
            constructor(apiName, apiURL) {
                this._loadedContent = null;
                this._apiName = apiName;
                this._apiURL = apiURL;
                this._loadAPI();
            }
            _applyAPI(loadedContent) {
                const API_VERIFICATION_REGEXP = new RegExp(Core.StringUtils.format(API_SCRIPT_PATTERN, this._apiName));
                if (API_VERIFICATION_REGEXP.test(loadedContent)) {
                }
            }
            _loadAPI() {
                let api = this;
                let ajax = this._ajaxRequest = Core.Web.Ajax.get(this._apiURL, new Core.Web.AjaxRequestOptions());
                function ajaxLoaded(target, args) {
                    api._applyAPI(args.baseRequest.responseText);
                }
                ajax.loadedEvent.attach(ajaxLoaded);
                function ajaxError(target, args) {
                }
                ajax.errorEvent.attach(ajaxError);
            }
        }
        APIs.APILoader = APILoader;
    })(APIs = Core.APIs || (Core.APIs = {}));
})(Core || (Core = {}));
(function (Core) {
    var Events;
    (function (Events) {
        class APILoaderEvent extends Core.MethodGroup {
            constructor(target, defaultListener) {
                super(target);
            }
            attach(listener) {
                super.attach(listener);
            }
            detach(listener) {
                super.detach(listener);
            }
            invoke(thisArg) {
                super.invoke(null);
            }
        }
        Events.APILoaderEvent = APILoaderEvent;
    })(Events = Core.Events || (Core.Events = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    //array manipulator utility
    class ArrayUtils {
        static syncArrays(srcArray, destArray, removeCallback, insertCallback, changeCallback, thisArg) {
            //change the items both arrays have in common
            for (var i = 0; i < srcArray.length && i < destArray.length; i++)
                //call <function removeCallback(srcArray, destArray, index) { }>
                changeCallback.call(thisArg, srcArray, destArray, i);
            //if there are not enough items, insert new ones
            if (srcArray.length > destArray.length)
                for (var i = Math.max(destArray.length - 1, 0); i < srcArray.length; i++) {
                    destArray.splice(i, 0, 
                    //call <function removeCallback(srcArray, index) { }>
                    insertCallback.call(thisArg, srcArray, i));
                }
            else if (srcArray.length < destArray.length)
                for (var i = Math.max(srcArray.length - 1, 0); i < destArray.length; i++) {
                    var removedItem = destArray.splice(i, 1)[0];
                    //call <function removeCallback(splicedItem, index) { }>
                    removeCallback.call(thisArg, removedItem, i);
                }
        }
    }
    Core.ArrayUtils = ArrayUtils;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Decorators;
    (function (Decorators) {
        function enumerable(isEnumerable) {
            return function (target, key, descriptor) {
                descriptor.enumerable = isEnumerable;
            };
        }
        Decorators.enumerable = enumerable;
        function writable(isWritable) {
            return function (target, key, descriptor) {
                descriptor.writable = isWritable;
            };
        }
        Decorators.writable = writable;
        function configurable(isConfigurable) {
            return function (target, key, descriptor) {
                descriptor.configurable = isConfigurable;
            };
        }
        Decorators.configurable = configurable;
    })(Decorators = Core.Decorators || (Core.Decorators = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var HashCode;
    (function (HashCode) {
        function fromString(str) {
            let outHashCode = 0;
            if (str.length === 0)
                return outHashCode;
            for (let i = 0; i < str.length; i++) {
                let chr = str.charCodeAt(i);
                outHashCode = ((outHashCode << 5) - outHashCode) + chr;
            }
            return outHashCode;
        }
        HashCode.fromString = fromString;
        function concatenate(hashCodes) {
            let outHashCode = 17;
            for (let hashCode of hashCodes)
                outHashCode = ((outHashCode << 5) - outHashCode) + hashCode;
            return outHashCode;
        }
        HashCode.concatenate = concatenate;
    })(HashCode = Core.HashCode || (Core.HashCode = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var ObjectiveXML;
    (function (ObjectiveXML) {
        let IDependencyObject;
        (function (IDependencyObject) {
            function getValue(owner, property) {
                return null;
            }
            IDependencyObject.getValue = getValue;
            function setValue(owner, property, value) {
            }
            IDependencyObject.setValue = setValue;
        })(IDependencyObject = ObjectiveXML.IDependencyObject || (ObjectiveXML.IDependencyObject = {}));
        class DependencyObject extends Object {
            /**
             * Gets the value of the specified dependency property.
             * @param property The dependency property.
             */
            getValue(property) {
                return IDependencyObject.getValue(this, property);
            }
            /**
             * Sets the value of the specified dependency property.
             * @param property The dependency property.
             * @param value The new value for the specified dependency property.
             */
            setValue(property, value) {
                IDependencyObject.setValue(this, property, value);
            }
        }
        ObjectiveXML.DependencyObject = DependencyObject;
        class DependencyObjectType {
            constructor(id, name, environmentType) {
                this.id = id;
                this.name = name;
                this.environmentType = environmentType;
                return Object.freeze(this);
            }
            static _getUniqueId(type) {
                let depObjType = this._registeredTypes.first((item) => Object.is(item.environmentType, type)), newId = this._registeredTypes.count;
                if (depObjType !== null)
                    return depObjType.id;
                return newId;
            }
            static fromSystemType(type) {
                let id = this._getUniqueId(type), name = type.constructor.name;
                return new DependencyObjectType(id, name, type);
            }
            /**
             * Gets the DependencyObjectType of the immediate base class of the current DependencyObjectType.
             */
            get baseType() {
                let baseEnvironmentType = Object.getPrototypeOf(this.environmentType);
                return DependencyObjectType.fromSystemType(baseEnvironmentType);
            }
        }
        DependencyObjectType._registeredTypes = new Core.Collections.Generic.List();
        ObjectiveXML.DependencyObjectType = DependencyObjectType;
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
            constructor(defaultValue, propertyChangedCallback, coerceValueCallback) {
                this.defaultValue = defaultValue;
                this.propertyChangedCallback = propertyChangedCallback;
                this.coerceValueCallback = coerceValueCallback;
            }
            /**
             * Called when this metadata has been applied to a property, which indicates that the metadata is being sealed.
             * @param dp The dependency property to which the metadata has been applied.
             * @param targetType The type associated with this metadata if this is type-specific metadata. If this
             * is default metadata, this value is a null reference.
             */
            onApply(dp, targetType) {
            }
            /**
             * Merges this metadata with the base metadata.
             * @param baseMetadata The base metadata to merge with this instance's values.
             * @param dp The dependency property to which this metadata is being applied.
             */
            merge(baseMetadata, dp) {
            }
        }
        ObjectiveXML.PropertyMetadata = PropertyMetadata;
        class DependencyPropertyRegistryEntry {
            constructor(property, metadata) {
                this.property = property;
                this.metadata = metadata;
            }
        }
        ObjectiveXML.DependencyPropertyRegistryEntry = DependencyPropertyRegistryEntry;
        let DependencyPropertyRegistry;
        (function (DependencyPropertyRegistry) {
            let registryEntries;
            function register(property, metadata) {
                let entry = new DependencyPropertyRegistryEntry(property, metadata), globalIndex = registryEntries.count;
                registryEntries.add(entry);
                return globalIndex;
            }
            DependencyPropertyRegistry.register = register;
        })(DependencyPropertyRegistry || (DependencyPropertyRegistry = {}));
        class DependencyPropertyKey {
            /**
             * Overrides the metadata of a read-only dependency property that is represented by this dependency
             * property identifier.
             * @param ownerType
             * @param metadata
             */
            overrideMetadata(forType, typeMetadata) {
            }
        }
        ObjectiveXML.DependencyPropertyKey = DependencyPropertyKey;
        class DependencyProperty {
            static _registerCommon(name, propertyType, ownerType, metadata, validateValueCallback) {
                let keyStr = `${ownerType.inheritanceToString()}#${name}`, key = Core.HashCode.fromString(keyStr);
                return null;
            }
            /**
             * Registers a dependency property with the specified property name, property type, owner type,
             * property metadata, and a value validation callback for the property.
             * @param name
             * @param propertyType
             * @param ownerType
             * @param metadata
             * @param validateValueCallback
             */
            static register(name, propertyType, ownerType, metadata, validateValueCallback) {
                return this._registerCommon(name, propertyType, ownerType, metadata, validateValueCallback);
            }
            /**
             * Registers an attached property with the specified property type, owner type, property metadata,
             * and value validation callback for the property.
             * @param name
             * @param propertyType
             * @param ownerType
             * @param metadata
             * @param validateValueCallback
             */
            static registerAttached(name, propertyType, ownerType, metadata, validateValueCallback) {
                return this._registerCommon(name, propertyType, ownerType, metadata, validateValueCallback);
            }
            /**
             * Adds another type as an owner of a dependency property that has already been registered, providing
             * dependency property metadata for the dependency property as it will exist on the  provided owner type.
             * @param ownerType
             * @param metadata
             */
            addOwner(ownerType, metadata) {
                return null;
            }
            /**
             * Returns the metadata for this dependency property as it exists on a specified type.
             * @param owner
             */
            getMetadata(owner) {
            }
        }
        DependencyProperty._propertyFromName = new Core.Collections.Generic.Dictionary();
        ObjectiveXML.DependencyProperty = DependencyProperty;
    })(ObjectiveXML = Core.ObjectiveXML || (Core.ObjectiveXML = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var ObjectManipulation;
    (function (ObjectManipulation) {
        function cloneObject(obj) {
            function cloneRecursive(value, recursionArray) {
                let outValue = null;
                console.log(recursionArray);
                if (recursionArray.findIndex(r => Object.is(r, value)) !== -1)
                    return;
                recursionArray = new Array(...recursionArray);
                recursionArray.push(value);
                if (value !== null && typeof value === "object") {
                    outValue = {};
                    Object.setPrototypeOf(outValue, Object.getPrototypeOf(value));
                    for (let name in value) {
                        let member = value[name], outMember = null;
                        outMember = cloneRecursive(member, recursionArray);
                        outValue[name] = outMember;
                    }
                }
                else
                    outValue = value;
                return outValue;
            }
            return cloneRecursive(obj, []);
        }
        ObjectManipulation.cloneObject = cloneObject;
    })(ObjectManipulation = Core.ObjectManipulation || (Core.ObjectManipulation = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    class StringScannerBranchList extends Core.Collections.Generic.List {
    }
    Core.StringScannerBranchList = StringScannerBranchList;
    let StringScannerBranchSymbols;
    (function (StringScannerBranchSymbols) {
        StringScannerBranchSymbols.index = Symbol.for("index");
        StringScannerBranchSymbols.startIndex = Symbol.for("startIndex");
        StringScannerBranchSymbols.parentBranch = Symbol.for("parentBranch");
    })(StringScannerBranchSymbols || (StringScannerBranchSymbols = {}));
    class StringScannerBranch {
        constructor(parentBranch, startIndex) {
            this[StringScannerBranchSymbols.parentBranch] = parentBranch;
            this[StringScannerBranchSymbols.index] = startIndex;
            this[StringScannerBranchSymbols.startIndex] = startIndex;
        }
        /**Gets a string representing the current character.*/
        get currentChar() {
            if (this.index < 0 || this.index >= this.length)
                return null;
            return this.content[this.index];
        }
        /**Returns the partial string from the start position up to, but not including, the current index,
         * trimming the start and end by the specified amount.
         * @param trimEnd The number of characters being removed from the start of the string. If negative, the string
         * is extended instead.
         * @param trimStart The number of characters being removed from the end of the string. If negative, the string
         * is extended instead.*/
        getPartialString(trimStart, trimEnd) {
            return this.content.substring(trimStart + this.startIndex, trimEnd + this.index);
        }
        /**Gets the partial string from the start position up to, but not including, the current index.*/
        get partialString() {
            return this.content.substring(this.startIndex, this.index);
        }
        /**Gets the content being scanned, by reflecting the content of the parent branch.*/
        get content() {
            if (this.parentBranch === null)
                throw new Core.Exceptions.InvalidOperationException("Cannot get content. No parent branch was found to" +
                    " reflect the content from.");
            return this.parentBranch.content;
        }
        /**Creates a sub-branch from this branch. */
        derive() {
            return new StringScannerBranch(this, this.index);
        }
        /**Writes the current index to the parent branch. */
        update() {
            if (this.parentBranch === null)
                throw new Core.Exceptions.InvalidOperationException("Cannot update. This branch has no parent branch" +
                    " to update to.");
            this.parentBranch[StringScannerBranchSymbols.index] = this.index;
        }
        /**Gets the current zero-based position inside the content.*/
        get index() {
            return this[StringScannerBranchSymbols.index];
        }
        /**Gets the relative recursion from the start index to the current index. */
        get count() {
            return this.index - this.startIndex;
        }
        /**Gets length of the content being scanned. */
        get length() {
            return this.content.length;
        }
        /**Gets the current zero-based position inside the content.*/
        get startIndex() {
            return this[StringScannerBranchSymbols.startIndex];
        }
        /**Gets the parent branch this commits to, or null if this is the main branch.*/
        get parentBranch() {
            return this[StringScannerBranchSymbols.parentBranch];
        }
        /**Advances the current index by the specified amount.
         * @param steps
         */
        advance(steps = 1) {
            this[StringScannerBranchSymbols.index] += steps;
        }
        /**
         * Jumps the current index to the spcified index.
         * @param index
         */
        jump(index) {
            this[StringScannerBranchSymbols.index] = index;
        }
        /**Resets the current index to the start index. */
        reset() {
            this[StringScannerBranchSymbols.index] = this.startIndex;
        }
    }
    Core.StringScannerBranch = StringScannerBranch;
    let StringScannerSymbols;
    (function (StringScannerSymbols) {
        StringScannerSymbols.content = Symbol.for("content");
    })(StringScannerSymbols || (StringScannerSymbols = {}));
    class StringScanner extends StringScannerBranch {
        /**
         * Creates a new instance of the StringScanner class.
         * @param content The content being scanned.
         * @param startIndex The zero-based position at which to start scanning.
         */
        constructor(content, startIndex = 0) {
            super(null, startIndex);
            this[StringScannerSymbols.content] = content;
        }
        /**Gets the content being scanned*/
        get content() {
            return this[StringScannerSymbols.content];
        }
    }
    Core.StringScanner = StringScanner;
    class SearchMatch {
        constructor(value, startIndex) {
            this.value = value;
            this.startIndex = startIndex;
            this.endIndex = startIndex + value.length;
            this.count = value.length;
        }
    }
    Core.SearchMatch = SearchMatch;
    class SearchMatchList extends Array {
        constructor(...matches) {
            //Initialization
            super(...matches);
        }
        static _getMatches(input, regexp) {
            let result = new SearchMatch[0];
            let origMatches = input.match(regexp);
            let lastIndex = 0;
            for (let i = 0; i < origMatches.length; i++) {
                let matchStr = origMatches[i];
                let matchIndex = input.indexOf(matchStr, lastIndex);
                result.push(new SearchMatch(matchStr, matchIndex));
                lastIndex = matchIndex;
            }
            return result;
        }
        static searchString(input, regexp) {
            let matches = SearchMatchList._getMatches(input, regexp);
            return new SearchMatchList(...matches);
        }
    }
    Core.SearchMatchList = SearchMatchList;
    let StringUtils;
    (function (StringUtils) {
        // This encoding function is from Philippe Tenenhaus's example at http://www.philten.com/us-xmlhttprequest-image/
        function encodeBase64(inputStr) {
            let b64 = Core.StringUtils.toCharRange("A-Za-z0-9+/=");
            let outputStr = "";
            let i = 0;
            while (i < inputStr.length) {
                //all three "& 0xff" added below are there to fix a known bug 
                //with bytes returned by xhr.responseText
                let byte1 = inputStr.charCodeAt(i++) & 0xff;
                let byte2 = inputStr.charCodeAt(i++) & 0xff;
                let byte3 = inputStr.charCodeAt(i++) & 0xff;
                let enc1 = byte1 >> 2;
                let enc2 = ((byte1 & 3) << 4) | (byte2 >> 4);
                let enc3, enc4;
                if (isNaN(byte2)) {
                    enc3 = enc4 = 64;
                }
                else {
                    enc3 = ((byte2 & 15) << 2) | (byte3 >> 6);
                    if (isNaN(byte3)) {
                        enc4 = 64;
                    }
                    else {
                        enc4 = byte3 & 63;
                    }
                }
                outputStr += b64[enc1] + b64[enc2] + b64[enc3] + b64[enc4];
            }
            return outputStr;
        }
        StringUtils.encodeBase64 = encodeBase64;
        function isValidIdentifier(str) {
            return /^[a-zA-Z_]\w*$/.test(str);
        }
        StringUtils.isValidIdentifier = isValidIdentifier;
        function capitalize(str) {
            return str.replace(/(?:^|s)S/g, (match) => match.toUpperCase());
        }
        StringUtils.capitalize = capitalize;
        function toCamelCase(str) {
            return str.replace(/^\w|[\s-]\w/g, (match, index) => {
                match = match.replace(/[\s-]/, "");
                return index == 0 ? match.toLowerCase() : match.toUpperCase();
            });
        }
        StringUtils.toCamelCase = toCamelCase;
        function fromCamelCase(str) {
            return str.replace(/^[a-z]|[A-Z]/g, (match, index) => (index > 0 ? " " : "") + match.toUpperCase());
        }
        StringUtils.fromCamelCase = fromCamelCase;
        function splice(str, start, delCount, newSubStr) {
            if (start < 0 || start >= str.length)
                throw new Core.Exceptions.ArgumentOutOfRangeException("start");
            if (delCount < 0 || (start + delCount) >= str.length)
                throw new Core.Exceptions.ArgumentOutOfRangeException("delCount");
            return str.slice(0, start) + newSubStr + str.slice(start + delCount);
        }
        StringUtils.splice = splice;
        //Formats the provided test, replacing the parameter indexes by their respective values
        function format(text, ...params) {
            return text.replace(/{\d+}/g, (match) => {
                let paramIndexStr = match.replace(/^{|}$/g, "");
                return String(params[paramIndexStr]);
            });
        }
        StringUtils.format = format;
        //Returns a SearchMatchList containing all the matches for the desired RegExp.
        function searchRegExp(str, regexp) {
            return SearchMatchList.searchString(str, regexp);
        }
        StringUtils.searchRegExp = searchRegExp;
        //Gets the char range between two characters
        function getCharRange(startChar, endChar) {
            let result = [];
            for (let code = startChar.charCodeAt(0); code <= endChar.charCodeAt(0); code++)
                result.push(String.fromCharCode(code));
            return result;
        }
        StringUtils.getCharRange = getCharRange;
        /**
         * Gets the char range denoted by a RegEx-like [] notation.
         * @param representation
         */
        function toCharRange(representation) {
            const CHAR_RANGE_MARK = "-";
            const ESCAPE_SEQUENCE_MARK = "\\";
            const ESCAPE_SEQUENCE_UNICODE_MARK = "u";
            let outCharArr = [];
            function readUnicodeEscapeSequence(branch) {
                const UNICODE_CODE_LENGTH = 4;
                let codeIsRightLength = s => s.length >= UNICODE_CODE_LENGTH;
                let codeFromHex = s => Number.parseInt(s, 16);
                let charFromCode = n => String.fromCharCode(n);
                if (branch.currentChar === ESCAPE_SEQUENCE_UNICODE_MARK) {
                    branch.advance();
                    let unicodeEscapeSequenceBranch = branch.derive();
                    unicodeEscapeSequenceBranch.advance(4);
                    let unicodeCodeHex = unicodeEscapeSequenceBranch.partialString;
                    if (codeIsRightLength(unicodeCodeHex))
                        throw new Core.Exceptions.FormatException(`Expected a code point length of ${UNICODE_CODE_LENGTH}, but found ${unicodeCodeHex.length} instead.`);
                    let unicodeCode = codeFromHex(unicodeCodeHex);
                    if (isNaN(unicodeCode))
                        throw new Core.Exceptions.FormatException(`Unexpected token "${unicodeCodeHex}". An hexadecimal code was expected.`);
                    unicodeEscapeSequenceBranch.update();
                    return charFromCode(unicodeCode);
                }
                return null;
            }
            function readEscapeSequence(branch) {
                if (branch.currentChar === ESCAPE_SEQUENCE_MARK) {
                    let escapeSequenceBranch = branch.derive();
                    escapeSequenceBranch.advance();
                    let unicodeChar = null;
                    if ((unicodeChar = readUnicodeEscapeSequence(escapeSequenceBranch)) !== null) {
                        escapeSequenceBranch.update();
                        return unicodeChar;
                    }
                    else {
                        escapeSequenceBranch.advance(1);
                        let escapedChar = escapeSequenceBranch.currentChar;
                        escapeSequenceBranch.update();
                        return escapedChar;
                    }
                }
                return null;
            }
            function readChar(branch) {
                let char = null;
                if ((char = readEscapeSequence(branch)) !== null)
                    return char;
                else {
                    char = branch.currentChar;
                    branch.advance();
                    return char;
                }
            }
            function readCharRange(branch) {
                let charRangeBranch = branch.derive();
                let startChar = readChar(charRangeBranch);
                if (charRangeBranch.currentChar === CHAR_RANGE_MARK) {
                    charRangeBranch.advance();
                    let endChar = readChar(charRangeBranch);
                    if (endChar === null)
                        throw new Core.Exceptions.FormatException("Unexpected end of the string.");
                    charRangeBranch.update();
                    return { start: startChar, end: endChar };
                }
                return null;
            }
            function readAll() {
                let scanner = new StringScanner(representation);
                let charRange = null, char = null;
                while (true) {
                    if ((charRange = readCharRange(scanner)) !== null)
                        outCharArr = [...outCharArr, ...getCharRange(charRange.start, charRange.end)];
                    else if ((char = readChar(scanner)) !== null)
                        outCharArr.push(char);
                    else
                        break;
                }
            }
            readAll();
            return outCharArr;
        }
        StringUtils.toCharRange = toCharRange;
        //Returns the index of any of the specified strings, from the specified start position
        function indexOfAny(str, searchStrings, position = 0) {
            for (let i = 0; i < searchStrings.length; i++) {
                let matchIndex = str.indexOf(searchStrings[i], position);
                if (matchIndex >= 0)
                    return matchIndex;
            }
            return -1;
        }
        StringUtils.indexOfAny = indexOfAny;
        //Returns the index of any of the specified strings, from the specified start position
        function lastIndexOfAny(str, searchStrings, position = 0) {
            for (let i = 0; i < searchStrings.length; i++) {
                let matchIndex = str.lastIndexOf(searchStrings[i], position);
                if (matchIndex >= 0)
                    return matchIndex;
            }
            return -1;
        }
        StringUtils.lastIndexOfAny = lastIndexOfAny;
        function matchString(str, regex) {
            let matches = str.match(regex);
            if (matches === null)
                return null;
            return matches.toString();
        }
        StringUtils.matchString = matchString;
        function indexOfRegex(str, regex, fromIndex) {
            let subStr = str.substring(fromIndex), matches = subStr.match(regex);
            if (matches === null)
                return -1;
            return matches.index;
        }
        StringUtils.indexOfRegex = indexOfRegex;
        function indexOfRegexOrDefault(str, regex, fromIndex, defaultIndex) {
            let index = indexOfRegex(str, regex, fromIndex);
            return index == -1 ? defaultIndex : index;
        }
        StringUtils.indexOfRegexOrDefault = indexOfRegexOrDefault;
    })(StringUtils = Core.StringUtils || (Core.StringUtils = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    Core.UNDEF = "undefined";
    Core.STRING = "string";
    Core.NUMBER = "number";
    Core.BOOL = "boolean";
})(Core || (Core = {}));
var Core;
(function (Core) {
    class Type {
        /**
         * Creates a new instance of Type from the specified instance or constructor.
         * @param obj The instance or constructor the Type is being created from.
         */
        constructor(obj) {
            this._typeConstructor = Type._getConstructor(obj);
        }
        static _getConstructor(obj) {
            if (obj instanceof Function)
                return obj;
            else
                return obj.constructor;
        }
        static _getParentType(constr) {
            let superclass = Object.getPrototypeOf(constr.prototype);
            if (superclass === null)
                return null;
            return new Type(superclass);
        }
        /**
         * Returns a value indicating whether the specified source type is equivalent to the specified reference type.
         * @param tSrc The source type.
         * @param tRef The reference type.
         */
        static equals(tSrc, tRef) {
            return Object.is(tSrc._typeConstructor, tRef._typeConstructor);
        }
        /** Returns the name of this Type.*/
        get name() {
            return this._typeConstructor.name;
        }
        /** Returns the parent type of this Type.*/
        get parentType() {
            return Type._getParentType(this._typeConstructor);
        }
        /**
         * Returns a value indicating whether the specified source type is equivalent to the specified reference type.
         * @param tRef The reference type.
         */
        equals(tRef) {
            return Type.equals(this, tRef);
        }
        /**Returns a string representing the inheritance tree for this type. */
        inheritanceToString() {
            let parentTypeNameArr = [], parentType = this;
            do {
                parentTypeNameArr.push(parentType.name);
            } while (parentType = parentType.parentType);
            return parentTypeNameArr.reverse().join("->");
        }
    }
    Core.Type = Type;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var UserInterface;
    (function (UserInterface) {
        let ContentType;
        (function (ContentType) {
            ContentType[ContentType["Text"] = 0] = "Text";
            ContentType[ContentType["HTML"] = 1] = "HTML";
        })(ContentType = UserInterface.ContentType || (UserInterface.ContentType = {}));
        class Content {
            constructor(value, type = ContentType.Text) {
                type = type;
                this.type = type;
                this.value = value;
                return Object.freeze(this);
            }
        }
        UserInterface.Content = Content;
        class Percentage extends Number {
            static parse(str) {
                const PERCENTAGE_REGEX = /^(?<number>\d+?)%/;
                if (PERCENTAGE_REGEX.test(str))
                    return null;
                let exec = PERCENTAGE_REGEX.exec(str), numberStr = exec["groups"]["number"];
                return super.parseFloat(numberStr);
            }
            toString() {
                return `${super.toString.call(this)}%`;
            }
        }
        UserInterface.Percentage = Percentage;
        let ColorType;
        (function (ColorType) {
            ColorType[ColorType["RGB"] = 0] = "RGB";
            ColorType[ColorType["RGBA"] = 1] = "RGBA";
            ColorType[ColorType["CMYK"] = 2] = "CMYK";
            ColorType[ColorType["HSL"] = 3] = "HSL";
            ColorType[ColorType["HSV"] = 4] = "HSV";
        })(ColorType = UserInterface.ColorType || (UserInterface.ColorType = {}));
        const COLOR_RGB_MAX_INT_VALUE = (1 << 24) - 1;
        const COLOR_RGB_INT_FIELD_MASK = (1 << 8) - 1;
        class Color {
            constructor(type) {
                this.type = type;
            }
            static fromInt(value) {
                if (!Number.isInteger(value))
                    throw new Core.Exceptions.ArgumentException("value", "Parameter is not valid integer value.");
                if (value < 0 || value > COLOR_RGB_MAX_INT_VALUE)
                    throw new Core.Exceptions.ArgumentOutOfRangeException("value");
                let r = (value >>> 16) & COLOR_RGB_INT_FIELD_MASK, g = (value >>> 8) & COLOR_RGB_INT_FIELD_MASK, b = value & COLOR_RGB_INT_FIELD_MASK;
                return new ColorRGB(r.toString(), g.toString(), b.toString());
            }
            static parse(str) {
                let rgbInt = Number.parseInt(str), colorFromName = Colors.fromName(str);
                if (!isNaN(rgbInt))
                    return this.fromInt(rgbInt);
                else if (colorFromName)
                    return colorFromName;
                else
                    return ColorRGB.parse(str) || ColorRGBA.parse(str) || ColorCMYK.parse(str) || ColorHSL.parse(str) ||
                        ColorHSV.parse(str) || null;
            }
            toString() {
                return null;
            }
        }
        UserInterface.Color = Color;
        class ColorRGB extends Color {
            constructor(r, g, b) {
                super(ColorType.RGB);
                this.r = Percentage.parse(r) || Number.parseFloat(r);
                this.g = Percentage.parse(g) || Number.parseFloat(g);
                this.b = Percentage.parse(b) || Number.parseFloat(b);
                return Object.freeze(this);
            }
        }
        UserInterface.ColorRGB = ColorRGB;
        class ColorRGBA extends Color {
            constructor(r, g, b, a) {
                super(ColorType.RGBA);
                this.r = Percentage.parse(r) || Number.parseFloat(r);
                this.g = Percentage.parse(g) || Number.parseFloat(g);
                this.b = Percentage.parse(b) || Number.parseFloat(b);
                this.a = Percentage.parse(a) || Number.parseFloat(a);
                return Object.freeze(this);
            }
            static parse(str) {
                return null;
            }
        }
        UserInterface.ColorRGBA = ColorRGBA;
        class ColorCMYK extends Color {
            constructor(c, m, y, k) {
                super(ColorType.CMYK);
                this.c = Percentage.parse(c) || Number.parseFloat(c);
                this.m = Percentage.parse(m) || Number.parseFloat(m);
                this.y = Percentage.parse(y) || Number.parseFloat(y);
                this.k = Percentage.parse(k) || Number.parseFloat(k);
                return Object.freeze(this);
            }
        }
        UserInterface.ColorCMYK = ColorCMYK;
        class ColorHSL extends Color {
            constructor(h, s, l) {
                super(ColorType.HSL);
                this.h = Percentage.parse(h) || Number.parseFloat(h);
                this.s = Percentage.parse(s) || Number.parseFloat(s);
                this.l = Percentage.parse(l) || Number.parseFloat(l);
                return Object.freeze(this);
            }
        }
        UserInterface.ColorHSL = ColorHSL;
        class ColorHSV extends Color {
            constructor(h, s, v) {
                super(ColorType.HSV);
                this.h = Percentage.parse(h) || Number.parseFloat(h);
                this.s = Percentage.parse(s) || Number.parseFloat(s);
                this.v = Percentage.parse(v) || Number.parseFloat(v);
                return Object.freeze(this);
            }
        }
        UserInterface.ColorHSV = ColorHSV;
        class BrushList extends Core.Collections.Generic.List {
        }
        UserInterface.BrushList = BrushList;
        let BrushType;
        (function (BrushType) {
            BrushType[BrushType["Image"] = 0] = "Image";
            BrushType[BrushType["LinearGradient"] = 1] = "LinearGradient";
            BrushType[BrushType["RadialGradient"] = 2] = "RadialGradient";
            BrushType[BrushType["ConicGradient"] = 3] = "ConicGradient";
        })(BrushType = UserInterface.BrushType || (UserInterface.BrushType = {}));
        (function (BrushType) {
            function parse(str) {
                switch (str) {
                    case "url":
                        return BrushType.Image;
                    case "linear-gradient":
                        return BrushType.LinearGradient;
                    case "radial-gradient":
                        return BrushType.LinearGradient;
                    case "conic-gradient":
                        return BrushType.LinearGradient;
                }
                return null;
            }
            BrushType.parse = parse;
            function toString(type) {
                switch (type) {
                    case BrushType.Image:
                        return "url";
                    case BrushType.LinearGradient:
                        return "linear-gradient";
                    case BrushType.RadialGradient:
                        return "radial-gradient";
                    case BrushType.ConicGradient:
                        return "conic-gradient";
                }
                return null;
            }
            BrushType.toString = toString;
        })(BrushType = UserInterface.BrushType || (UserInterface.BrushType = {}));
        class Brush {
            constructor(type) {
                this.type = type;
            }
            static parse(str) {
                return null;
            }
            toString() {
                return null;
            }
        }
        UserInterface.Brush = Brush;
        class ImageBrush extends Brush {
            constructor(source) {
                super(BrushType.Image);
                this.source = source;
                return Object.freeze(this);
            }
        }
        UserInterface.ImageBrush = ImageBrush;
        class GradientBrush extends Brush {
            constructor(type, stops = []) {
                super(type);
                this.stops = new GradientStopList(stops);
            }
            static parse(str) {
                return null;
            }
            toString() {
                return null;
            }
        }
        UserInterface.GradientBrush = GradientBrush;
        class LinearGradientBrush extends GradientBrush {
            constructor(stops) {
                super(BrushType.LinearGradient, stops);
            }
        }
        UserInterface.LinearGradientBrush = LinearGradientBrush;
        class RadialGradientBrush extends GradientBrush {
            constructor(stops) {
                super(BrushType.RadialGradient, stops);
            }
        }
        UserInterface.RadialGradientBrush = RadialGradientBrush;
        class ConicGradientBrush extends GradientBrush {
            constructor(stops = []) {
                super(BrushType.ConicGradient, stops);
            }
        }
        UserInterface.ConicGradientBrush = ConicGradientBrush;
        class GradientStopList extends Core.Collections.Generic.List {
        }
        UserInterface.GradientStopList = GradientStopList;
        class GradientStop {
            constructor(color, offset) {
                this.color = color;
                this.offset = Percentage.parse(offset);
                return Object.freeze(this);
            }
        }
        UserInterface.GradientStop = GradientStop;
        let LengthUnit;
        (function (LengthUnit) {
            LengthUnit[LengthUnit["Number"] = 0] = "Number";
            LengthUnit[LengthUnit["Pixels"] = 1] = "Pixels";
            LengthUnit[LengthUnit["Percent"] = 2] = "Percent";
            LengthUnit[LengthUnit["Inches"] = 3] = "Inches";
            LengthUnit[LengthUnit["Millimeters"] = 4] = "Millimeters";
            LengthUnit[LengthUnit["Centimeters"] = 5] = "Centimeters";
            LengthUnit[LengthUnit["Points"] = 6] = "Points";
            LengthUnit[LengthUnit["Picas"] = 7] = "Picas";
            LengthUnit[LengthUnit["Em"] = 8] = "Em";
            LengthUnit[LengthUnit["Ex"] = 9] = "Ex";
        })(LengthUnit = UserInterface.LengthUnit || (UserInterface.LengthUnit = {}));
        (function (LengthUnit) {
            const STR_CONVERSION_MAP = [
                [LengthUnit.Number, ""],
                [LengthUnit.Pixels, "px"],
                [LengthUnit.Percent, "%"],
                [LengthUnit.Inches, "in"],
                [LengthUnit.Centimeters, "cm"],
                [LengthUnit.Millimeters, "mm"],
                [LengthUnit.Points, "pt"],
                [LengthUnit.Picas, "pc"],
                [LengthUnit.Em, "em"],
                [LengthUnit.Ex, "ex"]
            ];
            function parse(str) {
                let matches = STR_CONVERSION_MAP.filter(item => item[1] == str);
                if (matches.length == 0)
                    return null;
                else
                    return matches[0][0];
            }
            LengthUnit.parse = parse;
            function toString(style) {
                let matches = STR_CONVERSION_MAP.filter(item => item[0] == style);
                if (matches.length == 0)
                    return null;
                else
                    return matches[0][1];
            }
            LengthUnit.toString = toString;
        })(LengthUnit = UserInterface.LengthUnit || (UserInterface.LengthUnit = {}));
        class Length {
            constructor(value, unit) {
                this.value = value;
                this.unit = unit;
                return Object.freeze(this);
            }
            static getZero() {
                return new Length(0, LengthUnit.Number);
            }
            static parse(str) {
                //Find value in string
                let valueStr = Core.StringUtils.matchString(str, /^\d+/);
                if (valueStr === null)
                    throw new Core.Exceptions.InvalidOperationException("Cannot parse length. Missing value.");
                let value = Number(valueStr), //Parse value
                unitStr = str.substring(valueStr.length), //Get unit substring
                unit = LengthUnit.parse(unitStr); //Parse unit
                if (unit === null)
                    throw new Core.Exceptions.InvalidOperationException("Cannot parse length. Invalid unit.");
                if (isNaN(value))
                    throw new Error("Cannot parse length. Value is not a number.");
                return new Length(value, unit);
            }
            toString() {
                return String(this.value) + LengthUnit.toString(this.unit);
            }
        }
        UserInterface.Length = Length;
        let BorderStyle;
        (function (BorderStyle) {
            BorderStyle[BorderStyle["Hidden"] = 0] = "Hidden";
            BorderStyle[BorderStyle["Dotted"] = 1] = "Dotted";
            BorderStyle[BorderStyle["Dashed"] = 2] = "Dashed";
            BorderStyle[BorderStyle["Solid"] = 3] = "Solid";
            BorderStyle[BorderStyle["Double"] = 4] = "Double";
            BorderStyle[BorderStyle["Groove"] = 5] = "Groove";
            BorderStyle[BorderStyle["Ridge"] = 6] = "Ridge";
            BorderStyle[BorderStyle["Inset"] = 7] = "Inset";
            BorderStyle[BorderStyle["Inherit"] = 8] = "Inherit";
            BorderStyle[BorderStyle["Unset"] = 9] = "Unset";
        })(BorderStyle = UserInterface.BorderStyle || (UserInterface.BorderStyle = {}));
        (function (BorderStyle) {
            const STR_CONVERSION_MAP = [
                [BorderStyle.Hidden, "hidden"],
                [BorderStyle.Dotted, "dotted"],
                [BorderStyle.Dashed, "dashed"],
                [BorderStyle.Solid, "solid"],
                [BorderStyle.Double, "double"],
                [BorderStyle.Groove, "groove"],
                [BorderStyle.Ridge, "ridge"],
                [BorderStyle.Inset, "inset"],
                [BorderStyle.Inherit, "inherit"],
                [BorderStyle.Unset, "unset"]
            ];
            function parse(str) {
                let matches = STR_CONVERSION_MAP.filter(item => item[1] == str);
                if (matches.length == 0)
                    return null;
                else
                    return matches[0][0];
            }
            BorderStyle.parse = parse;
            function toString(style) {
                let matches = STR_CONVERSION_MAP.filter(item => item[0] == style);
                if (matches.length == 0)
                    return null;
                else
                    return matches[0][1];
            }
            BorderStyle.toString = toString;
        })(BorderStyle = UserInterface.BorderStyle || (UserInterface.BorderStyle = {}));
    })(UserInterface = Core.UserInterface || (Core.UserInterface = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Web;
    (function (Web) {
        class AjaxRequestOptions {
            constructor(async = true, data = "", user = "", password = "") {
                this.asynchronous = async;
                this.user = user;
                this.password = password;
                this.data = data;
            }
        }
        Web.AjaxRequestOptions = AjaxRequestOptions;
        class AjaxRequestInfo {
            constructor(method, url, options = new AjaxRequestOptions()) {
                this.method = method;
                this.url = url;
                this.options = options;
            }
        }
        Web.AjaxRequestInfo = AjaxRequestInfo;
        class AjaxRequest {
            constructor(method, url, options) {
                this.doneEvent = new Core.Events.AjaxEvent(this);
                this.loadedEvent = new Core.Events.AjaxEvent(this);
                this.errorEvent = new Core.Events.AjaxEvent(this);
                this.headersReceivedEvent = new Core.Events.AjaxEvent(this);
                this.loadingEvent = new Core.Events.AjaxEvent(this);
                this.openedEvent = new Core.Events.AjaxEvent(this);
                this.unsentEvent = new Core.Events.AjaxEvent(this);
                this.progressEvent = new Core.Events.ProgressEvent(this);
                this.info = new AjaxRequestInfo(method, url, options);
                this._createAndOpenRequest(method, url, options);
            }
            _requestReadyStateChanged() {
                let xhr = this.baseRequest;
                let info = this.info;
                switch (xhr.readyState) {
                    case XMLHttpRequest.DONE:
                        this.doneEvent.invoke({ baseRequest: xhr, reqInfo: info });
                        if (xhr.status == Web.STATUS_OK)
                            this.loadedEvent.invoke({ baseRequest: xhr, reqInfo: info });
                        else {
                            this.errorEvent.invoke({ baseRequest: xhr, reqInfo: info });
                        }
                        break;
                    case XMLHttpRequest.HEADERS_RECEIVED:
                        this.headersReceivedEvent.invoke({ baseRequest: xhr, reqInfo: info });
                        break;
                    case XMLHttpRequest.LOADING:
                        this.loadingEvent.invoke({ baseRequest: xhr, reqInfo: info });
                        break;
                    case XMLHttpRequest.OPENED:
                        this.openedEvent.invoke({ baseRequest: xhr, reqInfo: info });
                        break;
                    case XMLHttpRequest.UNSENT:
                        this.unsentEvent.invoke({ baseRequest: xhr, reqInfo: info });
                        break;
                }
            }
            _requestProgress(event) {
                this.progressEvent.invoke({ done: event.loaded, total: event.total });
            }
            _createAndOpenRequest(method, url, options) {
                let xhr = new XMLHttpRequest();
                xhr.open(method, url, options.asynchronous, options.user, options.password);
                xhr.send(options.data);
                xhr.onreadystatechange = () => this._requestReadyStateChanged();
                this.baseRequest = xhr;
            }
        }
        Web.AjaxRequest = AjaxRequest;
        class Ajax {
            static get(url, options) {
                return new AjaxRequest(Web.METHOD_GET, url, options);
            }
            static head(url, options) {
                return new AjaxRequest(Web.METHOD_HEAD, url, options);
            }
            static post(url, options) {
                return new AjaxRequest(Web.METHOD_POST, url, options);
            }
            static put(url, options) {
                return new AjaxRequest(Web.METHOD_PUT, url, options);
            }
            static delete(url, options) {
                return new AjaxRequest(Web.METHOD_DELETE, url, options);
            }
            static connect(url, options) {
                return new AjaxRequest(Web.METHOD_CONNECT, url, options);
            }
            static options(url, options) {
                return new AjaxRequest(Web.METHOD_OPTIONS, url, options);
            }
            static trace(url, options) {
                return new AjaxRequest(Web.METHOD_TRACE, url, options);
            }
            static patch(url, options) {
                return new AjaxRequest(Web.METHOD_PATCH, url, options);
            }
        }
        Web.Ajax = Ajax;
    })(Web = Core.Web || (Core.Web = {}));
})(Core || (Core = {}));
(function (Core) {
    var Events;
    (function (Events) {
        class AjaxEvent extends Core.MethodGroup {
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
        Events.AjaxEvent = AjaxEvent;
    })(Events = Core.Events || (Core.Events = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Web;
    (function (Web) {
        Web.METHOD_GET = "GET";
        Web.METHOD_HEAD = "HEAD";
        Web.METHOD_POST = "POST";
        Web.METHOD_PUT = "PUT";
        Web.METHOD_DELETE = "DELETE";
        Web.METHOD_CONNECT = "CONNECT";
        Web.METHOD_OPTIONS = "OPTIONS";
        Web.METHOD_TRACE = "TRACE";
        Web.METHOD_PATCH = "PATCH";
        Web.STATUS_CONTINUE = 100;
        Web.STATUS_SWITCHING_PROTOCOL = 101;
        Web.STATUS_PROCESSING = 102;
        Web.STATUS_OK = 200;
        Web.STATUS_CREATED = 201;
        Web.STATUS_ACCEPTED = 202;
        Web.STATUS_NON_AUTHORITATIVE_INFO = 203;
        Web.STATUS_NO_CONTENT = 204;
        Web.STATUS_RESET_CONTENT = 205;
        Web.STATUS_PARTIAL_CONTENT = 206;
        Web.STATUS_IM_USED = 226;
        Web.STATUS_MULTIPLE_CHOICE = 300;
        Web.STATUS_MOVED_PERMANENTLY = 301;
        Web.STATUS_FOUND = 302;
        Web.STATUS_SEE_OTHER = 303;
        Web.STATUS_NOT_MODIFIED = 304;
        Web.STATUS_TEMPORARY_REDIRECT = 307;
        Web.STATUS_PERMANENT_REDIRECT = 308;
        Web.STATUS_BAD_REQUEST = 400;
        Web.STATUS_PAYMENT_REQUIRED = 401;
        Web.STATUS_FORBIDDEN = 402;
        Web.STATUS_UNAUTHORIZED = 403;
        Web.STATUS_NOT_FOUND = 404;
        Web.STATUS_METHOD_NOT_ALLOWED = 405;
        Web.STATUS_NOT_ACCEPTABLE = 406;
        Web.STATUS_PROXY_AUTH_REQUIRED = 407;
        Web.STATUS_REQUEST_TIMEOUT = 408;
        Web.STATUS_CONFLICT = 409;
        Web.STATUS_GONE = 410;
        Web.STATUS_LENGTH_REQUIRED = 411;
        Web.STATUS_PRECONDITION_FAILED = 412;
        Web.STATUS_PAYLOAD_TOO_LARGE = 413;
        Web.STATUS_URI_TOO_LONG = 414;
        Web.STATUS_UNSUPPORTED_MEDIA_TYPE = 415;
        Web.STATUS_REQUESTED_RANGE_NOT_SATISFIABLE = 416;
        Web.STATUS_EXPECTATION_FAILED = 417;
        Web.STATUS_I_M_A_TEAPOT = 418;
        Web.STATUS_MISDIRECTED_REQUEST = 421;
        Web.STATUS_UNPROCESSABLE_ENTITY = 422;
        Web.STATUS_LOCKED = 423;
        Web.STATUS_FAILED_DEPENDENCY = 424;
        Web.STATUS_UPGRADE_REQUIRED = 426;
        Web.STATUS_PRECONDITION_REQUIRED = 428;
        Web.STATUS_TOO_MANY_REQUESTS = 429;
        Web.STATUS_REQUEST_HEADER_FIELDS_TOO_LARGE = 431;
        Web.STATUS_UNAVAILABLE_FOR_LEGAL_REASONS = 451;
        Web.STATUS_INTERNAL_SERVER_ERROR = 500;
        Web.STATUS_NOT_IMPLEMENTED = 501;
        Web.STATUS_BAD_GATEWAY = 502;
        Web.STATUS_SERVICE_UNAVAILABLE = 503;
        Web.STATUS_GATEWAY_TIMEOUT = 504;
        Web.STATUS_HTTP_VERSION_NOT_SUPPORTED = 505;
        Web.STATUS_VARIANT_ALSO_NEGOTIATES = 506;
        Web.STATUS_INSUFFICIENT_STORAGE = 507;
        Web.STATUS_LOOP_DETECTED = 508;
        Web.STATUS_NOT_EXTENDED = 510;
        Web.STATUS_NETWORK_AUTH_REQUIRED = 511;
        class LoadException extends Core.Exceptions.Exception {
            constructor(ajax, message) {
                let xhr = ajax.baseRequest;
                let messageXml = Core.StringUtils.format("{0}{1} request to {2} failed with status code {3}({4}).", message ? (message + " ") : "", ajax.info.method, ajax.info.url, xhr.status, xhr.statusText);
                super(messageXml);
            }
        }
        Web.LoadException = LoadException;
    })(Web = Core.Web || (Core.Web = {}));
})(Core || (Core = {}));
//# sourceMappingURL=Core.js.map