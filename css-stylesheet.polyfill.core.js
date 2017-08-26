//polyfill for <CSSStyleSheet>
CSSStyleSheet.prototype.addRule = function (rule)
{
    return this.insertRule(rule);
}
