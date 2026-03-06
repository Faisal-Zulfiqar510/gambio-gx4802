'use strict';

/* --------------------------------------------------------------
 table_inline_edit.js 2022-10-20 gm
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2022 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Extension for making tables editable.
 *
 * @module Admin/Extensions/table_inline_edit
 * @ignore
 */
gx.extensions.module('table_inline_edit', ['form', 'xhr', 'fallback'], function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLE DEFINITION
    // ------------------------------------------------------------------------

    var
    /**
     * Extension Reference
     *
     * @type {object}
     */
    $this = $(this),


    /**
     * Template Selector
     *
     * @type {object}
     */
    $template = null,


    /**
     * Table Body Selector
     *
     * @type {object}
     */
    $table_body = null,


    /**
     * Default Options for Extension
     *
     * @type {object}
     */
    defaults = {
        'multiEdit': false
    },


    /**
     * Final Extension Options
     *
     * @type {object}
     */
    options = $.extend(true, {}, defaults, data),


    /**
     * Module Object
     *
     * @type {object}
     */
    module = {};

    // ------------------------------------------------------------------------
    // FUNCTIONALITY
    // ------------------------------------------------------------------------

    /**
     * Switch State
     *
     * Function that enables / disables, depending on the mode, all input fields inside
     * the $element and shows / hides the corresponding buttons.
     *
     * @param {string} mode Set the given mode. Possible values: 'edit', 'add', 'default'
     * @param {object} $element The element jQuery selection that gets modified
     * @param {boolean} addClass If true, the state class gets added to the element
     */
    var _switchState = function _switchState(mode, $element, addClass) {

        var $targets = $element.find('input, textarea, select, button, i'),
            $edit = $targets.filter('.editmode'),
            $add = $targets.filter('.addmode'),
            $default = $targets.filter('.defaultmode'),
            $others = $targets.filter(':not(.editmode):not(.addmode):not(.defaultmode)');

        // Hide all buttons
        $edit.hide();
        $add.hide();
        $default.hide();

        // Remove alt-text if available
        $element.find('.table_inlineedit_alt').remove();

        switch (mode) {
            case 'edit':
                // Switch to edit mode
                $edit.show();
                $others.prop('disabled', false);
                break;
            case 'add':
                // Switch to add mode
                $add.show();
                $others.prop('disabled', false);
                break;
            default:
                // Switch to default-mode
                $default.show();
                $others.prop('disabled', true).each(function () {
                    // Check if there is an alt text given for the input field
                    var $self = $(this),
                        dataset = jse.libs.fallback._data($self, 'table_inline_edit');

                    // Replace some kind of form fields with span tags
                    if ($self.attr('type') && $self.attr('type').toLowerCase() === 'checkbox' && dataset.alt) {
                        var values = dataset.alt.split('_'),
                            checked = $self.prop('checked');
                        var valueText = checked ? values[0] : values[1];
                        valueText = String(valueText).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
                        $self.after('<span class="table_inlineedit_alt">' + valueText + '</span>');
                    } else if ($self.prop('tagName').toLowerCase() === 'select') {
                        var waitUntilValues = function waitUntilValues() {
                            $edit.hide();
                            if (!$self.children().length) {
                                setTimeout(function () {
                                    waitUntilValues();
                                }, 200);
                            } else {
                                $self.children('[value="' + $self.val() + '"]').text();
                                var _valueText = $self.children('[value="' + $self.val() + '"]').text();
                                _valueText = String(_valueText).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
                                $self.after('<span class="table_inlineedit_alt">' + _valueText + '</span>');
                                return;
                            }
                        };

                        waitUntilValues();
                    }
                });
                break;
        }

        $this.trigger('FORM_UPDATE', []);

        // Add the mode class
        if (addClass) {
            $element.removeClass('edit add default').addClass(mode);
        }
    };

    /**
     * Create New Line
     *
     * Creates a new "add"-line by cloning the footer template.
     */
    var _createNewLine = function _createNewLine() {
        var $newLine = $template.clone();

        $newLine.find('[name]').each(function () {
            var $self = $(this);

            $self.attr('name', $self.attr('name').replace('[]', '[0]'));
        });

        _switchState('add', $newLine, true);
        // Rename the temporarily widget data attributes
        jse.libs.fallback.setupWidgetAttr($newLine);
        $table_body.append($newLine);
        // Start the widgets
        gx.widgets.init($table_body.find('tr').last());
        gx.extensions.init($table_body.find('tr').last());
        gx.controllers.init($table_body.find('tr').last());
        gx.compatibility.init($table_body.find('tr').last());
        jse.widgets.init($table_body.find('tr').last());
        jse.extensions.init($table_body.find('tr').last());
    };

    // ------------------------------------------------------------------------
    // EVENT HANDLERS
    // ------------------------------------------------------------------------

    /**
     * Handler for the "abort"-button
     *
     * @returns {boolean} If function gets called directly, the return value is the state of the abort.
     */
    var _abortHandler = function _abortHandler() {
        var $tr = $(this).closest('tr'),
            cache = JSON.stringify($tr.data('formcache')),
            current = JSON.stringify(jse.libs.form.getData($tr, undefined, true)),
            deferred = $.Deferred();

        /**
         * Helper function to reset a line state
         *
         * @private
         */
        var _resetLine = function _resetLine(e) {
            if (e) {
                $('#lightbox_package_' + e.data.id + 'admin_button').off();
                $('#lightbox_package_' + e.data.id);
                $.lightbox_plugin('close', e.data.id);
            }

            if (e && e.data.reject) {
                deferred.reject();
            } else {
                // Reset the validation state
                $tr.trigger('validator.reset', []);
                // Reset the form data
                jse.libs.form.prefillForm($tr, $tr.data('formcache'), true);
                _switchState('default', $tr, true);
                deferred.resolve();
            }
        };

        // Compare the old with the new data. If changes were made, confirm the abort
        if (cache !== current) {
            var href = 'lightbox_confirm.html?section=shop_offline&amp;' + 'message=dicard_changes_hint&amp;buttons=cancel-discard',
                linkHtml = '<a href="' + href + '"></a>',
                lightboxLink = $(linkHtml),
                lightboxId = lightboxLink.lightbox_plugin({
                'lightbox_width': '360px'
            });

            $('#lightbox_package_' + lightboxId).one('click', '.discard', {
                'reject': false,
                'id': lightboxId
            }, _resetLine).one('click', '.cancel', {
                'reject': true,
                'id': lightboxId
            }, _resetLine);
        } else {
            _resetLine();
        }

        return deferred.promise();
    };

    /**
     * Handler for the "edit"-button
     */
    var _editHandler = function _editHandler() {
        var $tr = $(this).closest('tr'),
            $edited = $this.find('tr.edit'),
            promises = [];

        if (!options.multiEdit && $edited.length) {
            // If multiEdit is disabled and other lines are in edit mode, wait for confirmation
            // of the abort event on the other lines.
            $edited.each(function () {
                promises.push(_abortHandler.call($(this).find('.row_abort').first()));
            });
        }

        $.when.apply(undefined, promises).promise().done(function () {
            // Store the current data of the line in cache
            $tr.data('formcache', jse.libs.form.getData($tr, undefined, true));
            _switchState('edit', $tr, true);
        });
    };

    /**
     * Handler for the "save"-button
     */
    var _saveHandler = function _saveHandler() {
        var $self = $(this),
            $tr = $self.closest('tr'),
            dataset = jse.libs.form.getData($tr, undefined, true),
            url = $self.data().url,
            deferred = $.Deferred();

        // Done callback on validation success
        deferred.done(function () {
            if (url) {
                // If a url is given, post the data against the server
                jse.core.debug.info('Sending data:', dataset);
                jse.libs.xhr.ajax({
                    'url': url,
                    'data': dataset
                });
            }

            $this.trigger('row_saved', [dataset]);
            _switchState('default', $tr, true);
        });

        // Get validation state of the line. On success goto deferred.done callback
        $tr.trigger('validator.validate', [{
            'deferred': deferred
        }]);
    };

    /**
     * Handler for the "delete"-button
     */
    var _deleteHandler = function _deleteHandler() {
        var $self = $(this),
            $tr = $self.closest('tr'),
            dataset = {
            id: $tr.data('id')
        },
            url = $self.data().url,
            html = '<a href="lightbox_confirm.html?section=shop_offline&amp;message=delete_job' + '&amp;buttons=cancel-delete"></a>',
            lightboxLink = $(html),
            lightboxId = lightboxLink.lightbox_plugin({
            'lightbox_width': '360px'
        });

        $('#lightbox_package_' + lightboxId).one('click', '.delete', function () {
            $.lightbox_plugin('close', lightboxId);

            if (url) {
                // If a url is given, post the data against the server
                jse.libs.xhr.ajax({
                    'url': url,
                    'data': dataset
                });
            }

            $this.trigger('row_deleted', [dataset]);
            $tr.remove();
        });
    };

    /**
     * Handler for the 'add'-button
     */
    var _addHandler = function _addHandler() {
        var $self = $(this),
            url = $self.data().url,
            $tr = $self.closest('tr'),
            dataset = jse.libs.form.getData($tr, undefined, true),
            deferred = $.Deferred();

        // Done callback on validation success
        deferred.done(function () {
            var _finalize = function _finalize() {
                // Switch the state of the line and
                // create a new 'add'-line
                $this.trigger('row_added', [dataset]);
                _switchState('default', $tr, true);
                _createNewLine();
            };

            if (url) {
                // If a url is given, post the data against the server
                // The respone of the server contains an id, which will be
                // injected into the field names
                jse.core.debug.info('Sending data:', dataset);
                jse.libs.xhr.ajax({
                    'url': url,
                    'data': dataset
                }).done(function (result) {
                    var id = result.id,
                        $targets = $tr.find('input:not(:button), textarea, select');

                    $targets.each(function () {
                        var $elem = $(this),
                            name = $elem.attr('name').replace('[0]', '[' + id + ']');

                        if ($elem.data().lightboxHref) {
                            $elem.data().lightboxHref = $elem.data().lightboxHref.replace('id=0', 'id=' + id);
                        }
                        $elem.attr('name', name);
                    });

                    $tr.find('[data-lightbox-href]').each(function () {
                        var newLink = $(this).attr('data-lightbox-href').replace('id=0', 'id=' + id);
                        $(this).attr('data-lightbox-href', newLink).data().lightboxHref = newLink;
                    });

                    // Update the hidden editor identifiers with the new record ID.
                    $tr.find('input:hidden').each(function (index, inputHidden) {
                        var $inputHidden = $(inputHidden),
                            name = $inputHidden.attr('name');

                        if (name && name.indexOf('{id}') !== -1) {
                            $inputHidden.attr('name', name.replace('{id}', id));
                        }
                    });

                    _finalize();
                });
            } else {
                _finalize();
            }
        });

        // Get validation state of the line. On success goto deferred.done callback
        $tr.trigger('validator.validate', [{
            'deferred': deferred
        }]);
    };

    /**
     * Handler to update the table state, if an widget inside the table gets initialized
     * (needed to disable the datepicker buttons).
     *
     * @param {object} e    jQuery event-object
     */
    var _initialiedHandler = function _initialiedHandler(e) {
        var inside = $this.filter($(e.target)).add($this.find($(e.target))).length;

        if (!inside) {
            var $tr = $(e.target).closest('tr'),
                type = $tr.hasClass('edit') ? 'edit' : $tr.hasClass('add') ? 'add' : 'default';

            _switchState(type, $tr, true);
        }
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    /**
     * Initialize method of the extension, called by the engine.
     */
    module.init = function (done) {
        $template = $this.find('tfoot > tr');
        $table_body = $this.children('tbody');

        // Add a special class to the table, to style
        // disabled input boxes
        $this.addClass('table_inlineedit');

        // Set the default state for all tr
        _switchState('default', $table_body);
        // Add the "Add"-line to the table
        _createNewLine();

        // Add event listeners for all buttons and
        // a listener for the widget initialized event
        // from widgets inside the table
        $this.on('click', '.row_edit', _editHandler).on('click', '.row_delete', _deleteHandler).on('click', '.row_save', _saveHandler).on('click', '.row_add', _addHandler).on('click', '.row_abort', _abortHandler).on('widget.initialized', _initialiedHandler);

        $('body').on('validator.validate', function (e, d) {
            if (d && d.deferred) {
                // Event listener that performs on every validate trigger that isn't handled by the validator.
                d.deferred.resolve();
            }
        });
        done();
    };

    // Return data to module engine.
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRhYmxlX2lubGluZV9lZGl0LmpzIl0sIm5hbWVzIjpbImd4IiwiZXh0ZW5zaW9ucyIsIm1vZHVsZSIsImRhdGEiLCIkdGhpcyIsIiQiLCIkdGVtcGxhdGUiLCIkdGFibGVfYm9keSIsImRlZmF1bHRzIiwib3B0aW9ucyIsImV4dGVuZCIsIl9zd2l0Y2hTdGF0ZSIsIm1vZGUiLCIkZWxlbWVudCIsImFkZENsYXNzIiwiJHRhcmdldHMiLCJmaW5kIiwiJGVkaXQiLCJmaWx0ZXIiLCIkYWRkIiwiJGRlZmF1bHQiLCIkb3RoZXJzIiwiaGlkZSIsInJlbW92ZSIsInNob3ciLCJwcm9wIiwiZWFjaCIsIiRzZWxmIiwiZGF0YXNldCIsImpzZSIsImxpYnMiLCJmYWxsYmFjayIsIl9kYXRhIiwiYXR0ciIsInRvTG93ZXJDYXNlIiwiYWx0IiwidmFsdWVzIiwic3BsaXQiLCJjaGVja2VkIiwidmFsdWVUZXh0IiwiU3RyaW5nIiwicmVwbGFjZSIsImFmdGVyIiwid2FpdFVudGlsVmFsdWVzIiwiY2hpbGRyZW4iLCJsZW5ndGgiLCJzZXRUaW1lb3V0IiwidmFsIiwidGV4dCIsInRyaWdnZXIiLCJyZW1vdmVDbGFzcyIsIl9jcmVhdGVOZXdMaW5lIiwiJG5ld0xpbmUiLCJjbG9uZSIsInNldHVwV2lkZ2V0QXR0ciIsImFwcGVuZCIsIndpZGdldHMiLCJpbml0IiwibGFzdCIsImNvbnRyb2xsZXJzIiwiY29tcGF0aWJpbGl0eSIsIl9hYm9ydEhhbmRsZXIiLCIkdHIiLCJjbG9zZXN0IiwiY2FjaGUiLCJKU09OIiwic3RyaW5naWZ5IiwiY3VycmVudCIsImZvcm0iLCJnZXREYXRhIiwidW5kZWZpbmVkIiwiZGVmZXJyZWQiLCJEZWZlcnJlZCIsIl9yZXNldExpbmUiLCJlIiwiaWQiLCJvZmYiLCJsaWdodGJveF9wbHVnaW4iLCJyZWplY3QiLCJwcmVmaWxsRm9ybSIsInJlc29sdmUiLCJocmVmIiwibGlua0h0bWwiLCJsaWdodGJveExpbmsiLCJsaWdodGJveElkIiwib25lIiwicHJvbWlzZSIsIl9lZGl0SGFuZGxlciIsIiRlZGl0ZWQiLCJwcm9taXNlcyIsIm11bHRpRWRpdCIsInB1c2giLCJjYWxsIiwiZmlyc3QiLCJ3aGVuIiwiYXBwbHkiLCJkb25lIiwiX3NhdmVIYW5kbGVyIiwidXJsIiwiY29yZSIsImRlYnVnIiwiaW5mbyIsInhociIsImFqYXgiLCJfZGVsZXRlSGFuZGxlciIsImh0bWwiLCJfYWRkSGFuZGxlciIsIl9maW5hbGl6ZSIsInJlc3VsdCIsIiRlbGVtIiwibmFtZSIsImxpZ2h0Ym94SHJlZiIsIm5ld0xpbmsiLCJpbmRleCIsImlucHV0SGlkZGVuIiwiJGlucHV0SGlkZGVuIiwiaW5kZXhPZiIsIl9pbml0aWFsaWVkSGFuZGxlciIsImluc2lkZSIsInRhcmdldCIsImFkZCIsInR5cGUiLCJoYXNDbGFzcyIsIm9uIiwiZCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7QUFNQUEsR0FBR0MsVUFBSCxDQUFjQyxNQUFkLENBQ0ksbUJBREosRUFHSSxDQUFDLE1BQUQsRUFBUyxLQUFULEVBQWdCLFVBQWhCLENBSEosRUFLSSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJOzs7OztBQUtBQyxZQUFRQyxFQUFFLElBQUYsQ0FOWjs7O0FBUUk7Ozs7O0FBS0FDLGdCQUFZLElBYmhCOzs7QUFlSTs7Ozs7QUFLQUMsa0JBQWMsSUFwQmxCOzs7QUFzQkk7Ozs7O0FBS0FDLGVBQVc7QUFDUCxxQkFBYTtBQUROLEtBM0JmOzs7QUErQkk7Ozs7O0FBS0FDLGNBQVVKLEVBQUVLLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQkYsUUFBbkIsRUFBNkJMLElBQTdCLENBcENkOzs7QUFzQ0k7Ozs7O0FBS0FELGFBQVMsRUEzQ2I7O0FBNkNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7OztBQVVBLFFBQUlTLGVBQWUsU0FBZkEsWUFBZSxDQUFVQyxJQUFWLEVBQWdCQyxRQUFoQixFQUEwQkMsUUFBMUIsRUFBb0M7O0FBRW5ELFlBQUlDLFdBQVdGLFNBQVNHLElBQVQsQ0FBYyxvQ0FBZCxDQUFmO0FBQUEsWUFDSUMsUUFBUUYsU0FBU0csTUFBVCxDQUFnQixXQUFoQixDQURaO0FBQUEsWUFFSUMsT0FBT0osU0FBU0csTUFBVCxDQUFnQixVQUFoQixDQUZYO0FBQUEsWUFHSUUsV0FBV0wsU0FBU0csTUFBVCxDQUFnQixjQUFoQixDQUhmO0FBQUEsWUFJSUcsVUFBVU4sU0FBU0csTUFBVCxDQUFnQixpREFBaEIsQ0FKZDs7QUFNQTtBQUNBRCxjQUFNSyxJQUFOO0FBQ0FILGFBQUtHLElBQUw7QUFDQUYsaUJBQVNFLElBQVQ7O0FBRUE7QUFDQVQsaUJBQ0tHLElBREwsQ0FDVSx1QkFEVixFQUVLTyxNQUZMOztBQUlBLGdCQUFRWCxJQUFSO0FBQ0ksaUJBQUssTUFBTDtBQUNJO0FBQ0FLLHNCQUFNTyxJQUFOO0FBQ0FILHdCQUFRSSxJQUFSLENBQWEsVUFBYixFQUF5QixLQUF6QjtBQUNBO0FBQ0osaUJBQUssS0FBTDtBQUNJO0FBQ0FOLHFCQUFLSyxJQUFMO0FBQ0FILHdCQUFRSSxJQUFSLENBQWEsVUFBYixFQUF5QixLQUF6QjtBQUNBO0FBQ0o7QUFDSTtBQUNBTCx5QkFBU0ksSUFBVDtBQUNBSCx3QkFDS0ksSUFETCxDQUNVLFVBRFYsRUFDc0IsSUFEdEIsRUFFS0MsSUFGTCxDQUVVLFlBQVk7QUFDZDtBQUNBLHdCQUFJQyxRQUFRdEIsRUFBRSxJQUFGLENBQVo7QUFBQSx3QkFDSXVCLFVBQVVDLElBQUlDLElBQUosQ0FBU0MsUUFBVCxDQUFrQkMsS0FBbEIsQ0FBd0JMLEtBQXhCLEVBQStCLG1CQUEvQixDQURkOztBQUdBO0FBQ0Esd0JBQUlBLE1BQU1NLElBQU4sQ0FBVyxNQUFYLEtBQXNCTixNQUFNTSxJQUFOLENBQVcsTUFBWCxFQUFtQkMsV0FBbkIsT0FBcUMsVUFBM0QsSUFBeUVOLFFBQVFPLEdBQXJGLEVBQTBGO0FBQ3RGLDRCQUFJQyxTQUFTUixRQUFRTyxHQUFSLENBQVlFLEtBQVosQ0FBa0IsR0FBbEIsQ0FBYjtBQUFBLDRCQUNJQyxVQUFVWCxNQUFNRixJQUFOLENBQVcsU0FBWCxDQURkO0FBRUEsNEJBQUljLFlBQVlELFVBQVVGLE9BQU8sQ0FBUCxDQUFWLEdBQXNCQSxPQUFPLENBQVAsQ0FBdEM7QUFDQUcsb0NBQVlDLE9BQU9ELFNBQVAsRUFDUEUsT0FETyxDQUNDLElBREQsRUFDTyxPQURQLEVBRVBBLE9BRk8sQ0FFQyxJQUZELEVBRU8sTUFGUCxFQUdQQSxPQUhPLENBR0MsSUFIRCxFQUdPLE1BSFAsRUFJUEEsT0FKTyxDQUlDLElBSkQsRUFJTyxRQUpQLEVBS1BBLE9BTE8sQ0FLQyxJQUxELEVBS08sUUFMUCxDQUFaO0FBTUFkLDhCQUFNZSxLQUFOLENBQVksd0NBQXdDSCxTQUF4QyxHQUFvRCxTQUFoRTtBQUNILHFCQVhELE1BV08sSUFBSVosTUFBTUYsSUFBTixDQUFXLFNBQVgsRUFBc0JTLFdBQXRCLE9BQXdDLFFBQTVDLEVBQXNEO0FBQ3pELDRCQUFJUyxrQkFBa0IsU0FBbEJBLGVBQWtCLEdBQVk7QUFDOUIxQixrQ0FBTUssSUFBTjtBQUNBLGdDQUFJLENBQUNLLE1BQU1pQixRQUFOLEdBQWlCQyxNQUF0QixFQUE4QjtBQUMxQkMsMkNBQVcsWUFBWTtBQUNuQkg7QUFDSCxpQ0FGRCxFQUVHLEdBRkg7QUFHSCw2QkFKRCxNQUlPO0FBQ0hoQixzQ0FBTWlCLFFBQU4sQ0FBZSxhQUFhakIsTUFBTW9CLEdBQU4sRUFBYixHQUEyQixJQUExQyxFQUFnREMsSUFBaEQ7QUFDQSxvQ0FBSVQsYUFBWVosTUFBTWlCLFFBQU4sQ0FBZSxhQUFhakIsTUFBTW9CLEdBQU4sRUFBYixHQUEyQixJQUExQyxFQUFnREMsSUFBaEQsRUFBaEI7QUFDQVQsNkNBQVlDLE9BQU9ELFVBQVAsRUFDUEUsT0FETyxDQUNDLElBREQsRUFDTyxPQURQLEVBRVBBLE9BRk8sQ0FFQyxJQUZELEVBRU8sTUFGUCxFQUdQQSxPQUhPLENBR0MsSUFIRCxFQUdPLE1BSFAsRUFJUEEsT0FKTyxDQUlDLElBSkQsRUFJTyxRQUpQLEVBS1BBLE9BTE8sQ0FLQyxJQUxELEVBS08sUUFMUCxDQUFaO0FBTUFkLHNDQUFNZSxLQUFOLENBQVksd0NBQXdDSCxVQUF4QyxHQUFvRCxTQUFoRTtBQUNBO0FBQ0g7QUFDSix5QkFsQkQ7O0FBb0JBSTtBQUNIO0FBQ0osaUJBMUNMO0FBMkNBO0FBekRSOztBQTREQXZDLGNBQU02QyxPQUFOLENBQWMsYUFBZCxFQUE2QixFQUE3Qjs7QUFFQTtBQUNBLFlBQUluQyxRQUFKLEVBQWM7QUFDVkQscUJBQ0txQyxXQURMLENBQ2lCLGtCQURqQixFQUVLcEMsUUFGTCxDQUVjRixJQUZkO0FBR0g7QUFDSixLQXRGRDs7QUF3RkE7Ozs7O0FBS0EsUUFBSXVDLGlCQUFpQixTQUFqQkEsY0FBaUIsR0FBWTtBQUM3QixZQUFJQyxXQUFXOUMsVUFBVStDLEtBQVYsRUFBZjs7QUFFQUQsaUJBQ0twQyxJQURMLENBQ1UsUUFEVixFQUVLVSxJQUZMLENBRVUsWUFBWTtBQUNkLGdCQUFJQyxRQUFRdEIsRUFBRSxJQUFGLENBQVo7O0FBRUFzQixrQkFBTU0sSUFBTixDQUFXLE1BQVgsRUFBbUJOLE1BQU1NLElBQU4sQ0FBVyxNQUFYLEVBQW1CUSxPQUFuQixDQUEyQixJQUEzQixFQUFpQyxLQUFqQyxDQUFuQjtBQUNILFNBTkw7O0FBUUE5QixxQkFBYSxLQUFiLEVBQW9CeUMsUUFBcEIsRUFBOEIsSUFBOUI7QUFDQTtBQUNBdkIsWUFBSUMsSUFBSixDQUFTQyxRQUFULENBQWtCdUIsZUFBbEIsQ0FBa0NGLFFBQWxDO0FBQ0E3QyxvQkFBWWdELE1BQVosQ0FBbUJILFFBQW5CO0FBQ0E7QUFDQXBELFdBQUd3RCxPQUFILENBQVdDLElBQVgsQ0FBZ0JsRCxZQUFZUyxJQUFaLENBQWlCLElBQWpCLEVBQXVCMEMsSUFBdkIsRUFBaEI7QUFDQTFELFdBQUdDLFVBQUgsQ0FBY3dELElBQWQsQ0FBbUJsRCxZQUFZUyxJQUFaLENBQWlCLElBQWpCLEVBQXVCMEMsSUFBdkIsRUFBbkI7QUFDQTFELFdBQUcyRCxXQUFILENBQWVGLElBQWYsQ0FBb0JsRCxZQUFZUyxJQUFaLENBQWlCLElBQWpCLEVBQXVCMEMsSUFBdkIsRUFBcEI7QUFDQTFELFdBQUc0RCxhQUFILENBQWlCSCxJQUFqQixDQUFzQmxELFlBQVlTLElBQVosQ0FBaUIsSUFBakIsRUFBdUIwQyxJQUF2QixFQUF0QjtBQUNBN0IsWUFBSTJCLE9BQUosQ0FBWUMsSUFBWixDQUFpQmxELFlBQVlTLElBQVosQ0FBaUIsSUFBakIsRUFBdUIwQyxJQUF2QixFQUFqQjtBQUNBN0IsWUFBSTVCLFVBQUosQ0FBZXdELElBQWYsQ0FBb0JsRCxZQUFZUyxJQUFaLENBQWlCLElBQWpCLEVBQXVCMEMsSUFBdkIsRUFBcEI7QUFDSCxLQXRCRDs7QUF3QkE7QUFDQTtBQUNBOztBQUVBOzs7OztBQUtBLFFBQUlHLGdCQUFnQixTQUFoQkEsYUFBZ0IsR0FBWTtBQUM1QixZQUFJQyxNQUFNekQsRUFBRSxJQUFGLEVBQVEwRCxPQUFSLENBQWdCLElBQWhCLENBQVY7QUFBQSxZQUNJQyxRQUFRQyxLQUFLQyxTQUFMLENBQWVKLElBQUkzRCxJQUFKLENBQVMsV0FBVCxDQUFmLENBRFo7QUFBQSxZQUVJZ0UsVUFBVUYsS0FBS0MsU0FBTCxDQUFlckMsSUFBSUMsSUFBSixDQUFTc0MsSUFBVCxDQUFjQyxPQUFkLENBQXNCUCxHQUF0QixFQUEyQlEsU0FBM0IsRUFBc0MsSUFBdEMsQ0FBZixDQUZkO0FBQUEsWUFHSUMsV0FBV2xFLEVBQUVtRSxRQUFGLEVBSGY7O0FBS0E7Ozs7O0FBS0EsWUFBSUMsYUFBYSxTQUFiQSxVQUFhLENBQVVDLENBQVYsRUFBYTtBQUMxQixnQkFBSUEsQ0FBSixFQUFPO0FBQ0hyRSxrQkFBRSx1QkFBdUJxRSxFQUFFdkUsSUFBRixDQUFPd0UsRUFBOUIsR0FBbUMsY0FBckMsRUFBcURDLEdBQXJEO0FBQ0F2RSxrQkFBRSx1QkFBdUJxRSxFQUFFdkUsSUFBRixDQUFPd0UsRUFBaEM7QUFDQXRFLGtCQUFFd0UsZUFBRixDQUFrQixPQUFsQixFQUEyQkgsRUFBRXZFLElBQUYsQ0FBT3dFLEVBQWxDO0FBQ0g7O0FBRUQsZ0JBQUlELEtBQUtBLEVBQUV2RSxJQUFGLENBQU8yRSxNQUFoQixFQUF3QjtBQUNwQlAseUJBQVNPLE1BQVQ7QUFDSCxhQUZELE1BRU87QUFDSDtBQUNBaEIsb0JBQUliLE9BQUosQ0FBWSxpQkFBWixFQUErQixFQUEvQjtBQUNBO0FBQ0FwQixvQkFBSUMsSUFBSixDQUFTc0MsSUFBVCxDQUFjVyxXQUFkLENBQTBCakIsR0FBMUIsRUFBK0JBLElBQUkzRCxJQUFKLENBQVMsV0FBVCxDQUEvQixFQUFzRCxJQUF0RDtBQUNBUSw2QkFBYSxTQUFiLEVBQXdCbUQsR0FBeEIsRUFBNkIsSUFBN0I7QUFDQVMseUJBQVNTLE9BQVQ7QUFDSDtBQUNKLFNBakJEOztBQW1CQTtBQUNBLFlBQUloQixVQUFVRyxPQUFkLEVBQXVCO0FBQ25CLGdCQUNJYyxPQUFPLG9EQUNILHdEQUZSO0FBQUEsZ0JBR0lDLFdBQVcsY0FBY0QsSUFBZCxHQUFxQixRQUhwQztBQUFBLGdCQUlJRSxlQUFlOUUsRUFBRTZFLFFBQUYsQ0FKbkI7QUFBQSxnQkFLSUUsYUFBYUQsYUFBYU4sZUFBYixDQUE2QjtBQUN0QyxrQ0FBa0I7QUFEb0IsYUFBN0IsQ0FMakI7O0FBU0F4RSxjQUFFLHVCQUF1QitFLFVBQXpCLEVBQ0tDLEdBREwsQ0FDUyxPQURULEVBQ2tCLFVBRGxCLEVBQzhCO0FBQ3RCLDBCQUFVLEtBRFk7QUFFdEIsc0JBQU1EO0FBRmdCLGFBRDlCLEVBSU9YLFVBSlAsRUFLS1ksR0FMTCxDQUtTLE9BTFQsRUFLa0IsU0FMbEIsRUFLNkI7QUFDckIsMEJBQVUsSUFEVztBQUVyQixzQkFBTUQ7QUFGZSxhQUw3QixFQVFPWCxVQVJQO0FBVUgsU0FwQkQsTUFvQk87QUFDSEE7QUFDSDs7QUFFRCxlQUFPRixTQUFTZSxPQUFULEVBQVA7QUFFSCxLQXpERDs7QUEyREE7OztBQUdBLFFBQUlDLGVBQWUsU0FBZkEsWUFBZSxHQUFZO0FBQzNCLFlBQUl6QixNQUFNekQsRUFBRSxJQUFGLEVBQVEwRCxPQUFSLENBQWdCLElBQWhCLENBQVY7QUFBQSxZQUNJeUIsVUFBVXBGLE1BQU1ZLElBQU4sQ0FBVyxTQUFYLENBRGQ7QUFBQSxZQUVJeUUsV0FBVyxFQUZmOztBQUlBLFlBQUksQ0FBQ2hGLFFBQVFpRixTQUFULElBQXNCRixRQUFRM0MsTUFBbEMsRUFBMEM7QUFDdEM7QUFDQTtBQUNBMkMsb0JBQ0s5RCxJQURMLENBQ1UsWUFBWTtBQUNkK0QseUJBQVNFLElBQVQsQ0FBYzlCLGNBQWMrQixJQUFkLENBQW1CdkYsRUFBRSxJQUFGLEVBQVFXLElBQVIsQ0FBYSxZQUFiLEVBQTJCNkUsS0FBM0IsRUFBbkIsQ0FBZDtBQUNILGFBSEw7QUFJSDs7QUFFRHhGLFVBQUV5RixJQUFGLENBQU9DLEtBQVAsQ0FBYXpCLFNBQWIsRUFBd0JtQixRQUF4QixFQUFrQ0gsT0FBbEMsR0FBNENVLElBQTVDLENBQWlELFlBQVk7QUFDekQ7QUFDQWxDLGdCQUFJM0QsSUFBSixDQUFTLFdBQVQsRUFBc0IwQixJQUFJQyxJQUFKLENBQVNzQyxJQUFULENBQWNDLE9BQWQsQ0FBc0JQLEdBQXRCLEVBQTJCUSxTQUEzQixFQUFzQyxJQUF0QyxDQUF0QjtBQUNBM0QseUJBQWEsTUFBYixFQUFxQm1ELEdBQXJCLEVBQTBCLElBQTFCO0FBQ0gsU0FKRDtBQUtILEtBbkJEOztBQXFCQTs7O0FBR0EsUUFBSW1DLGVBQWUsU0FBZkEsWUFBZSxHQUFZO0FBQzNCLFlBQUl0RSxRQUFRdEIsRUFBRSxJQUFGLENBQVo7QUFBQSxZQUNJeUQsTUFBTW5DLE1BQU1vQyxPQUFOLENBQWMsSUFBZCxDQURWO0FBQUEsWUFFSW5DLFVBQVVDLElBQUlDLElBQUosQ0FBU3NDLElBQVQsQ0FBY0MsT0FBZCxDQUFzQlAsR0FBdEIsRUFBMkJRLFNBQTNCLEVBQXNDLElBQXRDLENBRmQ7QUFBQSxZQUdJNEIsTUFBTXZFLE1BQU14QixJQUFOLEdBQWErRixHQUh2QjtBQUFBLFlBSUkzQixXQUFXbEUsRUFBRW1FLFFBQUYsRUFKZjs7QUFNQTtBQUNBRCxpQkFBU3lCLElBQVQsQ0FBYyxZQUFZO0FBQ3RCLGdCQUFJRSxHQUFKLEVBQVM7QUFDTDtBQUNBckUsb0JBQUlzRSxJQUFKLENBQVNDLEtBQVQsQ0FBZUMsSUFBZixDQUFvQixlQUFwQixFQUFxQ3pFLE9BQXJDO0FBQ0FDLG9CQUFJQyxJQUFKLENBQVN3RSxHQUFULENBQWFDLElBQWIsQ0FBa0I7QUFDZCwyQkFBT0wsR0FETztBQUVkLDRCQUFRdEU7QUFGTSxpQkFBbEI7QUFJSDs7QUFFRHhCLGtCQUFNNkMsT0FBTixDQUFjLFdBQWQsRUFBMkIsQ0FBQ3JCLE9BQUQsQ0FBM0I7QUFDQWpCLHlCQUFhLFNBQWIsRUFBd0JtRCxHQUF4QixFQUE2QixJQUE3QjtBQUVILFNBYkQ7O0FBZUE7QUFDQUEsWUFBSWIsT0FBSixDQUFZLG9CQUFaLEVBQWtDLENBQzlCO0FBQ0ksd0JBQVlzQjtBQURoQixTQUQ4QixDQUFsQztBQU1ILEtBOUJEOztBQWdDQTs7O0FBR0EsUUFBSWlDLGlCQUFpQixTQUFqQkEsY0FBaUIsR0FBWTtBQUM3QixZQUFJN0UsUUFBUXRCLEVBQUUsSUFBRixDQUFaO0FBQUEsWUFDSXlELE1BQU1uQyxNQUFNb0MsT0FBTixDQUFjLElBQWQsQ0FEVjtBQUFBLFlBRUluQyxVQUFVO0FBQ04rQyxnQkFBSWIsSUFBSTNELElBQUosQ0FBUyxJQUFUO0FBREUsU0FGZDtBQUFBLFlBS0krRixNQUFNdkUsTUFBTXhCLElBQU4sR0FBYStGLEdBTHZCO0FBQUEsWUFNSU8sT0FBTywrRUFDRCxrQ0FQVjtBQUFBLFlBUUl0QixlQUFlOUUsRUFBRW9HLElBQUYsQ0FSbkI7QUFBQSxZQVNJckIsYUFBYUQsYUFBYU4sZUFBYixDQUE2QjtBQUN0Qyw4QkFBa0I7QUFEb0IsU0FBN0IsQ0FUakI7O0FBYUF4RSxVQUFFLHVCQUF1QitFLFVBQXpCLEVBQXFDQyxHQUFyQyxDQUF5QyxPQUF6QyxFQUFrRCxTQUFsRCxFQUE2RCxZQUFZO0FBQ3JFaEYsY0FBRXdFLGVBQUYsQ0FBa0IsT0FBbEIsRUFBMkJPLFVBQTNCOztBQUVBLGdCQUFJYyxHQUFKLEVBQVM7QUFDTDtBQUNBckUsb0JBQUlDLElBQUosQ0FBU3dFLEdBQVQsQ0FBYUMsSUFBYixDQUFrQjtBQUNkLDJCQUFPTCxHQURPO0FBRWQsNEJBQVF0RTtBQUZNLGlCQUFsQjtBQUlIOztBQUVEeEIsa0JBQU02QyxPQUFOLENBQWMsYUFBZCxFQUE2QixDQUFDckIsT0FBRCxDQUE3QjtBQUNBa0MsZ0JBQUl2QyxNQUFKO0FBQ0gsU0FiRDtBQWNILEtBNUJEOztBQThCQTs7O0FBR0EsUUFBSW1GLGNBQWMsU0FBZEEsV0FBYyxHQUFZO0FBQzFCLFlBQUkvRSxRQUFRdEIsRUFBRSxJQUFGLENBQVo7QUFBQSxZQUNJNkYsTUFBTXZFLE1BQU14QixJQUFOLEdBQWErRixHQUR2QjtBQUFBLFlBRUlwQyxNQUFNbkMsTUFBTW9DLE9BQU4sQ0FBYyxJQUFkLENBRlY7QUFBQSxZQUdJbkMsVUFBVUMsSUFBSUMsSUFBSixDQUFTc0MsSUFBVCxDQUFjQyxPQUFkLENBQXNCUCxHQUF0QixFQUEyQlEsU0FBM0IsRUFBc0MsSUFBdEMsQ0FIZDtBQUFBLFlBSUlDLFdBQVdsRSxFQUFFbUUsUUFBRixFQUpmOztBQU1BO0FBQ0FELGlCQUFTeUIsSUFBVCxDQUFjLFlBQVk7QUFDdEIsZ0JBQUlXLFlBQVksU0FBWkEsU0FBWSxHQUFZO0FBQ3hCO0FBQ0E7QUFDQXZHLHNCQUFNNkMsT0FBTixDQUFjLFdBQWQsRUFBMkIsQ0FBQ3JCLE9BQUQsQ0FBM0I7QUFDQWpCLDZCQUFhLFNBQWIsRUFBd0JtRCxHQUF4QixFQUE2QixJQUE3QjtBQUNBWDtBQUNILGFBTkQ7O0FBUUEsZ0JBQUkrQyxHQUFKLEVBQVM7QUFDTDtBQUNBO0FBQ0E7QUFDQXJFLG9CQUFJc0UsSUFBSixDQUFTQyxLQUFULENBQWVDLElBQWYsQ0FBb0IsZUFBcEIsRUFBcUN6RSxPQUFyQztBQUNBQyxvQkFBSUMsSUFBSixDQUFTd0UsR0FBVCxDQUFhQyxJQUFiLENBQWtCO0FBQ2QsMkJBQU9MLEdBRE87QUFFZCw0QkFBUXRFO0FBRk0saUJBQWxCLEVBR0dvRSxJQUhILENBR1EsVUFBVVksTUFBVixFQUFrQjtBQUN0Qix3QkFBSWpDLEtBQUtpQyxPQUFPakMsRUFBaEI7QUFBQSx3QkFDSTVELFdBQVcrQyxJQUFJOUMsSUFBSixDQUFTLHNDQUFULENBRGY7O0FBR0FELDZCQUFTVyxJQUFULENBQWMsWUFBWTtBQUN0Qiw0QkFBSW1GLFFBQVF4RyxFQUFFLElBQUYsQ0FBWjtBQUFBLDRCQUNJeUcsT0FBT0QsTUFDRjVFLElBREUsQ0FDRyxNQURILEVBRUZRLE9BRkUsQ0FFTSxLQUZOLEVBRWEsTUFBTWtDLEVBQU4sR0FBVyxHQUZ4QixDQURYOztBQUtBLDRCQUFJa0MsTUFBTTFHLElBQU4sR0FBYTRHLFlBQWpCLEVBQStCO0FBQzNCRixrQ0FBTTFHLElBQU4sR0FBYTRHLFlBQWIsR0FBNEJGLE1BQU0xRyxJQUFOLEdBQWE0RyxZQUFiLENBQTBCdEUsT0FBMUIsQ0FBa0MsTUFBbEMsRUFBMEMsUUFBUWtDLEVBQWxELENBQTVCO0FBQ0g7QUFDRGtDLDhCQUFNNUUsSUFBTixDQUFXLE1BQVgsRUFBbUI2RSxJQUFuQjtBQUNILHFCQVZEOztBQVlBaEQsd0JBQUk5QyxJQUFKLENBQVMsc0JBQVQsRUFBaUNVLElBQWpDLENBQXNDLFlBQVk7QUFDOUMsNEJBQUlzRixVQUFVM0csRUFBRSxJQUFGLEVBQVE0QixJQUFSLENBQWEsb0JBQWIsRUFBbUNRLE9BQW5DLENBQTJDLE1BQTNDLEVBQW1ELFFBQVFrQyxFQUEzRCxDQUFkO0FBQ0F0RSwwQkFBRSxJQUFGLEVBQ0s0QixJQURMLENBQ1Usb0JBRFYsRUFDZ0MrRSxPQURoQyxFQUVLN0csSUFGTCxHQUVZNEcsWUFGWixHQUUyQkMsT0FGM0I7QUFHSCxxQkFMRDs7QUFPQTtBQUNBbEQsd0JBQUk5QyxJQUFKLENBQVMsY0FBVCxFQUF5QlUsSUFBekIsQ0FBOEIsVUFBVXVGLEtBQVYsRUFBaUJDLFdBQWpCLEVBQThCO0FBQ3hELDRCQUFJQyxlQUFlOUcsRUFBRTZHLFdBQUYsQ0FBbkI7QUFBQSw0QkFDSUosT0FBT0ssYUFBYWxGLElBQWIsQ0FBa0IsTUFBbEIsQ0FEWDs7QUFHQSw0QkFBSTZFLFFBQVFBLEtBQUtNLE9BQUwsQ0FBYSxNQUFiLE1BQXlCLENBQUMsQ0FBdEMsRUFBeUM7QUFDckNELHlDQUFhbEYsSUFBYixDQUFrQixNQUFsQixFQUEwQjZFLEtBQUtyRSxPQUFMLENBQWEsTUFBYixFQUFxQmtDLEVBQXJCLENBQTFCO0FBQ0g7QUFDSixxQkFQRDs7QUFTQWdDO0FBQ0gsaUJBckNEO0FBc0NILGFBM0NELE1BMkNPO0FBQ0hBO0FBQ0g7QUFDSixTQXZERDs7QUF5REE7QUFDQTdDLFlBQUliLE9BQUosQ0FBWSxvQkFBWixFQUFrQyxDQUM5QjtBQUNJLHdCQUFZc0I7QUFEaEIsU0FEOEIsQ0FBbEM7QUFNSCxLQXhFRDs7QUEwRUE7Ozs7OztBQU1BLFFBQUk4QyxxQkFBcUIsU0FBckJBLGtCQUFxQixDQUFVM0MsQ0FBVixFQUFhO0FBQ2xDLFlBQUk0QyxTQUFTbEgsTUFDUmMsTUFEUSxDQUNEYixFQUFFcUUsRUFBRTZDLE1BQUosQ0FEQyxFQUVSQyxHQUZRLENBRUpwSCxNQUFNWSxJQUFOLENBQVdYLEVBQUVxRSxFQUFFNkMsTUFBSixDQUFYLENBRkksRUFHUjFFLE1BSEw7O0FBS0EsWUFBSSxDQUFDeUUsTUFBTCxFQUFhO0FBQ1QsZ0JBQUl4RCxNQUFNekQsRUFBRXFFLEVBQUU2QyxNQUFKLEVBQVl4RCxPQUFaLENBQW9CLElBQXBCLENBQVY7QUFBQSxnQkFDSTBELE9BQVEzRCxJQUFJNEQsUUFBSixDQUFhLE1BQWIsQ0FBRCxHQUF5QixNQUF6QixHQUNGNUQsSUFBSTRELFFBQUosQ0FBYSxLQUFiLENBQUQsR0FBd0IsS0FBeEIsR0FDSSxTQUhaOztBQUtBL0cseUJBQWE4RyxJQUFiLEVBQW1CM0QsR0FBbkIsRUFBd0IsSUFBeEI7QUFDSDtBQUNKLEtBZEQ7O0FBZ0JBO0FBQ0E7QUFDQTs7QUFFQTs7O0FBR0E1RCxXQUFPdUQsSUFBUCxHQUFjLFVBQVV1QyxJQUFWLEVBQWdCO0FBQzFCMUYsb0JBQVlGLE1BQU1ZLElBQU4sQ0FBVyxZQUFYLENBQVo7QUFDQVQsc0JBQWNILE1BQU13QyxRQUFOLENBQWUsT0FBZixDQUFkOztBQUVBO0FBQ0E7QUFDQXhDLGNBQU1VLFFBQU4sQ0FBZSxrQkFBZjs7QUFFQTtBQUNBSCxxQkFBYSxTQUFiLEVBQXdCSixXQUF4QjtBQUNBO0FBQ0E0Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQS9DLGNBQ0t1SCxFQURMLENBQ1EsT0FEUixFQUNpQixXQURqQixFQUM4QnBDLFlBRDlCLEVBRUtvQyxFQUZMLENBRVEsT0FGUixFQUVpQixhQUZqQixFQUVnQ25CLGNBRmhDLEVBR0ttQixFQUhMLENBR1EsT0FIUixFQUdpQixXQUhqQixFQUc4QjFCLFlBSDlCLEVBSUswQixFQUpMLENBSVEsT0FKUixFQUlpQixVQUpqQixFQUk2QmpCLFdBSjdCLEVBS0tpQixFQUxMLENBS1EsT0FMUixFQUtpQixZQUxqQixFQUsrQjlELGFBTC9CLEVBTUs4RCxFQU5MLENBTVEsb0JBTlIsRUFNOEJOLGtCQU45Qjs7QUFRQWhILFVBQUUsTUFBRixFQUNLc0gsRUFETCxDQUNRLG9CQURSLEVBQzhCLFVBQVVqRCxDQUFWLEVBQWFrRCxDQUFiLEVBQWdCO0FBQ3RDLGdCQUFJQSxLQUFLQSxFQUFFckQsUUFBWCxFQUFxQjtBQUNqQjtBQUNBcUQsa0JBQUVyRCxRQUFGLENBQVdTLE9BQVg7QUFDSDtBQUNKLFNBTkw7QUFPQWdCO0FBQ0gsS0FoQ0Q7O0FBa0NBO0FBQ0EsV0FBTzlGLE1BQVA7QUFDSCxDQTNlTCIsImZpbGUiOiJ0YWJsZV9pbmxpbmVfZWRpdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gdGFibGVfaW5saW5lX2VkaXQuanMgMjAyMi0xMC0yMCBnbVxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMjIgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgRXh0ZW5zaW9uIGZvciBtYWtpbmcgdGFibGVzIGVkaXRhYmxlLlxuICpcbiAqIEBtb2R1bGUgQWRtaW4vRXh0ZW5zaW9ucy90YWJsZV9pbmxpbmVfZWRpdFxuICogQGlnbm9yZVxuICovXG5neC5leHRlbnNpb25zLm1vZHVsZShcbiAgICAndGFibGVfaW5saW5lX2VkaXQnLFxuXG4gICAgWydmb3JtJywgJ3hocicsICdmYWxsYmFjayddLFxuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFIERFRklOSVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEV4dGVuc2lvbiBSZWZlcmVuY2VcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkdGhpcyA9ICQodGhpcyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogVGVtcGxhdGUgU2VsZWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkdGVtcGxhdGUgPSBudWxsLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFRhYmxlIEJvZHkgU2VsZWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkdGFibGVfYm9keSA9IG51bGwsXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRGVmYXVsdCBPcHRpb25zIGZvciBFeHRlbnNpb25cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgICAgICAnbXVsdGlFZGl0JzogZmFsc2VcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRmluYWwgRXh0ZW5zaW9uIE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEZVTkNUSU9OQUxJVFlcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFN3aXRjaCBTdGF0ZVxuICAgICAgICAgKlxuICAgICAgICAgKiBGdW5jdGlvbiB0aGF0IGVuYWJsZXMgLyBkaXNhYmxlcywgZGVwZW5kaW5nIG9uIHRoZSBtb2RlLCBhbGwgaW5wdXQgZmllbGRzIGluc2lkZVxuICAgICAgICAgKiB0aGUgJGVsZW1lbnQgYW5kIHNob3dzIC8gaGlkZXMgdGhlIGNvcnJlc3BvbmRpbmcgYnV0dG9ucy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZGUgU2V0IHRoZSBnaXZlbiBtb2RlLiBQb3NzaWJsZSB2YWx1ZXM6ICdlZGl0JywgJ2FkZCcsICdkZWZhdWx0J1xuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gJGVsZW1lbnQgVGhlIGVsZW1lbnQgalF1ZXJ5IHNlbGVjdGlvbiB0aGF0IGdldHMgbW9kaWZpZWRcbiAgICAgICAgICogQHBhcmFtIHtib29sZWFufSBhZGRDbGFzcyBJZiB0cnVlLCB0aGUgc3RhdGUgY2xhc3MgZ2V0cyBhZGRlZCB0byB0aGUgZWxlbWVudFxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9zd2l0Y2hTdGF0ZSA9IGZ1bmN0aW9uIChtb2RlLCAkZWxlbWVudCwgYWRkQ2xhc3MpIHtcblxuICAgICAgICAgICAgdmFyICR0YXJnZXRzID0gJGVsZW1lbnQuZmluZCgnaW5wdXQsIHRleHRhcmVhLCBzZWxlY3QsIGJ1dHRvbiwgaScpLFxuICAgICAgICAgICAgICAgICRlZGl0ID0gJHRhcmdldHMuZmlsdGVyKCcuZWRpdG1vZGUnKSxcbiAgICAgICAgICAgICAgICAkYWRkID0gJHRhcmdldHMuZmlsdGVyKCcuYWRkbW9kZScpLFxuICAgICAgICAgICAgICAgICRkZWZhdWx0ID0gJHRhcmdldHMuZmlsdGVyKCcuZGVmYXVsdG1vZGUnKSxcbiAgICAgICAgICAgICAgICAkb3RoZXJzID0gJHRhcmdldHMuZmlsdGVyKCc6bm90KC5lZGl0bW9kZSk6bm90KC5hZGRtb2RlKTpub3QoLmRlZmF1bHRtb2RlKScpO1xuXG4gICAgICAgICAgICAvLyBIaWRlIGFsbCBidXR0b25zXG4gICAgICAgICAgICAkZWRpdC5oaWRlKCk7XG4gICAgICAgICAgICAkYWRkLmhpZGUoKTtcbiAgICAgICAgICAgICRkZWZhdWx0LmhpZGUoKTtcblxuICAgICAgICAgICAgLy8gUmVtb3ZlIGFsdC10ZXh0IGlmIGF2YWlsYWJsZVxuICAgICAgICAgICAgJGVsZW1lbnRcbiAgICAgICAgICAgICAgICAuZmluZCgnLnRhYmxlX2lubGluZWVkaXRfYWx0JylcbiAgICAgICAgICAgICAgICAucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgIHN3aXRjaCAobW9kZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2VkaXQnOlxuICAgICAgICAgICAgICAgICAgICAvLyBTd2l0Y2ggdG8gZWRpdCBtb2RlXG4gICAgICAgICAgICAgICAgICAgICRlZGl0LnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgJG90aGVycy5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnYWRkJzpcbiAgICAgICAgICAgICAgICAgICAgLy8gU3dpdGNoIHRvIGFkZCBtb2RlXG4gICAgICAgICAgICAgICAgICAgICRhZGQuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAkb3RoZXJzLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAvLyBTd2l0Y2ggdG8gZGVmYXVsdC1tb2RlXG4gICAgICAgICAgICAgICAgICAgICRkZWZhdWx0LnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgJG90aGVyc1xuICAgICAgICAgICAgICAgICAgICAgICAgLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiB0aGVyZSBpcyBhbiBhbHQgdGV4dCBnaXZlbiBmb3IgdGhlIGlucHV0IGZpZWxkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyICRzZWxmID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YXNldCA9IGpzZS5saWJzLmZhbGxiYWNrLl9kYXRhKCRzZWxmLCAndGFibGVfaW5saW5lX2VkaXQnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlcGxhY2Ugc29tZSBraW5kIG9mIGZvcm0gZmllbGRzIHdpdGggc3BhbiB0YWdzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRzZWxmLmF0dHIoJ3R5cGUnKSAmJiAkc2VsZi5hdHRyKCd0eXBlJykudG9Mb3dlckNhc2UoKSA9PT0gJ2NoZWNrYm94JyAmJiBkYXRhc2V0LmFsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWVzID0gZGF0YXNldC5hbHQuc3BsaXQoJ18nKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQgPSAkc2VsZi5wcm9wKCdjaGVja2VkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZVRleHQgPSBjaGVja2VkID8gdmFsdWVzWzBdIDogdmFsdWVzWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZVRleHQgPSBTdHJpbmcodmFsdWVUZXh0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyYvZywgXCImYW1wO1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLzwvZywgXCImbHQ7XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvPi9nLCBcIiZndDtcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cIi9nLCBcIiZxdW90O1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLycvZywgXCImIzAzOTtcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzZWxmLmFmdGVyKCc8c3BhbiBjbGFzcz1cInRhYmxlX2lubGluZWVkaXRfYWx0XCI+JyArIHZhbHVlVGV4dCArICc8L3NwYW4+Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICgkc2VsZi5wcm9wKCd0YWdOYW1lJykudG9Mb3dlckNhc2UoKSA9PT0gJ3NlbGVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHdhaXRVbnRpbFZhbHVlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRlZGl0LmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghJHNlbGYuY2hpbGRyZW4oKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2FpdFVudGlsVmFsdWVzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMjAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNlbGYuY2hpbGRyZW4oJ1t2YWx1ZT1cIicgKyAkc2VsZi52YWwoKSArICdcIl0nKS50ZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHZhbHVlVGV4dCA9ICRzZWxmLmNoaWxkcmVuKCdbdmFsdWU9XCInICsgJHNlbGYudmFsKCkgKyAnXCJdJykudGV4dCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlVGV4dCA9IFN0cmluZyh2YWx1ZVRleHQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8mL2csIFwiJmFtcDtcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLzwvZywgXCImbHQ7XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8+L2csIFwiJmd0O1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXCIvZywgXCImcXVvdDtcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLycvZywgXCImIzAzOTtcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNlbGYuYWZ0ZXIoJzxzcGFuIGNsYXNzPVwidGFibGVfaW5saW5lZWRpdF9hbHRcIj4nICsgdmFsdWVUZXh0ICsgJzwvc3Bhbj4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2FpdFVudGlsVmFsdWVzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkdGhpcy50cmlnZ2VyKCdGT1JNX1VQREFURScsIFtdKTtcblxuICAgICAgICAgICAgLy8gQWRkIHRoZSBtb2RlIGNsYXNzXG4gICAgICAgICAgICBpZiAoYWRkQ2xhc3MpIHtcbiAgICAgICAgICAgICAgICAkZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2VkaXQgYWRkIGRlZmF1bHQnKVxuICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MobW9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENyZWF0ZSBOZXcgTGluZVxuICAgICAgICAgKlxuICAgICAgICAgKiBDcmVhdGVzIGEgbmV3IFwiYWRkXCItbGluZSBieSBjbG9uaW5nIHRoZSBmb290ZXIgdGVtcGxhdGUuXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX2NyZWF0ZU5ld0xpbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgJG5ld0xpbmUgPSAkdGVtcGxhdGUuY2xvbmUoKTtcblxuICAgICAgICAgICAgJG5ld0xpbmVcbiAgICAgICAgICAgICAgICAuZmluZCgnW25hbWVdJylcbiAgICAgICAgICAgICAgICAuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciAkc2VsZiA9ICQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgJHNlbGYuYXR0cignbmFtZScsICRzZWxmLmF0dHIoJ25hbWUnKS5yZXBsYWNlKCdbXScsICdbMF0nKSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIF9zd2l0Y2hTdGF0ZSgnYWRkJywgJG5ld0xpbmUsIHRydWUpO1xuICAgICAgICAgICAgLy8gUmVuYW1lIHRoZSB0ZW1wb3JhcmlseSB3aWRnZXQgZGF0YSBhdHRyaWJ1dGVzXG4gICAgICAgICAgICBqc2UubGlicy5mYWxsYmFjay5zZXR1cFdpZGdldEF0dHIoJG5ld0xpbmUpO1xuICAgICAgICAgICAgJHRhYmxlX2JvZHkuYXBwZW5kKCRuZXdMaW5lKTtcbiAgICAgICAgICAgIC8vIFN0YXJ0IHRoZSB3aWRnZXRzXG4gICAgICAgICAgICBneC53aWRnZXRzLmluaXQoJHRhYmxlX2JvZHkuZmluZCgndHInKS5sYXN0KCkpO1xuICAgICAgICAgICAgZ3guZXh0ZW5zaW9ucy5pbml0KCR0YWJsZV9ib2R5LmZpbmQoJ3RyJykubGFzdCgpKTtcbiAgICAgICAgICAgIGd4LmNvbnRyb2xsZXJzLmluaXQoJHRhYmxlX2JvZHkuZmluZCgndHInKS5sYXN0KCkpO1xuICAgICAgICAgICAgZ3guY29tcGF0aWJpbGl0eS5pbml0KCR0YWJsZV9ib2R5LmZpbmQoJ3RyJykubGFzdCgpKTtcbiAgICAgICAgICAgIGpzZS53aWRnZXRzLmluaXQoJHRhYmxlX2JvZHkuZmluZCgndHInKS5sYXN0KCkpO1xuICAgICAgICAgICAganNlLmV4dGVuc2lvbnMuaW5pdCgkdGFibGVfYm9keS5maW5kKCd0cicpLmxhc3QoKSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEVWRU5UIEhBTkRMRVJTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVyIGZvciB0aGUgXCJhYm9ydFwiLWJ1dHRvblxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gSWYgZnVuY3Rpb24gZ2V0cyBjYWxsZWQgZGlyZWN0bHksIHRoZSByZXR1cm4gdmFsdWUgaXMgdGhlIHN0YXRlIG9mIHRoZSBhYm9ydC5cbiAgICAgICAgICovXG4gICAgICAgIHZhciBfYWJvcnRIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyICR0ciA9ICQodGhpcykuY2xvc2VzdCgndHInKSxcbiAgICAgICAgICAgICAgICBjYWNoZSA9IEpTT04uc3RyaW5naWZ5KCR0ci5kYXRhKCdmb3JtY2FjaGUnKSksXG4gICAgICAgICAgICAgICAgY3VycmVudCA9IEpTT04uc3RyaW5naWZ5KGpzZS5saWJzLmZvcm0uZ2V0RGF0YSgkdHIsIHVuZGVmaW5lZCwgdHJ1ZSkpLFxuICAgICAgICAgICAgICAgIGRlZmVycmVkID0gJC5EZWZlcnJlZCgpO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEhlbHBlciBmdW5jdGlvbiB0byByZXNldCBhIGxpbmUgc3RhdGVcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB2YXIgX3Jlc2V0TGluZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2xpZ2h0Ym94X3BhY2thZ2VfJyArIGUuZGF0YS5pZCArICdhZG1pbl9idXR0b24nKS5vZmYoKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2xpZ2h0Ym94X3BhY2thZ2VfJyArIGUuZGF0YS5pZCk7XG4gICAgICAgICAgICAgICAgICAgICQubGlnaHRib3hfcGx1Z2luKCdjbG9zZScsIGUuZGF0YS5pZCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGUgJiYgZS5kYXRhLnJlamVjdCkge1xuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBSZXNldCB0aGUgdmFsaWRhdGlvbiBzdGF0ZVxuICAgICAgICAgICAgICAgICAgICAkdHIudHJpZ2dlcigndmFsaWRhdG9yLnJlc2V0JywgW10pO1xuICAgICAgICAgICAgICAgICAgICAvLyBSZXNldCB0aGUgZm9ybSBkYXRhXG4gICAgICAgICAgICAgICAgICAgIGpzZS5saWJzLmZvcm0ucHJlZmlsbEZvcm0oJHRyLCAkdHIuZGF0YSgnZm9ybWNhY2hlJyksIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBfc3dpdGNoU3RhdGUoJ2RlZmF1bHQnLCAkdHIsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gQ29tcGFyZSB0aGUgb2xkIHdpdGggdGhlIG5ldyBkYXRhLiBJZiBjaGFuZ2VzIHdlcmUgbWFkZSwgY29uZmlybSB0aGUgYWJvcnRcbiAgICAgICAgICAgIGlmIChjYWNoZSAhPT0gY3VycmVudCkge1xuICAgICAgICAgICAgICAgIHZhclxuICAgICAgICAgICAgICAgICAgICBocmVmID0gJ2xpZ2h0Ym94X2NvbmZpcm0uaHRtbD9zZWN0aW9uPXNob3Bfb2ZmbGluZSZhbXA7JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnbWVzc2FnZT1kaWNhcmRfY2hhbmdlc19oaW50JmFtcDtidXR0b25zPWNhbmNlbC1kaXNjYXJkJyxcbiAgICAgICAgICAgICAgICAgICAgbGlua0h0bWwgPSAnPGEgaHJlZj1cIicgKyBocmVmICsgJ1wiPjwvYT4nLFxuICAgICAgICAgICAgICAgICAgICBsaWdodGJveExpbmsgPSAkKGxpbmtIdG1sKSxcbiAgICAgICAgICAgICAgICAgICAgbGlnaHRib3hJZCA9IGxpZ2h0Ym94TGluay5saWdodGJveF9wbHVnaW4oe1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2xpZ2h0Ym94X3dpZHRoJzogJzM2MHB4J1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICQoJyNsaWdodGJveF9wYWNrYWdlXycgKyBsaWdodGJveElkKVxuICAgICAgICAgICAgICAgICAgICAub25lKCdjbGljaycsICcuZGlzY2FyZCcsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdyZWplY3QnOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICdpZCc6IGxpZ2h0Ym94SWRcbiAgICAgICAgICAgICAgICAgICAgfSwgX3Jlc2V0TGluZSlcbiAgICAgICAgICAgICAgICAgICAgLm9uZSgnY2xpY2snLCAnLmNhbmNlbCcsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdyZWplY3QnOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2lkJzogbGlnaHRib3hJZFxuICAgICAgICAgICAgICAgICAgICB9LCBfcmVzZXRMaW5lKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfcmVzZXRMaW5lKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlKCk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlciBmb3IgdGhlIFwiZWRpdFwiLWJ1dHRvblxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9lZGl0SGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciAkdHIgPSAkKHRoaXMpLmNsb3Nlc3QoJ3RyJyksXG4gICAgICAgICAgICAgICAgJGVkaXRlZCA9ICR0aGlzLmZpbmQoJ3RyLmVkaXQnKSxcbiAgICAgICAgICAgICAgICBwcm9taXNlcyA9IFtdO1xuXG4gICAgICAgICAgICBpZiAoIW9wdGlvbnMubXVsdGlFZGl0ICYmICRlZGl0ZWQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgbXVsdGlFZGl0IGlzIGRpc2FibGVkIGFuZCBvdGhlciBsaW5lcyBhcmUgaW4gZWRpdCBtb2RlLCB3YWl0IGZvciBjb25maXJtYXRpb25cbiAgICAgICAgICAgICAgICAvLyBvZiB0aGUgYWJvcnQgZXZlbnQgb24gdGhlIG90aGVyIGxpbmVzLlxuICAgICAgICAgICAgICAgICRlZGl0ZWRcbiAgICAgICAgICAgICAgICAgICAgLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZXMucHVzaChfYWJvcnRIYW5kbGVyLmNhbGwoJCh0aGlzKS5maW5kKCcucm93X2Fib3J0JykuZmlyc3QoKSkpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJC53aGVuLmFwcGx5KHVuZGVmaW5lZCwgcHJvbWlzZXMpLnByb21pc2UoKS5kb25lKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyBTdG9yZSB0aGUgY3VycmVudCBkYXRhIG9mIHRoZSBsaW5lIGluIGNhY2hlXG4gICAgICAgICAgICAgICAgJHRyLmRhdGEoJ2Zvcm1jYWNoZScsIGpzZS5saWJzLmZvcm0uZ2V0RGF0YSgkdHIsIHVuZGVmaW5lZCwgdHJ1ZSkpO1xuICAgICAgICAgICAgICAgIF9zd2l0Y2hTdGF0ZSgnZWRpdCcsICR0ciwgdHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlciBmb3IgdGhlIFwic2F2ZVwiLWJ1dHRvblxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9zYXZlSGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciAkc2VsZiA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgJHRyID0gJHNlbGYuY2xvc2VzdCgndHInKSxcbiAgICAgICAgICAgICAgICBkYXRhc2V0ID0ganNlLmxpYnMuZm9ybS5nZXREYXRhKCR0ciwgdW5kZWZpbmVkLCB0cnVlKSxcbiAgICAgICAgICAgICAgICB1cmwgPSAkc2VsZi5kYXRhKCkudXJsLFxuICAgICAgICAgICAgICAgIGRlZmVycmVkID0gJC5EZWZlcnJlZCgpO1xuXG4gICAgICAgICAgICAvLyBEb25lIGNhbGxiYWNrIG9uIHZhbGlkYXRpb24gc3VjY2Vzc1xuICAgICAgICAgICAgZGVmZXJyZWQuZG9uZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHVybCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiBhIHVybCBpcyBnaXZlbiwgcG9zdCB0aGUgZGF0YSBhZ2FpbnN0IHRoZSBzZXJ2ZXJcbiAgICAgICAgICAgICAgICAgICAganNlLmNvcmUuZGVidWcuaW5mbygnU2VuZGluZyBkYXRhOicsIGRhdGFzZXQpO1xuICAgICAgICAgICAgICAgICAgICBqc2UubGlicy54aHIuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAndXJsJzogdXJsLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGEnOiBkYXRhc2V0XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICR0aGlzLnRyaWdnZXIoJ3Jvd19zYXZlZCcsIFtkYXRhc2V0XSk7XG4gICAgICAgICAgICAgICAgX3N3aXRjaFN0YXRlKCdkZWZhdWx0JywgJHRyLCB0cnVlKTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIEdldCB2YWxpZGF0aW9uIHN0YXRlIG9mIHRoZSBsaW5lLiBPbiBzdWNjZXNzIGdvdG8gZGVmZXJyZWQuZG9uZSBjYWxsYmFja1xuICAgICAgICAgICAgJHRyLnRyaWdnZXIoJ3ZhbGlkYXRvci52YWxpZGF0ZScsIFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICdkZWZlcnJlZCc6IGRlZmVycmVkXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlciBmb3IgdGhlIFwiZGVsZXRlXCItYnV0dG9uXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX2RlbGV0ZUhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgJHNlbGYgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgICR0ciA9ICRzZWxmLmNsb3Nlc3QoJ3RyJyksXG4gICAgICAgICAgICAgICAgZGF0YXNldCA9IHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICR0ci5kYXRhKCdpZCcpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1cmwgPSAkc2VsZi5kYXRhKCkudXJsLFxuICAgICAgICAgICAgICAgIGh0bWwgPSAnPGEgaHJlZj1cImxpZ2h0Ym94X2NvbmZpcm0uaHRtbD9zZWN0aW9uPXNob3Bfb2ZmbGluZSZhbXA7bWVzc2FnZT1kZWxldGVfam9iJ1xuICAgICAgICAgICAgICAgICAgICArICcmYW1wO2J1dHRvbnM9Y2FuY2VsLWRlbGV0ZVwiPjwvYT4nLFxuICAgICAgICAgICAgICAgIGxpZ2h0Ym94TGluayA9ICQoaHRtbCksXG4gICAgICAgICAgICAgICAgbGlnaHRib3hJZCA9IGxpZ2h0Ym94TGluay5saWdodGJveF9wbHVnaW4oe1xuICAgICAgICAgICAgICAgICAgICAnbGlnaHRib3hfd2lkdGgnOiAnMzYwcHgnXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICQoJyNsaWdodGJveF9wYWNrYWdlXycgKyBsaWdodGJveElkKS5vbmUoJ2NsaWNrJywgJy5kZWxldGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJC5saWdodGJveF9wbHVnaW4oJ2Nsb3NlJywgbGlnaHRib3hJZCk7XG5cbiAgICAgICAgICAgICAgICBpZiAodXJsKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIGEgdXJsIGlzIGdpdmVuLCBwb3N0IHRoZSBkYXRhIGFnYWluc3QgdGhlIHNlcnZlclxuICAgICAgICAgICAgICAgICAgICBqc2UubGlicy54aHIuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAndXJsJzogdXJsLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGEnOiBkYXRhc2V0XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICR0aGlzLnRyaWdnZXIoJ3Jvd19kZWxldGVkJywgW2RhdGFzZXRdKTtcbiAgICAgICAgICAgICAgICAkdHIucmVtb3ZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlciBmb3IgdGhlICdhZGQnLWJ1dHRvblxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9hZGRIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyICRzZWxmID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICB1cmwgPSAkc2VsZi5kYXRhKCkudXJsLFxuICAgICAgICAgICAgICAgICR0ciA9ICRzZWxmLmNsb3Nlc3QoJ3RyJyksXG4gICAgICAgICAgICAgICAgZGF0YXNldCA9IGpzZS5saWJzLmZvcm0uZ2V0RGF0YSgkdHIsIHVuZGVmaW5lZCwgdHJ1ZSksXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQgPSAkLkRlZmVycmVkKCk7XG5cbiAgICAgICAgICAgIC8vIERvbmUgY2FsbGJhY2sgb24gdmFsaWRhdGlvbiBzdWNjZXNzXG4gICAgICAgICAgICBkZWZlcnJlZC5kb25lKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2ZpbmFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBTd2l0Y2ggdGhlIHN0YXRlIG9mIHRoZSBsaW5lIGFuZFxuICAgICAgICAgICAgICAgICAgICAvLyBjcmVhdGUgYSBuZXcgJ2FkZCctbGluZVxuICAgICAgICAgICAgICAgICAgICAkdGhpcy50cmlnZ2VyKCdyb3dfYWRkZWQnLCBbZGF0YXNldF0pO1xuICAgICAgICAgICAgICAgICAgICBfc3dpdGNoU3RhdGUoJ2RlZmF1bHQnLCAkdHIsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBfY3JlYXRlTmV3TGluZSgpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBpZiAodXJsKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIGEgdXJsIGlzIGdpdmVuLCBwb3N0IHRoZSBkYXRhIGFnYWluc3QgdGhlIHNlcnZlclxuICAgICAgICAgICAgICAgICAgICAvLyBUaGUgcmVzcG9uZSBvZiB0aGUgc2VydmVyIGNvbnRhaW5zIGFuIGlkLCB3aGljaCB3aWxsIGJlXG4gICAgICAgICAgICAgICAgICAgIC8vIGluamVjdGVkIGludG8gdGhlIGZpZWxkIG5hbWVzXG4gICAgICAgICAgICAgICAgICAgIGpzZS5jb3JlLmRlYnVnLmluZm8oJ1NlbmRpbmcgZGF0YTonLCBkYXRhc2V0KTtcbiAgICAgICAgICAgICAgICAgICAganNlLmxpYnMueGhyLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3VybCc6IHVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhJzogZGF0YXNldFxuICAgICAgICAgICAgICAgICAgICB9KS5kb25lKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpZCA9IHJlc3VsdC5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdGFyZ2V0cyA9ICR0ci5maW5kKCdpbnB1dDpub3QoOmJ1dHRvbiksIHRleHRhcmVhLCBzZWxlY3QnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgJHRhcmdldHMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyICRlbGVtID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSA9ICRlbGVtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignbmFtZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgnWzBdJywgJ1snICsgaWQgKyAnXScpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRlbGVtLmRhdGEoKS5saWdodGJveEhyZWYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGVsZW0uZGF0YSgpLmxpZ2h0Ym94SHJlZiA9ICRlbGVtLmRhdGEoKS5saWdodGJveEhyZWYucmVwbGFjZSgnaWQ9MCcsICdpZD0nICsgaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZWxlbS5hdHRyKCduYW1lJywgbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgJHRyLmZpbmQoJ1tkYXRhLWxpZ2h0Ym94LWhyZWZdJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0xpbmsgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtbGlnaHRib3gtaHJlZicpLnJlcGxhY2UoJ2lkPTAnLCAnaWQ9JyArIGlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdkYXRhLWxpZ2h0Ym94LWhyZWYnLCBuZXdMaW5rKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZGF0YSgpLmxpZ2h0Ym94SHJlZiA9IG5ld0xpbms7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSBoaWRkZW4gZWRpdG9yIGlkZW50aWZpZXJzIHdpdGggdGhlIG5ldyByZWNvcmQgSUQuXG4gICAgICAgICAgICAgICAgICAgICAgICAkdHIuZmluZCgnaW5wdXQ6aGlkZGVuJykuZWFjaChmdW5jdGlvbiAoaW5kZXgsIGlucHV0SGlkZGVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyICRpbnB1dEhpZGRlbiA9ICQoaW5wdXRIaWRkZW4pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lID0gJGlucHV0SGlkZGVuLmF0dHIoJ25hbWUnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuYW1lICYmIG5hbWUuaW5kZXhPZigne2lkfScpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkaW5wdXRIaWRkZW4uYXR0cignbmFtZScsIG5hbWUucmVwbGFjZSgne2lkfScsIGlkKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIF9maW5hbGl6ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBfZmluYWxpemUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gR2V0IHZhbGlkYXRpb24gc3RhdGUgb2YgdGhlIGxpbmUuIE9uIHN1Y2Nlc3MgZ290byBkZWZlcnJlZC5kb25lIGNhbGxiYWNrXG4gICAgICAgICAgICAkdHIudHJpZ2dlcigndmFsaWRhdG9yLnZhbGlkYXRlJywgW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJ2RlZmVycmVkJzogZGVmZXJyZWRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdKTtcblxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVyIHRvIHVwZGF0ZSB0aGUgdGFibGUgc3RhdGUsIGlmIGFuIHdpZGdldCBpbnNpZGUgdGhlIHRhYmxlIGdldHMgaW5pdGlhbGl6ZWRcbiAgICAgICAgICogKG5lZWRlZCB0byBkaXNhYmxlIHRoZSBkYXRlcGlja2VyIGJ1dHRvbnMpLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZSAgICBqUXVlcnkgZXZlbnQtb2JqZWN0XG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX2luaXRpYWxpZWRIYW5kbGVyID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHZhciBpbnNpZGUgPSAkdGhpc1xuICAgICAgICAgICAgICAgIC5maWx0ZXIoJChlLnRhcmdldCkpXG4gICAgICAgICAgICAgICAgLmFkZCgkdGhpcy5maW5kKCQoZS50YXJnZXQpKSlcbiAgICAgICAgICAgICAgICAubGVuZ3RoO1xuXG4gICAgICAgICAgICBpZiAoIWluc2lkZSkge1xuICAgICAgICAgICAgICAgIHZhciAkdHIgPSAkKGUudGFyZ2V0KS5jbG9zZXN0KCd0cicpLFxuICAgICAgICAgICAgICAgICAgICB0eXBlID0gKCR0ci5oYXNDbGFzcygnZWRpdCcpKSA/ICdlZGl0JyA6XG4gICAgICAgICAgICAgICAgICAgICAgICAoJHRyLmhhc0NsYXNzKCdhZGQnKSkgPyAnYWRkJyA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RlZmF1bHQnO1xuXG4gICAgICAgICAgICAgICAgX3N3aXRjaFN0YXRlKHR5cGUsICR0ciwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0aWFsaXplIG1ldGhvZCBvZiB0aGUgZXh0ZW5zaW9uLCBjYWxsZWQgYnkgdGhlIGVuZ2luZS5cbiAgICAgICAgICovXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgICR0ZW1wbGF0ZSA9ICR0aGlzLmZpbmQoJ3Rmb290ID4gdHInKTtcbiAgICAgICAgICAgICR0YWJsZV9ib2R5ID0gJHRoaXMuY2hpbGRyZW4oJ3Rib2R5Jyk7XG5cbiAgICAgICAgICAgIC8vIEFkZCBhIHNwZWNpYWwgY2xhc3MgdG8gdGhlIHRhYmxlLCB0byBzdHlsZVxuICAgICAgICAgICAgLy8gZGlzYWJsZWQgaW5wdXQgYm94ZXNcbiAgICAgICAgICAgICR0aGlzLmFkZENsYXNzKCd0YWJsZV9pbmxpbmVlZGl0Jyk7XG5cbiAgICAgICAgICAgIC8vIFNldCB0aGUgZGVmYXVsdCBzdGF0ZSBmb3IgYWxsIHRyXG4gICAgICAgICAgICBfc3dpdGNoU3RhdGUoJ2RlZmF1bHQnLCAkdGFibGVfYm9keSk7XG4gICAgICAgICAgICAvLyBBZGQgdGhlIFwiQWRkXCItbGluZSB0byB0aGUgdGFibGVcbiAgICAgICAgICAgIF9jcmVhdGVOZXdMaW5lKCk7XG5cbiAgICAgICAgICAgIC8vIEFkZCBldmVudCBsaXN0ZW5lcnMgZm9yIGFsbCBidXR0b25zIGFuZFxuICAgICAgICAgICAgLy8gYSBsaXN0ZW5lciBmb3IgdGhlIHdpZGdldCBpbml0aWFsaXplZCBldmVudFxuICAgICAgICAgICAgLy8gZnJvbSB3aWRnZXRzIGluc2lkZSB0aGUgdGFibGVcbiAgICAgICAgICAgICR0aGlzXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsICcucm93X2VkaXQnLCBfZWRpdEhhbmRsZXIpXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsICcucm93X2RlbGV0ZScsIF9kZWxldGVIYW5kbGVyKVxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCAnLnJvd19zYXZlJywgX3NhdmVIYW5kbGVyKVxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCAnLnJvd19hZGQnLCBfYWRkSGFuZGxlcilcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgJy5yb3dfYWJvcnQnLCBfYWJvcnRIYW5kbGVyKVxuICAgICAgICAgICAgICAgIC5vbignd2lkZ2V0LmluaXRpYWxpemVkJywgX2luaXRpYWxpZWRIYW5kbGVyKTtcblxuICAgICAgICAgICAgJCgnYm9keScpXG4gICAgICAgICAgICAgICAgLm9uKCd2YWxpZGF0b3IudmFsaWRhdGUnLCBmdW5jdGlvbiAoZSwgZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZCAmJiBkLmRlZmVycmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBFdmVudCBsaXN0ZW5lciB0aGF0IHBlcmZvcm1zIG9uIGV2ZXJ5IHZhbGlkYXRlIHRyaWdnZXIgdGhhdCBpc24ndCBoYW5kbGVkIGJ5IHRoZSB2YWxpZGF0b3IuXG4gICAgICAgICAgICAgICAgICAgICAgICBkLmRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFJldHVybiBkYXRhIHRvIG1vZHVsZSBlbmdpbmUuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7XG4iXX0=
