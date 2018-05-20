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
//# sourceMappingURL=Core.StringUtils.js.map