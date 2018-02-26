Core.TypeChecking = new function() {
    var STRING = "string",
        UNDEF = "undefined",
        NUMBER = "number",
        OBJECT = "object",
        BOOL = "boolean",
        FUNCTION = "function";

    this.isString = function (obj)
    {
        return typeof obj == STRING;
    }
    this.isUndefined = function (obj)
    {
        return typeof obj == UNDEF;
    }
    this.isNumber = function (obj)
    {
        return typeof obj == NUMBER;
    }
    this.isObject = function (obj)
    {
        return typeof obj == OBJECT;
    }
    this.isArray = function (obj)
    {
        return (obj instanceof Array) ||
            !!Array.isArray && Array.isArray(obj);
    }
    this.isBoolean = function (obj)
    {
        return typeof obj == BOOL;
    }
    this.isFunction = function (obj)
    {
        return typeof obj == FUNCTION;
    }

}