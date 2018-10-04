namespace Core.Collections {

    export class SimpleList<T> extends Array<T>{
        public constructor(...items: T[]) {
            super(...items);
        }

        public remove(item: T): void {
            let index = this.indexOf(item);

            if (index == -1)
                throw new Error("Cannot remove item. Item not found.");

            this.splice(index, 1);
        }
    }

}