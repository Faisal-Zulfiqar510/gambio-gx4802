'use strict';

/* --------------------------------------------------------------
 orders_overview_columns.js 2022-08-04
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2020 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

jse.libs.orders_overview_columns = jse.libs.orders_overview_columns || {};

/**
 * ## Orders Table Column Definitions
 *
 * This module defines the column definition of the order overview table. They can be overridden by other
 * scripts by modifying the array with new columns, or by replacing the property values of the contained
 * fields.
 *
 * @module Admin/Libs/orders_overview_columns
 * @exports jse.libs.orders_overview_columns
 * @requires momentjs
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

    exports.number = exports.number || {
        data: 'number',
        minWidth: '75px',
        widthFactor: 1,
        className: 'numeric',
        render: function render(data, type, full, meta) {
            var linkElement = '';

            if (full.DT_RowData.comment !== '') {
                // Remove double quotes to avoid broken tooltips
                var escapedComment = full.DT_RowData.comment.replace(/"/, '');

                linkElement += '\n\t\t\t\t\t\t\t\t\t<i class="fa fa-comment-o tooltip-order-comment tooltip-trigger"\n\t\t\t\t\t\t\t\t\t\taria-hidden="true" title="' + escapedComment + '"></i>&nbsp;\n\t\t\t\t\t\t\t\t';
            }

            var editUrl = 'orders.php?' + $.param({
                oID: full.DT_RowData.id,
                action: 'edit',
                overview: $.deparam(window.location.search.slice(1))
            });

            linkElement += '\n\t\t\t\t\t\t\t\t<a class="tooltip-order-items" href="' + editUrl + '">\n\t\t\t\t\t\t\t\t\t' + full.DT_RowData.id + '\n\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t';

            return linkElement;
        }
    };

    exports.customer = exports.customer || {
        data: 'customer',
        minWidth: '190px',
        widthFactor: 1.5,
        render: function render(data, type, full, meta) {
            var linkElement = full.DT_RowData.customerId ? '<a class="tooltip-customer-addresses" \n\t\t\t\t\t\t\thref="customers/' + full.DT_RowData.customerId + '">' + data + '</a>' : '<span class="tooltip-customer-addresses">' + data + '</span>';

            if (full.DT_RowData.customerMemos.length > 0) {
                linkElement += ' <i class="fa fa-sticky-note-o tooltip-customer-memos tooltip-trigger" \n                                aria-hidden="true"></i>';
            }

            return linkElement;
        }
    };

    exports.group = exports.group || {
        data: 'group',
        minWidth: '85px',
        widthFactor: 1.2
    };

    exports.sum = exports.sum || {
        data: 'sum',
        minWidth: '90px',
        widthFactor: 1,
        className: 'numeric',
        render: function render(data, type, full, meta) {
            return '<span class="tooltip-order-sum-block">' + data + '</span>';
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

    exports.shippingMethod = exports.shippingMethod || {
        data: 'shippingMethod',
        minWidth: '110px',
        widthFactor: 2,
        className: 'shipping-method',
        render: function render(data, type, full, meta) {
            return '<span title="' + full.DT_RowData.shippingMethod + '">' + data + '</span>' + (full.DT_RowData.trackingLinks.length ? ' <i class="fa fa-truck fa-lg tooltip-tracking-links tooltip-trigger"></i>' : '');
        },
        createdCell: function createdCell(td, cellData, rowData, row, col) {
            rowData.DT_RowData.trackingLinks.length ? $(td).children(':first').data('orderId', rowData.DT_RowData.id).attr('data-toggle', 'modal').attr('data-target', '.add-tracking-number.modal') : $(td).data('orderId', rowData.DT_RowData.id).attr('data-toggle', 'modal').attr('data-target', '.add-tracking-number.modal');
        }
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

    exports.date = exports.date || {
        data: 'date',
        minWidth: '100px',
        widthFactor: 1.6,
        render: function render(data, type, full, meta) {
            return moment(data).format('DD.MM.YY - HH:mm');
        }
    };

    exports.status = exports.status || {
        data: 'status',
        minWidth: '120px',
        widthFactor: 2,
        render: function render(data, type, full, meta) {
            return '\n\t\t\t\t\t<span data-toggle="modal" data-target=".status.modal"\n\t\t\t\t\t\t\tclass="order-status tooltip-order-status-history label label-' + full.DT_RowData.statusId + '">\n\t\t\t\t\t\t' + data + '\n\t\t\t\t\t</span>\n\t\t\t\t';
        }
    };

    exports.totalWeight = exports.totalWeight || {
        data: 'totalWeight',
        minWidth: '50px',
        widthFactor: 0.6,
        className: 'numeric'
    };

    exports.invoiceNumber = exports.invoiceNumber || {
        data: 'invoiceNumber',
        minWidth: '75px',
        widthFactor: 1,
        render: function render(data, type, full, meta) {
            // Create a 'span' container element.
            var $html = document.createElement('span');

            // Iterator function to add a link element into container.
            var _addLinkElement = function _addLinkElement(invoiceNumber, index, array) {
                // Is the current iteration the last one?
                var isLastIteration = index === array.length - 1;

                // Invoice link parameters.
                var parameters = {
                    module: 'OrderAdmin',
                    action: 'showPdf',
                    type: 'invoice',
                    order_id: full.DT_RowData.id,
                    invoice_number: invoiceNumber
                };

                // Compound invoice link.
                var url = jse.core.config.get('appUrl') + '/admin/request_port.php?' + $.param(parameters);

                // Create link element.
                var $link = document.createElement('a');

                // Set link on element.
                $link.setAttribute('href', url);
                $link.setAttribute('target', '_blank');

                // Set invoice number as text on element.
                $link.textContent = invoiceNumber + (isLastIteration ? '' : ', ');

                // Append element to container.
                $html.appendChild($link);
            };

            // Add tooltip classes to element.
            $html.classList.add('tooltip-invoices', 'tooltip-trigger');

            // Iterate over each invoice number and create link.
            full.DT_RowData.invoiceNumbers.forEach(_addLinkElement);

            return $html.outerHTML;
        }
    };

    exports.actions = exports.actions || {
        data: null,
        minWidth: '350px',
        widthFactor: 4.6,
        className: 'actions',
        orderable: false,
        searchable: false,
        render: function render(data, type, full, meta) {
            var withdrawalIdsHtml = '';

            if (full.DT_RowData.withdrawalIds.length > 2) {
                withdrawalIdsHtml += '\n                    <span class="tooltip-order-withdrawals">\n                        <img src="html/assets/images/legacy/icons/withdrawal-on.png"\n                            class="tooltip-order-withdrawals tooltip-trigger meta-icon" />\n                    </span>\n                ';
            } else {
                full.DT_RowData.withdrawalIds.forEach(function (withdrawalId) {
                    withdrawalIdsHtml += '\n\t\t\t\t\t\t<a href="admin.php?do=Withdrawals&id=' + withdrawalId + '"\n\t\t\t\t\t\t\t\ttitle="' + jse.core.lang.translate('TABLE_HEADING_WITHDRAWAL_ID', 'orders') + ' ' + withdrawalId + '">\n\t\t\t\t\t\t\t<img src="html/assets/images/legacy/icons/withdrawal-on.png"\n\t\t\t\t\t\t\t\tclass="tooltip-withdrawal tooltip-trigger meta-icon"\n\t\t\t\t\t\t\t\tdata-withdrawal-id="' + withdrawalId + '" />\n\t\t\t\t\t\t</a>\n\t\t\t\t\t';
                });
            }

            var editUrl = 'orders.php?' + $.param({
                oID: full.DT_RowData.id,
                action: 'edit',
                overview: $.deparam(window.location.search.slice(1))
            });

            var mailStatusHtml = !full.DT_RowData.mailStatus ? '<i class="fa fa-envelope-o meta-icon tooltip-confirmation-not-sent email-order tooltip-trigger"\n\t\t\t\t\t\ttitle="' + jse.core.lang.translate('TEXT_CONFIRMATION_NOT_SENT', 'orders') + '"></i>' : '';

            return '\n\t\t\t\t\t<div class="pull-left">\n\t\t\t\t\t\t' + withdrawalIdsHtml + '\n\t\t\t\t\t\t' + mailStatusHtml + '\n\t\t\t\t\t</div>\n\t\t\t\t\t\n\t\t\t\t\t<div class="pull-right action-list visible-on-hover">\n\t\t\t\t\t\t<a href="' + editUrl + '">\n\t\t\t\t\t\t\t<i class="fa fa-eye edit"></i>\n\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\n\t\t\t\t\t\t<div class="btn-group dropdown">\n\t\t\t\t\t\t\t<button type="button"\n\t\t\t\t\t\t\t\t\tclass="btn btn-default"></button>\n\t\t\t\t\t\t\t<button type="button"\n\t\t\t\t\t\t\t\t\tclass="btn btn-default dropdown-toggle"\n\t\t\t\t\t\t\t\t\tdata-toggle="dropdown"\n\t\t\t\t\t\t\t\t\taria-haspopup="true"\n\t\t\t\t\t\t\t\t\taria-expanded="false">\n\t\t\t\t\t\t\t\t<span class="caret"></span>\n\t\t\t\t\t\t\t\t<span class="sr-only">Toggle Dropdown</span>\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t<ul class="dropdown-menu dropdown-menu-right"></ul>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t';
        }
    };
})(jse.libs.orders_overview_columns);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yZGVyc19vdmVydmlld19jb2x1bW5zLmpzIl0sIm5hbWVzIjpbImpzZSIsImxpYnMiLCJvcmRlcnNfb3ZlcnZpZXdfY29sdW1ucyIsImV4cG9ydHMiLCJjaGVja2JveCIsImRhdGEiLCJtaW5XaWR0aCIsIndpZHRoRmFjdG9yIiwib3JkZXJhYmxlIiwic2VhcmNoYWJsZSIsImRlZmF1bHRDb250ZW50IiwibnVtYmVyIiwiY2xhc3NOYW1lIiwicmVuZGVyIiwidHlwZSIsImZ1bGwiLCJtZXRhIiwibGlua0VsZW1lbnQiLCJEVF9Sb3dEYXRhIiwiY29tbWVudCIsImVzY2FwZWRDb21tZW50IiwicmVwbGFjZSIsImVkaXRVcmwiLCIkIiwicGFyYW0iLCJvSUQiLCJpZCIsImFjdGlvbiIsIm92ZXJ2aWV3IiwiZGVwYXJhbSIsIndpbmRvdyIsImxvY2F0aW9uIiwic2VhcmNoIiwic2xpY2UiLCJjdXN0b21lciIsImN1c3RvbWVySWQiLCJjdXN0b21lck1lbW9zIiwibGVuZ3RoIiwiZ3JvdXAiLCJzdW0iLCJwYXltZW50TWV0aG9kIiwic2hpcHBpbmdNZXRob2QiLCJ0cmFja2luZ0xpbmtzIiwiY3JlYXRlZENlbGwiLCJ0ZCIsImNlbGxEYXRhIiwicm93RGF0YSIsInJvdyIsImNvbCIsImNoaWxkcmVuIiwiYXR0ciIsImNvdW50cnlJc29Db2RlIiwiaHRtbCIsInRvTG93ZXJDYXNlIiwidGl0bGUiLCJjb3JlIiwibGFuZyIsInRyYW5zbGF0ZSIsImNvdW50cnkiLCJkYXRlIiwibW9tZW50IiwiZm9ybWF0Iiwic3RhdHVzIiwic3RhdHVzSWQiLCJ0b3RhbFdlaWdodCIsImludm9pY2VOdW1iZXIiLCIkaHRtbCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsIl9hZGRMaW5rRWxlbWVudCIsImluZGV4IiwiYXJyYXkiLCJpc0xhc3RJdGVyYXRpb24iLCJwYXJhbWV0ZXJzIiwibW9kdWxlIiwib3JkZXJfaWQiLCJpbnZvaWNlX251bWJlciIsInVybCIsImNvbmZpZyIsImdldCIsIiRsaW5rIiwic2V0QXR0cmlidXRlIiwidGV4dENvbnRlbnQiLCJhcHBlbmRDaGlsZCIsImNsYXNzTGlzdCIsImFkZCIsImludm9pY2VOdW1iZXJzIiwiZm9yRWFjaCIsIm91dGVySFRNTCIsImFjdGlvbnMiLCJ3aXRoZHJhd2FsSWRzSHRtbCIsIndpdGhkcmF3YWxJZHMiLCJ3aXRoZHJhd2FsSWQiLCJtYWlsU3RhdHVzSHRtbCIsIm1haWxTdGF0dXMiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQUEsSUFBSUMsSUFBSixDQUFTQyx1QkFBVCxHQUFtQ0YsSUFBSUMsSUFBSixDQUFTQyx1QkFBVCxJQUFvQyxFQUF2RTs7QUFFQTs7Ozs7Ozs7Ozs7QUFXQSxDQUFDLFVBQVVDLE9BQVYsRUFBbUI7O0FBRWhCOztBQUVBQSxZQUFRQyxRQUFSLEdBQW1CRCxRQUFRQyxRQUFSLElBQW9CO0FBQ25DQyxjQUFNLElBRDZCO0FBRW5DQyxrQkFBVSxNQUZ5QjtBQUduQ0MscUJBQWEsSUFIc0I7QUFJbkNDLG1CQUFXLEtBSndCO0FBS25DQyxvQkFBWSxLQUx1QjtBQU1uQ0Msd0JBQWdCO0FBTm1CLEtBQXZDOztBQVNBUCxZQUFRUSxNQUFSLEdBQWlCUixRQUFRUSxNQUFSLElBQWtCO0FBQy9CTixjQUFNLFFBRHlCO0FBRS9CQyxrQkFBVSxNQUZxQjtBQUcvQkMscUJBQWEsQ0FIa0I7QUFJL0JLLG1CQUFXLFNBSm9CO0FBSy9CQyxjQUwrQixrQkFLeEJSLElBTHdCLEVBS2xCUyxJQUxrQixFQUtaQyxJQUxZLEVBS05DLElBTE0sRUFLQTtBQUMzQixnQkFBSUMsY0FBYyxFQUFsQjs7QUFFQSxnQkFBSUYsS0FBS0csVUFBTCxDQUFnQkMsT0FBaEIsS0FBNEIsRUFBaEMsRUFBb0M7QUFDaEM7QUFDQSxvQkFBSUMsaUJBQWlCTCxLQUFLRyxVQUFMLENBQWdCQyxPQUFoQixDQUF3QkUsT0FBeEIsQ0FBZ0MsR0FBaEMsRUFBcUMsRUFBckMsQ0FBckI7O0FBRUFKLHdLQUVzQkcsY0FGdEI7QUFJSDs7QUFFRCxnQkFBTUUsVUFBVSxnQkFBZ0JDLEVBQUVDLEtBQUYsQ0FBUTtBQUNwQ0MscUJBQUtWLEtBQUtHLFVBQUwsQ0FBZ0JRLEVBRGU7QUFFcENDLHdCQUFRLE1BRjRCO0FBR3BDQywwQkFBVUwsRUFBRU0sT0FBRixDQUFVQyxPQUFPQyxRQUFQLENBQWdCQyxNQUFoQixDQUF1QkMsS0FBdkIsQ0FBNkIsQ0FBN0IsQ0FBVjtBQUgwQixhQUFSLENBQWhDOztBQU1BaEIsdUZBQ21DSyxPQURuQyw4QkFFRFAsS0FBS0csVUFBTCxDQUFnQlEsRUFGZjs7QUFNQSxtQkFBT1QsV0FBUDtBQUNIO0FBL0I4QixLQUFuQzs7QUFrQ0FkLFlBQVErQixRQUFSLEdBQW1CL0IsUUFBUStCLFFBQVIsSUFBb0I7QUFDbkM3QixjQUFNLFVBRDZCO0FBRW5DQyxrQkFBVSxPQUZ5QjtBQUduQ0MscUJBQWEsR0FIc0I7QUFJbkNNLGNBSm1DLGtCQUk1QlIsSUFKNEIsRUFJdEJTLElBSnNCLEVBSWhCQyxJQUpnQixFQUlWQyxJQUpVLEVBSUo7QUFDM0IsZ0JBQUlDLGNBQWNGLEtBQUtHLFVBQUwsQ0FBZ0JpQixVQUFoQiw4RUFFTHBCLEtBQUtHLFVBQUwsQ0FBZ0JpQixVQUZYLFVBRTBCOUIsSUFGMUIsMERBR2dDQSxJQUhoQyxZQUFsQjs7QUFLQSxnQkFBSVUsS0FBS0csVUFBTCxDQUFnQmtCLGFBQWhCLENBQThCQyxNQUE5QixHQUF1QyxDQUEzQyxFQUE4QztBQUMxQ3BCO0FBR0g7O0FBRUQsbUJBQU9BLFdBQVA7QUFDSDtBQWpCa0MsS0FBdkM7O0FBb0JBZCxZQUFRbUMsS0FBUixHQUFnQm5DLFFBQVFtQyxLQUFSLElBQWlCO0FBQzdCakMsY0FBTSxPQUR1QjtBQUU3QkMsa0JBQVUsTUFGbUI7QUFHN0JDLHFCQUFhO0FBSGdCLEtBQWpDOztBQU1BSixZQUFRb0MsR0FBUixHQUFjcEMsUUFBUW9DLEdBQVIsSUFBZTtBQUN6QmxDLGNBQU0sS0FEbUI7QUFFekJDLGtCQUFVLE1BRmU7QUFHekJDLHFCQUFhLENBSFk7QUFJekJLLG1CQUFXLFNBSmM7QUFLekJDLGNBTHlCLGtCQUtsQlIsSUFMa0IsRUFLWlMsSUFMWSxFQUtOQyxJQUxNLEVBS0FDLElBTEEsRUFLTTtBQUMzQiw4REFBZ0RYLElBQWhEO0FBQ0g7QUFQd0IsS0FBN0I7O0FBVUFGLFlBQVFxQyxhQUFSLEdBQXdCckMsUUFBUXFDLGFBQVIsSUFBeUI7QUFDN0NuQyxjQUFNLGVBRHVDO0FBRTdDQyxrQkFBVSxPQUZtQztBQUc3Q0MscUJBQWEsQ0FIZ0M7QUFJN0NNLGNBSjZDLGtCQUl0Q1IsSUFKc0MsRUFJaENTLElBSmdDLEVBSTFCQyxJQUowQixFQUlwQkMsSUFKb0IsRUFJZDtBQUMzQixxQ0FBdUJELEtBQUtHLFVBQUwsQ0FBZ0JzQixhQUF2QyxVQUF5RG5DLElBQXpEO0FBQ0g7QUFONEMsS0FBakQ7O0FBU0FGLFlBQVFzQyxjQUFSLEdBQXlCdEMsUUFBUXNDLGNBQVIsSUFBMEI7QUFDL0NwQyxjQUFNLGdCQUR5QztBQUUvQ0Msa0JBQVUsT0FGcUM7QUFHL0NDLHFCQUFhLENBSGtDO0FBSS9DSyxtQkFBVyxpQkFKb0M7QUFLL0NDLGNBTCtDLGtCQUt4Q1IsSUFMd0MsRUFLbENTLElBTGtDLEVBSzVCQyxJQUw0QixFQUt0QkMsSUFMc0IsRUFLaEI7QUFDM0IsbUJBQU8sa0JBQWdCRCxLQUFLRyxVQUFMLENBQWdCdUIsY0FBaEMsVUFBbURwQyxJQUFuRCxnQkFDQVUsS0FBS0csVUFBTCxDQUFnQndCLGFBQWhCLENBQThCTCxNQUE5QixHQUNHLDJFQURILEdBQ2lGLEVBRmpGLENBQVA7QUFHSCxTQVQ4QztBQVUvQ00sbUJBVitDLHVCQVVuQ0MsRUFWbUMsRUFVL0JDLFFBVitCLEVBVXJCQyxPQVZxQixFQVVaQyxHQVZZLEVBVVBDLEdBVk8sRUFVRjtBQUN4Q0Ysb0JBQVE1QixVQUFSLENBQW1Cd0IsYUFBbkIsQ0FBaUNMLE1BQWxDLEdBQ0lkLEVBQUVxQixFQUFGLEVBQU1LLFFBQU4sQ0FBZSxRQUFmLEVBQ0s1QyxJQURMLENBQ1UsU0FEVixFQUNxQnlDLFFBQVE1QixVQUFSLENBQW1CUSxFQUR4QyxFQUVLd0IsSUFGTCxDQUVVLGFBRlYsRUFFeUIsT0FGekIsRUFHS0EsSUFITCxDQUdVLGFBSFYsRUFHeUIsNEJBSHpCLENBREosR0FLSTNCLEVBQUVxQixFQUFGLEVBQ0t2QyxJQURMLENBQ1UsU0FEVixFQUNxQnlDLFFBQVE1QixVQUFSLENBQW1CUSxFQUR4QyxFQUVLd0IsSUFGTCxDQUVVLGFBRlYsRUFFeUIsT0FGekIsRUFHS0EsSUFITCxDQUdVLGFBSFYsRUFHeUIsNEJBSHpCLENBTEo7QUFTSDtBQXBCOEMsS0FBbkQ7O0FBdUJBL0MsWUFBUWdELGNBQVIsR0FBeUJoRCxRQUFRZ0QsY0FBUixJQUEwQjtBQUMvQzlDLGNBQU0sZ0JBRHlDO0FBRS9DQyxrQkFBVSxNQUZxQztBQUcvQ0MscUJBQWEsR0FIa0M7QUFJL0NNLGNBSitDLGtCQUl4Q1IsSUFKd0MsRUFJbENTLElBSmtDLEVBSTVCQyxJQUo0QixFQUl0QkMsSUFKc0IsRUFJaEI7QUFDM0IsZ0JBQUlvQyxPQUFPLEVBQVg7O0FBRUEsZ0JBQUkvQyxJQUFKLEVBQVU7QUFDTitDLDZEQUN3Qy9DLEtBQUtnRCxXQUFMLEVBRHhDO0FBRUg7O0FBRUQsZ0JBQU1DLFFBQVF0RCxJQUFJdUQsSUFBSixDQUFTQyxJQUFULENBQWNDLFNBQWQsQ0FBd0IsK0JBQXhCLEVBQXlELGVBQXpELElBQ1IsSUFEUSxHQUNEMUMsS0FBS0csVUFBTCxDQUFnQndDLE9BRDdCOztBQUdBTixzQ0FBd0JFLEtBQXhCLFVBQWtDakQsSUFBbEM7O0FBRUEsbUJBQU8rQyxJQUFQO0FBQ0g7QUFsQjhDLEtBQW5EOztBQXFCQWpELFlBQVF3RCxJQUFSLEdBQWV4RCxRQUFRd0QsSUFBUixJQUFnQjtBQUMzQnRELGNBQU0sTUFEcUI7QUFFM0JDLGtCQUFVLE9BRmlCO0FBRzNCQyxxQkFBYSxHQUhjO0FBSTNCTSxjQUoyQixrQkFJcEJSLElBSm9CLEVBSWRTLElBSmMsRUFJUkMsSUFKUSxFQUlGQyxJQUpFLEVBSUk7QUFDM0IsbUJBQU80QyxPQUFPdkQsSUFBUCxFQUFhd0QsTUFBYixDQUFvQixrQkFBcEIsQ0FBUDtBQUNIO0FBTjBCLEtBQS9COztBQVNBMUQsWUFBUTJELE1BQVIsR0FBaUIzRCxRQUFRMkQsTUFBUixJQUFrQjtBQUMvQnpELGNBQU0sUUFEeUI7QUFFL0JDLGtCQUFVLE9BRnFCO0FBRy9CQyxxQkFBYSxDQUhrQjtBQUkvQk0sY0FKK0Isa0JBSXhCUixJQUp3QixFQUlsQlMsSUFKa0IsRUFJWkMsSUFKWSxFQUlOQyxJQUpNLEVBSUE7QUFDM0Isc0tBRTBERCxLQUFLRyxVQUFMLENBQWdCNkMsUUFGMUUsd0JBR0oxRCxJQUhJO0FBTUg7QUFYOEIsS0FBbkM7O0FBY0FGLFlBQVE2RCxXQUFSLEdBQXNCN0QsUUFBUTZELFdBQVIsSUFBdUI7QUFDekMzRCxjQUFNLGFBRG1DO0FBRXpDQyxrQkFBVSxNQUYrQjtBQUd6Q0MscUJBQWEsR0FINEI7QUFJekNLLG1CQUFXO0FBSjhCLEtBQTdDOztBQU9BVCxZQUFROEQsYUFBUixHQUF3QjlELFFBQVE4RCxhQUFSLElBQXlCO0FBQzdDNUQsY0FBTSxlQUR1QztBQUU3Q0Msa0JBQVUsTUFGbUM7QUFHN0NDLHFCQUFhLENBSGdDO0FBSTdDTSxjQUo2QyxrQkFJdENSLElBSnNDLEVBSWhDUyxJQUpnQyxFQUkxQkMsSUFKMEIsRUFJcEJDLElBSm9CLEVBSWQ7QUFDM0I7QUFDQSxnQkFBTWtELFFBQVFDLFNBQVNDLGFBQVQsQ0FBdUIsTUFBdkIsQ0FBZDs7QUFFQTtBQUNBLGdCQUFNQyxrQkFBa0IsU0FBbEJBLGVBQWtCLENBQUNKLGFBQUQsRUFBZ0JLLEtBQWhCLEVBQXVCQyxLQUF2QixFQUFpQztBQUNyRDtBQUNBLG9CQUFNQyxrQkFBbUJGLFVBQVdDLE1BQU1sQyxNQUFOLEdBQWUsQ0FBbkQ7O0FBRUE7QUFDQSxvQkFBTW9DLGFBQWE7QUFDZkMsNEJBQVEsWUFETztBQUVmL0MsNEJBQVEsU0FGTztBQUdmYiwwQkFBTSxTQUhTO0FBSWY2RCw4QkFBVTVELEtBQUtHLFVBQUwsQ0FBZ0JRLEVBSlg7QUFLZmtELG9DQUFnQlg7QUFMRCxpQkFBbkI7O0FBUUE7QUFDQSxvQkFBTVksTUFBUzdFLElBQUl1RCxJQUFKLENBQVN1QixNQUFULENBQWdCQyxHQUFoQixDQUFvQixRQUFwQixDQUFULGdDQUFpRXhELEVBQUVDLEtBQUYsQ0FBUWlELFVBQVIsQ0FBdkU7O0FBRUE7QUFDQSxvQkFBTU8sUUFBUWIsU0FBU0MsYUFBVCxDQUF1QixHQUF2QixDQUFkOztBQUVBO0FBQ0FZLHNCQUFNQyxZQUFOLENBQW1CLE1BQW5CLEVBQTJCSixHQUEzQjtBQUNBRyxzQkFBTUMsWUFBTixDQUFtQixRQUFuQixFQUE2QixRQUE3Qjs7QUFFQTtBQUNBRCxzQkFBTUUsV0FBTixHQUFvQmpCLGlCQUFpQk8sa0JBQWtCLEVBQWxCLEdBQXVCLElBQXhDLENBQXBCOztBQUVBO0FBQ0FOLHNCQUFNaUIsV0FBTixDQUFrQkgsS0FBbEI7QUFDSCxhQTVCRDs7QUE4QkE7QUFDQWQsa0JBQU1rQixTQUFOLENBQWdCQyxHQUFoQixDQUFvQixrQkFBcEIsRUFBd0MsaUJBQXhDOztBQUVBO0FBQ0F0RSxpQkFBS0csVUFBTCxDQUFnQm9FLGNBQWhCLENBQStCQyxPQUEvQixDQUF1Q2xCLGVBQXZDOztBQUVBLG1CQUFPSCxNQUFNc0IsU0FBYjtBQUNIO0FBOUM0QyxLQUFqRDs7QUFpREFyRixZQUFRc0YsT0FBUixHQUFrQnRGLFFBQVFzRixPQUFSLElBQW1CO0FBQ2pDcEYsY0FBTSxJQUQyQjtBQUVqQ0Msa0JBQVUsT0FGdUI7QUFHakNDLHFCQUFhLEdBSG9CO0FBSWpDSyxtQkFBVyxTQUpzQjtBQUtqQ0osbUJBQVcsS0FMc0I7QUFNakNDLG9CQUFZLEtBTnFCO0FBT2pDSSxjQVBpQyxrQkFPMUJSLElBUDBCLEVBT3BCUyxJQVBvQixFQU9kQyxJQVBjLEVBT1JDLElBUFEsRUFPRjtBQUMzQixnQkFBSTBFLG9CQUFvQixFQUF4Qjs7QUFFQSxnQkFBRzNFLEtBQUtHLFVBQUwsQ0FBZ0J5RSxhQUFoQixDQUE4QnRELE1BQTlCLEdBQXVDLENBQTFDLEVBQTZDO0FBQ3pDcUQ7QUFNSCxhQVBELE1BUUs7QUFDRDNFLHFCQUFLRyxVQUFMLENBQWdCeUUsYUFBaEIsQ0FBOEJKLE9BQTlCLENBQXNDLFVBQUNLLFlBQUQsRUFBa0I7QUFDcERGLGlHQUN5QkUsWUFEekIsa0NBRUg1RixJQUFJdUQsSUFBSixDQUFTQyxJQUFULENBQWNDLFNBQWQsQ0FBd0IsNkJBQXhCLEVBQXVELFFBQXZELENBRkcsU0FFaUVtQyxZQUZqRSxrTUFLVUEsWUFMVjtBQVFILGlCQVREO0FBVUg7O0FBRUQsZ0JBQU10RSxVQUFVLGdCQUFnQkMsRUFBRUMsS0FBRixDQUFRO0FBQ3BDQyxxQkFBS1YsS0FBS0csVUFBTCxDQUFnQlEsRUFEZTtBQUVwQ0Msd0JBQVEsTUFGNEI7QUFHcENDLDBCQUFVTCxFQUFFTSxPQUFGLENBQVVDLE9BQU9DLFFBQVAsQ0FBZ0JDLE1BQWhCLENBQXVCQyxLQUF2QixDQUE2QixDQUE3QixDQUFWO0FBSDBCLGFBQVIsQ0FBaEM7O0FBTUEsZ0JBQUk0RCxpQkFBaUIsQ0FBQzlFLEtBQUtHLFVBQUwsQ0FBZ0I0RSxVQUFqQiw0SEFFbEI5RixJQUFJdUQsSUFBSixDQUFTQyxJQUFULENBQWNDLFNBQWQsQ0FBd0IsNEJBQXhCLEVBQXNELFFBQXRELENBRmtCLGNBRXdELEVBRjdFOztBQUlBLHlFQUVKaUMsaUJBRkksc0JBR0pHLGNBSEksOEhBT0t2RSxPQVBMO0FBMEJIO0FBbkVnQyxLQUFyQztBQXFFSCxDQTVSRCxFQTRSR3RCLElBQUlDLElBQUosQ0FBU0MsdUJBNVJaIiwiZmlsZSI6Im9yZGVyc19vdmVydmlld19jb2x1bW5zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBvcmRlcnNfb3ZlcnZpZXdfY29sdW1ucy5qcyAyMDIyLTA4LTA0XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAyMCBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuanNlLmxpYnMub3JkZXJzX292ZXJ2aWV3X2NvbHVtbnMgPSBqc2UubGlicy5vcmRlcnNfb3ZlcnZpZXdfY29sdW1ucyB8fCB7fTtcblxuLyoqXG4gKiAjIyBPcmRlcnMgVGFibGUgQ29sdW1uIERlZmluaXRpb25zXG4gKlxuICogVGhpcyBtb2R1bGUgZGVmaW5lcyB0aGUgY29sdW1uIGRlZmluaXRpb24gb2YgdGhlIG9yZGVyIG92ZXJ2aWV3IHRhYmxlLiBUaGV5IGNhbiBiZSBvdmVycmlkZGVuIGJ5IG90aGVyXG4gKiBzY3JpcHRzIGJ5IG1vZGlmeWluZyB0aGUgYXJyYXkgd2l0aCBuZXcgY29sdW1ucywgb3IgYnkgcmVwbGFjaW5nIHRoZSBwcm9wZXJ0eSB2YWx1ZXMgb2YgdGhlIGNvbnRhaW5lZFxuICogZmllbGRzLlxuICpcbiAqIEBtb2R1bGUgQWRtaW4vTGlicy9vcmRlcnNfb3ZlcnZpZXdfY29sdW1uc1xuICogQGV4cG9ydHMganNlLmxpYnMub3JkZXJzX292ZXJ2aWV3X2NvbHVtbnNcbiAqIEByZXF1aXJlcyBtb21lbnRqc1xuICovXG4oZnVuY3Rpb24gKGV4cG9ydHMpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGV4cG9ydHMuY2hlY2tib3ggPSBleHBvcnRzLmNoZWNrYm94IHx8IHtcbiAgICAgICAgZGF0YTogbnVsbCxcbiAgICAgICAgbWluV2lkdGg6ICc1MHB4JyxcbiAgICAgICAgd2lkdGhGYWN0b3I6IDAuMDEsXG4gICAgICAgIG9yZGVyYWJsZTogZmFsc2UsXG4gICAgICAgIHNlYXJjaGFibGU6IGZhbHNlLFxuICAgICAgICBkZWZhdWx0Q29udGVudDogJzxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiAvPidcbiAgICB9O1xuXG4gICAgZXhwb3J0cy5udW1iZXIgPSBleHBvcnRzLm51bWJlciB8fCB7XG4gICAgICAgIGRhdGE6ICdudW1iZXInLFxuICAgICAgICBtaW5XaWR0aDogJzc1cHgnLFxuICAgICAgICB3aWR0aEZhY3RvcjogMSxcbiAgICAgICAgY2xhc3NOYW1lOiAnbnVtZXJpYycsXG4gICAgICAgIHJlbmRlcihkYXRhLCB0eXBlLCBmdWxsLCBtZXRhKSB7XG4gICAgICAgICAgICBsZXQgbGlua0VsZW1lbnQgPSAnJztcblxuICAgICAgICAgICAgaWYgKGZ1bGwuRFRfUm93RGF0YS5jb21tZW50ICE9PSAnJykge1xuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBkb3VibGUgcXVvdGVzIHRvIGF2b2lkIGJyb2tlbiB0b29sdGlwc1xuICAgICAgICAgICAgICAgIGxldCBlc2NhcGVkQ29tbWVudCA9IGZ1bGwuRFRfUm93RGF0YS5jb21tZW50LnJlcGxhY2UoL1wiLywgJycpO1xuXG4gICAgICAgICAgICAgICAgbGlua0VsZW1lbnQgKz0gYFxuXHRcdFx0XHRcdFx0XHRcdFx0PGkgY2xhc3M9XCJmYSBmYS1jb21tZW50LW8gdG9vbHRpcC1vcmRlci1jb21tZW50IHRvb2x0aXAtdHJpZ2dlclwiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHRpdGxlPVwiJHtlc2NhcGVkQ29tbWVudH1cIj48L2k+Jm5ic3A7XG5cdFx0XHRcdFx0XHRcdFx0YDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZWRpdFVybCA9ICdvcmRlcnMucGhwPycgKyAkLnBhcmFtKHtcbiAgICAgICAgICAgICAgICBvSUQ6IGZ1bGwuRFRfUm93RGF0YS5pZCxcbiAgICAgICAgICAgICAgICBhY3Rpb246ICdlZGl0JyxcbiAgICAgICAgICAgICAgICBvdmVydmlldzogJC5kZXBhcmFtKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc2xpY2UoMSkpXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbGlua0VsZW1lbnQgKz0gYFxuXHRcdFx0XHRcdFx0XHRcdDxhIGNsYXNzPVwidG9vbHRpcC1vcmRlci1pdGVtc1wiIGhyZWY9XCIke2VkaXRVcmx9XCI+XG5cdFx0XHRcdFx0XHRcdFx0XHQke2Z1bGwuRFRfUm93RGF0YS5pZH1cblx0XHRcdFx0XHRcdFx0XHQ8L2E+XG5cdFx0XHRcdFx0XHRcdGA7XG5cbiAgICAgICAgICAgIHJldHVybiBsaW5rRWxlbWVudDtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBleHBvcnRzLmN1c3RvbWVyID0gZXhwb3J0cy5jdXN0b21lciB8fCB7XG4gICAgICAgIGRhdGE6ICdjdXN0b21lcicsXG4gICAgICAgIG1pbldpZHRoOiAnMTkwcHgnLFxuICAgICAgICB3aWR0aEZhY3RvcjogMS41LFxuICAgICAgICByZW5kZXIoZGF0YSwgdHlwZSwgZnVsbCwgbWV0YSkge1xuICAgICAgICAgICAgbGV0IGxpbmtFbGVtZW50ID0gZnVsbC5EVF9Sb3dEYXRhLmN1c3RvbWVySWRcbiAgICAgICAgICAgICAgICA/IGA8YSBjbGFzcz1cInRvb2x0aXAtY3VzdG9tZXItYWRkcmVzc2VzXCIgXG5cdFx0XHRcdFx0XHRcdGhyZWY9XCJjdXN0b21lcnMvJHtmdWxsLkRUX1Jvd0RhdGEuY3VzdG9tZXJJZH1cIj4ke2RhdGF9PC9hPmBcbiAgICAgICAgICAgICAgICA6IGA8c3BhbiBjbGFzcz1cInRvb2x0aXAtY3VzdG9tZXItYWRkcmVzc2VzXCI+JHtkYXRhfTwvc3Bhbj5gO1xuXG4gICAgICAgICAgICBpZiAoZnVsbC5EVF9Sb3dEYXRhLmN1c3RvbWVyTWVtb3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGxpbmtFbGVtZW50ICs9XG4gICAgICAgICAgICAgICAgICAgIGAgPGkgY2xhc3M9XCJmYSBmYS1zdGlja3ktbm90ZS1vIHRvb2x0aXAtY3VzdG9tZXItbWVtb3MgdG9vbHRpcC10cmlnZ2VyXCIgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5gO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbGlua0VsZW1lbnQ7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZXhwb3J0cy5ncm91cCA9IGV4cG9ydHMuZ3JvdXAgfHwge1xuICAgICAgICBkYXRhOiAnZ3JvdXAnLFxuICAgICAgICBtaW5XaWR0aDogJzg1cHgnLFxuICAgICAgICB3aWR0aEZhY3RvcjogMS4yXG4gICAgfTtcblxuICAgIGV4cG9ydHMuc3VtID0gZXhwb3J0cy5zdW0gfHwge1xuICAgICAgICBkYXRhOiAnc3VtJyxcbiAgICAgICAgbWluV2lkdGg6ICc5MHB4JyxcbiAgICAgICAgd2lkdGhGYWN0b3I6IDEsXG4gICAgICAgIGNsYXNzTmFtZTogJ251bWVyaWMnLFxuICAgICAgICByZW5kZXIoZGF0YSwgdHlwZSwgZnVsbCwgbWV0YSkge1xuICAgICAgICAgICAgcmV0dXJuIGA8c3BhbiBjbGFzcz1cInRvb2x0aXAtb3JkZXItc3VtLWJsb2NrXCI+JHtkYXRhfTwvc3Bhbj5gO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGV4cG9ydHMucGF5bWVudE1ldGhvZCA9IGV4cG9ydHMucGF5bWVudE1ldGhvZCB8fCB7XG4gICAgICAgIGRhdGE6ICdwYXltZW50TWV0aG9kJyxcbiAgICAgICAgbWluV2lkdGg6ICcxMTBweCcsXG4gICAgICAgIHdpZHRoRmFjdG9yOiAyLFxuICAgICAgICByZW5kZXIoZGF0YSwgdHlwZSwgZnVsbCwgbWV0YSkge1xuICAgICAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7ZnVsbC5EVF9Sb3dEYXRhLnBheW1lbnRNZXRob2R9XCI+JHtkYXRhfTwvc3Bhbj5gXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZXhwb3J0cy5zaGlwcGluZ01ldGhvZCA9IGV4cG9ydHMuc2hpcHBpbmdNZXRob2QgfHwge1xuICAgICAgICBkYXRhOiAnc2hpcHBpbmdNZXRob2QnLFxuICAgICAgICBtaW5XaWR0aDogJzExMHB4JyxcbiAgICAgICAgd2lkdGhGYWN0b3I6IDIsXG4gICAgICAgIGNsYXNzTmFtZTogJ3NoaXBwaW5nLW1ldGhvZCcsXG4gICAgICAgIHJlbmRlcihkYXRhLCB0eXBlLCBmdWxsLCBtZXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gYDxzcGFuIHRpdGxlPVwiJHtmdWxsLkRUX1Jvd0RhdGEuc2hpcHBpbmdNZXRob2R9XCI+JHtkYXRhfTwvc3Bhbj5gXG4gICAgICAgICAgICAgICAgKyAoZnVsbC5EVF9Sb3dEYXRhLnRyYWNraW5nTGlua3MubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgID8gJyA8aSBjbGFzcz1cImZhIGZhLXRydWNrIGZhLWxnIHRvb2x0aXAtdHJhY2tpbmctbGlua3MgdG9vbHRpcC10cmlnZ2VyXCI+PC9pPicgOiAnJyk7XG4gICAgICAgIH0sXG4gICAgICAgIGNyZWF0ZWRDZWxsKHRkLCBjZWxsRGF0YSwgcm93RGF0YSwgcm93LCBjb2wpIHtcbiAgICAgICAgICAgIChyb3dEYXRhLkRUX1Jvd0RhdGEudHJhY2tpbmdMaW5rcy5sZW5ndGgpID9cbiAgICAgICAgICAgICAgICAkKHRkKS5jaGlsZHJlbignOmZpcnN0JylcbiAgICAgICAgICAgICAgICAgICAgLmRhdGEoJ29yZGVySWQnLCByb3dEYXRhLkRUX1Jvd0RhdGEuaWQpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCdkYXRhLXRvZ2dsZScsICdtb2RhbCcpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCdkYXRhLXRhcmdldCcsICcuYWRkLXRyYWNraW5nLW51bWJlci5tb2RhbCcpIDpcbiAgICAgICAgICAgICAgICAkKHRkKVxuICAgICAgICAgICAgICAgICAgICAuZGF0YSgnb3JkZXJJZCcsIHJvd0RhdGEuRFRfUm93RGF0YS5pZClcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2RhdGEtdG9nZ2xlJywgJ21vZGFsJylcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2RhdGEtdGFyZ2V0JywgJy5hZGQtdHJhY2tpbmctbnVtYmVyLm1vZGFsJylcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBleHBvcnRzLmNvdW50cnlJc29Db2RlID0gZXhwb3J0cy5jb3VudHJ5SXNvQ29kZSB8fCB7XG4gICAgICAgIGRhdGE6ICdjb3VudHJ5SXNvQ29kZScsXG4gICAgICAgIG1pbldpZHRoOiAnNzVweCcsXG4gICAgICAgIHdpZHRoRmFjdG9yOiAxLjQsXG4gICAgICAgIHJlbmRlcihkYXRhLCB0eXBlLCBmdWxsLCBtZXRhKSB7XG4gICAgICAgICAgICBsZXQgaHRtbCA9ICcnO1xuXG4gICAgICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIGh0bWwgPVxuICAgICAgICAgICAgICAgICAgICBgPHNwYW4gY2xhc3M9XCJmbGFnLWljb24gZmxhZy1pY29uLSR7ZGF0YS50b0xvd2VyQ2FzZSgpfVwiPjwvc3Bhbj4mbmJzcDtgO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB0aXRsZSA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdTSElQUElOR19PUklHSU5fQ09VTlRSWV9USVRMRScsICdjb25maWd1cmF0aW9uJylcbiAgICAgICAgICAgICAgICArICc6ICcgKyBmdWxsLkRUX1Jvd0RhdGEuY291bnRyeTtcblxuICAgICAgICAgICAgaHRtbCArPSBgPHNwYW4gdGl0bGU9XCIke3RpdGxlfVwiPiR7ZGF0YX08L3NwYW4+YDtcblxuICAgICAgICAgICAgcmV0dXJuIGh0bWw7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZXhwb3J0cy5kYXRlID0gZXhwb3J0cy5kYXRlIHx8IHtcbiAgICAgICAgZGF0YTogJ2RhdGUnLFxuICAgICAgICBtaW5XaWR0aDogJzEwMHB4JyxcbiAgICAgICAgd2lkdGhGYWN0b3I6IDEuNixcbiAgICAgICAgcmVuZGVyKGRhdGEsIHR5cGUsIGZ1bGwsIG1ldGEpIHtcbiAgICAgICAgICAgIHJldHVybiBtb21lbnQoZGF0YSkuZm9ybWF0KCdERC5NTS5ZWSAtIEhIOm1tJyk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZXhwb3J0cy5zdGF0dXMgPSBleHBvcnRzLnN0YXR1cyB8fCB7XG4gICAgICAgIGRhdGE6ICdzdGF0dXMnLFxuICAgICAgICBtaW5XaWR0aDogJzEyMHB4JyxcbiAgICAgICAgd2lkdGhGYWN0b3I6IDIsXG4gICAgICAgIHJlbmRlcihkYXRhLCB0eXBlLCBmdWxsLCBtZXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gYFxuXHRcdFx0XHRcdDxzcGFuIGRhdGEtdG9nZ2xlPVwibW9kYWxcIiBkYXRhLXRhcmdldD1cIi5zdGF0dXMubW9kYWxcIlxuXHRcdFx0XHRcdFx0XHRjbGFzcz1cIm9yZGVyLXN0YXR1cyB0b29sdGlwLW9yZGVyLXN0YXR1cy1oaXN0b3J5IGxhYmVsIGxhYmVsLSR7ZnVsbC5EVF9Sb3dEYXRhLnN0YXR1c0lkfVwiPlxuXHRcdFx0XHRcdFx0JHtkYXRhfVxuXHRcdFx0XHRcdDwvc3Bhbj5cblx0XHRcdFx0YDtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBleHBvcnRzLnRvdGFsV2VpZ2h0ID0gZXhwb3J0cy50b3RhbFdlaWdodCB8fCB7XG4gICAgICAgIGRhdGE6ICd0b3RhbFdlaWdodCcsXG4gICAgICAgIG1pbldpZHRoOiAnNTBweCcsXG4gICAgICAgIHdpZHRoRmFjdG9yOiAwLjYsXG4gICAgICAgIGNsYXNzTmFtZTogJ251bWVyaWMnXG4gICAgfTtcblxuICAgIGV4cG9ydHMuaW52b2ljZU51bWJlciA9IGV4cG9ydHMuaW52b2ljZU51bWJlciB8fCB7XG4gICAgICAgIGRhdGE6ICdpbnZvaWNlTnVtYmVyJyxcbiAgICAgICAgbWluV2lkdGg6ICc3NXB4JyxcbiAgICAgICAgd2lkdGhGYWN0b3I6IDEsXG4gICAgICAgIHJlbmRlcihkYXRhLCB0eXBlLCBmdWxsLCBtZXRhKSB7XG4gICAgICAgICAgICAvLyBDcmVhdGUgYSAnc3BhbicgY29udGFpbmVyIGVsZW1lbnQuXG4gICAgICAgICAgICBjb25zdCAkaHRtbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcblxuICAgICAgICAgICAgLy8gSXRlcmF0b3IgZnVuY3Rpb24gdG8gYWRkIGEgbGluayBlbGVtZW50IGludG8gY29udGFpbmVyLlxuICAgICAgICAgICAgY29uc3QgX2FkZExpbmtFbGVtZW50ID0gKGludm9pY2VOdW1iZXIsIGluZGV4LCBhcnJheSkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIElzIHRoZSBjdXJyZW50IGl0ZXJhdGlvbiB0aGUgbGFzdCBvbmU/XG4gICAgICAgICAgICAgICAgY29uc3QgaXNMYXN0SXRlcmF0aW9uID0gKGluZGV4ID09PSAoYXJyYXkubGVuZ3RoIC0gMSkpO1xuXG4gICAgICAgICAgICAgICAgLy8gSW52b2ljZSBsaW5rIHBhcmFtZXRlcnMuXG4gICAgICAgICAgICAgICAgY29uc3QgcGFyYW1ldGVycyA9IHtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlOiAnT3JkZXJBZG1pbicsXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjogJ3Nob3dQZGYnLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW52b2ljZScsXG4gICAgICAgICAgICAgICAgICAgIG9yZGVyX2lkOiBmdWxsLkRUX1Jvd0RhdGEuaWQsXG4gICAgICAgICAgICAgICAgICAgIGludm9pY2VfbnVtYmVyOiBpbnZvaWNlTnVtYmVyXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIC8vIENvbXBvdW5kIGludm9pY2UgbGluay5cbiAgICAgICAgICAgICAgICBjb25zdCB1cmwgPSBgJHtqc2UuY29yZS5jb25maWcuZ2V0KCdhcHBVcmwnKX0vYWRtaW4vcmVxdWVzdF9wb3J0LnBocD8keyQucGFyYW0ocGFyYW1ldGVycyl9YDtcblxuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBsaW5rIGVsZW1lbnQuXG4gICAgICAgICAgICAgICAgY29uc3QgJGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG5cbiAgICAgICAgICAgICAgICAvLyBTZXQgbGluayBvbiBlbGVtZW50LlxuICAgICAgICAgICAgICAgICRsaW5rLnNldEF0dHJpYnV0ZSgnaHJlZicsIHVybCk7XG4gICAgICAgICAgICAgICAgJGxpbmsuc2V0QXR0cmlidXRlKCd0YXJnZXQnLCAnX2JsYW5rJyk7XG5cbiAgICAgICAgICAgICAgICAvLyBTZXQgaW52b2ljZSBudW1iZXIgYXMgdGV4dCBvbiBlbGVtZW50LlxuICAgICAgICAgICAgICAgICRsaW5rLnRleHRDb250ZW50ID0gaW52b2ljZU51bWJlciArIChpc0xhc3RJdGVyYXRpb24gPyAnJyA6ICcsICcpO1xuXG4gICAgICAgICAgICAgICAgLy8gQXBwZW5kIGVsZW1lbnQgdG8gY29udGFpbmVyLlxuICAgICAgICAgICAgICAgICRodG1sLmFwcGVuZENoaWxkKCRsaW5rKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIEFkZCB0b29sdGlwIGNsYXNzZXMgdG8gZWxlbWVudC5cbiAgICAgICAgICAgICRodG1sLmNsYXNzTGlzdC5hZGQoJ3Rvb2x0aXAtaW52b2ljZXMnLCAndG9vbHRpcC10cmlnZ2VyJyk7XG5cbiAgICAgICAgICAgIC8vIEl0ZXJhdGUgb3ZlciBlYWNoIGludm9pY2UgbnVtYmVyIGFuZCBjcmVhdGUgbGluay5cbiAgICAgICAgICAgIGZ1bGwuRFRfUm93RGF0YS5pbnZvaWNlTnVtYmVycy5mb3JFYWNoKF9hZGRMaW5rRWxlbWVudCk7XG5cbiAgICAgICAgICAgIHJldHVybiAkaHRtbC5vdXRlckhUTUw7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZXhwb3J0cy5hY3Rpb25zID0gZXhwb3J0cy5hY3Rpb25zIHx8IHtcbiAgICAgICAgZGF0YTogbnVsbCxcbiAgICAgICAgbWluV2lkdGg6ICczNTBweCcsXG4gICAgICAgIHdpZHRoRmFjdG9yOiA0LjYsXG4gICAgICAgIGNsYXNzTmFtZTogJ2FjdGlvbnMnLFxuICAgICAgICBvcmRlcmFibGU6IGZhbHNlLFxuICAgICAgICBzZWFyY2hhYmxlOiBmYWxzZSxcbiAgICAgICAgcmVuZGVyKGRhdGEsIHR5cGUsIGZ1bGwsIG1ldGEpIHtcbiAgICAgICAgICAgIGxldCB3aXRoZHJhd2FsSWRzSHRtbCA9ICcnO1xuICAgIFxuICAgICAgICAgICAgaWYoZnVsbC5EVF9Sb3dEYXRhLndpdGhkcmF3YWxJZHMubGVuZ3RoID4gMikge1xuICAgICAgICAgICAgICAgIHdpdGhkcmF3YWxJZHNIdG1sICs9YFxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRvb2x0aXAtb3JkZXItd2l0aGRyYXdhbHNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiaHRtbC9hc3NldHMvaW1hZ2VzL2xlZ2FjeS9pY29ucy93aXRoZHJhd2FsLW9uLnBuZ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJ0b29sdGlwLW9yZGVyLXdpdGhkcmF3YWxzIHRvb2x0aXAtdHJpZ2dlciBtZXRhLWljb25cIiAvPlxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGZ1bGwuRFRfUm93RGF0YS53aXRoZHJhd2FsSWRzLmZvckVhY2goKHdpdGhkcmF3YWxJZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB3aXRoZHJhd2FsSWRzSHRtbCArPSBgXG5cdFx0XHRcdFx0XHQ8YSBocmVmPVwiYWRtaW4ucGhwP2RvPVdpdGhkcmF3YWxzJmlkPSR7d2l0aGRyYXdhbElkfVwiXG5cdFx0XHRcdFx0XHRcdFx0dGl0bGU9XCIke2pzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdUQUJMRV9IRUFESU5HX1dJVEhEUkFXQUxfSUQnLCAnb3JkZXJzJyl9ICR7d2l0aGRyYXdhbElkfVwiPlxuXHRcdFx0XHRcdFx0XHQ8aW1nIHNyYz1cImh0bWwvYXNzZXRzL2ltYWdlcy9sZWdhY3kvaWNvbnMvd2l0aGRyYXdhbC1vbi5wbmdcIlxuXHRcdFx0XHRcdFx0XHRcdGNsYXNzPVwidG9vbHRpcC13aXRoZHJhd2FsIHRvb2x0aXAtdHJpZ2dlciBtZXRhLWljb25cIlxuXHRcdFx0XHRcdFx0XHRcdGRhdGEtd2l0aGRyYXdhbC1pZD1cIiR7d2l0aGRyYXdhbElkfVwiIC8+XG5cdFx0XHRcdFx0XHQ8L2E+XG5cdFx0XHRcdFx0YDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZWRpdFVybCA9ICdvcmRlcnMucGhwPycgKyAkLnBhcmFtKHtcbiAgICAgICAgICAgICAgICBvSUQ6IGZ1bGwuRFRfUm93RGF0YS5pZCxcbiAgICAgICAgICAgICAgICBhY3Rpb246ICdlZGl0JyxcbiAgICAgICAgICAgICAgICBvdmVydmlldzogJC5kZXBhcmFtKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc2xpY2UoMSkpXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbGV0IG1haWxTdGF0dXNIdG1sID0gIWZ1bGwuRFRfUm93RGF0YS5tYWlsU3RhdHVzXG4gICAgICAgICAgICAgICAgPyBgPGkgY2xhc3M9XCJmYSBmYS1lbnZlbG9wZS1vIG1ldGEtaWNvbiB0b29sdGlwLWNvbmZpcm1hdGlvbi1ub3Qtc2VudCBlbWFpbC1vcmRlciB0b29sdGlwLXRyaWdnZXJcIlxuXHRcdFx0XHRcdFx0dGl0bGU9XCIke2pzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdURVhUX0NPTkZJUk1BVElPTl9OT1RfU0VOVCcsICdvcmRlcnMnKX1cIj48L2k+YCA6ICcnO1xuXG4gICAgICAgICAgICByZXR1cm4gYFxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwdWxsLWxlZnRcIj5cblx0XHRcdFx0XHRcdCR7d2l0aGRyYXdhbElkc0h0bWx9XG5cdFx0XHRcdFx0XHQke21haWxTdGF0dXNIdG1sfVxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwdWxsLXJpZ2h0IGFjdGlvbi1saXN0IHZpc2libGUtb24taG92ZXJcIj5cblx0XHRcdFx0XHRcdDxhIGhyZWY9XCIke2VkaXRVcmx9XCI+XG5cdFx0XHRcdFx0XHRcdDxpIGNsYXNzPVwiZmEgZmEtZXllIGVkaXRcIj48L2k+XG5cdFx0XHRcdFx0XHQ8L2E+XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJidG4tZ3JvdXAgZHJvcGRvd25cIj5cblx0XHRcdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcblx0XHRcdFx0XHRcdFx0XHRcdGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCI+PC9idXR0b24+XG5cdFx0XHRcdFx0XHRcdDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG5cdFx0XHRcdFx0XHRcdFx0XHRjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBkcm9wZG93bi10b2dnbGVcIlxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS10b2dnbGU9XCJkcm9wZG93blwiXG5cdFx0XHRcdFx0XHRcdFx0XHRhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiXG5cdFx0XHRcdFx0XHRcdFx0XHRhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIj5cblx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cImNhcmV0XCI+PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwic3Itb25seVwiPlRvZ2dsZSBEcm9wZG93bjwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdFx0XHRcdDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnUgZHJvcGRvd24tbWVudS1yaWdodFwiPjwvdWw+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0YDtcbiAgICAgICAgfVxuICAgIH07XG59KShqc2UubGlicy5vcmRlcnNfb3ZlcnZpZXdfY29sdW1ucyk7IFxuIl19
