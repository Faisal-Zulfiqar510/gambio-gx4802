'use strict';

/* --------------------------------------------------------------
 delete.js 2016-09-30
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Delete Invoice Modal Controller
 */
gx.controllers.module('delete', ['modal'], function (data) {

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
    var module = {
        bindings: {
            selectedInvoices: $this.find('.selected-invoice-ids')
        }
    };

    // ------------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------------

    /**
     * Send the modal data to the form through an AJAX call.
     */
    function _onDeleteClick() {
        var url = jse.core.config.get('appUrl') + '/admin/admin.php?do=InvoicesModalsAjax/DeleteInvoice';
        var data = {
            selectedInvoices: module.bindings.selectedInvoices.get().split(','),
            pageToken: jse.core.config.get('pageToken')
        };
        var $deleteButton = $(this);

        $deleteButton.addClass('disabled').prop('disabled', true);

        $.ajax({
            url: url,
            data: data,
            method: 'POST',
            dataType: 'json'
        }).done(function (response) {
            jse.libs.info_box.addSuccessMessage(jse.core.lang.translate('DELETE_INVOICES_SUCCESS', 'admin_invoices'));
            $('.invoices .table-main').DataTable().ajax.reload(null, false);
            $('.invoices .table-main').invoices_overview_filter('reload');
        }).fail(function (jqxhr, textStatus, errorThrown) {
            jse.libs.modal.showMessage(jse.core.lang.translate('error', 'messages'), jse.core.lang.translate('DELETE_INVOICES_ERROR', 'admin_invoices'));
        }).always(function () {
            $this.modal('hide');
            $deleteButton.removeClass('disabled').prop('disabled', false);
        });
    }

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $this.on('click', '.btn.delete', _onDeleteClick);
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludm9pY2VzL21vZGFscy9kZWxldGUuanMiXSwibmFtZXMiOlsiZ3giLCJjb250cm9sbGVycyIsIm1vZHVsZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJiaW5kaW5ncyIsInNlbGVjdGVkSW52b2ljZXMiLCJmaW5kIiwiX29uRGVsZXRlQ2xpY2siLCJ1cmwiLCJqc2UiLCJjb3JlIiwiY29uZmlnIiwiZ2V0Iiwic3BsaXQiLCJwYWdlVG9rZW4iLCIkZGVsZXRlQnV0dG9uIiwiYWRkQ2xhc3MiLCJwcm9wIiwiYWpheCIsIm1ldGhvZCIsImRhdGFUeXBlIiwiZG9uZSIsInJlc3BvbnNlIiwibGlicyIsImluZm9fYm94IiwiYWRkU3VjY2Vzc01lc3NhZ2UiLCJsYW5nIiwidHJhbnNsYXRlIiwiRGF0YVRhYmxlIiwicmVsb2FkIiwiaW52b2ljZXNfb3ZlcnZpZXdfZmlsdGVyIiwiZmFpbCIsImpxeGhyIiwidGV4dFN0YXR1cyIsImVycm9yVGhyb3duIiwibW9kYWwiLCJzaG93TWVzc2FnZSIsImFsd2F5cyIsInJlbW92ZUNsYXNzIiwiaW5pdCIsIm9uIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7OztBQUdBQSxHQUFHQyxXQUFILENBQWVDLE1BQWYsQ0FBc0IsUUFBdEIsRUFBZ0MsQ0FBQyxPQUFELENBQWhDLEVBQTJDLFVBQVVDLElBQVYsRUFBZ0I7O0FBRXZEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O0FBS0EsUUFBTUMsUUFBUUMsRUFBRSxJQUFGLENBQWQ7O0FBRUE7Ozs7O0FBS0EsUUFBTUgsU0FBUztBQUNYSSxrQkFBVTtBQUNOQyw4QkFBa0JILE1BQU1JLElBQU4sQ0FBVyx1QkFBWDtBQURaO0FBREMsS0FBZjs7QUFNQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBLGFBQVNDLGNBQVQsR0FBMEI7QUFDdEIsWUFBTUMsTUFBTUMsSUFBSUMsSUFBSixDQUFTQyxNQUFULENBQWdCQyxHQUFoQixDQUFvQixRQUFwQixJQUFnQyxzREFBNUM7QUFDQSxZQUFNWCxPQUFPO0FBQ1RJLDhCQUFrQkwsT0FBT0ksUUFBUCxDQUFnQkMsZ0JBQWhCLENBQWlDTyxHQUFqQyxHQUF1Q0MsS0FBdkMsQ0FBNkMsR0FBN0MsQ0FEVDtBQUVUQyx1QkFBV0wsSUFBSUMsSUFBSixDQUFTQyxNQUFULENBQWdCQyxHQUFoQixDQUFvQixXQUFwQjtBQUZGLFNBQWI7QUFJQSxZQUFNRyxnQkFBZ0JaLEVBQUUsSUFBRixDQUF0Qjs7QUFFQVksc0JBQWNDLFFBQWQsQ0FBdUIsVUFBdkIsRUFBbUNDLElBQW5DLENBQXdDLFVBQXhDLEVBQW9ELElBQXBEOztBQUVBZCxVQUFFZSxJQUFGLENBQU87QUFDSFYsb0JBREc7QUFFSFAsc0JBRkc7QUFHSGtCLG9CQUFRLE1BSEw7QUFJSEMsc0JBQVU7QUFKUCxTQUFQLEVBTUtDLElBTkwsQ0FNVSxVQUFVQyxRQUFWLEVBQW9CO0FBQ3RCYixnQkFBSWMsSUFBSixDQUFTQyxRQUFULENBQWtCQyxpQkFBbEIsQ0FDSWhCLElBQUlDLElBQUosQ0FBU2dCLElBQVQsQ0FBY0MsU0FBZCxDQUF3Qix5QkFBeEIsRUFBbUQsZ0JBQW5ELENBREo7QUFFQXhCLGNBQUUsdUJBQUYsRUFBMkJ5QixTQUEzQixHQUF1Q1YsSUFBdkMsQ0FBNENXLE1BQTVDLENBQW1ELElBQW5ELEVBQXlELEtBQXpEO0FBQ0ExQixjQUFFLHVCQUFGLEVBQTJCMkIsd0JBQTNCLENBQW9ELFFBQXBEO0FBQ0gsU0FYTCxFQVlLQyxJQVpMLENBWVUsVUFBVUMsS0FBVixFQUFpQkMsVUFBakIsRUFBNkJDLFdBQTdCLEVBQTBDO0FBQzVDekIsZ0JBQUljLElBQUosQ0FBU1ksS0FBVCxDQUFlQyxXQUFmLENBQTJCM0IsSUFBSUMsSUFBSixDQUFTZ0IsSUFBVCxDQUFjQyxTQUFkLENBQXdCLE9BQXhCLEVBQWlDLFVBQWpDLENBQTNCLEVBQ0lsQixJQUFJQyxJQUFKLENBQVNnQixJQUFULENBQWNDLFNBQWQsQ0FBd0IsdUJBQXhCLEVBQWlELGdCQUFqRCxDQURKO0FBRUgsU0FmTCxFQWdCS1UsTUFoQkwsQ0FnQlksWUFBWTtBQUNoQm5DLGtCQUFNaUMsS0FBTixDQUFZLE1BQVo7QUFDQXBCLDBCQUFjdUIsV0FBZCxDQUEwQixVQUExQixFQUFzQ3JCLElBQXRDLENBQTJDLFVBQTNDLEVBQXVELEtBQXZEO0FBQ0gsU0FuQkw7QUFvQkg7O0FBRUQ7QUFDQTtBQUNBOztBQUVBakIsV0FBT3VDLElBQVAsR0FBYyxVQUFVbEIsSUFBVixFQUFnQjtBQUMxQm5CLGNBQU1zQyxFQUFOLENBQVMsT0FBVCxFQUFrQixhQUFsQixFQUFpQ2pDLGNBQWpDO0FBQ0FjO0FBQ0gsS0FIRDs7QUFLQSxXQUFPckIsTUFBUDtBQUNILENBM0VEIiwiZmlsZSI6Imludm9pY2VzL21vZGFscy9kZWxldGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGRlbGV0ZS5qcyAyMDE2LTA5LTMwXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNiBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiBEZWxldGUgSW52b2ljZSBNb2RhbCBDb250cm9sbGVyXG4gKi9cbmd4LmNvbnRyb2xsZXJzLm1vZHVsZSgnZGVsZXRlJywgWydtb2RhbCddLCBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gVkFSSUFCTEVTXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAvKipcbiAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgKlxuICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICovXG4gICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgLyoqXG4gICAgICogTW9kdWxlIEluc3RhbmNlXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIGNvbnN0IG1vZHVsZSA9IHtcbiAgICAgICAgYmluZGluZ3M6IHtcbiAgICAgICAgICAgIHNlbGVjdGVkSW52b2ljZXM6ICR0aGlzLmZpbmQoJy5zZWxlY3RlZC1pbnZvaWNlLWlkcycpXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRlVOQ1RJT05TXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAvKipcbiAgICAgKiBTZW5kIHRoZSBtb2RhbCBkYXRhIHRvIHRoZSBmb3JtIHRocm91Z2ggYW4gQUpBWCBjYWxsLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9vbkRlbGV0ZUNsaWNrKCkge1xuICAgICAgICBjb25zdCB1cmwgPSBqc2UuY29yZS5jb25maWcuZ2V0KCdhcHBVcmwnKSArICcvYWRtaW4vYWRtaW4ucGhwP2RvPUludm9pY2VzTW9kYWxzQWpheC9EZWxldGVJbnZvaWNlJztcbiAgICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgICAgIHNlbGVjdGVkSW52b2ljZXM6IG1vZHVsZS5iaW5kaW5ncy5zZWxlY3RlZEludm9pY2VzLmdldCgpLnNwbGl0KCcsJyksXG4gICAgICAgICAgICBwYWdlVG9rZW46IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ3BhZ2VUb2tlbicpXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0ICRkZWxldGVCdXR0b24gPSAkKHRoaXMpO1xuXG4gICAgICAgICRkZWxldGVCdXR0b24uYWRkQ2xhc3MoJ2Rpc2FibGVkJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcblxuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsLFxuICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJ1xuICAgICAgICB9KVxuICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAganNlLmxpYnMuaW5mb19ib3guYWRkU3VjY2Vzc01lc3NhZ2UoXG4gICAgICAgICAgICAgICAgICAgIGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdERUxFVEVfSU5WT0lDRVNfU1VDQ0VTUycsICdhZG1pbl9pbnZvaWNlcycpKTtcbiAgICAgICAgICAgICAgICAkKCcuaW52b2ljZXMgLnRhYmxlLW1haW4nKS5EYXRhVGFibGUoKS5hamF4LnJlbG9hZChudWxsLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgJCgnLmludm9pY2VzIC50YWJsZS1tYWluJykuaW52b2ljZXNfb3ZlcnZpZXdfZmlsdGVyKCdyZWxvYWQnKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbiAoanF4aHIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSB7XG4gICAgICAgICAgICAgICAganNlLmxpYnMubW9kYWwuc2hvd01lc3NhZ2UoanNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2Vycm9yJywgJ21lc3NhZ2VzJyksXG4gICAgICAgICAgICAgICAgICAgIGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdERUxFVEVfSU5WT0lDRVNfRVJST1InLCAnYWRtaW5faW52b2ljZXMnKSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmFsd2F5cyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJHRoaXMubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgICAgICAgICAkZGVsZXRlQnV0dG9uLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgJHRoaXMub24oJ2NsaWNrJywgJy5idG4uZGVsZXRlJywgX29uRGVsZXRlQ2xpY2spO1xuICAgICAgICBkb25lKCk7XG4gICAgfTtcblxuICAgIHJldHVybiBtb2R1bGU7XG59KTsiXX0=
