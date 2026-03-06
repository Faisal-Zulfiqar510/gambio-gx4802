"use strict";

/* --------------------------------------------------------------
 product_related_actions_controller.js 2021-08-05 gm
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Related Actions Controller
 *
 * This controller contains the mapping logic of the products properties/options/downloads/special buttons.
 *
 * @module Controllers/product_related_actions_controller
 */
gx.controllers.module("product_related_actions_controller", [gx.source + "/libs/button_dropdown"],

/** @lends module:Controllers/product_related_actions_controller */

function (data) {
    "use strict";

    // ------------------------------------------------------------------------
    // VARIABLES DEFINITION
    // ------------------------------------------------------------------------

    var /**
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
    defaults = {
        properties_url: "",
        options_url: "",
        downloads_url: "",
        specials_url: "",
        product_id: "",
        c_path: "",
        recent_button: "BUTTON_SPECIAL"
    },

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
    // PRIVATE METHODS
    // ------------------------------------------------------------------------

    /**
     * Map actions to buttons.
     *
     * @private
     */
    var _setActions = function _setActions() {
        var actions = [];

        actions.BUTTON_SPECIAL = _setSpecialPriceActionCallback;
        actions.BUTTON_PROPERTIES = _setPropertiesActionCallback;
        actions.BUTTON_PRODUCT_OPTIONS = _setOptionsActionCallback;
        actions.BUTTON_PRODUCT_DOWNLOADS = _setDownloadsActionCallback;

        jse.libs.button_dropdown.mapAction($this, "BUTTON_SPECIAL", "admin_buttons", _setSpecialPriceActionCallback);
        jse.libs.button_dropdown.mapAction($this, "BUTTON_PROPERTIES", "admin_buttons", _setPropertiesActionCallback);
        jse.libs.button_dropdown.mapAction($this, "BUTTON_PRODUCT_OPTIONS", "admin_buttons", _setOptionsActionCallback);
        jse.libs.button_dropdown.mapAction($this, "BUTTON_PRODUCT_DOWNLOADS", "admin_buttons", _setDownloadsActionCallback);
    };

    /**
     * Redirect to special pricing page.
     *
     * @returns {boolean}
     *
     * @private
     */
    var _setSpecialPriceActionCallback = function _setSpecialPriceActionCallback() {
        if (options.specials_url !== "") {
            window.location.href = options.specials_url;

            return true;
        }

        return false;
    };

    /**
     * Redirect to properties page.
     *
     * @returns {boolean}
     * @private
     */
    var _setPropertiesActionCallback = function _setPropertiesActionCallback() {
        if (options.properties_url !== "") {
            window.location.href = options.properties_url;

            return true;
        }

        return false;
    };

    /**
     * Redirect to options page.
     *
     * @returns {boolean}
     *
     * @private
     */
    var _setOptionsActionCallback = function _setOptionsActionCallback() {
        if (options.options_url !== "") {
            window.location.href = options.options_url;

            return true;
        }

        return false;
    };

    /**
     * Redirect to downloads page.
     *
     * @returns {boolean}
     *
     * @private
     */
    var _setDownloadsActionCallback = function _setDownloadsActionCallback() {
        if (options.downloads_url !== "") {
            window.location.href = options.downloads_url;

            return true;
        }

        return false;
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        window.setTimeout(_setActions, 300);
        done(); // Finish it
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2R1Y3QvcHJvZHVjdF9yZWxhdGVkX2FjdGlvbnNfY29udHJvbGxlci5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwic291cmNlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImRlZmF1bHRzIiwicHJvcGVydGllc191cmwiLCJvcHRpb25zX3VybCIsImRvd25sb2Fkc191cmwiLCJzcGVjaWFsc191cmwiLCJwcm9kdWN0X2lkIiwiY19wYXRoIiwicmVjZW50X2J1dHRvbiIsIm9wdGlvbnMiLCJleHRlbmQiLCJfc2V0QWN0aW9ucyIsImFjdGlvbnMiLCJCVVRUT05fU1BFQ0lBTCIsIl9zZXRTcGVjaWFsUHJpY2VBY3Rpb25DYWxsYmFjayIsIkJVVFRPTl9QUk9QRVJUSUVTIiwiX3NldFByb3BlcnRpZXNBY3Rpb25DYWxsYmFjayIsIkJVVFRPTl9QUk9EVUNUX09QVElPTlMiLCJfc2V0T3B0aW9uc0FjdGlvbkNhbGxiYWNrIiwiQlVUVE9OX1BST0RVQ1RfRE9XTkxPQURTIiwiX3NldERvd25sb2Fkc0FjdGlvbkNhbGxiYWNrIiwianNlIiwibGlicyIsImJ1dHRvbl9kcm9wZG93biIsIm1hcEFjdGlvbiIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsImluaXQiLCJkb25lIiwic2V0VGltZW91dCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7O0FBT0FBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZixDQUNJLG9DQURKLEVBR0ksQ0FBQ0YsR0FBR0csTUFBSCxHQUFZLHVCQUFiLENBSEo7O0FBS0k7O0FBRUEsVUFBVUMsSUFBVixFQUFnQjtBQUNaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxRQUFJOzs7OztBQUtBQyxZQUFRQyxFQUFFLElBQUYsQ0FMWjs7QUFNSTs7Ozs7QUFLQUMsZUFBVztBQUNQQyx3QkFBZ0IsRUFEVDtBQUVQQyxxQkFBYSxFQUZOO0FBR1BDLHVCQUFlLEVBSFI7QUFJUEMsc0JBQWMsRUFKUDtBQUtQQyxvQkFBWSxFQUxMO0FBTVBDLGdCQUFRLEVBTkQ7QUFPUEMsdUJBQWU7QUFQUixLQVhmOztBQW9CSTs7Ozs7QUFLQUMsY0FBVVQsRUFBRVUsTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CVCxRQUFuQixFQUE2QkgsSUFBN0IsQ0F6QmQ7O0FBMEJJOzs7OztBQUtBRixhQUFTLEVBL0JiOztBQWlDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7O0FBS0EsUUFBSWUsY0FBYyxTQUFkQSxXQUFjLEdBQVk7QUFDMUIsWUFBSUMsVUFBVSxFQUFkOztBQUVBQSxnQkFBUUMsY0FBUixHQUF5QkMsOEJBQXpCO0FBQ0FGLGdCQUFRRyxpQkFBUixHQUE0QkMsNEJBQTVCO0FBQ0FKLGdCQUFRSyxzQkFBUixHQUFpQ0MseUJBQWpDO0FBQ0FOLGdCQUFRTyx3QkFBUixHQUFtQ0MsMkJBQW5DOztBQUdBQyxZQUFJQyxJQUFKLENBQVNDLGVBQVQsQ0FBeUJDLFNBQXpCLENBQ0l6QixLQURKLEVBRUksZ0JBRkosRUFHSSxlQUhKLEVBSUllLDhCQUpKO0FBTUFPLFlBQUlDLElBQUosQ0FBU0MsZUFBVCxDQUF5QkMsU0FBekIsQ0FDSXpCLEtBREosRUFFSSxtQkFGSixFQUdJLGVBSEosRUFJSWlCLDRCQUpKO0FBTUFLLFlBQUlDLElBQUosQ0FBU0MsZUFBVCxDQUF5QkMsU0FBekIsQ0FDSXpCLEtBREosRUFFSSx3QkFGSixFQUdJLGVBSEosRUFJSW1CLHlCQUpKO0FBTUFHLFlBQUlDLElBQUosQ0FBU0MsZUFBVCxDQUF5QkMsU0FBekIsQ0FDSXpCLEtBREosRUFFSSwwQkFGSixFQUdJLGVBSEosRUFJSXFCLDJCQUpKO0FBTUgsS0FqQ0Q7O0FBbUNBOzs7Ozs7O0FBT0EsUUFBSU4saUNBQWlDLFNBQWpDQSw4QkFBaUMsR0FBWTtBQUM3QyxZQUFJTCxRQUFRSixZQUFSLEtBQXlCLEVBQTdCLEVBQWlDO0FBQzdCb0IsbUJBQU9DLFFBQVAsQ0FBZ0JDLElBQWhCLEdBQXVCbEIsUUFBUUosWUFBL0I7O0FBRUEsbUJBQU8sSUFBUDtBQUNIOztBQUVELGVBQU8sS0FBUDtBQUNILEtBUkQ7O0FBVUE7Ozs7OztBQU1BLFFBQUlXLCtCQUErQixTQUEvQkEsNEJBQStCLEdBQVk7QUFDM0MsWUFBSVAsUUFBUVAsY0FBUixLQUEyQixFQUEvQixFQUFtQztBQUMvQnVCLG1CQUFPQyxRQUFQLENBQWdCQyxJQUFoQixHQUF1QmxCLFFBQVFQLGNBQS9COztBQUVBLG1CQUFPLElBQVA7QUFDSDs7QUFFRCxlQUFPLEtBQVA7QUFDSCxLQVJEOztBQVVBOzs7Ozs7O0FBT0EsUUFBSWdCLDRCQUE0QixTQUE1QkEseUJBQTRCLEdBQVk7QUFDeEMsWUFBSVQsUUFBUU4sV0FBUixLQUF3QixFQUE1QixFQUFnQztBQUM1QnNCLG1CQUFPQyxRQUFQLENBQWdCQyxJQUFoQixHQUF1QmxCLFFBQVFOLFdBQS9COztBQUVBLG1CQUFPLElBQVA7QUFDSDs7QUFFRCxlQUFPLEtBQVA7QUFDSCxLQVJEOztBQVVBOzs7Ozs7O0FBT0EsUUFBSWlCLDhCQUE4QixTQUE5QkEsMkJBQThCLEdBQVk7QUFDMUMsWUFBSVgsUUFBUUwsYUFBUixLQUEwQixFQUE5QixFQUFrQztBQUM5QnFCLG1CQUFPQyxRQUFQLENBQWdCQyxJQUFoQixHQUF1QmxCLFFBQVFMLGFBQS9COztBQUVBLG1CQUFPLElBQVA7QUFDSDs7QUFFRCxlQUFPLEtBQVA7QUFDSCxLQVJEOztBQVVBO0FBQ0E7QUFDQTs7QUFFQVIsV0FBT2dDLElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCO0FBQzFCSixlQUFPSyxVQUFQLENBQWtCbkIsV0FBbEIsRUFBK0IsR0FBL0I7QUFDQWtCLGVBRjBCLENBRWxCO0FBQ1gsS0FIRDs7QUFLQSxXQUFPakMsTUFBUDtBQUNILENBeEtMIiwiZmlsZSI6InByb2R1Y3QvcHJvZHVjdF9yZWxhdGVkX2FjdGlvbnNfY29udHJvbGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gcHJvZHVjdF9yZWxhdGVkX2FjdGlvbnNfY29udHJvbGxlci5qcyAyMDIxLTA4LTA1IGdtXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAyMSBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBSZWxhdGVkIEFjdGlvbnMgQ29udHJvbGxlclxuICpcbiAqIFRoaXMgY29udHJvbGxlciBjb250YWlucyB0aGUgbWFwcGluZyBsb2dpYyBvZiB0aGUgcHJvZHVjdHMgcHJvcGVydGllcy9vcHRpb25zL2Rvd25sb2Fkcy9zcGVjaWFsIGJ1dHRvbnMuXG4gKlxuICogQG1vZHVsZSBDb250cm9sbGVycy9wcm9kdWN0X3JlbGF0ZWRfYWN0aW9uc19jb250cm9sbGVyXG4gKi9cbmd4LmNvbnRyb2xsZXJzLm1vZHVsZShcbiAgICBcInByb2R1Y3RfcmVsYXRlZF9hY3Rpb25zX2NvbnRyb2xsZXJcIixcblxuICAgIFtneC5zb3VyY2UgKyBcIi9saWJzL2J1dHRvbl9kcm9wZG93blwiXSxcblxuICAgIC8qKiBAbGVuZHMgbW9kdWxlOkNvbnRyb2xsZXJzL3Byb2R1Y3RfcmVsYXRlZF9hY3Rpb25zX2NvbnRyb2xsZXIgKi9cblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVMgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXIgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdmFyIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRGVmYXVsdCBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllc191cmw6IFwiXCIsXG4gICAgICAgICAgICAgICAgb3B0aW9uc191cmw6IFwiXCIsXG4gICAgICAgICAgICAgICAgZG93bmxvYWRzX3VybDogXCJcIixcbiAgICAgICAgICAgICAgICBzcGVjaWFsc191cmw6IFwiXCIsXG4gICAgICAgICAgICAgICAgcHJvZHVjdF9pZDogXCJcIixcbiAgICAgICAgICAgICAgICBjX3BhdGg6IFwiXCIsXG4gICAgICAgICAgICAgICAgcmVjZW50X2J1dHRvbjogXCJCVVRUT05fU1BFQ0lBTFwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRmluYWwgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB2YXIge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSksXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBPYmplY3RcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gUFJJVkFURSBNRVRIT0RTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNYXAgYWN0aW9ucyB0byBidXR0b25zLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9zZXRBY3Rpb25zID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGFjdGlvbnMgPSBbXTtcblxuICAgICAgICAgICAgYWN0aW9ucy5CVVRUT05fU1BFQ0lBTCA9IF9zZXRTcGVjaWFsUHJpY2VBY3Rpb25DYWxsYmFjaztcbiAgICAgICAgICAgIGFjdGlvbnMuQlVUVE9OX1BST1BFUlRJRVMgPSBfc2V0UHJvcGVydGllc0FjdGlvbkNhbGxiYWNrO1xuICAgICAgICAgICAgYWN0aW9ucy5CVVRUT05fUFJPRFVDVF9PUFRJT05TID0gX3NldE9wdGlvbnNBY3Rpb25DYWxsYmFjaztcbiAgICAgICAgICAgIGFjdGlvbnMuQlVUVE9OX1BST0RVQ1RfRE9XTkxPQURTID0gX3NldERvd25sb2Fkc0FjdGlvbkNhbGxiYWNrO1xuXG5cbiAgICAgICAgICAgIGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5tYXBBY3Rpb24oXG4gICAgICAgICAgICAgICAgJHRoaXMsXG4gICAgICAgICAgICAgICAgXCJCVVRUT05fU1BFQ0lBTFwiLFxuICAgICAgICAgICAgICAgIFwiYWRtaW5fYnV0dG9uc1wiLFxuICAgICAgICAgICAgICAgIF9zZXRTcGVjaWFsUHJpY2VBY3Rpb25DYWxsYmFja1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5tYXBBY3Rpb24oXG4gICAgICAgICAgICAgICAgJHRoaXMsXG4gICAgICAgICAgICAgICAgXCJCVVRUT05fUFJPUEVSVElFU1wiLFxuICAgICAgICAgICAgICAgIFwiYWRtaW5fYnV0dG9uc1wiLFxuICAgICAgICAgICAgICAgIF9zZXRQcm9wZXJ0aWVzQWN0aW9uQ2FsbGJhY2tcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBqc2UubGlicy5idXR0b25fZHJvcGRvd24ubWFwQWN0aW9uKFxuICAgICAgICAgICAgICAgICR0aGlzLFxuICAgICAgICAgICAgICAgIFwiQlVUVE9OX1BST0RVQ1RfT1BUSU9OU1wiLFxuICAgICAgICAgICAgICAgIFwiYWRtaW5fYnV0dG9uc1wiLFxuICAgICAgICAgICAgICAgIF9zZXRPcHRpb25zQWN0aW9uQ2FsbGJhY2tcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBqc2UubGlicy5idXR0b25fZHJvcGRvd24ubWFwQWN0aW9uKFxuICAgICAgICAgICAgICAgICR0aGlzLFxuICAgICAgICAgICAgICAgIFwiQlVUVE9OX1BST0RVQ1RfRE9XTkxPQURTXCIsXG4gICAgICAgICAgICAgICAgXCJhZG1pbl9idXR0b25zXCIsXG4gICAgICAgICAgICAgICAgX3NldERvd25sb2Fkc0FjdGlvbkNhbGxiYWNrXG4gICAgICAgICAgICApO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZWRpcmVjdCB0byBzcGVjaWFsIHByaWNpbmcgcGFnZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX3NldFNwZWNpYWxQcmljZUFjdGlvbkNhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc3BlY2lhbHNfdXJsICE9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBvcHRpb25zLnNwZWNpYWxzX3VybDtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlZGlyZWN0IHRvIHByb3BlcnRpZXMgcGFnZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX3NldFByb3BlcnRpZXNBY3Rpb25DYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnByb3BlcnRpZXNfdXJsICE9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBvcHRpb25zLnByb3BlcnRpZXNfdXJsO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVkaXJlY3QgdG8gb3B0aW9ucyBwYWdlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfc2V0T3B0aW9uc0FjdGlvbkNhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMub3B0aW9uc191cmwgIT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IG9wdGlvbnMub3B0aW9uc191cmw7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZWRpcmVjdCB0byBkb3dubG9hZHMgcGFnZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX3NldERvd25sb2Fkc0FjdGlvbkNhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuZG93bmxvYWRzX3VybCAhPT0gXCJcIikge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gb3B0aW9ucy5kb3dubG9hZHNfdXJsO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoX3NldEFjdGlvbnMsIDMwMCk7XG4gICAgICAgICAgICBkb25lKCk7IC8vIEZpbmlzaCBpdFxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfVxuKTtcbiJdfQ==
