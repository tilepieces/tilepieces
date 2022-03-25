(function(){
    let cpicker = panel(document.getElementById("colorpicker"),null,false,46);
    let preventDockableResizableMouseOut = document.querySelector(".__drag-prevent-mouse-out");
    let firstChange = true;
    tilepieces.colorPicker = function(c){
        tilepieces.colorPickerStartColor = c;
        preventDockableResizableMouseOut.style.zIndex = 45;
        var onChangeEvents = [];
        function change(e){
            if(firstChange)
                firstChange = false;
            else
                onChangeEvents.forEach(ev=>ev(e.detail))
        }
        function done(){
            cpicker.close();
        }
        function close(){
            window.removeEventListener("color-picker-change",change);
            window.removeEventListener("color-picker-done",done);
            window.removeEventListener("panel-close",close);
            preventDockableResizableMouseOut.zIndex = "";
            firstChange = true;
            window.dispatchEvent(new Event("release"));
        }
        window.dispatchEvent(new Event("lock-down"));
        cpicker.show();
        window.addEventListener("color-picker-change",change);
        window.addEventListener("color-picker-done",done);
        window.addEventListener("panel-close",close);
        return {
            onChange : f=>onChangeEvents.push(f)
        }
    }
})();