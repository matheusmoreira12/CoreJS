namespace Core {
    export const UNDEF = "undefined";
    export const STRING = "string";
    export const NUMBER = "number";
    export const BOOL = "boolean";

    export interface ICloneable<T> {
        clone(): T;
    }

}