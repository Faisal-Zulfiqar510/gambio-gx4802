/* --------------------------------------------------------------
 scheme_categories.js 2019-07-12
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2019 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

gxmodules.controllers.module(
    'scheme_categories',

    [],

    function (data) {
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
                checkboxStates: [
                    'self_all_sub_checked',
                    'self_some_sub_checked',
                    'self_no_sub_checked',
                    'no_self_all_sub_checked',
                    'no_self_some_sub_checked',
                    'no_self_no_sub_checked'
                ],
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
            const $children = $checkbox.parent('li')
                .children(options.categorySubtree)
                .children('li')
                .children(options.categoryCheckbox);

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
            const $subtree = $checkbox.closest(options.categorySubtree);

            if ($subtree.hasClass(options.subtreeClassName)) {
                const $parentCheckbox = $subtree.parent('li').children(options.categoryCheckbox);
                const checkState = _determineCheckboxState($parentCheckbox);
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
            const selfChecked = _isChecked($checkbox);
            const $childCategories = $checkbox.parent('li')
                .children(options.categorySubtree)
                .children('li')
                .children(options.categoryCheckbox);
            let childCount = $childCategories.length;
            let childCheckCount = 0;
            let checkState = options.defaultCheckboxState;

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
            for (let i = 0; i < options.checkboxStates.length; i++) {
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
            for (let i = 0; i < options.checkboxStates.length; i++) {
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
            const actualState = _getCheckboxState($checkbox);
            let newState = options.defaultCheckboxState;

            if ($checkbox.parent('li').children(options.categoryFolder).hasClass(options.foldedClassName) || ($checkbox
                .parent('li')
                .children(options.categoryFolder)
                .hasClass(options.unfoldedClassName) && _getChildCount($checkbox) === 0)) {
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
            return $checkbox.hasClass('self_all_sub_checked') || $checkbox.hasClass('self_some_sub_checked')
                || $checkbox.hasClass('self_no_sub_checked');
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
                } else if ($checkbox.parent('li')
                    .children(options.categoryCheckbox)
                    .hasClass('pass_on_self_all_sub_checked')) {
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
            const categoryId = $(this).data('category-id');
            const $this = $(this);

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
                    success: function (response) {
                        if (response['success'] === true) {
                            $this.parent('li').find(options.categorySubtree + ':first').html(response.html);
                            $this.parent('li')
                                .find(options.categorySubtree + ':first ' + options.categoryFolder)
                                .on('click', _clickCategory);
                            $this.parent('li')
                                .find(options.categorySubtree + ':first ' + options.categoryCheckbox)
                                .on('click', _clickCheckbox);
                            $this.addClass(options.loadedClassName);

                            _toggleFolder($this);

                            const inheritedState = _getInheritedStateOfChildren($this.parent('li')
                                .children(options.categorySubtree));
                            if (inheritedState) {
                                $this
                                    .parent('li')
                                    .children(options.categorySubtree)
                                    .children('li')
                                    .children(options.categoryCheckbox)
                                    .each(function () {
                                        _setCheckboxState($(this), inheritedState);
                                    });
                            }
                        }

                        return response['success'];
                    },
                    error: function () {
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
            const $checkbox = $(this);
            const checked = _isChecked($checkbox) ? 'no_self_no_sub_checked' : 'self_all_sub_checked';
            const loaded = $checkbox.parent('li').children(options.categoryFolder).hasClass(options.loadedClassName);
            const folded = $checkbox.parent('li').children(options.categoryFolder).hasClass(options.foldedClassName);
            const newState = _determineNewCheckboxState($checkbox, checked);

            _setCheckboxState($checkbox, newState);

            $checkbox.parent('li')
                .children(options.categoryState)
                .val(newState.substring(0, newState.lastIndexOf('_')));

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
            } else if ($(options.categoryFolder).length === $(options.categoryCheckbox + '.self_all_sub_checked').length
                && !$(options.selectAllCategories).is(':checked')) {
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
            const checked = $(this).is(':checked') ? 'self_all_sub_checked' : 'no_self_no_sub_checked';
            const passOn = $(this).is(':checked') ? 'pass_on_self_all_sub_checked' : 'pass_on_no_self_no_sub_checked';

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
            $this.find(options.selectAllCategories).on('change', _changeSelectAllCategoriesCheckbox)

            _updateSelectAllCategoriesCheckbox();

            done();
        };

        return module;
    });