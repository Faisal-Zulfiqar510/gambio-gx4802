# JSEngine
 
## Gulp Tasks

The GX4 Gulp workflow supports various sections of development and the tasks are organized in **task domains** each one 
of whom is responsible for a single development section. The task files are located in the "tools/gulp_tasks" 
directory and they are separated into domain folders where each file name follows the "gulp_{domain}_{task}.js" naming 
convention. 

Most of the times you will need to execute the "build" or "dev" tasks in order to re-generate the final asset files or 
during development where file watchers are needed. For example if you need to change admin JS files execute the `gulp admin:dev` 
task which will re-generate all the assets once more and then watch for any changes. Once a new change is performed it will 
copy, minify and optionally upload the file to the server (ftp-config.json required). 

**Execute all the build tasks at once by running the `gulp` command from your terminal.** 

**Execute all the dev tasks at once by running the `gulp dev` command from your terminal.**

**Execute all the ftp tasks at once by running the `gulp ftp` command from your terminal.**

**List all the available gulp tasks from each domain with the `gulp help` command.**


## Executing these Gulp tasks

It's possible to run Gulp from inside this `JSEngine` directory, but we recommend to use the Yarn commands we created
and which are available from the root directory of the project.


### General Domain
Contains general tasks that affect multiple domains. 

* `yarn general:build` will execute the build tasks from all the registered domains (equals to `gulp` command).
* `yarn general:coverage` will execute the PHPUnit tests and produce code coverage and testdox documentation files in the "developers.gambio.de/tests" directory.
* `yarn general:dev` will execute the dev tasks from all the registered domains (equals to `gulp dev` command).
* `yarn general:doc` will generate the project documentation by executing the developers-doc.sh (unix only).
* `yarn general:ftp` will execute all the FTP tasks which will actually upload all the asset files (equals to `gulp ftp` command).
* `yarn general:jshint` will execute all the JSHint tasks from every domain.
* `yarn general:test` will execute the PHP and JavaScript unit tests of the shop.
* `yarn general:post_configure` will execute post-configuration tasks (configure files creation ...).

### Admin Domain
Contains tasks used for admin development. 

* `yarn admin:build` will build all the assets of the admin domain.
* `yarn admin:clean` will remove all the auto-generated assets from the admin/html/assets directory.
* `yarn admin:dev` will re-generate the assets and activate the file watchers.
* `yarn admin:ftp` will manually upload the admin assets to the server (ftp-config.json is required).
* `yarn admin:jshint` will perform a jshint check in the javascript files. 
* `yarn admin:scripts` will only build the admin JavaScript files.
* `yarn admin:styles` will only build the admin style files. 
* `yarn admin:templates` will remove the cache files in "cache/smarty" and upload the changed templates (FTP connection required). 
* `yarn admin:vendor` will build vendor.js and vendor.css files in the admin assets directory.
* `yarn admin:watch` will start the file watchers for the admin files (prefer the "dev" task for development).

### Template Domain
Contains tasks used for the template development. By default the tasks will work with the Honeygrid template but it 
is possible to provide a custom template directory by providing the `--template` parameter followed by the directory
name of the custom template (e.g. gulp template:dev --template CustomTemplateName). This way you can make a copy of 
Honeygrid and still use the gulp workflow for the modifications. **Keep in mind though that the directory structure must
remain the same.**

* `yarn template:build` will build all the assets of the template.
* `yarn template:clean` will remove all the auto-generated assets from the {Template}/assets directory. 
* `yarn template:dev` will re-generate the assets and activate the file watchers for development.
* `yarn template:ftp` will manually upload the template assets to the server (ftp-config.json is required).
* `yarn template:jshint` will perform a JSHint check in the javascript files. 
* `yarn template:refresh_cache` will remove the __dynamics.css (either from FTP server or locally). 
* `yarn template:scripts` will only build the admin JavaScript files.
* `yarn template:templates` will remove the cache files in "cache/smarty" and upload the changed templates (FTP connection required).
* `yarn template:vendor` will build vendor.js and vendor.css files in the template assets directory.
* `yarn template:watch` will start the file watchers for the template files.

