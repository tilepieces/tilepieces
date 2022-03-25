//let triggerAttribute = "frontart-template";
let bindNoTriggerAttribute = "t-bind-no-trigger"; // TODO ???
function TT(el, data, options = {}) {
  this.model = [];
  this.el = el;
  this.interpolation = options.interpolation || /\$\{([\s\S]+?)\}/;
  this.ifAttr = options.ifAttr || "if";
  this.foreachAttr = options.foreachAttr || "foreach";
  this.foreachKeyNameAttr = options.foreachKeyNameAttr || "foreachKeyName";
  this.bindAttr = options.bindAttr || "bind";
  this.bindDOMPropAttr = options.bindDOMPropAttr || "bindDomProp";
  this.bindEventsAttr = options.bindEventsAttr || "bindEvents";
  this.setTemplateAttr = options.setTemplateAttr || "set";
  this.useTemplateAttr = options.useTemplateAttr || "use";
  this.useTemplateParamsAttr = options.useTemplateParamsAttr || "params";
  this.isolateAttribute = options.isolateAttribute || "isolate";
  this.srcAttribute = options.srcAttribute || "src";
  this.toChange = [];
  this.templates = [];
  if (options.templates)
    this.templates = this.templates.concat(options.templates);
  this.getParamFromString = (string) => {
    return getParamFromString(string, this.scope);
  };
  this.setParamFromString = (string, value) => {
    return setParamFromString(string, this.scope, value);
  };
  this.scope = data;
  this.declare(el, data, this.model);
  return this;
}

window.TT = TT;