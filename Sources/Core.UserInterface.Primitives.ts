///<reference path="Core.StringUtils.ts"/>

namespace Core.UserInterface {

    export enum ContentType { Text = 0, HTML = 1 }

    export class Content {
        constructor(value: string, type?: ContentType) {
            type = type || ContentType.Text;

            this.type = type;
            this.value = value;
        }

        value: string;
        type: ContentType;
    }

    export namespace Primitives {

        export class ElementContainer extends HTMLElement {
            constructor(...elements: HTMLElement[]) {
                super();

                this.elements = new Collections.GenericCollection<HTMLElement>(...elements);

                this.elements.itemAddedEvent.attach((item, index) => this.insertElement(item, index));
                this.elements.itemRemovedEvent.attach((item, index) => this.removeElement(item, index));
                this.elements.itemMovedEvent.attach((item, oldIndex, newIndex) => this.moveElement(item, oldIndex, newIndex));
                this.elements.itemChangedEvent.attach((oldItem, newItem, index) => this.changeElement(oldItem, newItem, index));
            }

            elements: Collections.GenericCollection<HTMLElement>;
            private storedPositions = new Collections.GenericDictionary<HTMLElement, number>();

            private insertElement(item: HTMLElement, index: number) {
            }

            private removeElement(item: HTMLElement, index: number) {
            }

            private moveElement(item: HTMLElement, oldIndex: number, newIndex: number) {
            }

            private changeElement(oldItem: HTMLElement, newItem: HTMLElement, index: number) {
            }
        }

        export class ContentContainer extends HTMLElement {

            constructor(content?: Content) {
                super();

                this.content = content || new Content('');
            }

            //ContentElement.content property
            get content() {
                return this._content;
            }
            set content(value: Content) {
                if (!(this.content instanceof Content))
                    throw new TypeError('Parameter "content" is not a valid Core.UserInterface.Content');

                this._content = value;
                this.update();
            }
            _content: Content;

            private update() {
                if (this.content.type == ContentType.Text)
                    this.innerText = this.content.value;
                else if (this.content.type == ContentType.HTML)
                    this.innerHTML = this.content.value;
            }
        }
        Utils.defineCustomElement('core-content', Content);

        export class Label extends ContentContainer {
            //Sets the label text content with a format
            setText(text: string, ...params: any[]) {
                //Set text, passing the parameters through to StringUtils
                this.content = new Content(StringUtils.format(text, ...params));
            }
        }
        Utils.defineCustomElement('core-label', Label);

        //CoreLabelableContainer
        export class LabelableContainer extends HTMLElement {

            private createLabelElement() {
                let labelElement = new Label();
                this.shadow.appendChild(labelElement);

                this.labelElement = labelElement;
            }

            constructor() {
                super();

                this.shadow = Utils.attachShadow(this);
                this.createLabelElement();
            }

            protected shadow: ShadowRoot;
            labelElement: Label;

            //LabelableContainer.labelContent property
            get labelContent() {
                return this.labelElement.content;
            }
            set labelContent(value) {
                this.labelElement.content = value;
            }

            //Sets the label text content with a format
            setLabelText(text: string, ...params: any[]) {
                this.labelElement.setText(text, ...params);
            }
        }
        Utils.defineCustomElement('core-labelableContainer', LabelableContainer);
    }
}