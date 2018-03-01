///<reference path="Core.MethodGroup.ts"/>
///<reference path="Core.Web.Ajax.ts"/>

namespace Core {

    const PRELOADER_INFO_FILE_SRC = "/preloader-info.xml";
    const REQUIRED_SCRIPT_SOURCES = ["Core.js", "Core.exceptions.js", "Core.MethodGroup.js", "/Core.Ajax.js"];

    class RequiredScriptLoader {
        private static _loadedCount = 0;
        private static _scriptCount = 0;

        private static _allScriptsLoaded() {
            Preloader.execute();
        }

        static _scriptOnLoad() {
            this._loadedCount++;

            if (this._loadedCount == this._scriptCount)
                this._allScriptsLoaded();
        }

        static execute() {
            for (let i = 0; i < REQUIRED_SCRIPT_SOURCES.length; i++) {
                let scriptSrc = REQUIRED_SCRIPT_SOURCES[i];

                let scriptElement = document.createElement("script");
                scriptElement.type = "text/javascript";
                scriptElement.src = scriptSrc;

                this._scriptCount++;
                scriptElement.onload = () => this._scriptOnLoad();

                document.head.appendChild(scriptElement);
            }
        }
    }

    enum ResourceType { Script = 0, Stylesheet = 1 }
    enum ResourcePendingStatus { Pending = 0, Loading = 1, Error = 2, Done = 3 }

    class ResourceQuery {

        static fromXml(node: Element) {
            //Read all the necessary attributes
            let typeAttr: string = node.getAttribute('type'),
                srcAttr: string = node.getAttribute('src'),
                requiresAttr: string = node.getAttribute('requires'),
                defaultAttr: string = node.getAttribute('default');

            //Validate "type" attribute
            if (typeAttr == null)
                throw new Error('Invalid markup. Attribute "type" is required and must not be empty.');

            let isTypeAttrValid: boolean = typeof ResourcePendingStatus[typeAttr] !== UNDEF;
            if (!isTypeAttrValid)
                throw new Error('Invalid markup. The value for attribute "type" is invalid.');

            //Validate "src" attribute
            if (srcAttr == null)
                throw new Error('Invalid markup. Attribute "src" is required and must not be empty.');

            //Validate "default" attribute
            let isDefaultAttrPresent: boolean = defaultAttr != null;
            if (isDefaultAttrPresent && defaultAttr !== "default")
                throw new Error('Invalid markup. Invalid value for attribute "default".');

            function getDependencyNamesFromAttr(requiresAttr: string): string[] {
                return requiresAttr == null ? new Array<string>() : requiresAttr.replace(' ', '').split(',');
            }

            //Get additional info
            let dependencyNames: string[] = getDependencyNamesFromAttr(requiresAttr),
                isDefault = isDefaultAttrPresent,
                type = ResourceQuery[typeAttr];

            //Generate query
            if (node.nodeName == 'resource')
                return new ResourceQuery(srcAttr, type, dependencyNames, isDefault);
            else
                throw new Error('Invalid markup. All element tags contained within tag "preloaderInfo" must' +
                    ' be "resource" tags.');
        }

        constructor(src: string, type: number, dependencyNames: string[], isDefault: boolean) {
            this.src = src;
            this.type = type;
            this.dependencyNames = dependencyNames;
            this.pendingStatus = ResourcePendingStatus.Pending;
            this.isDefault = isDefault;
        }

        src: string;
        type: ResourceType;
        dependencies: ResourceQuery[];
        dependencyNames: string[];
        pendingStatus: ResourcePendingStatus;
        isDefault: boolean;

        loadedEvent: MethodGroup = new MethodGroup(this);
        errorEvent: MethodGroup = new MethodGroup(this);

        private resourceOnLoaded(src: Web.AjaxRequest, xhr: XMLHttpRequest, info: Web.AjaxRequestInfo) {
            this.pendingStatus = ResourcePendingStatus.Done;
            this.loadedEvent.invoke();
        }

        private resourceOnError(src: Web.AjaxRequest, xhr: XMLHttpRequest, info: Web.AjaxRequestInfo) {
            this.pendingStatus = ResourcePendingStatus.Error;
            this.errorEvent.invoke();
        }

        private startLoadingResource() {
            let resourceQuery = this;

            let ajax = Web.Ajax.get(this.src);
            ajax.loadedEvent.attach((src, xhr, info) => this.resourceOnLoaded(src, xhr, info));
            ajax.errorEvent.attach((src, xhr, info) => this.resourceOnError(src, xhr, info));
        }

        //Loads and executes this resource
        execute() {
            let resourceElem = null;

            function createResourceElement(content) {
                if (this.type == ResourceType.Script) {
                    let script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.innerHTML = content;

                    return script;
                }
                else if (this.type == ResourceType.Stylesheet) {
                    let stylesheet = document.createElement('style');
                    stylesheet.type = 'text/css';
                    stylesheet.innerHTML = content;

                    return stylesheet;
                }
            }

            function loadResource() {
                let resource = this;
                let ajax = Web.Ajax.get(this.src);

                this.pendingStatus = ResourcePendingStatus.Loading;

                function ajaxOnDone(src: Web.AjaxRequest, baseReq: XMLHttpRequest, reqInfo: Web.AjaxRequestInfo) {
                    createResourceElement(baseReq.responseText);
                    resource.pendingStatus = ResourcePendingStatus.Done;
                }
                ajax.doneEvent.attach(ajaxOnDone);

                function ajaxOnError(src: Web.AjaxRequest, baseReq: XMLHttpRequest, reqInfo: Web.AjaxRequestInfo) {
                    createResourceElement(baseReq.responseText);
                    resource.pendingStatus = ResourcePendingStatus.Error;
                }
                ajax.errorEvent.attach(ajaxOnError);
            }

            loadResource.call(this);
        }
    }

    class ResourceQueryArray extends Array {
        static fromXml(document) {
            let docElem = document.documentElement;

            if (docElem.nodeName !== 'preloaderInfo')
                throw new Exceptions.Exception('Invalid markup. The resource info xml document root must be a "preloaderInfo" tag.');

            let result = new ResourceQueryArray();

            for (let i = 0; i < docElem.childNodes.length; i++) {
                let childNode = docElem.childNodes[i];

                if (childNode.nodeType == XMLDocument.ELEMENT_NODE)
                    result.push(ResourceQuery.fromXml(childNode));
            }

            return result;
        }

        executeAll() {
            for (let i = 0; i < this.length; i++)
                this[i].execute();
        }
    }

    class Preloader {

        private static _allResourceQueries = null;

        private static _extractAndExecuteResources(document) {
            this._allResourceQueries = ResourceQueryArray.fromXml(document);

            this._allResourceQueries.executeAll();
        }

        private static _loadResources() {
            let ajax = Web.Ajax.get(PRELOADER_INFO_FILE_SRC);

            ajax.doneEvent.attach(function (ajax: Web.AjaxRequest, xhr: XMLHttpRequest, info: Web.AjaxRequestInfo) {
                let dp = new DOMParser();

                /*                        if (!xhr.responseXML)
                                    throw new Error('Unable to load Core.js. Could not parse preloader info file.' + 
                                        ' Invalid mime type.');
                                    
                                extractAndExecuteResources(xhr.responseXML);*/
                let xml = dp.parseFromString(xhr.responseText, 'text/xml');
                this._extractAndExecuteResources(xml);
            });
        }

        static execute() {
            this._loadResources();
        }
    }

    RequiredScriptLoader.execute();
}