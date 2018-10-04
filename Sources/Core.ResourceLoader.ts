namespace Core.ResourceLoader {

    export namespace Events {
        //ResourceQueue.OnStatusChanged event
        export type ResourceQueueStatusChangedEventArgs = { newStatus: ResourceQueueStatus };
        export type ResourceQueueStatusChangedEventListener = (target: ResourceQueue,
            args: ResourceQueueStatusChangedEventArgs) => void;

        export class ResourceQueueStatusChangedEvent extends MethodGroup {
            protected target: ResourceQueue;

            constructor(target: ResourceQueue, defaultListener?: ResourceQueueStatusChangedEventListener) {
                super(target, defaultListener);
            }

            invoke(args: ResourceQueueStatusChangedEventArgs): void {
                super.invoke(args);
            }

            attach(listener: ResourceQueueStatusChangedEvent | ResourceQueueStatusChangedEventListener): void {
                super.attach(listener);
            }

            detach(listener: ResourceQueueStatusChangedEvent | ResourceQueueStatusChangedEventListener): void {
                super.detach(listener);
            }
        }

        //ResourceLoader.OnStatusChanged event
        export type ResourceStatusChangedEventArgs = { newStatus: ResourceQueueStatus };
        export type ResourceStatusChangedEventListener = (target: ResourceQueue,
            args: ResourceStatusChangedEventArgs) => void;

        export class ResourceStatusChangedEvent extends MethodGroup {
            protected target: ResourceLoader;

            constructor(target: ResourceLoader, defaultListener?: ResourceStatusChangedEventListener) {
                super(target, defaultListener);
            }

            invoke(args: ResourceQueueStatusChangedEventArgs): void {
                super.invoke(args);
            }

            attach(listener: ResourceQueueStatusChangedEvent | ResourceQueueStatusChangedEventListener): void {
                super.attach(listener);
            }

            detach(listener: ResourceQueueStatusChangedEvent | ResourceQueueStatusChangedEventListener): void {
                super.detach(listener);
            }
        }

        //Resource.OnProgressChanged event
        export type ResourceProgressChangedEventArgs = { newProgress: ResourceProgressData };
        export type ResourceProgressChangedEventListener = (target: ResourceQueue,
            args: ResourceProgressChangedEventArgs) => void;

        export class ResourceProgressChangedEvent extends MethodGroup {
            protected target: ResourceLoader;

            constructor(target: ResourceQueue, defaultListener?: ResourceProgressChangedEventListener) {
                super(target, defaultListener);
            }

            invoke(args: ResourceProgressChangedEventArgs): void {
                super.invoke(args);
            }

            attach(listener: ResourceProgressChangedEvent | ResourceProgressChangedEventListener): void {
                super.attach(listener);
            }

            detach(listener: ResourceProgressChangedEvent | ResourceProgressChangedEventListener): void {
                super.detach(listener);
            }
        }
    }

    const INFO_FILE_SRC = "../Built/Core.Loader.Info.xml";

    export type ResourceProgressData = { loaded: number, total: number };

    export enum ResourceQueueStatus { Pending = 1, Queued = 2, Loading = 4, Loaded = 8, Failed = 16 };

    export class ResourceQueue {
        public constructor() {
            this.items = new Array<ResourceLoader>();

            //Update the queue status
            this._updateStatus(0);
        }

        /**
         * Gets the computed progress for all the queued resources;
         */
        protected _getProgress(): ResourceProgressData {
            let loaded: number = 0,
                total: number = 0;

            for (let resource of this.items) {
                loaded += resource.progress.loaded;
                total += resource.progress.total;
            }

            return { loaded: loaded, total: total };
        }

        /**
         * Gets the computed progress for all the queued resources;
         */
        protected _getStatus(): ResourceQueueStatus {
            let status: ResourceQueueStatus = 0;

            for (let resource of this.items)
                switch (resource.status) {
                    case ResourceLoaderStatus.Queued:
                        status = status | ResourceQueueStatus.Queued;
                        break;
                    case ResourceLoaderStatus.Loading:
                        status = status | ResourceQueueStatus.Loading;
                        break;
                    case ResourceLoaderStatus.Loaded:
                        status = status | ResourceQueueStatus.Loaded;
                        break;
                    case ResourceLoaderStatus.Failed:
                        status = status | ResourceQueueStatus.Failed;
                        break;
                }

            return status;
        }

        protected _updateStatus(newStatus: ResourceQueueStatus): void {
            this.status = newStatus;

            this.statusChangedEvent.invoke({ newStatus: newStatus });
        }

        protected _updateProgress(newProgress: ResourceProgressData): void {
            this.progress = newProgress;

            this.progressChangedEvent.invoke({ newProgress: newProgress });
        }

        /**
         * Loads all the pending resources.
         */
        public loadAll(): void {
            function resourceStatusChanged(this: ResourceQueue, resource: ResourceLoader,
                newStatus: ResourceLoaderStatus) {

                let status = this._getStatus(); //Compute the current queue status
                //Update the queue status
                this._updateStatus(status);
            }

            function resourceProgressChanged(this: ResourceQueue, resource: ResourceLoader,
                newProgress: ResourceProgressData) {

                let progress = this._getProgress(); //Compute the current queue progress
                //Update the queue status
                this._updateProgress(progress);
            }

            for (let resource of this.items) {
                resource.load();
                resource.onprogresschanged = resourceProgressChanged.bind(this);
                resource.onstatuschanged = resourceStatusChanged.bind(this);
            }
        }

        /**
         * Adds the specified resource to queue.
         * @param resource The resource being loaded.
         */
        public enqueue(resource: ResourceLoader): void {
            this.items.push(resource);
        }

        /**
         * Removes the specified resource from queue.
         * @param resource The resource being loaded.
         */
        public dequeue(resource: ResourceLoader): void {
            let index = this.items.indexOf(resource); //Get the zero-based position of the specified resource
            if (index == -1)
                throw new Error("Cannot dequeue the specified resource, becauce it has not been queued.");

            this.items.splice(index, 1);
        }

        /**
         * Clears the resource queue.
         */
        public dequeueAll() {
            let itemsCopy = this.items.slice(); //Make a copy of the queued resources

            for (let resource of itemsCopy)
                this.dequeue(resource);
        }

        /** Gets the queued resources.*/
        public items: Array<ResourceLoader>;
        /** Gets the current queue load progress.*/
        public progress: ResourceProgressData;
        /** Gets the current queue status*/
        public status: ResourceQueueStatus;

        /** Gets the handler for the Resource.StatusChanged event.*/
        public statusChangedEvent = new Events.ResourceQueueStatusChangedEvent(this);
        /** Gets the handler for the Resource.ProgressChanged event.*/
        public progressChangedEvent = new Events.ResourceProgressChangedEvent(this);
    }

    export enum ResourceLoaderStatus { Pending, Queued, Loading, Loaded, Failed }

    export type ResourceStatusChangedEvent = (resource: ResourceLoader, newStatus: ResourceLoaderStatus) => void;
    export type ResourceProgressChangedEvent = (resource: ResourceLoader, newProgress: ResourceProgressData) => void;

    export class ResourceLoader {
        public constructor(src) {
            //Set source URI
            this.sourceURL = src;

            //Update status
            this._updateStatus(ResourceLoaderStatus.Pending);
        }

        public load() {
            //Create, open and send ajax request
            let ajaxRequest = new XMLHttpRequest();
            ajaxRequest.open("get", this.sourceURL);
            ajaxRequest.responseType = "blob";
            ajaxRequest.send();

            this.ajaxRequest = ajaxRequest;

            //Update status
            this._updateStatus(ResourceLoaderStatus.Loading);

            //Listen for the events
            function ajaxRequestLoaded(this: ResourceLoader) {
                this.outputBlob = this.ajaxRequest.response;

                //Update status
                this._updateStatus(ResourceLoaderStatus.Loaded);
            }
            this.ajaxRequest.onload = ajaxRequestLoaded.bind(this);

            function ajaxRequestError(this: ResourceLoader) {
                //Update status
                this._updateStatus(ResourceLoaderStatus.Failed);

                throw new Error(`Could not load resource at ${this.sourceURL}. Request failed with status ${this.ajaxRequest.statusText}.`);
            }
            this.ajaxRequest.onerror = ajaxRequestError.bind(this);

            function ajaxRequestProgress(this: ResourceLoader, evt: ProgressEvent) {
                this._updateProgress({
                    loaded: evt.loaded,
                    total: evt.total
                });
            }
            this.ajaxRequest.onprogress = ajaxRequestProgress.bind(this);
        }

        protected _updateStatus(newStatus: ResourceLoaderStatus): void {
            this.status = newStatus;

            if (this.onstatuschanged instanceof Function)
                this.onstatuschanged(this, newStatus);
        }

        protected _updateProgress(newProgress: ResourceProgressData): void {
            this.progress = newProgress;

            if (this.onprogresschanged instanceof Function)
                this.onprogresschanged(this, newProgress);
        }

        /** Gets or sets the handler for the On Status Changed event.*/
        public onstatuschanged: ResourceStatusChangedEvent = null;
        /** Gets or sets the handler for the On Progress Changed event.*/
        public onprogresschanged: ResourceProgressChangedEvent = null;
        /** Gets the resource source URL.*/
        public sourceURL: string = null;
        /** Gets the resource output Blob URL.*/
        public outputBlob: string = null;
        /** Gets the load status for the resource.*/
        public status: ResourceLoaderStatus = null;
        /** Gets the ajax request.*/
        public ajaxRequest: XMLHttpRequest = null;
        /** Gets the html element.*/
        public element: HTMLElement = null;
        /** Gets the progress of the loading resource.*/
        public progress: ResourceProgressData = {
            loaded: 0,
            total: 0
        };
    }
}