let opener = window.opener || (window.parent || window);
// tree builder originally conceived as singleton ( as a simple function ).
// Later changed as constructor, however at the moment only one instance for document is supported.
// these below are the variables that are setted in constructor and shared among the functions
let htmlTreeBuilderTarget; // DOM target
let showEmptyNodes = null;
const voidElementsRegex = /^(AREA|BASE|BR|COL|COMMAND|EMBED|HR|IMG|INPUT|KEYGEN|LINK|META|PARAM|SOURCE|TRACK|WBR)$/;
