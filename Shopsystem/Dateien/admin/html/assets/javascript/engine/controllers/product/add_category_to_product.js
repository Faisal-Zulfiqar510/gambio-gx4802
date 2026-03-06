'use strict';

/* --------------------------------------------------------------
 add_category_to_product.js 2022-02-09
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2022 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Adds a category dropdown to the categories box by clicking on the add button
 *
 * @module Controllers/add_category_to_product
 */
gx.controllers.module('add_category_to_product', [],

/** @lends module:Controllers/add_category_to_product */

function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLE DEFINITION
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
    // EVENT HANDLERS
    // ------------------------------------------------------------------------

    /**
     * add category dropdown when clicking add button
     *
     * @private
     */
    var _addCategory = function _addCategory() {
        var $newCategory = $this.find('.category-template').clone().removeClass('category-template').addClass('category-link-wrapper').removeClass('hidden');

        $this.find('.category-link-wrapper:last').removeClass('remove-border').after($newCategory);

        $newCategory.find('select').prop('disabled', false).on('change', _changeCategory);
        $newCategory.attr('data-gx-widget', 'switcher');

        gx.widgets.init($('.linked-categories'));
    };

    /**
     * update displayed category path on dropdown change event
     *
     * @private
     */
    var _changeCategory = function _changeCategory() {
        var level = ($(this).find('option:selected').html().match(/&nbsp;/g) || []).length;
        var selectedOptionId = $(this).find('option:selected').val();
        var isOptionUnselected = selectedOptionId === "-1" || selectedOptionId === "0";
        var $mainCategoryInput = $(this).parents('.category-link-wrapper').find('input[name=main_category_id]');
        var categories = [];

        if (level > 0) {
            categories.unshift($(this).find('option:selected').html().replace(/&nbsp;/g, ''));
        }

        if (level > 3) {
            $(this).find('option:selected').prevAll().each(function () {
                if (($(this).html().match(/&nbsp;/g) || []).length === level - 3 && level > 3) {
                    level -= 3;
                    categories.unshift($(this).html().replace(/&nbsp;/g, ''));
                }
            });
        }

        $mainCategoryInput.switcher('disabled', isOptionUnselected);

        if ((!isOptionUnselected || $mainCategoryInput.prop('checked')) && !_hasMainCategoryAlreadyChecked($(this))) {
            _checkFirstMainCategory($(this));
        }

        $(this).parents('.category-link-wrapper').find('input[name=main_category_id]').val($(this).find('option:selected').val());

        $(this).parents('.category-link-wrapper').find('.category-path').html(categories.join(' > '));
    };

    /**
     * Update displayed categories list for multi select on change event.
     *
     * @private
     */
    var _changeCategoryMultiSelect = function _changeCategoryMultiSelect() {
        var level,
            processedLevel,
            categories = [],
            categoryPathArray = [],
            selected = $(this).find('option:selected'),
            $multiSelectContainer = $('.multi-select-container').parent();

        $.each(selected, function () {
            level = ($(this).html().match(/&nbsp;/g) || []).length;
            processedLevel = level;
            if (level > 0) {
                categoryPathArray = [];
                categoryPathArray.unshift($(this).html().replace(/&nbsp;/g, ''));

                $(this).prevAll().each(function () {
                    if (($(this).html().match(/&nbsp;/g) || []).length === processedLevel - 3 && processedLevel > 3) {

                        processedLevel -= 3;
                        categoryPathArray.unshift($(this).html().replace(/&nbsp;/g, ''));
                    }
                });
                categories.push(categoryPathArray);
            }
        });

        $multiSelectContainer.empty();
        if (categories.length > 0) {
            $.each(categories, function () {
                $multiSelectContainer.append('<div class="span12 multi-select-container">' + '<label class="category-path">' + this.join(' > ') + '</label></div>');
            });
        } else {
            $multiSelectContainer.append('<div class="span12 multi-select-container"></div>');
        }
    };

    /**
     * Checks the first main category switcher.
     *
     * @private
     */
    var _checkFirstMainCategory = function _checkFirstMainCategory(element) {
        var firstMainCategory = element.parents('.linked-categories').find('input[name=main_category_id]').not(':disabled')[0];

        $(firstMainCategory).switcher('checked', true).trigger('change');
    };

    /**
     * Checks a main category is already checked.
     *
     * @private
     */
    var _hasMainCategoryAlreadyChecked = function _hasMainCategoryAlreadyChecked(element) {
        var switchers = element.parents('.linked-categories').find('input[name=main_category_id]');
        var hasMainCategoryChecked = false;

        switchers.each(function (index, switcher) {
            if ($(switcher).prop("checked")) {
                hasMainCategoryChecked = true;
                return false;
            }
        });

        return hasMainCategoryChecked;
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    /**
     * Init function of the widget
     */
    module.init = function (done) {
        var select = $this.find('select');
        $this.find('.add-category').on('click', _addCategory);

        if (select.prop('multiple')) {
            select.on('change', _changeCategoryMultiSelect);
            //select.on('change', _changeCategory);
        } else {
            select.on('change', _changeCategory);
        }

        done();
    };

    // Return data to widget engine
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2R1Y3QvYWRkX2NhdGVnb3J5X3RvX3Byb2R1Y3QuanMiXSwibmFtZXMiOlsiZ3giLCJjb250cm9sbGVycyIsIm1vZHVsZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJkZWZhdWx0cyIsIm9wdGlvbnMiLCJleHRlbmQiLCJfYWRkQ2F0ZWdvcnkiLCIkbmV3Q2F0ZWdvcnkiLCJmaW5kIiwiY2xvbmUiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwiYWZ0ZXIiLCJwcm9wIiwib24iLCJfY2hhbmdlQ2F0ZWdvcnkiLCJhdHRyIiwid2lkZ2V0cyIsImluaXQiLCJsZXZlbCIsImh0bWwiLCJtYXRjaCIsImxlbmd0aCIsInNlbGVjdGVkT3B0aW9uSWQiLCJ2YWwiLCJpc09wdGlvblVuc2VsZWN0ZWQiLCIkbWFpbkNhdGVnb3J5SW5wdXQiLCJwYXJlbnRzIiwiY2F0ZWdvcmllcyIsInVuc2hpZnQiLCJyZXBsYWNlIiwicHJldkFsbCIsImVhY2giLCJzd2l0Y2hlciIsIl9oYXNNYWluQ2F0ZWdvcnlBbHJlYWR5Q2hlY2tlZCIsIl9jaGVja0ZpcnN0TWFpbkNhdGVnb3J5Iiwiam9pbiIsIl9jaGFuZ2VDYXRlZ29yeU11bHRpU2VsZWN0IiwicHJvY2Vzc2VkTGV2ZWwiLCJjYXRlZ29yeVBhdGhBcnJheSIsInNlbGVjdGVkIiwiJG11bHRpU2VsZWN0Q29udGFpbmVyIiwicGFyZW50IiwicHVzaCIsImVtcHR5IiwiYXBwZW5kIiwiZWxlbWVudCIsImZpcnN0TWFpbkNhdGVnb3J5Iiwibm90IiwidHJpZ2dlciIsInN3aXRjaGVycyIsImhhc01haW5DYXRlZ29yeUNoZWNrZWQiLCJpbmRleCIsImRvbmUiLCJzZWxlY3QiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7QUFLQUEsR0FBR0MsV0FBSCxDQUFlQyxNQUFmLENBQ0kseUJBREosRUFHSSxFQUhKOztBQUtJOztBQUVBLFVBQVVDLElBQVYsRUFBZ0I7O0FBRVo7O0FBRUE7QUFDQTtBQUNBOztBQUVB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U29CLEtBQVQsRUFBZ0JuQixRQUFoQixFQUEwQjtBQUNyQyxnQkFBSS9CLEVBQUUrQixRQUFGLEVBQVlwQixJQUFaLENBQWlCLFNBQWpCLENBQUosRUFBaUM7QUFDN0JzQyx5Q0FBeUIsSUFBekI7QUFDQSx1QkFBTyxLQUFQO0FBQ0g7QUFDSixTQUxEOztBQU9BLGVBQU9BLHNCQUFQO0FBQ0gsS0FiRDs7QUFlQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBcEQsV0FBT21CLElBQVAsR0FBYyxVQUFVbUMsSUFBVixFQUFnQjtBQUMxQixZQUFJQyxTQUFTckQsTUFBTU8sSUFBTixDQUFXLFFBQVgsQ0FBYjtBQUNBUCxjQUFNTyxJQUFOLENBQVcsZUFBWCxFQUE0Qk0sRUFBNUIsQ0FBK0IsT0FBL0IsRUFBd0NSLFlBQXhDOztBQUVBLFlBQUlnRCxPQUFPekMsSUFBUCxDQUFZLFVBQVosQ0FBSixFQUE2QjtBQUN6QnlDLG1CQUFPeEMsRUFBUCxDQUFVLFFBQVYsRUFBb0J1QiwwQkFBcEI7QUFDQTtBQUNILFNBSEQsTUFHTztBQUNIaUIsbUJBQU94QyxFQUFQLENBQVUsUUFBVixFQUFvQkMsZUFBcEI7QUFDSDs7QUFFRHNDO0FBQ0gsS0FaRDs7QUFjQTtBQUNBLFdBQU90RCxNQUFQO0FBQ0gsQ0E5TkwiLCJmaWxlIjoicHJvZHVjdC9hZGRfY2F0ZWdvcnlfdG9fcHJvZHVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gYWRkX2NhdGVnb3J5X3RvX3Byb2R1Y3QuanMgMjAyMi0wMi0wOVxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMjIgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgQWRkcyBhIGNhdGVnb3J5IGRyb3Bkb3duIHRvIHRoZSBjYXRlZ29yaWVzIGJveCBieSBjbGlja2luZyBvbiB0aGUgYWRkIGJ1dHRvblxuICpcbiAqIEBtb2R1bGUgQ29udHJvbGxlcnMvYWRkX2NhdGVnb3J5X3RvX3Byb2R1Y3RcbiAqL1xuZ3guY29udHJvbGxlcnMubW9kdWxlKFxuICAgICdhZGRfY2F0ZWdvcnlfdG9fcHJvZHVjdCcsXG5cbiAgICBbXSxcblxuICAgIC8qKiBAbGVuZHMgbW9kdWxlOkNvbnRyb2xsZXJzL2FkZF9jYXRlZ29yeV90b19wcm9kdWN0ICovXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEUgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXJcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHZhciB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkdGhpcyA9ICQodGhpcyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRGVmYXVsdCBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZGVmYXVsdHMgPSB7fSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBGaW5hbCBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHZhciB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEVWRU5UIEhBTkRMRVJTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBhZGQgY2F0ZWdvcnkgZHJvcGRvd24gd2hlbiBjbGlja2luZyBhZGQgYnV0dG9uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX2FkZENhdGVnb3J5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyICRuZXdDYXRlZ29yeSA9ICR0aGlzLmZpbmQoJy5jYXRlZ29yeS10ZW1wbGF0ZScpXG4gICAgICAgICAgICAgICAgLmNsb25lKClcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2NhdGVnb3J5LXRlbXBsYXRlJylcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ2NhdGVnb3J5LWxpbmstd3JhcHBlcicpXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcblxuICAgICAgICAgICAgJHRoaXMuZmluZCgnLmNhdGVnb3J5LWxpbmstd3JhcHBlcjpsYXN0JylcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3JlbW92ZS1ib3JkZXInKVxuICAgICAgICAgICAgICAgIC5hZnRlcigkbmV3Q2F0ZWdvcnkpO1xuXG4gICAgICAgICAgICAkbmV3Q2F0ZWdvcnkuZmluZCgnc2VsZWN0JylcbiAgICAgICAgICAgICAgICAucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSlcbiAgICAgICAgICAgICAgICAub24oJ2NoYW5nZScsIF9jaGFuZ2VDYXRlZ29yeSk7XG4gICAgICAgICAgICAkbmV3Q2F0ZWdvcnlcbiAgICAgICAgICAgICAgICAuYXR0cignZGF0YS1neC13aWRnZXQnLCAnc3dpdGNoZXInKTtcbiAgICBcbiAgICBcbiAgICAgICAgICAgIGd4LndpZGdldHMuaW5pdCgkKCcubGlua2VkLWNhdGVnb3JpZXMnKSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIHVwZGF0ZSBkaXNwbGF5ZWQgY2F0ZWdvcnkgcGF0aCBvbiBkcm9wZG93biBjaGFuZ2UgZXZlbnRcbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfY2hhbmdlQ2F0ZWdvcnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbGV2ZWwgPSAoJCh0aGlzKS5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS5odG1sKCkubWF0Y2goLyZuYnNwOy9nKSB8fCBbXSkubGVuZ3RoO1xuICAgICAgICAgICAgdmFyIHNlbGVjdGVkT3B0aW9uSWQgPSAkKHRoaXMpLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIGlzT3B0aW9uVW5zZWxlY3RlZCA9IHNlbGVjdGVkT3B0aW9uSWQgPT09IFwiLTFcIiB8fCBzZWxlY3RlZE9wdGlvbklkID09PSBcIjBcIjtcbiAgICAgICAgICAgIHZhciAkbWFpbkNhdGVnb3J5SW5wdXQgPSAkKHRoaXMpLnBhcmVudHMoJy5jYXRlZ29yeS1saW5rLXdyYXBwZXInKS5maW5kKCdpbnB1dFtuYW1lPW1haW5fY2F0ZWdvcnlfaWRdJyk7XG4gICAgICAgICAgICB2YXIgY2F0ZWdvcmllcyA9IFtdO1xuXG4gICAgICAgICAgICBpZiAobGV2ZWwgPiAwKSB7XG4gICAgICAgICAgICAgICAgY2F0ZWdvcmllcy51bnNoaWZ0KCQodGhpcykuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykuaHRtbCgpLnJlcGxhY2UoLyZuYnNwOy9nLCAnJykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobGV2ZWwgPiAzKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCdvcHRpb246c2VsZWN0ZWQnKVxuICAgICAgICAgICAgICAgICAgICAucHJldkFsbCgpXG4gICAgICAgICAgICAgICAgICAgIC5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoJCh0aGlzKS5odG1sKCkubWF0Y2goLyZuYnNwOy9nKSB8fCBbXSkubGVuZ3RoID09PSBsZXZlbCAtIDMgJiYgbGV2ZWwgPiAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV2ZWwgLT0gMztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yaWVzLnVuc2hpZnQoJCh0aGlzKS5odG1sKCkucmVwbGFjZSgvJm5ic3A7L2csICcnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAkbWFpbkNhdGVnb3J5SW5wdXQuc3dpdGNoZXIoJ2Rpc2FibGVkJywgaXNPcHRpb25VbnNlbGVjdGVkKTtcbiAgICBcbiAgICAgICAgICAgIGlmICgoIWlzT3B0aW9uVW5zZWxlY3RlZCB8fCAkbWFpbkNhdGVnb3J5SW5wdXQucHJvcCgnY2hlY2tlZCcpKVxuICAgICAgICAgICAgICAgICYmICFfaGFzTWFpbkNhdGVnb3J5QWxyZWFkeUNoZWNrZWQoJCh0aGlzKSkpIHtcbiAgICAgICAgICAgICAgICBfY2hlY2tGaXJzdE1haW5DYXRlZ29yeSgkKHRoaXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCcuY2F0ZWdvcnktbGluay13cmFwcGVyJylcbiAgICAgICAgICAgICAgICAuZmluZCgnaW5wdXRbbmFtZT1tYWluX2NhdGVnb3J5X2lkXScpXG4gICAgICAgICAgICAgICAgLnZhbCgkKHRoaXMpLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLnZhbCgpKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCcuY2F0ZWdvcnktbGluay13cmFwcGVyJylcbiAgICAgICAgICAgICAgICAuZmluZCgnLmNhdGVnb3J5LXBhdGgnKVxuICAgICAgICAgICAgICAgIC5odG1sKGNhdGVnb3JpZXMuam9pbignID4gJykpO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVwZGF0ZSBkaXNwbGF5ZWQgY2F0ZWdvcmllcyBsaXN0IGZvciBtdWx0aSBzZWxlY3Qgb24gY2hhbmdlIGV2ZW50LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9jaGFuZ2VDYXRlZ29yeU11bHRpU2VsZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGxldmVsLFxuICAgICAgICAgICAgICAgIHByb2Nlc3NlZExldmVsLFxuICAgICAgICAgICAgICAgIGNhdGVnb3JpZXMgPSBbXSxcbiAgICAgICAgICAgICAgICBjYXRlZ29yeVBhdGhBcnJheSA9IFtdLFxuICAgICAgICAgICAgICAgIHNlbGVjdGVkID0gJCh0aGlzKS5maW5kKCdvcHRpb246c2VsZWN0ZWQnKSxcbiAgICAgICAgICAgICAgICAkbXVsdGlTZWxlY3RDb250YWluZXIgPSAkKCcubXVsdGktc2VsZWN0LWNvbnRhaW5lcicpLnBhcmVudCgpO1xuXG4gICAgICAgICAgICAkLmVhY2goc2VsZWN0ZWQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBsZXZlbCA9ICgkKHRoaXMpLmh0bWwoKS5tYXRjaCgvJm5ic3A7L2cpIHx8IFtdKS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgcHJvY2Vzc2VkTGV2ZWwgPSBsZXZlbDtcbiAgICAgICAgICAgICAgICBpZiAobGV2ZWwgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5UGF0aEFycmF5ID0gW107XG4gICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5UGF0aEFycmF5LnVuc2hpZnQoJCh0aGlzKS5odG1sKCkucmVwbGFjZSgvJm5ic3A7L2csICcnKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wcmV2QWxsKCkuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKCQodGhpcykuaHRtbCgpLm1hdGNoKC8mbmJzcDsvZykgfHwgW10pLmxlbmd0aCA9PT1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9jZXNzZWRMZXZlbCAtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3NlZExldmVsID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAzKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9jZXNzZWRMZXZlbCAtPSAzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5UGF0aEFycmF5LnVuc2hpZnQoJCh0aGlzKS5odG1sKCkucmVwbGFjZSgvJm5ic3A7L2csICcnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBjYXRlZ29yaWVzLnB1c2goY2F0ZWdvcnlQYXRoQXJyYXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkbXVsdGlTZWxlY3RDb250YWluZXIuZW1wdHkoKTtcbiAgICAgICAgICAgIGlmIChjYXRlZ29yaWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAkLmVhY2goY2F0ZWdvcmllcywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAkbXVsdGlTZWxlY3RDb250YWluZXIuYXBwZW5kKCc8ZGl2IGNsYXNzPVwic3BhbjEyIG11bHRpLXNlbGVjdC1jb250YWluZXJcIj4nXG4gICAgICAgICAgICAgICAgICAgICAgICArICc8bGFiZWwgY2xhc3M9XCJjYXRlZ29yeS1wYXRoXCI+JyArIHRoaXMuam9pbignID4gJykgKyAnPC9sYWJlbD48L2Rpdj4nKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJG11bHRpU2VsZWN0Q29udGFpbmVyLmFwcGVuZCgnPGRpdiBjbGFzcz1cInNwYW4xMiBtdWx0aS1zZWxlY3QtY29udGFpbmVyXCI+PC9kaXY+Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgXG4gICAgXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDaGVja3MgdGhlIGZpcnN0IG1haW4gY2F0ZWdvcnkgc3dpdGNoZXIuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX2NoZWNrRmlyc3RNYWluQ2F0ZWdvcnkgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgICB2YXIgZmlyc3RNYWluQ2F0ZWdvcnkgPSBlbGVtZW50LnBhcmVudHMoJy5saW5rZWQtY2F0ZWdvcmllcycpXG4gICAgICAgICAgICAgICAgLmZpbmQoJ2lucHV0W25hbWU9bWFpbl9jYXRlZ29yeV9pZF0nKVxuICAgICAgICAgICAgICAgIC5ub3QoJzpkaXNhYmxlZCcpWzBdO1xuICAgIFxuICAgICAgICAgICAgJChmaXJzdE1haW5DYXRlZ29yeSkuc3dpdGNoZXIoJ2NoZWNrZWQnLCB0cnVlKS50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICAgICAgfTtcbiAgICBcbiAgICBcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENoZWNrcyBhIG1haW4gY2F0ZWdvcnkgaXMgYWxyZWFkeSBjaGVja2VkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9oYXNNYWluQ2F0ZWdvcnlBbHJlYWR5Q2hlY2tlZCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHZhciBzd2l0Y2hlcnMgPSBlbGVtZW50LnBhcmVudHMoJy5saW5rZWQtY2F0ZWdvcmllcycpXG4gICAgICAgICAgICAgICAgLmZpbmQoJ2lucHV0W25hbWU9bWFpbl9jYXRlZ29yeV9pZF0nKTtcbiAgICAgICAgICAgIHZhciBoYXNNYWluQ2F0ZWdvcnlDaGVja2VkID0gZmFsc2U7XG4gICAgXG4gICAgICAgICAgICBzd2l0Y2hlcnMuZWFjaChmdW5jdGlvbihpbmRleCwgc3dpdGNoZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAoJChzd2l0Y2hlcikucHJvcChcImNoZWNrZWRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgaGFzTWFpbkNhdGVnb3J5Q2hlY2tlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGhhc01haW5DYXRlZ29yeUNoZWNrZWQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0IGZ1bmN0aW9uIG9mIHRoZSB3aWRnZXRcbiAgICAgICAgICovXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIHZhciBzZWxlY3QgPSAkdGhpcy5maW5kKCdzZWxlY3QnKTtcbiAgICAgICAgICAgICR0aGlzLmZpbmQoJy5hZGQtY2F0ZWdvcnknKS5vbignY2xpY2snLCBfYWRkQ2F0ZWdvcnkpO1xuXG4gICAgICAgICAgICBpZiAoc2VsZWN0LnByb3AoJ211bHRpcGxlJykpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3Qub24oJ2NoYW5nZScsIF9jaGFuZ2VDYXRlZ29yeU11bHRpU2VsZWN0KTtcbiAgICAgICAgICAgICAgICAvL3NlbGVjdC5vbignY2hhbmdlJywgX2NoYW5nZUNhdGVnb3J5KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0Lm9uKCdjaGFuZ2UnLCBfY2hhbmdlQ2F0ZWdvcnkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gUmV0dXJuIGRhdGEgdG8gd2lkZ2V0IGVuZ2luZVxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
