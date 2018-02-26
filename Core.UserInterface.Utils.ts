namespace Core.UserInterface {

    const UNDEF = "undefined";

    export class Utils {
        static defineCustomElement(name: string, constructor, _extends?: string) {
            customElements.define(name, constructor, { extends: _extends });
        }

        static attachShadow(elem: HTMLElement, closed?: boolean) {
            return elem.attachShadow({ mode: closed === false ? "open" : "closed" });
        }
    }
}
