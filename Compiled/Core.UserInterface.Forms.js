//<reference path="Core.Collections.ts">
//<reference path="Core.UserInterface.ts"/>
//<reference path="Core.UserInterface.Primitives.ts"/>
var Core;
(function (Core) {
    var UserInterface;
    (function (UserInterface) {
        var Forms;
        (function (Forms) {
            class FormItem extends UserInterface.Primitives.LabelableContainer {
                constructor() {
                    super(...arguments);
                    this._element = null;
                }
                //FormItem.element property
                get element() {
                    return this.element;
                }
                set element(value) {
                    //remove old element
                    if (this.element != null)
                        this.element.remove();
                    //append new element
                    this.appendChild(this._element);
                    this.element = value;
                }
            }
            Forms.FormItem = FormItem;
            UserInterface.Utils.defineCustomElement('core-formitem', FormItem);
            class ButtonOptions {
                constructor(value, text, icon, title, isDefault) {
                    this.value = value;
                    this.text = text;
                    this.icon = icon || null;
                    this.title = title || null;
                }
            }
            Forms.ButtonOptions = ButtonOptions;
            class ButtonType {
                constructor(buttons, defaultValue) {
                    this.buttons = buttons;
                    this.defaultValue = defaultValue || null;
                }
            }
            Forms.ButtonType = ButtonType;
            Forms.BTN_TYPE_YESNO = new ButtonType([
                new ButtonOptions('yes', 'yes'),
                new ButtonOptions('no', 'no')
            ], 'no');
            Forms.BTN_TYPE_YESNOCANCEL = new ButtonType([
                new ButtonOptions('yes', 'yes'),
                new ButtonOptions('no', 'no'),
                new ButtonOptions('cancel', 'cancel')
            ], 'cancel');
            Forms.BTN_TYPE_YESCANCEL = new ButtonType([
                new ButtonOptions('yes', 'yes'),
                new ButtonOptions('cancel', 'cancel')
            ], 'cancel');
            Forms.BTN_TYPE_NOCANCEL = new ButtonType([
                new ButtonOptions('no', 'no'),
                new ButtonOptions('cancel', 'cancel')
            ], 'cancel');
            Forms.BTN_TYPE_OK = new ButtonType([
                new ButtonOptions('ok', 'ok')
            ], 'ok');
            Forms.BTN_TYPE_OKCANCEL = new ButtonType([
                new ButtonOptions('ok', 'ok'),
                new ButtonOptions('ok', 'cancel')
            ], 'cancel');
            //CoreDialogButtonBar
            class ButtonBar extends HTMLElement {
                constructor() {
                    super();
                    this.defaultButton = null;
                    this.buttons = new Core.Collections.GenericCollection();
                }
            }
            Forms.ButtonBar = ButtonBar;
            UserInterface.Utils.defineCustomElement('core-dialogbuttonbar', ButtonBar);
        })(Forms = UserInterface.Forms || (UserInterface.Forms = {}));
    })(UserInterface = Core.UserInterface || (Core.UserInterface = {}));
})(Core || (Core = {}));
