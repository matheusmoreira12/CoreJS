//<reference path="Core.js"/>
//<reference path="Core.Exception.js"/>
var Core;
(function (Core) {
    class SearchMatch {
        constructor(value, startIndex) {
            //Run time validation
            if (typeof value !== Core.STRING)
                throw new Core.Exceptions.InvalidParameterTypeException("value", Core.STRING);
            if (typeof startIndex !== Core.NUMBER)
                throw new Core.Exceptions.InvalidParameterTypeException("startIndex", Core.NUMBER);
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
        static getMatches(input, regexp) {
            //Run time validation
            if (typeof input !== Core.STRING)
                throw new Core.Exceptions.InvalidParameterTypeException("value", Core.STRING);
            if (!(regexp instanceof RegExp))
                throw new Core.Exceptions.InvalidParameterTypeException("regexp", "RegExp");
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
            let matches = SearchMatchList.getMatches(input, regexp);
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
        static matchRegExp(str, regexp) {
            try {
                return new SearchMatchList(str, regexp);
            }
            catch (e) {
                throw e;
            }
        }
        //Converts an array of single-character-long strings to string
        static fromCharArray(arr) {
            //Run time validation
            if (!(arr instanceof Array))
                throw new Core.Exceptions.InvalidParameterTypeException("arr", Array);
            return arr.join("");
        }
        //Converts a string to an array of single-character-long strings
        static toCharArray(str) {
            //Run time validation
            if (typeof str !== Core.STRING)
                throw new Core.Exceptions.InvalidParameterTypeException("str", Core.STRING);
            return Array.prototype.splice.apply(str);
        }
        //Gets the char range between two characters
        static getCharRange(startChar, endChar) {
            //Run time validation
            if (typeof startChar !== Core.STRING)
                throw new Core.Exceptions.InvalidParameterTypeException("startChar", Core.STRING);
            if (startChar.length != 1)
                throw new Core.Exceptions.InvalidParameterException("startChar", "Invalid value for parameter %0. Expected" +
                    " a single character string.");
            if (typeof endChar !== Core.STRING)
                throw new Core.Exceptions.InvalidParameterTypeException("endChar", "string");
            if (endChar.length != 1)
                throw new Core.Exceptions.ParameterException("endChar", "Invalid value for parameter %0. Expected" +
                    " a single character string.");
            let result = [];
            for (let code = startChar.charCodeAt(0); code <= endChar.charCodeAt(0); code++)
                result.push(String.fromCharCode(code));
            return result;
        }
        //Gets the char range denoted by a RegEx-like [] notation
        static toCharRange(representation) {
            //Run time validation
            if (typeof representation !== Core.STRING)
                throw new Core.Exceptions.InvalidParameterTypeException("representation", Core.STRING);
            representation = representation.replace(/.\-./g, (match) => this.getCharRange(match[0], match[match.length - 1]).join(""));
            return this.toCharArray(representation);
        }
        //Returns the index of any of the specified strings, from the specified start position
        static indexOfAny(str, searchStrings, position) {
            //Run time validation
            if (typeof str !== Core.STRING)
                throw new Core.Exceptions.InvalidParameterTypeException("str", Core.STRING);
            if (typeof searchStrings !== Core.STRING && !(searchStrings instanceof Array))
                throw new Core.Exceptions.InvalidParameterTypeException("searchStrings", Array);
            if (position !== null && typeof position !== Core.UNDEF && typeof position !== Core.NUMBER)
                throw new Core.Exceptions.InvalidParameterTypeException("position", Core.NUMBER);
            for (let i = 0; i < searchStrings.length; i++) {
                let matchIndex = str.indexOf(searchStrings[i], position);
                if (matchIndex >= 0)
                    return matchIndex;
            }
            return -1;
        }
        //Returns the index of any of the specified strings, from the specified start position
        static lastIndexOfAny(str, searchStrings, position) {
            //Run time validation
            if (typeof str !== Core.STRING)
                throw new Core.Exceptions.InvalidParameterTypeException("str", Core.STRING);
            if (!(searchStrings instanceof Array))
                throw new Core.Exceptions.InvalidParameterTypeException("searchStrings", Array);
            if (position !== null && typeof position !== Core.UNDEF && typeof position !== Core.NUMBER)
                throw new Core.Exceptions.InvalidParameterTypeException("position", Core.NUMBER);
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
