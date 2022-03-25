TT.prototype.set = function (string, value) {
  var $self = this;
  if (string) {
    var newValue = setParamFromString(string, $self.scope, value);
    if (!string)
      $self.scope = newValue;
  } else $self.scope = value;
  $self.model.slice(0).forEach((m, i, a) => {
    try {
      $self.process(m, string || "", $self.model, i)
    } catch (e) {
      console.error("[TT.prototype.set error on model process]", e);
      console.error("string,value", string, value);
      console.error("model,index,array", m, i, a);
      console.error("$self.model ->", $self.model);
      console.trace();
    }
  });
  for (var i = $self.toChange.length - 1; i >= 0; i--)
    $self.toChange[i].parentModel.splice($self.toChange[i].index, 1);
  $self.toChange = [];
}