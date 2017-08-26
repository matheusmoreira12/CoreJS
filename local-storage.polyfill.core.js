//polyfill for <localStorage>
var LocalStoragePolyfill = function ()
{
    var data = {}

    this.setItem = function (id, val) { data[id] = String (val); }
    this.getItem = function (id) { return data.hasOwnProperty(id) ? data[id] : undefined; }
    this.removeItem = function (id) { delete data[id]; }
    this.clear = function () { data = {}; }
}

window.localStorage = new LocalStoragePolyfill();