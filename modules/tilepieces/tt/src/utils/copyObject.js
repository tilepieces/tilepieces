function copyObjectIterable(obj) {
  if (Array.isArray(obj))
    return obj.slice(0)
  else {
    var newObj = {};
    for (var k in obj)
      newObj[k] = obj[k]
    return obj;
  }
}