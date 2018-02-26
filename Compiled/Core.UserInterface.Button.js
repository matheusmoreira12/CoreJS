///<reference path="Core.UserInterface.Primitives.ts"/>
///<reference path="Core.UserInterface.Icons.ts"/>
var Core;
(function (Core) {
    var UserInterface;
    (function (UserInterface) {
        //Button
        class Button extends UserInterface.Primitives.LabelableContainer {
            constructor(text, icon) {
                super();
                this.createIconElement();
                this.createContentElement();
                this.isDefault = true;
            }
            createIconElement() {
                let iconElement = new UserInterface.IconElement();
                this.shadow.appendChild(iconElement);
                this.iconElement = iconElement;
            }
            createContentElement() {
                let contentElement = new UserInterface.Primitives.ContentContainer();
                this.shadow.appendChild(contentElement);
                this.contentElement = contentElement;
            }
            //Button "isDefault" property
            get isDefault() {
                return this._isDefault;
            }
            set isDefault(value) {
                if (value == true) {
                    this.setAttribute('default', '');
                    this.focus();
                }
                else
                    this.removeAttribute('default');
                this._isDefault = value;
            }
            //Button "icon" property
            get icon() {
                return this._icon;
            }
            set icon(value) {
                this.iconElement.icon = value;
                this._icon = value;
            }
            attributeChangedCallback(attrName, oldVal, newVal) {
                switch (attrName) {
                    case 'default':
                        this._isDefault = !!newVal;
                        break;
                    case 'icon':
                        this._icon = newVal;
                        break;
                }
            }
            get content() {
                return this.contentElement.content;
            }
            set content(value) {
                this.contentElement.content = value;
            }
        }
        UserInterface.Button = Button;
        UserInterface.Utils.defineCustomElement('core-button', Button, 'button');
        //CloseButton, based on IconElementButton
        class CloseButton extends Button {
            constructor() {
                super();
                this.addEventListener('focus', function () {
                    this.blur();
                });
                this.tabIndex = -1;
                this.icon = UserInterface.Icons.IconManager.getIconByNames('default', 'close');
            }
        }
        UserInterface.CloseButton = CloseButton;
        UserInterface.Utils.defineCustomElement('core-closebutton', CloseButton, 'button');
    })(UserInterface = Core.UserInterface || (Core.UserInterface = {}));
})(Core || (Core = {}));
