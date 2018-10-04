declare namespace Core.ResourceLoader {
    namespace Events {
        type ResourceQueueStatusChangedEventArgs = {
            newStatus: ResourceQueueStatus;
        };
        type ResourceQueueStatusChangedEventListener = (target: ResourceQueue, args: ResourceQueueStatusChangedEventArgs) => void;
        class ResourceQueueStatusChangedEvent extends MethodGroup {
            protected target: ResourceQueue;
            constructor(target: ResourceQueue, defaultListener?: ResourceQueueStatusChangedEventListener);
            invoke(args: ResourceQueueStatusChangedEventArgs): void;
            attach(listener: ResourceQueueStatusChangedEvent | ResourceQueueStatusChangedEventListener): void;
            detach(listener: ResourceQueueStatusChangedEvent | ResourceQueueStatusChangedEventListener): void;
        }
        type ResourceStatusChangedEventArgs = {
            newStatus: ResourceQueueStatus;
        };
        type ResourceStatusChangedEventListener = (target: ResourceQueue, args: ResourceStatusChangedEventArgs) => void;
        class ResourceStatusChangedEvent extends MethodGroup {
            protected target: ResourceLoader;
            constructor(target: ResourceLoader, defaultListener?: ResourceStatusChangedEventListener);
            invoke(args: ResourceQueueStatusChangedEventArgs): void;
            attach(listener: ResourceQueueStatusChangedEvent | ResourceQueueStatusChangedEventListener): void;
            detach(listener: ResourceQueueStatusChangedEvent | ResourceQueueStatusChangedEventListener): void;
        }
        type ResourceProgressChangedEventArgs = {
            newProgress: ResourceProgressData;
        };
        type ResourceProgressChangedEventListener = (target: ResourceQueue, args: ResourceProgressChangedEventArgs) => void;
        class ResourceProgressChangedEvent extends MethodGroup {
            protected target: ResourceLoader;
            constructor(target: ResourceQueue, defaultListener?: ResourceProgressChangedEventListener);
            invoke(args: ResourceProgressChangedEventArgs): void;
            attach(listener: ResourceProgressChangedEvent | ResourceProgressChangedEventListener): void;
            detach(listener: ResourceProgressChangedEvent | ResourceProgressChangedEventListener): void;
        }
    }
    type ResourceProgressData = {
        loaded: number;
        total: number;
    };
    enum ResourceQueueStatus {
        Pending = 1,
        Queued = 2,
        Loading = 4,
        Loaded = 8,
        Failed = 16,
    }
    class ResourceQueue {
        constructor();
        /**
         * Gets the computed progress for all the queued resources;
         */
        protected _getProgress(): ResourceProgressData;
        /**
         * Gets the computed progress for all the queued resources;
         */
        protected _getStatus(): ResourceQueueStatus;
        protected _updateStatus(newStatus: ResourceQueueStatus): void;
        protected _updateProgress(newProgress: ResourceProgressData): void;
        /**
         * Loads all the pending resources.
         */
        loadAll(): void;
        /**
         * Adds the specified resource to queue.
         * @param resource The resource being loaded.
         */
        enqueue(resource: ResourceLoader): void;
        /**
         * Removes the specified resource from queue.
         * @param resource The resource being loaded.
         */
        dequeue(resource: ResourceLoader): void;
        /**
         * Clears the resource queue.
         */
        dequeueAll(): void;
        /** Gets the queued resources.*/
        items: Array<ResourceLoader>;
        /** Gets the current queue load progress.*/
        progress: ResourceProgressData;
        /** Gets the current queue status*/
        status: ResourceQueueStatus;
        /** Gets the handler for the Resource.StatusChanged event.*/
        statusChangedEvent: Events.ResourceQueueStatusChangedEvent;
        /** Gets the handler for the Resource.ProgressChanged event.*/
        progressChangedEvent: Events.ResourceProgressChangedEvent;
    }
    enum ResourceLoaderStatus {
        Pending = 0,
        Queued = 1,
        Loading = 2,
        Loaded = 3,
        Failed = 4,
    }
    type ResourceStatusChangedEvent = (resource: ResourceLoader, newStatus: ResourceLoaderStatus) => void;
    type ResourceProgressChangedEvent = (resource: ResourceLoader, newProgress: ResourceProgressData) => void;
    class ResourceLoader {
        constructor(src: any);
        load(): void;
        protected _updateStatus(newStatus: ResourceLoaderStatus): void;
        protected _updateProgress(newProgress: ResourceProgressData): void;
        /** Gets or sets the handler for the On Status Changed event.*/
        onstatuschanged: ResourceStatusChangedEvent;
        /** Gets or sets the handler for the On Progress Changed event.*/
        onprogresschanged: ResourceProgressChangedEvent;
        /** Gets the resource source URL.*/
        sourceURL: string;
        /** Gets the resource output Blob URL.*/
        outputBlob: string;
        /** Gets the load status for the resource.*/
        status: ResourceLoaderStatus;
        /** Gets the ajax request.*/
        ajaxRequest: XMLHttpRequest;
        /** Gets the html element.*/
        element: HTMLElement;
        /** Gets the progress of the loading resource.*/
        progress: ResourceProgressData;
    }
}
