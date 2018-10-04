var Core;
(function (Core) {
    var ResourceLoader;
    (function (ResourceLoader_1) {
        let Events;
        (function (Events) {
            class ResourceQueueStatusChangedEvent extends Core.MethodGroup {
                constructor(target, defaultListener) {
                    super(target, defaultListener);
                }
                invoke(args) {
                    super.invoke(args);
                }
                attach(listener) {
                    super.attach(listener);
                }
                detach(listener) {
                    super.detach(listener);
                }
            }
            Events.ResourceQueueStatusChangedEvent = ResourceQueueStatusChangedEvent;
            class ResourceStatusChangedEvent extends Core.MethodGroup {
                constructor(target, defaultListener) {
                    super(target, defaultListener);
                }
                invoke(args) {
                    super.invoke(args);
                }
                attach(listener) {
                    super.attach(listener);
                }
                detach(listener) {
                    super.detach(listener);
                }
            }
            Events.ResourceStatusChangedEvent = ResourceStatusChangedEvent;
            class ResourceProgressChangedEvent extends Core.MethodGroup {
                constructor(target, defaultListener) {
                    super(target, defaultListener);
                }
                invoke(args) {
                    super.invoke(args);
                }
                attach(listener) {
                    super.attach(listener);
                }
                detach(listener) {
                    super.detach(listener);
                }
            }
            Events.ResourceProgressChangedEvent = ResourceProgressChangedEvent;
        })(Events = ResourceLoader_1.Events || (ResourceLoader_1.Events = {}));
        const INFO_FILE_SRC = "../Built/Core.Loader.Info.xml";
        let ResourceQueueStatus;
        (function (ResourceQueueStatus) {
            ResourceQueueStatus[ResourceQueueStatus["Pending"] = 1] = "Pending";
            ResourceQueueStatus[ResourceQueueStatus["Queued"] = 2] = "Queued";
            ResourceQueueStatus[ResourceQueueStatus["Loading"] = 4] = "Loading";
            ResourceQueueStatus[ResourceQueueStatus["Loaded"] = 8] = "Loaded";
            ResourceQueueStatus[ResourceQueueStatus["Failed"] = 16] = "Failed";
        })(ResourceQueueStatus = ResourceLoader_1.ResourceQueueStatus || (ResourceLoader_1.ResourceQueueStatus = {}));
        ;
        class ResourceQueue {
            constructor() {
                /** Gets the handler for the Resource.StatusChanged event.*/
                this.statusChangedEvent = new Events.ResourceQueueStatusChangedEvent(this);
                /** Gets the handler for the Resource.ProgressChanged event.*/
                this.progressChangedEvent = new Events.ResourceProgressChangedEvent(this);
                this.items = new Array();
                //Update the queue status
                this._updateStatus(0);
            }
            /**
             * Gets the computed progress for all the queued resources;
             */
            _getProgress() {
                let loaded = 0, total = 0;
                for (let resource of this.items) {
                    loaded += resource.progress.loaded;
                    total += resource.progress.total;
                }
                return { loaded: loaded, total: total };
            }
            /**
             * Gets the computed progress for all the queued resources;
             */
            _getStatus() {
                let status = 0;
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
            _updateStatus(newStatus) {
                this.status = newStatus;
                this.statusChangedEvent.invoke({ newStatus: newStatus });
            }
            _updateProgress(newProgress) {
                this.progress = newProgress;
                this.progressChangedEvent.invoke({ newProgress: newProgress });
            }
            /**
             * Loads all the pending resources.
             */
            loadAll() {
                function resourceStatusChanged(resource, newStatus) {
                    let status = this._getStatus(); //Compute the current queue status
                    //Update the queue status
                    this._updateStatus(status);
                }
                function resourceProgressChanged(resource, newProgress) {
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
            enqueue(resource) {
                this.items.push(resource);
            }
            /**
             * Removes the specified resource from queue.
             * @param resource The resource being loaded.
             */
            dequeue(resource) {
                let index = this.items.indexOf(resource); //Get the zero-based position of the specified resource
                if (index == -1)
                    throw new Error("Cannot dequeue the specified resource, becauce it has not been queued.");
                this.items.splice(index, 1);
            }
            /**
             * Clears the resource queue.
             */
            dequeueAll() {
                let itemsCopy = this.items.slice(); //Make a copy of the queued resources
                for (let resource of itemsCopy)
                    this.dequeue(resource);
            }
        }
        ResourceLoader_1.ResourceQueue = ResourceQueue;
        let ResourceLoaderStatus;
        (function (ResourceLoaderStatus) {
            ResourceLoaderStatus[ResourceLoaderStatus["Pending"] = 0] = "Pending";
            ResourceLoaderStatus[ResourceLoaderStatus["Queued"] = 1] = "Queued";
            ResourceLoaderStatus[ResourceLoaderStatus["Loading"] = 2] = "Loading";
            ResourceLoaderStatus[ResourceLoaderStatus["Loaded"] = 3] = "Loaded";
            ResourceLoaderStatus[ResourceLoaderStatus["Failed"] = 4] = "Failed";
        })(ResourceLoaderStatus = ResourceLoader_1.ResourceLoaderStatus || (ResourceLoader_1.ResourceLoaderStatus = {}));
        class ResourceLoader {
            constructor(src) {
                /** Gets or sets the handler for the On Status Changed event.*/
                this.onstatuschanged = null;
                /** Gets or sets the handler for the On Progress Changed event.*/
                this.onprogresschanged = null;
                /** Gets the resource source URL.*/
                this.sourceURL = null;
                /** Gets the resource output Blob URL.*/
                this.outputBlob = null;
                /** Gets the load status for the resource.*/
                this.status = null;
                /** Gets the ajax request.*/
                this.ajaxRequest = null;
                /** Gets the html element.*/
                this.element = null;
                /** Gets the progress of the loading resource.*/
                this.progress = {
                    loaded: 0,
                    total: 0
                };
                //Set source URI
                this.sourceURL = src;
                //Update status
                this._updateStatus(ResourceLoaderStatus.Pending);
            }
            load() {
                //Create, open and send ajax request
                let ajaxRequest = new XMLHttpRequest();
                ajaxRequest.open("get", this.sourceURL);
                ajaxRequest.responseType = "blob";
                ajaxRequest.send();
                this.ajaxRequest = ajaxRequest;
                //Update status
                this._updateStatus(ResourceLoaderStatus.Loading);
                //Listen for the events
                function ajaxRequestLoaded() {
                    this.outputBlob = this.ajaxRequest.response;
                    //Update status
                    this._updateStatus(ResourceLoaderStatus.Loaded);
                }
                this.ajaxRequest.onload = ajaxRequestLoaded.bind(this);
                function ajaxRequestError() {
                    //Update status
                    this._updateStatus(ResourceLoaderStatus.Failed);
                    throw new Error(`Could not load resource at ${this.sourceURL}. Request failed with status ${this.ajaxRequest.statusText}.`);
                }
                this.ajaxRequest.onerror = ajaxRequestError.bind(this);
                function ajaxRequestProgress(evt) {
                    this._updateProgress({
                        loaded: evt.loaded,
                        total: evt.total
                    });
                }
                this.ajaxRequest.onprogress = ajaxRequestProgress.bind(this);
            }
            _updateStatus(newStatus) {
                this.status = newStatus;
                if (this.onstatuschanged instanceof Function)
                    this.onstatuschanged(this, newStatus);
            }
            _updateProgress(newProgress) {
                this.progress = newProgress;
                if (this.onprogresschanged instanceof Function)
                    this.onprogresschanged(this, newProgress);
            }
        }
        ResourceLoader_1.ResourceLoader = ResourceLoader;
    })(ResourceLoader = Core.ResourceLoader || (Core.ResourceLoader = {}));
})(Core || (Core = {}));
//# sourceMappingURL=Core.ResourceLoader.js.map