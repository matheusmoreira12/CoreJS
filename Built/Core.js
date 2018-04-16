var Core;
(function (Core) {
    let Validation;
    (function (Validation) {
        class Utils {
            static _expectedTypeNameAsMessageTags(expectedType) {
                if (expectedType instanceof Function)
                    return Core.Exceptions.Exception.getMessageTag("type", expectedType.name);
                else if (typeof expectedType == Core.STRING)
                    return Core.Exceptions.Exception.getMessageTag("type", expectedType);
                return null;
            }
            static expectedTypeNameAsMessageTags(expectedType) {
                if (expectedType instanceof Array) {
                    let resultArr = new Array(0);
                    for (var i = 0; i < expectedType.length; i++) {
                        let type = expectedType[i];
                        resultArr.push(this._expectedTypeNameAsMessageTags(type));
                    }
                    //Join array with connectives 
                    return resultArr.join(" or ");
                }
                else
                    return this._expectedTypeNameAsMessageTags(expectedType);
            }
        }
        Validation.Utils = Utils;
        class RuntimeValidator {
            static __parameterTypeIsValid(paramValue, paramExpectedType) {
                if (paramExpectedType instanceof Function)
                    return (paramValue instanceof paramExpectedType);
                else if (typeof paramExpectedType == Core.STRING)
                    return typeof paramValue == paramExpectedType;
                else
                    throw new Core.Exceptions.InvalidParameterTypeException("paramExpectedType", "Cannot validate parameter." +
                        " The specified expected type is invalid.");
            }
            static _parameterTypeIsValid(paramValue, paramExpectedType) {
                if (paramExpectedType instanceof Array) {
                    if (paramExpectedType.length == 0)
                        return true;
                    for (var i = 0; i < paramExpectedType.length; i++) {
                        let type = paramExpectedType[i];
                        if (this.__parameterTypeIsValid(paramValue, type))
                            return true;
                    }
                    return false;
                }
                else
                    return this.__parameterTypeIsValid(paramValue, paramExpectedType);
            }
            static validateParameter(paramName, paramValue, paramExpectedType, isRequired = false, isNullable = true) {
                let isNull = paramValue === null, isUndefined = typeof paramValue == Core.UNDEF;
                if (isNull) {
                    if (!isNullable)
                        throw new Core.Exceptions.InvalidParameterException(paramName, "Parameter {0} is a non-nullable parameter.");
                }
                else if (isUndefined) {
                    if (isRequired)
                        throw new Core.Exceptions.ParameterMissingException(paramName);
                }
                else {
                    if (!this._parameterTypeIsValid(paramValue, paramExpectedType))
                        throw new Core.Exceptions.InvalidParameterTypeException(paramName, paramExpectedType);
                }
            }
            static validateArrayParameter(paramName, paramValue, memberExpectedType, itemIsNullable = true, arrayIsRequired = true, arrayIsNullable = false) {
                //Validate array
                this.validateParameter(paramName, paramValue, Array, arrayIsRequired, arrayIsNullable);
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
            //Runtime validation
            Core.Validation.RuntimeValidator.validateParameter("target", target, [], true);
            Core.Validation.RuntimeValidator.validateParameter("listener", defaultListener, [Function, MethodGroup]);
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
            //Runtime validation
            Core.Validation.RuntimeValidator.validateParameter("listener", listener, [Function, MethodGroup], true);
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
            //Runtime validation
            Core.Validation.RuntimeValidator.validateParameter("listener", listener, [Function, MethodGroup], true);
            if (listener instanceof MethodGroup)
                this._detachHandler(listener);
            else
                this._detachListener(listener);
        }
    }
    Core.MethodGroup = MethodGroup;
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
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("apiName", apiName, Core.STRING, true, false);
                Core.Validation.RuntimeValidator.validateParameter("apiURL", apiURL, Core.STRING, true, false);
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
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("target", target, [Function, Core.APIs.APILoader], true);
                super(target);
            }
            attach(listener) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("listener", listener, [Function, APILoaderEvent]);
                super.attach(listener);
            }
            detach(listener) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("listener", listener, [Function, APILoaderEvent]);
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
            //Runtime validation
            Core.Validation.RuntimeValidator.validateParameter("srcArray", srcArray, Array);
            Core.Validation.RuntimeValidator.validateParameter("destArray", destArray, Array);
            Core.Validation.RuntimeValidator.validateParameter("removeCallback", removeCallback, Function);
            Core.Validation.RuntimeValidator.validateParameter("insertCallback", insertCallback, Function);
            Core.Validation.RuntimeValidator.validateParameter("changeCallback", changeCallback, Function);
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
///<reference path="Core.MethodGroup.ts"/>
///<reference path="Core.Validation.ts"/>
var Core;
///<reference path="Core.MethodGroup.ts"/>
///<reference path="Core.Validation.ts"/>
(function (Core) {
    var Collections;
    (function (Collections) {
        let IGenericList;
        (function (IGenericList) {
            function toArray(list) {
                return Array.prototype.slice.apply(list);
            }
            IGenericList.toArray = toArray;
            function getCount(list) {
                return Array.prototype.push.apply(this);
            }
            IGenericList.getCount = getCount;
            function getItemAt(list, index) {
                return Array.prototype.slice.call(this, 0, 1)[0];
            }
            IGenericList.getItemAt = getItemAt;
            function getFirst(list) {
                return Array.prototype.slice.call(list, 0, 1)[0] || null;
            }
            IGenericList.getFirst = getFirst;
            function getLast(list) {
                return Array.prototype.slice.call(list, -1)[0] || null;
            }
            IGenericList.getLast = getLast;
            function indexOf(list, item, startIndex) {
                return Array.prototype.indexOf.call(list, item, startIndex);
            }
            IGenericList.indexOf = indexOf;
            function lastIndexOf(list, item, endIndex) {
                return Array.prototype.lastIndexOf.call(list, item, endIndex);
            }
            IGenericList.lastIndexOf = lastIndexOf;
            function addMultiple(list, items) {
                Array.prototype.push.call(list, ...items);
            }
            IGenericList.addMultiple = addMultiple;
            function add(list, item) {
                Array.prototype.push.call(list, item);
            }
            IGenericList.add = add;
            function insertMultiple(list, items, index) {
                Array.prototype.splice.call(list, index, 0, ...items);
            }
            IGenericList.insertMultiple = insertMultiple;
            function insert(list, item, index) {
                Array.prototype.splice.call(list, index, 0, item);
            }
            IGenericList.insert = insert;
            function moveAt(list, oldIndex, newIndex) {
                let item = IGenericList.removeAt(list, oldIndex);
                if (oldIndex < newIndex)
                    newIndex--;
                IGenericList.insert(list, item, newIndex);
            }
            IGenericList.moveAt = moveAt;
            function move(list, item, newIndex) {
                let oldIndex = IGenericList.indexOf(list, item);
                IGenericList.moveAt(list, oldIndex, newIndex);
            }
            IGenericList.move = move;
            function swap(list, index1, index2) {
                let item1 = IGenericList.removeAt(list, index1);
                list[index1] = list[index2];
                list[index2] = item1;
            }
            IGenericList.swap = swap;
            function removeAt(list, index) {
                return Array.prototype.splice.call(list, index, 1);
            }
            IGenericList.removeAt = removeAt;
            function remove(list, item) {
                let index = IGenericList.indexOf(list, item);
                IGenericList.removeAt(list, index);
            }
            IGenericList.remove = remove;
            function removeMultipleAt(list, startIndex, removeCount) {
                return Array.prototype.slice.call(list, startIndex, removeCount);
            }
            IGenericList.removeMultipleAt = removeMultipleAt;
            function removeMultiple(list, items) {
                for (let item of items)
                    IGenericList.remove(list, item);
            }
            IGenericList.removeMultiple = removeMultiple;
            function replaceAt(list, index, newItem) {
                return Array.prototype.splice.call(list, index, 1, newItem);
            }
            IGenericList.replaceAt = replaceAt;
            function replace(list, oldItem, newItem) {
                let index = IGenericList.indexOf(list, oldItem);
                IGenericList.replaceAt(list, index, newItem);
            }
            IGenericList.replace = replace;
            function filter(list, predicate, thisArg) {
                return Array.prototype.filter.call(list, predicate, thisArg);
            }
            IGenericList.filter = filter;
            function select(list, predicate, thisArg) {
                return Array.prototype.map.call(list, predicate, thisArg);
            }
            IGenericList.select = select;
            function every(list, predicate, thisArg) {
                return Array.prototype.every.call(list, predicate, thisArg);
            }
            IGenericList.every = every;
            function some(list, predicate, thisArg) {
                return Array.prototype.some.call(list, predicate, thisArg);
            }
            IGenericList.some = some;
            function first(list, predicate, thisArg) {
                let array = IGenericList.toArray(list);
                for (let i = 0; i < array.length; i++) {
                    let item = array[i];
                    if (predicate.call(thisArg, item, i, list))
                        return item;
                }
                return null;
            }
            IGenericList.first = first;
            function last(list, predicate, thisArg) {
                let array = IGenericList.toArray(list);
                for (let i = array.length - 1; i >= 0; i++) {
                    let item = array[i];
                    if (predicate.call(thisArg, item, i, list))
                        return item;
                }
                return null;
            }
            IGenericList.last = last;
            function fill(list, value, startIndex, count) {
                while (list.length < startIndex + count)
                    list.add(null);
                Array.prototype.fill.call(list, value, startIndex, startIndex + count);
            }
            IGenericList.fill = fill;
        })(IGenericList = Collections.IGenericList || (Collections.IGenericList = {}));
        class GenericList {
            constructor(arg) {
                /**
                 * Gets the number of elements inside this list.
                 * @returns The number of elements in this list.
                 */
                this.length = 0;
                if (typeof arg == Core.NUMBER)
                    this.fill(null, 0, arg);
                else if (arg instanceof Array)
                    this.addMultiple(arg);
                this.itemAddedEvent = new Collections.ListEvent(this);
                this.itemRemovedEvent = new Collections.ListEvent(this);
                this.itemChangedEvent = new Collections.ListEvent(this);
            }
            /**
             * Returns an iterator for this <IGenericList>.
             */
            [Symbol.iterator]() {
                return Array.prototype.values.apply(this);
            }
            /**
             * Gets an item at the specified zero-based position.
             * @param index The index of the desired item.
             * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
             * bounds.
             */
            getItemAt(index) {
                return IGenericList.getItemAt(this, index);
            }
            /**
             * Converts this list to an array.
             * @returns The resulting array.
             */
            toArray() {
                return IGenericList.toArray(this);
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
                return IGenericList.getFirst(this);
            }
            /**
             * Gets the last item in this list.
             * @returns The last item in this list.
             */
            getLast() {
                return IGenericList.getLast(this);
            }
            /**
             * Returns the zero-based position of the specified item in this list, or -1 if no match is found.
             * @param item The item being searched.
             * @param startIndex Optional. The index at which the search is started.
             * @returns The index of the matching item.
             */
            indexOf(item, startIndex) {
                return IGenericList.indexOf(this, item, startIndex);
            }
            /**
             * Returns the last zero-based position of the specified item in this list, or -1 if no match is
             * found.
             * @param item The item being searched.
             * @param endIndex Optional. The index at which the search is stopped.
             * @returns The index of the last matching item.
             */
            lastIndexOf(item, endIndex) {
                return IGenericList.lastIndexOf(this, item, endIndex);
            }
            /**
             * Adds multiple items to this list.
             * @param items The items being added.
             */
            addMultiple(items) {
                IGenericList.addMultiple(this, items);
            }
            /**
             * Adds an item to this list.
             * @param item The item being added.
             */
            add(item) {
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
            insertMultiple(items, index) {
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
            insert(item, index) {
                IGenericList.insert(this, item, index);
            }
            /**
             * Moves an item in this list from a zero-based position to another.
             * @param oldIndex The position the item is at.
             * @param newIndex The position the item is being moved to.
             * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
             * bounds.
             */
            moveAt(oldIndex, newIndex) {
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
            move(item, newIndex) {
                IGenericList.move(this, item, newIndex);
            }
            /**
             * Swaps two items at two different zero-based positions.
             * @param index1 The position of the first item being swapped.
             * @param index2 The position of the second item being swapped.
             * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
             * bounds.
             */
            swap(index1, index2) {
                IGenericList.swap(this, index1, index2);
            }
            /**
             * Removes an item at the specified zero-based position from this list and returns it.
             * @param index The position of the item being removed.
             * @returns The item being removed.
             * @throws <Exceptions.ArgumentOutOfRangeException> if the specified position is out of the list's
             * bounds.
             */
            removeAt(index) {
                return IGenericList.removeAt(this, index);
            }
            /**
             * Removes an specific item from this generic collection.
             * @param item The item being removed.
             * @throws <Exceptions.InvalidOperationException> if no match is found.
             */
            remove(item) {
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
            removeMultipleAt(startIndex, removeCount) {
                return IGenericList.removeMultipleAt(this, startIndex, removeCount);
            }
            /**
            * Removes specific items from this generic collection.
            * @param items The items being removed.
            * @throws <Exceptions.InvalidOperationException> if no match is found.
            */
            removeMultiple(items) {
                IGenericList.removeMultiple(this, items);
            }
            /**
             * Replaces the item at the specified zero-based position by another, and returns it.
             * @param index The position of the item being replaced.
             * @param newItem The item replacing the current item at the specified position.
             * @returns The item being replaced.
             */
            replaceAt(index, newItem) {
                return IGenericList.replaceAt(this, index, newItem);
            }
            /**
             * Replaces an specific item from this generic collection by another.
             * @param newItem
             * @param oldItem
             */
            replace(oldItem, newItem) {
                return IGenericList.replace(this, oldItem, newItem);
            }
            /**
             * Returns an array containing the items that match the specified predicate.
             * @param testFn The predicate the items are being tested against.
             * @param thisArg The local context of the predicate function.
             */
            filter(testFn, thisArg) {
                return IGenericList.filter(this, testFn, thisArg);
            }
            /**
             * Selects a property from each of the items, according to the specified predicate.
             * @param selectFn The predicate that determines which property is being selected from the
             * list items.
             * @param thisArg The local context of the predicate function.
             */
            select(selectFn, thisArg) {
                return IGenericList.select(this, selectFn, thisArg);
            }
            /**
             * Returns true if every one of the items in this list matches the specified predicate.
             * @param testFn The predicate the items are being tested against.
             * @param thisArg The local context of the predicate function.
             */
            every(testFn, thisArg) {
                return IGenericList.every(this, testFn, thisArg);
            }
            /**
             * Returns true if any of the items in this list matches the specified predicate.
             * @param testFn The predicate the items are being tested against.
             * @param thisArg The local context of the predicate function.
             */
            some(testFn, thisArg) {
                return IGenericList.some(this, testFn, thisArg);
            }
            /**
             * Returns the first item in this list that matches the specified predicate.
             * @param testFn The predicate the items are being tested against.
             * @param thisArg The local context of the predicate function.
             */
            first(testFn, thisArg) {
                return IGenericList.first(this, testFn, thisArg);
            }
            /**
             * Returns the last item in this list that matches the specified predicate.
             * @param testFn The predicate the items are being tested against.
             * @param thisArg The local context of the predicate function.
             */
            last(testFn, thisArg) {
                return IGenericList.last(this, testFn, thisArg);
            }
            /**
             * Fills this list with the spcified value, starting at the specified zero-based position, for the specified
             * item count.
             * @param value The item filling this list.
             * @param startIndex The zero-based start position.
             * @param count The number of times the specified item is filling this list.
             */
            fill(value, startIndex, count) {
                IGenericList.fill(this, value, startIndex, count);
            }
        }
        Collections.GenericList = GenericList;
        class KeyValuePair {
            constructor(key, value) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("key", key, [], true);
                Core.Validation.RuntimeValidator.validateParameter("value", key, [], true);
                this.key = key;
                this.value = value;
            }
        }
        Collections.KeyValuePair = KeyValuePair;
        class GenericDictionary extends GenericList {
        }
        Collections.GenericDictionary = GenericDictionary;
        class GenericTreeItem extends GenericList {
        }
        Collections.GenericTreeItem = GenericTreeItem;
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
        Collections.ListEvent = ListEvent;
    })(Collections = Core.Collections || (Core.Collections = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Exceptions;
    (function (Exceptions) {
        class Exception extends Error {
            constructor(messageXml, innerException, ...extraParams) {
                //Runtime validation
                if (messageXml && typeof messageXml !== Core.STRING)
                    throw new InvalidParameterTypeException("messageXml", Core.STRING);
                if (innerException && !(innerException instanceof Error))
                    Core.Validation.RuntimeValidator.validateParameter("innerException", innerException, Error);
                //Message formatting
                messageXml = Core.StringUtils.format(messageXml, ...extraParams);
                let messageText = Exception.getMessagePlainText(messageXml);
                //Initialization
                super(messageText);
                this.messageXml = messageXml;
                this.extraParams = extraParams;
            }
            static getMessagePlainText(messageXml) {
                //remove all xml tags from messageXml
                return messageXml.replace(/<\w+>|<\/\w+>/g, "\"");
            }
            static getMessageTag(tagName, content) {
                return Core.StringUtils.format("<{0}>{1}</{0}>", tagName, content);
            }
        }
        Exceptions.Exception = Exception;
        class InvalidOperationException extends Exception {
            constructor(messageXml, innerException, ...extraParams) {
                //Initialization
                super(messageXml, innerException, ...extraParams);
            }
        }
        Exceptions.InvalidOperationException = InvalidOperationException;
        class InvalidTypeException extends Exception {
            constructor(varName, expectedType, messageXml, innerException, ...extraParams) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("expectedType", expectedType, [Core.STRING, Function, Array]);
                messageXml = messageXml || "Invalid type for variable {0}. A value of type {1} was expected.";
                extraParams = [Core.Validation.Utils.expectedTypeNameAsMessageTags(expectedType), ...extraParams];
                //Initialization
                super(messageXml, innerException, ...extraParams);
            }
        }
        Exceptions.InvalidTypeException = InvalidTypeException;
        class InvalidParameterException extends Exception {
            constructor(paramName, messageXml, innerException, ...extraParams) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("paramName", paramName, "string");
                messageXml = messageXml || "Invalid value for parameter {0}.";
                extraParams = [Exception.getMessageTag("param", paramName), ...extraParams];
                //Initialization
                super(messageXml, innerException, ...extraParams);
                this.paramName = paramName;
            }
        }
        Exceptions.InvalidParameterException = InvalidParameterException;
        class ParameterOutOfRangeException extends Exception {
            constructor(paramName, messageXml, innerException, ...extraParams) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("paramName", paramName, Core.STRING, true, false);
                //Message XML fallback value
                messageXml = messageXml || "The parameter was outside of the matrix bounds.";
                //Add <paramName> to the list of params
                extraParams = [Exception.getMessageTag("param", paramName), ...extraParams];
                super(messageXml, innerException, extraParams);
            }
        }
        Exceptions.ParameterOutOfRangeException = ParameterOutOfRangeException;
        class InvalidParameterTypeException extends Exception {
            constructor(paramName, expectedType, messageXml, innerException, ...extraParams) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("paramName", paramName, Core.STRING, true, false);
                Core.Validation.RuntimeValidator.validateParameter("expectedType", expectedType, [Core.STRING, Function, Array], true, false);
                //Message XML fallback value
                messageXml = messageXml || "Invalid value for parameter {0}. A value of type {1} was expected.";
                extraParams = [Exception.getMessageTag("param", paramName),
                    Core.Validation.Utils.expectedTypeNameAsMessageTags(expectedType), ...extraParams];
                //Initialization
                super(messageXml, innerException, ...extraParams);
                this.paramName = paramName;
            }
        }
        Exceptions.InvalidParameterTypeException = InvalidParameterTypeException;
        class ParameterMissingException extends Exception {
            constructor(paramName, messageXml, innerException, ...extraParams) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("paramName", paramName, "string");
                messageXml = messageXml || "Parameter {0} is required and must be specified.";
                extraParams.push(Exception.getMessageTag("param", paramName));
                //Initialization
                super(messageXml, innerException, ...extraParams);
                this.paramName = paramName;
            }
        }
        Exceptions.ParameterMissingException = ParameterMissingException;
    })(Exceptions = Core.Exceptions || (Core.Exceptions = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Hash;
    (function (Hash) {
        function generateHashCode(str) {
            let outHashCode = 0;
            if (str.length === 0)
                return outHashCode;
            for (let i = 0; i < str.length; i++) {
                let chr = str.charCodeAt(i);
                outHashCode = ((outHashCode << 5) - outHashCode) + chr;
            }
            return outHashCode;
        }
        Hash.generateHashCode = generateHashCode;
        function concatenateHashCodes(hashCodes) {
            let outHashCode = 17;
            for (let hashCode of hashCodes)
                outHashCode = ((outHashCode << 5) - outHashCode) + hashCode;
            return outHashCode;
        }
        Hash.concatenateHashCodes = concatenateHashCodes;
    })(Hash = Core.Hash || (Core.Hash = {}));
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
    class SearchMatch {
        constructor(value, startIndex) {
            //Runtime validation
            Core.Validation.RuntimeValidator.validateParameter("value", value, Core.STRING, true, false);
            Core.Validation.RuntimeValidator.validateParameter("startIndex", startIndex, Core.NUMBER, true, false);
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
            //Runtime validation
            Core.Validation.RuntimeValidator.validateParameter("input", input, Core.STRING);
            Core.Validation.RuntimeValidator.validateParameter("regexp", regexp, RegExp);
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
            let b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
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
                outputStr += b64.charAt(enc1) + b64.charAt(enc2) + b64.charAt(enc3) + b64.charAt(enc4);
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
                throw new RangeError('The value for parameter "start" was outside the string bounds.');
            if (delCount < 0 || (start + delCount) >= str.length)
                throw new RangeError('The value for parameter "delCount" was outside the string bounds.');
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
        //Converts an array of single-character-long strings to string
        function fromCharArray(arr) {
            //Runtime validation
            Core.Validation.RuntimeValidator.validateParameter("arr", arr, Array, true, false);
            return arr.join("");
        }
        StringUtils.fromCharArray = fromCharArray;
        //Converts a string to an array of single-character-long strings
        function toCharArray(str) {
            //Runtime validation
            Core.Validation.RuntimeValidator.validateParameter("str", str, Core.STRING, true, false);
            return Array.prototype.splice.apply(str);
        }
        StringUtils.toCharArray = toCharArray;
        //Gets the char range between two characters
        function getCharRange(startChar, endChar) {
            //Runtime validation
            Core.Validation.RuntimeValidator.validateParameter("startChar", startChar, Core.STRING, true, false);
            Core.Validation.RuntimeValidator.validateParameter("endChar", endChar, Core.STRING, true, false);
            if (startChar.length != 1)
                throw new Core.Exceptions.InvalidParameterException("startChar", "Invalid value for parameter %0. Expected" +
                    " a single character string.");
            if (endChar.length != 1)
                throw new Core.Exceptions.InvalidParameterException("endChar", "Invalid value for parameter %0. Expected" +
                    " a single character string.");
            let result = [];
            for (let code = startChar.charCodeAt(0); code <= endChar.charCodeAt(0); code++)
                result.push(String.fromCharCode(code));
            return result;
        }
        StringUtils.getCharRange = getCharRange;
        //Gets the char range denoted by a RegEx-like [] notation
        function toCharRange(representation) {
            //Runtime validation
            Core.Validation.RuntimeValidator.validateParameter("representation", representation, Core.STRING, true, false);
            representation = representation.replace(/.\-./g, (match) => this.getCharRange(match[0], match[match.length - 1]).join(""));
            return this.toCharArray(representation);
        }
        StringUtils.toCharRange = toCharRange;
        //Returns the index of any of the specified strings, from the specified start position
        function indexOfAny(str, searchStrings, position = 0) {
            //Runtime validation
            Core.Validation.RuntimeValidator.validateParameter("str", str, Core.STRING, true, false);
            Core.Validation.RuntimeValidator.validateParameter("searchStrings", searchStrings, Array, true, false);
            Core.Validation.RuntimeValidator.validateParameter("position", position, Core.NUMBER);
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
            //Runtime validation
            Core.Validation.RuntimeValidator.validateParameter("str", str, Core.STRING, true, false);
            Core.Validation.RuntimeValidator.validateParameter("searchStrings", searchStrings, Array, true, false);
            Core.Validation.RuntimeValidator.validateParameter("position", position, Core.NUMBER);
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
            if (matches == null)
                return null;
            return matches.toString();
        }
        StringUtils.matchString = matchString;
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
        /**
         * Returns a value indicating whether the specified source type is equivalent to the specified reference type.
         * @param tRef The reference type.
         */
        equals(tRef) {
            return Type.equals(this, tRef);
        }
        /** Returns the name of this Type.*/
        get name() {
            return this._typeConstructor.name;
        }
        /** Returns the parent type of this Type.*/
        get parentType() {
            return Type._getParentType(this._typeConstructor);
        }
    }
    Core.Type = Type;
})(Core || (Core = {}));
///<reference path="Core.Collections.ts"/>
var Core;
///<reference path="Core.Collections.ts"/>
(function (Core) {
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
            //Runtime validation
            Core.Validation.RuntimeValidator.validateParameter("timeStampStr", str, Core.STRING, true, false);
            let valueStr = str.match(/^\d+/);
            if (valueStr === null)
                throw new Core.Exceptions.InvalidOperationException("Cannot parse time stamp. Value is missing.");
            let value = Number(valueStr), unitStr = str.substring(valueStr.length), unit = this._parseUnit(unitStr);
            if (unit === null)
                throw new Core.Exceptions.InvalidOperationException("Cannor parse time stamp. Invalid or missing unit.");
            return new TimeStamp(value, unit);
        }
        constructor(value, unit) {
            //Runtime validation
            Core.Validation.RuntimeValidator.validateParameter('value', value, Core.NUMBER, true, false);
            this.value = value;
            this.unit = unit;
        }
    }
    class AnimationScene {
    }
    class AnimationSceneList extends Core.Collections.GenericList {
        add(scene) {
            Core.Validation.RuntimeValidator.validateParameter("scene", scene, AnimationScene, true, false);
            super.add(scene);
        }
        insert(scene, index) {
            Core.Validation.RuntimeValidator.validateParameter("scene", scene, AnimationScene, true, false);
            Core.Validation.RuntimeValidator.validateParameter("index", index, Core.NUMBER, true, false);
            super.insert(scene, index);
        }
        removeAt(index) {
            Core.Validation.RuntimeValidator.validateParameter("index", index, Core.NUMBER, true, false);
            return super.removeAt(index);
        }
        remove(scene) {
            Core.Validation.RuntimeValidator.validateParameter("scene", scene, AnimationScene, true, false);
            super.remove(scene);
        }
    }
    class AnimationStoryboard {
        constructor(...scenes) {
            this.scenes = new AnimationSceneList(scenes);
        }
        toKeyframes() {
            return null;
        }
    }
    Core.KEYFRAMES_FADEIN = { filter: ["opacity(0)", "opacity(1)"] };
    Core.KEYFRAMES_FADEOUT = { filter: ["opacity(1)", "opacity(0)"] };
    Core.KEYFRAMES_BOUNCE = {
        transform: ["translate(0, 0)", "translate(10%, 0)", "translate(-10%, 0)",
            "translate(10%, 0)", "translate(-10%, 0)", "translate(0, 0)"]
    };
    Core.KEYFRAMES_GROW = { transform: ["scale(.8)", "scale(1)"] };
    Core.KEYFRAMES_SHRINK = { transform: ["scale(1.2)", "scale(1)"] };
    Core.KEYFRAMES_FLIP = { transform: ["rotateX(90deg)", "rotateX(0deg)"] };
})(Core || (Core = {}));
///<reference path="Core.Collections.ts"/>
var Core;
///<reference path="Core.Collections.ts"/>
(function (Core) {
    var UserInterface;
    (function (UserInterface) {
        class AttributePropertyAssociator {
            constructor(target) {
                this._associations = new Core.Collections.GenericList();
                //Property changed event
                this.propertyChangedEvent = new Core.Events.PropertyChangedEvent(this, this.onPropertyChanged);
                //Attribute changed event
                this.attributeChangedEvent = new Core.Events.PropertyChangedEvent(this, this.onAttributeChanged);
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("target", target, Node, true, false);
                this.target = target;
            }
            _getAssociatedPropertyName(attributeName) {
                let matches = this._associations.filter((item) => item[1] == attributeName);
                if (matches.length > 0)
                    return matches[0][0];
                else
                    return null;
            }
            _getAssociatedAttributeName(propertyName) {
                let matches = this._associations.filter((item) => item[0] == propertyName);
                if (matches.length > 0)
                    return matches[0][1];
                else
                    return null;
            }
            _onPropertyChanged(target, args) {
                let assocAttrName = this._getAssociatedAttributeName(args.propertyName);
            }
            //  Invokes the propertyChanged event
            onPropertyChanged(propertyName, args) {
                this.propertyChangedEvent.invoke(args);
            }
            _onAttributeChanged(target, args) {
                let assocPropName = this._getAssociatedPropertyName(args.propertyName);
            }
            //  Invokes the attributeChanged event
            onAttributeChanged(propertyName, args) {
                this.attributeChangedEvent.invoke(args);
            }
            associate(propertyName, attributeName = propertyName) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("propertyName", propertyName, Core.STRING, true, false);
                Core.Validation.RuntimeValidator.validateParameter("attributeName", attributeName, Core.STRING, true, false);
                this._associations.add([attributeName, propertyName]);
            }
        }
        UserInterface.AttributePropertyAssociator = AttributePropertyAssociator;
    })(UserInterface = Core.UserInterface || (Core.UserInterface = {}));
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
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("value", value, Core.STRING, true, false);
                Core.Validation.RuntimeValidator.validateParameter("type", type, Core.NUMBER, true, false);
                type = type;
                this.type = type;
                this.value = value;
                return Object.freeze(this);
            }
        }
        UserInterface.Content = Content;
        let FlexibleValueUnit;
        (function (FlexibleValueUnit) {
            FlexibleValueUnit[FlexibleValueUnit["Number"] = 0] = "Number";
            FlexibleValueUnit[FlexibleValueUnit["Percent"] = 1] = "Percent";
        })(FlexibleValueUnit = UserInterface.FlexibleValueUnit || (UserInterface.FlexibleValueUnit = {}));
        (function (FlexibleValueUnit) {
            function parse(unitStr) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("unitStr", unitStr, Core.STRING, true, false);
                switch (unitStr) {
                    case "":
                        return FlexibleValueUnit.Number;
                    case "%":
                        return FlexibleValueUnit.Percent;
                }
                return null;
            }
            FlexibleValueUnit.parse = parse;
            function toString(unit) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("unit", unit, Core.NUMBER, true, false);
                switch (unit) {
                    case FlexibleValueUnit.Number:
                        return "";
                    case FlexibleValueUnit.Percent:
                        return "%";
                }
                return null;
            }
            FlexibleValueUnit.toString = toString;
        })(FlexibleValueUnit = UserInterface.FlexibleValueUnit || (UserInterface.FlexibleValueUnit = {}));
        class FlexibleValue {
            constructor(value, unit) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("value", value, Core.NUMBER, true, false);
                Core.Validation.RuntimeValidator.validateParameter("unit", unit, Core.NUMBER, true, false);
                this.value = value;
                this.unit = unit;
                return Object.freeze(this);
            }
            static infer(value) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("value", value, [Core.STRING, Core.NUMBER, FlexibleValue], true, false);
                if (typeof value === Core.STRING)
                    return FlexibleValue.parse(value);
                else if (typeof value === Core.NUMBER)
                    return new FlexibleValue(value, FlexibleValueUnit.Number);
                else
                    return value;
            }
            static parse(str) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("str", str, Core.STRING, true, false);
                let valueStr = Core.StringUtils.matchString(str, /\d+/);
                if (valueStr === null)
                    throw new Core.Exceptions.InvalidOperationException("Cannot parse color value. Missing value.");
                let value = Number(valueStr), unitStr = str.substring(valueStr.length), unit = FlexibleValueUnit.parse(unitStr);
                if (unit === null)
                    throw new Core.Exceptions.InvalidOperationException("Cannot parse color value. Invalid unit.");
                if (isNaN(value))
                    throw new Core.Exceptions.InvalidOperationException("Cannot parse color value. Value is not a number.");
                return new FlexibleValue(value, unit);
            }
            toString() {
                return this.value.toString() + this.unit.toString();
            }
        }
        UserInterface.FlexibleValue = FlexibleValue;
        let ColorType;
        (function (ColorType) {
            ColorType[ColorType["RGB"] = 0] = "RGB";
            ColorType[ColorType["RGBA"] = 1] = "RGBA";
            ColorType[ColorType["CMYK"] = 2] = "CMYK";
            ColorType[ColorType["HSL"] = 3] = "HSL";
            ColorType[ColorType["HSV"] = 4] = "HSV";
        })(ColorType = UserInterface.ColorType || (UserInterface.ColorType = {}));
        (function (ColorType) {
            const STR_CONVERSION_MAP = [
                [ColorType.RGB, "rgb"],
                [ColorType.RGBA, "rgba"],
                [ColorType.CMYK, "cmyk"],
                [ColorType.HSL, "hsl"],
                [ColorType.HSV, "hsv"]
            ];
            function parse(str) {
                let matches = STR_CONVERSION_MAP.filter(item => item[1] == str);
                if (matches.length == 0)
                    return null;
                else
                    return matches[0][0];
            }
            ColorType.parse = parse;
            function toString(style) {
                let matches = STR_CONVERSION_MAP.filter(item => item[0] == style);
                if (matches.length == 0)
                    return null;
                else
                    return matches[0][1];
            }
            ColorType.toString = toString;
        })(ColorType = UserInterface.ColorType || (UserInterface.ColorType = {}));
        const MAX_RGB_INT_VALUE = 0xFFFFFF;
        const RGB_INT_FIELD_MASK = 0xFF;
        class Color {
            constructor(type) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("type", type, Core.NUMBER, true, false);
                this.type = type;
            }
            static _inferFromInt(value) {
                if (String(value) != value.toPrecision() || value < 0 || value > MAX_RGB_INT_VALUE)
                    throw new Core.Exceptions.ParameterOutOfRangeException("value");
                let r = (value >>> 16) & RGB_INT_FIELD_MASK, g = (value >>> 8) & RGB_INT_FIELD_MASK, b = value & RGB_INT_FIELD_MASK;
                return new ColorRGB(r, g, b);
            }
            static infer(value) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("value", value, [Core.STRING, Core.NUMBER, Color], true, false);
                if (typeof (value) === Core.STRING)
                    return Color.parse(value);
                else if (typeof (value) === Core.NUMBER)
                    return Color._inferFromInt(value);
                else
                    return value;
            }
            static parse(str) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("str", str, Core.STRING, true, false);
                return null;
            }
            toString() {
                return null;
            }
        }
        UserInterface.Color = Color;
        class ColorRGB extends Color {
            constructor(r, g, b) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("r", r, [Core.STRING, Core.NUMBER, FlexibleValue], true, false);
                Core.Validation.RuntimeValidator.validateParameter("g", g, [Core.STRING, Core.NUMBER, FlexibleValue], true, false);
                Core.Validation.RuntimeValidator.validateParameter("b", b, [Core.STRING, Core.NUMBER, FlexibleValue], true, false);
                super(ColorType.RGB);
                this.r = FlexibleValue.infer(r);
                this.g = FlexibleValue.infer(g);
                this.b = FlexibleValue.infer(b);
                return Object.freeze(this);
            }
        }
        UserInterface.ColorRGB = ColorRGB;
        class ColorRGBA extends Color {
            constructor(r, g, b, a) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("r", r, [Core.STRING, Core.NUMBER, FlexibleValue], true, false);
                Core.Validation.RuntimeValidator.validateParameter("g", g, [Core.STRING, Core.NUMBER, FlexibleValue], true, false);
                Core.Validation.RuntimeValidator.validateParameter("b", b, [Core.STRING, Core.NUMBER, FlexibleValue], true, false);
                Core.Validation.RuntimeValidator.validateParameter("a", a, [Core.STRING, Core.NUMBER, FlexibleValue], true, false);
                super(ColorType.RGBA);
                this.r = FlexibleValue.infer(r);
                this.g = FlexibleValue.infer(g);
                this.b = FlexibleValue.infer(b);
                this.a = FlexibleValue.infer(a);
                return Object.freeze(this);
            }
        }
        UserInterface.ColorRGBA = ColorRGBA;
        class ColorCMYK extends Color {
            constructor(c, m, y, k) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("c", c, [Core.STRING, Core.NUMBER, FlexibleValue], true, false);
                Core.Validation.RuntimeValidator.validateParameter("m", m, [Core.STRING, Core.NUMBER, FlexibleValue], true, false);
                Core.Validation.RuntimeValidator.validateParameter("y", y, [Core.STRING, Core.NUMBER, FlexibleValue], true, false);
                Core.Validation.RuntimeValidator.validateParameter("k", k, [Core.STRING, Core.NUMBER, FlexibleValue], true, false);
                super(ColorType.CMYK);
                this.c = FlexibleValue.infer(c);
                this.m = FlexibleValue.infer(m);
                this.y = FlexibleValue.infer(y);
                this.k = FlexibleValue.infer(k);
                return Object.freeze(this);
            }
        }
        UserInterface.ColorCMYK = ColorCMYK;
        class ColorHSL extends Color {
            constructor(h, s, l) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("h", h, [Core.STRING, Core.NUMBER, FlexibleValue], true, false);
                Core.Validation.RuntimeValidator.validateParameter("s", s, [Core.STRING, Core.NUMBER, FlexibleValue], true, false);
                Core.Validation.RuntimeValidator.validateParameter("l", l, [Core.STRING, Core.NUMBER, FlexibleValue], true, false);
                super(ColorType.HSL);
                this.h = FlexibleValue.infer(h);
                this.s = FlexibleValue.infer(s);
                this.l = FlexibleValue.infer(l);
                return Object.freeze(this);
            }
        }
        UserInterface.ColorHSL = ColorHSL;
        class ColorHSV extends Color {
            constructor(h, s, v) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("h", h, [Core.STRING, Core.NUMBER, FlexibleValue], true, false);
                Core.Validation.RuntimeValidator.validateParameter("s", s, [Core.STRING, Core.NUMBER, FlexibleValue], true, false);
                Core.Validation.RuntimeValidator.validateParameter("v", v, [Core.STRING, Core.NUMBER, FlexibleValue], true, false);
                super(ColorType.HSV);
                this.h = FlexibleValue.infer(h);
                this.s = FlexibleValue.infer(s);
                this.v = FlexibleValue.infer(v);
                return Object.freeze(this);
            }
        }
        UserInterface.ColorHSV = ColorHSV;
        class BrushList extends Core.Collections.GenericList {
            static parse(str) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("str", str, Core.STRING, true, false);
                return null;
            }
            toString() {
                return null;
            }
            add(item) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("item", item, Brush, true);
                super.add.apply(this, ...arguments);
            }
            addMultiple(items) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateArrayParameter("items", items, Brush);
                super.addMultiple.apply(this, ...arguments);
            }
            insert(item) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("item", item, Brush, true);
                super.insert.apply(this, ...arguments);
            }
            insertMultiple(items) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateArrayParameter("items", items, Brush);
                super.insertMultiple.apply(this, ...arguments);
            }
            replace(oldItem, newItem) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("oldItem", oldItem, Brush, true, false);
                Core.Validation.RuntimeValidator.validateParameter("newItem", newItem, Brush, true, false);
                super.replace.apply(this, ...arguments);
            }
            replaceAt(index, newItem) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("index", index, Core.NUMBER, true, false);
                Core.Validation.RuntimeValidator.validateParameter("newItem", newItem, Brush, true, false);
                return super.replaceAt.apply(this, ...arguments);
            }
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
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("str", str, Core.STRING, true, false);
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
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("type", type, Core.NUMBER, true, false);
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
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("type", type, Core.NUMBER, true, false);
                this.type = type;
            }
            static parse(str) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("str", str, Core.STRING, true, false);
                return null;
            }
            toString() {
                return null;
            }
        }
        UserInterface.Brush = Brush;
        class ImageBrush extends Brush {
            constructor(source) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("source", source, Core.STRING, true, false);
                super(BrushType.Image);
                this.source = source;
                return Object.freeze(this);
            }
        }
        UserInterface.ImageBrush = ImageBrush;
        class GradientBrush extends Brush {
            constructor(type, stops = []) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("type", type, Core.NUMBER, true, false);
                Core.Validation.RuntimeValidator.validateArrayParameter("stops", stops, GradientStop, false);
                super(type);
                this.stops = new GradientStopList(stops);
            }
            static parse(str) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("str", str, Core.STRING, true, false);
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
        class GradientStopList extends Core.Collections.GenericList {
            add(item) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("item", item, GradientStop, true);
                super.add.apply(this, ...arguments);
            }
            addMultiple(items) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateArrayParameter("items", items, GradientStop, false);
                super.addMultiple.apply(this, ...arguments);
            }
            insert(item) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("item", item, GradientStop, true);
                super.insert.apply(this, ...arguments);
            }
            insertMultiple(items) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateArrayParameter("items", items, GradientStop, false);
                super.insertMultiple.apply(this, ...arguments);
            }
            replace(oldItem, newItem) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("oldItem", oldItem, GradientStop, true);
                Core.Validation.RuntimeValidator.validateParameter("newItem", newItem, GradientStop, true);
                super.replace.apply(this, ...arguments);
            }
            replaceAt(index, newItem) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("index", index, Core.NUMBER, true);
                Core.Validation.RuntimeValidator.validateParameter("newItem", newItem, GradientStop, true);
                return super.replaceAt.apply(this, ...arguments);
            }
        }
        UserInterface.GradientStopList = GradientStopList;
        class GradientStop {
            constructor(color, offset) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("color", color, Color, true);
                Core.Validation.RuntimeValidator.validateParameter("offset", offset, [Core.STRING, Core.NUMBER, FlexibleValue], true);
                this.color = color;
                this.offset = FlexibleValue.infer(offset);
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
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("value", value, Core.NUMBER, true);
                Core.Validation.RuntimeValidator.validateParameter("unit", unit, Core.NUMBER, true);
                this.value = value;
                this.unit = unit;
                return Object.freeze(this);
            }
            static getZero() {
                return new Length(0, LengthUnit.Number);
            }
            static parse(str) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("str", str, Core.STRING, true);
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
///<reference path="Core.UserInterface.ts"/>
var Core;
///<reference path="Core.UserInterface.ts"/>
(function (Core) {
    var UserInterface;
    (function (UserInterface) {
        var Primitives;
        (function (Primitives) {
            class ElementList extends Core.Collections.GenericList {
                constructor(parentContainer, original) {
                    super(original);
                    this.parentContainer = parentContainer;
                }
                add(item) {
                    Core.Validation.RuntimeValidator.validateParameter("item", item, HTMLElement, true);
                    super.add.apply(this, ...arguments);
                }
                addMultiple(items) {
                    Core.Validation.RuntimeValidator.validateArrayParameter("items", items, HTMLElement, false);
                    super.addMultiple.apply(this, ...arguments);
                }
                insert(item) {
                    Core.Validation.RuntimeValidator.validateParameter("item", item, HTMLElement, true);
                    super.insert.apply(this, ...arguments);
                }
                insertMultiple(items) {
                    Core.Validation.RuntimeValidator.validateArrayParameter("items", items, HTMLElement, false);
                    super.insertMultiple.apply(this, ...arguments);
                }
                replace(oldItem, newItem) {
                    Core.Validation.RuntimeValidator.validateParameter("newItem", newItem, HTMLElement, true);
                    super.replace.apply(this, ...arguments);
                }
                replaceAt(index, newItem) {
                    Core.Validation.RuntimeValidator.validateParameter("newItem", newItem, HTMLElement, true);
                    return super.replaceAt.apply(this, ...arguments);
                }
            }
            Primitives.ElementList = ElementList;
            class ElementContainer extends HTMLElement {
                constructor() {
                    super();
                    this.attachShadow({ mode: "open" });
                    this.elements = new ElementList(this);
                    this.elements.itemAddedEvent.attach(this._onElementAdded);
                    this.elements.itemRemovedEvent.attach(this._onElementRemoved);
                    this.elements.itemChangedEvent.attach(this._onElementChanged);
                }
                _adoptElement(elem, index) {
                    if (index == 0 || this.shadowRoot.childElementCount <= 1)
                        this.shadowRoot.appendChild(elem);
                    else {
                        let refChild = this.children.item(index + 1);
                        this.shadowRoot.insertBefore(elem, refChild);
                    }
                }
                _rejectElement(elem) {
                    this.shadowRoot.removeChild(elem);
                }
                _onElementAdded(target, args) {
                    target.parentContainer._adoptElement(args.newItem, args.newIndex);
                }
                _onElementChanged(target, args) {
                    target.parentContainer._rejectElement(args.oldItem);
                    target.parentContainer._adoptElement(args.newItem, args.newIndex);
                }
                _onElementRemoved(target, args) {
                    target.parentContainer._rejectElement(args.oldItem);
                }
            }
            Primitives.ElementContainer = ElementContainer;
            class ContentContainer extends HTMLElement {
                constructor() {
                    super();
                }
                //ContentElement.content property
                get content() {
                    return this._content;
                }
                set content(value) {
                    //Run time validation
                    Core.Validation.RuntimeValidator.validateParameter("value", value, UserInterface.Content);
                    this._content = value;
                    this.update();
                }
                update() {
                    if (this.content.type == UserInterface.ContentType.Text)
                        this.innerText = this.content.value;
                    else if (this.content.type == UserInterface.ContentType.HTML)
                        this.innerHTML = this.content.value;
                }
            }
            Primitives.ContentContainer = ContentContainer;
            customElements.define('core-content', UserInterface.Content);
            class Label extends ContentContainer {
                //Sets the label text content with a format
                setText(text, ...params) {
                    //Set text, passing the parameters through to StringUtils
                    this.content = new UserInterface.Content(Core.StringUtils.format(text, ...params));
                }
            }
            Primitives.Label = Label;
            customElements.define('core-label', Label);
            //CoreLabelableContainer
            class LabelableContainer extends HTMLElement {
                constructor() {
                    super();
                    this.shadow = this.attachShadow({ mode: "open" });
                    this.createLabelElement();
                }
                createLabelElement() {
                    let labelElement = new Label();
                    this.shadow.appendChild(labelElement);
                    this.labelElement = labelElement;
                }
                //LabelableContainer.labelContent property
                get labelContent() {
                    return this.labelElement.content;
                }
                set labelContent(value) {
                    this.labelElement.content = value;
                }
                //Sets the label text content with a format
                setLabelText(text, ...params) {
                    this.labelElement.setText(text, ...params);
                }
            }
            Primitives.LabelableContainer = LabelableContainer;
            customElements.define('core-labelablecontainer', LabelableContainer);
        })(Primitives = UserInterface.Primitives || (UserInterface.Primitives = {}));
    })(UserInterface = Core.UserInterface || (Core.UserInterface = {}));
})(Core || (Core = {}));
(function (Core) {
    var Events;
    (function (Events) {
        class ElementContainerEvent extends Core.MethodGroup {
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
        Events.ElementContainerEvent = ElementContainerEvent;
    })(Events = Core.Events || (Core.Events = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var UserInterface;
    (function (UserInterface) {
        var Icons;
        (function (Icons) {
            class Icon {
                constructor(name, x, y, width, height) {
                    this.parentList = null;
                    this._width = null;
                    this._height = null;
                    //Run time validation
                    Core.Validation.RuntimeValidator.validateParameter("name", name, Core.STRING, true, false);
                    Core.Validation.RuntimeValidator.validateParameter("x", x, Core.NUMBER, true, false);
                    Core.Validation.RuntimeValidator.validateParameter("y", y, Core.NUMBER, true, false);
                    Core.Validation.RuntimeValidator.validateParameter("width", width, Core.NUMBER);
                    Core.Validation.RuntimeValidator.validateParameter("height", width, Core.NUMBER);
                    this.name = name;
                    this.x = x;
                    this.y = y;
                    if (typeof width != Core.UNDEF && width !== null)
                        this.width = width;
                    if (typeof height != Core.UNDEF && height !== null)
                        this.height = height;
                }
                //Property Icon.width
                get width() {
                    if (this._width != null || this.parentList == null)
                        return this._width;
                    return this.parentList.width;
                }
                set width(value) {
                    //Run time validation
                    Core.Validation.RuntimeValidator.validateParameter("value", value, Core.NUMBER, true, true);
                    this._width = value;
                }
                //Property Icon.height
                get height() {
                    if (this._height != null || this.parentList == null)
                        return this._height;
                    return this.parentList.height;
                }
                set height(value) {
                    //Run time validation
                    Core.Validation.RuntimeValidator.validateParameter("value", value, Core.NUMBER, true, true);
                    this._height = value;
                }
                //Property Icon.spriteSrc
                get spriteSrc() {
                    if (this.parentList == null)
                        return null;
                    return this.parentList.spriteSrc;
                }
            }
            Icons.Icon = Icon;
            class IconList extends Core.Collections.GenericList {
                constructor(name, spriteSrc, width, height, icons) {
                    //Run time validation
                    Core.Validation.RuntimeValidator.validateParameter("name", name, Core.STRING, true, false);
                    Core.Validation.RuntimeValidator.validateParameter("spriteSrc", spriteSrc, Core.STRING, true, false);
                    Core.Validation.RuntimeValidator.validateParameter("width", width, Core.NUMBER, true, false);
                    Core.Validation.RuntimeValidator.validateParameter("height", height, Core.NUMBER, true, false);
                    Core.Validation.RuntimeValidator.validateArrayParameter("icons", icons, Icon, true);
                    super(icons);
                    this.name = name;
                    this.spriteSrc = spriteSrc;
                    this.width = width;
                    this.height = height;
                    this.itemAddedEvent.attach(this._onItemAdded);
                    this.itemRemovedEvent.attach(this._onItemRemoved);
                    this.itemChangedEvent.attach(this._onItemChanged);
                }
                _rejectIcon(icon) {
                    if (icon)
                        icon.parentList = null;
                }
                _adoptIcon(icon) {
                    if (icon)
                        icon.parentList = this;
                }
                _onItemAdded(target, args) {
                    this._adoptIcon(args.newItem);
                }
                _onItemRemoved(target, args) {
                    this._rejectIcon(args.oldItem);
                }
                _onItemChanged(target, args) {
                    this._adoptIcon(args.newItem);
                    this._rejectIcon(args.oldItem);
                }
                getIconByName(name) {
                    //Run time validation
                    Core.Validation.RuntimeValidator.validateParameter("name", name, Core.STRING, true, false);
                    return this.filter((icon) => icon.name == name)[0] || null;
                }
            }
            Icons.IconList = IconList;
            class IconManager {
                static addList(iconList) {
                    //Run time validation
                    Core.Validation.RuntimeValidator.validateParameter("iconList", iconList, IconList, true, false);
                    let isNameAlreadyInUse = this.getListByName(iconList.name) != null;
                    if (isNameAlreadyInUse)
                        throw new Error("Cannot add icon collection. Name is already in use.");
                    this.activeIconCollections.add(iconList);
                }
                static removeList(iconList) {
                    //Run time validation
                    Core.Validation.RuntimeValidator.validateParameter("iconList", iconList, IconList, true, false);
                    this.activeIconCollections.remove(iconList);
                }
                static getListByName(name) {
                    //Run time validation
                    Core.Validation.RuntimeValidator.validateParameter("name", name, Core.STRING, true, false);
                    return this.activeIconCollections.filter(function (iconList) {
                        return iconList.name == name;
                    })[0] || null;
                }
                static getIconByNames(collectionName, iconName) {
                    //Run time validation
                    Core.Validation.RuntimeValidator.validateParameter("collectionName", collectionName, Core.STRING, true, false);
                    Core.Validation.RuntimeValidator.validateParameter("iconName", iconName, Core.STRING, true, false);
                    let iconList = this.getListByName(collectionName);
                    //No collection was found, return
                    if (iconList == null)
                        return null;
                    let icon = iconList.getIconByName(iconName);
                    //Success! return icon
                    return icon;
                }
            }
            IconManager.activeIconCollections = new Core.Collections.GenericList();
            Icons.IconManager = IconManager;
        })(Icons = UserInterface.Icons || (UserInterface.Icons = {}));
    })(UserInterface = Core.UserInterface || (Core.UserInterface = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var UserInterface;
    (function (UserInterface) {
        //IconElement
        class IconElement extends HTMLElement {
            constructor() {
                super();
                this.shadow = this.attachShadow({ mode: "open" });
                this.createSpriteImageElement();
            }
            //IconElement.icon property
            get icon() {
                return this._icon;
            }
            set icon(value) {
                this._icon = value;
                this.updateSpriteImage();
            }
            updateSpriteImage() {
                this.spriteImageElement.width = this.icon.width;
                this.spriteImageElement.height = this.icon.height;
                this.spriteImageElement.src = this.icon.spriteSrc;
                this.spriteImageElement.style.position = "absolute";
                this.spriteImageElement.style.left = -this.icon.x + "px";
                this.spriteImageElement.style.top = -this.icon.y + "px";
            }
            createSpriteImageElement() {
                let spriteImageElement = new Image(1, 1);
                this.shadow.appendChild(spriteImageElement);
                this.spriteImageElement = spriteImageElement;
            }
        }
        UserInterface.IconElement = IconElement;
        customElements.define("core-icon", IconElement);
    })(UserInterface = Core.UserInterface || (Core.UserInterface = {}));
})(Core || (Core = {}));
///<reference path="Core.UserInterface.Primitives.ts"/>
///<reference path="Core.UserInterface.Icons.ts"/>
///<reference path="Core.UserInterface.IconElement.ts"/>
var Core;
///<reference path="Core.UserInterface.Primitives.ts"/>
///<reference path="Core.UserInterface.Icons.ts"/>
///<reference path="Core.UserInterface.IconElement.ts"/>
(function (Core) {
    var UserInterface;
    (function (UserInterface) {
        //Button
        class Button extends HTMLButtonElement {
            constructor() {
                super();
                this.attributePropertyAssociator = new UserInterface.AttributePropertyAssociator(this);
                this._value = null;
                this._isDefault = false;
                this.attachShadow({ mode: "open" });
                this.createIconElement();
                this.createContentElement();
            }
            createIconElement() {
                let iconElement = new UserInterface.IconElement();
                this.shadowRoot.appendChild(iconElement);
                this.iconElement = iconElement;
            }
            createContentElement() {
                let contentElement = new UserInterface.Primitives.ContentContainer();
                this.shadowRoot.appendChild(contentElement);
                this.contentElement = contentElement;
            }
            //Button.value property
            get value() {
                return this._value;
            }
            set value(value) {
                //Run time validation
                Core.Validation.RuntimeValidator.validateParameter("value", value, Core.STRING, true, true);
                this._value = value;
            }
            //Button.isDefault property
            get isDefault() {
                return this._isDefault;
            }
            set isDefault(value) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("value", value, Core.BOOL);
                this.setAttribute("isDefault", value ? "isDefault" : null);
                this._isDefault = value;
            }
            //Button.icon redirection property
            get icon() {
                return this._icon;
            }
            set icon(value) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("value", value, UserInterface.Icons.Icon);
                this.iconElement.icon = value;
                this._icon = value;
            }
            //Button.content redirection property
            get content() {
                return this.contentElement.content;
            }
            set content(value) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("value", value, UserInterface.Content);
                this.contentElement.content = value;
            }
        }
        UserInterface.Button = Button;
        customElements.define("core-button", Button, { extends: "button" });
        //CloseButton, based on IconElementButton
        class CloseButton extends Button {
            constructor() {
                super();
                this.tabIndex = -1;
                this.icon = UserInterface.Icons.IconManager.getIconByNames("default", "close");
            }
        }
        UserInterface.CloseButton = CloseButton;
        customElements.define("core-closebutton", CloseButton, { extends: "button" });
    })(UserInterface = Core.UserInterface || (Core.UserInterface = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var UserInterface;
    (function (UserInterface) {
        var Colors;
        (function (Colors) {
            Colors.Pink = UserInterface.Color.infer(0xFFC0CB);
            Colors.LightPink = UserInterface.Color.infer(0xFFB6C1);
            Colors.HotPink = UserInterface.Color.infer(0xFF69B4);
            Colors.DeepPink = UserInterface.Color.infer(0xFF1493);
            Colors.PaleVioletRed = UserInterface.Color.infer(0xDB7093);
            Colors.MediumVioletRed = UserInterface.Color.infer(0xC71585);
            Colors.LightSalmon = UserInterface.Color.infer(0xFFA07A);
            Colors.Salmon = UserInterface.Color.infer(0xFA8072);
            Colors.DarkSalmon = UserInterface.Color.infer(0xE9967A);
            Colors.LightCoral = UserInterface.Color.infer(0xF08080);
            Colors.IndianRed = UserInterface.Color.infer(0xCD5C5C);
            Colors.Crimson = UserInterface.Color.infer(0xDC143C);
            Colors.FireBrick = UserInterface.Color.infer(0xB22222);
            Colors.DarkRed = UserInterface.Color.infer(0x8B0000);
            Colors.Red = UserInterface.Color.infer(0xFF0000);
            Colors.OrangeRed = UserInterface.Color.infer(0xFF4500);
            Colors.Tomato = UserInterface.Color.infer(0xFF6347);
            Colors.Coral = UserInterface.Color.infer(0xFF7F50);
            Colors.DarkOrange = UserInterface.Color.infer(0xFF8C00);
            Colors.Orange = UserInterface.Color.infer(0xFFA500);
            Colors.Yellow = UserInterface.Color.infer(0xFFFF00);
            Colors.LightYellow = UserInterface.Color.infer(0xFFFFE0);
            Colors.LemonChiffon = UserInterface.Color.infer(0xFFFACD);
            Colors.LightGoldenrodYellow = UserInterface.Color.infer(0xFAFAD2);
            Colors.PapayaWhip = UserInterface.Color.infer(0xFFEFD5);
            Colors.Moccasin = UserInterface.Color.infer(0xFFE4B5);
            Colors.PeachPuff = UserInterface.Color.infer(0xFFDAB9);
            Colors.PaleGoldenrod = UserInterface.Color.infer(0xEEE8AA);
            Colors.Khaki = UserInterface.Color.infer(0xF0E68C);
            Colors.DarkKhaki = UserInterface.Color.infer(0xBDB76B);
            Colors.Gold = UserInterface.Color.infer(0xFFD700);
            Colors.Cornsilk = UserInterface.Color.infer(0xFFF8DC);
            Colors.BlanchedAlmond = UserInterface.Color.infer(0xFFEBCD);
            Colors.Bisque = UserInterface.Color.infer(0xFFE4C4);
            Colors.NavajoWhite = UserInterface.Color.infer(0xFFDEAD);
            Colors.Wheat = UserInterface.Color.infer(0xF5DEB3);
            Colors.BurlyWood = UserInterface.Color.infer(0xDEB887);
            Colors.Tan = UserInterface.Color.infer(0xD2B48C);
            Colors.RosyBrown = UserInterface.Color.infer(0xBC8F8F);
            Colors.SandyBrown = UserInterface.Color.infer(0xF4A460);
            Colors.Goldenrod = UserInterface.Color.infer(0xDAA520);
            Colors.DarkGoldenrod = UserInterface.Color.infer(0xB8860B);
            Colors.Peru = UserInterface.Color.infer(0xCD853F);
            Colors.Chocolate = UserInterface.Color.infer(0xD2691E);
            Colors.SaddleBrown = UserInterface.Color.infer(0x8B4513);
            Colors.Sienna = UserInterface.Color.infer(0xA0522D);
            Colors.Brown = UserInterface.Color.infer(0xA52A2A);
            Colors.Maroon = UserInterface.Color.infer(0x800000);
            Colors.DarkOliveGreen = UserInterface.Color.infer(0x556B2F);
            Colors.Olive = UserInterface.Color.infer(0x808000);
            Colors.OliveDrab = UserInterface.Color.infer(0x6B8E23);
            Colors.YellowGreen = UserInterface.Color.infer(0x9ACD32);
            Colors.LimeGreen = UserInterface.Color.infer(0x32CD32);
            Colors.Lime = UserInterface.Color.infer(0x00FF00);
            Colors.LawnGreen = UserInterface.Color.infer(0x7CFC00);
            Colors.Chartreuse = UserInterface.Color.infer(0x7FFF00);
            Colors.GreenYellow = UserInterface.Color.infer(0xADFF2F);
            Colors.SpringGreen = UserInterface.Color.infer(0x00FF7F);
            Colors.MediumSpringGreen = UserInterface.Color.infer(0x00FA9A);
            Colors.LightGreen = UserInterface.Color.infer(0x90EE90);
            Colors.PaleGreen = UserInterface.Color.infer(0x98FB98);
            Colors.DarkSeaGreen = UserInterface.Color.infer(0x8FBC8F);
            Colors.MediumAquamarine = UserInterface.Color.infer(0x66CDAA);
            Colors.MediumSeaGreen = UserInterface.Color.infer(0x3CB371);
            Colors.SeaGreen = UserInterface.Color.infer(0x2E8B57);
            Colors.ForestGreen = UserInterface.Color.infer(0x228B22);
            Colors.Green = UserInterface.Color.infer(0x008000);
            Colors.DarkGreen = UserInterface.Color.infer(0x006400);
            Colors.Aqua = UserInterface.Color.infer(0x00FFFF);
            Colors.Cyan = UserInterface.Color.infer(0x00FFFF);
            Colors.LightCyan = UserInterface.Color.infer(0xE0FFFF);
            Colors.PaleTurquoise = UserInterface.Color.infer(0xAFEEEE);
            Colors.Aquamarine = UserInterface.Color.infer(0x7FFFD4);
            Colors.Turquoise = UserInterface.Color.infer(0x40E0D0);
            Colors.MediumTurquoise = UserInterface.Color.infer(0x48D1CC);
            Colors.DarkTurquoise = UserInterface.Color.infer(0x00CED1);
            Colors.LightSeaGreen = UserInterface.Color.infer(0x20B2AA);
            Colors.CadetBlue = UserInterface.Color.infer(0x5F9EA0);
            Colors.DarkCyan = UserInterface.Color.infer(0x008B8B);
            Colors.Teal = UserInterface.Color.infer(0x008080);
            Colors.LightSteelBlue = UserInterface.Color.infer(0xB0C4DE);
            Colors.PowderBlue = UserInterface.Color.infer(0xB0E0E6);
            Colors.LightBlue = UserInterface.Color.infer(0xADD8E6);
            Colors.SkyBlue = UserInterface.Color.infer(0x87CEEB);
            Colors.LightSkyBlue = UserInterface.Color.infer(0x87CEFA);
            Colors.DeepSkyBlue = UserInterface.Color.infer(0x00BFFF);
            Colors.DodgerBlue = UserInterface.Color.infer(0x1E90FF);
            Colors.CornflowerBlue = UserInterface.Color.infer(0x6495ED);
            Colors.SteelBlue = UserInterface.Color.infer(0x4682B4);
            Colors.RoyalBlue = UserInterface.Color.infer(0x4169E1);
            Colors.Blue = UserInterface.Color.infer(0x0000FF);
            Colors.MediumBlue = UserInterface.Color.infer(0x0000CD);
            Colors.DarkBlue = UserInterface.Color.infer(0x00008B);
            Colors.Navy = UserInterface.Color.infer(0x000080);
            Colors.MidnightBlue = UserInterface.Color.infer(0x191970);
            Colors.Lavender = UserInterface.Color.infer(0xE6E6FA);
            Colors.Thistle = UserInterface.Color.infer(0xD8BFD8);
            Colors.Plum = UserInterface.Color.infer(0xDDA0DD);
            Colors.Violet = UserInterface.Color.infer(0xEE82EE);
            Colors.Orchid = UserInterface.Color.infer(0xDA70D6);
            Colors.Fuchsia = UserInterface.Color.infer(0xFF00FF);
            Colors.Magenta = UserInterface.Color.infer(0xFF00FF);
            Colors.MediumOrchid = UserInterface.Color.infer(0xBA55D3);
            Colors.MediumPurple = UserInterface.Color.infer(0x9370DB);
            Colors.BlueViolet = UserInterface.Color.infer(0x8A2BE2);
            Colors.DarkViolet = UserInterface.Color.infer(0x9400D3);
            Colors.DarkOrchid = UserInterface.Color.infer(0x9932CC);
            Colors.DarkMagenta = UserInterface.Color.infer(0x8B008B);
            Colors.Purple = UserInterface.Color.infer(0x800080);
            Colors.Indigo = UserInterface.Color.infer(0x4B0082);
            Colors.DarkSlateBlue = UserInterface.Color.infer(0x483D8B);
            Colors.SlateBlue = UserInterface.Color.infer(0x6A5ACD);
            Colors.MediumSlateBlue = UserInterface.Color.infer(0x7B68EE);
            Colors.White = UserInterface.Color.infer(0xFFFFFF);
            Colors.Snow = UserInterface.Color.infer(0xFFFAFA);
            Colors.Honeydew = UserInterface.Color.infer(0xF0FFF0);
            Colors.MintCream = UserInterface.Color.infer(0xF5FFFA);
            Colors.Azure = UserInterface.Color.infer(0xF0FFFF);
            Colors.AliceBlue = UserInterface.Color.infer(0xF0F8FF);
            Colors.GhostWhite = UserInterface.Color.infer(0xF8F8FF);
            Colors.WhiteSmoke = UserInterface.Color.infer(0xF5F5F5);
            Colors.Seashell = UserInterface.Color.infer(0xFFF5EE);
            Colors.Beige = UserInterface.Color.infer(0xF5F5DC);
            Colors.OldLace = UserInterface.Color.infer(0xFDF5E6);
            Colors.FloralWhite = UserInterface.Color.infer(0xFFFAF0);
            Colors.Ivory = UserInterface.Color.infer(0xFFFFF0);
            Colors.AntiqueWhite = UserInterface.Color.infer(0xFAEBD7);
            Colors.Linen = UserInterface.Color.infer(0xFAF0E6);
            Colors.LavenderBlush = UserInterface.Color.infer(0xFFF0F5);
            Colors.MistyRose = UserInterface.Color.infer(0xFFE4E1);
            Colors.Gainsboro = UserInterface.Color.infer(0xDCDCDC);
            Colors.LightGray = UserInterface.Color.infer(0xD3D3D3);
            Colors.Silver = UserInterface.Color.infer(0xC0C0C0);
            Colors.DarkGray = UserInterface.Color.infer(0xA9A9A9);
            Colors.Gray = UserInterface.Color.infer(0x808080);
            Colors.DimGray = UserInterface.Color.infer(0x696969);
            Colors.LightSlateGray = UserInterface.Color.infer(0x778899);
            Colors.SlateGray = UserInterface.Color.infer(0x708090);
            Colors.DarkSlateGray = UserInterface.Color.infer(0x2F4F4F);
            Colors.Black = UserInterface.Color.infer(0x000000);
            Colors.Transparent = new UserInterface.ColorRGBA(0, 0, 0, 0);
            function fromName(name) {
                for (let n in Colors)
                    if (n.toLowerCase() === name)
                        return Colors[n];
                return null;
            }
            Colors.fromName = fromName;
        })(Colors = UserInterface.Colors || (UserInterface.Colors = {}));
    })(UserInterface = Core.UserInterface || (Core.UserInterface = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var UserInterface;
    (function (UserInterface) {
        class ControlVisualPropertyManager {
        }
        UserInterface.ControlVisualPropertyManager = ControlVisualPropertyManager;
        class ControlStylesheetManager {
            constructor(target) {
                this._target = target;
                this._stylesheets = new Core.Collections.GenericList();
            }
            prependStylesheet(href) {
                let stylesheet = document.createElement("link");
                stylesheet.rel = "stylesheet";
                stylesheet.type = "text/css";
                stylesheet.href = href;
                if (this._stylesheets.length == 0)
                    UserInterface.Utils.prependChild(this._target.shadowRoot, stylesheet);
                else
                    this._stylesheets.getLast().insertAdjacentElement("afterend", stylesheet);
                this._stylesheets.add(stylesheet);
                console.log(this._stylesheets);
                return stylesheet;
            }
            getStylesheetByHref(href) {
                return this._stylesheets.first((item) => item.href == href);
            }
            removeStylesheet(stylesheet) {
                this._target.shadowRoot.removeChild(stylesheet);
                this._stylesheets.remove(stylesheet);
            }
        }
        UserInterface.ControlStylesheetManager = ControlStylesheetManager;
        class Control extends HTMLElement {
            constructor() {
                super();
                //Control.width property
                this.widthProperty = Core.XAML.DependencyProperty.register("width", new Core.Type(UserInterface.Length), new Core.Type(Control));
                //Control.minimumWidth property
                this.minimumWidthProperty = Core.XAML.DependencyProperty.register("minimumWidth", new Core.Type(UserInterface.Length), new Core.Type(Control));
                //Control.maximumWidth property
                this.maximumWidthProperty = Core.XAML.DependencyProperty.register("maximumWidth", new Core.Type(UserInterface.Length), new Core.Type(Control));
                //Control.height property
                this.heightProperty = Core.XAML.DependencyProperty.register("height", new Core.Type(UserInterface.Length), new Core.Type(Control));
                //Control.minimumHeight property
                this.minimumHeightProperty = Core.XAML.DependencyProperty.register("minimumHeight", new Core.Type(UserInterface.Length), new Core.Type(Control));
                //Control.maximumHeight property
                this.maximumHeightProperty = Core.XAML.DependencyProperty.register("maximumHeight", new Core.Type(UserInterface.Length), new Core.Type(Control));
                //Control.backgroundColor property
                this.backgroundColorProperty = Core.XAML.DependencyProperty.register("backgroundColor", new Core.Type(UserInterface.Color), new Core.Type(Control));
                //Control.backgroundImage property
                this.backgroundImageProperty = Core.XAML.DependencyProperty.register("backgroundImage", new Core.Type(UserInterface.Brush), new Core.Type(Control));
                //Control.borderColor property
                this.borderColorProperty = Core.XAML.DependencyProperty.register("borderColor", new Core.Type(UserInterface.Color), new Core.Type(Control));
                //Control.borderWidth property
                this.borderWidthProperty = Core.XAML.DependencyProperty.register("borderWidth", new Core.Type(UserInterface.Length), new Core.Type(Control));
                this._stylesheetManager = new ControlStylesheetManager(this);
                this.attachShadow({ mode: "open" });
                this._stylesheetManager.prependStylesheet("../Themes/control.base.theme.css");
                this._populateControl();
            }
            getValue(property) {
                return Core.XAML.IDependencyObject.getValue(this, property);
            }
            setValue(property, value) {
                Core.XAML.IDependencyObject.setValue(this, property, value);
            }
            _populateControl() {
                let outerBox = document.createElement("core-controlouterbox");
                this._outerBox = outerBox;
                this.shadowRoot.appendChild(outerBox);
                let innerBox = document.createElement("core-controlinnerbox");
                outerBox.appendChild(innerBox);
                this._innerBox = innerBox;
            }
            get width() {
                return this.getValue(this.widthProperty);
            }
            set width(value) {
                this.setValue(this.widthProperty, value);
            }
            get minimumWidth() {
                return this.getValue(this.minimumWidthProperty);
            }
            set minimumWidth(value) {
                this.setValue(this.minimumWidthProperty, value);
            }
            get maximumWidth() {
                return this.getValue(this.maximumWidthProperty);
            }
            set maximumWidth(value) {
                this.setValue(this.maximumWidthProperty, value);
            }
            get height() {
                return this.getValue(this.heightProperty);
            }
            set height(value) {
                this.setValue(this.heightProperty, value);
            }
            get minimumHeight() {
                return this.getValue(this.minimumHeightProperty);
            }
            set minimumHeight(value) {
                this.setValue(this.minimumHeightProperty, value);
            }
            get maximumHeight() {
                return this.getValue(this.maximumHeightProperty);
            }
            set maximumHeight(value) {
                this.setValue(this.maximumHeightProperty, value);
            }
            get backgroundColor() {
                return this.getValue(this.backgroundColorProperty);
            }
            set backgroundColor(value) {
                this.setValue(this.backgroundColorProperty, value);
            }
            get backgroundImage() {
                return this.getValue(this.backgroundImageProperty);
            }
            set backgroundImage(value) {
                this.setValue(this.backgroundImageProperty, value);
            }
            get borderColor() {
                return this.getValue(this.borderColorProperty);
            }
            set borderColor(value) {
                this.setValue(this.borderColorProperty, value);
            }
            get borderWidth() {
                return this.getValue(this.borderWidthProperty);
            }
            set borderWidth(value) {
                this.setValue(this.borderWidthProperty, value);
            }
        }
        UserInterface.Control = Control;
        class ControlOuterBox extends HTMLElement {
        }
        UserInterface.ControlOuterBox = ControlOuterBox;
        customElements.define("core-controlouterbox", ControlOuterBox);
        class ControlInnerBox extends HTMLElement {
        }
        UserInterface.ControlInnerBox = ControlInnerBox;
        customElements.define("core-controlinnerbox", ControlInnerBox);
    })(UserInterface = Core.UserInterface || (Core.UserInterface = {}));
})(Core || (Core = {}));
///<reference path="Core.UserInterface.Primitives.ts"/>
var Core;
///<reference path="Core.UserInterface.Primitives.ts"/>
(function (Core) {
    var UserInterface;
    (function (UserInterface) {
        //CoreDataGrid
        class DataGrid extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: "open" });
                this.createTableElement();
            }
            createTableElement() {
                let tableElement = document.createElement("core-datagridtable");
                this.shadowRoot.appendChild(tableElement);
                //The table element
                this.tableElement = tableElement;
            }
            get head() { return this.tableElement.head; }
            get body() { return this.tableElement.body; }
        }
        UserInterface.DataGrid = DataGrid;
        customElements.define('core-datagrid', DataGrid);
        //CoreDataGridTable
        class DataGridTable extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: "open" });
                this.createHeadElement();
                this.createBodyElement();
            }
            createHeadElement() {
                let head = document.createElement("core-datagridsection");
                this.shadowRoot.appendChild(head);
                this.head = head;
            }
            createBodyElement() {
                let body = document.createElement("core-datagridsection");
                this.shadowRoot.appendChild(body);
                this.body = body;
            }
        }
        UserInterface.DataGridTable = DataGridTable;
        customElements.define('core-datagridtable', DataGridTable);
        //CoreDataGridBody
        class DataGridSection extends UserInterface.Primitives.ElementContainer {
        }
        UserInterface.DataGridSection = DataGridSection;
        customElements.define('core-datagridsection', DataGridSection);
        //CoreDataGridRow
        class DataGridRow extends UserInterface.Primitives.ElementContainer {
        }
        UserInterface.DataGridRow = DataGridRow;
        customElements.define('core-datagridrow', DataGridRow);
        //CoreDataGridCell
        class DataGridCell extends UserInterface.Primitives.ElementContainer {
            constructor() {
                super();
            }
        }
        UserInterface.DataGridCell = DataGridCell;
        customElements.define('core-datagridcell', DataGridCell);
    })(UserInterface = Core.UserInterface || (Core.UserInterface = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var UserInterface;
    (function (UserInterface) {
        var Dialogs;
        (function (Dialogs_1) {
            //CoreDialogTitle
            class DialogTitle extends UserInterface.Primitives.ContentContainer {
            }
            Dialogs_1.DialogTitle = DialogTitle;
            customElements.define('core-dialogtitle', DialogTitle);
            //CoreDialogTitleBar
            class DialogTitleBar extends HTMLDialogElement {
                constructor() {
                    super();
                    this._titleElement = document.createElement("core-dialogtitle");
                    this.appendChild(this._titleElement);
                    this._closeButtonElement = document.createElement("core-closebutton");
                    this.appendChild(this._closeButtonElement);
                }
                get titleContent() {
                    return this._titleElement.content;
                }
                set titleContent(value) {
                    this._titleElement.content = value;
                }
            }
            Dialogs_1.DialogTitleBar = DialogTitleBar;
            customElements.define('core-dialogtitlebar', DialogTitleBar, { extends: "section" });
            //CoreDialogContent
            class DialogContent extends UserInterface.Primitives.ElementContainer {
            }
            Dialogs_1.DialogContent = DialogContent;
            customElements.define('core-dialogcontent', DialogContent, { extends: "section" });
            //CoreDialogMessage
            class DialogMessage extends UserInterface.Primitives.ContentContainer {
            }
            Dialogs_1.DialogMessage = DialogMessage;
            customElements.define('core-dialogmessage', DialogMessage, { extends: "section" });
            //CoreDialog
            class Dialog extends HTMLDialogElement {
                constructor() {
                    super();
                    this.returnValue = null;
                    this._titleBarElement = document.createElement("core-dialogtitlebar");
                    this.appendChild(this._titleBarElement);
                    this._contentElement = document.createElement("core-dialogcontent");
                    this.appendChild(this._contentElement);
                    this._buttonBarElement = document.createElement("core-buttonbar");
                    this.appendChild(this._buttonBarElement);
                }
                get dialogTitle() {
                    return this._titleBarElement.titleContent;
                }
                set dialogTitle(value) {
                    this._titleBarElement.titleContent = value;
                }
                get messageElements() {
                    return this._contentElement.elements;
                }
                get buttonBarElements() {
                    return this._buttonBarElement.elements;
                }
            }
            Dialogs_1.Dialog = Dialog;
            customElements.define('core-dialog', Dialog, { extends: "dialog" });
            //interface dialogs
            class Dialogs {
            }
            Dialogs_1.Dialogs = Dialogs;
        })(Dialogs = UserInterface.Dialogs || (UserInterface.Dialogs = {}));
    })(UserInterface = Core.UserInterface || (Core.UserInterface = {}));
})(Core || (Core = {}));
///<reference path="Core.UserInterface.ts"/>
var Core;
///<reference path="Core.UserInterface.ts"/>
(function (Core) {
    var UserInterface;
    (function (UserInterface) {
        var Forms;
        (function (Forms) {
            class FormItem extends UserInterface.Primitives.LabelableContainer {
                constructor() {
                    super(...arguments);
                    this._element = null;
                }
                //FormItem.element property
                get element() {
                    return this._element;
                }
                set element(value) {
                    //Runtime validation
                    Core.Validation.RuntimeValidator.validateParameter("value", value, HTMLElement);
                    //remove old element
                    if (this._element != null)
                        this._element.remove();
                    //append new element
                    this.appendChild(this._element);
                    this._element = value;
                }
            }
            Forms.FormItem = FormItem;
            customElements.define("core-formitem", FormItem);
            class ButtonOptions {
                constructor(value, content, icon, title, isDefault) {
                    //Runtime validation
                    Core.Validation.RuntimeValidator.validateParameter("value", value, Core.STRING);
                    Core.Validation.RuntimeValidator.validateParameter("content", content, UserInterface.Content);
                    Core.Validation.RuntimeValidator.validateParameter("title", title, Core.STRING);
                    Core.Validation.RuntimeValidator.validateParameter("isDefault", isDefault, Core.BOOL);
                    this.value = value;
                    this.content = content;
                    this.icon = icon || null;
                    this.title = title || null;
                }
            }
            Forms.ButtonOptions = ButtonOptions;
            class ButtonType {
                constructor(defaultValue, ...buttons) {
                    //Runtime validation
                    Core.Validation.RuntimeValidator.validateParameter("defaultValue", defaultValue, Core.STRING);
                    Core.Validation.RuntimeValidator.validateArrayParameter("buttons", buttons, ButtonOptions, false);
                    this.buttons = buttons;
                    this.defaultValue = defaultValue || null;
                }
            }
            Forms.ButtonType = ButtonType;
            Forms.BTN_OPTIONS_YES = new ButtonOptions("yes", new UserInterface.Content("yes"));
            Forms.BTN_OPTIONS_NO = new ButtonOptions("no", new UserInterface.Content("no"));
            Forms.BTN_OPTIONS_CANCEL = new ButtonOptions("cancel", new UserInterface.Content("cancel"));
            Forms.BTN_OPTIONS_OK = new ButtonOptions("ok", new UserInterface.Content("ok"));
            Forms.BTN_TYPE_YESNO = new ButtonType("no", Forms.BTN_OPTIONS_YES, Forms.BTN_OPTIONS_NO);
            Forms.BTN_TYPE_YESNOCANCEL = new ButtonType("cancel", Forms.BTN_OPTIONS_YES, Forms.BTN_OPTIONS_NO, Forms.BTN_OPTIONS_CANCEL);
            Forms.BTN_TYPE_YESCANCEL = new ButtonType("cancel", Forms.BTN_OPTIONS_YES, Forms.BTN_OPTIONS_CANCEL);
            Forms.BTN_TYPE_NOCANCEL = new ButtonType("cancel", Forms.BTN_OPTIONS_NO, Forms.BTN_OPTIONS_CANCEL);
            Forms.BTN_TYPE_OK = new ButtonType("ok", Forms.BTN_OPTIONS_OK);
            Forms.BTN_TYPE_OKCANCEL = new ButtonType("cancel", Forms.BTN_OPTIONS_OK, Forms.BTN_OPTIONS_CANCEL);
            //CoreDialogButtonBar
            class ButtonBar extends UserInterface.Primitives.ElementContainer {
                constructor(buttonType) {
                    super();
                    this.defaultButton = null;
                    //Runtime validation
                    Core.Validation.RuntimeValidator.validateParameter("buttonType", buttonType, ButtonType, false, false);
                }
                static _getButtonsFromType(type) {
                    let result = new Array();
                    for (var i = 0; i < type.buttons.length; i++) {
                        let buttonOptions = type.buttons[i];
                        let buttonElement = document.createElement("core-button");
                        buttonElement.content = buttonOptions.content;
                        buttonElement.icon = buttonOptions.icon;
                        buttonElement.value = buttonOptions.value;
                        buttonElement.isDefault = type.defaultValue === buttonOptions.value;
                        result.push(buttonElement);
                    }
                    return result;
                }
            }
            Forms.ButtonBar = ButtonBar;
            customElements.define("core-dialogbuttonbar", ButtonBar);
        })(Forms = UserInterface.Forms || (UserInterface.Forms = {}));
    })(UserInterface = Core.UserInterface || (Core.UserInterface = {}));
})(Core || (Core = {}));
///<reference path="Core.UserInterface.Control.ts"/>
var Core;
///<reference path="Core.UserInterface.Control.ts"/>
(function (Core) {
    var UserInterface;
    (function (UserInterface) {
        //CoreProgressBar
        class ProgressBar extends UserInterface.Control {
            constructor() {
                super();
                this.progressEvent = new Core.Events.ProgressEvent(this, this._onProgress);
                this._labelFormat = "LOADING {2}%";
                this.labelElement = null;
                this._indeterminate = true;
                this._value = 0;
                this._min = 0;
                this._max = 1;
                this._stylesheetManager.prependStylesheet("../Themes/progress-bar.base.theme.css");
                this._populate();
                this._updateVisuals();
            }
            _populate() {
                //Populate progress bar fill
                let fillElement = document.createElement("core-progressbarfill");
                this._fillElement = fillElement;
                this._innerBox.appendChild(fillElement);
            }
            _onProgress(target, args) {
            }
            //ProgressBar.labelFormat property
            set labelFormat(value) {
                this._labelFormat = value;
            }
            get labelFormat() {
                return this._labelFormat;
            }
            //ProgressBar.indeterminate property        
            set indeterminate(value) {
                this._indeterminate = value || false;
                //Reflect changes visually
                this._updateVisuals();
            }
            get indeterminate() {
                return this._indeterminate;
            }
            //ProgressBar.value property
            set value(value) {
                if (value > this.max)
                    value = this.max;
                else if (value < this._min)
                    value = this.min;
                this._value = value;
                this._indeterminate = false;
                //Reflect changes visually
                this._updateVisuals();
            }
            get value() {
                return this._value;
            }
            //ProgressBar.min property
            set min(value) {
                if (value > this.max)
                    value = this.max - .0001;
                this._min = value;
                //Reflect changes visually
                this._updateVisuals();
            }
            get min() {
                return this._min;
            }
            //ProgressBar.max property
            set max(value) {
                if (value > this.min)
                    value = this.min + .0001;
                this._min = value;
                //Reflect changes visually
                this._updateVisuals();
            }
            get max() {
                return this._max;
            }
            _updateLabel(done, total, percent) {
                if (this.labelElement instanceof UserInterface.Primitives.Label)
                    this.labelElement.setText(this._labelFormat, done, total, percent);
            }
            _updateVisuals() {
                if (this.indeterminate)
                    this._fillElement.setAttribute('indeterminate', '');
                else {
                    //Get the equivalent percentage of value
                    let done = this._value - this._min, total = this._max - this._min, percent = done / total * 100;
                    //Update fill width
                    this._fillElement.style.width = percent + '%';
                    this._fillElement.removeAttribute('indeterminate');
                    //Update label
                    this._updateLabel(done, total, percent);
                }
            }
        }
        UserInterface.ProgressBar = ProgressBar;
        customElements.define('core-progressbar', ProgressBar);
        //CoreProgressBarInner
        class ProgressBarInner extends HTMLElement {
        }
        customElements.define('core-progressbarinner', ProgressBarInner);
        //CoreProgressBarFill
        class ProgressBarFill extends HTMLElement {
        }
        customElements.define('core-progressbarfill', ProgressBarFill);
    })(UserInterface = Core.UserInterface || (Core.UserInterface = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var UserInterface;
    (function (UserInterface) {
        var Utils;
        (function (Utils) {
            function prependChild(elem, child) {
                if (elem.childNodes.length > 0)
                    elem.insertBefore(child, elem.childNodes.item(0));
                else
                    elem.appendChild(child);
            }
            Utils.prependChild = prependChild;
        })(Utils = UserInterface.Utils || (UserInterface.Utils = {}));
    })(UserInterface = Core.UserInterface || (Core.UserInterface = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Web;
    (function (Web) {
        class AjaxRequestOptions {
            constructor(async = true, data = "", user = "", password = "") {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("async", async, Core.BOOL);
                Core.Validation.RuntimeValidator.validateParameter("user", user, Core.STRING);
                Core.Validation.RuntimeValidator.validateParameter("password", password, Core.STRING);
                this.asynchronous = async;
                this.user = user;
                this.password = password;
                this.data = data;
            }
        }
        Web.AjaxRequestOptions = AjaxRequestOptions;
        class AjaxRequestInfo {
            constructor(method, url, options = new AjaxRequestOptions()) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("method", method, Core.STRING, true, false);
                Core.Validation.RuntimeValidator.validateParameter("url", url, Core.STRING, true, false);
                Core.Validation.RuntimeValidator.validateParameter("options", options, AjaxRequestOptions);
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
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("target", target, [Function, Core.Web.AjaxRequest], true);
                super(target);
            }
            attach(listener) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("listener", listener, [Function, AjaxEvent]);
                super.attach(listener);
            }
            detach(listener) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("listener", listener, [Function, AjaxEvent]);
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
                Core.Validation.RuntimeValidator.validateParameter("ajax", ajax, Web.AjaxRequest, true, false);
                Core.Validation.RuntimeValidator.validateParameter("messaage", message, Core.STRING, false);
                let xhr = ajax.baseRequest;
                let messageXml = Core.StringUtils.format("{0}{1} request to {2} failed with status code {3}({4}).", message ? (message + " ") : "", ajax.info.method, ajax.info.url, xhr.status, xhr.statusText);
                super(messageXml);
            }
        }
        Web.LoadException = LoadException;
    })(Web = Core.Web || (Core.Web = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var XAML;
    (function (XAML) {
        let IDependencyObject;
        (function (IDependencyObject) {
            function getValue(owner, property) {
                return null;
            }
            IDependencyObject.getValue = getValue;
            function setValue(owner, property, value) {
            }
            IDependencyObject.setValue = setValue;
        })(IDependencyObject = XAML.IDependencyObject || (XAML.IDependencyObject = {}));
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
        XAML.DependencyObject = DependencyObject;
        class DependencyObjectType {
            constructor(id, name, environmentType) {
                this.id = id;
                this.name = name;
                this.environmentType = environmentType;
                return Object.freeze(this);
            }
            static _getUniqueId(type) {
                let depObjType = this._registeredTypes.first((item) => Object.is(item.environmentType, type)), newId = this._registeredTypes.length;
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
        DependencyObjectType._registeredTypes = new Core.Collections.GenericList();
        XAML.DependencyObjectType = DependencyObjectType;
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
        XAML.PropertyMetadata = PropertyMetadata;
        class DependencyPropertyRegistryEntry {
            constructor(property, metadata) {
                this.property = property;
                this.metadata = metadata;
            }
        }
        XAML.DependencyPropertyRegistryEntry = DependencyPropertyRegistryEntry;
        let DependencyPropertyRegistry;
        (function (DependencyPropertyRegistry) {
            let registryEntries;
            function register(property, metadata) {
                let entry = new DependencyPropertyRegistryEntry(property, metadata), globalIndex = registryEntries.length;
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
        XAML.DependencyPropertyKey = DependencyPropertyKey;
        class DependencyProperty {
            static _registerCommon(name, propertyType, ownerType, metadata, validateValueCallback) {
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
        XAML.DependencyProperty = DependencyProperty;
    })(XAML = Core.XAML || (Core.XAML = {}));
})(Core || (Core = {}));
//# sourceMappingURL=Core.js.map