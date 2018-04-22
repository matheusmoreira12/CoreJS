///<reference path="Core.UserInterface.Primitives.Control.ts"/>
///<reference path="Core.UserInterface.Primitives.ts"/>
///<reference path="Core.UserInterface.Icons.ts"/>
///<reference path="Core.UserInterface.IconElement.ts"/>

namespace Core.UserInterface {

    //Button
    export class Button extends Primitives.Control {

        private createIconElement() {
            let iconElement = <IconElement>document.createElement("core-icon");
            this._innerBox.appendChild(iconElement);

            this.iconElement = iconElement;
        }

        private createContentElement() {
            let contentElement = <Primitives.ContentPresenter>document.createElement("core-contentpresenter");
            this._innerBox.appendChild(contentElement);

            this.contentElement = contentElement;
        }

        constructor() {
            super();

            this.createIconElement();
            this.createContentElement();
        }

        attributePropertyAssociator = new AttributePropertyAssociator(this);

        //Button.value property
        get value(): string {
            return this._value;
        }
        set value(value: string) {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("value", value, STRING, true, true);

            this._value = value;
        }
        private _value: string = null;

        //Button.isDefault property
        get isDefault() {
            return this._isDefault;
        }
        set isDefault(value) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("value", value, BOOL);

            this.setAttribute("isDefault", value ? "isDefault" : null);

            this._isDefault = value;
        }
        private _isDefault = false;

        //Button.icon redirection property
        get icon(): Icons.Icon {
            return this._icon;
        }
        set icon(value: Icons.Icon) {
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
    customElements.define("core-button", Button, { extends: "button" });

    //CloseButton, based on IconElementButton
    export class CloseButton extends Button {

        constructor() {
            super();

            this.tabIndex = -1;
            this.icon = Icons.IconManager.getIconByNames("default", "close");
        }
    }
    customElements.define("core-closebutton", CloseButton, { extends: "button" });

}