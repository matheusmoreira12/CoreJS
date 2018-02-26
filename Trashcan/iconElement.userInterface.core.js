$extend('Core.UserInterface', function () {
    //IconElement
    class IconElement extends HTMLElement {
        constructor() {
            IconElement_prototype._icon = null;
        }
        
        get icon() {
            return this._icon;
        }

        set icon(value) {
            this._icon = value;

            this._update();
        }

        _update() {
            
        }
    }
    customElements.define("core-icon", IconElement);
    this.IconElement = IconElement;
});