///<reference path="Core.Validation.ts"/>
///<reference path="Core.Events.ts"/>

namespace Core.APIs {

    const API_SCRIPT_PATTERN = "^\"use strict\";\nclass {0}API extends Core.APIs.API {\\.*}$";

    export enum APILoaderPendingStatus { Pending = 0, LoadError = 1, Invalid = 2, Loaded = 3 }

    export class API {
    }

    export class APILoader {
        constructor(apiName: string, apiURL: string) {
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

            function ajaxLoaded(target: Web.AjaxRequest, args: Events.AjaxEventArgs): void {
                api._applyAPI(args.baseRequest.responseText);
            }
            ajax.loadedEvent.attach(ajaxLoaded);

            function ajaxError(target: Web.AjaxRequest, args: Events.AjaxEventArgs): void {

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
            super(target);
        }

        target: APIs.APILoader;

        attach(listener: APILoaderEventListener | APILoaderEvent) {
            super.attach(listener);
        }

        detach(listener: APILoaderEventListener | APILoaderEvent) {
            super.detach(listener);
        }

        invoke(thisArg?: any) {
            super.invoke(null);
        }
    }
}