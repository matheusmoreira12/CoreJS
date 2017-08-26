//polyfill for <setPrototypeOf>
if (!Object.setPrototypeOf)
{
    Object.setPrototypeOf = function (obj, proto)
    {
        obj.__proto__ = proto;
    }

    Object.getPrototypeOf = function (obj)
    {
        return obj.__proto__;
    }
}

//polyfills for Array
if (!Array.includes)
{
    //read <Array.prototype[[prototype]]>
    var proto = Object.getPrototypeOf(Array);

    //<Array.includes> polyfill
    if (!proto.includes)
        proto.includes = function (obj) { return this.indexOf(obj) >= 0; }

    //write all changes to <Array.prototype[[prototype]]>
    Object.setPrototypeOf(Array, proto);
}