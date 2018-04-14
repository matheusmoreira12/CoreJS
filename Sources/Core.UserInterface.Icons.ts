namespace Core.UserInterface.Icons {

    export class Icon {
        constructor(name: string, x: number, y: number, width?: number, height?: number) {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("name", name, STRING, true, false);
            Validation.RuntimeValidator.validateParameter("x", x, NUMBER, true, false);
            Validation.RuntimeValidator.validateParameter("y", y, NUMBER, true, false);
            Validation.RuntimeValidator.validateParameter("width", width, NUMBER);
            Validation.RuntimeValidator.validateParameter("height", width, NUMBER);

            this.name = name;
            this.x = x;
            this.y = y;

            if (typeof width != UNDEF && width !== null)
                this.width = width;
            if (typeof height != UNDEF && height !== null)
                this.height = height;
        }

        name: string
        x: number
        y: number
        parentList = null;

        //Property Icon.width
        get width() {
            if (this._width != null || this.parentList == null)
                return this._width;

            return this.parentList.width;
        }
        set width(value: number) {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("value", value, NUMBER, true, true);

            this._width = value;
        }
        private _width: number = null

        //Property Icon.height
        get height() {
            if (this._height != null || this.parentList == null)
                return this._height;

            return this.parentList.height;
        }
        set height(value: number) {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("value", value, NUMBER, true, true);

            this._height = value;
        }
        private _height: number = null

        //Property Icon.spriteSrc
        get spriteSrc() {
            if (this.parentList == null)
                return null;

            return this.parentList.spriteSrc;
        }
    }

    export class IconList extends Lists.GenericList<Icon> {
        constructor(name: string, spriteSrc: string, width: number, height: number, icons?: Icon[]) {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("name", name, STRING, true, false);
            Validation.RuntimeValidator.validateParameter("spriteSrc", spriteSrc, STRING, true, false);
            Validation.RuntimeValidator.validateParameter("width", width, NUMBER, true, false);
            Validation.RuntimeValidator.validateParameter("height", height, NUMBER, true, false);
            Validation.RuntimeValidator.validateArrayParameter("icons", icons, Icon, true);

            super(icons);

            this.name = name;
            this.spriteSrc = spriteSrc;
            this.width = width;
            this.height = height;

            this.itemAddedEvent.attach(this._onItemAdded);
            this.itemRemovedEvent.attach(this._onItemRemoved);
            this.itemChangedEvent.attach(this._onItemChanged);
        }

        name: string;
        spriteSrc: string;
        width: number;
        height: number;

        private _rejectIcon(icon: Icon) {
            if (icon)
                icon.parentList = null;
        }

        private _adoptIcon(icon: Icon) {
            if (icon)
                icon.parentList = this;
        }

        private _onItemAdded(target: IconList, args: Events.ListEventArgs<Icon>) {
            this._adoptIcon(args.newItem);
        }

        private _onItemRemoved(target: IconList, args: Events.ListEventArgs<Icon>) {
            this._rejectIcon(args.oldItem);
        }

        private _onItemChanged(target: IconList, args: Events.ListEventArgs<Icon>) {
            this._adoptIcon(args.newItem);
            this._rejectIcon(args.oldItem);
        }

        getIconByName(name: string) {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("name", name, STRING, true, false);

            return this.filter((icon) => icon.name == name)[0] || null;
        }
    }

    export class IconManager {
        private static activeIconLists: Lists.GenericList<IconList> =
            new Lists.GenericList<IconList>();

        static addList(iconList: IconList) {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("iconList", iconList,
                IconList, true, false);

            let isNameAlreadyInUse = this.getListByName(iconList.name) != null;
            if (isNameAlreadyInUse)
                throw new Error("Cannot add icon collection. Name is already in use.");

            this.activeIconLists.add(iconList);
        }

        static removeList(iconList: IconList) {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("iconList", iconList,
                IconList, true, false);

            this.activeIconLists.remove(iconList);
        }

        static getListByName(name) {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("name", name, STRING, true, false);

            return this.activeIconLists.filter(function (iconList) {
                return iconList.name == name;
            })[0] || null;
        }

        static getIconByNames(collectionName, iconName) {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("collectionName", collectionName, STRING, true, false);
            Validation.RuntimeValidator.validateParameter("iconName", iconName, STRING, true, false);

            let iconList = this.getListByName(collectionName);

            //No collection was found, return
            if (iconList == null) return null;

            let icon = iconList.getIconByName(iconName);

            //Success! return icon
            return icon;
        }
    }
}