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
