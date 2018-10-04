namespace Core.UserInterface.Primitives {
    export class ControlVisualPropertyManager {
    }

    export class ControlStylesheetManager {
        constructor(target: Control) {
            this._target = target;
            this._stylesheets = new Collections.Generic.List<HTMLLinkElement>();
        }

        private _stylesheets: Collections.Generic.List<HTMLLinkElement>;
        private _target: Control;

        public prependStylesheet(href): HTMLLinkElement {
            let stylesheet = document.createElement("link");
            stylesheet.rel = "stylesheet";
            stylesheet.type = "text/css";
            stylesheet.href = href;

            if (this._stylesheets.count == 0)
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

    export class Control extends HTMLElement implements ObjectiveXML.IDependencyObject {
        getValue(property: ObjectiveXML.DependencyProperty): object {
            return ObjectiveXML.IDependencyObject.getValue(this, property);
        }
        setValue(property: ObjectiveXML.DependencyProperty, value: object): void {
            ObjectiveXML.IDependencyObject.setValue(this, property, value);
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

        //Control.width dependency property
        public widthProperty: ObjectiveXML.DependencyProperty = ObjectiveXML.DependencyProperty.register("width", new Type(Length),
            new Type(Control));

        public get width(): Length {
            return <Length>this.getValue(this.widthProperty);
        }
        public set width(value: Length) {
            this.setValue(this.widthProperty, value);
        }

        //Control.minimumWidth dependency property
        public minimumWidthProperty: ObjectiveXML.DependencyProperty = ObjectiveXML.DependencyProperty.register("minimumWidth",
            new Type(Length), new Type(Control));

        public get minimumWidth(): Length {
            return <Length>this.getValue(this.minimumWidthProperty);
        }
        public set minimumWidth(value: Length) {
            this.setValue(this.minimumWidthProperty, value);
        }

        //Control.maximumWidth dependency property
        public maximumWidthProperty: ObjectiveXML.DependencyProperty = ObjectiveXML.DependencyProperty.register("maximumWidth",
            new Type(Length), new Type(Control));

        public get maximumWidth(): Length {
            return <Length>this.getValue(this.maximumWidthProperty);
        }
        public set maximumWidth(value: Length) {
            this.setValue(this.maximumWidthProperty, value);
        }

        //Control.height dependency property
        public heightProperty: ObjectiveXML.DependencyProperty = ObjectiveXML.DependencyProperty.register("height", new Type(Length),
            new Type(Control));

        public get height(): Length {
            return <Length>this.getValue(this.heightProperty);
        }
        public set height(value: Length) {
            this.setValue(this.heightProperty, value);
        }

        //Control.minimumHeight dependency property
        public minimumHeightProperty: ObjectiveXML.DependencyProperty = ObjectiveXML.DependencyProperty.register("minimumHeight",
            new Type(Length), new Type(Control));

        public get minimumHeight(): Length {
            return <Length>this.getValue(this.minimumHeightProperty);
        }
        public set minimumHeight(value: Length) {
            this.setValue(this.minimumHeightProperty, value);
        }

        //Control.maximumHeight dependency property
        public maximumHeightProperty: ObjectiveXML.DependencyProperty = ObjectiveXML.DependencyProperty.register("maximumHeight",
            new Type(Length), new Type(Control));

        public get maximumHeight(): Length {
            return <Length>this.getValue(this.maximumHeightProperty);
        }
        public set maximumHeight(value: Length) {
            this.setValue(this.maximumHeightProperty, value);
        }

        //Control.foregroundColor dependency property
        public foregroundColorProperty: ObjectiveXML.DependencyProperty = ObjectiveXML.DependencyProperty.register("foregroundColor",
            new Type(Color), new Type(Control));

        public get foregroundColor(): Color {
            return <Color>this.getValue(this.foregroundColorProperty);
        }
        public set foregroundColor(value: Color) {
            this.setValue(this.foregroundColorProperty, value);
        }

        //Control.foregroundImage dependency property
        public foregroundImageProperty: ObjectiveXML.DependencyProperty = ObjectiveXML.DependencyProperty.register("foregroundImage",
            new Type(Brush), new Type(Control));

        public get foregroundImage(): Brush {
            return <Brush>this.getValue(this.foregroundImageProperty);
        }
        public set foregroundImage(value: Brush) {
            this.setValue(this.foregroundImageProperty, value);
        }

        //Control.backgroundColor dependency property
        public backgroundColorProperty: ObjectiveXML.DependencyProperty = ObjectiveXML.DependencyProperty.register("backgroundColor",
            new Type(Color), new Type(Control));

        public get backgroundColor(): Color {
            return <Color>this.getValue(this.backgroundColorProperty);
        }
        public set backgroundColor(value: Color) {
            this.setValue(this.backgroundColorProperty, value);
        }

        //Control.backgroundImage dependency property
        public backgroundImageProperty: ObjectiveXML.DependencyProperty = ObjectiveXML.DependencyProperty.register("backgroundImage",
            new Type(Brush), new Type(Control));

        public get backgroundImage(): Brush {
            return <Brush>this.getValue(this.backgroundImageProperty);
        }
        public set backgroundImage(value: Brush) {
            this.setValue(this.backgroundImageProperty, value);
        }

        //Control.borderColor dependency property
        public borderColorProperty: ObjectiveXML.DependencyProperty = ObjectiveXML.DependencyProperty.register("borderColor",
            new Type(Color), new Type(Control));

        public get borderColor(): Color {
            return <Color>this.getValue(this.borderColorProperty);
        }
        public set borderColor(value: Color) {
            this.setValue(this.borderColorProperty, value);
        }

        //Control.borderWidth dependency property
        public borderWidthProperty: ObjectiveXML.DependencyProperty = ObjectiveXML.DependencyProperty.register("borderWidth",
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

    export class ContentPresenter extends ContentContainer { }
    customElements.define('core-contentpresenter', ContentPresenter);
}