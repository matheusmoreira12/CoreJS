Core.ObjectManipulation = new function() {
    
    this.inherit = function (prototype)
    {
        var obj = Object.create(prototype);

        //create and populate base prototype object
        obj._base = {}

        for (n in prototype)
            if (prototype.hasOwnProperty(n))
                obj._base[n] = prototype[n];

        return obj;
    }

    this.release = function (obj) {
        for (n in obj)
            delete obj[n];
        
        if (typeof obj.releasedCallback != UNDEF)
            obj.releasedCallback.call(this);
    };

    //extends an object
    this.extend = function (obj, src) {
        var result = Object.create(obj);
        
        for (var key in src)
            if (Core.TypeChecking.isUndefined(obj[key])) obj[key] = src[key];

        return obj;
    }
    //taps into object function properties and changes their functionality
    this.tapIntoObjectFunction = function (obj, propName, oldPrefix, newPrefix, callback)
    {
        //read from <obj[[prototype]]>
        var proto = Object.getPrototypeOf(obj);

        //change <string> <"example"> to <"example0">
        var newPropName = newPrefix + propName + "0";

        //check for number, replacing it with the next number in the sequence until there's no property named
        //with <newPropName>'s value
        while (!Core.TypeChecking.isUndefined(proto[newPrefix + newPropName]))
            newPropName = newPropName.replace(/[0-9]+/, function (match) {
                return match * 1 + 1;
            });

        //set "new" property
        proto[newPropName] = callback;

        delete newPropName;

        //get "old" name
        var oldPropName = oldPrefix + propName;

        //if "old" property does not exist yet
        if (Core.TypeChecking.isUndefined(proto[oldPropName]))
        {
            //assign "old" property
            proto[oldPropName] = proto[propName];

            function intCallback(args)
            {
                //call "original" function and get returned value
                var result = proto[oldPropName].apply(this, arguments);

                //iterate through <obj>'s properties
                for (prop in proto)
                    //if property is a function and is a "new" property
                    if (Core.TypeChecking.isFunction(proto[prop]) && prop.indexOf(newPrefix + propName) >= 0)
                    {
                        //call property by name and get returned value
                        var retValue = proto[prop].apply(this, arguments) || null;

                        //check if <retValue> is not null
                        if (retValue !== null)
                            return retValue;
                    }

                return result;
            }

            //finally, replace the "original" property with the internal callback
            proto[propName] = intCallback;
        }

        //transfer changes to <obj[[prototype]]>
        Object.setPrototypeOf(obj, proto);
    }

    //Reflects the specified property
    this.reflectProperty = function (obj, reflectedObj, propName, setCallback, getCallback)
    {
        Object.defineProperty(obj, propName, {
            get: function () {
                if (Core.TypeChecking.isFunction(getCallback))
                    getCallback(reflectedObj, propName);

                return reflectedObj[propName];
            },
            set: function (value) {
                if (Core.TypeChecking.isFunction(setCallback))
                    setCallback(reflectedObj, propName, value);

                reflectedObj[propName] = value;
            }
        });
    }

    //Reflects all the specified properties
    this.reflectProperties = function (obj, reflectedObj, propNames, setCallback, getCallback) {
        for (var i = 0; i < propNames.length; i++)
            this.reflectProperty(obj, reflectedObj, propNames[i], setCallback, getCallback)
    }

    //Reflects all the object's owned properties
    this.reflectOwnProperties = function (obj, reflectedObj, setCallback, getCallback)
    {
        this.reflectProperties(obj, reflectedObj, Object.getOwnPropertyNames(reflectedObj), setCallback, getCallback)
    }
}

