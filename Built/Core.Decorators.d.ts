declare namespace Core.Decorators {
    function enumerable<T>(isEnumerable: boolean): (target: object, key: string, descriptor: PropertyDescriptor) => void;
    function writable(isWritable: boolean): (target: object, key: string, descriptor: PropertyDescriptor) => void;
    function configurable(isConfigurable: boolean): (target: object, key: string, descriptor: PropertyDescriptor) => void;
}
