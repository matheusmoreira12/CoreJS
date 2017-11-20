//Core.Modules namespace
Core.Modules = new function () {
    //The module entries which are pending
    var pendingModules = [];

    Object.defineProperty(this, "pendingModules", { 
        get: function () {
            return pendingModules;
        }});

    var activeModules = [];

    Object.defineProperty(this, "activeModules", { 
        get: function () {
            return activeModules;
        }});

    //Represents a module registration entry and contains its name,
    //its callback function and registration mode
    var ModuleQuery = function (name, callback, mode, dependencies) {
        //This module's name
        this.name = name;
        //The callback function or constructor for the module
        this.callback = callback;
        //The mode of this module query
        this.mode = mode;
        
        //The other modules this module depends on to work properly
        this.dependencies = dependencies || [];
        
        if (mode == "modify")
            this.dependencies.push(this.name);
        
        //Indicates the status of this module query execution
        this.pendingStatus = "pending";        
        //The error message received upon query failure 
        this.errorMessage = "";

        function executeRegisterModule()
        {
            var obj = window;
            
            this.forEachLayer(function (name, layer, lastLayer) {
                if (layer == lastLayer) {
                    if (!obj[name])
                        obj[name] = new this.callback();
                    else
                        throw 'Core.Modules: Invalid Operation. A module with the name "' + this.name 
                            + '" has already been registered.';
                }
                else if (!obj[name])
                    obj[name] = {};
                
                obj = obj[name];
            }, this);
        }

        function executeModifyModule()
        {
            var obj = window;
            
            this.forEachLayer(function (name, layer, lastLayer) {
                if (!obj[name])
                    throw 'Core.Modules: Invalid Operation. Unable to find module "' + name
                        + '". No module with the name "' + this.name + '" has been registered.';

                if (layer == lastLayer)
                    this.callback.call(obj[name]);
                
                obj = obj[name];
            }, this);
        }

        //Indicates wether this module is a dependency of the specified module
        this.isDependencyOf = function (moduleQuery) {
            var queriesAreEqual = moduleQuery.name == this.name && moduleQuery.mode == this.mode;
            
            return moduleQuery.dependencies.indexOf(this.name) > -1 && !queriesAreEqual;
        }

        function executeAllDependencies()
        {
            pendingModules.forEach(function (value) {
                if (value.isDependencyOf(this))
                    value.execute();
            }, this);
        }
        
        this.execute = function () {
            //If the module is not pending, skip
            if (this.pendingStatus != "pending")
                return;

            executeAllDependencies.call(this);

            try {
                switch (this.mode)
                {
                    case "register":
                    executeRegisterModule.call(this);
                        break;
                    case "modify":
                    executeModifyModule.call(this);
                        break;
                }

                activeModules.push(this);
                this.pendingStatus = "success";
            }
            catch (e) {
                this.pendingStatus = "error";
                this.errorMessage = e;
                
                console.error(e);
            }
        }
        
        //Gets the execution layer of this module
        this.getLayerCount = function () {
            var index = 0,
                count = 0;
            
            while (index > -1)
            {
                count++;
                index = this.name.indexOf(".", index + 1);
            }
            
            return count;
        }
        
        //Iterates through each module layer
        this.forEachLayer = function (callback, thisArg) {
            var index = 0,
                currentLayer = 0,
                lastLayer = this.getLayerCount() - 1;
            
            while (index > -1)
            {
                var nextIndex = this.name.indexOf(".", index + 1);
                
                var nameStart = index == 0 ? 0 : index + 1,
                    nameEnd = nextIndex == -1 ? this.name.length : nextIndex;
                
                var name = this.name.slice(nameStart, nameEnd);
                
                if (callback.call(thisArg, name, currentLayer, lastLayer) === false)
                    break;
                
                index = nextIndex;
                currentLayer++;
            }
        }

        //Indicates wether the module dependencies have been activated
        this.dependenciesActive = function () {
            return this.dependencies.length == 0 ||
                this.dependencies.every(function (name) {
                    return activeModules.some(function (module) {
                        return module.name == name;
                        });
                    });
        }

        //Indicates wether the module matches the specified attributes
        this.matchesAttributes = function (attributes) {
            if (!!attributes.name && attributes.name != this.name || 
                !!attributes.mode && attributes.mode != this.mode ||
                !!attributes.pendingStatus && attributes.pendingStatus != this.pendingStatus)
                return false;
            
            if (!!attributes.dependencies && !this.dependencies.some(function (value) {
                    return attributes.dependencies.indexOf(value) > -1;
                }))
                return false;
                
            return true;
        }
    }
    
    this.filterModuleQueries = function (attributes)
    {
        var result = [];
        
        for (var i = 0; i < pendingModules.length; i++)
        {
            var moduleQuery = pendingModules[i];
            
            if (moduleQuery.matchesAttributes(attributes))
                result.push(moduleQuery);
        }
        
        return result;
    }
            
    this.registerModule = function (name, callback, dependencies) {
        pendingModules.push(new ModuleQuery(name, callback, "register", dependencies));
    }
    
    
    this.modifyModule = function (name, callback, dependencies) {
        pendingModules.push(new ModuleQuery(name, callback, "modify", dependencies));
    }
        
    this.execute = function (name) {
        var index = this.getModuleIndexByName(name);
        
        if (index == -1)
            throw 'Core.Modules: Invalid Operation. No module with the name "' + name
                '" has been registered.';
                
        
    }
        
    this.executeAllPendingModules = function () {
        //Iterate through every pending item
        for (var i = 0; i < pendingModules.length; i++)
            pendingModules[i].execute();
        
        console.log(pendingModules);
    }
    
    this.checkPendingStatus = function (name)
    {
        index = this.getModuleIndexByName(name);
        
        if (index == -1)
            throw "Core: Invalid Operation. A module with the specified name does not exist.";
            
        var module = pendingModules[index];
        return module.pendingStatus;
    }
}