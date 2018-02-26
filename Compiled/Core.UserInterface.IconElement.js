var Core;
(function (Core) {
    var UserInterface;
    (function (UserInterface) {
        //IconElement
        class IconElement extends HTMLElement {
            constructor() {
                super();
                this.shadow = UserInterface.Utils.attachShadow(this);
                this.createSpriteImageElement();
            }
            //IconElement.icon property
            get icon() {
                return this._icon;
            }
            set icon(value) {
                this._icon = value;
                this.updateSpriteImage();
            }
            updateSpriteImage() {
                this.spriteImageElement.width = this.icon.width;
                this.spriteImageElement.height = this.icon.height;
                this.spriteImageElement.src = this.icon.spriteSrc;
                this.spriteImageElement.style.position = "absolute";
                this.spriteImageElement.style.left = -this.icon.x + "px";
                this.spriteImageElement.style.top = -this.icon.y + "px";
            }
            createSpriteImageElement() {
                let spriteImageElement = new Image(1, 1);
                this.shadow.appendChild(spriteImageElement);
                this.spriteImageElement = spriteImageElement;
            }
        }
        UserInterface.IconElement = IconElement;
        customElements.define("core-icon", IconElement);
    })(UserInterface = Core.UserInterface || (Core.UserInterface = {}));
})(Core || (Core = {}));