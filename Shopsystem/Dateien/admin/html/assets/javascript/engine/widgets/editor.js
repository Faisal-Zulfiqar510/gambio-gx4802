'use strict';

/* --------------------------------------------------------------
 editor.js 2017-09-05
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Editor Widget
 *
 * This widget will initialize instances of CKEditor or CodeMirror depending the provided data attribute of
 * each textarea, within the container the widget is bound to. Purpose of this module is to provide a common
 * wrapper of the textarea and record specific editor which means that the user will be able to set an editor
 * for a specific record and textarea and store this preference in the database.
 *
 * **Currently the available editors are "ckeditor" and "codemirror".**
 *
 * Important: Make sure that you provide the required options as described below. The module is flexible enough
 * to provide a solution for each page code base.
 *
 *
 * ### Options (Container)
 *
 * The following options are bound as data attributes to the element where the module is bound on (most of the times
 * a container that includes textarea elements).
 *
 * **Selector | `data-editor-selector` | String | Optional**
 *
 * Provide a selector for the textareas to be converted to editor instances. This option defaults to "textarea" and
 * will match all the textarea elements inside the container.
 *
 * **Event Target | `data-editor-event-target` | String | Optional**
 *
 * Provide a selector that will mark the element which will start the submit/save process of the page. If provided
 * the selected editor preference will be saved through the user configuration service with an AJAX request.
 *
 * Important: There is no default value for this option.
 *
 * **Event Type | `data-editor-event-type` | String | Optional**
 *
 * Provide a JavaScript event that will mark the submit/save process of the page. If provided an event handler
 * will be bound on the element marked by the "event-target" option and AJAX requests will save the current
 * editor preference in the user configuration table.
 *
 * Important: There is no default value for this option.
 *
 * **AutoHide | `data-editor-auto-hide` | Boolean | Optional**
 *
 * Provide "true" or "false" in order to auto hide the editors, if the textareas are not visible at the beginning.
 * Defaults value is "false"
 *
 * **AutoUpdate | `data-editor-auto-update` | Boolean | Optional**
 *
 * Indicates if the corresponding textarea of the editor should be updated automatically.
 * Default value is "true"
 *
 * **Initialization Event Type | `data-editor-init-event-type` | String | Optional**
 *
 * Provide a custom initialization event which will trigger the start of the editor conversion. By default the
 * editor instances will be created once the engine is ready 'JSENGINE_INIT_FINISHED', but there are cases where
 * a custom event is required (e.g. initialization of editor widget dynamically within a dialog).
 *
 *
 * ### Options (Textarea)
 *
 * The following options are bound as data attributes to each textarea element within the parent container.
 *
 * **Editor Identifier | `data-editor-identifier` | String | Required**
 *
 * Each child textarea element needs to have a unique identifier string which needs to apply with the following
 * naming convention the "editor-{record type}-{id}-{textarea name}-{language code}
 * (e.g. editor-products-2-short_description-de). In cases where the record ID is not set yet (new record creation),
 * it is advised that you leave the {id} placeholder and replace it later on whenever the record is generated into
 * the database (more information about this edge case in the examples below).
 *
 * **Editor Type | `data-editor-type` | String | Optional**
 *
 * This option can have one of the available editor values which will also state the selected editor upon
 * initialization. It is optional and the default value is "ckeditor".
 *
 *
 * ### Events
 *
 * The '#editor-container' element is where the widget is bound on.
 *
 * ```javascript
 * // Fires up when all textareas are ready.
 * $('#editor-container').on('editor:ready', (event, $textareas) => { ... });
 *
 * // Fires up each time a single textarea is ready.
 * $('#editor-container').on('editor:textarea_ready', (event, $textarea) => { ... });
 * ```
 *
 *
 * ### Examples
 *
 * **Simple Usage**
 *
 * Notice that this example showcases the creation of a new customer which means that the customer's ID is not known
 * yet. After its initialization, the widget will create a hidden field in the form with the
 * "editor_identifiers[textarea-identifier]" name. This hidden field will have the selected editor type as value which
 * be used by the backend callback to store the correct editor identifier value, once the customer's ID is generated
 * (record inserted). Use the "UserConfigurationService" in backend for adding the value to the database.
 *
 * ```html
 * <div data-gx-widget="editor" data-editor-event-target="#customer-form"  data-editor-event-type="submit">
 *   <form id="customer-form">
 *     <!-- Other Fields ... ->
 *     <textarea class="wysiwyg" data-editor-identifier="editor-customers-{id}-notes-de"></textarea>
 *   </form>
 * </div>
 * ```
 *
 * @module Admin/Widgets/editor
 * @requires CKEditor, CodeMirror
 */
