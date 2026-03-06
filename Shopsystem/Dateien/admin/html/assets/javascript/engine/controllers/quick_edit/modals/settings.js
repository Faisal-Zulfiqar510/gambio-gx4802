'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* --------------------------------------------------------------
 settings.js 2016-10-19
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Handles the settings modal.
 *
 * It retrieves the settings data via the user configuration service and sets the values.
 * You are able to change the column sort order and the visibility of each column. Additionally
 * you can change the height of the table rows.
 */
gx.controllers.module('settings', [jse.source + '/vendor/jquery-ui-dist/jquery-ui.min.css', jse.source + '/vendor/jquery-ui-dist/jquery-ui.min.js', 'user_configuration_service', 'loading_spinner'], function (data) {

    'use strict';

    // --------------------------------------------------------------------
    // VARIABLES
    // --------------------------------------------------------------------

    /**
     * Module Selector
     *
     * @type {jQuery}
     */

    var $this = $(this);

    /**
     * Module Instance
     *
     * @type {Object}
     */
    var module = {};

    // --------------------------------------------------------------------
    // FUNCTIONS
    // --------------------------------------------------------------------

    /**
     * Class representing a controller for the QuickEdit overview settings modal.
     */

    var SettingsModalController = function () {
        /**
         * Creates an instance of QuickEditOverviewSettingsModalController.
         *
         * @param {Function}  done            Module finish callback function.
         * @param {jQuery}    $element        Module element.
         * @param {Object}    userCfgService  User configuration service library.
         * @param {Object}    loadingSpinner  Loading spinner library.
         * @param {Number}    userId          ID of currently signed in user.
         * @param {Object}    translator      Translator library.
         */
        function SettingsModalController(done, $element, userCfgService, loadingSpinner, userId, translator) {
            _classCallCheck(this, SettingsModalController);

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
            this.CONFIG_KEY_COLUMN_SETTINGS = 'quickEditOverviewSettingsColumns';
            this.CONFIG_KEY_ROW_HEIGHT_SETTINGS = 'quickEditOverviewSettingsRowHeight';

            // Default values
            this.DEFAULT_ROW_HEIGHT_SETTING = 'large';
            this.DEFAULT_COLUMN_SETTINGS = ['category', 'name', 'model', 'quantity', 'price', 'discount', 'specialPrice', 'tax', 'shippingStatusName', 'weight', 'shippingCosts', 'status'];

            // ID of currently signed in user.
            this.userId = userId;

            // Call module finish callback.
            done();
        }

        /**
         * Binds the event handlers.
         *
         * @return {SettingsModalController} Same instance for method chaining.
         */


        _createClass(SettingsModalController, [{
            key: 'initialize',
            value: function initialize() {
                var _this = this;

                // Attach event handler for click action on the submit button.
                this.$submitButton.on('click', function (event) {
                    return _this._onSubmitButtonClick();
                });

                // Attach event handler for click action on the reset-default link.
                this.$resetDefaultLink.on('click', function (event) {
                    return _this._onResetSettingsLinkClick(event);
                });

                // Attach event handlers to modal.
                this.$modal.on('show.bs.modal', function (event) {
                    return _this._onModalShow();
                }).on('shown.bs.modal', function (event) {
                    return _this._onModalShown();
                });

                return this;
            }

            /**
             * Fades out the modal content.
             *
             * @return {SettingsModalController} Same instance for method chaining.
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
             * @return {SettingsModalController} Same instance for method chaining.
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
             * @return {SettingsModalController} Same instance for method chaining.
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
             * Shows the loading spinner, saves the settings to the user configuration,
             * closes the modal to finally re-render the datatable.
             *
             * @return {SettingsModalController} Same instance for method chaining.
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

                // Remove any error message and save settings.
                this._toggleLoadingSpinner(true)._clearErrorMessage()._saveColumnSettings(columnSettings).then(function () {
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
             * @return {SettingsModalController} Same instance for method chaining.
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
             * @return {SettingsModalController} Same instance for method chaining.
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
             * @return {SettingsModalController} Same instance for method chaining.
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
             * @return {SettingsModalController} Same instance for method chaining.
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
             * @return {SettingsModalController} Same instance for method chaining.
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
             * Retrieves the saved setting configuration and reorders/updates the settings.
             *
             * @return {SettingsModalController} Same instance for method chaining.
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
             * @return {SettingsModalController} Same instance for method chaining.
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
             * Reorders and updates the column setting values.
             *
             * @param {String|Array} columnSettings Encoded JSON array containing the saved column settings.
             *
             * @return {SettingsModalController} Same instance for method chaining.
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
             * @return {SettingsModalController} Same instance for method chaining.
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

        return SettingsModalController;
    }();

    // --------------------------------------------------------------------
    // INITIALIZATION
    // --------------------------------------------------------------------

    module.init = function (done) {
        // Dependencies.
        var userCfgService = jse.libs.user_configuration_service;
        var loadingSpinner = jse.libs.loading_spinner;
        var userId = data.userId;
        var translator = jse.core.lang;

        // Create a new instance and load settings.
        var settingsModal = new SettingsModalController(done, $this, userCfgService, loadingSpinner, userId, translator);

        settingsModal.initialize();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1aWNrX2VkaXQvbW9kYWxzL3NldHRpbmdzLmpzIl0sIm5hbWVzIjpbImd4IiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJqc2UiLCJzb3VyY2UiLCJkYXRhIiwiJHRoaXMiLCIkIiwiU2V0dGluZ3NNb2RhbENvbnRyb2xsZXIiLCJkb25lIiwiJGVsZW1lbnQiLCJ1c2VyQ2ZnU2VydmljZSIsImxvYWRpbmdTcGlubmVyIiwidXNlcklkIiwidHJhbnNsYXRvciIsIiRzdWJtaXRCdXR0b24iLCJmaW5kIiwiJHNldHRpbmdzIiwiJG1vZGFsIiwicGFyZW50cyIsIiRtb2RhbEZvb3RlciIsIiRyZXNldERlZmF1bHRMaW5rIiwiJHNwaW5uZXIiLCJzb3J0YWJsZUhhbmRsZVNlbGVjdG9yIiwicm93SGVpZ2h0VmFsdWVTZWxlY3RvciIsImVycm9yTWVzc2FnZUNsYXNzTmFtZSIsImxvYWRpbmdDbGFzc05hbWUiLCJzZXR0aW5nTGlzdEl0ZW1JZFByZWZpeCIsInNldHRpbmdWYWx1ZUlkUHJlZml4IiwiQ09ORklHX0tFWV9DT0xVTU5fU0VUVElOR1MiLCJDT05GSUdfS0VZX1JPV19IRUlHSFRfU0VUVElOR1MiLCJERUZBVUxUX1JPV19IRUlHSFRfU0VUVElORyIsIkRFRkFVTFRfQ09MVU1OX1NFVFRJTkdTIiwib24iLCJfb25TdWJtaXRCdXR0b25DbGljayIsIl9vblJlc2V0U2V0dGluZ3NMaW5rQ2xpY2siLCJldmVudCIsIl9vbk1vZGFsU2hvdyIsIl9vbk1vZGFsU2hvd24iLCJhZGRDbGFzcyIsIl9yZWZyZXNoU2V0dGluZ3MiLCJfY2xlYXJFcnJvck1lc3NhZ2UiLCJfaW5pdFNvcnRhYmxlIiwib3B0aW9ucyIsIml0ZW1zIiwiYXhpcyIsImN1cnNvciIsImhhbmRsZSIsImNvbnRhaW5tZW50Iiwic29ydGFibGUiLCJkaXNhYmxlU2VsZWN0aW9uIiwicmVtb3ZlUHJlZml4SXRlcmF0b3IiLCJpdGVtIiwicmVwbGFjZSIsImZpbHRlckl0ZXJhdG9yIiwiaXMiLCJtYXAiLCJmaWx0ZXIiLCJ2YWwiLCJjb2x1bW5TZXR0aW5ncyIsIl9zZXJpYWxpemVDb2x1bW5TZXR0aW5ncyIsInJvd0hlaWdodFNldHRpbmciLCJfc2VyaWFsaXplUm93SGVpZ2h0U2V0dGluZyIsIl90b2dnbGVMb2FkaW5nU3Bpbm5lciIsIl9zYXZlQ29sdW1uU2V0dGluZ3MiLCJ0aGVuIiwiX3NhdmVSb3dIZWlnaHRTZXR0aW5nIiwiX29uU2F2ZVN1Y2Nlc3MiLCJjYXRjaCIsIl9vblNhdmVFcnJvciIsInByZXZlbnREZWZhdWx0Iiwic3RvcFByb3BhZ2F0aW9uIiwiX3NldERlZmF1bHRTZXR0aW5ncyIsImRvU2hvdyIsInNob3ciLCJjc3MiLCJyZW1vdmVDbGFzcyIsImhpZGUiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInJlbG9hZCIsIiRlcnJvck1lc3NhZ2UiLCJsZW5ndGgiLCJyZW1vdmUiLCJlcnJvck1lc3NhZ2UiLCJ0cmFuc2xhdGUiLCIkZXJyb3IiLCJjbGFzcyIsInRleHQiLCJwcmVwZW5kIiwiZmFkZUluIiwiY29uZmlndXJhdGlvbktleSIsIl9nZXRGcm9tVXNlckNmZ1NlcnZpY2UiLCJoYW5kbGVyIiwicmVzb2x2ZSIsInJlamVjdCIsIm9uRXJyb3IiLCJvblN1Y2Nlc3MiLCJyZXNwb25zZSIsImNvbmZpZ3VyYXRpb25WYWx1ZSIsImdldCIsIlByb21pc2UiLCJzZXQiLCJBcnJheSIsImlzQXJyYXkiLCJFcnJvciIsIkpTT04iLCJzdHJpbmdpZnkiLCJfc2V0V2l0aFVzZXJDZmdTZXJ2aWNlIiwib25SZWZyZXNoU2V0dGluZ3NFcnJvciIsImNvbnNvbGUiLCJ3YXJuIiwiZXJyb3IiLCJfZ2V0Um93SGVpZ2h0U2V0dGluZyIsIl9zZXRSb3dIZWlnaHQiLCJyb3dIZWlnaHRWYWx1ZSIsIl9nZXRDb2x1bW5TZXR0aW5ncyIsIl9zZXRDb2x1bW5TZXR0aW5ncyIsInZhbHVlIiwiRVNDQVBFX0NIQVIiLCJwYXJzZSIsIiRzb3J0ZWRJdGVtcyIsInNldHRpbmdJdGVyYXRvciIsImlkIiwic2V0dGluZyIsIiRsaXN0SXRlbSIsIiRjaGVja2JveCIsInBhcmVudCIsInRyaWdnZXIiLCJhcHBlbmRUbyIsImZvckVhY2giLCJjaGlsZHJlbiIsInByZXBlbmRUbyIsInJvd0hlaWdodCIsImVhY2giLCJpbmRleCIsImVsZW1lbnQiLCJpbml0IiwibGlicyIsInVzZXJfY29uZmlndXJhdGlvbl9zZXJ2aWNlIiwibG9hZGluZ19zcGlubmVyIiwiY29yZSIsImxhbmciLCJzZXR0aW5nc01vZGFsIiwiaW5pdGlhbGl6ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7OztBQU9BQSxHQUFHQyxXQUFILENBQWVDLE1BQWYsQ0FDSSxVQURKLEVBR0ksQ0FDT0MsSUFBSUMsTUFEWCwrQ0FFT0QsSUFBSUMsTUFGWCw4Q0FHSSw0QkFISixFQUlJLGlCQUpKLENBSEosRUFVSSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O0FBS0EsUUFBTUMsUUFBUUMsRUFBRSxJQUFGLENBQWQ7O0FBRUE7Ozs7O0FBS0EsUUFBTUwsU0FBUyxFQUFmOztBQUdBO0FBQ0E7QUFDQTs7QUFFQTs7OztBQTNCWSxRQThCTk0sdUJBOUJNO0FBK0JSOzs7Ozs7Ozs7O0FBVUEseUNBQVlDLElBQVosRUFBa0JDLFFBQWxCLEVBQTRCQyxjQUE1QixFQUE0Q0MsY0FBNUMsRUFBNERDLE1BQTVELEVBQW9FQyxVQUFwRSxFQUFnRjtBQUFBOztBQUM1RTtBQUNBLGlCQUFLSixRQUFMLEdBQWdCQSxRQUFoQjtBQUNBLGlCQUFLSyxhQUFMLEdBQXFCTCxTQUFTTSxJQUFULENBQWMsc0JBQWQsQ0FBckI7QUFDQSxpQkFBS0MsU0FBTCxHQUFpQlAsU0FBU00sSUFBVCxDQUFjLGFBQWQsQ0FBakI7QUFDQSxpQkFBS0UsTUFBTCxHQUFjUixTQUFTUyxPQUFULENBQWlCLFFBQWpCLENBQWQ7QUFDQSxpQkFBS0MsWUFBTCxHQUFvQlYsU0FBU00sSUFBVCxDQUFjLGVBQWQsQ0FBcEI7QUFD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MUI7QUFDQSxZQUFNRSxpQkFBaUJSLElBQUl1SSxJQUFKLENBQVNDLDBCQUFoQztBQUNBLFlBQU0vSCxpQkFBaUJULElBQUl1SSxJQUFKLENBQVNFLGVBQWhDO0FBQ0EsWUFBTS9ILFNBQVNSLEtBQUtRLE1BQXBCO0FBQ0EsWUFBTUMsYUFBYVgsSUFBSTBJLElBQUosQ0FBU0MsSUFBNUI7O0FBRUE7QUFDQSxZQUFNQyxnQkFBZ0IsSUFBSXZJLHVCQUFKLENBQTRCQyxJQUE1QixFQUFrQ0gsS0FBbEMsRUFBeUNLLGNBQXpDLEVBQXlEQyxjQUF6RCxFQUNsQkMsTUFEa0IsRUFDVkMsVUFEVSxDQUF0Qjs7QUFHQWlJLHNCQUFjQyxVQUFkO0FBQ0gsS0FaRDs7QUFjQSxXQUFPOUksTUFBUDtBQUNILENBanJCTCIsImZpbGUiOiJxdWlja19lZGl0L21vZGFscy9zZXR0aW5ncy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gc2V0dGluZ3MuanMgMjAxNi0xMC0xOVxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTYgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogSGFuZGxlcyB0aGUgc2V0dGluZ3MgbW9kYWwuXG4gKlxuICogSXQgcmV0cmlldmVzIHRoZSBzZXR0aW5ncyBkYXRhIHZpYSB0aGUgdXNlciBjb25maWd1cmF0aW9uIHNlcnZpY2UgYW5kIHNldHMgdGhlIHZhbHVlcy5cbiAqIFlvdSBhcmUgYWJsZSB0byBjaGFuZ2UgdGhlIGNvbHVtbiBzb3J0IG9yZGVyIGFuZCB0aGUgdmlzaWJpbGl0eSBvZiBlYWNoIGNvbHVtbi4gQWRkaXRpb25hbGx5XG4gKiB5b3UgY2FuIGNoYW5nZSB0aGUgaGVpZ2h0IG9mIHRoZSB0YWJsZSByb3dzLlxuICovXG5neC5jb250cm9sbGVycy5tb2R1bGUoXG4gICAgJ3NldHRpbmdzJyxcblxuICAgIFtcbiAgICAgICAgYCR7anNlLnNvdXJjZX0vdmVuZG9yL2pxdWVyeS11aS1kaXN0L2pxdWVyeS11aS5taW4uY3NzYCxcbiAgICAgICAgYCR7anNlLnNvdXJjZX0vdmVuZG9yL2pxdWVyeS11aS1kaXN0L2pxdWVyeS11aS5taW4uanNgLFxuICAgICAgICAndXNlcl9jb25maWd1cmF0aW9uX3NlcnZpY2UnLFxuICAgICAgICAnbG9hZGluZ19zcGlubmVyJ1xuICAgIF0sXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBJbnN0YW5jZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgbW9kdWxlID0ge307XG5cblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBGVU5DVElPTlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2xhc3MgcmVwcmVzZW50aW5nIGEgY29udHJvbGxlciBmb3IgdGhlIFF1aWNrRWRpdCBvdmVydmlldyBzZXR0aW5ncyBtb2RhbC5cbiAgICAgICAgICovXG4gICAgICAgIGNsYXNzIFNldHRpbmdzTW9kYWxDb250cm9sbGVyIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBRdWlja0VkaXRPdmVydmlld1NldHRpbmdzTW9kYWxDb250cm9sbGVyLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259ICBkb25lICAgICAgICAgICAgTW9kdWxlIGZpbmlzaCBjYWxsYmFjayBmdW5jdGlvbi5cbiAgICAgICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAgICAkZWxlbWVudCAgICAgICAgTW9kdWxlIGVsZW1lbnQuXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gICAgdXNlckNmZ1NlcnZpY2UgIFVzZXIgY29uZmlndXJhdGlvbiBzZXJ2aWNlIGxpYnJhcnkuXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gICAgbG9hZGluZ1NwaW5uZXIgIExvYWRpbmcgc3Bpbm5lciBsaWJyYXJ5LlxuICAgICAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9ICAgIHVzZXJJZCAgICAgICAgICBJRCBvZiBjdXJyZW50bHkgc2lnbmVkIGluIHVzZXIuXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gICAgdHJhbnNsYXRvciAgICAgIFRyYW5zbGF0b3IgbGlicmFyeS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3RydWN0b3IoZG9uZSwgJGVsZW1lbnQsIHVzZXJDZmdTZXJ2aWNlLCBsb2FkaW5nU3Bpbm5lciwgdXNlcklkLCB0cmFuc2xhdG9yKSB7XG4gICAgICAgICAgICAgICAgLy8gRWxlbWVudHNcbiAgICAgICAgICAgICAgICB0aGlzLiRlbGVtZW50ID0gJGVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy4kc3VibWl0QnV0dG9uID0gJGVsZW1lbnQuZmluZCgnYnV0dG9uLnN1Ym1pdC1idXR0b24nKTtcbiAgICAgICAgICAgICAgICB0aGlzLiRzZXR0aW5ncyA9ICRlbGVtZW50LmZpbmQoJ3VsLnNldHRpbmdzJyk7XG4gICAgICAgICAgICAgICAgdGhpcy4kbW9kYWwgPSAkZWxlbWVudC5wYXJlbnRzKCcubW9kYWwnKTtcbiAgICAgICAgICAgICAgICB0aGlzLiRtb2RhbEZvb3RlciA9ICRlbGVtZW50LmZpbmQoJy5tb2RhbC1mb290ZXInKTtcbiAgICAgICAgICAgICAgICB0aGlzLiRyZXNldERlZmF1bHRMaW5rID0gJGVsZW1lbnQuZmluZCgnYS5yZXNldC1hY3Rpb24nKTtcblxuICAgICAgICAgICAgICAgIC8vIExvYWRpbmcgc3Bpbm5lclxuICAgICAgICAgICAgICAgIHRoaXMuJHNwaW5uZXIgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgLy8gU2VsZWN0b3Igc3RyaW5nc1xuICAgICAgICAgICAgICAgIHRoaXMuc29ydGFibGVIYW5kbGVTZWxlY3RvciA9ICdzcGFuLnNvcnQtaGFuZGxlJztcbiAgICAgICAgICAgICAgICB0aGlzLnJvd0hlaWdodFZhbHVlU2VsZWN0b3IgPSAnc2VsZWN0I3NldHRpbmctdmFsdWUtcm93LWhlaWdodCc7XG5cbiAgICAgICAgICAgICAgICAvLyBDbGFzcyBuYW1lc1xuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JNZXNzYWdlQ2xhc3NOYW1lID0gJ2Vycm9yLW1lc3NhZ2UnO1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZGluZ0NsYXNzTmFtZSA9ICdsb2FkaW5nJztcblxuICAgICAgICAgICAgICAgIC8vIExpYnJhcmllc1xuICAgICAgICAgICAgICAgIHRoaXMudXNlckNmZ1NlcnZpY2UgPSB1c2VyQ2ZnU2VydmljZTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRpbmdTcGlubmVyID0gbG9hZGluZ1NwaW5uZXI7XG4gICAgICAgICAgICAgICAgdGhpcy50cmFuc2xhdG9yID0gdHJhbnNsYXRvcjtcblxuICAgICAgICAgICAgICAgIC8vIFByZWZpeGVzXG4gICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5nTGlzdEl0ZW1JZFByZWZpeCA9ICdzZXR0aW5nLSc7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5nVmFsdWVJZFByZWZpeCA9ICdzZXR0aW5nLXZhbHVlLSc7XG5cbiAgICAgICAgICAgICAgICAvLyBVc2VyIGNvbmZpZ3VyYXRpb24ga2V5c1xuICAgICAgICAgICAgICAgIHRoaXMuQ09ORklHX0tFWV9DT0xVTU5fU0VUVElOR1MgPSAncXVpY2tFZGl0T3ZlcnZpZXdTZXR0aW5nc0NvbHVtbnMnO1xuICAgICAgICAgICAgICAgIHRoaXMuQ09ORklHX0tFWV9ST1dfSEVJR0hUX1NFVFRJTkdTID0gJ3F1aWNrRWRpdE92ZXJ2aWV3U2V0dGluZ3NSb3dIZWlnaHQnO1xuXG4gICAgICAgICAgICAgICAgLy8gRGVmYXVsdCB2YWx1ZXNcbiAgICAgICAgICAgICAgICB0aGlzLkRFRkFVTFRfUk9XX0hFSUdIVF9TRVRUSU5HID0gJ2xhcmdlJztcbiAgICAgICAgICAgICAgICB0aGlzLkRFRkFVTFRfQ09MVU1OX1NFVFRJTkdTID0gW1xuICAgICAgICAgICAgICAgICAgICAnY2F0ZWdvcnknLFxuICAgICAgICAgICAgICAgICAgICAnbmFtZScsXG4gICAgICAgICAgICAgICAgICAgICdtb2RlbCcsXG4gICAgICAgICAgICAgICAgICAgICdxdWFudGl0eScsXG4gICAgICAgICAgICAgICAgICAgICdwcmljZScsXG4gICAgICAgICAgICAgICAgICAgICdkaXNjb3VudCcsXG4gICAgICAgICAgICAgICAgICAgICdzcGVjaWFsUHJpY2UnLFxuICAgICAgICAgICAgICAgICAgICAndGF4JyxcbiAgICAgICAgICAgICAgICAgICAgJ3NoaXBwaW5nU3RhdHVzTmFtZScsXG4gICAgICAgICAgICAgICAgICAgICd3ZWlnaHQnLFxuICAgICAgICAgICAgICAgICAgICAnc2hpcHBpbmdDb3N0cycsXG4gICAgICAgICAgICAgICAgICAgICdzdGF0dXMnXG4gICAgICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgICAgIC8vIElEIG9mIGN1cnJlbnRseSBzaWduZWQgaW4gdXNlci5cbiAgICAgICAgICAgICAgICB0aGlzLnVzZXJJZCA9IHVzZXJJZDtcblxuICAgICAgICAgICAgICAgIC8vIENhbGwgbW9kdWxlIGZpbmlzaCBjYWxsYmFjay5cbiAgICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQmluZHMgdGhlIGV2ZW50IGhhbmRsZXJzLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEByZXR1cm4ge1NldHRpbmdzTW9kYWxDb250cm9sbGVyfSBTYW1lIGluc3RhbmNlIGZvciBtZXRob2QgY2hhaW5pbmcuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGluaXRpYWxpemUoKSB7XG4gICAgICAgICAgICAgICAgLy8gQXR0YWNoIGV2ZW50IGhhbmRsZXIgZm9yIGNsaWNrIGFjdGlvbiBvbiB0aGUgc3VibWl0IGJ1dHRvbi5cbiAgICAgICAgICAgICAgICB0aGlzLiRzdWJtaXRCdXR0b24ub24oJ2NsaWNrJywgZXZlbnQgPT4gdGhpcy5fb25TdWJtaXRCdXR0b25DbGljaygpKTtcblxuICAgICAgICAgICAgICAgIC8vIEF0dGFjaCBldmVudCBoYW5kbGVyIGZvciBjbGljayBhY3Rpb24gb24gdGhlIHJlc2V0LWRlZmF1bHQgbGluay5cbiAgICAgICAgICAgICAgICB0aGlzLiRyZXNldERlZmF1bHRMaW5rLm9uKCdjbGljaycsIGV2ZW50ID0+IHRoaXMuX29uUmVzZXRTZXR0aW5nc0xpbmtDbGljayhldmVudCkpO1xuXG4gICAgICAgICAgICAgICAgLy8gQXR0YWNoIGV2ZW50IGhhbmRsZXJzIHRvIG1vZGFsLlxuICAgICAgICAgICAgICAgIHRoaXMuJG1vZGFsXG4gICAgICAgICAgICAgICAgICAgIC5vbignc2hvdy5icy5tb2RhbCcsIGV2ZW50ID0+IHRoaXMuX29uTW9kYWxTaG93KCkpXG4gICAgICAgICAgICAgICAgICAgIC5vbignc2hvd24uYnMubW9kYWwnLCBldmVudCA9PiB0aGlzLl9vbk1vZGFsU2hvd24oKSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBGYWRlcyBvdXQgdGhlIG1vZGFsIGNvbnRlbnQuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHJldHVybiB7U2V0dGluZ3NNb2RhbENvbnRyb2xsZXJ9IFNhbWUgaW5zdGFuY2UgZm9yIG1ldGhvZCBjaGFpbmluZy5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBfb25Nb2RhbFNob3coKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5hZGRDbGFzcyh0aGlzLmxvYWRpbmdDbGFzc05hbWUpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogVXBkYXRlcyB0aGUgc2V0dGluZ3MsIGNsZWFycyBhbnkgZXJyb3IgbWVzc2FnZXMgYW5kIGluaXRpYWxpemVzIHRoZSBzb3J0YWJsZSBwbHVnaW4uXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHJldHVybiB7U2V0dGluZ3NNb2RhbENvbnRyb2xsZXJ9IFNhbWUgaW5zdGFuY2UgZm9yIG1ldGhvZCBjaGFpbmluZy5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBfb25Nb2RhbFNob3duKCkge1xuICAgICAgICAgICAgICAgIHRoaXNcbiAgICAgICAgICAgICAgICAgICAgLl9yZWZyZXNoU2V0dGluZ3MoKVxuICAgICAgICAgICAgICAgICAgICAuX2NsZWFyRXJyb3JNZXNzYWdlKClcbiAgICAgICAgICAgICAgICAgICAgLl9pbml0U29ydGFibGUoKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEFjdGl2YXRlcyB0aGUgalF1ZXJ5IFVJIFNvcnRhYmxlIHBsdWdpbiBvbiB0aGUgc2V0dGluZyBsaXN0IGl0ZW1zIGVsZW1lbnQuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHJldHVybiB7U2V0dGluZ3NNb2RhbENvbnRyb2xsZXJ9IFNhbWUgaW5zdGFuY2UgZm9yIG1ldGhvZCBjaGFpbmluZy5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBfaW5pdFNvcnRhYmxlKCkge1xuICAgICAgICAgICAgICAgIC8vIGpRdWVyeSBVSSBTb3J0YWJsZSBwbHVnaW4gb3B0aW9ucy5cbiAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICBpdGVtczogJz4gbGknLFxuICAgICAgICAgICAgICAgICAgICBheGlzOiAneScsXG4gICAgICAgICAgICAgICAgICAgIGN1cnNvcjogJ21vdmUnLFxuICAgICAgICAgICAgICAgICAgICBoYW5kbGU6IHRoaXMuc29ydGFibGVIYW5kbGVTZWxlY3RvcixcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbm1lbnQ6ICdwYXJlbnQnXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIC8vIEFjdGl2YXRlIHNvcnRhYmxlIHBsdWdpbi5cbiAgICAgICAgICAgICAgICB0aGlzLiRzZXR0aW5nc1xuICAgICAgICAgICAgICAgICAgICAuc29ydGFibGUob3B0aW9ucylcbiAgICAgICAgICAgICAgICAgICAgLmRpc2FibGVTZWxlY3Rpb24oKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFJldHVybnMgYSBzb3J0ZWQgYXJyYXkgY29udGFpbmluZyB0aGUgSURzIG9mIGFsbCBhY3RpdmF0ZWQgc2V0dGluZ3MuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgX3NlcmlhbGl6ZUNvbHVtblNldHRpbmdzKCkge1xuICAgICAgICAgICAgICAgIC8vIE1hcCBpdGVyYXRvciBmdW5jdGlvbiB0byByZW1vdmUgdGhlICdzZXR0aW5nLScgcHJlZml4IGZyb20gbGlzdCBpdGVtIElELlxuICAgICAgICAgICAgICAgIGNvbnN0IHJlbW92ZVByZWZpeEl0ZXJhdG9yID0gaXRlbSA9PiBpdGVtLnJlcGxhY2UodGhpcy5zZXR0aW5nTGlzdEl0ZW1JZFByZWZpeCwgJycpO1xuXG4gICAgICAgICAgICAgICAgLy8gRmlsdGVyIGl0ZXJhdG9yIGZ1bmN0aW9uLCB0byBhY2NlcHQgb25seSBsaXN0IGl0ZW1zIHdpdGggYWN0aXZhdGVkIGNoZWNrYm94ZXMuXG4gICAgICAgICAgICAgICAgY29uc3QgZmlsdGVySXRlcmF0b3IgPSBpdGVtID0+IHRoaXMuJHNldHRpbmdzLmZpbmQoJyMnICsgdGhpcy5zZXR0aW5nVmFsdWVJZFByZWZpeCArIGl0ZW0pXG4gICAgICAgICAgICAgICAgICAgIC5pcygnOmNoZWNrZWQnKTtcblxuICAgICAgICAgICAgICAgIC8vIFJldHVybiBhcnJheSB3aXRoIHNvcnRlZCwgb25seSBhY3RpdmUgY29sdW1ucy5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy4kc2V0dGluZ3NcbiAgICAgICAgICAgICAgICAgICAgLnNvcnRhYmxlKCd0b0FycmF5JylcbiAgICAgICAgICAgICAgICAgICAgLm1hcChyZW1vdmVQcmVmaXhJdGVyYXRvcilcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihmaWx0ZXJJdGVyYXRvcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogUmV0dXJucyB0aGUgdmFsdWUgb2YgdGhlIHNlbGVjdGVkIHJvdyBoZWlnaHQgb3B0aW9uLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBfc2VyaWFsaXplUm93SGVpZ2h0U2V0dGluZygpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgICAgICAgICAgICAgICAuJGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgLmZpbmQodGhpcy5yb3dIZWlnaHRWYWx1ZVNlbGVjdG9yKVxuICAgICAgICAgICAgICAgICAgICAudmFsKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogU2hvd3MgdGhlIGxvYWRpbmcgc3Bpbm5lciwgc2F2ZXMgdGhlIHNldHRpbmdzIHRvIHRoZSB1c2VyIGNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICAgKiBjbG9zZXMgdGhlIG1vZGFsIHRvIGZpbmFsbHkgcmUtcmVuZGVyIHRoZSBkYXRhdGFibGUuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHJldHVybiB7U2V0dGluZ3NNb2RhbENvbnRyb2xsZXJ9IFNhbWUgaW5zdGFuY2UgZm9yIG1ldGhvZCBjaGFpbmluZy5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBfb25TdWJtaXRCdXR0b25DbGljaygpIHtcbiAgICAgICAgICAgICAgICAvLyBSZXRyaWV2ZSBzZXR0aW5nIHZhbHVlcy5cbiAgICAgICAgICAgICAgICBjb25zdCBjb2x1bW5TZXR0aW5ncyA9IHRoaXMuX3NlcmlhbGl6ZUNvbHVtblNldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgY29uc3Qgcm93SGVpZ2h0U2V0dGluZyA9IHRoaXMuX3NlcmlhbGl6ZVJvd0hlaWdodFNldHRpbmcoKTtcblxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBhbnkgZXJyb3IgbWVzc2FnZSBhbmQgc2F2ZSBzZXR0aW5ncy5cbiAgICAgICAgICAgICAgICB0aGlzXG4gICAgICAgICAgICAgICAgICAgIC5fdG9nZ2xlTG9hZGluZ1NwaW5uZXIodHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgLl9jbGVhckVycm9yTWVzc2FnZSgpXG4gICAgICAgICAgICAgICAgICAgIC5fc2F2ZUNvbHVtblNldHRpbmdzKGNvbHVtblNldHRpbmdzKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB0aGlzLl9zYXZlUm93SGVpZ2h0U2V0dGluZyhyb3dIZWlnaHRTZXR0aW5nKSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy5fb25TYXZlU3VjY2VzcygpKVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKCkgPT4gdGhpcy5fb25TYXZlRXJyb3IoKSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBQcmV2ZW50cyB0aGUgYnJvd3NlciB0byBhcHBseSB0aGUgZGVmYXVsdCBiZWhhdm9pciBhbmRcbiAgICAgICAgICAgICAqIHJlc2V0cyB0aGUgY29sdW1uIG9yZGVyIGFuZCByb3cgc2l6ZSB0byB0aGUgZGVmYXVsdCBzZXR0aW5nIHZhbHVlcy5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gZXZlbnQgRmlyZWQgZXZlbnQuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHJldHVybiB7U2V0dGluZ3NNb2RhbENvbnRyb2xsZXJ9IFNhbWUgaW5zdGFuY2UgZm9yIG1ldGhvZCBjaGFpbmluZy5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBfb25SZXNldFNldHRpbmdzTGlua0NsaWNrKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgLy8gUHJldmVudCBkZWZhdWx0IGJlaGF2aW9yLlxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBSZXNldCB0byBkZWZhdWx0IHNldHRpbmdzLlxuICAgICAgICAgICAgICAgIHRoaXMuX3NldERlZmF1bHRTZXR0aW5ncygpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogU2hvd3MgYW5kIGhpZGVzIHRoZSBsb2FkaW5nIHNwaW5uZXIuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHBhcmFtIHtCb29sZWFufSBkb1Nob3cgU2hvdyB0aGUgbG9hZGluZyBzcGlubmVyP1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEByZXR1cm4ge1NldHRpbmdzTW9kYWxDb250cm9sbGVyfSBTYW1lIGluc3RhbmNlIGZvciBtZXRob2QgY2hhaW5pbmcuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIF90b2dnbGVMb2FkaW5nU3Bpbm5lcihkb1Nob3cpIHtcbiAgICAgICAgICAgICAgICBpZiAoZG9TaG93KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEZhZGUgb3V0IG1vZGFsIGNvbnRlbnQuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQuYWRkQ2xhc3ModGhpcy5sb2FkaW5nQ2xhc3NOYW1lKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBTaG93IGxvYWRpbmcgc3Bpbm5lci5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kc3Bpbm5lciA9IHRoaXMubG9hZGluZ1NwaW5uZXIuc2hvdyh0aGlzLiRlbGVtZW50KTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBGaXggc3Bpbm5lciB6LWluZGV4LlxuICAgICAgICAgICAgICAgICAgICB0aGlzLiRzcGlubmVyLmNzcyh7J3otaW5kZXgnOiA5OTk5fSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRmFkZSBvdXQgbW9kYWwgY29udGVudC5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5yZW1vdmVDbGFzcyh0aGlzLmxvYWRpbmdDbGFzc05hbWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIEhpZGUgdGhlIGxvYWRpbmcgc3Bpbm5lci5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkaW5nU3Bpbm5lci5oaWRlKHRoaXMuJHNwaW5uZXIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEhhbmRsZXMgdGhlIGJlaGF2aW9yIG9uIHN1Y2Nlc3NmdWwgc2V0dGluZyBzYXZlIGFjdGlvbi5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAcmV0dXJuIHtTZXR0aW5nc01vZGFsQ29udHJvbGxlcn0gU2FtZSBpbnN0YW5jZSBmb3IgbWV0aG9kIGNoYWluaW5nLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIF9vblNhdmVTdWNjZXNzKCkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBSZW1vdmVzIGFueSBlcnJvciBtZXNzYWdlLCBpZiBmb3VuZC5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAcmV0dXJuIHtTZXR0aW5nc01vZGFsQ29udHJvbGxlcn0gU2FtZSBpbnN0YW5jZSBmb3IgbWV0aG9kIGNoYWluaW5nLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIF9jbGVhckVycm9yTWVzc2FnZSgpIHtcbiAgICAgICAgICAgICAgICAvLyBFcnJvciBtZXNzYWdlLlxuICAgICAgICAgICAgICAgIGNvbnN0ICRlcnJvck1lc3NhZ2UgPSB0aGlzLiRtb2RhbEZvb3Rlci5maW5kKGAuJHt0aGlzLmVycm9yTWVzc2FnZUNsYXNzTmFtZX1gKTtcblxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBpZiBpdCBleGlzdHMuXG4gICAgICAgICAgICAgICAgaWYgKCRlcnJvck1lc3NhZ2UubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICRlcnJvck1lc3NhZ2UucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSGFuZGxlcyB0aGUgYmVoYXZpb3Igb24gdGhyb3duIGVycm9yIHdoaWxlIHNhdmluZyBzZXR0aW5ncy5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAcmV0dXJuIHtTZXR0aW5nc01vZGFsQ29udHJvbGxlcn0gU2FtZSBpbnN0YW5jZSBmb3IgbWV0aG9kIGNoYWluaW5nLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIF9vblNhdmVFcnJvcigpIHtcbiAgICAgICAgICAgICAgICAvLyBFcnJvciBtZXNzYWdlLlxuICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IHRoaXMudHJhbnNsYXRvci50cmFuc2xhdGUoJ1RYVF9TQVZFX0VSUk9SJywgJ2FkbWluX2dlbmVyYWwnKTtcblxuICAgICAgICAgICAgICAgIC8vIERlZmluZSBlcnJvciBtZXNzYWdlIGVsZW1lbnQuXG4gICAgICAgICAgICAgICAgY29uc3QgJGVycm9yID0gJCgnPHNwYW4vPicsIHtjbGFzczogdGhpcy5lcnJvck1lc3NhZ2VDbGFzc05hbWUsIHRleHQ6IGVycm9yTWVzc2FnZX0pO1xuXG4gICAgICAgICAgICAgICAgLy8gSGlkZSB0aGUgbG9hZGluZyBzcGlubmVyLlxuICAgICAgICAgICAgICAgIHRoaXMuX3RvZ2dsZUxvYWRpbmdTcGlubmVyKGZhbHNlKTtcblxuICAgICAgICAgICAgICAgIC8vIEFkZCBlcnJvciBtZXNzYWdlIHRvIG1vZGFsIGZvb3Rlci5cbiAgICAgICAgICAgICAgICB0aGlzLiRtb2RhbEZvb3RlclxuICAgICAgICAgICAgICAgICAgICAucHJlcGVuZCgkZXJyb3IpXG4gICAgICAgICAgICAgICAgICAgIC5oaWRlKClcbiAgICAgICAgICAgICAgICAgICAgLmZhZGVJbigpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogUmV0dXJucyB0aGUgY29uZmlndXJhdGlvbiB2YWx1ZSBmb3IgdGhlIGNvbHVtbiBzZXR0aW5ncy5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIF9nZXRDb2x1bW5TZXR0aW5ncygpIHtcbiAgICAgICAgICAgICAgICAvLyBDb25maWd1cmF0aW9uIGRhdGEuXG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgdXNlcklkOiB0aGlzLnVzZXJJZCxcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhdGlvbktleTogdGhpcy5DT05GSUdfS0VZX0NPTFVNTl9TRVRUSU5HU1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAvLyBSZXF1ZXN0IGRhdGEgZnJvbSB1c2VyIGNvbmZpZ3VyYXRpb24gc2VydmljZS5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2V0RnJvbVVzZXJDZmdTZXJ2aWNlKGRhdGEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFJldHVybnMgdGhlIGNvbmZpZ3VyYXRpb24gdmFsdWUgZm9yIHRoZSByb3cgaGVpZ2h0cy5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIF9nZXRSb3dIZWlnaHRTZXR0aW5nKCkge1xuICAgICAgICAgICAgICAgIC8vIENvbmZpZ3VyYXRpb24gZGF0YS5cbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICB1c2VySWQ6IHRoaXMudXNlcklkLFxuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uS2V5OiB0aGlzLkNPTkZJR19LRVlfUk9XX0hFSUdIVF9TRVRUSU5HU1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAvLyBSZXF1ZXN0IGRhdGEgZnJvbSB1c2VyIGNvbmZpZ3VyYXRpb24gc2VydmljZS5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2V0RnJvbVVzZXJDZmdTZXJ2aWNlKGRhdGEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFJldHVybnMgdGhlIHZhbHVlIGZvciB0aGUgcGFzc2VkIHVzZXIgY29uZmlndXJhdGlvbiBkYXRhLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhICAgICAgICAgICAgICAgICAgIFVzZXIgY29uZmlndXJhdGlvbiBkYXRhLlxuICAgICAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IGRhdGEudXNlcklkICAgICAgICAgICAgVXNlciBJRC5cbiAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhLmNvbmZpZ3VyYXRpb25LZXkgIFVzZXIgY29uZmlndXJhdGlvbiBrZXkuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBfZ2V0RnJvbVVzZXJDZmdTZXJ2aWNlKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAvLyBQcm9taXNlIGhhbmRsZXIuXG4gICAgICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9IChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVXNlciBjb25maWd1cmF0aW9uIHNlcnZpY2UgcmVxdWVzdCBvcHRpb25zLlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgb25FcnJvcjogKCkgPT4gcmVqZWN0KCksXG4gICAgICAgICAgICAgICAgICAgICAgICBvblN1Y2Nlc3M6IHJlc3BvbnNlID0+IHJlc29sdmUocmVzcG9uc2UuY29uZmlndXJhdGlvblZhbHVlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBHZXQgY29uZmlndXJhdGlvbiB2YWx1ZS5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy51c2VyQ2ZnU2VydmljZS5nZXQob3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShoYW5kbGVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBTYXZlcyB0aGUgZGF0YSB2aWEgdGhlIHVzZXIgY29uZmlndXJhdGlvbiBzZXJ2aWNlLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhICAgICAgICAgICAgICAgICAgICAgVXNlciBjb25maWd1cmF0aW9uIGRhdGEuXG4gICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gZGF0YS51c2VySWQgICAgICAgICAgICAgIFVzZXIgSUQuXG4gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YS5jb25maWd1cmF0aW9uS2V5ICAgIFVzZXIgY29uZmlndXJhdGlvbiBrZXkuXG4gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YS5jb25maWd1cmF0aW9uVmFsdWUgIFVzZXIgY29uZmlndXJhdGlvbiB2YWx1ZS5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIF9zZXRXaXRoVXNlckNmZ1NlcnZpY2UoZGF0YSkge1xuICAgICAgICAgICAgICAgIC8vIFByb21pc2UgaGFuZGxlci5cbiAgICAgICAgICAgICAgICBjb25zdCBoYW5kbGVyID0gKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBVc2VyIGNvbmZpZ3VyYXRpb24gc2VydmljZSByZXF1ZXN0IG9wdGlvbnMuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkVycm9yOiAoKSA9PiByZWplY3QoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uU3VjY2VzczogcmVzcG9uc2UgPT4gcmVzb2x2ZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFNldCBjb25maWd1cmF0aW9uIHZhbHVlLlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXJDZmdTZXJ2aWNlLnNldChvcHRpb25zKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGhhbmRsZXIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFNhdmVzIHRoZSBjb2x1bW4gc2V0dGluZ3MgdmlhIHRoZSB1c2VyIGNvbmZpZ3VyYXRpb24gc2VydmljZS5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBjb2x1bW5TZXR0aW5ncyBTb3J0ZWQgYXJyYXkgd2l0aCBhY3RpdmUgY29sdW1uLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgX3NhdmVDb2x1bW5TZXR0aW5ncyhjb2x1bW5TZXR0aW5ncykge1xuICAgICAgICAgICAgICAgIC8vIENoZWNrIGFyZ3VtZW50LlxuICAgICAgICAgICAgICAgIGlmICghY29sdW1uU2V0dGluZ3MgfHwgIUFycmF5LmlzQXJyYXkoY29sdW1uU2V0dGluZ3MpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBvciBpbnZhbGlkIGNvbHVtbiBzZXR0aW5ncycpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIFVzZXIgY29uZmlndXJhdGlvbiByZXF1ZXN0IGRhdGEuXG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgdXNlcklkOiB0aGlzLnVzZXJJZCxcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhdGlvbktleTogdGhpcy5DT05GSUdfS0VZX0NPTFVNTl9TRVRUSU5HUyxcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhdGlvblZhbHVlOiBKU09OLnN0cmluZ2lmeShjb2x1bW5TZXR0aW5ncylcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgLy8gU2F2ZSB2aWEgdXNlciBjb25maWd1cmF0aW9uIHNlcnZpY2UuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NldFdpdGhVc2VyQ2ZnU2VydmljZShkYXRhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBTYXZlcyB0aGUgcm93IGhlaWdodCBzZXR0aW5nIHZpYSB0aGUgdXNlciBjb25maWd1cmF0aW9uIHNlcnZpY2UuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHJvd0hlaWdodFNldHRpbmcgVmFsdWUgb2YgdGhlIHNlbGVjdGVkIHJvdyBoZWlnaHQgc2V0dGluZy5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIF9zYXZlUm93SGVpZ2h0U2V0dGluZyhyb3dIZWlnaHRTZXR0aW5nKSB7XG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgYXJndW1lbnQuXG4gICAgICAgICAgICAgICAgaWYgKCFyb3dIZWlnaHRTZXR0aW5nIHx8IHR5cGVvZiByb3dIZWlnaHRTZXR0aW5nICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3Npbmcgb3IgaW52YWxpZCByb3cgaGVpZ2h0IHNldHRpbmcnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBVc2VyIGNvbmZpZ3VyYXRpb24gcmVxdWVzdCBkYXRhLlxuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJJZDogdGhpcy51c2VySWQsXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYXRpb25LZXk6IHRoaXMuQ09ORklHX0tFWV9ST1dfSEVJR0hUX1NFVFRJTkdTLFxuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uVmFsdWU6IHJvd0hlaWdodFNldHRpbmdcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgLy8gU2F2ZSB2aWEgdXNlciBjb25maWd1cmF0aW9uIHNlcnZpY2UuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NldFdpdGhVc2VyQ2ZnU2VydmljZShkYXRhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBSZXRyaWV2ZXMgdGhlIHNhdmVkIHNldHRpbmcgY29uZmlndXJhdGlvbiBhbmQgcmVvcmRlcnMvdXBkYXRlcyB0aGUgc2V0dGluZ3MuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHJldHVybiB7U2V0dGluZ3NNb2RhbENvbnRyb2xsZXJ9IFNhbWUgaW5zdGFuY2UgZm9yIG1ldGhvZCBjaGFpbmluZy5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBfcmVmcmVzaFNldHRpbmdzKCkge1xuICAgICAgICAgICAgICAgIC8vIFNob3cgbG9hZGluZyBzcGlubmVyLlxuICAgICAgICAgICAgICAgIHRoaXMuX3RvZ2dsZUxvYWRpbmdTcGlubmVyKHRydWUpO1xuXG4gICAgICAgICAgICAgICAgLy8gRXJyb3IgaGFuZGxlciBmdW5jdGlvbiB0byBzcGVjaWZ5IHRoZSBiZWhhdmlvciBvbiBlcnJvcnMgd2hpbGUgcHJvY2Vzc2luZy5cbiAgICAgICAgICAgICAgICBjb25zdCBvblJlZnJlc2hTZXR0aW5nc0Vycm9yID0gZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBPdXRwdXQgd2FybmluZy5cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdFcnJvciB3aGlsZSByZWZyZXNoaW5nJywgZXJyb3IpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIEhpZGUgdGhlIGxvYWRpbmcgc3Bpbm5lci5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdG9nZ2xlTG9hZGluZ1NwaW5uZXIoZmFsc2UpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgYW55IGVycm9yIG1lc3NhZ2UsIHNldCByb3cgaGVpZ2h0LFxuICAgICAgICAgICAgICAgIC8vIHJlb3JkZXIgYW5kIHVwZGF0ZSB0aGUgc2V0dGluZ3MgYW5kIGhpZGUgdGhlIGxvYWRpbmcgc3Bpbm5lci5cbiAgICAgICAgICAgICAgICB0aGlzXG4gICAgICAgICAgICAgICAgICAgIC5fY2xlYXJFcnJvck1lc3NhZ2UoKVxuICAgICAgICAgICAgICAgICAgICAuX2dldFJvd0hlaWdodFNldHRpbmcoKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihyb3dIZWlnaHRWYWx1ZSA9PiB0aGlzLl9zZXRSb3dIZWlnaHQocm93SGVpZ2h0VmFsdWUpKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB0aGlzLl9nZXRDb2x1bW5TZXR0aW5ncygpKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihjb2x1bW5TZXR0aW5ncyA9PiB0aGlzLl9zZXRDb2x1bW5TZXR0aW5ncyhjb2x1bW5TZXR0aW5ncykpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHRoaXMuX3RvZ2dsZUxvYWRpbmdTcGlubmVyKGZhbHNlKSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKG9uUmVmcmVzaFNldHRpbmdzRXJyb3IpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogU2V0cyB0aGUgcm93IGhlaWdodCBzZXR0aW5nIHZhbHVlLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZSBSb3cgaGVpZ2h0IHZhbHVlLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEByZXR1cm4ge1NldHRpbmdzTW9kYWxDb250cm9sbGVyfSBTYW1lIGluc3RhbmNlIGZvciBtZXRob2QgY2hhaW5pbmcuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgX3NldFJvd0hlaWdodCh2YWx1ZSA9IHRoaXMuREVGQVVMVF9ST1dfSEVJR0hUX1NFVFRJTkcpIHtcbiAgICAgICAgICAgICAgICB0aGlzXG4gICAgICAgICAgICAgICAgICAgIC4kZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICAuZmluZCh0aGlzLnJvd0hlaWdodFZhbHVlU2VsZWN0b3IpXG4gICAgICAgICAgICAgICAgICAgIC52YWwodmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogUmVvcmRlcnMgYW5kIHVwZGF0ZXMgdGhlIGNvbHVtbiBzZXR0aW5nIHZhbHVlcy5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gY29sdW1uU2V0dGluZ3MgRW5jb2RlZCBKU09OIGFycmF5IGNvbnRhaW5pbmcgdGhlIHNhdmVkIGNvbHVtbiBzZXR0aW5ncy5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAcmV0dXJuIHtTZXR0aW5nc01vZGFsQ29udHJvbGxlcn0gU2FtZSBpbnN0YW5jZSBmb3IgbWV0aG9kIGNoYWluaW5nLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIF9zZXRDb2x1bW5TZXR0aW5ncyhjb2x1bW5TZXR0aW5ncyA9IHRoaXMuREVGQVVMVF9DT0xVTU5fU0VUVElOR1MpIHtcbiAgICAgICAgICAgICAgICAvLyBSZWdleCBmb3IgZXNjYXBlIGNoYXJhY3Rlci5cbiAgICAgICAgICAgICAgICBjb25zdCBFU0NBUEVfQ0hBUiA9IC9cXFxcL2c7XG5cbiAgICAgICAgICAgICAgICAvLyBObyBuZWVkIHRvIHBhcnNlIGZyb20gSlNPTiBvbiBkZWZhdWx0IHZhbHVlIGFzIGl0IGlzIGFuIGFycmF5LlxuICAgICAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheShjb2x1bW5TZXR0aW5ncykpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gUmVtb3ZlIGVzY2FwZSBjaGFyYWN0ZXJzIGZyb20gYW5kIHBhcnNlIGFycmF5IGZyb20gSlNPTi5cbiAgICAgICAgICAgICAgICAgICAgY29sdW1uU2V0dGluZ3MgPSBjb2x1bW5TZXR0aW5ncy5yZXBsYWNlKEVTQ0FQRV9DSEFSLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbHVtblNldHRpbmdzID0gSlNPTi5wYXJzZShjb2x1bW5TZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gQ2FjaGUgY29udGFpbmVyIHRvIHRlbXBvcmFyaWx5IGhvbGQgYWxsIGFjdGl2ZSBsaXN0IGl0ZW1zIGluIHNvcnRlZCBvcmRlci5cbiAgICAgICAgICAgICAgICAvLyBUaGUgY2hpbGRyZW4gb2YgdGhpcyBlbGVtZW50IHdpbGwgYmUgcHJlcGVuZGVkIHRvIHRoZSBzZXR0aW5nIGxpc3QgaXRlbSBjb250YWluZXIgdG8gcmV0YWluIHRoZVxuICAgICAgICAgICAgICAgIC8vIHNvcnRpbmcgb3JkZXIuXG4gICAgICAgICAgICAgICAgY29uc3QgJHNvcnRlZEl0ZW1zID0gJCgnPGRpdi8+Jyk7XG5cbiAgICAgICAgICAgICAgICAvLyBJdGVyYXRvciBmdW5jdGlvbiB0byBwcmVwZW5kIGFjdGl2ZSBsaXN0IGl0ZW1zIHRvIHRoZSB0b3AgYW5kIGFjdGl2YXRlIHRoZSBjaGVja2JveC5cbiAgICAgICAgICAgICAgICBjb25zdCBzZXR0aW5nSXRlcmF0b3IgPSBzZXR0aW5nID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gTGlzdCBpdGVtIElELlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpZCA9IHRoaXMuc2V0dGluZ0xpc3RJdGVtSWRQcmVmaXggKyBzZXR0aW5nO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIEFmZmVjdGVkIHNldHRpbmcgbGlzdCBpdGVtLlxuICAgICAgICAgICAgICAgICAgICBjb25zdCAkbGlzdEl0ZW0gPSB0aGlzLiRzZXR0aW5ncy5maW5kKGAjJHtpZH1gKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBDaGVja2JveCBvZiBhZmZlY3RlZCBsaXN0IGl0ZW0uXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0ICRjaGVja2JveCA9ICRsaXN0SXRlbS5maW5kKCcjJyArIHRoaXMuc2V0dGluZ1ZhbHVlSWRQcmVmaXggKyBzZXR0aW5nKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBBY3RpdmF0ZSBjaGVja2JveC5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEkY2hlY2tib3guaXMoJzpjaGVja2VkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRjaGVja2JveC5wYXJlbnQoKS50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gTW92ZSB0byBjYWNoZSBjb250YWluZXIuXG4gICAgICAgICAgICAgICAgICAgICRsaXN0SXRlbS5hcHBlbmRUbygkc29ydGVkSXRlbXMpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAvLyBNb3ZlIGFjdGl2ZSBsaXN0IGl0ZW1zIHRvIHRoZSB0b3AgYmVhcmluZyB0aGUgc29ydGluZyBvcmRlciBpbiBtaW5kLlxuICAgICAgICAgICAgICAgIGNvbHVtblNldHRpbmdzLmZvckVhY2goc2V0dGluZ0l0ZXJhdG9yKTtcblxuICAgICAgICAgICAgICAgIC8vIFByZXBlbmQgY2FjaGVkIGVsZW1lbnRzIHRvIGl0ZW0gbGlzdC5cbiAgICAgICAgICAgICAgICAkc29ydGVkSXRlbXNcbiAgICAgICAgICAgICAgICAgICAgLmNoaWxkcmVuKClcbiAgICAgICAgICAgICAgICAgICAgLnByZXBlbmRUbyh0aGlzLiRzZXR0aW5ncyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBSZXNldHMgdGhlIGNvbHVtbiBvcmRlciBhbmQgcm93IGhlaWdodCBzZXR0aW5ncyB0byB0aGUgZGVmYXVsdC5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAcmV0dXJuIHtTZXR0aW5nc01vZGFsQ29udHJvbGxlcn0gU2FtZSBpbnN0YW5jZSBmb3IgbWV0aG9kIGNoYWluaW5nLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIF9zZXREZWZhdWx0U2V0dGluZ3MoKSB7XG4gICAgICAgICAgICAgICAgLy8gRGVmYXVsdCB2YWx1ZXMuXG4gICAgICAgICAgICAgICAgY29uc3QgY29sdW1uU2V0dGluZ3MgPSB0aGlzLkRFRkFVTFRfQ09MVU1OX1NFVFRJTkdTO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJvd0hlaWdodCA9IHRoaXMuREVGQVVMVF9ST1dfSEVJR0hUX1NFVFRJTkc7XG5cbiAgICAgICAgICAgICAgICAvLyBTZXQgY29sdW1uIHNldHRpbmdzLlxuICAgICAgICAgICAgICAgIC8vIENhY2hlIGNvbnRhaW5lciB0byB0ZW1wb3JhcmlseSBob2xkIGFsbCBhY3RpdmUgbGlzdCBpdGVtcyBpbiBzb3J0ZWQgb3JkZXIuXG4gICAgICAgICAgICAgICAgLy8gVGhlIGNoaWxkcmVuIG9mIHRoaXMgZWxlbWVudCB3aWxsIGJlIHByZXBlbmRlZCB0byB0aGUgc2V0dGluZyBsaXN0IGl0ZW0gY29udGFpbmVyIHRvIHJldGFpbiB0aGVcbiAgICAgICAgICAgICAgICAvLyBzb3J0aW5nIG9yZGVyLlxuICAgICAgICAgICAgICAgIGNvbnN0ICRzb3J0ZWRJdGVtcyA9ICQoJzxkaXYvPicpO1xuXG4gICAgICAgICAgICAgICAgLy8gSXRlcmF0b3IgZnVuY3Rpb24gdG8gcHJlcGVuZCBhY3RpdmUgbGlzdCBpdGVtcyB0byB0aGUgdG9wIGFuZCBhY3RpdmF0ZSB0aGUgY2hlY2tib3guXG4gICAgICAgICAgICAgICAgY29uc3Qgc2V0dGluZ0l0ZXJhdG9yID0gc2V0dGluZyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIExpc3QgaXRlbSBJRC5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaWQgPSB0aGlzLnNldHRpbmdMaXN0SXRlbUlkUHJlZml4ICsgc2V0dGluZztcblxuICAgICAgICAgICAgICAgICAgICAvLyBBZmZlY3RlZCBzZXR0aW5nIGxpc3QgaXRlbS5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgJGxpc3RJdGVtID0gdGhpcy4kc2V0dGluZ3MuZmluZChgIyR7aWR9YCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2tib3ggb2YgYWZmZWN0ZWQgbGlzdCBpdGVtLlxuICAgICAgICAgICAgICAgICAgICBjb25zdCAkY2hlY2tib3ggPSAkbGlzdEl0ZW0uZmluZCgnIycgKyB0aGlzLnNldHRpbmdWYWx1ZUlkUHJlZml4ICsgc2V0dGluZyk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQWN0aXZhdGUgY2hlY2tib3guXG4gICAgICAgICAgICAgICAgICAgIGlmICghJGNoZWNrYm94LmlzKCc6Y2hlY2tlZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkY2hlY2tib3gucGFyZW50KCkudHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIE1vdmUgdG8gY2FjaGUgY29udGFpbmVyLlxuICAgICAgICAgICAgICAgICAgICAkbGlzdEl0ZW0uYXBwZW5kVG8oJHNvcnRlZEl0ZW1zKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgLy8gRGVhY3RpdmF0ZSBhbGwgY2hlY2tib3hlcy5cbiAgICAgICAgICAgICAgICB0aGlzXG4gICAgICAgICAgICAgICAgICAgIC4kc2V0dGluZ3NcbiAgICAgICAgICAgICAgICAgICAgLmZpbmQoJzpjaGVja2JveCcpXG4gICAgICAgICAgICAgICAgICAgIC5lYWNoKChpbmRleCwgZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgJGNoZWNrYm94ID0gJChlbGVtZW50KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRjaGVja2JveC5pcygnOmNoZWNrZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRjaGVja2JveC5wYXJlbnQoKS50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIE1vdmUgYWN0aXZlIGxpc3QgaXRlbXMgdG8gdGhlIHRvcCBiZWFyaW5nIHRoZSBzb3J0aW5nIG9yZGVyIGluIG1pbmQuXG4gICAgICAgICAgICAgICAgY29sdW1uU2V0dGluZ3MuZm9yRWFjaChzZXR0aW5nSXRlcmF0b3IpO1xuXG4gICAgICAgICAgICAgICAgLy8gUHJlcGVuZCBjYWNoZWQgZWxlbWVudHMgdG8gaXRlbSBsaXN0LlxuICAgICAgICAgICAgICAgICRzb3J0ZWRJdGVtc1xuICAgICAgICAgICAgICAgICAgICAuY2hpbGRyZW4oKVxuICAgICAgICAgICAgICAgICAgICAucHJlcGVuZFRvKHRoaXMuJHNldHRpbmdzKTtcblxuICAgICAgICAgICAgICAgIC8vIFNldCByb3cgaGVpZ2h0LlxuICAgICAgICAgICAgICAgIHRoaXNcbiAgICAgICAgICAgICAgICAgICAgLiRlbGVtZW50XG4gICAgICAgICAgICAgICAgICAgIC5maW5kKHRoaXMucm93SGVpZ2h0VmFsdWVTZWxlY3RvcilcbiAgICAgICAgICAgICAgICAgICAgLnZhbChyb3dIZWlnaHQpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIC8vIERlcGVuZGVuY2llcy5cbiAgICAgICAgICAgIGNvbnN0IHVzZXJDZmdTZXJ2aWNlID0ganNlLmxpYnMudXNlcl9jb25maWd1cmF0aW9uX3NlcnZpY2U7XG4gICAgICAgICAgICBjb25zdCBsb2FkaW5nU3Bpbm5lciA9IGpzZS5saWJzLmxvYWRpbmdfc3Bpbm5lcjtcbiAgICAgICAgICAgIGNvbnN0IHVzZXJJZCA9IGRhdGEudXNlcklkO1xuICAgICAgICAgICAgY29uc3QgdHJhbnNsYXRvciA9IGpzZS5jb3JlLmxhbmc7XG5cbiAgICAgICAgICAgIC8vIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBhbmQgbG9hZCBzZXR0aW5ncy5cbiAgICAgICAgICAgIGNvbnN0IHNldHRpbmdzTW9kYWwgPSBuZXcgU2V0dGluZ3NNb2RhbENvbnRyb2xsZXIoZG9uZSwgJHRoaXMsIHVzZXJDZmdTZXJ2aWNlLCBsb2FkaW5nU3Bpbm5lcixcbiAgICAgICAgICAgICAgICB1c2VySWQsIHRyYW5zbGF0b3IpO1xuXG4gICAgICAgICAgICBzZXR0aW5nc01vZGFsLmluaXRpYWxpemUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
