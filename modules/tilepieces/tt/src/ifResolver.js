function ifResolver(condition, scope) {
  var names = [], values = [];
  for (var k in scope) {
    names.push(k);
    values.push(scope[k]);
  }
  return new Function(names,
    'try{return ' + condition + ' }catch(e){return false}')
    .apply(this, values);
}