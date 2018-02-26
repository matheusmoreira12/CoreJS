//polyfill for <Proxy> funcionality, trying to keep as tight to the W3C specs as possible
var ProxyPolyfill = function (target, handler)
{
    var _proxyPolyfill = this;

    this[0] = target;

    this.int_handler_getPrototypeOf = handler.getPrototypeOf;
    this.int_handler_setPrototypeOf = handler.setPrototypeOf;
    this.int_handler_isExtensible = handler.isExtensible;
    this.int_handler_preventExtensions = handler.preventExtensions;
    this.int_handler_getOwnPrototypeDescriptor = handler.getOwnPrototypeDescriptor;
    this.int_handler_defineProperty = handler.defineProperty;
    this.int_handler_has = handler.has;
    this.int_handler_get = handler.get;
    this.int_handler_set = handler.set;
    this.int_handler_deleteProperty = handler.deleteProperty;
    this.int_handler_ownKeys = handler.ownKeys;
    this.int_handler_apply = handler.apply;
    this.int_handler_construct = handler.construct;

    function Object_getPrototypeOf (obj) {
        if (obj.int_proxy_guid == _proxyPolyfill.int_proxy_guid && core.typeCheck.isFunction(_proxyPolyfill.int_handler_getPrototypeOf))
            return _proxyPolyfill.int_handler_getPrototypeOf(obj);

        return null;
    }
    function Object_setPrototypeOf (obj) {
        if (obj.int_proxy_guid == _proxyPolyfill.int_proxy_guid && core.typeCheck.isFunction(_proxyPolyfill.int_handler_setPrototypeOf))
            return _proxyPolyfill.int_handler_setPrototypeOf(obj);

        return null;
    }
    function Object_isExtensible (obj) {
        if (obj.int_proxy_guid == _proxyPolyfill.int_proxy_guid && core.typeCheck.isFunction(_proxyPolyfill.int_handler_isExtensible))
            return _proxyPolyfill.int_handler_isExtensible(obj);

        return null;
    }
    function Object_preventExtensions (obj) {
        if (obj.int_proxy_guid == _proxyPolyfill.int_proxy_guid && core.typeCheck.isFunction(_proxyPolyfill.int_handler_preventExtensions))
            return _proxyPolyfill.int_handler_preventExtensions(obj);

        return null;
    }
    function Object_getPrototypeOf (obj) {
        if (obj.int_proxy_guid == _proxyPolyfill.int_proxy_guid && core.typeCheck.isFunction(_proxyPolyfill.int_handler_getOwnPrototypeDescriptor))
            return _proxyPolyfill.int_handler_getOwnPrototypeDescriptor(obj);

        return null;
    }
    function Object_getOwnPropertyNames (obj) {
        if (obj.int_proxy_guid == _proxyPolyfill.int_proxy_guid && core.typeCheck.isFunction(_proxyPolyfill.int_handler_ownKeys))
            return _proxyPolyfill.int_handler_ownKeys(obj);

        return null;
    }
    function Object_defineProperty (obj, property, descriptor) {
        if (obj.int_proxy_guid == _proxyPolyfill.int_proxy_guid && core.typeCheck.isFunction(_proxyPolyfill.int_handler_defineProperty))
            return _proxyPolyfill.int_handler_defineProperty(obj, property, descriptor);

        return null;
    }
    function Object_deleteProperty (obj) {
        if (obj.int_proxy_guid == _proxyPolyfill.int_proxy_guid && core.typeCheck.isFunction(_proxyPolyfill.int_handler_deleteProperty))
            return _proxyPolyfill.int_handler_deleteProperty(obj);

        return null;
    }

    core.objectMan.tapIntoObjectFunction(Object, "getPrototypeOf", "old_", "new_", Object_getPrototypeOf);
    core.objectMan.tapIntoObjectFunction(Object, "getPrototypeOf", "old_", "new_", Object_setPrototypeOf);
    core.objectMan.tapIntoObjectFunction(Object, "isExtensible", "old_", "new_", Object_isExtensible);
    core.objectMan.tapIntoObjectFunction(Object, "preventExtensions", "old_", "new_", Object_preventExtensions);
    core.objectMan.tapIntoObjectFunction(Object, "getPrototypeOf", "old_", "new_", Object_getPrototypeOf);
    core.objectMan.tapIntoObjectFunction(Object, "getOwnPropertyNames", "old_", "new_", Object_getOwnPropertyNames);
    core.objectMan.tapIntoObjectFunction(Object, "defineProperty", "old_", "new_", Object_defineProperty);
    core.objectMan.tapIntoObjectFunction(Object, "deleteProperty", "old_", "new_", Object_deleteProperty);

    //guid for proxy target check
    this.int_target.int_proxy_guid = core.guid.generate();

    //get and set
    function getCallback(target, key)
    {
        if (core.typeCheck.isFunction(_proxyPolyfill.int_handler_get))
            _proxyPolyfill.int_handler_get(_proxyPolyfill[0], key, _proxyPolyfill);
    }

    function setCallback(target, key, value)
    {
        if (core.typeCheck.isFunction(_proxyPolyfill.int_handler_set))
            _proxyPolyfill.int_handler_set(_proxyPolyfill[0], key, value, _proxyPolyfill);
    }

    core.objectMan.mirrorObject(this, this[0], setCallback, getCallback);
}

window.Proxy = ProxyPolyfill;