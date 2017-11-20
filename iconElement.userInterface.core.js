Core.Modules.modifyModule('Core.UserInterface', function () {
    //IconElement
    var IconElement_prototype = Object.create(HTMLElement.prototype);

    IconElement_prototype._icon = null;

    IconElement_prototype.__defineGetter__('icon', function () {
        return this._icon;
        });

    IconElement_prototype.__defineSetter__('icon', function (value) {
        this._icon = value;
        });

    this.IconElement = Core.UserInterface.register("core-icon", IconElement_prototype);

}, []);