(()=>{
// private - defaults
// prova
var defaults = {
    preventMouseOut : false,
    noBorderWindowEscape : false,
    onlyHandler : false,
    handle : null,
    grabCursors : true,
    drop : true,
    dragNoTransform : false,
    dragElementConstraint : function(){return false},
    constraint : function(){return false},
    target : null,
    grabClass : '__drag-cursor-grab',
    grabbingClass : '__drag-cursor-grabbing',
    noDrop : false,
    noDropClass : '__drag-cursor-no-drop',
    styleDrop : '__drag__drop-overlay',
    insertElement : 'beforeend'
};
//var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
// private - mouse case
function mouse(HandlerEl){
    var $self = this;
    var options = $self.options;
    var frameElement = HandlerEl.ownerDocument.defaultView.frameElement;
    function mousedown(e){
        if(options.onlyHandler && e.target !== HandlerEl)
            return;
        if(options.handle && !e.target.closest(options.handle))
            return;
        var ev = {
            x : e.pageX,
            y : e.pageY,
            target : e.target,
            ev : e
        };
        if($self.preventMouseOut)
            $self.preventMouseOut.style.display = "block";
        $self.events.dispatch("down",ev);
        HandlerEl.ownerDocument.addEventListener("mouseup",mouseup);
        HandlerEl.ownerDocument.addEventListener('mousemove',mousemove);
        frameElement &&
        frameElement.addEventListener("mouseout",mouseup);
    }
    HandlerEl.addEventListener("mousedown",mousedown);
    function mouseup(e){
        if(options.grabbingClass) {
          HandlerEl.ownerDocument.body.classList.remove(options.grabbingClass);
          //e.target.classList.remove(options.grabbingClass)
        }
        var ev = {
            x : e.pageX,
            y : e.pageY,
            target : e.target,
            ev : e
        };
        if($self.preventMouseOut)
            $self.preventMouseOut.style.display = "none";
        HandlerEl.ownerDocument.removeEventListener("mouseup",mouseup);
        HandlerEl.ownerDocument.removeEventListener('mousemove',mousemove);
        frameElement &&
        frameElement.removeEventListener("mouseout",mouseup);
        $self.events.dispatch("up",ev);
    }
    function mousemove(e){
        if(options.grabbingClass) {
            //document.body.classList.remove(options.grabClass);
          HandlerEl.ownerDocument.body.classList.add(options.grabbingClass);
          //e.target.classList.add(options.grabbingClass);
        }
        var ev = {
            x : e.pageX,
            y : e.pageY,
            target : e.target,
            ev : e
        };
        $self.events.dispatch("move",ev);
    }
    return function(){
        HandlerEl.removeEventListener("mousedown",mousedown);
    }
}
// private - touch case
function touch(HandlerEl) {
    var $self = this;
    var options = this.options;
    function touchstart(e){
        if(options.onlyHandler && e.target !== HandlerEl)
            return;
        if(options.handle && !e.target.closest(options.handle))
            return;
        var ev = {
            x : e.changedTouches[0].pageX,
            y : e.changedTouches[0].pageY,
            target : e.target,
            ev : e
        };
        $self.events.dispatch("down",ev);
        HandlerEl.ownerDocument.addEventListener('touchend', touchend,{passive:false});
        HandlerEl.ownerDocument.addEventListener('touchcancel', touchend,{passive:false});
        HandlerEl.ownerDocument.addEventListener('touchmove', touchmove,{passive:false});
    }
    // listeners
    HandlerEl.addEventListener('touchstart', touchstart,{passive:false});
    function touchmove(e){
        var ev = {
            x : e.changedTouches[0].pageX,
            y : e.changedTouches[0].pageY,
            ev : e,
            target : HandlerEl.ownerDocument.elementFromPoint(e.changedTouches[0].pageX, e.changedTouches[0].pageY)
        };
        $self.events.dispatch("move",ev);
    }
    function touchend(e){
        if(e.type == "touchend") {
            var ev = {
                x: e.changedTouches[0].pageX,
                y: e.changedTouches[0].pageY,
                target: HandlerEl.ownerDocument.elementFromPoint(e.changedTouches[0].pageX, e.changedTouches[0].pageY),
                ev: e
            };
            $self.events.dispatch("up", ev);
        }
        HandlerEl.ownerDocument.removeEventListener('touchend', touchend,{passive:false});
        HandlerEl.ownerDocument.removeEventListener('touchcancel', touchend,{passive:false});
        HandlerEl.ownerDocument.removeEventListener('touchmove',touchmove,{passive:false});
    }

    return function(){
        HandlerEl.removeEventListener('touchstart', touchstart,{passive:false});
    }
}
// constructor
function init(HandlerEl,options){
    var $self = this;
    $self.events = events();
    $self.on = function(n,cb){
        $self.events.on(n,cb);
        return $self;
    };
    $self.options = options;
    if($self.options.preventMouseOut){
        $self.preventMouseOut = document.querySelector(".__drag-prevent-mouse-out");
        if(!$self.preventMouseOut){
            $self.preventMouseOut = HandlerEl.ownerDocument.createElement("div");
            $self.preventMouseOut.className = "__drag-prevent-mouse-out";
            HandlerEl.ownerDocument.body.appendChild($self.preventMouseOut);
        }
    }
    var touchDestroy = touch.call($self,HandlerEl);
    var mouseDestroy = mouse.call($self,HandlerEl);
    $self.destroy = ()=>{
        touchDestroy();
        mouseDestroy();
    }

}
//init.prototype.dispatch = dispatch;
// append __drag namespace to window
window.__drag = function(HandlerEl,options = {}){
    return new init(HandlerEl,Object.assign({},defaults,options));
};
function getComputed(element,options){
    var X = 0,Y=0;
    var computed = element.ownerDocument.defaultView.getComputedStyle(element,null);
    if(options.dragNoTransform){
        X = +computed.left.replace("px","");
        Y = +computed.top.replace("px","");
    }
    else{
        var matrix = computed.transform.match(/\(([^)]+)\)/);
        var values = matrix && matrix[1] && matrix[1].split(",");
        X = values ? +values[values.length-2] : 0;
        Y = values ? +values[values.length-1] : 0;
    }
    return{X,Y};
}
function __dragElement(HandlerEl,options = {}){
    var $self = this;
    var destroyItems = [];
    options = Object.assign({},defaults,options);
    $self.events = events();
    $self.on = function(n,cb){
        $self.events.on(n,cb);
        return $self;
    };
    var elements = HandlerEl.length ? HandlerEl : [HandlerEl];
    for(var i = 0;i<elements.length;i++)
        (function(element){
            var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, X = 0,Y=0;
            var drag = new init(element, options);
            drag.on("down", function (e) {
                e.ev.preventDefault();
                // get the mouse cursor position at startup:
                var comp = getComputed(element,options);
                X = comp.X , Y = comp.Y;
                pos3 = e.x;
                pos4 = e.y;
                $self.events.dispatch("down",e);
            })
            .on("move", function (e) {
                e.ev.preventDefault();
                // calculate the new cursor position:
                pos1 = pos3 - e.x;
                pos2 = pos4 - e.y;
                pos3 = e.x;
                pos4 = e.y;
                var newX = X - pos1;
                var newY = Y - pos2;
                if(options.dragElementConstraint(newX,newY,pos1,pos2)) {
                    return;
                }
                X = newX;
                Y = newY;
                // set the element's new position:
                if(options.dragNoTransform){
                    element.style.top = Y + "px";
                    element.style.left = X + "px";
                }
                else
                    element.style.transform = "translate(" + X + "px," + Y + "px)";
                e.newX = X;
                e.newY = Y;
                $self.events.dispatch("move",e);
            })
            .on("up",function(e){
                $self.events.dispatch("up",e);
            });
            destroyItems.push(drag)
        })(elements[i]);
    $self.destroy  = function(){
        destroyItems.forEach(function(v){ v.destroy()})
    };
    return $self;
};
window.__dragElement = function(HandlerEl,options){
    return new __dragElement(HandlerEl,options);
};
let dragListDefaults = {
    noDrop : false,
    convalidate : ()=>true,
    convalidateStart : ()=>true,
    handlerSelector : ""
};
function __dragList(el,options) {
    var $self = this;
    options = Object.assign({},dragListDefaults,options);
    $self.events = events();
    $self.el = el;
    $self.on = function(n,cb){
        $self.events.on(n,cb);
        return $self;
    };
    var d = __drag(el, {
        handle: "li " + options.handlerSelector,
        noBorderWindowEscape: true
    });
    var target,
        triggered,
        targetExDisplay,
        areSequential,
        targetExCssProperty,
        targetClone,
        targetCloneToAppend,
        started;
    d.on("down", e=> {
        //e.ev.preventDefault();
        var newX = e.ev.clientX || e.x;
        var newY = e.ev.clientY || e.y;
        var originalEl = e.ev.target.ownerDocument.elementFromPoint(newX, newY);
        var elStart = originalEl.closest("li");
        var convalidate = options.convalidateStart(elStart,originalEl);
        if(convalidate){
            started = true;
            triggered = true;
            target = convalidate.multiselection || [elStart];
        }
    });
    d.on("up", e=> {
        if(!started)
            return;
        started = false;
        e.ev.preventDefault();
        if (targetClone) {
            targetClone.parentNode.removeChild(targetClone);
            targetClone = null;
        }
        if (targetExCssProperty)
            target.forEach(n=>n.style[targetExCssProperty] = "");
        if (targetCloneToAppend) {
            if(targetCloneToAppend[0].parentNode) {
                var prev = targetCloneToAppend[0].previousElementSibling;
                var next = targetCloneToAppend[targetCloneToAppend.length-1].nextElementSibling;
                if(!options.noDrop)
                    targetCloneToAppend.forEach((n,i)=>n.replaceWith(target[i]));
                else
                    targetCloneToAppend.forEach(n=>n.remove());
                $self.events.dispatch("move", {target,prev,next});
            }
            targetCloneToAppend = null;
        }
      $self.events.dispatch("up");
    });
    d.on("move", e=> {
        if(!started)
            return;
        e.ev.preventDefault();
        var newX = e.ev.clientX || e.x;
        var newY = e.ev.clientY || e.y;
        var el = e.ev.target.ownerDocument.elementFromPoint(newX, newY);
        if(!el)
            return;
        el = el.closest("li");
        if (!el || el == targetCloneToAppend)
            return;
        var isInTarget = target.find(v=>v.contains(el));
        if (isInTarget) {
            /*
            targetCloneToAppend &&
            targetCloneToAppend[0].parentNode &&
            targetCloneToAppend.forEach(n=>n.remove());*/
            return;
        }
        var bounding = el.getBoundingClientRect();
        var mediumEl = (el.ownerDocument.defaultView.scrollY + bounding.bottom) - (bounding.height / 2);
        var positionBefore = e.y < mediumEl;
        if (triggered) {
            targetCloneToAppend = target.map(v=>v.cloneNode(true));
            targetClone = target[0].ownerDocument.createElement("div");
            targetClone.append(...target.map(v=>v.cloneNode(true)));
            targetClone.classList.add("targetClone");
            targetCloneToAppend.forEach(v=>v.classList.add("cloneToAppend"));
            target.forEach((v,i)=>{
                v.style.opacity = "0.4";
                targetExCssProperty = "opacity";
                if(i==0) areSequential = true;
                else if(areSequential)
                    areSequential = target[i-1] == v.previousElementSibling || target[i-1] == v.nextElementSibling;
            });
            target[0].ownerDocument.body.appendChild(targetClone);
            triggered = false;
        }
        targetClone.style.transform = `translate(${e.x}px,${e.y}px)`;
        if(targetCloneToAppend.find(n=>n.contains(el)))
            return;
        var whereInsert = positionBefore ? el : el.nextSibling;
        var toCompare = positionBefore ? el : el.nextElementSibling;
        var isNotAppendingOnItself = !toCompare ? true :
            target.length == 1 ?
            toCompare!=target[0] && target[0].nextElementSibling!=toCompare :
            areSequential ?
            toCompare!=target[0] && target[target.length-1].nextElementSibling!=toCompare :
                true;
        if(options.convalidate(el,positionBefore,target) && isNotAppendingOnItself) {
            if(whereInsert)
                whereInsert.before(...targetCloneToAppend);
            else
                el.after(...targetCloneToAppend)
        }
        else{
            targetCloneToAppend[0].parentNode &&
            targetCloneToAppend.forEach(n=>n.remove())
        }
    });
    return $self;
}
window.__dragList = function(el,options){
    return new __dragList(el,options);
};
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

})();