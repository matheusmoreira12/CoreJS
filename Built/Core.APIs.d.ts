declare namespace Core.APIs {
    enum APILoaderPendingStatus {
        Pending = 0,
        LoadError = 1,
        Invalid = 2,
        Loaded = 3,
    }
    class API {
    }
    class APILoader {
        constructor(apiName: string, apiURL: string);
        loadedEvent: Events.APILoaderEvent;
        errorEvent: Events.APILoaderEvent;
        private _applyAPI(loadedContent);
        private _loadAPI();
        private _apiName;
        private _apiURL;
        private _loadedContent;
        private _ajaxRequest;
    }
}
declare namespace Core.Events {
    type APILoaderEventListener = (src: APIs.APILoader) => void;
    class APILoaderEvent extends MethodGroup {
        constructor(target: APIs.APILoader, defaultListener?: APILoaderEventListener);
        target: APIs.APILoader;
        attach(listener: APILoaderEventListener | APILoaderEvent): void;
        detach(listener: APILoaderEventListener | APILoaderEvent): void;
        invoke(thisArg?: any): void;
    }
}
