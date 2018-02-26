var Core;
(function (Core) {
    var UserInterface;
    (function (UserInterface) {
        var Icons;
        (function (Icons) {
            class Icon {
                constructor(name, x, y) {
                    this.parentCollection = null;
                    this._width = null;
                    this._height = null;
                    this.name = name;
                    this.x = x;
                    this.y = y;
                }
                //Property Icon.width
                get width() {
                    if (this._width != null || this.parentCollection == null)
                        return this._width;
                    return this.parentCollection.width;
                }
                //Property Icon.height
                get height() {
                    if (this._height != null || this.parentCollection == null)
                        return this._height;
                    return this.parentCollection.height;
                }
                //Property Icon.spriteSrc
                get spriteSrc() {
                    if (this.parentCollection == null)
                        return null;
                    return this.parentCollection.spriteSrc;
                }
            }
            Icons.Icon = Icon;
            class IconCollection extends Core.Collections.GenericCollection {
                constructor(name, spriteSrc, width, height, icons) {
                    super();
                    this.name = name;
                    this.spriteSrc = spriteSrc;
                    this.width = width;
                    this.height = height;
                    this.icons = icons;
                }
                add(item) {
                    item.parentCollection = this;
                    super.add(item);
                }
                addMultiple(...items) {
                    items.forEach((icon) => icon.parentCollection = this);
                    super.addMultiple(...items);
                }
                remove(item) {
                    item.parentCollection = null;
                    super.remove(item);
                }
                removeMultiple(...items) {
                    items.forEach((icon) => icon.parentCollection = null);
                    super.removeMultiple(...items);
                }
                getIconByName(name) {
                    return this.icons.filter((icon) => icon.name == name)[0] || null;
                }
            }
            Icons.IconCollection = IconCollection;
            class IconManager {
                static addCollection(iconCollection) {
                    let isNameAlreadyInUse = this.getCollectionByName(iconCollection.name) != null;
                    if (isNameAlreadyInUse)
                        throw new Error("Cannot add icon collection. Name is already in use.");
                    this.activeIconCollections.add(iconCollection);
                }
                static removeCollection(iconCollection) {
                    this.activeIconCollections.remove(iconCollection);
                }
                static getCollectionByName(name) {
                    return this.activeIconCollections.filter(function (iconCollection) {
                        return iconCollection.name == name;
                    })[0] || null;
                }
                static getIconByNames(collectionName, iconName) {
                    let iconCollection = this.getCollectionByName(collectionName);
                    if (iconCollection == null)
                        return null;
                    let icon = iconCollection.getIconByName(iconName);
                    return icon;
                }
            }
            IconManager.activeIconCollections = new Core.Collections.GenericCollection();
            Icons.IconManager = IconManager;
        })(Icons = UserInterface.Icons || (UserInterface.Icons = {}));
    })(UserInterface = Core.UserInterface || (Core.UserInterface = {}));
})(Core || (Core = {}));
