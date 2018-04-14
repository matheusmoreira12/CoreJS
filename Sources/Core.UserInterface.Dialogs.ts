namespace Core.UserInterface.Dialogs {

    //CoreDialogTitle
    export class DialogTitle extends Primitives.ContentContainer {
    }
    customElements.define('core-dialogtitle', DialogTitle);

    //CoreDialogTitleBar
    export class DialogTitleBar extends HTMLDialogElement {
        constructor() {
            super();

            this._titleElement = <DialogTitle>document.createElement("core-dialogtitle");
            this.appendChild(this._titleElement);

            this._closeButtonElement = <CloseButton>document.createElement("core-closebutton");
            this.appendChild(this._closeButtonElement);
        }

        _titleElement: DialogTitle;
        _closeButtonElement: CloseButton;

        get titleContent(): Content {
            return this._titleElement.content;
        }
        set titleContent(value: Content) {
            this._titleElement.content = value;
        }
    }
    customElements.define('core-dialogtitlebar', DialogTitleBar, { extends: "section" });

    //CoreDialogContent
    export class DialogContent extends Primitives.ElementContainer {
    }
    customElements.define('core-dialogcontent', DialogContent, { extends: "section" });

    //CoreDialogMessage
    export class DialogMessage extends Primitives.ContentContainer {
    }
    customElements.define('core-dialogmessage', DialogMessage, { extends: "section" });

    //CoreDialog
    export class Dialog extends HTMLDialogElement {
        constructor() {
            super();

            this.returnValue = null;

            this._titleBarElement = <DialogTitleBar>document.createElement("core-dialogtitlebar");
            this.appendChild(this._titleBarElement);

            this._contentElement = <DialogContent>document.createElement("core-dialogcontent");
            this.appendChild(this._contentElement);

            this._buttonBarElement = <Forms.ButtonBar>document.createElement("core-buttonbar");
            this.appendChild(this._buttonBarElement);
        }

        get dialogTitle(): Content {
            return this._titleBarElement.titleContent;
        }
        set dialogTitle(value: Content) {
            this._titleBarElement.titleContent = value;
        }

        get messageElements(): Primitives.ElementList {
            return this._contentElement.elements;
        }

        get buttonBarElements() {
            return this._buttonBarElement.elements;
        }

        _titleBarElement: DialogTitleBar;
        _contentElement: DialogContent;
        _buttonBarElement: Forms.ButtonBar;
        returnValue: string;
    }
    customElements.define('core-dialog', Dialog, { extends: "dialog" });

    //interface dialogs
    export class Dialogs {
    }
}