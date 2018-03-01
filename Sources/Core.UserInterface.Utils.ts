namespace Core.UserInterface {

    const UNDEF = "undefined";

    export class Utils {
        static defineCustomElement(name: string, constructor, _extends?: string) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("name", name, STRING, true, false);
            Validation.RuntimeValidator.validateParameter("constructor", constructor, Function, true, false);
            Validation.RuntimeValidator.validateParameter("_extends", _extends, STRING, true, false);

            customElements.define(name, constructor, { extends: _extends });
        }

        static attachShadow(elem: HTMLElement, closed?: boolean) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("elem", elem, HTMLElement, true, false);
            Validation.RuntimeValidator.validateParameter("closed", closed, BOOL, false);

            return elem.attachShadow({ mode: closed === false ? "open" : "closed" });
        }

        static setAttribute(elem: HTMLElement, name: string, value: string): void {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("elem", elem, HTMLElement, true, false);
            Validation.RuntimeValidator.validateParameter("name", name, STRING, true, false);
            Validation.RuntimeValidator.validateParameter("value", value, STRING, true);

            if (value === null)
                elem.removeAttribute(name);
            else
                elem.setAttribute(name, value);
        }
    }
}
