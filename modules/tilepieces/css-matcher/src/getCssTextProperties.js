function getCssTextProperties(cssText) {
  var statements = [];
  var index = 0;
  var quoteRegex = /("[^"]*")/g, resultQuotes, indicesQuotes = [];
  while ((resultQuotes = quoteRegex.exec(cssText)))
    indicesQuotes.push({start: resultQuotes.index, end: resultQuotes.index + resultQuotes[0].length});
  var semicolonRegex = /;/g, resultSearch;
  while ((resultSearch = semicolonRegex.exec(cssText))) {
    var isInQuote = indicesQuotes.find(v => resultSearch.index > v.start && resultSearch.index < v.end);
    if (!isInQuote) {
      statements.push(cssText.substring(index, resultSearch.index));
      index = resultSearch.index + 1;
    }
  }
  return statements.reduce((filtered, option) => {
    var a = option.split(/:(.+)/);
    if (a[0] && a[1])
      filtered.push({
        property: a[0].trim(),
        value: a[1].trim()
      });
    return filtered
  }, []);
}