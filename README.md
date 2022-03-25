# Tilepieces
Tilepieces is an open source software designed for the visual editing of HTML and manage projects where HTML files are used.
For more information, please consult the official website [tilepieces.net](https://tilepieces.net) 
and the [documentation](https://tilepieces.net/documentation).

In this repository you will find the source code of the main project.

Using this package, you can create an application.

To do this, download the latest version of the project release.

Once you have downloaded the [zip file](https://github.com/tilepieces/tilepieces/releases/download/latest/tilepieces.project.zip), you can upload it to a working version of a Tilepieces application. The Node.js version is the most suitable for this purpose.

From here, edit the [index.html](https://github.com/tilepieces/tilepieces/blob/main/index.html) file present at the root of the application.
You can:
- remove add [panels](https://tilepieces.net/documentation/panels.html), inside the # dock-frames node
- change the [storageInterface](https://tilepieces.net/documentation/api/storageInterface.html), which currently points to modules/tilepieces/storage-interface-http/tilepieces-storage-interface-http.bundle.js.
- Edit the application info, inside the # tilepieces-dialog-info template tag

Further configurations can be made by editing the settings.json file following [this page](https://tilepieces.net/documentation/data-structures/general-settings.html).
