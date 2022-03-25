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