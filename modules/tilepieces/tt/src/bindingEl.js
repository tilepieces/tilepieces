TT.prototype.bindingEl = function (el, stringModel, targetEl, ttobj, newScope) {
  var $self = this;
  var events = el.dataset[$self.bindEventsAttr];
  if (events)
    events = events.split(",");
  else
    events = ["change"];
  events.forEach(e =>
    el.addEventListener(e, (ev) => {
      /*
      if(!ttobj.el.contains(ev.target) && ttobj.el != ev.target)
          return;*/
      targetEl.dispatchEvent(
        new CustomEvent(stringModel, {detail: ev})
      );
      var value;
      if (el.tagName == "INPUT" && el.type == "checkbox")
        value = ev.target.checked;
      else if (el.tagName == "INPUT" && el.type == "radio") {
        var c = targetEl.querySelector(`[name="${el.name}"]:checked`);
        value = c ? c.value : null;
      } else if (el.tagName == "INPUT" && el.type == "number")
        value = Number(ev.target.value);
      else if ((el.tagName == "INPUT" && el.type != "file") || el.tagName == "SELECT" ||
        el.tagName == "TEXTAREA")
        value = ev.target.value;
      else if (el.type != "file")
        value = ev.target.textContent;
      var match = getParamFromString(convertVarToModel(stringModel, newScope), ttobj.scope);
      if (match == value) {
        console.log("returning");
        return;
      }
      ttobj.set(stringModel, value);
      Object.defineProperty(ev, "stringModel", {value: stringModel});
      targetEl.dispatchEvent(new CustomEvent("template-digest", {detail: ev}));
    })
  );
}