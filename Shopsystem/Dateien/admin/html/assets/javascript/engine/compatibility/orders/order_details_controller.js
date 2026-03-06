'use strict';

/* --------------------------------------------------------------
 order_details_controller.js 2018-05-02
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2018 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Order Details Controller
 *
 * This controller will handle the compatibility order details wrapper.
 *
 * @module Compatibility/order_details_controller
 */
gx.compatibility.module('order_details_controller', ['xhr', 'loading_spinner', 'modal', gx.source + '/libs/action_mapper', gx.source + '/libs/button_dropdown'],

/**  @lends module:Compatibility/order_details_controller */

function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES DEFINITION
    // ------------------------------------------------------------------------

    var
    /**
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
    // FUNCTIONS
    // ------------------------------------------------------------------------

    /**
     * Create Invoice Click Event
     *
     * This callback will make sure that the invoice is created and then make a page reload.
     *
     * @param {jQuery.Event} event
     */
    var _onCreateInvoiceClick = function _onCreateInvoiceClick(event) {
        event.preventDefault();

        var $pageToken = $('input[name="page_token"]');

        var $modal = $('#orders_create_invoice_modal');

        var $frameContent = $this.find('.frame-wrapper.invoices').find('.frame-content');

        var $loadingSpinner = jse.libs.loading_spinner.show($frameContent);

        var requestOptions = {
            url: jse.core.config.get('appUrl') + '/admin/admin.php?do=OrdersModalsAjax/GetInvoiceCount',
            data: {
                orderId: options.order_id,
                pageToken: $pageToken.length ? $pageToken.val() : ''
            }
        };

        var createInvoiceUrl = event.target.getAttribute('href') + '&ajax=1';

        function createInvoice() {
            var downloadPdfWindow = window.open('about:blank');

            function onRequestSuccess(response) {
                var queryString = $.param({
                    module: 'OrderAdmin',
                    action: 'showPdf',
                    type: 'invoice',
                    invoice_id: response.invoiceId
                });

                downloadPdfWindow.location = jse.core.config.get('appUrl') + '/admin/request_port.php?' + queryString;

                location.reload();
            }

            function onRequestFailure() {
                downloadPdfWindow.close();
            }

            jse.libs.xhr.get({ url: createInvoiceUrl }).done(onRequestSuccess).fail(onRequestFailure);
        }

        function onRequestSuccess(response) {
            function onAbort() {
                $(this).dialog('close');
            }

            jse.libs.loading_spinner.hide($loadingSpinner);

            if (!response.count) {
                createInvoice();
                return;
            }

            $modal.dialog({
                title: jse.core.lang.translate('TITLE_CREATE_INVOICE', 'orders'),
                modal: true,
                width: 420,
                dialogClass: 'gx-container',
                buttons: [{
                    text: jse.core.lang.translate('yes', 'buttons'),
                    class: 'btn',
                    click: createInvoice
                }, {
                    text: jse.core.lang.translate('no', 'buttons'),
                    class: 'btn',
                    click: onAbort
                }]
            });
        }

        function onRequestFailure() {
            jse.libs.loading_spinner.hide($loadingSpinner);
            createInvoice();
        }

        jse.libs.xhr.get(requestOptions).done(onRequestSuccess).fail(onRequestFailure);
    };

    /**
     * Create Packing Slip Click Event
     *
     * This callback will make sure that the packing slip is created and then make a page reload.
     *
     * @param {jQuery.Event} event
     */
    var _onCreatePackingSlipClick = function _onCreatePackingSlipClick(event) {
        event.preventDefault();

        var downloadPdfWindow = window.open('about:blank');
        var url = event.target.getAttribute('href') + '&ajax=1';

        $.getJSON(url).done(function (response) {
            downloadPdfWindow.location = jse.core.config.get('appUrl') + '/admin/request_port.php?' + $.param({
                module: 'OrderAdmin',
                action: 'showPdf',
                type: 'packingslip',
                file: response.filename + '__' + response.filenameSuffix
            });
            location.reload();
        }).fail(function (jqXHR, textStatus, errorThrown) {
            downloadPdfWindow.close();
        });
    };

    /**
     * Open order status modal on click on elements with class add-order-status
     *
     * @param {jQuery.Event} event
     */
    var _onAddOrderStatusClick = function _onAddOrderStatusClick(event) {
        event.preventDefault();
        $('.update-order-status').trigger('click');
    };

    var _moveSaveActionsToBottom = function _moveSaveActionsToBottom() {
        var $mainActions = $('div.text-right:nth-child(2)');
        var $bottomBar = $('.footer-info');
        var $newContainer = $('<div class="pull-right info"></div>');

        $mainActions.appendTo($newContainer);
        $newContainer.appendTo($bottomBar);
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $('.message_stack_container').addClass('breakpoint-large');

        _moveSaveActionsToBottom();

        $this.on('click', '.add-order-status', _onAddOrderStatusClick).on('click', '.create-invoice', _onCreateInvoiceClick).on('click', '.create-packing-slip', _onCreatePackingSlipClick);

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yZGVycy9vcmRlcl9kZXRhaWxzX2NvbnRyb2xsZXIuanMiXSwibmFtZXMiOlsiZ3giLCJjb21wYXRpYmlsaXR5IiwibW9kdWxlIiwic291cmNlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImRlZmF1bHRzIiwib3B0aW9ucyIsImV4dGVuZCIsIl9vbkNyZWF0ZUludm9pY2VDbGljayIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCIkcGFnZVRva2VuIiwiJG1vZGFsIiwiJGZyYW1lQ29udGVudCIsImZpbmQiLCIkbG9hZGluZ1NwaW5uZXIiLCJqc2UiLCJsaWJzIiwibG9hZGluZ19zcGlubmVyIiwic2hvdyIsInJlcXVlc3RPcHRpb25zIiwidXJsIiwiY29yZSIsImNvbmZpZyIsImdldCIsIm9yZGVySWQiLCJvcmRlcl9pZCIsInBhZ2VUb2tlbiIsImxlbmd0aCIsInZhbCIsImNyZWF0ZUludm9pY2VVcmwiLCJ0YXJnZXQiLCJnZXRBdHRyaWJ1dGUiLCJjcmVhdGVJbnZvaWNlIiwiZG93bmxvYWRQZGZXaW5kb3ciLCJ3aW5kb3ciLCJvcGVuIiwib25SZXF1ZXN0U3VjY2VzcyIsInJlc3BvbnNlIiwicXVlcnlTdHJpbmciLCJwYXJhbSIsImFjdGlvbiIsInR5cGUiLCJpbnZvaWNlX2lkIiwiaW52b2ljZUlkIiwibG9jYXRpb24iLCJyZWxvYWQiLCJvblJlcXVlc3RGYWlsdXJlIiwiY2xvc2UiLCJ4aHIiLCJkb25lIiwiZmFpbCIsIm9uQWJvcnQiLCJkaWFsb2ciLCJoaWRlIiwiY291bnQiLCJ0aXRsZSIsImxhbmciLCJ0cmFuc2xhdGUiLCJtb2RhbCIsIndpZHRoIiwiZGlhbG9nQ2xhc3MiLCJidXR0b25zIiwidGV4dCIsImNsYXNzIiwiY2xpY2siLCJfb25DcmVhdGVQYWNraW5nU2xpcENsaWNrIiwiZ2V0SlNPTiIsImZpbGUiLCJmaWxlbmFtZSIsImZpbGVuYW1lU3VmZml4IiwianFYSFIiLCJ0ZXh0U3RhdHVzIiwiZXJyb3JUaHJvd24iLCJfb25BZGRPcmRlclN0YXR1c0NsaWNrIiwidHJpZ2dlciIsIl9tb3ZlU2F2ZUFjdGlvbnNUb0JvdHRvbSIsIiRtYWluQWN0aW9ucyIsIiRib3R0b21CYXIiLCIkbmV3Q29udGFpbmVyIiwiYXBwZW5kVG8iLCJpbml0IiwiYWRkQ2xhc3MiLCJvbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7O0FBT0FBLEdBQUdDLGFBQUgsQ0FBaUJDLE1BQWpCLENBQ0ksMEJBREosRUFHSSxDQUNJLEtBREosRUFFSSxpQkFGSixFQUdJLE9BSEosRUFJSUYsR0FBR0csTUFBSCxHQUFZLHFCQUpoQixFQUtJSCxHQUFHRyxNQUFILEdBQVksdUJBTGhCLENBSEo7O0FBV0k7O0FBRUEsVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7Ozs7QUFLQUMsWUFBUUMsRUFBRSxJQUFGLENBTlo7OztBQVFJOzs7OztBQUtBQyxlQUFXLEVBYmY7OztBQWVJOzs7OztBQUtBQyxjQUFVRixFQUFFRyxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJGLFFBQW5CLEVBQTZCSCxJQUE3QixDQXBCZDs7O0FBc0JJOzs7OztBQUtBRixhQUFTLEVBM0JiOztBQTZCQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUFPQSxRQUFJUSx3QkFBd0IsU0FBeEJBLHFCQUF3QixDQUFVQyxLQUFWLEVBQWlCO0FBQ3pDQSxjQUFNQyxjQUFOOztBQUVBLFlBQUlDLGFBQWFQLEVBQUUsMEJBQUYsQ0FBakI7O0FBRUEsWUFBSVEsU0FBU1IsRUFBRSw4QkFBRixDQUFiOztBQUVBLFlBQUlTLGdCQUFnQlYsTUFDZlcsSUFEZSxDQUNWLHlCQURVLEVBRWZBLElBRmUsQ0FFVixnQkFGVSxDQUFwQjs7QUFJQSxZQUFJQyxrQkFBa0JDLElBQUlDLElBQUosQ0FBU0MsZUFBVCxDQUF5QkMsSUFBekIsQ0FBOEJOLGFBQTlCLENBQXRCOztBQUVBLFlBQUlPLGlCQUFpQjtBQUNqQkMsaUJBQUtMLElBQUlNLElBQUosQ0FB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QkFBRixFQUE4QjhFLFFBQTlCLENBQXVDLGtCQUF2Qzs7QUFFQU47O0FBRUF6RSxjQUNLZ0YsRUFETCxDQUNRLE9BRFIsRUFDaUIsbUJBRGpCLEVBQ3NDVCxzQkFEdEMsRUFFS1MsRUFGTCxDQUVRLE9BRlIsRUFFaUIsaUJBRmpCLEVBRW9DM0UscUJBRnBDLEVBR0syRSxFQUhMLENBR1EsT0FIUixFQUdpQixzQkFIakIsRUFHeUNqQix5QkFIekM7O0FBS0FoQjtBQUNILEtBWEQ7O0FBYUEsV0FBT2xELE1BQVA7QUFDSCxDQXhOTCIsImZpbGUiOiJvcmRlcnMvb3JkZXJfZGV0YWlsc19jb250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBvcmRlcl9kZXRhaWxzX2NvbnRyb2xsZXIuanMgMjAxOC0wNS0wMlxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTggR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgT3JkZXIgRGV0YWlscyBDb250cm9sbGVyXG4gKlxuICogVGhpcyBjb250cm9sbGVyIHdpbGwgaGFuZGxlIHRoZSBjb21wYXRpYmlsaXR5IG9yZGVyIGRldGFpbHMgd3JhcHBlci5cbiAqXG4gKiBAbW9kdWxlIENvbXBhdGliaWxpdHkvb3JkZXJfZGV0YWlsc19jb250cm9sbGVyXG4gKi9cbmd4LmNvbXBhdGliaWxpdHkubW9kdWxlKFxuICAgICdvcmRlcl9kZXRhaWxzX2NvbnRyb2xsZXInLFxuXG4gICAgW1xuICAgICAgICAneGhyJyxcbiAgICAgICAgJ2xvYWRpbmdfc3Bpbm5lcicsXG4gICAgICAgICdtb2RhbCcsXG4gICAgICAgIGd4LnNvdXJjZSArICcvbGlicy9hY3Rpb25fbWFwcGVyJyxcbiAgICAgICAgZ3guc291cmNlICsgJy9saWJzL2J1dHRvbl9kcm9wZG93bidcbiAgICBdLFxuXG4gICAgLyoqICBAbGVuZHMgbW9kdWxlOkNvbXBhdGliaWxpdHkvb3JkZXJfZGV0YWlsc19jb250cm9sbGVyICovXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEVTIERFRklOSVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbGV0XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB2YXIge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJHRoaXMgPSAkKHRoaXMpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERlZmF1bHQgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRlZmF1bHRzID0ge30sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRmluYWwgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB2YXIge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIE9iamVjdFxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBGVU5DVElPTlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENyZWF0ZSBJbnZvaWNlIENsaWNrIEV2ZW50XG4gICAgICAgICAqXG4gICAgICAgICAqIFRoaXMgY2FsbGJhY2sgd2lsbCBtYWtlIHN1cmUgdGhhdCB0aGUgaW52b2ljZSBpcyBjcmVhdGVkIGFuZCB0aGVuIG1ha2UgYSBwYWdlIHJlbG9hZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50XG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX29uQ3JlYXRlSW52b2ljZUNsaWNrID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICB2YXIgJHBhZ2VUb2tlbiA9ICQoJ2lucHV0W25hbWU9XCJwYWdlX3Rva2VuXCJdJyk7XG5cbiAgICAgICAgICAgIHZhciAkbW9kYWwgPSAkKCcjb3JkZXJzX2NyZWF0ZV9pbnZvaWNlX21vZGFsJyk7XG5cbiAgICAgICAgICAgIHZhciAkZnJhbWVDb250ZW50ID0gJHRoaXNcbiAgICAgICAgICAgICAgICAuZmluZCgnLmZyYW1lLXdyYXBwZXIuaW52b2ljZXMnKVxuICAgICAgICAgICAgICAgIC5maW5kKCcuZnJhbWUtY29udGVudCcpO1xuXG4gICAgICAgICAgICB2YXIgJGxvYWRpbmdTcGlubmVyID0ganNlLmxpYnMubG9hZGluZ19zcGlubmVyLnNob3coJGZyYW1lQ29udGVudCk7XG5cbiAgICAgICAgICAgIHZhciByZXF1ZXN0T3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICB1cmw6IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpICsgJy9hZG1pbi9hZG1pbi5waHA/ZG89T3JkZXJzTW9kYWxzQWpheC9HZXRJbnZvaWNlQ291bnQnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJJZDogb3B0aW9ucy5vcmRlcl9pZCxcbiAgICAgICAgICAgICAgICAgICAgcGFnZVRva2VuOiAoJHBhZ2VUb2tlbi5sZW5ndGgpID8gJHBhZ2VUb2tlbi52YWwoKSA6ICcnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIGNyZWF0ZUludm9pY2VVcmwgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdocmVmJykgKyAnJmFqYXg9MSc7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUludm9pY2UoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRvd25sb2FkUGRmV2luZG93ID0gd2luZG93Lm9wZW4oJ2Fib3V0OmJsYW5rJyk7XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBvblJlcXVlc3RTdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBxdWVyeVN0cmluZyA9ICQucGFyYW0oe1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlOiAnT3JkZXJBZG1pbicsXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb246ICdzaG93UGRmJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbnZvaWNlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGludm9pY2VfaWQ6IHJlc3BvbnNlLmludm9pY2VJZFxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBkb3dubG9hZFBkZldpbmRvdy5sb2NhdGlvbiA9IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpICsgJy9hZG1pbi9yZXF1ZXN0X3BvcnQucGhwPycgKyBxdWVyeVN0cmluZztcblxuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBvblJlcXVlc3RGYWlsdXJlKCkge1xuICAgICAgICAgICAgICAgICAgICBkb3dubG9hZFBkZldpbmRvdy5jbG9zZSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGpzZS5saWJzLnhoci5nZXQoe3VybDogY3JlYXRlSW52b2ljZVVybH0pXG4gICAgICAgICAgICAgICAgICAgIC5kb25lKG9uUmVxdWVzdFN1Y2Nlc3MpXG4gICAgICAgICAgICAgICAgICAgIC5mYWlsKG9uUmVxdWVzdEZhaWx1cmUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBvblJlcXVlc3RTdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gb25BYm9ydCgpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5kaWFsb2coJ2Nsb3NlJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAganNlLmxpYnMubG9hZGluZ19zcGlubmVyLmhpZGUoJGxvYWRpbmdTcGlubmVyKTtcblxuICAgICAgICAgICAgICAgIGlmICghcmVzcG9uc2UuY291bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlSW52b2ljZSgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJG1vZGFsLmRpYWxvZyh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnVElUTEVfQ1JFQVRFX0lOVk9JQ0UnLCAnb3JkZXJzJyksXG4gICAgICAgICAgICAgICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogNDIwLFxuICAgICAgICAgICAgICAgICAgICBkaWFsb2dDbGFzczogJ2d4LWNvbnRhaW5lcicsXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgneWVzJywgJ2J1dHRvbnMnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzczogJ2J0bicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6IGNyZWF0ZUludm9pY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ25vJywgJ2J1dHRvbnMnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzczogJ2J0bicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6IG9uQWJvcnRcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBvblJlcXVlc3RGYWlsdXJlKCkge1xuICAgICAgICAgICAgICAgIGpzZS5saWJzLmxvYWRpbmdfc3Bpbm5lci5oaWRlKCRsb2FkaW5nU3Bpbm5lcik7XG4gICAgICAgICAgICAgICAgY3JlYXRlSW52b2ljZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBqc2UubGlicy54aHIuZ2V0KHJlcXVlc3RPcHRpb25zKVxuICAgICAgICAgICAgICAgIC5kb25lKG9uUmVxdWVzdFN1Y2Nlc3MpXG4gICAgICAgICAgICAgICAgLmZhaWwob25SZXF1ZXN0RmFpbHVyZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENyZWF0ZSBQYWNraW5nIFNsaXAgQ2xpY2sgRXZlbnRcbiAgICAgICAgICpcbiAgICAgICAgICogVGhpcyBjYWxsYmFjayB3aWxsIG1ha2Ugc3VyZSB0aGF0IHRoZSBwYWNraW5nIHNsaXAgaXMgY3JlYXRlZCBhbmQgdGhlbiBtYWtlIGEgcGFnZSByZWxvYWQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5LkV2ZW50fSBldmVudFxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9vbkNyZWF0ZVBhY2tpbmdTbGlwQ2xpY2sgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHZhciBkb3dubG9hZFBkZldpbmRvdyA9IHdpbmRvdy5vcGVuKCdhYm91dDpibGFuaycpO1xuICAgICAgICAgICAgdmFyIHVybCA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSArICcmYWpheD0xJztcblxuICAgICAgICAgICAgJC5nZXRKU09OKHVybClcbiAgICAgICAgICAgICAgICAuZG9uZShmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgZG93bmxvYWRQZGZXaW5kb3cubG9jYXRpb24gPSBqc2UuY29yZS5jb25maWcuZ2V0KCdhcHBVcmwnKSArICcvYWRtaW4vcmVxdWVzdF9wb3J0LnBocD8nICsgJC5wYXJhbSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2R1bGU6ICdPcmRlckFkbWluJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbjogJ3Nob3dQZGYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3BhY2tpbmdzbGlwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGU6IHJlc3BvbnNlLmZpbGVuYW1lICsgJ19fJyArIHJlc3BvbnNlLmZpbGVuYW1lU3VmZml4XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uIChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIHtcbiAgICAgICAgICAgICAgICAgICAgZG93bmxvYWRQZGZXaW5kb3cuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogT3BlbiBvcmRlciBzdGF0dXMgbW9kYWwgb24gY2xpY2sgb24gZWxlbWVudHMgd2l0aCBjbGFzcyBhZGQtb3JkZXItc3RhdHVzXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5LkV2ZW50fSBldmVudFxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9vbkFkZE9yZGVyU3RhdHVzQ2xpY2sgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAkKCcudXBkYXRlLW9yZGVyLXN0YXR1cycpLnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgX21vdmVTYXZlQWN0aW9uc1RvQm90dG9tID0gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgJG1haW5BY3Rpb25zID0gJCgnZGl2LnRleHQtcmlnaHQ6bnRoLWNoaWxkKDIpJyk7XG4gICAgICAgICAgICBjb25zdCAkYm90dG9tQmFyID0gJCgnLmZvb3Rlci1pbmZvJyk7XG4gICAgICAgICAgICBjb25zdCAkbmV3Q29udGFpbmVyID0gJCgnPGRpdiBjbGFzcz1cInB1bGwtcmlnaHQgaW5mb1wiPjwvZGl2PicpO1xuXG4gICAgICAgICAgICAkbWFpbkFjdGlvbnMuYXBwZW5kVG8oJG5ld0NvbnRhaW5lcik7XG4gICAgICAgICAgICAkbmV3Q29udGFpbmVyLmFwcGVuZFRvKCRib3R0b21CYXIpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICAkKCcubWVzc2FnZV9zdGFja19jb250YWluZXInKS5hZGRDbGFzcygnYnJlYWtwb2ludC1sYXJnZScpO1xuXG4gICAgICAgICAgICBfbW92ZVNhdmVBY3Rpb25zVG9Cb3R0b20oKTtcblxuICAgICAgICAgICAgJHRoaXNcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgJy5hZGQtb3JkZXItc3RhdHVzJywgX29uQWRkT3JkZXJTdGF0dXNDbGljaylcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgJy5jcmVhdGUtaW52b2ljZScsIF9vbkNyZWF0ZUludm9pY2VDbGljaylcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgJy5jcmVhdGUtcGFja2luZy1zbGlwJywgX29uQ3JlYXRlUGFja2luZ1NsaXBDbGljayk7XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
