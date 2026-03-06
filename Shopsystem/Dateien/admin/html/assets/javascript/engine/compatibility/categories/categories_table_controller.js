"use strict";

/* --------------------------------------------------------------
 categories_table_controller.js 2021-09-14
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Orders Table Controller
 *
 * This controller contains the mapping logic of the categories/articles table.
 *
 * @module Compatibility/categories_table_controller
 */
gx.compatibility.module("categories_table_controller", [gx.source + "/libs/button_dropdown"],

/**  @lends module:Compatibility/categories_table_controller */

function (data) {
    "use strict";

    // ------------------------------------------------------------------------
    // VARIABLES DEFINITION
    // ------------------------------------------------------------------------

    var /**
         * Module Selector
         *
         * @var {object}
         */
    $this = $(this),

    /**
     * Default Options
     *
     * @type {object}
     */
    defaults = {},

    /**
     * Final Options
     *
     * @var {object}
     */
    options = $.extend(true, {}, defaults, data),

    /**
     * Module Object
     *
     * @type {object}
     */
    module = {};

    // ------------------------------------------------------------------------
    // PRIVATE METHODS
    // ------------------------------------------------------------------------

    /**
     * Get Url Parameter
     *
     * Gets a specific URL get parameter from the address bar,
     * which name should be provided as an argument.
     * @param {string} parameterName
     * @returns {object}
     * @private
     */
    var _getUrlParameter = function _getUrlParameter(parameterName) {
        var results = new RegExp("[?&]" + parameterName + "=([^&#]*)").exec(window.location.href);
        if (results == null) {
            return null;
        } else {
            return results[1] || 0;
        }
    };

    /**
     * Product ID
     *
     * Holds the product id from the get parameter.
     * @type {object}
     */
    var $productId = _getUrlParameter("pID");

    /**
     * Category ID
     *
     * Holds the category id from the get parameter.
     * @type {object}
     */
    var $categoryId = _getUrlParameter("cID");

    /**
     * Table Row of Updated Product
     *
     * Table row selector of a product, depending on the pID GET parameter.
     * @type {object|jQuery|HTMLElement}
     */
    var $tableRowOfUpdatedProduct = $("tr[data-id=" + $productId + "]");

    /**
     * Table Row of Updated Category
     *
     * Table row selector of a category, depending on the cID GET parameter.
     * @type {object|jQuery|HTMLElement}
     */
    var $tableRowOfUpdatedCategory = $("tr[data-id=" + $categoryId + "]");

    $tableRowOfUpdatedProduct.addClass("recentlyUpdated");
    $tableRowOfUpdatedCategory.addClass("recentlyUpdated");

    /**
     * Disable/Enable the buttons on the bottom button-dropdown
     * dependent on the checkboxes selection
     * @private
     */
    var _toggleMultiActionBtn = function _toggleMultiActionBtn() {
        var $checked = $('tr[data-id] input[type="checkbox"]:checked');
        $(".js-bottom-dropdown button").prop("disabled", !$checked.length);
    };

    /**
     * Prepare Form
     *
     * @param {string} action
     * @return {object | jQuery}
     *
     * @private
     */
    var _$prepareForm = function _$prepareForm(action) {
        /**
         * Build data object for reference
         * @var {object}
         */
        var data = {
            cPath: "",
            url: [_getSourcePath(), "categories.php", "?action=multi_action"].join(""),
            pageToken: $('input[name="page_token"]:first').attr("value")
        };

        /**
         * Add cPath
         */
        try {
            data.cPath = window.location.href.match(/cPath=(.*)/)[1];
        } catch (e) {
            data.cPath = null;
        }

        if (data.cPath !== null) {
            data.url += "&cPath=" + data.cPath;
        }

        var search = _getUrlParameter("search");
        if (search !== 0 && search !== null) {
            data.url += "&search=" + search;
        }

        var page = _getUrlParameter("page");
        if (page !== 0 && page !== null && data.url.indexOf("page=") === -1) {
            data.url += "&page=" + page;
        }

        var sorting = _getUrlParameter("sorting");
        if (sorting !== 0 && sorting !== null) {
            data.url += "&sorting=" + sorting;
        }

        /**
         * Build cached form and return it
         * @type {object | jQuery}
         */
        var $form = $('<form name="multi_action_form" method="post" action=' + data.url + "></form>");
        $form.append('<input type="hidden" name="cpath" value=' + data.cPath + ">");
        $form.append('<input type="hidden" name="page_token" value=' + data.pageToken + ">");
        $form.append('<input type="hidden" name=' + action + ' value="Action">');
        $form.appendTo("body");
        return $form;
    };

    /**
     * Map actions for every row in the table.
     *
     * This method will map the actions for each
     * row of the table.
     *
     * @private
     */
    var _mapRowActions = function _mapRowActions() {
        $(".gx-categories-table tr").not(".dataTableHeadingRow").each(function () {
            /**
             * Save that "this" scope here
             *
             * @var {object | jQuery}
             */
            var $that = $(this);

            /**
             * Data attributes of current row
             *
             * @var {object}
             */
            var data = $that.data();

            /**
             * Reference to the row action dropdown
             *
             * @var {object | jQuery}
             */
            var $dropdown = $that.find(".js-button-dropdown");

            /**
             * Fix checkbox event handling conflict and (de-)activate the bottom button-dropdown
             * on checkbox changes
             */
            window.setTimeout(function () {
                $that.find(".single-checkbox").on("click", function (event) {
                    event.stopPropagation();
                    _toggleMultiActionBtn();
                });
            }, 500);

            /**
             * Call action binder method
             */
            if (data.isProduct) {
                _mapProductActions($dropdown, data);
            } else {
                _mapCategoryActions($dropdown, data);
            }

            // Bind icon actions
            // -----------------

            // Open Product / Category
            $that.find(".fa-folder-open-o, .fa-pencil").parent().on("click", function (event) {
                event.preventDefault();
                var url = $that.find("td:eq(2) a[href]:first").prop("href");
                window.open(url, "_self");
            });

            // Delete Product / Category
            $that.find(".fa-trash-o").parent().on("click", function (event) {
                var $deleteItem = $dropdown.find("span:contains(" + jse.core.lang.translate("delete", "buttons") + ")");
                $deleteItem.click();
            });
        });
    };

    /**
     * Get path of the admin folder
     * Only used start to get the source path
     *
     * @returns {string}
     */
    var _getSourcePath = function _getSourcePath() {
        var url = window.location.origin,
            path = window.location.pathname;

        var splittedPath = path.split("/");
        splittedPath.pop();

        var joinedPath = splittedPath.join("/");

        return url + joinedPath + "/";
    };

    /**
     * Bind an action of a product button to the dropdown.
     *
     * @param action
     * @param $dropdown
     * @param data
     *
     * @private
     */
    var _mapProductAction = function _mapProductAction(action, $dropdown, data) {
        var section = _productSectionNameMapping[action],
            callback = function callback(event) {
            _productConfigurationKeyCallbacks(action, $(event.target), data);
        };
        jse.libs.button_dropdown.mapAction($dropdown, action, section, callback);
    };

    /**
     * Bind an action of a category button to the dropdown.
     *
     * @param action
     * @param $dropdown
     * @param data
     *
     * @private
     */
    var _mapCategoryAction = function _mapCategoryAction(action, $dropdown, data) {
        var section = _categorySectionNameMapping[action],
            callback = function callback(event) {
            _categoryConfigurationKeyCallbacks(action, $(event.target), data);
        };
        jse.libs.button_dropdown.mapAction($dropdown, action, section, callback);
    };

    var _productSectionNameMapping = {
        edit: "buttons",
        delete: "buttons",
        BUTTON_MOVE: "admin_buttons",
        BUTTON_COPY: "admin_buttons",
        BUTTON_PROPERTIES: "admin_buttons",
        BUTTON_EDIT_CROSS_SELLING: "categories",
        GM_BUTTON_ADD_SPECIAL: "gm_general",
        BUTTON_PRODUCT_OPTIONS: "admin_buttons",
        BUTTON_PRODUCT_DOWNLOADS: "admin_buttons"
    };

    var _categorySectionNameMapping = {
        edit: "buttons",
        delete: "buttons",
        BUTTON_MOVE: "admin_buttons",
        BUTTON_COPY: "admin_buttons",
        BUTTON_GOOGLE_CATEGORIES: "categories"
    };

    /**
     * Mapping callback functions of product actions.
     *
     * @param key
     * @param $dropdown
     * @param data
     *
     * @private
     */
    var _productConfigurationKeyCallbacks = function _productConfigurationKeyCallbacks(key, $dropdown, data) {
        switch (key) {
            case "edit":
                _productEditCallback(data);
                break;
            case "delete":
                _productDeleteCallback($dropdown);
                break;
            case "BUTTON_MOVE":
                _productMoveCallback($dropdown);
                break;
            case "BUTTON_COPY":
                _productCopyCallback($dropdown);
                break;
            case "BUTTON_PROPERTIES":
                _productPropertiesCallback(data);
                break;
            case "BUTTON_EDIT_CROSS_SELLING":
                _productEditCrossSellingCallback(data);
                break;
            case "GM_BUTTON_ADD_SPECIAL":
                _productAddSpecialCallback(data);
                break;
            case "BUTTON_PRODUCT_OPTIONS":
                _productEditProductOptionsCallback(data);
                break;
            case "BUTTON_PRODUCT_DOWNLOADS":
                _productEditProductDownloadsCallback(data);
                break;
            default:
                console.alert("Callback not found");
                break;
        }
    };
    /**
     * Execute edit button callback.
     *
     * @private
     */
    var _productEditCallback = function _productEditCallback(data) {
        var url = [_getSourcePath(), "categories.php", "?pID=" + data.id, "&cPath=" + data.cpath, "&action=new_product", "&page=" + data.page].join("");
        window.open(url, "_self");
    };

    /**
     * Execute delete button callback.
     *
     * @param $dropdown
     *
     * @private
     */
    var _productDeleteCallback = function _productDeleteCallback($dropdown) {
        // Uncheck all checkboxes
        $(".gx-categories-table").find('input[type="checkbox"]').prop("checked", false);

        // Check current checkbox
        $dropdown.parents("tr:first").find('td:first input[type="checkbox"]').prop("checked", true);

        // Create cached form
        var $form = _$prepareForm("multi_delete");

        // Add checkbox to form
        $dropdown.parents("tr:first").find('td:first input[type="checkbox"]').clone().appendTo($form);

        // Submit form
        $form.submit();
    };

    /**
     * Execute move button callback.
     *
     * @param $dropdown
     *
     * @private
     */
    var _productMoveCallback = function _productMoveCallback($dropdown) {
        // Uncheck all checkboxes
        $(".gx-categories-table").find('input[type="checkbox"]').prop("checked", false);

        // Check current checkbox
        $dropdown.parents("tr:first").find('td:first input[type="checkbox"]').prop("checked", true);

        // Create cached form
        var $form = _$prepareForm("multi_move");

        // Add checkbox to form
        $dropdown.parents("tr:first").find('td:first input[type="checkbox"]').clone().appendTo($form);

        // Submit form
        $form.submit();
    };

    /**
     * Execute copy button callback.
     *
     * @param $dropdown
     *
     * @private
     */
    var _productCopyCallback = function _productCopyCallback($dropdown) {
        // Uncheck all checkboxes
        $(".gx-categories-table").find('input[type="checkbox"]').prop("checked", false);

        // Check current checkbox
        $dropdown.parents("tr:first").find('td:first input[type="checkbox"]').prop("checked", true);

        // Create cached form
        var $form = _$prepareForm("multi_copy");

        // Add checkbox to form
        $dropdown.parents("tr:first").find('td:first input[type="checkbox"]').clone().appendTo($form);

        // Submit form
        $form.submit();
    };

    /**
     * Execute property button callback.
     *
     * @private
     */
    var _productPropertiesCallback = function _productPropertiesCallback(data) {
        var url = [_getSourcePath(), "properties_combis.php", "?products_id=" + data.id, "&cPath=" + data.cpath, "&action=edit_category"].join("");
        window.open(url, "_self");
    };

    /**
     * Execute edit cross selling button callback.
     *
     * @private
     */
    var _productEditCrossSellingCallback = function _productEditCrossSellingCallback(data) {
        var url = [_getSourcePath(), "categories.php", "?current_product_id=" + data.id, "&cPath=" + data.cpath, "&action=edit_crossselling"].join("");
        window.open(url, "_self");
    };

    /**
     * Execute add special button callback.
     *
     * @private
     */
    var _productAddSpecialCallback = function _productAddSpecialCallback(data) {
        var url = [_getSourcePath(), "specials.php", "?pID=" + data.id, "&action=" + (data.specialId !== undefined ? "edit" : "new"), data.specialId !== undefined ? "&sID=" + data.specialId : ""].join("");
        window.open(url, "_self");
    };

    var _productEditProductOptionsCallback = function _productEditProductOptionsCallback(data) {
        var url = [_getSourcePath(), "products/", data.id + "/", "options", "?cPath=" + data.cpath].join("");
        window.open(url, "_self");
    };

    var _productEditProductDownloadsCallback = function _productEditProductDownloadsCallback(data) {
        var url = [_getSourcePath(), "products/", data.id + "/", "downloads", "?cPath=" + data.cpath].join("");
        window.open(url, "_self");
    };

    /**
     * Mapping callback functions of category actions.
     *
     * @param key
     * @param $dropdown
     * @param data
     *
     * @private
     */
    var _categoryConfigurationKeyCallbacks = function _categoryConfigurationKeyCallbacks(key, $dropdown, data) {
        switch (key) {
            case "edit":
                _categoryEditCallback(data);
                break;
            case "delete":
                _categoryDeleteCallback($dropdown);
                break;
            case "BUTTON_MOVE":
                _categoryMoveCallback($dropdown);
                break;
            case "BUTTON_COPY":
                _categoryCopyCallback($dropdown);
                break;
            case "BUTTON_GOOGLE_CATEGORIES":
                _categoryGoogleCategoriesCallback(data);
                break;
            default:
                console.alert("Callback not found");
                break;
        }
    };
    /**
     * Execute edit button callback.
     *
     * @private
     */
    var _categoryEditCallback = function _categoryEditCallback(data) {
        var url = [_getSourcePath(), "categories.php", "?cID=" + data.id, "&cPath=" + data.cpath, "&action=edit_category"].join("");
        window.open(url, "_self");
    };

    /**
     * Execute delete button callback.
     *
     * @param $dropdown
     *
     * @private
     */
    var _categoryDeleteCallback = function _categoryDeleteCallback($dropdown) {
        // Uncheck all checkboxes
        $(".gx-categories-table").find('input[type="checkbox"]').prop("checked", false);

        // Check current checkbox
        $dropdown.parents("tr:first").find('td:first input[type="checkbox"]').prop("checked", true);

        // Create cached form
        var $form = _$prepareForm("multi_delete");

        // Add checkbox to form
        $dropdown.parents("tr:first").find('td:first input[type="checkbox"]').clone().appendTo($form);

        // Submit form
        $form.submit();
    };

    /**
     * Execute move button callback.
     *
     * @param $dropdown
     *
     * @private
     */
    var _categoryMoveCallback = function _categoryMoveCallback($dropdown) {
        // Uncheck all checkboxes
        $(".gx-categories-table").find('input[type="checkbox"]').prop("checked", false);

        // Check current checkbox
        $dropdown.parents("tr:first").find('td:first input[type="checkbox"]').prop("checked", true);

        // Create cached form
        var $form = _$prepareForm("multi_move");

        // Add checkbox to form
        $dropdown.parents("tr:first").find('td:first input[type="checkbox"]').clone().appendTo($form);

        // Submit form
        $form.submit();
    };

    /**
     * Execute copy button callback.
     *
     * @param $dropdown
     *
     * @private
     */
    var _categoryCopyCallback = function _categoryCopyCallback($dropdown) {
        // Uncheck all checkboxes
        $(".gx-categories-table").find('input[type="checkbox"]').prop("checked", false);

        // Check current checkbox
        $dropdown.parents("tr:first").find('td:first input[type="checkbox"]').prop("checked", true);

        // Create cached form
        var $form = _$prepareForm("multi_copy");

        // Add checkbox to form
        $dropdown.parents("tr:first").find('td:first input[type="checkbox"]').clone().appendTo($form);

        // Submit form
        $form.submit();
    };

    /**
     * Execute google categories callback button.
     *
     * @param data
     *
     * @private
     */
    var _categoryGoogleCategoriesCallback = function _categoryGoogleCategoriesCallback(data) {
        var $lightbox = $(".lightbox_google_admin_categories");
        $lightbox.attr("href", "google_admin_categories.html?categories_id=" + data.id);
        $lightbox.click();
    };

    /**
     * Map actions for the article dropdown
     *
     * @param params {object}
     *
     * @private
     */
    var _mapProductActions = function _mapProductActions($dropdown, data) {
        _mapProductAction("edit", $dropdown, data);
        _mapProductAction("delete", $dropdown, data); //Bind: Delete (Single Row)
        _mapProductAction("BUTTON_MOVE", $dropdown, data); // Bind: Move
        _mapProductAction("BUTTON_COPY", $dropdown, data); // Bind: Copy
        jse.libs.button_dropdown.addSeparator($dropdown, true); // add a separator to dropdown
        _mapProductAction("BUTTON_PRODUCT_OPTIONS", $dropdown, data); // Bind: Product Options
        _mapProductAction("BUTTON_PROPERTIES", $dropdown, data); // Bind: Properties
        _mapProductAction("BUTTON_PRODUCT_DOWNLOADS", $dropdown, data); // Bind: Product Downloads
        _mapProductAction("GM_BUTTON_ADD_SPECIAL", $dropdown, data); // Bind: New Offer
        _mapProductAction("BUTTON_EDIT_CROSS_SELLING", $dropdown, data); // Bind: Cross Selling
    };

    /**
     * Map actions for the category dropdown
     *
     * @param params
     *
     * @private
     */
    var _mapCategoryActions = function _mapCategoryActions($dropdown, data) {
        _mapCategoryAction("edit", $dropdown, data);
        _mapCategoryAction("delete", $dropdown, data); // Bind: Delete
        _mapCategoryAction("BUTTON_MOVE", $dropdown, data); // Bind: Move
        _mapCategoryAction("BUTTON_COPY", $dropdown, data); // Bind: Copy
        jse.libs.button_dropdown.addSeparator($dropdown, true); // add a separator to dropdown
        _mapCategoryAction("BUTTON_GOOGLE_CATEGORIES", $dropdown, data); // Bind: Google categories
    };

    var _selectAllCheckboxes = function _selectAllCheckboxes(event) {
        if ($(event.target).prop("checked") === true) {
            $("input.checkbox").parent().addClass("checked");
            $("input.checkbox").prop("checked", true);
        } else {
            $("input.checkbox").parent().removeClass("checked");
            $("input.checkbox").prop("checked", false);
        }
        _toggleMultiActionBtn();
    };

    var _onMouseEnterStockWarn = function _onMouseEnterStockWarn() {
        $(this).data("shortStockString", $(this).text()); // backup current string
        $(this).text($(this).data("completeStockString")); // display complete string
    };

    var _onMouseLeaveStockWarn = function _onMouseLeaveStockWarn() {
        $(this).text($(this).data("shortStockString"));
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------
    module.init = function (done) {
        // Wait until the buttons are converted to dropdown for every row.
        var interval = setInterval(function () {
            if ($(".js-button-dropdown").length > 0) {
                clearInterval(interval);
                _mapRowActions();

                // Init checkbox checked
                _toggleMultiActionBtn();
            }
        }, 200);

        // Check for selected checkboxes also
        // before all rows and their dropdown widgets have been initialized.
        _toggleMultiActionBtn();

        $("#gm_check").on("click", _selectAllCheckboxes);
        $this.on("mouseenter", ".stock_warn", _onMouseEnterStockWarn).on("mouseleave", ".stock_warn", _onMouseLeaveStockWarn);

        // Finish it
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhdGVnb3JpZXMvY2F0ZWdvcmllc190YWJsZV9jb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbImd4IiwiY29tcGF0aWJpbGl0eSIsIm1vZHVsZSIsInNvdXJjZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJkZWZhdWx0cyIsIm9wdGlvbnMiLCJleHRlbmQiLCJfZ2V0VXJsUGFyYW1ldGVyIiwicGFyYW1ldGVyTmFtZSIsInJlc3VsdHMiLCJSZWdFeHAiLCJleGVjIiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwiJHByb2R1Y3RJZCIsIiRjYXRlZ29yeUlkIiwiJHRhYmxlUm93T2ZVcGRhdGVkUHJvZHVjdCIsIiR0YWJsZVJvd09mVXBkYXRlZENhdGVnb3J5IiwiYWRkQ2xhc3MiLCJfdG9nZ2xlTXVsdGlBY3Rpb25CdG4iLCIkY2hlY2tlZCIsInByb3AiLCJsZW5ndGgiLCJfJHByZXBhcmVGb3JtIiwiYWN0aW9uIiwiY1BhdGgiLCJ1cmwiLCJfZ2V0U291cmNlUGF0aCIsImpvaW4iLCJwYWdlVG9rZW4iLCJhdHRyIiwibWF0Y2giLCJlIiwic2VhcmNoIiwicGFnZSIsImluZGV4T2YiLCJzb3J0aW5nIiwiJGZvcm0iLCJhcHBlbmQiLCJhcHBlbmRUbyIsIl9tYXBSb3dBY3Rpb25zIiwibm90IiwiZWFjaCIsIiR0aGF0IiwiJGRyb3Bkb3duIiwiZmluZCIsInNldFRpbWVvdXQiLCJvbiIsImV2ZW50Iiwic3RvcFByb3BhZ2F0aW9uIiwiaXNQcm9kdWN0IiwiX21hcFByb2R1Y3RBY3Rpb25zIiwiX21hcENhdGVnb3J5QWN0aW9ucyIsInBhcmVudCIsInByZXZlbnREZWZhdWx0Iiwib3BlbiIsIiRkZWxldGVJdGVtIiwianNlIiwiY29yZSIsImxhbmciLCJ0cmFuc2xhdGUiLCJjbGljayIsIm9yaWdpbiIsInBhdGgiLCJwYXRobmFtZSIsInNwbGl0dGVkUGF0aCIsInNwbGl0IiwicG9wIiwiam9pbmVkUGF0aCIsIl9tYXBQcm9kdWN0QWN0aW9uIiwic2VjdGlvbiIsIl9wcm9kdWN0U2VjdGlvbk5hbWVNYXBwaW5nIiwiY2FsbGJhY2siLCJfcHJvZHVjdENvbmZpZ3VyYXRpb25LZXlDYWxsYmFja3MiLCJ0YXJnZXQiLCJsaWJzIiwiYnV0dG9uX2Ryb3Bkb3duIiwibWFwQWN0aW9uIiwiX21hcENhdGVnb3J5QWN0aW9uIiwiX2NhdGVnb3J5U2VjdGlvbk5hbWVNYXBwaW5nIiwiX2NhdGVnb3J5Q29uZmlndXJhdGlvbktleUNhbGxiYWNrcyIsImVkaXQiLCJkZWxldGUiLCJCVVRUT05fTU9WRSIsIkJVVFRPTl9DT1BZIiwiQlVUVE9OX1BST1BFUlRJRVMiLCJCVVRUT05fRURJVF9DUk9TU19TRUxMSU5HIiwiR01fQlVUVE9OX0FERF9TUEVDSUFMIiwiQlVUVE9OX1BST0RVQ1RfT1BUSU9OUyIsIkJVVFRPTl9QUk9EVUNUX0RPV05MT0FEUyIsIkJVVFRPTl9HT09HTEVfQ0FURUdPUklFUyIsImtleSIsIl9wcm9kdWN0RWRpdENhbGxiYWNrIiwiX3Byb2R1Y3REZWxldGVDYWxsYmFjayIsIl9wcm9kdWN0TW92ZUNhbGxiYWNrIiwiX3Byb2R1Y3RDb3B5Q2FsbGJhY2siLCJfcHJvZHVjdFByb3BlcnRpZXNDYWxsYmFjayIsIl9wcm9kdWN0RWRpdENyb3NzU2VsbGluZ0NhbGxiYWNrIiwiX3Byb2R1Y3RBZGRTcGVjaWFsQ2FsbGJhY2siLCJfcHJvZHVjdEVkaXRQcm9kdWN0T3B0aW9uc0NhbGxiYWNrIiwiX3Byb2R1Y3RFZGl0UHJvZHVjdERvd25sb2Fkc0NhbGxiYWNrIiwiY29uc29sZSIsImFsZXJ0IiwiaWQiLCJjcGF0aCIsInBhcmVudHMiLCJjbG9uZSIsInN1Ym1pdCIsInNwZWNpYWxJZCIsInVuZGVmaW5lZCIsIl9jYXRlZ29yeUVkaXRDYWxsYmFjayIsIl9jYXRlZ29yeURlbGV0ZUNhbGxiYWNrIiwiX2NhdGVnb3J5TW92ZUNhbGxiYWNrIiwiX2NhdGVnb3J5Q29weUNhbGxiYWNrIiwiX2NhdGVnb3J5R29vZ2xlQ2F0ZWdvcmllc0NhbGxiYWNrIiwiJGxpZ2h0Ym94IiwiYWRkU2VwYXJhdG9yIiwiX3NlbGVjdEFsbENoZWNrYm94ZXMiLCJyZW1vdmVDbGFzcyIsIl9vbk1vdXNlRW50ZXJTdG9ja1dhcm4iLCJ0ZXh0IiwiX29uTW91c2VMZWF2ZVN0b2NrV2FybiIsImluaXQiLCJkb25lIiwiaW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsImNsZWFySW50ZXJ2YWwiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7OztBQU9BQSxHQUFHQyxhQUFILENBQWlCQyxNQUFqQixDQUNJLDZCQURKLEVBR0ksQ0FBQ0YsR0FBR0csTUFBSCxHQUFZLHVCQUFiLENBSEo7O0FBS0k7O0FBRUEsVUFBVUMsSUFBVixFQUFnQjtBQUNaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxRQUFJOzs7OztBQUtBQyxZQUFRQyxFQUFFLElBQUYsQ0FMWjs7QUFNSTs7Ozs7QUFLQUMsZUFBVyxFQVhmOztBQVlJOzs7OztBQUtBQyxjQUFVRixFQUFFRyxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJGLFFBQW5CLEVBQTZCSCxJQUE3QixDQWpCZDs7QUFrQkk7Ozs7O0FBS0FGLGFBQVMsRUF2QmI7O0FBeUJBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7O0FBU0EsUUFBSVEsbUJBQW1CLFNBQW5CQSxnQkFBbUIsQ0FBVUMsYUFBVixFQUF5QjtBQUM1QyxZQUFJQyxVQUFVLElBQUlDLE1BQUosQ0FBVyxTQUFTRixhQUFULEdBQXlCLFdBQXBDLEVBQWlERyxJQUFqRCxDQUFzREMsT0FBT0MsUUFBUCxDQUFnQkMsSUFBdEUsQ0FBZDtBQUNBLFlBQUlMLFdBQVcsSUFBZixFQUFxQjtBQUNqQixtQkFBTyxJQUFQO0FBQ0gsU0FGRCxNQUVPO0FBQ0gsbUJBQU9BLFFBQVEsQ0FBUixLQUFjLENBQXJCO0FBQ0g7QUFDSixLQVBEOztBQVNBOzs7Ozs7QUFNQSxRQUFJTSxhQUFhUixpQkFBaUIsS0FBakIsQ0FBakI7O0FBRUE7Ozs7OztBQU1BLFFBQUlTLGNBQWNULGlCQUFpQixLQUFqQixDQUFs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a0IsT0FBbEIsRUFBMkJzRSxvQkFBM0I7QUFDQXBILGNBQ0s4QyxFQURMLENBQ1EsWUFEUixFQUNzQixhQUR0QixFQUNxQ3dFLHNCQURyQyxFQUVLeEUsRUFGTCxDQUVRLFlBRlIsRUFFc0IsYUFGdEIsRUFFcUMwRSxzQkFGckM7O0FBSUE7QUFDQUU7QUFDSCxLQXZCRDs7QUF5QkEsV0FBTzdILE1BQVA7QUFDSCxDQW50QkwiLCJmaWxlIjoiY2F0ZWdvcmllcy9jYXRlZ29yaWVzX3RhYmxlX2NvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGNhdGVnb3JpZXNfdGFibGVfY29udHJvbGxlci5qcyAyMDIxLTA5LTE0XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAyMSBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBPcmRlcnMgVGFibGUgQ29udHJvbGxlclxuICpcbiAqIFRoaXMgY29udHJvbGxlciBjb250YWlucyB0aGUgbWFwcGluZyBsb2dpYyBvZiB0aGUgY2F0ZWdvcmllcy9hcnRpY2xlcyB0YWJsZS5cbiAqXG4gKiBAbW9kdWxlIENvbXBhdGliaWxpdHkvY2F0ZWdvcmllc190YWJsZV9jb250cm9sbGVyXG4gKi9cbmd4LmNvbXBhdGliaWxpdHkubW9kdWxlKFxuICAgIFwiY2F0ZWdvcmllc190YWJsZV9jb250cm9sbGVyXCIsXG5cbiAgICBbZ3guc291cmNlICsgXCIvbGlicy9idXR0b25fZHJvcGRvd25cIl0sXG5cbiAgICAvKiogIEBsZW5kcyBtb2R1bGU6Q29tcGF0aWJpbGl0eS9jYXRlZ29yaWVzX3RhYmxlX2NvbnRyb2xsZXIgKi9cblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVMgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXIgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdmFyIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRGVmYXVsdCBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZGVmYXVsdHMgPSB7fSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRmluYWwgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB2YXIge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSksXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBPYmplY3RcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gUFJJVkFURSBNRVRIT0RTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXQgVXJsIFBhcmFtZXRlclxuICAgICAgICAgKlxuICAgICAgICAgKiBHZXRzIGEgc3BlY2lmaWMgVVJMIGdldCBwYXJhbWV0ZXIgZnJvbSB0aGUgYWRkcmVzcyBiYXIsXG4gICAgICAgICAqIHdoaWNoIG5hbWUgc2hvdWxkIGJlIHByb3ZpZGVkIGFzIGFuIGFyZ3VtZW50LlxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1ldGVyTmFtZVxuICAgICAgICAgKiBAcmV0dXJucyB7b2JqZWN0fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9nZXRVcmxQYXJhbWV0ZXIgPSBmdW5jdGlvbiAocGFyYW1ldGVyTmFtZSkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdHMgPSBuZXcgUmVnRXhwKFwiWz8mXVwiICsgcGFyYW1ldGVyTmFtZSArIFwiPShbXiYjXSopXCIpLmV4ZWMod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuICAgICAgICAgICAgaWYgKHJlc3VsdHMgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0c1sxXSB8fCAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBQcm9kdWN0IElEXG4gICAgICAgICAqXG4gICAgICAgICAqIEhvbGRzIHRoZSBwcm9kdWN0IGlkIGZyb20gdGhlIGdldCBwYXJhbWV0ZXIuXG4gICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICB2YXIgJHByb2R1Y3RJZCA9IF9nZXRVcmxQYXJhbWV0ZXIoXCJwSURcIik7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhdGVnb3J5IElEXG4gICAgICAgICAqXG4gICAgICAgICAqIEhvbGRzIHRoZSBjYXRlZ29yeSBpZCBmcm9tIHRoZSBnZXQgcGFyYW1ldGVyLlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyICRjYXRlZ29yeUlkID0gX2dldFVybFBhcmFtZXRlcihcImNJRFwiKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGFibGUgUm93IG9mIFVwZGF0ZWQgUHJvZHVjdFxuICAgICAgICAgKlxuICAgICAgICAgKiBUYWJsZSByb3cgc2VsZWN0b3Igb2YgYSBwcm9kdWN0LCBkZXBlbmRpbmcgb24gdGhlIHBJRCBHRVQgcGFyYW1ldGVyLlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fGpRdWVyeXxIVE1MRWxlbWVudH1cbiAgICAgICAgICovXG4gICAgICAgIHZhciAkdGFibGVSb3dPZlVwZGF0ZWRQcm9kdWN0ID0gJChcInRyW2RhdGEtaWQ9XCIgKyAkcHJvZHVjdElkICsgXCJdXCIpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUYWJsZSBSb3cgb2YgVXBkYXRlZCBDYXRlZ29yeVxuICAgICAgICAgKlxuICAgICAgICAgKiBUYWJsZSByb3cgc2VsZWN0b3Igb2YgYSBjYXRlZ29yeSwgZGVwZW5kaW5nIG9uIHRoZSBjSUQgR0VUIHBhcmFtZXRlci5cbiAgICAgICAgICogQHR5cGUge29iamVjdHxqUXVlcnl8SFRNTEVsZW1lbnR9XG4gICAgICAgICAqL1xuICAgICAgICB2YXIgJHRhYmxlUm93T2ZVcGRhdGVkQ2F0ZWdvcnkgPSAkKFwidHJbZGF0YS1pZD1cIiArICRjYXRlZ29yeUlkICsgXCJdXCIpO1xuXG4gICAgICAgICR0YWJsZVJvd09mVXBkYXRlZFByb2R1Y3QuYWRkQ2xhc3MoXCJyZWNlbnRseVVwZGF0ZWRcIik7XG4gICAgICAgICR0YWJsZVJvd09mVXBkYXRlZENhdGVnb3J5LmFkZENsYXNzKFwicmVjZW50bHlVcGRhdGVkXCIpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEaXNhYmxlL0VuYWJsZSB0aGUgYnV0dG9ucyBvbiB0aGUgYm90dG9tIGJ1dHRvbi1kcm9wZG93blxuICAgICAgICAgKiBkZXBlbmRlbnQgb24gdGhlIGNoZWNrYm94ZXMgc2VsZWN0aW9uXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX3RvZ2dsZU11bHRpQWN0aW9uQnRuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyICRjaGVja2VkID0gJCgndHJbZGF0YS1pZF0gaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdOmNoZWNrZWQnKTtcbiAgICAgICAgICAgICQoXCIuanMtYm90dG9tLWRyb3Bkb3duIGJ1dHRvblwiKS5wcm9wKFwiZGlzYWJsZWRcIiwgISRjaGVja2VkLmxlbmd0aCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFByZXBhcmUgRm9ybVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gYWN0aW9uXG4gICAgICAgICAqIEByZXR1cm4ge29iamVjdCB8IGpRdWVyeX1cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfJHByZXBhcmVGb3JtID0gZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBCdWlsZCBkYXRhIG9iamVjdCBmb3IgcmVmZXJlbmNlXG4gICAgICAgICAgICAgKiBAdmFyIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAgICAgICAgIGNQYXRoOiBcIlwiLFxuICAgICAgICAgICAgICAgIHVybDogW19nZXRTb3VyY2VQYXRoKCksIFwiY2F0ZWdvcmllcy5waHBcIiwgXCI/YWN0aW9uPW11bHRpX2FjdGlvblwiXS5qb2luKFwiXCIpLFxuICAgICAgICAgICAgICAgIHBhZ2VUb2tlbjogJCgnaW5wdXRbbmFtZT1cInBhZ2VfdG9rZW5cIl06Zmlyc3QnKS5hdHRyKFwidmFsdWVcIiksXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEFkZCBjUGF0aFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGRhdGEuY1BhdGggPSB3aW5kb3cubG9jYXRpb24uaHJlZi5tYXRjaCgvY1BhdGg9KC4qKS8pWzFdO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGRhdGEuY1BhdGggPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgaWYgKGRhdGEuY1BhdGggIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBkYXRhLnVybCArPSBcIiZjUGF0aD1cIiArIGRhdGEuY1BhdGg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzZWFyY2ggPSBfZ2V0VXJsUGFyYW1ldGVyKFwic2VhcmNoXCIpO1xuICAgICAgICAgICAgaWYgKHNlYXJjaCAhPT0gMCAmJiBzZWFyY2ggIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBkYXRhLnVybCArPSBcIiZzZWFyY2g9XCIgKyBzZWFyY2g7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBwYWdlID0gX2dldFVybFBhcmFtZXRlcihcInBhZ2VcIik7XG4gICAgICAgICAgICBpZiAocGFnZSAhPT0gMCAmJiBwYWdlICE9PSBudWxsICYmIGRhdGEudXJsLmluZGV4T2YoXCJwYWdlPVwiKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICBkYXRhLnVybCArPSBcIiZwYWdlPVwiICsgcGFnZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHNvcnRpbmcgPSBfZ2V0VXJsUGFyYW1ldGVyKFwic29ydGluZ1wiKTtcbiAgICAgICAgICAgIGlmIChzb3J0aW5nICE9PSAwICYmIHNvcnRpbmcgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBkYXRhLnVybCArPSBcIiZzb3J0aW5nPVwiICsgc29ydGluZztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBCdWlsZCBjYWNoZWQgZm9ybSBhbmQgcmV0dXJuIGl0XG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0IHwgalF1ZXJ5fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB2YXIgJGZvcm0gPSAkKCc8Zm9ybSBuYW1lPVwibXVsdGlfYWN0aW9uX2Zvcm1cIiBtZXRob2Q9XCJwb3N0XCIgYWN0aW9uPScgKyBkYXRhLnVybCArIFwiPjwvZm9ybT5cIik7XG4gICAgICAgICAgICAkZm9ybS5hcHBlbmQoJzxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImNwYXRoXCIgdmFsdWU9JyArIGRhdGEuY1BhdGggKyBcIj5cIik7XG4gICAgICAgICAgICAkZm9ybS5hcHBlbmQoJzxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cInBhZ2VfdG9rZW5cIiB2YWx1ZT0nICsgZGF0YS5wYWdlVG9rZW4gKyBcIj5cIik7XG4gICAgICAgICAgICAkZm9ybS5hcHBlbmQoJzxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT0nICsgYWN0aW9uICsgJyB2YWx1ZT1cIkFjdGlvblwiPicpO1xuICAgICAgICAgICAgJGZvcm0uYXBwZW5kVG8oXCJib2R5XCIpO1xuICAgICAgICAgICAgcmV0dXJuICRmb3JtO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNYXAgYWN0aW9ucyBmb3IgZXZlcnkgcm93IGluIHRoZSB0YWJsZS5cbiAgICAgICAgICpcbiAgICAgICAgICogVGhpcyBtZXRob2Qgd2lsbCBtYXAgdGhlIGFjdGlvbnMgZm9yIGVhY2hcbiAgICAgICAgICogcm93IG9mIHRoZSB0YWJsZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfbWFwUm93QWN0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoXCIuZ3gtY2F0ZWdvcmllcy10YWJsZSB0clwiKVxuICAgICAgICAgICAgICAgIC5ub3QoXCIuZGF0YVRhYmxlSGVhZGluZ1Jvd1wiKVxuICAgICAgICAgICAgICAgIC5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFNhdmUgdGhhdCBcInRoaXNcIiBzY29wZSBoZXJlXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEB2YXIge29iamVjdCB8IGpRdWVyeX1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHZhciAkdGhhdCA9ICQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIERhdGEgYXR0cmlidXRlcyBvZiBjdXJyZW50IHJvd1xuICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgKiBAdmFyIHtvYmplY3R9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YSA9ICR0aGF0LmRhdGEoKTtcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogUmVmZXJlbmNlIHRvIHRoZSByb3cgYWN0aW9uIGRyb3Bkb3duXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqIEB2YXIge29iamVjdCB8IGpRdWVyeX1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHZhciAkZHJvcGRvd24gPSAkdGhhdC5maW5kKFwiLmpzLWJ1dHRvbi1kcm9wZG93blwiKTtcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogRml4IGNoZWNrYm94IGV2ZW50IGhhbmRsaW5nIGNvbmZsaWN0IGFuZCAoZGUtKWFjdGl2YXRlIHRoZSBib3R0b20gYnV0dG9uLWRyb3Bkb3duXG4gICAgICAgICAgICAgICAgICAgICAqIG9uIGNoZWNrYm94IGNoYW5nZXNcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICR0aGF0LmZpbmQoXCIuc2luZ2xlLWNoZWNrYm94XCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RvZ2dsZU11bHRpQWN0aW9uQnRuKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSwgNTAwKTtcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQ2FsbCBhY3Rpb24gYmluZGVyIG1ldGhvZFxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuaXNQcm9kdWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfbWFwUHJvZHVjdEFjdGlvbnMoJGRyb3Bkb3duLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9tYXBDYXRlZ29yeUFjdGlvbnMoJGRyb3Bkb3duLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIEJpbmQgaWNvbiBhY3Rpb25zXG4gICAgICAgICAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gT3BlbiBQcm9kdWN0IC8gQ2F0ZWdvcnlcbiAgICAgICAgICAgICAgICAgICAgJHRoYXRcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKFwiLmZhLWZvbGRlci1vcGVuLW8sIC5mYS1wZW5jaWxcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5wYXJlbnQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdXJsID0gJHRoYXQuZmluZChcInRkOmVxKDIpIGFbaHJlZl06Zmlyc3RcIikucHJvcChcImhyZWZcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93Lm9wZW4odXJsLCBcIl9zZWxmXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gRGVsZXRlIFByb2R1Y3QgLyBDYXRlZ29yeVxuICAgICAgICAgICAgICAgICAgICAkdGhhdFxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbmQoXCIuZmEtdHJhc2gtb1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnBhcmVudCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgJGRlbGV0ZUl0ZW0gPSAkZHJvcGRvd24uZmluZChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzcGFuOmNvbnRhaW5zKFwiICsganNlLmNvcmUubGFuZy50cmFuc2xhdGUoXCJkZWxldGVcIiwgXCJidXR0b25zXCIpICsgXCIpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRkZWxldGVJdGVtLmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogR2V0IHBhdGggb2YgdGhlIGFkbWluIGZvbGRlclxuICAgICAgICAgKiBPbmx5IHVzZWQgc3RhcnQgdG8gZ2V0IHRoZSBzb3VyY2UgcGF0aFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9nZXRTb3VyY2VQYXRoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHVybCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4sXG4gICAgICAgICAgICAgICAgcGF0aCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcblxuICAgICAgICAgICAgdmFyIHNwbGl0dGVkUGF0aCA9IHBhdGguc3BsaXQoXCIvXCIpO1xuICAgICAgICAgICAgc3BsaXR0ZWRQYXRoLnBvcCgpO1xuXG4gICAgICAgICAgICB2YXIgam9pbmVkUGF0aCA9IHNwbGl0dGVkUGF0aC5qb2luKFwiL1wiKTtcblxuICAgICAgICAgICAgcmV0dXJuIHVybCArIGpvaW5lZFBhdGggKyBcIi9cIjtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQmluZCBhbiBhY3Rpb24gb2YgYSBwcm9kdWN0IGJ1dHRvbiB0byB0aGUgZHJvcGRvd24uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBhY3Rpb25cbiAgICAgICAgICogQHBhcmFtICRkcm9wZG93blxuICAgICAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9tYXBQcm9kdWN0QWN0aW9uID0gZnVuY3Rpb24gKGFjdGlvbiwgJGRyb3Bkb3duLCBkYXRhKSB7XG4gICAgICAgICAgICB2YXIgc2VjdGlvbiA9IF9wcm9kdWN0U2VjdGlvbk5hbWVNYXBwaW5nW2FjdGlvbl0sXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgX3Byb2R1Y3RDb25maWd1cmF0aW9uS2V5Q2FsbGJhY2tzKGFjdGlvbiwgJChldmVudC50YXJnZXQpLCBkYXRhKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLm1hcEFjdGlvbigkZHJvcGRvd24sIGFjdGlvbiwgc2VjdGlvbiwgY2FsbGJhY2spO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBCaW5kIGFuIGFjdGlvbiBvZiBhIGNhdGVnb3J5IGJ1dHRvbiB0byB0aGUgZHJvcGRvd24uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBhY3Rpb25cbiAgICAgICAgICogQHBhcmFtICRkcm9wZG93blxuICAgICAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9tYXBDYXRlZ29yeUFjdGlvbiA9IGZ1bmN0aW9uIChhY3Rpb24sICRkcm9wZG93biwgZGF0YSkge1xuICAgICAgICAgICAgdmFyIHNlY3Rpb24gPSBfY2F0ZWdvcnlTZWN0aW9uTmFtZU1hcHBpbmdbYWN0aW9uXSxcbiAgICAgICAgICAgICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgICAgICBfY2F0ZWdvcnlDb25maWd1cmF0aW9uS2V5Q2FsbGJhY2tzKGFjdGlvbiwgJChldmVudC50YXJnZXQpLCBkYXRhKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLm1hcEFjdGlvbigkZHJvcGRvd24sIGFjdGlvbiwgc2VjdGlvbiwgY2FsbGJhY2spO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBfcHJvZHVjdFNlY3Rpb25OYW1lTWFwcGluZyA9IHtcbiAgICAgICAgICAgIGVkaXQ6IFwiYnV0dG9uc1wiLFxuICAgICAgICAgICAgZGVsZXRlOiBcImJ1dHRvbnNcIixcbiAgICAgICAgICAgIEJVVFRPTl9NT1ZFOiBcImFkbWluX2J1dHRvbnNcIixcbiAgICAgICAgICAgIEJVVFRPTl9DT1BZOiBcImFkbWluX2J1dHRvbnNcIixcbiAgICAgICAgICAgIEJVVFRPTl9QUk9QRVJUSUVTOiBcImFkbWluX2J1dHRvbnNcIixcbiAgICAgICAgICAgIEJVVFRPTl9FRElUX0NST1NTX1NFTExJTkc6IFwiY2F0ZWdvcmllc1wiLFxuICAgICAgICAgICAgR01fQlVUVE9OX0FERF9TUEVDSUFMOiBcImdtX2dlbmVyYWxcIixcbiAgICAgICAgICAgIEJVVFRPTl9QUk9EVUNUX09QVElPTlM6IFwiYWRtaW5fYnV0dG9uc1wiLFxuICAgICAgICAgICAgQlVUVE9OX1BST0RVQ1RfRE9XTkxPQURTOiBcImFkbWluX2J1dHRvbnNcIixcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgX2NhdGVnb3J5U2VjdGlvbk5hbWVNYXBwaW5nID0ge1xuICAgICAgICAgICAgZWRpdDogXCJidXR0b25zXCIsXG4gICAgICAgICAgICBkZWxldGU6IFwiYnV0dG9uc1wiLFxuICAgICAgICAgICAgQlVUVE9OX01PVkU6IFwiYWRtaW5fYnV0dG9uc1wiLFxuICAgICAgICAgICAgQlVUVE9OX0NPUFk6IFwiYWRtaW5fYnV0dG9uc1wiLFxuICAgICAgICAgICAgQlVUVE9OX0dPT0dMRV9DQVRFR09SSUVTOiBcImNhdGVnb3JpZXNcIixcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTWFwcGluZyBjYWxsYmFjayBmdW5jdGlvbnMgb2YgcHJvZHVjdCBhY3Rpb25zLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ga2V5XG4gICAgICAgICAqIEBwYXJhbSAkZHJvcGRvd25cbiAgICAgICAgICogQHBhcmFtIGRhdGFcbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfcHJvZHVjdENvbmZpZ3VyYXRpb25LZXlDYWxsYmFja3MgPSBmdW5jdGlvbiAoa2V5LCAkZHJvcGRvd24sIGRhdGEpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcImVkaXRcIjpcbiAgICAgICAgICAgICAgICAgICAgX3Byb2R1Y3RFZGl0Q2FsbGJhY2soZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJkZWxldGVcIjpcbiAgICAgICAgICAgICAgICAgICAgX3Byb2R1Y3REZWxldGVDYWxsYmFjaygkZHJvcGRvd24pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiQlVUVE9OX01PVkVcIjpcbiAgICAgICAgICAgICAgICAgICAgX3Byb2R1Y3RNb3ZlQ2FsbGJhY2soJGRyb3Bkb3duKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcIkJVVFRPTl9DT1BZXCI6XG4gICAgICAgICAgICAgICAgICAgIF9wcm9kdWN0Q29weUNhbGxiYWNrKCRkcm9wZG93bik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJCVVRUT05fUFJPUEVSVElFU1wiOlxuICAgICAgICAgICAgICAgICAgICBfcHJvZHVjdFByb3BlcnRpZXNDYWxsYmFjayhkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcIkJVVFRPTl9FRElUX0NST1NTX1NFTExJTkdcIjpcbiAgICAgICAgICAgICAgICAgICAgX3Byb2R1Y3RFZGl0Q3Jvc3NTZWxsaW5nQ2FsbGJhY2soZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJHTV9CVVRUT05fQUREX1NQRUNJQUxcIjpcbiAgICAgICAgICAgICAgICAgICAgX3Byb2R1Y3RBZGRTcGVjaWFsQ2FsbGJhY2soZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJCVVRUT05fUFJPRFVDVF9PUFRJT05TXCI6XG4gICAgICAgICAgICAgICAgICAgIF9wcm9kdWN0RWRpdFByb2R1Y3RPcHRpb25zQ2FsbGJhY2soZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJCVVRUT05fUFJPRFVDVF9ET1dOTE9BRFNcIjpcbiAgICAgICAgICAgICAgICAgICAgX3Byb2R1Y3RFZGl0UHJvZHVjdERvd25sb2Fkc0NhbGxiYWNrKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmFsZXJ0KFwiQ2FsbGJhY2sgbm90IGZvdW5kXCIpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEV4ZWN1dGUgZWRpdCBidXR0b24gY2FsbGJhY2suXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX3Byb2R1Y3RFZGl0Q2FsbGJhY2sgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgdmFyIHVybCA9IFtcbiAgICAgICAgICAgICAgICBfZ2V0U291cmNlUGF0aCgpLFxuICAgICAgICAgICAgICAgIFwiY2F0ZWdvcmllcy5waHBcIixcbiAgICAgICAgICAgICAgICBcIj9wSUQ9XCIgKyBkYXRhLmlkLFxuICAgICAgICAgICAgICAgIFwiJmNQYXRoPVwiICsgZGF0YS5jcGF0aCxcbiAgICAgICAgICAgICAgICBcIiZhY3Rpb249bmV3X3Byb2R1Y3RcIixcbiAgICAgICAgICAgICAgICBgJnBhZ2U9JHtkYXRhLnBhZ2V9YCxcbiAgICAgICAgICAgIF0uam9pbihcIlwiKTtcbiAgICAgICAgICAgIHdpbmRvdy5vcGVuKHVybCwgXCJfc2VsZlwiKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRXhlY3V0ZSBkZWxldGUgYnV0dG9uIGNhbGxiYWNrLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gJGRyb3Bkb3duXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX3Byb2R1Y3REZWxldGVDYWxsYmFjayA9IGZ1bmN0aW9uICgkZHJvcGRvd24pIHtcbiAgICAgICAgICAgIC8vIFVuY2hlY2sgYWxsIGNoZWNrYm94ZXNcbiAgICAgICAgICAgICQoXCIuZ3gtY2F0ZWdvcmllcy10YWJsZVwiKS5maW5kKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKS5wcm9wKFwiY2hlY2tlZFwiLCBmYWxzZSk7XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGN1cnJlbnQgY2hlY2tib3hcbiAgICAgICAgICAgICRkcm9wZG93bi5wYXJlbnRzKFwidHI6Zmlyc3RcIikuZmluZCgndGQ6Zmlyc3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJykucHJvcChcImNoZWNrZWRcIiwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIC8vIENyZWF0ZSBjYWNoZWQgZm9ybVxuICAgICAgICAgICAgdmFyICRmb3JtID0gXyRwcmVwYXJlRm9ybShcIm11bHRpX2RlbGV0ZVwiKTtcblxuICAgICAgICAgICAgLy8gQWRkIGNoZWNrYm94IHRvIGZvcm1cbiAgICAgICAgICAgICRkcm9wZG93bi5wYXJlbnRzKFwidHI6Zmlyc3RcIikuZmluZCgndGQ6Zmlyc3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJykuY2xvbmUoKS5hcHBlbmRUbygkZm9ybSk7XG5cbiAgICAgICAgICAgIC8vIFN1Ym1pdCBmb3JtXG4gICAgICAgICAgICAkZm9ybS5zdWJtaXQoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRXhlY3V0ZSBtb3ZlIGJ1dHRvbiBjYWxsYmFjay5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtICRkcm9wZG93blxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9wcm9kdWN0TW92ZUNhbGxiYWNrID0gZnVuY3Rpb24gKCRkcm9wZG93bikge1xuICAgICAgICAgICAgLy8gVW5jaGVjayBhbGwgY2hlY2tib3hlc1xuICAgICAgICAgICAgJChcIi5neC1jYXRlZ29yaWVzLXRhYmxlXCIpLmZpbmQoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXScpLnByb3AoXCJjaGVja2VkXCIsIGZhbHNlKTtcblxuICAgICAgICAgICAgLy8gQ2hlY2sgY3VycmVudCBjaGVja2JveFxuICAgICAgICAgICAgJGRyb3Bkb3duLnBhcmVudHMoXCJ0cjpmaXJzdFwiKS5maW5kKCd0ZDpmaXJzdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKS5wcm9wKFwiY2hlY2tlZFwiLCB0cnVlKTtcblxuICAgICAgICAgICAgLy8gQ3JlYXRlIGNhY2hlZCBmb3JtXG4gICAgICAgICAgICB2YXIgJGZvcm0gPSBfJHByZXBhcmVGb3JtKFwibXVsdGlfbW92ZVwiKTtcblxuICAgICAgICAgICAgLy8gQWRkIGNoZWNrYm94IHRvIGZvcm1cbiAgICAgICAgICAgICRkcm9wZG93bi5wYXJlbnRzKFwidHI6Zmlyc3RcIikuZmluZCgndGQ6Zmlyc3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJykuY2xvbmUoKS5hcHBlbmRUbygkZm9ybSk7XG5cbiAgICAgICAgICAgIC8vIFN1Ym1pdCBmb3JtXG4gICAgICAgICAgICAkZm9ybS5zdWJtaXQoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRXhlY3V0ZSBjb3B5IGJ1dHRvbiBjYWxsYmFjay5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtICRkcm9wZG93blxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9wcm9kdWN0Q29weUNhbGxiYWNrID0gZnVuY3Rpb24gKCRkcm9wZG93bikge1xuICAgICAgICAgICAgLy8gVW5jaGVjayBhbGwgY2hlY2tib3hlc1xuICAgICAgICAgICAgJChcIi5neC1jYXRlZ29yaWVzLXRhYmxlXCIpLmZpbmQoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXScpLnByb3AoXCJjaGVja2VkXCIsIGZhbHNlKTtcblxuICAgICAgICAgICAgLy8gQ2hlY2sgY3VycmVudCBjaGVja2JveFxuICAgICAgICAgICAgJGRyb3Bkb3duLnBhcmVudHMoXCJ0cjpmaXJzdFwiKS5maW5kKCd0ZDpmaXJzdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKS5wcm9wKFwiY2hlY2tlZFwiLCB0cnVlKTtcblxuICAgICAgICAgICAgLy8gQ3JlYXRlIGNhY2hlZCBmb3JtXG4gICAgICAgICAgICB2YXIgJGZvcm0gPSBfJHByZXBhcmVGb3JtKFwibXVsdGlfY29weVwiKTtcblxuICAgICAgICAgICAgLy8gQWRkIGNoZWNrYm94IHRvIGZvcm1cbiAgICAgICAgICAgICRkcm9wZG93bi5wYXJlbnRzKFwidHI6Zmlyc3RcIikuZmluZCgndGQ6Zmlyc3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJykuY2xvbmUoKS5hcHBlbmRUbygkZm9ybSk7XG5cbiAgICAgICAgICAgIC8vIFN1Ym1pdCBmb3JtXG4gICAgICAgICAgICAkZm9ybS5zdWJtaXQoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRXhlY3V0ZSBwcm9wZXJ0eSBidXR0b24gY2FsbGJhY2suXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX3Byb2R1Y3RQcm9wZXJ0aWVzQ2FsbGJhY2sgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgdmFyIHVybCA9IFtcbiAgICAgICAgICAgICAgICBfZ2V0U291cmNlUGF0aCgpLFxuICAgICAgICAgICAgICAgIFwicHJvcGVydGllc19jb21iaXMucGhwXCIsXG4gICAgICAgICAgICAgICAgXCI/cHJvZHVjdHNfaWQ9XCIgKyBkYXRhLmlkLFxuICAgICAgICAgICAgICAgIFwiJmNQYXRoPVwiICsgZGF0YS5jcGF0aCxcbiAgICAgICAgICAgICAgICBcIiZhY3Rpb249ZWRpdF9jYXRlZ29yeVwiLFxuICAgICAgICAgICAgXS5qb2luKFwiXCIpO1xuICAgICAgICAgICAgd2luZG93Lm9wZW4odXJsLCBcIl9zZWxmXCIpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFeGVjdXRlIGVkaXQgY3Jvc3Mgc2VsbGluZyBidXR0b24gY2FsbGJhY2suXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX3Byb2R1Y3RFZGl0Q3Jvc3NTZWxsaW5nQ2FsbGJhY2sgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgdmFyIHVybCA9IFtcbiAgICAgICAgICAgICAgICBfZ2V0U291cmNlUGF0aCgpLFxuICAgICAgICAgICAgICAgIFwiY2F0ZWdvcmllcy5waHBcIixcbiAgICAgICAgICAgICAgICBcIj9jdXJyZW50X3Byb2R1Y3RfaWQ9XCIgKyBkYXRhLmlkLFxuICAgICAgICAgICAgICAgIFwiJmNQYXRoPVwiICsgZGF0YS5jcGF0aCxcbiAgICAgICAgICAgICAgICBcIiZhY3Rpb249ZWRpdF9jcm9zc3NlbGxpbmdcIixcbiAgICAgICAgICAgIF0uam9pbihcIlwiKTtcbiAgICAgICAgICAgIHdpbmRvdy5vcGVuKHVybCwgXCJfc2VsZlwiKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRXhlY3V0ZSBhZGQgc3BlY2lhbCBidXR0b24gY2FsbGJhY2suXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX3Byb2R1Y3RBZGRTcGVjaWFsQ2FsbGJhY2sgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgdmFyIHVybCA9IFtcbiAgICAgICAgICAgICAgICBfZ2V0U291cmNlUGF0aCgpLFxuICAgICAgICAgICAgICAgIFwic3BlY2lhbHMucGhwXCIsXG4gICAgICAgICAgICAgICAgXCI/cElEPVwiICsgZGF0YS5pZCxcbiAgICAgICAgICAgICAgICBcIiZhY3Rpb249XCIgKyAoZGF0YS5zcGVjaWFsSWQgIT09IHVuZGVmaW5lZCA/IFwiZWRpdFwiIDogXCJuZXdcIiksXG4gICAgICAgICAgICAgICAgZGF0YS5zcGVjaWFsSWQgIT09IHVuZGVmaW5lZCA/IFwiJnNJRD1cIiArIGRhdGEuc3BlY2lhbElkIDogXCJcIixcbiAgICAgICAgICAgIF0uam9pbihcIlwiKTtcbiAgICAgICAgICAgIHdpbmRvdy5vcGVuKHVybCwgXCJfc2VsZlwiKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgX3Byb2R1Y3RFZGl0UHJvZHVjdE9wdGlvbnNDYWxsYmFjayA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICB2YXIgdXJsID0gW19nZXRTb3VyY2VQYXRoKCksIFwicHJvZHVjdHMvXCIsIGAke2RhdGEuaWR9L2AsIFwib3B0aW9uc1wiLCBgP2NQYXRoPSR7ZGF0YS5jcGF0aH1gXS5qb2luKFwiXCIpO1xuICAgICAgICAgICAgd2luZG93Lm9wZW4odXJsLCBcIl9zZWxmXCIpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBfcHJvZHVjdEVkaXRQcm9kdWN0RG93bmxvYWRzQ2FsbGJhY2sgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgdmFyIHVybCA9IFtfZ2V0U291cmNlUGF0aCgpLCBcInByb2R1Y3RzL1wiLCBgJHtkYXRhLmlkfS9gLCBcImRvd25sb2Fkc1wiLCBgP2NQYXRoPSR7ZGF0YS5jcGF0aH1gXS5qb2luKFwiXCIpO1xuICAgICAgICAgICAgd2luZG93Lm9wZW4odXJsLCBcIl9zZWxmXCIpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNYXBwaW5nIGNhbGxiYWNrIGZ1bmN0aW9ucyBvZiBjYXRlZ29yeSBhY3Rpb25zLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ga2V5XG4gICAgICAgICAqIEBwYXJhbSAkZHJvcGRvd25cbiAgICAgICAgICogQHBhcmFtIGRhdGFcbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfY2F0ZWdvcnlDb25maWd1cmF0aW9uS2V5Q2FsbGJhY2tzID0gZnVuY3Rpb24gKGtleSwgJGRyb3Bkb3duLCBkYXRhKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgICAgICAgICAgIGNhc2UgXCJlZGl0XCI6XG4gICAgICAgICAgICAgICAgICAgIF9jYXRlZ29yeUVkaXRDYWxsYmFjayhkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcImRlbGV0ZVwiOlxuICAgICAgICAgICAgICAgICAgICBfY2F0ZWdvcnlEZWxldGVDYWxsYmFjaygkZHJvcGRvd24pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiQlVUVE9OX01PVkVcIjpcbiAgICAgICAgICAgICAgICAgICAgX2NhdGVnb3J5TW92ZUNhbGxiYWNrKCRkcm9wZG93bik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJCVVRUT05fQ09QWVwiOlxuICAgICAgICAgICAgICAgICAgICBfY2F0ZWdvcnlDb3B5Q2FsbGJhY2soJGRyb3Bkb3duKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcIkJVVFRPTl9HT09HTEVfQ0FURUdPUklFU1wiOlxuICAgICAgICAgICAgICAgICAgICBfY2F0ZWdvcnlHb29nbGVDYXRlZ29yaWVzQ2FsbGJhY2soZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuYWxlcnQoXCJDYWxsYmFjayBub3QgZm91bmRcIik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICogRXhlY3V0ZSBlZGl0IGJ1dHRvbiBjYWxsYmFjay5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfY2F0ZWdvcnlFZGl0Q2FsbGJhY2sgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgdmFyIHVybCA9IFtcbiAgICAgICAgICAgICAgICBfZ2V0U291cmNlUGF0aCgpLFxuICAgICAgICAgICAgICAgIFwiY2F0ZWdvcmllcy5waHBcIixcbiAgICAgICAgICAgICAgICBcIj9jSUQ9XCIgKyBkYXRhLmlkLFxuICAgICAgICAgICAgICAgIFwiJmNQYXRoPVwiICsgZGF0YS5jcGF0aCxcbiAgICAgICAgICAgICAgICBcIiZhY3Rpb249ZWRpdF9jYXRlZ29yeVwiLFxuICAgICAgICAgICAgXS5qb2luKFwiXCIpO1xuICAgICAgICAgICAgd2luZG93Lm9wZW4odXJsLCBcIl9zZWxmXCIpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFeGVjdXRlIGRlbGV0ZSBidXR0b24gY2FsbGJhY2suXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSAkZHJvcGRvd25cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfY2F0ZWdvcnlEZWxldGVDYWxsYmFjayA9IGZ1bmN0aW9uICgkZHJvcGRvd24pIHtcbiAgICAgICAgICAgIC8vIFVuY2hlY2sgYWxsIGNoZWNrYm94ZXNcbiAgICAgICAgICAgICQoXCIuZ3gtY2F0ZWdvcmllcy10YWJsZVwiKS5maW5kKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKS5wcm9wKFwiY2hlY2tlZFwiLCBmYWxzZSk7XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGN1cnJlbnQgY2hlY2tib3hcbiAgICAgICAgICAgICRkcm9wZG93bi5wYXJlbnRzKFwidHI6Zmlyc3RcIikuZmluZCgndGQ6Zmlyc3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJykucHJvcChcImNoZWNrZWRcIiwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIC8vIENyZWF0ZSBjYWNoZWQgZm9ybVxuICAgICAgICAgICAgdmFyICRmb3JtID0gXyRwcmVwYXJlRm9ybShcIm11bHRpX2RlbGV0ZVwiKTtcblxuICAgICAgICAgICAgLy8gQWRkIGNoZWNrYm94IHRvIGZvcm1cbiAgICAgICAgICAgICRkcm9wZG93bi5wYXJlbnRzKFwidHI6Zmlyc3RcIikuZmluZCgndGQ6Zmlyc3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJykuY2xvbmUoKS5hcHBlbmRUbygkZm9ybSk7XG5cbiAgICAgICAgICAgIC8vIFN1Ym1pdCBmb3JtXG4gICAgICAgICAgICAkZm9ybS5zdWJtaXQoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRXhlY3V0ZSBtb3ZlIGJ1dHRvbiBjYWxsYmFjay5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtICRkcm9wZG93blxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9jYXRlZ29yeU1vdmVDYWxsYmFjayA9IGZ1bmN0aW9uICgkZHJvcGRvd24pIHtcbiAgICAgICAgICAgIC8vIFVuY2hlY2sgYWxsIGNoZWNrYm94ZXNcbiAgICAgICAgICAgICQoXCIuZ3gtY2F0ZWdvcmllcy10YWJsZVwiKS5maW5kKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKS5wcm9wKFwiY2hlY2tlZFwiLCBmYWxzZSk7XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGN1cnJlbnQgY2hlY2tib3hcbiAgICAgICAgICAgICRkcm9wZG93bi5wYXJlbnRzKFwidHI6Zmlyc3RcIikuZmluZCgndGQ6Zmlyc3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJykucHJvcChcImNoZWNrZWRcIiwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIC8vIENyZWF0ZSBjYWNoZWQgZm9ybVxuICAgICAgICAgICAgdmFyICRmb3JtID0gXyRwcmVwYXJlRm9ybShcIm11bHRpX21vdmVcIik7XG5cbiAgICAgICAgICAgIC8vIEFkZCBjaGVja2JveCB0byBmb3JtXG4gICAgICAgICAgICAkZHJvcGRvd24ucGFyZW50cyhcInRyOmZpcnN0XCIpLmZpbmQoJ3RkOmZpcnN0IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScpLmNsb25lKCkuYXBwZW5kVG8oJGZvcm0pO1xuXG4gICAgICAgICAgICAvLyBTdWJtaXQgZm9ybVxuICAgICAgICAgICAgJGZvcm0uc3VibWl0KCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEV4ZWN1dGUgY29weSBidXR0b24gY2FsbGJhY2suXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSAkZHJvcGRvd25cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfY2F0ZWdvcnlDb3B5Q2FsbGJhY2sgPSBmdW5jdGlvbiAoJGRyb3Bkb3duKSB7XG4gICAgICAgICAgICAvLyBVbmNoZWNrIGFsbCBjaGVja2JveGVzXG4gICAgICAgICAgICAkKFwiLmd4LWNhdGVnb3JpZXMtdGFibGVcIikuZmluZCgnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJykucHJvcChcImNoZWNrZWRcIiwgZmFsc2UpO1xuXG4gICAgICAgICAgICAvLyBDaGVjayBjdXJyZW50IGNoZWNrYm94XG4gICAgICAgICAgICAkZHJvcGRvd24ucGFyZW50cyhcInRyOmZpcnN0XCIpLmZpbmQoJ3RkOmZpcnN0IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScpLnByb3AoXCJjaGVja2VkXCIsIHRydWUpO1xuXG4gICAgICAgICAgICAvLyBDcmVhdGUgY2FjaGVkIGZvcm1cbiAgICAgICAgICAgIHZhciAkZm9ybSA9IF8kcHJlcGFyZUZvcm0oXCJtdWx0aV9jb3B5XCIpO1xuXG4gICAgICAgICAgICAvLyBBZGQgY2hlY2tib3ggdG8gZm9ybVxuICAgICAgICAgICAgJGRyb3Bkb3duLnBhcmVudHMoXCJ0cjpmaXJzdFwiKS5maW5kKCd0ZDpmaXJzdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKS5jbG9uZSgpLmFwcGVuZFRvKCRmb3JtKTtcblxuICAgICAgICAgICAgLy8gU3VibWl0IGZvcm1cbiAgICAgICAgICAgICRmb3JtLnN1Ym1pdCgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFeGVjdXRlIGdvb2dsZSBjYXRlZ29yaWVzIGNhbGxiYWNrIGJ1dHRvbi5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIGRhdGFcbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfY2F0ZWdvcnlHb29nbGVDYXRlZ29yaWVzQ2FsbGJhY2sgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgdmFyICRsaWdodGJveCA9ICQoXCIubGlnaHRib3hfZ29vZ2xlX2FkbWluX2NhdGVnb3JpZXNcIik7XG4gICAgICAgICAgICAkbGlnaHRib3guYXR0cihcImhyZWZcIiwgXCJnb29nbGVfYWRtaW5fY2F0ZWdvcmllcy5odG1sP2NhdGVnb3JpZXNfaWQ9XCIgKyBkYXRhLmlkKTtcbiAgICAgICAgICAgICRsaWdodGJveC5jbGljaygpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNYXAgYWN0aW9ucyBmb3IgdGhlIGFydGljbGUgZHJvcGRvd25cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHBhcmFtcyB7b2JqZWN0fVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9tYXBQcm9kdWN0QWN0aW9ucyA9IGZ1bmN0aW9uICgkZHJvcGRvd24sIGRhdGEpIHtcbiAgICAgICAgICAgIF9tYXBQcm9kdWN0QWN0aW9uKFwiZWRpdFwiLCAkZHJvcGRvd24sIGRhdGEpO1xuICAgICAgICAgICAgX21hcFByb2R1Y3RBY3Rpb24oXCJkZWxldGVcIiwgJGRyb3Bkb3duLCBkYXRhKTsgLy9CaW5kOiBEZWxldGUgKFNpbmdsZSBSb3cpXG4gICAgICAgICAgICBfbWFwUHJvZHVjdEFjdGlvbihcIkJVVFRPTl9NT1ZFXCIsICRkcm9wZG93biwgZGF0YSk7IC8vIEJpbmQ6IE1vdmVcbiAgICAgICAgICAgIF9tYXBQcm9kdWN0QWN0aW9uKFwiQlVUVE9OX0NPUFlcIiwgJGRyb3Bkb3duLCBkYXRhKTsgLy8gQmluZDogQ29weVxuICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLmFkZFNlcGFyYXRvcigkZHJvcGRvd24sIHRydWUpOyAvLyBhZGQgYSBzZXBhcmF0b3IgdG8gZHJvcGRvd25cbiAgICAgICAgICAgIF9tYXBQcm9kdWN0QWN0aW9uKFwiQlVUVE9OX1BST0RVQ1RfT1BUSU9OU1wiLCAkZHJvcGRvd24sIGRhdGEpOyAvLyBCaW5kOiBQcm9kdWN0IE9wdGlvbnNcbiAgICAgICAgICAgIF9tYXBQcm9kdWN0QWN0aW9uKFwiQlVUVE9OX1BST1BFUlRJRVNcIiwgJGRyb3Bkb3duLCBkYXRhKTsgLy8gQmluZDogUHJvcGVydGllc1xuICAgICAgICAgICAgX21hcFByb2R1Y3RBY3Rpb24oXCJCVVRUT05fUFJPRFVDVF9ET1dOTE9BRFNcIiwgJGRyb3Bkb3duLCBkYXRhKTsgLy8gQmluZDogUHJvZHVjdCBEb3dubG9hZHNcbiAgICAgICAgICAgIF9tYXBQcm9kdWN0QWN0aW9uKFwiR01fQlVUVE9OX0FERF9TUEVDSUFMXCIsICRkcm9wZG93biwgZGF0YSk7IC8vIEJpbmQ6IE5ldyBPZmZlclxuICAgICAgICAgICAgX21hcFByb2R1Y3RBY3Rpb24oXCJCVVRUT05fRURJVF9DUk9TU19TRUxMSU5HXCIsICRkcm9wZG93biwgZGF0YSk7IC8vIEJpbmQ6IENyb3NzIFNlbGxpbmdcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTWFwIGFjdGlvbnMgZm9yIHRoZSBjYXRlZ29yeSBkcm9wZG93blxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX21hcENhdGVnb3J5QWN0aW9ucyA9IGZ1bmN0aW9uICgkZHJvcGRvd24sIGRhdGEpIHtcbiAgICAgICAgICAgIF9tYXBDYXRlZ29yeUFjdGlvbihcImVkaXRcIiwgJGRyb3Bkb3duLCBkYXRhKTtcbiAgICAgICAgICAgIF9tYXBDYXRlZ29yeUFjdGlvbihcImRlbGV0ZVwiLCAkZHJvcGRvd24sIGRhdGEpOyAvLyBCaW5kOiBEZWxldGVcbiAgICAgICAgICAgIF9tYXBDYXRlZ29yeUFjdGlvbihcIkJVVFRPTl9NT1ZFXCIsICRkcm9wZG93biwgZGF0YSk7IC8vIEJpbmQ6IE1vdmVcbiAgICAgICAgICAgIF9tYXBDYXRlZ29yeUFjdGlvbihcIkJVVFRPTl9DT1BZXCIsICRkcm9wZG93biwgZGF0YSk7IC8vIEJpbmQ6IENvcHlcbiAgICAgICAgICAgIGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5hZGRTZXBhcmF0b3IoJGRyb3Bkb3duLCB0cnVlKTsgLy8gYWRkIGEgc2VwYXJhdG9yIHRvIGRyb3Bkb3duXG4gICAgICAgICAgICBfbWFwQ2F0ZWdvcnlBY3Rpb24oXCJCVVRUT05fR09PR0xFX0NBVEVHT1JJRVNcIiwgJGRyb3Bkb3duLCBkYXRhKTsgLy8gQmluZDogR29vZ2xlIGNhdGVnb3JpZXNcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgX3NlbGVjdEFsbENoZWNrYm94ZXMgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGlmICgkKGV2ZW50LnRhcmdldCkucHJvcChcImNoZWNrZWRcIikgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAkKFwiaW5wdXQuY2hlY2tib3hcIikucGFyZW50KCkuYWRkQ2xhc3MoXCJjaGVja2VkXCIpO1xuICAgICAgICAgICAgICAgICQoXCJpbnB1dC5jaGVja2JveFwiKS5wcm9wKFwiY2hlY2tlZFwiLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJChcImlucHV0LmNoZWNrYm94XCIpLnBhcmVudCgpLnJlbW92ZUNsYXNzKFwiY2hlY2tlZFwiKTtcbiAgICAgICAgICAgICAgICAkKFwiaW5wdXQuY2hlY2tib3hcIikucHJvcChcImNoZWNrZWRcIiwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX3RvZ2dsZU11bHRpQWN0aW9uQnRuKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIF9vbk1vdXNlRW50ZXJTdG9ja1dhcm4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKHRoaXMpLmRhdGEoXCJzaG9ydFN0b2NrU3RyaW5nXCIsICQodGhpcykudGV4dCgpKTsgLy8gYmFja3VwIGN1cnJlbnQgc3RyaW5nXG4gICAgICAgICAgICAkKHRoaXMpLnRleHQoJCh0aGlzKS5kYXRhKFwiY29tcGxldGVTdG9ja1N0cmluZ1wiKSk7IC8vIGRpc3BsYXkgY29tcGxldGUgc3RyaW5nXG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIF9vbk1vdXNlTGVhdmVTdG9ja1dhcm4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKHRoaXMpLnRleHQoJCh0aGlzKS5kYXRhKFwic2hvcnRTdG9ja1N0cmluZ1wiKSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICAvLyBXYWl0IHVudGlsIHRoZSBidXR0b25zIGFyZSBjb252ZXJ0ZWQgdG8gZHJvcGRvd24gZm9yIGV2ZXJ5IHJvdy5cbiAgICAgICAgICAgIHZhciBpbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoJChcIi5qcy1idXR0b24tZHJvcGRvd25cIikubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICAgICAgICAgICAgICAgICAgX21hcFJvd0FjdGlvbnMoKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBJbml0IGNoZWNrYm94IGNoZWNrZWRcbiAgICAgICAgICAgICAgICAgICAgX3RvZ2dsZU11bHRpQWN0aW9uQnRuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMjAwKTtcblxuICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIHNlbGVjdGVkIGNoZWNrYm94ZXMgYWxzb1xuICAgICAgICAgICAgLy8gYmVmb3JlIGFsbCByb3dzIGFuZCB0aGVpciBkcm9wZG93biB3aWRnZXRzIGhhdmUgYmVlbiBpbml0aWFsaXplZC5cbiAgICAgICAgICAgIF90b2dnbGVNdWx0aUFjdGlvbkJ0bigpO1xuXG4gICAgICAgICAgICAkKFwiI2dtX2NoZWNrXCIpLm9uKFwiY2xpY2tcIiwgX3NlbGVjdEFsbENoZWNrYm94ZXMpO1xuICAgICAgICAgICAgJHRoaXNcbiAgICAgICAgICAgICAgICAub24oXCJtb3VzZWVudGVyXCIsIFwiLnN0b2NrX3dhcm5cIiwgX29uTW91c2VFbnRlclN0b2NrV2FybilcbiAgICAgICAgICAgICAgICAub24oXCJtb3VzZWxlYXZlXCIsIFwiLnN0b2NrX3dhcm5cIiwgX29uTW91c2VMZWF2ZVN0b2NrV2Fybik7XG5cbiAgICAgICAgICAgIC8vIEZpbmlzaCBpdFxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfVxuKTtcbiJdfQ==
