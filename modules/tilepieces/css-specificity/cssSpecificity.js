/*
https://stackoverflow.com/questions/448981/which-characters-are-valid-in-css-class-names-selectors
https://www.w3.org/TR/selectors-3/#specificity
https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes
https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements
*/
/*
A selector's specificity is calculated as follows:

count the number of ID selectors in the selector (= a)
count the number of class selectors, attributes selectors, and pseudo-classes in the selector (= b)
count the number of type selectors and pseudo-elements in the selector (= c)
ignore the universal selector
Selectors inside the negation pseudo-class are counted like any other, but the negation itself does not count as a pseudo-class.

Concatenating the three numbers a-b-c (in a number system with a large base) gives the specificity.

*             {}  /* a=0 b=0 c=0 d=0 -> specificity = 0,0,0,0
b                 /* a=0 b=0 c=0 d=1 -> specificity = 0,0,0,1
li            {}  /* a=0 b=0 c=0 d=1 -> specificity = 0,0,0,1
li:first-line {}  /* a=0 b=0 c=0 d=2 -> specificity = 0,0,0,2
ul li         {}  /* a=0 b=0 c=0 d=2 -> specificity = 0,0,0,2
ul ol+li      {}  /* a=0 b=0 c=0 d=3 -> specificity = 0,0,0,3
h1 + *[rel=up]{}  /* a=0 b=0 c=1 d=1 -> specificity = 0,0,1,1
ul ol li.red  {}  /* a=0 b=0 c=1 d=3 -> specificity = 0,0,1,3
li.red.level  {}  /* a=0 b=0 c=2 d=1 -> specificity = 0,0,2,1
#x34y         {}  /* a=0 b=1 c=0 d=0 -> specificity = 0,1,0,0
style=""          /* a=1 b=0 c=0 d=0 -> specificity = 1,0,0,0
/* a=0 b=0 c=0 -> specificity =   0
LI              /* a=0 b=0 c=1 -> specificity =   1
li:first-line   /* a=0 b=0 c=2 -> specificity =   2
UL OL+LI        /* a=0 b=0 c=3 -> specificity =   3
H1 + *[REL=up]  /* a=0 b=1 c=1 -> specificity =  11
UL OL LI.red    /* a=0 b=1 c=3 -> specificity =  13
LI.red.level    /* a=0 b=2 c=1 -> specificity =  21
#x34y           /* a=1 b=0 c=0 -> specificity = 100
#s12:not(FOO)   /* a=1 b=0 c=1 -> specificity = 101
#s12:not(FOO):not( .crazyness )   /* a=1 b=1 c=1 -> specificity = 111
div:where(.outer) p /* a=0 b=0 c=2 -> specificity = 2
*/

function cssSpecificity(selector,inside){
  var arr = [0,0,0];
  var idMatch = /#[_a-zA-Z0-9-]+/g;
  var attributeMatch = /\[[_a-zA-Z0-9-="]+]+/g;
  var classMatch = /\.[_a-zA-Z0-9-]+/g;
  //var pseudoClassMatch = /:active|:any-link|:blank|:checked|:current|:default|:defined|:dir|:disabled|:drop|:empty|:enabled|:first(?!-)|:first-child|:first-of-type|:fullscreen|:future|:focus(?!-)|:focus-visible|:focus-within|:has|:host|:host|:host-context|:hover|:indeterminate|:in-range|:invalid|:is|:lang|:last-child|:last-of-type|:left|:link|:local-link|:nth-child|:nth-col|:nth-last-child|:nth-last-col|:nth-last-of-type|:nth-of-type|:only-child|:only-of-type|:optional|:out-of-range|:past|:placeholder-shown|:read-only|:read-write|:required|:right|:root|:scope|:target|:target-within|:user-invalid|:valid|:visited/gi;
  var pseudoClassMatch = /:[a-z-]+/gi;
  //var pseudoElementMatch = /:after|:before|:backdrop|:cue|:first-letter|:first-line|:grammar-error|:marker|:placeholder|:selection|:spelling-error|:slotted/gi;
  var pseudoElementMatch =/:{1,2}before|:{1,2}after|:{1,2}first-letter|:{1,2}first-line|::[a-z-]+/gi;
  //var elementMatch = /(?<![#.([:_a-zA-Z0-9-=])[_a-zA-Z0-9-]+/g;
  var elementMatch =/(\s+|^|\*|\+|>|~|\|\|)[_a-zA-Z0-9-]+/g;
  selector = selector.replaceAll(":not(", " ");
  selector = selector.replace(/:is\(([^)]*)\)/g,(match,variable)=> {
    var maxSpecificity = variable.split(",").map(v=>{
      var newArr = cssSpecificity(v,true);
      return{
        arr : newArr,
        specificity : Number(newArr.join(""))
      }
    }).sort((a, b)=>b-a)[0];
    maxSpecificity.arr.forEach((a,i)=>arr[i]+=a);
    return "";
  });
  // replace special case :not, :is and :where
  selector = selector.replace(/:where\([^)]*\)/g, " ");

  var ids = selector.match(idMatch);
  if(ids)
      arr[0] += ids.length;
  var classes = selector.match(classMatch);
  if(classes)
      arr[1] += classes.length;
  var attributes = selector.match(attributeMatch);
  if(attributes)
      arr[1] += attributes.length;
  var pseudosClasses = selector.match(pseudoClassMatch);
  if(pseudosClasses) {
      pseudosClasses.forEach(p=>{
          if(!p.match(pseudoElementMatch))
              arr[1] += 1
      });
  }
  var pseudoElements = selector.match(pseudoElementMatch);
  if(pseudoElements)
      arr[2] += pseudoElements.length;
  var elements = selector.match(elementMatch);
  if(elements)
      arr[2] += elements.length;
  if(!inside)
    return Number(arr.join(""));
  else
    return arr;
}
if(typeof module !== "undefined" &&
  typeof module.exports !== "undefined")
  module.exports = cssSpecificity;