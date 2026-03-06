'use strict';

/* --------------------------------------------------------------
 scheme_categories.js 2019-07-12
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2019 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

gxmodules.controllers.module('scheme_categories', [], function (data) {
    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES DEFINITION
    // ------------------------------------------------------------------------

    var
    /**
     * Module Selector
     *
     * @type {jQuery}
     */
    $this = $(this),


    /**
     * Default Options
     *
     * @type {object}
     */
    defaults = {
        bequeathingState: 'input.bequeathing-state',
        categoryCheckbox: '.category-checkbox',
        categoryFolder: '.category-folder',
        categoryState: 'input.category-state',
        categorySubtree: 'ul.subtree',
        checkboxStates: ['self_all_sub_checked', 'self_some_sub_checked', 'self_no_sub_checked', 'no_self_all_sub_checked', 'no_self_some_sub_checked', 'no_self_no_sub_checked'],
        defaultCheckboxState: 'no_self_no_sub_checked',
        foldedClassName: 'folded',
        loadedClassName: 'loaded',
        schemeId: 0,
        selectAllCategories: '.select-all-categories',
        subcategoriesUrl: 'admin.php?do=GoogleShoppingAjax/getSubcategories',
        subtreeClassName: 'subtree',
        unfoldedClassName: 'unfolded'
    },


    /**
     * Final Options
     *
     * @type {object}
     */
    options = $.extend(true, {}, defaults, data),


    /**
     * Module Object
     *
     * @type {object}
     */
    module = {};

    // ------------------------------------------------------------------------
    // HELPER FUNCTIONS
    // ------------------------------------------------------------------------

    /**
     * Sets the "select all categories" checkbox to checked, if all categories are selected.
     *
     * @private
     */
    function _updateSelectAllCategoriesCheckbox() {
        var allChecked = true;
        $this.find(options.categoryState).each(function () {
            allChecked &= $(this).val() === 'self_all_sub';
        });

        if (allChecked) {
            $this.find(options.selectAllCategories).prop('checked', true);
        }
    };

    /**
     * Sets the state of all children checkboxes to given checkState value.
     *
     * @param $checkbox
     * @param checkState
     * @private
     */
    function _updateStateOfChildrenCheckboxes($checkbox, checkState) {
        var $children = $checkbox.parent('li').children(options.categorySubtree).children('li').children(options.categoryCheckbox);

        if ($children.length > 0) {
            $children.each(function () {
                _setCheckboxState($(this), checkState);
                _updateStateOfChildrenCheckboxes($(this), checkState);
            });
        }
    };

    /**
     * Updates the state of all parent checkboxes.
     *
     * @param $checkbox
     * @private
     */
    function _updateStateOfParentCheckboxes($checkbox) {
        var $subtree = $checkbox.closest(options.categorySubtree);

        if ($subtree.hasClass(options.subtreeClassName)) {
            var $parentCheckbox = $subtree.parent('li').children(options.categoryCheckbox);
            var checkState = _determineCheckboxState($parentCheckbox);
            _setCheckboxState($parentCheckbox, checkState);
            _updateStateOfParentCheckboxes($parentCheckbox);
        }
    };

    /**
     * Determines the state for the given checkbox.
     *
     * @param $checkbox
     * @returns {string}
     * @private
     */
    function _determineCheckboxState($checkbox) {
        var selfChecked = _isChecked($checkbox);
        var $childCategories = $checkbox.parent('li').children(options.categorySubtree).children('li').children(options.categoryCheckbox);
        var childCount = $childCategories.length;
        var childCheckCount = 0;
        var checkState = options.defaultCheckboxState;

        $childCategories.each(function () {
            if (!$(this).hasClass('no_self_no_sub_checked')) {
                childCheckCount++;
            }
            if (!$(this).hasClass('self_all_sub_checked')) {
                childCount++;
            }
        });

        if (selfChecked) {
            if (childCheckCount === childCount) {
                checkState = 'self_all_sub_checked';
            } else if (childCheckCount > 0) {
                checkState = 'self_some_sub_checked';
            } else if (childCheckCount === 0) {
                checkState = 'self_no_sub_checked';
            }
        } else {
            if (childCheckCount === childCount) {
                checkState = 'no_self_all_sub_checked';
            } else if (childCheckCount > 0) {
                checkState = 'no_self_some_sub_checked';
            } else if (childCheckCount === 0) {
                checkState = 'no_self_no_sub_checked';
            }
        }

        return checkState;
    };

    /**
     * Sets the state of the given checkbox.
     *
     * @param $checkbox
     * @param state
     * @private
     */
    function _setCheckboxState($checkbox, state) {
        _resetCheckbox($checkbox);
        $checkbox.addClass(state);
        $checkbox.parent('li').children(options.categoryState).val(state.substring(0, state.lastIndexOf('_')));
    };

    /**
     * Resets the state of the given checkbox.
     *
     * @param $checkbox
     * @private
     */
    function _resetCheckbox($checkbox) {
        for (var i = 0; i < options.checkboxStates.length; i++) {
            $checkbox.removeClass(options.checkboxStates[i]);
        }
    };

    /**
     * Returns the state of the given checkbox.
     *
     * @param $checkbox
     * @returns {string}
     * @private
     */
    function _getCheckboxState($checkbox) {
        for (var i = 0; i < options.checkboxStates.length; i++) {
            if ($checkbox.hasClass(options.checkboxStates[i])) {
                return options.checkboxStates[i];
            }
        }
        return options.defaultCheckboxState;
    };

    /**
     * Determines and sets new status of given checkbox.
     *
     * @param $checkbox
     * @returns {string}
     * @private
     */
    function _determineNewCheckboxState($checkbox) {
        var actualState = _getCheckboxState($checkbox);
        var newState = options.defaultCheckboxState;

        if ($checkbox.parent('li').children(options.categoryFolder).hasClass(options.foldedClassName) || $checkbox.parent('li').children(options.categoryFolder).hasClass(options.unfoldedClassName) && _getChildCount($checkbox) === 0) {
            switch (actualState) {
                case 'self_all_sub_checked':
                case 'self_some_sub_checked':
                case 'self_no_sub_checked':
                    newState = 'no_self_no_sub_checked';
                    break;

                case 'no_self_all_sub_checked':
                case 'no_self_some_sub_checked':
                case 'no_self_no_sub_checked':
                    newState = 'self_all_sub_checked';
                    break;

                default:
                    break;
            }
        } else {
            switch (actualState) {
                case 'self_all_sub_checked':
                    newState = 'no_self_all_sub_checked';
                    break;

                case 'self_some_sub_checked':
                    newState = 'no_self_some_sub_checked';
                    break;

                case 'self_no_sub_checked':
                    newState = 'no_self_no_sub_checked';
                    break;

                case 'no_self_all_sub_checked':
                    newState = 'self_all_sub_checked';
                    break;

                case 'no_self_some_sub_checked':
                    newState = 'self_some_sub_checked';
                    break;

                case 'no_self_no_sub_checked':
                    newState = 'self_no_sub_checked';
                    break;

                default:
                    break;
            }
        }

        return newState;
    };

    /**
     * Checks if given checkbox is checked.
     *
     * @param $checkbox
     * @returns {boolean}
     * @private
     */
    function _isChecked($checkbox) {
        return $checkbox.hasClass('self_all_sub_checked') || $checkbox.hasClass('self_some_sub_checked') || $checkbox.hasClass('self_no_sub_checked');
    };

    /**
     * Returns the count of children of the given checkbox.
     *
     * @param $checkbox
     * @returns {int}
     * @private
     */
    function _getChildCount($checkbox) {
        return $checkbox.parent('li').children(options.categorySubtree).children('li').length;
    };

    /**
     * Returns the inherited state of children checkboxes if exist, otherwise false.
     *
     * @param $checkbox
     * @returns {string|boolean}
     * @private
     */
    function _getInheritedStateOfChildren($checkbox) {
        while ($checkbox.hasClass(options.subtreeClassName)) {
            if ($checkbox.parent('li').children(options.categoryCheckbox).hasClass('pass_on_no_self_no_sub_checked')) {
                return 'no_self_no_sub_checked';
            } else if ($checkbox.parent('li').children(options.categoryCheckbox).hasClass('pass_on_self_all_sub_checked')) {
                return 'self_all_sub_checked';
            }

            $checkbox = $checkbox.parent('li').closest(options.categorySubtree);
        }

        return false;
    };

    /**
     * Updates the folder icon and its class (folded / unfolded).
     *
     * @param $folder
     * @private
     */
    function _toggleFolder($folder) {
        $folder.toggleClass(options.unfoldedClassName).toggleClass(options.foldedClassName);
        $folder.find('i.fa').toggleClass('fa-folder').toggleClass('fa-folder-open');
    }

    // ------------------------------------------------------------------------
    // EVENT HANDLERS
    // ------------------------------------------------------------------------

    /**
     * Handles the click event of a category.
     *
     * Loads subcategories of clicked category.
     *
     * @private
     */
    function _clickCategory() {
        var categoryId = $(this).data('category-id');
        var $this = $(this);

        if ($this.hasClass(options.loadedClassName) && $this.hasClass(options.foldedClassName)) {
            $this.parent('li').find(options.categorySubtree).show();
            _toggleFolder($this);
        } else if ($this.hasClass(options.loadedClassName) && $this.hasClass(options.unfoldedClassName)) {
            $this.parent('li').find(options.categorySubtree).hide();
            _toggleFolder($this);
        } else {
            $.ajax({
                type: "GET",
                dataType: "json",
                url: options.subcategoriesUrl + '&schemeId=' + options.schemeId + '&categoryId=' + categoryId,
                success: function success(response) {
                    if (response['success'] === true) {
                        $this.parent('li').find(options.categorySubtree + ':first').html(response.html);
                        $this.parent('li').find(options.categorySubtree + ':first ' + options.categoryFolder).on('click', _clickCategory);
                        $this.parent('li').find(options.categorySubtree + ':first ' + options.categoryCheckbox).on('click', _clickCheckbox);
                        $this.addClass(options.loadedClassName);

                        _toggleFolder($this);

                        var inheritedState = _getInheritedStateOfChildren($this.parent('li').children(options.categorySubtree));
                        if (inheritedState) {
                            $this.parent('li').children(options.categorySubtree).children('li').children(options.categoryCheckbox).each(function () {
                                _setCheckboxState($(this), inheritedState);
                            });
                        }
                    }

                    return response['success'];
                },
                error: function error() {
                    return false;
                }
            });
        }
    }

    /**
     * Handles the click event of checkboxes.
     *
     * Updates states of checkboxes.
     *
     * @private
     */
    function _clickCheckbox() {
        var $checkbox = $(this);
        var checked = _isChecked($checkbox) ? 'no_self_no_sub_checked' : 'self_all_sub_checked';
        var loaded = $checkbox.parent('li').children(options.categoryFolder).hasClass(options.loadedClassName);
        var folded = $checkbox.parent('li').children(options.categoryFolder).hasClass(options.foldedClassName);
        var newState = _determineNewCheckboxState($checkbox, checked);

        _setCheckboxState($checkbox, newState);

        $checkbox.parent('li').children(options.categoryState).val(newState.substring(0, newState.lastIndexOf('_')));

        if (folded) {
            $checkbox.removeClass('pass_on_no_self_no_sub_checked');
            $checkbox.removeClass('pass_on_self_all_sub_checked');
            $checkbox.addClass('pass_on_' + checked);

            if ($checkbox.hasClass('pass_on_no_self_no_sub_checked')) {
                $checkbox.parent('li').find(options.bequeathingState + ':first').val('no_self_no_sub');
            } else {
                $checkbox.parent('li').find(options.bequeathingState + ':first').val('self_all_sub');
            }

            if (loaded) {
                _updateStateOfChildrenCheckboxes($checkbox, checked);
            }
        }

        _updateStateOfParentCheckboxes($checkbox);

        if (checked !== 'self_all_sub_checked' && $(options.selectAllCategories).is(':checked')) {
            $(options.selectAllCategories).prop('checked', false);
            $(options.selectAllCategories).parent('.single-checkbox').removeClass('checked');
        } else if ($(options.categoryFolder).length === $(options.categoryCheckbox + '.self_all_sub_checked').length && !$(options.selectAllCategories).is(':checked')) {
            $(options.selectAllCategories).prop('checked', true);
            $(options.selectAllCategories).parent('.single-checkbox').addClass('checked');
        }
    };

    /**
     * Handles the change event of the "select all categories" checkbox.
     *
     * Updates all checkboxes in the categories tree (all checked / all unchecked)
     *
     * @returns {boolean}
     * @private
     */
    function _changeSelectAllCategoriesCheckbox() {
        var checked = $(this).is(':checked') ? 'self_all_sub_checked' : 'no_self_no_sub_checked';
        var passOn = $(this).is(':checked') ? 'pass_on_self_all_sub_checked' : 'pass_on_no_self_no_sub_checked';

        $(options.categoryCheckbox).each(function () {
            _setCheckboxState($(this), checked);
            $(this).removeClass('pass_on_self_all_sub_checked');
            $(this).removeClass('pass_on_no_self_no_sub_checked');
            $(this).addClass(passOn);

            if ($(this).hasClass('pass_on_no_self_no_sub_checked')) {
                $(this).parent('li').find(options.bequeathingState + ':first').val('no_self_no_sub');
            } else {
                $(this).parent('li').find(options.bequeathingState + ':first').val('self_all_sub');
            }
        });

        return true;
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {

        $this.find(options.categoryFolder).on('click', _clickCategory);
        $this.find(options.categoryCheckbox).on('click', _clickCheckbox);
        $this.find(options.selectAllCategories).on('change', _changeSelectAllCategoriesCheckbox);

        _updateSelectAllCategoriesCheckbox();

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFkbWluL0phdmFzY3JpcHQvY29udHJvbGxlcnMvc2NoZW1lX2NhdGVnb3JpZXMuanMiXSwibmFtZXMiOlsiZ3htb2R1bGVzIiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJkYXRhIiwiJHRoaXMiLCIkIiwiZGVmYXVsdHMiLCJiZXF1ZWF0aGluZ1N0YXRlIiwiY2F0ZWdvcnlDaGVja2JveCIsImNhdGVnb3J5Rm9sZGVyIiwiY2F0ZWdvcnlTdGF0ZSIsImNhdGVnb3J5U3VidHJlZSIsImNoZWNrYm94U3RhdGVzIiwiZGVmYXVsdENoZWNrYm94U3RhdGUiLCJmb2xkZWRDbGFzc05hbWUiLCJsb2FkZWRDbGFzc05hbWUiLCJzY2hlbWVJZCIsInNlbGVjdEFsbENhdGVnb3JpZXMiLCJzdWJjYXRlZ29yaWVzVXJsIiwic3VidHJlZUNsYXNzTmFtZSIsInVuZm9sZGVkQ2xhc3NOYW1lIiwib3B0aW9ucyIsImV4dGVuZCIsIl91cGRhdGVTZWxlY3RBbGxDYXRlZ29yaWVzQ2hlY2tib3giLCJhbGxDaGVja2VkIiwiZmluZCIsImVhY2giLCJ2YWwiLCJwcm9wIiwiX3VwZGF0ZVN0YXRlT2ZDaGlsZHJlbkNoZWNrYm94ZXMiLCIkY2hlY2tib3giLCJjaGVja1N0YXRlIiwiJGNoaWxkcmVuIiwicGFyZW50IiwiY2hpbGRyZW4iLCJsZW5ndGgiLCJfc2V0Q2hlY2tib3hTdGF0ZSIsIl91cGRhdGVTdGF0ZU9mUGFyZW50Q2hlY2tib3hlcyIsIiRzdWJ0cmVlIiwiY2xvc2VzdCIsImhhc0NsYXNzIiwiJHBhcmVudENoZWNrYm94IiwiX2RldGVybWluZUNoZWNrYm94U3RhdGUiLCJzZWxmQ2hlY2tlZCIsIl9pc0NoZWNrZWQiLCIkY2hpbGRDYXRlZ29yaWVzIiwiY2hpbGRDb3VudCIsImNoaWxkQ2hlY2tDb3VudCIsInN0YXRlIiwiX3Jlc2V0Q2hlY2tib3giLCJhZGRDbGFzcyIsInN1YnN0cmluZyIsImxhc3RJbmRleE9mIiwiaSIsInJlbW92ZUNsYXNzIiwiX2dldENoZWNrYm94U3RhdGUiLCJfZGV0ZXJtaW5lTmV3Q2hlY2tib3hTdGF0ZSIsImFjdHVhbFN0YXRlIiwibmV3U3RhdGUiLCJfZ2V0Q2hpbGRDb3VudCIsIl9nZXRJbmhlcml0ZWRTdGF0ZU9mQ2hpbGRyZW4iLCJfdG9nZ2xlRm9sZGVyIiwiJGZvbGRlciIsInRvZ2dsZUNsYXNzIiwiX2NsaWNrQ2F0ZWdvcnkiLCJjYXRlZ29yeUlkIiwic2hvdyIsImhpZGUiLCJhamF4IiwidHlwZSIsImRhdGFUeXBlIiwidXJsIiwic3VjY2VzcyIsInJlc3BvbnNlIiwiaHRtbCIsIm9uIiwiX2NsaWNrQ2hlY2tib3giLCJpbmhlcml0ZWRTdGF0ZSIsImVycm9yIiwiY2hlY2tlZCIsImxvYWRlZCIsImZvbGRlZCIsImlzIiwiX2NoYW5nZVNlbGVjdEFsbENhdGVnb3JpZXNDaGVja2JveCIsInBhc3NPbiIsImluaXQiLCJkb25lIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUFBLFVBQVVDLFdBQVYsQ0FBc0JDLE1BQXRCLENBQ0ksbUJBREosRUFHSSxFQUhKLEVBS0ksVUFBVUMsSUFBVixFQUFnQjtBQUNaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJOzs7OztBQUtBQyxZQUFRQyxFQUFFLElBQUYsQ0FOWjs7O0FBUUk7Ozs7O0FBS0FDLGVBQVc7QUFDUEMsMEJBQWtCLHlCQURYO0FBRVBDLDBCQUFrQixvQkFGWDtBQUdQQyx3QkFBZ0Isa0JBSFQ7QUFJUEMsdUJBQWUsc0JBSlI7QUFLUEMseUJBQWlCLFlBTFY7QUFNUEMsd0JBQWdCLENBQ1osc0JBRFksRUFFWix1QkFGWSxFQUdaLHFCQUhZLEVBSVoseUJBSlksRUFLWiwwQkFMWSxFQU1aLHdCQU5ZLENBTlQ7QUFjUEMsOEJBQXNCLHdCQWRmO0FBZVBDLHlCQUFpQixRQWZWO0FBZ0JQQyx5QkFBaUIsUUFoQlY7QUFpQlBDLGtCQUFVLENBakJIO0FBa0JQQyw2QkFBcUIsd0JBbEJkO0FBbUJQQywwQkFBa0Isa0RBbkJYO0FBb0JQQywwQkFBa0IsU0FwQlg7QUFx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QUFXQSxXQUFPcEYsTUFBUDtBQUNILENBbGZMIiwiZmlsZSI6IkFkbWluL0phdmFzY3JpcHQvY29udHJvbGxlcnMvc2NoZW1lX2NhdGVnb3JpZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIHNjaGVtZV9jYXRlZ29yaWVzLmpzIDIwMTktMDctMTJcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE5IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5neG1vZHVsZXMuY29udHJvbGxlcnMubW9kdWxlKFxuICAgICdzY2hlbWVfY2F0ZWdvcmllcycsXG5cbiAgICBbXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEVTIERFRklOSVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBEZWZhdWx0IE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgICAgICBiZXF1ZWF0aGluZ1N0YXRlOiAnaW5wdXQuYmVxdWVhdGhpbmctc3RhdGUnLFxuICAgICAgICAgICAgICAgIGNhdGVnb3J5Q2hlY2tib3g6ICcuY2F0ZWdvcnktY2hlY2tib3gnLFxuICAgICAgICAgICAgICAgIGNhdGVnb3J5Rm9sZGVyOiAnLmNhdGVnb3J5LWZvbGRlcicsXG4gICAgICAgICAgICAgICAgY2F0ZWdvcnlTdGF0ZTogJ2lucHV0LmNhdGVnb3J5LXN0YXRlJyxcbiAgICAgICAgICAgICAgICBjYXRlZ29yeVN1YnRyZWU6ICd1bC5zdWJ0cmVlJyxcbiAgICAgICAgICAgICAgICBjaGVja2JveFN0YXRlczogW1xuICAgICAgICAgICAgICAgICAgICAnc2VsZl9hbGxfc3ViX2NoZWNrZWQnLFxuICAgICAgICAgICAgICAgICAgICAnc2VsZl9zb21lX3N1Yl9jaGVja2VkJyxcbiAgICAgICAgICAgICAgICAgICAgJ3NlbGZfbm9fc3ViX2NoZWNrZWQnLFxuICAgICAgICAgICAgICAgICAgICAnbm9fc2VsZl9hbGxfc3ViX2NoZWNrZWQnLFxuICAgICAgICAgICAgICAgICAgICAnbm9fc2VsZl9zb21lX3N1Yl9jaGVja2VkJyxcbiAgICAgICAgICAgICAgICAgICAgJ25vX3NlbGZfbm9fc3ViX2NoZWNrZWQnXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBkZWZhdWx0Q2hlY2tib3hTdGF0ZTogJ25vX3NlbGZfbm9fc3ViX2NoZWNrZWQnLFxuICAgICAgICAgICAgICAgIGZvbGRlZENsYXNzTmFtZTogJ2ZvbGRlZCcsXG4gICAgICAgICAgICAgICAgbG9hZGVkQ2xhc3NOYW1lOiAnbG9hZGVkJyxcbiAgICAgICAgICAgICAgICBzY2hlbWVJZDogMCxcbiAgICAgICAgICAgICAgICBzZWxlY3RBbGxDYXRlZ29yaWVzOiAnLnNlbGVjdC1hbGwtY2F0ZWdvcmllcycsXG4gICAgICAgICAgICAgICAgc3ViY2F0ZWdvcmllc1VybDogJ2FkbWluLnBocD9kbz1Hb29nbGVTaG9wcGluZ0FqYXgvZ2V0U3ViY2F0ZWdvcmllcycsXG4gICAgICAgICAgICAgICAgc3VidHJlZUNsYXNzTmFtZTogJ3N1YnRyZWUnLFxuICAgICAgICAgICAgICAgIHVuZm9sZGVkQ2xhc3NOYW1lOiAndW5mb2xkZWQnXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZpbmFsIE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEhFTFBFUiBGVU5DVElPTlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldHMgdGhlIFwic2VsZWN0IGFsbCBjYXRlZ29yaWVzXCIgY2hlY2tib3ggdG8gY2hlY2tlZCwgaWYgYWxsIGNhdGVnb3JpZXMgYXJlIHNlbGVjdGVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX3VwZGF0ZVNlbGVjdEFsbENhdGVnb3JpZXNDaGVja2JveCgpIHtcbiAgICAgICAgICAgIHZhciBhbGxDaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICR0aGlzLmZpbmQob3B0aW9ucy5jYXRlZ29yeVN0YXRlKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBhbGxDaGVja2VkICY9ICQodGhpcykudmFsKCkgPT09ICdzZWxmX2FsbF9zdWInO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChhbGxDaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgJHRoaXMuZmluZChvcHRpb25zLnNlbGVjdEFsbENhdGVnb3JpZXMpLnByb3AoJ2NoZWNrZWQnLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXRzIHRoZSBzdGF0ZSBvZiBhbGwgY2hpbGRyZW4gY2hlY2tib3hlcyB0byBnaXZlbiBjaGVja1N0YXRlIHZhbHVlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gJGNoZWNrYm94XG4gICAgICAgICAqIEBwYXJhbSBjaGVja1N0YXRlXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfdXBkYXRlU3RhdGVPZkNoaWxkcmVuQ2hlY2tib3hlcygkY2hlY2tib3gsIGNoZWNrU3RhdGUpIHtcbiAgICAgICAgICAgIGNvbnN0ICRjaGlsZHJlbiA9ICRjaGVja2JveC5wYXJlbnQoJ2xpJylcbiAgICAgICAgICAgICAgICAuY2hpbGRyZW4ob3B0aW9ucy5jYXRlZ29yeVN1YnRyZWUpXG4gICAgICAgICAgICAgICAgLmNoaWxkcmVuKCdsaScpXG4gICAgICAgICAgICAgICAgLmNoaWxkcmVuKG9wdGlvbnMuY2F0ZWdvcnlDaGVja2JveCk7XG5cbiAgICAgICAgICAgIGlmICgkY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICRjaGlsZHJlbi5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgX3NldENoZWNrYm94U3RhdGUoJCh0aGlzKSwgY2hlY2tTdGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgIF91cGRhdGVTdGF0ZU9mQ2hpbGRyZW5DaGVja2JveGVzKCQodGhpcyksIGNoZWNrU3RhdGUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVwZGF0ZXMgdGhlIHN0YXRlIG9mIGFsbCBwYXJlbnQgY2hlY2tib3hlcy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtICRjaGVja2JveFxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX3VwZGF0ZVN0YXRlT2ZQYXJlbnRDaGVja2JveGVzKCRjaGVja2JveCkge1xuICAgICAgICAgICAgY29uc3QgJHN1YnRyZWUgPSAkY2hlY2tib3guY2xvc2VzdChvcHRpb25zLmNhdGVnb3J5U3VidHJlZSk7XG5cbiAgICAgICAgICAgIGlmICgkc3VidHJlZS5oYXNDbGFzcyhvcHRpb25zLnN1YnRyZWVDbGFzc05hbWUpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgJHBhcmVudENoZWNrYm94ID0gJHN1YnRyZWUucGFyZW50KCdsaScpLmNoaWxkcmVuKG9wdGlvbnMuY2F0ZWdvcnlDaGVja2JveCk7XG4gICAgICAgICAgICAgICAgY29uc3QgY2hlY2tTdGF0ZSA9IF9kZXRlcm1pbmVDaGVja2JveFN0YXRlKCRwYXJlbnRDaGVja2JveCk7XG4gICAgICAgICAgICAgICAgX3NldENoZWNrYm94U3RhdGUoJHBhcmVudENoZWNrYm94LCBjaGVja1N0YXRlKTtcbiAgICAgICAgICAgICAgICBfdXBkYXRlU3RhdGVPZlBhcmVudENoZWNrYm94ZXMoJHBhcmVudENoZWNrYm94KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZXRlcm1pbmVzIHRoZSBzdGF0ZSBmb3IgdGhlIGdpdmVuIGNoZWNrYm94LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gJGNoZWNrYm94XG4gICAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfZGV0ZXJtaW5lQ2hlY2tib3hTdGF0ZSgkY2hlY2tib3gpIHtcbiAgICAgICAgICAgIGNvbnN0IHNlbGZDaGVja2VkID0gX2lzQ2hlY2tlZCgkY2hlY2tib3gpO1xuICAgICAgICAgICAgY29uc3QgJGNoaWxkQ2F0ZWdvcmllcyA9ICRjaGVja2JveC5wYXJlbnQoJ2xpJylcbiAgICAgICAgICAgICAgICAuY2hpbGRyZW4ob3B0aW9ucy5jYXRlZ29yeVN1YnRyZWUpXG4gICAgICAgICAgICAgICAgLmNoaWxkcmVuKCdsaScpXG4gICAgICAgICAgICAgICAgLmNoaWxkcmVuKG9wdGlvbnMuY2F0ZWdvcnlDaGVja2JveCk7XG4gICAgICAgICAgICBsZXQgY2hpbGRDb3VudCA9ICRjaGlsZENhdGVnb3JpZXMubGVuZ3RoO1xuICAgICAgICAgICAgbGV0IGNoaWxkQ2hlY2tDb3VudCA9IDA7XG4gICAgICAgICAgICBsZXQgY2hlY2tTdGF0ZSA9IG9wdGlvbnMuZGVmYXVsdENoZWNrYm94U3RhdGU7XG5cbiAgICAgICAgICAgICRjaGlsZENhdGVnb3JpZXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEkKHRoaXMpLmhhc0NsYXNzKCdub19zZWxmX25vX3N1Yl9jaGVja2VkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRDaGVja0NvdW50Kys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghJCh0aGlzKS5oYXNDbGFzcygnc2VsZl9hbGxfc3ViX2NoZWNrZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZENvdW50Kys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChzZWxmQ2hlY2tlZCkge1xuICAgICAgICAgICAgICAgIGlmIChjaGlsZENoZWNrQ291bnQgPT09IGNoaWxkQ291bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tTdGF0ZSA9ICdzZWxmX2FsbF9zdWJfY2hlY2tlZCc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjaGlsZENoZWNrQ291bnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoZWNrU3RhdGUgPSAnc2VsZl9zb21lX3N1Yl9jaGVja2VkJztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNoaWxkQ2hlY2tDb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBjaGVja1N0YXRlID0gJ3NlbGZfbm9fc3ViX2NoZWNrZWQnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkQ2hlY2tDb3VudCA9PT0gY2hpbGRDb3VudCkge1xuICAgICAgICAgICAgICAgICAgICBjaGVja1N0YXRlID0gJ25vX3NlbGZfYWxsX3N1Yl9jaGVja2VkJztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNoaWxkQ2hlY2tDb3VudCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tTdGF0ZSA9ICdub19zZWxmX3NvbWVfc3ViX2NoZWNrZWQnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2hpbGRDaGVja0NvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoZWNrU3RhdGUgPSAnbm9fc2VsZl9ub19zdWJfY2hlY2tlZCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY2hlY2tTdGF0ZTtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXRzIHRoZSBzdGF0ZSBvZiB0aGUgZ2l2ZW4gY2hlY2tib3guXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSAkY2hlY2tib3hcbiAgICAgICAgICogQHBhcmFtIHN0YXRlXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfc2V0Q2hlY2tib3hTdGF0ZSgkY2hlY2tib3gsIHN0YXRlKSB7XG4gICAgICAgICAgICBfcmVzZXRDaGVja2JveCgkY2hlY2tib3gpO1xuICAgICAgICAgICAgJGNoZWNrYm94LmFkZENsYXNzKHN0YXRlKTtcbiAgICAgICAgICAgICRjaGVja2JveC5wYXJlbnQoJ2xpJykuY2hpbGRyZW4ob3B0aW9ucy5jYXRlZ29yeVN0YXRlKS52YWwoc3RhdGUuc3Vic3RyaW5nKDAsIHN0YXRlLmxhc3RJbmRleE9mKCdfJykpKTtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXNldHMgdGhlIHN0YXRlIG9mIHRoZSBnaXZlbiBjaGVja2JveC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtICRjaGVja2JveFxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX3Jlc2V0Q2hlY2tib3goJGNoZWNrYm94KSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wdGlvbnMuY2hlY2tib3hTdGF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAkY2hlY2tib3gucmVtb3ZlQ2xhc3Mob3B0aW9ucy5jaGVja2JveFN0YXRlc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB0aGUgc3RhdGUgb2YgdGhlIGdpdmVuIGNoZWNrYm94LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gJGNoZWNrYm94XG4gICAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfZ2V0Q2hlY2tib3hTdGF0ZSgkY2hlY2tib3gpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3B0aW9ucy5jaGVja2JveFN0YXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICgkY2hlY2tib3guaGFzQ2xhc3Mob3B0aW9ucy5jaGVja2JveFN0YXRlc1tpXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMuY2hlY2tib3hTdGF0ZXNbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMuZGVmYXVsdENoZWNrYm94U3RhdGU7XG4gICAgICAgIH07XG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogRGV0ZXJtaW5lcyBhbmQgc2V0cyBuZXcgc3RhdHVzIG9mIGdpdmVuIGNoZWNrYm94LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gJGNoZWNrYm94XG4gICAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfZGV0ZXJtaW5lTmV3Q2hlY2tib3hTdGF0ZSgkY2hlY2tib3gpIHtcbiAgICAgICAgICAgIGNvbnN0IGFjdHVhbFN0YXRlID0gX2dldENoZWNrYm94U3RhdGUoJGNoZWNrYm94KTtcbiAgICAgICAgICAgIGxldCBuZXdTdGF0ZSA9IG9wdGlvbnMuZGVmYXVsdENoZWNrYm94U3RhdGU7XG5cbiAgICAgICAgICAgIGlmICgkY2hlY2tib3gucGFyZW50KCdsaScpLmNoaWxkcmVuKG9wdGlvbnMuY2F0ZWdvcnlGb2xkZXIpLmhhc0NsYXNzKG9wdGlvbnMuZm9sZGVkQ2xhc3NOYW1lKSB8fCAoJGNoZWNrYm94XG4gICAgICAgICAgICAgICAgLnBhcmVudCgnbGknKVxuICAgICAgICAgICAgICAgIC5jaGlsZHJlbihvcHRpb25zLmNhdGVnb3J5Rm9sZGVyKVxuICAgICAgICAgICAgICAgIC5oYXNDbGFzcyhvcHRpb25zLnVuZm9sZGVkQ2xhc3NOYW1lKSAmJiBfZ2V0Q2hpbGRDb3VudCgkY2hlY2tib3gpID09PSAwKSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoYWN0dWFsU3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnc2VsZl9hbGxfc3ViX2NoZWNrZWQnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlICdzZWxmX3NvbWVfc3ViX2NoZWNrZWQnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlICdzZWxmX25vX3N1Yl9jaGVja2VkJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1N0YXRlID0gJ25vX3NlbGZfbm9fc3ViX2NoZWNrZWQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbm9fc2VsZl9hbGxfc3ViX2NoZWNrZWQnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlICdub19zZWxmX3NvbWVfc3ViX2NoZWNrZWQnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlICdub19zZWxmX25vX3N1Yl9jaGVja2VkJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1N0YXRlID0gJ3NlbGZfYWxsX3N1Yl9jaGVja2VkJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoYWN0dWFsU3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnc2VsZl9hbGxfc3ViX2NoZWNrZWQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3U3RhdGUgPSAnbm9fc2VsZl9hbGxfc3ViX2NoZWNrZWQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnc2VsZl9zb21lX3N1Yl9jaGVja2VkJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1N0YXRlID0gJ25vX3NlbGZfc29tZV9zdWJfY2hlY2tlZCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICBjYXNlICdzZWxmX25vX3N1Yl9jaGVja2VkJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1N0YXRlID0gJ25vX3NlbGZfbm9fc3ViX2NoZWNrZWQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbm9fc2VsZl9hbGxfc3ViX2NoZWNrZWQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3U3RhdGUgPSAnc2VsZl9hbGxfc3ViX2NoZWNrZWQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbm9fc2VsZl9zb21lX3N1Yl9jaGVja2VkJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1N0YXRlID0gJ3NlbGZfc29tZV9zdWJfY2hlY2tlZCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICBjYXNlICdub19zZWxmX25vX3N1Yl9jaGVja2VkJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1N0YXRlID0gJ3NlbGZfbm9fc3ViX2NoZWNrZWQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5ld1N0YXRlO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENoZWNrcyBpZiBnaXZlbiBjaGVja2JveCBpcyBjaGVja2VkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gJGNoZWNrYm94XG4gICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2lzQ2hlY2tlZCgkY2hlY2tib3gpIHtcbiAgICAgICAgICAgIHJldHVybiAkY2hlY2tib3guaGFzQ2xhc3MoJ3NlbGZfYWxsX3N1Yl9jaGVja2VkJykgfHwgJGNoZWNrYm94Lmhhc0NsYXNzKCdzZWxmX3NvbWVfc3ViX2NoZWNrZWQnKVxuICAgICAgICAgICAgICAgIHx8ICRjaGVja2JveC5oYXNDbGFzcygnc2VsZl9ub19zdWJfY2hlY2tlZCcpO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIGNvdW50IG9mIGNoaWxkcmVuIG9mIHRoZSBnaXZlbiBjaGVja2JveC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtICRjaGVja2JveFxuICAgICAgICAgKiBAcmV0dXJucyB7aW50fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2dldENoaWxkQ291bnQoJGNoZWNrYm94KSB7XG4gICAgICAgICAgICByZXR1cm4gJGNoZWNrYm94LnBhcmVudCgnbGknKS5jaGlsZHJlbihvcHRpb25zLmNhdGVnb3J5U3VidHJlZSkuY2hpbGRyZW4oJ2xpJykubGVuZ3RoO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIGluaGVyaXRlZCBzdGF0ZSBvZiBjaGlsZHJlbiBjaGVja2JveGVzIGlmIGV4aXN0LCBvdGhlcndpc2UgZmFsc2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSAkY2hlY2tib3hcbiAgICAgICAgICogQHJldHVybnMge3N0cmluZ3xib29sZWFufVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2dldEluaGVyaXRlZFN0YXRlT2ZDaGlsZHJlbigkY2hlY2tib3gpIHtcbiAgICAgICAgICAgIHdoaWxlICgkY2hlY2tib3guaGFzQ2xhc3Mob3B0aW9ucy5zdWJ0cmVlQ2xhc3NOYW1lKSkge1xuICAgICAgICAgICAgICAgIGlmICgkY2hlY2tib3gucGFyZW50KCdsaScpLmNoaWxkcmVuKG9wdGlvbnMuY2F0ZWdvcnlDaGVja2JveCkuaGFzQ2xhc3MoJ3Bhc3Nfb25fbm9fc2VsZl9ub19zdWJfY2hlY2tlZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnbm9fc2VsZl9ub19zdWJfY2hlY2tlZCc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgkY2hlY2tib3gucGFyZW50KCdsaScpXG4gICAgICAgICAgICAgICAgICAgIC5jaGlsZHJlbihvcHRpb25zLmNhdGVnb3J5Q2hlY2tib3gpXG4gICAgICAgICAgICAgICAgICAgIC5oYXNDbGFzcygncGFzc19vbl9zZWxmX2FsbF9zdWJfY2hlY2tlZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnc2VsZl9hbGxfc3ViX2NoZWNrZWQnO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICRjaGVja2JveCA9ICRjaGVja2JveC5wYXJlbnQoJ2xpJykuY2xvc2VzdChvcHRpb25zLmNhdGVnb3J5U3VidHJlZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVcGRhdGVzIHRoZSBmb2xkZXIgaWNvbiBhbmQgaXRzIGNsYXNzIChmb2xkZWQgLyB1bmZvbGRlZCkuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSAkZm9sZGVyXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfdG9nZ2xlRm9sZGVyKCRmb2xkZXIpIHtcbiAgICAgICAgICAgICRmb2xkZXIudG9nZ2xlQ2xhc3Mob3B0aW9ucy51bmZvbGRlZENsYXNzTmFtZSkudG9nZ2xlQ2xhc3Mob3B0aW9ucy5mb2xkZWRDbGFzc05hbWUpO1xuICAgICAgICAgICAgJGZvbGRlci5maW5kKCdpLmZhJykudG9nZ2xlQ2xhc3MoJ2ZhLWZvbGRlcicpLnRvZ2dsZUNsYXNzKCdmYS1mb2xkZXItb3BlbicpO1xuICAgICAgICB9XG5cblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gRVZFTlQgSEFORExFUlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXMgdGhlIGNsaWNrIGV2ZW50IG9mIGEgY2F0ZWdvcnkuXG4gICAgICAgICAqXG4gICAgICAgICAqIExvYWRzIHN1YmNhdGVnb3JpZXMgb2YgY2xpY2tlZCBjYXRlZ29yeS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9jbGlja0NhdGVnb3J5KCkge1xuICAgICAgICAgICAgY29uc3QgY2F0ZWdvcnlJZCA9ICQodGhpcykuZGF0YSgnY2F0ZWdvcnktaWQnKTtcbiAgICAgICAgICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgICAgICAgaWYgKCR0aGlzLmhhc0NsYXNzKG9wdGlvbnMubG9hZGVkQ2xhc3NOYW1lKSAmJiAkdGhpcy5oYXNDbGFzcyhvcHRpb25zLmZvbGRlZENsYXNzTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAkdGhpcy5wYXJlbnQoJ2xpJykuZmluZChvcHRpb25zLmNhdGVnb3J5U3VidHJlZSkuc2hvdygpO1xuICAgICAgICAgICAgICAgIF90b2dnbGVGb2xkZXIoJHRoaXMpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkdGhpcy5oYXNDbGFzcyhvcHRpb25zLmxvYWRlZENsYXNzTmFtZSkgJiYgJHRoaXMuaGFzQ2xhc3Mob3B0aW9ucy51bmZvbGRlZENsYXNzTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAkdGhpcy5wYXJlbnQoJ2xpJykuZmluZChvcHRpb25zLmNhdGVnb3J5U3VidHJlZSkuaGlkZSgpO1xuICAgICAgICAgICAgICAgIF90b2dnbGVGb2xkZXIoJHRoaXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgICAgICAgICAgICAgICAgIHVybDogb3B0aW9ucy5zdWJjYXRlZ29yaWVzVXJsICsgJyZzY2hlbWVJZD0nICsgb3B0aW9ucy5zY2hlbWVJZCArICcmY2F0ZWdvcnlJZD0nICsgY2F0ZWdvcnlJZCxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2VbJ3N1Y2Nlc3MnXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLnBhcmVudCgnbGknKS5maW5kKG9wdGlvbnMuY2F0ZWdvcnlTdWJ0cmVlICsgJzpmaXJzdCcpLmh0bWwocmVzcG9uc2UuaHRtbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMucGFyZW50KCdsaScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKG9wdGlvbnMuY2F0ZWdvcnlTdWJ0cmVlICsgJzpmaXJzdCAnICsgb3B0aW9ucy5jYXRlZ29yeUZvbGRlcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uKCdjbGljaycsIF9jbGlja0NhdGVnb3J5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5wYXJlbnQoJ2xpJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbmQob3B0aW9ucy5jYXRlZ29yeVN1YnRyZWUgKyAnOmZpcnN0ICcgKyBvcHRpb25zLmNhdGVnb3J5Q2hlY2tib3gpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCBfY2xpY2tDaGVja2JveCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMuYWRkQ2xhc3Mob3B0aW9ucy5sb2FkZWRDbGFzc05hbWUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RvZ2dsZUZvbGRlcigkdGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmhlcml0ZWRTdGF0ZSA9IF9nZXRJbmhlcml0ZWRTdGF0ZU9mQ2hpbGRyZW4oJHRoaXMucGFyZW50KCdsaScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jaGlsZHJlbihvcHRpb25zLmNhdGVnb3J5U3VidHJlZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmhlcml0ZWRTdGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdGhpc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnBhcmVudCgnbGknKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNoaWxkcmVuKG9wdGlvbnMuY2F0ZWdvcnlTdWJ0cmVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNoaWxkcmVuKCdsaScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2hpbGRyZW4ob3B0aW9ucy5jYXRlZ29yeUNoZWNrYm94KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9zZXRDaGVja2JveFN0YXRlKCQodGhpcyksIGluaGVyaXRlZFN0YXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlWydzdWNjZXNzJ107XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVzIHRoZSBjbGljayBldmVudCBvZiBjaGVja2JveGVzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBVcGRhdGVzIHN0YXRlcyBvZiBjaGVja2JveGVzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2NsaWNrQ2hlY2tib3goKSB7XG4gICAgICAgICAgICBjb25zdCAkY2hlY2tib3ggPSAkKHRoaXMpO1xuICAgICAgICAgICAgY29uc3QgY2hlY2tlZCA9IF9pc0NoZWNrZWQoJGNoZWNrYm94KSA/ICdub19zZWxmX25vX3N1Yl9jaGVja2VkJyA6ICdzZWxmX2FsbF9zdWJfY2hlY2tlZCc7XG4gICAgICAgICAgICBjb25zdCBsb2FkZWQgPSAkY2hlY2tib3gucGFyZW50KCdsaScpLmNoaWxkcmVuKG9wdGlvbnMuY2F0ZWdvcnlGb2xkZXIpLmhhc0NsYXNzKG9wdGlvbnMubG9hZGVkQ2xhc3NOYW1lKTtcbiAgICAgICAgICAgIGNvbnN0IGZvbGRlZCA9ICRjaGVja2JveC5wYXJlbnQoJ2xpJykuY2hpbGRyZW4ob3B0aW9ucy5jYXRlZ29yeUZvbGRlcikuaGFzQ2xhc3Mob3B0aW9ucy5mb2xkZWRDbGFzc05hbWUpO1xuICAgICAgICAgICAgY29uc3QgbmV3U3RhdGUgPSBfZGV0ZXJtaW5lTmV3Q2hlY2tib3hTdGF0ZSgkY2hlY2tib3gsIGNoZWNrZWQpO1xuXG4gICAgICAgICAgICBfc2V0Q2hlY2tib3hTdGF0ZSgkY2hlY2tib3gsIG5ld1N0YXRlKTtcblxuICAgICAgICAgICAgJGNoZWNrYm94LnBhcmVudCgnbGknKVxuICAgICAgICAgICAgICAgIC5jaGlsZHJlbihvcHRpb25zLmNhdGVnb3J5U3RhdGUpXG4gICAgICAgICAgICAgICAgLnZhbChuZXdTdGF0ZS5zdWJzdHJpbmcoMCwgbmV3U3RhdGUubGFzdEluZGV4T2YoJ18nKSkpO1xuXG4gICAgICAgICAgICBpZiAoZm9sZGVkKSB7XG4gICAgICAgICAgICAgICAgJGNoZWNrYm94LnJlbW92ZUNsYXNzKCdwYXNzX29uX25vX3NlbGZfbm9fc3ViX2NoZWNrZWQnKTtcbiAgICAgICAgICAgICAgICAkY2hlY2tib3gucmVtb3ZlQ2xhc3MoJ3Bhc3Nfb25fc2VsZl9hbGxfc3ViX2NoZWNrZWQnKTtcbiAgICAgICAgICAgICAgICAkY2hlY2tib3guYWRkQ2xhc3MoJ3Bhc3Nfb25fJyArIGNoZWNrZWQpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCRjaGVja2JveC5oYXNDbGFzcygncGFzc19vbl9ub19zZWxmX25vX3N1Yl9jaGVja2VkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgJGNoZWNrYm94LnBhcmVudCgnbGknKS5maW5kKG9wdGlvbnMuYmVxdWVhdGhpbmdTdGF0ZSArICc6Zmlyc3QnKS52YWwoJ25vX3NlbGZfbm9fc3ViJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJGNoZWNrYm94LnBhcmVudCgnbGknKS5maW5kKG9wdGlvbnMuYmVxdWVhdGhpbmdTdGF0ZSArICc6Zmlyc3QnKS52YWwoJ3NlbGZfYWxsX3N1YicpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChsb2FkZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgX3VwZGF0ZVN0YXRlT2ZDaGlsZHJlbkNoZWNrYm94ZXMoJGNoZWNrYm94LCBjaGVja2VkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF91cGRhdGVTdGF0ZU9mUGFyZW50Q2hlY2tib3hlcygkY2hlY2tib3gpO1xuXG4gICAgICAgICAgICBpZiAoY2hlY2tlZCAhPT0gJ3NlbGZfYWxsX3N1Yl9jaGVja2VkJyAmJiAkKG9wdGlvbnMuc2VsZWN0QWxsQ2F0ZWdvcmllcykuaXMoJzpjaGVja2VkJykpIHtcbiAgICAgICAgICAgICAgICAkKG9wdGlvbnMuc2VsZWN0QWxsQ2F0ZWdvcmllcykucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAkKG9wdGlvbnMuc2VsZWN0QWxsQ2F0ZWdvcmllcykucGFyZW50KCcuc2luZ2xlLWNoZWNrYm94JykucmVtb3ZlQ2xhc3MoJ2NoZWNrZWQnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJChvcHRpb25zLmNhdGVnb3J5Rm9sZGVyKS5sZW5ndGggPT09ICQob3B0aW9ucy5jYXRlZ29yeUNoZWNrYm94ICsgJy5zZWxmX2FsbF9zdWJfY2hlY2tlZCcpLmxlbmd0aFxuICAgICAgICAgICAgICAgICYmICEkKG9wdGlvbnMuc2VsZWN0QWxsQ2F0ZWdvcmllcykuaXMoJzpjaGVja2VkJykpIHtcbiAgICAgICAgICAgICAgICAkKG9wdGlvbnMuc2VsZWN0QWxsQ2F0ZWdvcmllcykucHJvcCgnY2hlY2tlZCcsIHRydWUpO1xuICAgICAgICAgICAgICAgICQob3B0aW9ucy5zZWxlY3RBbGxDYXRlZ29yaWVzKS5wYXJlbnQoJy5zaW5nbGUtY2hlY2tib3gnKS5hZGRDbGFzcygnY2hlY2tlZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXMgdGhlIGNoYW5nZSBldmVudCBvZiB0aGUgXCJzZWxlY3QgYWxsIGNhdGVnb3JpZXNcIiBjaGVja2JveC5cbiAgICAgICAgICpcbiAgICAgICAgICogVXBkYXRlcyBhbGwgY2hlY2tib3hlcyBpbiB0aGUgY2F0ZWdvcmllcyB0cmVlIChhbGwgY2hlY2tlZCAvIGFsbCB1bmNoZWNrZWQpXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2NoYW5nZVNlbGVjdEFsbENhdGVnb3JpZXNDaGVja2JveCgpIHtcbiAgICAgICAgICAgIGNvbnN0IGNoZWNrZWQgPSAkKHRoaXMpLmlzKCc6Y2hlY2tlZCcpID8gJ3NlbGZfYWxsX3N1Yl9jaGVja2VkJyA6ICdub19zZWxmX25vX3N1Yl9jaGVja2VkJztcbiAgICAgICAgICAgIGNvbnN0IHBhc3NPbiA9ICQodGhpcykuaXMoJzpjaGVja2VkJykgPyAncGFzc19vbl9zZWxmX2FsbF9zdWJfY2hlY2tlZCcgOiAncGFzc19vbl9ub19zZWxmX25vX3N1Yl9jaGVja2VkJztcblxuICAgICAgICAgICAgJChvcHRpb25zLmNhdGVnb3J5Q2hlY2tib3gpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF9zZXRDaGVja2JveFN0YXRlKCQodGhpcyksIGNoZWNrZWQpO1xuICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ3Bhc3Nfb25fc2VsZl9hbGxfc3ViX2NoZWNrZWQnKTtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdwYXNzX29uX25vX3NlbGZfbm9fc3ViX2NoZWNrZWQnKTtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKHBhc3NPbik7XG5cbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcygncGFzc19vbl9ub19zZWxmX25vX3N1Yl9jaGVja2VkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoJ2xpJykuZmluZChvcHRpb25zLmJlcXVlYXRoaW5nU3RhdGUgKyAnOmZpcnN0JykudmFsKCdub19zZWxmX25vX3N1YicpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50KCdsaScpLmZpbmQob3B0aW9ucy5iZXF1ZWF0aGluZ1N0YXRlICsgJzpmaXJzdCcpLnZhbCgnc2VsZl9hbGxfc3ViJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG5cbiAgICAgICAgICAgICR0aGlzLmZpbmQob3B0aW9ucy5jYXRlZ29yeUZvbGRlcikub24oJ2NsaWNrJywgX2NsaWNrQ2F0ZWdvcnkpO1xuICAgICAgICAgICAgJHRoaXMuZmluZChvcHRpb25zLmNhdGVnb3J5Q2hlY2tib3gpLm9uKCdjbGljaycsIF9jbGlja0NoZWNrYm94KTtcbiAgICAgICAgICAgICR0aGlzLmZpbmQob3B0aW9ucy5zZWxlY3RBbGxDYXRlZ29yaWVzKS5vbignY2hhbmdlJywgX2NoYW5nZVNlbGVjdEFsbENhdGVnb3JpZXNDaGVja2JveClcblxuICAgICAgICAgICAgX3VwZGF0ZVNlbGVjdEFsbENhdGVnb3JpZXNDaGVja2JveCgpO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTsiXX0=
