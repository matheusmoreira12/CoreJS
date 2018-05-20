declare namespace Core.Web {
    class AjaxRequestOptions {
        constructor(async?: boolean, data?: any, user?: string, password?: string);
        asynchronous: boolean;
        user: string;
        password: string;
        data: any;
    }
    class AjaxRequestInfo {
        constructor(method: string, url: string, options?: AjaxRequestOptions);
        method: string;
        url: string;
        options: AjaxRequestOptions;
    }
    class AjaxRequest {
        doneEvent: Events.AjaxEvent;
        loadedEvent: Events.AjaxEvent;
        errorEvent: Events.AjaxEvent;
        headersReceivedEvent: Events.AjaxEvent;
        loadingEvent: Events.AjaxEvent;
        openedEvent: Events.AjaxEvent;
        unsentEvent: Events.AjaxEvent;
        progressEvent: Events.ProgressEvent;
        private _requestReadyStateChanged();
        private _requestProgress(event);
        private _createAndOpenRequest(method, url, options);
        constructor(method: string, url: string, options?: AjaxRequestOptions);
        baseRequest: XMLHttpRequest;
        info: AjaxRequestInfo;
    }
    class Ajax {
        static get(url: string, options?: AjaxRequestOptions): AjaxRequest;
        static head(url: string, options?: AjaxRequestOptions): AjaxRequest;
        static post(url: string, options?: AjaxRequestOptions): AjaxRequest;
        static put(url: string, options?: AjaxRequestOptions): AjaxRequest;
        static delete(url: string, options?: AjaxRequestOptions): AjaxRequest;
        static connect(url: string, options?: AjaxRequestOptions): AjaxRequest;
        static options(url: string, options?: AjaxRequestOptions): AjaxRequest;
        static trace(url: string, options?: AjaxRequestOptions): AjaxRequest;
        static patch(url: string, options?: AjaxRequestOptions): AjaxRequest;
    }
}
declare namespace Core.Events {
    type AjaxEventArgs = {
        baseRequest: XMLHttpRequest;
        reqInfo: Web.AjaxRequestInfo;
    };
    type AjaxEventListener = (target: Web.AjaxRequest, args: AjaxEventArgs) => void;
    class AjaxEvent extends MethodGroup {
        constructor(target: Web.AjaxRequest, defaultListener?: AjaxEventListener);
        target: Web.AjaxRequest;
        attach(listener: AjaxEventListener | AjaxEvent): void;
        detach(listener: AjaxEventListener | AjaxEvent): void;
        invoke(args: AjaxEventArgs): void;
    }
}
