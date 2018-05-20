declare namespace Core {
    const UNDEF = "undefined";
    const STRING = "string";
    const NUMBER = "number";
    const BOOL = "boolean";
    interface ICloneable<T> {
        clone(): T;
    }
}
