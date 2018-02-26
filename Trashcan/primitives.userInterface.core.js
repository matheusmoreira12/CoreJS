//Register module Core.UserInterface.Primitives
$export("Core.UserInterface.Primitives", function () {

    const primitives = this;

    //CoreLabel
    this.CoreLabel = class CoreLabel extends HTMLLabelElement {

        get text() {
            return this.innerText || this.textContent;
        }
        set text(value) {
            if (Core.TypeChecking.isUndefined(this.innerText))
                this.textContent = value;
            else
                this.innerText = value;
        }

        setText(text, params) {
            //Set text passing the parameters through
            this.text = Core.StringManipulator.includeParams.apply(null, arguments)
        }
    }

    customElements.define("core-label", primitives.CoreLabel, { extends: "label" });

    //CoreLabelableContainer
    this.CoreLabelableContainer = class CoreLabelableContainer extends HTMLElement {
        constructor() {
            super();
            
            this._shadowRoot = this.createShadowRoot();

            //Create and associate label
            this._labelElement = new _primitives.CoreLabel();
            this._shadowRoot.appendChild(this._labelElement);
        }

        setLabel(text, params) {
            this.label = "";

            //Set label text passing the parameters through
            this._labelElement.setText.apply(this._labelElement, arguments);
        }

        get label() {
            return this._labelElement.text;
        }
        set label(value) {
            this._labelElement.text = value;
        }       
    }

    customElements.define("core-labelablecontainer", primitives.CoreLabelableContainer);

    //CoreElementContainer
    this.CoreElementContainer = class CoreElementContainer extends HTMLElement {
        constructor() {
            super();
            
            this._shadowRoot = this.createShadowRoot();
        }
        
        addElement(elem) {
            if (!(elem instanceof HTMLElement))
                throw new TypeError('Parameter "elem" is not a valid HTMLElement.')
            
            this._shadowRoot.appendChild(elem);
        }

        addElements(elems) {
            if (!(elems instanceof Array))
                throw new TypeError('Parameter "arr" is not a valid Array.');
            
            for (var i = 0; i < elems.length; i++)
                this.addElement(elems[i]);
        }

        insertElementBefore(elem, insertBefore) {
            if (!(elem instanceof HTMLElement))
                throw new TypeError('Parameter "elem" is not a valid HTMLElement.')
            if (!(elem instanceof HTMLElement))
                throw new TypeError('Parameter "insertBefore" is not a valid HTMLElement.')

            this._shadowRoot.insertBefore(elem, insertBefore);
        }

        removeElement(elem) {
            if (!(elem instanceof HTMLElement))
                throw new TypeError('Parameter "elem" is not a valid HTMLElement.')
                
            this._shadowRoot.removeChild(elem);
        }

        removeElements(elems) {
            if (!(elems instanceof Array))
                throw new TypeError('Parameter "arr" is not a valid Array.');
            
            for (var i = 0; i < elems.length; i++)
                this.removeElement(elems[i]);
        }
    }

    customElements.define("core-elementcontainer", primitives.CoreElementContainer);
});