### Theme Domain
Contains tasks used for the theme development. By default the tasks will work with the Honeygrid theme but it 
is possible to provide a custom theme directory by providing the `--theme` parameter followed by the directory
name of the custom theme (e.g. gulp theme:dev --theme CustomThemeName). This way you can make a copy of 
Honeygrid and still use the gulp workflow for the modifications. **Keep in mind though that the directory structure must
remain the same.**

* `yarn theme:build` will build all the assets of the theme.
* `yarn theme:clean` will remove all the auto-generated assets from the directory. 
* `yarn theme:dev` will re-generate the assets and activate the file watchers for development.
* `yarn theme:ftp` will manually upload the theme assets to the server (FTP connection required).
* `yarn theme:jshint` will perform a JSHint check in the javascript files. 
* `yarn theme:rebuild` will rebuild the public/theme directory locally and optionally upload it with. 
* `yarn theme:refresh_cache` will remove the __dynamics.css (either from FTP server or locally). 
* `yarn theme:scripts` will only build the admin JavaScript files.
* `yarn theme:templates` will remove the cache files in "cache/smarty" and upload the changed html files (FTP connection required).
* `yarn theme:vendor` will build vendor.js and vendor.css files in the theme assets directory.
* `yarn theme:watch` will start the file watchers for the theme files.

### StyleEdit3 Domain
Contains tasks used for the StyleEdit utility development. 

* `yarn style_edit:build` will build all the assets of StyleEdit.
* `yarn style_edit:clean` will remove all the auto-generated assets from the StyleEdit3/assets directory. 
* `yarn style_edit:dev` will re-generate the assets and activate the file watchers for development.
* `yarn style_edit:ftp` will manually upload the StyleEdit assets to the server (ftp-config.json is required).
* `yarn style_edit:jshint` will perform a jshint check in the javascript files. 
* `yarn style_edit:scripts` will only build the StyleEdit JavaScript files.
* `yarn style_edit:styles` will only build the StyleEdit style files. 
* `yarn style_edit:test` execute the PhpUnit and Mocha tests. 
* `yarn style_edit:vendor` will build vendor.js and vendor.css files in the template assets directory.
* `yarn style_edit:watch` will start the file watchers for the StyleEdit files.

### JS Engine Domain
Contains tasks used for the core of the JS Engine.  

* `yarn jsengine:build` will build the JSEngine files and vendor.
* `yarn jsengine:clean` will remove all the auto-generated assets from the JSEngine/build directory. 
* `yarn jsengine:dev` will re-generate the assets and activate the file watchers for development.
* `yarn jsengine:ftp` will manually upload the JSEngine assets to the server (ftp-config.json is required).
* `yarn jsengine:jshint` will perform a jshint check in the javascript files. 
* `yarn jsengine:scripts` will only build the JSEngine script files.
* `yarn jsengine:vendor` will build vendor.js and vendor.css files in the JSEngine assets directory.
* `yarn jsengine:watch` will start the file watchers for the JSEngine files.

### GXModules Domain
Contains tasks used for the GXModules.  

* `yarn gxmodules:build` will build all the assets of the GXModules domain.
* `yarn gxmodules:clean` will remove all the auto-generated "build" directory from GXModules. 
* `yarn gxmodules:dev` will re-generate the assets and activate the file watchers.
* `yarn gxmodules:ftp` will manually upload the GXModules assets to the server (ftp-config.json is required).
* `yarn gxmodules:jshint` will perform a jshint check in the javascript files. 
* `yarn gxmodules:scripts` will only build the GXModules javascript files.
* `yarn gxmodules:styles` will only build the GXModules style files.
* `yarn gxmodules:templates` will Will remove the cache files in "cache/smarty" and upload the changed templates (ftp-config.json is required).
* `yarn gxmodules:watch` will start the file watchers for the JSEngine files.