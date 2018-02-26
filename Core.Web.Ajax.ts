///<reference path="Core.ts"/>
///<reference path="Core.Web.ts"/>
///<reference path="Core.Events.ts"/>

namespace Core.Web {

    export class AjaxRequestOptions {
        constructor(async?: boolean, data?: any, user?: string, password?: string) {
            //Runtime validation
            if (async !== null && typeof async != UNDEF && typeof async != BOOL)
                throw TypeError('Parameter "async" is not a valid Boolean.');
            if (data !== null && typeof data != UNDEF && typeof data != STRING && !(data instanceof Document))
                throw TypeError('Parameter "data" is not a valid Document or String.');
            if (user !== null && typeof user != UNDEF && typeof user != STRING)
                throw TypeError('Parameter "user" is not a valid Boolean.');
            if (password !== null && typeof password != UNDEF && typeof password != STRING)
                throw TypeError('Parameter "password" is not a valid Boolean.');

            this.asynchronous = async;
            this.user = user;
            this.password = password;
            this.data = data;
        }

        asynchronous: boolean;
        user: string;
        password: string;
        data: any;
    }

    export class AjaxRequestInfo {
        constructor(method: string, url: string, options?: AjaxRequestOptions) {
            //Runtime validation
            if (typeof method != STRING)
                throw TypeError('Parameter "method" is not a valid String.');
            if (typeof url != STRING)
                throw TypeError('Parameter "url" is not a valid String.');
            if (options !== null && typeof options != UNDEF && !(options instanceof AjaxRequestOptions))
                throw TypeError('Parameter "method" is not a valid String.');

            this.method = method;
            this.url = url;
            this.options = options || new AjaxRequestOptions();
        }

        method: string;
        url: string;
        options: AjaxRequestOptions;
    }

    export class AjaxRequest {

        doneEvent: Events.AjaxEvent = new Events.AjaxEvent(this);
        loadedEvent: Events.AjaxEvent = new Events.AjaxEvent(this);
        errorEvent: Events.AjaxEvent = new Events.AjaxEvent(this);
        headersReceivedEvent: Events.AjaxEvent = new Events.AjaxEvent(this);
        loadingEvent: Events.AjaxEvent = new Events.AjaxEvent(this);
        openedEvent: Events.AjaxEvent = new Events.AjaxEvent(this);
        unsentEvent: Events.AjaxEvent = new Events.AjaxEvent(this);
        progressEvent: Events.ProgressEvent = new Events.ProgressEvent(this);

        private requestReadyStateChanged() {
            let xhr = this.baseRequest;
            let info = this.info;

            switch (xhr.readyState) {
                case XMLHttpRequest.DONE:
                    this.doneEvent.invoke();

                    if (xhr.status == STATUS_OK)
                        this.loadedEvent.invoke();
                    else {
                        this.errorEvent.invoke();
                    }
                    break;

                case XMLHttpRequest.HEADERS_RECEIVED:
                    this.headersReceivedEvent.invoke();
                    break;

                case XMLHttpRequest.LOADING:
                    this.loadingEvent.invoke();
                    break;

                case XMLHttpRequest.OPENED:
                    this.openedEvent.invoke();
                    break;

                case XMLHttpRequest.UNSENT:
                    this.unsentEvent.invoke();
                    break;
            }
        }

        private requestProgress(event: ProgressEvent) {
            let loaded = event.loaded,
                total = event.total,
                progressPercentage: number = loaded / total;

            this.progressEvent.invoke(loaded, total, progressPercentage);
        }

        private createAndOpenRequest(method: string, url: string, options: AjaxRequestOptions) {
            let xhr = new XMLHttpRequest();
            xhr.open(method, url, options.asynchronous, options.user, options.password);
            xhr.send(options.data);

            xhr.onreadystatechange = () => this.requestReadyStateChanged();

            this.baseRequest = xhr;
        }

        constructor(method: string, url: string, options?: AjaxRequestOptions) {
            this.info = new AjaxRequestInfo(method, url, options);
            this.createAndOpenRequest(method, url, options);
        }

        baseRequest: XMLHttpRequest;
        info: AjaxRequestInfo;
    }

    export class Ajax {

        static get(url: string, options?: AjaxRequestOptions) {
            return new AjaxRequest(METHOD_GET, url, options);
        }
        static head(url: string, options?: AjaxRequestOptions) {
            return new AjaxRequest(METHOD_HEAD, url, options);
        }
        static post(url: string, options?: AjaxRequestOptions) {
            return new AjaxRequest(METHOD_POST, url, options);
        }
        static put(url: string, options?: AjaxRequestOptions) {
            return new AjaxRequest(METHOD_PUT, url, options);
        }
        static delete(url: string, options?: AjaxRequestOptions) {
            return new AjaxRequest(METHOD_DELETE, url, options);
        }
        static connect(url: string, options?: AjaxRequestOptions) {
            return new AjaxRequest(METHOD_CONNECT, url, options);
        }
        static options(url: string, options?: AjaxRequestOptions) {
            return new AjaxRequest(METHOD_OPTIONS, url, options);
        }
        static trace(url: string, options?: AjaxRequestOptions) {
            return new AjaxRequest(METHOD_TRACE, url, options);
        }
        static patch(url: string, options?: AjaxRequestOptions) {
            return new AjaxRequest(METHOD_PATCH, url, options);
        }
    }
}