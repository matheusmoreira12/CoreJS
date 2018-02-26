///<reference path="Core.UserInterface.Primitives.ts"/>
///<reference path="Core.UserInterface.Icons.ts"/>

namespace Core.UserInterface {

    //Button
    export class Button extends Primitives.LabelableContainer {
        
        private createIconElement() {
            let iconElement = new IconElement();
            this.shadow.appendChild(iconElement);

            this.iconElement = iconElement;
        }

        private createContentElement() {
            let contentElement = new Primitives.ContentContainer();
            this.shadow.appendChild(contentElement);

            this.contentElement = contentElement;
        }

        constructor(text?: string, icon?: Icons.Icon) {
            super();

            this.createIconElement();
            this.createContentElement();

            this.isDefault = true;
        }

        //Button "isDefault" property
        get isDefault () {
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
        private _isDefault: boolean;
        
        //Button "icon" property
        get icon() : Icons.Icon {
            return this._icon;
        }
        set icon(value : Icons.Icon) {
            this.iconElement.icon = value;
        
            this._icon = value;
        }
        private _icon;

        protected shadow: ShadowRoot;

        private iconElement: IconElement;
        private contentElement: Primitives.Content;

        attributeChangedCallback (attrName, oldVal, newVal) {
            switch (attrName) {
                case 'default':
                    this._isDefault = !!newVal;
                    break;
                case 'icon':
                    this._icon = newVal;
                    break;
            }
        }

        get content(): Content {
            return this.contentElement.content;
        }
        set content(value: Content) {
            this.contentElement.content = value;
        }

    }
    Utils.defineCustomElement('core-button', Button, 'button');

    //CloseButton, based on IconElementButton
    export class CloseButton extends Button {
        
        constructor() {
            super();

            this.addEventListener('focus', function () {
                this.blur();
            });

            this.tabIndex = -1;
            this.icon = Icons.IconManager.getIconByNames('default', 'close');
        }
    }
    Utils.defineCustomElement('core-closebutton', CloseButton, 'button');

}