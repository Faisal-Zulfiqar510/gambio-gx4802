'use strict';

/* --------------------------------------------------------------
 image_processing.js 2017-03-08
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Image Processing
 *
 * This module will execute the image processing by sending POST-Requests to the
 * ImageProcessingController interface
 *
 * @module Controllers/image_processing
 */
gx.controllers.module('image_processing', [gx.source + '/libs/info_messages'],

/**  @lends module:Controllers/image_processing */

function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES DEFINITION
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
     * Flag if an error occurred during the image processing
     *
     * @type {boolean}
     */
    error = false,


    /**
     * Final Options
     *
     * @var {object}
     */
    options = $.extend(true, {}, defaults, data),


    /**
     * Reference to the info messages library
     *
     * @type {object}
     */
    messages = jse.libs.info_messages,


    /**
     * Module Object
     *
     * @type {object}
     */
    module = {};

    // ------------------------------------------------------------------------
    // EVENT HANDLERS
    // ------------------------------------------------------------------------

    var _onClick = function _onClick() {
        var title = jse.core.lang.translate('image_processing_title', 'image_processing');
        var startimageNr = parseInt($('#image-processing-startimage-nr').val());
        var startimageFile = $('#image-processing-startimage-file').val();

        $('.process-modal').dialog({
            'title': title,
            'modal': true,
            'dialogClass': 'gx-container',
            'buttons': [{
                'text': jse.core.lang.translate('close', 'buttons'),
                'class': 'btn',
                'click': function click() {
                    $(this).dialog('close');
                }
            }],
            'width': 580
        });

        $('#image-processing-file').html(' ');

        if (startimageNr <= 0 || isNaN(startimageNr)) {
            startimageNr = 1;
        }

        if (startimageFile != '') {
            _processImage(0, startimageFile);
        } else {
            _processImage(startimageNr, '');
        }
    };

    // ------------------------------------------------------------------------
    // AJAX
    // ------------------------------------------------------------------------

    var _processImage = function _processImage(imageNumber, imageFile) {

        $.ajax({
            'type': 'POST',
            'url': 'admin.php?do=ImageProcessing/Process',
            'timeout': 30000,
            'dataType': 'json',
            'context': this,
            'data': {
                'image_number': imageNumber,
                'image_file': imageFile
            },
            success: function success(response) {
                if (response.payload.nextImageNr != 0) {
                    imageNumber = response.payload.nextImageNr - 1;
                }

                var progress = 100 / response.payload.imagesCount * imageNumber;
                progress = Math.round(progress);

                $('.process-modal .progress-bar').attr('aria-valuenow', progress);
                $('.process-modal .progress-bar').css('min-width', '70px');
                $('.process-modal .progress-bar').css('width', progress + '%');
                $('.process-modal .progress-bar').html(imageNumber + ' / ' + response.payload.imagesCount);
                $('#image-processing-file').html(response.payload.imageName);

                if (!response.success) {
                    error = true;
                }

                if (!response.payload.finished) {
                    // check is there is nextImageNr not 0 (only if filename was given)
                    if (response.payload.nextImageNr != 0) {
                        _processImage(response.payload.nextImageNr, '');
                    } else {
                        imageNumber += 1;
                        _processImage(imageNumber, '');
                    }
                } else {
                    $('.process-modal').dialog('close');
                    $('.process-modal .progress-bar').attr('aria-valuenow', 0);
                    $('.process-modal .progress-bar').css('width', '0%');
                    $('.process-modal .progress-bar').html('');

                    if (error) {
                        if (response.payload.fileNotFound) {
                            messages.addError(jse.core.lang.translate('image_processing_file_not_found', 'image_processing'));
                        } else {
                            messages.addError(jse.core.lang.translate('image_processing_error', 'image_processing'));
                        }
                    } else {
                        messages.addSuccess(jse.core.lang.translate('image_processing_success', 'image_processing'));
                    }

                    error = false;
                }
            }
        });
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $this.on('click', '.js-process', _onClick);
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImltYWdlX3Byb2Nlc3NpbmcvaW1hZ2VfcHJvY2Vzc2luZy5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwic291cmNlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImRlZmF1bHRzIiwiZXJyb3IiLCJvcHRpb25zIiwiZXh0ZW5kIiwibWVzc2FnZXMiLCJqc2UiLCJsaWJzIiwiaW5mb19tZXNzYWdlcyIsIl9vbkNsaWNrIiwidGl0bGUiLCJjb3JlIiwibGFuZyIsInRyYW5zbGF0ZSIsInN0YXJ0aW1hZ2VOciIsInBhcnNlSW50IiwidmFsIiwic3RhcnRpbWFnZUZpbGUiLCJkaWFsb2ciLCJodG1sIiwiaXNOYU4iLCJfcHJvY2Vzc0ltYWdlIiwiaW1hZ2VOdW1iZXIiLCJpbWFnZUZpbGUiLCJhamF4Iiwic3VjY2VzcyIsInJlc3BvbnNlIiwicGF5bG9hZCIsIm5leHRJbWFnZU5yIiwicHJvZ3Jlc3MiLCJpbWFnZXNDb3VudCIsIk1hdGgiLCJyb3VuZCIsImF0dHIiLCJjc3MiLCJpbWFnZU5hbWUiLCJmaW5pc2hlZCIsImZpbGVOb3RGb3VuZCIsImFkZEVycm9yIiwiYWRkU3VjY2VzcyIsImluaXQiLCJkb25lIiwib24iXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7QUFRQUEsR0FBR0MsV0FBSCxDQUFlQyxNQUFmLENBQ0ksa0JBREosRUFHSSxDQUNJRixHQUFHRyxNQUFILEdBQVkscUJBRGhCLENBSEo7O0FBT0k7O0FBRUEsVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7Ozs7QUFLQUMsWUFBUUMsRUFBRSxJQUFGLENBTlo7OztBQVFJOzs7OztBQUtBQyxlQUFXLEVBYmY7OztBQWVJOzs7OztBQUtBQyxZQUFRLEtBcEJaOzs7QUFzQkk7Ozs7O0FBS0FDLGNBQVVILEVBQUVJLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQkgsUUFBbkIsRUFBNkJILElBQTdC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LEVBQWtCLGFBQWxCLEVBQWlDakMsUUFBakM7QUFDQWdDO0FBQ0gsS0FIRDs7QUFLQSxXQUFPN0MsTUFBUDtBQUNILENBL0tMIiwiZmlsZSI6ImltYWdlX3Byb2Nlc3NpbmcvaW1hZ2VfcHJvY2Vzc2luZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gaW1hZ2VfcHJvY2Vzc2luZy5qcyAyMDE3LTAzLTA4XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNyBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBJbWFnZSBQcm9jZXNzaW5nXG4gKlxuICogVGhpcyBtb2R1bGUgd2lsbCBleGVjdXRlIHRoZSBpbWFnZSBwcm9jZXNzaW5nIGJ5IHNlbmRpbmcgUE9TVC1SZXF1ZXN0cyB0byB0aGVcbiAqIEltYWdlUHJvY2Vzc2luZ0NvbnRyb2xsZXIgaW50ZXJmYWNlXG4gKlxuICogQG1vZHVsZSBDb250cm9sbGVycy9pbWFnZV9wcm9jZXNzaW5nXG4gKi9cbmd4LmNvbnRyb2xsZXJzLm1vZHVsZShcbiAgICAnaW1hZ2VfcHJvY2Vzc2luZycsXG5cbiAgICBbXG4gICAgICAgIGd4LnNvdXJjZSArICcvbGlicy9pbmZvX21lc3NhZ2VzJ1xuICAgIF0sXG5cbiAgICAvKiogIEBsZW5kcyBtb2R1bGU6Q29udHJvbGxlcnMvaW1hZ2VfcHJvY2Vzc2luZyAqL1xuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFUyBERUZJTklUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhclxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdmFyIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBEZWZhdWx0IE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBkZWZhdWx0cyA9IHt9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZsYWcgaWYgYW4gZXJyb3Igb2NjdXJyZWQgZHVyaW5nIHRoZSBpbWFnZSBwcm9jZXNzaW5nXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGVycm9yID0gZmFsc2UsXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRmluYWwgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB2YXIge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogUmVmZXJlbmNlIHRvIHRoZSBpbmZvIG1lc3NhZ2VzIGxpYnJhcnlcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtZXNzYWdlcyA9IGpzZS5saWJzLmluZm9fbWVzc2FnZXMsXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIE9iamVjdFxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBFVkVOVCBIQU5ETEVSU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXIgX29uQ2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgdGl0bGUgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnaW1hZ2VfcHJvY2Vzc2luZ190aXRsZScsICdpbWFnZV9wcm9jZXNzaW5nJyk7XG4gICAgICAgICAgICB2YXIgc3RhcnRpbWFnZU5yID0gcGFyc2VJbnQoJCgnI2ltYWdlLXByb2Nlc3Npbmctc3RhcnRpbWFnZS1ucicpLnZhbCgpKTtcbiAgICAgICAgICAgIHZhciBzdGFydGltYWdlRmlsZSA9ICQoJyNpbWFnZS1wcm9jZXNzaW5nLXN0YXJ0aW1hZ2UtZmlsZScpLnZhbCgpO1xuXG4gICAgICAgICAgICAkKCcucHJvY2Vzcy1tb2RhbCcpLmRpYWxvZyh7XG4gICAgICAgICAgICAgICAgJ3RpdGxlJzogdGl0bGUsXG4gICAgICAgICAgICAgICAgJ21vZGFsJzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAnZGlhbG9nQ2xhc3MnOiAnZ3gtY29udGFpbmVyJyxcbiAgICAgICAgICAgICAgICAnYnV0dG9ucyc6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3RleHQnOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnY2xvc2UnLCAnYnV0dG9ucycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2NsYXNzJzogJ2J0bicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnY2xpY2snOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5kaWFsb2coJ2Nsb3NlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICd3aWR0aCc6IDU4MFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICQoJyNpbWFnZS1wcm9jZXNzaW5nLWZpbGUnKS5odG1sKCcgJyk7XG5cbiAgICAgICAgICAgIGlmIChzdGFydGltYWdlTnIgPD0gMCB8fCBpc05hTihzdGFydGltYWdlTnIpKSB7XG4gICAgICAgICAgICAgICAgc3RhcnRpbWFnZU5yID0gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHN0YXJ0aW1hZ2VGaWxlICE9ICcnKSB7XG4gICAgICAgICAgICAgICAgX3Byb2Nlc3NJbWFnZSgwLCBzdGFydGltYWdlRmlsZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF9wcm9jZXNzSW1hZ2Uoc3RhcnRpbWFnZU5yLCAnJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEFKQVhcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyIF9wcm9jZXNzSW1hZ2UgPSBmdW5jdGlvbiAoaW1hZ2VOdW1iZXIsIGltYWdlRmlsZSkge1xuXG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICd0eXBlJzogJ1BPU1QnLFxuICAgICAgICAgICAgICAgICd1cmwnOiAnYWRtaW4ucGhwP2RvPUltYWdlUHJvY2Vzc2luZy9Qcm9jZXNzJyxcbiAgICAgICAgICAgICAgICAndGltZW91dCc6IDMwMDAwLFxuICAgICAgICAgICAgICAgICdkYXRhVHlwZSc6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAnY29udGV4dCc6IHRoaXMsXG4gICAgICAgICAgICAgICAgJ2RhdGEnOiB7XG4gICAgICAgICAgICAgICAgICAgICdpbWFnZV9udW1iZXInOiBpbWFnZU51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgJ2ltYWdlX2ZpbGUnOiBpbWFnZUZpbGVcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UucGF5bG9hZC5uZXh0SW1hZ2VOciAhPSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbWFnZU51bWJlciA9IHJlc3BvbnNlLnBheWxvYWQubmV4dEltYWdlTnIgLSAxO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb2dyZXNzID0gKDEwMCAvIHJlc3BvbnNlLnBheWxvYWQuaW1hZ2VzQ291bnQpICogaW1hZ2VOdW1iZXI7XG4gICAgICAgICAgICAgICAgICAgIHByb2dyZXNzID0gTWF0aC5yb3VuZChwcm9ncmVzcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgJCgnLnByb2Nlc3MtbW9kYWwgLnByb2dyZXNzLWJhcicpLmF0dHIoJ2FyaWEtdmFsdWVub3cnLCBwcm9ncmVzcyk7XG4gICAgICAgICAgICAgICAgICAgICQoJy5wcm9jZXNzLW1vZGFsIC5wcm9ncmVzcy1iYXInKS5jc3MoJ21pbi13aWR0aCcsICc3MHB4Jyk7XG4gICAgICAgICAgICAgICAgICAgICQoJy5wcm9jZXNzLW1vZGFsIC5wcm9ncmVzcy1iYXInKS5jc3MoJ3dpZHRoJywgcHJvZ3Jlc3MgKyAnJScpO1xuICAgICAgICAgICAgICAgICAgICAkKCcucHJvY2Vzcy1tb2RhbCAucHJvZ3Jlc3MtYmFyJykuaHRtbChpbWFnZU51bWJlciArICcgLyAnICsgcmVzcG9uc2UucGF5bG9hZC5pbWFnZXNDb3VudCk7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpbWFnZS1wcm9jZXNzaW5nLWZpbGUnKS5odG1sKHJlc3BvbnNlLnBheWxvYWQuaW1hZ2VOYW1lKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICghcmVzcG9uc2UucGF5bG9hZC5maW5pc2hlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgaXMgdGhlcmUgaXMgbmV4dEltYWdlTnIgbm90IDAgKG9ubHkgaWYgZmlsZW5hbWUgd2FzIGdpdmVuKVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnBheWxvYWQubmV4dEltYWdlTnIgIT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9wcm9jZXNzSW1hZ2UocmVzcG9uc2UucGF5bG9hZC5uZXh0SW1hZ2VOciwgJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZU51bWJlciArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9wcm9jZXNzSW1hZ2UoaW1hZ2VOdW1iZXIsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5wcm9jZXNzLW1vZGFsJykuZGlhbG9nKCdjbG9zZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnByb2Nlc3MtbW9kYWwgLnByb2dyZXNzLWJhcicpLmF0dHIoJ2FyaWEtdmFsdWVub3cnLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5wcm9jZXNzLW1vZGFsIC5wcm9ncmVzcy1iYXInKS5jc3MoJ3dpZHRoJywgJzAlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcucHJvY2Vzcy1tb2RhbCAucHJvZ3Jlc3MtYmFyJykuaHRtbCgnJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5wYXlsb2FkLmZpbGVOb3RGb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlcy5hZGRFcnJvcihqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnaW1hZ2VfcHJvY2Vzc2luZ19maWxlX25vdF9mb3VuZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaW1hZ2VfcHJvY2Vzc2luZycpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlcy5hZGRFcnJvcihqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnaW1hZ2VfcHJvY2Vzc2luZ19lcnJvcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaW1hZ2VfcHJvY2Vzc2luZycpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VzLmFkZFN1Y2Nlc3MoanNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2ltYWdlX3Byb2Nlc3Npbmdfc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdpbWFnZV9wcm9jZXNzaW5nJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgICR0aGlzLm9uKCdjbGljaycsICcuanMtcHJvY2VzcycsIF9vbkNsaWNrKTtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
