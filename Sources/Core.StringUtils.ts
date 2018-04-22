namespace Core {

    export class StringScannerBranchList extends Collections.Generic.List<StringScannerBranch> {

    }

    namespace StringScannerBranchSymbols {
        export const index = Symbol.for("index");
        export const startIndex = Symbol.for("startIndex");
        export const parentBranch = Symbol.for("parentBranch");
    }

    export class StringScannerBranch {
        public constructor(parentBranch: StringScannerBranch, startIndex: number) {
            this[StringScannerBranchSymbols.parentBranch] = parentBranch;
            this[StringScannerBranchSymbols.index] = startIndex;
            this[StringScannerBranchSymbols.startIndex] = startIndex;
        }

        /**Gets a string representing the current character.*/
        public get currentChar(): string {
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
        public getPartialString(trimStart: number, trimEnd: number) {
            return this.content.substring(trimStart + this.startIndex, trimEnd + this.index);
        }

        /**Gets the partial string from the start position up to, but not including, the current index.*/
        public get partialString(): string {
            return this.content.substring(this.startIndex, this.index);
        }

        /**Gets the content being scanned, by reflecting the content of the parent branch.*/
        public get content(): string {
            if (this.parentBranch === null)
                throw new Exceptions.InvalidOperationException("Cannot get content. No parent branch was found to" +
                    " reflect the content from.");

            return this.parentBranch.content;
        }

        /**Creates a sub-branch from this branch. */
        public derive(): StringScannerBranch {
            return new StringScannerBranch(this, this.index);
        }

        /**Writes the current index to the parent branch. */
        public update(): void {
            if (this.parentBranch === null)
                throw new Exceptions.InvalidOperationException("Cannot update. This branch has no parent branch" +
                    " to update to.");

            this.parentBranch[StringScannerBranchSymbols.index] = this.index;
        }

        /**Gets the current zero-based position inside the content.*/
        public get index(): number {
            return this[StringScannerBranchSymbols.index];
        }

        /**Gets the relative recursion from the start index to the current index. */
        public get count(): number {
            return this.index - this.startIndex;
        }

        /**Gets length of the content being scanned. */
        public get length(): number {
            return this.content.length;
        }

        /**Gets the current zero-based position inside the content.*/
        public get startIndex(): number {
            return this[StringScannerBranchSymbols.startIndex];
        }

        /**Gets the parent branch this commits to, or null if this is the main branch.*/
        public get parentBranch(): StringScannerBranch {
            return this[StringScannerBranchSymbols.parentBranch];
        }

        /**Advances the current index by the specified amount.
         * @param steps
         */
        public advance(steps: number = 1): void {
            this[StringScannerBranchSymbols.index] += steps;
        }

        /**
         * Jumps the current index to the spcified index.
         * @param index
         */
        public jump(index: number): void {
            this[StringScannerBranchSymbols.index] = index;
        }

        /**Resets the current index to the start index. */
        public reset(): void {
            this[StringScannerBranchSymbols.index] = this.startIndex;
        }
    }

    namespace StringScannerSymbols {
        export const content = Symbol.for("content");
    }

    export class StringScanner extends StringScannerBranch {
        /**Gets the content being scanned*/
        public get content(): string {
            return this[StringScannerSymbols.content];
        }

        /**
         * Creates a new instance of the StringScanner class.
         * @param content The content being scanned.
         * @param startIndex The zero-based position at which to start scanning.
         */
        public constructor(content: string, startIndex: number = 0) {
            super(null, startIndex);

            this[StringScannerSymbols.content] = content;
        }
    }

    export class SearchMatch {
        constructor(value: string, startIndex: number) {
            this.value = value;
            this.startIndex = startIndex;
            this.endIndex = startIndex + value.length;
            this.count = value.length;
        }

        value: string;
        startIndex: number;
        endIndex: number;
        count: number;
    }

    export class SearchMatchList extends Array<SearchMatch> {
        private static _getMatches(input: string, regexp: RegExp): SearchMatch[] {
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

        public static searchString(input: string, regexp: RegExp): SearchMatchList {
            let matches = SearchMatchList._getMatches(input, regexp);
            return new SearchMatchList(...matches);
        }

        constructor(...matches: SearchMatch[]) {

            //Initialization
            super(...matches);
        }

        input: string;
    }

    export namespace StringUtils {

        // This encoding function is from Philippe Tenenhaus's example at http://www.philten.com/us-xmlhttprequest-image/
        export function encodeBase64(inputStr: string) {
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

        export function isValidIdentifier(str: string) {
            return /^[a-zA-Z_]\w*$/.test(str);
        }

        export function capitalize(str: string) {
            return str.replace(/(?:^|s)S/g, (match) => match.toUpperCase());
        }

        export function toCamelCase(str: string) {
            return str.replace(/^\w|[\s-]\w/g, (match, index) => {
                match = match.replace(/[\s-]/, "");
                return index == 0 ? match.toLowerCase() : match.toUpperCase();
            });
        }

        export function fromCamelCase(str) {
            return str.replace(/^[a-z]|[A-Z]/g, (match, index) => (index > 0 ? " " : "") + match.toUpperCase());
        }

        export function splice(str: string, start: number, delCount: number, newSubStr: string) {
            if (start < 0 || start >= str.length)
                throw new Exceptions.ArgumentOutOfRangeException("start");
            if (delCount < 0 || (start + delCount) >= str.length)
                throw new Exceptions.ArgumentOutOfRangeException("delCount");

            return str.slice(0, start) + newSubStr + str.slice(start + delCount);
        }

        //Formats the provided test, replacing the parameter indexes by their respective values
        export function format(text: string, ...params: any[]) {
            return text.replace(/{\d+}/g, (match: string): string => {
                let paramIndexStr: string = match.replace(/^{|}$/g, "");

                return String(params[paramIndexStr]);
            });
        }

        //Returns a SearchMatchList containing all the matches for the desired RegExp.
        export function searchRegExp(str: string, regexp: RegExp): SearchMatchList {
            return SearchMatchList.searchString(str, regexp);
        }

        //Gets the char range between two characters
        export function getCharRange(startChar: string, endChar: string): string[] {
            let result: string[] = [];

            for (let code = startChar.charCodeAt(0); code <= endChar.charCodeAt(0); code++)
                result.push(String.fromCharCode(code));

            return result;
        }

        /**
         * Gets the char range denoted by a RegEx-like [] notation.
         * @param representation
         */
        export function toCharRange(representation: string): string[] {
            const CHAR_RANGE_MARK: string = "-";
            const ESCAPE_SEQUENCE_MARK: string = "\\";
            const ESCAPE_SEQUENCE_UNICODE_MARK: string = "u";

            let outCharArr: string[] = [];

            function readUnicodeEscapeSequence(branch: StringScannerBranch): string {
                const UNICODE_CODE_LENGTH: number = 4;

                let codeIsRightLength = s => s.length >= UNICODE_CODE_LENGTH;
                let codeFromHex = s => Number.parseInt(s, 16);
                let charFromCode = n => String.fromCharCode(n);

                if (branch.currentChar === ESCAPE_SEQUENCE_UNICODE_MARK) {
                    branch.advance();
                    let unicodeEscapeSequenceBranch: StringScannerBranch = branch.derive();

                    unicodeEscapeSequenceBranch.advance(4);

                    let unicodeCodeHex: string = unicodeEscapeSequenceBranch.partialString;

                    if (codeIsRightLength(unicodeCodeHex))
                        throw new Exceptions.FormatException(`Expected a code point length of ${UNICODE_CODE_LENGTH}, but found ${unicodeCodeHex.length} instead.`)

                    let unicodeCode: number = codeFromHex(unicodeCodeHex);

                    if (isNaN(unicodeCode))
                        throw new Exceptions.FormatException(`Unexpected token "${unicodeCodeHex}". An hexadecimal code was expected.`);

                    unicodeEscapeSequenceBranch.update();
                    return charFromCode(unicodeCode);
                }

                return null;
            }

            function readEscapeSequence(branch: StringScannerBranch): string {
                if (branch.currentChar === ESCAPE_SEQUENCE_MARK) {
                    let escapeSequenceBranch: StringScannerBranch = branch.derive();
                    escapeSequenceBranch.advance();

                    let unicodeChar: string = null;

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

            function readChar(branch: StringScannerBranch): string {
                let char: string = null;

                if ((char = readEscapeSequence(branch)) !== null)
                    return char;
                else {
                    char = branch.currentChar;
                    branch.advance();

                    return char;
                }
            }

            function readCharRange(branch: StringScannerBranch): { start: string, end: string } {
                let charRangeBranch = branch.derive();

                let startChar = readChar(charRangeBranch);

                if (charRangeBranch.currentChar === CHAR_RANGE_MARK) {
                    charRangeBranch.advance();

                    let endChar = readChar(charRangeBranch);

                    if (endChar === null)
                        throw new Exceptions.FormatException("Unexpected end of the string.");

                    charRangeBranch.update();

                    return { start: startChar, end: endChar };
                }

                return null;
            }

            function readAll() {
                let scanner: StringScanner = new StringScanner(representation);

                let charRange = null,
                    char = null;

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

        //Returns the index of any of the specified strings, from the specified start position
        export function indexOfAny(str: string, searchStrings: string[], position: number = 0): number {
            for (let i = 0; i < searchStrings.length; i++) {
                let matchIndex = str.indexOf(searchStrings[i], position)
                if (matchIndex >= 0)
                    return matchIndex;
            }

            return -1;
        }

        //Returns the index of any of the specified strings, from the specified start position
        export function lastIndexOfAny(str: string, searchStrings: string[], position: number = 0): number {
            for (let i = 0; i < searchStrings.length; i++) {
                let matchIndex = str.lastIndexOf(searchStrings[i], position)
                if (matchIndex >= 0)
                    return matchIndex;
            }

            return -1;
        }

        export function matchString(str: string, regex: RegExp): string {
            let matches = str.match(regex);

            if (matches === null)
                return null;

            return matches.toString();
        }

        export function indexOfRegex(str: string, regex: RegExp, fromIndex: number): number {
            let subStr = str.substring(fromIndex),
                matches = subStr.match(regex);

            if (matches === null)
                return -1;

            return matches.index;
        }

        export function indexOfRegexOrDefault(str: string, regex: RegExp, fromIndex: number,
            defaultIndex: number): number {

            let index = indexOfRegex(str, regex, fromIndex);

            return index == -1 ? defaultIndex : index;
        }
    }
}
