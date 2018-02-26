//Modify module Core.UserInterface
$extend('Core.UserInterface', function () {
    //CoreProgressBarFill
    class CoreProgressBar extends this.Primitives.CoreLabelableContainer {

        constructor () {
            super();

            this._min = 0;
            this._max = 1;
            this._value = 0;
            this._indeterminate = true;

            this._labelFormat = 'LOADING %3%%'

            this._fillElement = new Core.UserInterface.CoreProgressBarFill();
            this._shadowRoot.appendChild(this._fillElement);

            this._update();
        }

        set labelFormat(value) {
            this._labelFormat = value;

            this._update();
        }
        get labelFormat() {
            return this._labelFormat;
        }

        set indeterminate(value) {
            this._indeterminate = value || false;
            
            //Reflect changes visually
            this._update();
        }
        get indeterminate() {
            return this._indeterminate;
        }

        set value(value) {
            if (value > this._max)
                value = max;
            else if (value < this._min)
                value = min;
            
            this._value = value;
            this._indeterminate = false;

            //Reflect changes visually
            this._update();
        }
        get value() {
            return this._value;
        }

        set min(value) {
            if (value > this._max)
                value = this._max - .0001;
            
            this._min = value;

            //Reflect changes visually
            this._update();
        }
        get min() {
            return this._min;
        }

        set max(value) {
            if (value > this._min)
                value = this._min + .0001;
            
            this._min = value;

            //Reflect changes visually
            this._update();
        }
        get max() {
            return this._max;
        }

        //internal declarations
        _update() {
            if (this._indeterminate)
                this.setAttribute('indeterminate', '');
            else {
                //Get the equivalent percentage of value
                var percent = (this._value - this._min) /
                    (this._max - this._min) * 100;

                //Update fill width
                this._fillElement.style.width = percent + '%';
                this.removeAttribute('indeterminate');

                //Update label
                this.setLabel(this._labelFormat, this._min, this._max, percent);
            }
        }
    }
    this.CoreProgressBar = CoreProgressBar;
    customElements.define('core-progressbar', CoreProgressBar);

    //CoreProgressBarFill
    class CoreProgressBarFill extends HTMLElement {
        
    }
    this.CoreProgressBarFill = CoreProgressBar;
    customElements.define('core-progressbarfill', CoreProgressBarFill);

}, ['Core.UserInterface.Primitives']);