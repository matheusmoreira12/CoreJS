/// <reference path="Core.UserInterface.Forms.ts"/>
/// <reference path="Core.UserInterface.Primitives.ts"/>
/// <reference path="Core.UserInterface.Button.ts"/>

namespace Core.UserInterface.Dialogs {

    //CoreDialogTitle
    export class DialogTitle extends Primitives.ContentContainer {
    }
    Utils.defineCustomElement('core-dialogTitle', DialogTitle);

    //CoreDialogTitleBar
    export class DialogTitleBar extends HTMLElement {
        titleElement: DialogTitle;
        closeButton: CloseButton;

        constructor(title?: Content) {
            super();

            this.titleElement = new DialogTitle(title);
            this.appendChild(this.titleElement);

            this.closeButton = new CloseButton();
            this.appendChild(this.closeButton);
        }

        get titleContent(): Content {
            return this.titleElement.content;
        }
        set titleContent(value: Content) {
            this.titleElement.content = value;
        }
    }
    Utils.defineCustomElement('core-dialogTitleBar', DialogTitleBar, 'section');

    //CoreDialogContent
    export class DialogContent extends Primitives.ElementContainer {
    }
    Utils.defineCustomElement('core-dialogContent', DialogContent, 'section');

    //CoreDialogMessage
    export class DialogMessage extends Primitives.ContentContainer {
    }
    Utils.defineCustomElement('core-dialogMessage', DialogMessage);

    //CoreDialog
    export class Dialog extends HTMLDialogElement {
        constructor(title?: Content, contentElements?: HTMLElement[], buttonType?: Forms.ButtonType) {
            super();

            this.returnValue = null;

            this.titleBar = new DialogTitleBar(title);
            this.appendChild(this.titleBar);

            this.content = new DialogContent(...contentElements);
            this.appendChild(this.content);

            this.buttonBar = new Forms.ButtonBar(buttonType);
            this.appendChild(this.buttonBar);
        }

        titleBar: DialogTitleBar;
        content: DialogContent;
        buttonBar: Forms.ButtonBar;
        returnValue: string;
    }
    Utils.defineCustomElement('core-dialog', Dialog, 'dialog');

    //interface dialogs
    export class Dialogs {
    }
}