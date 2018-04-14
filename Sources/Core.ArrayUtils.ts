namespace Core {
    //array manipulator utility
    export class ArrayUtils {
        static syncArrays(srcArray: any[], destArray: any[], removeCallback?: Function, insertCallback?: Function,
            changeCallback?: Function, thisArg?: any) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("srcArray", srcArray, Array);
            Validation.RuntimeValidator.validateParameter("destArray", destArray, Array);
            Validation.RuntimeValidator.validateParameter("removeCallback", removeCallback, Function);
            Validation.RuntimeValidator.validateParameter("insertCallback", insertCallback, Function);
            Validation.RuntimeValidator.validateParameter("changeCallback", changeCallback, Function);
            //change the items both arrays have in common
            for (var i = 0; i < srcArray.length && i < destArray.length; i++)
                //call <function removeCallback(srcArray, destArray, index) { }>
                changeCallback.call(thisArg, srcArray, destArray, i);
            //if there are not enough items, insert new ones
            if (srcArray.length > destArray.length)
                for (var i = Math.max(destArray.length - 1, 0); i < srcArray.length; i++) {
                    destArray.splice(i, 0,
                        //call <function removeCallback(srcArray, index) { }>
                        insertCallback.call(thisArg, srcArray, i));
                }
            //if there are items in excess, remove those
            else if (srcArray.length < destArray.length)
                for (var i = Math.max(srcArray.length - 1, 0); i < destArray.length; i++) {
                    var removedItem = destArray.splice(i, 1)[0];
                    //call <function removeCallback(splicedItem, index) { }>
                    removeCallback.call(thisArg, removedItem, i);
                }
        }
    }
}