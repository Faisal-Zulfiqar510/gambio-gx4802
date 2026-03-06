'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* --------------------------------------------------------------
 overview_settings_modal_controller.js 2021-06-17
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

jse.libs.overview_settings_modal_controller = jse.libs.overview_settings_modal_controller || {};

/**
 * Overview settings modal controller class.
 *
 * @module Admin/Libs/overview_settings_modal
 * @exports jse.libs.overview_settings_modal
 */
(function (exports) {
    /**
     * Class representing a controller for the orders overview settings modal.
     */
    var OverviewSettingsModalController = function () {
        /**
         * Creates an instance of OrdersOverviewSettingsModalController.
         *
         * @param {jQuery}    $element              Module element.
         * @param {Object}    userCfgService        User configuration service library.
         * @param {Object}    loadingSpinner        Loading spinner library.
         * @param {Number}    userId                ID of currently signed in user.
         * @param {String}    defaultColumnSettings Default column settings.
         * @param {Object}    translator            Translator library.
         * @param {String}    page                  Page name (e.g.: 'orders', 'invoices').
         */
        function OverviewSettingsModalController($element, userCfgService, loadingSpinner, userId, defaultColumnSettings, translator, page) {
            _classCallCheck(this, OverviewSettingsModalController);

            // Elements
            this.$element = $element;
            this.$submitButton = $element.find('button.submit-button');
            this.$settings = $element.find('ul.settings');
            this.$modal = $element.parents('.modal');
            this.$modalFooter = $element.find('.modal-footer');
            this.$resetDefaultLink = $element.find('a.reset-action');

            // Loading spinner
            this.$spinner = null;

            // Selector strings
            this.sortableHandleSelector = 'span.sort-handle';
            this.rowHeightValueSelector = 'select#setting-value-row-height';
            this.displayTooltipValueSelector = 'input#setting-value-display-tooltips';

            // Class names
            this.errorMessageClassName = 'error-message';
            this.loadingClassName = 'loading';

            // Libraries
            this.userCfgService = userCfgService;
            this.loadingSpinner = loadingSpinner;
            this.translator = translator;

            // Prefixes
            this.settingListItemIdPrefix = 'setting-';
            this.settingValueIdPrefix = 'setting-value-';

            // User configuration keys
            this.CONFIG_KEY_COLUMN_SETTINGS = page + 'OverviewSettingsColumns';
            this.CONFIG_KEY_ROW_HEIGHT_SETTINGS = page + 'OverviewSettingsRowHeight';
            this.CONFIG_KEY_DISPLAY_TOOLTIPS_SETTINGS = page + 'OverviewSettingsDisplayTooltips';

            // Default values
            this.DEFAULT_ROW_HEIGHT_SETTING = 'large';
            this.DEFAULT_COLUMN_SETTINGS = defaultColumnSettings.split(',');
            this.DEFAULT_DISPLAY_TOOLTIPS_SETTINGS = 'true';

            // ID of currently signed in user.
            this.userId = userId;
        }

        /**
         * Binds the event handlers.
         *
         * @return {OverviewSettingsModalController} Same instance for method chaining.
         */


        _createClass(OverviewSettingsModalController, [{
            key: 'initialize',
            value: function initialize() {
                var _this = this;

                // Attach event handler for click action on the submit button.
                this.$submitButton.on('click', function (event) {
                    return _this._onSubmitButtonClick(event);
                });

                // Attach event handler for click action on the reset-default link.
                this.$resetDefaultLink.on('click', function (event) {
                    return _this._onResetSettingsLinkClick(event);
                });

                // Attach event handlers to modal.
                this.$modal.on('show.bs.modal', function (event) {
                    return _this._onModalShow(event);
                }).on('shown.bs.modal', function (event) {
                    return _this._onModalShown(event);
                });

                return this;
            }

            /**
             * Fades out the modal content.
             *
             * @return {OverviewSettingsModalController} Same instance for method chaining.
             *
             * @private
             */

        }, {
            key: '_onModalShow',
            value: function _onModalShow() {
                this.$element.addClass(this.loadingClassName);

                return this;
            }

            /**
             * Updates the settings, clears any error messages and initializes the sortable plugin.
             *
             * @return {OverviewSettingsModalController} Same instance for method chaining.
             *
             * @private
             */

        }, {
            key: '_onModalShown',
            value: function _onModalShown() {
                this._refreshSettings()._clearErrorMessage()._initSortable();

                return this;
            }

            /**
             * Activates the jQuery UI Sortable plugin on the setting list items element.
             *
             * @return {OverviewSettingsModalController} Same instance for method chaining.
             *
             * @private
             */

        }, {
            key: '_initSortable',
            value: function _initSortable() {
                // jQuery UI Sortable plugin options.
                var options = {
                    items: '> li',
                    axis: 'y',
                    cursor: 'move',
                    handle: this.sortableHandleSelector,
                    containment: 'parent'
                };

                // Activate sortable plugin.
                this.$settings.sortable(options).disableSelection();

                return this;
            }

            /**
             * Returns a sorted array containing the IDs of all activated settings.
             *
             * @return {Array}
             *
             * @private
             */

        }, {
            key: '_serializeColumnSettings',
            value: function _serializeColumnSettings() {
                var _this2 = this;

                // Map iterator function to remove the 'setting-' prefix from list item ID.
                var removePrefixIterator = function removePrefixIterator(item) {
                    return item.replace(_this2.settingListItemIdPrefix, '');
                };

                // Filter iterator function, to accept only list items with activated checkboxes.
                var filterIterator = function filterIterator(item) {
                    return _this2.$settings.find('#' + _this2.settingValueIdPrefix + item).is(':checked');
                };

                // Return array with sorted, only active columns.
                return this.$settings.sortable('toArray').map(removePrefixIterator).filter(filterIterator);
            }

            /**
             * Returns the value of the selected row height option.
             *
             * @return {String}
             *
             * @private
             */

        }, {
            key: '_serializeRowHeightSetting',
            value: function _serializeRowHeightSetting() {
                return this.$element.find(this.rowHeightValueSelector).val();
            }

            /**
             * Returns the value of the selected tooltip display option.
             *
             * @return {String}
             *
             * @private
             */

        }, {
            key: '_serializeDisplayTooltipSetting',
            value: function _serializeDisplayTooltipSetting() {
                return this.$element.find(this.displayTooltipValueSelector).prop('checked');
            }

            /**
             * Shows the loading spinner, saves the settings to the user configuration,
             * closes the modal to finally re-render the datatable.
             *
             * @return {OverviewSettingsModalController} Same instance for method chaining.
             *
             * @private
             */

        }, {
            key: '_onSubmitButtonClick',
            value: function _onSubmitButtonClick() {
                var _this3 = this;

                // Retrieve setting values.
                var columnSettings = this._serializeColumnSettings();
                var rowHeightSetting = this._serializeRowHeightSetting();
                var displayTooltipSetting = this._serializeDisplayTooltipSetting();

                // Remove any error message and save settings.
                this._toggleLoadingSpinner(true)._clearErrorMessage()._saveColumnSettings(columnSettings).then(function () {
                    return _this3._saveDisplayTooltipSetting(displayTooltipSetting);
                }).then(function () {
                    return _this3._saveRowHeightSetting(rowHeightSetting);
                }).then(function () {
                    return _this3._onSaveSuccess();
                }).catch(function () {
                    return _this3._onSaveError();
                });

                return this;
            }

            /**
             * Prevents the browser to apply the default behavoir and
             * resets the column order and row size to the default setting values.
             *
             * @param {jQuery.Event} event Fired event.
             *
             * @return {OverviewSettingsModalController} Same instance for method chaining.
             *
             * @private
             */

        }, {
            key: '_onResetSettingsLinkClick',
            value: function _onResetSettingsLinkClick(event) {
                // Prevent default behavior.
                event.preventDefault();
                event.stopPropagation();

                // Reset to default settings.
                this._setDefaultSettings();

                return this;
            }

            /**
             * Shows and hides the loading spinner.
             *
             * @param {Boolean} doShow Show the loading spinner?
             *
             * @return {OverviewSettingsModalController} Same instance for method chaining.
             */

        }, {
            key: '_toggleLoadingSpinner',
            value: function _toggleLoadingSpinner(doShow) {
                if (doShow) {
                    // Fade out modal content.
                    this.$element.addClass(this.loadingClassName);

                    // Show loading spinner.
                    this.$spinner = this.loadingSpinner.show(this.$element);

                    // Fix spinner z-index.
                    this.$spinner.css({ 'z-index': 9999 });
                } else {
                    // Fade out modal content.
                    this.$element.removeClass(this.loadingClassName);

                    // Hide the loading spinner.
                    this.loadingSpinner.hide(this.$spinner);
                }

                return this;
            }

            /**
             * Handles the behavior on successful setting save action.
             *
             * @return {OverviewSettingsModalController} Same instance for method chaining.
             *
             * @private
             */

        }, {
            key: '_onSaveSuccess',
            value: function _onSaveSuccess() {
                window.location.reload();
                return this;
            }

            /**
             * Removes any error message, if found.
             *
             * @return {OverviewSettingsModalController} Same instance for method chaining.
             *
             * @private
             */

        }, {
            key: '_clearErrorMessage',
            value: function _clearErrorMessage() {
                // Error message.
                var $errorMessage = this.$modalFooter.find('.' + this.errorMessageClassName);

                // Remove if it exists.
                if ($errorMessage.length) {
                    $errorMessage.remove();
                }

                return this;
            }

            /**
             * Handles the behavior on thrown error while saving settings.
             *
             * @return {OverviewSettingsModalController} Same instance for method chaining.
             *
             * @private
             */

        }, {
            key: '_onSaveError',
            value: function _onSaveError() {
                // Error message.
                var errorMessage = this.translator.translate('TXT_SAVE_ERROR', 'admin_general');

                // Define error message element.
                var $error = $('<span/>', { class: this.errorMessageClassName, text: errorMessage });

                // Hide the loading spinner.
                this._toggleLoadingSpinner(false);

                // Add error message to modal footer.
                this.$modalFooter.prepend($error).hide().fadeIn();

                return this;
            }

            /**
             * Returns the configuration value for the column settings.
             *
             * @return {Promise}
             *
             * @private
             */

        }, {
            key: '_getColumnSettings',
            value: function _getColumnSettings() {
                // Configuration data.
                var data = {
                    userId: this.userId,
                    configurationKey: this.CONFIG_KEY_COLUMN_SETTINGS
                };

                // Request data from user configuration service.
                return this._getFromUserCfgService(data);
            }

            /**
             * Returns the configuration value for the row heights.
             *
             * @return {Promise}
             *
             * @private
             */

        }, {
            key: '_getRowHeightSetting',
            value: function _getRowHeightSetting() {
                // Configuration data.
                var data = {
                    userId: this.userId,
                    configurationKey: this.CONFIG_KEY_ROW_HEIGHT_SETTINGS
                };

                // Request data from user configuration service.
                return this._getFromUserCfgService(data);
            }

            /**
             * Returns the configuration value for the tooltip display option.
             *
             * @return {Promise}
             *
             * @private
             */

        }, {
            key: '_getDisplayTooltipSetting',
            value: function _getDisplayTooltipSetting() {
                // Configuration data.
                var data = {
                    userId: this.userId,
                    configurationKey: this.CONFIG_KEY_DISPLAY_TOOLTIPS_SETTINGS
                };

                // Request data from user configuration service.
                return this._getFromUserCfgService(data);
            }

            /**
             * Returns the value for the passed user configuration data.
             *
             * @param {Object} data                   User configuration data.
             * @param {Number} data.userId            User ID.
             * @param {String} data.configurationKey  User configuration key.
             *
             * @return {Promise}
             *
             * @private
             */

        }, {
            key: '_getFromUserCfgService',
            value: function _getFromUserCfgService(data) {
                var _this4 = this;

                // Promise handler.
                var handler = function handler(resolve, reject) {
                    // User configuration service request options.
                    var options = {
                        onError: function onError() {
                            return reject();
                        },
                        onSuccess: function onSuccess(response) {
                            return resolve(response.configurationValue);
                        },
                        data: data
                    };

                    // Get configuration value.
                    _this4.userCfgService.get(options);
                };

                return new Promise(handler);
            }

            /**
             * Saves the data via the user configuration service.
             *
             * @param {Object} data                     User configuration data.
             * @param {Number} data.userId              User ID.
             * @param {String} data.configurationKey    User configuration key.
             * @param {String} data.configurationValue  User configuration value.
             *
             * @return {Promise}
             *
             * @private
             */

        }, {
            key: '_setWithUserCfgService',
            value: function _setWithUserCfgService(data) {
                var _this5 = this;

                // Promise handler.
                var handler = function handler(resolve, reject) {
                    // User configuration service request options.
                    var options = {
                        onError: function onError() {
                            return reject();
                        },
                        onSuccess: function onSuccess(response) {
                            return resolve();
                        },
                        data: data
                    };

                    // Set configuration value.
                    _this5.userCfgService.set(options);
                };

                return new Promise(handler);
            }

            /**
             * Saves the column settings via the user configuration service.
             *
             * @param {String[]} columnSettings Sorted array with active column.
             *
             * @return {Promise}
             *
             * @private
             */

        }, {
            key: '_saveColumnSettings',
            value: function _saveColumnSettings(columnSettings) {
                // Check argument.
                if (!columnSettings || !Array.isArray(columnSettings)) {
                    throw new Error('Missing or invalid column settings');
                }

                // User configuration request data.
                var data = {
                    userId: this.userId,
                    configurationKey: this.CONFIG_KEY_COLUMN_SETTINGS,
                    configurationValue: JSON.stringify(columnSettings)
                };

                // Save via user configuration service.
                return this._setWithUserCfgService(data);
            }

            /**
             * Saves the row height setting via the user configuration service.
             *
             * @param {String} rowHeightSetting Value of the selected row height setting.
             *
             * @return {Promise}
             *
             * @private
             */

        }, {
            key: '_saveRowHeightSetting',
            value: function _saveRowHeightSetting(rowHeightSetting) {
                // Check argument.
                if (!rowHeightSetting || typeof rowHeightSetting !== 'string') {
                    throw new Error('Missing or invalid row height setting');
                }

                // User configuration request data.
                var data = {
                    userId: this.userId,
                    configurationKey: this.CONFIG_KEY_ROW_HEIGHT_SETTINGS,
                    configurationValue: rowHeightSetting
                };

                // Save via user configuration service.
                return this._setWithUserCfgService(data);
            }

            /**
             * Saves the display tooltip setting via the user configuration service.
             *
             * @param {String} displayTooltipSetting Value.
             *
             * @return {Promise}
             *
             * @private
             */

        }, {
            key: '_saveDisplayTooltipSetting',
            value: function _saveDisplayTooltipSetting(displayTooltipSetting) {
                // User configuration request data.
                var data = {
                    userId: this.userId,
                    configurationKey: this.CONFIG_KEY_DISPLAY_TOOLTIPS_SETTINGS,
                    configurationValue: displayTooltipSetting
                };

                // Save via user configuration service.
                if (typeof displayTooltipSetting !== 'undefined') {
                    return this._setWithUserCfgService(data);
                }
            }

            /**
             * Retrieves the saved setting configuration and reorders/updates the settings.
             *
             * @return {OverviewSettingsModalController} Same instance for method chaining.
             *
             * @private
             */

        }, {
            key: '_refreshSettings',
            value: function _refreshSettings() {
                var _this6 = this;

                // Show loading spinner.
                this._toggleLoadingSpinner(true);

                // Error handler function to specify the behavior on errors while processing.
                var onRefreshSettingsError = function onRefreshSettingsError(error) {
                    // Output warning.
                    console.warn('Error while refreshing', error);

                    // Hide the loading spinner.
                    _this6._toggleLoadingSpinner(false);
                };

                // Remove any error message, set row height,
                // reorder and update the settings and hide the loading spinner.
                this._clearErrorMessage()._getRowHeightSetting().then(function (rowHeightValue) {
                    return _this6._setRowHeight(rowHeightValue);
                }).then(function () {
                    return _this6._getDisplayTooltipSetting();
                }).then(function (displayTooltipSetting) {
                    return _this6._setDisplayTooltipSetting(displayTooltipSetting);
                }).then(function () {
                    return _this6._getColumnSettings();
                }).then(function (columnSettings) {
                    return _this6._setColumnSettings(columnSettings);
                }).then(function () {
                    return _this6._toggleLoadingSpinner(false);
                }).catch(onRefreshSettingsError);

                return this;
            }

            /**
             * Sets the row height setting value.
             *
             * @param {String} value Row height value.
             *
             * @return {OverviewSettingsModalController} Same instance for method chaining.
             *
             * @private
             */

        }, {
            key: '_setRowHeight',
            value: function _setRowHeight() {
                var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.DEFAULT_ROW_HEIGHT_SETTING;

                this.$element.find(this.rowHeightValueSelector).val(value);

                return this;
            }

            /**
             * Sets the display tooltips setting value.
             *
             * @param {String} value Display tooltips value.
             *
             * @return {OverviewSettingsModalController} Same instance for method chaining.
             *
             * @private
             */

        }, {
            key: '_setDisplayTooltipSetting',
            value: function _setDisplayTooltipSetting() {
                var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.DEFAULT_DISPLAY_TOOLTIPS_SETTINGS;

                this.$element.find(this.displayTooltipValueSelector).prop('checked', value === 'true').trigger('change');

                return this;
            }

            /**
             * Reorders and updates the column setting values.
             *
             * @param {String|Array} columnSettings Stringified JSON array containing the saved column settings.
             *
             * @return {OverviewSettingsModalController} Same instance for method chaining.
             *
             * @private
             */

        }, {
            key: '_setColumnSettings',
            value: function _setColumnSettings() {
                var _this7 = this;

                var columnSettings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.DEFAULT_COLUMN_SETTINGS;

                // Regex for escape character.
                var ESCAPE_CHAR = /\\/g;

                // No need to parse from JSON on default value as it is an array.
                if (!Array.isArray(columnSettings)) {
                    // Remove escape characters from and parse array from JSON.
                    columnSettings = columnSettings.replace(ESCAPE_CHAR, '');
                    columnSettings = JSON.parse(columnSettings);
                }

                // Cache container to temporarily hold all active list items in sorted order.
                // The children of this element will be prepended to the setting list item container to retain the
                // sorting order.
                var $sortedItems = $('<div/>');

                // Iterator function to prepend active list items to the top and activate the checkbox.
                var settingIterator = function settingIterator(setting) {
                    // List item ID.
                    var id = _this7.settingListItemIdPrefix + setting;

                    // Affected setting list item.
                    var $listItem = _this7.$settings.find('#' + id);

                    // Checkbox of affected list item.
                    var $checkbox = $listItem.find('#' + _this7.settingValueIdPrefix + setting);

                    // Activate checkbox.
                    if (!$checkbox.is(':checked')) {
                        $checkbox.parent().trigger('click');
                    }

                    // Move to cache container.
                    $listItem.appendTo($sortedItems);
                };

                // Move active list items to the top bearing the sorting order in mind.
                columnSettings.forEach(settingIterator);

                // Prepend cached elements to item list.
                $sortedItems.children().prependTo(this.$settings);

                return this;
            }

            /**
             * Resets the column order and row height settings to the default.
             *
             * @return {OverviewSettingsModalController} Same instance for method chaining.
             *
             * @private
             */

        }, {
            key: '_setDefaultSettings',
            value: function _setDefaultSettings() {
                var _this8 = this;

                // Default values.
                var columnSettings = this.DEFAULT_COLUMN_SETTINGS;
                var rowHeight = this.DEFAULT_ROW_HEIGHT_SETTING;

                // Set column settings.
                // Cache container to temporarily hold all active list items in sorted order.
                // The children of this element will be prepended to the setting list item container to retain the
                // sorting order.
                var $sortedItems = $('<div/>');

                // Iterator function to prepend active list items to the top and activate the checkbox.
                var settingIterator = function settingIterator(setting) {
                    // List item ID.
                    var id = _this8.settingListItemIdPrefix + setting;

                    // Affected setting list item.
                    var $listItem = _this8.$settings.find('#' + id);

                    // Checkbox of affected list item.
                    var $checkbox = $listItem.find('#' + _this8.settingValueIdPrefix + setting);

                    // Activate checkbox.
                    if (!$checkbox.is(':checked')) {
                        $checkbox.parent().trigger('click');
                    }

                    // Move to cache container.
                    $listItem.appendTo($sortedItems);
                };

                // Deactivate all checkboxes.
                this.$settings.find(':checkbox').each(function (index, element) {
                    var $checkbox = $(element);

                    if ($checkbox.is(':checked')) {
                        $checkbox.parent().trigger('click');
                    }
                });

                // Move active list items to the top bearing the sorting order in mind.
                columnSettings.forEach(settingIterator);

                // Prepend cached elements to item list.
                $sortedItems.children().prependTo(this.$settings);

                // Set row height.
                this.$element.find(this.rowHeightValueSelector).val(rowHeight);

                return this;
            }
        }]);

        return OverviewSettingsModalController;
    }();

    exports.class = OverviewSettingsModalController;
})(jse.libs.overview_settings_modal_controller);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm92ZXJ2aWV3X3NldHRpbmdzX21vZGFsX2NvbnRyb2xsZXIuanMiXSwibmFtZXMiOlsianNlIiwibGlicyIsIm92ZXJ2aWV3X3NldHRpbmdzX21vZGFsX2NvbnRyb2xsZXIiLCJleHBvcnRzIiwiT3ZlcnZpZXdTZXR0aW5nc01vZGFsQ29udHJvbGxlciIsIiRlbGVtZW50IiwidXNlckNmZ1NlcnZpY2UiLCJsb2FkaW5nU3Bpbm5lciIsInVzZXJJZCIsImRlZmF1bHRDb2x1bW5TZXR0aW5ncyIsInRyYW5zbGF0b3IiLCJwYWdlIiwiJHN1Ym1pdEJ1dHRvbiIsImZpbmQiLCIkc2V0dGluZ3MiLCIkbW9kYWwiLCJwYXJlbnRzIiwiJG1vZGFsRm9vdGVyIiwiJHJlc2V0RGVmYXVsdExpbmsiLCIkc3Bpbm5lciIsInNvcnRhYmxlSGFuZGxlU2VsZWN0b3IiLCJyb3dIZWlnaHRWYWx1ZVNlbGVjdG9yIiwiZGlzcGxheVRvb2x0aXBWYWx1ZVNlbGVjdG9yIiwiZXJyb3JNZXNzYWdlQ2xhc3NOYW1lIiwibG9hZGluZ0NsYXNzTmFtZSIsInNldHRpbmdMaXN0SXRlbUlkUHJlZml4Iiwic2V0dGluZ1ZhbHVlSWRQcmVmaXgiLCJDT05GSUdfS0VZX0NPTFVNTl9TRVRUSU5HUyIsIkNPTkZJR19LRVlfUk9XX0hFSUdIVF9TRVRUSU5HUyIsIkNPTkZJR19LRVlfRElTUExBWV9UT09MVElQU19TRVRUSU5HUyIsIkRFRkFVTFRfUk9XX0hFSUdIVF9TRVRUSU5HIiwiREVGQVVMVF9DT0xVTU5fU0VUVElOR1MiLCJzcGxpdCIsIkRFRkFVTFRfRElTUExBWV9UT09MVElQU19TRVRUSU5HUyIsIm9uIiwiX29uU3VibWl0QnV0dG9uQ2xpY2siLCJldmVudCIsIl9vblJlc2V0U2V0dGluZ3NMaW5rQ2xpY2siLCJfb25Nb2RhbFNob3ciLCJfb25Nb2RhbFNob3duIiwiYWRkQ2xhc3MiLCJfcmVmcmVzaFNldHRpbmdzIiwiX2NsZWFyRXJyb3JNZXNzYWdlIiwiX2luaXRTb3J0YWJsZSIsIm9wdGlvbnMiLCJpdGVtcyIsImF4aXMiLCJjdXJzb3IiLCJoYW5kbGUiLCJjb250YWlubWVudCIsInNvcnRhYmxlIiwiZGlzYWJsZVNlbGVjdGlvbiIsInJlbW92ZVByZWZpeEl0ZXJhdG9yIiwiaXRlbSIsInJlcGxhY2UiLCJmaWx0ZXJJdGVyYXRvciIsImlzIiwibWFwIiwiZmlsdGVyIiwidmFsIiwicHJvcCIsImNvbHVtblNldHRpbmdzIiwiX3NlcmlhbGl6ZUNvbHVtblNldHRpbmdzIiwicm93SGVpZ2h0U2V0dGluZyIsIl9zZXJpYWxpemVSb3dIZWlnaHRTZXR0aW5nIiwiZGlzcGxheVRvb2x0aXBTZXR0aW5nIiwiX3NlcmlhbGl6ZURpc3BsYXlUb29sdGlwU2V0dGluZyIsIl90b2dnbGVMb2FkaW5nU3Bpbm5lciIsIl9zYXZlQ29sdW1uU2V0dGluZ3MiLCJ0aGVuIiwiX3NhdmVEaXNwbGF5VG9vbHRpcFNldHRpbmciLCJfc2F2ZVJvd0hlaWdodFNldHRpbmciLCJfb25TYXZlU3VjY2VzcyIsImNhdGNoIiwiX29uU2F2ZUVycm9yIiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iLCJfc2V0RGVmYXVsdFNldHRpbmdzIiwiZG9TaG93Iiwic2hvdyIsImNzcyIsInJlbW92ZUNsYXNzIiwiaGlkZSIsIndpbmRvdyIsImxvY2F0aW9uIiwicmVsb2FkIiwiJGVycm9yTWVzc2FnZSIsImxlbmd0aCIsInJlbW92ZSIsImVycm9yTWVzc2FnZSIsInRyYW5zbGF0ZSIsIiRlcnJvciIsIiQiLCJjbGFzcyIsInRleHQiLCJwcmVwZW5kIiwiZmFkZUluIiwiZGF0YSIsImNvbmZpZ3VyYXRpb25LZXkiLCJfZ2V0RnJvbVVzZXJDZmdTZXJ2aWNlIiwiaGFuZGxlciIsInJlc29sdmUiLCJyZWplY3QiLCJvbkVycm9yIiwib25TdWNjZXNzIiwicmVzcG9uc2UiLCJjb25maWd1cmF0aW9uVmFsdWUiLCJnZXQiLCJQcm9taXNlIiwic2V0IiwiQXJyYXkiLCJpc0FycmF5IiwiRXJyb3IiLCJKU09OIiwic3RyaW5naWZ5IiwiX3NldFdpdGhVc2VyQ2ZnU2VydmljZSIsIm9uUmVmcmVzaFNldHRpbmdzRXJyb3IiLCJjb25zb2xlIiwid2FybiIsImVycm9yIiwiX2dldFJvd0hlaWdodFNldHRpbmciLCJfc2V0Um93SGVpZ2h0Iiwicm93SGVpZ2h0VmFsdWUiLCJfZ2V0RGlzcGxheVRvb2x0aXBTZXR0aW5nIiwiX3NldERpc3BsYXlUb29sdGlwU2V0dGluZyIsIl9nZXRDb2x1bW5TZXR0aW5ncyIsIl9zZXRDb2x1bW5TZXR0aW5ncyIsInZhbHVlIiwidHJpZ2dlciIsIkVTQ0FQRV9DSEFSIiwicGFyc2UiLCIkc29ydGVkSXRlbXMiLCJzZXR0aW5nSXRlcmF0b3IiLCJpZCIsInNldHRpbmciLCIkbGlzdEl0ZW0iLCIkY2hlY2tib3giLCJwYXJlbnQiLCJhcHBlbmRUbyIsImZvckVhY2giLCJjaGlsZHJlbiIsInByZXBlbmRUbyIsInJvd0hlaWdodCIsImVhY2giLCJpbmRleCIsImVsZW1lbnQiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7Ozs7O0FBVUFBLElBQUlDLElBQUosQ0FBU0Msa0NBQVQsR0FBOENGLElBQUlDLElBQUosQ0FBU0Msa0NBQVQsSUFBK0MsRUFBN0Y7O0FBRUE7Ozs7OztBQU1DLFdBQVVDLE9BQVYsRUFBbUI7QUFDaEI7OztBQURnQixRQUlWQywrQkFKVTtBQUtaOzs7Ozs7Ozs7OztBQVdBLGlEQUFZQyxRQUFaLEVBQXNCQyxjQUF0QixFQUFzQ0MsY0FBdEMsRUFBc0RDLE1BQXRELEVBQThEQyxxQkFBOUQsRUFBcUZDLFVBQXJGLEVBQWlHQyxJQUFqRyxFQUF1RztBQUFBOztBQUNuRztBQUNBLGlCQUFLTixRQUFMLEdBQWdCQSxRQUFoQjtBQUNBLGlCQUFLTyxhQUFMLEdBQXFCUCxTQUFTUSxJQUFULENBQWMsc0JBQWQsQ0FBckI7QUFDQSxpQkFBS0MsU0FBTCxHQUFpQlQsU0FBU1EsSUFBVCxDQUFjLGFBQWQsQ0FBakI7QUFDQSxpQkFBS0UsTUFBTCxHQUFjVixTQUFTVyxPQUFU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QUlBO0FBQ0EscUJBQ0tULFFBREwsQ0FFS1EsSUFGTCxDQUVVLEtBQUtRLHNCQUZmLEVBR0tzQyxHQUhMLENBR1NtRixTQUhUOztBQUtBLHVCQUFPLElBQVA7QUFDSDtBQXpyQlc7O0FBQUE7QUFBQTs7QUE0ckJoQjNJLFlBQVEwRixLQUFSLEdBQWdCekYsK0JBQWhCO0FBQ0gsQ0E3ckJBLEVBNnJCQ0osSUFBSUMsSUFBSixDQUFTQyxrQ0E3ckJWLENBQUQiLCJmaWxlIjoib3ZlcnZpZXdfc2V0dGluZ3NfbW9kYWxfY29udHJvbGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gb3ZlcnZpZXdfc2V0dGluZ3NfbW9kYWxfY29udHJvbGxlci5qcyAyMDIxLTA2LTE3XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAyMSBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuanNlLmxpYnMub3ZlcnZpZXdfc2V0dGluZ3NfbW9kYWxfY29udHJvbGxlciA9IGpzZS5saWJzLm92ZXJ2aWV3X3NldHRpbmdzX21vZGFsX2NvbnRyb2xsZXIgfHwge307XG5cbi8qKlxuICogT3ZlcnZpZXcgc2V0dGluZ3MgbW9kYWwgY29udHJvbGxlciBjbGFzcy5cbiAqXG4gKiBAbW9kdWxlIEFkbWluL0xpYnMvb3ZlcnZpZXdfc2V0dGluZ3NfbW9kYWxcbiAqIEBleHBvcnRzIGpzZS5saWJzLm92ZXJ2aWV3X3NldHRpbmdzX21vZGFsXG4gKi9cbihmdW5jdGlvbiAoZXhwb3J0cykge1xuICAgIC8qKlxuICAgICAqIENsYXNzIHJlcHJlc2VudGluZyBhIGNvbnRyb2xsZXIgZm9yIHRoZSBvcmRlcnMgb3ZlcnZpZXcgc2V0dGluZ3MgbW9kYWwuXG4gICAgICovXG4gICAgY2xhc3MgT3ZlcnZpZXdTZXR0aW5nc01vZGFsQ29udHJvbGxlciB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIE9yZGVyc092ZXJ2aWV3U2V0dGluZ3NNb2RhbENvbnRyb2xsZXIuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAgICAkZWxlbWVudCAgICAgICAgICAgICAgTW9kdWxlIGVsZW1lbnQuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSAgICB1c2VyQ2ZnU2VydmljZSAgICAgICAgVXNlciBjb25maWd1cmF0aW9uIHNlcnZpY2UgbGlicmFyeS5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9ICAgIGxvYWRpbmdTcGlubmVyICAgICAgICBMb2FkaW5nIHNwaW5uZXIgbGlicmFyeS5cbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9ICAgIHVzZXJJZCAgICAgICAgICAgICAgICBJRCBvZiBjdXJyZW50bHkgc2lnbmVkIGluIHVzZXIuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSAgICBkZWZhdWx0Q29sdW1uU2V0dGluZ3MgRGVmYXVsdCBjb2x1bW4gc2V0dGluZ3MuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSAgICB0cmFuc2xhdG9yICAgICAgICAgICAgVHJhbnNsYXRvciBsaWJyYXJ5LlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gICAgcGFnZSAgICAgICAgICAgICAgICAgIFBhZ2UgbmFtZSAoZS5nLjogJ29yZGVycycsICdpbnZvaWNlcycpLlxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3RydWN0b3IoJGVsZW1lbnQsIHVzZXJDZmdTZXJ2aWNlLCBsb2FkaW5nU3Bpbm5lciwgdXNlcklkLCBkZWZhdWx0Q29sdW1uU2V0dGluZ3MsIHRyYW5zbGF0b3IsIHBhZ2UpIHtcbiAgICAgICAgICAgIC8vIEVsZW1lbnRzXG4gICAgICAgICAgICB0aGlzLiRlbGVtZW50ID0gJGVsZW1lbnQ7XG4gICAgICAgICAgICB0aGlzLiRzdWJtaXRCdXR0b24gPSAkZWxlbWVudC5maW5kKCdidXR0b24uc3VibWl0LWJ1dHRvbicpO1xuICAgICAgICAgICAgdGhpcy4kc2V0dGluZ3MgPSAkZWxlbWVudC5maW5kKCd1bC5zZXR0aW5ncycpO1xuICAgICAgICAgICAgdGhpcy4kbW9kYWwgPSAkZWxlbWVudC5wYXJlbnRzKCcubW9kYWwnKTtcbiAgICAgICAgICAgIHRoaXMuJG1vZGFsRm9vdGVyID0gJGVsZW1lbnQuZmluZCgnLm1vZGFsLWZvb3RlcicpO1xuICAgICAgICAgICAgdGhpcy4kcmVzZXREZWZhdWx0TGluayA9ICRlbGVtZW50LmZpbmQoJ2EucmVzZXQtYWN0aW9uJyk7XG5cbiAgICAgICAgICAgIC8vIExvYWRpbmcgc3Bpbm5lclxuICAgICAgICAgICAgdGhpcy4kc3Bpbm5lciA9IG51bGw7XG5cbiAgICAgICAgICAgIC8vIFNlbGVjdG9yIHN0cmluZ3NcbiAgICAgICAgICAgIHRoaXMuc29ydGFibGVIYW5kbGVTZWxlY3RvciA9ICdzcGFuLnNvcnQtaGFuZGxlJztcbiAgICAgICAgICAgIHRoaXMucm93SGVpZ2h0VmFsdWVTZWxlY3RvciA9ICdzZWxlY3Qjc2V0dGluZy12YWx1ZS1yb3ctaGVpZ2h0JztcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheVRvb2x0aXBWYWx1ZVNlbGVjdG9yID0gJ2lucHV0I3NldHRpbmctdmFsdWUtZGlzcGxheS10b29sdGlwcyc7XG5cbiAgICAgICAgICAgIC8vIENsYXNzIG5hbWVzXG4gICAgICAgICAgICB0aGlzLmVycm9yTWVzc2FnZUNsYXNzTmFtZSA9ICdlcnJvci1tZXNzYWdlJztcbiAgICAgICAgICAgIHRoaXMubG9hZGluZ0NsYXNzTmFtZSA9ICdsb2FkaW5nJztcblxuICAgICAgICAgICAgLy8gTGlicmFyaWVzXG4gICAgICAgICAgICB0aGlzLnVzZXJDZmdTZXJ2aWNlID0gdXNlckNmZ1NlcnZpY2U7XG4gICAgICAgICAgICB0aGlzLmxvYWRpbmdTcGlubmVyID0gbG9hZGluZ1NwaW5uZXI7XG4gICAgICAgICAgICB0aGlzLnRyYW5zbGF0b3IgPSB0cmFuc2xhdG9yO1xuXG4gICAgICAgICAgICAvLyBQcmVmaXhlc1xuICAgICAgICAgICAgdGhpcy5zZXR0aW5nTGlzdEl0ZW1JZFByZWZpeCA9ICdzZXR0aW5nLSc7XG4gICAgICAgICAgICB0aGlzLnNldHRpbmdWYWx1ZUlkUHJlZml4ID0gJ3NldHRpbmctdmFsdWUtJztcblxuICAgICAgICAgICAgLy8gVXNlciBjb25maWd1cmF0aW9uIGtleXNcbiAgICAgICAgICAgIHRoaXMuQ09ORklHX0tFWV9DT0xVTU5fU0VUVElOR1MgPSBgJHtwYWdlfU92ZXJ2aWV3U2V0dGluZ3NDb2x1bW5zYDtcbiAgICAgICAgICAgIHRoaXMuQ09ORklHX0tFWV9ST1dfSEVJR0hUX1NFVFRJTkdTID0gYCR7cGFnZX1PdmVydmlld1NldHRpbmdzUm93SGVpZ2h0YDtcbiAgICAgICAgICAgIHRoaXMuQ09ORklHX0tFWV9ESVNQTEFZX1RPT0xUSVBTX1NFVFRJTkdTID0gYCR7cGFnZX1PdmVydmlld1NldHRpbmdzRGlzcGxheVRvb2x0aXBzYDtcblxuICAgICAgICAgICAgLy8gRGVmYXVsdCB2YWx1ZXNcbiAgICAgICAgICAgIHRoaXMuREVGQVVMVF9ST1dfSEVJR0hUX1NFVFRJTkcgPSAnbGFyZ2UnO1xuICAgICAgICAgICAgdGhpcy5ERUZBVUxUX0NPTFVNTl9TRVRUSU5HUyA9IGRlZmF1bHRDb2x1bW5TZXR0aW5ncy5zcGxpdCgnLCcpO1xuICAgICAgICAgICAgdGhpcy5ERUZBVUxUX0RJU1BMQVlfVE9PTFRJUFNfU0VUVElOR1MgPSAndHJ1ZSc7XG5cbiAgICAgICAgICAgIC8vIElEIG9mIGN1cnJlbnRseSBzaWduZWQgaW4gdXNlci5cbiAgICAgICAgICAgIHRoaXMudXNlcklkID0gdXNlcklkO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEJpbmRzIHRoZSBldmVudCBoYW5kbGVycy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7T3ZlcnZpZXdTZXR0aW5nc01vZGFsQ29udHJvbGxlcn0gU2FtZSBpbnN0YW5jZSBmb3IgbWV0aG9kIGNoYWluaW5nLlxuICAgICAgICAgKi9cbiAgICAgICAgaW5pdGlhbGl6ZSgpIHtcbiAgICAgICAgICAgIC8vIEF0dGFjaCBldmVudCBoYW5kbGVyIGZvciBjbGljayBhY3Rpb24gb24gdGhlIHN1Ym1pdCBidXR0b24uXG4gICAgICAgICAgICB0aGlzLiRzdWJtaXRCdXR0b24ub24oJ2NsaWNrJywgZXZlbnQgPT4gdGhpcy5fb25TdWJtaXRCdXR0b25DbGljayhldmVudCkpO1xuXG4gICAgICAgICAgICAvLyBBdHRhY2ggZXZlbnQgaGFuZGxlciBmb3IgY2xpY2sgYWN0aW9uIG9uIHRoZSByZXNldC1kZWZhdWx0IGxpbmsuXG4gICAgICAgICAgICB0aGlzLiRyZXNldERlZmF1bHRMaW5rLm9uKCdjbGljaycsIGV2ZW50ID0+IHRoaXMuX29uUmVzZXRTZXR0aW5nc0xpbmtDbGljayhldmVudCkpO1xuXG4gICAgICAgICAgICAvLyBBdHRhY2ggZXZlbnQgaGFuZGxlcnMgdG8gbW9kYWwuXG4gICAgICAgICAgICB0aGlzLiRtb2RhbFxuICAgICAgICAgICAgICAgIC5vbignc2hvdy5icy5tb2RhbCcsIGV2ZW50ID0+IHRoaXMuX29uTW9kYWxTaG93KGV2ZW50KSlcbiAgICAgICAgICAgICAgICAub24oJ3Nob3duLmJzLm1vZGFsJywgZXZlbnQgPT4gdGhpcy5fb25Nb2RhbFNob3duKGV2ZW50KSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZhZGVzIG91dCB0aGUgbW9kYWwgY29udGVudC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7T3ZlcnZpZXdTZXR0aW5nc01vZGFsQ29udHJvbGxlcn0gU2FtZSBpbnN0YW5jZSBmb3IgbWV0aG9kIGNoYWluaW5nLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgX29uTW9kYWxTaG93KCkge1xuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5hZGRDbGFzcyh0aGlzLmxvYWRpbmdDbGFzc05hbWUpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVcGRhdGVzIHRoZSBzZXR0aW5ncywgY2xlYXJzIGFueSBlcnJvciBtZXNzYWdlcyBhbmQgaW5pdGlhbGl6ZXMgdGhlIHNvcnRhYmxlIHBsdWdpbi5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7T3ZlcnZpZXdTZXR0aW5nc01vZGFsQ29udHJvbGxlcn0gU2FtZSBpbnN0YW5jZSBmb3IgbWV0aG9kIGNoYWluaW5nLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgX29uTW9kYWxTaG93bigpIHtcbiAgICAgICAgICAgIHRoaXNcbiAgICAgICAgICAgICAgICAuX3JlZnJlc2hTZXR0aW5ncygpXG4gICAgICAgICAgICAgICAgLl9jbGVhckVycm9yTWVzc2FnZSgpXG4gICAgICAgICAgICAgICAgLl9pbml0U29ydGFibGUoKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQWN0aXZhdGVzIHRoZSBqUXVlcnkgVUkgU29ydGFibGUgcGx1Z2luIG9uIHRoZSBzZXR0aW5nIGxpc3QgaXRlbXMgZWxlbWVudC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7T3ZlcnZpZXdTZXR0aW5nc01vZGFsQ29udHJvbGxlcn0gU2FtZSBpbnN0YW5jZSBmb3IgbWV0aG9kIGNoYWluaW5nLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgX2luaXRTb3J0YWJsZSgpIHtcbiAgICAgICAgICAgIC8vIGpRdWVyeSBVSSBTb3J0YWJsZSBwbHVnaW4gb3B0aW9ucy5cbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgaXRlbXM6ICc+IGxpJyxcbiAgICAgICAgICAgICAgICBheGlzOiAneScsXG4gICAgICAgICAgICAgICAgY3Vyc29yOiAnbW92ZScsXG4gICAgICAgICAgICAgICAgaGFuZGxlOiB0aGlzLnNvcnRhYmxlSGFuZGxlU2VsZWN0b3IsXG4gICAgICAgICAgICAgICAgY29udGFpbm1lbnQ6ICdwYXJlbnQnXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBBY3RpdmF0ZSBzb3J0YWJsZSBwbHVnaW4uXG4gICAgICAgICAgICB0aGlzLiRzZXR0aW5nc1xuICAgICAgICAgICAgICAgIC5zb3J0YWJsZShvcHRpb25zKVxuICAgICAgICAgICAgICAgIC5kaXNhYmxlU2VsZWN0aW9uKCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgYSBzb3J0ZWQgYXJyYXkgY29udGFpbmluZyB0aGUgSURzIG9mIGFsbCBhY3RpdmF0ZWQgc2V0dGluZ3MuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgX3NlcmlhbGl6ZUNvbHVtblNldHRpbmdzKCkge1xuICAgICAgICAgICAgLy8gTWFwIGl0ZXJhdG9yIGZ1bmN0aW9uIHRvIHJlbW92ZSB0aGUgJ3NldHRpbmctJyBwcmVmaXggZnJvbSBsaXN0IGl0ZW0gSUQuXG4gICAgICAgICAgICBjb25zdCByZW1vdmVQcmVmaXhJdGVyYXRvciA9IGl0ZW0gPT4gaXRlbS5yZXBsYWNlKHRoaXMuc2V0dGluZ0xpc3RJdGVtSWRQcmVmaXgsICcnKTtcblxuICAgICAgICAgICAgLy8gRmlsdGVyIGl0ZXJhdG9yIGZ1bmN0aW9uLCB0byBhY2NlcHQgb25seSBsaXN0IGl0ZW1zIHdpdGggYWN0aXZhdGVkIGNoZWNrYm94ZXMuXG4gICAgICAgICAgICBjb25zdCBmaWx0ZXJJdGVyYXRvciA9IGl0ZW0gPT4gdGhpcy4kc2V0dGluZ3MuZmluZCgnIycgKyB0aGlzLnNldHRpbmdWYWx1ZUlkUHJlZml4ICsgaXRlbSlcbiAgICAgICAgICAgICAgICAuaXMoJzpjaGVja2VkJyk7XG5cbiAgICAgICAgICAgIC8vIFJldHVybiBhcnJheSB3aXRoIHNvcnRlZCwgb25seSBhY3RpdmUgY29sdW1ucy5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLiRzZXR0aW5nc1xuICAgICAgICAgICAgICAgIC5zb3J0YWJsZSgndG9BcnJheScpXG4gICAgICAgICAgICAgICAgLm1hcChyZW1vdmVQcmVmaXhJdGVyYXRvcilcbiAgICAgICAgICAgICAgICAuZmlsdGVyKGZpbHRlckl0ZXJhdG9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHRoZSB2YWx1ZSBvZiB0aGUgc2VsZWN0ZWQgcm93IGhlaWdodCBvcHRpb24uXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIF9zZXJpYWxpemVSb3dIZWlnaHRTZXR0aW5nKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgICAgICAgICAgICAuJGVsZW1lbnRcbiAgICAgICAgICAgICAgICAuZmluZCh0aGlzLnJvd0hlaWdodFZhbHVlU2VsZWN0b3IpXG4gICAgICAgICAgICAgICAgLnZhbCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIHZhbHVlIG9mIHRoZSBzZWxlY3RlZCB0b29sdGlwIGRpc3BsYXkgb3B0aW9uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBfc2VyaWFsaXplRGlzcGxheVRvb2x0aXBTZXR0aW5nKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgICAgICAgICAgICAuJGVsZW1lbnRcbiAgICAgICAgICAgICAgICAuZmluZCh0aGlzLmRpc3BsYXlUb29sdGlwVmFsdWVTZWxlY3RvcilcbiAgICAgICAgICAgICAgICAucHJvcCgnY2hlY2tlZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNob3dzIHRoZSBsb2FkaW5nIHNwaW5uZXIsIHNhdmVzIHRoZSBzZXR0aW5ncyB0byB0aGUgdXNlciBjb25maWd1cmF0aW9uLFxuICAgICAgICAgKiBjbG9zZXMgdGhlIG1vZGFsIHRvIGZpbmFsbHkgcmUtcmVuZGVyIHRoZSBkYXRhdGFibGUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge092ZXJ2aWV3U2V0dGluZ3NNb2RhbENvbnRyb2xsZXJ9IFNhbWUgaW5zdGFuY2UgZm9yIG1ldGhvZCBjaGFpbmluZy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIF9vblN1Ym1pdEJ1dHRvbkNsaWNrKCkge1xuICAgICAgICAgICAgLy8gUmV0cmlldmUgc2V0dGluZyB2YWx1ZXMuXG4gICAgICAgICAgICBjb25zdCBjb2x1bW5TZXR0aW5ncyA9IHRoaXMuX3NlcmlhbGl6ZUNvbHVtblNldHRpbmdzKCk7XG4gICAgICAgICAgICBjb25zdCByb3dIZWlnaHRTZXR0aW5nID0gdGhpcy5fc2VyaWFsaXplUm93SGVpZ2h0U2V0dGluZygpO1xuICAgICAgICAgICAgY29uc3QgZGlzcGxheVRvb2x0aXBTZXR0aW5nID0gdGhpcy5fc2VyaWFsaXplRGlzcGxheVRvb2x0aXBTZXR0aW5nKCk7XG5cbiAgICAgICAgICAgIC8vIFJlbW92ZSBhbnkgZXJyb3IgbWVzc2FnZSBhbmQgc2F2ZSBzZXR0aW5ncy5cbiAgICAgICAgICAgIHRoaXNcbiAgICAgICAgICAgICAgICAuX3RvZ2dsZUxvYWRpbmdTcGlubmVyKHRydWUpXG4gICAgICAgICAgICAgICAgLl9jbGVhckVycm9yTWVzc2FnZSgpXG4gICAgICAgICAgICAgICAgLl9zYXZlQ29sdW1uU2V0dGluZ3MoY29sdW1uU2V0dGluZ3MpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy5fc2F2ZURpc3BsYXlUb29sdGlwU2V0dGluZyhkaXNwbGF5VG9vbHRpcFNldHRpbmcpKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHRoaXMuX3NhdmVSb3dIZWlnaHRTZXR0aW5nKHJvd0hlaWdodFNldHRpbmcpKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHRoaXMuX29uU2F2ZVN1Y2Nlc3MoKSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKCkgPT4gdGhpcy5fb25TYXZlRXJyb3IoKSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFByZXZlbnRzIHRoZSBicm93c2VyIHRvIGFwcGx5IHRoZSBkZWZhdWx0IGJlaGF2b2lyIGFuZFxuICAgICAgICAgKiByZXNldHMgdGhlIGNvbHVtbiBvcmRlciBhbmQgcm93IHNpemUgdG8gdGhlIGRlZmF1bHQgc2V0dGluZyB2YWx1ZXMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5LkV2ZW50fSBldmVudCBGaXJlZCBldmVudC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7T3ZlcnZpZXdTZXR0aW5nc01vZGFsQ29udHJvbGxlcn0gU2FtZSBpbnN0YW5jZSBmb3IgbWV0aG9kIGNoYWluaW5nLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgX29uUmVzZXRTZXR0aW5nc0xpbmtDbGljayhldmVudCkge1xuICAgICAgICAgICAgLy8gUHJldmVudCBkZWZhdWx0IGJlaGF2aW9yLlxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgICAgICAvLyBSZXNldCB0byBkZWZhdWx0IHNldHRpbmdzLlxuICAgICAgICAgICAgdGhpcy5fc2V0RGVmYXVsdFNldHRpbmdzKCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNob3dzIGFuZCBoaWRlcyB0aGUgbG9hZGluZyBzcGlubmVyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGRvU2hvdyBTaG93IHRoZSBsb2FkaW5nIHNwaW5uZXI/XG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge092ZXJ2aWV3U2V0dGluZ3NNb2RhbENvbnRyb2xsZXJ9IFNhbWUgaW5zdGFuY2UgZm9yIG1ldGhvZCBjaGFpbmluZy5cbiAgICAgICAgICovXG4gICAgICAgIF90b2dnbGVMb2FkaW5nU3Bpbm5lcihkb1Nob3cpIHtcbiAgICAgICAgICAgIGlmIChkb1Nob3cpIHtcbiAgICAgICAgICAgICAgICAvLyBGYWRlIG91dCBtb2RhbCBjb250ZW50LlxuICAgICAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQuYWRkQ2xhc3ModGhpcy5sb2FkaW5nQ2xhc3NOYW1lKTtcblxuICAgICAgICAgICAgICAgIC8vIFNob3cgbG9hZGluZyBzcGlubmVyLlxuICAgICAgICAgICAgICAgIHRoaXMuJHNwaW5uZXIgPSB0aGlzLmxvYWRpbmdTcGlubmVyLnNob3codGhpcy4kZWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICAvLyBGaXggc3Bpbm5lciB6LWluZGV4LlxuICAgICAgICAgICAgICAgIHRoaXMuJHNwaW5uZXIuY3NzKHsnei1pbmRleCc6IDk5OTl9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gRmFkZSBvdXQgbW9kYWwgY29udGVudC5cbiAgICAgICAgICAgICAgICB0aGlzLiRlbGVtZW50LnJlbW92ZUNsYXNzKHRoaXMubG9hZGluZ0NsYXNzTmFtZSk7XG5cbiAgICAgICAgICAgICAgICAvLyBIaWRlIHRoZSBsb2FkaW5nIHNwaW5uZXIuXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkaW5nU3Bpbm5lci5oaWRlKHRoaXMuJHNwaW5uZXIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVzIHRoZSBiZWhhdmlvciBvbiBzdWNjZXNzZnVsIHNldHRpbmcgc2F2ZSBhY3Rpb24uXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge092ZXJ2aWV3U2V0dGluZ3NNb2RhbENvbnRyb2xsZXJ9IFNhbWUgaW5zdGFuY2UgZm9yIG1ldGhvZCBjaGFpbmluZy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIF9vblNhdmVTdWNjZXNzKCkge1xuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlcyBhbnkgZXJyb3IgbWVzc2FnZSwgaWYgZm91bmQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge092ZXJ2aWV3U2V0dGluZ3NNb2RhbENvbnRyb2xsZXJ9IFNhbWUgaW5zdGFuY2UgZm9yIG1ldGhvZCBjaGFpbmluZy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIF9jbGVhckVycm9yTWVzc2FnZSgpIHtcbiAgICAgICAgICAgIC8vIEVycm9yIG1lc3NhZ2UuXG4gICAgICAgICAgICBjb25zdCAkZXJyb3JNZXNzYWdlID0gdGhpcy4kbW9kYWxGb290ZXIuZmluZChgLiR7dGhpcy5lcnJvck1lc3NhZ2VDbGFzc05hbWV9YCk7XG5cbiAgICAgICAgICAgIC8vIFJlbW92ZSBpZiBpdCBleGlzdHMuXG4gICAgICAgICAgICBpZiAoJGVycm9yTWVzc2FnZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkZXJyb3JNZXNzYWdlLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVzIHRoZSBiZWhhdmlvciBvbiB0aHJvd24gZXJyb3Igd2hpbGUgc2F2aW5nIHNldHRpbmdzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtPdmVydmlld1NldHRpbmdzTW9kYWxDb250cm9sbGVyfSBTYW1lIGluc3RhbmNlIGZvciBtZXRob2QgY2hhaW5pbmcuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBfb25TYXZlRXJyb3IoKSB7XG4gICAgICAgICAgICAvLyBFcnJvciBtZXNzYWdlLlxuICAgICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gdGhpcy50cmFuc2xhdG9yLnRyYW5zbGF0ZSgnVFhUX1NBVkVfRVJST1InLCAnYWRtaW5fZ2VuZXJhbCcpO1xuXG4gICAgICAgICAgICAvLyBEZWZpbmUgZXJyb3IgbWVzc2FnZSBlbGVtZW50LlxuICAgICAgICAgICAgY29uc3QgJGVycm9yID0gJCgnPHNwYW4vPicsIHtjbGFzczogdGhpcy5lcnJvck1lc3NhZ2VDbGFzc05hbWUsIHRleHQ6IGVycm9yTWVzc2FnZX0pO1xuXG4gICAgICAgICAgICAvLyBIaWRlIHRoZSBsb2FkaW5nIHNwaW5uZXIuXG4gICAgICAgICAgICB0aGlzLl90b2dnbGVMb2FkaW5nU3Bpbm5lcihmYWxzZSk7XG5cbiAgICAgICAgICAgIC8vIEFkZCBlcnJvciBtZXNzYWdlIHRvIG1vZGFsIGZvb3Rlci5cbiAgICAgICAgICAgIHRoaXMuJG1vZGFsRm9vdGVyXG4gICAgICAgICAgICAgICAgLnByZXBlbmQoJGVycm9yKVxuICAgICAgICAgICAgICAgIC5oaWRlKClcbiAgICAgICAgICAgICAgICAuZmFkZUluKCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIGNvbmZpZ3VyYXRpb24gdmFsdWUgZm9yIHRoZSBjb2x1bW4gc2V0dGluZ3MuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBfZ2V0Q29sdW1uU2V0dGluZ3MoKSB7XG4gICAgICAgICAgICAvLyBDb25maWd1cmF0aW9uIGRhdGEuXG4gICAgICAgICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICAgICAgICAgIHVzZXJJZDogdGhpcy51c2VySWQsXG4gICAgICAgICAgICAgICAgY29uZmlndXJhdGlvbktleTogdGhpcy5DT05GSUdfS0VZX0NPTFVNTl9TRVRUSU5HU1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gUmVxdWVzdCBkYXRhIGZyb20gdXNlciBjb25maWd1cmF0aW9uIHNlcnZpY2UuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2V0RnJvbVVzZXJDZmdTZXJ2aWNlKGRhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIGNvbmZpZ3VyYXRpb24gdmFsdWUgZm9yIHRoZSByb3cgaGVpZ2h0cy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIF9nZXRSb3dIZWlnaHRTZXR0aW5nKCkge1xuICAgICAgICAgICAgLy8gQ29uZmlndXJhdGlvbiBkYXRhLlxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICB1c2VySWQ6IHRoaXMudXNlcklkLFxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYXRpb25LZXk6IHRoaXMuQ09ORklHX0tFWV9ST1dfSEVJR0hUX1NFVFRJTkdTXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBSZXF1ZXN0IGRhdGEgZnJvbSB1c2VyIGNvbmZpZ3VyYXRpb24gc2VydmljZS5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9nZXRGcm9tVXNlckNmZ1NlcnZpY2UoZGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB0aGUgY29uZmlndXJhdGlvbiB2YWx1ZSBmb3IgdGhlIHRvb2x0aXAgZGlzcGxheSBvcHRpb24uXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBfZ2V0RGlzcGxheVRvb2x0aXBTZXR0aW5nKCkge1xuICAgICAgICAgICAgLy8gQ29uZmlndXJhdGlvbiBkYXRhLlxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICB1c2VySWQ6IHRoaXMudXNlcklkLFxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYXRpb25LZXk6IHRoaXMuQ09ORklHX0tFWV9ESVNQTEFZX1RPT0xUSVBTX1NFVFRJTkdTXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBSZXF1ZXN0IGRhdGEgZnJvbSB1c2VyIGNvbmZpZ3VyYXRpb24gc2VydmljZS5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9nZXRGcm9tVXNlckNmZ1NlcnZpY2UoZGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB0aGUgdmFsdWUgZm9yIHRoZSBwYXNzZWQgdXNlciBjb25maWd1cmF0aW9uIGRhdGEuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhICAgICAgICAgICAgICAgICAgIFVzZXIgY29uZmlndXJhdGlvbiBkYXRhLlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gZGF0YS51c2VySWQgICAgICAgICAgICBVc2VyIElELlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YS5jb25maWd1cmF0aW9uS2V5ICBVc2VyIGNvbmZpZ3VyYXRpb24ga2V5LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgX2dldEZyb21Vc2VyQ2ZnU2VydmljZShkYXRhKSB7XG4gICAgICAgICAgICAvLyBQcm9taXNlIGhhbmRsZXIuXG4gICAgICAgICAgICBjb25zdCBoYW5kbGVyID0gKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIFVzZXIgY29uZmlndXJhdGlvbiBzZXJ2aWNlIHJlcXVlc3Qgb3B0aW9ucy5cbiAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICBvbkVycm9yOiAoKSA9PiByZWplY3QoKSxcbiAgICAgICAgICAgICAgICAgICAgb25TdWNjZXNzOiByZXNwb25zZSA9PiByZXNvbHZlKHJlc3BvbnNlLmNvbmZpZ3VyYXRpb25WYWx1ZSksXG4gICAgICAgICAgICAgICAgICAgIGRhdGFcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgLy8gR2V0IGNvbmZpZ3VyYXRpb24gdmFsdWUuXG4gICAgICAgICAgICAgICAgdGhpcy51c2VyQ2ZnU2VydmljZS5nZXQob3B0aW9ucyk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoaGFuZGxlcik7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2F2ZXMgdGhlIGRhdGEgdmlhIHRoZSB1c2VyIGNvbmZpZ3VyYXRpb24gc2VydmljZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgICAgICAgICAgICAgICAgICAgICBVc2VyIGNvbmZpZ3VyYXRpb24gZGF0YS5cbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IGRhdGEudXNlcklkICAgICAgICAgICAgICBVc2VyIElELlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YS5jb25maWd1cmF0aW9uS2V5ICAgIFVzZXIgY29uZmlndXJhdGlvbiBrZXkuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhLmNvbmZpZ3VyYXRpb25WYWx1ZSAgVXNlciBjb25maWd1cmF0aW9uIHZhbHVlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgX3NldFdpdGhVc2VyQ2ZnU2VydmljZShkYXRhKSB7XG4gICAgICAgICAgICAvLyBQcm9taXNlIGhhbmRsZXIuXG4gICAgICAgICAgICBjb25zdCBoYW5kbGVyID0gKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIFVzZXIgY29uZmlndXJhdGlvbiBzZXJ2aWNlIHJlcXVlc3Qgb3B0aW9ucy5cbiAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICBvbkVycm9yOiAoKSA9PiByZWplY3QoKSxcbiAgICAgICAgICAgICAgICAgICAgb25TdWNjZXNzOiByZXNwb25zZSA9PiByZXNvbHZlKCksXG4gICAgICAgICAgICAgICAgICAgIGRhdGFcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgLy8gU2V0IGNvbmZpZ3VyYXRpb24gdmFsdWUuXG4gICAgICAgICAgICAgICAgdGhpcy51c2VyQ2ZnU2VydmljZS5zZXQob3B0aW9ucyk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoaGFuZGxlcik7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2F2ZXMgdGhlIGNvbHVtbiBzZXR0aW5ncyB2aWEgdGhlIHVzZXIgY29uZmlndXJhdGlvbiBzZXJ2aWNlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBjb2x1bW5TZXR0aW5ncyBTb3J0ZWQgYXJyYXkgd2l0aCBhY3RpdmUgY29sdW1uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgX3NhdmVDb2x1bW5TZXR0aW5ncyhjb2x1bW5TZXR0aW5ncykge1xuICAgICAgICAgICAgLy8gQ2hlY2sgYXJndW1lbnQuXG4gICAgICAgICAgICBpZiAoIWNvbHVtblNldHRpbmdzIHx8ICFBcnJheS5pc0FycmF5KGNvbHVtblNldHRpbmdzKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBvciBpbnZhbGlkIGNvbHVtbiBzZXR0aW5ncycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBVc2VyIGNvbmZpZ3VyYXRpb24gcmVxdWVzdCBkYXRhLlxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICB1c2VySWQ6IHRoaXMudXNlcklkLFxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYXRpb25LZXk6IHRoaXMuQ09ORklHX0tFWV9DT0xVTU5fU0VUVElOR1MsXG4gICAgICAgICAgICAgICAgY29uZmlndXJhdGlvblZhbHVlOiBKU09OLnN0cmluZ2lmeShjb2x1bW5TZXR0aW5ncylcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIFNhdmUgdmlhIHVzZXIgY29uZmlndXJhdGlvbiBzZXJ2aWNlLlxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NldFdpdGhVc2VyQ2ZnU2VydmljZShkYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTYXZlcyB0aGUgcm93IGhlaWdodCBzZXR0aW5nIHZpYSB0aGUgdXNlciBjb25maWd1cmF0aW9uIHNlcnZpY2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSByb3dIZWlnaHRTZXR0aW5nIFZhbHVlIG9mIHRoZSBzZWxlY3RlZCByb3cgaGVpZ2h0IHNldHRpbmcuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBfc2F2ZVJvd0hlaWdodFNldHRpbmcocm93SGVpZ2h0U2V0dGluZykge1xuICAgICAgICAgICAgLy8gQ2hlY2sgYXJndW1lbnQuXG4gICAgICAgICAgICBpZiAoIXJvd0hlaWdodFNldHRpbmcgfHwgdHlwZW9mIHJvd0hlaWdodFNldHRpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIG9yIGludmFsaWQgcm93IGhlaWdodCBzZXR0aW5nJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFVzZXIgY29uZmlndXJhdGlvbiByZXF1ZXN0IGRhdGEuXG4gICAgICAgICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICAgICAgICAgIHVzZXJJZDogdGhpcy51c2VySWQsXG4gICAgICAgICAgICAgICAgY29uZmlndXJhdGlvbktleTogdGhpcy5DT05GSUdfS0VZX1JPV19IRUlHSFRfU0VUVElOR1MsXG4gICAgICAgICAgICAgICAgY29uZmlndXJhdGlvblZhbHVlOiByb3dIZWlnaHRTZXR0aW5nXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBTYXZlIHZpYSB1c2VyIGNvbmZpZ3VyYXRpb24gc2VydmljZS5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZXRXaXRoVXNlckNmZ1NlcnZpY2UoZGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2F2ZXMgdGhlIGRpc3BsYXkgdG9vbHRpcCBzZXR0aW5nIHZpYSB0aGUgdXNlciBjb25maWd1cmF0aW9uIHNlcnZpY2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkaXNwbGF5VG9vbHRpcFNldHRpbmcgVmFsdWUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBfc2F2ZURpc3BsYXlUb29sdGlwU2V0dGluZyhkaXNwbGF5VG9vbHRpcFNldHRpbmcpIHtcbiAgICAgICAgICAgIC8vIFVzZXIgY29uZmlndXJhdGlvbiByZXF1ZXN0IGRhdGEuXG4gICAgICAgICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICAgICAgICAgIHVzZXJJZDogdGhpcy51c2VySWQsXG4gICAgICAgICAgICAgICAgY29uZmlndXJhdGlvbktleTogdGhpcy5DT05GSUdfS0VZX0RJU1BMQVlfVE9PTFRJUFNfU0VUVElOR1MsXG4gICAgICAgICAgICAgICAgY29uZmlndXJhdGlvblZhbHVlOiBkaXNwbGF5VG9vbHRpcFNldHRpbmdcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIFNhdmUgdmlhIHVzZXIgY29uZmlndXJhdGlvbiBzZXJ2aWNlLlxuICAgICAgICAgICAgaWYgKHR5cGVvZiBkaXNwbGF5VG9vbHRpcFNldHRpbmcgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NldFdpdGhVc2VyQ2ZnU2VydmljZShkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXRyaWV2ZXMgdGhlIHNhdmVkIHNldHRpbmcgY29uZmlndXJhdGlvbiBhbmQgcmVvcmRlcnMvdXBkYXRlcyB0aGUgc2V0dGluZ3MuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge092ZXJ2aWV3U2V0dGluZ3NNb2RhbENvbnRyb2xsZXJ9IFNhbWUgaW5zdGFuY2UgZm9yIG1ldGhvZCBjaGFpbmluZy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIF9yZWZyZXNoU2V0dGluZ3MoKSB7XG4gICAgICAgICAgICAvLyBTaG93IGxvYWRpbmcgc3Bpbm5lci5cbiAgICAgICAgICAgIHRoaXMuX3RvZ2dsZUxvYWRpbmdTcGlubmVyKHRydWUpO1xuXG4gICAgICAgICAgICAvLyBFcnJvciBoYW5kbGVyIGZ1bmN0aW9uIHRvIHNwZWNpZnkgdGhlIGJlaGF2aW9yIG9uIGVycm9ycyB3aGlsZSBwcm9jZXNzaW5nLlxuICAgICAgICAgICAgY29uc3Qgb25SZWZyZXNoU2V0dGluZ3NFcnJvciA9IGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAvLyBPdXRwdXQgd2FybmluZy5cbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0Vycm9yIHdoaWxlIHJlZnJlc2hpbmcnLCBlcnJvcik7XG5cbiAgICAgICAgICAgICAgICAvLyBIaWRlIHRoZSBsb2FkaW5nIHNwaW5uZXIuXG4gICAgICAgICAgICAgICAgdGhpcy5fdG9nZ2xlTG9hZGluZ1NwaW5uZXIoZmFsc2UpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gUmVtb3ZlIGFueSBlcnJvciBtZXNzYWdlLCBzZXQgcm93IGhlaWdodCxcbiAgICAgICAgICAgIC8vIHJlb3JkZXIgYW5kIHVwZGF0ZSB0aGUgc2V0dGluZ3MgYW5kIGhpZGUgdGhlIGxvYWRpbmcgc3Bpbm5lci5cbiAgICAgICAgICAgIHRoaXNcbiAgICAgICAgICAgICAgICAuX2NsZWFyRXJyb3JNZXNzYWdlKClcbiAgICAgICAgICAgICAgICAuX2dldFJvd0hlaWdodFNldHRpbmcoKVxuICAgICAgICAgICAgICAgIC50aGVuKHJvd0hlaWdodFZhbHVlID0+IHRoaXMuX3NldFJvd0hlaWdodChyb3dIZWlnaHRWYWx1ZSkpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy5fZ2V0RGlzcGxheVRvb2x0aXBTZXR0aW5nKCkpXG4gICAgICAgICAgICAgICAgLnRoZW4oZGlzcGxheVRvb2x0aXBTZXR0aW5nID0+IHRoaXMuX3NldERpc3BsYXlUb29sdGlwU2V0dGluZyhkaXNwbGF5VG9vbHRpcFNldHRpbmcpKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHRoaXMuX2dldENvbHVtblNldHRpbmdzKCkpXG4gICAgICAgICAgICAgICAgLnRoZW4oY29sdW1uU2V0dGluZ3MgPT4gdGhpcy5fc2V0Q29sdW1uU2V0dGluZ3MoY29sdW1uU2V0dGluZ3MpKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHRoaXMuX3RvZ2dsZUxvYWRpbmdTcGlubmVyKGZhbHNlKSlcbiAgICAgICAgICAgICAgICAuY2F0Y2gob25SZWZyZXNoU2V0dGluZ3NFcnJvcik7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldHMgdGhlIHJvdyBoZWlnaHQgc2V0dGluZyB2YWx1ZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlIFJvdyBoZWlnaHQgdmFsdWUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge092ZXJ2aWV3U2V0dGluZ3NNb2RhbENvbnRyb2xsZXJ9IFNhbWUgaW5zdGFuY2UgZm9yIG1ldGhvZCBjaGFpbmluZy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIF9zZXRSb3dIZWlnaHQodmFsdWUgPSB0aGlzLkRFRkFVTFRfUk9XX0hFSUdIVF9TRVRUSU5HKSB7XG4gICAgICAgICAgICB0aGlzXG4gICAgICAgICAgICAgICAgLiRlbGVtZW50XG4gICAgICAgICAgICAgICAgLmZpbmQodGhpcy5yb3dIZWlnaHRWYWx1ZVNlbGVjdG9yKVxuICAgICAgICAgICAgICAgIC52YWwodmFsdWUpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXRzIHRoZSBkaXNwbGF5IHRvb2x0aXBzIHNldHRpbmcgdmFsdWUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZSBEaXNwbGF5IHRvb2x0aXBzIHZhbHVlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtPdmVydmlld1NldHRpbmdzTW9kYWxDb250cm9sbGVyfSBTYW1lIGluc3RhbmNlIGZvciBtZXRob2QgY2hhaW5pbmcuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBfc2V0RGlzcGxheVRvb2x0aXBTZXR0aW5nKHZhbHVlID0gdGhpcy5ERUZBVUxUX0RJU1BMQVlfVE9PTFRJUFNfU0VUVElOR1MpIHtcbiAgICAgICAgICAgIHRoaXNcbiAgICAgICAgICAgICAgICAuJGVsZW1lbnRcbiAgICAgICAgICAgICAgICAuZmluZCh0aGlzLmRpc3BsYXlUb29sdGlwVmFsdWVTZWxlY3RvcilcbiAgICAgICAgICAgICAgICAucHJvcCgnY2hlY2tlZCcsIHZhbHVlID09PSAndHJ1ZScpXG4gICAgICAgICAgICAgICAgLnRyaWdnZXIoJ2NoYW5nZScpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW9yZGVycyBhbmQgdXBkYXRlcyB0aGUgY29sdW1uIHNldHRpbmcgdmFsdWVzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gY29sdW1uU2V0dGluZ3MgU3RyaW5naWZpZWQgSlNPTiBhcnJheSBjb250YWluaW5nIHRoZSBzYXZlZCBjb2x1bW4gc2V0dGluZ3MuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge092ZXJ2aWV3U2V0dGluZ3NNb2RhbENvbnRyb2xsZXJ9IFNhbWUgaW5zdGFuY2UgZm9yIG1ldGhvZCBjaGFpbmluZy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIF9zZXRDb2x1bW5TZXR0aW5ncyhjb2x1bW5TZXR0aW5ncyA9IHRoaXMuREVGQVVMVF9DT0xVTU5fU0VUVElOR1MpIHtcbiAgICAgICAgICAgIC8vIFJlZ2V4IGZvciBlc2NhcGUgY2hhcmFjdGVyLlxuICAgICAgICAgICAgY29uc3QgRVNDQVBFX0NIQVIgPSAvXFxcXC9nO1xuXG4gICAgICAgICAgICAvLyBObyBuZWVkIHRvIHBhcnNlIGZyb20gSlNPTiBvbiBkZWZhdWx0IHZhbHVlIGFzIGl0IGlzIGFuIGFycmF5LlxuICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGNvbHVtblNldHRpbmdzKSkge1xuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBlc2NhcGUgY2hhcmFjdGVycyBmcm9tIGFuZCBwYXJzZSBhcnJheSBmcm9tIEpTT04uXG4gICAgICAgICAgICAgICAgY29sdW1uU2V0dGluZ3MgPSBjb2x1bW5TZXR0aW5ncy5yZXBsYWNlKEVTQ0FQRV9DSEFSLCAnJyk7XG4gICAgICAgICAgICAgICAgY29sdW1uU2V0dGluZ3MgPSBKU09OLnBhcnNlKGNvbHVtblNldHRpbmdzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ2FjaGUgY29udGFpbmVyIHRvIHRlbXBvcmFyaWx5IGhvbGQgYWxsIGFjdGl2ZSBsaXN0IGl0ZW1zIGluIHNvcnRlZCBvcmRlci5cbiAgICAgICAgICAgIC8vIFRoZSBjaGlsZHJlbiBvZiB0aGlzIGVsZW1lbnQgd2lsbCBiZSBwcmVwZW5kZWQgdG8gdGhlIHNldHRpbmcgbGlzdCBpdGVtIGNvbnRhaW5lciB0byByZXRhaW4gdGhlXG4gICAgICAgICAgICAvLyBzb3J0aW5nIG9yZGVyLlxuICAgICAgICAgICAgY29uc3QgJHNvcnRlZEl0ZW1zID0gJCgnPGRpdi8+Jyk7XG5cbiAgICAgICAgICAgIC8vIEl0ZXJhdG9yIGZ1bmN0aW9uIHRvIHByZXBlbmQgYWN0aXZlIGxpc3QgaXRlbXMgdG8gdGhlIHRvcCBhbmQgYWN0aXZhdGUgdGhlIGNoZWNrYm94LlxuICAgICAgICAgICAgY29uc3Qgc2V0dGluZ0l0ZXJhdG9yID0gc2V0dGluZyA9PiB7XG4gICAgICAgICAgICAgICAgLy8gTGlzdCBpdGVtIElELlxuICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gdGhpcy5zZXR0aW5nTGlzdEl0ZW1JZFByZWZpeCArIHNldHRpbmc7XG5cbiAgICAgICAgICAgICAgICAvLyBBZmZlY3RlZCBzZXR0aW5nIGxpc3QgaXRlbS5cbiAgICAgICAgICAgICAgICBjb25zdCAkbGlzdEl0ZW0gPSB0aGlzLiRzZXR0aW5ncy5maW5kKGAjJHtpZH1gKTtcblxuICAgICAgICAgICAgICAgIC8vIENoZWNrYm94IG9mIGFmZmVjdGVkIGxpc3QgaXRlbS5cbiAgICAgICAgICAgICAgICBjb25zdCAkY2hlY2tib3ggPSAkbGlzdEl0ZW0uZmluZCgnIycgKyB0aGlzLnNldHRpbmdWYWx1ZUlkUHJlZml4ICsgc2V0dGluZyk7XG5cbiAgICAgICAgICAgICAgICAvLyBBY3RpdmF0ZSBjaGVja2JveC5cbiAgICAgICAgICAgICAgICBpZiAoISRjaGVja2JveC5pcygnOmNoZWNrZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICAkY2hlY2tib3gucGFyZW50KCkudHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBNb3ZlIHRvIGNhY2hlIGNvbnRhaW5lci5cbiAgICAgICAgICAgICAgICAkbGlzdEl0ZW0uYXBwZW5kVG8oJHNvcnRlZEl0ZW1zKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIE1vdmUgYWN0aXZlIGxpc3QgaXRlbXMgdG8gdGhlIHRvcCBiZWFyaW5nIHRoZSBzb3J0aW5nIG9yZGVyIGluIG1pbmQuXG4gICAgICAgICAgICBjb2x1bW5TZXR0aW5ncy5mb3JFYWNoKHNldHRpbmdJdGVyYXRvcik7XG5cbiAgICAgICAgICAgIC8vIFByZXBlbmQgY2FjaGVkIGVsZW1lbnRzIHRvIGl0ZW0gbGlzdC5cbiAgICAgICAgICAgICRzb3J0ZWRJdGVtc1xuICAgICAgICAgICAgICAgIC5jaGlsZHJlbigpXG4gICAgICAgICAgICAgICAgLnByZXBlbmRUbyh0aGlzLiRzZXR0aW5ncyk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlc2V0cyB0aGUgY29sdW1uIG9yZGVyIGFuZCByb3cgaGVpZ2h0IHNldHRpbmdzIHRvIHRoZSBkZWZhdWx0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtPdmVydmlld1NldHRpbmdzTW9kYWxDb250cm9sbGVyfSBTYW1lIGluc3RhbmNlIGZvciBtZXRob2QgY2hhaW5pbmcuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBfc2V0RGVmYXVsdFNldHRpbmdzKCkge1xuICAgICAgICAgICAgLy8gRGVmYXVsdCB2YWx1ZXMuXG4gICAgICAgICAgICBjb25zdCBjb2x1bW5TZXR0aW5ncyA9IHRoaXMuREVGQVVMVF9DT0xVTU5fU0VUVElOR1M7XG4gICAgICAgICAgICBjb25zdCByb3dIZWlnaHQgPSB0aGlzLkRFRkFVTFRfUk9XX0hFSUdIVF9TRVRUSU5HO1xuXG4gICAgICAgICAgICAvLyBTZXQgY29sdW1uIHNldHRpbmdzLlxuICAgICAgICAgICAgLy8gQ2FjaGUgY29udGFpbmVyIHRvIHRlbXBvcmFyaWx5IGhvbGQgYWxsIGFjdGl2ZSBsaXN0IGl0ZW1zIGluIHNvcnRlZCBvcmRlci5cbiAgICAgICAgICAgIC8vIFRoZSBjaGlsZHJlbiBvZiB0aGlzIGVsZW1lbnQgd2lsbCBiZSBwcmVwZW5kZWQgdG8gdGhlIHNldHRpbmcgbGlzdCBpdGVtIGNvbnRhaW5lciB0byByZXRhaW4gdGhlXG4gICAgICAgICAgICAvLyBzb3J0aW5nIG9yZGVyLlxuICAgICAgICAgICAgY29uc3QgJHNvcnRlZEl0ZW1zID0gJCgnPGRpdi8+Jyk7XG5cbiAgICAgICAgICAgIC8vIEl0ZXJhdG9yIGZ1bmN0aW9uIHRvIHByZXBlbmQgYWN0aXZlIGxpc3QgaXRlbXMgdG8gdGhlIHRvcCBhbmQgYWN0aXZhdGUgdGhlIGNoZWNrYm94LlxuICAgICAgICAgICAgY29uc3Qgc2V0dGluZ0l0ZXJhdG9yID0gc2V0dGluZyA9PiB7XG4gICAgICAgICAgICAgICAgLy8gTGlzdCBpdGVtIElELlxuICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gdGhpcy5zZXR0aW5nTGlzdEl0ZW1JZFByZWZpeCArIHNldHRpbmc7XG5cbiAgICAgICAgICAgICAgICAvLyBBZmZlY3RlZCBzZXR0aW5nIGxpc3QgaXRlbS5cbiAgICAgICAgICAgICAgICBjb25zdCAkbGlzdEl0ZW0gPSB0aGlzLiRzZXR0aW5ncy5maW5kKGAjJHtpZH1gKTtcblxuICAgICAgICAgICAgICAgIC8vIENoZWNrYm94IG9mIGFmZmVjdGVkIGxpc3QgaXRlbS5cbiAgICAgICAgICAgICAgICBjb25zdCAkY2hlY2tib3ggPSAkbGlzdEl0ZW0uZmluZCgnIycgKyB0aGlzLnNldHRpbmdWYWx1ZUlkUHJlZml4ICsgc2V0dGluZyk7XG5cbiAgICAgICAgICAgICAgICAvLyBBY3RpdmF0ZSBjaGVja2JveC5cbiAgICAgICAgICAgICAgICBpZiAoISRjaGVja2JveC5pcygnOmNoZWNrZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICAkY2hlY2tib3gucGFyZW50KCkudHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBNb3ZlIHRvIGNhY2hlIGNvbnRhaW5lci5cbiAgICAgICAgICAgICAgICAkbGlzdEl0ZW0uYXBwZW5kVG8oJHNvcnRlZEl0ZW1zKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIERlYWN0aXZhdGUgYWxsIGNoZWNrYm94ZXMuXG4gICAgICAgICAgICB0aGlzXG4gICAgICAgICAgICAgICAgLiRzZXR0aW5nc1xuICAgICAgICAgICAgICAgIC5maW5kKCc6Y2hlY2tib3gnKVxuICAgICAgICAgICAgICAgIC5lYWNoKChpbmRleCwgZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCAkY2hlY2tib3ggPSAkKGVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICgkY2hlY2tib3guaXMoJzpjaGVja2VkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRjaGVja2JveC5wYXJlbnQoKS50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIE1vdmUgYWN0aXZlIGxpc3QgaXRlbXMgdG8gdGhlIHRvcCBiZWFyaW5nIHRoZSBzb3J0aW5nIG9yZGVyIGluIG1pbmQuXG4gICAgICAgICAgICBjb2x1bW5TZXR0aW5ncy5mb3JFYWNoKHNldHRpbmdJdGVyYXRvcik7XG5cbiAgICAgICAgICAgIC8vIFByZXBlbmQgY2FjaGVkIGVsZW1lbnRzIHRvIGl0ZW0gbGlzdC5cbiAgICAgICAgICAgICRzb3J0ZWRJdGVtc1xuICAgICAgICAgICAgICAgIC5jaGlsZHJlbigpXG4gICAgICAgICAgICAgICAgLnByZXBlbmRUbyh0aGlzLiRzZXR0aW5ncyk7XG5cbiAgICAgICAgICAgIC8vIFNldCByb3cgaGVpZ2h0LlxuICAgICAgICAgICAgdGhpc1xuICAgICAgICAgICAgICAgIC4kZWxlbWVudFxuICAgICAgICAgICAgICAgIC5maW5kKHRoaXMucm93SGVpZ2h0VmFsdWVTZWxlY3RvcilcbiAgICAgICAgICAgICAgICAudmFsKHJvd0hlaWdodCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhwb3J0cy5jbGFzcyA9IE92ZXJ2aWV3U2V0dGluZ3NNb2RhbENvbnRyb2xsZXI7XG59KGpzZS5saWJzLm92ZXJ2aWV3X3NldHRpbmdzX21vZGFsX2NvbnRyb2xsZXIpKTtcbiJdfQ==
