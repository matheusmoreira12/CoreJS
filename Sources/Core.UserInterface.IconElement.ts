namespace Core.UserInterface {

    //IconElement
    export class IconElement extends HTMLElement {
        constructor() {
            super();

            this.attachShadow({ mode: "open" });         
        }

        private _updateSpriteImage(icon: Icons.Icon) {
            // Remove old sprite image
            if (this._spriteImageElement instanceof Image)
                this._spriteImageElement.remove();

            // Create new sprite image
            let spriteImageElement = new Image(icon.width, icon.height);
            spriteImageElement.src = icon.spriteSrc;
            this.shadowRoot.appendChild(spriteImageElement);

            // Assign new sprite image
            this._spriteImageElement = spriteImageElement;
        }

        //IconElement.icon property
        get icon() {
            return this._icon;
        }
        set icon(value: Icons.Icon) {
            this._updateSpriteImage(value);

            this._icon = value;
        }
        private _icon : Icons.Icon;

        private _spriteImageElement : HTMLImageElement;
    }
    customElements.define("core-icon", IconElement);
}