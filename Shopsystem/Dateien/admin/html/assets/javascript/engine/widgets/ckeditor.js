'use strict';

/* --------------------------------------------------------------
 ckeditor.js 2017-07-19
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## CKEditor Widget
 *
 * Use this widget on a parent container to convert all the textareas with the "wysiwyg" class into
 * CKEditor instances at once.
 *
 * Official CKEditor Website: {@link http://ckeditor.com}
 *
 * ### Options
 *
 * **File Browser URL | `data-ckeditor-filebrowser-browse-url` | String | Optional**
 *
 * Provide the default URL of the file browser that is integrated within the CKEditor instance. The default
 * value points is 'includes/ckeditor/filemanager/index.html'.
 *
 * **Base URL | `data-ckeditor-base-href` | String | Optional**
 *
 * The base URL of the CKEditor instance. The default value points to the `https://example.org/admin` directory.
 *
 * **Enter Mode | `data-ckeditor-enter-mode` | Number | Optional**
 *
 * Define the enter mode of the CKEditor instance. The default value of this option is CKEDITOR.ENTER_BR which
 * means that the editor will use the `<br>` element for every line break. For a list of possible values visit
 * this [CKEditor API reference page](http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.config.html#.enterMode).
 *
 * **Shift Enter Mode | `data-ckeditor-shift-enter-mode` | Number| Optional**
 *
 * Define the shift-enter mode of the CKEditor instance. The default value of this option is CKEDITOR.ENTER_P which
 * means that the editor will use the `<p>` element for every line break. For a list of possible values visit this
 * [CKEditor API reference page](http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.config.html#.shiftEnterMode).
 *
 * **Language Code | `data-ckeditor-language` | String | Optional**
 *
 * Provide a language code for the CKEditor instance. The default value comes from the
 * `jse.core.config.get('languageCode')` value which has the active language setting of the current page.
 *
 * ### Example
 *
 * When the page loads the textarea element will be converted into a CKEditor instance.
 *
 * ```html
 * <div data-gx-widget="ckeditor">
 *   <textarea name="my-textarea" class="wysiwyg"></textarea>
 * </div>
 * ```
 *
 * **Important: For CKEditor to work correctly the textarea elements need to have a `name` attribute.**
 *
 * @module Admin/Widgets/ckeditor
 * @requires CKEditor-Library
 */
