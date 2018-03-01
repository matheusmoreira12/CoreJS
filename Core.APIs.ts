///<reference path="Core.ts"/>
///<reference path="Core.MethodGroup.ts"/>
///<reference path="Core.Validation.ts"/>

namespace Core.APIs {

    const API_SCRIPT_PATTERN = "^\"use strict\";\nclass {0}API extends Core.APIs.API {\\.*}$";

    export enum APILoaderPendingStatus { Pending = 0, LoadError = 1, Invalid = 2, Loaded = 3 }

    export class API {
    }

    export class APILoader {
        constructor(apiName: string, apiURL: string) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("apiName", apiName, STRING, true, false);
            Validation.RuntimeValidator.validateParameter("apiURL", apiURL, STRING, true, false);

            this._apiName = apiName;
            this._apiURL = apiURL;

            this._loadAPI();
        }

        loadedEvent: Events.APILoaderEvent;
        errorEvent: Events.APILoaderEvent;

        private _applyAPI(loadedContent: string) {
            const API_VERIFICATION_REGEXP = new RegExp(StringUtils.format(API_SCRIPT_PATTERN, this._apiName));

            if (API_VERIFICATION_REGEXP.test(loadedContent)) {
            }
        }

        private _loadAPI() {
            let api = this;
            let ajax = this._ajaxRequest = Web.Ajax.get(this._apiURL, new Web.AjaxRequestOptions());

            function ajaxLoaded(src: Web.AjaxRequest, innerReq: XMLHttpRequest, reqInfo: Web.AjaxRequestInfo): void {
                api._applyAPI(innerReq.responseText);
            }
            ajax.loadedEvent.attach(ajaxLoaded);

            function ajaxError(src: Web.AjaxRequest, innerReq: XMLHttpRequest, reqInfo: Web.AjaxRequestInfo): void {

            }
            ajax.errorEvent.attach(ajaxError);
        }

        private _apiName: string;
        private _apiURL: string;
        private _loadedContent: string = null;

        private _ajaxRequest: Web.AjaxRequest;
    }
}

namespace Core.Events {
    //APILoader event
    export type APILoaderEventListener = (src: APIs.APILoader) => void;

    export class APILoaderEvent extends MethodGroup {
        constructor(target: APIs.APILoader, defaultListener?: APILoaderEventListener) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("target", target, [Function, APIs.APILoader], true);

            super(target);
        }

        target: APIs.APILoader;

        attach(listener: APILoaderEventListener | APILoaderEvent) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("listener", listener, [Function, APILoaderEvent]);

            super.attach(listener);
        }

        detach(listener: APILoaderEventListener | APILoaderEvent) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("listener", listener, [Function, APILoaderEvent]);

            super.detach(listener);
        }

        invoke(thisArg?: any) {
            super.invoke(null);
        }
    }
}