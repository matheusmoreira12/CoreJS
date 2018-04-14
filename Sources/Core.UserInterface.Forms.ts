///<reference path="Core.UserInterface.ts"/>

namespace Core.UserInterface.Forms {

    export class FormItem extends Primitives.LabelableContainer {

        //FormItem.element property
        get element() {
            return this._element;
        }
        set element(value) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("value", value, HTMLElement);

            //remove old element
            if (this._element != null)
                this._element.remove();
            //append new element
            this.appendChild(this._element)
            this._element = value;
        }
        private _element: HTMLElement = null;
    }
    customElements.define("core-formitem", FormItem);


    export class ButtonOptions {
        constructor(value?: string, content?: Content, icon?: Icons.Icon, title?: string, isDefault?: boolean) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("value", value, STRING);
            Validation.RuntimeValidator.validateParameter("content", content, Content);
            Validation.RuntimeValidator.validateParameter("title", title, STRING);
            Validation.RuntimeValidator.validateParameter("isDefault", isDefault, BOOL);

            this.value = value;
            this.content = content;
            this.icon = icon || null;
            this.title = title || null;
        }

        value: string;
        content: Content;
        icon: Icons.Icon;
        title: string;
    }

    export class ButtonType {
        constructor(defaultValue?: string, ...buttons: ButtonOptions[]) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("defaultValue", defaultValue, STRING);
            Validation.RuntimeValidator.validateArrayParameter("buttons", buttons, ButtonOptions, false);

            this.buttons = buttons;
            this.defaultValue = defaultValue || null;
        }

        buttons: ButtonOptions[];
        defaultValue: string;
    }

    export const BTN_OPTIONS_YES = new ButtonOptions("yes", new Content("yes"));
    export const BTN_OPTIONS_NO = new ButtonOptions("no", new Content("no"));
    export const BTN_OPTIONS_CANCEL = new ButtonOptions("cancel", new Content("cancel"));
    export const BTN_OPTIONS_OK = new ButtonOptions("ok", new Content("ok"));

    export const BTN_TYPE_YESNO = new ButtonType("no", BTN_OPTIONS_YES, BTN_OPTIONS_NO);
    export const BTN_TYPE_YESNOCANCEL = new ButtonType("cancel", BTN_OPTIONS_YES, BTN_OPTIONS_NO, BTN_OPTIONS_CANCEL);
    export const BTN_TYPE_YESCANCEL = new ButtonType("cancel", BTN_OPTIONS_YES, BTN_OPTIONS_CANCEL);
    export const BTN_TYPE_NOCANCEL = new ButtonType("cancel", BTN_OPTIONS_NO, BTN_OPTIONS_CANCEL);
    export const BTN_TYPE_OK = new ButtonType("ok", BTN_OPTIONS_OK);
    export const BTN_TYPE_OKCANCEL = new ButtonType("cancel", BTN_OPTIONS_OK, BTN_OPTIONS_CANCEL);

    //CoreDialogButtonBar
    export class ButtonBar extends Primitives.ElementContainer {
        private static _getButtonsFromType(type: ButtonType): Button[] {
            let result = new Array<Button>();

            for (var i = 0; i < type.buttons.length; i++) {
                let buttonOptions = type.buttons[i];

                let buttonElement : Button = <Button>document.createElement("core-button");
                buttonElement.content = buttonOptions.content;
                buttonElement.icon = buttonOptions.icon;
                buttonElement.value = buttonOptions.value;
                buttonElement.isDefault = type.defaultValue === buttonOptions.value;

                result.push(buttonElement);
            }

            return result;
        }

        constructor(buttonType?: ButtonType) {
            super();

            //Runtime validation
            Validation.RuntimeValidator.validateParameter("buttonType", buttonType, ButtonType, false, false);
        }

        defaultButton: HTMLButtonElement = null;
    }

    customElements.define("core-dialogbuttonbar", ButtonBar);

}