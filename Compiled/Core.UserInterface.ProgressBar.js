//<reference path="Core.Events.js"/>
var Core;
(function (Core) {
    var UserInterface;
    (function (UserInterface) {
        //CoreProgressBarFill
        class ProgressBar extends UserInterface.Primitives.LabelableContainer {
            constructor() {
                super();
                this.progressEvent = new Core.Events.ProgressEvent(this);
                this.min = 0;
                this.max = 1;
                this.value = 0;
                this.indeterminate = true;
                this.labelFormat = 'LOADING {2}%';
                this.fillElement = new ProgressBarFill();
                this.shadow.appendChild(this.fillElement);
                this.updateVisuals();
            }
            onProgress(src, done, total, progress) {
            }
            //ProgressBar.labelFormat property
            set labelFormat(value) {
                this._labelFormat = value;
            }
            get labelFormat() {
                return this._labelFormat;
            }
            //ProgressBar.indeterminate property        
            set indeterminate(value) {
                this._indeterminate = value || false;
                //Reflect changes visually
                this.updateVisuals();
            }
            get indeterminate() {
                return this._indeterminate;
            }
            //ProgressBar.value property
            set value(value) {
                if (value > this.max)
                    value = this.max;
                else if (value < this._min)
                    value = this.min;
                this._value = value;
                this._indeterminate = false;
                //Reflect changes visually
                this.updateVisuals();
            }
            get value() {
                return this._value;
            }
            //ProgressBar.min property
            set min(value) {
                if (value > this.max)
                    value = this.max - .0001;
                this._min = value;
                //Reflect changes visually
                this.updateVisuals();
            }
            get min() {
                return this._min;
            }
            //ProgressBar.max property
            set max(value) {
                if (value > this.min)
                    value = this.min + .0001;
                this._min = value;
                //Reflect changes visually
                this.updateVisuals();
            }
            get max() {
                return this._max;
            }
            updateVisuals() {
                if (this.indeterminate)
                    this.fillElement.setAttribute('indeterminate', '');
                else {
                    //Get the equivalent percentage of value
                    let done = this._value - this._min, total = this._max - this._min, percent = done / total * 100;
                    //Update fill width
                    this.fillElement.style.width = percent + '%';
                    this.removeAttribute('indeterminate');
                    //Update label
                    this.setLabelText(this._labelFormat, done, total, percent);
                }
            }
        }
        UserInterface.ProgressBar = ProgressBar;
        customElements.define('core-progressbar', ProgressBar);
        //CoreProgressBarFill
        class ProgressBarFill extends HTMLElement {
        }
        customElements.define('core-progressbarfill', ProgressBarFill);
    })(UserInterface = Core.UserInterface || (Core.UserInterface = {}));
})(Core || (Core = {}));
