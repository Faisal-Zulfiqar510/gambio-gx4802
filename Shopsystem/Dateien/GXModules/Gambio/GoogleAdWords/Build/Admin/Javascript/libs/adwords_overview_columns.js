'use strict';

/* --------------------------------------------------------------
 adwords_overview_columns.js 2017-11-21
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

jse.libs.adwords_overview_columns = jse.libs.adwords_overview_columns || {};

/**
 * ## Adwords Table Column Definitions
 *
 * This module defines the column definition of the adwords overview table. They can be overridden by other
 * scripts by modifying the array with new columns, or by replacing the property values of the contained
 * fields.
 *
 * @module Admin/Libs/adwords_overview_columns
 * @exports jse.libs.adwords_overview_columns
 */
(function (exports) {

    'use strict';

    exports.status = exports.status || {
        data: 'status',
        minWidth: '100px',
        widthFactor: 1,
        className: 'status',
        searchable: false,
        render: function render(data, type, full, meta) {
            return '<input type="checkbox" ' + (data ? "checked" : "") + ' class="campaign-status-checkbox" data-id="' + full.DT_RowData.id + '" />';
        }
    };

    exports.name = exports.name || {
        data: 'name',
        minWidth: '150px',
        widthFactor: 1,
        render: function render(data, type, full, meta) {
            return '<span title="' + full.name + '">' + data + '</span>';
        }
    };

    exports.dailyBudget = exports.dailyBudget || {
        data: 'dailyBudget',
        minWidth: '100px',
        widthFactor: 1,
        className: 'numeric',
        render: function render(data, type, full, meta) {
            return '<span title="' + full.dailyBudget + '" data-budget="' + full.DT_RowData.dailyBudget + '" data-budget-html="' + data + '" data-id="' + full.DT_RowData.id + '" class="daily-budget">' + data + '</span>';
        }
    };

    exports.clicks = exports.clicks || {
        data: 'clicks',
        minWidth: '100px',
        widthFactor: 1,
        className: 'numeric',
        render: function render(data, type, full, meta) {
            return '<span title="' + full.clicks + '">' + data + '</span>';
        }
    };

    exports.impressions = exports.impressions || {
        data: 'impressions',
        minWidth: '125px',
        widthFactor: 1,
        className: 'numeric',
        render: function render(data, type, full, meta) {
            return '<span title="' + full.impressions + '">' + data + '</span>';
        }
    };

    exports.clickThroughRate = exports.clickThroughRate || {
        data: 'clickThroughRate',
        minWidth: '100px',
        widthFactor: 1,
        className: 'numeric',
        render: function render(data, type, full, meta) {
            return '<span title="' + full.clickThroughRate + '">' + data + '</span>';
        }
    };

    exports.costPerClick = exports.costPerClick || {
        data: 'costPerClick',
        minWidth: '100px',
        widthFactor: 1,
        className: 'numeric',
        render: function render(data, type, full, meta) {
            return '<span title="' + full.costPerClick + '">' + data + '</span>';
        }
    };

    exports.costs = exports.costs || {
        data: 'costs',
        minWidth: '100px',
        widthFactor: 1,
        className: 'numeric',
        render: function render(data, type, full, meta) {
            return '<span title="' + full.costs + '">' + data + '</span>';
        }
    };

    exports.actions = exports.actions || {
        data: null,
        minWidth: '350px',
        widthFactor: 1,
        className: 'actions',
        orderable: false,
        searchable: false,
        render: function render(data, type, full, meta) {
            return '\t\t\t\t\t\n\t\t\t\t\t<div class="pull-left"></div>\n\t\t\t\t\t<div class="pull-right action-list visible-on-hover">\n\t\t\t\t\t\t<i class="fa fa-pencil row-edit" title="' + jse.core.lang.translate('edit', 'buttons') + '"></i>\n\t\t\t\t\t\t<button type="button"\n\t\t\t\t\t\t\t\tclass="btn btn-default btn-save"></button>\n\t\t\t\t\t\t<button type="button"\n\t\t\t\t\t\t\t\tclass="btn btn-default btn-cancel"></button>\n\t\t\t\t\t</div>\n\t\t\t\t';
        }
    };
})(jse.libs.adwords_overview_columns);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFkbWluL0phdmFzY3JpcHQvbGlicy9hZHdvcmRzX292ZXJ2aWV3X2NvbHVtbnMuanMiXSwibmFtZXMiOlsianNlIiwibGlicyIsImFkd29yZHNfb3ZlcnZpZXdfY29sdW1ucyIsImV4cG9ydHMiLCJzdGF0dXMiLCJkYXRhIiwibWluV2lkdGgiLCJ3aWR0aEZhY3RvciIsImNsYXNzTmFtZSIsInNlYXJjaGFibGUiLCJyZW5kZXIiLCJ0eXBlIiwiZnVsbCIsIm1ldGEiLCJEVF9Sb3dEYXRhIiwiaWQiLCJuYW1lIiwiZGFpbHlCdWRnZXQiLCJjbGlja3MiLCJpbXByZXNzaW9ucyIsImNsaWNrVGhyb3VnaFJhdGUiLCJjb3N0UGVyQ2xpY2siLCJjb3N0cyIsImFjdGlvbnMiLCJvcmRlcmFibGUiLCJjb3JlIiwibGFuZyIsInRyYW5zbGF0ZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBQSxJQUFJQyxJQUFKLENBQVNDLHdCQUFULEdBQW9DRixJQUFJQyxJQUFKLENBQVNDLHdCQUFULElBQXFDLEVBQXpFOztBQUVBOzs7Ozs7Ozs7O0FBVUEsQ0FBQyxVQUFVQyxPQUFWLEVBQW1COztBQUVoQjs7QUFFQUEsWUFBUUMsTUFBUixHQUFpQkQsUUFBUUMsTUFBUixJQUFrQjtBQUMvQkMsY0FBTSxRQUR5QjtBQUUvQkMsa0JBQVUsT0FGcUI7QUFHL0JDLHFCQUFhLENBSGtCO0FBSS9CQyxtQkFBVyxRQUpvQjtBQUsvQkMsb0JBQVksS0FMbUI7QUFNL0JDLGNBTitCLGtCQU14QkwsSUFOd0IsRUFNbEJNLElBTmtCLEVBTVpDLElBTlksRUFNTkMsSUFOTSxFQU1BO0FBQzNCLGdEQUFrQ1IsT0FBTyxTQUFQLEdBQW1CLEVBQXJELG9EQUFzR08sS0FBS0UsVUFBTCxDQUFnQkMsRUFBdEg7QUFDSDtBQVI4QixLQUFuQzs7QUFXQVosWUFBUWEsSUFBUixHQUFlYixRQUFRYSxJQUFSLElBQWdCO0FBQzNCWCxjQUFNLE1BRHFCO0FBRTNCQyxrQkFBVSxPQUZpQjtB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Q0MsbUJBQVcsU0FKc0I7QUFLakNnQixtQkFBVyxLQUxzQjtBQU1qQ2Ysb0JBQVksS0FOcUI7QUFPakNDLGNBUGlDLGtCQU8xQkwsSUFQMEIsRUFPcEJNLElBUG9CLEVBT2RDLElBUGMsRUFPUkMsSUFQUSxFQU9GO0FBQzNCLGtNQUdvQ2IsSUFBSXlCLElBQUosQ0FBU0MsSUFBVCxDQUFjQyxTQUFkLENBQXdCLE1BQXhCLEVBQWdDLFNBQWhDLENBSHBDO0FBVUg7QUFsQmdDLEtBQXJDO0FBb0JILENBeEdELEVBd0dHM0IsSUFBSUMsSUFBSixDQUFTQyx3QkF4R1oiLCJmaWxlIjoiQWRtaW4vSmF2YXNjcmlwdC9saWJzL2Fkd29yZHNfb3ZlcnZpZXdfY29sdW1ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gYWR3b3Jkc19vdmVydmlld19jb2x1bW5zLmpzIDIwMTctMTEtMjFcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE3IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5qc2UubGlicy5hZHdvcmRzX292ZXJ2aWV3X2NvbHVtbnMgPSBqc2UubGlicy5hZHdvcmRzX292ZXJ2aWV3X2NvbHVtbnMgfHwge307XG5cbi8qKlxuICogIyMgQWR3b3JkcyBUYWJsZSBDb2x1bW4gRGVmaW5pdGlvbnNcbiAqXG4gKiBUaGlzIG1vZHVsZSBkZWZpbmVzIHRoZSBjb2x1bW4gZGVmaW5pdGlvbiBvZiB0aGUgYWR3b3JkcyBvdmVydmlldyB0YWJsZS4gVGhleSBjYW4gYmUgb3ZlcnJpZGRlbiBieSBvdGhlclxuICogc2NyaXB0cyBieSBtb2RpZnlpbmcgdGhlIGFycmF5IHdpdGggbmV3IGNvbHVtbnMsIG9yIGJ5IHJlcGxhY2luZyB0aGUgcHJvcGVydHkgdmFsdWVzIG9mIHRoZSBjb250YWluZWRcbiAqIGZpZWxkcy5cbiAqXG4gKiBAbW9kdWxlIEFkbWluL0xpYnMvYWR3b3Jkc19vdmVydmlld19jb2x1bW5zXG4gKiBAZXhwb3J0cyBqc2UubGlicy5hZHdvcmRzX292ZXJ2aWV3X2NvbHVtbnNcbiAqL1xuKGZ1bmN0aW9uIChleHBvcnRzKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBleHBvcnRzLnN0YXR1cyA9IGV4cG9ydHMuc3RhdHVzIHx8IHtcbiAgICAgICAgZGF0YTogJ3N0YXR1cycsXG4gICAgICAgIG1pbldpZHRoOiAnMTAwcHgnLFxuICAgICAgICB3aWR0aEZhY3RvcjogMSxcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RhdHVzJyxcbiAgICAgICAgc2VhcmNoYWJsZTogZmFsc2UsXG4gICAgICAgIHJlbmRlcihkYXRhLCB0eXBlLCBmdWxsLCBtZXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gYDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiAkeyhkYXRhID8gXCJjaGVja2VkXCIgOiBcIlwiKX0gY2xhc3M9XCJjYW1wYWlnbi1zdGF0dXMtY2hlY2tib3hcIiBkYXRhLWlkPVwiJHtmdWxsLkRUX1Jvd0RhdGEuaWR9XCIgLz5gXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZXhwb3J0cy5uYW1lID0gZXhwb3J0cy5uYW1lIHx8IHtcbiAgICAgICAgZGF0YTogJ25hbWUnLFxuICAgICAgICBtaW5XaWR0aDogJzE1MHB4JyxcbiAgICAgICAgd2lkdGhGYWN0b3I6IDEsXG4gICAgICAgIHJlbmRlcihkYXRhLCB0eXBlLCBmdWxsLCBtZXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gYDxzcGFuIHRpdGxlPVwiJHtmdWxsLm5hbWV9XCI+JHtkYXRhfTwvc3Bhbj5gXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZXhwb3J0cy5kYWlseUJ1ZGdldCA9IGV4cG9ydHMuZGFpbHlCdWRnZXQgfHwge1xuICAgICAgICBkYXRhOiAnZGFpbHlCdWRnZXQnLFxuICAgICAgICBtaW5XaWR0aDogJzEwMHB4JyxcbiAgICAgICAgd2lkdGhGYWN0b3I6IDEsXG4gICAgICAgIGNsYXNzTmFtZTogJ251bWVyaWMnLFxuICAgICAgICByZW5kZXIoZGF0YSwgdHlwZSwgZnVsbCwgbWV0YSkge1xuICAgICAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7ZnVsbC5kYWlseUJ1ZGdldH1cIiBkYXRhLWJ1ZGdldD1cIiR7ZnVsbC5EVF9Sb3dEYXRhLmRhaWx5QnVkZ2V0fVwiIGRhdGEtYnVkZ2V0LWh0bWw9XCIke2RhdGF9XCIgZGF0YS1pZD1cIiR7ZnVsbC5EVF9Sb3dEYXRhLmlkfVwiIGNsYXNzPVwiZGFpbHktYnVkZ2V0XCI+JHtkYXRhfTwvc3Bhbj5gXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZXhwb3J0cy5jbGlja3MgPSBleHBvcnRzLmNsaWNrcyB8fCB7XG4gICAgICAgIGRhdGE6ICdjbGlja3MnLFxuICAgICAgICBtaW5XaWR0aDogJzEwMHB4JyxcbiAgICAgICAgd2lkdGhGYWN0b3I6IDEsXG4gICAgICAgIGNsYXNzTmFtZTogJ251bWVyaWMnLFxuICAgICAgICByZW5kZXIoZGF0YSwgdHlwZSwgZnVsbCwgbWV0YSkge1xuICAgICAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7ZnVsbC5jbGlja3N9XCI+JHtkYXRhfTwvc3Bhbj5gXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZXhwb3J0cy5pbXByZXNzaW9ucyA9IGV4cG9ydHMuaW1wcmVzc2lvbnMgfHwge1xuICAgICAgICBkYXRhOiAnaW1wcmVzc2lvbnMnLFxuICAgICAgICBtaW5XaWR0aDogJzEyNXB4JyxcbiAgICAgICAgd2lkdGhGYWN0b3I6IDEsXG4gICAgICAgIGNsYXNzTmFtZTogJ251bWVyaWMnLFxuICAgICAgICByZW5kZXIoZGF0YSwgdHlwZSwgZnVsbCwgbWV0YSkge1xuICAgICAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7ZnVsbC5pbXByZXNzaW9uc31cIj4ke2RhdGF9PC9zcGFuPmBcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBleHBvcnRzLmNsaWNrVGhyb3VnaFJhdGUgPSBleHBvcnRzLmNsaWNrVGhyb3VnaFJhdGUgfHwge1xuICAgICAgICBkYXRhOiAnY2xpY2tUaHJvdWdoUmF0ZScsXG4gICAgICAgIG1pbldpZHRoOiAnMTAwcHgnLFxuICAgICAgICB3aWR0aEZhY3RvcjogMSxcbiAgICAgICAgY2xhc3NOYW1lOiAnbnVtZXJpYycsXG4gICAgICAgIHJlbmRlcihkYXRhLCB0eXBlLCBmdWxsLCBtZXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gYDxzcGFuIHRpdGxlPVwiJHtmdWxsLmNsaWNrVGhyb3VnaFJhdGV9XCI+JHtkYXRhfTwvc3Bhbj5gXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZXhwb3J0cy5jb3N0UGVyQ2xpY2sgPSBleHBvcnRzLmNvc3RQZXJDbGljayB8fCB7XG4gICAgICAgIGRhdGE6ICdjb3N0UGVyQ2xpY2snLFxuICAgICAgICBtaW5XaWR0aDogJzEwMHB4JyxcbiAgICAgICAgd2lkdGhGYWN0b3I6IDEsXG4gICAgICAgIGNsYXNzTmFtZTogJ251bWVyaWMnLFxuICAgICAgICByZW5kZXIoZGF0YSwgdHlwZSwgZnVsbCwgbWV0YSkge1xuICAgICAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7ZnVsbC5jb3N0UGVyQ2xpY2t9XCI+JHtkYXRhfTwvc3Bhbj5gXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZXhwb3J0cy5jb3N0cyA9IGV4cG9ydHMuY29zdHMgfHwge1xuICAgICAgICBkYXRhOiAnY29zdHMnLFxuICAgICAgICBtaW5XaWR0aDogJzEwMHB4JyxcbiAgICAgICAgd2lkdGhGYWN0b3I6IDEsXG4gICAgICAgIGNsYXNzTmFtZTogJ251bWVyaWMnLFxuICAgICAgICByZW5kZXIoZGF0YSwgdHlwZSwgZnVsbCwgbWV0YSkge1xuICAgICAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7ZnVsbC5jb3N0c31cIj4ke2RhdGF9PC9zcGFuPmBcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBleHBvcnRzLmFjdGlvbnMgPSBleHBvcnRzLmFjdGlvbnMgfHwge1xuICAgICAgICBkYXRhOiBudWxsLFxuICAgICAgICBtaW5XaWR0aDogJzM1MHB4JyxcbiAgICAgICAgd2lkdGhGYWN0b3I6IDEsXG4gICAgICAgIGNsYXNzTmFtZTogJ2FjdGlvbnMnLFxuICAgICAgICBvcmRlcmFibGU6IGZhbHNlLFxuICAgICAgICBzZWFyY2hhYmxlOiBmYWxzZSxcbiAgICAgICAgcmVuZGVyKGRhdGEsIHR5cGUsIGZ1bGwsIG1ldGEpIHtcbiAgICAgICAgICAgIHJldHVybiBgXHRcdFx0XHRcdFxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwdWxsLWxlZnRcIj48L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicHVsbC1yaWdodCBhY3Rpb24tbGlzdCB2aXNpYmxlLW9uLWhvdmVyXCI+XG5cdFx0XHRcdFx0XHQ8aSBjbGFzcz1cImZhIGZhLXBlbmNpbCByb3ctZWRpdFwiIHRpdGxlPVwiJHtqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnZWRpdCcsICdidXR0b25zJyl9XCI+PC9pPlxuXHRcdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcblx0XHRcdFx0XHRcdFx0XHRjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBidG4tc2F2ZVwiPjwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcblx0XHRcdFx0XHRcdFx0XHRjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBidG4tY2FuY2VsXCI+PC9idXR0b24+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdGA7XG4gICAgICAgIH1cbiAgICB9O1xufSkoanNlLmxpYnMuYWR3b3Jkc19vdmVydmlld19jb2x1bW5zKTsgIl19
