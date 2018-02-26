//Polyfill Loader
//Loads polyfills for functionality not available in old web browsers



//WebReflection Polyfills - Thanks, Andrea Giammarchi @ https://github.com/WebReflection
if (!document.registerElement)
{
    core.loadAndAppendScript("/Polyfills/document-register-element.js");
    core.loadAndAppendScript("/Polyfills/dre-ie8-upfront-fix.js");
    core.loadAndAppendScript("/Polyfills/html-class.js");
    core.loadAndAppendScript("/Polyfills/innerHTML.js");
}
    
if (!CSSStyleSheet.prototype.addRule)
    core.loadAndAppendScript("css-stylesheet.polyfill.core.js");
    
if (!window.Proxy)
    core.loadAndAppendScript("proxy.polyfill.core.js");
    
if (!window.localStorage)
    core.loadAndAppendScript("css-stylesheet.polyfill.core.js");
    
if (!window.MutationObserver)
    core.loadAndAppendScript("mutation-observer.polyfill.core.js");
    
if (!Array.includes || !Object.setPrototypeOf)
    core.loadAndAppendScript("object.polyfill.core.js");