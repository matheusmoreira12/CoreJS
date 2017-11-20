//Modify module Core.UserInterface
Core.Modules.modifyModule('Core.UserInterface', function () {

    var CoreProgressBar_prototype = Core.ObjectManipulator.inherit(Core.UserInterface.Primitives.CoreLabelableContainer.prototype);

    CoreProgressBar_prototype.createdCallback = function () {
        this._base.createdCallback.call(this);

        //internal initializers
        this._min = 0;
        this._max = 1;
        this._value = 0;
        this._indeterminate = true;

        this._labelFormat = 'LOADING %3%%'

        this._fillElement = new Core.UserInterface.CoreProgressBarFill();
        this._shadowRoot.appendChild(this._fillElement);

        //internal declarations
        this._update = function () {
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

        this._update();

        const DELTA = .0001;

        //public declarations
        Object.defineProperties(this, {
            'labelFormat': {
                set: function (value) {
                    this._labelFormat = value;

                    //Reflect changes visually
                    this._update();
                }, get: function () {
                    return this._labelFormat;
                }
            },
            'indeterminate': {
                set: function (value) {
                    this._indeterminate = value || false;
                    
                    //Reflect changes visually
                    this._update();
                }, get: function () {
                    return this._indeterminate;
                }
            },
            'value': {
                set: function (value) {
                    this._value = Math.min(this.max, Math.max(this._min, value));
                    this._indeterminate = false;

                    //Reflect changes visually
                    this._update();
                }, get: function () {
                    return this._value;
                }
            },
            'min': {
                set: function (value) {
                    this._min = Math.min(this.max - DELTA, value);

                    //Reflect changes visually
                    this._update();
                }, get: function () {
                    return this._min;
                }
            },
            'max': {
                set: function (value) {
                    this._max = Math.max(this.max + DELTA, value);

                    //Reflect changes visually
                    this._update();
                }, get: function () {
                    return this._max;
                }
            }
        });
    }

    this.CoreProgressBar = Core.UserInterface.register('core-progressbar', CoreProgressBar_prototype);

    //CoreProgressBarFill
    var CoreProgressBarFill_prototype = Object.create(HTMLElement.prototype);

    this.CoreProgressBarFill = Core.UserInterface.register('core-progressbarfill', CoreProgressBarFill_prototype);
}, ['Core.UserInterface.Primitives']);