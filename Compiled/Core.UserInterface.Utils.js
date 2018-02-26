var Core;
(function (Core) {
    var UserInterface;
    (function (UserInterface) {
        const UNDEF = "undefined";
        class Utils {
            static defineCustomElement(name, constructor, _extends) {
                customElements.define(name, constructor, { extends: _extends });
            }
            static attachShadow(elem, closed) {
                return elem.attachShadow({ mode: closed === false ? "open" : "closed" });
            }
        }
        UserInterface.Utils = Utils;
    })(UserInterface = Core.UserInterface || (Core.UserInterface = {}));
})(Core || (Core = {}));
