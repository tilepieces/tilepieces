function findGeneratorIndexes($self) {
  var doc = $self.currentDocument;
  var idGenerator = tilepieces.idGenerator;
  var classGenerator = tilepieces.classGenerator;
  var templates, classSearch, els;
  if (classGenerator) {
    var classMatch = new RegExp(`${classGenerator}\\d+$`);
    templates = doc.querySelectorAll("template");
    classSearch = `[class^="${classGenerator}"]`;
    els = [...doc.querySelectorAll(classSearch)];
    [...templates].forEach(t => {
      els = els.concat([...t.content.querySelectorAll(classSearch)])
    });
    els.forEach(e => [...e.classList].forEach(v => {
      if (v.match(classMatch)) {
        var number = v.match(/\d+/);
        if (!number)
          return;
        number = Number(number[0]);
        if (number > $self.classIndex)
          $self.classIndex = number;
      }
    }))
  }
  if (idGenerator) {
    var idMatch = new RegExp(`${idGenerator}\\d+$`);
    templates = doc.querySelectorAll("template");
    var idSearch = `[id^="${idGenerator}"]`;
    els = [...doc.querySelectorAll(idSearch)];
    [...templates].forEach(t => {
      els = els.concat([...t.content.querySelectorAll(idSearch)])
    });
    els.forEach(e => {
      var m = e.id.match(idMatch);
      if (!m)
        return;
      var number = m[0].match(/\d+/);
      if (!number)
        return;
      number = Number(number[0]);
      if (number > $self.idIndex)
        $self.idIndex = number;
    })
  }
}