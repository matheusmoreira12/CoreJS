//Core namespace declaration
Core = new function() {
    const core = this;

    const UNDEF = "undefined";

    this.EventHandler = class EventHandler {
        constructor(target) {
            this._attachedListeners = [];
            this._attachedHandlers = [];
            this._propagationStopped = false;
            this._target = target;
        }
        
        stopPropagation() {
            this._propagationStopped = true;
        }
        
        invoke(source, params) {
            this._propagationStopped = false;
            
            //Invoke all attached listeners
            for (var i = 0; i < this._attachedListeners.length; i++) {
                this._attachedListeners[i].apply(this._target, arguments);
                
                if (this._propagationStopped)
                    break;
            }
            
            //Invoke all attached handlers
            for (var i = 0; i < this._attachedHandlers.length; i++) {
                this._attachedHandlers[i].invoke.apply(this._target, arguments);
                
                if (this._propagationStopped)
                    break;
            }
        }
        
        attach(listener) {
            if (listener instanceof Event)
                this._attachedHandlers.push(listener);
            else if (listener instanceof Function)
                this._attachedListeners.push(listener);
            else
                throw new Error('Cannnot attach listener. Parameter "listener" is not a valid Function or EventHandler.');
        }
        
        detach(listener) {
            if (listener instanceof Event) {
                var index = this._attachedHandlers.indexOf(listener);
                
                if (index == -1)
                    throw new Error('Cannot detach EventHandler. No attached items correspond to parameter "listener".');
                
                this._attachedHandlers.splice(index, 1);
            }
            else if (listener instanceof Function) {
                var index = this._attachedListeners.indexOf(listener);
                
                if (index == -1)
                    throw new Error('Cannot detach EventHandler. No attached items correspond to parameter "listener".');
                
                this._attachedListeners.splice(index, 1);
            }
            else
                throw new Error('Cannnot detach listener. Parameter "listener" is not a valid Function or EventHandler.');
        }
    }

    this.Ajax = new (function() {
        const ajax = this;
        
        this.LoadError = class LoadError extends Error {
            constructor (message, wrapper) {
                super();
                
                if (!(wrapper instanceof ajax.RequestWrapper))
                    throw new TypeError('Parameter "wrapper" is not a valid RequestWrapper.');
                
                var xhr = wrapper.xmlHttpRequest;
                
                this.message = (message ? (message + ' ') : '') + wrapper.info.method + ' request to "' + 
                    wrapper.info.url + '" failed with status code ' + xhr.status + '("' + xhr.statusText + '").';
            }
        }

        this.RequestInfo = class RequestInfo {
            constructor(method, url, options) {
                this.method = method;
                this.url = url;
                this.options = options;
            }
        }
        
        this.RequestWrapper = class RequestWrapper {
            static get METHOD_GET() { return 'GET'; }
            static get METHOD_HEAD() { return 'HEAD'; }
            static get METHOD_POST() { return 'POST'; }
            static get METHOD_PUT() { return 'PUT'; }
            static get METHOD_DELETE() { return 'DELETE'; }
            static get METHOD_CONNECT() { return 'CONNECT'; }
            static get METHOD_OPTIONS() { return 'OPTIONS'; }
            static get METHOD_TRACE() { return 'TRACE'; }
            static get METHOD_PATCH() { return 'PATCH'; }
            
            constructor(method, url, options) {
                const requestWrapper = this;
                
                options = options || {};
                
                var asynchronous = options.asynchronous || true,
                    user = options.user || null,
                    password = options.password || null,
                    data = options.data || null;

                this.doneEvent = new core.EventHandler(this);
                this.loadedEvent = new core.EventHandler(this);
                this.errorEvent = new core.EventHandler(this);
                this.headersReceivedEvent = new core.EventHandler(this);
                this.loadingEvent = new core.EventHandler(this);
                this.openedEvent = new core.EventHandler(this);
                this.unsentEvent = new core.EventHandler(this);
                
                this.info = new ajax.RequestInfo(method, url, options);
                
                var xhr = new XMLHttpRequest();
                xhr.open(method, url, asynchronous, user, password);
                xhr.send(data);
            
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == XMLHttpRequest.DONE) {
                        requestWrapper.doneEvent.invoke(xhr, requestWrapper.info);
                        
                        if (xhr.status == 200)
                            requestWrapper.loadedEvent.invoke(xhr, requestWrapper.info);
                        else
                            requestWrapper.errorEvent.invoke(xhr, requestWrapper.info);
                    }
                    else if (xhr.readyState == XMLHttpRequest.HEADERS_RECEIVED)
                        requestWrapper.headersReceivedEvent.invoke(xhr, requestWrapper.info);
                    else if (xhr.readyState == XMLHttpRequest.LOADING)
                        requestWrapper.loadingEvent.invoke(xhr, requestWrapper.info);
                    else if (xhr.readyState == XMLHttpRequest.OPENED)
                        requestWrapper.openedEvent.invoke(xhr, requestWrapper.info);
                    else if (xhr.readyState == XMLHttpRequest.UNSENT)
                        requestWrapper.unsentEvent.invoke(xhr, requestWrapper.info);
                }
            
                this.xmlHttpRequest = xhr;
            }
        }
        
        this.get = function(url, options) {
            return new this.RequestWrapper(this.RequestWrapper.METHOD_GET, url, options);
        }
        this.head = function(url, options) {
            return new this.RequestWrapper(this.RequestWrapper.METHOD_HEAD, url, options);
        }
        this.post = function(url, options) {
            return new this.RequestWrapper(this.RequestWrapper.METHOD_POST, url, options);
        }
        this.put = function(url, options) {
            return new this.RequestWrapper(this.RequestWrapper.METHOD_PUT, url, options);
        }
        this.delete = function(url, options) {
            return new this.RequestWrapper(this.RequestWrapper.METHOD_DELETE, url, options);
        }
        this.connect = function(url, options) {
            return new this.RequestWrapper(this.RequestWrapper.METHOD_CONNECT, url, options);
        }
        this.options = function(url, options) {
            return new this.RequestWrapper(this.RequestWrapper.METHOD_OPTIONS, url, options);
        }
        this.trace = function(url, options) {
            return new this.RequestWrapper(this.RequestWrapper.METHOD_TRACE, url, options);
        }
        this.patch = function(url, options) {
            return new this.RequestWrapper(this.RequestWrapper.METHOD_PATCH, url, options);
        }
    });

    //Core.Preloader namespace declaration
    this.Preloader = new function(params) {

        const preloader = this;

        const PRELOADER_INFO_FILE_SRC = "/preloader-info.xml";

        class ResourceQuery {
            static get STATUS_PENDING() { return 0; }
            static get STATUS_ERROR() { return 1; }
            static get STATUS_DONE() { return 2; }

            static get TYPE_SCRIPT() { return 0; }
            static get TYPE_STYLESHEET() { return 1; }
            
            static get STRING_TYPE_MAP() { 
                return { 
                    "script" : ResourceQuery.TYPE_SCRIPT,
                    "stylesheet" : ResourceQuery.TYPE_STYLESHEET
                }
            }

            static fromXml(node) {
                //Read all the necessary attributes
                var typeAttr = node.getAttribute('type'),
                    srcAttr = node.getAttribute('src'),
                    requiresAttr = node.getAttribute('requires'),
                    defaultAttr = node.getAttribute('default');

                //Validate "type" attribute
                var isTypeAttrPresent = !!typeAttr;
                if (!isTypeAttrPresent)
                    throw new Error('Invalid markup. Attribute "type" is required and must not be empty.');

                var isTypeAttrValid = typeof ResourceQuery.STRING_TYPE_MAP[typeAttr] != UNDEF;
                if (!isTypeAttrValid)
                    throw new Error('Invalid markup. The value for attribute "type" is invalid.');

                //Validate "src" attribute
                var isSrcAttrPresent = !!srcAttr;
                if (!isSrcAttrPresent)
                    throw new Error('Invalid markup. Attribute "src" is required and must not be empty.');
                
                //Validate "default" attribute    
                var isDefaultAttrPresent = !!defaultAttr,
                    isDefaultAttrValid = defaultAttr == "default";
                if (isDefaultAttrPresent && !isDefaultAttrValid)
                    throw new Error('Invalid markup. Invalid value for attribute "default".');
                
                //Get additional info
                var dependencies = !requiresAttr ? [] : (requiresAttr.replace(' ', '').split(',')),
                    isDefault = isDefaultAttrPresent,
                    type = ResourceQuery.STRING_TYPE_MAP[typeAttr];
                
                //Generate query
                if (node.nodeName == 'resource')
                    return new ResourceQuery(srcAttr, type, dependencies, isDefault);
                else
                    throw new Error('Invalid markup. All element tags contained within tag "preloaderInfo" must' + 
                        ' be "resource" tags.'); 
            }

            constructor(src, type, dependencies, isDefault) {
                //The resource source
                this.src = src;
                //The type of this resource query
                this.type = type;
                //The resource dependencies (this resource depends on them to work properly)
                this.dependencies = dependencies || [];
                //The pending status of this resource query
                this.pendingStatus = ResourceQuery.STATUS_PENDING;
                //Indicates if this resource has precedence to all the non-default ones
                this.isDefault = isDefault;
            }

            //Loads and executes this resource
            execute() {
                const resourceQuery = this;

                function awaitDependencyLoad() {
                    function checkDependencyPendingStatus() {
                        var pendingStatus = this.getDependencyPendingStatus(this);

                        if (pendingStatus == ResourceQuery.STATUS_DONE) {
                            document.head.appendChild(resourceElem);

                            resourceQuery.pendingStatus = ResourceQuery.STATUS_DONE;
                        }
                        else if (pendingStatus == ResourceQuery.STATUS_ERROR) {
                            resourceQuery.pendingStatus = ResourceQuery.STATUS_ERROR;
                        }
                        else
                            setTimeout(checkDependencyPendingStatus, 100, this);
                    }
                    
                    checkDependencyPendingStatus.call(this);
                }

                let resourceElem = null;

                function createResourceElement(content) {
                    if (this.type == ResourceQuery.TYPE_SCRIPT)
                    {
                        var script = document.createElement('script');
                        script.type = 'text/javascript';
                        script.innerHTML = content;
                        
                        return script;
                    }
                    else if (this.type == ResourceQuery.TYPE_STYLESHEET)
                    {
                        var stylesheet = document.createElement('style');
                        stylesheet.type = 'text/css';
                        stylesheet.innerHTML = content;
                        
                        return stylesheet;
                    }
                }
                
                function loadResource() {
                    var ajax = core.Ajax.get(this.src);
                    
                    ajax.loadedEvent.attach(function (xhr) {
                        resourceQuery._loadedContent = xhr.responseText;
                        //Generate resource element from type and content
                        resourceElem = createResourceElement.call(resourceQuery, xhr.responseText);
                        //Wait for the dependencies to load
                        awaitDependencyLoad.call(resourceQuery);
                    });
                    
                    ajax.errorEvent.attach(function () {
                        resourceQuery.pendingStatus = ResourceQuery.STATUS_ERROR;
                    });
                }
                
                loadResource.call(this);
            }
            
            //Checks if this script's dependencies have been loaded
            getDependencyPendingStatus() {
                if (this.dependencies.length == 0)
                    return ResourceQuery.STATUS_DONE;
                            
                var depQueries = preloader.allResourceQueries.getAllDependencyQueries(this);
                
                var loadingFailed = depQueries.some((d) => { return d.pendingStatus == ResourceQuery.STATUS_ERROR });
                if (loadingFailed)
                    return ResourceQuery.STATUS_ERROR;
                
                var loadingDone = depQueries.every((d) => { return d.pendingStatus == ResourceQuery.STATUS_DONE });
                if (loadingDone)
                    return ResourceQuery.STATUS_DONE;
                    
                return ResourceQuery.STATUS_PENDING;
            }
        }
        
        class ResourceQueryArray extends Array {
            static fromXml(document) {
                var docElem = document.documentElement;
                
                if (docElem.nodeName != 'preloaderInfo')
                    throw new Error('Invalid markup. The resource info xml document root must be a "preloaderInfo" tag.');
                
                var result = new ResourceQueryArray();
                
                for (var i = 0; i < docElem.childNodes.length; i++) {
                    var childNode = docElem.childNodes[i];
                    
                    if (childNode.nodeType == XMLDocument.ELEMENT_NODE)
                        result.push(ResourceQuery.fromXml(childNode));
                }
                    
                return result;
            }
            
            getAllDependencyQueries(query) {
                var result = preloader.allResourceQueries.filter((q) => { 
                    return q.dependencies.indexOf(q.src) >= 0; });
                
                if (!query.isDefault)
                {
                    var defaultResources = preloader.allResourceQueries.getDefaultResourceQueries();
                    Array.prototype.push.apply(result, defaultResources);
                }
                
                return result;
            }
            
            getDefaultResourceQueries() {
                return this.filter((q) => { return q.isDefault }, this);
            }
            
            executeAll() {
                for (var i = 0; i < this.length; i++)
                    this[i].execute();
            }
        }
        
        this.allResourceQueries = null;

        function extractAndExecuteResources(document) {
            preloader.allResourceQueries = ResourceQueryArray.fromXml(document);
            
            preloader.allResourceQueries.executeAll();
        }

        function loadResources() {
            var ajax = core.Ajax.get(PRELOADER_INFO_FILE_SRC);
            
            ajax.doneEvent.attach(function (xhr) {
                var dp = new DOMParser();
                
/*                        if (!xhr.responseXML)
                    throw new Error('Unable to load Core.js. Could not parse preloader info file.' + 
                        ' Invalid mime type.');
                    
                extractAndExecuteResources(xhr.responseXML);*/
                var xml = dp.parseFromString(xhr.responseText, 'text/xml');
                extractAndExecuteResources(xml);
            });
        }
        
        loadResources();
    }
}