var Core;
(function (Core) {
    var APIs;
    (function (APIs) {
        const API_SCRIPT_PATTERN = "^\"use strict\";\nclass {0}API extends Core.APIs.API {\\.*}$";
        let APILoaderPendingStatus;
        (function (APILoaderPendingStatus) {
            APILoaderPendingStatus[APILoaderPendingStatus["Pending"] = 0] = "Pending";
            APILoaderPendingStatus[APILoaderPendingStatus["LoadError"] = 1] = "LoadError";
            APILoaderPendingStatus[APILoaderPendingStatus["Invalid"] = 2] = "Invalid";
            APILoaderPendingStatus[APILoaderPendingStatus["Loaded"] = 3] = "Loaded";
        })(APILoaderPendingStatus = APIs.APILoaderPendingStatus || (APIs.APILoaderPendingStatus = {}));
        class API {
        }
        APIs.API = API;
        class APILoader {
            constructor(apiName, apiURL) {
                this._loadedContent = null;
                this._apiName = apiName;
                this._apiURL = apiURL;
                this._loadAPI();
            }
            _applyAPI(loadedContent) {
                const API_VERIFICATION_REGEXP = new RegExp(Core.StringUtils.format(API_SCRIPT_PATTERN, this._apiName));
                if (API_VERIFICATION_REGEXP.test(loadedContent)) {
                }
            }
            _loadAPI() {
                let api = this;
                let ajax = this._ajaxRequest = Core.Web.Ajax.get(this._apiURL, new Core.Web.AjaxRequestOptions());
                function ajaxLoaded(target, args) {
                    api._applyAPI(args.baseRequest.responseText);
                }
                ajax.loadedEvent.attach(ajaxLoaded);
                function ajaxError(target, args) {
                }
                ajax.errorEvent.attach(ajaxError);
            }
        }
        APIs.APILoader = APILoader;
    })(APIs = Core.APIs || (Core.APIs = {}));
})(Core || (Core = {}));
(function (Core) {
    var Events;
    (function (Events) {
        class APILoaderEvent extends Core.MethodGroup {
            constructor(target, defaultListener) {
                super(target);
            }
            attach(listener) {
                super.attach(listener);
            }
            detach(listener) {
                super.detach(listener);
            }
            invoke(thisArg) {
                super.invoke(null);
            }
        }
        Events.APILoaderEvent = APILoaderEvent;
    })(Events = Core.Events || (Core.Events = {}));
})(Core || (Core = {}));
//# sourceMappingURL=Core.APIs.js.map