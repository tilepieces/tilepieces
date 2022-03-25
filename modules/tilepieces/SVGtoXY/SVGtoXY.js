function SVGtoXY(svg){
    var svgBounds = svg.getBoundingClientRect();
    var circleTest = svg.querySelector(".circle-test");
    var lineTest = svg.querySelector(".line-test");
    var onChangeListeners = [];
    var drag = __drag(circleTest,{noBorderWindowEscape:true});
    var X = svgBounds.width / 2,
        Y = svgBounds.height / 2,pos1,pos2,pos3,pos4,UP;
    svg.addEventListener("mouseup",e=>{
        svgBounds = svg.getBoundingClientRect();
        if(e.target!=circleTest && !UP) {
            X = e.clientX - svgBounds.left;
            Y = e.clientY - svgBounds.top;
            circleTest.setAttribute("cx", X);
            circleTest.setAttribute("cy", Y);
            lineTest.setAttribute("x2",X);
            lineTest.setAttribute("y2",Y);
            onChangeListeners.forEach(func=>func(X,Y))
        }
    })
    drag.on("down", function (e) {
        e.ev.preventDefault();
        // get the mouse cursor position at startup:
        svgBounds = svg.getBoundingClientRect();
        pos3 = e.x;
        pos4 = e.y;
        UP = true;
    })
    .on("move", function (e) {
        e.ev.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.x;
        pos2 = pos4 - e.y;
        pos3 = e.x;
        pos4 = e.y;
        X = X - pos1;
        Y = Y - pos2;
        if(X >= svgBounds.width) {
            X = svgBounds.width;
        }
        if(X <= 0) {
            X = 0;
        }
        if(Y <= 0){
            Y = 0;
        }
        if(Y >= svgBounds.height){
            Y = svgBounds.height;
        }
        circleTest.setAttribute("cx", X);
        circleTest.setAttribute("cy", Y);
        lineTest.setAttribute("x2",X);
        lineTest.setAttribute("y2",Y);
        onChangeListeners.forEach(func=>func(X,Y))
    })
    .on("up",e=>UP = false);
    return {
        target : svg,
        onChange : (f)=>{
            onChangeListeners.push(f)
        },
        setXY : (x,y)=>{
            X = x;
            Y = y;
            circleTest.setAttribute("cx", X);
            circleTest.setAttribute("cy", Y);
            lineTest.setAttribute("x2",X);
            lineTest.setAttribute("y2",Y);
        }
    }
}