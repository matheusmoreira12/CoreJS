namespace Core.Decorators {
    export function enumerable<T>(isEnumerable: boolean) {
        return function (target: object, key: string, descriptor: PropertyDescriptor) {
            descriptor.enumerable = isEnumerable;
        }
    }

    export function writable(isWritable: boolean) {
        return function (target: object, key: string, descriptor: PropertyDescriptor) {
            descriptor.writable = isWritable;
        }
    }

    export function configurable(isConfigurable: boolean) {
        return function (target: object, key: string, descriptor: PropertyDescriptor) {
            descriptor.configurable = isConfigurable;
        }
    }
}