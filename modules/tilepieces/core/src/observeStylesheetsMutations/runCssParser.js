TilepiecesCore.prototype.runcssMapper = async function () {
  var $self = this;
  var styles = await cssMapper($self.currentDocument, tilepieces.idGenerator, tilepieces.classGenerator);
  $self.styles = styles;
  findGeneratorIndexes($self);
  $self.styleChanges.listeners = $self.styleChanges.listeners.filter(v => {
    v.cb();
    return !v.once;
  });
  window.dispatchEvent(new CustomEvent("cssMapper-changed", {detail: $self}));
  return styles;
}