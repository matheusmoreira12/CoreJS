/// <reference path="Core.UserInterface.Forms.ts"/>
/// <reference path="Core.UserInterface.Primitives.ts"/>
/// <reference path="Core.UserInterface.Button.ts"/>
var Core;
(function (Core) {
    var UserInterface;
    (function (UserInterface) {
        var Dialogs;
        (function (Dialogs_1) {
            //CoreDialogTitle
            class DialogTitle extends UserInterface.Primitives.ContentContainer {
            }
            Dialogs_1.DialogTitle = DialogTitle;
            UserInterface.Utils.defineCustomElement('core-dialogTitle', DialogTitle);
            //CoreDialogTitleBar
            class DialogTitleBar extends HTMLElement {
                constructor(title) {
                    super();
                    this.titleElement = new DialogTitle(title);
                    this.appendChild(this.titleElement);
                    this.closeButton = new UserInterface.CloseButton();
                    this.appendChild(this.closeButton);
                }
                get titleContent() {
                    return this.titleElement.content;
                }
                set titleContent(value) {
                    this.titleElement.content = value;
                }
            }
            Dialogs_1.DialogTitleBar = DialogTitleBar;
            UserInterface.Utils.defineCustomElement('core-dialogTitleBar', DialogTitleBar, 'section');
            //CoreDialogContent
            class DialogContent extends UserInterface.Primitives.ElementContainer {
            }
            Dialogs_1.DialogContent = DialogContent;
            UserInterface.Utils.defineCustomElement('core-dialogContent', DialogContent, 'section');
            //CoreDialogMessage
            class DialogMessage extends UserInterface.Primitives.ContentContainer {
            }
            Dialogs_1.DialogMessage = DialogMessage;
            UserInterface.Utils.defineCustomElement('core-dialogMessage', DialogMessage);
            //CoreDialog
            class Dialog extends HTMLDialogElement {
                constructor(title, contentElements, buttonType) {
                    super();
                    this.returnValue = null;
                    this.titleBar = new DialogTitleBar(title);
                    this.appendChild(this.titleBar);
                    this.content = new DialogContent(...contentElements);
                    this.appendChild(this.content);
                    this.buttonBar = new UserInterface.Forms.ButtonBar(buttonType);
                    this.appendChild(this.buttonBar);
                }
            }
            Dialogs_1.Dialog = Dialog;
            UserInterface.Utils.defineCustomElement('core-dialog', Dialog, 'dialog');
            //interface dialogs
            class Dialogs {
            }
            Dialogs_1.Dialogs = Dialogs;
        })(Dialogs = UserInterface.Dialogs || (UserInterface.Dialogs = {}));
    })(UserInterface = Core.UserInterface || (Core.UserInterface = {}));
})(Core || (Core = {}));
