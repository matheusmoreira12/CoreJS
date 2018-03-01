///<reference path="Core.ts"/>
///<reference path="Core.Validation.ts"/>
///<reference path="Core.UserInterface.AttributePropertyAssociator.ts"/>
///<reference path="Core.UserInterface.Primitives.ts"/>
///<reference path="Core.UserInterface.Icons.ts"/>

namespace Core.UserInterface {

    //Button
    export class Button extends HTMLButtonElement {

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

        constructor(content: Content = null, icon: Icons.Icon = null, value: string = null) {
            super();

            Validation.RuntimeValidator.validateParameter("content", content, Content);
            Validation.RuntimeValidator.validateParameter("icon", icon, Icons.Icon);
            Validation.RuntimeValidator.validateParameter("value", icon, String);

            this.createIconElement();
            this.createContentElement();

            this.content = content;
            this.icon = icon;
            this.value = value;
            this.isDefault = false;
        }

        attributePropertyAssociator = new AttributePropertyAssociator(this);

        //Button.isDefault property
        get isDefault() {
            return this._isDefault;
        }
        set isDefault(value) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("value", value, BOOL);

            Utils.setAttribute(this, "isDefault", value ? "isDefault" : null);

            this._isDefault = value;
        }
        private _isDefault = false;

        //Button.icon redirection property
        get icon(): Icons.Icon {
            return this._icon;
        }
        set icon(value: Icons.Icon) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("value", value, Icons.Icon);

            this.iconElement.icon = value;

            this._icon = value;
        }
        private _icon: Icons.Icon;

        //Button.content redirection property
        get content(): Content {
            return this.contentElement.content;
        }
        set content(value: Content) {
            this.contentElement.content = value;
        }

        protected shadow: ShadowRoot;

        private iconElement: IconElement;
        private contentElement: Primitives.ContentContainer;

    }
    Utils.defineCustomElement("core-button", Button, "button");

    //CloseButton, based on IconElementButton
    export class CloseButton extends Button {

        constructor() {
            super();

            this.addEventListener("focus", function () {
                this.blur();
            });

            this.tabIndex = -1;
            this.icon = Icons.IconManager.getIconByNames("default", "close");
        }
    }
    Utils.defineCustomElement("core-closebutton", CloseButton, "button");

}