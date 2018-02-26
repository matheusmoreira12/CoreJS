///<reference path="Core.StringUtils.ts"/>
var Core;
(function (Core) {
    var UserInterface;
    (function (UserInterface) {
        let ContentType;
        (function (ContentType) {
            ContentType[ContentType["Text"] = 0] = "Text";
            ContentType[ContentType["HTML"] = 1] = "HTML";
        })(ContentType = UserInterface.ContentType || (UserInterface.ContentType = {}));
        class Content {
            constructor(value, type) {
                type = type || ContentType.Text;
                this.type = type;
                this.value = value;
            }
        }
        UserInterface.Content = Content;
        let Primitives;
        (function (Primitives) {
            class ElementContainer extends HTMLElement {
                constructor(...elements) {
                    super();
                    this.storedPositions = Core.Collections.GenericDictionary();
                    this.elements = new Core.Collections.GenericCollection(...elements);
                    this.elements.itemAddedEvent.attach((item, index) => this.insertElement(item, index));
                    this.elements.itemRemovedEvent.attach((item, index) => this.removeElement(item, index));
                    this.elements.itemMovedEvent.attach((item, oldIndex, newIndex) => this.moveElement(item, oldIndex, newIndex));
                    this.elements.itemChangedEvent.attach((oldItem, newItem, index) => this.changeElement(oldItem, newItem, index));
                }
                insertElement(item, index) {
                }
                removeElement(item, index) {
                }
                moveElement(item, oldIndex, newIndex) {
                }
                changeElement(oldItem, newItem, index) {
                }
            }
            Primitives.ElementContainer = ElementContainer;
            class ContentContainer extends HTMLElement {
                constructor(content) {
                    super();
                    this.content = content || new Content('');
                }
                //ContentElement.content property
                get content() {
                    return this._content;
                }
                set content(value) {
                    if (!(this.content instanceof Content))
                        throw new TypeError('Parameter "content" is not a valid Core.UserInterface.Content');
                    this._content = value;
                    this.update();
                }
                update() {
                    if (this.content.type == ContentType.Text)
                        this.innerText = this.content.value;
                    else if (this.content.type == ContentType.HTML)
                        this.innerHTML = this.content.value;
                }
            }
            Primitives.ContentContainer = ContentContainer;
            UserInterface.Utils.defineCustomElement('core-content', Content);
            class Label extends ContentContainer {
                //Sets the label text content with a format
                setText(text, ...params) {
                    //Set text, passing the parameters through to StringUtils
                    this.content = new Content(Core.StringUtils.format(text, ...params));
                }
            }
            Primitives.Label = Label;
            UserInterface.Utils.defineCustomElement('core-label', Label);
            //CoreLabelableContainer
            class LabelableContainer extends HTMLElement {
                constructor() {
                    super();
                    this.shadow = UserInterface.Utils.attachShadow(this);
                    this.createLabelElement();
                }
                createLabelElement() {
                    let labelElement = new Label();
                    this.shadow.appendChild(labelElement);
                    this.labelElement = labelElement;
                }
                //LabelableContainer.labelContent property
                get labelContent() {
                    return this.labelElement.content;
                }
                set labelContent(value) {
                    this.labelElement.content = value;
                }
                //Sets the label text content with a format
                setLabelText(text, ...params) {
                    this.labelElement.setText(text, ...params);
                }
            }
            Primitives.LabelableContainer = LabelableContainer;
            UserInterface.Utils.defineCustomElement('core-labelableContainer', LabelableContainer);
        })(Primitives = UserInterface.Primitives || (UserInterface.Primitives = {}));
    })(UserInterface = Core.UserInterface || (Core.UserInterface = {}));
})(Core || (Core = {}));
