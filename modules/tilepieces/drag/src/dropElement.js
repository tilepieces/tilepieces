function __dropElement(HandlerEl,options = {}){
    var $self = this;
    options = Object.assign({},defaults,options);
    var destroyItems = [], target;
    $self.events = events();
    $self.on = function(n,cb){
        $self.events.on(n,cb);
        return $self;
    };
    var ownerDoc = HandlerEl.ownerDocument || HandlerEl[0].ownerDocument;
    var dummy = ownerDoc.querySelector("body>dummy-drag");
    if(!dummy) {
        dummy = ownerDoc.createElement("dummy-drag");
        ownerDoc.body.appendChild(dummy);
    }
    var elements = HandlerEl.length ? HandlerEl : [HandlerEl];
    for(var i = 0;i<elements.length;i++) {
        ((element)=>{
            var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, originalPosition;
            var X = 0, Y = 0;
            var drag = new init(element, Object.assign(defaults, options));
            drag.on("down", function (e) {
                var ev = e.ev;
                ev.preventDefault();
                var target = e.target;
                // get the mouse cursor position at startup:
                var originalPosition = offset(target);
                X = originalPosition.left;
                Y = originalPosition.top;
                pos3 = e.x;
                pos4 = e.y;
                dummy.innerHTML = element.outerHTML;
                $self.events.dispatch("down", e);
            })
            .on("move", function (e) {
                var ev = e.ev;
                ev.preventDefault();
                // calculate the new cursor position:
                pos1 = pos3 - e.x;
                pos2 = pos4 - e.y;
                pos3 = e.x;
                pos4 = e.y;
                X = X - (pos1);
                Y = Y - (pos2);
                // set the element's new position:
                dummy.style.transform = "translate3d(" + X + "px," + Y + "px,0)";
                var isTarget = e.target.matches(options.target) ? e.target :
                    e.target.closest(options.target);
                if (options.drop && isTarget) {
                    target = isTarget;
                    target.classList.add(options.styleDrop);
                }
                else
                    target && target.classList.remove(options.styleDrop);
                $self.events.dispatch("move", e);
            })
            .on("up", function (e) {
                var isTarget = e.target.matches(options.target) ? e.target :
                    e.target.closest(options.target);
                if (options.drop && isTarget)
                    isTarget.insertAdjacentHTML(options.insertElement, dummy.innerHTML);

                target.classList.remove(options.styleDrop);
                dummy.style.transform = "translate3d(-9999px,-9999px,0)";
                dummy.innerHTML = "";
                $self.events.dispatch("up", e);
            });
            destroyItems.push(drag)
        })(elements[i])
    }
    $self.destroy  = function(){
        destroyItems.forEach(function(v){ v.destroy()})
    };
    return $self;
};
window.__dropElement = function(HandlerEl,options){
    return new __dropElement(HandlerEl,options);
};