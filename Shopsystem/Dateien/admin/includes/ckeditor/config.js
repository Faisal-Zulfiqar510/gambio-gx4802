/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function(config) {
  // Define changes to default configuration here.
  // For the complete reference:
  // http://docs.ckeditor.com/#!/api/CKEDITOR.config

  // The toolbar groups arrangement, optimized for two toolbar rows.
  config.toolbarGroups = [
    { name: "document", groups: ["mode", "document", "doctools"] },
    { name: "clipboard", groups: ["clipboard", "undo"] },
    { name: "insert" },
    { name: "others" },
    { name: "links" },
    { name: "editing", groups: ["find", "selection", "spellchecker"] },
    { name: "about" },
    { name: "basicstyles", groups: ["basicstyles", "cleanup"] },
    { name: "colors" },
    {
      name: "paragraph",
      groups: ["list", "indent", "blocks", "align", "bidi"]
    },
    { name: "styles" },
    { name: "tools" }
  ];

  // Remove some buttons, provided by the standard plugins, which we don't
  // need to have in the Standard(s) toolbar.
  //config.removeButtons = 'Underline,Subscript,Superscript';
  config.removeButtons = "Flash";

  // Se the most common block elements.
  config.format_tags = "div;p;h1;h2;h3;pre";

  config.allowedContent = true;

  // Make dialogs simpler.
  // config.removeDialogTabs = 'image:advanced;link:advanced';
  config.toolbar_Basic = [
    [
      "PasteFromWord",
      "Link",
      "Unlink",
      "-",
      "Image",
      "SpecialChar",
      "HorizontalRule"
    ],
    "/",
    ["Font", "FontSize"],
    "/",
    ["TextColor", "BGColor"],
    ["Source"],
    "/",
    ["Bold", "Italic", "Underline", "Strike", "-", "SelectAll", "RemoveFormat"],
    "/",
    [
      "NumberedList",
      "BulletedList",
      "JustifyLeft",
      "JustifyCenter",
      "JustifyRight",
      "JustifyBlock",
      "Maximize"
    ]
  ];

  config.toolbar_ImageMapper = [
    ["Link", "Unlink"],
    ["Image", "Table", "SpecialChar"],
    ["Font", "TextColor", "BGColor"],
    ["FontSize", "Source", "PasteFromWord"],
    ["Bold", "Italic", "Underline", "Strike", "-", "SelectAll", "RemoveFormat"],
    [
      "NumberedList",
      "BulletedList",
      "Outdent",
      "Indent",
      "JustifyLeft",
      "JustifyCenter",
      "JustifyRight",
      "JustifyBlock",
      "Maximize"
    ]
  ];

  config.enterMode = CKEDITOR.ENTER_BR;
  config.shiftEnterMode = CKEDITOR.ENTER_P;
  config.smiley_admin_path =
    jse.core.config.get("appUrl") + "/images/icons/smileys/";
  config.smiley_path = jse.core.config.get("appUrl") + "/images/icons/smileys/";
  config.protectedSource.push(/\{(?!cke_)[\s\S]*?\}/g);
  config.extraPlugins = "showprotected";
  config.uploadRootDir = "images";

  // INTEGRATION OF RESPONSIVE FILEMANAGER
  config.checkForFilemanager =
    jse.core.config.get("appUrl") +
    "/admin/admin.php?do=ResponsiveFileManagerModuleCenterModule/GetConfiguration";

  // Create a caching system, in order to prevent multiple requests to check if the file manager
  // is activated for the CKEditor.
  if (jse.core.registry.get("useFileManagerInCKEditor") === undefined) {
    jse.core.registry.set("useFileManagerInCKEditor", "pending");

    $.get(config.checkForFilemanager, data => {
      // Use the file manager in the CKEditor if it is installed and if it is activated for the editor.
      if (data.useInCkeditor && data.isInstalled) {
        jse.core.registry.set("useFileManagerInCKEditor", "fileManager");
        useFileManagerIfActive(config);
      } else {
        jse.core.registry.set("useFileManagerInCKEditor", false);
        useFileManagerIfActive(config);
      }
    });
  }

  /**
   * Wait until the request from the file manager configuration storage has finished,
   * and use the file manager in the CKEditor or the default one, depending on the response.
   * @param config
   */
  var useFileManagerIfActive = function(config) {
    var interval = setInterval(function() {
      if (jse.core.registry.get("useFileManagerInCKEditor") !== "pending") {
        clearInterval(interval);

        if (
          jse.core.registry.get("useFileManagerInCKEditor") === "fileManager"
        ) {
          config.lang =
            jse.core.registry.get("languageId") === 2 ? "de" : "en_EN";
          config.fileManagerUrl =
            "../ResponsiveFilemanager/filemanager/filemanager.php?" +
            "sub_folder=" + config.uploadRootDir + "&" +
            "editor=ckeditor&lang=" +
            config.lang;
          config.fileManagerUrl +=
            "&relative_url=" + (config.useRelPath ? "1" : "0");

          // Only show the 'browse server' functionality, if we are not on the emails page.
          if (getURLParameter("do") !== "Emails") {
            config.filebrowserBrowseUrl = config.fileManagerUrl + "&type=2"; // All files allowed
            config.filebrowserImageBrowseUrl =
              config.fileManagerUrl + "&type=1"; // Only images are allowed
          }
        }
      }
    }, 100);
  };

  /**
   * Returns the value of the provided GET parameter from the URL.
   * @param name Name of the GET parameter
   * @returns {string|null}
   */
  var getURLParameter = function(name) {
    return (
      decodeURIComponent(
        (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(
          location.search
        ) || [null, ""])[1].replace(/\+/g, "%20")
      ) || null
    );
  };

  useFileManagerIfActive(config);
};

CKEDITOR.dtd.$removeEmpty["i"] = false;
