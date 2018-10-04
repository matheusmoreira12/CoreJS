///<reference path="../../Base/Sources/Collections.Dictionary.ts"/>

namespace Core.ModuleSystem.DeclarationStorage {

    let storedData: Collections.Dictionary<number, object> = new Collections.Dictionary<number, object>();

    function getNewId(): number {
        let id: number = 0;

        while (storedData.containsKey(id))
            id++;

        return id;
    }

    export function storeData(initial: object = {}): number {
        let id = getNewId();

        storedData.setValue(id, initial);

        return id;
    }

    export function retrieveData(id: number): object {
        if (!storedData.containsKey(id))
            throw new Error("Invalid declaration storage entry ID.");

        return storedData.getValue(id);
    }
}