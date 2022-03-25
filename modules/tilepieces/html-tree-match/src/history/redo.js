HTMLTreeMatch.prototype.redo = function(){
    var $self = this;
    var history = $self.history;
    if(!history.entries.length
        || history.pointer == history.entries.length)
        return;
    lastEditable && lastEditable.destroy();
    var pointer = history.pointer;
    var historyEntry = history.entries[pointer];
    historyMethods[historyEntry.method].redo(historyEntry,$self);
    history.pointer++;
    /* dispatching */
    window.dispatchEvent(new Event(domChangeEvent));
};