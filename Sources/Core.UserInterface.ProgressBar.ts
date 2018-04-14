///<reference path="Core.UserInterface.Control.ts"/>

namespace Core.UserInterface {
    //CoreProgressBar
    export class ProgressBar extends Control {

        private _populate() {
            //Populate progress bar fill
            let fillElement = document.createElement("core-progressbarfill");
            this._fillElement = fillElement;

            this._innerBox.appendChild(fillElement);
        }

        constructor () {
            super();
            this._stylesheetManager.prependStylesheet("../Themes/progress-bar.base.theme.css");

            this._populate();

            this._updateVisuals();
        }

        private _stylesheetElement: HTMLLinkElement;
        private _innerElement: ProgressBarFill;
        private _fillElement: ProgressBarFill;

        private _onProgress(target:any, args: Events.ProgressEventArgs) {
        }
        progressEvent: Events.ProgressEvent = new Events.ProgressEvent(this, this._onProgress);

        //ProgressBar.labelFormat property
        set labelFormat(value) {
            this._labelFormat = value;
        }
        get labelFormat() {
            return this._labelFormat;
        }
        private _labelFormat : string = "LOADING {2}%";

        public labelElement: Primitives.Label = null;

        //ProgressBar.indeterminate property        
        set indeterminate(value) {
            this._indeterminate = value || false;
            
            //Reflect changes visually
            this._updateVisuals();
        }
        get indeterminate() {
            return this._indeterminate;
        }
        private _indeterminate : boolean = true;

        //ProgressBar.value property
        set value(value) {
            if (value > this.max)
                value = this.max;
            else if (value < this._min)
                value = this.min;
            
            this._value = value;
            this._indeterminate = false;

            //Reflect changes visually
            this._updateVisuals();
        }
        get value() {
            return this._value;
        }
        private _value : number = 0;

        //ProgressBar.min property
        set min(value) {
            if (value > this.max)
                value = this.max - .0001;
            
            this._min = value;

            //Reflect changes visually
            this._updateVisuals();
        }
        get min() {
            return this._min;
        }
        _min : number = 0;

        //ProgressBar.max property
        set max(value) {
            if (value > this.min)
                value = this.min + .0001;
            
            this._min = value;

            //Reflect changes visually
            this._updateVisuals();
        }
        get max() {
            return this._max;
        }
        _max : number = 1;

        private _updateLabel(done: number, total: number, percent: number) {
            if (this.labelElement instanceof Primitives.Label)
                this.labelElement.setText(this._labelFormat, done, total, percent);
        }
        
        private _updateVisuals() {
            if (this.indeterminate)
                this._fillElement.setAttribute('indeterminate', '');
            else {
                //Get the equivalent percentage of value
                let done = this._value - this._min,
                    total = this._max - this._min,
                    percent = done / total * 100;

                //Update fill width
                this._fillElement.style.width = percent + '%';
                this._fillElement.removeAttribute('indeterminate');

                //Update label
                this._updateLabel(done, total, percent);
            }
        }
    }
    customElements.define('core-progressbar', ProgressBar);

    //CoreProgressBarInner
    class ProgressBarInner extends HTMLElement { }
    customElements.define('core-progressbarinner', ProgressBarInner);

    //CoreProgressBarFill
    class ProgressBarFill extends HTMLElement { }
    customElements.define('core-progressbarfill', ProgressBarFill);
}