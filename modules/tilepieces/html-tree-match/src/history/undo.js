HTMLTreeMatch.prototype.undo = function(){
    var $self = this;
    var history = $self.history;
    if(!history.entries.length || history.pointer == 0)
        return;
    lastEditable && lastEditable.destroy();
    var pointer;
    history.pointer--;
    pointer = history.pointer;
    var historyEntry = history.entries[pointer];
    if(historyEntry.method == "contenteditable"){
        if(history.pointer == 0)
            historyMethods.contenteditable.undo(historyEntry,$self.firstSelection,$self);
        else
            historyMethods.contenteditable.undo(historyEntry,{
                editable : history.entries[pointer-1].el,
                lastRange : history.entries[pointer-1].lastRange
            },$self,history.entries[pointer-1]);
    }
    else historyMethods[historyEntry.method].undo(historyEntry);
    /* dispatching */
    window.dispatchEvent(new Event(domChangeEvent));
};