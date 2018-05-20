var Core;
(function (Core) {
    var ObjectManipulation;
    (function (ObjectManipulation) {
        function cloneObject(obj) {
            function cloneRecursive(value, recursionArray) {
                let outValue = null;
                console.log(recursionArray);
                if (recursionArray.findIndex(r => Object.is(r, value)) !== -1)
                    return;
                recursionArray = new Array(...recursionArray);
                recursionArray.push(value);
                if (value !== null && typeof value === "object") {
                    outValue = {};
                    Object.setPrototypeOf(outValue, Object.getPrototypeOf(value));
                    for (let name in value) {
                        let member = value[name], outMember = null;
                        outMember = cloneRecursive(member, recursionArray);
                        outValue[name] = outMember;
                    }
                }
                else
                    outValue = value;
                return outValue;
            }
            return cloneRecursive(obj, []);
        }
        ObjectManipulation.cloneObject = cloneObject;
    })(ObjectManipulation = Core.ObjectManipulation || (Core.ObjectManipulation = {}));
})(Core || (Core = {}));
//# sourceMappingURL=Core.ObjectManipulation.js.map