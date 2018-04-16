namespace Core.ObjectManipulation {

    export function cloneObject(obj: object): object {

        function cloneRecursive(value: any, recursionArray: any[]): any {

            let outValue: any = null;

            console.log(recursionArray);

            if (recursionArray.findIndex(r => Object.is(r, value)) !== -1)
                return;

            recursionArray = new Array(...recursionArray);
            recursionArray.push(value);

            if (value !== null && typeof value === "object") {
                outValue = {};

                Object.setPrototypeOf(outValue, Object.getPrototypeOf(value));

                for (let name in value) {
                    let member: object = value[name],
                        outMember: object = null;

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
}