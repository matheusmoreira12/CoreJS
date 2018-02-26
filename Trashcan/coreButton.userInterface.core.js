$extend('Core.UserInterface', function () {

    //CoreButton
    this.CoreButton = class extends HTMLElement {

        get default () {
            return this._default;
        }
        
        set default(value) {
            if (value == true) {
                this.setAttribute('default', '');
                this.focus(); 
            }
            else
                this.removeAttribute('default');
                
            this._default = value;
        }
                    
        get icon() {
            return this._icon;
        }
        
        set icon(value) {
            this._iconElement.icon = value;
        
            this._icon = value;
        }

        attributeChangedCallback (attrName, oldVal, newVal) {
            switch (attrName) {
                case 'default':
                    this._default = !!newVal;
                    break;
                case 'icon':
                    this._icon = newVal;
                    break;
            }
        }
        
        get text() {
            if (this._textElement == null)
                return null;

            return this._textElement.innerText || this._textElement.textContent;
        }
        
        set text(value) {
            if (this._textElement == null)
                return;

            if (!Core.TypeChecking.isUndefined(this._textElement.innerText))
                this._textElement.innerText = value;
            else
                this._textElement.textContent = value;
        }

        constructor() {
            super();

            this._default = null;
            this._shadowRoot = this.createShadowRoot();
            
            this._icon = null;
            this._iconElement = new Core.UserInterface.IconElement();
            this._shadowRoot.appendChild(this._iconElement);
            
            this._text = null;
            this._textElement = document.createElement('span');
            this._shadowRoot.appendChild(this._textElement);
        }
    }
    
    customElements.define('core-button', this.CoreButton, { extends: 'button' });

    //CoreCloseButton, based on IconElementButton
    this.CoreCloseButton = class extends this.CoreButton {
        
        constructor() {
            super();

            this.addEventListener('focus', function () {
                this.blur();
            });

            this.tabIndex = -1;
            this.icon = Core.Icons.getIconByNames('default', 'close');
        }
    }
    
    customElements.define('core-closebutton', this.CoreCloseButton, { extends: 'button' });

});