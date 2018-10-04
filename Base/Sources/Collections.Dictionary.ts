///<reference path="Events.ts"/>
///<reference path="Collections.List.ts"/>

namespace Core.Collections {

    export class KeyValuePair<Tkey, Tvalue> {
        public constructor(key: Tkey, value: Tvalue) {
            this.key = key;
            this.value = value;
        }

        public key: Tkey;
        public value: Tvalue;
    }

    export class Dictionary<Tkey, Tvalue> extends List<KeyValuePair<Tkey, Tvalue>> {
        public indexOfKey(key: Tkey): number { return this.findIndex(i => Object.is(i.key, key)); }

        public containsKey(key: Tkey): boolean { return this.indexOfKey(key) > -1; }

        public getValue(key: Tkey): Tvalue {
            let index = this.indexOfKey(key);

            if (index == -1)
                return undefined;

            return this[index].value;
        }

        public setValue(key: Tkey, value: Tvalue): void {
            let index = this.findIndex(i => i.key == key);

            if (index > -1)
                this[index].value = value;
            else
                this.push(new KeyValuePair<Tkey, Tvalue>(key, value));
        }
    }
}