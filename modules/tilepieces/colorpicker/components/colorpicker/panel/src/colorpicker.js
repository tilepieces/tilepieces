let opener = window.opener || window.parent;
let settings = opener.tilepieces || {};
let pickerFixed;
function initializePicker(){
  pickerFixed && pickerFixed.destroy();
  pickerFixed = new Picker({
    parent: document.getElementById("colorpicker"),
    popup: false,
    alpha: true,
    editor: false,
    editorFormat : settings.editorFormat,
    color:settings.colorPickerStartColor,
    onDone:c=>{
      opener.dispatchEvent(new CustomEvent("color-picker-done",{detail:c}))
    },
    onChange:c=>{
      opener.tilepieces.colorPickerStartColor = c.hex;
      opener.dispatchEvent(new CustomEvent("color-picker-change",{detail:c}))
    }
  });
}
initializePicker()
window.addEventListener("window-popup-close",e=>{
  initializePicker()
});