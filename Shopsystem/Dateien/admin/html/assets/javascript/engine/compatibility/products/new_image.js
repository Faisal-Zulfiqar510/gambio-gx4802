'use strict';

/* --------------------------------------------------------------
 new_image.js 2023-01-26
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2023 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Products New Image Module
 *
 * This module is reponsible for handling new images added.
 *
 * @module Compatibility/new_image
 */
gx.compatibility.module(
// Module name
'new_image',

// Module dependencies
[jse.source + '/vendor/mustache.js/mustache.min.js'],

/** @lends module:Compatibility/new_image */

function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES DEFINITION
    // ------------------------------------------------------------------------

    // Shortcut to module element.

    var $this = $(this);

    // Elements selector object.
    var selectors = {
        addImageButton: '[data-addimage-button]',
        containerTemplate: '#image-container-template',
        newImagesList: '[data-newimages-list]'
    };

    // Animation duration (in ms).
    var ANIMATION_DURATION = 250;

    // Module object.
    var module = {};

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    /**
     * Generates a random string. Used for creating unique element IDs.
     * @param {Number} [charLength = 8] Maximum character length of generated string.
     * @return {String}
     */
    var _generateRandomId = function _generateRandomId(charLength) {
        // Check default parameter.
        charLength = charLength || 8;

        // Generate random string.
        var randomString = Math.random().toString(36).substring(charLength);

        // Return generated random string.
        return randomString;
    };

    /**
     * Renders template with provided data and returns an new jQuery element.
     * @param  {Object} [data = {}] Template data.
     * @return {jQuery}
     */
    var _renderTemplate = function _renderTemplate(data) {
        // Check data parameter.
        data = data || {};

        // Template element.
        var $template = $(selectors.containerTemplate);

        // Rendered HTML from mustache tempalte with provided data.
        var rendered = Mustache.render($template.html(), data);

        // Return jQuery-wrapped element with rendered HTML.
        return $(rendered);
    };

    /**
     * Adds a new image container to the product image list.
     */
    var _addImage = function _addImage(event) {
        // Reference to (new) product image list.
        var $list = $(selectors.newImagesList);

        // Create a new element with rendered product image container template.
        var $newContainer = _renderTemplate({ randomId: _generateRandomId() });

        // Apppend new element to product image list.
        $list.before($newContainer);

        // Hide and make fade animation.
        $newContainer.hide().fadeIn(ANIMATION_DURATION);

        // Initialize JSEngine modules.
        gx.widgets.init($newContainer);
        gx.compatibility.init($newContainer);
    };

    /**
     * Handles click events.
     * @param {jQuery.Event} event Fired event.
     */
    var _onClick = function _onClick(event) {
        // Reference to clicked element.
        var $clickedElement = $(event.target);

        // Reference to add new image button.
        var $addButton = $(selectors.addImageButton);

        // Check if the add image button has been clicked.
        if ($clickedElement.is($addButton)) {
            _addImage(event);
        }
    };

    module.init = function (done) {
        // Handle click event
        $this.on('click', _onClick);

        // Register as finished
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2R1Y3RzL25ld19pbWFnZS5qcyJdLCJuYW1lcyI6WyJneCIsImNvbXBhdGliaWxpdHkiLCJtb2R1bGUiLCJqc2UiLCJzb3VyY2UiLCJkYXRhIiwiJHRoaXMiLCIkIiwic2VsZWN0b3JzIiwiYWRkSW1hZ2VCdXR0b24iLCJjb250YWluZXJUZW1wbGF0ZSIsIm5ld0ltYWdlc0xpc3QiLCJBTklNQVRJT05fRFVSQVRJT04iLCJfZ2VuZXJhdGVSYW5kb21JZCIsImNoYXJMZW5ndGgiLCJyYW5kb21TdHJpbmciLCJNYXRoIiwicmFuZG9tIiwidG9TdHJpbmciLCJzdWJzdHJpbmciLCJfcmVuZGVyVGVtcGxhdGUiLCIkdGVtcGxhdGUiLCJyZW5kZXJlZCIsIk11c3RhY2hlIiwicmVuZGVyIiwiaHRtbCIsIl9hZGRJbWFnZSIsImV2ZW50IiwiJGxpc3QiLCIkbmV3Q29udGFpbmVyIiwicmFuZG9tSWQiLCJiZWZvcmUiLCJoaWRlIiwiZmFkZUluIiwid2lkZ2V0cyIsImluaXQiLCJfb25DbGljayIsIiRjbGlja2VkRWxlbWVudCIsInRhcmdldCIsIiRhZGRCdXR0b24iLCJpcyIsImRvbmUiLCJvbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7O0FBT0FBLEdBQUdDLGFBQUgsQ0FBaUJDLE1BQWpCO0FBQ0k7QUFDQSxXQUZKOztBQUlJO0FBQ0EsQ0FDT0MsSUFBSUMsTUFEWCx5Q0FMSjs7QUFTSTs7QUFFQSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFDQSxRQUFJQyxRQUFRQyxFQUFFLElBQUYsQ0FBWjs7QUFFQTtBQUNBLFFBQUlDLFlBQVk7QUFDWkMsd0JBQWdCLHdCQURKO0FBRVpDLDJCQUFtQiwyQkFGUDtBQUdaQyx1QkFBZTtBQUhILEtBQWhCOztBQU1BO0FBQ0EsUUFBSUMscUJBQXFCLEdBQXpCOztBQUVBO0FBQ0EsUUFBSVYsU0FBUyxFQUFiOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7QUFLQSxRQUFJVyxvQkFBb0IsU0FBcEJBLGlCQUFvQixDQUFVQyxVQUFWLEVBQXNCO0FBQzFDO0FBQ0FBLHFCQUFhQSxjQUFjLENBQTNCOztBQUVBO0FBQ0EsWUFBSUMsZUFBZUMsS0FBS0MsTUFBTCxHQUNkQyxRQURjLENBQ0wsRUFESyxFQUVkQyxTQUZjLENBRUpMLFVBRkksQ0FBbkI7O0FBS0E7QUFDQSxlQUFPQyxZQUFQO0FBQ0gsS0FaRDs7QUFjQTs7Ozs7QUFLQSxRQUFJSyxrQkFBa0IsU0FBbEJBLGVBQWtCLENBQVVmLElBQVYsRUFBZ0I7QUFDbEM7QUFDQUEsZUFBT0EsUUFBUSxFQUFmOztBQUVBO0FBQ0EsWUFBSWdCLFlBQVlkLEVBQUVDLFVBQVVFLGlCQUFaLENBQWhCOztBQUVBO0FBQ0EsWUFBSVksV0FBV0MsU0FBU0MsTUFBVCxDQUFnQkgsVUFBVUksSUFBVixFQUFoQixFQUFrQ3BCLElBQWxDLENBQWY7O0FBRUE7QUFDQSxlQUFPRSxFQUFFZSxRQUFGLENBQVA7QUFDSCxLQVpEOztBQWNBOzs7QUFHQSxRQUFJSSxZQUFZLFNBQVpBLFNBQVksQ0FBVUMsS0FBVixFQUFpQjtBQUM3QjtBQUNBLFlBQUlDLFFBQVFyQixFQUFFQyxVQUFVRyxhQUFaLENBQVo7O0FBRUE7QUFDQSxZQUFJa0IsZ0JBQWdCVCxnQkFBZ0IsRUFBQ1UsVUFBVWpCLG1CQUFYLEVBQWhCLENBQXBCOztBQUVBO0FBQ0FlLGNBQU1HLE1BQU4sQ0FBYUYsYUFBYjs7QUFFQTtBQUNBQSxzQkFDS0csSUFETCxHQUVLQyxNQUZMLENBRVlyQixrQkFGWjs7QUFJQTtBQUNBWixXQUFHa0MsT0FBSCxDQUFXQyxJQUFYLENBQWdCTixhQUFoQjtBQUNBN0IsV0FBR0MsYUFBSCxDQUFpQmtDLElBQWpCLENBQXNCTixhQUF0QjtBQUNILEtBbEJEOztBQW9CQTs7OztBQUlBLFFBQUlPLFdBQVcsU0FBWEEsUUFBVyxDQUFVVCxLQUFWLEVBQWlCO0FBQzVCO0FBQ0EsWUFBSVUsa0JBQWtCOUIsRUFBRW9CLE1BQU1XLE1BQVIsQ0FBdEI7O0FBRUE7QUFDQSxZQUFJQyxhQUFhaEMsRUFBRUMsVUFBVUMsY0FBWixDQUFqQjs7QUFFQTtBQUNBLFlBQUk0QixnQkFBZ0JHLEVBQWhCLENBQW1CRCxVQUFuQixDQUFKLEVBQW9DO0FBQ2hDYixzQkFBVUMsS0FBVjtBQUNIO0FBQ0osS0FYRDs7QUFhQXpCLFdBQU9pQyxJQUFQLEdBQWMsVUFBVU0sSUFBVixFQUFnQjtBQUMxQjtBQUNBbkMsY0FBTW9DLEVBQU4sQ0FBUyxPQUFULEVBQWtCTixRQUFsQjs7QUFFQTtBQUNBSztBQUNILEtBTkQ7O0FBUUEsV0FBT3ZDLE1BQVA7QUFDSCxDQTlITCIsImZpbGUiOiJwcm9kdWN0cy9uZXdfaW1hZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIG5ld19pbWFnZS5qcyAyMDIzLTAxLTI2XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAyMyBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBQcm9kdWN0cyBOZXcgSW1hZ2UgTW9kdWxlXG4gKlxuICogVGhpcyBtb2R1bGUgaXMgcmVwb25zaWJsZSBmb3IgaGFuZGxpbmcgbmV3IGltYWdlcyBhZGRlZC5cbiAqXG4gKiBAbW9kdWxlIENvbXBhdGliaWxpdHkvbmV3X2ltYWdlXG4gKi9cbmd4LmNvbXBhdGliaWxpdHkubW9kdWxlKFxuICAgIC8vIE1vZHVsZSBuYW1lXG4gICAgJ25ld19pbWFnZScsXG5cbiAgICAvLyBNb2R1bGUgZGVwZW5kZW5jaWVzXG4gICAgW1xuICAgICAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3IvbXVzdGFjaGUuanMvbXVzdGFjaGUubWluLmpzYFxuICAgIF0sXG5cbiAgICAvKiogQGxlbmRzIG1vZHVsZTpDb21wYXRpYmlsaXR5L25ld19pbWFnZSAqL1xuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFUyBERUZJTklUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8vIFNob3J0Y3V0IHRvIG1vZHVsZSBlbGVtZW50LlxuICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgIC8vIEVsZW1lbnRzIHNlbGVjdG9yIG9iamVjdC5cbiAgICAgICAgdmFyIHNlbGVjdG9ycyA9IHtcbiAgICAgICAgICAgIGFkZEltYWdlQnV0dG9uOiAnW2RhdGEtYWRkaW1hZ2UtYnV0dG9uXScsXG4gICAgICAgICAgICBjb250YWluZXJUZW1wbGF0ZTogJyNpbWFnZS1jb250YWluZXItdGVtcGxhdGUnLFxuICAgICAgICAgICAgbmV3SW1hZ2VzTGlzdDogJ1tkYXRhLW5ld2ltYWdlcy1saXN0XSdcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBBbmltYXRpb24gZHVyYXRpb24gKGluIG1zKS5cbiAgICAgICAgdmFyIEFOSU1BVElPTl9EVVJBVElPTiA9IDI1MDtcblxuICAgICAgICAvLyBNb2R1bGUgb2JqZWN0LlxuICAgICAgICB2YXIgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZW5lcmF0ZXMgYSByYW5kb20gc3RyaW5nLiBVc2VkIGZvciBjcmVhdGluZyB1bmlxdWUgZWxlbWVudCBJRHMuXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbY2hhckxlbmd0aCA9IDhdIE1heGltdW0gY2hhcmFjdGVyIGxlbmd0aCBvZiBnZW5lcmF0ZWQgc3RyaW5nLlxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX2dlbmVyYXRlUmFuZG9tSWQgPSBmdW5jdGlvbiAoY2hhckxlbmd0aCkge1xuICAgICAgICAgICAgLy8gQ2hlY2sgZGVmYXVsdCBwYXJhbWV0ZXIuXG4gICAgICAgICAgICBjaGFyTGVuZ3RoID0gY2hhckxlbmd0aCB8fCA4O1xuXG4gICAgICAgICAgICAvLyBHZW5lcmF0ZSByYW5kb20gc3RyaW5nLlxuICAgICAgICAgICAgdmFyIHJhbmRvbVN0cmluZyA9IE1hdGgucmFuZG9tKClcbiAgICAgICAgICAgICAgICAudG9TdHJpbmcoMzYpXG4gICAgICAgICAgICAgICAgLnN1YnN0cmluZyhjaGFyTGVuZ3RoKTtcblxuXG4gICAgICAgICAgICAvLyBSZXR1cm4gZ2VuZXJhdGVkIHJhbmRvbSBzdHJpbmcuXG4gICAgICAgICAgICByZXR1cm4gcmFuZG9tU3RyaW5nO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW5kZXJzIHRlbXBsYXRlIHdpdGggcHJvdmlkZWQgZGF0YSBhbmQgcmV0dXJucyBhbiBuZXcgalF1ZXJ5IGVsZW1lbnQuXG4gICAgICAgICAqIEBwYXJhbSAge09iamVjdH0gW2RhdGEgPSB7fV0gVGVtcGxhdGUgZGF0YS5cbiAgICAgICAgICogQHJldHVybiB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9yZW5kZXJUZW1wbGF0ZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAvLyBDaGVjayBkYXRhIHBhcmFtZXRlci5cbiAgICAgICAgICAgIGRhdGEgPSBkYXRhIHx8IHt9O1xuXG4gICAgICAgICAgICAvLyBUZW1wbGF0ZSBlbGVtZW50LlxuICAgICAgICAgICAgdmFyICR0ZW1wbGF0ZSA9ICQoc2VsZWN0b3JzLmNvbnRhaW5lclRlbXBsYXRlKTtcblxuICAgICAgICAgICAgLy8gUmVuZGVyZWQgSFRNTCBmcm9tIG11c3RhY2hlIHRlbXBhbHRlIHdpdGggcHJvdmlkZWQgZGF0YS5cbiAgICAgICAgICAgIHZhciByZW5kZXJlZCA9IE11c3RhY2hlLnJlbmRlcigkdGVtcGxhdGUuaHRtbCgpLCBkYXRhKTtcblxuICAgICAgICAgICAgLy8gUmV0dXJuIGpRdWVyeS13cmFwcGVkIGVsZW1lbnQgd2l0aCByZW5kZXJlZCBIVE1MLlxuICAgICAgICAgICAgcmV0dXJuICQocmVuZGVyZWQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBZGRzIGEgbmV3IGltYWdlIGNvbnRhaW5lciB0byB0aGUgcHJvZHVjdCBpbWFnZSBsaXN0LlxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9hZGRJbWFnZSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgLy8gUmVmZXJlbmNlIHRvIChuZXcpIHByb2R1Y3QgaW1hZ2UgbGlzdC5cbiAgICAgICAgICAgIHZhciAkbGlzdCA9ICQoc2VsZWN0b3JzLm5ld0ltYWdlc0xpc3QpO1xuXG4gICAgICAgICAgICAvLyBDcmVhdGUgYSBuZXcgZWxlbWVudCB3aXRoIHJlbmRlcmVkIHByb2R1Y3QgaW1hZ2UgY29udGFpbmVyIHRlbXBsYXRlLlxuICAgICAgICAgICAgdmFyICRuZXdDb250YWluZXIgPSBfcmVuZGVyVGVtcGxhdGUoe3JhbmRvbUlkOiBfZ2VuZXJhdGVSYW5kb21JZCgpfSk7XG5cbiAgICAgICAgICAgIC8vIEFwcHBlbmQgbmV3IGVsZW1lbnQgdG8gcHJvZHVjdCBpbWFnZSBsaXN0LlxuICAgICAgICAgICAgJGxpc3QuYmVmb3JlKCRuZXdDb250YWluZXIpO1xuXG4gICAgICAgICAgICAvLyBIaWRlIGFuZCBtYWtlIGZhZGUgYW5pbWF0aW9uLlxuICAgICAgICAgICAgJG5ld0NvbnRhaW5lclxuICAgICAgICAgICAgICAgIC5oaWRlKClcbiAgICAgICAgICAgICAgICAuZmFkZUluKEFOSU1BVElPTl9EVVJBVElPTik7XG5cbiAgICAgICAgICAgIC8vIEluaXRpYWxpemUgSlNFbmdpbmUgbW9kdWxlcy5cbiAgICAgICAgICAgIGd4LndpZGdldHMuaW5pdCgkbmV3Q29udGFpbmVyKTtcbiAgICAgICAgICAgIGd4LmNvbXBhdGliaWxpdHkuaW5pdCgkbmV3Q29udGFpbmVyKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlcyBjbGljayBldmVudHMuXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5LkV2ZW50fSBldmVudCBGaXJlZCBldmVudC5cbiAgICAgICAgICovXG4gICAgICAgIHZhciBfb25DbGljayA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgLy8gUmVmZXJlbmNlIHRvIGNsaWNrZWQgZWxlbWVudC5cbiAgICAgICAgICAgIHZhciAkY2xpY2tlZEVsZW1lbnQgPSAkKGV2ZW50LnRhcmdldCk7XG5cbiAgICAgICAgICAgIC8vIFJlZmVyZW5jZSB0byBhZGQgbmV3IGltYWdlIGJ1dHRvbi5cbiAgICAgICAgICAgIHZhciAkYWRkQnV0dG9uID0gJChzZWxlY3RvcnMuYWRkSW1hZ2VCdXR0b24pO1xuXG4gICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgYWRkIGltYWdlIGJ1dHRvbiBoYXMgYmVlbiBjbGlja2VkLlxuICAgICAgICAgICAgaWYgKCRjbGlja2VkRWxlbWVudC5pcygkYWRkQnV0dG9uKSkge1xuICAgICAgICAgICAgICAgIF9hZGRJbWFnZShldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgLy8gSGFuZGxlIGNsaWNrIGV2ZW50XG4gICAgICAgICAgICAkdGhpcy5vbignY2xpY2snLCBfb25DbGljayk7XG5cbiAgICAgICAgICAgIC8vIFJlZ2lzdGVyIGFzIGZpbmlzaGVkXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
