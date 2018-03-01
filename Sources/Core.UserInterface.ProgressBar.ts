//<reference path="Core.Events.js"/>

namespace Core.UserInterface {
    //CoreProgressBarFill
    export class ProgressBar extends Primitives.LabelableContainer {

        constructor () {
            super();

            this.min = 0;
            this.max = 1;
            this.value = 0;
            this.indeterminate = true;

            this.labelFormat = 'LOADING {2}%'

            this.fillElement = new ProgressBarFill();
            this.shadow.appendChild(this.fillElement);

            this.updateVisuals();
        }

        fillElement: ProgressBarFill;

        private onProgress(src, done: number, total: number, progress: number) {
        }
        progressEvent: Events.ProgressEvent = new Events.ProgressEvent(this);

        //ProgressBar.labelFormat property
        set labelFormat(value) {
            this._labelFormat = value;
        }
        get labelFormat() {
            return this._labelFormat;
        }
        _labelFormat : string;

        //ProgressBar.indeterminate property        
        set indeterminate(value) {
            this._indeterminate = value || false;
            
            //Reflect changes visually
            this.updateVisuals();
        }
        get indeterminate() {
            return this._indeterminate;
        }
        _indeterminate : boolean;

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
        _value : number;

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
        _min : number;

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
        _max : number;

        private updateVisuals() {
            if (this.indeterminate)
                this.fillElement.setAttribute('indeterminate', '');
            else {
                //Get the equivalent percentage of value
                let done = this._value - this._min,
                    total = this._max - this._min,
                    percent = done / total * 100;

                //Update fill width
                this.fillElement.style.width = percent + '%';
                this.removeAttribute('indeterminate');

                //Update label
                this.setLabelText(this._labelFormat, done, total, percent);
            }
        }
    }
    customElements.define('core-progressbar', ProgressBar);

    //CoreProgressBarFill
    class ProgressBarFill extends HTMLElement {
        
    }
    customElements.define('core-progressbarfill', ProgressBarFill);

}