function createNewBgProp(prop) {
  return model.backgrounds.reduce((string, v, i, a) => {
    string += v[prop] + (i != a.length - 1 ? "," : "");
    return string
  }, "");
}