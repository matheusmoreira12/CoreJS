var Core;
(function (Core) {
    //array manipulator utility
    class ArrayUtils {
        static syncArrays(srcArray, destArray, removeCallback, insertCallback, changeCallback, thisArg) {
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
            else if (srcArray.length < destArray.length)
                for (var i = Math.max(srcArray.length - 1, 0); i < destArray.length; i++) {
                    var removedItem = destArray.splice(i, 1)[0];
                    //call <function removeCallback(splicedItem, index) { }>
                    removeCallback.call(thisArg, removedItem, i);
                }
        }
    }
    Core.ArrayUtils = ArrayUtils;
})(Core || (Core = {}));
//# sourceMappingURL=Core.ArrayUtils.js.map