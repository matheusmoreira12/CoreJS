Core.Modules.modifyModule("Core.UserInterface", function () {

    //CoreInput
    var CoreInput_prototype = Core.ObjectManipulator.inherit(Core.UserInterface.Primitives.CoreLabelableContainer.prototype);

    CoreInput_prototype.createdCallback = function () {
        this._base.createdCallback.call(this);

        this._inputElement = document.createElement("input");
        this._shadowRoot.appendChild(this._inputElement);

        with (this.labelElement) {
            function inputElementFocus() {
                focused = true;
            }

            function inputElementBlur() {
                focused = false;
            }
        }

        this._inputElement.addEventListener("focus", inputElementFocus);
        this._inputElement.addEventListener("blur", inputElementBlur);

        //Reflect all the input properties through
        core.objectMan.reflectProperties(this, this._inputElement, ["type", "accept", "autocomplete", "autofocus",
            "autosave", "checked", "disabled", "form", "formaction", "formenctype", "formmethod", "formnovalidate", "formtarget",
            "height", "inputmode", "list", "max", "maxlength", "min", "minlength", "multiple", "pattern", "placeholder", "readonly",
            "required", "selectionDirection", "size", "spellcheck", "src", "step", "tabindex", "value", "width"]);
    }

    this.CoreInput = Core.UserInterface.register("core-input", CoreInput_prototype);
    
}, ["Core.UserInterface.Primitives"]);