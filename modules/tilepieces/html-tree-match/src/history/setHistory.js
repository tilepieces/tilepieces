HTMLTreeMatch.prototype.setHistory = function(historyObject){
    var $self = this;
    var history = $self.history;
    var pointer = history.pointer;
    var entries = history.entries;
    if(pointer != entries.length)
        history.entries = entries.slice(0,pointer);
    history.pointer = history.entries.push(historyObject);
    /* dispatching */
    $self.dispatchEvent("history-entry",{pointer,historyObject});
    window.dispatchEvent(new Event(domChangeEvent));
};