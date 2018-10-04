declare namespace Core.Events {
    type ProgressEventListener = (target: any, args: ProgressEventArgs) => void;
    type ProgressEventArgs = {
        done: number;
        total: number;
    };
    class ProgressEvent extends MethodGroup {
        protected target: any;
        invoke(args: ProgressEventArgs): void;
        attach(listener: ProgressEvent | ProgressEventListener): void;
        detach(listener: ProgressEvent | ProgressEventListener): void;
    }
    type PropertyChangedEventArgs = {
        propertyName: string;
        oldValue: any;
        newValue: any;
    };
    type PropertyChangedEventListener = (target: any, args: PropertyChangedEventArgs) => void;
    class PropertyChangedEvent extends MethodGroup {
        protected target: any;
        invoke(args: PropertyChangedEventArgs): void;
        attach(listener: PropertyChangedEvent | PropertyChangedEventListener): void;
        detach(listener: PropertyChangedEvent | PropertyChangedEventListener): void;
    }
}
