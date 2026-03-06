'use strict';

/* --------------------------------------------------------------
 init.js 2016-08-23
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Properties Table Initialization Controller
 *
 * This controller initializes the main QuickEdit properties table with a new jQuery DataTables instance.
 */
gx.controllers.module('properties_init', [jse.source + '/vendor/datatables/jquery.dataTables.min.css', jse.source + '/vendor/datatables/jquery.dataTables.min.js', 'datatable', gx.source + '/libs/quick_edit_properties_overview_columns'], function (data) {

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
     * Module Instance
     *
     * @type {Object}
     */
    var module = {};

    /**
     * Selected Product IDs
     *
     * @type {Number[]}
     */
    var productIds = [0];

    /**
     * Properties Modal Selector
     *
     * @type {jQuery}
     */
    var $modal = $this.parents('.modal');

    /**
     * DataTable Columns
     *
     * @type {Object[]}
     */
    var columns = jse.libs.datatable.prepareColumns($this, jse.libs.quick_edit_properties_overview_columns, data.propertiesActiveColumns);

    /**
     * DataTable Options
     *
     * @type {Object}
     */
    var options = {
        autoWidth: false,
        dom: 't',
        pageLength: data.pageLength,
        displayStart: 0,
        serverSide: true,
        language: jse.libs.datatable.getTranslations(jse.core.config.get('languageCode')),
        ajax: {
            url: jse.core.config.get('appUrl') + '/admin/admin.php?do=QuickEditProductPropertiesAjax/DataTable',
            type: 'POST',
            data: function data(_data) {
                _data.productId = _getProductIds();
                _data.pageToken = jse.core.config.get('pageToken');
                return _data;
            }
        },
        orderCellsTop: true,
        order: _getOrder(),
        columns: columns,
        createdRow: function createdRow(row, data, dataIndex) {
            if (data.combiPriceType === 'fix') {
                $(row).find('td.combi-price').addClass('editable');
            }
        }
    };

    /**
     * Loading Spinner
     *
     * @type {jQuery}
     */
    var $spinner = null;

    // ------------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------------

    /**
     * Get Initial Table Order
     *
     * @return {Object[]} Returns the ordered column definitions.
     */
    function _getOrder() {
        var index = 1; // Order by first column by default.
        var direction = 'asc'; // Order ASC by default.
        var columnName = 'productsName'; // Order by products name by default.

        $this.on('click', 'th', function () {
            columnName = $(this).data('column-name');
            index = $this.DataTable().column(this).index();
        });

        // Apply initial table sort.
        if (data.propertiesActiveColumns.indexOf('productsName') > -1) {
            // Order by name if possible.
            index = data.propertiesActiveColumns.indexOf('productsName');
        }

        return [[index, direction]];
    }

    /**
     * Set current product IDs.
     *
     * @param {jQuery.Event} event Contains event information.
     */
    function _setProductIds(event) {
        productIds = [];

        if ($(event.target).is('a.products-properties')) {
            productIds.push($(this).parents('tr').data('id'));

            return;
        }

        var $singleCheckboxes = $this.parents('.quick-edit.overview').find('input:checkbox:checked.overview-row-selection');

        $singleCheckboxes.each(function () {
            productIds.push($(this).parents('tr').data('id'));
        });
    }

    /**
     * Get Product IDs.
     *
     * @return {Number[]} Returns the product IDs.
     */
    function _getProductIds() {
        return productIds;
    }

    /**
     * Properties modal shown event handler.
     */
    function _onModalShown() {
        $(window).trigger('resize');

        if (!$.fn.DataTable.isDataTable($this)) {
            jse.libs.datatable.create($this, options);

            return;
        }

        $this.DataTable().ajax.reload();
    }

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $modal.on('show.bs.modal', function () {
            $(this).find('.modal-dialog').css('z-index', 1060);
        }).on('shown.bs.modal', _onModalShown).on('hide.bs.modal', function () {
            $(this).find('.modal-dialog').css('z-index', 0);
        });

        $this.parents('.quick-edit.overview').on('click', 'a.products-properties', _setProductIds).on('click', 'a.bulk-properties-edit', _setProductIds);

        $this.on('draw.dt', function () {
            $this.find('thead input:checkbox').prop('checked', false).trigger('change', [false]);
            $this.find('tbody').attr('data-gx-widget', 'single_checkbox');
            $this.find('tbody').attr('data-single_checkbox-selector', '.properties-row-selection');

            gx.widgets.init($this);
        });

        $this.on('preXhr.dt', function () {
            return $spinner = jse.libs.loading_spinner.show($modal.find('.modal-content'), $modal.css('z-index'));
        });
        $this.on('xhr.dt', function () {
            return jse.libs.loading_spinner.hide($spinner);
        });

        jse.libs.datatable.create($this, options);

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1aWNrX2VkaXQvbW9kYWxzL3Byb3BlcnRpZXMvcHJvcGVydGllc19pbml0LmpzIl0sIm5hbWVzIjpbImd4IiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJqc2UiLCJzb3VyY2UiLCJkYXRhIiwiJHRoaXMiLCIkIiwicHJvZHVjdElkcyIsIiRtb2RhbCIsInBhcmVudHMiLCJjb2x1bW5zIiwibGlicyIsImRhdGF0YWJsZSIsInByZXBhcmVDb2x1bW5zIiwicXVpY2tfZWRpdF9wcm9wZXJ0aWVzX292ZXJ2aWV3X2NvbHVtbnMiLCJwcm9wZXJ0aWVzQWN0aXZlQ29sdW1ucyIsIm9wdGlvbnMiLCJhdXRvV2lkdGgiLCJkb20iLCJwYWdlTGVuZ3RoIiwiZGlzcGxheVN0YXJ0Iiwic2VydmVyU2lkZSIsImxhbmd1YWdlIiwiZ2V0VHJhbnNsYXRpb25zIiwiY29yZSIsImNvbmZpZyIsImdldCIsImFqYXgiLCJ1cmwiLCJ0eXBlIiwicHJvZHVjdElkIiwiX2dldFByb2R1Y3RJZHMiLCJwYWdlVG9rZW4iLCJvcmRlckNlbGxzVG9wIiwib3JkZXIiLCJfZ2V0T3JkZXIiLCJjcmVhdGVkUm93Iiwicm93IiwiZGF0YUluZGV4IiwiY29tYmlQcmljZVR5cGUiLCJmaW5kIiwiYWRkQ2xhc3MiLCIkc3Bpbm5lciIsImluZGV4IiwiZGlyZWN0aW9uIiwiY29sdW1uTmFtZSIsIm9uIiwiRGF0YVRhYmxlIiwiY29sdW1uIiwiaW5kZXhPZiIsIl9zZXRQcm9kdWN0SWRzIiwiZXZlbnQiLCJ0YXJnZXQiLCJpcyIsInB1c2giLCIkc2luZ2xlQ2hlY2tib3hlcyIsImVhY2giLCJfb25Nb2RhbFNob3duIiwid2luZG93IiwidHJpZ2dlciIsImZuIiwiaXNEYXRhVGFibGUiLCJjcmVhdGUiLCJyZWxvYWQiLCJpbml0IiwiZG9uZSIsImNzcyIsInByb3AiLCJhdHRyIiwid2lkZ2V0cyIsImxvYWRpbmdfc3Bpbm5lciIsInNob3ciLCJoaWRlIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7O0FBS0FBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZixDQUNJLGlCQURKLEVBR0ksQ0FDT0MsSUFBSUMsTUFEWCxtREFFT0QsSUFBSUMsTUFGWCxrREFHSSxXQUhKLEVBSU9KLEdBQUdJLE1BSlYsa0RBSEosRUFVSSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O0FBS0EsUUFBTUMsUUFBUUMsRUFBRSxJQUFGLENBQWQ7O0FBRUE7Ozs7O0FBS0EsUUFBTUwsU0FBUyxFQUFmOztBQUVBOzs7OztBQUtBLFFBQUlNLGFBQWEsQ0FBQyxDQUFELENBQWpCOztBQUVBOzs7OztBQUtBLFFBQU1DLFNBQVNILE1BQU1JLE9BQU4sQ0FBYyxRQUFkLENBQWY7O0FBRUE7Ozs7O0FBS0EsUUFBTUMsVUFBVVIsSUFBSVMsSUFBSixDQUFTQyxTQUFULENBQW1CQyxjQUFuQixDQUFrQ1IsS0FBbEMsRUFBeUNILElBQUlTLElBQUosQ0FBU0csc0NBQWxELEVBQTBGVixLQUFLVyx1QkFBL0YsQ0FBaEI7O0FBRUE7Ozs7O0FBS0EsUUFBTUMsVUFBVTtBQUNaQyxtQkFBVyxLQURDO0FBRVpDLGFBQUssR0FGTztBQUdaQyxvQkFBWWYsS0FBS2UsVUFITDtBQUlaQyxzQkFBYyxDQUpGO0FBS1pDLG9CQUFZLElBTEE7QUFNWkMsa0JBQVVwQixJQUFJUyxJQUFKLENBQVNDLFNBQVQsQ0FBbUJXLGVBQW5CLENBQW1DckIsSUFBSXNCLElBQUosQ0FBU0MsTUFBVCxDQUFnQkMsR0FBaEIsQ0FBb0IsY0FBcEIsQ0FBbkMsQ0FORTtBQU9aQyxjQUFNO0FBQ0ZDLGlCQUFLMUIsSUFBSXNCLElBQUosQ0FBU0MsTUFBVCxDQUFnQkMsR0FBaEIsQ0FBb0IsUUFBcEIsSUFBZ0MsOERBRG5DO0FBRUZHLGtCQUFNLE1BRko7QUFHRnpCLGtCQUFNLGNBQUNBLEtBQUQsRUFBVTtBQUNaQSxzQkFBSzBCLFNBQUwsR0FBaUJDLGdCQUFqQjtBQUNBM0Isc0JBQUs0QixTQUFMLEdBQWlCOUIsSUFBSXNCLElBQUosQ0FBU0MsTUFBVCxDQUFnQkMsR0FBaEIsQ0FBb0IsV0FBcEIsQ0FBakI7QUFDQSx1QkFBT3RCLEtBQVA7QUFDSDtBQVBDLFNBUE07QUFnQlo2Qix1QkFBZSxJQWhCSDtBQWlCWkMsZUFBT0MsV0FqQks7QUFrQlp6QixpQkFBU0EsT0FsQkc7QUFtQlowQixrQkFuQlksc0JBbUJEQyxHQW5CQyxFQW1CSWpDLElBbkJKLEVBbUJVa0MsU0FuQlYsRUFtQnFCO0FBQzdCLGdCQUFJbEMsS0FBS21DLGNBQUwsS0FBd0IsS0FBNUIsRUFBbUM7QUFDL0JqQyxrQkFBRStCLEdBQUYsRUFBT0csSUFBUCxDQUFZLGdCQUFaLEVBQThCQyxRQUE5QixDQUF1QyxVQUF2QztBQUNIO0FBQ0o7QUF2QlcsS0FBaEI7O0FBMEJBOzs7OztBQUtBLFFBQUlDLFdBQVcsSUFBZjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7O0FBS0EsYUFBU1AsU0FBVCxHQUFxQjtBQUNqQixZQUFJUSxRQUFRLENBQVosQ0FEaUIsQ0FDRjtBQUNmLFlBQUlDLFlBQVksS0FBaEIsQ0FGaUIsQ0FFTTtBQUN2QixZQUFJQyxhQUFhLGNBQWpCLENBSGlCLENBR2dCOztBQUVqQ3hDLGNBQU15QyxFQUFOLENBQVMsT0FBVCxFQUFrQixJQUFsQixFQUF3QixZQUFZO0FBQ2hDRCx5QkFBYXZDLEVBQUUsSUFBRixFQUFRRixJQUFSLENBQWEsYUFBYixDQUFiO0FBQ0F1QyxvQkFBUXRDLE1BQU0wQyxTQUFOLEdBQWtCQyxNQUFsQixDQUF5QixJQUF6QixFQUErQkwsS0FBL0IsRUFBUjtBQUNILFNBSEQ7O0FBS0E7QUFDQSxZQUFJdkMsS0FBS1csdUJBQUwsQ0FBNkJrQyxPQUE3QixDQUFxQyxjQUFyQyxJQUF1RCxDQUFDLENBQTVELEVBQStEO0FBQUU7QUFDN0ROLG9CQUFRdkMsS0FBS1csdUJBQUwsQ0FBNkJrQyxPQUE3QixDQUFxQyxjQUFyQyxDQUFSO0FBQ0g7O0FBRUQsZUFBTyxDQUFDLENBQUNOLEtBQUQsRUFBUUMsU0FBUixDQUFELENBQVA7QUFDSDs7QUFFRDs7Ozs7QUFLQSxhQUFTTSxjQUFULENBQXdCQyxLQUF4QixFQUErQjtBQUMzQjVDLHFCQUFhLEVBQWI7O0FBRUEsWUFBSUQsRUFBRTZDLE1BQU1DLE1BQVIsRUFBZ0JDLEVBQWhCLENBQW1CLHVCQUFuQixDQUFKLEVBQWlEO0FBQzdDOUMsdUJBQVcrQyxJQUFYLENBQWdCaEQsRUFBRSxJQUFGLEVBQVFHLE9BQVIsQ0FBZ0IsSUFBaEIsRUFBc0JMLElBQXRCLENBQTJCLElBQTNCLENBQWhCOztBQUVBO0FBQ0g7O0FBRUQsWUFBTW1ELG9CQUFvQmxELE1BQU1JLE9BQU4sQ0FBYyxzQkFBZCxFQUNyQitCLElBRHFCLENBQ2hCLCtDQURnQixDQUExQjs7QUFHQWUsMEJBQWtCQyxJQUFsQixDQUF1QixZQUFZO0FBQy9CakQsdUJBQVcrQyxJQUFYLENBQWdCaEQsRUFBRSxJQUFGLEVBQVFHLE9BQVIsQ0FBZ0IsSUFBaEIsRUFBc0JMLElBQXRCLENBQTJCLElBQTNCLENBQWhCO0FBQ0gsU0FGRDtBQUdIOztBQUVEOzs7OztBQUtBLGFBQVMyQixjQUFULEdBQTBCO0FBQ3RCLGVBQU94QixVQUFQO0FBQ0g7O0FBRUQ7OztBQUdBLGFBQVNrRCxhQUFULEdBQXlCO0FBQ3JCbkQsVUFBRW9ELE1BQUYsRUFBVUMsT0FBVixDQUFrQixRQUFsQjs7QUFFQSxZQUFJLENBQUNyRCxFQUFFc0QsRUFBRixDQUFLYixTQUFMLENBQWVjLFdBQWYsQ0FBMkJ4RCxLQUEzQixDQUFMLEVBQXdDO0FBQ3BDSCxnQkFBSVMsSUFBSixDQUFTQyxTQUFULENBQW1Ca0QsTUFBbkIsQ0FBMEJ6RCxLQUExQixFQUFpQ1csT0FBakM7O0FBRUE7QUFDSDs7QUFFRFgsY0FBTTBDLFNBQU4sR0FBa0JwQixJQUFsQixDQUF1Qm9DLE1BQXZCO0FBQ0g7O0FBR0Q7QUFDQTtBQUNBOztBQUVBOUQsV0FBTytELElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCO0FBQzFCekQsZUFDS3NDLEVBREwsQ0FDUSxlQURSLEVBQ3lCLFlBQVk7QUFDN0J4QyxjQUFFLElBQUYsRUFBUWtDLElBQVIsQ0FBYSxlQUFiLEVBQThCMEIsR0FBOUIsQ0FBa0MsU0FBbEMsRUFBNkMsSUFBN0M7QUFDSCxTQUhMLEVBSUtwQixFQUpMLENBSVEsZ0JBSlIsRUFJMEJXLGFBSjFCLEVBS0tYLEVBTEwsQ0FLUSxlQUxSLEVBS3lCLFlBQVk7QUFDN0J4QyxjQUFFLElBQUYsRUFBUWtDLElBQVIsQ0FBYSxlQUFiLEVBQThCMEIsR0FBOUIsQ0FBa0MsU0FBbEMsRUFBNkMsQ0FBN0M7QUFDSCxTQVBMOztBQVNBN0QsY0FBTUksT0FBTixDQUFjLHNCQUFkLEVBQ0txQyxFQURMLENBQ1EsT0FEUixFQUNpQix1QkFEakIsRUFDMENJLGNBRDFDLEVBRUtKLEVBRkwsQ0FFUSxPQUZSLEVBRWlCLHdCQUZqQixFQUUyQ0ksY0FGM0M7O0FBSUE3QyxjQUFNeUMsRUFBTixDQUFTLFNBQVQsRUFBb0IsWUFBTTtBQUN0QnpDLGtCQUFNbUMsSUFBTixDQUFXLHNCQUFYLEVBQ0syQixJQURMLENBQ1UsU0FEVixFQUNxQixLQURyQixFQUVLUixPQUZMLENBRWEsUUFGYixFQUV1QixDQUFDLEtBQUQsQ0FGdkI7QUFHQXRELGtCQUFNbUMsSUFBTixDQUFXLE9BQVgsRUFBb0I0QixJQUFwQixDQUF5QixnQkFBekIsRUFBMkMsaUJBQTNDO0FBQ0EvRCxrQkFBTW1DLElBQU4sQ0FBVyxPQUFYLEVBQW9CNEIsSUFBcEIsQ0FBeUIsK0JBQXpCLEVBQTBELDJCQUExRDs7QUFFQXJFLGVBQUdzRSxPQUFILENBQVdMLElBQVgsQ0FBZ0IzRCxLQUFoQjtBQUNILFNBUkQ7O0FBVUFBLGNBQU15QyxFQUFOLENBQVMsV0FBVCxFQUFzQjtBQUFBLG1CQUFNSixXQUN4QnhDLElBQUlTLElBQUosQ0FBUzJELGVBQVQsQ0FBeUJDLElBQXpCLENBQThCL0QsT0FBT2dDLElBQVAsQ0FBWSxnQkFBWixDQUE5QixFQUE2RGhDLE9BQU8wRCxHQUFQLENBQVcsU0FBWCxDQUE3RCxDQURrQjtBQUFBLFNBQXRCO0FBRUE3RCxjQUFNeUMsRUFBTixDQUFTLFFBQVQsRUFBbUI7QUFBQSxtQkFBTTVDLElBQUlTLElBQUosQ0FBUzJELGVBQVQsQ0FBeUJFLElBQXpCLENBQThCOUIsUUFBOUIsQ0FBTjtBQUFBLFNBQW5COztBQUVBeEMsWUFBSVMsSUFBSixDQUFTQyxTQUFULENBQW1Ca0QsTUFBbkIsQ0FBMEJ6RCxLQUExQixFQUFpQ1csT0FBakM7O0FBRUFpRDtBQUNILEtBL0JEOztBQWlDQSxXQUFPaEUsTUFBUDtBQUNILENBM01MIiwiZmlsZSI6InF1aWNrX2VkaXQvbW9kYWxzL3Byb3BlcnRpZXMvcHJvcGVydGllc19pbml0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBpbml0LmpzIDIwMTYtMDgtMjNcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqIFByb3BlcnRpZXMgVGFibGUgSW5pdGlhbGl6YXRpb24gQ29udHJvbGxlclxuICpcbiAqIFRoaXMgY29udHJvbGxlciBpbml0aWFsaXplcyB0aGUgbWFpbiBRdWlja0VkaXQgcHJvcGVydGllcyB0YWJsZSB3aXRoIGEgbmV3IGpRdWVyeSBEYXRhVGFibGVzIGluc3RhbmNlLlxuICovXG5neC5jb250cm9sbGVycy5tb2R1bGUoXG4gICAgJ3Byb3BlcnRpZXNfaW5pdCcsXG5cbiAgICBbXG4gICAgICAgIGAke2pzZS5zb3VyY2V9L3ZlbmRvci9kYXRhdGFibGVzL2pxdWVyeS5kYXRhVGFibGVzLm1pbi5jc3NgLFxuICAgICAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3IvZGF0YXRhYmxlcy9qcXVlcnkuZGF0YVRhYmxlcy5taW4uanNgLFxuICAgICAgICAnZGF0YXRhYmxlJyxcbiAgICAgICAgYCR7Z3guc291cmNlfS9saWJzL3F1aWNrX2VkaXRfcHJvcGVydGllc19vdmVydmlld19jb2x1bW5zYFxuICAgIF0sXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEVTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIEluc3RhbmNlXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2VsZWN0ZWQgUHJvZHVjdCBJRHNcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge051bWJlcltdfVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IHByb2R1Y3RJZHMgPSBbMF07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFByb3BlcnRpZXMgTW9kYWwgU2VsZWN0b3JcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICRtb2RhbCA9ICR0aGlzLnBhcmVudHMoJy5tb2RhbCcpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEYXRhVGFibGUgQ29sdW1uc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0W119XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBjb2x1bW5zID0ganNlLmxpYnMuZGF0YXRhYmxlLnByZXBhcmVDb2x1bW5zKCR0aGlzLCBqc2UubGlicy5xdWlja19lZGl0X3Byb3BlcnRpZXNfb3ZlcnZpZXdfY29sdW1ucywgZGF0YS5wcm9wZXJ0aWVzQWN0aXZlQ29sdW1ucyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERhdGFUYWJsZSBPcHRpb25zXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAgICAgYXV0b1dpZHRoOiBmYWxzZSxcbiAgICAgICAgICAgIGRvbTogJ3QnLFxuICAgICAgICAgICAgcGFnZUxlbmd0aDogZGF0YS5wYWdlTGVuZ3RoLFxuICAgICAgICAgICAgZGlzcGxheVN0YXJ0OiAwLFxuICAgICAgICAgICAgc2VydmVyU2lkZTogdHJ1ZSxcbiAgICAgICAgICAgIGxhbmd1YWdlOiBqc2UubGlicy5kYXRhdGFibGUuZ2V0VHJhbnNsYXRpb25zKGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2xhbmd1YWdlQ29kZScpKSxcbiAgICAgICAgICAgIGFqYXg6IHtcbiAgICAgICAgICAgICAgICB1cmw6IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpICsgJy9hZG1pbi9hZG1pbi5waHA/ZG89UXVpY2tFZGl0UHJvZHVjdFByb3BlcnRpZXNBamF4L0RhdGFUYWJsZScsXG4gICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIGRhdGE6IChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEucHJvZHVjdElkID0gX2dldFByb2R1Y3RJZHMoKTtcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5wYWdlVG9rZW4gPSBqc2UuY29yZS5jb25maWcuZ2V0KCdwYWdlVG9rZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9yZGVyQ2VsbHNUb3A6IHRydWUsXG4gICAgICAgICAgICBvcmRlcjogX2dldE9yZGVyKCksXG4gICAgICAgICAgICBjb2x1bW5zOiBjb2x1bW5zLFxuICAgICAgICAgICAgY3JlYXRlZFJvdyhyb3csIGRhdGEsIGRhdGFJbmRleCkge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLmNvbWJpUHJpY2VUeXBlID09PSAnZml4Jykge1xuICAgICAgICAgICAgICAgICAgICAkKHJvdykuZmluZCgndGQuY29tYmktcHJpY2UnKS5hZGRDbGFzcygnZWRpdGFibGUnKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9hZGluZyBTcGlubmVyXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICBsZXQgJHNwaW5uZXIgPSBudWxsO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBGVU5DVElPTlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldCBJbml0aWFsIFRhYmxlIE9yZGVyXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge09iamVjdFtdfSBSZXR1cm5zIHRoZSBvcmRlcmVkIGNvbHVtbiBkZWZpbml0aW9ucy5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9nZXRPcmRlcigpIHtcbiAgICAgICAgICAgIGxldCBpbmRleCA9IDE7IC8vIE9yZGVyIGJ5IGZpcnN0IGNvbHVtbiBieSBkZWZhdWx0LlxuICAgICAgICAgICAgbGV0IGRpcmVjdGlvbiA9ICdhc2MnOyAvLyBPcmRlciBBU0MgYnkgZGVmYXVsdC5cbiAgICAgICAgICAgIGxldCBjb2x1bW5OYW1lID0gJ3Byb2R1Y3RzTmFtZSc7IC8vIE9yZGVyIGJ5IHByb2R1Y3RzIG5hbWUgYnkgZGVmYXVsdC5cblxuICAgICAgICAgICAgJHRoaXMub24oJ2NsaWNrJywgJ3RoJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbHVtbk5hbWUgPSAkKHRoaXMpLmRhdGEoJ2NvbHVtbi1uYW1lJyk7XG4gICAgICAgICAgICAgICAgaW5kZXggPSAkdGhpcy5EYXRhVGFibGUoKS5jb2x1bW4odGhpcykuaW5kZXgoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBBcHBseSBpbml0aWFsIHRhYmxlIHNvcnQuXG4gICAgICAgICAgICBpZiAoZGF0YS5wcm9wZXJ0aWVzQWN0aXZlQ29sdW1ucy5pbmRleE9mKCdwcm9kdWN0c05hbWUnKSA+IC0xKSB7IC8vIE9yZGVyIGJ5IG5hbWUgaWYgcG9zc2libGUuXG4gICAgICAgICAgICAgICAgaW5kZXggPSBkYXRhLnByb3BlcnRpZXNBY3RpdmVDb2x1bW5zLmluZGV4T2YoJ3Byb2R1Y3RzTmFtZScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gW1tpbmRleCwgZGlyZWN0aW9uXV07XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0IGN1cnJlbnQgcHJvZHVjdCBJRHMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5LkV2ZW50fSBldmVudCBDb250YWlucyBldmVudCBpbmZvcm1hdGlvbi5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9zZXRQcm9kdWN0SWRzKGV2ZW50KSB7XG4gICAgICAgICAgICBwcm9kdWN0SWRzID0gW107XG5cbiAgICAgICAgICAgIGlmICgkKGV2ZW50LnRhcmdldCkuaXMoJ2EucHJvZHVjdHMtcHJvcGVydGllcycpKSB7XG4gICAgICAgICAgICAgICAgcHJvZHVjdElkcy5wdXNoKCQodGhpcykucGFyZW50cygndHInKS5kYXRhKCdpZCcpKTtcblxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgJHNpbmdsZUNoZWNrYm94ZXMgPSAkdGhpcy5wYXJlbnRzKCcucXVpY2stZWRpdC5vdmVydmlldycpXG4gICAgICAgICAgICAgICAgLmZpbmQoJ2lucHV0OmNoZWNrYm94OmNoZWNrZWQub3ZlcnZpZXctcm93LXNlbGVjdGlvbicpO1xuXG4gICAgICAgICAgICAkc2luZ2xlQ2hlY2tib3hlcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBwcm9kdWN0SWRzLnB1c2goJCh0aGlzKS5wYXJlbnRzKCd0cicpLmRhdGEoJ2lkJykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogR2V0IFByb2R1Y3QgSURzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtOdW1iZXJbXX0gUmV0dXJucyB0aGUgcHJvZHVjdCBJRHMuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfZ2V0UHJvZHVjdElkcygpIHtcbiAgICAgICAgICAgIHJldHVybiBwcm9kdWN0SWRzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFByb3BlcnRpZXMgbW9kYWwgc2hvd24gZXZlbnQgaGFuZGxlci5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vbk1vZGFsU2hvd24oKSB7XG4gICAgICAgICAgICAkKHdpbmRvdykudHJpZ2dlcigncmVzaXplJyk7XG5cbiAgICAgICAgICAgIGlmICghJC5mbi5EYXRhVGFibGUuaXNEYXRhVGFibGUoJHRoaXMpKSB7XG4gICAgICAgICAgICAgICAganNlLmxpYnMuZGF0YXRhYmxlLmNyZWF0ZSgkdGhpcywgb3B0aW9ucyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICR0aGlzLkRhdGFUYWJsZSgpLmFqYXgucmVsb2FkKCk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICAkbW9kYWxcbiAgICAgICAgICAgICAgICAub24oJ3Nob3cuYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnLm1vZGFsLWRpYWxvZycpLmNzcygnei1pbmRleCcsIDEwNjApXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAub24oJ3Nob3duLmJzLm1vZGFsJywgX29uTW9kYWxTaG93bilcbiAgICAgICAgICAgICAgICAub24oJ2hpZGUuYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnLm1vZGFsLWRpYWxvZycpLmNzcygnei1pbmRleCcsIDApXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICR0aGlzLnBhcmVudHMoJy5xdWljay1lZGl0Lm92ZXJ2aWV3JylcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgJ2EucHJvZHVjdHMtcHJvcGVydGllcycsIF9zZXRQcm9kdWN0SWRzKVxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCAnYS5idWxrLXByb3BlcnRpZXMtZWRpdCcsIF9zZXRQcm9kdWN0SWRzKTtcblxuICAgICAgICAgICAgJHRoaXMub24oJ2RyYXcuZHQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgJHRoaXMuZmluZCgndGhlYWQgaW5wdXQ6Y2hlY2tib3gnKVxuICAgICAgICAgICAgICAgICAgICAucHJvcCgnY2hlY2tlZCcsIGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICAudHJpZ2dlcignY2hhbmdlJywgW2ZhbHNlXSk7XG4gICAgICAgICAgICAgICAgJHRoaXMuZmluZCgndGJvZHknKS5hdHRyKCdkYXRhLWd4LXdpZGdldCcsICdzaW5nbGVfY2hlY2tib3gnKTtcbiAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCd0Ym9keScpLmF0dHIoJ2RhdGEtc2luZ2xlX2NoZWNrYm94LXNlbGVjdG9yJywgJy5wcm9wZXJ0aWVzLXJvdy1zZWxlY3Rpb24nKTtcblxuICAgICAgICAgICAgICAgIGd4LndpZGdldHMuaW5pdCgkdGhpcyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHRoaXMub24oJ3ByZVhoci5kdCcsICgpID0+ICRzcGlubmVyID1cbiAgICAgICAgICAgICAgICBqc2UubGlicy5sb2FkaW5nX3NwaW5uZXIuc2hvdygkbW9kYWwuZmluZCgnLm1vZGFsLWNvbnRlbnQnKSwgJG1vZGFsLmNzcygnei1pbmRleCcpKSk7XG4gICAgICAgICAgICAkdGhpcy5vbigneGhyLmR0JywgKCkgPT4ganNlLmxpYnMubG9hZGluZ19zcGlubmVyLmhpZGUoJHNwaW5uZXIpKTtcblxuICAgICAgICAgICAganNlLmxpYnMuZGF0YXRhYmxlLmNyZWF0ZSgkdGhpcywgb3B0aW9ucyk7XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pOyJdfQ==
