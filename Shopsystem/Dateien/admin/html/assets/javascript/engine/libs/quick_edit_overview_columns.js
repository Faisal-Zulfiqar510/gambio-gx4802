'use strict';

/* --------------------------------------------------------------
 quick_edit_overview_columns.js 2022-10-20
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2022 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

jse.libs.quick_edit_overview_columns = jse.libs.quick_edit_overview_columns || {};

(function (exports) {

    'use strict';

    var escapeHtml = function escapeHtml(text) {
        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };

        return text.replace(/[&<>"']/g, function (m) {
            return map[m];
        });
    };

    exports.checkbox = exports.checkbox || {
        data: null,
        minWidth: '50px',
        widthFactor: 0.01,
        orderable: false,
        searchable: false,
        render: function render() {
            return '<input type="checkbox" class="overview-row-selection" />';
        }
    };

    exports.id = exports.id || {
        data: 'id',
        minWidth: '65px',
        widthFactor: 0.6
    };

    exports.category = exports.category || {
        data: 'category',
        minWidth: '150px',
        widthFactor: 1.5,
        render: function render(data) {
            return escapeHtml(data);
        }
    };

    exports.name = exports.name || {
        data: 'name',
        minWidth: '190px',
        widthFactor: 1.5,
        className: 'editable',
        render: function render(data) {
            return escapeHtml(data);
        }
    };

    exports.model = exports.model || {
        data: 'model',
        minWidth: '90px',
        widthFactor: 1.2,
        className: 'editable',
        render: function render(data) {
            return escapeHtml(data);
        }
    };

    exports.manufacturer = exports.manufacturer || {
        data: 'manufacturer',
        minWidth: '150px',
        widthFactor: 1.5,
        className: 'editable manufacturer'
    };

    exports.quantity = exports.quantity || {
        data: 'quantity',
        minWidth: '75px',
        widthFactor: 1,
        className: 'numeric editable'
    };

    exports.price = exports.price || {
        data: 'price',
        minWidth: '85px',
        widthFactor: 1.2,
        className: 'numeric editable product-price'
    };

    exports.discount = exports.discount || {
        data: 'discount',
        minWidth: '75px',
        widthFactor: 1,
        className: 'numeric editable'
    };

    exports.specialPrice = exports.specialPrice || {
        data: 'specialPrice',
        minWidth: '85px',
        widthFactor: 1.2,
        className: 'numeric editable tooltip-products-special-price'
    };

    exports.tax = exports.tax || {
        data: 'tax',
        minWidth: '85px',
        widthFactor: 1.2,
        render: function render(data, type, full, meta) {
            var html = '';
            var options = full.DT_RowData.option.tax;

            options.forEach(function (option) {
                html += '<option value="' + option.id + '" ' + (full.taxClassId == option.id ? 'selected' : '') + '>\n\t\t\t\t\t\t\t' + option.value + '\n\t\t\t\t\t\t</option>';
            });

            return '<select class="form-control select-tax">' + html + '</select>';
        }
    };

    exports.shippingStatusName = exports.shippingStatusName || {
        data: 'shippingStatusName',
        minWidth: '100px',
        widthFactor: 1.2,
        render: function render(data, type, full, meta) {
            var html = '';
            var options = full.DT_RowData.option.shipment;

            options.forEach(function (option) {
                var optionValue = String(option.value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
                html += '<option value="' + option.id + '" ' + (full.shippingTimeId == option.id ? 'selected' : '') + '>\n\t\t\t\t\t\t\t' + optionValue + '\n\t\t\t\t\t\t</option>';
            });

            return '<select class="form-control select-shipping-time">' + html + '</select>';
        }
    };

    exports.weight = exports.weight || {
        data: 'weight',
        minWidth: '75px',
        widthFactor: 1.2,
        className: 'numeric editable'
    };

    exports.shippingCosts = exports.shippingCosts || {
        data: 'shippingCosts',
        minWidth: '85px',
        widthFactor: 1.2,
        className: 'numeric editable'
    };

    exports.status = exports.status || {
        data: 'status',
        minWidth: '85px',
        widthFactor: 1.2,
        className: 'status',
        searchable: false,
        render: function render(data) {
            return '<input type="checkbox" ' + (data ? "checked" : "") + ' class="convert-to-switcher" />';
        }
    };

    exports.actions = exports.actions || {
        data: null,
        minWidth: '450px',
        widthFactor: 5.2,
        className: 'actions',
        orderable: false,
        searchable: false,
        render: function render(data, type, full, meta) {
            return '\t\t\t\t\t\n\t\t\t\t\t<div class="pull-left"></div>\n\t\t\t\t\t<div class="pull-right action-list visible-on-hover">\n\t\t\t\t\t\t<i class="fa fa-pencil row-edit"></i>\n\t\t\t\t\t\t<i class="fa fa-eye show-product"></i>\n\t\t\t\t\t\n\t\t\t\t\t\t<div class="btn-group dropdown">\n\t\t\t\t\t\t\t<button type="button"\n\t\t\t\t\t\t\t\t\tclass="btn btn-default"></button>\n\t\t\t\t\t\t\t<button type="button"\n\t\t\t\t\t\t\t\t\tclass="btn btn-default dropdown-toggle"\n\t\t\t\t\t\t\t\t\tdata-toggle="dropdown"\n\t\t\t\t\t\t\t\t\taria-haspopup="true"\n\t\t\t\t\t\t\t\t\taria-expanded="false">\n\t\t\t\t\t\t\t\t<span class="caret"></span>\n\t\t\t\t\t\t\t\t<span class="sr-only">Toggle Dropdown</span>\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t<ul class="dropdown-menu dropdown-menu-right"></ul>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t';
        }
    };
})(jse.libs.quick_edit_overview_columns);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1aWNrX2VkaXRfb3ZlcnZpZXdfY29sdW1ucy5qcyJdLCJuYW1lcyI6WyJqc2UiLCJsaWJzIiwicXVpY2tfZWRpdF9vdmVydmlld19jb2x1bW5zIiwiZXhwb3J0cyIsImVzY2FwZUh0bWwiLCJ0ZXh0IiwibWFwIiwicmVwbGFjZSIsIm0iLCJjaGVja2JveCIsImRhdGEiLCJtaW5XaWR0aCIsIndpZHRoRmFjdG9yIiwib3JkZXJhYmxlIiwic2VhcmNoYWJsZSIsInJlbmRlciIsImlkIiwiY2F0ZWdvcnkiLCJuYW1lIiwiY2xhc3NOYW1lIiwibW9kZWwiLCJtYW51ZmFjdHVyZXIiLCJxdWFudGl0eSIsInByaWNlIiwiZGlzY291bnQiLCJzcGVjaWFsUHJpY2UiLCJ0YXgiLCJ0eXBlIiwiZnVsbCIsIm1ldGEiLCJodG1sIiwib3B0aW9ucyIsIkRUX1Jvd0RhdGEiLCJvcHRpb24iLCJmb3JFYWNoIiwidGF4Q2xhc3NJZCIsInZhbHVlIiwic2hpcHBpbmdTdGF0dXNOYW1lIiwic2hpcG1lbnQiLCJvcHRpb25WYWx1ZSIsIlN0cmluZyIsInNoaXBwaW5nVGltZUlkIiwid2VpZ2h0Iiwic2hpcHBpbmdDb3N0cyIsInN0YXR1cyIsImFjdGlvbnMiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQUEsSUFBSUMsSUFBSixDQUFTQywyQkFBVCxHQUF1Q0YsSUFBSUMsSUFBSixDQUFTQywyQkFBVCxJQUF3QyxFQUEvRTs7QUFFQSxDQUFDLFVBQVVDLE9BQVYsRUFBbUI7O0FBRWhCOztBQUVBLFFBQU1DLGFBQWEsU0FBU0EsVUFBVCxDQUFvQkMsSUFBcEIsRUFBMEI7QUFDekMsWUFBTUMsTUFBTTtBQUNSLGlCQUFLLE9BREc7QUFFUixpQkFBSyxNQUZHO0FBR1IsaUJBQUssTUFIRztBQUlSLGlCQUFLLFFBSkc7QUFLUixpQkFBSztBQUxHLFNBQVo7O0FBUUEsZUFBT0QsS0FBS0UsT0FBTCxDQUFhLFVBQWIsRUFBeUIsVUFBU0MsQ0FBVCxFQUFZO0FBQUUsbUJB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L0JPLG1CQUFXO0FBSm9CLEtBQW5DOztBQU9BaEIsWUFBUXdDLGFBQVIsR0FBd0J4QyxRQUFRd0MsYUFBUixJQUF5QjtBQUM3Q2pDLGNBQU0sZUFEdUM7QUFFN0NDLGtCQUFVLE1BRm1DO0FBRzdDQyxxQkFBYSxHQUhnQztBQUk3Q08sbUJBQVc7QUFKa0MsS0FBakQ7O0FBT0FoQixZQUFReUMsTUFBUixHQUFpQnpDLFFBQVF5QyxNQUFSLElBQWtCO0FBQy9CbEMsY0FBTSxRQUR5QjtBQUUvQkMsa0JBQVUsTUFGcUI7QUFHL0JDLHFCQUFhLEdBSGtCO0FBSS9CTyxtQkFBVyxRQUpvQjtBQUsvQkwsb0JBQVksS0FMbUI7QUFNL0JDLGNBTitCLGtCQU14QkwsSUFOd0IsRUFNbEI7QUFDVCxnREFBa0NBLE9BQU8sU0FBUCxHQUFtQixFQUFyRDtBQUNIO0FBUjhCLEtBQW5DOztBQVdBUCxZQUFRMEMsT0FBUixHQUFrQjFDLFFBQVEwQyxPQUFSLElBQW1CO0FBQ2pDbkMsY0FBTSxJQUQyQjtBQUVqQ0Msa0JBQVUsT0FGdUI7QUFHakNDLHFCQUFhLEdBSG9CO0FBSWpDTyxtQkFBVyxTQUpzQjtBQUtqQ04sbUJBQVcsS0FMc0I7QUFNakNDLG9CQUFZLEtBTnFCO0FBT2pDQyxjQVBpQyxrQkFPMUJMLElBUDBCLEVBT3BCaUIsSUFQb0IsRUFPZEMsSUFQYyxFQU9SQyxJQVBRLEVBT0Y7QUFDM0I7QUFxQkg7QUE3QmdDLEtBQXJDO0FBK0JILENBbk1ELEVBbU1HN0IsSUFBSUMsSUFBSixDQUFTQywyQkFuTVoiLCJmaWxlIjoicXVpY2tfZWRpdF9vdmVydmlld19jb2x1bW5zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBxdWlja19lZGl0X292ZXJ2aWV3X2NvbHVtbnMuanMgMjAyMi0xMC0yMFxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMjIgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmpzZS5saWJzLnF1aWNrX2VkaXRfb3ZlcnZpZXdfY29sdW1ucyA9IGpzZS5saWJzLnF1aWNrX2VkaXRfb3ZlcnZpZXdfY29sdW1ucyB8fCB7fTtcblxuKGZ1bmN0aW9uIChleHBvcnRzKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG4gICAgXG4gICAgY29uc3QgZXNjYXBlSHRtbCA9IGZ1bmN0aW9uIGVzY2FwZUh0bWwodGV4dCkge1xuICAgICAgICBjb25zdCBtYXAgPSB7XG4gICAgICAgICAgICAnJic6ICcmYW1wOycsXG4gICAgICAgICAgICAnPCc6ICcmbHQ7JyxcbiAgICAgICAgICAgICc+JzogJyZndDsnLFxuICAgICAgICAgICAgJ1wiJzogJyZxdW90OycsXG4gICAgICAgICAgICBcIidcIjogJyYjMDM5OydcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1smPD5cIiddL2csIGZ1bmN0aW9uKG0pIHsgcmV0dXJuIG1hcFttXTsgfSk7XG4gICAgfVxuXG4gICAgZXhwb3J0cy5jaGVja2JveCA9IGV4cG9ydHMuY2hlY2tib3ggfHwge1xuICAgICAgICBkYXRhOiBudWxsLFxuICAgICAgICBtaW5XaWR0aDogJzUwcHgnLFxuICAgICAgICB3aWR0aEZhY3RvcjogMC4wMSxcbiAgICAgICAgb3JkZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgc2VhcmNoYWJsZTogZmFsc2UsXG4gICAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiBgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwib3ZlcnZpZXctcm93LXNlbGVjdGlvblwiIC8+YFxuICAgICAgICB9XG4gICAgfTtcblxuICAgIGV4cG9ydHMuaWQgPSBleHBvcnRzLmlkIHx8IHtcbiAgICAgICAgZGF0YTogJ2lkJyxcbiAgICAgICAgbWluV2lkdGg6ICc2NXB4JyxcbiAgICAgICAgd2lkdGhGYWN0b3I6IDAuNixcbiAgICB9O1xuXG4gICAgZXhwb3J0cy5jYXRlZ29yeSA9IGV4cG9ydHMuY2F0ZWdvcnkgfHwge1xuICAgICAgICBkYXRhOiAnY2F0ZWdvcnknLFxuICAgICAgICBtaW5XaWR0aDogJzE1MHB4JyxcbiAgICAgICAgd2lkdGhGYWN0b3I6IDEuNSxcbiAgICAgICAgcmVuZGVyKGRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiBlc2NhcGVIdG1sKGRhdGEpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGV4cG9ydHMubmFtZSA9IGV4cG9ydHMubmFtZSB8fCB7XG4gICAgICAgIGRhdGE6ICduYW1lJyxcbiAgICAgICAgbWluV2lkdGg6ICcxOTBweCcsXG4gICAgICAgIHdpZHRoRmFjdG9yOiAxLjUsXG4gICAgICAgIGNsYXNzTmFtZTogJ2VkaXRhYmxlJyxcbiAgICAgICAgcmVuZGVyKGRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiBlc2NhcGVIdG1sKGRhdGEpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGV4cG9ydHMubW9kZWwgPSBleHBvcnRzLm1vZGVsIHx8IHtcbiAgICAgICAgZGF0YTogJ21vZGVsJyxcbiAgICAgICAgbWluV2lkdGg6ICc5MHB4JyxcbiAgICAgICAgd2lkdGhGYWN0b3I6IDEuMixcbiAgICAgICAgY2xhc3NOYW1lOiAnZWRpdGFibGUnLFxuICAgICAgICByZW5kZXIoZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIGVzY2FwZUh0bWwoZGF0YSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZXhwb3J0cy5tYW51ZmFjdHVyZXIgPSBleHBvcnRzLm1hbnVmYWN0dXJlciB8fCB7XG4gICAgICAgIGRhdGE6ICdtYW51ZmFjdHVyZXInLFxuICAgICAgICBtaW5XaWR0aDogJzE1MHB4JyxcbiAgICAgICAgd2lkdGhGYWN0b3I6IDEuNSxcbiAgICAgICAgY2xhc3NOYW1lOiAnZWRpdGFibGUgbWFudWZhY3R1cmVyJ1xuICAgIH07XG5cbiAgICBleHBvcnRzLnF1YW50aXR5ID0gZXhwb3J0cy5xdWFudGl0eSB8fCB7XG4gICAgICAgIGRhdGE6ICdxdWFudGl0eScsXG4gICAgICAgIG1pbldpZHRoOiAnNzVweCcsXG4gICAgICAgIHdpZHRoRmFjdG9yOiAxLFxuICAgICAgICBjbGFzc05hbWU6ICdudW1lcmljIGVkaXRhYmxlJ1xuICAgIH07XG5cbiAgICBleHBvcnRzLnByaWNlID0gZXhwb3J0cy5wcmljZSB8fCB7XG4gICAgICAgIGRhdGE6ICdwcmljZScsXG4gICAgICAgIG1pbldpZHRoOiAnODVweCcsXG4gICAgICAgIHdpZHRoRmFjdG9yOiAxLjIsXG4gICAgICAgIGNsYXNzTmFtZTogJ251bWVyaWMgZWRpdGFibGUgcHJvZHVjdC1wcmljZSdcbiAgICB9O1xuXG4gICAgZXhwb3J0cy5kaXNjb3VudCA9IGV4cG9ydHMuZGlzY291bnQgfHwge1xuICAgICAgICBkYXRhOiAnZGlzY291bnQnLFxuICAgICAgICBtaW5XaWR0aDogJzc1cHgnLFxuICAgICAgICB3aWR0aEZhY3RvcjogMSxcbiAgICAgICAgY2xhc3NOYW1lOiAnbnVtZXJpYyBlZGl0YWJsZSdcbiAgICB9O1xuXG4gICAgZXhwb3J0cy5zcGVjaWFsUHJpY2UgPSBleHBvcnRzLnNwZWNpYWxQcmljZSB8fCB7XG4gICAgICAgIGRhdGE6ICdzcGVjaWFsUHJpY2UnLFxuICAgICAgICBtaW5XaWR0aDogJzg1cHgnLFxuICAgICAgICB3aWR0aEZhY3RvcjogMS4yLFxuICAgICAgICBjbGFzc05hbWU6ICdudW1lcmljIGVkaXRhYmxlIHRvb2x0aXAtcHJvZHVjdHMtc3BlY2lhbC1wcmljZSdcbiAgICB9O1xuXG4gICAgZXhwb3J0cy50YXggPSBleHBvcnRzLnRheCB8fCB7XG4gICAgICAgIGRhdGE6ICd0YXgnLFxuICAgICAgICBtaW5XaWR0aDogJzg1cHgnLFxuICAgICAgICB3aWR0aEZhY3RvcjogMS4yLFxuICAgICAgICByZW5kZXIoZGF0YSwgdHlwZSwgZnVsbCwgbWV0YSkge1xuICAgICAgICAgICAgbGV0IGh0bWwgPSAnJztcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSBmdWxsLkRUX1Jvd0RhdGEub3B0aW9uLnRheDtcblxuICAgICAgICAgICAgb3B0aW9ucy5mb3JFYWNoKG9wdGlvbiA9PiB7XG4gICAgICAgICAgICAgICAgaHRtbCArPSBgPG9wdGlvbiB2YWx1ZT1cIiR7b3B0aW9uLmlkfVwiICR7ZnVsbC50YXhDbGFzc0lkID09IG9wdGlvbi5pZCA/ICdzZWxlY3RlZCcgOiAnJ30+XG5cdFx0XHRcdFx0XHRcdCR7b3B0aW9uLnZhbHVlfVxuXHRcdFx0XHRcdFx0PC9vcHRpb24+YDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gYDxzZWxlY3QgY2xhc3M9XCJmb3JtLWNvbnRyb2wgc2VsZWN0LXRheFwiPiR7aHRtbH08L3NlbGVjdD5gO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGV4cG9ydHMuc2hpcHBpbmdTdGF0dXNOYW1lID0gZXhwb3J0cy5zaGlwcGluZ1N0YXR1c05hbWUgfHwge1xuICAgICAgICBkYXRhOiAnc2hpcHBpbmdTdGF0dXNOYW1lJyxcbiAgICAgICAgbWluV2lkdGg6ICcxMDBweCcsXG4gICAgICAgIHdpZHRoRmFjdG9yOiAxLjIsXG4gICAgICAgIHJlbmRlcihkYXRhLCB0eXBlLCBmdWxsLCBtZXRhKSB7XG4gICAgICAgICAgICBsZXQgaHRtbCA9ICcnO1xuICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IGZ1bGwuRFRfUm93RGF0YS5vcHRpb24uc2hpcG1lbnQ7XG5cbiAgICAgICAgICAgIG9wdGlvbnMuZm9yRWFjaChvcHRpb24gPT4ge1xuICAgICAgICAgICAgICAgIGxldCBvcHRpb25WYWx1ZSA9IFN0cmluZyhvcHRpb24udmFsdWUpXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8mL2csIFwiJmFtcDtcIilcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLzwvZywgXCImbHQ7XCIpXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8+L2csIFwiJmd0O1wiKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXCIvZywgXCImcXVvdDtcIilcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLycvZywgXCImIzAzOTtcIik7XG4gICAgICAgICAgICAgICAgaHRtbCArPSBgPG9wdGlvbiB2YWx1ZT1cIiR7b3B0aW9uLmlkfVwiICR7ZnVsbC5zaGlwcGluZ1RpbWVJZCA9PSBvcHRpb24uaWQgPyAnc2VsZWN0ZWQnIDogJyd9PlxuXHRcdFx0XHRcdFx0XHQke29wdGlvblZhbHVlfVxuXHRcdFx0XHRcdFx0PC9vcHRpb24+YDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gYDxzZWxlY3QgY2xhc3M9XCJmb3JtLWNvbnRyb2wgc2VsZWN0LXNoaXBwaW5nLXRpbWVcIj4ke2h0bWx9PC9zZWxlY3Q+YDtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBleHBvcnRzLndlaWdodCA9IGV4cG9ydHMud2VpZ2h0IHx8IHtcbiAgICAgICAgZGF0YTogJ3dlaWdodCcsXG4gICAgICAgIG1pbldpZHRoOiAnNzVweCcsXG4gICAgICAgIHdpZHRoRmFjdG9yOiAxLjIsXG4gICAgICAgIGNsYXNzTmFtZTogJ251bWVyaWMgZWRpdGFibGUnXG4gICAgfTtcblxuICAgIGV4cG9ydHMuc2hpcHBpbmdDb3N0cyA9IGV4cG9ydHMuc2hpcHBpbmdDb3N0cyB8fCB7XG4gICAgICAgIGRhdGE6ICdzaGlwcGluZ0Nvc3RzJyxcbiAgICAgICAgbWluV2lkdGg6ICc4NXB4JyxcbiAgICAgICAgd2lkdGhGYWN0b3I6IDEuMixcbiAgICAgICAgY2xhc3NOYW1lOiAnbnVtZXJpYyBlZGl0YWJsZSdcbiAgICB9O1xuXG4gICAgZXhwb3J0cy5zdGF0dXMgPSBleHBvcnRzLnN0YXR1cyB8fCB7XG4gICAgICAgIGRhdGE6ICdzdGF0dXMnLFxuICAgICAgICBtaW5XaWR0aDogJzg1cHgnLFxuICAgICAgICB3aWR0aEZhY3RvcjogMS4yLFxuICAgICAgICBjbGFzc05hbWU6ICdzdGF0dXMnLFxuICAgICAgICBzZWFyY2hhYmxlOiBmYWxzZSxcbiAgICAgICAgcmVuZGVyKGRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiBgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiICR7KGRhdGEgPyBcImNoZWNrZWRcIiA6IFwiXCIpfSBjbGFzcz1cImNvbnZlcnQtdG8tc3dpdGNoZXJcIiAvPmBcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBleHBvcnRzLmFjdGlvbnMgPSBleHBvcnRzLmFjdGlvbnMgfHwge1xuICAgICAgICBkYXRhOiBudWxsLFxuICAgICAgICBtaW5XaWR0aDogJzQ1MHB4JyxcbiAgICAgICAgd2lkdGhGYWN0b3I6IDUuMixcbiAgICAgICAgY2xhc3NOYW1lOiAnYWN0aW9ucycsXG4gICAgICAgIG9yZGVyYWJsZTogZmFsc2UsXG4gICAgICAgIHNlYXJjaGFibGU6IGZhbHNlLFxuICAgICAgICByZW5kZXIoZGF0YSwgdHlwZSwgZnVsbCwgbWV0YSkge1xuICAgICAgICAgICAgcmV0dXJuIGBcdFx0XHRcdFx0XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInB1bGwtbGVmdFwiPjwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwdWxsLXJpZ2h0IGFjdGlvbi1saXN0IHZpc2libGUtb24taG92ZXJcIj5cblx0XHRcdFx0XHRcdDxpIGNsYXNzPVwiZmEgZmEtcGVuY2lsIHJvdy1lZGl0XCI+PC9pPlxuXHRcdFx0XHRcdFx0PGkgY2xhc3M9XCJmYSBmYS1leWUgc2hvdy1wcm9kdWN0XCI+PC9pPlxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImJ0bi1ncm91cCBkcm9wZG93blwiPlxuXHRcdFx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJidXR0b25cIlxuXHRcdFx0XHRcdFx0XHRcdFx0Y2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIj48L2J1dHRvbj5cblx0XHRcdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcblx0XHRcdFx0XHRcdFx0XHRcdGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGRyb3Bkb3duLXRvZ2dsZVwiXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCJcblx0XHRcdFx0XHRcdFx0XHRcdGFyaWEtaGFzcG9wdXA9XCJ0cnVlXCJcblx0XHRcdFx0XHRcdFx0XHRcdGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiPlxuXHRcdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwiY2FyZXRcIj48L3NwYW4+XG5cdFx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJzci1vbmx5XCI+VG9nZ2xlIERyb3Bkb3duPC9zcGFuPlxuXHRcdFx0XHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdFx0XHRcdFx0PHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudSBkcm9wZG93bi1tZW51LXJpZ2h0XCI+PC91bD5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRgO1xuICAgICAgICB9XG4gICAgfTtcbn0pKGpzZS5saWJzLnF1aWNrX2VkaXRfb3ZlcnZpZXdfY29sdW1ucyk7ICJdfQ==
