namespace Core.UserInterface.Icons {

    export class Icon {
        constructor (name : string, x : number, y : number) {
            this.name = name;
            this.x = x;
            this.y = y;
        }

        name : string
        x : number
        y : number
        parentCollection = null;

        //Property Icon.width
        get width() {
            if (this._width != null || this.parentCollection == null)
                return this._width;
                
            return this.parentCollection.width;
        }
        private _width : number = null

        //Property Icon.height
        get height() {
            if (this._height != null || this.parentCollection == null)
                return this._height;
                
            return this.parentCollection.height;
        }
        private _height : number = null

        //Property Icon.spriteSrc
        get spriteSrc() {
            if (this.parentCollection == null)
                return null;
                
            return this.parentCollection.spriteSrc;
        }
    }
    
    export class IconCollection extends Collections.GenericCollection<Icon> {
        constructor (name : string, spriteSrc : string, width : number, height : number, icons? : Icon[]) {
            super();

            this.name = name;
            this.spriteSrc = spriteSrc;
            this.width = width;
            this.height = height;
            this.icons = icons;
        }

        name : string;
        spriteSrc : string;
        width : number;
        height : number;
        icons : Icon[];
        
        add(item : Icon) {
            item.parentCollection = this;
            
            super.add(item);
        }
        
        addMultiple(...items : Icon[]) {
            items.forEach((icon)=>icon.parentCollection = this);

            super.addMultiple(...items);
        }
        
        remove(item : Icon) {
            item.parentCollection = null;
            
            super.remove(item);
        }
        
        removeMultiple(...items : Icon[]) {
            items.forEach((icon)=>icon.parentCollection = null);

            super.removeMultiple(...items);
        }
                
        getIconByName(name : string) {
            return this.icons.filter((icon)=>icon.name == name)[0] || null;
        }
    }
    
    export class IconManager {
        private static activeIconCollections : Collections.GenericCollection<IconCollection> = 
            new Collections.GenericCollection<IconCollection>();
        
        static addCollection(iconCollection : IconCollection) {
            let isNameAlreadyInUse = this.getCollectionByName(iconCollection.name) != null;
            if (isNameAlreadyInUse)
                throw new Error("Cannot add icon collection. Name is already in use.");

            this.activeIconCollections.add(iconCollection);
        }
        
        static removeCollection(iconCollection : IconCollection) {
            this.activeIconCollections.remove(iconCollection);
        }
        
        static getCollectionByName(name) {
            return this.activeIconCollections.filter(function (iconCollection) { return iconCollection.name == name; 
                })[0] || null;
        }
        
        static getIconByNames(collectionName, iconName) {
            let iconCollection = this.getCollectionByName(collectionName);

            if (iconCollection == null) return null;
                
            let icon = iconCollection.getIconByName(iconName);
            
            return icon;
        }
    }
}