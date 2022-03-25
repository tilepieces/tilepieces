function componentModel(name, path) {
  return {
    name,
    description: "",
    version: "",
    author: "",
    website: "",
    repository: "",
    html: "",
    bundle: {
      "stylesheet": {},
      "script": {}
    },
    sources: {
      "stylesheets": [],
      "scripts": []
    },
    dependencies: [],
    miscellaneous: [],
    selector: "",
    interface: ""
  }
}