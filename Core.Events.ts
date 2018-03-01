




namespace Core.Events {
    //Progress event
    export type ProgressEventListener = (src: any, done: number, total: number, percent: number) => void;

    export class ProgressEvent extends MethodGroup {
        constructor(target: any, defaultListener?: ProgressEventListener) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("target", target, [Function, Web.AjaxRequest], true);

            super(target);
        }

        target: any;

        attach(listener: ProgressEventListener | ProgressEvent) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("listener", listener, [Function, ProgressEvent]);

            super.attach(listener);
        }

        detach(listener: ProgressEventListener | ProgressEvent) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("listener", listener, [Function, ProgressEvent]);

            super.detach(listener);
        }

        invoke(done: number, total: number, thisArg?: any) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("done", done, NUMBER, true, false);
            Validation.RuntimeValidator.validateParameter("total", total, NUMBER, true, false);

            let percentage = done / total * 100;

            super.invoke(null, done, total, percentage);
        }
    }

    //PropertyChanged event
    export type PropertyChangedEventListener = (src: any, propertyName: string, oldValue: any, newValue: any) => void;

    export class PropertyChangedEvent extends MethodGroup {
        constructor(target: any, defaultListener?: PropertyChangedEventListener) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("target", target, [Function, Web.AjaxRequest], true);

            super(target);
        }

        target: any;

        attach(listener: PropertyChangedEventListener | PropertyChangedEvent) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("listener", listener, [Function, PropertyChangedEvent]);

            super.attach(listener);
        }

        detach(listener: PropertyChangedEventListener | PropertyChangedEvent) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("listener", listener, [Function, PropertyChangedEvent]);

            super.detach(listener);
        }

        invoke(propertyName: string, oldValue: any, newValue: any, thisArg?: any) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("propertyName", propertyName, STRING, true, false);
            Validation.RuntimeValidator.validateParameter("oldValue", oldValue, [], true);
            Validation.RuntimeValidator.validateParameter("newValue", newValue, [], true);

            super.invoke(null, this.target.baseRequest, this.target.info);
        }
    }
}