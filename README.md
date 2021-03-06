# Tilepieces
Tilepieces is an open source software designed for the visual editing of HTML documents and project management where HTML files are used.
For more information, please consult the official website [tilepieces.net](https://tilepieces.net) 
and the [documentation](https://tilepieces.net/documentation).
In this repository you will find the source code of the main project.
## How to create a new application
Using this package, you can create an application.
To do this, download the latest version of the project release.
Once you have downloaded the [zip file](https://github.com/tilepieces/tilepieces/releases/download/latest/tilepieces.project.zip), you can upload it to a working version of a Tilepieces application. The Node.js version is the most suitable for this purpose.
From here, edit the [index.html](https://github.com/tilepieces/tilepieces/blob/main/index.html) file present at the root of the application.
You can:
- remove add [panels](https://tilepieces.net/documentation/panels/index.html), inside the # dock-frames node
- change the [storageInterface](https://tilepieces.net/documentation/api/storage/index.html), which currently points to [modules/tilepieces/storage-interface-http/tilepieces-storage-interface-http.bundle.js](https://github.com/tilepieces/tilepieces/blob/main/modules/tilepieces/storage-interface-http/tilepieces-storage-interface-http.bundle.js).
- Edit the application info, inside the #tilepieces-dialog-info template tag
Further configurations can be made by editing the settings.json file following [this page](https://tilepieces.net/documentation/data-structures/general-settings.html).
## Getting help and asking for new features
If you have any questions about tilepieces, go to
[Q&A](https://github.com/tilepieces/tilepieces/discussions/categories/q-a).
If you want to ask about new features, please create a post on
[new features](https://github.com/tilepieces/tilepieces/discussions/categories/new-features)
## Contributing
See [CONTRIBUTING.md](https://github.com/tilepieces/tilepieces/blob/main/CONTRIBUTING.md) for contributing guidelines.
