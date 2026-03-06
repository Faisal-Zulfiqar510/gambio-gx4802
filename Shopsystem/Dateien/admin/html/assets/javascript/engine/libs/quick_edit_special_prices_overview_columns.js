'use strict';

/* --------------------------------------------------------------
 quick_edit_special_prices_overview_columns.js 2016-09-29
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

jse.libs.quick_edit_special_prices_overview_columns = jse.libs.quick_edit_special_prices_overview_columns || {};

(function (exports) {

    'use strict';

    exports.checkbox = exports.checkbox || {
        data: null,
        minWidth: '50px',
        widthFactor: 0.01,
        orderable: false,
        searchable: false,
        render: function render() {
            return '<input type="checkbox" class="special-price-row-selection" />';
        }
    };

    exports.productsName = exports.productsName || {
        data: 'productsName',
        minWidth: '160px',
        widthFactor: 1.6
    };

    exports.productsModel = exports.productsModel || {
        data: 'productsModel',
        minWidth: '140px',
        widthFactor: 1.3
    };

    exports.productsPrice = exports.productsPrice || {
        data: 'productsPrice',
        minWidth: '100px',
        widthFactor: 1,
        className: 'numeric'
    };

    exports.specialPrice = exports.specialPrice || {
        data: 'specialPrice',
        minWidth: '110px',
        widthFactor: 1,
        className: 'numeric editable'
    };

    exports.specialPriceQuantity = exports.specialPriceQuantity || {
        data: 'specialPriceQuantity',
        minWidth: '90px',
        widthFactor: 1,
        className: 'numeric editable'
    };

    exports.specialPriceExpiresDate = exports.specialPriceExpiresDate || {
        data: 'specialPriceExpiresDate',
        minWidth: '110px',
        widthFactor: 1.1,
        className: 'numeric editable date'
    };

    exports.specialPriceStatus = exports.specialPriceStatus || {
        data: 'specialPriceStatus',
        minWidth: '90px',
        widthFactor: 1.2,
        className: 'status',
        searchable: false,
        render: function render(data) {
            return '<input type="checkbox" ' + (data ? 'checked' : '') + ' class="convert-to-switcher" />';
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
            return '\t\t\t\t\t\n\t\t\t\t\t<div class="pull-left"></div>\n\t\t\t\t\t<div class="pull-right action-list visible-on-hover">\n\t\t\t\t\t\t<div class="btn-group dropdown">\n\t\t\t\t\t\t\t<button type="button"\n\t\t\t\t\t\t\t\t\tclass="btn btn-default"></button>\n\t\t\t\t\t\t\t<button type="button"\n\t\t\t\t\t\t\t\t\tclass="btn btn-default dropdown-toggle"\n\t\t\t\t\t\t\t\t\tdata-toggle="dropdown"\n\t\t\t\t\t\t\t\t\taria-haspopup="true"\n\t\t\t\t\t\t\t\t\taria-expanded="false">\n\t\t\t\t\t\t\t\t<span class="caret"></span>\n\t\t\t\t\t\t\t\t<span class="sr-only">Toggle Dropdown</span>\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t<ul class="dropdown-menu dropdown-menu-right"></ul>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t';
        }
    };
})(jse.libs.quick_edit_special_prices_overview_columns);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1aWNrX2VkaXRfc3BlY2lhbF9wcmljZXNfb3ZlcnZpZXdfY29sdW1ucy5qcyJdLCJuYW1lcyI6WyJqc2UiLCJsaWJzIiwicXVpY2tfZWRpdF9zcGVjaWFsX3ByaWNlc19vdmVydmlld19jb2x1bW5zIiwiZXhwb3J0cyIsImNoZWNrYm94IiwiZGF0YSIsIm1pbldpZHRoIiwid2lkdGhGYWN0b3IiLCJvcmRlcmFibGUiLCJzZWFyY2hhYmxlIiwicmVuZGVyIiwicHJvZHVjdHNOYW1lIiwicHJvZHVjdHNNb2RlbCIsInByb2R1Y3RzUHJpY2UiLCJjbGFzc05hbWUiLCJzcGVjaWFsUHJpY2UiLCJzcGVjaWFsUHJpY2VRdWFudGl0eSIsInNwZWNpYWxQcmljZUV4cGlyZXNEYXRlIiwic3BlY2lhbFByaWNlU3RhdHVzIiwiYWN0aW9ucyIsInR5cGUiLCJmdWxsIiwibWV0YSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBQSxJQUFJQyxJQUFKLENBQVNDLDBDQUFULEdBQXNERixJQUFJQyxJQUFKLENBQVNDLDBDQUFULElBQXVELEVBQTdHOztBQUVBLENBQUMsVUFBVUMsT0FBVixFQUFtQjs7QUFFaEI7O0FBRUFBLFlBQVFDLFFBQVIsR0FBbUJELFFBQVFDLFFBQVIsSUFBb0I7QUFDbkNDLGNBQU0sSUFENkI7QUFFbkNDLGtCQUFVLE1BRnlCO0FBR25DQyxxQkFBYSxJQUhzQjtBQUluQ0MsbUJBQVcsS0FKd0I7QUFLbkNDLG9CQUFZLEtBTHVCO0FBTW5DQyxjQU5tQyxvQkFNMUI7QUFDTDtBQUNIO0FBUmtDLEtBQXZDOztBQVdBUCxZQUFRUSxZQUFSLEdBQXVCUixRQUFRUSxZQUFSLElBQXdCO0FBQzNDTixjQUFNLGNBRHFDO0FBRTNDQyxrQkFBVSxPQUZpQztBQUczQ0MscUJBQWE7QUFIOEIsS0FBL0M7O0FBTUFKLFlBQVFTLGFBQVIsR0FBd0JULFFBQVFTLGFBQVIsSUFBeUI7QUFDN0NQLGNBQU0sZUFEdUM7QUFFN0NDLGtCQUFVLE9BRm1DO0FBRzdDQyxxQkFBYTtBQUhnQyxLQUFqRDs7QUFNQUosWUFBUVUsYUFBUixHQUF3QlYsUUFBUVUsYUFBUixJQUF5QjtBQUM3Q1IsY0FBTSxlQUR1QztBQUU3Q0Msa0JBQVUsT0FGbUM7QUFHN0NDLHFCQUFhLENBSGdDO0FBSTdDTyxtQkFBVztBQUprQyxLQUFqRDs7QUFPQVgsWUFBUVksWUFBUixHQUF1QlosUUFBUVksWUFBUixJQUF3QjtBQUMzQ1YsY0FBTSxjQURxQztBQUUzQ0Msa0JBQVUsT0FGaUM7QUFHM0NDLHFCQUFhLENBSDhCO0FBSTNDTyxtQkFBVztBQUpnQyxLQUEvQzs7QUFPQVgsWUFBUWEsb0JBQVIsR0FBK0JiLFFBQVFhLG9CQUFSLElBQWdDO0FBQzNEWCxjQUFNLHNCQURxRDtBQUUzREMsa0JBQVUsTUFGaUQ7QUFHM0RDLHFCQUFhLENBSDhDO0FBSTNETyxtQkFBVztBQUpnRCxLQUEvRDs7QUFPQVgsWUFBUWMsdUJBQVIsR0FBa0NkLFFBQVFjLHVCQUFSLElBQW1DO0FBQ2pFWixjQUFNLHlCQUQyRDtBQUVqRUMsa0JBQVUsT0FGdUQ7QUFHakVDLHFCQUFhLEdBSG9EO0FBSWpFTyxtQkFBVztBQUpzRCxLQUFyRTs7QUFPQVgsWUFBUWUsa0JBQVIsR0FBNkJmLFFBQVFlLGtCQUFSLElBQThCO0FBQ3ZEYixjQUFNLG9CQURpRDtBQUV2REMsa0JBQVUsTUFGNkM7QUFHdkRDLHFCQUFhLEdBSDBDO0FBSXZETyxtQkFBVyxRQUo0QztBQUt2REwsb0JBQVksS0FMMkM7QUFNdkRDLGNBTnVELGtCQU1oREwsSUFOZ0QsRUFNMUM7QUFDVCxnREFBaUNBLE9BQU8sU0FBUCxHQUFtQixFQUFwRDtBQUNIO0FBUnNELEtBQTNEOztBQVdBRixZQUFRZ0IsT0FBUixHQUFrQmhCLFFBQVFnQixPQUFSLElBQW1CO0FBQ2pDZCxjQUFNLElBRDJCO0FBRWpDQyxrQkFBVSxPQUZ1QjtBQUdqQ0MscUJBQWEsR0FIb0I7QUFJakNPLG1CQUFXLFNBSnNCO0FBS2pDTixtQkFBVyxLQUxzQjtBQU1qQ0Msb0JBQVksS0FOcUI7QUFPakNDLGNBUGlDLGtCQU8xQkwsSUFQMEIsRUFPcEJlLElBUG9CLEVBT2RDLElBUGMsRUFPUkMsSUFQUSxFQU9GO0FBQzNCO0FBa0JIO0FBMUJnQyxLQUFyQztBQTZCSCxDQS9GRCxFQStGR3RCLElBQUlDLElBQUosQ0FBU0MsMENBL0ZaIiwiZmlsZSI6InF1aWNrX2VkaXRfc3BlY2lhbF9wcmljZXNfb3ZlcnZpZXdfY29sdW1ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gcXVpY2tfZWRpdF9zcGVjaWFsX3ByaWNlc19vdmVydmlld19jb2x1bW5zLmpzIDIwMTYtMDktMjlcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5qc2UubGlicy5xdWlja19lZGl0X3NwZWNpYWxfcHJpY2VzX292ZXJ2aWV3X2NvbHVtbnMgPSBqc2UubGlicy5xdWlja19lZGl0X3NwZWNpYWxfcHJpY2VzX292ZXJ2aWV3X2NvbHVtbnMgfHwge307XG5cbihmdW5jdGlvbiAoZXhwb3J0cykge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgZXhwb3J0cy5jaGVja2JveCA9IGV4cG9ydHMuY2hlY2tib3ggfHwge1xuICAgICAgICBkYXRhOiBudWxsLFxuICAgICAgICBtaW5XaWR0aDogJzUwcHgnLFxuICAgICAgICB3aWR0aEZhY3RvcjogMC4wMSxcbiAgICAgICAgb3JkZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgc2VhcmNoYWJsZTogZmFsc2UsXG4gICAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiBgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwic3BlY2lhbC1wcmljZS1yb3ctc2VsZWN0aW9uXCIgLz5gXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZXhwb3J0cy5wcm9kdWN0c05hbWUgPSBleHBvcnRzLnByb2R1Y3RzTmFtZSB8fCB7XG4gICAgICAgIGRhdGE6ICdwcm9kdWN0c05hbWUnLFxuICAgICAgICBtaW5XaWR0aDogJzE2MHB4JyxcbiAgICAgICAgd2lkdGhGYWN0b3I6IDEuNlxuICAgIH07XG5cbiAgICBleHBvcnRzLnByb2R1Y3RzTW9kZWwgPSBleHBvcnRzLnByb2R1Y3RzTW9kZWwgfHwge1xuICAgICAgICBkYXRhOiAncHJvZHVjdHNNb2RlbCcsXG4gICAgICAgIG1pbldpZHRoOiAnMTQwcHgnLFxuICAgICAgICB3aWR0aEZhY3RvcjogMS4zLFxuICAgIH07XG5cbiAgICBleHBvcnRzLnByb2R1Y3RzUHJpY2UgPSBleHBvcnRzLnByb2R1Y3RzUHJpY2UgfHwge1xuICAgICAgICBkYXRhOiAncHJvZHVjdHNQcmljZScsXG4gICAgICAgIG1pbldpZHRoOiAnMTAwcHgnLFxuICAgICAgICB3aWR0aEZhY3RvcjogMSxcbiAgICAgICAgY2xhc3NOYW1lOiAnbnVtZXJpYydcbiAgICB9O1xuXG4gICAgZXhwb3J0cy5zcGVjaWFsUHJpY2UgPSBleHBvcnRzLnNwZWNpYWxQcmljZSB8fCB7XG4gICAgICAgIGRhdGE6ICdzcGVjaWFsUHJpY2UnLFxuICAgICAgICBtaW5XaWR0aDogJzExMHB4JyxcbiAgICAgICAgd2lkdGhGYWN0b3I6IDEsXG4gICAgICAgIGNsYXNzTmFtZTogJ251bWVyaWMgZWRpdGFibGUnXG4gICAgfTtcblxuICAgIGV4cG9ydHMuc3BlY2lhbFByaWNlUXVhbnRpdHkgPSBleHBvcnRzLnNwZWNpYWxQcmljZVF1YW50aXR5IHx8IHtcbiAgICAgICAgZGF0YTogJ3NwZWNpYWxQcmljZVF1YW50aXR5JyxcbiAgICAgICAgbWluV2lkdGg6ICc5MHB4JyxcbiAgICAgICAgd2lkdGhGYWN0b3I6IDEsXG4gICAgICAgIGNsYXNzTmFtZTogJ251bWVyaWMgZWRpdGFibGUnLFxuICAgIH07XG5cbiAgICBleHBvcnRzLnNwZWNpYWxQcmljZUV4cGlyZXNEYXRlID0gZXhwb3J0cy5zcGVjaWFsUHJpY2VFeHBpcmVzRGF0ZSB8fCB7XG4gICAgICAgIGRhdGE6ICdzcGVjaWFsUHJpY2VFeHBpcmVzRGF0ZScsXG4gICAgICAgIG1pbldpZHRoOiAnMTEwcHgnLFxuICAgICAgICB3aWR0aEZhY3RvcjogMS4xLFxuICAgICAgICBjbGFzc05hbWU6ICdudW1lcmljIGVkaXRhYmxlIGRhdGUnXG4gICAgfTtcblxuICAgIGV4cG9ydHMuc3BlY2lhbFByaWNlU3RhdHVzID0gZXhwb3J0cy5zcGVjaWFsUHJpY2VTdGF0dXMgfHwge1xuICAgICAgICBkYXRhOiAnc3BlY2lhbFByaWNlU3RhdHVzJyxcbiAgICAgICAgbWluV2lkdGg6ICc5MHB4JyxcbiAgICAgICAgd2lkdGhGYWN0b3I6IDEuMixcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RhdHVzJyxcbiAgICAgICAgc2VhcmNoYWJsZTogZmFsc2UsXG4gICAgICAgIHJlbmRlcihkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gYDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiAke2RhdGEgPyAnY2hlY2tlZCcgOiAnJ30gY2xhc3M9XCJjb252ZXJ0LXRvLXN3aXRjaGVyXCIgLz5gXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZXhwb3J0cy5hY3Rpb25zID0gZXhwb3J0cy5hY3Rpb25zIHx8IHtcbiAgICAgICAgZGF0YTogbnVsbCxcbiAgICAgICAgbWluV2lkdGg6ICc0MDBweCcsXG4gICAgICAgIHdpZHRoRmFjdG9yOiAzLjIsXG4gICAgICAgIGNsYXNzTmFtZTogJ2FjdGlvbnMnLFxuICAgICAgICBvcmRlcmFibGU6IGZhbHNlLFxuICAgICAgICBzZWFyY2hhYmxlOiBmYWxzZSxcbiAgICAgICAgcmVuZGVyKGRhdGEsIHR5cGUsIGZ1bGwsIG1ldGEpIHtcbiAgICAgICAgICAgIHJldHVybiBgXHRcdFx0XHRcdFxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwdWxsLWxlZnRcIj48L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicHVsbC1yaWdodCBhY3Rpb24tbGlzdCB2aXNpYmxlLW9uLWhvdmVyXCI+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwIGRyb3Bkb3duXCI+XG5cdFx0XHRcdFx0XHRcdDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG5cdFx0XHRcdFx0XHRcdFx0XHRjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiPjwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJidXR0b25cIlxuXHRcdFx0XHRcdFx0XHRcdFx0Y2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgZHJvcGRvd24tdG9nZ2xlXCJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIlxuXHRcdFx0XHRcdFx0XHRcdFx0YXJpYS1oYXNwb3B1cD1cInRydWVcIlxuXHRcdFx0XHRcdFx0XHRcdFx0YXJpYS1leHBhbmRlZD1cImZhbHNlXCI+XG5cdFx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJjYXJldFwiPjwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cInNyLW9ubHlcIj5Ub2dnbGUgRHJvcGRvd248L3NwYW4+XG5cdFx0XHRcdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0XHQ8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51IGRyb3Bkb3duLW1lbnUtcmlnaHRcIj48L3VsPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdGA7XG4gICAgICAgIH1cbiAgICB9O1xuXG59KShqc2UubGlicy5xdWlja19lZGl0X3NwZWNpYWxfcHJpY2VzX292ZXJ2aWV3X2NvbHVtbnMpOyJdfQ==
