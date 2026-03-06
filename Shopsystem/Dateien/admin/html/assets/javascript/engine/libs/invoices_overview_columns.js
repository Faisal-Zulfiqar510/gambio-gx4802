'use strict';

/* --------------------------------------------------------------
 invoices_overview_columns.js 2022-08-04
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

jse.libs.invoices_overview_columns = jse.libs.invoices_overview_columns || {};

/**
 * ## Invoices Table Column Definitions
 *
 * This module defines the column definition of the invoices overview table. They can be overridden by other
 * scripts by modifying the array with new columns, or by replacing the property values of the contained
 * fields.
 *
 * @module Admin/Libs/invoices_overview_columns
 * @exports jse.libs.invoices_overview_columns
 */
(function (exports) {

    'use strict';

    exports.checkbox = exports.checkbox || {
        data: null,
        minWidth: '50px',
        widthFactor: 0.01,
        orderable: false,
        searchable: false,
        defaultContent: '<input type="checkbox" />'
    };

    exports.invoiceNumber = exports.invoiceNumber || {
        data: 'invoiceNumber',
        minWidth: '130px',
        widthFactor: 1.6,
        className: 'numeric',
        render: function render(data, type, full, meta) {
            // Create a link element.
            var link = document.createElement('a');

            // Invoice link parameters.
            var parameters = {
                module: 'OrderAdmin',
                action: 'showPdf',
                type: 'invoice',
                invoice_id: full.DT_RowData.invoiceId
            };

            // Compound invoice link.
            var url = jse.core.config.get('appUrl') + '/admin/request_port.php?' + $.param(parameters);

            // Set element's link attribute.
            link.setAttribute('href', url);
            link.setAttribute('target', '_blank');
            link.setAttribute('title', data);

            // Set element's text content.
            link.textContent = data;

            // Return element's entire HTML.
            return link.outerHTML;
        }
    };

    exports.invoiceDate = exports.invoiceDate || {
        data: 'invoiceDate',
        minWidth: '100px',
        widthFactor: 1.6,
        render: function render(data, type, full, meta) {
            return moment(data).format('DD.MM.YY - HH:mm');
        }
    };

    exports.sum = exports.sum || {
        data: 'sum',
        minWidth: '90px',
        widthFactor: 1,
        className: 'numeric',
        render: function render(data, type, full, meta) {
            return '<span class="tooltip-invoice-sum-block">' + data + '</span>';
        }
    };

    exports.customer = exports.customer || {
        data: 'customer',
        minWidth: '190px',
        widthFactor: 1.5,
        render: function render(data, type, full, meta) {
            var linkElement = full.DT_RowData.customerId ? '<a class="tooltip-customer-addresses" \n\t\t\t\t\t\t\thref="customers/' + full.DT_RowData.customerId + '>' + data + '</a>' : '<span class="tooltip-customer-addresses">' + data + '</span>';

            if (full.DT_RowData.customerMemos.length > 0) {
                linkElement += ' <i class="fa fa-sticky-note-o tooltip-customer-memos tooltip-trigger"\n                                aria-hidden="true"></i>';
            }

            return linkElement;
        }
    };

    exports.group = exports.group || {
        data: 'group',
        minWidth: '85px',
        widthFactor: 1.2
    };

    exports.countryIsoCode = exports.countryIsoCode || {
        data: 'countryIsoCode',
        minWidth: '75px',
        widthFactor: 1.4,
        render: function render(data, type, full, meta) {
            var html = '';

            if (data) {
                html = '<span class="flag-icon flag-icon-' + data.toLowerCase() + '"></span>&nbsp;';
            }

            var title = jse.core.lang.translate('SHIPPING_ORIGIN_COUNTRY_TITLE', 'configuration') + ': ' + full.DT_RowData.country;

            html += '<span title="' + title + '">' + data + '</span>';

            return html;
        }
    };

    exports.orderId = exports.orderId || {
        data: 'orderId',
        minWidth: '75px',
        widthFactor: 1,
        className: 'numeric',
        render: function render(data, type, full, meta) {
            if (data === 0) {
                return '';
            }

            // Create a link element.
            var $link = document.createElement('a');

            // URL parameters.
            var parameters = {
                oID: data,
                action: 'edit'
            };

            // Compound order link.
            var url = jse.core.config.get('appUrl') + '/admin/orders.php?' + $.param(parameters);

            // Set element's link attribute.
            $link.setAttribute('href', url);

            // Set element's text content.
            $link.textContent = data;

            // Return element's entire HTML.
            return $link.outerHTML;
        }
    };

    exports.orderDate = exports.orderDate || {
        data: 'orderDate',
        minWidth: '100px',
        widthFactor: 1.6,
        render: function render(data, type, full, meta) {
            return moment(data).format('DD.MM.YY - HH:mm');
        }
    };

    exports.paymentMethod = exports.paymentMethod || {
        data: 'paymentMethod',
        minWidth: '110px',
        widthFactor: 2,
        render: function render(data, type, full, meta) {
            return '<span title="' + full.DT_RowData.paymentMethod + '">' + data + '</span>';
        }
    };

    exports.status = exports.status || {
        data: 'status',
        minWidth: '120px',
        widthFactor: 2,
        render: function render(data, type, full, meta) {
            return !data ? '' : '\n\t\t\t\t\t<span class="order-status tooltip-invoice-status-history label label-' + full.DT_RowData.statusId + '">\n\t\t\t\t\t\t' + data + '\n\t\t\t\t\t</span>\n\t\t\t\t';
        }
    };

    exports.actions = exports.actions || {
        data: null,
        minWidth: '400px',
        widthFactor: 4.6,
        className: 'actions',
        orderable: false,
        searchable: false,
        render: function render(data, type, full, meta) {
            return '\t\t\t\t\t\n\t\t\t\t\t<div class="pull-left"></div>\n\t\t\t\t\t<div class="pull-right action-list visible-on-hover">\n\t\t\t\t\t\t<a href="request_port.php?module=OrderAdmin&action=showPdf&type=invoice' + ('&invoice_number=' + full.DT_RowData.invoiceNumber + '&order_id=' + full.DT_RowData.orderId + '" \n\t\t\t\t\t\t\ttarget="_blank">\n\t\t\t\t\t\t\t<i class="fa fa-eye view"></i>\n\t\t\t\t\t\t</a>\n\t\t\t\t\t\t<a href="request_port.php?module=OrderAdmin&action=downloadPdf&type=invoice') + ('&invoice_number=' + full.DT_RowData.invoiceNumber + '&order_id=' + full.DT_RowData.orderId + '" \n\t\t\t\t\t\ttarget="_blank">\n\t\t\t\t\t\t\t<i class="fa fa-download download"></i>\n\t\t\t\t\t\t</a>\n\t\t\t\t\t\t<i class="fa fa-envelope-o email-invoice"></i>\n\t\t\t\t\t\n\t\t\t\t\t\t<div class="btn-group dropdown">\n\t\t\t\t\t\t\t<button type="button"\n\t\t\t\t\t\t\t\t\tclass="btn btn-default"></button>\n\t\t\t\t\t\t\t<button type="button"\n\t\t\t\t\t\t\t\t\tclass="btn btn-default dropdown-toggle"\n\t\t\t\t\t\t\t\t\tdata-toggle="dropdown"\n\t\t\t\t\t\t\t\t\taria-haspopup="true"\n\t\t\t\t\t\t\t\t\taria-expanded="false">\n\t\t\t\t\t\t\t\t<span class="caret"></span>\n\t\t\t\t\t\t\t\t<span class="sr-only">Toggle Dropdown</span>\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t<ul class="dropdown-menu dropdown-menu-right"></ul>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t');
        }
    };
})(jse.libs.invoices_overview_columns);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludm9pY2VzX292ZXJ2aWV3X2NvbHVtbnMuanMiXSwibmFtZXMiOlsianNlIiwibGlicyIsImludm9pY2VzX292ZXJ2aWV3X2NvbHVtbnMiLCJleHBvcnRzIiwiY2hlY2tib3giLCJkYXRhIiwibWluV2lkdGgiLCJ3aWR0aEZhY3RvciIsIm9yZGVyYWJsZSIsInNlYXJjaGFibGUiLCJkZWZhdWx0Q29udGVudCIsImludm9pY2VOdW1iZXIiLCJjbGFzc05hbWUiLCJyZW5kZXIiLCJ0eXBlIiwiZnVsbCIsIm1ldGEiLCJsaW5rIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwicGFyYW1ldGVycyIsIm1vZHVsZSIsImFjdGlvbiIsImludm9pY2VfaWQiLCJEVF9Sb3dEYXRhIiwiaW52b2ljZUlkIiwidXJsIiwiY29yZSIsImNvbmZpZyIsImdldCIsIiQiLCJwYXJhbSIsInNldEF0dHJpYnV0ZSIsInRleHRDb250ZW50Iiwib3V0ZXJIVE1MIiwiaW52b2ljZURhdGUiLCJtb21lbnQiLCJmb3JtYXQiLCJzdW0iLCJjdXN0b21lciIsImxpbmtFbGVtZW50IiwiY3VzdG9tZXJJZCIsImN1c3RvbWVyTWVtb3MiLCJsZW5ndGgiLCJncm91cCIsImNvdW50cnlJc29Db2RlIiwiaHRtbCIsInRvTG93ZXJDYXNlIiwidGl0bGUiLCJsYW5nIiwidHJhbnNsYXRlIiwiY291bnRyeSIsIm9yZGVySWQiLCIkbGluayIsIm9JRCIsIm9yZGVyRGF0ZSIsInBheW1lbnRNZXRob2QiLCJzdGF0dXMiLCJzdGF0dXNJZCIsImFjdGlvbnMiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQUEsSUFBSUMsSUFBSixDQUFTQyx5QkFBVCxHQUFxQ0YsSUFBSUMsSUFBSixDQUFTQyx5QkFBVCxJQUFzQyxFQUEzRTs7QUFFQTs7Ozs7Ozs7OztBQVVBLENBQUMsVUFBVUMsT0FBVixFQUFtQjs7QUFFaEI7O0FBRUFBLFlBQVFDLFFBQVIsR0FBbUJELFFBQVFDLFFBQVIsSUFBb0I7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QUFQO0FBS0g7QUFWOEIsS0FBbkM7O0FBYUFGLFlBQVF3RCxPQUFSLEdBQWtCeEQsUUFBUXdELE9BQVIsSUFBbUI7QUFDakN0RCxjQUFNLElBRDJCO0FBRWpDQyxrQkFBVSxPQUZ1QjtBQUdqQ0MscUJBQWEsR0FIb0I7QUFJakNLLG1CQUFXLFNBSnNCO0FBS2pDSixtQkFBVyxLQUxzQjtBQU1qQ0Msb0JBQVksS0FOcUI7QUFPakNJLGNBUGlDLGtCQU8xQlIsSUFQMEIsRUFPcEJTLElBUG9CLEVBT2RDLElBUGMsRUFPUkMsSUFQUSxFQU9GO0FBQzNCLG1CQUFPLG9PQUlrQkQsS0FBS1MsVUFBTCxDQUFnQmIsYUFKbEMsa0JBSTRESSxLQUFLUyxVQUFMLENBQWdCNEIsT0FKNUUsME5BU2tCckMsS0FBS1MsVUFBTCxDQUFnQmIsYUFUbEMsa0JBUzRESSxLQUFLUyxVQUFMLENBQWdCNEIsT0FUNUUsa3hCQUFQO0FBOEJIO0FBdENnQyxLQUFyQztBQXdDSCxDQXhORCxFQXdOR3BELElBQUlDLElBQUosQ0FBU0MseUJBeE5aIiwiZmlsZSI6Imludm9pY2VzX292ZXJ2aWV3X2NvbHVtbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGludm9pY2VzX292ZXJ2aWV3X2NvbHVtbnMuanMgMjAyMi0wOC0wNFxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTYgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmpzZS5saWJzLmludm9pY2VzX292ZXJ2aWV3X2NvbHVtbnMgPSBqc2UubGlicy5pbnZvaWNlc19vdmVydmlld19jb2x1bW5zIHx8IHt9O1xuXG4vKipcbiAqICMjIEludm9pY2VzIFRhYmxlIENvbHVtbiBEZWZpbml0aW9uc1xuICpcbiAqIFRoaXMgbW9kdWxlIGRlZmluZXMgdGhlIGNvbHVtbiBkZWZpbml0aW9uIG9mIHRoZSBpbnZvaWNlcyBvdmVydmlldyB0YWJsZS4gVGhleSBjYW4gYmUgb3ZlcnJpZGRlbiBieSBvdGhlclxuICogc2NyaXB0cyBieSBtb2RpZnlpbmcgdGhlIGFycmF5IHdpdGggbmV3IGNvbHVtbnMsIG9yIGJ5IHJlcGxhY2luZyB0aGUgcHJvcGVydHkgdmFsdWVzIG9mIHRoZSBjb250YWluZWRcbiAqIGZpZWxkcy5cbiAqXG4gKiBAbW9kdWxlIEFkbWluL0xpYnMvaW52b2ljZXNfb3ZlcnZpZXdfY29sdW1uc1xuICogQGV4cG9ydHMganNlLmxpYnMuaW52b2ljZXNfb3ZlcnZpZXdfY29sdW1uc1xuICovXG4oZnVuY3Rpb24gKGV4cG9ydHMpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGV4cG9ydHMuY2hlY2tib3ggPSBleHBvcnRzLmNoZWNrYm94IHx8IHtcbiAgICAgICAgZGF0YTogbnVsbCxcbiAgICAgICAgbWluV2lkdGg6ICc1MHB4JyxcbiAgICAgICAgd2lkdGhGYWN0b3I6IDAuMDEsXG4gICAgICAgIG9yZGVyYWJsZTogZmFsc2UsXG4gICAgICAgIHNlYXJjaGFibGU6IGZhbHNlLFxuICAgICAgICBkZWZhdWx0Q29udGVudDogJzxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiAvPidcbiAgICB9O1xuXG4gICAgZXhwb3J0cy5pbnZvaWNlTnVtYmVyID0gZXhwb3J0cy5pbnZvaWNlTnVtYmVyIHx8IHtcbiAgICAgICAgZGF0YTogJ2ludm9pY2VOdW1iZXInLFxuICAgICAgICBtaW5XaWR0aDogJzEzMHB4JyxcbiAgICAgICAgd2lkdGhGYWN0b3I6IDEuNixcbiAgICAgICAgY2xhc3NOYW1lOiAnbnVtZXJpYycsXG4gICAgICAgIHJlbmRlcihkYXRhLCB0eXBlLCBmdWxsLCBtZXRhKSB7XG4gICAgICAgICAgICAvLyBDcmVhdGUgYSBsaW5rIGVsZW1lbnQuXG4gICAgICAgICAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuXG4gICAgICAgICAgICAvLyBJbnZvaWNlIGxpbmsgcGFyYW1ldGVycy5cbiAgICAgICAgICAgIGNvbnN0IHBhcmFtZXRlcnMgPSB7XG4gICAgICAgICAgICAgICAgbW9kdWxlOiAnT3JkZXJBZG1pbicsXG4gICAgICAgICAgICAgICAgYWN0aW9uOiAnc2hvd1BkZicsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2ludm9pY2UnLFxuICAgICAgICAgICAgICAgIGludm9pY2VfaWQ6IGZ1bGwuRFRfUm93RGF0YS5pbnZvaWNlSWRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIENvbXBvdW5kIGludm9pY2UgbGluay5cbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGAke2pzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpfS9hZG1pbi9yZXF1ZXN0X3BvcnQucGhwPyR7JC5wYXJhbShwYXJhbWV0ZXJzKX1gO1xuXG4gICAgICAgICAgICAvLyBTZXQgZWxlbWVudCdzIGxpbmsgYXR0cmlidXRlLlxuICAgICAgICAgICAgbGluay5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCB1cmwpO1xuICAgICAgICAgICAgbGluay5zZXRBdHRyaWJ1dGUoJ3RhcmdldCcsICdfYmxhbmsnKTtcbiAgICAgICAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCd0aXRsZScsIGRhdGEpO1xuXG4gICAgICAgICAgICAvLyBTZXQgZWxlbWVudCdzIHRleHQgY29udGVudC5cbiAgICAgICAgICAgIGxpbmsudGV4dENvbnRlbnQgPSBkYXRhO1xuXG4gICAgICAgICAgICAvLyBSZXR1cm4gZWxlbWVudCdzIGVudGlyZSBIVE1MLlxuICAgICAgICAgICAgcmV0dXJuIGxpbmsub3V0ZXJIVE1MO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGV4cG9ydHMuaW52b2ljZURhdGUgPSBleHBvcnRzLmludm9pY2VEYXRlIHx8IHtcbiAgICAgICAgZGF0YTogJ2ludm9pY2VEYXRlJyxcbiAgICAgICAgbWluV2lkdGg6ICcxMDBweCcsXG4gICAgICAgIHdpZHRoRmFjdG9yOiAxLjYsXG4gICAgICAgIHJlbmRlcihkYXRhLCB0eXBlLCBmdWxsLCBtZXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gbW9tZW50KGRhdGEpLmZvcm1hdCgnREQuTU0uWVkgLSBISDptbScpXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZXhwb3J0cy5zdW0gPSBleHBvcnRzLnN1bSB8fCB7XG4gICAgICAgIGRhdGE6ICdzdW0nLFxuICAgICAgICBtaW5XaWR0aDogJzkwcHgnLFxuICAgICAgICB3aWR0aEZhY3RvcjogMSxcbiAgICAgICAgY2xhc3NOYW1lOiAnbnVtZXJpYycsXG4gICAgICAgIHJlbmRlcihkYXRhLCB0eXBlLCBmdWxsLCBtZXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gYDxzcGFuIGNsYXNzPVwidG9vbHRpcC1pbnZvaWNlLXN1bS1ibG9ja1wiPiR7ZGF0YX08L3NwYW4+YDtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBleHBvcnRzLmN1c3RvbWVyID0gZXhwb3J0cy5jdXN0b21lciB8fCB7XG4gICAgICAgIGRhdGE6ICdjdXN0b21lcicsXG4gICAgICAgIG1pbldpZHRoOiAnMTkwcHgnLFxuICAgICAgICB3aWR0aEZhY3RvcjogMS41LFxuICAgICAgICByZW5kZXIoZGF0YSwgdHlwZSwgZnVsbCwgbWV0YSkge1xuICAgICAgICAgICAgbGV0IGxpbmtFbGVtZW50ID0gZnVsbC5EVF9Sb3dEYXRhLmN1c3RvbWVySWRcbiAgICAgICAgICAgICAgICA/IGA8YSBjbGFzcz1cInRvb2x0aXAtY3VzdG9tZXItYWRkcmVzc2VzXCIgXG5cdFx0XHRcdFx0XHRcdGhyZWY9XCJjdXN0b21lcnMvJHtmdWxsLkRUX1Jvd0RhdGEuY3VzdG9tZXJJZH0+JHtkYXRhfTwvYT5gXG4gICAgICAgICAgICAgICAgOiBgPHNwYW4gY2xhc3M9XCJ0b29sdGlwLWN1c3RvbWVyLWFkZHJlc3Nlc1wiPiR7ZGF0YX08L3NwYW4+YDtcblxuICAgICAgICAgICAgaWYgKGZ1bGwuRFRfUm93RGF0YS5jdXN0b21lck1lbW9zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBsaW5rRWxlbWVudCArPVxuICAgICAgICAgICAgICAgICAgICBgIDxpIGNsYXNzPVwiZmEgZmEtc3RpY2t5LW5vdGUtbyB0b29sdGlwLWN1c3RvbWVyLW1lbW9zIHRvb2x0aXAtdHJpZ2dlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5gO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbGlua0VsZW1lbnQ7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZXhwb3J0cy5ncm91cCA9IGV4cG9ydHMuZ3JvdXAgfHwge1xuICAgICAgICBkYXRhOiAnZ3JvdXAnLFxuICAgICAgICBtaW5XaWR0aDogJzg1cHgnLFxuICAgICAgICB3aWR0aEZhY3RvcjogMS4yXG4gICAgfTtcblxuICAgIGV4cG9ydHMuY291bnRyeUlzb0NvZGUgPSBleHBvcnRzLmNvdW50cnlJc29Db2RlIHx8IHtcbiAgICAgICAgZGF0YTogJ2NvdW50cnlJc29Db2RlJyxcbiAgICAgICAgbWluV2lkdGg6ICc3NXB4JyxcbiAgICAgICAgd2lkdGhGYWN0b3I6IDEuNCxcbiAgICAgICAgcmVuZGVyKGRhdGEsIHR5cGUsIGZ1bGwsIG1ldGEpIHtcbiAgICAgICAgICAgIGxldCBodG1sID0gJyc7XG5cbiAgICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgaHRtbCA9XG4gICAgICAgICAgICAgICAgICAgIGA8c3BhbiBjbGFzcz1cImZsYWctaWNvbiBmbGFnLWljb24tJHtkYXRhLnRvTG93ZXJDYXNlKCl9XCI+PC9zcGFuPiZuYnNwO2A7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHRpdGxlID0ganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ1NISVBQSU5HX09SSUdJTl9DT1VOVFJZX1RJVExFJywgJ2NvbmZpZ3VyYXRpb24nKVxuICAgICAgICAgICAgICAgICsgJzogJyArIGZ1bGwuRFRfUm93RGF0YS5jb3VudHJ5O1xuXG4gICAgICAgICAgICBodG1sICs9IGA8c3BhbiB0aXRsZT1cIiR7dGl0bGV9XCI+JHtkYXRhfTwvc3Bhbj5gO1xuXG4gICAgICAgICAgICByZXR1cm4gaHRtbDtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBleHBvcnRzLm9yZGVySWQgPSBleHBvcnRzLm9yZGVySWQgfHwge1xuICAgICAgICBkYXRhOiAnb3JkZXJJZCcsXG4gICAgICAgIG1pbldpZHRoOiAnNzVweCcsXG4gICAgICAgIHdpZHRoRmFjdG9yOiAxLFxuICAgICAgICBjbGFzc05hbWU6ICdudW1lcmljJyxcbiAgICAgICAgcmVuZGVyKGRhdGEsIHR5cGUsIGZ1bGwsIG1ldGEpIHtcbiAgICAgICAgICAgIGlmIChkYXRhID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDcmVhdGUgYSBsaW5rIGVsZW1lbnQuXG4gICAgICAgICAgICBjb25zdCAkbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcblxuICAgICAgICAgICAgLy8gVVJMIHBhcmFtZXRlcnMuXG4gICAgICAgICAgICBjb25zdCBwYXJhbWV0ZXJzID0ge1xuICAgICAgICAgICAgICAgIG9JRDogZGF0YSxcbiAgICAgICAgICAgICAgICBhY3Rpb246ICdlZGl0J1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gQ29tcG91bmQgb3JkZXIgbGluay5cbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGAke2pzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpfS9hZG1pbi9vcmRlcnMucGhwPyR7JC5wYXJhbShwYXJhbWV0ZXJzKX1gO1xuXG4gICAgICAgICAgICAvLyBTZXQgZWxlbWVudCdzIGxpbmsgYXR0cmlidXRlLlxuICAgICAgICAgICAgJGxpbmsuc2V0QXR0cmlidXRlKCdocmVmJywgdXJsKTtcblxuICAgICAgICAgICAgLy8gU2V0IGVsZW1lbnQncyB0ZXh0IGNvbnRlbnQuXG4gICAgICAgICAgICAkbGluay50ZXh0Q29udGVudCA9IGRhdGE7XG5cbiAgICAgICAgICAgIC8vIFJldHVybiBlbGVtZW50J3MgZW50aXJlIEhUTUwuXG4gICAgICAgICAgICByZXR1cm4gJGxpbmsub3V0ZXJIVE1MO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGV4cG9ydHMub3JkZXJEYXRlID0gZXhwb3J0cy5vcmRlckRhdGUgfHwge1xuICAgICAgICBkYXRhOiAnb3JkZXJEYXRlJyxcbiAgICAgICAgbWluV2lkdGg6ICcxMDBweCcsXG4gICAgICAgIHdpZHRoRmFjdG9yOiAxLjYsXG4gICAgICAgIHJlbmRlcihkYXRhLCB0eXBlLCBmdWxsLCBtZXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gbW9tZW50KGRhdGEpLmZvcm1hdCgnREQuTU0uWVkgLSBISDptbScpXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZXhwb3J0cy5wYXltZW50TWV0aG9kID0gZXhwb3J0cy5wYXltZW50TWV0aG9kIHx8IHtcbiAgICAgICAgZGF0YTogJ3BheW1lbnRNZXRob2QnLFxuICAgICAgICBtaW5XaWR0aDogJzExMHB4JyxcbiAgICAgICAgd2lkdGhGYWN0b3I6IDIsXG4gICAgICAgIHJlbmRlcihkYXRhLCB0eXBlLCBmdWxsLCBtZXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gYDxzcGFuIHRpdGxlPVwiJHtmdWxsLkRUX1Jvd0RhdGEucGF5bWVudE1ldGhvZH1cIj4ke2RhdGF9PC9zcGFuPmBcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBleHBvcnRzLnN0YXR1cyA9IGV4cG9ydHMuc3RhdHVzIHx8IHtcbiAgICAgICAgZGF0YTogJ3N0YXR1cycsXG4gICAgICAgIG1pbldpZHRoOiAnMTIwcHgnLFxuICAgICAgICB3aWR0aEZhY3RvcjogMixcbiAgICAgICAgcmVuZGVyKGRhdGEsIHR5cGUsIGZ1bGwsIG1ldGEpIHtcbiAgICAgICAgICAgIHJldHVybiAhZGF0YSA/ICcnIDogYFxuXHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwib3JkZXItc3RhdHVzIHRvb2x0aXAtaW52b2ljZS1zdGF0dXMtaGlzdG9yeSBsYWJlbCBsYWJlbC0ke2Z1bGwuRFRfUm93RGF0YS5zdGF0dXNJZH1cIj5cblx0XHRcdFx0XHRcdCR7ZGF0YX1cblx0XHRcdFx0XHQ8L3NwYW4+XG5cdFx0XHRcdGA7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZXhwb3J0cy5hY3Rpb25zID0gZXhwb3J0cy5hY3Rpb25zIHx8IHtcbiAgICAgICAgZGF0YTogbnVsbCxcbiAgICAgICAgbWluV2lkdGg6ICc0MDBweCcsXG4gICAgICAgIHdpZHRoRmFjdG9yOiA0LjYsXG4gICAgICAgIGNsYXNzTmFtZTogJ2FjdGlvbnMnLFxuICAgICAgICBvcmRlcmFibGU6IGZhbHNlLFxuICAgICAgICBzZWFyY2hhYmxlOiBmYWxzZSxcbiAgICAgICAgcmVuZGVyKGRhdGEsIHR5cGUsIGZ1bGwsIG1ldGEpIHtcbiAgICAgICAgICAgIHJldHVybiBgXHRcdFx0XHRcdFxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwdWxsLWxlZnRcIj48L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicHVsbC1yaWdodCBhY3Rpb24tbGlzdCB2aXNpYmxlLW9uLWhvdmVyXCI+XG5cdFx0XHRcdFx0XHQ8YSBocmVmPVwicmVxdWVzdF9wb3J0LnBocD9tb2R1bGU9T3JkZXJBZG1pbiZhY3Rpb249c2hvd1BkZiZ0eXBlPWludm9pY2VgXG4gICAgICAgICAgICAgICAgKyBgJmludm9pY2VfbnVtYmVyPSR7ZnVsbC5EVF9Sb3dEYXRhLmludm9pY2VOdW1iZXJ9Jm9yZGVyX2lkPSR7ZnVsbC5EVF9Sb3dEYXRhLm9yZGVySWR9XCIgXG5cdFx0XHRcdFx0XHRcdHRhcmdldD1cIl9ibGFua1wiPlxuXHRcdFx0XHRcdFx0XHQ8aSBjbGFzcz1cImZhIGZhLWV5ZSB2aWV3XCI+PC9pPlxuXHRcdFx0XHRcdFx0PC9hPlxuXHRcdFx0XHRcdFx0PGEgaHJlZj1cInJlcXVlc3RfcG9ydC5waHA/bW9kdWxlPU9yZGVyQWRtaW4mYWN0aW9uPWRvd25sb2FkUGRmJnR5cGU9aW52b2ljZWBcbiAgICAgICAgICAgICAgICArIGAmaW52b2ljZV9udW1iZXI9JHtmdWxsLkRUX1Jvd0RhdGEuaW52b2ljZU51bWJlcn0mb3JkZXJfaWQ9JHtmdWxsLkRUX1Jvd0RhdGEub3JkZXJJZH1cIiBcblx0XHRcdFx0XHRcdHRhcmdldD1cIl9ibGFua1wiPlxuXHRcdFx0XHRcdFx0XHQ8aSBjbGFzcz1cImZhIGZhLWRvd25sb2FkIGRvd25sb2FkXCI+PC9pPlxuXHRcdFx0XHRcdFx0PC9hPlxuXHRcdFx0XHRcdFx0PGkgY2xhc3M9XCJmYSBmYS1lbnZlbG9wZS1vIGVtYWlsLWludm9pY2VcIj48L2k+XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwIGRyb3Bkb3duXCI+XG5cdFx0XHRcdFx0XHRcdDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG5cdFx0XHRcdFx0XHRcdFx0XHRjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiPjwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJidXR0b25cIlxuXHRcdFx0XHRcdFx0XHRcdFx0Y2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgZHJvcGRvd24tdG9nZ2xlXCJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIlxuXHRcdFx0XHRcdFx0XHRcdFx0YXJpYS1oYXNwb3B1cD1cInRydWVcIlxuXHRcdFx0XHRcdFx0XHRcdFx0YXJpYS1leHBhbmRlZD1cImZhbHNlXCI+XG5cdFx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJjYXJldFwiPjwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cInNyLW9ubHlcIj5Ub2dnbGUgRHJvcGRvd248L3NwYW4+XG5cdFx0XHRcdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0XHQ8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51IGRyb3Bkb3duLW1lbnUtcmlnaHRcIj48L3VsPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdGA7XG4gICAgICAgIH1cbiAgICB9O1xufSkoanNlLmxpYnMuaW52b2ljZXNfb3ZlcnZpZXdfY29sdW1ucyk7IFxuIl19
