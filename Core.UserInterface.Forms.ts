//<reference path="Core.Collections.ts">
//<reference path="Core.UserInterface.ts"/>
//<reference path="Core.UserInterface.Primitives.ts"/>

namespace Core.UserInterface.Forms {

    export class FormItem extends Primitives.LabelableContainer {

        //FormItem.element property
        get element() {
            return this.element;
        }
        set element(value) {
            //remove old element
            if (this.element != null)
                this.element.remove();
            //append new element
            this.appendChild(this._element)
            this.element = value;
        }
        private _element: HTMLElement = null;
    }
    Utils.defineCustomElement('core-formitem', FormItem);


    export class ButtonOptions {
        constructor(value?: string, text?: string, icon?: Icons.Icon, title?: string, isDefault?: boolean) {
            this.value = value;
            this.text = text;
            this.icon = icon || null;
            this.title = title || null;
        }

        value: string;
        text: string;
        icon: Icons.Icon;
        title: string;
    }

    export class ButtonType {
        constructor(buttons: ButtonOptions[], defaultValue?: string) {
            this.buttons = buttons;
            this.defaultValue = defaultValue || null;
        }

        buttons: ButtonOptions[];
        defaultValue: string;
    }

    export const BTN_TYPE_YESNO = new ButtonType([
        new ButtonOptions('yes', 'yes'),
        new ButtonOptions('no', 'no')], 'no');

    export const BTN_TYPE_YESNOCANCEL = new ButtonType([
        new ButtonOptions('yes', 'yes'),
        new ButtonOptions('no', 'no'),
        new ButtonOptions('cancel', 'cancel')], 'cancel');

    export const BTN_TYPE_YESCANCEL = new ButtonType([
        new ButtonOptions('yes', 'yes'),
        new ButtonOptions('cancel', 'cancel')], 'cancel');

    export const BTN_TYPE_NOCANCEL = new ButtonType([
        new ButtonOptions('no', 'no'),
        new ButtonOptions('cancel', 'cancel')], 'cancel');

    export const BTN_TYPE_OK = new ButtonType([
        new ButtonOptions('ok', 'ok')], 'ok');

    export const BTN_TYPE_OKCANCEL = new ButtonType([
        new ButtonOptions('ok', 'ok'),
        new ButtonOptions('ok', 'cancel')], 'cancel');

    //CoreDialogButtonBar
    export class ButtonBar extends HTMLElement {
        constructor() {
            super();

            this.buttons = new Collections.GenericCollection<HTMLButtonElement>();
        }

        buttons: Collections.GenericCollection<HTMLButtonElement>;
        defaultButton: HTMLButtonElement = null;
    }

    Utils.defineCustomElement('core-dialogbuttonbar', ButtonBar);

}