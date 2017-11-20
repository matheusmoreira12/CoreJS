Core.Modules.modifyModule('Core.UserInterface', function () {

    //CoreButton
    var CoreButton_prototype = Object.create(HTMLButtonElement.prototype);

    CoreButton_prototype._default = false;

    CoreButton_prototype.__defineGetter__('default', function () {
            return this._default;
        });
    CoreButton_prototype.__defineSetter__('default', function (value) {
            if (value == true)
                this.setAttribute('default', '');
            else
                this.removeAttribute('default');
                
            this._default = value;
        });
        
    CoreButton_prototype._iconElement = null;
    CoreButton_prototype._icon = null;
    
    CoreButton_prototype.__defineGetter__('icon', function () {
            return this._icon;
        });
    
    CoreButton_prototype.__defineSetter__('icon', function (value) {
            this._iconElement.icon = value;
        
            this._icon = value;
        });

    CoreButton_prototype.attributeChangedCallback = function (attrName, oldVal, newVal) {
        switch (attrName) {
            case 'default':
                this._default = !!newVal;
                break;
            case 'icon':
                this._icon = newVal;
                break;
        }
    }
    
    CoreButton_prototype._textElement = null;
    CoreButton_prototype._text = null;
    
    CoreButton_prototype.__defineGetter__('text', function () {
        if (this._textElement == null)
            return null;

        return this._textElement.innerText || this._textElement.textContent;
    });
    
    CoreButton_prototype.__defineSetter__('text', function (value) {
        if (this._textElement == null)
            return;

        if (!Core.TypeChecking.isUndefined(this._textElement.innerText))
            this._textElement.innerText = value;
        else
            this._textElement.textContent = value;
    });

    CoreButton_prototype.createdCallback = function () {
        this._shadowRoot = this.createShadowRoot();
        
        this._iconElement = new Core.UserInterface.CoreIcon();
        this._shadowRoot.appendChild(this._iconElement);
        
        this._textElement = document.createElement('span');
        this._shadowRoot.appendChild(this._textElement);
    }

    this.CoreButton = Core.UserInterface.register('core-button', CoreButton_prototype, 'button');

    //CoreCloseButton, based on CoreIconButton
    var CoreCloseButton_prototype = Core.ObjectManipulator.inherit(CoreButton_prototype);

    CoreCloseButton_prototype.createdCallback = function () {
        this._base.createdCallback.call(this);

        this.addEventListener('focus', function () {
            this.blur();
        });

        this.tabIndex = -1;
        this.icon = core.iconPackMan.availableIcons.default.close;
    }

    this.CoreCloseButton = Core.UserInterface.register('core-closebutton', CoreCloseButton_prototype, 'button');

}, ['Core.UserInterface.Primitives']);