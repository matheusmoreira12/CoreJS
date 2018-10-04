namespace Core.Loader {
    const REQUIRED_SCRIPTS = [
        "../Built/Core.MethodGroup.js",
        "../Built/Core.Collections.Generic.js",
        "../Built/Core.DependencySystem.js",
        "../Built/Core.Exceptions.js",
        "../Built/Core.ResourceLoader.js",
    ];

    function loadScript(src): HTMLScriptElement {
        let script: HTMLScriptElement = document.createElement("script");
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
}