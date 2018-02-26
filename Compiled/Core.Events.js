///<reference path="Core.MethodGroup.ts"/>
///<reference path="Core.Exceptions.ts"/>
///<reference path="Core.Web.Ajax.ts"/>
var Core;
(function (Core) {
    var Events;
    (function (Events) {
        class AjaxEvent extends Core.MethodGroup {
            constructor(target) {
                //Run time validation
                if (!(target instanceof Core.Web.AjaxRequest))
                    throw new Core.Exceptions.InvalidParameterTypeException("target", [Function, Core.Web.AjaxRequest]);
                super(target);
            }
            attach(listener) {
                //Run time validation
                if (!(listener instanceof Function) && !(listener instanceof ProgressEvent))
                    throw new Core.Exceptions.InvalidParameterTypeException("listener", [Function, AjaxEvent]);
                super.attach(listener);
            }
            detach(listener) {
                //Run time validation
                if (!(listener instanceof Function) && !(listener instanceof ProgressEvent))
                    throw new Core.Exceptions.InvalidParameterTypeException("listener", [Function, AjaxEvent]);
                super.detach(listener);
            }
            invoke(thisArg) {
                super.invoke(thisArg, this.target.baseRequest, this.target.info);
            }
        }
        Events.AjaxEvent = AjaxEvent;
        class ProgressEvent extends Core.MethodGroup {
            attach(listener) {
                //Run time validation
                if (!(listener instanceof Function) && !(listener instanceof ProgressEvent))
                    throw new Core.Exceptions.InvalidParameterTypeException("listener", [Function, ProgressEvent]);
                super.attach(listener);
            }
            detach(listener) {
                //Run time validation
                if (!(listener instanceof Function) && !(listener instanceof ProgressEvent))
                    throw new Core.Exceptions.InvalidParameterTypeException("listener", [Function, ProgressEvent]);
                super.detach(listener);
            }
            invoke(done, total, percent, thisArg) {
                //Run time validation
                if (typeof done !== Core.NUMBER)
                    throw new Core.Exceptions.InvalidParameterTypeException("done", Core.NUMBER);
                if (typeof done !== Core.NUMBER)
                    throw new Core.Exceptions.InvalidParameterTypeException("total", Core.NUMBER);
                if (typeof done !== Core.NUMBER)
                    throw new Core.Exceptions.InvalidParameterTypeException("percent", Core.NUMBER);
                super.invoke(thisArg, done, total, percent);
            }
        }
        Events.ProgressEvent = ProgressEvent;
        class PropertyChangedEvent extends Core.MethodGroup {
            attach(listener) {
                //Run time validation
                if (!(listener instanceof Function) && !(listener instanceof PropertyChangedEvent))
                    throw new Core.Exceptions.InvalidParameterTypeException("listener", [Function, PropertyChangedEvent]);
                super.attach(listener);
            }
            detach(listener) {
                //Run time validation
                if (!(listener instanceof Function) && !(listener instanceof PropertyChangedEvent))
                    throw new Core.Exceptions.InvalidParameterTypeException("listener", [Function, PropertyChangedEvent]);
                super.detach(listener);
            }
            invoke(propertyName, oldValue, newValue, thisArg) {
                //Run time validation
                if (typeof propertyName !== Core.STRING)
                    throw new Core.Exceptions.InvalidParameterTypeException("propertyName", Core.STRING);
                if (oldValue === null || typeof oldValue === Core.UNDEF)
                    throw new Core.Exceptions.ParameterMissingException("oldValue");
                if (newValue === null || typeof newValue === Core.UNDEF)
                    throw new Core.Exceptions.ParameterMissingException("newValue");
                super.invoke(thisArg, propertyName, oldValue, newValue);
            }
        }
        Events.PropertyChangedEvent = PropertyChangedEvent;
    })(Events = Core.Events || (Core.Events = {}));
})(Core || (Core = {}));