gx.widgets.module('ckeditor', [], function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLE DEFINITION
    // ------------------------------------------------------------------------

    var
    /**
     * Widget Reference
     *
     * @type {object}
     */
    $this = $(this),


    /**
     * Default Options for Widget
     *
     * @type {object}
     */
    defaults = { // Configuration gets passed to the ckeditor.
        'filebrowserBrowseUrl': 'includes/ckeditor/filemanager/index.html',
        'baseHref': jse.core.config.get('appUrl') + '/admin',
        'enterMode': CKEDITOR.ENTER_BR,
        'shiftEnterMode': CKEDITOR.ENTER_P,
        'language': jse.core.config.get('languageCode'),
        'useRelPath': true
    },


    /**
     * Final Widget Options
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
     * Editors Selector Object
     *
     * @type {object}
     */
    $editors = null;

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    /**
     * Initialize method of the widget, called by the engine.
     */
    module.init = function (done) {
        if (!options.useRelPath) {
            options.filebrowserBrowseUrl += '?mode=mail';
        }

        $editors = $this.filter('.wysiwyg').add($this.find('.wysiwyg'));

        $editors.each(function () {
            var $self = $(this),
                dataset = $.extend({}, options, $self.data()),
                // Get textarea specific configuration.
            name = $self.attr('name');
            $self.removeClass('wysiwyg');
            CKEDITOR.replace(name, dataset);
        });

        // Event handler for the update event, which is updating the ckeditor with the value
        // of the textarea.
        $this.on('ckeditor.update', function () {
            $editors.each(function () {
                var $self = $(this),
                    name = $self.attr('name'),
                    editor = CKEDITOR ? CKEDITOR.instances[name] : null;

                if (editor) {
                    editor.setData($self.val());
                }
            });
        });

        $this.trigger('widget.initialized', 'ckeditor');

        done();
    };

    // Return data to module engine.
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNrZWRpdG9yLmpzIl0sIm5hbWVzIjpbImd4Iiwid2lkZ2V0cyIsIm1vZHVsZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJkZWZhdWx0cyIsImpzZSIsImNvcmUiLCJjb25maWciLCJnZXQiLCJDS0VESVRPUiIsIkVOVEVSX0JSIiwiRU5URVJfUCIsIm9wdGlvbnMiLCJleHRlbmQiLCIkZWRpdG9ycyIsImluaXQiLCJkb25lIiwidXNlUmVsUGF0aCIsImZpbGVicm93c2VyQnJvd3NlVXJsIiwiZmlsdGVyIiwiYWRkIiwiZmluZCIsImVhY2giLCIkc2VsZiIsImRhdGFzZXQiLCJuYW1lIiwiYXR0ciIsInJlbW92ZUNsYXNzIiwicmVwbGFjZSIsIm9uIiwiZWRpdG9yIiwiaW5zdGFuY2VzIiwic2V0RGF0YSIsInZhbCIsInRyaWdnZXIiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbURBQSxHQUFHQyxPQUFILENBQVdDLE1BQVgsQ0FDSSxVQURKLEVBR0ksRUFISixFQUtJLFVBQVVDLElBQVYsRUFBZ0I7O0FBRVo7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0k7Ozs7O0FBS0FDLFlBQVFDLEVBQUUsSUFBRixDQU5aOzs7QUFRSTs7Ozs7QUFLQUMsZUFBVyxFQUFFO0FBQ1QsZ0NBQXdCLDBDQURqQjtBQUVQLG9CQUFZQyxJQUFJQyxJQUFKLENBQVNDLE1BQVQsQ0FBZ0JDLEdBQWhCLENBQW9CLFFBQXBCLElBQWdDLFFBRnJDO0FBR1AscUJBQWFDLFNBQVNDLFFBSGY7QUFJUCwwQkFBa0JELFNBQVNFLE9BSnBCO0FBS1Asb0JBQVlOLElBQUlDLElBQUosQ0FBU0MsTUFBVCxDQUFnQkMsR0FBaEIsQ0FBb0IsY0FBcEIsQ0FMTDtBQU1QLHNCQUFjO0FBTlAsS0FiZjs7O0FBc0JJOzs7OztBQUtBSSxjQUFVVCxFQUFFVSxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJULFFBQW5CLEVBQTZCSCxJQUE3QixDQTNCZDs7O0FBNkJJOzs7OztBQUtBRCxhQUFTLEVBbENiOzs7QUFvQ0k7Ozs7O0FBS0FjLGVBQVcsSUF6Q2Y7O0FBMkNBO0FBQ0E7QUFDQTs7QUFFQTs7O0FBR0FkLFdBQU9lLElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCO0FBQzFCLFlBQUksQ0FBQ0osUUFBUUssVUFBYixFQUF5QjtBQUNyQkwsb0JBQVFNLG9CQUFSLElBQWdDLFlBQWhDO0FBQ0g7O0FBRURKLG1CQUFXWixNQUNOaUIsTUFETSxDQUNDLFVBREQsRUFFTkMsR0FGTSxDQUVGbEIsTUFBTW1CLElBQU4sQ0FBVyxVQUFYLENBRkUsQ0FBWDs7QUFJQVAsaUJBQ0tRLElBREwsQ0FDVSxZQUFZO0FBQ2QsZ0JBQUlDLFFBQVFwQixFQUFFLElBQUYsQ0FBWjtBQUFBLGdCQUNJcUIsVUFBVXJCLEVBQUVVLE1BQUYsQ0FBUyxFQUFULEVBQWFELE9BQWIsRUFBc0JXLE1BQU10QixJQUFOLEVBQXRCLENBRGQ7QUFBQSxnQkFDbUQ7QUFDL0N3QixtQkFBT0YsTUFBTUcsSUFBTixDQUFXLE1BQVgsQ0FGWDtBQUdBSCxrQkFBTUksV0FBTixDQUFrQixTQUFsQjtBQUNBbEIscUJBQVNtQixPQUFULENBQWlCSCxJQUFqQixFQUF1QkQsT0FBdkI7QUFDSCxTQVBMOztBQVNBO0FBQ0E7QUFDQXRCLGNBQU0yQixFQUFOLENBQVMsaUJBQVQsRUFBNEIsWUFBWTtBQUNwQ2YscUJBQ0tRLElBREwsQ0FDVSxZQUFZO0FBQ2Qsb0JBQUlDLFFBQVFwQixFQUFFLElBQUYsQ0FBWjtBQUFBLG9CQUNJc0IsT0FBT0YsTUFBTUcsSUFBTixDQUFXLE1BQVgsQ0FEWDtBQUFBLG9CQUVJSSxTQUFVckIsUUFBRCxHQUFhQSxTQUFTc0IsU0FBVCxDQUFtQk4sSUFBbkIsQ0FBYixHQUF3QyxJQUZyRDs7QUFJQSxvQkFBSUssTUFBSixFQUFZO0FBQ1JBLDJCQUFPRSxPQUFQLENBQWVULE1BQU1VLEdBQU4sRUFBZjtBQUNIO0FBQ0osYUFUTDtBQVVILFNBWEQ7O0FBYUEvQixjQUFNZ0MsT0FBTixDQUFjLG9CQUFkLEVBQW9DLFVBQXBDOztBQUVBbEI7QUFDSCxLQXBDRDs7QUFzQ0E7QUFDQSxXQUFPaEIsTUFBUDtBQUNILENBdkdMIiwiZmlsZSI6ImNrZWRpdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBja2VkaXRvci5qcyAyMDE3LTA3LTE5XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNyBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBDS0VkaXRvciBXaWRnZXRcbiAqXG4gKiBVc2UgdGhpcyB3aWRnZXQgb24gYSBwYXJlbnQgY29udGFpbmVyIHRvIGNvbnZlcnQgYWxsIHRoZSB0ZXh0YXJlYXMgd2l0aCB0aGUgXCJ3eXNpd3lnXCIgY2xhc3MgaW50b1xuICogQ0tFZGl0b3IgaW5zdGFuY2VzIGF0IG9uY2UuXG4gKlxuICogT2ZmaWNpYWwgQ0tFZGl0b3IgV2Vic2l0ZToge0BsaW5rIGh0dHA6Ly9ja2VkaXRvci5jb219XG4gKlxuICogIyMjIE9wdGlvbnNcbiAqXG4gKiAqKkZpbGUgQnJvd3NlciBVUkwgfCBgZGF0YS1ja2VkaXRvci1maWxlYnJvd3Nlci1icm93c2UtdXJsYCB8IFN0cmluZyB8IE9wdGlvbmFsKipcbiAqXG4gKiBQcm92aWRlIHRoZSBkZWZhdWx0IFVSTCBvZiB0aGUgZmlsZSBicm93c2VyIHRoYXQgaXMgaW50ZWdyYXRlZCB3aXRoaW4gdGhlIENLRWRpdG9yIGluc3RhbmNlLiBUaGUgZGVmYXVsdFxuICogdmFsdWUgcG9pbnRzIGlzICdpbmNsdWRlcy9ja2VkaXRvci9maWxlbWFuYWdlci9pbmRleC5odG1sJy5cbiAqXG4gKiAqKkJhc2UgVVJMIHwgYGRhdGEtY2tlZGl0b3ItYmFzZS1ocmVmYCB8IFN0cmluZyB8IE9wdGlvbmFsKipcbiAqXG4gKiBUaGUgYmFzZSBVUkwgb2YgdGhlIENLRWRpdG9yIGluc3RhbmNlLiBUaGUgZGVmYXVsdCB2YWx1ZSBwb2ludHMgdG8gdGhlIGBodHRwczovL2V4YW1wbGUub3JnL2FkbWluYCBkaXJlY3RvcnkuXG4gKlxuICogKipFbnRlciBNb2RlIHwgYGRhdGEtY2tlZGl0b3ItZW50ZXItbW9kZWAgfCBOdW1iZXIgfCBPcHRpb25hbCoqXG4gKlxuICogRGVmaW5lIHRoZSBlbnRlciBtb2RlIG9mIHRoZSBDS0VkaXRvciBpbnN0YW5jZS4gVGhlIGRlZmF1bHQgdmFsdWUgb2YgdGhpcyBvcHRpb24gaXMgQ0tFRElUT1IuRU5URVJfQlIgd2hpY2hcbiAqIG1lYW5zIHRoYXQgdGhlIGVkaXRvciB3aWxsIHVzZSB0aGUgYDxicj5gIGVsZW1lbnQgZm9yIGV2ZXJ5IGxpbmUgYnJlYWsuIEZvciBhIGxpc3Qgb2YgcG9zc2libGUgdmFsdWVzIHZpc2l0XG4gKiB0aGlzIFtDS0VkaXRvciBBUEkgcmVmZXJlbmNlIHBhZ2VdKGh0dHA6Ly9kb2NzLmNrc291cmNlLmNvbS9ja2VkaXRvcl9hcGkvc3ltYm9scy9DS0VESVRPUi5jb25maWcuaHRtbCMuZW50ZXJNb2RlKS5cbiAqXG4gKiAqKlNoaWZ0IEVudGVyIE1vZGUgfCBgZGF0YS1ja2VkaXRvci1zaGlmdC1lbnRlci1tb2RlYCB8IE51bWJlcnwgT3B0aW9uYWwqKlxuICpcbiAqIERlZmluZSB0aGUgc2hpZnQtZW50ZXIgbW9kZSBvZiB0aGUgQ0tFZGl0b3IgaW5zdGFuY2UuIFRoZSBkZWZhdWx0IHZhbHVlIG9mIHRoaXMgb3B0aW9uIGlzIENLRURJVE9SLkVOVEVSX1Agd2hpY2hcbiAqIG1lYW5zIHRoYXQgdGhlIGVkaXRvciB3aWxsIHVzZSB0aGUgYDxwPmAgZWxlbWVudCBmb3IgZXZlcnkgbGluZSBicmVhay4gRm9yIGEgbGlzdCBvZiBwb3NzaWJsZSB2YWx1ZXMgdmlzaXQgdGhpc1xuICogW0NLRWRpdG9yIEFQSSByZWZlcmVuY2UgcGFnZV0oaHR0cDovL2RvY3MuY2tzb3VyY2UuY29tL2NrZWRpdG9yX2FwaS9zeW1ib2xzL0NLRURJVE9SLmNvbmZpZy5odG1sIy5zaGlmdEVudGVyTW9kZSkuXG4gKlxuICogKipMYW5ndWFnZSBDb2RlIHwgYGRhdGEtY2tlZGl0b3ItbGFuZ3VhZ2VgIHwgU3RyaW5nIHwgT3B0aW9uYWwqKlxuICpcbiAqIFByb3ZpZGUgYSBsYW5ndWFnZSBjb2RlIGZvciB0aGUgQ0tFZGl0b3IgaW5zdGFuY2UuIFRoZSBkZWZhdWx0IHZhbHVlIGNvbWVzIGZyb20gdGhlXG4gKiBganNlLmNvcmUuY29uZmlnLmdldCgnbGFuZ3VhZ2VDb2RlJylgIHZhbHVlIHdoaWNoIGhhcyB0aGUgYWN0aXZlIGxhbmd1YWdlIHNldHRpbmcgb2YgdGhlIGN1cnJlbnQgcGFnZS5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIFdoZW4gdGhlIHBhZ2UgbG9hZHMgdGhlIHRleHRhcmVhIGVsZW1lbnQgd2lsbCBiZSBjb252ZXJ0ZWQgaW50byBhIENLRWRpdG9yIGluc3RhbmNlLlxuICpcbiAqIGBgYGh0bWxcbiAqIDxkaXYgZGF0YS1neC13aWRnZXQ9XCJja2VkaXRvclwiPlxuICogICA8dGV4dGFyZWEgbmFtZT1cIm15LXRleHRhcmVhXCIgY2xhc3M9XCJ3eXNpd3lnXCI+PC90ZXh0YXJlYT5cbiAqIDwvZGl2PlxuICogYGBgXG4gKlxuICogKipJbXBvcnRhbnQ6IEZvciBDS0VkaXRvciB0byB3b3JrIGNvcnJlY3RseSB0aGUgdGV4dGFyZWEgZWxlbWVudHMgbmVlZCB0byBoYXZlIGEgYG5hbWVgIGF0dHJpYnV0ZS4qKlxuICpcbiAqIEBtb2R1bGUgQWRtaW4vV2lkZ2V0cy9ja2VkaXRvclxuICogQHJlcXVpcmVzIENLRWRpdG9yLUxpYnJhcnlcbiAqL1xuZ3gud2lkZ2V0cy5tb2R1bGUoXG4gICAgJ2NrZWRpdG9yJyxcblxuICAgIFtdLFxuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFIERFRklOSVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFdpZGdldCBSZWZlcmVuY2VcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkdGhpcyA9ICQodGhpcyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRGVmYXVsdCBPcHRpb25zIGZvciBXaWRnZXRcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBkZWZhdWx0cyA9IHsgLy8gQ29uZmlndXJhdGlvbiBnZXRzIHBhc3NlZCB0byB0aGUgY2tlZGl0b3IuXG4gICAgICAgICAgICAgICAgJ2ZpbGVicm93c2VyQnJvd3NlVXJsJzogJ2luY2x1ZGVzL2NrZWRpdG9yL2ZpbGVtYW5hZ2VyL2luZGV4Lmh0bWwnLFxuICAgICAgICAgICAgICAgICdiYXNlSHJlZic6IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpICsgJy9hZG1pbicsXG4gICAgICAgICAgICAgICAgJ2VudGVyTW9kZSc6IENLRURJVE9SLkVOVEVSX0JSLFxuICAgICAgICAgICAgICAgICdzaGlmdEVudGVyTW9kZSc6IENLRURJVE9SLkVOVEVSX1AsXG4gICAgICAgICAgICAgICAgJ2xhbmd1YWdlJzoganNlLmNvcmUuY29uZmlnLmdldCgnbGFuZ3VhZ2VDb2RlJyksXG4gICAgICAgICAgICAgICAgJ3VzZVJlbFBhdGgnOiB0cnVlXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZpbmFsIFdpZGdldCBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIE9iamVjdFxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1vZHVsZSA9IHt9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEVkaXRvcnMgU2VsZWN0b3IgT2JqZWN0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJGVkaXRvcnMgPSBudWxsO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5pdGlhbGl6ZSBtZXRob2Qgb2YgdGhlIHdpZGdldCwgY2FsbGVkIGJ5IHRoZSBlbmdpbmUuXG4gICAgICAgICAqL1xuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICBpZiAoIW9wdGlvbnMudXNlUmVsUGF0aCkge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMuZmlsZWJyb3dzZXJCcm93c2VVcmwgKz0gJz9tb2RlPW1haWwnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkZWRpdG9ycyA9ICR0aGlzXG4gICAgICAgICAgICAgICAgLmZpbHRlcignLnd5c2l3eWcnKVxuICAgICAgICAgICAgICAgIC5hZGQoJHRoaXMuZmluZCgnLnd5c2l3eWcnKSk7XG5cbiAgICAgICAgICAgICRlZGl0b3JzXG4gICAgICAgICAgICAgICAgLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgJHNlbGYgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YXNldCA9ICQuZXh0ZW5kKHt9LCBvcHRpb25zLCAkc2VsZi5kYXRhKCkpLCAvLyBHZXQgdGV4dGFyZWEgc3BlY2lmaWMgY29uZmlndXJhdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUgPSAkc2VsZi5hdHRyKCduYW1lJyk7XG4gICAgICAgICAgICAgICAgICAgICRzZWxmLnJlbW92ZUNsYXNzKCd3eXNpd3lnJyk7XG4gICAgICAgICAgICAgICAgICAgIENLRURJVE9SLnJlcGxhY2UobmFtZSwgZGF0YXNldCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIEV2ZW50IGhhbmRsZXIgZm9yIHRoZSB1cGRhdGUgZXZlbnQsIHdoaWNoIGlzIHVwZGF0aW5nIHRoZSBja2VkaXRvciB3aXRoIHRoZSB2YWx1ZVxuICAgICAgICAgICAgLy8gb2YgdGhlIHRleHRhcmVhLlxuICAgICAgICAgICAgJHRoaXMub24oJ2NrZWRpdG9yLnVwZGF0ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkZWRpdG9yc1xuICAgICAgICAgICAgICAgICAgICAuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgJHNlbGYgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUgPSAkc2VsZi5hdHRyKCduYW1lJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWRpdG9yID0gKENLRURJVE9SKSA/IENLRURJVE9SLmluc3RhbmNlc1tuYW1lXSA6IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlZGl0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlZGl0b3Iuc2V0RGF0YSgkc2VsZi52YWwoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICR0aGlzLnRyaWdnZXIoJ3dpZGdldC5pbml0aWFsaXplZCcsICdja2VkaXRvcicpO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gUmV0dXJuIGRhdGEgdG8gbW9kdWxlIGVuZ2luZS5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
