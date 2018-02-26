//Core.Modules namespace
Core.Modules = new function () {

    const LEVEL_SEPARATOR_CHAR = '.';
    const VALID_IDENTIFIER_PATTERN = /^[a-zA-Z]\w*$/;
    const NUMBER = 'number';
            
    class Module {
        static getLayerNames(moduleInstance) {
            return moduleInstance.name.split(LEVEL_SEPARATOR_CHAR);
        }
        
        static getLevelCount(moduleInstance) {
            return this.getLayerNames(moduleInstance).length;
        }
        
        static forEachLevel(moduleInstance, callback, thisArg) {
            var allLevels = this.getLayerNames(moduleInstance),
                count = allLevels.length;
            
            for (var i = 0; i < allLevels.length; i++)
                if (callback.call(thisArg, i, count, allLevels[i]) == false)
                    break;
        }
                
        static nameIsValid(name) {
            var allLevels = name.split(LEVEL_SEPARATOR_CHAR);
            
            for (var i = 0; i < allLevels.length; i++)
                if (!VALID_IDENTIFIER_PATTERN.test(allLevels[i]))
                    return false;

            return true;
        }
        
        constructor (name) { 
            if (!name)
                throw new RangeError('Parameter "name" is required and must not be empty or null.');
            if (!Module.nameIsValid(name))
                throw new SyntaxError('Invalid syntax for parameter "name". "' + name + '" is not a valid module name.');

            this.name = name;
        }

        get levels() {
            return Core.Collections.GenericCollection.fromArray(Module.getLayerNames(this));
        }

        get levelIndex() {
            return Module.getLevelCount(this) - 1;
        }

        forEachLevel(callback, thisArg) {
           Module.forEachLevel(this, callback, thisArg);
        }
    }

    class ExportedModule extends Module {
        constructor (name, moduleConstructor) {
            super(name);

            this.moduleConstructor = moduleConstructor;
        }
        
        import(callback, thisArg) {
            callback.call(thisArg, moduleObject);
        }
        
    }
    
    class RegisteredModule extends Module {
        static createFromConstructor(name, moduleConstructor) {
            return new RegisteredModule(name, new moduleConstructor())
        }
                
        constructor (name, moduleObject) {
            super(name);

            this.moduleObject = moduleObject;
        }

        extend(moduleConstructor) {
            moduleConstructor.call(this.moduleObject);
        }

        matches(options) {
            if (!super.matches(options))
                return false;
                
            if (options.moduleObject && !Object.is(options.moduleObject, this.moduleConstructor))
                return false;
                
            return true;
        }
    }
    
    class ModuleCollection extends Core.Collections.GenericCollection {
    }
    
    var activeModules = new ModuleCollection();
    
    this.__defineGetter__('activeModules', function () { return activeModules; });

    class ModuleQuery {
        static queriesShareLevels(query, subQuery)
        {
            var result = true;
            
            if (!(query instanceof ModuleQuery))
                throw new TypeError('Argument "query" is not a valid ModuleQuery.');
            if (!(subQuery instanceof ModuleQuery))
                throw new TypeError('Argument "subQuery" is not a valid ModuleQuery.');
                
            query.forEachLevel((index, count, name) => {
                result &= subQuery.levels[index] == name;
            });
            
            return result;
        }
        
        constructor(name, moduleConstructor) {
            if (!name)
                throw new RangeError('Parameter "name" is required and must not be empty or null.');
            if (!Module.nameIsValid(name))
                throw new SyntaxError('Invalid syntax for parameter "name". "' + name + '" is not a valid module name.');
            
            this.name = name;
            this.moduleConstructor = moduleConstructor;
        }
        
        get levels() {
            return Core.Collections.GenericCollection.fromArray(Module.getLayerNames(this));
        }

        get levelIndex() {
            return Module.getLevelCount(this) - 1;
        }
        
        forEachLevel(callback, thisArg) {
           Module.forEachLevel(this, callback, thisArg);
        }
    }
    
    class ExportModuleQuery extends ModuleQuery {
        execute() {
            activeModules.add(new ExportedModule(name, moduleConstructor));
        }
    }
    
    class RegisterModuleQuery extends ModuleQuery {
        execute() {
            activeModules.add(RegisteredModule.createFromConstructor(name, moduleConstructor));
        }
    }
    
    class ExtendModuleQuery extends ModuleQuery {
        execute() {
            var matchingModules = activeModules.filter((item) => { 
                return item.name == this.name && item instanceof RegisteredModule; }, this);
            
            if (matchingModules.length == 0)
                throw new RangeError('Core.Modules: cannot extend module. No registered module matches the name "' + name + '".');
            
            matchingModules[0].extend(moduleConstructor);
        }
    }
    
    class ModuleQueryCollection extends Core.Collections.GenericCollection {
    }

    //The module queries which are still pending
    var pendingModuleQueries = new ModuleQueryCollection();

    this.__defineGetter__("pendingModuleQueries", function () {
            return pendingModuleQueries;
        });

    this.exportModule = function (name, moduleConstructor) {
        pendingModuleQueries.add(new ExportModuleQuery(name, moduleConstructor));
    }
    
    this.importModule = function (callback, thisArg) {
        var matchingModules = activeModules.filter((item) => { return item.name == name && item instanceof ExportedModule; });
        
        if (matchingModules.length == 0)
            throw new RangeError('Core.Modules: cannot import module. No exported module matches the name "' + name + '".');
        
        matchingModules[0].import(callback, thisArg);
    }
    
    this.registerModule = function (name, moduleConstructor) {
        pendingModuleQueries.add(new RegisterModuleQuery(name, moduleConstructor));
    }
    
    this.extendModule = function (name, moduleConstructor) {
        pendingModuleQueries.add(new ExtendModuleQuery(name, moduleConstructor));
    }
 
    class ModuleQueryTreeItem extends Core.Collections.GenericTreeItem {
        constructor(value, children) {
            super(children)
            
            this.value = value || null;
        }
    }
    
    class ModuleQueryTree extends Core.Collections.GenericTree {
        static fromQueryCollection(queryCollection) {
            var result = new ModuleQueryTree();
                        
            function readAllItemsInLevel(currQuery, targetLevel, destQueryTreeItem) {
                var queries = queryCollection.filter((item) => { return item.levelIndex == targetLevel &&
                (currQuery == null ? true : ModuleQuery.queriesShareLevels(currQuery, item)); });

                for (var i = 0; i < queries.length; i++)
                {
                    var query = queries[i];
                    var treeItem = new ModuleQueryTreeItem(query);

                    readAllItemsInLevel(query, targetLevel + 1, treeItem);

                    destQueryTreeItem.addChild(treeItem);
                }
            }
            
            readAllItemsInLevel(null, 1, result);

            console.log(result);
            return result;
        }
    }
    
    this.executePendingQueries = function () {
        ModuleQueryTree.fromQueryCollection(pendingModuleQueries);
    }
    
    window.$import = this.importModule;
    window.$export = this.exportModule;
    window.$extend = this.extendModule;
    window.$define = this.registerModule;
}