gx.widgets.module('editor', [jse.source + '/vendor/codemirror/codemirror.min.css', jse.source + '/vendor/codemirror/codemirror.min.js', gx.source + '/libs/editor_instances', gx.source + '/libs/editor_values', gx.source + '/widgets/quickselect', 'user_configuration_service'], function (data) {

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
        selector: 'textarea',
        autoHide: 'false',
        initEventType: 'JSENGINE_INIT_FINISHED',
        autoUpdate: 'true'
    };

    /**
     * Final Options
     *
     * @type {Object}
     */
    var options = $.extend(true, {}, defaults, data);

    /**
     * Module Object
     *
     * @type {Object}
     */
    var module = {};

    /**
     * Editor Instances
     *
     * Identifier -> instance mapping
     *
     * @type {Object}
     */
    var editors = {};

    /**
     * Available Editor Types
     *
     * @type {String[]}
     */
    var editorTypes = ['ckeditor', 'codemirror'];

    // ------------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------------

    /**
     * Add Editor Switch Button
     *
     * This method will add the editor switch button and bind the click event handler.
     *
     * @param {jQuery} $textarea Textarea selector to be modified.
     */
    function _addEditorSwitchButton($textarea) {
        var start = 0;
        if ($textarea.data('editorType') === 'codemirror') {
            start = 1;
        }

        $textarea.wrap('<div class="editor-wrapper" />').parent().prepend('<div data-gx-widget="quickselect" data-quickselect-align="right" data-quickselect-start="' + start + ('">\n\t\t\t\t\t\t\t<div class="quickselect-headline-wrapper">\n\t\t\t\t\t\t\t\t<a class="editor-switch editor-switch-html" href="#html">\n\t\t\t\t\t\t\t\t\t' + jse.core.lang.translate('BUTTON_SWITCH_EDITOR_TEXT', 'admin_buttons') + '\n\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t<a class="editor-switch editor-switch-text" href="#text">\n\t\t\t\t\t\t\t\t\t' + jse.core.lang.translate('BUTTON_SWITCH_EDITOR_HTML', 'admin_buttons') + '\n\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>')).find('.editor-switch').on('click', _onSwitchButtonClick);

        if (!$textarea.is(':visible') && options.autoHide === 'true') {
            $textarea.parent().hide();
        }

        gx.widgets.init($textarea.parent());
    }

    /**
     * Add a hidden editor type field.
     *
     * This field will contain the type of the current editor and can be used by submit callbacks whenever the
     * record ID is not known yet and the user configuration entry is generated by the server.
     *
     * @param {jQuery} $textarea Textarea selector to be modified.
     */
    function _addEditorHiddenField($textarea) {
        $textarea.parent().append('\n\t\t\t\t\t<input type="hidden" \n\t\t\t\t\t\tname="editor_identifiers[' + $textarea.data('editorIdentifier') + ']" \n\t\t\t\t\t\tvalue="' + ($textarea.data('editorType') || 'ckeditor') + '" />\n\t\t\t\t');
    }

    /**
     * Create Editor Instance
     *
     * This method will use the "editor" library to create the appropriate editor instance, depending the textarea
     * type attribute.
     *
     * @param {jQuery} $textarea Textarea selector to be modified.
     */
    function _createEditorInstance($textarea) {
        var type = $textarea.data('editorType') || 'ckeditor';
        var identifier = $textarea.data('editorIdentifier');

        editors[identifier] = jse.libs.editor_instances.create($textarea, type);
    }

    /**
     * On Switch Button Click Event Handler
     *
     * This method will use the "editor" library to change the current editor type and update the hidden input
     * field and data attributes of the textarea. It will try to set the next available editor type.
     */
    function _onSwitchButtonClick() {
        var $switchButton = $(this);
        var $textarea = $switchButton.parents('.editor-wrapper').find('textarea');
        var identifier = $textarea.data('editorIdentifier');
        var currentType = $textarea.data('editorType');
        var newType = $switchButton.hasClass('editor-switch-text') ? editorTypes[1] : editorTypes[0];

        $textarea.siblings('[name="editor_identifiers[' + identifier + ']"]').val(newType);
        $textarea.data('editorType', newType);

        editors[identifier] = jse.libs.editor_instances.switch($textarea, currentType, newType);
        _bindAutoUpdate($textarea);
        _updateTextArea($textarea);
    }

    /**
     * On Page Submit Handler
     *
     * If the event target and type are provided this method will be triggered to save the user configuration
     * values in the database with AJAX requests.
     */
    function _onPageSubmit() {
        for (var identifier in editors) {
            jse.libs.user_configuration_service.set({
                data: {
                    userId: 0,
                    configurationKey: identifier,
                    configurationValue: editors[identifier].type
                }
            });
        }
    }

    /**
     * Bind Auto Update
     *
     * Binds an event handler to an editor instance to automatically update the
     * corresponding textarea.
     *
     * @param {jQuery} $textarea Textarea the auto update should be bound to
     */
    function _bindAutoUpdate($textarea) {
        if (options.autoUpdate === 'false') {
            return;
        }

        var instance = editors[$textarea.data('editorIdentifier')];

        instance.on('change', function () {
            return _updateTextArea($textarea);
        });
    }

    /**
     * Update Text Area Value
     *
     * Transfers the value of the editor instance of the given textarea to its corresponding textarea.
     *
     * @param {jQuery} $textarea The textarea to be updated.
     */
    function _updateTextArea($textarea) {
        var editorType = $textarea.data('editorType');
        var instance = editors[$textarea.data('editorIdentifier')];

        switch (editorType) {
            case 'ckeditor':
                instance.updateElement();
                break;

            case 'codemirror':
                $textarea.val(jse.libs.editor_values.getValue($textarea));
                break;

            default:
                throw new Error('Editor type not recognized.', editorType);
        }

        $textarea.trigger('change');
    }

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $(document).on('JSENGINE_INIT_FINISHED', function () {
            var dependencies = [jse.source + '/vendor/codemirror/css.min.js', jse.source + '/vendor/codemirror/htmlmixed.min.js', jse.source + '/vendor/codemirror/javascript.min.js', jse.source + '/vendor/codemirror/xml.min.js'];

            jse.core.module_loader.require(dependencies);
        });

        // Initialize the editors after a specific event in order to make sure that other modules will be
        // already initialized and nothing else will change the markup.
        $(window).on(options.initEventType, function () {
            var $textareas = $this.find(options.selector);

            $textareas.each(function (index, textarea) {
                var $textarea = $(textarea);

                if (editorTypes.indexOf($textarea.data('editorType')) === -1) {
                    $textarea.data('editorType', editorTypes[0]);
                }

                _addEditorSwitchButton($textarea);
                _addEditorHiddenField($textarea);
                _createEditorInstance($textarea);
                _bindAutoUpdate($textarea);

                $this.trigger('editor:textarea_ready', [$textarea]);
            });

            $this.trigger('editor:ready', [$textareas]);
        });

        // If the event target and type options are available, bind the page submit handler.
        if (options.eventTarget !== undefined && options.eventType !== undefined) {
            $(options.eventTarget).on(options.eventType, _onPageSubmit);
        }

        done();
    };

    // Return data to module engine.
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVkaXRvci5qcyJdLCJuYW1lcyI6WyJneCIsIndpZGdldHMiLCJtb2R1bGUiLCJqc2UiLCJzb3VyY2UiLCJkYXRhIiwiJHRoaXMiLCIkIiwiZGVmYXVsdHMiLCJzZWxlY3RvciIsImF1dG9IaWRlIiwiaW5pdEV2ZW50VHlwZSIsImF1dG9VcGRhdGUiLCJvcHRpb25zIiwiZXh0ZW5kIiwiZWRpdG9ycyIsImVkaXRvclR5cGVzIiwiX2FkZEVkaXRvclN3aXRjaEJ1dHRvbiIsIiR0ZXh0YXJlYSIsInN0YXJ0Iiwid3JhcCIsInBhcmVudCIsInByZXBlbmQiLCJjb3JlIiwibGFuZyIsInRyYW5zbGF0ZSIsImZpbmQiLCJvbiIsIl9vblN3aXRjaEJ1dHRvbkNsaWNrIiwiaXMiLCJoaWRlIiwiaW5pdCIsIl9hZGRFZGl0b3JIaWRkZW5GaWVsZCIsImFwcGVuZCIsIl9jcmVhdGVFZGl0b3JJbnN0YW5jZSIsInR5cGUiLCJpZGVudGlmaWVyIiwibGlicyIsImVkaXRvcl9pbnN0YW5jZXMiLCJjcmVhdGUiLCIkc3dpdGNoQnV0dG9uIiwicGFyZW50cyIsImN1cnJlbnRUeXBlIiwibmV3VHlwZSIsImhhc0NsYXNzIiwic2libGluZ3MiLCJ2YWwiLCJzd2l0Y2giLCJfYmluZEF1dG9VcGRhdGUiLCJfdXBkYXRlVGV4dEFyZWEiLCJfb25QYWdlU3VibWl0IiwidXNlcl9jb25maWd1cmF0aW9uX3NlcnZpY2UiLCJzZXQiLCJ1c2VySWQiLCJjb25maWd1cmF0aW9uS2V5IiwiY29uZmlndXJhdGlvblZhbHVlIiwiaW5zdGFuY2UiLCJlZGl0b3JUeXBlIiwidXBkYXRlRWxlbWVudCIsImVkaXRvcl92YWx1ZXMiLCJnZXRWYWx1ZSIsIkVycm9yIiwidHJpZ2dlciIsImRvbmUiLCJkb2N1bWVudCIsImRlcGVuZGVuY2llcyIsIm1vZHVsZV9sb2FkZXIiLCJyZXF1aXJlIiwid2luZG93IiwiJHRleHRhcmVhcyIsImVhY2giLCJpbmRleCIsInRleHRhcmVhIiwiaW5kZXhPZiIsImV2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QyxnQkFBTTBELGFBQWEvRCxNQUFNb0IsSUFBTixDQUFXYixRQUFRSixRQUFuQixDQUFuQjs7QUFFQTRELHVCQUFXQyxJQUFYLENBQWdCLFVBQUNDLEtBQUQsRUFBUUMsUUFBUixFQUFxQjtBQUNqQyxvQkFBTXRELFlBQVlYLEVBQUVpRSxRQUFGLENBQWxCOztBQUVBLG9CQUFJeEQsWUFBWXlELE9BQVosQ0FBb0J2RCxVQUFVYixJQUFWLENBQWUsWUFBZixDQUFwQixNQUFzRCxDQUFDLENBQTNELEVBQThEO0FBQzFEYSw4QkFBVWIsSUFBVixDQUFlLFlBQWYsRUFBNkJXLFlBQVksQ0FBWixDQUE3QjtBQUNIOztBQUVEQyx1Q0FBdUJDLFNBQXZCO0FBQ0FjLHNDQUFzQmQsU0FBdEI7QUFDQWdCLHNDQUFzQmhCLFNBQXRCO0FBQ0E4QixnQ0FBZ0I5QixTQUFoQjs7QUFFQVosc0JBQU13RCxPQUFOLENBQWMsdUJBQWQsRUFBdUMsQ0FBQzVDLFNBQUQsQ0FBdkM7QUFDSCxhQWJEOztBQWVBWixrQkFBTXdELE9BQU4sQ0FBYyxjQUFkLEVBQThCLENBQUNPLFVBQUQsQ0FBOUI7QUFDSCxTQW5CRDs7QUFxQkE7QUFDQSxZQUFJeEQsUUFBUTZELFdBQVIsS0FBd0JDLFNBQXhCLElBQXFDOUQsUUFBUStELFNBQVIsS0FBc0JELFNBQS9ELEVBQTBFO0FBQ3RFcEUsY0FBRU0sUUFBUTZELFdBQVYsRUFBdUIvQyxFQUF2QixDQUEwQmQsUUFBUStELFNBQWxDLEVBQTZDMUIsYUFBN0M7QUFDSDs7QUFFRGE7QUFDSCxLQXpDRDs7QUEyQ0E7QUFDQSxXQUFPN0QsTUFBUDtBQUNILENBcFJMIiwiZmlsZSI6ImVkaXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gZWRpdG9yLmpzIDIwMTctMDktMDVcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE3IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqICMjIEVkaXRvciBXaWRnZXRcbiAqXG4gKiBUaGlzIHdpZGdldCB3aWxsIGluaXRpYWxpemUgaW5zdGFuY2VzIG9mIENLRWRpdG9yIG9yIENvZGVNaXJyb3IgZGVwZW5kaW5nIHRoZSBwcm92aWRlZCBkYXRhIGF0dHJpYnV0ZSBvZlxuICogZWFjaCB0ZXh0YXJlYSwgd2l0aGluIHRoZSBjb250YWluZXIgdGhlIHdpZGdldCBpcyBib3VuZCB0by4gUHVycG9zZSBvZiB0aGlzIG1vZHVsZSBpcyB0byBwcm92aWRlIGEgY29tbW9uXG4gKiB3cmFwcGVyIG9mIHRoZSB0ZXh0YXJlYSBhbmQgcmVjb3JkIHNwZWNpZmljIGVkaXRvciB3aGljaCBtZWFucyB0aGF0IHRoZSB1c2VyIHdpbGwgYmUgYWJsZSB0byBzZXQgYW4gZWRpdG9yXG4gKiBmb3IgYSBzcGVjaWZpYyByZWNvcmQgYW5kIHRleHRhcmVhIGFuZCBzdG9yZSB0aGlzIHByZWZlcmVuY2UgaW4gdGhlIGRhdGFiYXNlLlxuICpcbiAqICoqQ3VycmVudGx5IHRoZSBhdmFpbGFibGUgZWRpdG9ycyBhcmUgXCJja2VkaXRvclwiIGFuZCBcImNvZGVtaXJyb3JcIi4qKlxuICpcbiAqIEltcG9ydGFudDogTWFrZSBzdXJlIHRoYXQgeW91IHByb3ZpZGUgdGhlIHJlcXVpcmVkIG9wdGlvbnMgYXMgZGVzY3JpYmVkIGJlbG93LiBUaGUgbW9kdWxlIGlzIGZsZXhpYmxlIGVub3VnaFxuICogdG8gcHJvdmlkZSBhIHNvbHV0aW9uIGZvciBlYWNoIHBhZ2UgY29kZSBiYXNlLlxuICpcbiAqXG4gKiAjIyMgT3B0aW9ucyAoQ29udGFpbmVyKVxuICpcbiAqIFRoZSBmb2xsb3dpbmcgb3B0aW9ucyBhcmUgYm91bmQgYXMgZGF0YSBhdHRyaWJ1dGVzIHRvIHRoZSBlbGVtZW50IHdoZXJlIHRoZSBtb2R1bGUgaXMgYm91bmQgb24gKG1vc3Qgb2YgdGhlIHRpbWVzXG4gKiBhIGNvbnRhaW5lciB0aGF0IGluY2x1ZGVzIHRleHRhcmVhIGVsZW1lbnRzKS5cbiAqXG4gKiAqKlNlbGVjdG9yIHwgYGRhdGEtZWRpdG9yLXNlbGVjdG9yYCB8IFN0cmluZyB8IE9wdGlvbmFsKipcbiAqXG4gKiBQcm92aWRlIGEgc2VsZWN0b3IgZm9yIHRoZSB0ZXh0YXJlYXMgdG8gYmUgY29udmVydGVkIHRvIGVkaXRvciBpbnN0YW5jZXMuIFRoaXMgb3B0aW9uIGRlZmF1bHRzIHRvIFwidGV4dGFyZWFcIiBhbmRcbiAqIHdpbGwgbWF0Y2ggYWxsIHRoZSB0ZXh0YXJlYSBlbGVtZW50cyBpbnNpZGUgdGhlIGNvbnRhaW5lci5cbiAqXG4gKiAqKkV2ZW50IFRhcmdldCB8IGBkYXRhLWVkaXRvci1ldmVudC10YXJnZXRgIHwgU3RyaW5nIHwgT3B0aW9uYWwqKlxuICpcbiAqIFByb3ZpZGUgYSBzZWxlY3RvciB0aGF0IHdpbGwgbWFyayB0aGUgZWxlbWVudCB3aGljaCB3aWxsIHN0YXJ0IHRoZSBzdWJtaXQvc2F2ZSBwcm9jZXNzIG9mIHRoZSBwYWdlLiBJZiBwcm92aWRlZFxuICogdGhlIHNlbGVjdGVkIGVkaXRvciBwcmVmZXJlbmNlIHdpbGwgYmUgc2F2ZWQgdGhyb3VnaCB0aGUgdXNlciBjb25maWd1cmF0aW9uIHNlcnZpY2Ugd2l0aCBhbiBBSkFYIHJlcXVlc3QuXG4gKlxuICogSW1wb3J0YW50OiBUaGVyZSBpcyBubyBkZWZhdWx0IHZhbHVlIGZvciB0aGlzIG9wdGlvbi5cbiAqXG4gKiAqKkV2ZW50IFR5cGUgfCBgZGF0YS1lZGl0b3ItZXZlbnQtdHlwZWAgfCBTdHJpbmcgfCBPcHRpb25hbCoqXG4gKlxuICogUHJvdmlkZSBhIEphdmFTY3JpcHQgZXZlbnQgdGhhdCB3aWxsIG1hcmsgdGhlIHN1Ym1pdC9zYXZlIHByb2Nlc3Mgb2YgdGhlIHBhZ2UuIElmIHByb3ZpZGVkIGFuIGV2ZW50IGhhbmRsZXJcbiAqIHdpbGwgYmUgYm91bmQgb24gdGhlIGVsZW1lbnQgbWFya2VkIGJ5IHRoZSBcImV2ZW50LXRhcmdldFwiIG9wdGlvbiBhbmQgQUpBWCByZXF1ZXN0cyB3aWxsIHNhdmUgdGhlIGN1cnJlbnRcbiAqIGVkaXRvciBwcmVmZXJlbmNlIGluIHRoZSB1c2VyIGNvbmZpZ3VyYXRpb24gdGFibGUuXG4gKlxuICogSW1wb3J0YW50OiBUaGVyZSBpcyBubyBkZWZhdWx0IHZhbHVlIGZvciB0aGlzIG9wdGlvbi5cbiAqXG4gKiAqKkF1dG9IaWRlIHwgYGRhdGEtZWRpdG9yLWF1dG8taGlkZWAgfCBCb29sZWFuIHwgT3B0aW9uYWwqKlxuICpcbiAqIFByb3ZpZGUgXCJ0cnVlXCIgb3IgXCJmYWxzZVwiIGluIG9yZGVyIHRvIGF1dG8gaGlkZSB0aGUgZWRpdG9ycywgaWYgdGhlIHRleHRhcmVhcyBhcmUgbm90IHZpc2libGUgYXQgdGhlIGJlZ2lubmluZy5cbiAqIERlZmF1bHRzIHZhbHVlIGlzIFwiZmFsc2VcIlxuICpcbiAqICoqQXV0b1VwZGF0ZSB8IGBkYXRhLWVkaXRvci1hdXRvLXVwZGF0ZWAgfCBCb29sZWFuIHwgT3B0aW9uYWwqKlxuICpcbiAqIEluZGljYXRlcyBpZiB0aGUgY29ycmVzcG9uZGluZyB0ZXh0YXJlYSBvZiB0aGUgZWRpdG9yIHNob3VsZCBiZSB1cGRhdGVkIGF1dG9tYXRpY2FsbHkuXG4gKiBEZWZhdWx0IHZhbHVlIGlzIFwidHJ1ZVwiXG4gKlxuICogKipJbml0aWFsaXphdGlvbiBFdmVudCBUeXBlIHwgYGRhdGEtZWRpdG9yLWluaXQtZXZlbnQtdHlwZWAgfCBTdHJpbmcgfCBPcHRpb25hbCoqXG4gKlxuICogUHJvdmlkZSBhIGN1c3RvbSBpbml0aWFsaXphdGlvbiBldmVudCB3aGljaCB3aWxsIHRyaWdnZXIgdGhlIHN0YXJ0IG9mIHRoZSBlZGl0b3IgY29udmVyc2lvbi4gQnkgZGVmYXVsdCB0aGVcbiAqIGVkaXRvciBpbnN0YW5jZXMgd2lsbCBiZSBjcmVhdGVkIG9uY2UgdGhlIGVuZ2luZSBpcyByZWFkeSAnSlNFTkdJTkVfSU5JVF9GSU5JU0hFRCcsIGJ1dCB0aGVyZSBhcmUgY2FzZXMgd2hlcmVcbiAqIGEgY3VzdG9tIGV2ZW50IGlzIHJlcXVpcmVkIChlLmcuIGluaXRpYWxpemF0aW9uIG9mIGVkaXRvciB3aWRnZXQgZHluYW1pY2FsbHkgd2l0aGluIGEgZGlhbG9nKS5cbiAqXG4gKlxuICogIyMjIE9wdGlvbnMgKFRleHRhcmVhKVxuICpcbiAqIFRoZSBmb2xsb3dpbmcgb3B0aW9ucyBhcmUgYm91bmQgYXMgZGF0YSBhdHRyaWJ1dGVzIHRvIGVhY2ggdGV4dGFyZWEgZWxlbWVudCB3aXRoaW4gdGhlIHBhcmVudCBjb250YWluZXIuXG4gKlxuICogKipFZGl0b3IgSWRlbnRpZmllciB8IGBkYXRhLWVkaXRvci1pZGVudGlmaWVyYCB8IFN0cmluZyB8IFJlcXVpcmVkKipcbiAqXG4gKiBFYWNoIGNoaWxkIHRleHRhcmVhIGVsZW1lbnQgbmVlZHMgdG8gaGF2ZSBhIHVuaXF1ZSBpZGVudGlmaWVyIHN0cmluZyB3aGljaCBuZWVkcyB0byBhcHBseSB3aXRoIHRoZSBmb2xsb3dpbmdcbiAqIG5hbWluZyBjb252ZW50aW9uIHRoZSBcImVkaXRvci17cmVjb3JkIHR5cGV9LXtpZH0te3RleHRhcmVhIG5hbWV9LXtsYW5ndWFnZSBjb2RlfVxuICogKGUuZy4gZWRpdG9yLXByb2R1Y3RzLTItc2hvcnRfZGVzY3JpcHRpb24tZGUpLiBJbiBjYXNlcyB3aGVyZSB0aGUgcmVjb3JkIElEIGlzIG5vdCBzZXQgeWV0IChuZXcgcmVjb3JkIGNyZWF0aW9uKSxcbiAqIGl0IGlzIGFkdmlzZWQgdGhhdCB5b3UgbGVhdmUgdGhlIHtpZH0gcGxhY2Vob2xkZXIgYW5kIHJlcGxhY2UgaXQgbGF0ZXIgb24gd2hlbmV2ZXIgdGhlIHJlY29yZCBpcyBnZW5lcmF0ZWQgaW50b1xuICogdGhlIGRhdGFiYXNlIChtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoaXMgZWRnZSBjYXNlIGluIHRoZSBleGFtcGxlcyBiZWxvdykuXG4gKlxuICogKipFZGl0b3IgVHlwZSB8IGBkYXRhLWVkaXRvci10eXBlYCB8IFN0cmluZyB8IE9wdGlvbmFsKipcbiAqXG4gKiBUaGlzIG9wdGlvbiBjYW4gaGF2ZSBvbmUgb2YgdGhlIGF2YWlsYWJsZSBlZGl0b3IgdmFsdWVzIHdoaWNoIHdpbGwgYWxzbyBzdGF0ZSB0aGUgc2VsZWN0ZWQgZWRpdG9yIHVwb25cbiAqIGluaXRpYWxpemF0aW9uLiBJdCBpcyBvcHRpb25hbCBhbmQgdGhlIGRlZmF1bHQgdmFsdWUgaXMgXCJja2VkaXRvclwiLlxuICpcbiAqXG4gKiAjIyMgRXZlbnRzXG4gKlxuICogVGhlICcjZWRpdG9yLWNvbnRhaW5lcicgZWxlbWVudCBpcyB3aGVyZSB0aGUgd2lkZ2V0IGlzIGJvdW5kIG9uLlxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIC8vIEZpcmVzIHVwIHdoZW4gYWxsIHRleHRhcmVhcyBhcmUgcmVhZHkuXG4gKiAkKCcjZWRpdG9yLWNvbnRhaW5lcicpLm9uKCdlZGl0b3I6cmVhZHknLCAoZXZlbnQsICR0ZXh0YXJlYXMpID0+IHsgLi4uIH0pO1xuICpcbiAqIC8vIEZpcmVzIHVwIGVhY2ggdGltZSBhIHNpbmdsZSB0ZXh0YXJlYSBpcyByZWFkeS5cbiAqICQoJyNlZGl0b3ItY29udGFpbmVyJykub24oJ2VkaXRvcjp0ZXh0YXJlYV9yZWFkeScsIChldmVudCwgJHRleHRhcmVhKSA9PiB7IC4uLiB9KTtcbiAqIGBgYFxuICpcbiAqXG4gKiAjIyMgRXhhbXBsZXNcbiAqXG4gKiAqKlNpbXBsZSBVc2FnZSoqXG4gKlxuICogTm90aWNlIHRoYXQgdGhpcyBleGFtcGxlIHNob3djYXNlcyB0aGUgY3JlYXRpb24gb2YgYSBuZXcgY3VzdG9tZXIgd2hpY2ggbWVhbnMgdGhhdCB0aGUgY3VzdG9tZXIncyBJRCBpcyBub3Qga25vd25cbiAqIHlldC4gQWZ0ZXIgaXRzIGluaXRpYWxpemF0aW9uLCB0aGUgd2lkZ2V0IHdpbGwgY3JlYXRlIGEgaGlkZGVuIGZpZWxkIGluIHRoZSBmb3JtIHdpdGggdGhlXG4gKiBcImVkaXRvcl9pZGVudGlmaWVyc1t0ZXh0YXJlYS1pZGVudGlmaWVyXVwiIG5hbWUuIFRoaXMgaGlkZGVuIGZpZWxkIHdpbGwgaGF2ZSB0aGUgc2VsZWN0ZWQgZWRpdG9yIHR5cGUgYXMgdmFsdWUgd2hpY2hcbiAqIGJlIHVzZWQgYnkgdGhlIGJhY2tlbmQgY2FsbGJhY2sgdG8gc3RvcmUgdGhlIGNvcnJlY3QgZWRpdG9yIGlkZW50aWZpZXIgdmFsdWUsIG9uY2UgdGhlIGN1c3RvbWVyJ3MgSUQgaXMgZ2VuZXJhdGVkXG4gKiAocmVjb3JkIGluc2VydGVkKS4gVXNlIHRoZSBcIlVzZXJDb25maWd1cmF0aW9uU2VydmljZVwiIGluIGJhY2tlbmQgZm9yIGFkZGluZyB0aGUgdmFsdWUgdG8gdGhlIGRhdGFiYXNlLlxuICpcbiAqIGBgYGh0bWxcbiAqIDxkaXYgZGF0YS1neC13aWRnZXQ9XCJlZGl0b3JcIiBkYXRhLWVkaXRvci1ldmVudC10YXJnZXQ9XCIjY3VzdG9tZXItZm9ybVwiICBkYXRhLWVkaXRvci1ldmVudC10eXBlPVwic3VibWl0XCI+XG4gKiAgIDxmb3JtIGlkPVwiY3VzdG9tZXItZm9ybVwiPlxuICogICAgIDwhLS0gT3RoZXIgRmllbGRzIC4uLiAtPlxuICogICAgIDx0ZXh0YXJlYSBjbGFzcz1cInd5c2l3eWdcIiBkYXRhLWVkaXRvci1pZGVudGlmaWVyPVwiZWRpdG9yLWN1c3RvbWVycy17aWR9LW5vdGVzLWRlXCI+PC90ZXh0YXJlYT5cbiAqICAgPC9mb3JtPlxuICogPC9kaXY+XG4gKiBgYGBcbiAqXG4gKiBAbW9kdWxlIEFkbWluL1dpZGdldHMvZWRpdG9yXG4gKiBAcmVxdWlyZXMgQ0tFZGl0b3IsIENvZGVNaXJyb3JcbiAqL1xuZ3gud2lkZ2V0cy5tb2R1bGUoXG4gICAgJ2VkaXRvcicsXG5cbiAgICBbXG4gICAgICAgIGAke2pzZS5zb3VyY2V9L3ZlbmRvci9jb2RlbWlycm9yL2NvZGVtaXJyb3IubWluLmNzc2AsXG4gICAgICAgIGAke2pzZS5zb3VyY2V9L3ZlbmRvci9jb2RlbWlycm9yL2NvZGVtaXJyb3IubWluLmpzYCxcbiAgICAgICAgYCR7Z3guc291cmNlfS9saWJzL2VkaXRvcl9pbnN0YW5jZXNgLFxuICAgICAgICBgJHtneC5zb3VyY2V9L2xpYnMvZWRpdG9yX3ZhbHVlc2AsXG4gICAgICAgIGAke2d4LnNvdXJjZX0vd2lkZ2V0cy9xdWlja3NlbGVjdGAsXG4gICAgICAgICd1c2VyX2NvbmZpZ3VyYXRpb25fc2VydmljZSdcbiAgICBdLFxuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERlZmF1bHQgT3B0aW9uc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICBzZWxlY3RvcjogJ3RleHRhcmVhJyxcbiAgICAgICAgICAgIGF1dG9IaWRlOiAnZmFsc2UnLFxuICAgICAgICAgICAgaW5pdEV2ZW50VHlwZTogJ0pTRU5HSU5FX0lOSVRfRklOSVNIRUQnLFxuICAgICAgICAgICAgYXV0b1VwZGF0ZTogJ3RydWUnXG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZpbmFsIE9wdGlvbnNcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRWRpdG9yIEluc3RhbmNlc1xuICAgICAgICAgKlxuICAgICAgICAgKiBJZGVudGlmaWVyIC0+IGluc3RhbmNlIG1hcHBpbmdcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGVkaXRvcnMgPSB7fTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQXZhaWxhYmxlIEVkaXRvciBUeXBlc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nW119XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBlZGl0b3JUeXBlcyA9IFsnY2tlZGl0b3InLCAnY29kZW1pcnJvciddO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBGVU5DVElPTlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFkZCBFZGl0b3IgU3dpdGNoIEJ1dHRvblxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGlzIG1ldGhvZCB3aWxsIGFkZCB0aGUgZWRpdG9yIHN3aXRjaCBidXR0b24gYW5kIGJpbmQgdGhlIGNsaWNrIGV2ZW50IGhhbmRsZXIuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAkdGV4dGFyZWEgVGV4dGFyZWEgc2VsZWN0b3IgdG8gYmUgbW9kaWZpZWQuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfYWRkRWRpdG9yU3dpdGNoQnV0dG9uKCR0ZXh0YXJlYSkge1xuICAgICAgICAgICAgbGV0IHN0YXJ0ID0gMDtcbiAgICAgICAgICAgIGlmICgkdGV4dGFyZWEuZGF0YSgnZWRpdG9yVHlwZScpID09PSAnY29kZW1pcnJvcicpIHtcbiAgICAgICAgICAgICAgICBzdGFydCA9IDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICR0ZXh0YXJlYVxuICAgICAgICAgICAgICAgIC53cmFwKCc8ZGl2IGNsYXNzPVwiZWRpdG9yLXdyYXBwZXJcIiAvPicpXG4gICAgICAgICAgICAgICAgLnBhcmVudCgpXG4gICAgICAgICAgICAgICAgLnByZXBlbmQoYDxkaXYgZGF0YS1neC13aWRnZXQ9XCJxdWlja3NlbGVjdFwiIGRhdGEtcXVpY2tzZWxlY3QtYWxpZ249XCJyaWdodFwiIGRhdGEtcXVpY2tzZWxlY3Qtc3RhcnQ9XCJgXG4gICAgICAgICAgICAgICAgICAgICsgc3RhcnQgKyBgXCI+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJxdWlja3NlbGVjdC1oZWFkbGluZS13cmFwcGVyXCI+XG5cdFx0XHRcdFx0XHRcdFx0PGEgY2xhc3M9XCJlZGl0b3Itc3dpdGNoIGVkaXRvci1zd2l0Y2gtaHRtbFwiIGhyZWY9XCIjaHRtbFwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0JHtqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnQlVUVE9OX1NXSVRDSF9FRElUT1JfVEVYVCcsICdhZG1pbl9idXR0b25zJyl9XG5cdFx0XHRcdFx0XHRcdFx0PC9hPlxuXHRcdFx0XHRcdFx0XHRcdDxhIGNsYXNzPVwiZWRpdG9yLXN3aXRjaCBlZGl0b3Itc3dpdGNoLXRleHRcIiBocmVmPVwiI3RleHRcIj5cblx0XHRcdFx0XHRcdFx0XHRcdCR7anNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0JVVFRPTl9TV0lUQ0hfRURJVE9SX0hUTUwnLCAnYWRtaW5fYnV0dG9ucycpfVxuXHRcdFx0XHRcdFx0XHRcdDwvYT5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5gKVxuICAgICAgICAgICAgICAgIC5maW5kKCcuZWRpdG9yLXN3aXRjaCcpXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsIF9vblN3aXRjaEJ1dHRvbkNsaWNrKTtcblxuICAgICAgICAgICAgaWYgKCEkdGV4dGFyZWEuaXMoJzp2aXNpYmxlJykgJiYgb3B0aW9ucy5hdXRvSGlkZSA9PT0gJ3RydWUnKSB7XG4gICAgICAgICAgICAgICAgJHRleHRhcmVhLnBhcmVudCgpLmhpZGUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZ3gud2lkZ2V0cy5pbml0KCR0ZXh0YXJlYS5wYXJlbnQoKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQWRkIGEgaGlkZGVuIGVkaXRvciB0eXBlIGZpZWxkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGlzIGZpZWxkIHdpbGwgY29udGFpbiB0aGUgdHlwZSBvZiB0aGUgY3VycmVudCBlZGl0b3IgYW5kIGNhbiBiZSB1c2VkIGJ5IHN1Ym1pdCBjYWxsYmFja3Mgd2hlbmV2ZXIgdGhlXG4gICAgICAgICAqIHJlY29yZCBJRCBpcyBub3Qga25vd24geWV0IGFuZCB0aGUgdXNlciBjb25maWd1cmF0aW9uIGVudHJ5IGlzIGdlbmVyYXRlZCBieSB0aGUgc2VydmVyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJHRleHRhcmVhIFRleHRhcmVhIHNlbGVjdG9yIHRvIGJlIG1vZGlmaWVkLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2FkZEVkaXRvckhpZGRlbkZpZWxkKCR0ZXh0YXJlYSkge1xuICAgICAgICAgICAgJHRleHRhcmVhXG4gICAgICAgICAgICAgICAgLnBhcmVudCgpXG4gICAgICAgICAgICAgICAgLmFwcGVuZChgXG5cdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJoaWRkZW5cIiBcblx0XHRcdFx0XHRcdG5hbWU9XCJlZGl0b3JfaWRlbnRpZmllcnNbJHskdGV4dGFyZWEuZGF0YSgnZWRpdG9ySWRlbnRpZmllcicpfV1cIiBcblx0XHRcdFx0XHRcdHZhbHVlPVwiJHskdGV4dGFyZWEuZGF0YSgnZWRpdG9yVHlwZScpIHx8ICdja2VkaXRvcid9XCIgLz5cblx0XHRcdFx0YCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ3JlYXRlIEVkaXRvciBJbnN0YW5jZVxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGlzIG1ldGhvZCB3aWxsIHVzZSB0aGUgXCJlZGl0b3JcIiBsaWJyYXJ5IHRvIGNyZWF0ZSB0aGUgYXBwcm9wcmlhdGUgZWRpdG9yIGluc3RhbmNlLCBkZXBlbmRpbmcgdGhlIHRleHRhcmVhXG4gICAgICAgICAqIHR5cGUgYXR0cmlidXRlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJHRleHRhcmVhIFRleHRhcmVhIHNlbGVjdG9yIHRvIGJlIG1vZGlmaWVkLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2NyZWF0ZUVkaXRvckluc3RhbmNlKCR0ZXh0YXJlYSkge1xuICAgICAgICAgICAgY29uc3QgdHlwZSA9ICR0ZXh0YXJlYS5kYXRhKCdlZGl0b3JUeXBlJykgfHwgJ2NrZWRpdG9yJztcbiAgICAgICAgICAgIGNvbnN0IGlkZW50aWZpZXIgPSAkdGV4dGFyZWEuZGF0YSgnZWRpdG9ySWRlbnRpZmllcicpO1xuXG4gICAgICAgICAgICBlZGl0b3JzW2lkZW50aWZpZXJdID0ganNlLmxpYnMuZWRpdG9yX2luc3RhbmNlcy5jcmVhdGUoJHRleHRhcmVhLCB0eXBlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPbiBTd2l0Y2ggQnV0dG9uIENsaWNrIEV2ZW50IEhhbmRsZXJcbiAgICAgICAgICpcbiAgICAgICAgICogVGhpcyBtZXRob2Qgd2lsbCB1c2UgdGhlIFwiZWRpdG9yXCIgbGlicmFyeSB0byBjaGFuZ2UgdGhlIGN1cnJlbnQgZWRpdG9yIHR5cGUgYW5kIHVwZGF0ZSB0aGUgaGlkZGVuIGlucHV0XG4gICAgICAgICAqIGZpZWxkIGFuZCBkYXRhIGF0dHJpYnV0ZXMgb2YgdGhlIHRleHRhcmVhLiBJdCB3aWxsIHRyeSB0byBzZXQgdGhlIG5leHQgYXZhaWxhYmxlIGVkaXRvciB0eXBlLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uU3dpdGNoQnV0dG9uQ2xpY2soKSB7XG4gICAgICAgICAgICBjb25zdCAkc3dpdGNoQnV0dG9uID0gJCh0aGlzKTtcbiAgICAgICAgICAgIGNvbnN0ICR0ZXh0YXJlYSA9ICRzd2l0Y2hCdXR0b24ucGFyZW50cygnLmVkaXRvci13cmFwcGVyJykuZmluZCgndGV4dGFyZWEnKTtcbiAgICAgICAgICAgIGNvbnN0IGlkZW50aWZpZXIgPSAkdGV4dGFyZWEuZGF0YSgnZWRpdG9ySWRlbnRpZmllcicpO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFR5cGUgPSAkdGV4dGFyZWEuZGF0YSgnZWRpdG9yVHlwZScpO1xuICAgICAgICAgICAgY29uc3QgbmV3VHlwZSA9ICRzd2l0Y2hCdXR0b24uaGFzQ2xhc3MoJ2VkaXRvci1zd2l0Y2gtdGV4dCcpID8gZWRpdG9yVHlwZXNbMV0gOiBlZGl0b3JUeXBlc1swXTtcblxuICAgICAgICAgICAgJHRleHRhcmVhLnNpYmxpbmdzKGBbbmFtZT1cImVkaXRvcl9pZGVudGlmaWVyc1ske2lkZW50aWZpZXJ9XVwiXWApLnZhbChuZXdUeXBlKTtcbiAgICAgICAgICAgICR0ZXh0YXJlYS5kYXRhKCdlZGl0b3JUeXBlJywgbmV3VHlwZSk7XG5cbiAgICAgICAgICAgIGVkaXRvcnNbaWRlbnRpZmllcl0gPSBqc2UubGlicy5lZGl0b3JfaW5zdGFuY2VzLnN3aXRjaCgkdGV4dGFyZWEsIGN1cnJlbnRUeXBlLCBuZXdUeXBlKTtcbiAgICAgICAgICAgIF9iaW5kQXV0b1VwZGF0ZSgkdGV4dGFyZWEpO1xuICAgICAgICAgICAgX3VwZGF0ZVRleHRBcmVhKCR0ZXh0YXJlYSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogT24gUGFnZSBTdWJtaXQgSGFuZGxlclxuICAgICAgICAgKlxuICAgICAgICAgKiBJZiB0aGUgZXZlbnQgdGFyZ2V0IGFuZCB0eXBlIGFyZSBwcm92aWRlZCB0aGlzIG1ldGhvZCB3aWxsIGJlIHRyaWdnZXJlZCB0byBzYXZlIHRoZSB1c2VyIGNvbmZpZ3VyYXRpb25cbiAgICAgICAgICogdmFsdWVzIGluIHRoZSBkYXRhYmFzZSB3aXRoIEFKQVggcmVxdWVzdHMuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25QYWdlU3VibWl0KCkge1xuICAgICAgICAgICAgZm9yIChsZXQgaWRlbnRpZmllciBpbiBlZGl0b3JzKSB7XG4gICAgICAgICAgICAgICAganNlLmxpYnMudXNlcl9jb25maWd1cmF0aW9uX3NlcnZpY2Uuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklkOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhdGlvbktleTogaWRlbnRpZmllcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYXRpb25WYWx1ZTogZWRpdG9yc1tpZGVudGlmaWVyXS50eXBlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBCaW5kIEF1dG8gVXBkYXRlXG4gICAgICAgICAqXG4gICAgICAgICAqIEJpbmRzIGFuIGV2ZW50IGhhbmRsZXIgdG8gYW4gZWRpdG9yIGluc3RhbmNlIHRvIGF1dG9tYXRpY2FsbHkgdXBkYXRlIHRoZVxuICAgICAgICAgKiBjb3JyZXNwb25kaW5nIHRleHRhcmVhLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJHRleHRhcmVhIFRleHRhcmVhIHRoZSBhdXRvIHVwZGF0ZSBzaG91bGQgYmUgYm91bmQgdG9cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9iaW5kQXV0b1VwZGF0ZSgkdGV4dGFyZWEpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmF1dG9VcGRhdGUgPT09ICdmYWxzZScpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gZWRpdG9yc1skdGV4dGFyZWEuZGF0YSgnZWRpdG9ySWRlbnRpZmllcicpXTtcblxuICAgICAgICAgICAgaW5zdGFuY2Uub24oJ2NoYW5nZScsICgpID0+IF91cGRhdGVUZXh0QXJlYSgkdGV4dGFyZWEpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVcGRhdGUgVGV4dCBBcmVhIFZhbHVlXG4gICAgICAgICAqXG4gICAgICAgICAqIFRyYW5zZmVycyB0aGUgdmFsdWUgb2YgdGhlIGVkaXRvciBpbnN0YW5jZSBvZiB0aGUgZ2l2ZW4gdGV4dGFyZWEgdG8gaXRzIGNvcnJlc3BvbmRpbmcgdGV4dGFyZWEuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAkdGV4dGFyZWEgVGhlIHRleHRhcmVhIHRvIGJlIHVwZGF0ZWQuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfdXBkYXRlVGV4dEFyZWEoJHRleHRhcmVhKSB7XG4gICAgICAgICAgICBjb25zdCBlZGl0b3JUeXBlID0gJHRleHRhcmVhLmRhdGEoJ2VkaXRvclR5cGUnKTtcbiAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gZWRpdG9yc1skdGV4dGFyZWEuZGF0YSgnZWRpdG9ySWRlbnRpZmllcicpXTtcblxuICAgICAgICAgICAgc3dpdGNoIChlZGl0b3JUeXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnY2tlZGl0b3InOlxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZS51cGRhdGVFbGVtZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnY29kZW1pcnJvcic6XG4gICAgICAgICAgICAgICAgICAgICR0ZXh0YXJlYS52YWwoanNlLmxpYnMuZWRpdG9yX3ZhbHVlcy5nZXRWYWx1ZSgkdGV4dGFyZWEpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0VkaXRvciB0eXBlIG5vdCByZWNvZ25pemVkLicsIGVkaXRvclR5cGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkdGV4dGFyZWEudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgJChkb2N1bWVudCkub24oJ0pTRU5HSU5FX0lOSVRfRklOSVNIRUQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGVwZW5kZW5jaWVzID0gW1xuICAgICAgICAgICAgICAgICAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3IvY29kZW1pcnJvci9jc3MubWluLmpzYCxcbiAgICAgICAgICAgICAgICAgICAgYCR7anNlLnNvdXJjZX0vdmVuZG9yL2NvZGVtaXJyb3IvaHRtbG1peGVkLm1pbi5qc2AsXG4gICAgICAgICAgICAgICAgICAgIGAke2pzZS5zb3VyY2V9L3ZlbmRvci9jb2RlbWlycm9yL2phdmFzY3JpcHQubWluLmpzYCxcbiAgICAgICAgICAgICAgICAgICAgYCR7anNlLnNvdXJjZX0vdmVuZG9yL2NvZGVtaXJyb3IveG1sLm1pbi5qc2BcbiAgICAgICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICAgICAganNlLmNvcmUubW9kdWxlX2xvYWRlci5yZXF1aXJlKGRlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gSW5pdGlhbGl6ZSB0aGUgZWRpdG9ycyBhZnRlciBhIHNwZWNpZmljIGV2ZW50IGluIG9yZGVyIHRvIG1ha2Ugc3VyZSB0aGF0IG90aGVyIG1vZHVsZXMgd2lsbCBiZVxuICAgICAgICAgICAgLy8gYWxyZWFkeSBpbml0aWFsaXplZCBhbmQgbm90aGluZyBlbHNlIHdpbGwgY2hhbmdlIHRoZSBtYXJrdXAuXG4gICAgICAgICAgICAkKHdpbmRvdykub24ob3B0aW9ucy5pbml0RXZlbnRUeXBlLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgJHRleHRhcmVhcyA9ICR0aGlzLmZpbmQob3B0aW9ucy5zZWxlY3Rvcik7XG5cbiAgICAgICAgICAgICAgICAkdGV4dGFyZWFzLmVhY2goKGluZGV4LCB0ZXh0YXJlYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCAkdGV4dGFyZWEgPSAkKHRleHRhcmVhKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZWRpdG9yVHlwZXMuaW5kZXhPZigkdGV4dGFyZWEuZGF0YSgnZWRpdG9yVHlwZScpKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICR0ZXh0YXJlYS5kYXRhKCdlZGl0b3JUeXBlJywgZWRpdG9yVHlwZXNbMF0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgX2FkZEVkaXRvclN3aXRjaEJ1dHRvbigkdGV4dGFyZWEpO1xuICAgICAgICAgICAgICAgICAgICBfYWRkRWRpdG9ySGlkZGVuRmllbGQoJHRleHRhcmVhKTtcbiAgICAgICAgICAgICAgICAgICAgX2NyZWF0ZUVkaXRvckluc3RhbmNlKCR0ZXh0YXJlYSk7XG4gICAgICAgICAgICAgICAgICAgIF9iaW5kQXV0b1VwZGF0ZSgkdGV4dGFyZWEpO1xuXG4gICAgICAgICAgICAgICAgICAgICR0aGlzLnRyaWdnZXIoJ2VkaXRvcjp0ZXh0YXJlYV9yZWFkeScsIFskdGV4dGFyZWFdKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICR0aGlzLnRyaWdnZXIoJ2VkaXRvcjpyZWFkeScsIFskdGV4dGFyZWFzXSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gSWYgdGhlIGV2ZW50IHRhcmdldCBhbmQgdHlwZSBvcHRpb25zIGFyZSBhdmFpbGFibGUsIGJpbmQgdGhlIHBhZ2Ugc3VibWl0IGhhbmRsZXIuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5ldmVudFRhcmdldCAhPT0gdW5kZWZpbmVkICYmIG9wdGlvbnMuZXZlbnRUeXBlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAkKG9wdGlvbnMuZXZlbnRUYXJnZXQpLm9uKG9wdGlvbnMuZXZlbnRUeXBlLCBfb25QYWdlU3VibWl0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFJldHVybiBkYXRhIHRvIG1vZHVsZSBlbmdpbmUuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7XG4iXX0=
