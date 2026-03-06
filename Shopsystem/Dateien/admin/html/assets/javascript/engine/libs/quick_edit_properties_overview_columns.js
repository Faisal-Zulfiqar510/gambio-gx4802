'use strict';

/* --------------------------------------------------------------
 quick_edit_properties_overview_columns.js 2022-10-20
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2022 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

jse.libs.quick_edit_properties_overview_columns = jse.libs.quick_edit_properties_overview_columns || {};

(function (exports) {

    'use strict';

    exports.checkbox = exports.checkbox || {
        data: null,
        minWidth: '50px',
        widthFactor: 0.01,
        orderable: false,
        searchable: false,
        render: function render() {
            return '<input type="checkbox" class="properties-row-selection" />';
        }
    };

    exports.productsName = exports.productsName || {
        data: 'productsName',
        minWidth: '150px',
        widthFactor: 1.6
    };

    exports.combiName = exports.combiName || {
        data: 'combiName',
        minWidth: '150px',
        widthFactor: 1.6
    };

    exports.combiModel = exports.combiModel || {
        data: 'combiModel',
        minWidth: '120px',
        widthFactor: 1,
        className: 'editable'
    };

    exports.combiQuantity = exports.combiQuantity || {
        data: 'combiQuantity',
        minWidth: '90px',
        widthFactor: 1,
        className: 'numeric editable'
    };

    exports.combiPrice = exports.combiPrice || {
        data: 'combiPrice',
        minWidth: '90px',
        widthFactor: 1,
        className: 'numeric combi-price',
        render: function render(data, type, full, meta) {
            var html = '<div class="col-lg-12">\n\t\t\t\t\t\t\t\t<label class="control-label">' + full.combiName + '</label>\n\t\t\t\t\t\t\t\t<p data-properties-price-type="' + full.combiPriceType + '" \n\t\t\t\t\t\t\t\t   class="form-control-static values_price">\n\t\t\t\t\t\t\t\t\t\t' + full.combiPrice.values_price + '\n\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t </div>';

            return '<div class="container">\n\t\t\t\t\t\t\t<div class="row">\n\t\t\t\t\t\t\t\t<div class="form-horizontal">\n\t\t\t\t\t\t\t\t\t<div class="form-group">' + html + '</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>';
        }
    };

    exports.combiPriceType = exports.combiPriceType || {
        data: 'combiPriceType',
        minWidth: '120px',
        widthFactor: 1.1,
        render: function render(data, type, full, meta) {
            var html = '';
            var options = full.option.priceType;

            options.forEach(function (option) {
                html += '<option value="' + option.id + '" ' + (full.combiPriceType == option.id ? 'selected' : '') + '>\n\t\t\t\t\t\t\t' + option.value + '\n\t\t\t\t\t\t</option>';
            });

            return '<select class="form-control select-properties-price-type">' + html + '</select>';
        }
    };

    exports.combiEan = exports.combiEan || {
        data: 'combiEan',
        minWidth: '90px',
        widthFactor: 1,
        className: 'editable'
    };

    exports.combiWeight = exports.combiWeight || {
        data: 'combiWeight',
        minWidth: '90px',
        widthFactor: 1,
        className: 'numeric editable'
    };

    exports.combiShippingStatusName = exports.combiShippingStatusName || {
        data: 'combiShippingTimeId',
        minWidth: '120px',
        widthFactor: 1.1,
        render: function render(data, type, full, meta) {
            var html = '';
            var options = full.option.shipment;

            options.forEach(function (option) {
                var optionValue = String(option.value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
                html += '<option value="' + option.id + '" ' + (full.combiShippingTimeId == option.id ? 'selected' : '') + '>\n\t\t\t\t\t\t\t' + optionValue + '\n\t\t\t\t\t\t</option>';
            });

            return '<select class="form-control select-properties-shipping-time">' + html + '</select>';
        }
    };

    exports.actions = exports.actions || {
        data: null,
        minWidth: '400px',
        widthFactor: 3.2,
        className: 'actions',
        orderable: false,
        searchable: false,
        render: function render(data, type, full, meta) {
            return '\t\t\t\t\t\n\t\t\t\t\t<div class="pull-left"></div>\n\t\t\t\t\t<div class="pull-right action-list visible-on-hover">\n\t\t\t\t\t\t\n\t\t\t\t\t\t<div class="btn-group dropdown">\n\t\t\t\t\t\t\t<button type="button"\n\t\t\t\t\t\t\t\t\tclass="btn btn-default"></button>\n\t\t\t\t\t\t\t<button type="button"\n\t\t\t\t\t\t\t\t\tclass="btn btn-default dropdown-toggle"\n\t\t\t\t\t\t\t\t\tdata-toggle="dropdown"\n\t\t\t\t\t\t\t\t\taria-haspopup="true"\n\t\t\t\t\t\t\t\t\taria-expanded="false">\n\t\t\t\t\t\t\t\t<span class="caret"></span>\n\t\t\t\t\t\t\t\t<span class="sr-only">Toggle Dropdown</span>\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t<ul class="dropdown-menu dropdown-menu-right"></ul>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t';
        }
    };
})(jse.libs.quick_edit_properties_overview_columns);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1aWNrX2VkaXRfcHJvcGVydGllc19vdmVydmlld19jb2x1bW5zLmpzIl0sIm5hbWVzIjpbImpzZSIsImxpYnMiLCJxdWlja19lZGl0X3Byb3BlcnRpZXNfb3ZlcnZpZXdfY29sdW1ucyIsImV4cG9ydHMiLCJjaGVja2JveCIsImRhdGEiLCJtaW5XaWR0aCIsIndpZHRoRmFjdG9yIiwib3JkZXJhYmxlIiwic2VhcmNoYWJsZSIsInJlbmRlciIsInByb2R1Y3RzTmFtZSIsImNvbWJpTmFtZSIsImNvbWJpTW9kZWwiLCJjbGFzc05hbWUiLCJjb21iaVF1YW50aXR5IiwiY29tYmlQcmljZSIsInR5cGUiLCJmdWxsIiwibWV0YSIsImh0bWwiLCJjb21iaVByaWNlVHlwZSIsInZhbHVlc19wcmljZSIsIm9wdGlvbnMiLCJvcHRpb24iLCJwcmljZVR5cGUiLCJmb3JFYWNoIiwiaWQiLCJ2YWx1ZSIsImNvbWJpRWFuIiwiY29tYmlXZWlnaHQiLCJjb21iaVNoaXBwaW5nU3RhdHVzTmFtZSIsInNoaXBtZW50Iiwib3B0aW9uVmFsdWUiLCJTdHJpbmciLCJyZXBsYWNlIiwiY29tYmlTaGlwcGluZ1RpbWVJZCIsImFjdGlvbnMiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQUEsSUFBSUMsSUFBSixDQUFTQyxzQ0FBVCxHQUFrREYsSUFBSUMsSUFBSixDQUFTQyxzQ0FBVCxJQUFtRCxFQUFyRzs7QUFFQSxDQUFDLFVBQVVDLE9BQVYsRUFBbUI7O0FBRWhCOztBQUVBQSxZQUFRQyxRQUFSLEdBQW1CRCxRQUFRQyxRQUFSLElBQW9CO0FBQ25DQyxjQUFNLElBRDZCO0FBRW5DQyxrQkFBVSxNQUZ5QjtBQUduQ0MscUJBQWEsSUFIc0I7QUFJbkNDLG1CQUFXLEtBSndCO0FBS25DQyxvQkFBWSxLQUx1QjtBQU1uQ0MsY0FObUMsb0JBTTFCO0FBQ0w7QUFDSDtBQVJrQyxLQUF2Qzs7QUFXQVAsWUFBUVEsWUFBUixHQUF1QlIsUUFBUVEsWUFBUixJQUF3QjtBQUMz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QUhELEVBSWJBLE9BSmEsQ0FJTCxJQUpLLEVBSUMsUUFKRCxFQUtiQSxPQUxhLENBS0wsSUFMSyxFQUtDLFFBTEQsQ0FBbEI7QUFNQWYsNENBQTBCSSxPQUFPRyxFQUFqQyxXQUF3Q1QsS0FBS2tCLG1CQUFMLElBQTRCWixPQUFPRyxFQUFuQyxHQUF3QyxVQUF4QyxHQUFxRCxFQUE3RiwwQkFDUE0sV0FETztBQUdILGFBVkQ7O0FBWUEscUZBQXVFYixJQUF2RTtBQUNIO0FBckJnRSxLQUFyRTs7QUF5QkFqQixZQUFRa0MsT0FBUixHQUFrQmxDLFFBQVFrQyxPQUFSLElBQW1CO0FBQ2pDaEMsY0FBTSxJQUQyQjtBQUVqQ0Msa0JBQVUsT0FGdUI7QUFHakNDLHFCQUFhLEdBSG9CO0FBSWpDTyxtQkFBVyxTQUpzQjtBQUtqQ04sbUJBQVcsS0FMc0I7QUFNakNDLG9CQUFZLEtBTnFCO0FBT2pDQyxjQVBpQyxrQkFPMUJMLElBUDBCLEVBT3BCWSxJQVBvQixFQU9kQyxJQVBjLEVBT1JDLElBUFEsRUFPRjtBQUMzQjtBQW1CSDtBQTNCZ0MsS0FBckM7QUE2QkgsQ0F4SkQsRUF3SkduQixJQUFJQyxJQUFKLENBQVNDLHNDQXhKWiIsImZpbGUiOiJxdWlja19lZGl0X3Byb3BlcnRpZXNfb3ZlcnZpZXdfY29sdW1ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gcXVpY2tfZWRpdF9wcm9wZXJ0aWVzX292ZXJ2aWV3X2NvbHVtbnMuanMgMjAyMi0xMC0yMFxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMjIgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmpzZS5saWJzLnF1aWNrX2VkaXRfcHJvcGVydGllc19vdmVydmlld19jb2x1bW5zID0ganNlLmxpYnMucXVpY2tfZWRpdF9wcm9wZXJ0aWVzX292ZXJ2aWV3X2NvbHVtbnMgfHwge307XG5cbihmdW5jdGlvbiAoZXhwb3J0cykge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgZXhwb3J0cy5jaGVja2JveCA9IGV4cG9ydHMuY2hlY2tib3ggfHwge1xuICAgICAgICBkYXRhOiBudWxsLFxuICAgICAgICBtaW5XaWR0aDogJzUwcHgnLFxuICAgICAgICB3aWR0aEZhY3RvcjogMC4wMSxcbiAgICAgICAgb3JkZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgc2VhcmNoYWJsZTogZmFsc2UsXG4gICAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiBgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwicHJvcGVydGllcy1yb3ctc2VsZWN0aW9uXCIgLz5gXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZXhwb3J0cy5wcm9kdWN0c05hbWUgPSBleHBvcnRzLnByb2R1Y3RzTmFtZSB8fCB7XG4gICAgICAgIGRhdGE6ICdwcm9kdWN0c05hbWUnLFxuICAgICAgICBtaW5XaWR0aDogJzE1MHB4JyxcbiAgICAgICAgd2lkdGhGYWN0b3I6IDEuNlxuICAgIH07XG5cbiAgICBleHBvcnRzLmNvbWJpTmFtZSA9IGV4cG9ydHMuY29tYmlOYW1lIHx8IHtcbiAgICAgICAgZGF0YTogJ2NvbWJpTmFtZScsXG4gICAgICAgIG1pbldpZHRoOiAnMTUwcHgnLFxuICAgICAgICB3aWR0aEZhY3RvcjogMS42LFxuICAgIH07XG5cbiAgICBleHBvcnRzLmNvbWJpTW9kZWwgPSBleHBvcnRzLmNvbWJpTW9kZWwgfHwge1xuICAgICAgICBkYXRhOiAnY29tYmlNb2RlbCcsXG4gICAgICAgIG1pbldpZHRoOiAnMTIwcHgnLFxuICAgICAgICB3aWR0aEZhY3RvcjogMSxcbiAgICAgICAgY2xhc3NOYW1lOiAnZWRpdGFibGUnXG4gICAgfTtcblxuICAgIGV4cG9ydHMuY29tYmlRdWFudGl0eSA9IGV4cG9ydHMuY29tYmlRdWFudGl0eSB8fCB7XG4gICAgICAgIGRhdGE6ICdjb21iaVF1YW50aXR5JyxcbiAgICAgICAgbWluV2lkdGg6ICc5MHB4JyxcbiAgICAgICAgd2lkdGhGYWN0b3I6IDEsXG4gICAgICAgIGNsYXNzTmFtZTogJ251bWVyaWMgZWRpdGFibGUnXG4gICAgfTtcblxuICAgIGV4cG9ydHMuY29tYmlQcmljZSA9IGV4cG9ydHMuY29tYmlQcmljZSB8fCB7XG4gICAgICAgIGRhdGE6ICdjb21iaVByaWNlJyxcbiAgICAgICAgbWluV2lkdGg6ICc5MHB4JyxcbiAgICAgICAgd2lkdGhGYWN0b3I6IDEsXG4gICAgICAgIGNsYXNzTmFtZTogJ251bWVyaWMgY29tYmktcHJpY2UnLFxuICAgICAgICByZW5kZXIoZGF0YSwgdHlwZSwgZnVsbCwgbWV0YSkge1xuICAgICAgICAgICAgbGV0IGh0bWwgPSBgPGRpdiBjbGFzcz1cImNvbC1sZy0xMlwiPlxuXHRcdFx0XHRcdFx0XHRcdDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWxcIj4ke2Z1bGwuY29tYmlOYW1lfTwvbGFiZWw+XG5cdFx0XHRcdFx0XHRcdFx0PHAgZGF0YS1wcm9wZXJ0aWVzLXByaWNlLXR5cGU9XCIke2Z1bGwuY29tYmlQcmljZVR5cGV9XCIgXG5cdFx0XHRcdFx0XHRcdFx0ICAgY2xhc3M9XCJmb3JtLWNvbnRyb2wtc3RhdGljIHZhbHVlc19wcmljZVwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQke2Z1bGwuY29tYmlQcmljZS52YWx1ZXNfcHJpY2V9XG5cdFx0XHRcdFx0XHRcdFx0PC9wPlxuXHRcdFx0XHRcdFx0XHQgPC9kaXY+YDtcblxuXG4gICAgICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInJvd1wiPlxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJmb3JtLWhvcml6b250YWxcIj5cblx0XHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+JHtodG1sfTwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PmA7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZXhwb3J0cy5jb21iaVByaWNlVHlwZSA9IGV4cG9ydHMuY29tYmlQcmljZVR5cGUgfHwge1xuICAgICAgICBkYXRhOiAnY29tYmlQcmljZVR5cGUnLFxuICAgICAgICBtaW5XaWR0aDogJzEyMHB4JyxcbiAgICAgICAgd2lkdGhGYWN0b3I6IDEuMSxcbiAgICAgICAgcmVuZGVyKGRhdGEsIHR5cGUsIGZ1bGwsIG1ldGEpIHtcbiAgICAgICAgICAgIGxldCBodG1sID0gJyc7XG4gICAgICAgICAgICBjb25zdCBvcHRpb25zID0gZnVsbC5vcHRpb24ucHJpY2VUeXBlO1xuXG4gICAgICAgICAgICBvcHRpb25zLmZvckVhY2gob3B0aW9uID0+IHtcbiAgICAgICAgICAgICAgICBodG1sICs9IGA8b3B0aW9uIHZhbHVlPVwiJHtvcHRpb24uaWR9XCIgJHtmdWxsLmNvbWJpUHJpY2VUeXBlID09IG9wdGlvbi5pZCA/ICdzZWxlY3RlZCcgOiAnJ30+XG5cdFx0XHRcdFx0XHRcdCR7b3B0aW9uLnZhbHVlfVxuXHRcdFx0XHRcdFx0PC9vcHRpb24+YDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gYDxzZWxlY3QgY2xhc3M9XCJmb3JtLWNvbnRyb2wgc2VsZWN0LXByb3BlcnRpZXMtcHJpY2UtdHlwZVwiPiR7aHRtbH08L3NlbGVjdD5gO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGV4cG9ydHMuY29tYmlFYW4gPSBleHBvcnRzLmNvbWJpRWFuIHx8IHtcbiAgICAgICAgZGF0YTogJ2NvbWJpRWFuJyxcbiAgICAgICAgbWluV2lkdGg6ICc5MHB4JyxcbiAgICAgICAgd2lkdGhGYWN0b3I6IDEsXG4gICAgICAgIGNsYXNzTmFtZTogJ2VkaXRhYmxlJ1xuICAgIH07XG5cbiAgICBleHBvcnRzLmNvbWJpV2VpZ2h0ID0gZXhwb3J0cy5jb21iaVdlaWdodCB8fCB7XG4gICAgICAgIGRhdGE6ICdjb21iaVdlaWdodCcsXG4gICAgICAgIG1pbldpZHRoOiAnOTBweCcsXG4gICAgICAgIHdpZHRoRmFjdG9yOiAxLFxuICAgICAgICBjbGFzc05hbWU6ICdudW1lcmljIGVkaXRhYmxlJ1xuICAgIH07XG5cbiAgICBleHBvcnRzLmNvbWJpU2hpcHBpbmdTdGF0dXNOYW1lID0gZXhwb3J0cy5jb21iaVNoaXBwaW5nU3RhdHVzTmFtZSB8fCB7XG4gICAgICAgIGRhdGE6ICdjb21iaVNoaXBwaW5nVGltZUlkJyxcbiAgICAgICAgbWluV2lkdGg6ICcxMjBweCcsXG4gICAgICAgIHdpZHRoRmFjdG9yOiAxLjEsXG4gICAgICAgIHJlbmRlcihkYXRhLCB0eXBlLCBmdWxsLCBtZXRhKSB7XG4gICAgICAgICAgICBsZXQgaHRtbCA9ICcnO1xuICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IGZ1bGwub3B0aW9uLnNoaXBtZW50O1xuXG4gICAgICAgICAgICBvcHRpb25zLmZvckVhY2gob3B0aW9uID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgb3B0aW9uVmFsdWUgPSBTdHJpbmcob3B0aW9uLnZhbHVlKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJi9nLCBcIiZhbXA7XCIpXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC88L2csIFwiJmx0O1wiKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvPi9nLCBcIiZndDtcIilcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1wiL2csIFwiJnF1b3Q7XCIpXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8nL2csIFwiJiMwMzk7XCIpO1xuICAgICAgICAgICAgICAgIGh0bWwgKz0gYDxvcHRpb24gdmFsdWU9XCIke29wdGlvbi5pZH1cIiAke2Z1bGwuY29tYmlTaGlwcGluZ1RpbWVJZCA9PSBvcHRpb24uaWQgPyAnc2VsZWN0ZWQnIDogJyd9PlxuXHRcdFx0XHRcdFx0XHQke29wdGlvblZhbHVlfVxuXHRcdFx0XHRcdFx0PC9vcHRpb24+YDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gYDxzZWxlY3QgY2xhc3M9XCJmb3JtLWNvbnRyb2wgc2VsZWN0LXByb3BlcnRpZXMtc2hpcHBpbmctdGltZVwiPiR7aHRtbH08L3NlbGVjdD5gO1xuICAgICAgICB9XG4gICAgfTtcblxuXG4gICAgZXhwb3J0cy5hY3Rpb25zID0gZXhwb3J0cy5hY3Rpb25zIHx8IHtcbiAgICAgICAgZGF0YTogbnVsbCxcbiAgICAgICAgbWluV2lkdGg6ICc0MDBweCcsXG4gICAgICAgIHdpZHRoRmFjdG9yOiAzLjIsXG4gICAgICAgIGNsYXNzTmFtZTogJ2FjdGlvbnMnLFxuICAgICAgICBvcmRlcmFibGU6IGZhbHNlLFxuICAgICAgICBzZWFyY2hhYmxlOiBmYWxzZSxcbiAgICAgICAgcmVuZGVyKGRhdGEsIHR5cGUsIGZ1bGwsIG1ldGEpIHtcbiAgICAgICAgICAgIHJldHVybiBgXHRcdFx0XHRcdFxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwdWxsLWxlZnRcIj48L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicHVsbC1yaWdodCBhY3Rpb24tbGlzdCB2aXNpYmxlLW9uLWhvdmVyXCI+XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJidG4tZ3JvdXAgZHJvcGRvd25cIj5cblx0XHRcdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcblx0XHRcdFx0XHRcdFx0XHRcdGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCI+PC9idXR0b24+XG5cdFx0XHRcdFx0XHRcdDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG5cdFx0XHRcdFx0XHRcdFx0XHRjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBkcm9wZG93bi10b2dnbGVcIlxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS10b2dnbGU9XCJkcm9wZG93blwiXG5cdFx0XHRcdFx0XHRcdFx0XHRhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiXG5cdFx0XHRcdFx0XHRcdFx0XHRhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIj5cblx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cImNhcmV0XCI+PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwic3Itb25seVwiPlRvZ2dsZSBEcm9wZG93bjwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdFx0XHRcdDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnUgZHJvcGRvd24tbWVudS1yaWdodFwiPjwvdWw+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0YDtcbiAgICAgICAgfVxuICAgIH07XG59KShqc2UubGlicy5xdWlja19lZGl0X3Byb3BlcnRpZXNfb3ZlcnZpZXdfY29sdW1ucyk7Il19
