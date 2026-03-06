'use strict';

/* --------------------------------------------------------------
 datatable_responsive_columns.js 2017-03-08
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Enable DataTable Responsive Columns
 *
 * This module will enable the responsive columns functionality which will resize the columns until a minimum
 * width is reach. Afterwards the columns will be hidden and the content will be displayed by through an icon
 * tooltip.
 *
 * ### Options
 *
 * **Initial Visibility Toggle Selector | `data-data_relative_columns-visibility-toggle-selector` | String | Optional**
 *
 * Provide a selector relative to each thead > tr element in order to hide the column on page load and then show it
 * again once the responsive widths have been calculated. The provided selector must point to the biggest column in
 * order to avoid broken displays till the table becomes responsive.
 *
 * @module Admin/Extensions/data_relative_columns
 */
gx.extensions.module('datatable_responsive_columns', [jse.source + '/vendor/qtip2/jquery.qtip.min.css', jse.source + '/vendor/qtip2/jquery.qtip.min.js'], function (data) {

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
     * Default Options
     *
     * @type {Object}
     */
    var defaults = {
        visibilityToggleSelector: '[data-column-name="actions"]'
    };

    /**
     * Final Options
     *
     * @type {Object}
     */
    var options = $.extend(true, {}, defaults, data);

    /**
     * Module Instance
     *
     * @type {Object}
     */
    var module = {};

    /**
     * DataTable Initialization Columns
     *
     * @type {Array}
     */
    var columnDefinitions = void 0;

    /**
     * Width Factor Sum
     *
     * @type {Number}
     */
    var widthFactorSum = void 0;

    // ------------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------------

    /**
     * Update empty table "colspan" attribute.
     *
     * This method will keep the empty table row width in sync with the table width.
     */
    function _updateEmptyTableColSpan() {
        if ($this.find('.dataTables_empty').length > 0) {
            var colspan = $this.find('thead:first tr:first .actions').index() + 1 - $this.find('thead:first tr:first th.hidden').length;
            $this.find('.dataTables_empty').attr('colspan', colspan);
        }
    }

    /**
     * Add hidden columns content icon to actions cell of a single row.
     *
     * Call this method only if you are sure there is no icon previously set (runs faster).
     *
     * @param {jQuery} $tr
     */
    function _addHiddenColumnsContentIcon($tr) {
        $tr.find('td.actions div:first').prepend('<i class="fa fa-ellipsis-h meta-icon hidden-columns-content"></i>');
    }

    /**
     * Get the cell content.
     *
     * This method will also search for child input and select elements and return the appropriate content.
     *
     * @param {jQuery} $td Table cell to be examined.
     *
     * @return {String}
     */
    function _getCellContent($td) {
        if ($td.find('select').length) {
            return $td.find('select option:selected').text();
        } else if ($td.find('input:text').length) {
            return $td.find('input:text').val();
        } else if ($td.find('input:checkbox').length) {
            return $td.find('input:checkbox').prop('checked') ? '✔' : '✘';
        } else {
            return $td.text();
        }
    }

    /**
     * Generates and sets the tooltip content for the hidden columns content.
     *
     * @param {jQuery} $tr The current row selector.
     */
    function _generateHiddenColumnsContent($tr) {
        var hiddenColumnContentHtml = '';

        $tr.find('td.hidden').each(function (index, td) {
            hiddenColumnContentHtml += $this.find('thead:first tr:first th:eq(' + $(td).index() + ')').text() + ': ' + _getCellContent($(td)) + '<br/>';
        });

        $tr.find('.hidden-columns-content').qtip({
            content: hiddenColumnContentHtml,
            style: {
                classes: 'gx-qtip info'
            },
            hide: {
                fixed: true,
                delay: 300
            }
        });
    }

    /**
     * Hide DataTable Columns
     *
     * This method is part of the responsive tables solution.
     *
     * @param {jQuery} $targetWrapper Target datatable instance wrapper div.
     * @param {jQuery} $firstHiddenColumn The first hidden column (first column with the .hidden class).
     */
    function _hideColumns($targetWrapper, $firstHiddenColumn) {
        var $lastVisibleColumn = $firstHiddenColumn.length !== 0 ? $firstHiddenColumn.prev() : $this.find('thead:first th.actions').prev();

        if ($lastVisibleColumn.hasClass('hidden') || $lastVisibleColumn.index() === 0) {
            return; // First column or already hidden, do not continue.
        }

        // Show hidden column content icon.
        if ($this.find('.hidden-columns-content').length === 0) {
            $this.find('tbody tr').each(function (index, tr) {
                _addHiddenColumnsContentIcon($(tr));
            });
        }

        // Hide the last visible column.
        $this.find('tr').each(function (index, tr) {
            $(tr).find('th:eq(' + $lastVisibleColumn.index() + '), td:eq(' + $lastVisibleColumn.index() + ')').addClass('hidden');

            // Generate the hidden columns content.
            _generateHiddenColumnsContent($(tr));
        });

        _updateEmptyTableColSpan();

        // If there are still columns which don't fit within the viewport, hide them.
        if ($targetWrapper.width() < $this.width() && $lastVisibleColumn.index() > 1) {
            _toggleColumnsVisibility();
        }
    }

    /**
     * Show DataTable Columns
     *
     * This method is part of the responsive tables solution.
     *
     * @param {jQuery} $targetWrapper Target datatable instance wrapper div.
     * @param {jQuery} $firstHiddenColumn The first hidden column (first column with the .hidden class).
     */
    function _showColumns($targetWrapper, $firstHiddenColumn) {
        if ($firstHiddenColumn.length === 0) {
            return;
        }

        var firstHiddenColumnWidth = parseInt($firstHiddenColumn.css('min-width'));
        var tableMinWidth = 0;

        // Calculate the table min width by each column min width.
        $this.find('thead:first tr:first th').each(function (index, th) {
            if (!$(th).hasClass('hidden')) {
                tableMinWidth += parseInt($(th).css('min-width'));
            }
        });

        // Show the first hidden column.
        if (tableMinWidth + firstHiddenColumnWidth <= $targetWrapper.outerWidth()) {
            $this.find('tr').each(function (index, tr) {
                $(tr).find('th:eq(' + $firstHiddenColumn.index() + '), td:eq(' + $firstHiddenColumn.index() + ')').removeClass('hidden');

                _generateHiddenColumnsContent($(tr));
            });

            _updateEmptyTableColSpan();

            // Hide hidden column content icon.
            if ($this.find('thead:first tr:first th.hidden').length === 0) {
                $this.find('.hidden-columns-content').remove();
            }

            // If there are still columns which would fit fit within the viewport, show them.
            var newTableMinWidth = tableMinWidth + firstHiddenColumnWidth + parseInt($firstHiddenColumn.next('.hidden').css('min-width'));

            if (newTableMinWidth <= $targetWrapper.outerWidth() && $firstHiddenColumn.next('.hidden').length !== 0) {
                _toggleColumnsVisibility();
            }
        }
    }

    /**
     * Toggle column visibility depending the window size.
     */
    function _toggleColumnsVisibility() {
        var $targetWrapper = $this.parent();
        var $firstHiddenColumn = $this.find('thead:first th.hidden:first');

        if ($targetWrapper.width() < $this.width()) {
            _hideColumns($targetWrapper, $firstHiddenColumn);
        } else {
            _showColumns($targetWrapper, $firstHiddenColumn);
        }
    }

    /**
     * Calculate and set the relative column widths.
     *
     * The relative width calculation works with a width-factor system where each column preserves a
     * specific amount of the table width.
     *
     * This factor is not defining a percentage, rather only a width-volume. Percentage widths will not
     * work correctly when the table has fewer columns than the original settings.
     */
    function _applyRelativeColumnWidths() {
        $this.find('thead:first tr:first th').each(function () {
            var _this = this;

            if ($(this).css('display') === 'none') {
                return true;
            }

            var currentColumnDefinition = void 0;

            columnDefinitions.forEach(function (columnDefinition) {
                if (columnDefinition.name === $(_this).data('columnName')) {
                    currentColumnDefinition = columnDefinition;
                }
            });

            if (currentColumnDefinition && currentColumnDefinition.widthFactor) {
                var index = $(this).index();
                var width = Math.round(currentColumnDefinition.widthFactor / widthFactorSum * 100 * 100) / 100;
                $this.find('thead').each(function (i, thead) {
                    $(thead).find('tr').each(function (i, tr) {
                        $(tr).find('th').eq(index).css('width', width + '%');
                    });
                });
            }
        });
    }

    /**
     * Applies the column width if the current column width is smaller.
     */
    function _applyMinimumColumnWidths() {
        $this.find('thead:first tr:first th').each(function (index) {
            var _this2 = this;

            if ($(this).css('display') === 'none') {
                return true;
            }

            var currentColumnDefinition = void 0;

            columnDefinitions.forEach(function (columnDefinition) {
                if (columnDefinition.name === $(_this2).data('columnName')) {
                    currentColumnDefinition = columnDefinition;
                }
            });

            if (!currentColumnDefinition) {
                return true;
            }

            var currentWidth = $(this).outerWidth();
            var definitionMinWidth = parseInt(currentColumnDefinition.minWidth);

            if (currentWidth < definitionMinWidth) {
                // Force the correct column min-widths for all thead columns.
                $this.find('thead').each(function (i, thead) {
                    $(thead).find('tr').each(function (i, tr) {
                        $(tr).find('th').eq(index).outerWidth(definitionMinWidth).css('max-width', definitionMinWidth).css('min-width', definitionMinWidth);
                    });
                });
            }
        });
    }

    /**
     * On DataTable Draw Event
     */
    function _onDataTableDraw() {
        // Wait until the contents of the table are rendered. DataTables will sometimes fire the draw event
        // even before the td elements are rendered in the browser.
        var interval = setInterval(function () {
            if ($this.find('tbody tr:last td.actions').length === 1) {
                _applyRelativeColumnWidths();
                _applyMinimumColumnWidths();
                _toggleColumnsVisibility();

                // Hide the tbody cells depending on whether the respective <th> element is hidden.
                $this.find('thead:first tr:first th').each(function (index, th) {
                    if ($(th).hasClass('hidden')) {
                        $this.find('tbody tr').each(function (i, tr) {
                            $(tr).find('td:eq(' + index + ')').addClass('hidden');
                        });
                    }
                });

                // Add the hidden columns icon if needed.
                if ($this.find('thead th.hidden').length) {
                    $this.find('tbody tr').each(function (index, tr) {
                        if ($(tr).find('.hidden-columns-content').length) {
                            return true;
                        }
                        _addHiddenColumnsContentIcon($(tr));
                        _generateHiddenColumnsContent($(tr));
                    });
                }

                clearInterval(interval);
            }
        }, 500);
    }

    /**
     * On Window Resize Event
     */
    function _onWindowResize() {
        $this.find('thead.fixed').outerWidth($this.outerWidth());
        _applyRelativeColumnWidths();
        _applyMinimumColumnWidths();
        _toggleColumnsVisibility();
    }

    /**
     * On DataTable Initialize Event
     */
    function _onDataTableInit() {
        $this.find(options.visibilityToggleSelector).show();
        _updateEmptyTableColSpan();

        columnDefinitions = $this.DataTable().init().columns;
        widthFactorSum = 0;

        columnDefinitions.forEach(function (columnDefinition) {
            widthFactorSum += columnDefinition.widthFactor || 0;
        });

        $this.on('draw.dt', _onDataTableDraw);
        $(window).on('resize', _onWindowResize);

        _onWindowResize();
    }

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $this.on('init.dt', _onDataTableInit);

        $(window).on('JSENGINE_INIT_FINISHED', function () {
            if ($this.DataTable().ajax.json() !== undefined) {
                _onDataTableInit();
            }
        });

        $this.find(options.visibilityToggleSelector).hide();

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhdGF0YWJsZV9yZXNwb25zaXZlX2NvbHVtbnMuanMiXSwibmFtZXMiOlsiZ3giLCJleHRlbnNpb25zIiwibW9kdWxlIiwianNlIiwic291cmNlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImRlZmF1bHRzIiwidmlzaWJpbGl0eVRvZ2dsZVNlbGVjdG9yIiwib3B0aW9ucyIsImV4dGVuZCIsImNvbHVtbkRlZmluaXRpb25zIiwid2lkdGhGYWN0b3JTdW0iLCJfdXBkYXRlRW1wdHlUYWJsZUNvbFNwYW4iLCJmaW5kIiwibGVuZ3RoIiwiY29sc3BhbiIsImluZGV4IiwiYXR0ciIsIl9hZGRIaWRkZW5Db2x1bW5zQ29udGVudEljb24iLCIkdHIiLCJwcmVwZW5kIiwiX2dldENlbGxDb250ZW50IiwiJHRkIiwidGV4dCIsInZhbCIsInByb3AiLCJfZ2VuZXJhdGVIaWRkZW5Db2x1bW5zQ29udGVudCIsImhpZGRlbkNvbHVtbkNvbnRlbnRIdG1sIiwiZWFjaCIsInRkIiwicXRpcCIsImNvbnRlbnQiLCJzdHlsZSIsImNsYXNzZXMiLCJoaWRlIiwiZml4ZWQiLCJkZWxheSIsIl9oaWRlQ29sdW1ucyIsIiR0YXJnZXRXcmFwcGVyIiwiJGZpcnN0SGlkZGVuQ29sdW1uIiwiJGxhc3RWaXNpYmxlQ29sdW1uIiwicHJldiIsImhhc0NsYXNzIiwidHIiLCJhZGRDbGFzcyIsIndpZHRoIiwiX3RvZ2dsZUNvbHVtbnNWaXNpYmlsaXR5IiwiX3Nob3dDb2x1bW5zIiwiZmlyc3RIaWRkZW5Db2x1bW5XaWR0aCIsInBhcnNlSW50IiwiY3NzIiwidGFibGVNaW5XaWR0aCIsInRoIiwib3V0ZXJXaWR0aCIsInJlbW92ZUNsYXNzIiwicmVtb3ZlIiwibmV3VGFibGVNaW5XaWR0aCIsIm5leHQiLCJwYXJlbnQiLCJfYXBwbHlSZWxhdGl2ZUNvbHVtbldpZHRocyIsImN1cnJlbnRDb2x1bW5EZWZpbml0aW9uIiwiZm9yRWFjaCIsImNvbHVtbkRlZmluaXRpb24iLCJuYW1lIiwid2lkdGhGYWN0b3IiLCJNYXRoIiwicm91bmQiLCJpIiwidGhlYWQiLCJlcSIsIl9hcHBseU1pbmltdW1Db2x1bW5XaWR0aHMiLCJjdXJyZW50V2lkdGgiLCJkZWZpbml0aW9uTWluV2lkdGgiLCJtaW5XaWR0aCIsIl9vbkRhdGFUYWJsZURyYXciLCJpbnRlcnZhbCIsInNldEludGVydmFsIiwiY2xlYXJJbnRlcnZhbCIsIl9vbldpbmRvd1Jlc2l6ZSIsIl9vbkRhdGFUYWJsZUluaXQiLCJzaG93IiwiRGF0YVRhYmxlIiwiaW5pdCIsImNvbHVtbnMiLCJvbiIsIndpbmRvdyIsImRvbmUiLCJhamF4IiwianNvbiIsInVuZGVmaW5lZCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQUEsR0FBR0MsVUFBSCxDQUFjQyxNQUFkLENBQ0ksOEJBREosRUFHSSxDQUNPQyxJQUFJQyxNQURYLHdDQUVPRCxJQUFJQyxNQUZYLHNDQUhKLEVBUUksVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7OztBQUtBLFFBQU1DLFFBQVFDLEVBQUUsSUFBRixDQUFkOztBQUVBOzs7OztBQUtBLFFBQU1DLFdBQVc7QUFDYkMsa0NBQTBCO0FBRGIsS0FBakI7O0FBSUE7Ozs7O0FBS0EsUUFBTUMsVUFBVUgsRUFBRUksTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CSCxRQUFuQixFQUE2QkgsSUFBN0IsQ0FBaEI7O0FBRUE7Ozs7O0FBS0EsUUFBTUgsU0FBUyxFQUFmOztBQUVBOzs7OztBQUtBLFFBQUlVLDBCQUFKOztBQUVBOzs7OztBQUtBLFFBQUlDLHVCQUFKOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7QUFLQSxhQUFTQyx3QkFBVCxHQUFvQztBQUNoQyxZQUFJUixNQUFNUyxJQUFOLENBQVcsbUJBQVgsRUFBZ0NDLE1BQWhDLEdBQXlDLENBQTdDLEVBQWdEO0FBQzVDLGdCQUFNQyxVQUFXWCxNQUFNUyxJQUFOLENBQVcsK0JBQVgsRUFBNENHLEtBQTVDLEtBQXNELENBQXZELEdBQ1ZaLE1BQU1TLElBQU4sQ0FBVyxnQ0FBWCxFQUE2Q0MsTUFEbkQ7QUFFQVYsa0JBQU1TLElBQU4sQ0FBVyxtQkFBWCxFQUFnQ0ksSUFBaEMsQ0FBcUMsU0FBckMsRUFBZ0RGLE9BQWhEO0FBQ0g7QUFDSjs7QUFFRDs7Ozs7OztBQU9BLGFBQVNHLDRCQUFULENBQXNDQyxHQUF0QyxFQUEyQztBQUN2Q0EsWUFBSU4sSUFBSixDQUFTLHNCQUFULEVBQ0tPLE9BREw7QUFFSDs7QUFFRDs7Ozs7Ozs7O0FBU0EsYUFBU0MsZUFBVCxDQUF5QkMsR0FBekIsRUFBOEI7QUFDMUIsWUFBSUEsSUFBSVQsSUFBSixDQUFTLFFBQVQsRUFBbUJDLE1BQXZCLEVBQStCO0FBQzNCLG1CQUFPUSxJQUFJVCxJQUFKLENBQVMsd0JBQVQsRUFBbUNVLElBQW5DLEVBQVA7QUFDSCxTQUZELE1BRU8sSUFBSUQsSUFBSVQsSUFBSixDQUFTLFlBQVQsRUFBdUJDLE1BQTNCLEVBQW1DO0FBQ3RDLG1CQUFPUSxJQUFJVCxJQUFKLENBQVMsWUFBVCxFQUF1QlcsR0FBdkIsRUFBUDtBQUNILFNBRk0sTUFFQSxJQUFJRixJQUFJVCxJQUFKLENBQVMsZ0JBQVQsRUFBMkJDLE1BQS9CLEVBQXVDO0FBQzFDLG1CQUFPUSxJQUFJVCxJQUFKLENBQVMsZ0JBQVQsRUFBMkJZLElBQTNCLENBQWdDLFNBQWhDLElBQTZDLEdBQTdDLEdBQW1ELEdBQTFEO0FBQ0gsU0FGTSxNQUVBO0FBQ0gsbUJBQU9ILElBQUlDLElBQUosRUFBUDtBQUNIO0FBQ0o7O0FBRUQ7Ozs7O0FBS0EsYUFBU0csNkJBQVQsQ0FBdUNQLEdBQXZDLEVBQTRDO0FBQ3hDLFlBQUlRLDBCQUEwQixFQUE5Qjs7QUFFQVIsWUFBSU4sSUFBSixDQUFTLFdBQVQsRUFBc0JlLElBQXRCLENBQTJCLFVBQUNaLEtBQUQsRUFBUWEsRUFBUixFQUFlO0FBQ3RDRix1Q0FBMkJ2QixNQUFNUyxJQUFOLGlDQUF5Q1IsRUFBRXdCLEVBQUYsRUFBTWIsS0FBTixFQUF6QyxRQUEyRE8sSUFBM0QsS0FDckIsSUFEcUIsR0FDZEYsZ0JBQWdCaEIsRUFBRXdCLEVBQUYsQ0FBaEIsQ0FEYyxHQUNXLE9BRHRDO0FBRUgsU0FIRDs7QUFLQVYsWUFBSU4sSUFBSixDQUFTLHlCQUFULEVBQW9DaUIsSUFBcEMsQ0FBeUM7QUFDckNDLHFCQUFTSix1QkFENEI7QUFFckNLLG1CQUFPO0FBQ0hDLHlCQUFTO0FBRE4sYUFGOEI7QUFLckNDLGtCQUFNO0FBQ0ZDLHVCQUFPLElBREw7QUFFRkMsdUJBQU87QUFGTDtBQUwrQixTQUF6QztBQVVIOztBQUVEOzs7Ozs7OztBQVFBLGFBQVNDLFlBQVQsQ0FBc0JDLGNBQXRCLEVBQXNDQyxrQkFBdEMsRUFBMEQ7QUFDdEQsWUFBTUMscUJBQXNCRCxtQkFBbUJ6QixNQUFuQixLQUE4QixDQUEvQixHQUNyQnlCLG1CQUFtQkUsSUFBbkIsRUFEcUIsR0FFckJyQyxNQUFNUyxJQUFOLENBQVcsd0JBQVgsRUFBcUM0QixJQUFyQyxFQUZOOztBQUlBLFlBQUlELG1CQUFtQkUsUUFBbkIsQ0FBNEIsUUFBNUIsS0FBeUNGLG1CQUFtQnhCLEtBQW5CLE9BQStCLENBQTVFLEVBQStFO0FBQzNFLG1CQUQyRSxDQUNuRTtBQUNYOztBQUVEO0FBQ0EsWUFBSVosTUFBTVMsSUFBTixDQUFXLHlCQUFYLEVBQXNDQyxNQUF0QyxLQUFpRCxDQUFyRCxFQUF3RDtBQUNwRFYsa0JBQU1TLElBQU4sQ0FBVyxVQUFYLEVBQXVCZSxJQUF2QixDQUE0QixVQUFDWixLQUFELEVBQVEyQixFQUFSLEVBQWU7QUFDdkN6Qiw2Q0FBNkJiLEVBQUVzQyxFQUFGLENBQTdCO0FBQ0gsYUFGRDtBQUdIOztBQUVEO0FBQ0F2QyxjQUFNUyxJQUFOLENBQVcsSUFBWCxFQUFpQmUsSUFBakIsQ0FBc0IsVUFBQ1osS0FBRCxFQUFRMkIsRUFBUixFQUFlO0FBQ2pDdEMsY0FBRXNDLEVBQUYsRUFDSzlCLElBREwsWUFDbUIyQixtQkFBbUJ4QixLQUFuQixFQURuQixpQkFDeUR3QixtQkFBbUJ4QixLQUFuQixFQUR6RCxRQUVLNEIsUUFGTCxDQUVjLFFBRmQ7O0FBSUE7QUFDQWxCLDBDQUE4QnJCLEVBQUVzQyxFQUFGLENBQTlCO0FBQ0gsU0FQRDs7QUFTQS9COztBQUVBO0FBQ0EsWUFBSTBCLGVBQWVPLEtBQWYsS0FBeUJ6QyxNQUFNeUMsS0FBTixFQUF6QixJQUEwQ0wsbUJBQW1CeEIsS0FBbkIsS0FBNkIsQ0FBM0UsRUFBOEU7QUFDMUU4QjtBQUNIO0FBQ0o7O0FBRUQ7Ozs7Ozs7O0FBUUEsYUFBU0MsWUFBVCxDQUFzQlQsY0FBdEIsRUFBc0NDLGtCQUF0QyxFQUEwRDtBQUN0RCxZQUFJQSxtQkFBbUJ6QixNQUFuQixLQUE4QixDQUFsQyxFQUFxQztBQUNqQztBQUNIOztBQUVELFlBQU1rQyx5QkFBeUJDLFNBQVNWLG1CQUFtQlcsR0FBbkIsQ0FBdUIsV0FBdkIsQ0FBVCxDQUEvQjtBQUNBLFlBQUlDLGdCQUFnQixDQUFwQjs7QUFFQTtBQUNBL0MsY0FBTVMsSUFBTixDQUFXLHlCQUFYLEVBQXNDZSxJQUF0QyxDQUEyQyxVQUFDWixLQUFELEVBQVFvQyxFQUFSLEVBQWU7QUFDdEQsZ0JBQUksQ0FBQy9DLEVBQUUrQyxFQUFGLEVBQU1WLFFBQU4sQ0FBZSxRQUFmLENBQUwsRUFBK0I7QUFDM0JTLGlDQUFpQkYsU0FBUzVDLEVBQUUrQyxFQUFGLEVBQU1GLEdBQU4sQ0FBVSxXQUFWLENBQVQsQ0FBakI7QUFDSDtBQUNKLFNBSkQ7O0FBTUE7QUFDQSxZQUFJQyxnQkFBZ0JILHNCQUFoQixJQUEwQ1YsZUFBZWUsVUFBZixFQUE5QyxFQUEyRTtBQUN2RWpELGtCQUFNUyxJQUFOLENBQVcsSUFBWCxFQUFpQmUsSUFBakIsQ0FBc0IsVUFBQ1osS0FBRCxFQUFRMkIsRUFBUixFQUFlO0FBQ2pDdEMsa0JBQUVzQyxFQUFGLEVBQ0s5QixJQURMLFlBQ21CMEIsbUJBQW1CdkIsS0FBbkIsRUFEbkIsaUJBQ3lEdUIsbUJBQW1CdkIsS0FBbkIsRUFEekQsUUFFS3NDLFdBRkwsQ0FFaUIsUUFGakI7O0FBSUE1Qiw4Q0FBOEJyQixFQUFFc0MsRUFBRixDQUE5QjtBQUNILGFBTkQ7O0FBUUEvQjs7QUFFQTtBQUNBLGdCQUFJUixNQUFNUyxJQUFOLENBQVcsZ0NBQVgsRUFBNkNDLE1BQTdDLEtBQXdELENBQTVELEVBQStEO0FBQzNEVixzQkFBTVMsSUFBTixDQUFXLHlCQUFYLEVBQXNDMEMsTUFBdEM7QUFDSDs7QUFFRDtBQUNBLGdCQUFNQyxtQkFBbUJMLGdCQUFnQkgsc0JBQWhCLEdBQ25CQyxTQUFTVixtQkFBbUJrQixJQUFuQixDQUF3QixTQUF4QixFQUFtQ1AsR0FBbkMsQ0FBdUMsV0FBdkMsQ0FBVCxDQUROOztBQUdBLGdCQUFJTSxvQkFBb0JsQixlQUFlZSxVQUFmLEVBQXBCLElBQW1EZCxtQkFBbUJrQixJQUFuQixDQUF3QixTQUF4QixFQUFtQzNDLE1BQW5DLEtBQy9DLENBRFIsRUFDVztBQUNQZ0M7QUFDSDtBQUNKO0FBQ0o7O0FBRUQ7OztBQUdBLGFBQVNBLHdCQUFULEdBQW9DO0FBQ2hDLFlBQU1SLGlCQUFpQmxDLE1BQU1zRCxNQUFOLEVBQXZCO0FBQ0EsWUFBTW5CLHFCQUFxQm5DLE1BQU1TLElBQU4sQ0FBVyw2QkFBWCxDQUEzQjs7QUFFQSxZQUFJeUIsZUFBZU8sS0FBZixLQUF5QnpDLE1BQU15QyxLQUFOLEVBQTdCLEVBQTRDO0FBQ3hDUix5QkFBYUMsY0FBYixFQUE2QkMsa0JBQTdCO0FBQ0gsU0FGRCxNQUVPO0FBQ0hRLHlCQUFhVCxjQUFiLEVBQTZCQyxrQkFBN0I7QUFDSDtBQUNKOztBQUVEOzs7Ozs7Ozs7QUFTQSxhQUFTb0IsMEJBQVQsR0FBc0M7QUFDbEN2RCxjQUFNUyxJQUFOLENBQVcseUJBQVgsRUFBc0NlLElBQXRDLENBQTJDLFlBQVk7QUFBQTs7QUFDbkQsZ0JBQUl2QixFQUFFLElBQUYsRUFBUTZDLEdBQVIsQ0FBWSxTQUFaLE1BQTJCLE1BQS9CLEVBQXVDO0FBQ25DLHVCQUFPLElBQVA7QUFDSDs7QUFFRCxnQkFBSVUsZ0NBQUo7O0FBRUFsRCw4QkFBa0JtRCxPQUFsQixDQUEwQixVQUFDQyxnQkFBRCxFQUFzQjtBQUM1QyxvQkFBSUEsaUJBQWlCQyxJQUFqQixLQUEwQjFELEVBQUUsS0FBRixFQUFRRixJQUFSLENBQWEsWUFBYixDQUE5QixFQUEwRDtBQUN0RHlELDhDQUEwQkUsZ0JBQTFCO0FBQ0g7QUFDSixhQUpEOztBQU1BLGdCQUFJRiwyQkFBMkJBLHdCQUF3QkksV0FBdkQsRUFBb0U7QUFDaEUsb0JBQU1oRCxRQUFRWCxFQUFFLElBQUYsRUFBUVcsS0FBUixFQUFkO0FBQ0Esb0JBQU02QixRQUFRb0IsS0FBS0MsS0FBTCxDQUFXTix3QkFBd0JJLFdBQXhCLEdBQXNDckQsY0FBdEMsR0FBdUQsR0FBdkQsR0FBNkQsR0FBeEUsSUFBK0UsR0FBN0Y7QUFDQVAsc0JBQU1TLElBQU4sQ0FBVyxPQUFYLEVBQW9CZSxJQUFwQixDQUF5QixVQUFDdUMsQ0FBRCxFQUFJQyxLQUFKLEVBQWM7QUFDbkMvRCxzQkFBRStELEtBQUYsRUFBU3ZELElBQVQsQ0FBYyxJQUFkLEVBQW9CZSxJQUFwQixDQUF5QixVQUFDdUMsQ0FBRCxFQUFJeEIsRUFBSixFQUFXO0FBQ2hDdEMsMEJBQUVzQyxFQUFGLEVBQU05QixJQUFOLENBQVcsSUFBWCxFQUFpQndELEVBQWpCLENBQW9CckQsS0FBcEIsRUFBMkJrQyxHQUEzQixDQUErQixPQUEvQixFQUF3Q0wsUUFBUSxHQUFoRDtBQUNILHFCQUZEO0FBR0gsaUJBSkQ7QUFLSDtBQUNKLFNBdEJEO0FBdUJIOztBQUVEOzs7QUFHQSxhQUFTeUIseUJBQVQsR0FBcUM7QUFDakNsRSxjQUFNUyxJQUFOLENBQVcseUJBQVgsRUFBc0NlLElBQXRDLENBQTJDLFVBQVVaLEtBQVYsRUFBaUI7QUFBQTs7QUFDeEQsZ0JBQUlYLEVBQUUsSUFBRixFQUFRNkMsR0FBUixDQUFZLFNBQVosTUFBMkIsTUFBL0IsRUFBdUM7QUFDbkMsdUJBQU8sSUFBUDtBQUNIOztBQUVELGdCQUFJVSxnQ0FBSjs7QUFFQWxELDhCQUFrQm1ELE9BQWxCLENBQTBCLFVBQUNDLGdCQUFELEVBQXNCO0FBQzVDLG9CQUFJQSxpQkFBaUJDLElBQWpCLEtBQTBCMUQsRUFBRSxNQUFGLEVBQVFGLElBQVIsQ0FBYSxZQUFiLENBQTlCLEVBQTBEO0FBQ3REeUQsOENBQTBCRSxnQkFBMUI7QUFDSDtBQUNKLGFBSkQ7O0FBTUEsZ0JBQUksQ0FBQ0YsdUJBQUwsRUFBOEI7QUFDMUIsdUJBQU8sSUFBUDtBQUNIOztBQUVELGdCQUFNVyxlQUFlbEUsRUFBRSxJQUFGLEVBQVFnRCxVQUFSLEVBQXJCO0FBQ0EsZ0JBQU1tQixxQkFBcUJ2QixTQUFTVyx3QkFBd0JhLFFBQWpDLENBQTNCOztBQUVBLGdCQUFJRixlQUFlQyxrQkFBbkIsRUFBdUM7QUFDbkM7QUFDQXBFLHNCQUFNUyxJQUFOLENBQVcsT0FBWCxFQUFvQmUsSUFBcEIsQ0FBeUIsVUFBQ3VDLENBQUQsRUFBSUMsS0FBSixFQUFjO0FBQ25DL0Qsc0JBQUUrRCxLQUFGLEVBQVN2RCxJQUFULENBQWMsSUFBZCxFQUFvQmUsSUFBcEIsQ0FBeUIsVUFBQ3VDLENBQUQsRUFBSXhCLEVBQUosRUFBVztBQUNoQ3RDLDBCQUFFc0MsRUFBRixFQUFNOUIsSUFBTixDQUFXLElBQVgsRUFBaUJ3RCxFQUFqQixDQUFvQnJELEtBQXBCLEVBQ0txQyxVQURMLENBQ2dCbUIsa0JBRGhCLEVBRUt0QixHQUZMLENBRVMsV0FGVCxFQUVzQnNCLGtCQUZ0QixFQUdLdEIsR0FITCxDQUdTLFdBSFQsRUFHc0JzQixrQkFIdEI7QUFJSCxxQkFMRDtBQU1ILGlCQVBEO0FBUUg7QUFDSixTQS9CRDtBQWdDSDs7QUFFRDs7O0FBR0EsYUFBU0UsZ0JBQVQsR0FBNEI7QUFDeEI7QUFDQTtBQUNBLFlBQUlDLFdBQVdDLFlBQVksWUFBWTtBQUNuQyxnQkFBSXhFLE1BQU1TLElBQU4sQ0FBVywwQkFBWCxFQUF1Q0MsTUFBdkMsS0FBa0QsQ0FBdEQsRUFBeUQ7QUFDckQ2QztBQUNBVztBQUNBeEI7O0FBRUE7QUFDQTFDLHNCQUFNUyxJQUFOLENBQVcseUJBQVgsRUFBc0NlLElBQXRDLENBQTJDLFVBQVVaLEtBQVYsRUFBaUJvQyxFQUFqQixFQUFxQjtBQUM1RCx3QkFBSS9DLEVBQUUrQyxFQUFGLEVBQU1WLFFBQU4sQ0FBZSxRQUFmLENBQUosRUFBOEI7QUFDMUJ0Qyw4QkFBTVMsSUFBTixDQUFXLFVBQVgsRUFBdUJlLElBQXZCLENBQTRCLFVBQVV1QyxDQUFWLEVBQWF4QixFQUFiLEVBQWlCO0FBQ3pDdEMsOEJBQUVzQyxFQUFGLEVBQU05QixJQUFOLENBQVcsV0FBV0csS0FBWCxHQUFtQixHQUE5QixFQUFtQzRCLFFBQW5DLENBQTRDLFFBQTVDO0FBQ0gseUJBRkQ7QUFHSDtBQUNKLGlCQU5EOztBQVFBO0FBQ0Esb0JBQUl4QyxNQUFNUyxJQUFOLENBQVcsaUJBQVgsRUFBOEJDLE1BQWxDLEVBQTBDO0FBQ3RDViwwQkFBTVMsSUFBTixDQUFXLFVBQVgsRUFBdUJlLElBQXZCLENBQTRCLFVBQVVaLEtBQVYsRUFBaUIyQixFQUFqQixFQUFxQjtBQUM3Qyw0QkFBSXRDLEVBQUVzQyxFQUFGLEVBQU05QixJQUFOLENBQVcseUJBQVgsRUFBc0NDLE1BQTFDLEVBQWtEO0FBQzlDLG1DQUFPLElBQVA7QUFDSDtBQUNESSxxREFBNkJiLEVBQUVzQyxFQUFGLENBQTdCO0FBQ0FqQixzREFBOEJyQixFQUFFc0MsRUFBRixDQUE5QjtBQUNILHFCQU5EO0FBT0g7O0FBRURrQyw4QkFBY0YsUUFBZDtBQUNIO0FBQ0osU0E1QmMsRUE0QlosR0E1QlksQ0FBZjtBQTZCSDs7QUFFRDs7O0FBR0EsYUFBU0csZUFBVCxHQUEyQjtBQUN2QjFFLGNBQU1TLElBQU4sQ0FBVyxhQUFYLEVBQTBCd0MsVUFBMUIsQ0FBcUNqRCxNQUFNaUQsVUFBTixFQUFyQztBQUNBTTtBQUNBVztBQUNBeEI7QUFDSDs7QUFFRDs7O0FBR0EsYUFBU2lDLGdCQUFULEdBQTRCO0FBQ3hCM0UsY0FBTVMsSUFBTixDQUFXTCxRQUFRRCx3QkFBbkIsRUFBNkN5RSxJQUE3QztBQUNBcEU7O0FBRUFGLDRCQUFvQk4sTUFBTTZFLFNBQU4sR0FBa0JDLElBQWxCLEdBQXlCQyxPQUE3QztBQUNBeEUseUJBQWlCLENBQWpCOztBQUVBRCwwQkFBa0JtRCxPQUFsQixDQUEwQixVQUFDQyxnQkFBRCxFQUFzQjtBQUM1Q25ELDhCQUFrQm1ELGlCQUFpQkUsV0FBakIsSUFBZ0MsQ0FBbEQ7QUFDSCxTQUZEOztBQUlBNUQsY0FBTWdGLEVBQU4sQ0FBUyxTQUFULEVBQW9CVixnQkFBcEI7QUFDQXJFLFVBQUVnRixNQUFGLEVBQVVELEVBQVYsQ0FBYSxRQUFiLEVBQXVCTixlQUF2Qjs7QUFFQUE7QUFDSDs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE5RSxXQUFPa0YsSUFBUCxHQUFjLFVBQVVJLElBQVYsRUFBZ0I7QUFDMUJsRixjQUFNZ0YsRUFBTixDQUFTLFNBQVQsRUFBb0JMLGdCQUFwQjs7QUFFQTFFLFVBQUVnRixNQUFGLEVBQVVELEVBQVYsQ0FBYSx3QkFBYixFQUF1QyxZQUFNO0FBQ3pDLGdCQUFJaEYsTUFBTTZFLFNBQU4sR0FBa0JNLElBQWxCLENBQXVCQyxJQUF2QixPQUFrQ0MsU0FBdEMsRUFBaUQ7QUFDN0NWO0FBQ0g7QUFDSixTQUpEOztBQU1BM0UsY0FBTVMsSUFBTixDQUFXTCxRQUFRRCx3QkFBbkIsRUFBNkMyQixJQUE3Qzs7QUFFQW9EO0FBQ0gsS0FaRDs7QUFjQSxXQUFPdEYsTUFBUDtBQUVILENBbFpMIiwiZmlsZSI6ImRhdGF0YWJsZV9yZXNwb25zaXZlX2NvbHVtbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGRhdGF0YWJsZV9yZXNwb25zaXZlX2NvbHVtbnMuanMgMjAxNy0wMy0wOFxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTcgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgRW5hYmxlIERhdGFUYWJsZSBSZXNwb25zaXZlIENvbHVtbnNcbiAqXG4gKiBUaGlzIG1vZHVsZSB3aWxsIGVuYWJsZSB0aGUgcmVzcG9uc2l2ZSBjb2x1bW5zIGZ1bmN0aW9uYWxpdHkgd2hpY2ggd2lsbCByZXNpemUgdGhlIGNvbHVtbnMgdW50aWwgYSBtaW5pbXVtXG4gKiB3aWR0aCBpcyByZWFjaC4gQWZ0ZXJ3YXJkcyB0aGUgY29sdW1ucyB3aWxsIGJlIGhpZGRlbiBhbmQgdGhlIGNvbnRlbnQgd2lsbCBiZSBkaXNwbGF5ZWQgYnkgdGhyb3VnaCBhbiBpY29uXG4gKiB0b29sdGlwLlxuICpcbiAqICMjIyBPcHRpb25zXG4gKlxuICogKipJbml0aWFsIFZpc2liaWxpdHkgVG9nZ2xlIFNlbGVjdG9yIHwgYGRhdGEtZGF0YV9yZWxhdGl2ZV9jb2x1bW5zLXZpc2liaWxpdHktdG9nZ2xlLXNlbGVjdG9yYCB8IFN0cmluZyB8IE9wdGlvbmFsKipcbiAqXG4gKiBQcm92aWRlIGEgc2VsZWN0b3IgcmVsYXRpdmUgdG8gZWFjaCB0aGVhZCA+IHRyIGVsZW1lbnQgaW4gb3JkZXIgdG8gaGlkZSB0aGUgY29sdW1uIG9uIHBhZ2UgbG9hZCBhbmQgdGhlbiBzaG93IGl0XG4gKiBhZ2FpbiBvbmNlIHRoZSByZXNwb25zaXZlIHdpZHRocyBoYXZlIGJlZW4gY2FsY3VsYXRlZC4gVGhlIHByb3ZpZGVkIHNlbGVjdG9yIG11c3QgcG9pbnQgdG8gdGhlIGJpZ2dlc3QgY29sdW1uIGluXG4gKiBvcmRlciB0byBhdm9pZCBicm9rZW4gZGlzcGxheXMgdGlsbCB0aGUgdGFibGUgYmVjb21lcyByZXNwb25zaXZlLlxuICpcbiAqIEBtb2R1bGUgQWRtaW4vRXh0ZW5zaW9ucy9kYXRhX3JlbGF0aXZlX2NvbHVtbnNcbiAqL1xuZ3guZXh0ZW5zaW9ucy5tb2R1bGUoXG4gICAgJ2RhdGF0YWJsZV9yZXNwb25zaXZlX2NvbHVtbnMnLFxuXG4gICAgW1xuICAgICAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3IvcXRpcDIvanF1ZXJ5LnF0aXAubWluLmNzc2AsXG4gICAgICAgIGAke2pzZS5zb3VyY2V9L3ZlbmRvci9xdGlwMi9qcXVlcnkucXRpcC5taW4uanNgLFxuICAgIF0sXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEVTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGVmYXVsdCBPcHRpb25zXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIHZpc2liaWxpdHlUb2dnbGVTZWxlY3RvcjogJ1tkYXRhLWNvbHVtbi1uYW1lPVwiYWN0aW9uc1wiXSdcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmluYWwgT3B0aW9uc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBJbnN0YW5jZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgbW9kdWxlID0ge307XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERhdGFUYWJsZSBJbml0aWFsaXphdGlvbiBDb2x1bW5zXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgICAgICovXG4gICAgICAgIGxldCBjb2x1bW5EZWZpbml0aW9ucztcblxuICAgICAgICAvKipcbiAgICAgICAgICogV2lkdGggRmFjdG9yIFN1bVxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IHdpZHRoRmFjdG9yU3VtO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBGVU5DVElPTlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVwZGF0ZSBlbXB0eSB0YWJsZSBcImNvbHNwYW5cIiBhdHRyaWJ1dGUuXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoaXMgbWV0aG9kIHdpbGwga2VlcCB0aGUgZW1wdHkgdGFibGUgcm93IHdpZHRoIGluIHN5bmMgd2l0aCB0aGUgdGFibGUgd2lkdGguXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfdXBkYXRlRW1wdHlUYWJsZUNvbFNwYW4oKSB7XG4gICAgICAgICAgICBpZiAoJHRoaXMuZmluZCgnLmRhdGFUYWJsZXNfZW1wdHknKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29sc3BhbiA9ICgkdGhpcy5maW5kKCd0aGVhZDpmaXJzdCB0cjpmaXJzdCAuYWN0aW9ucycpLmluZGV4KCkgKyAxKVxuICAgICAgICAgICAgICAgICAgICAtICR0aGlzLmZpbmQoJ3RoZWFkOmZpcnN0IHRyOmZpcnN0IHRoLmhpZGRlbicpLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCcuZGF0YVRhYmxlc19lbXB0eScpLmF0dHIoJ2NvbHNwYW4nLCBjb2xzcGFuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBZGQgaGlkZGVuIGNvbHVtbnMgY29udGVudCBpY29uIHRvIGFjdGlvbnMgY2VsbCBvZiBhIHNpbmdsZSByb3cuXG4gICAgICAgICAqXG4gICAgICAgICAqIENhbGwgdGhpcyBtZXRob2Qgb25seSBpZiB5b3UgYXJlIHN1cmUgdGhlcmUgaXMgbm8gaWNvbiBwcmV2aW91c2x5IHNldCAocnVucyBmYXN0ZXIpLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJHRyXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfYWRkSGlkZGVuQ29sdW1uc0NvbnRlbnRJY29uKCR0cikge1xuICAgICAgICAgICAgJHRyLmZpbmQoJ3RkLmFjdGlvbnMgZGl2OmZpcnN0JylcbiAgICAgICAgICAgICAgICAucHJlcGVuZChgPGkgY2xhc3M9XCJmYSBmYS1lbGxpcHNpcy1oIG1ldGEtaWNvbiBoaWRkZW4tY29sdW1ucy1jb250ZW50XCI+PC9pPmApO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldCB0aGUgY2VsbCBjb250ZW50LlxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGlzIG1ldGhvZCB3aWxsIGFsc28gc2VhcmNoIGZvciBjaGlsZCBpbnB1dCBhbmQgc2VsZWN0IGVsZW1lbnRzIGFuZCByZXR1cm4gdGhlIGFwcHJvcHJpYXRlIGNvbnRlbnQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAkdGQgVGFibGUgY2VsbCB0byBiZSBleGFtaW5lZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2dldENlbGxDb250ZW50KCR0ZCkge1xuICAgICAgICAgICAgaWYgKCR0ZC5maW5kKCdzZWxlY3QnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHRkLmZpbmQoJ3NlbGVjdCBvcHRpb246c2VsZWN0ZWQnKS50ZXh0KCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCR0ZC5maW5kKCdpbnB1dDp0ZXh0JykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICR0ZC5maW5kKCdpbnB1dDp0ZXh0JykudmFsKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCR0ZC5maW5kKCdpbnB1dDpjaGVja2JveCcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAkdGQuZmluZCgnaW5wdXQ6Y2hlY2tib3gnKS5wcm9wKCdjaGVja2VkJykgPyAn4pyUJyA6ICfinJgnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHRkLnRleHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZW5lcmF0ZXMgYW5kIHNldHMgdGhlIHRvb2x0aXAgY29udGVudCBmb3IgdGhlIGhpZGRlbiBjb2x1bW5zIGNvbnRlbnQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAkdHIgVGhlIGN1cnJlbnQgcm93IHNlbGVjdG9yLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2dlbmVyYXRlSGlkZGVuQ29sdW1uc0NvbnRlbnQoJHRyKSB7XG4gICAgICAgICAgICBsZXQgaGlkZGVuQ29sdW1uQ29udGVudEh0bWwgPSAnJztcblxuICAgICAgICAgICAgJHRyLmZpbmQoJ3RkLmhpZGRlbicpLmVhY2goKGluZGV4LCB0ZCkgPT4ge1xuICAgICAgICAgICAgICAgIGhpZGRlbkNvbHVtbkNvbnRlbnRIdG1sICs9ICR0aGlzLmZpbmQoYHRoZWFkOmZpcnN0IHRyOmZpcnN0IHRoOmVxKCR7JCh0ZCkuaW5kZXgoKX0pYCkudGV4dCgpXG4gICAgICAgICAgICAgICAgICAgICsgJzogJyArIF9nZXRDZWxsQ29udGVudCgkKHRkKSkgKyAnPGJyLz4nO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICR0ci5maW5kKCcuaGlkZGVuLWNvbHVtbnMtY29udGVudCcpLnF0aXAoe1xuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGhpZGRlbkNvbHVtbkNvbnRlbnRIdG1sLFxuICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZXM6ICdneC1xdGlwIGluZm8nXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBoaWRlOiB7XG4gICAgICAgICAgICAgICAgICAgIGZpeGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBkZWxheTogMzAwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSGlkZSBEYXRhVGFibGUgQ29sdW1uc1xuICAgICAgICAgKlxuICAgICAgICAgKiBUaGlzIG1ldGhvZCBpcyBwYXJ0IG9mIHRoZSByZXNwb25zaXZlIHRhYmxlcyBzb2x1dGlvbi5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnl9ICR0YXJnZXRXcmFwcGVyIFRhcmdldCBkYXRhdGFibGUgaW5zdGFuY2Ugd3JhcHBlciBkaXYuXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAkZmlyc3RIaWRkZW5Db2x1bW4gVGhlIGZpcnN0IGhpZGRlbiBjb2x1bW4gKGZpcnN0IGNvbHVtbiB3aXRoIHRoZSAuaGlkZGVuIGNsYXNzKS5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9oaWRlQ29sdW1ucygkdGFyZ2V0V3JhcHBlciwgJGZpcnN0SGlkZGVuQ29sdW1uKSB7XG4gICAgICAgICAgICBjb25zdCAkbGFzdFZpc2libGVDb2x1bW4gPSAoJGZpcnN0SGlkZGVuQ29sdW1uLmxlbmd0aCAhPT0gMClcbiAgICAgICAgICAgICAgICA/ICRmaXJzdEhpZGRlbkNvbHVtbi5wcmV2KClcbiAgICAgICAgICAgICAgICA6ICR0aGlzLmZpbmQoJ3RoZWFkOmZpcnN0IHRoLmFjdGlvbnMnKS5wcmV2KCk7XG5cbiAgICAgICAgICAgIGlmICgkbGFzdFZpc2libGVDb2x1bW4uaGFzQ2xhc3MoJ2hpZGRlbicpIHx8ICRsYXN0VmlzaWJsZUNvbHVtbi5pbmRleCgpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuOyAvLyBGaXJzdCBjb2x1bW4gb3IgYWxyZWFkeSBoaWRkZW4sIGRvIG5vdCBjb250aW51ZS5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU2hvdyBoaWRkZW4gY29sdW1uIGNvbnRlbnQgaWNvbi5cbiAgICAgICAgICAgIGlmICgkdGhpcy5maW5kKCcuaGlkZGVuLWNvbHVtbnMtY29udGVudCcpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICR0aGlzLmZpbmQoJ3Rib2R5IHRyJykuZWFjaCgoaW5kZXgsIHRyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIF9hZGRIaWRkZW5Db2x1bW5zQ29udGVudEljb24oJCh0cikpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBIaWRlIHRoZSBsYXN0IHZpc2libGUgY29sdW1uLlxuICAgICAgICAgICAgJHRoaXMuZmluZCgndHInKS5lYWNoKChpbmRleCwgdHIpID0+IHtcbiAgICAgICAgICAgICAgICAkKHRyKVxuICAgICAgICAgICAgICAgICAgICAuZmluZChgdGg6ZXEoJHskbGFzdFZpc2libGVDb2x1bW4uaW5kZXgoKX0pLCB0ZDplcSgkeyRsYXN0VmlzaWJsZUNvbHVtbi5pbmRleCgpfSlgKVxuICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXG4gICAgICAgICAgICAgICAgLy8gR2VuZXJhdGUgdGhlIGhpZGRlbiBjb2x1bW5zIGNvbnRlbnQuXG4gICAgICAgICAgICAgICAgX2dlbmVyYXRlSGlkZGVuQ29sdW1uc0NvbnRlbnQoJCh0cikpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIF91cGRhdGVFbXB0eVRhYmxlQ29sU3BhbigpO1xuXG4gICAgICAgICAgICAvLyBJZiB0aGVyZSBhcmUgc3RpbGwgY29sdW1ucyB3aGljaCBkb24ndCBmaXQgd2l0aGluIHRoZSB2aWV3cG9ydCwgaGlkZSB0aGVtLlxuICAgICAgICAgICAgaWYgKCR0YXJnZXRXcmFwcGVyLndpZHRoKCkgPCAkdGhpcy53aWR0aCgpICYmICRsYXN0VmlzaWJsZUNvbHVtbi5pbmRleCgpID4gMSkge1xuICAgICAgICAgICAgICAgIF90b2dnbGVDb2x1bW5zVmlzaWJpbGl0eSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNob3cgRGF0YVRhYmxlIENvbHVtbnNcbiAgICAgICAgICpcbiAgICAgICAgICogVGhpcyBtZXRob2QgaXMgcGFydCBvZiB0aGUgcmVzcG9uc2l2ZSB0YWJsZXMgc29sdXRpb24uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAkdGFyZ2V0V3JhcHBlciBUYXJnZXQgZGF0YXRhYmxlIGluc3RhbmNlIHdyYXBwZXIgZGl2LlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJGZpcnN0SGlkZGVuQ29sdW1uIFRoZSBmaXJzdCBoaWRkZW4gY29sdW1uIChmaXJzdCBjb2x1bW4gd2l0aCB0aGUgLmhpZGRlbiBjbGFzcykuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfc2hvd0NvbHVtbnMoJHRhcmdldFdyYXBwZXIsICRmaXJzdEhpZGRlbkNvbHVtbikge1xuICAgICAgICAgICAgaWYgKCRmaXJzdEhpZGRlbkNvbHVtbi5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGZpcnN0SGlkZGVuQ29sdW1uV2lkdGggPSBwYXJzZUludCgkZmlyc3RIaWRkZW5Db2x1bW4uY3NzKCdtaW4td2lkdGgnKSk7XG4gICAgICAgICAgICBsZXQgdGFibGVNaW5XaWR0aCA9IDA7XG5cbiAgICAgICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgdGFibGUgbWluIHdpZHRoIGJ5IGVhY2ggY29sdW1uIG1pbiB3aWR0aC5cbiAgICAgICAgICAgICR0aGlzLmZpbmQoJ3RoZWFkOmZpcnN0IHRyOmZpcnN0IHRoJykuZWFjaCgoaW5kZXgsIHRoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCEkKHRoKS5oYXNDbGFzcygnaGlkZGVuJykpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFibGVNaW5XaWR0aCArPSBwYXJzZUludCgkKHRoKS5jc3MoJ21pbi13aWR0aCcpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gU2hvdyB0aGUgZmlyc3QgaGlkZGVuIGNvbHVtbi5cbiAgICAgICAgICAgIGlmICh0YWJsZU1pbldpZHRoICsgZmlyc3RIaWRkZW5Db2x1bW5XaWR0aCA8PSAkdGFyZ2V0V3JhcHBlci5vdXRlcldpZHRoKCkpIHtcbiAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCd0cicpLmVhY2goKGluZGV4LCB0cikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAkKHRyKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbmQoYHRoOmVxKCR7JGZpcnN0SGlkZGVuQ29sdW1uLmluZGV4KCl9KSwgdGQ6ZXEoJHskZmlyc3RIaWRkZW5Db2x1bW4uaW5kZXgoKX0pYClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgX2dlbmVyYXRlSGlkZGVuQ29sdW1uc0NvbnRlbnQoJCh0cikpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgX3VwZGF0ZUVtcHR5VGFibGVDb2xTcGFuKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBIaWRlIGhpZGRlbiBjb2x1bW4gY29udGVudCBpY29uLlxuICAgICAgICAgICAgICAgIGlmICgkdGhpcy5maW5kKCd0aGVhZDpmaXJzdCB0cjpmaXJzdCB0aC5oaWRkZW4nKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuZmluZCgnLmhpZGRlbi1jb2x1bW5zLWNvbnRlbnQnKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZSBhcmUgc3RpbGwgY29sdW1ucyB3aGljaCB3b3VsZCBmaXQgZml0IHdpdGhpbiB0aGUgdmlld3BvcnQsIHNob3cgdGhlbS5cbiAgICAgICAgICAgICAgICBjb25zdCBuZXdUYWJsZU1pbldpZHRoID0gdGFibGVNaW5XaWR0aCArIGZpcnN0SGlkZGVuQ29sdW1uV2lkdGhcbiAgICAgICAgICAgICAgICAgICAgKyBwYXJzZUludCgkZmlyc3RIaWRkZW5Db2x1bW4ubmV4dCgnLmhpZGRlbicpLmNzcygnbWluLXdpZHRoJykpO1xuXG4gICAgICAgICAgICAgICAgaWYgKG5ld1RhYmxlTWluV2lkdGggPD0gJHRhcmdldFdyYXBwZXIub3V0ZXJXaWR0aCgpICYmICRmaXJzdEhpZGRlbkNvbHVtbi5uZXh0KCcuaGlkZGVuJykubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIF90b2dnbGVDb2x1bW5zVmlzaWJpbGl0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUb2dnbGUgY29sdW1uIHZpc2liaWxpdHkgZGVwZW5kaW5nIHRoZSB3aW5kb3cgc2l6ZS5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF90b2dnbGVDb2x1bW5zVmlzaWJpbGl0eSgpIHtcbiAgICAgICAgICAgIGNvbnN0ICR0YXJnZXRXcmFwcGVyID0gJHRoaXMucGFyZW50KCk7XG4gICAgICAgICAgICBjb25zdCAkZmlyc3RIaWRkZW5Db2x1bW4gPSAkdGhpcy5maW5kKCd0aGVhZDpmaXJzdCB0aC5oaWRkZW46Zmlyc3QnKTtcblxuICAgICAgICAgICAgaWYgKCR0YXJnZXRXcmFwcGVyLndpZHRoKCkgPCAkdGhpcy53aWR0aCgpKSB7XG4gICAgICAgICAgICAgICAgX2hpZGVDb2x1bW5zKCR0YXJnZXRXcmFwcGVyLCAkZmlyc3RIaWRkZW5Db2x1bW4pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfc2hvd0NvbHVtbnMoJHRhcmdldFdyYXBwZXIsICRmaXJzdEhpZGRlbkNvbHVtbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2FsY3VsYXRlIGFuZCBzZXQgdGhlIHJlbGF0aXZlIGNvbHVtbiB3aWR0aHMuXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoZSByZWxhdGl2ZSB3aWR0aCBjYWxjdWxhdGlvbiB3b3JrcyB3aXRoIGEgd2lkdGgtZmFjdG9yIHN5c3RlbSB3aGVyZSBlYWNoIGNvbHVtbiBwcmVzZXJ2ZXMgYVxuICAgICAgICAgKiBzcGVjaWZpYyBhbW91bnQgb2YgdGhlIHRhYmxlIHdpZHRoLlxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGlzIGZhY3RvciBpcyBub3QgZGVmaW5pbmcgYSBwZXJjZW50YWdlLCByYXRoZXIgb25seSBhIHdpZHRoLXZvbHVtZS4gUGVyY2VudGFnZSB3aWR0aHMgd2lsbCBub3RcbiAgICAgICAgICogd29yayBjb3JyZWN0bHkgd2hlbiB0aGUgdGFibGUgaGFzIGZld2VyIGNvbHVtbnMgdGhhbiB0aGUgb3JpZ2luYWwgc2V0dGluZ3MuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfYXBwbHlSZWxhdGl2ZUNvbHVtbldpZHRocygpIHtcbiAgICAgICAgICAgICR0aGlzLmZpbmQoJ3RoZWFkOmZpcnN0IHRyOmZpcnN0IHRoJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuY3NzKCdkaXNwbGF5JykgPT09ICdub25lJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudENvbHVtbkRlZmluaXRpb247XG5cbiAgICAgICAgICAgICAgICBjb2x1bW5EZWZpbml0aW9ucy5mb3JFYWNoKChjb2x1bW5EZWZpbml0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb2x1bW5EZWZpbml0aW9uLm5hbWUgPT09ICQodGhpcykuZGF0YSgnY29sdW1uTmFtZScpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50Q29sdW1uRGVmaW5pdGlvbiA9IGNvbHVtbkRlZmluaXRpb247XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50Q29sdW1uRGVmaW5pdGlvbiAmJiBjdXJyZW50Q29sdW1uRGVmaW5pdGlvbi53aWR0aEZhY3Rvcikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9ICQodGhpcykuaW5kZXgoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgd2lkdGggPSBNYXRoLnJvdW5kKGN1cnJlbnRDb2x1bW5EZWZpbml0aW9uLndpZHRoRmFjdG9yIC8gd2lkdGhGYWN0b3JTdW0gKiAxMDAgKiAxMDApIC8gMTAwO1xuICAgICAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCd0aGVhZCcpLmVhY2goKGksIHRoZWFkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoZWFkKS5maW5kKCd0cicpLmVhY2goKGksIHRyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0cikuZmluZCgndGgnKS5lcShpbmRleCkuY3NzKCd3aWR0aCcsIHdpZHRoICsgJyUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBcHBsaWVzIHRoZSBjb2x1bW4gd2lkdGggaWYgdGhlIGN1cnJlbnQgY29sdW1uIHdpZHRoIGlzIHNtYWxsZXIuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfYXBwbHlNaW5pbXVtQ29sdW1uV2lkdGhzKCkge1xuICAgICAgICAgICAgJHRoaXMuZmluZCgndGhlYWQ6Zmlyc3QgdHI6Zmlyc3QgdGgnKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmNzcygnZGlzcGxheScpID09PSAnbm9uZScpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRDb2x1bW5EZWZpbml0aW9uO1xuXG4gICAgICAgICAgICAgICAgY29sdW1uRGVmaW5pdGlvbnMuZm9yRWFjaCgoY29sdW1uRGVmaW5pdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29sdW1uRGVmaW5pdGlvbi5uYW1lID09PSAkKHRoaXMpLmRhdGEoJ2NvbHVtbk5hbWUnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudENvbHVtbkRlZmluaXRpb24gPSBjb2x1bW5EZWZpbml0aW9uO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWN1cnJlbnRDb2x1bW5EZWZpbml0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRXaWR0aCA9ICQodGhpcykub3V0ZXJXaWR0aCgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRlZmluaXRpb25NaW5XaWR0aCA9IHBhcnNlSW50KGN1cnJlbnRDb2x1bW5EZWZpbml0aW9uLm1pbldpZHRoKTtcblxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50V2lkdGggPCBkZWZpbml0aW9uTWluV2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRm9yY2UgdGhlIGNvcnJlY3QgY29sdW1uIG1pbi13aWR0aHMgZm9yIGFsbCB0aGVhZCBjb2x1bW5zLlxuICAgICAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCd0aGVhZCcpLmVhY2goKGksIHRoZWFkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoZWFkKS5maW5kKCd0cicpLmVhY2goKGksIHRyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0cikuZmluZCgndGgnKS5lcShpbmRleClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm91dGVyV2lkdGgoZGVmaW5pdGlvbk1pbldpZHRoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKCdtYXgtd2lkdGgnLCBkZWZpbml0aW9uTWluV2lkdGgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoJ21pbi13aWR0aCcsIGRlZmluaXRpb25NaW5XaWR0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogT24gRGF0YVRhYmxlIERyYXcgRXZlbnRcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vbkRhdGFUYWJsZURyYXcoKSB7XG4gICAgICAgICAgICAvLyBXYWl0IHVudGlsIHRoZSBjb250ZW50cyBvZiB0aGUgdGFibGUgYXJlIHJlbmRlcmVkLiBEYXRhVGFibGVzIHdpbGwgc29tZXRpbWVzIGZpcmUgdGhlIGRyYXcgZXZlbnRcbiAgICAgICAgICAgIC8vIGV2ZW4gYmVmb3JlIHRoZSB0ZCBlbGVtZW50cyBhcmUgcmVuZGVyZWQgaW4gdGhlIGJyb3dzZXIuXG4gICAgICAgICAgICB2YXIgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCR0aGlzLmZpbmQoJ3Rib2R5IHRyOmxhc3QgdGQuYWN0aW9ucycpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBfYXBwbHlSZWxhdGl2ZUNvbHVtbldpZHRocygpO1xuICAgICAgICAgICAgICAgICAgICBfYXBwbHlNaW5pbXVtQ29sdW1uV2lkdGhzKCk7XG4gICAgICAgICAgICAgICAgICAgIF90b2dnbGVDb2x1bW5zVmlzaWJpbGl0eSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIEhpZGUgdGhlIHRib2R5IGNlbGxzIGRlcGVuZGluZyBvbiB3aGV0aGVyIHRoZSByZXNwZWN0aXZlIDx0aD4gZWxlbWVudCBpcyBoaWRkZW4uXG4gICAgICAgICAgICAgICAgICAgICR0aGlzLmZpbmQoJ3RoZWFkOmZpcnN0IHRyOmZpcnN0IHRoJykuZWFjaChmdW5jdGlvbiAoaW5kZXgsIHRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aCkuaGFzQ2xhc3MoJ2hpZGRlbicpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMuZmluZCgndGJvZHkgdHInKS5lYWNoKGZ1bmN0aW9uIChpLCB0cikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRyKS5maW5kKCd0ZDplcSgnICsgaW5kZXggKyAnKScpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQWRkIHRoZSBoaWRkZW4gY29sdW1ucyBpY29uIGlmIG5lZWRlZC5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCR0aGlzLmZpbmQoJ3RoZWFkIHRoLmhpZGRlbicpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMuZmluZCgndGJvZHkgdHInKS5lYWNoKGZ1bmN0aW9uIChpbmRleCwgdHIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJCh0cikuZmluZCgnLmhpZGRlbi1jb2x1bW5zLWNvbnRlbnQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9hZGRIaWRkZW5Db2x1bW5zQ29udGVudEljb24oJCh0cikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9nZW5lcmF0ZUhpZGRlbkNvbHVtbnNDb250ZW50KCQodHIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgNTAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPbiBXaW5kb3cgUmVzaXplIEV2ZW50XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25XaW5kb3dSZXNpemUoKSB7XG4gICAgICAgICAgICAkdGhpcy5maW5kKCd0aGVhZC5maXhlZCcpLm91dGVyV2lkdGgoJHRoaXMub3V0ZXJXaWR0aCgpKTtcbiAgICAgICAgICAgIF9hcHBseVJlbGF0aXZlQ29sdW1uV2lkdGhzKCk7XG4gICAgICAgICAgICBfYXBwbHlNaW5pbXVtQ29sdW1uV2lkdGhzKCk7XG4gICAgICAgICAgICBfdG9nZ2xlQ29sdW1uc1Zpc2liaWxpdHkoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPbiBEYXRhVGFibGUgSW5pdGlhbGl6ZSBFdmVudFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uRGF0YVRhYmxlSW5pdCgpIHtcbiAgICAgICAgICAgICR0aGlzLmZpbmQob3B0aW9ucy52aXNpYmlsaXR5VG9nZ2xlU2VsZWN0b3IpLnNob3coKTtcbiAgICAgICAgICAgIF91cGRhdGVFbXB0eVRhYmxlQ29sU3BhbigpO1xuXG4gICAgICAgICAgICBjb2x1bW5EZWZpbml0aW9ucyA9ICR0aGlzLkRhdGFUYWJsZSgpLmluaXQoKS5jb2x1bW5zO1xuICAgICAgICAgICAgd2lkdGhGYWN0b3JTdW0gPSAwO1xuXG4gICAgICAgICAgICBjb2x1bW5EZWZpbml0aW9ucy5mb3JFYWNoKChjb2x1bW5EZWZpbml0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgd2lkdGhGYWN0b3JTdW0gKz0gY29sdW1uRGVmaW5pdGlvbi53aWR0aEZhY3RvciB8fCAwO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICR0aGlzLm9uKCdkcmF3LmR0JywgX29uRGF0YVRhYmxlRHJhdyk7XG4gICAgICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIF9vbldpbmRvd1Jlc2l6ZSk7XG5cbiAgICAgICAgICAgIF9vbldpbmRvd1Jlc2l6ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgICR0aGlzLm9uKCdpbml0LmR0JywgX29uRGF0YVRhYmxlSW5pdCk7XG5cbiAgICAgICAgICAgICQod2luZG93KS5vbignSlNFTkdJTkVfSU5JVF9GSU5JU0hFRCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoJHRoaXMuRGF0YVRhYmxlKCkuYWpheC5qc29uKCkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBfb25EYXRhVGFibGVJbml0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICR0aGlzLmZpbmQob3B0aW9ucy52aXNpYmlsaXR5VG9nZ2xlU2VsZWN0b3IpLmhpZGUoKTtcblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG5cbiAgICB9KTtcbiJdfQ==
