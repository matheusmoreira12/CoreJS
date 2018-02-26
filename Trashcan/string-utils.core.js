//string manipulator - offers some advanced string manipulation capabilities
Core.StringUtils = new (function() {

    var stringUtils = this; 

    // This encoding function is from Philippe Tenenhaus's example at http://www.philten.com/us-xmlhttprequest-image/
    this.encodeBase64 = function(inputStr) 
    {
        var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var outputStr = "";
        var i = 0;
        
        while (i < inputStr.length)
        {
            //all three "& 0xff" added below are there to fix a known bug 
            //with bytes returned by xhr.responseText
            var byte1 = inputStr.charCodeAt(i++) & 0xff;
            var byte2 = inputStr.charCodeAt(i++) & 0xff;
            var byte3 = inputStr.charCodeAt(i++) & 0xff;
    
            var enc1 = byte1 >> 2;
            var enc2 = ((byte1 & 3) << 4) | (byte2 >> 4);
            
            var enc3, enc4;
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

    this.isValidIdentifier = function(str) {
        const VALID_IDENTIFIER_PATTERN = /^[a-zA-Z_]\w*$/;

        return VALID_IDENTIFIER_PATTERN.test(str);
    }

    this.capitalize = function (str) {
        return str.replace(/(?:^|s)S/g, function(a) { return a.toUpperCase(); });
    }
    this.toCamelCase = function(str) {
        return str.replace(/^\w|[\s-]\w/g, function(match, index) {
            match = match.replace(/[\s-]/, "");
            return index == 0 ? match.toLowerCase() : match.toUpperCase();
        });
    }
    this.ToCamelCase = function(str) {
        Core.stringMan.toCamelCase(str);
    }
    this.fromCamelCase = function(str) {
        return str.replace(/^[a-z]|[A-Z]/g, function(match, index) {
            return (index > 0 ? " " : "") + match.toUpperCase();
        });
    }
    this.removeQuotes = function(str)
    {
        return str.replace("\"", "\\\"");
    }
    this.getBinderPropertyName = function (attrVal)
    {
        if (/{{[\w.]*}}/g.test(attrVal))
            return attrVal.replace(/{{|}}/g, "");
        return null;
    }
    this.splice = function(str, start, delCount, newSubStr) {
            return str.slice(0, start) + newSubStr + str.slice(start + Math.abs(delCount));
    }
    this.Succession = function (origStr, separator)
    {
        var _succession = this;

        this.originalString = origStr;
        this.separator = separator || "";
        this.addedStrings = [];

        this.add = function (str)
        {
            _succession.addedStrings.push(str);
        }
        this.remove = function ()
        {
            var arr = _succession.addedStrings;
            _succession.addedStrings = arr.slice(0, arr.length - 1);
        }
        this.clear = function ()
        {
            _succession.addedStrings = [];
        }
        this.generate = function ()
        {
            var result,
                str = result = _succession.originalString;
                addedStrs = _succession.addedStrings;

            for (var i = 0, l = addedStrs.length; i < l; i++)
            {
                str += addedStrs[i];
                result += _succession.separator + str;
            }
            return result;
        }
    }
    //include parameters in string, preceded by %
    this.includeParams = function(text, params)
    {
        //get params from arguments
        params = Array.prototype.slice.apply(arguments).slice(1);
        
        return text.replace(/%[0-9]+|%%/g, function(match) {
            var index = match.replace("%", "") * 1 - 1;
            if (match == "%%") return "%"; else return String(params[index]);
        });
    }
});
