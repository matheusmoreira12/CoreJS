var Core;
(function (Core) {
    Core.UNDEF = "undefined";
    Core.STRING = "string";
    Core.NUMBER = "number";
    Core.BOOL = "boolean";
})(Core || (Core = {}));
var Core;
(function (Core) {
    let Validation;
    (function (Validation) {
        class Utils {
            static _expectedTypeNameAsMessageTags(expectedType) {
                if (expectedType instanceof Function && expectedType.length == 0)
                    return Core.Exceptions.Exception.getMessageTag("type", expectedType.name);
                else if (typeof expectedType == Core.STRING)
                    return Core.Exceptions.Exception.getMessageTag("type", expectedType);
                else
                    throw new Core.Exceptions.InvalidParameterTypeException("expectedType", [Core.STRING, Function], "Cannot convert parameter {0} to text because it is not a {1}.");
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
                //Runtime validation
                if (!Object.is(this.validateParameter.caller, this.validateParameter)) {
                    this.validateParameter("paramName", paramName, Core.STRING, true, false);
                    this.validateParameter("paramValue", paramValue, [], true);
                    this.validateParameter("paramExpectedType", paramExpectedType, [Core.STRING, Function, Array], true, false);
                }
                let isNull = paramValue === null, isUndefined = typeof paramValue == Core.UNDEF;
                if (isNull) {
                    if (!isNullable)
                        throw new Core.Exceptions.InvalidParameterException(paramName, "Parameter %0 is a non-nullable parameter.");
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
            static validateArrayParameter(paramName, paramValue, memberExpectedType, isNullable = true) {
                //Runtime validation
                this.validateParameter("paramName", paramName, Core.STRING, true, false);
                this.validateParameter("paramValue", paramValue, Array, true, false);
                this.validateParameter("memberExpectedType", paramName, [Core.STRING, Function, Array], true, false);
                try {
                    for (let i = 0; i < paramValue.length; i++) {
                        let member = paramValue[i];
                        RuntimeValidator.validateParameter(paramName, member, memberExpectedType, false, isNullable);
                    }
                }
                catch (e) {
                    throw (e);
                }
            }
        }
        Validation.RuntimeValidator = RuntimeValidator;
    })(Validation = Core.Validation || (Core.Validation = {}));
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
    class StringUtils {
        // This encoding function is from Philippe Tenenhaus's example at http://www.philten.com/us-xmlhttprequest-image/
        static encodeBase64(inputStr) {
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
        static isValidIdentifier(str) {
            return /^[a-zA-Z_]\w*$/.test(str);
        }
        static capitalize(str) {
            return str.replace(/(?:^|s)S/g, (match) => match.toUpperCase());
        }
        static toCamelCase(str) {
            return str.replace(/^\w|[\s-]\w/g, (match, index) => {
                match = match.replace(/[\s-]/, "");
                return index == 0 ? match.toLowerCase() : match.toUpperCase();
            });
        }
        static fromCamelCase(str) {
            return str.replace(/^[a-z]|[A-Z]/g, (match, index) => (index > 0 ? " " : "") + match.toUpperCase());
        }
        static splice(str, start, delCount, newSubStr) {
            if (start < 0 || start >= str.length)
                throw new RangeError('The value for parameter "start" was outside the string bounds.');
            if (delCount < 0 || (start + delCount) >= str.length)
                throw new RangeError('The value for parameter "delCount" was outside the string bounds.');
            return str.slice(0, start) + newSubStr + str.slice(start + delCount);
        }
        //Formats the provided test, replacing the parameter indexes by their respective values
        static format(text, ...params) {
            //get params from arguments
            params = Array.prototype.slice.apply(arguments).slice(1);
            return text.replace(/{\d+}/g, (match) => {
                let paramIndex = Number(match.substring(1, match.length - 2));
                return String(params[paramIndex]);
            });
        }
        //Returns a SearchMatchList containing all the matches for the desired RegExp.
        static searchRegExp(str, regexp) {
            return SearchMatchList.searchString(str, regexp);
        }
        //Converts an array of single-character-long strings to string
        static fromCharArray(arr) {
            //Runtime validation
            Core.Validation.RuntimeValidator.validateParameter("arr", arr, Array, true, false);
            return arr.join("");
        }
        //Converts a string to an array of single-character-long strings
        static toCharArray(str) {
            //Runtime validation
            Core.Validation.RuntimeValidator.validateParameter("str", str, Core.STRING, true, false);
            return Array.prototype.splice.apply(str);
        }
        //Gets the char range between two characters
        static getCharRange(startChar, endChar) {
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
        //Gets the char range denoted by a RegEx-like [] notation
        static toCharRange(representation) {
            //Runtime validation
            Core.Validation.RuntimeValidator.validateParameter("representation", representation, Core.STRING, true, false);
            representation = representation.replace(/.\-./g, (match) => this.getCharRange(match[0], match[match.length - 1]).join(""));
            return this.toCharArray(representation);
        }
        //Returns the index of any of the specified strings, from the specified start position
        static indexOfAny(str, searchStrings, position = 0) {
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
        //Returns the index of any of the specified strings, from the specified start position
        static lastIndexOfAny(str, searchStrings, position = 0) {
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
    }
    Core.StringUtils = StringUtils;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Exceptions;
    (function (Exceptions) {
        class Exception extends Error {
            constructor(messageXml, innerException, ...extraParams) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("messageXml", messageXml, String);
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
                return messageXml.replace(/<.*>/g, "\"");
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
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("item", item, [], true);
                this.invokeOnItemAdded(item, this.length - 1);
                super.push(item);
            }
            //Inserts multiple items into this collection, starting at the specified zero-based position
            insertMultiple(index, ...items) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("index", index, Core.NUMBER, true);
                Core.Validation.RuntimeValidator.validateParameter("items", items, Array, true, false);
                items.forEach((item, _index) => this.invokeOnItemAdded(item, _index + index));
                super.splice(index, 0, ...items);
            }
            //Inserts an item into this collection at the specified zero-based position
            insert(item, index) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("item", item, [], true);
                Core.Validation.RuntimeValidator.validateParameter("index", index, Core.NUMBER, true, false);
                this.invokeOnItemAdded(item, index);
                super.splice(index, 0, item);
            }
            moveAt(oldIndex, newIndex) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("oldIndex", oldIndex, Core.NUMBER, true, false);
                Core.Validation.RuntimeValidator.validateParameter("newIndex", newIndex, Core.NUMBER, true, false);
                let item = this.removeAt(oldIndex);
                this.invokeOnItemMoved(item, oldIndex, newIndex);
                this.insert(item, newIndex);
            }
            move(item, newIndex) {
                //Runtime validation
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
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("index", index, Core.NUMBER, true, false);
                return super.splice(index, 1)[0];
            }
            //Removes an specific item from this collection
            remove(item) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("item", item, [], true);
                let itemIndex = this.indexOf(item);
                if (itemIndex == -1)
                    throw new Core.Exceptions.Exception("Could not remove item because it is not contained within this" +
                        " <type>GenericCollection</type>.");
                this.removeAt(itemIndex);
            }
            //Removes a set of specific items from this collection
            removeMultiple(...items) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("items", items, Array, true);
                items.forEach((item) => this.remove(item));
            }
            //Selects a value from each of the collection elements with the specified function
            select(selectFn, thisArg) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("selectFn", selectFn, Function, true);
                let result = new Array();
                this.forEach((item, i) => result.push(selectFn.call(thisArg, this[i])));
                return result;
            }
        }
        Collections.GenericCollection = GenericCollection;
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
        class GenericDictionary extends GenericCollection {
            constructor(...items) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateArrayParameter("items", items, KeyValuePair, false);
                //Initialization
                super(...items);
            }
            add(item) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("items", item, KeyValuePair, true, false);
                //Check for any other item with the same key before adding 
                let homonym = this.getValue(item.key);
                if (homonym !== null)
                    throw new Core.Exceptions.InvalidOperationException("Cannot add item. Another {0} with the same name has already" +
                        "been added.", null, Core.Exceptions.Exception.getMessageTag("type", "KeyValuePair"));
                super.add(item);
            }
            remove(item) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("items", item, KeyValuePair, true, false);
                super.remove(item);
            }
            getValue(key) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("key", key, Core.STRING, true, false);
                let matches = this.filter((keyValuePair) => Object.is(keyValuePair.key, key));
                if (matches.length == 0)
                    return null;
                return matches[0].value;
            }
        }
        Collections.GenericDictionary = GenericDictionary;
        class GenericTreeItem extends GenericCollection {
            constructor(value, ...items) {
                super(...items);
                this.value = value || null;
                this.parent = null;
            }
            add(treeItem) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("treeItem", treeItem, GenericTreeItem, true);
                //Make sure the tree item is correctly detached from its parent
                if (treeItem.parent != null)
                    treeItem.parent.remove(treeItem);
                treeItem.parent = this;
                super.add(treeItem);
            }
            remove(treeItem) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("treeItem", treeItem, GenericTreeItem, true);
                treeItem.parent = null;
                super.remove(treeItem);
            }
            selectRecursive(selectFn, thisArg) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("selectFn", selectFn, Function, true);
                let result = this.select(selectFn, thisArg);
                //Next recursion level
                this.forEach((item) => {
                    result = result.concat(item.selectRecursive(selectFn, thisArg));
                });
                return result;
            }
            filterRecursive(testFn, thisArg) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("testFn", testFn, Function, true);
                let result = this.filter(testFn, thisArg);
                //Next recursion level
                this.forEach((item) => {
                    result = result.concat(item.filterRecursive(testFn, thisArg));
                });
                return result;
            }
            someRecursive(testFn, thisArg) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("testFn", testFn, Function, true);
                let result = this.some(testFn);
                //Next recursion level
                this.forEach((item) => { result = result || item.someRecursive(testFn, thisArg); });
                return result;
            }
            everyRecursive(testFn, thisArg) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("testFn", testFn, Function, true);
                let result = this.every(testFn);
                //Next recursion level
                this.forEach((item) => { result = result && item.everyRecursive(testFn, thisArg); });
                return result;
            }
            getByValue(value) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("value", value, [], true);
                return this.filter((item) => { return Object.is(value, item.value); });
            }
        }
        Collections.GenericTreeItem = GenericTreeItem;
    })(Collections = Core.Collections || (Core.Collections = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    class MethodGroup {
        constructor(target, defaultListener) {
            this.attachedListeners = new Core.Collections.GenericCollection();
            this.attachedHandlers = new Core.Collections.GenericCollection();
            //Runtime validation
            Core.Validation.RuntimeValidator.validateParameter("target", target, [], true);
            Core.Validation.RuntimeValidator.validateParameter("listener", defaultListener, [Function, MethodGroup]);
            //Initialization
            this.target = target;
            if (defaultListener)
                this.attach(defaultListener);
        }
        stopPropagation() {
            this.propagationStopped = true;
        }
        invoke(thisArg, ...params) {
            thisArg = thisArg || null;
            this.propagationStopped = false;
            //Invoke all attached listeners
            for (let i = 0; i < this.attachedListeners.length && !this.propagationStopped; i++)
                this.attachedListeners[i](thisArg, [this.target, ...params]);
            //Invoke all attached handlers
            for (let i = 0; i < this.attachedHandlers.length && !this.propagationStopped; i++)
                this.attachedHandlers[i].invoke.apply(thisArg, [this.target, ...params]);
        }
        attach(listener) {
            //Runtime validation
            Core.Validation.RuntimeValidator.validateParameter("listener", listener, [Function, MethodGroup], true);
            if (listener instanceof MethodGroup)
                this.attachedHandlers.add(listener);
            else
                this.attachedListeners.add(listener);
        }
        detach(listener) {
            //Runtime validation
            Core.Validation.RuntimeValidator.validateParameter("listener", listener, [Function, MethodGroup], true);
            if (listener instanceof MethodGroup)
                this.attachedHandlers.remove(listener);
            else
                this.attachedListeners.remove(listener);
        }
    }
    Core.MethodGroup = MethodGroup;
})(Core || (Core = {}));
var Core;
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
                function ajaxLoaded(src, innerReq, reqInfo) {
                    api._applyAPI(innerReq.responseText);
                }
                ajax.loadedEvent.attach(ajaxLoaded);
                function ajaxError(src, innerReq, reqInfo) {
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
var Core;
(function (Core) {
    var Web;
    (function (Web) {
        Web.METHOD_GET = 'GET';
        Web.METHOD_HEAD = 'HEAD';
        Web.METHOD_POST = 'POST';
        Web.METHOD_PUT = 'PUT';
        Web.METHOD_DELETE = 'DELETE';
        Web.METHOD_CONNECT = 'CONNECT';
        Web.METHOD_OPTIONS = 'OPTIONS';
        Web.METHOD_TRACE = 'TRACE';
        Web.METHOD_PATCH = 'PATCH';
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
                        this.doneEvent.invoke();
                        if (xhr.status == Web.STATUS_OK)
                            this.loadedEvent.invoke();
                        else {
                            this.errorEvent.invoke();
                        }
                        break;
                    case XMLHttpRequest.HEADERS_RECEIVED:
                        this.headersReceivedEvent.invoke();
                        break;
                    case XMLHttpRequest.LOADING:
                        this.loadingEvent.invoke();
                        break;
                    case XMLHttpRequest.OPENED:
                        this.openedEvent.invoke();
                        break;
                    case XMLHttpRequest.UNSENT:
                        this.unsentEvent.invoke();
                        break;
                }
            }
            _requestProgress(event) {
                let loaded = event.loaded, total = event.total, progressPercentage = loaded / total;
                this.progressEvent.invoke(loaded, total, progressPercentage);
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
            invoke(thisArg) {
                super.invoke(null, this.target.baseRequest, this.target.info);
            }
        }
        Events.AjaxEvent = AjaxEvent;
    })(Events = Core.Events || (Core.Events = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Events;
    (function (Events) {
        class ProgressEvent extends Core.MethodGroup {
            constructor(target, defaultListener) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("target", target, [Function, Core.Web.AjaxRequest], true);
                super(target);
            }
            attach(listener) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("listener", listener, [Function, ProgressEvent]);
                super.attach(listener);
            }
            detach(listener) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("listener", listener, [Function, ProgressEvent]);
                super.detach(listener);
            }
            invoke(done, total, thisArg) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("done", done, Core.NUMBER, true, false);
                Core.Validation.RuntimeValidator.validateParameter("total", total, Core.NUMBER, true, false);
                let percentage = done / total * 100;
                super.invoke(null, done, total, percentage);
            }
        }
        Events.ProgressEvent = ProgressEvent;
        class PropertyChangedEvent extends Core.MethodGroup {
            constructor(target, defaultListener) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("target", target, [Function, Core.Web.AjaxRequest], true);
                super(target);
            }
            attach(listener) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("listener", listener, [Function, PropertyChangedEvent]);
                super.attach(listener);
            }
            detach(listener) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("listener", listener, [Function, PropertyChangedEvent]);
                super.detach(listener);
            }
            invoke(propertyName, oldValue, newValue, thisArg) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("propertyName", propertyName, Core.STRING, true, false);
                Core.Validation.RuntimeValidator.validateParameter("oldValue", oldValue, [], true);
                Core.Validation.RuntimeValidator.validateParameter("newValue", newValue, [], true);
                super.invoke(null, this.target.baseRequest, this.target.info);
            }
        }
        Events.PropertyChangedEvent = PropertyChangedEvent;
    })(Events = Core.Events || (Core.Events = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    let AnimationTimeStampUnit;
    (function (AnimationTimeStampUnit) {
        AnimationTimeStampUnit[AnimationTimeStampUnit["Seconds"] = 0] = "Seconds";
        AnimationTimeStampUnit[AnimationTimeStampUnit["Milliseconds"] = 1] = "Milliseconds";
        AnimationTimeStampUnit[AnimationTimeStampUnit["Percent"] = 2] = "Percent";
    })(AnimationTimeStampUnit || (AnimationTimeStampUnit = {}));
    class AnimationTimeStamp {
        static getUnitFromString(unitStr) {
            switch (unitStr) {
                case "s":
                    return AnimationTimeStampUnit.Seconds;
                case "ms":
                    return AnimationTimeStampUnit.Milliseconds;
                case "%":
                    return AnimationTimeStampUnit.Percent;
            }
            return null;
        }
        static fromString(timeStampStr) {
            //Runtime validation
            Core.Validation.RuntimeValidator.validateParameter("timeStampStr", timeStampStr, Core.STRING, true, false);
            let amountLastIndex = Core.StringUtils.lastIndexOfAny(timeStampStr, Core.StringUtils.toCharRange("[0-9]"));
        }
        constructor(value, unit) {
            //Runtime validation
            Core.Validation.RuntimeValidator.validateParameter('value', value, Core.NUMBER, true, false);
            this.value = value;
            this.unit = unit;
        }
    }
    class AnimationAction {
    }
    class AnimationActionCollection extends Core.Collections.GenericCollection {
        add(action) {
            Core.Validation.RuntimeValidator.validateParameter("action", action, AnimationAction, true, false);
            super.add(action);
        }
        insert(action, index) {
            Core.Validation.RuntimeValidator.validateParameter("action", action, AnimationAction, true, false);
            Core.Validation.RuntimeValidator.validateParameter("index", index, Core.NUMBER, true, false);
            super.insert(action, index);
        }
        removeAt(index) {
            Core.Validation.RuntimeValidator.validateParameter("index", index, Core.NUMBER, true, false);
            return super.removeAt(index);
        }
        remove(action) {
            Core.Validation.RuntimeValidator.validateParameter("action", action, AnimationAction, true, false);
            super.remove(action);
        }
    }
    class AnimationStoryboard {
        constructor(...actions) {
            this.actions = new AnimationActionCollection(actions);
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
var Core;
(function (Core) {
    var UserInterface;
    (function (UserInterface) {
        class AttributePropertyAssociator {
            constructor(target) {
                this._associations = new Core.Collections.GenericCollection();
                //Property changed event
                this.propertyChangedEvent = new Core.Events.PropertyChangedEvent(this);
                //Attribute changed event
                this.attributeChangedEvent = new Core.Events.PropertyChangedEvent(this);
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("target", target, Node, true, false);
                this.target = target;
                this.propertyChangedEvent.attach(this.onPropertyChanged);
                this.attributeChangedEvent.attach(this.onAttributeChanged);
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
            _onPropertyChanged(src, propertyName, oldValue, newValue) {
                let assocAttrName = this._getAssociatedAttributeName(propertyName);
            }
            //  Invokes the propertyChanged event
            onPropertyChanged(propertyName, oldValue, newValue) {
                this.propertyChangedEvent.invoke(propertyName, oldValue, newValue);
            }
            _onAttributeChanged(src, attributeName, oldValue, newValue) {
                let assocPropName = this._getAssociatedPropertyName(attributeName);
            }
            //  Invokes the attributeChanged event
            onAttributeChanged(propertyName, oldValue, newValue) {
                this.attributeChangedEvent.invoke(propertyName, oldValue, newValue);
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
            constructor(value, type) {
                type = type || ContentType.Text;
                this.type = type;
                this.value = value;
            }
        }
        UserInterface.Content = Content;
        let Primitives;
        (function (Primitives) {
            class ElementContainer extends HTMLElement {
                constructor(...elements) {
                    super();
                    this.storedPositions = new Core.Collections.GenericDictionary();
                    this.elements = new Core.Collections.GenericCollection(...elements);
                    this.elements.itemAddedEvent.attach((item, index) => this.insertElement(item, index));
                    this.elements.itemRemovedEvent.attach((item, index) => this.removeElement(item, index));
                    this.elements.itemMovedEvent.attach((item, oldIndex, newIndex) => this.moveElement(item, oldIndex, newIndex));
                    this.elements.itemChangedEvent.attach((oldItem, newItem, index) => this.changeElement(oldItem, newItem, index));
                }
                insertElement(item, index) {
                }
                removeElement(item, index) {
                }
                moveElement(item, oldIndex, newIndex) {
                }
                changeElement(oldItem, newItem, index) {
                }
            }
            Primitives.ElementContainer = ElementContainer;
            class ContentContainer extends HTMLElement {
                constructor(content) {
                    super();
                    this.content = content || new Content('');
                }
                //ContentElement.content property
                get content() {
                    return this._content;
                }
                set content(value) {
                    if (!(this.content instanceof Content))
                        throw new TypeError('Parameter "content" is not a valid Core.UserInterface.Content');
                    this._content = value;
                    this.update();
                }
                update() {
                    if (this.content.type == ContentType.Text)
                        this.innerText = this.content.value;
                    else if (this.content.type == ContentType.HTML)
                        this.innerHTML = this.content.value;
                }
            }
            Primitives.ContentContainer = ContentContainer;
            UserInterface.Utils.defineCustomElement('core-content', Content);
            class Label extends ContentContainer {
                //Sets the label text content with a format
                setText(text, ...params) {
                    //Set text, passing the parameters through to StringUtils
                    this.content = new Content(Core.StringUtils.format(text, ...params));
                }
            }
            Primitives.Label = Label;
            UserInterface.Utils.defineCustomElement('core-label', Label);
            //CoreLabelableContainer
            class LabelableContainer extends HTMLElement {
                constructor() {
                    super();
                    this.shadow = UserInterface.Utils.attachShadow(this);
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
            UserInterface.Utils.defineCustomElement('core-labelableContainer', LabelableContainer);
        })(Primitives = UserInterface.Primitives || (UserInterface.Primitives = {}));
    })(UserInterface = Core.UserInterface || (Core.UserInterface = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var UserInterface;
    (function (UserInterface) {
        var Icons;
        (function (Icons) {
            class Icon {
                constructor(name, x, y) {
                    this.parentCollection = null;
                    this._width = null;
                    this._height = null;
                    this.name = name;
                    this.x = x;
                    this.y = y;
                }
                //Property Icon.width
                get width() {
                    if (this._width != null || this.parentCollection == null)
                        return this._width;
                    return this.parentCollection.width;
                }
                //Property Icon.height
                get height() {
                    if (this._height != null || this.parentCollection == null)
                        return this._height;
                    return this.parentCollection.height;
                }
                //Property Icon.spriteSrc
                get spriteSrc() {
                    if (this.parentCollection == null)
                        return null;
                    return this.parentCollection.spriteSrc;
                }
            }
            Icons.Icon = Icon;
            class IconCollection extends Core.Collections.GenericCollection {
                constructor(name, spriteSrc, width, height, icons) {
                    super();
                    this.name = name;
                    this.spriteSrc = spriteSrc;
                    this.width = width;
                    this.height = height;
                    this.icons = icons;
                }
                add(item) {
                    item.parentCollection = this;
                    super.add(item);
                }
                addMultiple(...items) {
                    items.forEach((icon) => icon.parentCollection = this);
                    super.addMultiple(...items);
                }
                remove(item) {
                    item.parentCollection = null;
                    super.remove(item);
                }
                removeMultiple(...items) {
                    items.forEach((icon) => icon.parentCollection = null);
                    super.removeMultiple(...items);
                }
                getIconByName(name) {
                    return this.icons.filter((icon) => icon.name == name)[0] || null;
                }
            }
            Icons.IconCollection = IconCollection;
            class IconManager {
                static addCollection(iconCollection) {
                    let isNameAlreadyInUse = this.getCollectionByName(iconCollection.name) != null;
                    if (isNameAlreadyInUse)
                        throw new Error("Cannot add icon collection. Name is already in use.");
                    this.activeIconCollections.add(iconCollection);
                }
                static removeCollection(iconCollection) {
                    this.activeIconCollections.remove(iconCollection);
                }
                static getCollectionByName(name) {
                    return this.activeIconCollections.filter(function (iconCollection) {
                        return iconCollection.name == name;
                    })[0] || null;
                }
                static getIconByNames(collectionName, iconName) {
                    let iconCollection = this.getCollectionByName(collectionName);
                    if (iconCollection == null)
                        return null;
                    let icon = iconCollection.getIconByName(iconName);
                    return icon;
                }
            }
            IconManager.activeIconCollections = new Core.Collections.GenericCollection();
            Icons.IconManager = IconManager;
        })(Icons = UserInterface.Icons || (UserInterface.Icons = {}));
    })(UserInterface = Core.UserInterface || (Core.UserInterface = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var UserInterface;
    (function (UserInterface) {
        //Button
        class Button extends HTMLButtonElement {
            constructor(content = null, icon = null, value = null) {
                super();
                this.attributePropertyAssociator = new UserInterface.AttributePropertyAssociator(this);
                this._isDefault = false;
                Core.Validation.RuntimeValidator.validateParameter("content", content, UserInterface.Content);
                Core.Validation.RuntimeValidator.validateParameter("icon", icon, UserInterface.Icons.Icon);
                Core.Validation.RuntimeValidator.validateParameter("value", icon, String);
                this.createIconElement();
                this.createContentElement();
                this.content = content;
                this.icon = icon;
                this.value = value;
                this.isDefault = false;
            }
            createIconElement() {
                let iconElement = new UserInterface.IconElement();
                this.shadow.appendChild(iconElement);
                this.iconElement = iconElement;
            }
            createContentElement() {
                let contentElement = new UserInterface.Primitives.ContentContainer();
                this.shadow.appendChild(contentElement);
                this.contentElement = contentElement;
            }
            //Button.isDefault property
            get isDefault() {
                return this._isDefault;
            }
            set isDefault(value) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("value", value, Core.BOOL);
                UserInterface.Utils.setAttribute(this, "isDefault", value ? "isDefault" : null);
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
                this.contentElement.content = value;
            }
        }
        UserInterface.Button = Button;
        UserInterface.Utils.defineCustomElement("core-button", Button, "button");
        //CloseButton, based on IconElementButton
        class CloseButton extends Button {
            constructor() {
                super();
                this.addEventListener("focus", function () {
                    this.blur();
                });
                this.tabIndex = -1;
                this.icon = UserInterface.Icons.IconManager.getIconByNames("default", "close");
            }
        }
        UserInterface.CloseButton = CloseButton;
        UserInterface.Utils.defineCustomElement("core-closebutton", CloseButton, "button");
    })(UserInterface = Core.UserInterface || (Core.UserInterface = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var UserInterface;
    (function (UserInterface) {
        //CoreDataGrid
        class DataGrid extends HTMLElement {
            constructor() {
                super();
                this.shadow = UserInterface.Utils.attachShadow(this);
                this.createTableElement();
            }
            createTableElement() {
                let tableElement = new DataGridContent();
                this.shadow.appendChild(tableElement);
                //The table element
                this.tableElement = tableElement;
            }
            get head() { return this.tableElement.head; }
            get body() { return this.tableElement.body; }
        }
        UserInterface.DataGrid = DataGrid;
        UserInterface.Utils.defineCustomElement('core-dataGrid', DataGrid);
        //CoreDataGridTable
        class DataGridContent extends HTMLElement {
            constructor() {
                super();
                this.createHeadElement();
                this.createBodyElement();
            }
            createHeadElement() {
                let head = new DataGridSection();
                this.appendChild(this.head);
                this.head = head;
            }
            createBodyElement() {
                let body = new DataGridSection();
                this.appendChild(this.body);
                this.body = body;
            }
        }
        UserInterface.DataGridContent = DataGridContent;
        UserInterface.Utils.defineCustomElement('core-dataGridTable', DataGridContent);
        //CoreDataGridBody
        class DataGridSection extends UserInterface.Primitives.ElementContainer {
        }
        UserInterface.Utils.defineCustomElement('core-dataGridSection', DataGridSection);
        //CoreDataGridRow
        class DataGridRow extends UserInterface.Primitives.ElementContainer {
        }
        UserInterface.DataGridRow = DataGridRow;
        UserInterface.Utils.defineCustomElement('core-datagridrow', DataGridRow, 'tr');
        //CoreDataGridCell
        class DataGridCell extends UserInterface.Primitives.ElementContainer {
            constructor() {
                super();
            }
        }
        UserInterface.DataGridCell = DataGridCell;
        UserInterface.Utils.defineCustomElement('core-datagridcell', DataGridCell, 'td');
    })(UserInterface = Core.UserInterface || (Core.UserInterface = {}));
})(Core || (Core = {}));
//<reference path="Core.Collections.ts">
//<reference path="Core.UserInterface.ts"/>
//<reference path="Core.UserInterface.Primitives.ts"/>
var Core;
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
            UserInterface.Utils.defineCustomElement("core-formitem", FormItem);
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
                    Core.Validation.RuntimeValidator.validateArrayParameter("buttons", buttons, ButtonType, false);
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
            class ButtonBar extends HTMLElement {
                constructor(buttonType) {
                    super();
                    this.defaultButton = null;
                    //Runtime validation
                    Core.Validation.RuntimeValidator.validateParameter("buttonType", buttonType, ButtonType, false, false);
                    this.buttons = new Core.Collections.GenericCollection();
                }
                _getButtonsFromType(type) {
                    let result = new Array();
                    for (var i = 0; i < type.buttons.length; i++) {
                        let buttonOptions = type.buttons[i];
                        let buttonElement = new UserInterface.Button(buttonOptions.content, buttonOptions.icon, buttonOptions.value);
                        buttonElement.isDefault = type.defaultValue === buttonOptions.value;
                        result.push(buttonElement);
                    }
                    return result;
                }
            }
            Forms.ButtonBar = ButtonBar;
            UserInterface.Utils.defineCustomElement("core-dialogbuttonbar", ButtonBar);
        })(Forms = UserInterface.Forms || (UserInterface.Forms = {}));
    })(UserInterface = Core.UserInterface || (Core.UserInterface = {}));
})(Core || (Core = {}));
/// <reference path="Core.UserInterface.Forms.ts"/>
/// <reference path="Core.UserInterface.Primitives.ts"/>
/// <reference path="Core.UserInterface.Button.ts"/>
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
            UserInterface.Utils.defineCustomElement('core-dialogTitle', DialogTitle);
            //CoreDialogTitleBar
            class DialogTitleBar extends HTMLElement {
                constructor(title) {
                    super();
                    this.titleElement = new DialogTitle(title);
                    this.appendChild(this.titleElement);
                    this.closeButton = new UserInterface.CloseButton();
                    this.appendChild(this.closeButton);
                }
                get titleContent() {
                    return this.titleElement.content;
                }
                set titleContent(value) {
                    this.titleElement.content = value;
                }
            }
            Dialogs_1.DialogTitleBar = DialogTitleBar;
            UserInterface.Utils.defineCustomElement('core-dialogTitleBar', DialogTitleBar, 'section');
            //CoreDialogContent
            class DialogContent extends UserInterface.Primitives.ElementContainer {
            }
            Dialogs_1.DialogContent = DialogContent;
            UserInterface.Utils.defineCustomElement('core-dialogContent', DialogContent, 'section');
            //CoreDialogMessage
            class DialogMessage extends UserInterface.Primitives.ContentContainer {
            }
            Dialogs_1.DialogMessage = DialogMessage;
            UserInterface.Utils.defineCustomElement('core-dialogMessage', DialogMessage);
            //CoreDialog
            class Dialog extends HTMLDialogElement {
                constructor(title, contentElements, buttonType) {
                    super();
                    this.returnValue = null;
                    this.titleBar = new DialogTitleBar(title);
                    this.appendChild(this.titleBar);
                    this.content = new DialogContent(...contentElements);
                    this.appendChild(this.content);
                    this.buttonBar = new UserInterface.Forms.ButtonBar(buttonType);
                    this.appendChild(this.buttonBar);
                }
            }
            Dialogs_1.Dialog = Dialog;
            UserInterface.Utils.defineCustomElement('core-dialog', Dialog, 'dialog');
            //interface dialogs
            class Dialogs {
            }
            Dialogs_1.Dialogs = Dialogs;
        })(Dialogs = UserInterface.Dialogs || (UserInterface.Dialogs = {}));
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
                this.shadow = UserInterface.Utils.attachShadow(this);
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
//<reference path="Core.Events.js"/>
var Core;
(function (Core) {
    var UserInterface;
    (function (UserInterface) {
        //CoreProgressBarFill
        class ProgressBar extends UserInterface.Primitives.LabelableContainer {
            constructor() {
                super();
                this.progressEvent = new Core.Events.ProgressEvent(this);
                this.min = 0;
                this.max = 1;
                this.value = 0;
                this.indeterminate = true;
                this.labelFormat = 'LOADING {2}%';
                this.fillElement = new ProgressBarFill();
                this.shadow.appendChild(this.fillElement);
                this.updateVisuals();
            }
            onProgress(src, done, total, progress) {
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
                this.updateVisuals();
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
                this.updateVisuals();
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
                this.updateVisuals();
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
                this.updateVisuals();
            }
            get max() {
                return this._max;
            }
            updateVisuals() {
                if (this.indeterminate)
                    this.fillElement.setAttribute('indeterminate', '');
                else {
                    //Get the equivalent percentage of value
                    let done = this._value - this._min, total = this._max - this._min, percent = done / total * 100;
                    //Update fill width
                    this.fillElement.style.width = percent + '%';
                    this.removeAttribute('indeterminate');
                    //Update label
                    this.setLabelText(this._labelFormat, done, total, percent);
                }
            }
        }
        UserInterface.ProgressBar = ProgressBar;
        customElements.define('core-progressbar', ProgressBar);
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
        const UNDEF = "undefined";
        class Utils {
            static defineCustomElement(name, constructor, _extends) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("name", name, Core.STRING, true, false);
                Core.Validation.RuntimeValidator.validateParameter("constructor", constructor, Function, true, false);
                Core.Validation.RuntimeValidator.validateParameter("_extends", _extends, Core.STRING, true, false);
                customElements.define(name, constructor, { extends: _extends });
            }
            static attachShadow(elem, closed) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("elem", elem, HTMLElement, true, false);
                Core.Validation.RuntimeValidator.validateParameter("closed", closed, Core.BOOL, false);
                return elem.attachShadow({ mode: closed === false ? "open" : "closed" });
            }
            static setAttribute(elem, name, value) {
                //Runtime validation
                Core.Validation.RuntimeValidator.validateParameter("elem", elem, HTMLElement, true, false);
                Core.Validation.RuntimeValidator.validateParameter("name", name, Core.STRING, true, false);
                Core.Validation.RuntimeValidator.validateParameter("value", value, Core.STRING, true);
                if (value === null)
                    elem.removeAttribute(name);
                else
                    elem.setAttribute(name, value);
            }
        }
        UserInterface.Utils = Utils;
    })(UserInterface = Core.UserInterface || (Core.UserInterface = {}));
})(Core || (Core = {}));
