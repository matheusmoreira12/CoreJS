///<reference path="Core.UserInterface.ts"/>

namespace Core.UserInterface.Primitives {

    export class ElementList extends Collections.Generic.List<HTMLElement> {
        public constructor(parentContainer: ElementContainer, original: HTMLElement[]);
        public constructor(parentContainer: ElementContainer);
        public constructor(parentContainer: ElementContainer, original?: HTMLElement[]) {
            super(original);

            this.parentContainer = parentContainer;
        }

        public add(item: HTMLElement): void {
            Validation.RuntimeValidator.validateParameter("item", item, HTMLElement, true);

            super.add.apply(this, ...arguments);
        }
        public addMultiple(items: HTMLElement[]): void {
            Validation.RuntimeValidator.validateArrayParameter("items", items, HTMLElement, false);

            super.addMultiple.apply(this, ...arguments);
        }
        public insert(item: HTMLElement): void {
            Validation.RuntimeValidator.validateParameter("item", item, HTMLElement, true);

            super.insert.apply(this, ...arguments);
        }
        public insertMultiple(items: HTMLElement[]): void {
            Validation.RuntimeValidator.validateArrayParameter("items", items, HTMLElement, false);

            super.insertMultiple.apply(this, ...arguments);
        }
        public replace(oldItem: HTMLElement, newItem: HTMLElement): void {
            Validation.RuntimeValidator.validateParameter("newItem", newItem, HTMLElement, true);

            super.replace.apply(this, ...arguments);
        }
        public replaceAt(index: number, newItem: HTMLElement): HTMLElement {
            Validation.RuntimeValidator.validateParameter("newItem", newItem, HTMLElement, true);

            return super.replaceAt.apply(this, ...arguments);
        }

        parentContainer: ElementContainer;
    }

    export class ElementContainer extends HTMLElement {
        constructor() {
            super();

            this.attachShadow({ mode: "open" });

            this.elements = new ElementList(this);

            this.elements.itemAddedEvent.attach(this._onElementAdded);
            this.elements.itemRemovedEvent.attach(this._onElementRemoved);
            this.elements.itemChangedEvent.attach(this._onElementChanged);
        }

        private _adoptElement(elem: HTMLElement, index: number) {
            if (index == 0 || this.shadowRoot.childElementCount <= 1)
                this.shadowRoot.appendChild(elem);
            else {
                let refChild = this.children.item(index + 1);
                this.shadowRoot.insertBefore(elem, refChild);
            }
        }

        private _rejectElement(elem: HTMLElement) {
            this.shadowRoot.removeChild(elem);
        }

        private _onElementAdded(target: ElementList, args: Collections.Generic.ListEventArgs<HTMLElement>) {
            target.parentContainer._adoptElement(args.newItem, args.newIndex);
        }

        private _onElementChanged(target: ElementList, args: Collections.Generic.ListEventArgs<HTMLElement>) {
            target.parentContainer._rejectElement(args.oldItem);
            target.parentContainer._adoptElement(args.newItem, args.newIndex);
        }

        private _onElementRemoved(target: ElementList, args: Collections.Generic.ListEventArgs<HTMLElement>) {
            target.parentContainer._rejectElement(args.oldItem);
        }

        elements: ElementList;
    }

    export class ContentContainer extends HTMLElement {
        constructor() {
            super();
        }
        //ContentElement.content property
        get content() {
            return this._content;
        }
        set content(value: Content) {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("value", value, Content);

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

    //CoreLabelableContainer
    export class LabelableContainer extends HTMLElement {
        private createLabelElement() {
            let labelElement = new Label();
            this.shadow.appendChild(labelElement);
            this.labelElement = labelElement;
        }
        constructor() {
            super();
            this.shadow = this.attachShadow({ mode: "open" });
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
    customElements.define('core-labelablecontainer', LabelableContainer);

    //List Item event
    export type ElementContainerEventArgs = {
        oldItem: HTMLElement,
        newItem: HTMLElement,
        oldIndex: number,
        newIndex: number
    };
    export type ElementContainerEventListener = (target: ElementContainer,
        args: ElementContainerEventArgs) => void;

    export class ElementContainerEvent extends MethodGroup {
        constructor(target: ElementContainer, defaultListener?: ElementContainerEventListener) {
            super(target);
        }

        target: any;

        attach(listener: ElementContainerEventListener | ElementContainerEvent) {
            super.attach(listener);
        }

        detach(listener: ElementContainerEventListener | ElementContainerEvent) {
            super.detach(listener);
        }

        invoke(args: ElementContainerEventArgs) {

            super.invoke(args);
        }
    }
}
