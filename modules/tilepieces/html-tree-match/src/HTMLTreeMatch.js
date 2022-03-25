const domChangeEvent = "DOM-change";
let historyMethods = {};
function HTMLTreeMatch(source,contentDocument){
    var $self = this;
    var domparser = new DOMParser();
    $self.source = domparser.parseFromString(source, "text/html");
    $self.lastMatch = {
        el : null,
        match : null
    };
    $self.firstSelection = {};
  	$self.contentDocument = contentDocument;
    $self.history = {
        entries : [],
        pointer : 0
    };
    $self.matches = [];
    [...contentDocument.querySelectorAll("*")].forEach(DOMel=>$self.match(DOMel));
    var events = {};
    $self.dispatchEvent = (event,eObj)=>{
        Array.isArray(events[event]) && events[event].forEach(func=>func(eObj))
    };
    $self.on = (e,cb)=>{
        if(events[e])
            events[e].push(cb);
        else
            events[e] = [cb]
    };
    return $self;
};
window.HTMLTreeMatch = function(source,doc){
    return new HTMLTreeMatch(source,doc || document);
};