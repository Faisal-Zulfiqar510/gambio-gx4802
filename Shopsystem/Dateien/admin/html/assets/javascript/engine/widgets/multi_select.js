'use strict';

/* --------------------------------------------------------------
 multi_select.js 2016-11-08
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Multi Select Widget
 *
 * This module serves as a wrapper of SumoSelect, a jQuery plugin that provides enhanced select-box functionality.
 * Bind this widget to a parent container and mark each child select-box element with the `data-multi_select-instance`
 * attribute.
 *
 * After the initialization of the widget all the marked elements will be converted into SumoSelect instances.
 *
 * ### Options
 *
 * **Options Source | `data-multi_select-source` | String | Optional**
 *
 * Provide a URL that will be used to fetch the options of the select box. The widget will perform a GET request to
 * the provided destination and expects a JSON array with the options:
 *
 * [
 *   {
 *     "value": "1", 
 *     "text": "Option #1"
 *   },
 *   {
 *     "value": "2", 
 *     "text": "Option #2"
 *   }
 * ]
 *
 * You can also pass other configuration directly in the parent element which will be used for every child instance.
 *
 *
 * ### Methods
 *
 * **Reload Options [AJAX]**
 *
 * You can use this method to refresh the options from the already provided data-multi_select-source or by providing
 * a new URL which will also be set as the data-source of the element. If the multi select has no URL then it will just
 * sync its values with the select element.
 *
 * * ```js
 * $('#my-multi-select').multi_select('reload', 'https://example.org/options/source/url');
 * ```
 *
 * **Refresh Options**
 *
 * Update the multi-select widget with the state of the original select element. This method is useful after performing
 * changes in the original element and need to display them in the multi-select widget.
 *
 * ```js
 * $('#my-multi-select').multi_select('refresh');
 * ```
 *
 * ### Events
 * ```javascript
 * // Triggered when the multi-select widget has performed a "reload" method (after the AJAX call).
 * $('#my-multi-select').on('reload', function(event) {});
 * ```
 *
 * ### Example
 *
 * ```html
 * <form data-gx-widget="multi_select">
 *   <select data-multi_select-instance data-multi_select-source="https://example.org/options-source-url"></select>
 * </form>
 * ```
 *
 * {@link http://hemantnegi.github.io/jquery.sumoselect}
 *
 * @module Admin/Widgets/multi_select
 * @requires jQuery-SumoSelect
 */
