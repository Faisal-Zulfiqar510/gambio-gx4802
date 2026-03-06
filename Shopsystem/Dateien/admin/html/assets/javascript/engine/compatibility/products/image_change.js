'use strict';

/* --------------------------------------------------------------
 image_change.js 2018-04-09
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2018 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Products Image Change Module
 *
 * This module is responsible for effects on image changes.
 *
 * @module Compatibility/image_change
 */
gx.compatibility.module(
// Module name
'image_change',

// Module dependencies
['image_resizer', 'xhr', 'modal', jse.source + '/vendor/jquery-ui-dist/jquery-ui.min.css', jse.source + '/vendor/jquery-ui-dist/jquery-ui.js'],

/** @lends module:Compatibility/image_change */

function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES DEFINITION
    // ------------------------------------------------------------------------

    // Shortcut to module element.

    var $this = $(this);

    // Shortcut to image resizer libary.
    var resize = jse.libs.image_resizer.resize;

    // AJAX request library
    var xhr = jse.libs.xhr;

    // Modal library
    var modal = jse.libs.modal;

    // Elements selector object.
    var selectors = {
        input: 'input:file',
        form: 'form',
        previewImage: '[data-image]',
        filenameLabel: '[data-filename-label]',
        filenameInput: '[data-filename-input]',
        showImage: '[data-show-image]',
        fileInputName: '[data-file-input-name]',
        originalImageName: '[data-original-image]'
    };

    // Module object.
    var module = {};

    // ------------------------------------------------------------------------
    // PRIVATE METHODS
    // ------------------------------------------------------------------------

    /**
     * Handles file changes in input field.
     * @param  {jQuery.Event} event Event fired
     */
    var _onNewImage = function _onNewImage(event) {
        // Preview image.
        var $previewImage = $this.find(selectors.previewImage);

        // File put.
        var file = event.target.files[0];
        var fileName = file.name;

        if (/\.(jpg|jpeg|png|gif|bmp)$/i.test(fileName) === false) {
            modal.message({
                title: jse.core.lang.translate('GM_UPLOAD_IMAGE_MODAL_ERROR', 'gm_product_images'),
                content: jse.core.lang.translate('GM_UPLOAD_IMAGE_MODAL_INVALID_FILE_FORMAT', 'gm_product_images')
            });

            return;
        }

        // Replace some specialchars. Still allowed are these chars: . - _
        fileName = fileName.replace(/[\s!$§%#^&*()+|~=`´{}\[\]:";\'<>?,\\\/]+/g, '-');

        // Make sure that the filename is unique.
        var length = $('input[name="image_file[' + fileName + ']"]').length,
            counter = 1;
        while (length !== 0) {
            var newFileName = fileName.replace(/(\.)/, String(counter) + '.');

            length = $('input[name="image_file[' + newFileName + ']"]').length;

            if (length === 0) {
                fileName = newFileName;
            }

            counter++;
        }

        xhr.get({ url: 'admin.php?do=MaxFileSize' }).done(function (result) {
            var maxFileSizeAllowed = result.maxFileSize;
            var actualFileSize = file.size / Math.pow(1024, 2);

            if (actualFileSize > maxFileSizeAllowed) {
                var message = jse.core.lang.translate('TXT_FILE_TOO_LARGE', 'categories');
                alert(message + maxFileSizeAllowed + ' MB');
                return;
            }
            // Create a FileReader to read the input file.
            var Reader = new FileReader();

            // As soon as the image file has been loaded,
            // the loaded image file will be put into the
            // preview image tag and finally resized and displayed.
            Reader.onload = function (event) {
                // Put loaded image file into preview image tag and resize it.
                $previewImage.attr('src', event.target.result);
                resize($previewImage);
            };

            // Load image and trigger the FileReaders' `onload` event.
            Reader.readAsDataURL(file);

            // Change text in file name label and input field.
            $this.find(selectors.filenameLabel).text(fileName);
            $this.find(selectors.filenameInput).val(fileName);
            $this.find(selectors.showImage).val(fileName);
            if (!$this.find(selectors.originalImageName).val()) {
                $this.find(selectors.originalImageName).val(fileName);
                $this.find(selectors.showImage).val(fileName);
            }
            _updateFileInputName();
        });
    };

    var _updateFileInputName = function _updateFileInputName(event) {
        $this.find(selectors.fileInputName).attr('name', 'image_file[' + $this.find(selectors.filenameInput).val() + ']');
    };

    /**
     * Handles manual filename changes in input field.
     * @param  {jQuery.Event} event Event fired
     */
    var _changeDataShowImage = function _changeDataShowImage(event) {
        // Replace some specialchars. Still allowed are these chars: . - _
        var fileName = $this.find(selectors.filenameInput).val().replace(/[\s!$§%#^&*()+|~=`´{}\[\]:";\'<>?,\\\/]+/g, '-');

        $this.find(selectors.showImage).val(fileName);
    };

    module.init = function (done) {
        // Handle file change.
        $this.find(selectors.input).on('change', _onNewImage);

        // Update name attribute of the file input
        $this.find(selectors.filenameInput).on('change', _updateFileInputName);

        // Update filename of the image show value
        $this.find(selectors.filenameInput).on('input', _changeDataShowImage);

        // Register as finished
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2R1Y3RzL2ltYWdlX2NoYW5nZS5qcyJdLCJuYW1lcyI6WyJneCIsImNvbXBhdGliaWxpdHkiLCJtb2R1bGUiLCJqc2UiLCJzb3VyY2UiLCJkYXRhIiwiJHRoaXMiLCIkIiwicmVzaXplIiwibGlicyIsImltYWdlX3Jlc2l6ZXIiLCJ4aHIiLCJtb2RhbCIsInNlbGVjdG9ycyIsImlucHV0IiwiZm9ybSIsInByZXZpZXdJbWFnZSIsImZpbGVuYW1lTGFiZWwiLCJmaWxlbmFtZUlucHV0Iiwic2hvd0ltYWdlIiwiZmlsZUlucHV0TmFtZSIsIm9yaWdpbmFsSW1hZ2VOYW1lIiwiX29uTmV3SW1hZ2UiLCJldmVudCIsIiRwcmV2aWV3SW1hZ2UiLCJmaW5kIiwiZmlsZSIsInRhcmdldCIsImZpbGVzIiwiZmlsZU5hbWUiLCJuYW1lIiwidGVzdCIsIm1lc3NhZ2UiLCJ0aXRsZSIsImNvcmUiLCJsYW5nIiwidHJhbnNsYXRlIiwiY29udGVudCIsInJlcGxhY2UiLCJsZW5ndGgiLCJjb3VudGVyIiwibmV3RmlsZU5hbWUiLCJTdHJpbmciLCJnZXQiLCJ1cmwiLCJkb25lIiwicmVzdWx0IiwibWF4RmlsZVNpemVBbGxvd2VkIiwibWF4RmlsZVNpemUiLCJhY3R1YWxGaWxlU2l6ZSIsInNpemUiLCJNYXRoIiwicG93IiwiYWxlcnQiLCJSZWFkZXIiLCJGaWxlUmVhZGVyIiwib25sb2FkIiwiYXR0ciIsInJlYWRBc0RhdGFVUkwiLCJ0ZXh0IiwidmFsIiwiX3VwZGF0ZUZpbGVJbnB1dE5hbWUiLCJfY2hhbmdlRGF0YVNob3dJbWFnZSIsImluaXQiLCJvbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7O0FBT0FBLEdBQUdDLGFBQUgsQ0FBaUJDLE1BQWpCO0FBQ0k7QUFDQSxjQUZKOztBQUlJO0FBQ0EsQ0FDSSxlQURKLEVBQ3FCLEtBRHJCLEVBQzRCLE9BRDVCLEVBRU9DLElBQUlDLE1BRlgsK0NBR09ELElBQUlDLE1BSFgseUNBTEo7O0FB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SUFoQyxjQUFNbUIsSUFBTixDQUFXWixVQUFVTSxTQUFyQixFQUFnQ3lDLEdBQWhDLENBQW9DL0IsUUFBcEM7QUFDSCxLQVBEOztBQVNBM0IsV0FBTzZELElBQVAsR0FBYyxVQUFVbEIsSUFBVixFQUFnQjtBQUMxQjtBQUNBdkMsY0FDS21CLElBREwsQ0FDVVosVUFBVUMsS0FEcEIsRUFFS2tELEVBRkwsQ0FFUSxRQUZSLEVBRWtCMUMsV0FGbEI7O0FBSUE7QUFDQWhCLGNBQ0ttQixJQURMLENBQ1VaLFVBQVVLLGFBRHBCLEVBRUs4QyxFQUZMLENBRVEsUUFGUixFQUVrQkgsb0JBRmxCOztBQUlBO0FBQ0F2RCxjQUNLbUIsSUFETCxDQUNVWixVQUFVSyxhQURwQixFQUVLOEMsRUFGTCxDQUVRLE9BRlIsRUFFaUJGLG9CQUZqQjs7QUFJQTtBQUNBakI7QUFDSCxLQWxCRDs7QUFvQkEsV0FBTzNDLE1BQVA7QUFDSCxDQXZLTCIsImZpbGUiOiJwcm9kdWN0cy9pbWFnZV9jaGFuZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGltYWdlX2NoYW5nZS5qcyAyMDE4LTA0LTA5XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxOCBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBQcm9kdWN0cyBJbWFnZSBDaGFuZ2UgTW9kdWxlXG4gKlxuICogVGhpcyBtb2R1bGUgaXMgcmVzcG9uc2libGUgZm9yIGVmZmVjdHMgb24gaW1hZ2UgY2hhbmdlcy5cbiAqXG4gKiBAbW9kdWxlIENvbXBhdGliaWxpdHkvaW1hZ2VfY2hhbmdlXG4gKi9cbmd4LmNvbXBhdGliaWxpdHkubW9kdWxlKFxuICAgIC8vIE1vZHVsZSBuYW1lXG4gICAgJ2ltYWdlX2NoYW5nZScsXG5cbiAgICAvLyBNb2R1bGUgZGVwZW5kZW5jaWVzXG4gICAgW1xuICAgICAgICAnaW1hZ2VfcmVzaXplcicsICd4aHInLCAnbW9kYWwnLFxuICAgICAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3IvanF1ZXJ5LXVpLWRpc3QvanF1ZXJ5LXVpLm1pbi5jc3NgLFxuICAgICAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3IvanF1ZXJ5LXVpLWRpc3QvanF1ZXJ5LXVpLmpzYFxuICAgIF0sXG5cbiAgICAvKiogQGxlbmRzIG1vZHVsZTpDb21wYXRpYmlsaXR5L2ltYWdlX2NoYW5nZSAqL1xuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFUyBERUZJTklUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8vIFNob3J0Y3V0IHRvIG1vZHVsZSBlbGVtZW50LlxuICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgIC8vIFNob3J0Y3V0IHRvIGltYWdlIHJlc2l6ZXIgbGliYXJ5LlxuICAgICAgICB2YXIgcmVzaXplID0ganNlLmxpYnMuaW1hZ2VfcmVzaXplci5yZXNpemU7XG5cbiAgICAgICAgLy8gQUpBWCByZXF1ZXN0IGxpYnJhcnlcbiAgICAgICAgdmFyIHhociA9IGpzZS5saWJzLnhocjtcblxuICAgICAgICAvLyBNb2RhbCBsaWJyYXJ5XG4gICAgICAgIHZhciBtb2RhbCA9IGpzZS5saWJzLm1vZGFsO1xuXG4gICAgICAgIC8vIEVsZW1lbnRzIHNlbGVjdG9yIG9iamVjdC5cbiAgICAgICAgdmFyIHNlbGVjdG9ycyA9IHtcbiAgICAgICAgICAgIGlucHV0OiAnaW5wdXQ6ZmlsZScsXG4gICAgICAgICAgICBmb3JtOiAnZm9ybScsXG4gICAgICAgICAgICBwcmV2aWV3SW1hZ2U6ICdbZGF0YS1pbWFnZV0nLFxuICAgICAgICAgICAgZmlsZW5hbWVMYWJlbDogJ1tkYXRhLWZpbGVuYW1lLWxhYmVsXScsXG4gICAgICAgICAgICBmaWxlbmFtZUlucHV0OiAnW2RhdGEtZmlsZW5hbWUtaW5wdXRdJyxcbiAgICAgICAgICAgIHNob3dJbWFnZTogJ1tkYXRhLXNob3ctaW1hZ2VdJyxcbiAgICAgICAgICAgIGZpbGVJbnB1dE5hbWU6ICdbZGF0YS1maWxlLWlucHV0LW5hbWVdJyxcbiAgICAgICAgICAgIG9yaWdpbmFsSW1hZ2VOYW1lOiAnW2RhdGEtb3JpZ2luYWwtaW1hZ2VdJ1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIE1vZHVsZSBvYmplY3QuXG4gICAgICAgIHZhciBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gUFJJVkFURSBNRVRIT0RTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVzIGZpbGUgY2hhbmdlcyBpbiBpbnB1dCBmaWVsZC5cbiAgICAgICAgICogQHBhcmFtICB7alF1ZXJ5LkV2ZW50fSBldmVudCBFdmVudCBmaXJlZFxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9vbk5ld0ltYWdlID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAvLyBQcmV2aWV3IGltYWdlLlxuICAgICAgICAgICAgdmFyICRwcmV2aWV3SW1hZ2UgPSAkdGhpcy5maW5kKHNlbGVjdG9ycy5wcmV2aWV3SW1hZ2UpO1xuXG4gICAgICAgICAgICAvLyBGaWxlIHB1dC5cbiAgICAgICAgICAgIHZhciBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzWzBdO1xuICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gZmlsZS5uYW1lO1xuXG4gICAgICAgICAgICBpZiAoKC9cXC4oanBnfGpwZWd8cG5nfGdpZnxibXApJC9pKS50ZXN0KGZpbGVOYW1lKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBtb2RhbC5tZXNzYWdlKHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdHTV9VUExPQURfSU1BR0VfTU9EQUxfRVJST1InLCAnZ21fcHJvZHVjdF9pbWFnZXMnKSxcbiAgICAgICAgICAgICAgICAgICAgY29udGVudDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0dNX1VQTE9BRF9JTUFHRV9NT0RBTF9JTlZBTElEX0ZJTEVfRk9STUFUJywgJ2dtX3Byb2R1Y3RfaW1hZ2VzJylcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gUmVwbGFjZSBzb21lIHNwZWNpYWxjaGFycy4gU3RpbGwgYWxsb3dlZCBhcmUgdGhlc2UgY2hhcnM6IC4gLSBfXG4gICAgICAgICAgICBmaWxlTmFtZSA9IGZpbGVOYW1lLnJlcGxhY2UoL1tcXHMhJMKnJSNeJiooKSt8fj1gwrR7fVxcW1xcXTpcIjtcXCc8Pj8sXFxcXFxcL10rL2csICctJyk7XG5cbiAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSB0aGF0IHRoZSBmaWxlbmFtZSBpcyB1bmlxdWUuXG4gICAgICAgICAgICB2YXIgbGVuZ3RoID0gJCgnaW5wdXRbbmFtZT1cImltYWdlX2ZpbGVbJyArIGZpbGVOYW1lICsgJ11cIl0nKS5sZW5ndGgsXG4gICAgICAgICAgICAgICAgY291bnRlciA9IDE7XG4gICAgICAgICAgICB3aGlsZSAobGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5ld0ZpbGVOYW1lID0gZmlsZU5hbWUucmVwbGFjZSgvKFxcLikvLCBTdHJpbmcoY291bnRlcikgKyAnLicpO1xuXG4gICAgICAgICAgICAgICAgbGVuZ3RoID0gJCgnaW5wdXRbbmFtZT1cImltYWdlX2ZpbGVbJyArIG5ld0ZpbGVOYW1lICsgJ11cIl0nKS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICBpZiAobGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lID0gbmV3RmlsZU5hbWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY291bnRlcisrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB4aHIuZ2V0KHt1cmw6ICdhZG1pbi5waHA/ZG89TWF4RmlsZVNpemUnfSlcbiAgICAgICAgICAgICAgICAuZG9uZShmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtYXhGaWxlU2l6ZUFsbG93ZWQgPSByZXN1bHQubWF4RmlsZVNpemU7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhY3R1YWxGaWxlU2l6ZSA9IGZpbGUuc2l6ZSAvIE1hdGgucG93KDEwMjQsIDIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChhY3R1YWxGaWxlU2l6ZSA+IG1heEZpbGVTaXplQWxsb3dlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnVFhUX0ZJTEVfVE9PX0xBUkdFJywgJ2NhdGVnb3JpZXMnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KG1lc3NhZ2UgKyBtYXhGaWxlU2l6ZUFsbG93ZWQgKyAnIE1CJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGEgRmlsZVJlYWRlciB0byByZWFkIHRoZSBpbnB1dCBmaWxlLlxuICAgICAgICAgICAgICAgICAgICB2YXIgUmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBBcyBzb29uIGFzIHRoZSBpbWFnZSBmaWxlIGhhcyBiZWVuIGxvYWRlZCxcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGxvYWRlZCBpbWFnZSBmaWxlIHdpbGwgYmUgcHV0IGludG8gdGhlXG4gICAgICAgICAgICAgICAgICAgIC8vIHByZXZpZXcgaW1hZ2UgdGFnIGFuZCBmaW5hbGx5IHJlc2l6ZWQgYW5kIGRpc3BsYXllZC5cbiAgICAgICAgICAgICAgICAgICAgUmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUHV0IGxvYWRlZCBpbWFnZSBmaWxlIGludG8gcHJldmlldyBpbWFnZSB0YWcgYW5kIHJlc2l6ZSBpdC5cbiAgICAgICAgICAgICAgICAgICAgICAgICRwcmV2aWV3SW1hZ2UuYXR0cignc3JjJywgZXZlbnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNpemUoJHByZXZpZXdJbWFnZSk7XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gTG9hZCBpbWFnZSBhbmQgdHJpZ2dlciB0aGUgRmlsZVJlYWRlcnMnIGBvbmxvYWRgIGV2ZW50LlxuICAgICAgICAgICAgICAgICAgICBSZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBDaGFuZ2UgdGV4dCBpbiBmaWxlIG5hbWUgbGFiZWwgYW5kIGlucHV0IGZpZWxkLlxuICAgICAgICAgICAgICAgICAgICAkdGhpcy5maW5kKHNlbGVjdG9ycy5maWxlbmFtZUxhYmVsKS50ZXh0KGZpbGVOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuZmluZChzZWxlY3RvcnMuZmlsZW5hbWVJbnB1dCkudmFsKGZpbGVOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuZmluZChzZWxlY3RvcnMuc2hvd0ltYWdlKS52YWwoZmlsZU5hbWUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoISR0aGlzLmZpbmQoc2VsZWN0b3JzLm9yaWdpbmFsSW1hZ2VOYW1lKS52YWwoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMuZmluZChzZWxlY3RvcnMub3JpZ2luYWxJbWFnZU5hbWUpLnZhbChmaWxlTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5maW5kKHNlbGVjdG9ycy5zaG93SW1hZ2UpLnZhbChmaWxlTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgX3VwZGF0ZUZpbGVJbnB1dE5hbWUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgX3VwZGF0ZUZpbGVJbnB1dE5hbWUgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICR0aGlzLmZpbmQoc2VsZWN0b3JzLmZpbGVJbnB1dE5hbWUpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ25hbWUnLCAnaW1hZ2VfZmlsZVsnICsgJHRoaXMuZmluZChzZWxlY3RvcnMuZmlsZW5hbWVJbnB1dCkudmFsKCkgKyAnXScpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVzIG1hbnVhbCBmaWxlbmFtZSBjaGFuZ2VzIGluIGlucHV0IGZpZWxkLlxuICAgICAgICAgKiBAcGFyYW0gIHtqUXVlcnkuRXZlbnR9IGV2ZW50IEV2ZW50IGZpcmVkXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX2NoYW5nZURhdGFTaG93SW1hZ2UgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIC8vIFJlcGxhY2Ugc29tZSBzcGVjaWFsY2hhcnMuIFN0aWxsIGFsbG93ZWQgYXJlIHRoZXNlIGNoYXJzOiAuIC0gX1xuICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gJHRoaXMuZmluZChzZWxlY3RvcnMuZmlsZW5hbWVJbnB1dClcbiAgICAgICAgICAgICAgICAudmFsKClcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvW1xccyEkwqclI14mKigpK3x+PWDCtHt9XFxbXFxdOlwiO1xcJzw+PyxcXFxcXFwvXSsvZywgJy0nKTtcblxuICAgICAgICAgICAgJHRoaXMuZmluZChzZWxlY3RvcnMuc2hvd0ltYWdlKS52YWwoZmlsZU5hbWUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIC8vIEhhbmRsZSBmaWxlIGNoYW5nZS5cbiAgICAgICAgICAgICR0aGlzXG4gICAgICAgICAgICAgICAgLmZpbmQoc2VsZWN0b3JzLmlucHV0KVxuICAgICAgICAgICAgICAgIC5vbignY2hhbmdlJywgX29uTmV3SW1hZ2UpO1xuXG4gICAgICAgICAgICAvLyBVcGRhdGUgbmFtZSBhdHRyaWJ1dGUgb2YgdGhlIGZpbGUgaW5wdXRcbiAgICAgICAgICAgICR0aGlzXG4gICAgICAgICAgICAgICAgLmZpbmQoc2VsZWN0b3JzLmZpbGVuYW1lSW5wdXQpXG4gICAgICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCBfdXBkYXRlRmlsZUlucHV0TmFtZSk7XG5cbiAgICAgICAgICAgIC8vIFVwZGF0ZSBmaWxlbmFtZSBvZiB0aGUgaW1hZ2Ugc2hvdyB2YWx1ZVxuICAgICAgICAgICAgJHRoaXNcbiAgICAgICAgICAgICAgICAuZmluZChzZWxlY3RvcnMuZmlsZW5hbWVJbnB1dClcbiAgICAgICAgICAgICAgICAub24oJ2lucHV0JywgX2NoYW5nZURhdGFTaG93SW1hZ2UpO1xuXG4gICAgICAgICAgICAvLyBSZWdpc3RlciBhcyBmaW5pc2hlZFxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7XG4iXX0=
