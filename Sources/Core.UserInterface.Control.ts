namespace Core.UserInterface {
    export class ControlVisualPropertyManager {
    }

    export class ControlStylesheetManager {
        constructor(target: Control) {
            this._target = target;
            this._stylesheets = new Collections.GenericList<HTMLLinkElement>();
        }

        private _stylesheets: Collections.GenericList<HTMLLinkElement>;
        private _target: Control;

        public prependStylesheet(href): HTMLLinkElement {
            let stylesheet = document.createElement("link");
            stylesheet.rel = "stylesheet";
            stylesheet.type = "text/css";
            stylesheet.href = href;

            if (this._stylesheets.length == 0)
                Utils.prependChild(this._target.shadowRoot, stylesheet);
            else
                this._stylesheets.getLast().insertAdjacentElement("afterend", stylesheet);

            this._stylesheets.add(stylesheet);
            console.log(this._stylesheets);
            return stylesheet;
        }

        public getStylesheetByHref(href: string): HTMLLinkElement {
            return this._stylesheets.first((item) => item.href == href);
        }

        public removeStylesheet(stylesheet: HTMLLinkElement) {
            this._target.shadowRoot.removeChild(stylesheet);
            this._stylesheets.remove(stylesheet);
        }
    }

    export class Control extends HTMLElement implements XAML.IDependencyObject {
        getValue(property: XAML.DependencyProperty): object {
            return XAML.IDependencyObject.getValue(this, property);
        }
        setValue(property: XAML.DependencyProperty, value: object): void {
            XAML.IDependencyObject.setValue(this, property, value);
        }

        private _populateControl() {
            let outerBox = document.createElement("core-controlouterbox");
            this._outerBox = outerBox;
            this.shadowRoot.appendChild(outerBox);

            let innerBox = document.createElement("core-controlinnerbox");
            outerBox.appendChild(innerBox);
            this._innerBox = innerBox;
        }

        constructor() {
            super();
            this._stylesheetManager = new ControlStylesheetManager(this);

            this.attachShadow({ mode: "open" });

            this._stylesheetManager.prependStylesheet("../Themes/control.base.theme.css");

            this._populateControl();
        }

        protected _stylesheetManager: ControlStylesheetManager;
        protected _outerBox: ControlOuterBox;
        protected _innerBox: ControlInnerBox;

        //Control.width property
        public widthProperty: XAML.DependencyProperty = XAML.DependencyProperty.register("width", new Type(Length),
            new Type(Control));

        public get width(): Length {
            return <Length>this.getValue(this.widthProperty);
        }
        public set width(value: Length) {
            this.setValue(this.widthProperty, value);
        }

        //Control.minimumWidth property
        public minimumWidthProperty: XAML.DependencyProperty = XAML.DependencyProperty.register("minimumWidth",
            new Type(Length), new Type(Control));

        public get minimumWidth(): Length {
            return <Length>this.getValue(this.minimumWidthProperty);
        }
        public set minimumWidth(value: Length) {
            this.setValue(this.minimumWidthProperty, value);
        }

        //Control.maximumWidth property
        public maximumWidthProperty: XAML.DependencyProperty = XAML.DependencyProperty.register("maximumWidth",
            new Type(Length), new Type(Control));

        public get maximumWidth(): Length {
            return <Length>this.getValue(this.maximumWidthProperty);
        }
        public set maximumWidth(value: Length) {
            this.setValue(this.maximumWidthProperty, value);
        }

        //Control.height property
        public heightProperty: XAML.DependencyProperty = XAML.DependencyProperty.register("height", new Type(Length),
            new Type(Control));

        public get height(): Length {
            return <Length>this.getValue(this.heightProperty);
        }
        public set height(value: Length) {
            this.setValue(this.heightProperty, value);
        }

        //Control.minimumHeight property
        public minimumHeightProperty: XAML.DependencyProperty = XAML.DependencyProperty.register("minimumHeight",
            new Type(Length), new Type(Control));

        public get minimumHeight(): Length {
            return <Length>this.getValue(this.minimumHeightProperty);
        }
        public set minimumHeight(value: Length) {
            this.setValue(this.minimumHeightProperty, value);
        }

        //Control.maximumHeight property
        public maximumHeightProperty: XAML.DependencyProperty = XAML.DependencyProperty.register("maximumHeight",
            new Type(Length), new Type(Control));

        public get maximumHeight(): Length {
            return <Length>this.getValue(this.maximumHeightProperty);
        }
        public set maximumHeight(value: Length) {
            this.setValue(this.maximumHeightProperty, value);
        }

        //Control.backgroundColor property
        public backgroundColorProperty: XAML.DependencyProperty = XAML.DependencyProperty.register("backgroundColor",
            new Type(Color), new Type(Control));

        public get backgroundColor(): Color {
            return <Color>this.getValue(this.backgroundColorProperty);
        }
        public set backgroundColor(value: Color) {
            this.setValue(this.backgroundColorProperty, value);
        }

        //Control.backgroundImage property
        public backgroundImageProperty: XAML.DependencyProperty = XAML.DependencyProperty.register("backgroundImage",
            new Type(Brush), new Type(Control));

        public get backgroundImage(): Brush {
            return <Brush>this.getValue(this.backgroundImageProperty);
        }
        public set backgroundImage(value: Brush) {
            this.setValue(this.backgroundImageProperty, value);
        }

        //Control.borderColor property
        public borderColorProperty: XAML.DependencyProperty = XAML.DependencyProperty.register("borderColor",
            new Type(Color), new Type(Control));

        public get borderColor(): Color {
            return <Color>this.getValue(this.borderColorProperty);
        }
        public set borderColor(value: Color) {
            this.setValue(this.borderColorProperty, value);
        }

        //Control.borderWidth property
        public borderWidthProperty: XAML.DependencyProperty = XAML.DependencyProperty.register("borderWidth",
            new Type(Length), new Type(Control));

        public get borderWidth(): Length {
            return <Length>this.getValue(this.borderWidthProperty);
        }
        public set borderWidth(value: Length) {
            this.setValue(this.borderWidthProperty, value);
        }
    }

    export class ControlOuterBox extends HTMLElement { }
    customElements.define("core-controlouterbox", ControlOuterBox);

    export class ControlInnerBox extends HTMLElement { }
    customElements.define("core-controlinnerbox", ControlInnerBox);
}