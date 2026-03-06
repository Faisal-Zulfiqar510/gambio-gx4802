'use strict';

/* --------------------------------------------------------------
 language_switcher.js 2016-09-06
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Language Switcher Extension
 *
 * @module Admin/Extensions/language_switcher
 * @ignore
 */
gx.extensions.module('language_switcher', ['form', 'fallback', gx.source + '/libs/editor_values'], function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLE DEFINITION
    // ------------------------------------------------------------------------

    var
    /**
     * Extension Reference
     *
     * @type {object}
     */
    $this = $(this),


    /**
     * Default Options for Extension
     *
     * @type {object}
     */
    defaults = {
        position: 1, // Position of the language id in the field name (zero indexed)
        initLang: jse.core.registry.get('languageId') // Current language on init
    },


    /**
     * Final Extension Options
     *
     * @type {object}
     */
    options = $.extend(true, {}, defaults, data),


    /**
     * Module Object
     *
     * @type {object}
     */
    module = {},


    /**
     * Language Names
     *
     * @type {Array}
     */
    names = [],


    /**
     * Buttons Selector
     *
     * @type {object}
     */
    $languageLinks = null;

    // ------------------------------------------------------------------------
    // MAIN FUNCTIONALITY
    // ------------------------------------------------------------------------

    /**
     * Generate Transfer Object
     *
     * Generates a JSON transfer object to get data from fields named <X> to be stored in
     * fields with name <Y>. Therefore the names getting transformed the right way to be
     * able to use "jse.libs.form.prefillForm"
     *
     * @param {string} langActive String with the current lang id.
     * @param {boolean} toHidden If true, the destination are the hidden fields (else the input fields).
     */
    var _generateTransferObject = function _generateTransferObject(langActive, toHidden) {

        var currentData = {},
            fullData = jse.libs.fallback.getData($this);

        $.each(names, function (i, v) {

            var keySplit = v.match(/\[([^\]]+)\]/gi),
                baseKey = v.split('[')[0],
                srcKey = baseKey,
                destKey = baseKey,
                valid = false;

            // Only execute if name schema matches
            if (keySplit) {
                // Generate key names
                $.each(keySplit, function (i, v) {
                    if (options.position !== i) {
                        destKey += v;
                        srcKey += v;
                    } else {
                        if (toHidden) {
                            destKey += '[' + langActive + ']';
                        } else {
                            srcKey += '[' + langActive + ']';
                        }
                        valid = true;
                    }
                });

                // Push data to the result object
                if (valid && fullData[srcKey] !== undefined) {
                    currentData[destKey] = fullData[srcKey];
                }
            }
        });

        return currentData;
    };

    /**
     * Store Data To Hidden
     *
     * Function to store input field data to hidden fields.
     *
     * @param {object} $activeButton jQuery selector object with the active language id.
     */
    var _storeDataToHidden = function _storeDataToHidden($activeButton) {
        var langActive = $activeButton.attr('href').slice(1);

        // Update textarea fields with data from CKEditor.
        $this.find('textarea').each(function (index, textarea) {
            var $textarea = $(textarea);

            if ($textarea.parent('.editor-wrapper').length) {
                var value = jse.libs.editor_values.getValue($textarea);
                $textarea.val(value);
            }
        });

        // Store data to hidden fields.
        jse.libs.form.prefillForm($this, _generateTransferObject(langActive, true), false);
    };

    /**
     * Get From Hidden
     *
     * Function to restore input field data from hidden fields
     *
     * @param {object} $activeButton jQuery selector object with the active language id.
     */
    var _getDataFromHidden = function _getDataFromHidden($activeButton) {
        var langActive = $activeButton.attr('href').slice(1);

        // Restore data to input fields
        jse.libs.form.prefillForm($this, _generateTransferObject(langActive, false), false);

        // Update the editors with the new data from textareas.
        $this.find('textarea').not('[data-language_switcher-ignore]').each(function (index, textarea) {
            var $textarea = $(textarea),
                value = $textarea.val();

            if ($textarea.parent('.editor-wrapper').length) {
                jse.libs.editor_values.setValue($textarea, value);
            }
        });
    };

    /**
     * Update Editors
     *
     * Helper function to add a blur event on every editor that is loaded inside
     * of $this. To prevent multiple blur events on one editor, all names of the
     * tags that already got an blur event are saved.
     */
    var _updateEditors = function _updateEditors() {
        if (window.CKEDITOR) {
            $this.find('textarea.wysiwyg').each(function (index, textarea) {
                var $textarea = $(textarea),
                    name = $textarea.attr('name'),
                    editorType = $textarea.data('editorType') || 'ckeditor';

                switch (editorType) {
                    case 'ckeditor':
                        if (CKEDITOR.instances[name]) {
                            CKEDITOR.instances[name].on('blur', function () {
                                _storeDataToHidden($languageLinks.filter('.active'));
                            });
                        }

                        break;

                    case 'codemirror':
                        var $codeMirror = $textarea.siblings('.CodeMirror'),
                            instance = $codeMirror.length ? $codeMirror[0].CodeMirror : null;

                        if (instance) {
                            instance.on('blur', function () {
                                _storeDataToHidden($languageLinks.filter('.active'));
                            });
                        }

                        break;
                }

                jse.libs.editor_values.setValue($textarea, $textarea.val());
            });
        }
    };

    // ------------------------------------------------------------------------
    // EVENT HANDLER
    // ------------------------------------------------------------------------

    /**
     * On Click Event Handler
     *
     * Event listener to store current data to hidden fields and restore hidden
     * data to text fields if a flag button gets clicked
     *
     * @param {object} event Contains information about the event.
     */
    var _clickHandler = function _clickHandler(event) {
        event.preventDefault();

        var $self = $(this);

        if (!$self.hasClass('active')) {

            var $activeButton = $languageLinks.filter('.active');

            $languageLinks.removeClass('active');
            $self.addClass('active');

            if ($activeButton.length) {
                _storeDataToHidden($activeButton);
            }

            _getDataFromHidden($self);
        }
    };

    /**
     * Update Field Event Handler
     *
     * @param {object} event Contains information about the event.
     */
    var _updateField = function _updateField(event) {
        event.preventDefault();
        var $activeButton = $languageLinks.filter('.active');
        _getDataFromHidden($activeButton);
    };

    /**
     * Get Language
     *
     * Function to return the current language id via an deferred object.
     *
     * @param {object} event jQuery event object.
     * @param {object} deferred Data object that contains the deferred object.
     */
    var _getLanguage = function _getLanguage(event, deferred) {
        if (deferred && deferred.deferred) {
            var lang = $languageLinks.filter('.active').first().attr('href').slice(1);

            deferred.deferred.resolve(lang);
        }
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    /**
     * Init function of the extension, called by the engine.
     */
    module.init = function (done) {
        $languageLinks = $this.find('.buttonbar a'); // @todo Make the selector dynamic through an option.

        /**
         * Bind event listener to the form fields, and store the names of the field in cache. To prevent
         * empty editors (because of already loaded editors on init of this script update them with the
         * correct value.
         *
         * @todo Move method outside the initialize method (avoid function nesting without specific reason).
         */
        var _addEventHandler = function _addEventHandler() {
            names = [];

            // Get all needed selectors.
            var $formFields = $this.find('input:not(:button):not(:submit), select, textarea').not('[data-language_switcher-ignore]');

            $formFields.each(function () {

                var $self = $(this),
                    type = jse.libs.form.getFieldType($self),
                    event = $.inArray(type, ['text', 'textarea']) > -1 ? 'blur' : 'change',
                    name = $self.attr('name');

                names.push(name);

                $self.on(event, function () {
                    _storeDataToHidden($languageLinks.filter('.active'));
                });
            });
        };

        _addEventHandler();

        // Bind event handler to the flags buttons.
        $languageLinks.on('click', _clickHandler).filter('[href="#' + options.initLang + '"]').trigger('click');

        // Bind the editor related events whenever the editor widget is ready.
        $(window).on('editor:ready', _updateEditors);

        $('form').on('submit', function () {
            _storeDataToHidden($languageLinks.filter('.active'));
        });

        $this.on('layerClose', function () {
            // Workaround to update the hidden fields on layer close.
            _storeDataToHidden($languageLinks.filter('.active'));
        }).on('language_switcher.update', _addEventHandler).on('language_switcher.updateField', _updateField).on('language_switcher.getLang', _getLanguage).on('click', '.editor-switch', _updateEditors);

        done();
    };

    // Return data to module engine.
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxhbmd1YWdlX3N3aXRjaGVyLmpzIl0sIm5hbWVzIjpbImd4IiwiZXh0ZW5zaW9ucyIsIm1vZHVsZSIsInNvdXJjZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJkZWZhdWx0cyIsInBvc2l0aW9uIiwiaW5pdExhbmciLCJqc2UiLCJjb3JlIiwicmVnaXN0cnkiLCJnZXQiLCJvcHRpb25zIiwiZXh0ZW5kIiwibmFtZXMiLCIkbGFuZ3VhZ2VMaW5rcyIsIl9nZW5lcmF0ZVRyYW5zZmVyT2JqZWN0IiwibGFuZ0FjdGl2ZSIsInRvSGlkZGVuIiwiY3VycmVudERhdGEiLCJmdWxsRGF0YSIsImxpYnMiLCJmYWxsYmFjayIsImdldERhdGEiLCJlYWNoIiwiaSIsInYiLCJrZXlTcGxpdCIsIm1hdGNoIiwiYmFzZUtleSIsInNwbGl0Iiwic3JjS2V5IiwiZGVzdEtleSIsInZhbGlkIiwidW5kZWZpbmVkIiwiX3N0b3JlRGF0YVRvSGlkZGVuIiwiJGFjdGl2ZUJ1dHRvbiIsImF0dHIiLCJzbGljZSIsImZpbmQiLCJpbmRleCIsInRleHRhcmVhIiwiJHRleHRhcmVhIiwicGFyZW50IiwibGVuZ3RoIiwidmFsdWUiLCJlZGl0b3JfdmFsdWVzIiwiZ2V0VmFsdWUiLCJ2YWwiLCJmb3JtIiwicHJlZmlsbEZvcm0iLCJfZ2V0RGF0YUZyb21IaWRkZW4iLCJub3QiLCJzZXRWYWx1ZSIsIl91cGRhdGVFZGl0b3JzIiwid2luZG93IiwiQ0tFRElUT1IiLCJuYW1lIiwiZWRpdG9yVHlwZSIsImluc3RhbmNlcyIsIm9uIiwiZmlsdGVyIiwiJGNvZGVNaXJyb3IiLCJzaWJsaW5ncyIsImluc3RhbmNlIiwiQ29kZU1pcnJvciIsIl9jbGlja0hhbmRsZXIiLCJldmVudCIsInByZXZlbnREZWZhdWx0IiwiJHNlbGYiLCJoYXNDbGFzcyIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJfdXBkYXRlRmllbGQiLCJfZ2V0TGFuZ3VhZ2UiLCJkZWZlcnJlZCIsImxhbmciLCJmaXJzdCIsInJlc29sdmUiLCJpbml0IiwiZG9uZSIsIl9hZGRFdmVudEhhbmRsZXIiLCIkZm9ybUZpZWxkcyIsInR5cGUiLCJnZXRGaWVsZFR5cGUiLCJpbkFycmF5IiwicHVzaCIsInRyaWdnZXIiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7O0FBTUFBLEdBQUdDLFVBQUgsQ0FBY0MsTUFBZCxDQUNJLG1CQURKLEVBR0ksQ0FBQyxNQUFELEVBQVMsVUFBVCxFQUF3QkYsR0FBR0csTUFBM0IseUJBSEosRUFLSSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJOzs7OztBQUtBQyxZQUFRQyxFQUFFLElBQUYsQ0FOWjs7O0FBUUk7Ozs7O0FBS0FDLGVBQVc7QUFDUEMsa0JBQVUsQ0FESCxFQUNNO0FBQ2JDLGtCQUFVQyxJQUFJQyxJQUFKLENBQVNDLFFBQVQsQ0FBa0JDLEdBQWxCLENBQXNCLFlBQXRCLENBRkgsQ0FFdUM7QUFGdkMsS0FiZjs7O0FBa0JJOzs7OztBQUtBQyxjQUFVUixFQUFFUyxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJSLFFBQW5CLEVBQTZCSCxJQUE3QixDQXZCZDs7O0FBeUJJOzs7OztBQUtBRixhQUFTLEVBOUJiOzs7QUFnQ0k7Ozs7O0FBS0FjLFlBQVEsRUFyQ1o7OztBQXVDSTs7Ozs7QUFLQUMscUJBQWlCLElBNUNyQjs7QUE4Q0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7O0FBVUEsUUFBSUMsMEJBQTBCLFNBQTFCQSx1QkFBMEIsQ0FBVUMsVUFBVixFQUFzQkMsUUFBdEIsRUFBZ0M7O0FBRTFELFlBQUlDLGNBQWMsRUFBbEI7QUFBQSxZQUNJQyxXQUFXWixJQUFJYSxJQUFKLENBQVNDLFFBQVQsQ0FBa0JDLE9BQWxCLENBQTBCcEIsS0FBMUIsQ0FEZjs7QUFHQUMsVUFBRW9CLElBQUYsQ0FBT1YsS0FBUCxFQUFjLFVBQVVXLENBQVYsRUFBYUMsQ0FBYixFQUFnQjs7QUFFMUIsZ0JBQUlDLFdBQVdELEVBQUVFLEtBQUYs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QUNLeUQsRUFETCxDQUNRLFlBRFIsRUFDc0IsWUFBWTtBQUMxQjtBQUNBekIsK0JBQW1CcEIsZUFBZThDLE1BQWYsQ0FBc0IsU0FBdEIsQ0FBbkI7QUFDSCxTQUpMLEVBS0tELEVBTEwsQ0FLUSwwQkFMUixFQUtvQ3FCLGdCQUxwQyxFQU1LckIsRUFOTCxDQU1RLCtCQU5SLEVBTXlDYSxZQU56QyxFQU9LYixFQVBMLENBT1EsMkJBUFIsRUFPcUNjLFlBUHJDLEVBUUtkLEVBUkwsQ0FRUSxPQVJSLEVBUWlCLGdCQVJqQixFQVFtQ04sY0FSbkM7O0FBVUEwQjtBQUNILEtBM0REOztBQTZEQTtBQUNBLFdBQU9oRixNQUFQO0FBQ0gsQ0F2VkwiLCJmaWxlIjoibGFuZ3VhZ2Vfc3dpdGNoZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGxhbmd1YWdlX3N3aXRjaGVyLmpzIDIwMTYtMDktMDZcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqICMjIExhbmd1YWdlIFN3aXRjaGVyIEV4dGVuc2lvblxuICpcbiAqIEBtb2R1bGUgQWRtaW4vRXh0ZW5zaW9ucy9sYW5ndWFnZV9zd2l0Y2hlclxuICogQGlnbm9yZVxuICovXG5neC5leHRlbnNpb25zLm1vZHVsZShcbiAgICAnbGFuZ3VhZ2Vfc3dpdGNoZXInLFxuXG4gICAgWydmb3JtJywgJ2ZhbGxiYWNrJywgYCR7Z3guc291cmNlfS9saWJzL2VkaXRvcl92YWx1ZXNgXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRSBERUZJTklUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhclxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBFeHRlbnNpb24gUmVmZXJlbmNlXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJHRoaXMgPSAkKHRoaXMpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERlZmF1bHQgT3B0aW9ucyBmb3IgRXh0ZW5zaW9uXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246IDEsIC8vIFBvc2l0aW9uIG9mIHRoZSBsYW5ndWFnZSBpZCBpbiB0aGUgZmllbGQgbmFtZSAoemVybyBpbmRleGVkKVxuICAgICAgICAgICAgICAgIGluaXRMYW5nOiBqc2UuY29yZS5yZWdpc3RyeS5nZXQoJ2xhbmd1YWdlSWQnKSAvLyBDdXJyZW50IGxhbmd1YWdlIG9uIGluaXRcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRmluYWwgRXh0ZW5zaW9uIE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbW9kdWxlID0ge30sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTGFuZ3VhZ2UgTmFtZXNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG5hbWVzID0gW10sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQnV0dG9ucyBTZWxlY3RvclxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICRsYW5ndWFnZUxpbmtzID0gbnVsbDtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gTUFJTiBGVU5DVElPTkFMSVRZXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZW5lcmF0ZSBUcmFuc2ZlciBPYmplY3RcbiAgICAgICAgICpcbiAgICAgICAgICogR2VuZXJhdGVzIGEgSlNPTiB0cmFuc2ZlciBvYmplY3QgdG8gZ2V0IGRhdGEgZnJvbSBmaWVsZHMgbmFtZWQgPFg+IHRvIGJlIHN0b3JlZCBpblxuICAgICAgICAgKiBmaWVsZHMgd2l0aCBuYW1lIDxZPi4gVGhlcmVmb3JlIHRoZSBuYW1lcyBnZXR0aW5nIHRyYW5zZm9ybWVkIHRoZSByaWdodCB3YXkgdG8gYmVcbiAgICAgICAgICogYWJsZSB0byB1c2UgXCJqc2UubGlicy5mb3JtLnByZWZpbGxGb3JtXCJcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGxhbmdBY3RpdmUgU3RyaW5nIHdpdGggdGhlIGN1cnJlbnQgbGFuZyBpZC5cbiAgICAgICAgICogQHBhcmFtIHtib29sZWFufSB0b0hpZGRlbiBJZiB0cnVlLCB0aGUgZGVzdGluYXRpb24gYXJlIHRoZSBoaWRkZW4gZmllbGRzIChlbHNlIHRoZSBpbnB1dCBmaWVsZHMpLlxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9nZW5lcmF0ZVRyYW5zZmVyT2JqZWN0ID0gZnVuY3Rpb24gKGxhbmdBY3RpdmUsIHRvSGlkZGVuKSB7XG5cbiAgICAgICAgICAgIHZhciBjdXJyZW50RGF0YSA9IHt9LFxuICAgICAgICAgICAgICAgIGZ1bGxEYXRhID0ganNlLmxpYnMuZmFsbGJhY2suZ2V0RGF0YSgkdGhpcyk7XG5cbiAgICAgICAgICAgICQuZWFjaChuYW1lcywgZnVuY3Rpb24gKGksIHYpIHtcblxuICAgICAgICAgICAgICAgIHZhciBrZXlTcGxpdCA9IHYubWF0Y2goL1xcWyhbXlxcXV0rKVxcXS9naSksXG4gICAgICAgICAgICAgICAgICAgIGJhc2VLZXkgPSB2LnNwbGl0KCdbJylbMF0sXG4gICAgICAgICAgICAgICAgICAgIHNyY0tleSA9IGJhc2VLZXksXG4gICAgICAgICAgICAgICAgICAgIGRlc3RLZXkgPSBiYXNlS2V5LFxuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgLy8gT25seSBleGVjdXRlIGlmIG5hbWUgc2NoZW1hIG1hdGNoZXNcbiAgICAgICAgICAgICAgICBpZiAoa2V5U3BsaXQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gR2VuZXJhdGUga2V5IG5hbWVzXG4gICAgICAgICAgICAgICAgICAgICQuZWFjaChrZXlTcGxpdCwgZnVuY3Rpb24gKGksIHYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLnBvc2l0aW9uICE9PSBpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzdEtleSArPSB2O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyY0tleSArPSB2O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodG9IaWRkZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzdEtleSArPSAnWycgKyBsYW5nQWN0aXZlICsgJ10nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyY0tleSArPSAnWycgKyBsYW5nQWN0aXZlICsgJ10nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFB1c2ggZGF0YSB0byB0aGUgcmVzdWx0IG9iamVjdFxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsaWQgJiYgZnVsbERhdGFbc3JjS2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50RGF0YVtkZXN0S2V5XSA9IGZ1bGxEYXRhW3NyY0tleV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnREYXRhO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTdG9yZSBEYXRhIFRvIEhpZGRlblxuICAgICAgICAgKlxuICAgICAgICAgKiBGdW5jdGlvbiB0byBzdG9yZSBpbnB1dCBmaWVsZCBkYXRhIHRvIGhpZGRlbiBmaWVsZHMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSAkYWN0aXZlQnV0dG9uIGpRdWVyeSBzZWxlY3RvciBvYmplY3Qgd2l0aCB0aGUgYWN0aXZlIGxhbmd1YWdlIGlkLlxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9zdG9yZURhdGFUb0hpZGRlbiA9IGZ1bmN0aW9uICgkYWN0aXZlQnV0dG9uKSB7XG4gICAgICAgICAgICB2YXIgbGFuZ0FjdGl2ZSA9ICRhY3RpdmVCdXR0b24uYXR0cignaHJlZicpLnNsaWNlKDEpO1xuXG4gICAgICAgICAgICAvLyBVcGRhdGUgdGV4dGFyZWEgZmllbGRzIHdpdGggZGF0YSBmcm9tIENLRWRpdG9yLlxuICAgICAgICAgICAgJHRoaXNcbiAgICAgICAgICAgICAgICAuZmluZCgndGV4dGFyZWEnKVxuICAgICAgICAgICAgICAgIC5lYWNoKGZ1bmN0aW9uIChpbmRleCwgdGV4dGFyZWEpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyICR0ZXh0YXJlYSA9ICQodGV4dGFyZWEpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICgkdGV4dGFyZWEucGFyZW50KCcuZWRpdG9yLXdyYXBwZXInKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGpzZS5saWJzLmVkaXRvcl92YWx1ZXMuZ2V0VmFsdWUoJHRleHRhcmVhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICR0ZXh0YXJlYS52YWwodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFN0b3JlIGRhdGEgdG8gaGlkZGVuIGZpZWxkcy5cbiAgICAgICAgICAgIGpzZS5saWJzLmZvcm0ucHJlZmlsbEZvcm0oJHRoaXMsIF9nZW5lcmF0ZVRyYW5zZmVyT2JqZWN0KGxhbmdBY3RpdmUsIHRydWUpLCBmYWxzZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldCBGcm9tIEhpZGRlblxuICAgICAgICAgKlxuICAgICAgICAgKiBGdW5jdGlvbiB0byByZXN0b3JlIGlucHV0IGZpZWxkIGRhdGEgZnJvbSBoaWRkZW4gZmllbGRzXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSAkYWN0aXZlQnV0dG9uIGpRdWVyeSBzZWxlY3RvciBvYmplY3Qgd2l0aCB0aGUgYWN0aXZlIGxhbmd1YWdlIGlkLlxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9nZXREYXRhRnJvbUhpZGRlbiA9IGZ1bmN0aW9uICgkYWN0aXZlQnV0dG9uKSB7XG4gICAgICAgICAgICB2YXIgbGFuZ0FjdGl2ZSA9ICRhY3RpdmVCdXR0b24uYXR0cignaHJlZicpLnNsaWNlKDEpO1xuXG4gICAgICAgICAgICAvLyBSZXN0b3JlIGRhdGEgdG8gaW5wdXQgZmllbGRzXG4gICAgICAgICAgICBqc2UubGlicy5mb3JtLnByZWZpbGxGb3JtKCR0aGlzLCBfZ2VuZXJhdGVUcmFuc2Zlck9iamVjdChsYW5nQWN0aXZlLCBmYWxzZSksIGZhbHNlKTtcblxuICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSBlZGl0b3JzIHdpdGggdGhlIG5ldyBkYXRhIGZyb20gdGV4dGFyZWFzLlxuICAgICAgICAgICAgJHRoaXNcbiAgICAgICAgICAgICAgICAuZmluZCgndGV4dGFyZWEnKVxuICAgICAgICAgICAgICAgIC5ub3QoJ1tkYXRhLWxhbmd1YWdlX3N3aXRjaGVyLWlnbm9yZV0nKVxuICAgICAgICAgICAgICAgIC5lYWNoKGZ1bmN0aW9uIChpbmRleCwgdGV4dGFyZWEpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyICR0ZXh0YXJlYSA9ICQodGV4dGFyZWEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSAkdGV4dGFyZWEudmFsKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCR0ZXh0YXJlYS5wYXJlbnQoJy5lZGl0b3Itd3JhcHBlcicpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAganNlLmxpYnMuZWRpdG9yX3ZhbHVlcy5zZXRWYWx1ZSgkdGV4dGFyZWEsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVcGRhdGUgRWRpdG9yc1xuICAgICAgICAgKlxuICAgICAgICAgKiBIZWxwZXIgZnVuY3Rpb24gdG8gYWRkIGEgYmx1ciBldmVudCBvbiBldmVyeSBlZGl0b3IgdGhhdCBpcyBsb2FkZWQgaW5zaWRlXG4gICAgICAgICAqIG9mICR0aGlzLiBUbyBwcmV2ZW50IG11bHRpcGxlIGJsdXIgZXZlbnRzIG9uIG9uZSBlZGl0b3IsIGFsbCBuYW1lcyBvZiB0aGVcbiAgICAgICAgICogdGFncyB0aGF0IGFscmVhZHkgZ290IGFuIGJsdXIgZXZlbnQgYXJlIHNhdmVkLlxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF91cGRhdGVFZGl0b3JzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHdpbmRvdy5DS0VESVRPUikge1xuICAgICAgICAgICAgICAgICR0aGlzXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKCd0ZXh0YXJlYS53eXNpd3lnJylcbiAgICAgICAgICAgICAgICAgICAgLmVhY2goZnVuY3Rpb24gKGluZGV4LCB0ZXh0YXJlYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyICR0ZXh0YXJlYSA9ICQodGV4dGFyZWEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUgPSAkdGV4dGFyZWEuYXR0cignbmFtZScpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVkaXRvclR5cGUgPSAkdGV4dGFyZWEuZGF0YSgnZWRpdG9yVHlwZScpIHx8ICdja2VkaXRvcic7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoZWRpdG9yVHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NrZWRpdG9yJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKENLRURJVE9SLmluc3RhbmNlc1tuYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ0tFRElUT1IuaW5zdGFuY2VzW25hbWVdLm9uKCdibHVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9zdG9yZURhdGFUb0hpZGRlbigkbGFuZ3VhZ2VMaW5rcy5maWx0ZXIoJy5hY3RpdmUnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnY29kZW1pcnJvcic6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkY29kZU1pcnJvciA9ICR0ZXh0YXJlYS5zaWJsaW5ncygnLkNvZGVNaXJyb3InKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc3RhbmNlID0gJGNvZGVNaXJyb3IubGVuZ3RoID8gJGNvZGVNaXJyb3JbMF0uQ29kZU1pcnJvciA6IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZS5vbignYmx1cicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfc3RvcmVEYXRhVG9IaWRkZW4oJGxhbmd1YWdlTGlua3MuZmlsdGVyKCcuYWN0aXZlJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAganNlLmxpYnMuZWRpdG9yX3ZhbHVlcy5zZXRWYWx1ZSgkdGV4dGFyZWEsICR0ZXh0YXJlYS52YWwoKSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBFVkVOVCBIQU5ETEVSXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPbiBDbGljayBFdmVudCBIYW5kbGVyXG4gICAgICAgICAqXG4gICAgICAgICAqIEV2ZW50IGxpc3RlbmVyIHRvIHN0b3JlIGN1cnJlbnQgZGF0YSB0byBoaWRkZW4gZmllbGRzIGFuZCByZXN0b3JlIGhpZGRlblxuICAgICAgICAgKiBkYXRhIHRvIHRleHQgZmllbGRzIGlmIGEgZmxhZyBidXR0b24gZ2V0cyBjbGlja2VkXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCBDb250YWlucyBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZXZlbnQuXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX2NsaWNrSGFuZGxlciA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgdmFyICRzZWxmID0gJCh0aGlzKTtcblxuICAgICAgICAgICAgaWYgKCEkc2VsZi5oYXNDbGFzcygnYWN0aXZlJykpIHtcblxuICAgICAgICAgICAgICAgIHZhciAkYWN0aXZlQnV0dG9uID0gJGxhbmd1YWdlTGlua3MuZmlsdGVyKCcuYWN0aXZlJyk7XG5cbiAgICAgICAgICAgICAgICAkbGFuZ3VhZ2VMaW5rcy5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgJHNlbGYuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCRhY3RpdmVCdXR0b24ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIF9zdG9yZURhdGFUb0hpZGRlbigkYWN0aXZlQnV0dG9uKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBfZ2V0RGF0YUZyb21IaWRkZW4oJHNlbGYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVcGRhdGUgRmllbGQgRXZlbnQgSGFuZGxlclxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgQ29udGFpbnMgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGV2ZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF91cGRhdGVGaWVsZCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHZhciAkYWN0aXZlQnV0dG9uID0gJGxhbmd1YWdlTGlua3MuZmlsdGVyKCcuYWN0aXZlJyk7XG4gICAgICAgICAgICBfZ2V0RGF0YUZyb21IaWRkZW4oJGFjdGl2ZUJ1dHRvbik7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldCBMYW5ndWFnZVxuICAgICAgICAgKlxuICAgICAgICAgKiBGdW5jdGlvbiB0byByZXR1cm4gdGhlIGN1cnJlbnQgbGFuZ3VhZ2UgaWQgdmlhIGFuIGRlZmVycmVkIG9iamVjdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50IGpRdWVyeSBldmVudCBvYmplY3QuXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBkZWZlcnJlZCBEYXRhIG9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSBkZWZlcnJlZCBvYmplY3QuXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX2dldExhbmd1YWdlID0gZnVuY3Rpb24gKGV2ZW50LCBkZWZlcnJlZCkge1xuICAgICAgICAgICAgaWYgKGRlZmVycmVkICYmIGRlZmVycmVkLmRlZmVycmVkKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxhbmcgPSAkbGFuZ3VhZ2VMaW5rc1xuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCcuYWN0aXZlJylcbiAgICAgICAgICAgICAgICAgICAgLmZpcnN0KClcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2hyZWYnKVxuICAgICAgICAgICAgICAgICAgICAuc2xpY2UoMSk7XG5cbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5kZWZlcnJlZC5yZXNvbHZlKGxhbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5pdCBmdW5jdGlvbiBvZiB0aGUgZXh0ZW5zaW9uLCBjYWxsZWQgYnkgdGhlIGVuZ2luZS5cbiAgICAgICAgICovXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgICRsYW5ndWFnZUxpbmtzID0gJHRoaXMuZmluZCgnLmJ1dHRvbmJhciBhJyk7IC8vIEB0b2RvIE1ha2UgdGhlIHNlbGVjdG9yIGR5bmFtaWMgdGhyb3VnaCBhbiBvcHRpb24uXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQmluZCBldmVudCBsaXN0ZW5lciB0byB0aGUgZm9ybSBmaWVsZHMsIGFuZCBzdG9yZSB0aGUgbmFtZXMgb2YgdGhlIGZpZWxkIGluIGNhY2hlLiBUbyBwcmV2ZW50XG4gICAgICAgICAgICAgKiBlbXB0eSBlZGl0b3JzIChiZWNhdXNlIG9mIGFscmVhZHkgbG9hZGVkIGVkaXRvcnMgb24gaW5pdCBvZiB0aGlzIHNjcmlwdCB1cGRhdGUgdGhlbSB3aXRoIHRoZVxuICAgICAgICAgICAgICogY29ycmVjdCB2YWx1ZS5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdG9kbyBNb3ZlIG1ldGhvZCBvdXRzaWRlIHRoZSBpbml0aWFsaXplIG1ldGhvZCAoYXZvaWQgZnVuY3Rpb24gbmVzdGluZyB3aXRob3V0IHNwZWNpZmljIHJlYXNvbikuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHZhciBfYWRkRXZlbnRIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIG5hbWVzID0gW107XG5cbiAgICAgICAgICAgICAgICAvLyBHZXQgYWxsIG5lZWRlZCBzZWxlY3RvcnMuXG4gICAgICAgICAgICAgICAgdmFyICRmb3JtRmllbGRzID0gJHRoaXMuZmluZCgnaW5wdXQ6bm90KDpidXR0b24pOm5vdCg6c3VibWl0KSwgc2VsZWN0LCB0ZXh0YXJlYScpXG4gICAgICAgICAgICAgICAgICAgIC5ub3QoJ1tkYXRhLWxhbmd1YWdlX3N3aXRjaGVyLWlnbm9yZV0nKTtcblxuICAgICAgICAgICAgICAgICRmb3JtRmllbGRzLmVhY2goZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciAkc2VsZiA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlID0ganNlLmxpYnMuZm9ybS5nZXRGaWVsZFR5cGUoJHNlbGYpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQgPSAoJC5pbkFycmF5KHR5cGUsIFsndGV4dCcsICd0ZXh0YXJlYSddKSA+IC0xKSA/ICdibHVyJyA6ICdjaGFuZ2UnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSA9ICRzZWxmLmF0dHIoJ25hbWUnKTtcblxuICAgICAgICAgICAgICAgICAgICBuYW1lcy5wdXNoKG5hbWUpO1xuXG4gICAgICAgICAgICAgICAgICAgICRzZWxmXG4gICAgICAgICAgICAgICAgICAgICAgICAub24oZXZlbnQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfc3RvcmVEYXRhVG9IaWRkZW4oJGxhbmd1YWdlTGlua3MuZmlsdGVyKCcuYWN0aXZlJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBfYWRkRXZlbnRIYW5kbGVyKCk7XG5cbiAgICAgICAgICAgIC8vIEJpbmQgZXZlbnQgaGFuZGxlciB0byB0aGUgZmxhZ3MgYnV0dG9ucy5cbiAgICAgICAgICAgICRsYW5ndWFnZUxpbmtzXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsIF9jbGlja0hhbmRsZXIpXG4gICAgICAgICAgICAgICAgLmZpbHRlcignW2hyZWY9XCIjJyArIG9wdGlvbnMuaW5pdExhbmcgKyAnXCJdJylcbiAgICAgICAgICAgICAgICAudHJpZ2dlcignY2xpY2snKTtcblxuICAgICAgICAgICAgLy8gQmluZCB0aGUgZWRpdG9yIHJlbGF0ZWQgZXZlbnRzIHdoZW5ldmVyIHRoZSBlZGl0b3Igd2lkZ2V0IGlzIHJlYWR5LlxuICAgICAgICAgICAgJCh3aW5kb3cpLm9uKCdlZGl0b3I6cmVhZHknLCBfdXBkYXRlRWRpdG9ycyk7XG5cbiAgICAgICAgICAgICQoJ2Zvcm0nKS5vbignc3VibWl0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF9zdG9yZURhdGFUb0hpZGRlbigkbGFuZ3VhZ2VMaW5rcy5maWx0ZXIoJy5hY3RpdmUnKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHRoaXNcbiAgICAgICAgICAgICAgICAub24oJ2xheWVyQ2xvc2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdvcmthcm91bmQgdG8gdXBkYXRlIHRoZSBoaWRkZW4gZmllbGRzIG9uIGxheWVyIGNsb3NlLlxuICAgICAgICAgICAgICAgICAgICBfc3RvcmVEYXRhVG9IaWRkZW4oJGxhbmd1YWdlTGlua3MuZmlsdGVyKCcuYWN0aXZlJykpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLm9uKCdsYW5ndWFnZV9zd2l0Y2hlci51cGRhdGUnLCBfYWRkRXZlbnRIYW5kbGVyKVxuICAgICAgICAgICAgICAgIC5vbignbGFuZ3VhZ2Vfc3dpdGNoZXIudXBkYXRlRmllbGQnLCBfdXBkYXRlRmllbGQpXG4gICAgICAgICAgICAgICAgLm9uKCdsYW5ndWFnZV9zd2l0Y2hlci5nZXRMYW5nJywgX2dldExhbmd1YWdlKVxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCAnLmVkaXRvci1zd2l0Y2gnLCBfdXBkYXRlRWRpdG9ycyk7XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBSZXR1cm4gZGF0YSB0byBtb2R1bGUgZW5naW5lLlxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
