Core.Modules.modifyModule('Core.UserInterface', function () {
    
    //CoreDialogTitle
    var CoreDialogTitle_prototype = Object.create(HTMLElement.prototype);

    this.CoreDialogTitle = Core.UserInterface.register('core-dialogtitle', CoreDialogTitle_prototype);

    //CoreDialogTitleBar
    var CoreDialogTitleBar_prototype = Object.create(HTMLElement.prototype);
    CoreDialogTitleBar_prototype.titleElement = null;
    CoreDialogTitleBar_prototype.closeButton = null;

    CoreDialogTitleBar_prototype.createdCallback = function () {
        this.titleElement = new Core.UserInterface.CoreDialogTitle();
        this.appendChild(this.titleElement);

        this.closeButton = new Core.UserInterface.CoreCloseButton();
        this.appendChild(this.closeButton);
    }

    CoreDialogTitleBar_prototype.setTitle = function (str) {
        this.titleElement.innerText = str;
    }

    this.CoreDialogTitleBar = Core.UserInterface.register('core-dialogtitlebar', CoreDialogTitleBar_prototype);

    //CoreDialogContent
    var CoreDialogContent_prototype = Object.create(Core.UserInterface.Primitives.CoreElementContainer.prototype);

    this.CoreDialogContent = Core.UserInterface.register('core-dialogcontent', CoreDialogContent_prototype);

    //CoreDialogMessage
    var CoreDialogMessage_prototype = Object.create(HTMLElement.prototype);

    this.CoreDialogMessage = Core.UserInterface.register('core-dialogmessage', CoreDialogMessage_prototype);

    //CoreFormItem
    var CoreFormItem_prototype = Object.create(Core.UserInterface.Primitives.CoreLabelableContainer.prototype);
    CoreFormItem_prototype.createdCallback = function () {
    }

    //internal declarations
    CoreFormItem_prototype.element = null;

    //public declarations
    Object.defineProperty(CoreFormItem_prototype, 'element', {
        get: function () {
            return this.element;
        }, set: function (value) {
            //remove old element
            if (this.element != null)
                this.element.remove();
            //append new element
            this.appendChild(this._element)
            this.element = value;
        }
    });

    this.CoreFormItem = Core.UserInterface.register('core-formitem', CoreFormItem_prototype);

    //CoreDialogButtonBar
    var CoreDialogButtonBar_prototype = Object.create(HTMLElement.prototype);
    CoreDialogButtonBar_prototype.createdCallback = function () {
        this.buttonElements = [];
    }

    CoreDialogButtonBar_prototype.defaultButton = null;

    Object.defineProperty(CoreDialogButtonBar_prototype, 'buttons', {
        set: function (value) {
            //update button attributes
            function updateButton(button, buttonType, defaultValue) {
                //check if button is an icon button
                if (!Core.TypeChecking.isUndefined(button.icon)) {
                    //give it an icon
                    button.icon = buttonType.icon;
                    //give it some text
                    button.text = buttonType.text;
                }
                else
                    //give button some text
                    button.innerText = buttonType.text;

                //give button title, type, name and value
                button.title = buttonType.title || '';
                button.type = buttonType.type || '';
                button.value = buttonType.value || 0;

                //determine if the button is supposed to be default
                if (buttonType.value == defaultValue) {
                    this.defaultButton = this;
                    button.default = true;
                }
            }

            //array sync callbacks
            function removeButtonCallback(removedItem, index) {
                removedItem.remove();
            }

            function insertButtonCallback(src, index) {
                var button,
                    obj = src[index];

                if (Core.TypeChecking.isObject(obj)) {
                    if (!!obj.icon)
                        button = new Core.UserInterface.CoreIconButton();
                    else
                        //create and assign a new button to <button>
                        button = new Core.UserInterface.CoreButton();

                    //update the button
                    updateButton(button, obj);
                }
                else
                    core.debugging.warning('Core: Invalid data for dialog button descriptor object. The requested '
                        + ' button will not be displayed correctly.')

                delete obj;

                //append the button
                this.appendChild(button);
                return button;
            }

            function changeButtonCallback(src, dest, index) {
                //update the button
                updateButton(dest[index], src[index]);
            }

            //sync <buttonElements> array with <value> array attribute
            core.arrayMan.syncArrays(value, this.buttonElements, removeButtonCallback, insertButtonCallback, changeButtonCallback, this);
        }
    });

    this.CoreDialogButtonBar = Core.UserInterface.register('core-dialogbuttonbar', CoreDialogButtonBar_prototype);

    //CoreDialog
    var CoreDialog_prototype = Object.create(HTMLDialogElement.prototype);
    CoreDialog_prototype.titleBar = null;
    CoreDialog_prototype.content = null;
    CoreDialog_prototype.buttonBar = null;
    CoreDialog_prototype.draggabilityInstance = null;

    CoreDialog_prototype.createdCallback = function () {
        this.returnValue = -1;

        this.titleBar = new Core.UserInterface.CoreDialogTitleBar();
        this.appendChild(this.titleBar);

        this.content = new Core.UserInterface.CoreDialogContent();
        this.appendChild(this.content);

        this.buttonBar = new Core.UserInterface.CoreDialogButtonBar();
        this.appendChild(this.buttonBar);
    }

    this.CoreDialog = Core.UserInterface.register('core-dialog', CoreDialog_prototype, 'dialog');

    //interface dialogs
    this.Dialogs = new function () {
        this.DialogButtonType = function (value, text, options) {
            this.value = value;
            this.text = text;
            
            options = options || {};
            
            this.title = options.title || '';
            this.icon = options.icon || null;
        }
        
        this.DialogButtonTypes = function (buttonTypes, defaultValue) {
            this.buttonTypes = buttonTypes;
            this.defaultValue = defaultValue;
        }
        
        var dialogButtonTypes = {
            yesNo: new this.DialogButtonTypes([
                new this.DialogButtonType(0, 'yes'), 
                new this.DialogButtonType(1, 'no')], 1),

            yesNoCancel: new this.DialogButtonTypes([
                new this.DialogButtonType(0, 'yes'), 
                new this.DialogButtonType(1, 'no'), 
                new this.DialogButtonType(2, 'cancel')], 2),

            yesCancel: new this.DialogButtonTypes([
                new this.DialogButtonType(0, 'yes'), 
                new this.DialogButtonType(1, 'cancel')], 1),

            noCancel: new this.DialogButtonTypes([
                new this.DialogButtonType(0, 'no'), 
                new this.DialogButtonType(1, 'cancel')], 1),

            ok: new this.DialogButtonTypes([
                new this.DialogButtonType(0, 'ok')], 0),

            okCancel: new this.DialogButtonTypes([
                new this.DialogButtonType(0, 'ok'), 
                new this.DialogButtonType(1, 'cancel')], 1)
            };
        
        Object.defineProperty(this, 'dialogButtonTypes', { 
            get: function () { 
                return dialogButtonTypes; 
            }});

        //open a dialog
        //<flags>: <object { title, Array elements | message, [Array buttons], [function resultCallback],
        //[closeButton = true], [draggable = true], [removeWhenDone = true], [Object animation = core.animation.presetKeyframes.fadeIn] }>
        function openDialog(flags, callback, modal) {
            flags = flags || {};
            
            var dialog = new Core.UserInterface.CoreDialog();

            const DEFAULT_OPEN_ANIM_DURATION = 218,
                DEFAULT_CLOSE_ANIM_DURATION = 218;

            //set dialog title
            dialog.titleBar.setTitle(flags.title);

            function closeDialog() {
                //POTENTIALLY UGLY hack: callback for closing when animation completes
                function closeAnimationEnd() {
                    dialog.close();

                    //remove dialog draggability
                    if (dialog.draggabilityInstance != null)
                        dialog.draggabilityInstance = dialog.draggabilityInstance.release();

                    //detect if dialog should be removed after closing
                    if (flags.removeWhenDone != false) {
                        dialog.remove();
                        dialog = dialog.release();
                    }
                }

                //Check close animation flag and validate it
                var closeAnimationKeyframes = flags.closeAnimationKeyframes || core.animation.presetKeyframes.fadeOut,
                    closeAnimationDuration = flags.closeAnimationDuration || DEFAULT_CLOSE_ANIM_DURATION;

                with (dialog.animate(closeAnimationKeyframes, closeAnimationDuration))
                    onfinish = closeAnimationEnd;

                //Check if a function is to be called back when the dialog is closed
                if (Core.TypeChecking.isFunction(flags.returnCallback))
                    flags.returnCallback.call(dialog, dialog.returnValue);
            }

            //Check if a close button is required
            if (flags.closeButton == false)
                dialog.titleBar.closeButton.remove();
            else
                //define onclick for close button
                dialog.titleBar.closeButton.onclick = closeDialog;

            //check if <flags.message> is not undefined
            if (!Core.TypeChecking.isUndefined(flags.message))
                //set dialog message
                dialog.content.addMessage(flags.message);
                //check if <flags.elements> is an array
            else if (Core.TypeChecking.isObject(flags.elements))
                //add elements to dialog content
                dialog.content.addElements(flags.elements);
            else
                core.debugging.error('Core: Cannot define dialog content. property <flags.message> is not defined, and obligatory property <flags.elements>'
                    + ' is not a valid array.');

            function dialogButtonClicked() {
                closeDialog();
                dialog.returnValue = this.value;
            }
            //check if there are dialog buttons
            if (!!flags.buttons) {
                //set the buttons
                dialog.buttonBar.buttons = flags.buttons;

                //catch the 'onclick' event of each button
                dialog.buttonBar.buttonElements.forEach(function (button) {
                    button.addEventListener('click', dialogButtonClicked);
                });
            }
            else
                //hide the button bar
                dialog.buttonBar.setAttribute('core-hidden', '');

            //Check for dialog animation type
            var openAnimationKeyframes = flags.openAnimationKeyframes || core.animation.presetKeyframes.fadeIn,
                openAnimationDuration = flags.openAnimationDuration || DEFAULT_OPEN_ANIM_DURATION;;

            dialog.animate(openAnimationKeyframes, openAnimationDuration);

            //append the dialog to the document body
            document.body.appendChild(dialog);

            //detect if dialog is to be shown modal - default false
            if (modal == true)
                dialog.showModal();
            else
                dialog.show();

            //check if dialog is draggable - default true
            if (flags.draggable != false)
                dialog.draggabilityInstance = new Core.UserInterface.Draggability(dialog, dialog.titleBar);

            //call <callback>, if it is a valid function
            if (Core.TypeChecking.isFunction(callback))
                //call <function callback(form, dialog) { }>
                return callback.call(dialog);
            else
                core.debugging.error('Core: Cannot call function. Argument <callback> is not a valid function');
        }

        //public show modal dialog
        this.showModal = function (flags, callback) {
            openDialog(flags, callback, true);
        }
    }

}, ['Core.UserInterface.Primitives', 'Core.UserInterface.CoreButton']);