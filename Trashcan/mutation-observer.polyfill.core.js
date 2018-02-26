//polyfill for <MutationObserver>
var MutationObserverPolyfill = function (callback) 
{
    var _mutationObserverPolyfill = this;
    
    //hidden attributes
    this[0] = {};

    this[0].guid = core.guid.generate();
    
    this[0].unresolvedMutations = [];
    this[0].pendingAdditions = [];
    this[0].pendingRemovals = [];
    
    this[0].callback = callback;
    
    this[0].DOMSubtreeModified = function(e)
    {
        //ATTENTION! We've inserted {_mutationObserverPolyfill[0]} in the context.
        with (_mutationObserverPolyfill[0])
        {
            if (e.attrChange > 0)
            {
                var mutRecord = new MutationRecord();
                
                mutRecord.type = "attributes";
                mutRecord.attributeName = e.attrName;
                mutRecord.newValue = e.newValue;
                mutRecord.oldValue = e.prevValue;
                
                unresolvedMutations.push(mutRecord);
            }
            if (e.ADDITION > 0 || e.MODIFICATION || e.REMOVAL > 0)
            {
                if (e.eventPhase >= e.ADDITION + e.MODIFICATION + e.REMOVAL)
                {
                    //every change in subtree now is registered, dispatch'em
                    var mutRecord = new MutationRecord();
                    mutRecord.type = "childList";
                    mutRecord.addedNodes = pendingAdditions;
                    mutRecord.removedNodes = pendingRemovals;
                    unresolvedMutations.push(mutRecord);
                    //reset pending items
                    pendingAdditions = [];
                    pendingRemovals = [];
                }
                else if (e.eventPhase < e.ADDITION)
                    //a node has been added, list as pending
                    pendingAdditions.push(e.relatedNode);
                else if (e.eventPhase < e.ADDITION + e.MODIFICATION);
                else
                    //a node has been removed, list as pending
                    pendingRemovals.push(e.relatedNode);
            }
        }
    }
    
    //user-accessible attributes
    this.observe = function (target, init)
    {
        //get all info associated with this object
        var associatedInfo = association.get(target);

        if (associatedInfo === null || associatedInfo.mutationObserver.guid != this.guid)
        {
            //node has associated info and has a mutationObserver associated with it
            if (!!target.addEventListener)
                target.addEventListener("DOMSubtreeModified", this[0].DOMSubtreeModified);
            else
                core.debugging.error("Core Polyfill: Invalid Operation. Argument {target} does not implement interface {Node}.");
        }
        //associate target with init
        core.association.set(target, {
            mutationObserver: this,
            mutationObserverInit: init,
        }); 
    }
    this.disconnect = function ()
    {
        
    }
    this.takeRecords = function ()
    {
        
    }
}
var MutationRecordPolyfill = function() {
    this.addedNodes = [];
    this.attributeName = "";
    this.attributeNamespace = "";
    this.nextSibling = null;
    this.oldValue = "";
    this.previousSibling = null;
    this.removedNodes = [];
    this.node = null;
    this.type = "";
}

window.MutationObserver = MutationObserverPolyfill;
window.MutationRecord = MutationRecordPolyfill;