gx.widgets.module('multi_select', [jse.source + '/vendor/sumoselect/sumoselect.min.css', jse.source + '/vendor/sumoselect/jquery.sumoselect.min.js'], function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES
    // ------------------------------------------------------------------------

    /**
     * Module Selector
     *
     * @type {jQuery}
     */

    var $this = $(this);

    /**
     * Default Options
     *
     * @type {Object}
     */
    var defaults = {
        placeholder: jse.core.lang.translate('SELECT', 'general'),
        selectAll: true,
        csvDispCount: 2,
        captionFormat: '{0} ' + jse.core.lang.translate('selected', 'admin_labels'),
        locale: ['OK', jse.core.lang.translate('CANCEL', 'general'), jse.core.lang.translate('SELECT_ALL', 'general')]
    };

    /**
     * Final Options
     *
     * @type {Object}
     */
    var options = $.extend(true, {}, defaults, data);

    /**
     * Module Instance
     *
     * @type {Object}
     */
    var module = {};

    // ------------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------------

    /**
     * Add the "multi_select" method to the jQuery prototype.
     */
    function _addPublicMethod() {
        if ($.fn.multi_select) {
            return;
        }

        $.fn.extend({
            multi_select: function multi_select(action) {
                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key];
                }

                if (!$(this).is('select')) {
                    throw new Error('Called the "multi_select" method on an invalid object (select box expected).');
                }

                $.each(this, function () {
                    switch (action) {
                        case 'reload':
                            _reload.apply(undefined, [$(this)].concat(args));
                            break;

                        case 'refresh':
                            _refresh(this);
                    }
                });
            }
        });
    }

    /**
     * Fill a select box with the provided options.
     *
     * @param {jQuery} $select The select box to be filled.
     * @param {Object} options Array with { value: "...", "text": "..." } entries.
     */
    function _fillSelect($select, options) {
        $select.empty();
        $.each(options, function (index, option) {
            $select.append(new Option(option.text, option.value));
        });
    }

    /**
     * Reload the options from the source (data property) or the provided URL,
     *
     * @param {string} url Optional, if provided it will be used as the source of the data and will also update the
     * data-source property of the element.
     */
    function _reload($select, url) {
        url = url || $select.data('source');

        if (!url) {
            throw new Error('Multi Select Reload: Neither URL nor data-source contain a URL value.');
        }

        $select.data('source', url);

        $.getJSON(url).done(function (response) {
            _fillSelect($select, response);
            $select[0].sumo.reload();
            $select.trigger('reload');
        }).fail(function (jqxhr, textStatus, errorThrown) {
            jse.core.debug.error('Multi Select AJAX Error: ', jqxhr, textStatus, errorThrown);
        });
    }

    /**
     * Refresh the multi select instance depending the state of the original select element.
     *
     * @param {Node} select The DOM element to be refreshed.
     */
    function _refresh(select) {
        if (select.sumo === undefined) {
            throw new Error('Multi Select Refresh: The provided select element is not an instance of SumoSelect.', select);
        }

        select.sumo.reload();

        // Update the caption by simulating a click in an ".opt" element.
        _overrideSelectAllCaption.apply($(select.parentNode).find('.opt')[0]);
    }

    /**
     * select all elements in a given select
     * @param optWrapper select wrapper
     * @private
     */
    function _selectAllElements(optWrapper) {
        optWrapper.find('.opt').addClass('selected');
        optWrapper.siblings('.CaptionCont').children('span').removeClass('placeholder').text(jse.core.lang.translate('all_selected', 'admin_labels'));
    }

    /**
     * deselect all elements in a given select
     * @param optWrapper select wrapper
     * @private
     */
    function _deselectAllElements(optWrapper) {
        optWrapper.find('.opt').removeClass('selected');
        optWrapper.find('.select-all').removeClass('selected').removeClass('partial-select');
        optWrapper.siblings('.CaptionCont').children('span').text('');
    }

    /**
     * Override the multi select caption when all elements are selected.
     *
     * This callback will override the caption because SumoSelect does not provide a setting for this text.
     */
    function _overrideSelectAllCaption() {
        var $optWrapper = $(this).parents('.optWrapper');
        var allCheckboxesChecked = $optWrapper.find('.opt.selected').length === $optWrapper.find('.opt').length;
        var atLeastOneCheckboxChecked = $optWrapper.find('.opt.selected').length > 0;
        var $selectAllCheckbox = $optWrapper.find('.select-all');
        var isSelectAllSelected = $selectAllCheckbox.hasClass('selected') && !($selectAllCheckbox.hasClass('partial') || $selectAllCheckbox.hasClass('partial-select'));
        var isDeselectAllSelected = allCheckboxesChecked && !isSelectAllSelected && !$selectAllCheckbox.hasClass('selected');

        $selectAllCheckbox.removeClass('partial-select');

        if (isDeselectAllSelected) {
            _deselectAllElements($optWrapper);
        } else if (allCheckboxesChecked) {
            _selectAllElements($optWrapper);
        } else if (atLeastOneCheckboxChecked) {
            $selectAllCheckbox.addClass('partial-select');
        } else if (isSelectAllSelected) {
            _selectAllElements($optWrapper);
        }
    }

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        // Add public module method.
        _addPublicMethod();

        // Initialize the elements.
        $this.find('[data-multi_select-instance]').each(function () {
            var $select = $(this);

            $select.removeAttr('data-multi_select-instance');

            // Instantiate the widget without an AJAX request.
            $select.SumoSelect(options);

            if ($select.data('multi_selectSource') !== undefined) {
                // Remove the data attribute and store the value internally with the 'source' key.
                $select.data('source', $select.data('multi_selectSource'));
                $select.removeAttr('data-multi_select-source');

                // Fetch the options with an AJAX request.
                $.getJSON($select.data('multi_selectSource')).done(function (response) {
                    _fillSelect($select, response);
                    $select[0].sumo.unload();
                    $select.SumoSelect(options);
                    $select.trigger('reload');
                }).fail(function (jqxhr, textStatus, errorThrown) {
                    jse.core.debug.error('Multi Select AJAX Error: ', jqxhr, textStatus, errorThrown);
                });
            }
        });

        done();
    };

    // When the user clicks on the "Select All" option update the text with a custom translations. This has to
    // be done manually because there is no option for this text in SumoSelect.
    $this.on('click', '.select-all, .opt', _overrideSelectAllCaption);

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm11bHRpX3NlbGVjdC5qcyJdLCJuYW1lcyI6WyJneCIsIndpZGdldHMiLCJtb2R1bGUiLCJqc2UiLCJzb3VyY2UiLCJkYXRhIiwiJHRoaXMiLCIkIiwiZGVmYXVsdHMiLCJwbGFjZWhvbGRlciIsImNvcmUiLCJsYW5nIiwidHJhbnNsYXRlIiwic2VsZWN0QWxsIiwiY3N2RGlzcENvdW50IiwiY2FwdGlvbkZvcm1hdCIsImxvY2FsZSIsIm9wdGlvbnMiLCJleHRlbmQiLCJfYWRkUHVibGljTWV0aG9kIiwiZm4iLCJtdWx0aV9zZWxlY3QiLCJhY3Rpb24iLCJhcmdzIiwiaXMiLCJFcnJvciIsImVhY2giLCJfcmVsb2FkIiwiX3JlZnJlc2giLCJfZmlsbFNlbGVjdCIsIiRzZWxlY3QiLCJlbXB0eSIsImluZGV4Iiwib3B0aW9uIiwiYXBwZW5kIiwiT3B0aW9uIiwidGV4dCIsInZhbHVlIiwidXJsIiwiZ2V0SlNPTiIsImRvbmUiLCJyZXNwb25zZSIsInN1bW8iLCJyZWxvYWQiLCJ0cmlnZ2VyIiwiZmFpbCIsImpxeGhyIiwidGV4dFN0YXR1cyIsImVycm9yVGhyb3duIiwiZGVidWciLCJlcnJvciIsInNlbGVjdCIsInVuZGVmaW5lZCIsIl9vdmVycmlkZVNlbGVjdEFsbENhcHRpb24iLCJhcHBseSIsInBhcmVudE5vZGUiLCJmaW5kIiwiX3NlbGVjdEFsbEVsZW1lbnRzIiwib3B0V3JhcHBlciIsImFkZENsYXNzIiwic2libGluZ3MiLCJjaGlsZHJlbiIsInJlbW92ZUNsYXNzIiwiX2Rlc2VsZWN0QWxsRWxlbWVudHMiLCIkb3B0V3JhcHBlciIsInBhcmVudHMiLCJhbGxDaGVja2JveGVzQ2hlY2tlZCIsImxlbmd0aCIsImF0TGVhc3RPbmVDaGVja2JveENoZWNrZWQiLCIkc2VsZWN0QWxsQ2hlY2tib3giLCJpc1NlbGVjdEFsbFNlbGVjdGVkIiwiaGFzQ2xhc3MiLCJpc0Rlc2VsZWN0QWxsU2VsZWN0ZWQiLCJpbml0IiwicmVtb3ZlQXR0ciIsIlN1bW9TZWxl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QUEyQkFSO0FBQ0gsS0FqQ0Q7O0FBbUNBO0FBQ0E7QUFDQWxDLFVBQU11RSxFQUFOLENBQVMsT0FBVCxFQUFrQixtQkFBbEIsRUFBdUN4Qix5QkFBdkM7O0FBRUEsV0FBT25ELE1BQVA7QUFFSCxDQWpQTCIsImZpbGUiOiJtdWx0aV9zZWxlY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIG11bHRpX3NlbGVjdC5qcyAyMDE2LTExLTA4XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNiBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBNdWx0aSBTZWxlY3QgV2lkZ2V0XG4gKlxuICogVGhpcyBtb2R1bGUgc2VydmVzIGFzIGEgd3JhcHBlciBvZiBTdW1vU2VsZWN0LCBhIGpRdWVyeSBwbHVnaW4gdGhhdCBwcm92aWRlcyBlbmhhbmNlZCBzZWxlY3QtYm94IGZ1bmN0aW9uYWxpdHkuXG4gKiBCaW5kIHRoaXMgd2lkZ2V0IHRvIGEgcGFyZW50IGNvbnRhaW5lciBhbmQgbWFyayBlYWNoIGNoaWxkIHNlbGVjdC1ib3ggZWxlbWVudCB3aXRoIHRoZSBgZGF0YS1tdWx0aV9zZWxlY3QtaW5zdGFuY2VgXG4gKiBhdHRyaWJ1dGUuXG4gKlxuICogQWZ0ZXIgdGhlIGluaXRpYWxpemF0aW9uIG9mIHRoZSB3aWRnZXQgYWxsIHRoZSBtYXJrZWQgZWxlbWVudHMgd2lsbCBiZSBjb252ZXJ0ZWQgaW50byBTdW1vU2VsZWN0IGluc3RhbmNlcy5cbiAqXG4gKiAjIyMgT3B0aW9uc1xuICpcbiAqICoqT3B0aW9ucyBTb3VyY2UgfCBgZGF0YS1tdWx0aV9zZWxlY3Qtc291cmNlYCB8IFN0cmluZyB8IE9wdGlvbmFsKipcbiAqXG4gKiBQcm92aWRlIGEgVVJMIHRoYXQgd2lsbCBiZSB1c2VkIHRvIGZldGNoIHRoZSBvcHRpb25zIG9mIHRoZSBzZWxlY3QgYm94LiBUaGUgd2lkZ2V0IHdpbGwgcGVyZm9ybSBhIEdFVCByZXF1ZXN0IHRvXG4gKiB0aGUgcHJvdmlkZWQgZGVzdGluYXRpb24gYW5kIGV4cGVjdHMgYSBKU09OIGFycmF5IHdpdGggdGhlIG9wdGlvbnM6XG4gKlxuICogW1xuICogICB7XG4gKiAgICAgXCJ2YWx1ZVwiOiBcIjFcIiwgXG4gKiAgICAgXCJ0ZXh0XCI6IFwiT3B0aW9uICMxXCJcbiAqICAgfSxcbiAqICAge1xuICogICAgIFwidmFsdWVcIjogXCIyXCIsIFxuICogICAgIFwidGV4dFwiOiBcIk9wdGlvbiAjMlwiXG4gKiAgIH1cbiAqIF1cbiAqXG4gKiBZb3UgY2FuIGFsc28gcGFzcyBvdGhlciBjb25maWd1cmF0aW9uIGRpcmVjdGx5IGluIHRoZSBwYXJlbnQgZWxlbWVudCB3aGljaCB3aWxsIGJlIHVzZWQgZm9yIGV2ZXJ5IGNoaWxkIGluc3RhbmNlLlxuICpcbiAqXG4gKiAjIyMgTWV0aG9kc1xuICpcbiAqICoqUmVsb2FkIE9wdGlvbnMgW0FKQVhdKipcbiAqXG4gKiBZb3UgY2FuIHVzZSB0aGlzIG1ldGhvZCB0byByZWZyZXNoIHRoZSBvcHRpb25zIGZyb20gdGhlIGFscmVhZHkgcHJvdmlkZWQgZGF0YS1tdWx0aV9zZWxlY3Qtc291cmNlIG9yIGJ5IHByb3ZpZGluZ1xuICogYSBuZXcgVVJMIHdoaWNoIHdpbGwgYWxzbyBiZSBzZXQgYXMgdGhlIGRhdGEtc291cmNlIG9mIHRoZSBlbGVtZW50LiBJZiB0aGUgbXVsdGkgc2VsZWN0IGhhcyBubyBVUkwgdGhlbiBpdCB3aWxsIGp1c3RcbiAqIHN5bmMgaXRzIHZhbHVlcyB3aXRoIHRoZSBzZWxlY3QgZWxlbWVudC5cbiAqXG4gKiAqIGBgYGpzXG4gKiAkKCcjbXktbXVsdGktc2VsZWN0JykubXVsdGlfc2VsZWN0KCdyZWxvYWQnLCAnaHR0cHM6Ly9leGFtcGxlLm9yZy9vcHRpb25zL3NvdXJjZS91cmwnKTtcbiAqIGBgYFxuICpcbiAqICoqUmVmcmVzaCBPcHRpb25zKipcbiAqXG4gKiBVcGRhdGUgdGhlIG11bHRpLXNlbGVjdCB3aWRnZXQgd2l0aCB0aGUgc3RhdGUgb2YgdGhlIG9yaWdpbmFsIHNlbGVjdCBlbGVtZW50LiBUaGlzIG1ldGhvZCBpcyB1c2VmdWwgYWZ0ZXIgcGVyZm9ybWluZ1xuICogY2hhbmdlcyBpbiB0aGUgb3JpZ2luYWwgZWxlbWVudCBhbmQgbmVlZCB0byBkaXNwbGF5IHRoZW0gaW4gdGhlIG11bHRpLXNlbGVjdCB3aWRnZXQuXG4gKlxuICogYGBganNcbiAqICQoJyNteS1tdWx0aS1zZWxlY3QnKS5tdWx0aV9zZWxlY3QoJ3JlZnJlc2gnKTtcbiAqIGBgYFxuICpcbiAqICMjIyBFdmVudHNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIC8vIFRyaWdnZXJlZCB3aGVuIHRoZSBtdWx0aS1zZWxlY3Qgd2lkZ2V0IGhhcyBwZXJmb3JtZWQgYSBcInJlbG9hZFwiIG1ldGhvZCAoYWZ0ZXIgdGhlIEFKQVggY2FsbCkuXG4gKiAkKCcjbXktbXVsdGktc2VsZWN0Jykub24oJ3JlbG9hZCcsIGZ1bmN0aW9uKGV2ZW50KSB7fSk7XG4gKiBgYGBcbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIGBgYGh0bWxcbiAqIDxmb3JtIGRhdGEtZ3gtd2lkZ2V0PVwibXVsdGlfc2VsZWN0XCI+XG4gKiAgIDxzZWxlY3QgZGF0YS1tdWx0aV9zZWxlY3QtaW5zdGFuY2UgZGF0YS1tdWx0aV9zZWxlY3Qtc291cmNlPVwiaHR0cHM6Ly9leGFtcGxlLm9yZy9vcHRpb25zLXNvdXJjZS11cmxcIj48L3NlbGVjdD5cbiAqIDwvZm9ybT5cbiAqIGBgYFxuICpcbiAqIHtAbGluayBodHRwOi8vaGVtYW50bmVnaS5naXRodWIuaW8vanF1ZXJ5LnN1bW9zZWxlY3R9XG4gKlxuICogQG1vZHVsZSBBZG1pbi9XaWRnZXRzL211bHRpX3NlbGVjdFxuICogQHJlcXVpcmVzIGpRdWVyeS1TdW1vU2VsZWN0XG4gKi9cbmd4LndpZGdldHMubW9kdWxlKFxuICAgICdtdWx0aV9zZWxlY3QnLFxuXG4gICAgW1xuICAgICAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3Ivc3Vtb3NlbGVjdC9zdW1vc2VsZWN0Lm1pbi5jc3NgLFxuICAgICAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3Ivc3Vtb3NlbGVjdC9qcXVlcnkuc3Vtb3NlbGVjdC5taW4uanNgXG4gICAgXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWZhdWx0IE9wdGlvbnNcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgcGxhY2Vob2xkZXI6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdTRUxFQ1QnLCAnZ2VuZXJhbCcpLFxuICAgICAgICAgICAgc2VsZWN0QWxsOiB0cnVlLFxuICAgICAgICAgICAgY3N2RGlzcENvdW50OiAyLFxuICAgICAgICAgICAgY2FwdGlvbkZvcm1hdDogYHswfSAke2pzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdzZWxlY3RlZCcsICdhZG1pbl9sYWJlbHMnKX1gLFxuICAgICAgICAgICAgbG9jYWxlOiBbXG4gICAgICAgICAgICAgICAgJ09LJyxcbiAgICAgICAgICAgICAgICBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnQ0FOQ0VMJywgJ2dlbmVyYWwnKSxcbiAgICAgICAgICAgICAgICBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnU0VMRUNUX0FMTCcsICdnZW5lcmFsJylcbiAgICAgICAgICAgIF1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmluYWwgT3B0aW9uc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBJbnN0YW5jZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEZVTkNUSU9OU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQWRkIHRoZSBcIm11bHRpX3NlbGVjdFwiIG1ldGhvZCB0byB0aGUgalF1ZXJ5IHByb3RvdHlwZS5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9hZGRQdWJsaWNNZXRob2QoKSB7XG4gICAgICAgICAgICBpZiAoJC5mbi5tdWx0aV9zZWxlY3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICQuZm4uZXh0ZW5kKHtcbiAgICAgICAgICAgICAgICBtdWx0aV9zZWxlY3Q6IGZ1bmN0aW9uIChhY3Rpb24sIC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEkKHRoaXMpLmlzKCdzZWxlY3QnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYWxsZWQgdGhlIFwibXVsdGlfc2VsZWN0XCIgbWV0aG9kIG9uIGFuIGludmFsaWQgb2JqZWN0IChzZWxlY3QgYm94IGV4cGVjdGVkKS4nKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICQuZWFjaCh0aGlzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3JlbG9hZCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZWxvYWQoJCh0aGlzKSwgLi4uYXJncyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAncmVmcmVzaCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZWZyZXNoKHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaWxsIGEgc2VsZWN0IGJveCB3aXRoIHRoZSBwcm92aWRlZCBvcHRpb25zLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJHNlbGVjdCBUaGUgc2VsZWN0IGJveCB0byBiZSBmaWxsZWQuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEFycmF5IHdpdGggeyB2YWx1ZTogXCIuLi5cIiwgXCJ0ZXh0XCI6IFwiLi4uXCIgfSBlbnRyaWVzLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2ZpbGxTZWxlY3QoJHNlbGVjdCwgb3B0aW9ucykge1xuICAgICAgICAgICAgJHNlbGVjdC5lbXB0eSgpO1xuICAgICAgICAgICAgJC5lYWNoKG9wdGlvbnMsIChpbmRleCwgb3B0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgJHNlbGVjdC5hcHBlbmQobmV3IE9wdGlvbihvcHRpb24udGV4dCwgb3B0aW9uLnZhbHVlKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZWxvYWQgdGhlIG9wdGlvbnMgZnJvbSB0aGUgc291cmNlIChkYXRhIHByb3BlcnR5KSBvciB0aGUgcHJvdmlkZWQgVVJMLFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsIE9wdGlvbmFsLCBpZiBwcm92aWRlZCBpdCB3aWxsIGJlIHVzZWQgYXMgdGhlIHNvdXJjZSBvZiB0aGUgZGF0YSBhbmQgd2lsbCBhbHNvIHVwZGF0ZSB0aGVcbiAgICAgICAgICogZGF0YS1zb3VyY2UgcHJvcGVydHkgb2YgdGhlIGVsZW1lbnQuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfcmVsb2FkKCRzZWxlY3QsIHVybCkge1xuICAgICAgICAgICAgdXJsID0gdXJsIHx8ICRzZWxlY3QuZGF0YSgnc291cmNlJyk7XG5cbiAgICAgICAgICAgIGlmICghdXJsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNdWx0aSBTZWxlY3QgUmVsb2FkOiBOZWl0aGVyIFVSTCBub3IgZGF0YS1zb3VyY2UgY29udGFpbiBhIFVSTCB2YWx1ZS4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJHNlbGVjdC5kYXRhKCdzb3VyY2UnLCB1cmwpO1xuXG4gICAgICAgICAgICAkLmdldEpTT04odXJsKVxuICAgICAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBfZmlsbFNlbGVjdCgkc2VsZWN0LCByZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgICRzZWxlY3RbMF0uc3Vtby5yZWxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgJHNlbGVjdC50cmlnZ2VyKCdyZWxvYWQnKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uIChqcXhociwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIHtcbiAgICAgICAgICAgICAgICAgICAganNlLmNvcmUuZGVidWcuZXJyb3IoJ011bHRpIFNlbGVjdCBBSkFYIEVycm9yOiAnLCBqcXhociwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlZnJlc2ggdGhlIG11bHRpIHNlbGVjdCBpbnN0YW5jZSBkZXBlbmRpbmcgdGhlIHN0YXRlIG9mIHRoZSBvcmlnaW5hbCBzZWxlY3QgZWxlbWVudC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtOb2RlfSBzZWxlY3QgVGhlIERPTSBlbGVtZW50IHRvIGJlIHJlZnJlc2hlZC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9yZWZyZXNoKHNlbGVjdCkge1xuICAgICAgICAgICAgaWYgKHNlbGVjdC5zdW1vID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ011bHRpIFNlbGVjdCBSZWZyZXNoOiBUaGUgcHJvdmlkZWQgc2VsZWN0IGVsZW1lbnQgaXMgbm90IGFuIGluc3RhbmNlIG9mIFN1bW9TZWxlY3QuJywgc2VsZWN0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZWN0LnN1bW8ucmVsb2FkKCk7XG5cbiAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgY2FwdGlvbiBieSBzaW11bGF0aW5nIGEgY2xpY2sgaW4gYW4gXCIub3B0XCIgZWxlbWVudC5cbiAgICAgICAgICAgIF9vdmVycmlkZVNlbGVjdEFsbENhcHRpb24uYXBwbHkoJChzZWxlY3QucGFyZW50Tm9kZSkuZmluZCgnLm9wdCcpWzBdKTtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICAvKipcbiAgICAgICAgICogc2VsZWN0IGFsbCBlbGVtZW50cyBpbiBhIGdpdmVuIHNlbGVjdFxuICAgICAgICAgKiBAcGFyYW0gb3B0V3JhcHBlciBzZWxlY3Qgd3JhcHBlclxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX3NlbGVjdEFsbEVsZW1lbnRzKG9wdFdyYXBwZXIpIHtcbiAgICAgICAgICAgIG9wdFdyYXBwZXIuZmluZCgnLm9wdCcpLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICAgICAgb3B0V3JhcHBlclxuICAgICAgICAgICAgICAgIC5zaWJsaW5ncygnLkNhcHRpb25Db250JylcbiAgICAgICAgICAgICAgICAuY2hpbGRyZW4oJ3NwYW4nKVxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygncGxhY2Vob2xkZXInKVxuICAgICAgICAgICAgICAgIC50ZXh0KGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdhbGxfc2VsZWN0ZWQnLCAnYWRtaW5fbGFiZWxzJykpO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBkZXNlbGVjdCBhbGwgZWxlbWVudHMgaW4gYSBnaXZlbiBzZWxlY3RcbiAgICAgICAgICogQHBhcmFtIG9wdFdyYXBwZXIgc2VsZWN0IHdyYXBwZXJcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9kZXNlbGVjdEFsbEVsZW1lbnRzKG9wdFdyYXBwZXIpIHtcbiAgICAgICAgICAgIG9wdFdyYXBwZXIuZmluZCgnLm9wdCcpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICAgICAgb3B0V3JhcHBlci5maW5kKCcuc2VsZWN0LWFsbCcpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpLnJlbW92ZUNsYXNzKCdwYXJ0aWFsLXNlbGVjdCcpO1xuICAgICAgICAgICAgb3B0V3JhcHBlclxuICAgICAgICAgICAgICAgIC5zaWJsaW5ncygnLkNhcHRpb25Db250JylcbiAgICAgICAgICAgICAgICAuY2hpbGRyZW4oJ3NwYW4nKVxuICAgICAgICAgICAgICAgIC50ZXh0KCcnKTtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICAvKipcbiAgICAgICAgICogT3ZlcnJpZGUgdGhlIG11bHRpIHNlbGVjdCBjYXB0aW9uIHdoZW4gYWxsIGVsZW1lbnRzIGFyZSBzZWxlY3RlZC5cbiAgICAgICAgICpcbiAgICAgICAgICogVGhpcyBjYWxsYmFjayB3aWxsIG92ZXJyaWRlIHRoZSBjYXB0aW9uIGJlY2F1c2UgU3Vtb1NlbGVjdCBkb2VzIG5vdCBwcm92aWRlIGEgc2V0dGluZyBmb3IgdGhpcyB0ZXh0LlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX292ZXJyaWRlU2VsZWN0QWxsQ2FwdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnN0ICRvcHRXcmFwcGVyID0gJCh0aGlzKS5wYXJlbnRzKCcub3B0V3JhcHBlcicpO1xuICAgICAgICAgICAgY29uc3QgYWxsQ2hlY2tib3hlc0NoZWNrZWQgPSAkb3B0V3JhcHBlci5maW5kKCcub3B0LnNlbGVjdGVkJykubGVuZ3RoID09PSAkb3B0V3JhcHBlci5maW5kKCcub3B0JykubGVuZ3RoO1xuICAgICAgICAgICAgY29uc3QgYXRMZWFzdE9uZUNoZWNrYm94Q2hlY2tlZCA9ICRvcHRXcmFwcGVyLmZpbmQoJy5vcHQuc2VsZWN0ZWQnKS5sZW5ndGggPiAwO1xuICAgICAgICAgICAgY29uc3QgJHNlbGVjdEFsbENoZWNrYm94ID0gJG9wdFdyYXBwZXIuZmluZCgnLnNlbGVjdC1hbGwnKTtcbiAgICAgICAgICAgIGNvbnN0IGlzU2VsZWN0QWxsU2VsZWN0ZWQgPSAkc2VsZWN0QWxsQ2hlY2tib3guaGFzQ2xhc3MoJ3NlbGVjdGVkJylcbiAgICAgICAgICAgICAgICAmJiAhKCRzZWxlY3RBbGxDaGVja2JveC5oYXNDbGFzcygncGFydGlhbCcpIHx8ICRzZWxlY3RBbGxDaGVja2JveC5oYXNDbGFzcygncGFydGlhbC1zZWxlY3QnKSk7XG4gICAgICAgICAgICBjb25zdCBpc0Rlc2VsZWN0QWxsU2VsZWN0ZWQgPSBhbGxDaGVja2JveGVzQ2hlY2tlZCAmJiAhaXNTZWxlY3RBbGxTZWxlY3RlZCAmJiAhJHNlbGVjdEFsbENoZWNrYm94Lmhhc0NsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICBcbiAgICAgICAgICAgICRzZWxlY3RBbGxDaGVja2JveC5yZW1vdmVDbGFzcygncGFydGlhbC1zZWxlY3QnKTtcbiAgICAgICAgXG4gICAgICAgICAgICBpZiAoaXNEZXNlbGVjdEFsbFNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgX2Rlc2VsZWN0QWxsRWxlbWVudHMoJG9wdFdyYXBwZXIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhbGxDaGVja2JveGVzQ2hlY2tlZCkge1xuICAgICAgICAgICAgICAgIF9zZWxlY3RBbGxFbGVtZW50cygkb3B0V3JhcHBlcik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGF0TGVhc3RPbmVDaGVja2JveENoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICAkc2VsZWN0QWxsQ2hlY2tib3guYWRkQ2xhc3MoJ3BhcnRpYWwtc2VsZWN0Jyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlzU2VsZWN0QWxsU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICBfc2VsZWN0QWxsRWxlbWVudHMoJG9wdFdyYXBwZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIC8vIEFkZCBwdWJsaWMgbW9kdWxlIG1ldGhvZC5cbiAgICAgICAgICAgIF9hZGRQdWJsaWNNZXRob2QoKTtcblxuICAgICAgICAgICAgLy8gSW5pdGlhbGl6ZSB0aGUgZWxlbWVudHMuXG4gICAgICAgICAgICAkdGhpcy5maW5kKCdbZGF0YS1tdWx0aV9zZWxlY3QtaW5zdGFuY2VdJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgJHNlbGVjdCA9ICQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAkc2VsZWN0LnJlbW92ZUF0dHIoJ2RhdGEtbXVsdGlfc2VsZWN0LWluc3RhbmNlJyk7XG5cbiAgICAgICAgICAgICAgICAvLyBJbnN0YW50aWF0ZSB0aGUgd2lkZ2V0IHdpdGhvdXQgYW4gQUpBWCByZXF1ZXN0LlxuICAgICAgICAgICAgICAgICRzZWxlY3QuU3Vtb1NlbGVjdChvcHRpb25zKTtcblxuICAgICAgICAgICAgICAgIGlmICgkc2VsZWN0LmRhdGEoJ211bHRpX3NlbGVjdFNvdXJjZScpICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBkYXRhIGF0dHJpYnV0ZSBhbmQgc3RvcmUgdGhlIHZhbHVlIGludGVybmFsbHkgd2l0aCB0aGUgJ3NvdXJjZScga2V5LlxuICAgICAgICAgICAgICAgICAgICAkc2VsZWN0LmRhdGEoJ3NvdXJjZScsICRzZWxlY3QuZGF0YSgnbXVsdGlfc2VsZWN0U291cmNlJykpO1xuICAgICAgICAgICAgICAgICAgICAkc2VsZWN0LnJlbW92ZUF0dHIoJ2RhdGEtbXVsdGlfc2VsZWN0LXNvdXJjZScpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIEZldGNoIHRoZSBvcHRpb25zIHdpdGggYW4gQUpBWCByZXF1ZXN0LlxuICAgICAgICAgICAgICAgICAgICAkLmdldEpTT04oJHNlbGVjdC5kYXRhKCdtdWx0aV9zZWxlY3RTb3VyY2UnKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9maWxsU2VsZWN0KCRzZWxlY3QsIHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2VsZWN0WzBdLnN1bW8udW5sb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNlbGVjdC5TdW1vU2VsZWN0KG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzZWxlY3QudHJpZ2dlcigncmVsb2FkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24gKGpxeGhyLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzZS5jb3JlLmRlYnVnLmVycm9yKCdNdWx0aSBTZWxlY3QgQUpBWCBFcnJvcjogJywganF4aHIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gV2hlbiB0aGUgdXNlciBjbGlja3Mgb24gdGhlIFwiU2VsZWN0IEFsbFwiIG9wdGlvbiB1cGRhdGUgdGhlIHRleHQgd2l0aCBhIGN1c3RvbSB0cmFuc2xhdGlvbnMuIFRoaXMgaGFzIHRvXG4gICAgICAgIC8vIGJlIGRvbmUgbWFudWFsbHkgYmVjYXVzZSB0aGVyZSBpcyBubyBvcHRpb24gZm9yIHRoaXMgdGV4dCBpbiBTdW1vU2VsZWN0LlxuICAgICAgICAkdGhpcy5vbignY2xpY2snLCAnLnNlbGVjdC1hbGwsIC5vcHQnLCBfb3ZlcnJpZGVTZWxlY3RBbGxDYXB0aW9uKTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuXG4gICAgfSk7Il19
