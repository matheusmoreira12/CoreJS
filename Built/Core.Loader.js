var Core;
(function (Core) {
    var Loader;
    (function (Loader) {
        const REQUIRED_SCRIPTS = [
            "../Built/Core.MethodGroup.js",
            "../Built/Core.Collections.Generic.js",
            "../Built/Core.DependencySystem.js",
            "../Built/Core.Exceptions.js",
            "../Built/Core.ResourceLoader.js",
        ];
        function loadScript(src) {
            let script = document.createElement("script");
            script.type = "text/javascript";
            script.src = src;
            script.async = false;
            document.head.appendChild(script);
            return script;
        }
        function loadRequiredScripts() {
            for (let src of REQUIRED_SCRIPTS)
                loadScript(src);
        }
        loadRequiredScripts();
    })(Loader = Core.Loader || (Core.Loader = {}));
})(Core || (Core = {}));
//# sourceMappingURL=Core.Loader.js.map