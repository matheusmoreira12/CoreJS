$export('Core.UserInterface.Icons', function () {

    this.Icon = function (name, x, y) {
        if (!Core.TypeChecking.isString(name))
            throw new RangeError('argument "name" must be a valid string.'); 
        if (!Core.TypeChecking.isNumber(x))
            throw new RangeError('argument "x" must be a valid number.');
        if (!Core.TypeChecking.isNumber(y))
            throw new RangeError('argument "y" must be a valid number.');

        this.name = name;
        this.x = x;
        this.y = y;
        
        this.fromCollection = null;
    }
    
    this.IconCollection = function (name, spriteURL, width, height, icons) {
        if (!Core.TypeChecking.isString(name))
            throw new RangeError('argument "collectionName" must be a valid string.');
        if (!Core.TypeChecking.isString(spriteURL))
            throw new RangeError('argument "spriteURL" must be a valid string.');
        if (!Core.TypeChecking.isNumber(width))
            throw new RangeError('argument "width" must be a valid number.');
        if (!Core.TypeChecking.isNumber(height))
            throw new RangeError('argument "height" must be a valid number.');
        if (!Core.TypeChecking.isArray(icons))
            throw new RangeError('argument "icons" must be a valid array.');

        this.name = name;
        this.spriteURL = spriteURL;
        this.width = width;
        this.height = height;
        
        this.icons = icons || [];
        
        icons.forEach(function (icon) {
            icon.fromCollection = this;
        }, this);
        
        this.getIconByName = function (name) {
            return this.icons.filter(function (icon) {
                return icon.name == name;
                })[0] || null;
        }
    }
    
    var activeIconCollections = [
        new this.IconCollection('default', 'ui-icon-sprite-21x21.svg', 21, 21, [
                new this.Icon('page', 41, 1),
                new this.Icon('folder open', 41, 21),
                new this.Icon('folder closed', 41, 41),
                new this.Icon('plus', 62, 2),
                new this.Icon('minus', 62, 22),
                new this.Icon('help', 62, 42),
                new this.Icon('check', 82, 2),
                new this.Icon('close', 82, 22),
                new this.Icon('info', 82, 41)
            ]) 
        ];
    
    this.addIconCollection = function (iconCollection) {
        if (getIconCollectionByName(iconCollection.name) == null)
            activeIconCollections.push(iconCollection);
    }
    
    this.removeIconCollection = function (iconCollection) {
        activeIconCollections.splice(activeIconCollections.indexOf(iconCollection), 1);
    }
    
    this.getIconCollectionByName = function (name) {
        return activeIconCollections.filter(function (iconCollection) { 
            return iconCollection.name == name; 
            })[0] || null;
    }
    
    this.getIconByNames = function (collectionName, iconName) {
        var iconCollection = this.getIconCollectionByName(collectionName);
        
        if (iconCollection == null)
            return null;
            
        var icon = iconCollection.getIconByName(iconName);
        
        return icon;
    }

}, []);