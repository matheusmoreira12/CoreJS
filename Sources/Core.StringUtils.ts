///<reference path="Core.ts"/>
///<reference path="Core.Validation.ts"/>

namespace Core {

    export class SearchMatch {
        constructor(value: string, startIndex: number) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("value", value, STRING, true, false);
            Validation.RuntimeValidator.validateParameter("startIndex", startIndex, NUMBER, true, false);

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
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("input", input, STRING);
            Validation.RuntimeValidator.validateParameter("regexp", regexp, RegExp);

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

        static searchString(input: string, regexp: RegExp): SearchMatchList {
            let matches = SearchMatchList._getMatches(input, regexp);
            return new SearchMatchList(...matches);
        }

        constructor(...matches: SearchMatch[]) {

            //Initialization
            super(...matches);
        }

        input: string;
    }
    
    export class StringUtils {
        // This encoding function is from Philippe Tenenhaus's example at http://www.philten.com/us-xmlhttprequest-image/
        static encodeBase64(inputStr : string) 
        {
            let b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            let outputStr = "";
            let i = 0;
            
            while (i < inputStr.length)
            {
                //all three "& 0xff" added below are there to fix a known bug 
                //with bytes returned by xhr.responseText
                let byte1 = inputStr.charCodeAt(i++) & 0xff;
                let byte2 = inputStr.charCodeAt(i++) & 0xff;
                let byte3 = inputStr.charCodeAt(i++) & 0xff;
        
                let enc1 = byte1 >> 2;
                let enc2 = ((byte1 & 3) << 4) | (byte2 >> 4);
                
                let enc3, enc4;
                if (isNaN(byte2))
                {
                    enc3 = enc4 = 64;
                }
                else
                {
                    enc3 = ((byte2 & 15) << 2) | (byte3 >> 6);
                    if (isNaN(byte3))
                    {
                        enc4 = 64;
                    }
                    else
                    {
                        enc4 = byte3 & 63;
                    }
                }
        
                outputStr += b64.charAt(enc1) + b64.charAt(enc2) + b64.charAt(enc3) + b64.charAt(enc4);
            } 
            
            return outputStr;
        }

        static isValidIdentifier(str : string) {
            return /^[a-zA-Z_]\w*$/.test(str);
        }

        static capitalize(str : string) {
            return str.replace(/(?:^|s)S/g, (match) => match.toUpperCase());
        }
        
        static toCamelCase(str : string) {
            return str.replace(/^\w|[\s-]\w/g, (match, index) => {
                match = match.replace(/[\s-]/, "");
                return index == 0 ? match.toLowerCase() : match.toUpperCase();
            });
        }
        
        static fromCamelCase(str) {
            return str.replace(/^[a-z]|[A-Z]/g, (match, index) => (index > 0 ? " " : "") + match.toUpperCase());
        }

        static splice(str : string, start : number, delCount : number, newSubStr : string) {
            if (start < 0 || start >= str.length)
                throw new RangeError('The value for parameter "start" was outside the string bounds.');
            if (delCount < 0 || (start + delCount) >= str.length)
                throw new RangeError('The value for parameter "delCount" was outside the string bounds.');
            
            return str.slice(0, start) + newSubStr + str.slice(start + delCount);
        }

        //Formats the provided test, replacing the parameter indexes by their respective values
        static format(text : string, ...params : any[])
        {
            //get params from arguments
            params = Array.prototype.slice.apply(arguments).slice(1);

            return text.replace(/{\d+}/g, (match: string): string => {
                let paramIndex: number = Number(match.substring(1, match.length - 2));
                return String(params[paramIndex]);
            });
        }

        //Returns a SearchMatchList containing all the matches for the desired RegExp.
        static searchRegExp(str: string, regexp: RegExp): SearchMatchList {
            return SearchMatchList.searchString(str, regexp);
        }

        //Converts an array of single-character-long strings to string
        static fromCharArray(arr: string[]) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("arr", arr, Array, true, false);

            return arr.join("");
        }

        //Converts a string to an array of single-character-long strings
        static toCharArray(str: string) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("str", str, STRING, true, false);

            return Array.prototype.splice.apply(str);
        }

        //Gets the char range between two characters
        static getCharRange(startChar: string, endChar: string): string[] {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("startChar", startChar, STRING, true, false);
            Validation.RuntimeValidator.validateParameter("endChar", endChar, STRING, true, false);
            if (startChar.length != 1)
                throw new Exceptions.InvalidParameterException("startChar", "Invalid value for parameter %0. Expected" +
                    " a single character string.");
            if (endChar.length != 1)
                throw new Exceptions.InvalidParameterException("endChar", "Invalid value for parameter %0. Expected" +
                    " a single character string.");

            let result: string[] = [];

            for (let code = startChar.charCodeAt(0); code <= endChar.charCodeAt(0); code++)
                result.push(String.fromCharCode(code));

            return result;
        }

        //Gets the char range denoted by a RegEx-like [] notation
        static toCharRange(representation: string): string[] {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("representation", representation, STRING, true, false);

            representation = representation.replace(/.\-./g, (match: string) =>
                this.getCharRange(match[0], match[match.length - 1]).join(""));

            return this.toCharArray(representation);
        }

        //Returns the index of any of the specified strings, from the specified start position
        static indexOfAny(str: string, searchStrings: string[], position: number = 0): number {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("str", str, STRING, true, false);
            Validation.RuntimeValidator.validateParameter("searchStrings", searchStrings, Array, true, false);
            Validation.RuntimeValidator.validateParameter("position", position, NUMBER);

            for (let i = 0; i < searchStrings.length; i++) {
                let matchIndex = str.indexOf(searchStrings[i], position)
                if (matchIndex >= 0)
                    return matchIndex;
            }

            return -1;
        }

        //Returns the index of any of the specified strings, from the specified start position
        static lastIndexOfAny(str: string, searchStrings: string[], position: number = 0): number {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("str", str, STRING, true, false);
            Validation.RuntimeValidator.validateParameter("searchStrings", searchStrings, Array, true, false);
            Validation.RuntimeValidator.validateParameter("position", position, NUMBER);

            for (let i = 0; i < searchStrings.length; i++) {
                let matchIndex = str.lastIndexOf(searchStrings[i], position)
                if (matchIndex >= 0)
                    return matchIndex;
            }

            return -1;
        }
    }
}
