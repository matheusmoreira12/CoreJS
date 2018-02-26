///<reference path="Core.MethodGroup.ts"/>
///<reference path="Core.Exceptions.ts"/>
///<reference path="Core.Web.Ajax.ts"/>

namespace Core.Events {
    //Ajax event
    export type AjaxEventListener = (src: Web.AjaxRequest, innerReq: XMLHttpRequest, reqInfo: Web.AjaxRequestInfo) => void;

    export class AjaxEvent extends MethodGroup {
        constructor(target: Web.AjaxRequest) {
            //Run time validation
            if (!(target instanceof Web.AjaxRequest))
                throw new Exceptions.InvalidParameterTypeException("target", [Function, Web.AjaxRequest]);

            super(target);
        }

        target: Web.AjaxRequest;

        attach(listener: AjaxEventListener | AjaxEvent) {
            //Run time validation
            if (!(listener instanceof Function) && !(listener instanceof ProgressEvent))
                throw new Exceptions.InvalidParameterTypeException("listener", [Function, AjaxEvent]);

            super.attach(listener);
        }

        detach(listener: AjaxEventListener | AjaxEvent) {
            //Run time validation
            if (!(listener instanceof Function) && !(listener instanceof ProgressEvent))
                throw new Exceptions.InvalidParameterTypeException("listener", [Function, AjaxEvent]);

            super.detach(listener);
        }

        invoke(thisArg?: any) {
            super.invoke(thisArg, this.target.baseRequest, this.target.info);
        }
    }

    //Progress event
    export type ProgressEventListener = (src: any, done: number, total: number, percent: number) => void;

    export class ProgressEvent extends MethodGroup {
        attach(listener: ProgressEvent | ProgressEventListener) {
            //Run time validation
            if (!(listener instanceof Function) && !(listener instanceof ProgressEvent))
                throw new Exceptions.InvalidParameterTypeException("listener", [Function, ProgressEvent]);

            super.attach(listener);
        }

        detach(listener: ProgressEvent | ProgressEventListener) {
            //Run time validation
            if (!(listener instanceof Function) && !(listener instanceof ProgressEvent))
                throw new Exceptions.InvalidParameterTypeException("listener", [Function, ProgressEvent]);

            super.detach(listener);
        }

        invoke(done: number, total: number, percent: number, thisArg?: any) {
            //Run time validation
            if (typeof done !== NUMBER)
                throw new Exceptions.InvalidParameterTypeException("done", NUMBER);
            if (typeof done !== NUMBER)
                throw new Exceptions.InvalidParameterTypeException("total", NUMBER);
            if (typeof done !== NUMBER)
                throw new Exceptions.InvalidParameterTypeException("percent", NUMBER);

            super.invoke(thisArg, done, total, percent);
        }
    }

    //Property changed event
    export type PropertyChangedEventListener = (src: any, propertyName: string, oldValue: any, newValue: any) => void;

    export class PropertyChangedEvent extends MethodGroup {
        attach(listener: PropertyChangedEvent | PropertyChangedEventListener) {
            //Run time validation
            if (!(listener instanceof Function) && !(listener instanceof PropertyChangedEvent))
                throw new Exceptions.InvalidParameterTypeException("listener", [Function, PropertyChangedEvent]);

            super.attach(listener);
        }

        detach(listener: PropertyChangedEvent | PropertyChangedEventListener) {
            //Run time validation
            if (!(listener instanceof Function) && !(listener instanceof PropertyChangedEvent))
                throw new Exceptions.InvalidParameterTypeException("listener", [Function, PropertyChangedEvent]);

            super.detach(listener);
        }

        invoke(propertyName: string, oldValue: any, newValue: any, thisArg?: any) {
            //Run time validation
            if (typeof propertyName !== STRING)
                throw new Exceptions.InvalidParameterTypeException("propertyName", STRING);
            if (oldValue === null || typeof oldValue === UNDEF)
                throw new Exceptions.ParameterMissingException("oldValue");
            if (newValue === null || typeof newValue === UNDEF)
                throw new Exceptions.ParameterMissingException("newValue");

            super.invoke(thisArg, propertyName, oldValue, newValue);
        }
    }
}