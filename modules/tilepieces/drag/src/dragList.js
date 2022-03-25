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