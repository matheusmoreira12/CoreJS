//Register module Core.UserInterface
$export("Core.UserInterface", function () {
    var _userInterface = this;

    //Progress pipe
    this.ProgressPipe = function (progressBar) {
        var _progressPipe = this;

        //internal declarations
        this.progressBars = [];

        //public declarations
        this.addProgressBar = function (progressBar) {
            this.progressBars.push(progressBar);
        }

        this.progressListener = function (evt) {
            _progressPipe.progressBars.forEach(function (pb) {
                pb.min = 0;
                pb.max = evt.total;
                pb.value = evt.loaded;
            });
        }
    }

    //polyfill for the <HTMLDialogElement> tag
    if (!window.HTMLDialogElement) {
        var HTMLDialogElement_prototype = Object.create(HTMLElement.prototype);

        HTMLDialogElement_prototype.show = function () {
            this.style.display = "inline-block";
            this.style.margin = "auto";
        }
        HTMLDialogElement_prototype.showModal = function () {
            this.show();
        }
        HTMLDialogElement_prototype.close = function () {
            this.style.display = "none";
        }

        window.HTMLDialogElement = HTMLElement;
        Object.setPrototypeOf(HTMLDialogElement, HTMLDialogElement_prototype);
    }

    //Draggability class
    //make a control moveable (draggable)
    this.Draggability = function (elem, moveBar) {
        var draggability = this;

        this.elem = elem;
        this.moveBar = moveBar;

        this.moving = false;
        //element position offset
        this.offsetX = 0;
        this.offsetY = 0;
        //cursor offset
        this.curOffsetX = 0;
        this.curOffsetY = 0;

        //warn about layout disturbance problems
        if (/relative/.test(elem.style.position))
            core.debugging.warning("Core: please note that making a relatively-positioned control moveable might"
                + " disturb your intended layout.")

        //check if element is not absolutely positioned
        if (!/absolute/.test(elem.style.position) && !/fixed/.test(elem.style.position))
            //make it relatively-positioned
            elem.style.position = "relative";

        //remove margin and position the element relative
        elem.style.left = draggability.elem.offsetLeft;
        elem.style.top = draggability.elem.offsetTop;
        elem.style.margin = "0";

        //stop moving when mouseup is fired
        function mouseUp() {
            //remove event listeners
            window.removeEventListener("mouseup", mouseUp);
            window.removeEventListener("mousemove", mouseMove);
        }

        //update drag position every time the cursor moves
        function mouseMove() {
            with (draggability) {
                elem.style.left = offsetX + event.pageX - curOffsetX + "px";
                elem.style.top = offsetY + event.pageY - curOffsetY + "px";
            }
        }

        //start moving when mousedown is fired
        function mouseDown() {
            with (draggability) {
                //store position offset
                offsetX = elem.style.left.replace("px", "") * 1;
                offsetY = elem.style.top.replace("px", "") * 1;

                //store cursor offset
                curOffsetX = event.pageX;
                curOffsetY = event.pageY;
            }

            //add event listeners for drag-stop
            window.addEventListener("mouseup", mouseUp);
            window.addEventListener("mousemove", mouseMove);
        }
        moveBar.addEventListener("mousedown", mouseDown);
    }

    //Register Element utility
    this.register = function (name, prototype, extend) {
        if (!name)
            return;
        return document.registerElement(name, {
            prototype: prototype,
            extends: extend
        });
    }
/*
    //Custom Components

    //CoreSelect
    var CoreSelect_prototype = Object.create(HTMLElement.prototype);

    CoreSelect_prototype.createdCallback = function () {
        //enable tabing
        this.tabIndex = -1;

        //Create a shadow root
        this.shadowRoot = this.createShadowRoot();

        //create and append value element
        this.valueElement = new core.userInterface.CoreSelectValue();
        this.shadowRoot.appendChild(this.valueElement)

        //create and append list element
        this.listElement = new core.userInterface.CoreSelectList();
        this.shadowRoot.appendChild(this.listElement);

        //internal flag for allowing multiple selection
        this.allowMultipleSelection = false;

        //options list
        this.options = [];

        //selected indexes list
        this.selected = [];

        this.addOption = function (value, text) {
            var options = this.options;

            var optionElement = new core.userInterface.CoreSelectOption();
            optionElement.innerText = text;
            optionElement.value = value;
            optionElement.selectElement = this;
            //get index for this option
            optionElement.index = options.length;

            this.listElement.appendChild(optionElement);

            var option = {
                value: value,
                text: text
            }
            option = { element: optionElement };

            options.push(option);
        }

        //removes an option
        this.removeOption = function (index) {
            if (index < 0 || index >= this.options.length)
                return;

            var option = this.options[index];
            option.element.remove();

            this.options.splice(index, 1);
        }

        //updates the selection display
        this.updateSelection = function () {
            for (var i = 0; i < this.options.length; i++)
                //check if option is included
                this.options[i].element.selected = (this.selected.includes(i));

            if (this.selected.length > 1)
                this.valueElement.innerText = this.selected.length + " �tens selecionados";
            else if (this.selected.length == 0)
                this.valueElement.innerText = "Selecione";
            else
                this.valueElement.innerText = this.options[this.selected[0]].text;
        }

        //internal function for removing an index from the selection
        this.removeFromSelection = function (index) {
            var i = this.selected.indexOf(index)

            if (i >= 0)
                this.selected.splice(i, 1);
        }

        //internal function adding an index to the selection
        this.addToSelection = function (index) { this.selected.push(index); }

        //internal function for toggling the selection on an item index
        this.toggleSelection = function (index) {
            var alreadySelected = this.selected.includes(index);

            if (alreadySelected)
                this.removeFromSelection.call(this, index);
            else
                this.addToSelection.call(this, index);
        }

        //selects an option
        this.selectOption = function (index, multipleSelection) {
            if (index < 0 || index >= this.options.length)
                return;

            var doMultipleSelection = this.allowMultipleSelection && multipleSelection;

            if (doMultipleSelection)
                this.toggleSelection.call(this, index);
            else {
                this.selected = [];
                this.addToSelection.call(this, index);
            }

            //update selection
            this.updateSelection.call(this);
        }

        //internal flag which indicates wether this combo input is expanded
        this.expanded = false;

        function onblur() {
            //close this combo input on blur
            this.expanded = false;

            this.removeEventListener("blur", onblur);
        }

        function onmousedown() {
            //close this combo input on mouse down
            this.expanded = true;

            this.addEventListener("blur", onblur);
        }
        this.addEventListener("mousedown", onmousedown);

        //updates visually the input size
        this.updateSize = function () { this.valueElement.style.width = this.size + "em"; }
    }

    CoreSelect_prototype.attributeChangedCallback = function (attrName, oldVal, newVal) {
        if (attrName == "core-expanded")
            this.expanded = (newVal != "false");

        if (attrName == "core-allowmultipleselection")
            this.allowMultipleSelection = (newVal != "false");

        if (attrName == "core-size") {
            this.size = newVal;
            this.updateSize.call(this);
        }
    }

    Object.defineProperties(CoreSelect_prototype, {
        "expanded": {
            get: function () {
                return this.expanded;
            },
            set: function (value) {
                this.expanded = value;

                if (value == true)
                    this.setAttribute("core-expanded", "");
                else
                    this.removeAttribute("core-expanded");
            }
        },
        "allowMultipleSelection": {
            get: function () {
                return this.allowMultipleSelection;
            },
            set: function (value) {
                this.allowMultipleSelection = value;

                this.setAttribute("core-allowmultipleselection", value);
            }
        },
        "size": {
            get: function () {
                return this.size;
            },
            set: function (value) {
                if (isNaN(value)) {
                    core.debugging.warning("Core: Warning: The size specified is not a valid number.");
                    return;
                }
                else if (value < 3) {
                    core.debugging.warning("Core: Warning: The size specified is too small. No changes were made.");
                    return;
                }

                this.size = value;
                this.updateSize.call(this);

                this.setAttribute("core-size", value);
            }
        },
    });

    this.CoreSelect = _userInterface.register("core-select", CoreSelect_prototype);

    var CoreSelectValue_prototype = Object.create(HTMLElement.prototype);

    this.CoreSelectValue = _userInterface.register("core-selectvalue", CoreSelectValue_prototype);

    var CoreSelectList_prototype = Object.create(HTMLUListElement.prototype);

    this.CoreSelectList = _userInterface.register("core-selectlist", CoreSelectList_prototype, "ul");

    var CoreSelectOption_prototype = Object.create(HTMLLIElement.prototype);

    CoreSelectOption_prototype.createdCallback = function () {
        this.selected = false;
        this.selectElement = null;
        this.value = null;
        this.index = -1;

        function onmouseup(event) {
            var selectElement = this.selectElement;

            //select option
            selectElement.selectOption(this.index, event.shiftKey);

            var doMultipleSelection = selectElement.allowMultipleSelection && event.shiftKey;

            if (!doMultipleSelection)
                //hide menu
                selectElement.expanded = false;
        }
        this.addEventListener("mouseup", onmouseup);
    }

    CoreSelectOption_prototype.attributeChangedCallback = function (attrName, oldVal, newVal) {
        if (attrName == "core-selected")
            this.selected = (newVal != "false");

        if (attrName == "core-value")
            this.value = newVal;
    }

    Object.defineProperties(CoreSelectOption_prototype, {
        "selected": {
            get: function () {
                return this.selected;
            },
            set: function (value) {
                this.selected = value;

                if (value == true)
                    this.setAttribute("core-selected", "");
                else
                    this.removeAttribute("core-selected");
            }
        },

        "value": {
            get: function () {
                return this.value;
            },
            set: function (value) {
                this.value = value;

                this.setAttribute("core-value", value);
            }
        }
    });

    this.CoreSelectOption = _userInterface.register("core-selectoption", CoreSelectOption_prototype, "li");

    //CoreTitleTooltip
    var CoreTitleTooltip_prototype = Object.create(HTMLElement.prototype);

    this.CoreTitleTooltip = _userInterface.register("core-titletooltip", CoreTitleTooltip_prototype);
    //CoreHGroup
    var CoreHGroup_prototype = Object.create(HTMLElement.prototype);
    CoreHGroup_prototype.createdCallback = function () {
        this.itemElements = [];
    }

    Object.defineProperty(CoreHGroup_prototype, "items", {
        set: function (value) {
            //array sync callbacks
            function removeItemCallback(removedItem, index) {
                removedItem.remove();
            }

            function insertItemCallback(src, index) {
                var item = new _userInterface.CoreHGroupItem();
                item.readFromObject(src[index]);
                this.appendChild(item);
                return item;
            }

            function changeItemCallback(src, dest, index) {
                dest[index].readFromObject(src[index]);
            }

            //sync <items> array with <arr> array
            core.arrayMan.syncArrays(value, this.itemElements, removeItemCallback, insertItemCallback, changeItemCallback, this);
        }
    });

    this.CoreHGroup = _userInterface.register("core-hgroup", CoreHGroup_prototype);

    //CoreHGroupItem
    var CoreHGroupItem_prototype = Object.create(HTMLElement.prototype);
    CoreHGroupItem_prototype.element = null;

    CoreHGroupItem_prototype.readFromObject = function (obj) {
        //if an element is already present, remove it
        if (this.element !== null)
            this.element.remove();
        //append new element
        this.appendChild(this.element = obj.element);

        //set label if needed
        if (!!obj.label)
            this.label = obj.label;
    }

    this.CoreHGroupItem = _userInterface.register("core-hgroupitem", CoreHGroupItem_prototype);

    //shorthand for creating a <CoreHGroup>
    this.createCoreHGroup = function (items) {
        var hGroup = new _userInterface.CoreHGroup();
        hGroup.items = items;
        return hGroup;
    }


    this.initialize = function () {
    }*/
});