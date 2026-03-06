'use strict';

/* --------------------------------------------------------------
 add_tracking_number.js 2022-10-25
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2022 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Add Tracking Number Modal Controller
 *
 * Handles the functionality of the "Add Tracking Number" modal.
 */
gx.controllers.module('add_tracking_number', ['modal', gx.source + '/libs/info_box'], function (data) {

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

    // ------------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------------

    /**
     * Stores the tracking number for a specific order.
     *
     * @param {jQuery.Event} event
     */
    function _onStoreTrackingNumberClick(event) {
        event.preventDefault();

        var orderId = $this.data('orderId');
        var parcelServiceId = $('#delivery-service').find('option:selected').val();
        var trackingNumber = $('input[name="tracking-number"]').val();
        var isReturnDelivery = $('input[name="isReturnDelivery"]').prop('checked');
        var shipmentType = $('input[name="shipmentType"]').val();

        // Make an AJAX call to store the tracking number if one was provided.
        if (trackingNumber.length) {
            $.ajax({
                url: './admin.php?do=OrdersModalsAjax/StoreTrackingNumber',
                data: {
                    orderId: orderId,
                    trackingNumber: trackingNumber,
                    parcelServiceId: parcelServiceId,
                    isReturnDelivery: isReturnDelivery,
                    shipmentType: shipmentType,
                    pageToken: jse.core.config.get('pageToken')
                },
                method: 'POST',
                dataType: 'JSON'
            }).done(function (response) {
                $this.modal('hide');
                jse.libs.info_box.addSuccessMessage(jse.core.lang.translate('ADD_TRACKING_NUMBER_SUCCESS', 'admin_orders'));
                $('.table-main').DataTable().ajax.reload(null, false);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                jse.libs.modal.message({
                    title: jse.core.lang.translate('error', 'messages'),
                    content: jse.core.lang.translate('ADD_TRACKING_NUMBER_ERROR', 'admin_orders')
                });
                jse.core.debug.error('Store Tracking Number Error', jqXHR, textStatus, errorThrown);
            });
        } else {
            // Show an error message
            var $modalFooter = $this.find('.modal-footer');
            var errorMessage = jse.core.lang.translate('TXT_SAVE_ERROR', 'admin_general');

            // Remove error message
            $modalFooter.find('span').remove();
            $modalFooter.prepend('<span class="text-danger">' + errorMessage + '</span>');
        }
    }

    /**
     * On Add Tracking Number Modal Hidden
     *
     * Reset the tracking number modal.
     */
    function _onAddTrackingNumberModalHidden() {
        $(this).find('#tracking-number').val('');
        $('input[name="isReturnDelivery"]').prop('checked', false).trigger('change');
        $('input[name="shipmentType"]').val('');
        $(this).find('.modal-footer span').remove();
    }

    /**
     * On Add Tracking Number Modal Show
     *
     * Handles the event for storing a a tracking number from the tracking number modal.
     *
     * @param {jQuery.Event} event
     */
    function _onAddTrackingNumberModalShow(event) {
        event.stopPropagation();
        // Element which invoked the tracking number modal.
        $(this).data('orderId', $(event.relatedTarget).data('orderId'));
    }

    /**
     * Checks if the enter key was pressed and delegates to
     * the tracking number store method.
     *
     * @param {jQuery.Event} event
     */
    function _saveOnPressedEnterKey(event) {
        var keyCode = event.keyCode ? event.keyCode : event.which;

        if (keyCode === 13) {
            _onStoreTrackingNumberClick(event);
        }
    }

    /**
     * Updates the shipment type on change of the parcel service seletion.
     *
     * @private
     */
    function _onChangeParcelService() {
        $('#shipmentType').val($(this).find(':selected').data('shipmentType'));
    }

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $this.on('show.bs.modal', _onAddTrackingNumberModalShow).on('hidden.bs.modal', _onAddTrackingNumberModalHidden).on('click', '#store-tracking-number', _onStoreTrackingNumberClick).on('keypress', _saveOnPressedEnterKey);

        $('#delivery-service').on('change', _onChangeParcelService);

        // set default shipment type
        $('#delivery-service').trigger('change');

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yZGVycy9tb2RhbHMvYWRkX3RyYWNraW5nX251bWJlci5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwic291cmNlIiwiZGF0YSIsIiR0aGlzIiwiJCIsIl9vblN0b3JlVHJhY2tpbmdOdW1iZXJDbGljayIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJvcmRlcklkIiwicGFyY2VsU2VydmljZUlkIiwiZmluZCIsInZhbCIsInRyYWNraW5nTnVtYmVyIiwiaXNSZXR1cm5EZWxpdmVyeSIsInByb3AiLCJzaGlwbWVudFR5cGUiLCJsZW5ndGgiLCJhamF4IiwidXJsIiwicGFnZVRva2VuIiwianNlIiwiY29yZSIsImNvbmZpZyIsImdldCIsIm1ldGhvZCIsImRhdGFUeXBlIiwiZG9uZSIsInJlc3BvbnNlIiwibW9kYWwiLCJsaWJzIiwiaW5mb19ib3giLCJhZGRTdWNjZXNzTWVzc2FnZSIsImxhbmciLCJ0cmFuc2xhdGUiLCJEYXRhVGFibGUiLCJyZWxvYWQiLCJmYWlsIiwianFYSFIiLCJ0ZXh0U3RhdHVzIiwiZXJyb3JUaHJvd24iLCJtZXNzYWdlIiwidGl0bGUiLCJjb250ZW50IiwiZGVidWciLCJlcnJvciIsIiRtb2RhbEZvb3RlciIsImVycm9yTWVzc2FnZSIsInJlbW92ZSIsInByZXBlbmQiLCJfb25BZGRUcmFja2luZ051bWJlck1vZGFsSGlkZGVuIiwidHJpZ2dlciIsIl9vbkFkZFRyYWNraW5nTnVtYmVyTW9kYWxTaG93Iiwic3RvcFByb3BhZ2F0aW9uIiwicmVsYXRlZFRhcmdldCIsIl9zYXZlT25QcmVzc2VkRW50ZXJLZXkiLCJrZXlDb2RlIiwid2hpY2giLCJfb25DaGFuZ2VQYXJjZWxTZXJ2aWNlIiwiaW5pdCIsIm9uIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7O0FBS0FBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZixDQUFzQixxQkFBdEIsRUFBNkMsQ0FBQyxPQUFELEVBQWFGLEdBQUdH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RUE7QUFDQXJELFVBQUUsbUJBQUYsRUFBdUI4QyxPQUF2QixDQUErQixRQUEvQjs7QUFFQXhCO0FBQ0gsS0FiRDs7QUFlQSxXQUFPMUIsTUFBUDtBQUNILENBcEpEIiwiZmlsZSI6Im9yZGVycy9tb2RhbHMvYWRkX3RyYWNraW5nX251bWJlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gYWRkX3RyYWNraW5nX251bWJlci5qcyAyMDIyLTEwLTI1XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAyMiBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiBBZGQgVHJhY2tpbmcgTnVtYmVyIE1vZGFsIENvbnRyb2xsZXJcbiAqXG4gKiBIYW5kbGVzIHRoZSBmdW5jdGlvbmFsaXR5IG9mIHRoZSBcIkFkZCBUcmFja2luZyBOdW1iZXJcIiBtb2RhbC5cbiAqL1xuZ3guY29udHJvbGxlcnMubW9kdWxlKCdhZGRfdHJhY2tpbmdfbnVtYmVyJywgWydtb2RhbCcsIGAke2d4LnNvdXJjZX0vbGlicy9pbmZvX2JveGBdLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgXG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFZBUklBQkxFU1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIFxuICAgIC8qKlxuICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAqXG4gICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgKi9cbiAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG4gICAgXG4gICAgLyoqXG4gICAgICogTW9kdWxlIEluc3RhbmNlXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIGNvbnN0IG1vZHVsZSA9IHt9O1xuICAgIFxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEZVTkNUSU9OU1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIFxuICAgIC8qKlxuICAgICAqIFN0b3JlcyB0aGUgdHJhY2tpbmcgbnVtYmVyIGZvciBhIHNwZWNpZmljIG9yZGVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50XG4gICAgICovXG4gICAgZnVuY3Rpb24gX29uU3RvcmVUcmFja2luZ051bWJlckNsaWNrKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBvcmRlcklkID0gJHRoaXMuZGF0YSgnb3JkZXJJZCcpO1xuICAgICAgICBjb25zdCBwYXJjZWxTZXJ2aWNlSWQgPSAkKCcjZGVsaXZlcnktc2VydmljZScpLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLnZhbCgpO1xuICAgICAgICBjb25zdCB0cmFja2luZ051bWJlciA9ICQoJ2lucHV0W25hbWU9XCJ0cmFja2luZy1udW1iZXJcIl0nKS52YWwoKTtcbiAgICAgICAgY29uc3QgaXNSZXR1cm5EZWxpdmVyeSA9ICQoJ2lucHV0W25hbWU9XCJpc1JldHVybkRlbGl2ZXJ5XCJdJykucHJvcCgnY2hlY2tlZCcpO1xuICAgICAgICBjb25zdCBzaGlwbWVudFR5cGUgPSAkKCdpbnB1dFtuYW1lPVwic2hpcG1lbnRUeXBlXCJdJykudmFsKCk7XG4gICAgICAgIFxuICAgICAgICAvLyBNYWtlIGFuIEFKQVggY2FsbCB0byBzdG9yZSB0aGUgdHJhY2tpbmcgbnVtYmVyIGlmIG9uZSB3YXMgcHJvdmlkZWQuXG4gICAgICAgIGlmICh0cmFja2luZ051bWJlci5sZW5ndGgpIHtcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiAnLi9hZG1pbi5waHA/ZG89T3JkZXJzTW9kYWxzQWpheC9TdG9yZVRyYWNraW5nTnVtYmVyJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIG9yZGVySWQsXG4gICAgICAgICAgICAgICAgICAgIHRyYWNraW5nTnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICBwYXJjZWxTZXJ2aWNlSWQsXG4gICAgICAgICAgICAgICAgICAgIGlzUmV0dXJuRGVsaXZlcnksXG4gICAgICAgICAgICAgICAgICAgIHNoaXBtZW50VHlwZSxcbiAgICAgICAgICAgICAgICAgICAgcGFnZVRva2VuOiBqc2UuY29yZS5jb25maWcuZ2V0KCdwYWdlVG9rZW4nKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdKU09OJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZG9uZShmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAkdGhpcy5tb2RhbCgnaGlkZScpO1xuICAgICAgICAgICAgICAgICAgICBqc2UubGlicy5pbmZvX2JveC5hZGRTdWNjZXNzTWVzc2FnZShcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdBRERfVFJBQ0tJTkdfTlVNQkVSX1NVQ0NFU1MnLCAnYWRtaW5fb3JkZXJzJykpO1xuICAgICAgICAgICAgICAgICAgICAkKCcudGFibGUtbWFpbicpLkRhdGFUYWJsZSgpLmFqYXgucmVsb2FkKG51bGwsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikge1xuICAgICAgICAgICAgICAgICAgICBqc2UubGlicy5tb2RhbC5tZXNzYWdlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnZXJyb3InLCAnbWVzc2FnZXMnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdBRERfVFJBQ0tJTkdfTlVNQkVSX0VSUk9SJywgJ2FkbWluX29yZGVycycpXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBqc2UuY29yZS5kZWJ1Zy5lcnJvcignU3RvcmUgVHJhY2tpbmcgTnVtYmVyIEVycm9yJywganFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFNob3cgYW4gZXJyb3IgbWVzc2FnZVxuICAgICAgICAgICAgY29uc3QgJG1vZGFsRm9vdGVyID0gJHRoaXMuZmluZCgnLm1vZGFsLWZvb3RlcicpO1xuICAgICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0ganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ1RYVF9TQVZFX0VSUk9SJywgJ2FkbWluX2dlbmVyYWwnKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gUmVtb3ZlIGVycm9yIG1lc3NhZ2VcbiAgICAgICAgICAgICRtb2RhbEZvb3Rlci5maW5kKCdzcGFuJykucmVtb3ZlKCk7XG4gICAgICAgICAgICAkbW9kYWxGb290ZXIucHJlcGVuZChgPHNwYW4gY2xhc3M9XCJ0ZXh0LWRhbmdlclwiPiR7ZXJyb3JNZXNzYWdlfTwvc3Bhbj5gKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAgKiBPbiBBZGQgVHJhY2tpbmcgTnVtYmVyIE1vZGFsIEhpZGRlblxuICAgICAqXG4gICAgICogUmVzZXQgdGhlIHRyYWNraW5nIG51bWJlciBtb2RhbC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfb25BZGRUcmFja2luZ051bWJlck1vZGFsSGlkZGVuKCkge1xuICAgICAgICAkKHRoaXMpLmZpbmQoJyN0cmFja2luZy1udW1iZXInKS52YWwoJycpO1xuICAgICAgICAkKCdpbnB1dFtuYW1lPVwiaXNSZXR1cm5EZWxpdmVyeVwiXScpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSkudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICAgICQoJ2lucHV0W25hbWU9XCJzaGlwbWVudFR5cGVcIl0nKS52YWwoJycpO1xuICAgICAgICAkKHRoaXMpLmZpbmQoJy5tb2RhbC1mb290ZXIgc3BhbicpLnJlbW92ZSgpO1xuICAgIH1cbiAgICBcbiAgICBcbiAgICAvKipcbiAgICAgKiBPbiBBZGQgVHJhY2tpbmcgTnVtYmVyIE1vZGFsIFNob3dcbiAgICAgKlxuICAgICAqIEhhbmRsZXMgdGhlIGV2ZW50IGZvciBzdG9yaW5nIGEgYSB0cmFja2luZyBudW1iZXIgZnJvbSB0aGUgdHJhY2tpbmcgbnVtYmVyIG1vZGFsLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50XG4gICAgICovXG4gICAgZnVuY3Rpb24gX29uQWRkVHJhY2tpbmdOdW1iZXJNb2RhbFNob3coZXZlbnQpIHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIC8vIEVsZW1lbnQgd2hpY2ggaW52b2tlZCB0aGUgdHJhY2tpbmcgbnVtYmVyIG1vZGFsLlxuICAgICAgICAkKHRoaXMpLmRhdGEoJ29yZGVySWQnLCAkKGV2ZW50LnJlbGF0ZWRUYXJnZXQpLmRhdGEoJ29yZGVySWQnKSk7XG4gICAgfVxuICAgIFxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGUgZW50ZXIga2V5IHdhcyBwcmVzc2VkIGFuZCBkZWxlZ2F0ZXMgdG9cbiAgICAgKiB0aGUgdHJhY2tpbmcgbnVtYmVyIHN0b3JlIG1ldGhvZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7alF1ZXJ5LkV2ZW50fSBldmVudFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9zYXZlT25QcmVzc2VkRW50ZXJLZXkoZXZlbnQpIHtcbiAgICAgICAgY29uc3Qga2V5Q29kZSA9IGV2ZW50LmtleUNvZGUgPyBldmVudC5rZXlDb2RlIDogZXZlbnQud2hpY2g7XG4gICAgICAgIFxuICAgICAgICBpZiAoa2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgICAgIF9vblN0b3JlVHJhY2tpbmdOdW1iZXJDbGljayhldmVudCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyB0aGUgc2hpcG1lbnQgdHlwZSBvbiBjaGFuZ2Ugb2YgdGhlIHBhcmNlbCBzZXJ2aWNlIHNlbGV0aW9uLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfb25DaGFuZ2VQYXJjZWxTZXJ2aWNlKCkge1xuICAgICAgICAkKCcjc2hpcG1lbnRUeXBlJykudmFsKCQodGhpcykuZmluZCgnOnNlbGVjdGVkJykuZGF0YSgnc2hpcG1lbnRUeXBlJykpO1xuICAgIH1cbiAgICBcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIFxuICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24oZG9uZSkge1xuICAgICAgICAkdGhpc1xuICAgICAgICAgICAgLm9uKCdzaG93LmJzLm1vZGFsJywgX29uQWRkVHJhY2tpbmdOdW1iZXJNb2RhbFNob3cpXG4gICAgICAgICAgICAub24oJ2hpZGRlbi5icy5tb2RhbCcsIF9vbkFkZFRyYWNraW5nTnVtYmVyTW9kYWxIaWRkZW4pXG4gICAgICAgICAgICAub24oJ2NsaWNrJywgJyNzdG9yZS10cmFja2luZy1udW1iZXInLCBfb25TdG9yZVRyYWNraW5nTnVtYmVyQ2xpY2spXG4gICAgICAgICAgICAub24oJ2tleXByZXNzJywgX3NhdmVPblByZXNzZWRFbnRlcktleSk7XG4gICAgICAgIFxuICAgICAgICAkKCcjZGVsaXZlcnktc2VydmljZScpLm9uKCdjaGFuZ2UnLCBfb25DaGFuZ2VQYXJjZWxTZXJ2aWNlKTtcbiAgICAgICAgXG4gICAgICAgIC8vIHNldCBkZWZhdWx0IHNoaXBtZW50IHR5cGVcbiAgICAgICAgJCgnI2RlbGl2ZXJ5LXNlcnZpY2UnKS50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICAgICAgXG4gICAgICAgIGRvbmUoKTtcbiAgICB9O1xuICAgIFxuICAgIHJldHVybiBtb2R1bGU7XG59KTsgXG4iXX0=
