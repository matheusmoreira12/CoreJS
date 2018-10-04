namespace Core.Events {
    //Progress event
    export type ProgressEventListener = (target: any, args: ProgressEventArgs) => void;

    export type ProgressEventArgs = { done: number, total: number };

    export class ProgressEvent extends MethodGroup {
        protected target: any;
        invoke(args: ProgressEventArgs): void {
            super.invoke(args);
        }
        attach(listener: ProgressEvent | ProgressEventListener): void {
            super.attach(listener);
        }

        detach(listener: ProgressEvent | ProgressEventListener): void {
            super.detach(listener);
        }
    }

    //PropertyChanged event
    export type PropertyChangedEventArgs = { propertyName: string, oldValue: any, newValue: any };
    export type PropertyChangedEventListener = (target: any, args: PropertyChangedEventArgs) => void;

    export class PropertyChangedEvent extends MethodGroup {
        protected target: any;
        invoke(args: PropertyChangedEventArgs): void {
            super.invoke(args);
        }
        attach(listener: PropertyChangedEvent | PropertyChangedEventListener): void {
            super.attach(listener);
        }
        detach(listener: PropertyChangedEvent | PropertyChangedEventListener): void {
            super.detach(listener);
        }
    }
}