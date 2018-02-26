Core.Collections = new (function() {
    const UNDEF = 'undefined'
    const collections = this;
    
    class GenericCollection extends Array {
        static fromArray(array) {
            if (!(array instanceof Array))
                throw new TypeError('Parameter "array" is not a valid Array.');

            var result = new collections.GenericCollection();
            result.addMultiple(array);

            return result;
        }
        
        //Adds multiple items to the end of this collection
        addMultiple(items) {
            if (!(items instanceof Array))
                throw new TypeError('Parameter "items" is not a valid Array.');

            var argArray = items;
            Array.prototype.push.apply(this, argArray);
        }
        //Adds an item to this collection
        add(item) {
            super.push(item);
        }
        //Inserts multiple items into this collection, starting at the specified zero-based position
        insertMultiple(items, index) {
            if (!(items instanceof Array))
                throw new TypeError('Parameter "items" is not a valid Array.');
            if (index < 0 || index > this.length)
                throw new RangeError('Parameter "index" is out of range.');

            var argArray = [index, 0].concat(items);
            Array.prototype.splice.apply(this, argArray);
        }
        //Inserts an item into this collection at the specified zero-based position
        insert(item, index) {
            super.splice(index, 0, item);
        }
        //Removes the item at the specified zero-based position from this collection
        removeAt(index) {
            super.splice(index, 1);
        }
        //Removes an specific item from this collection
        remove(item) { 
            this.removeAt(this.indexOf(item));
        }
        //Selects a value from each of the collection elements with the specified function
        select(valueFn, thisArg) {
            var result = new GenericCollection();
            
            for (var i = 0; i < this.length; i++)
                result.add(valueFn.call(thisArg, this[i]));
                
            return result;
        }
    }
    this.GenericCollection = GenericCollection;

    class GenericTreeItem extends GenericCollection {
        constructor (value) {
            super();
            
            this.value = value || null;
            this.parent = null;
        }
        
        add(treeItem) {
            //Validate tree item
            if (!(treeItem instanceof collections.GenericTreeItem))
                throw new TypeError('Parameter "treeItem" is not a valid GenericTreeItem.');

            //Make sure the tree item is correctly detached from its parent            
            if (treeItem.parent != null)
                treeItem.parent.remove(treeItem);
            
            treeItem.parent = this;
                            
            super.add(treeItem);
        }
        
        remove(treeItem) {
            //Validate tree item
            if (!(treeItem instanceof collections.GenericTreeItem))
                throw new TypeError('Parameter "treeItem" is not a valid GenericTreeItem.');

            //Detach tree item from parent
            treeItem.parent = null;
            
            super.remove(treeItem);
        }
        
        filterRecursive(testFn, thisArg) {
            var result = this.filter(testFn);
            this.forEach((item) => { 
                result = result.concat(item.filterRecursive(testFn)); 
            });
            
            return result;
        }
        
        someRecursive(testFn, thisArg) {
            var result = this.some(testFn);
            this.forEach((item) => { 
                result |= item.someRecursive(testFn); 
            });
            
            return result;
        }

        everyRecursive(testFn, thisArg) {
            var result = this.every(testFn);
            this.forEach((item) => { 
                result &= item.everyRecursive(testFn); 
            });
            
            return result;
        }

        getByValue(value) {
            return this.filter((t) => { return Object.is(value, t.value); });
        }
    }
    this.GenericTreeItem = GenericTreeItem;
});