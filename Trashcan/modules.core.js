Core.Modules = new (function  () {
    const modules = this;
    const STRING = 'string';
    
    let Module = class {
        constructor(moduleName, constrFn) {
            //Validate parameters
            if (!(constructor instanceof Function))
                throw new TypeError('Parameter "constructor" is not a valid Function.');

            //Validate layer identifiers
            var layerIdentifiers = Module.getLayerIdentifiers(moduleName),
                areLayerIdentifiersValid = layerIdentifiers.every((n) => Core.StringUtils.isValidIdentifier(n), this);
            
            if (!areLayerIdentifiersValid)
                throw new Error('"' + moduleName + '" is not a valid module module name.');
            
            //Assign all properties
            this.layerIdentifiers = layerIdentifiers;
            this.constructorFunction = constrFn;
        }
        
        static getLayerIdentifiers(moduleName) {
            if (typeof (moduleName) != STRING)
                throw new TypeError('Parameter "moduleName" is not a valid string.');
            
            return moduleName.split('.');
        }
        
        get moduleName() {
            return this.layerIdentifiers.join('.');
        }
        
        get moduleLevel() {
            var level = this.layerIdentifiers.length - 1;
            
            if (this instanceof ExtensionModule)
                level++;
            
            return level;
        }
        
        isModuleOwner(mod) {
            var isExportedModule = (this instanceof ExportedModule),
                isHigherLevel = this.moduleLevel < mod.moduleLevel,
                isMatchInEveryLayer = this.moduleName.startsWith(mod.moduleName);

            return isExportedModule && isHigherLevel && isMatchInEveryLayer;
        }
    }
    
    let ExportedModule = class extends Module {

        execute() {
            var obj = new this.constructorFunction();
            
            return obj;
        }
        
        importInto(contextFn, thisArg) {
            var obj = this.execute();
            
            contextFn.call(thisArg, obj);
        }
    }
    
    let ExtensionModule = class extends Module {
        constructor(moduleName, extendedModule, constrFn) {
            super(moduleName, constrFn);
            
            if (!(extendedModule instanceof ExportedModule))
                throw new TypeError('Parameter "extendedModule" is not a valid Module.');
            
            this._extendedModule = extendedModule;
        }
        
        execute() {
        }
    }

    let ModuleTreeItem = class extends Core.Collections.GenericTreeItem {
        
        static getItemIsValid(item) {
            return item == null || (item instanceof ModuleTreeItem);
        }
        
        static getItemsAreValid(items) {
            return (items instanceof Array) && items.every((item) => this.getItemIsValid(item), this);
        }
        
        add(item) {
            if (!ModuleTreeItem.getItemIsValid(item))
                throw new TypeError('Parameter "item" is not a valid ModuleTreeItem.');
                
            super.add(item);
        }
        
        insert(item, index) {
            if (!ModuleTreeItem.getItemIsValid(item))
                throw new TypeError('Parameter "item" is not a valid ModuleTreeItem.');
                
            super.insert(item, index);
        }
        
        addMultiple(items) {
            if (!ModuleTreeItem.getItemsAreValid(items))
                throw new TypeError('Parameter "items" must be a valid Array and only'
                    + ' contain items of type ModuleTreeItem.');
                    
            super.addMultiple(items);
        }
        
        insertMultiple(items, index) {
            if (!ModuleTreeItem.getItemsAreValid(items))
                throw new TypeError('Parameter "items" must be a valid Array and only'
                    + ' contain items of type ModuleTreeItem.');
                    
            super.insertMultiple(items, index);
        }
        
        execute() {
            
        }
    }

    let ModulesCollection = class extends Core.Collections.GenericCollection {

        organizeAsTree() {
            var result = new ModuleTreeItem();
            
            var treeItems = this.select((m) => new ModuleTreeItem(m));
            result.addMultiple(treeItems);
            
            for (var i = 0; i < treeItems.length; i++)
                for (var j = 0; j < treeItems.length; j++) {
                    var ownerTreeItem = treeItems[i], owner = ownerTreeItem.value,
                        ownedTreeItem = treeItems[j], owned = ownedTreeItem.value;
                    
                    if (owner.isModuleOwner(owned))
                        ownerTreeItem.add(ownedTreeItem);
                }
            
            return result;
        }

        getExportedByName(moduleName) {
            return this.filter((m) => (m.moduleName == moduleName && (m instanceof ExportedModule)))[0] || null;
        }
        
        getModuleOwners(mod) {
            return this.filter((m) => (m.isModuleOwner(mod)));
        }
        
        exportModule(moduleName, constrFn) {
            var isNameAlreadyInUse = this.getExportedByName(moduleName) != null;
            if (isNameAlreadyInUse)
                throw new Error('Module moduleName "'+ moduleName + '" is already taken by another module.');

            //Create exported module
            var newModule = new ExportedModule(moduleName, constrFn);
            
            this.add(newModule);
        }
        
        importModule(moduleName, contextFn, thisArg) {
            var exportedModuleExists = this.getExportedByName(moduleName) != null;
            if (!exportedModuleExists)
                throw new Error('There is no exported module named "' + moduleName + '"');
            
            exportedModule.importInto(contextFn, thisArg);
        }
        
        extendModule(moduleName, constrFn) {
            //Validate parameters
            var exportedModule = this.getExportedByName(moduleName),
                exportedModuleExists = exportedModule != null;
            if (!exportedModuleExists)
                throw new Error('There is no exported module named "' + moduleName + '"');

            //Create extension module
            var newModule = new ExtensionModule(moduleName, exportedModule, constrFn);
            
            this.add(newModule);
        }
    }
    
    let registeredModules = new ModulesCollection();
    
    this.exportModule = function (moduleName, constrFn) {
        registeredModules.exportModule(moduleName, constrFn);
    }
    
    this.importModule = function (moduleName, contextFn, thisArg) {
        registeredModules.importModule(moduleName, contextFn, thisArg);
    }
    
    this.extendModule = function (moduleName, constrFn) {
        registeredModules.extendModule(moduleName, constrFn);
    }
    
    this.executePendingModules = function () {
        var modulesTree = registeredModules.organizeAsTree();
        console.log(modulesTree);
        
        modulesTree.execute();
    }

    window.$export = this.exportModule;
    window.$import = this.importModule;
    window.$extend = this.extendModule;
});