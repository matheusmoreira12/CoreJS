declare namespace Core {
    class ArrayUtils {
        static syncArrays(srcArray: any[], destArray: any[], removeCallback?: Function, insertCallback?: Function, changeCallback?: Function, thisArg?: any): void;
    }
}
