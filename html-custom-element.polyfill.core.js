//polyfill for <document.registerElement>, keeping as tight to the W3C specs as possible
//primitive to be used for registering elements
function HTMLCustomElement(tagName, flags)
{
    if (!tagName || !core.typeCheck.isObject(flags) || !flags.prototype === null || !core.typeCheck.isObject(flags.prototype))
        return;

    this.flags_prototype = flags.prototype;
    this.flags_extend = flags.extend;

    //define instance = <this[0]>
    if (!!flags.extend)
    {
        this[0] = document.createElement(String(this.flags_extend));
        this[0].setAttribute("is", tagName);
    }
    else
        this[0] = document.createElement(String(tagName));
        
    Object.setPrototypeOf(this[0], this.flags_prototype || HTMLElement.prototype);
    
    this[0][0] = this;
    
    return this[0];
}

//implementation of the real polyfill
document.registerElement = function (tagName, flags)
{
    return function () { return new HTMLCustomElement(tagName, flags) };
}