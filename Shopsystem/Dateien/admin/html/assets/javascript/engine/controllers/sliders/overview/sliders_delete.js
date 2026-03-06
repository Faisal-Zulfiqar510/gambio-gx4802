'use strict';

/* --------------------------------------------------------------
 sliders_delete.js 2016-09-12
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Sliders Overview Delete
 *
 * Controller Module To Delete Sliders.
 *
 * Handles the delete operation of the sliders overview page.
 */
gx.controllers.module('sliders_delete', ['modal', gx.source + '/libs/info_box'], function (data) {

    'use strict';

    // --------------------------------------------------------------------
    // VARIABLES
    // --------------------------------------------------------------------

    /**
     * Module Selector
     *
     * @type {jQuery}
     */

    var $this = $(this);

    /**
     * Slider delete confirmation modal.
     *
     * @type {jQuery}
     */
    var $modal = $('.delete-slider.modal');

    /**
     * Delete button selector string.
     *
     * @type {String}
     */
    var deleteButtonSelector = '.btn-delete';

    /**
     * Delete slider action URL.
     *
     * @type {String}
     */
    var url = jse.core.config.get('appUrl') + '/admin/admin.php?do=SlidersOverviewAjax/DeleteSlider';

    /**
     * Module Instance
     *
     * @type {Object}
     */
    var module = {};

    // --------------------------------------------------------------------
    // FUNCTIONS
    // --------------------------------------------------------------------

    /**
     * Handles the delete click event by opening the delete confirmation modal.
     *
     * @param {jQuery.Event} event Triggered event.
     */
    function _onDeleteClick(event) {
        // Prevent default action.
        event.preventDefault();

        // Table row.
        var $parentTableRow = $(event.target).parents('tr');

        // Delete confirmation modal button.
        var $confirmButton = $modal.find('button.confirm');

        // Empty modal body.
        $modal.find('.modal-body .form-group').remove();

        // Slider data.
        var sliderData = {
            id: $parentTableRow.data('sliderId'),
            name: $parentTableRow.data('sliderName'),
            slidesQuantity: $parentTableRow.data('slidesQuantity')
        };

        // Put new slider information into modal body.
        $modal.find('.modal-body fieldset').html(_generateSliderInfoMarkup(sliderData));

        // Show modal.
        $modal.modal('show');

        // Handle delete confirmation modal button click event.
        $confirmButton.off('click').on('click', function () {
            return _onConfirmButtonClick(sliderData.id);
        });
    }

    /**
     * Handles the delete confirmation button click event by removing the slider through an AJAX request.
     *
     * @param {Number} sliderId Slider ID.
     */
    function _onConfirmButtonClick(sliderId) {
        // AJAX request options.
        var requestOptions = {
            type: 'POST',
            data: { sliderId: sliderId },
            url: url
        };

        // Perform request.
        $.ajax(requestOptions).done(function (response) {
            return _handleDeleteRequestResponse(response, sliderId);
        }).always(function () {
            return $modal.modal('hide');
        });
    }

    /**
     * Handles slider deletion AJAX action server response.
     *
     * @param {Object} response Server response.
     * @param {Number} sliderId ID of deleted slider.
     */
    function _handleDeleteRequestResponse(response, sliderId) {
        // Error message phrases.
        var errorTitle = jse.core.lang.translate('DELETE_SLIDER_ERROR_TITLE', 'sliders');
        var errorMessage = jse.core.lang.translate('DELETE_SLIDER_ERROR_TEXT', 'sliders');

        // Table body.
        var $tableBody = $this.find('tbody');

        // Table rows.
        var $rows = $tableBody.find('[data-slider-id]');

        // Table rows that will be deleted.
        var $rowToDelete = $rows.filter('[data-slider-id="' + sliderId + '"]');

        // 'No results' message table row template.
        var $emptyRowTemplate = $('#template-table-row-empty');

        // Check for action success.
        if (response.includes('success')) {
            // Delete respective table rows.
            $rowToDelete.remove();

            // Add success message to admin info box.
            jse.libs.info_box.addSuccessMessage();

            // If there are no rows, show 'No results' message row.
            if ($rows.length - 1 < 1) {
                $tableBody.empty().append($emptyRowTemplate.clone().html());
            }
        } else {
            // Show error message modal.
            jse.libs.modal.showMessage(errorTitle, errorMessage);
        }
    }

    /**
     * Generates HTML containing the slider information for the delete confirmation modal.
     *
     * @param {Object} data Slider data.
     * @param {String} data.name Name of the slider.
     * @param {String} data.slidesQuantity Quantity of slides from slider.
     *
     * @return {String} Created HTML string.
     */
    function _generateSliderInfoMarkup(data) {
        // Label phrases.
        var sliderNameLabel = jse.core.lang.translate('NAME', 'sliders');
        var slidesQuantityLabel = jse.core.lang.translate('AMOUNT_OF_SLIDES', 'sliders');

        // Return markup.
        return '\n\t\t\t\t\t<div class="form-group">\n\t\t\t\t\t\t<label class="col-md-5">' + sliderNameLabel + '</label>\n\t\t\t\t\t\t<div class="col-md-7">' + data.name + '</div>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class="form-group">\n\t\t\t\t\t\t<label class="col-md-5">' + slidesQuantityLabel + '</label>\n\t\t\t\t\t\t<div class="col-md-7">' + data.slidesQuantity + '</div>\n\t\t\t\t\t</div>\n\t\t\t';
    }

    // --------------------------------------------------------------------
    // INITIALIZATION
    // --------------------------------------------------------------------

    module.init = function (done) {
        // Listen to form submit event.
        $this.on('click', deleteButtonSelector, _onDeleteClick);

        // Finish initialization.
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNsaWRlcnMvb3ZlcnZpZXcvc2xpZGVyc19kZWxldGUuanMiXSwibmFtZXMiOlsiZ3giLCJjb250cm9sbGVycyIsIm1vZHVsZSIsInNvdXJjZSIsImRhdGEiLCIkdGhpcyIsIiQiLCIkbW9kYWwiLCJkZWxldGVCdXR0b25TZWxlY3RvciIsInVybCIsImpzZSIsImNvcmUiLCJjb25maWciLCJnZXQiLCJfb25EZWxldGVDbGljayIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCIkcGFyZW50VGFibGVSb3ciLCJ0YXJnZXQiLCJwYXJlbnRzIiwiJGNvbmZpcm1CdXR0b24iLCJmaW5kIiwicmVtb3ZlIiwic2xpZGVyRGF0YSIsImlkIiwibmFtZSIsInNsaWRlc1F1YW50aXR5IiwiaHRtbCIsIl9nZW5lcmF0ZVNsaWRlckluZm9NYXJrdXAiLCJtb2RhbCIsIm9mZiIsIm9uIiwiX29uQ29uZmlybUJ1dHRvbkNsaWNrIiwic2xpZGVySWQiLCJyZXF1ZXN0T3B0aW9ucyIsInR5cGUiLCJhamF4IiwiZG9uZSIsIl9oYW5kbGVEZWxldGVSZXF1ZXN0UmVzcG9uc2UiLCJyZXNwb25zZSIsImFsd2F5cyIsImVycm9yVGl0bGUiLCJsYW5nIiwidHJhbnNsYXRlIiwiZXJyb3JNZXNzYWdlIiwiJHRhYmxlQm9keSIsIiRyb3dzIiwiJHJvd1RvRGVsZXRlIiwiZmlsdGVyIiwiJGVtcHR5Um93VGVtcGxhdGUiLCJpbmNsdWRlcyIsImxpYnMiLCJpbmZvX2JveCIsImFkZFN1Y2Nlc3NNZXNzYWdlIiwibGVuZ3RoIiwiZW1wdHkiLCJhcHBlbmQiLCJjbG9uZSIsInNob3dNZXNzYWdlIiwic2xpZGVyTmFtZUxhYmVsIiwic2xpZGVzUXVhbnRpdHlMYWJlbCIsImluaXQiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7OztBQU9BQSxHQUFHQyxXQUFILENBQWVDLE1BQWYsQ0FDSSxnQkFESixFQUdJLENBQ0ksT0FESixFQUVPRixHQUFHRyxNQUZWLG9CQUhKLEVBUUksVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7OztBQUtBLFFBQU1DLFFBQVFDLEVBQUUsSUFBRixDQUFkOztBQUVBOzs7OztBQUtBLFFBQU1DLFNBQVNELEVBQUUsc0JBQUYsQ0FBZjs7QUFFQTs7Ozs7QUFLQSxRQUFNRSx1QkFBdUIsYUFBN0I7O0FBRUE7Ozs7O0FBS0EsUUFBTUMsTUFBU0MsSUFBSUMsSUFBSixDQUFTQyxNQUFULENBQWdCQyxHQUFoQixDQUFvQixRQUFwQixDQUFULHlEQUFOOztBQUVBOzs7OztBQUtBLFFBQU1YLFNBQVMsRUFBZjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7O0FBS0EsYUFBU1ksY0FBVCxDQUF3QkMsS0FBeEIsRUFBK0I7QUFDM0I7QUFDQUEsY0FBTUMsY0FBTjs7QUFFQTtBQUNBLFlBQU1DLGtCQUFrQlgsRUFBRVMsTUFBTUcsTUFBUixFQUFnQkMsT0FBaEIsQ0FBd0IsSUFBeEIsQ0FBeEI7O0FBRUE7QUFDQSxZQUFNQyxpQkFBaUJiLE9BQU9jLElBQVAsQ0FBWSxnQkFBWixDQUF2Qjs7QUFFQTtBQUNBZCxlQUFPYyxJQUFQLENBQVkseUJBQVosRUFBdUNDLE1BQXZDOztBQUVBO0FBQ0EsWUFBTUMsYUFBYTtBQUNmQyxnQkFBSVAsZ0JBQWdCYixJQUFoQixDQUFxQixVQUFyQixDQURXO0FBRWZxQixrQkFBTVIsZ0JBQWdCYixJQUFoQixDQUFxQixZQUFyQixDQUZTO0FBR2ZzQiw0QkFBZ0JULGdCQUFnQmIsSUFBaEIsQ0FBcUIsZ0JBQXJCO0FBSEQsU0FBbkI7O0FBTUE7QUFDQUcsZUFDS2MsSUFETCxDQUNVLHNCQURWLEVBRUtNLElBRkwsQ0FFVUMsMEJBQTBCTCxVQUExQixDQUZWOztBQUlBO0FBQ0FoQixlQUFPc0IsS0FBUCxDQUFhLE1BQWI7O0FBRUE7QUFDQVQsdUJBQ0tVLEdBREwsQ0FDUyxPQURULEVBRUtDLEVBRkwsQ0FFUSxPQUZSLEVBRWlCO0FBQUEsbUJBQU1DLHNCQUFzQlQsV0FBV0MsRUFBakMsQ0FBTjtBQUFBLFNBRmpCO0FBR0g7O0FBRUQ7Ozs7O0FBS0EsYUFBU1EscUJBQVQsQ0FBK0JDLFFBQS9CLEVBQXlDO0FBQ3JDO0FBQ0EsWUFBTUMsaUJBQWlCO0FBQ25CQyxrQkFBTSxNQURhO0FBRW5CL0Isa0JBQU0sRUFBQzZCLGtCQUFELEVBRmE7QUFHbkJ4QjtBQUhtQixTQUF2Qjs7QUFNQTtBQUNBSCxVQUFFOEIsSUFBRixDQUFPRixjQUFQLEVBQ0tHLElBREwsQ0FDVTtBQUFBLG1CQUFZQyw2QkFBNkJDLFFBQTdCLEVBQXVDTixRQUF2QyxDQUFaO0FBQUEsU0FEVixFQUVLTyxNQUZMLENBRVk7QUFBQSxtQkFBTWpDLE9BQU9zQixLQUFQLENBQWEsTUFBYixDQUFOO0FBQUEsU0FGWjtBQUdIOztBQUVEOzs7Ozs7QUFNQSxhQUFTUyw0QkFBVCxDQUFzQ0MsUUFBdEMsRUFBZ0ROLFFBQWhELEVBQTBEO0FBQ3REO0FBQ0EsWUFBTVEsYUFBYS9CLElBQUlDLElBQUosQ0FBUytCLElBQVQsQ0FBY0MsU0FBZCxDQUF3QiwyQkFBeEIsRUFBcUQsU0FBckQsQ0FBbkI7QUFDQSxZQUFNQyxlQUFlbEMsSUFBSUMsSUFBSixDQUFTK0IsSUFBVCxDQUFjQyxTQUFkLENBQXdCLDBCQUF4QixFQUFvRCxTQUFwRCxDQUFyQjs7QUFFQTtBQUNBLFlBQU1FLGFBQWF4QyxNQUFNZ0IsSUFBTixDQUFXLE9BQVgsQ0FBbkI7O0FBRUE7QUFDQSxZQUFNeUIsUUFBUUQsV0FBV3hCLElBQVgsb0JBQWQ7O0FBRUE7QUFDQSxZQUFNMEIsZUFBZUQsTUFBTUUsTUFBTix1QkFBaUNmLFFBQWpDLFFBQXJCOztBQUVBO0FBQ0EsWUFBTWdCLG9CQUFvQjNDLEVBQUUsMkJBQUYsQ0FBMUI7O0FBRUE7QUFDQSxZQUFJaUMsU0FBU1csUUFBVCxDQUFrQixTQUFsQixDQUFKLEVBQWtDO0FBQzlCO0FBQ0FILHlCQUFhekIsTUFBYjs7QUFFQTtBQUNBWixnQkFBSXlDLElBQUosQ0FBU0MsUUFBVCxDQUFrQkMsaUJBQWxCOztBQUVBO0FBQ0EsZ0JBQUtQLE1BQU1RLE1BQU4sR0FBZSxDQUFoQixHQUFxQixDQUF6QixFQUE0QjtBQUN4QlQsMkJBQ0tVLEtBREwsR0FFS0MsTUFGTCxDQUVZUCxrQkFBa0JRLEtBQWxCLEdBQTBCOUIsSUFBMUIsRUFGWjtBQUdIO0FBQ0osU0FiRCxNQWFPO0FBQ0g7QUFDQWpCLGdCQUFJeUMsSUFBSixDQUFTdEIsS0FBVCxDQUFlNkIsV0FBZixDQUEyQmpCLFVBQTNCLEVBQXVDRyxZQUF2QztBQUNIO0FBQ0o7O0FBRUQ7Ozs7Ozs7OztBQVNBLGFBQVNoQix5QkFBVCxDQUFtQ3hCLElBQW5DLEVBQXlDO0FBQ3JDO0FBQ0EsWUFBTXVELGtCQUFrQmpELElBQUlDLElBQUosQ0FBUytCLElBQVQsQ0FBY0MsU0FBZCxDQUF3QixNQUF4QixFQUFnQyxTQUFoQyxDQUF4QjtBQUNBLFlBQU1pQixzQkFBc0JsRCxJQUFJQyxJQUFKLENBQVMrQixJQUFULENBQWNDLFNBQWQsQ0FBd0Isa0JBQXhCLEVBQTRDLFNBQTVDLENBQTVCOztBQUVBO0FBQ0EsOEZBRW9CZ0IsZUFGcEIsb0RBR2tCdkQsS0FBS3FCLElBSHZCLDRHQU9vQm1DLG1CQVBwQixvREFRa0J4RCxLQUFLc0IsY0FSdkI7QUFXSDs7QUFFRDtBQUNBO0FBQ0E7O0FBRUF4QixXQUFPMkQsSUFBUCxHQUFjLGdCQUFRO0FBQ2xCO0FBQ0F4RCxjQUFNMEIsRUFBTixDQUFTLE9BQVQsRUFBa0J2QixvQkFBbEIsRUFBd0NNLGNBQXhDOztBQUVBO0FBQ0F1QjtBQUNILEtBTkQ7O0FBUUEsV0FBT25DLE1BQVA7QUFDSCxDQXJNTCIsImZpbGUiOiJzbGlkZXJzL292ZXJ2aWV3L3NsaWRlcnNfZGVsZXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBzbGlkZXJzX2RlbGV0ZS5qcyAyMDE2LTA5LTEyXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNiBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiBTbGlkZXJzIE92ZXJ2aWV3IERlbGV0ZVxuICpcbiAqIENvbnRyb2xsZXIgTW9kdWxlIFRvIERlbGV0ZSBTbGlkZXJzLlxuICpcbiAqIEhhbmRsZXMgdGhlIGRlbGV0ZSBvcGVyYXRpb24gb2YgdGhlIHNsaWRlcnMgb3ZlcnZpZXcgcGFnZS5cbiAqL1xuZ3guY29udHJvbGxlcnMubW9kdWxlKFxuICAgICdzbGlkZXJzX2RlbGV0ZScsXG5cbiAgICBbXG4gICAgICAgICdtb2RhbCcsXG4gICAgICAgIGAke2d4LnNvdXJjZX0vbGlicy9pbmZvX2JveGBcbiAgICBdLFxuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEVTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTbGlkZXIgZGVsZXRlIGNvbmZpcm1hdGlvbiBtb2RhbC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICRtb2RhbCA9ICQoJy5kZWxldGUtc2xpZGVyLm1vZGFsJyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERlbGV0ZSBidXR0b24gc2VsZWN0b3Igc3RyaW5nLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgZGVsZXRlQnV0dG9uU2VsZWN0b3IgPSAnLmJ0bi1kZWxldGUnO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWxldGUgc2xpZGVyIGFjdGlvbiBVUkwuXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCB1cmwgPSBgJHtqc2UuY29yZS5jb25maWcuZ2V0KCdhcHBVcmwnKX0vYWRtaW4vYWRtaW4ucGhwP2RvPVNsaWRlcnNPdmVydmlld0FqYXgvRGVsZXRlU2xpZGVyYDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIEluc3RhbmNlXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBGVU5DVElPTlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlcyB0aGUgZGVsZXRlIGNsaWNrIGV2ZW50IGJ5IG9wZW5pbmcgdGhlIGRlbGV0ZSBjb25maXJtYXRpb24gbW9kYWwuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5LkV2ZW50fSBldmVudCBUcmlnZ2VyZWQgZXZlbnQuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25EZWxldGVDbGljayhldmVudCkge1xuICAgICAgICAgICAgLy8gUHJldmVudCBkZWZhdWx0IGFjdGlvbi5cbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIC8vIFRhYmxlIHJvdy5cbiAgICAgICAgICAgIGNvbnN0ICRwYXJlbnRUYWJsZVJvdyA9ICQoZXZlbnQudGFyZ2V0KS5wYXJlbnRzKCd0cicpO1xuXG4gICAgICAgICAgICAvLyBEZWxldGUgY29uZmlybWF0aW9uIG1vZGFsIGJ1dHRvbi5cbiAgICAgICAgICAgIGNvbnN0ICRjb25maXJtQnV0dG9uID0gJG1vZGFsLmZpbmQoJ2J1dHRvbi5jb25maXJtJyk7XG5cbiAgICAgICAgICAgIC8vIEVtcHR5IG1vZGFsIGJvZHkuXG4gICAgICAgICAgICAkbW9kYWwuZmluZCgnLm1vZGFsLWJvZHkgLmZvcm0tZ3JvdXAnKS5yZW1vdmUoKTtcblxuICAgICAgICAgICAgLy8gU2xpZGVyIGRhdGEuXG4gICAgICAgICAgICBjb25zdCBzbGlkZXJEYXRhID0ge1xuICAgICAgICAgICAgICAgIGlkOiAkcGFyZW50VGFibGVSb3cuZGF0YSgnc2xpZGVySWQnKSxcbiAgICAgICAgICAgICAgICBuYW1lOiAkcGFyZW50VGFibGVSb3cuZGF0YSgnc2xpZGVyTmFtZScpLFxuICAgICAgICAgICAgICAgIHNsaWRlc1F1YW50aXR5OiAkcGFyZW50VGFibGVSb3cuZGF0YSgnc2xpZGVzUXVhbnRpdHknKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gUHV0IG5ldyBzbGlkZXIgaW5mb3JtYXRpb24gaW50byBtb2RhbCBib2R5LlxuICAgICAgICAgICAgJG1vZGFsXG4gICAgICAgICAgICAgICAgLmZpbmQoJy5tb2RhbC1ib2R5IGZpZWxkc2V0JylcbiAgICAgICAgICAgICAgICAuaHRtbChfZ2VuZXJhdGVTbGlkZXJJbmZvTWFya3VwKHNsaWRlckRhdGEpKTtcblxuICAgICAgICAgICAgLy8gU2hvdyBtb2RhbC5cbiAgICAgICAgICAgICRtb2RhbC5tb2RhbCgnc2hvdycpO1xuXG4gICAgICAgICAgICAvLyBIYW5kbGUgZGVsZXRlIGNvbmZpcm1hdGlvbiBtb2RhbCBidXR0b24gY2xpY2sgZXZlbnQuXG4gICAgICAgICAgICAkY29uZmlybUJ1dHRvblxuICAgICAgICAgICAgICAgIC5vZmYoJ2NsaWNrJylcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgKCkgPT4gX29uQ29uZmlybUJ1dHRvbkNsaWNrKHNsaWRlckRhdGEuaWQpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVzIHRoZSBkZWxldGUgY29uZmlybWF0aW9uIGJ1dHRvbiBjbGljayBldmVudCBieSByZW1vdmluZyB0aGUgc2xpZGVyIHRocm91Z2ggYW4gQUpBWCByZXF1ZXN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc2xpZGVySWQgU2xpZGVyIElELlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uQ29uZmlybUJ1dHRvbkNsaWNrKHNsaWRlcklkKSB7XG4gICAgICAgICAgICAvLyBBSkFYIHJlcXVlc3Qgb3B0aW9ucy5cbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3RPcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7c2xpZGVySWR9LFxuICAgICAgICAgICAgICAgIHVybFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gUGVyZm9ybSByZXF1ZXN0LlxuICAgICAgICAgICAgJC5hamF4KHJlcXVlc3RPcHRpb25zKVxuICAgICAgICAgICAgICAgIC5kb25lKHJlc3BvbnNlID0+IF9oYW5kbGVEZWxldGVSZXF1ZXN0UmVzcG9uc2UocmVzcG9uc2UsIHNsaWRlcklkKSlcbiAgICAgICAgICAgICAgICAuYWx3YXlzKCgpID0+ICRtb2RhbC5tb2RhbCgnaGlkZScpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVzIHNsaWRlciBkZWxldGlvbiBBSkFYIGFjdGlvbiBzZXJ2ZXIgcmVzcG9uc2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZXNwb25zZSBTZXJ2ZXIgcmVzcG9uc2UuXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzbGlkZXJJZCBJRCBvZiBkZWxldGVkIHNsaWRlci5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9oYW5kbGVEZWxldGVSZXF1ZXN0UmVzcG9uc2UocmVzcG9uc2UsIHNsaWRlcklkKSB7XG4gICAgICAgICAgICAvLyBFcnJvciBtZXNzYWdlIHBocmFzZXMuXG4gICAgICAgICAgICBjb25zdCBlcnJvclRpdGxlID0ganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0RFTEVURV9TTElERVJfRVJST1JfVElUTEUnLCAnc2xpZGVycycpO1xuICAgICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0ganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0RFTEVURV9TTElERVJfRVJST1JfVEVYVCcsICdzbGlkZXJzJyk7XG5cbiAgICAgICAgICAgIC8vIFRhYmxlIGJvZHkuXG4gICAgICAgICAgICBjb25zdCAkdGFibGVCb2R5ID0gJHRoaXMuZmluZCgndGJvZHknKTtcblxuICAgICAgICAgICAgLy8gVGFibGUgcm93cy5cbiAgICAgICAgICAgIGNvbnN0ICRyb3dzID0gJHRhYmxlQm9keS5maW5kKGBbZGF0YS1zbGlkZXItaWRdYCk7XG5cbiAgICAgICAgICAgIC8vIFRhYmxlIHJvd3MgdGhhdCB3aWxsIGJlIGRlbGV0ZWQuXG4gICAgICAgICAgICBjb25zdCAkcm93VG9EZWxldGUgPSAkcm93cy5maWx0ZXIoYFtkYXRhLXNsaWRlci1pZD1cIiR7c2xpZGVySWR9XCJdYCk7XG5cbiAgICAgICAgICAgIC8vICdObyByZXN1bHRzJyBtZXNzYWdlIHRhYmxlIHJvdyB0ZW1wbGF0ZS5cbiAgICAgICAgICAgIGNvbnN0ICRlbXB0eVJvd1RlbXBsYXRlID0gJCgnI3RlbXBsYXRlLXRhYmxlLXJvdy1lbXB0eScpO1xuXG4gICAgICAgICAgICAvLyBDaGVjayBmb3IgYWN0aW9uIHN1Y2Nlc3MuXG4gICAgICAgICAgICBpZiAocmVzcG9uc2UuaW5jbHVkZXMoJ3N1Y2Nlc3MnKSkge1xuICAgICAgICAgICAgICAgIC8vIERlbGV0ZSByZXNwZWN0aXZlIHRhYmxlIHJvd3MuXG4gICAgICAgICAgICAgICAgJHJvd1RvRGVsZXRlLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAgICAgLy8gQWRkIHN1Y2Nlc3MgbWVzc2FnZSB0byBhZG1pbiBpbmZvIGJveC5cbiAgICAgICAgICAgICAgICBqc2UubGlicy5pbmZvX2JveC5hZGRTdWNjZXNzTWVzc2FnZSgpO1xuXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG5vIHJvd3MsIHNob3cgJ05vIHJlc3VsdHMnIG1lc3NhZ2Ugcm93LlxuICAgICAgICAgICAgICAgIGlmICgoJHJvd3MubGVuZ3RoIC0gMSkgPCAxKSB7XG4gICAgICAgICAgICAgICAgICAgICR0YWJsZUJvZHlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5lbXB0eSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKCRlbXB0eVJvd1RlbXBsYXRlLmNsb25lKCkuaHRtbCgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFNob3cgZXJyb3IgbWVzc2FnZSBtb2RhbC5cbiAgICAgICAgICAgICAgICBqc2UubGlicy5tb2RhbC5zaG93TWVzc2FnZShlcnJvclRpdGxlLCBlcnJvck1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdlbmVyYXRlcyBIVE1MIGNvbnRhaW5pbmcgdGhlIHNsaWRlciBpbmZvcm1hdGlvbiBmb3IgdGhlIGRlbGV0ZSBjb25maXJtYXRpb24gbW9kYWwuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIFNsaWRlciBkYXRhLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YS5uYW1lIE5hbWUgb2YgdGhlIHNsaWRlci5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGEuc2xpZGVzUXVhbnRpdHkgUXVhbnRpdHkgb2Ygc2xpZGVzIGZyb20gc2xpZGVyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IENyZWF0ZWQgSFRNTCBzdHJpbmcuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfZ2VuZXJhdGVTbGlkZXJJbmZvTWFya3VwKGRhdGEpIHtcbiAgICAgICAgICAgIC8vIExhYmVsIHBocmFzZXMuXG4gICAgICAgICAgICBjb25zdCBzbGlkZXJOYW1lTGFiZWwgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnTkFNRScsICdzbGlkZXJzJyk7XG4gICAgICAgICAgICBjb25zdCBzbGlkZXNRdWFudGl0eUxhYmVsID0ganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0FNT1VOVF9PRl9TTElERVMnLCAnc2xpZGVycycpO1xuXG4gICAgICAgICAgICAvLyBSZXR1cm4gbWFya3VwLlxuICAgICAgICAgICAgcmV0dXJuIGBcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuXHRcdFx0XHRcdFx0PGxhYmVsIGNsYXNzPVwiY29sLW1kLTVcIj4ke3NsaWRlck5hbWVMYWJlbH08L2xhYmVsPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbC1tZC03XCI+JHtkYXRhLm5hbWV9PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuXHRcdFx0XHRcdFx0PGxhYmVsIGNsYXNzPVwiY29sLW1kLTVcIj4ke3NsaWRlc1F1YW50aXR5TGFiZWx9PC9sYWJlbD5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjb2wtbWQtN1wiPiR7ZGF0YS5zbGlkZXNRdWFudGl0eX08L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdGA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZG9uZSA9PiB7XG4gICAgICAgICAgICAvLyBMaXN0ZW4gdG8gZm9ybSBzdWJtaXQgZXZlbnQuXG4gICAgICAgICAgICAkdGhpcy5vbignY2xpY2snLCBkZWxldGVCdXR0b25TZWxlY3RvciwgX29uRGVsZXRlQ2xpY2spO1xuXG4gICAgICAgICAgICAvLyBGaW5pc2ggaW5pdGlhbGl6YXRpb24uXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9XG4pO1xuIl19
