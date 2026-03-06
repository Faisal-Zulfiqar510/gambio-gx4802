'use strict';

/* --------------------------------------------------------------
 special_price_init 2016-12-14
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Special Prices Table Initializations Controller
 *
 * This controller initializes the main QuickEdit special prices table with a new jQuery DataTables instance.
 */
gx.controllers.module('special_prices_init', [jse.source + '/vendor/datatables/jquery.dataTables.min.css', jse.source + '/vendor/datatables/jquery.dataTables.min.js', 'datatable', gx.source + '/libs/quick_edit_special_prices_overview_columns'], function (data) {

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
    var columns = jse.libs.datatable.prepareColumns($this, jse.libs.quick_edit_special_prices_overview_columns, data.specialPriceActiveColumns);

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
            url: jse.core.config.get('appUrl') + '/admin/admin.php?do=QuickEditSpecialPricesAjax/DataTable',
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
            if (data.specialPriceIsNewEntry === true) {
                $(row).addClass('special-new-entry');
            }
        }
    };

    /**
     * Loading Spinner
     *
     * @type {jQuery}
     */
    var $spinner = null;

    // --------------------------------------------------------------------
    // FUNCTIONS
    // --------------------------------------------------------------------

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

        if (data.specialPriceActiveColumns.indexOf('productsName') > -1) {
            // Order by name if possible.
            index = data.specialPriceActiveColumns.indexOf('productsName');
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

        if ($(event.target).is('a.special-price')) {
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
     * Special prices modal shown event handler.
     */
    function _onModalShown() {
        $this.parents('body').find('.comiseo-daterangepicker').css('z-index', 1070);
        $(window).trigger('resize');

        if (!$.fn.DataTable.isDataTable($this)) {
            jse.libs.datatable.create($this, options);

            return;
        }

        $this.DataTable().ajax.reload();
    }

    // --------------------------------------------------------------------
    // INITIALIZATION
    // --------------------------------------------------------------------

    module.init = function (done) {
        $modal.on('show.bs.modal', function () {
            $(this).find('.modal-dialog').css('z-index', 1060);
        }).on('shown.bs.modal', _onModalShown).on('hide.bs.modal', function () {
            $(this).find('.modal-dialog').css('z-index', 0);
        });

        $this.parents('.quick-edit.overview').on('click', 'a.special-price', _setProductIds).on('click', 'a.bulk-special-price-edit', _setProductIds);

        $this.on('draw.dt', function () {
            $this.find('thead input:checkbox').prop('checked', false).trigger('change', [false]);
            $this.find('tbody').attr('data-gx-widget', 'single_checkbox switcher');
            $this.find('tbody').attr('data-single_checkbox-selector', '.special-price-row-selection');
            $this.find('tbody').attr('data-switcher-selector', '.convert-to-switcher');

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1aWNrX2VkaXQvbW9kYWxzL3NwZWNpYWxfcHJpY2VzL3NwZWNpYWxfcHJpY2VzX2luaXQuanMiXSwibmFtZXMiOlsiZ3giLCJjb250cm9sbGVycyIsIm1vZHVsZSIsImpzZSIsInNvdXJjZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJwcm9kdWN0SWRzIiwiJG1vZGFsIiwicGFyZW50cyIsImNvbHVtbnMiLCJsaWJzIiwiZGF0YXRhYmxlIiwicHJlcGFyZUNvbHVtbnMiLCJxdWlja19lZGl0X3NwZWNpYWxfcHJpY2VzX292ZXJ2aWV3X2NvbHVtbnMiLCJzcGVjaWFsUHJpY2VBY3RpdmVDb2x1bW5zIiwib3B0aW9ucyIsImF1dG9XaWR0aCIsImRvbSIsInBhZ2VMZW5ndGgiLCJkaXNwbGF5U3RhcnQiLCJzZXJ2ZXJTaWRlIiwibGFuZ3VhZ2UiLCJnZXRUcmFuc2xhdGlvbnMiLCJjb3JlIiwiY29uZmlnIiwiZ2V0IiwiYWpheCIsInVybCIsInR5cGUiLCJwcm9kdWN0SWQiLCJfZ2V0UHJvZHVjdElkcyIsInBhZ2VUb2tlbiIsIm9yZGVyQ2VsbHNUb3AiLCJvcmRlciIsIl9nZXRPcmRlciIsImNyZWF0ZWRSb3ciLCJyb3ciLCJkYXRhSW5kZXgiLCJzcGVjaWFsUHJpY2VJc05ld0VudHJ5IiwiYWRkQ2xhc3MiLCIkc3Bpbm5lciIsImluZGV4IiwiZGlyZWN0aW9uIiwiY29sdW1uTmFtZSIsIm9uIiwiRGF0YVRhYmxlIiwiY29sdW1uIiwiaW5kZXhPZiIsIl9zZXRQcm9kdWN0SWRzIiwiZXZlbnQiLCJ0YXJnZXQiLCJpcyIsInB1c2giLCIkc2luZ2xlQ2hlY2tib3hlcyIsImZpbmQiLCJlYWNoIiwiX29uTW9kYWxTaG93biIsImNzcyIsIndpbmRvdyIsInRyaWdnZXIiLCJmbiIsImlzRGF0YVRhYmxlIiwiY3JlYXRlIiwicmVsb2FkIiwiaW5pdCIsImRvbmUiLCJwcm9wIiwiYXR0ciIsIndpZGdldHMiLCJsb2FkaW5nX3NwaW5uZXIiLCJzaG93IiwiaGlkZSJdLCJt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QUFBQSxtQkFBTUosV0FDeEJ2QyxJQUFJUyxJQUFKLENBQVMyRCxlQUFULENBQXlCQyxJQUF6QixDQUE4Qi9ELE9BQU8rQyxJQUFQLENBQVksZ0JBQVosQ0FBOUIsRUFBNkQvQyxPQUFPa0QsR0FBUCxDQUFXLFNBQVgsQ0FBN0QsQ0FEa0I7QUFBQSxTQUF0QjtBQUVBckQsY0FBTXdDLEVBQU4sQ0FBUyxRQUFULEVBQW1CO0FBQUEsbUJBQU0zQyxJQUFJUyxJQUFKLENBQVMyRCxlQUFULENBQXlCRSxJQUF6QixDQUE4Qi9CLFFBQTlCLENBQU47QUFBQSxTQUFuQjs7QUFFQXZDLFlBQUlTLElBQUosQ0FBU0MsU0FBVCxDQUFtQm1ELE1BQW5CLENBQTBCMUQsS0FBMUIsRUFBaUNXLE9BQWpDOztBQUVBa0Q7QUFDSCxLQWhDRDs7QUFrQ0EsV0FBT2pFLE1BQVA7QUFDSCxDQTNNTCIsImZpbGUiOiJxdWlja19lZGl0L21vZGFscy9zcGVjaWFsX3ByaWNlcy9zcGVjaWFsX3ByaWNlc19pbml0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBzcGVjaWFsX3ByaWNlX2luaXQgMjAxNi0xMi0xNFxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTYgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogU3BlY2lhbCBQcmljZXMgVGFibGUgSW5pdGlhbGl6YXRpb25zIENvbnRyb2xsZXJcbiAqXG4gKiBUaGlzIGNvbnRyb2xsZXIgaW5pdGlhbGl6ZXMgdGhlIG1haW4gUXVpY2tFZGl0IHNwZWNpYWwgcHJpY2VzIHRhYmxlIHdpdGggYSBuZXcgalF1ZXJ5IERhdGFUYWJsZXMgaW5zdGFuY2UuXG4gKi9cbmd4LmNvbnRyb2xsZXJzLm1vZHVsZShcbiAgICAnc3BlY2lhbF9wcmljZXNfaW5pdCcsXG5cbiAgICBbXG4gICAgICAgIGAke2pzZS5zb3VyY2V9L3ZlbmRvci9kYXRhdGFibGVzL2pxdWVyeS5kYXRhVGFibGVzLm1pbi5jc3NgLFxuICAgICAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3IvZGF0YXRhYmxlcy9qcXVlcnkuZGF0YVRhYmxlcy5taW4uanNgLFxuICAgICAgICAnZGF0YXRhYmxlJyxcbiAgICAgICAgYCR7Z3guc291cmNlfS9saWJzL3F1aWNrX2VkaXRfc3BlY2lhbF9wcmljZXNfb3ZlcnZpZXdfY29sdW1uc2BcbiAgICBdLFxuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEVTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgSW5zdGFuY2VcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZWxlY3RlZCBQcm9kdWN0IElEc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7TnVtYmVyW119XG4gICAgICAgICAqL1xuICAgICAgICBsZXQgcHJvZHVjdElkcyA9IFswXTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUHJvcGVydGllcyBNb2RhbCBTZWxlY3RvclxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJG1vZGFsID0gJHRoaXMucGFyZW50cygnLm1vZGFsJyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERhdGFUYWJsZSBDb2x1bW5zXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3RbXX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGNvbHVtbnMgPSBqc2UubGlicy5kYXRhdGFibGUucHJlcGFyZUNvbHVtbnMoJHRoaXMsIGpzZS5saWJzLnF1aWNrX2VkaXRfc3BlY2lhbF9wcmljZXNfb3ZlcnZpZXdfY29sdW1ucywgZGF0YS5zcGVjaWFsUHJpY2VBY3RpdmVDb2x1bW5zKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGF0YVRhYmxlIE9wdGlvbnNcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBhdXRvV2lkdGg6IGZhbHNlLFxuICAgICAgICAgICAgZG9tOiAndCcsXG4gICAgICAgICAgICBwYWdlTGVuZ3RoOiBkYXRhLnBhZ2VMZW5ndGgsXG4gICAgICAgICAgICBkaXNwbGF5U3RhcnQ6IDAsXG4gICAgICAgICAgICBzZXJ2ZXJTaWRlOiB0cnVlLFxuICAgICAgICAgICAgbGFuZ3VhZ2U6IGpzZS5saWJzLmRhdGF0YWJsZS5nZXRUcmFuc2xhdGlvbnMoanNlLmNvcmUuY29uZmlnLmdldCgnbGFuZ3VhZ2VDb2RlJykpLFxuICAgICAgICAgICAgYWpheDoge1xuICAgICAgICAgICAgICAgIHVybDoganNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJykgKyAnL2FkbWluL2FkbWluLnBocD9kbz1RdWlja0VkaXRTcGVjaWFsUHJpY2VzQWpheC9EYXRhVGFibGUnLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICBkYXRhOiAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBkYXRhLnByb2R1Y3RJZCA9IF9nZXRQcm9kdWN0SWRzKCk7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEucGFnZVRva2VuID0ganNlLmNvcmUuY29uZmlnLmdldCgncGFnZVRva2VuJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvcmRlckNlbGxzVG9wOiB0cnVlLFxuICAgICAgICAgICAgb3JkZXI6IF9nZXRPcmRlcigpLFxuICAgICAgICAgICAgY29sdW1uczogY29sdW1ucyxcbiAgICAgICAgICAgIGNyZWF0ZWRSb3cocm93LCBkYXRhLCBkYXRhSW5kZXgpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5zcGVjaWFsUHJpY2VJc05ld0VudHJ5ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICQocm93KS5hZGRDbGFzcygnc3BlY2lhbC1uZXctZW50cnknKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvYWRpbmcgU3Bpbm5lclxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0ICRzcGlubmVyID0gbnVsbDtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBGVU5DVElPTlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogR2V0IEluaXRpYWwgVGFibGUgT3JkZXJcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7T2JqZWN0W119IFJldHVybnMgdGhlIG9yZGVyZWQgY29sdW1uIGRlZmluaXRpb25zLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2dldE9yZGVyKCkge1xuICAgICAgICAgICAgbGV0IGluZGV4ID0gMTsgLy8gT3JkZXIgYnkgZmlyc3QgY29sdW1uIGJ5IGRlZmF1bHQuXG4gICAgICAgICAgICBsZXQgZGlyZWN0aW9uID0gJ2FzYyc7IC8vIE9yZGVyIEFTQyBieSBkZWZhdWx0LlxuICAgICAgICAgICAgbGV0IGNvbHVtbk5hbWUgPSAncHJvZHVjdHNOYW1lJzsgLy8gT3JkZXIgYnkgcHJvZHVjdHMgbmFtZSBieSBkZWZhdWx0LlxuXG4gICAgICAgICAgICAkdGhpcy5vbignY2xpY2snLCAndGgnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29sdW1uTmFtZSA9ICQodGhpcykuZGF0YSgnY29sdW1uLW5hbWUnKTtcbiAgICAgICAgICAgICAgICBpbmRleCA9ICR0aGlzLkRhdGFUYWJsZSgpLmNvbHVtbih0aGlzKS5pbmRleCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChkYXRhLnNwZWNpYWxQcmljZUFjdGl2ZUNvbHVtbnMuaW5kZXhPZigncHJvZHVjdHNOYW1lJykgPiAtMSkgeyAvLyBPcmRlciBieSBuYW1lIGlmIHBvc3NpYmxlLlxuICAgICAgICAgICAgICAgIGluZGV4ID0gZGF0YS5zcGVjaWFsUHJpY2VBY3RpdmVDb2x1bW5zLmluZGV4T2YoJ3Byb2R1Y3RzTmFtZScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gW1tpbmRleCwgZGlyZWN0aW9uXV07XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0IGN1cnJlbnQgcHJvZHVjdCBJRHMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5LkV2ZW50fSBldmVudCBDb250YWlucyBldmVudCBpbmZvcm1hdGlvbi5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9zZXRQcm9kdWN0SWRzKGV2ZW50KSB7XG4gICAgICAgICAgICBwcm9kdWN0SWRzID0gW107XG5cbiAgICAgICAgICAgIGlmICgkKGV2ZW50LnRhcmdldCkuaXMoJ2Euc3BlY2lhbC1wcmljZScpKSB7XG4gICAgICAgICAgICAgICAgcHJvZHVjdElkcy5wdXNoKCQodGhpcykucGFyZW50cygndHInKS5kYXRhKCdpZCcpKTtcblxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgJHNpbmdsZUNoZWNrYm94ZXMgPSAkdGhpcy5wYXJlbnRzKCcucXVpY2stZWRpdC5vdmVydmlldycpXG4gICAgICAgICAgICAgICAgLmZpbmQoJ2lucHV0OmNoZWNrYm94OmNoZWNrZWQub3ZlcnZpZXctcm93LXNlbGVjdGlvbicpO1xuXG4gICAgICAgICAgICAkc2luZ2xlQ2hlY2tib3hlcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBwcm9kdWN0SWRzLnB1c2goJCh0aGlzKS5wYXJlbnRzKCd0cicpLmRhdGEoJ2lkJykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogR2V0IFByb2R1Y3QgSURzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtOdW1iZXJbXX0gUmV0dXJucyB0aGUgcHJvZHVjdCBJRHMuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfZ2V0UHJvZHVjdElkcygpIHtcbiAgICAgICAgICAgIHJldHVybiBwcm9kdWN0SWRzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNwZWNpYWwgcHJpY2VzIG1vZGFsIHNob3duIGV2ZW50IGhhbmRsZXIuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25Nb2RhbFNob3duKCkge1xuICAgICAgICAgICAgJHRoaXMucGFyZW50cygnYm9keScpLmZpbmQoJy5jb21pc2VvLWRhdGVyYW5nZXBpY2tlcicpLmNzcygnei1pbmRleCcsIDEwNzApO1xuICAgICAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ3Jlc2l6ZScpO1xuXG4gICAgICAgICAgICBpZiAoISQuZm4uRGF0YVRhYmxlLmlzRGF0YVRhYmxlKCR0aGlzKSkge1xuICAgICAgICAgICAgICAgIGpzZS5saWJzLmRhdGF0YWJsZS5jcmVhdGUoJHRoaXMsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkdGhpcy5EYXRhVGFibGUoKS5hamF4LnJlbG9hZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICAkbW9kYWxcbiAgICAgICAgICAgICAgICAub24oJ3Nob3cuYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnLm1vZGFsLWRpYWxvZycpLmNzcygnei1pbmRleCcsIDEwNjApXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAub24oJ3Nob3duLmJzLm1vZGFsJywgX29uTW9kYWxTaG93bilcbiAgICAgICAgICAgICAgICAub24oJ2hpZGUuYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnLm1vZGFsLWRpYWxvZycpLmNzcygnei1pbmRleCcsIDApO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkdGhpcy5wYXJlbnRzKCcucXVpY2stZWRpdC5vdmVydmlldycpXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsICdhLnNwZWNpYWwtcHJpY2UnLCBfc2V0UHJvZHVjdElkcylcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgJ2EuYnVsay1zcGVjaWFsLXByaWNlLWVkaXQnLCBfc2V0UHJvZHVjdElkcyk7XG5cbiAgICAgICAgICAgICR0aGlzLm9uKCdkcmF3LmR0JywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICR0aGlzLmZpbmQoJ3RoZWFkIGlucHV0OmNoZWNrYm94JylcbiAgICAgICAgICAgICAgICAgICAgLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSlcbiAgICAgICAgICAgICAgICAgICAgLnRyaWdnZXIoJ2NoYW5nZScsIFtmYWxzZV0pO1xuICAgICAgICAgICAgICAgICR0aGlzLmZpbmQoJ3Rib2R5JykuYXR0cignZGF0YS1neC13aWRnZXQnLCAnc2luZ2xlX2NoZWNrYm94IHN3aXRjaGVyJyk7XG4gICAgICAgICAgICAgICAgJHRoaXMuZmluZCgndGJvZHknKS5hdHRyKCdkYXRhLXNpbmdsZV9jaGVja2JveC1zZWxlY3RvcicsICcuc3BlY2lhbC1wcmljZS1yb3ctc2VsZWN0aW9uJyk7XG4gICAgICAgICAgICAgICAgJHRoaXMuZmluZCgndGJvZHknKS5hdHRyKCdkYXRhLXN3aXRjaGVyLXNlbGVjdG9yJywgJy5jb252ZXJ0LXRvLXN3aXRjaGVyJyk7XG5cbiAgICAgICAgICAgICAgICBneC53aWRnZXRzLmluaXQoJHRoaXMpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICR0aGlzLm9uKCdwcmVYaHIuZHQnLCAoKSA9PiAkc3Bpbm5lciA9XG4gICAgICAgICAgICAgICAganNlLmxpYnMubG9hZGluZ19zcGlubmVyLnNob3coJG1vZGFsLmZpbmQoJy5tb2RhbC1jb250ZW50JyksICRtb2RhbC5jc3MoJ3otaW5kZXgnKSkpO1xuICAgICAgICAgICAgJHRoaXMub24oJ3hoci5kdCcsICgpID0+IGpzZS5saWJzLmxvYWRpbmdfc3Bpbm5lci5oaWRlKCRzcGlubmVyKSk7XG5cbiAgICAgICAgICAgIGpzZS5saWJzLmRhdGF0YWJsZS5jcmVhdGUoJHRoaXMsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTsiXX0=
