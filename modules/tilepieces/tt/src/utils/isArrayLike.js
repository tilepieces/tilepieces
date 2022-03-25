// https://stackoverflow.com/questions/21714808/array-isarray-does-not-work-on-a-nodelist-is-there-an-alternative

// Determine if o is an array-like object.
// Strings and functions have numeric length properties, but are 
// excluded by the typeof test. In client-side JavaScript, DOM text
// nodes have a numeric length property, and may need to be excluded 
// with an additional o.nodeType != 3 test.
function isArrayLike(o) {
  if (o &&                                // o is not null, undefined, etc.
    typeof o === "object" &&            // o is an object
    isFinite(o.length) &&               // o.length is a finite number
    o.length >= 0 &&                    // o.length is non-negative
    o.length === Math.floor(o.length) &&  // o.length is an integer
    o.length < 4294967296)              // o.length < 2^32
    return true;                        // Then o is array-like
  else
    return false;                       // Otherwise it is not
}