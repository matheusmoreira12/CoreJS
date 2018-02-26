namespace Core.UserInterface {

    //IconElement
    export class IconElement extends HTMLElement {
        constructor() {
            super();

            this.shadow = Utils.attachShadow(this);         
            this.createSpriteImageElement();
        }

        //IconElement.icon property
        get icon() {
            return this._icon;
        }
        set icon(value : Icons.Icon) {
            this._icon = value;

            this.updateSpriteImage();
        }
        private _icon : Icons.Icon;

        private shadow;
        private spriteImageElement : HTMLImageElement;

        updateSpriteImage() {
            this.spriteImageElement.width = this.icon.width;
            this.spriteImageElement.height = this.icon.height;
            this.spriteImageElement.src = this.icon.spriteSrc;
            this.spriteImageElement.style.position = "absolute";
            this.spriteImageElement.style.left = -this.icon.x + "px";
            this.spriteImageElement.style.top = -this.icon.y + "px";
        }

        private createSpriteImageElement() {
            let spriteImageElement = new Image(1, 1);
            this.shadow.appendChild(spriteImageElement);
            
            this.spriteImageElement = spriteImageElement;
        }
    }
    customElements.define("core-icon", IconElement);
}