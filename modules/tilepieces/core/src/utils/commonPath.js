function commonPath(one, two) {
  var length = Math.min(one.length, two.length);
  var pos;

  // find first non-matching character
  for (pos = 0; pos < length; pos++) {
    if (one.charAt(pos) !== two.charAt(pos)) {
      pos--;
      break;
    }
  }

  if (pos < 1) {
    return one.charAt(0) === two.charAt(0) && one.charAt(0) === '/' ? '/' : '';
  }

  // revert to last /
  if (one.charAt(pos) !== '/' || two.charAt(pos) !== '/') {
    pos = one.substring(0, pos).lastIndexOf('/');
  }

  return one.substring(0, pos + 1);
};