//Register module Core.UserInterface.Primitives
Core.Modules.registerModule("Core.UserInterface.Primitives", function () {

    var _primitives = this;

    //CoreLabel
    var CoreLabel_prototype = Object.create(HTMLLabelElement.prototype);

    CoreLabel_prototype.createdCallback = function () {
        Object.defineProperties(this, {
            "text": {
                get: function () {
                    return this.innerText || this.textContent;
                },
                set: function (value) {
                    if (Core.TypeChecking.isUndefined(this.innerText))
                        this.textContent = value;
                    else
                        this.innerText = value;
                }
            }
        });
    }

    CoreLabel_prototype.setText = function (text, params) {
        //Set text passing the parameters through
        this.text = Core.StringManipulator.includeParams.apply(null, arguments)
    }

    this.CoreLabel = Core.UserInterface.register("core-label", CoreLabel_prototype, "label");

    //CoreLabelableContainer
    var CoreLabelableContainer_prototype = Object.create(HTMLElement.prototype);
    CoreLabelableContainer_prototype.createdCallback = function () {
        this._shadowRoot = this.createShadowRoot();

        //Create and associate label
        this._labelElement = new _primitives.CoreLabel();
        this._shadowRoot.appendChild(this._labelElement);

        Object.defineProperty(this, "label", {
            set: function (value) {
                this._labelElement.text = value;
            }, get: function (value) {
                return this._labelElement.text;
            }
        });
    }

    CoreLabelableContainer_prototype.setLabel = function (text, params) {
        this.label = "";

        //Set label text passing the parameters through
        this._labelElement.setText.apply(this._labelElement, arguments);
    }

    this.CoreLabelableContainer = Core.UserInterface.register("core-labelablecontainer", CoreLabelableContainer_prototype);

    //CoreElementContainer
    CoreElementContainer_prototype = Object.create(HTMLElement.prototype);

    CoreElementContainer_prototype.createdCallback = function () {
        this.elements = [];
    }

    CoreElementContainer_prototype.addElement = function (elem) {
        try {
            this.elements.push(elem);
            this.appendChild(elem);
        }
        catch (err) {
            core.debugging.error("Core: Invalid operation.", err);
        }
    }

    CoreElementContainer_prototype.addElements = function (arr) {
        if (Core.TypeChecking.isObject(arr))
            arr.forEach(function (elem) {
                this.addElement(elem)
            }, this);
        else
            core.debugging.error("Core: Cannot add elements to this container. Parameter <arr> is not a"
                + " valid array.");
    }

    CoreElementContainer_prototype.addMessage = function (str) {
        var message = new Core.UserInterface.CoreDialogMessage();
        message.innerText = str;
        this.addElement(message);
    }

    CoreElementContainer_prototype.removeElement = function (elem) {
        var index = this.elements.indexOf(elem);
        if (index >= 0)
            this.elements.splice(index, 1);
        else
            core.debugging.warning("Core: Cannot remove specified element. Make sure the element belongs to this" +
                " container.");
    }

    CoreElementContainer_prototype.insertElementBefore = function (elem) {
        var index = this.elements.indexOf(elem);
        if (index >= 0)
            this.elements.splice(index, 1);
        else
            core.debugging.warning("Core: Cannot insert before specified element. Make sure the element belongs to"
                + " this container.");
    }

    this.CoreElementContainer = Core.UserInterface.register("core-elementcontainer", CoreElementContainer_prototype);
});