'use strict';

/* --------------------------------------------------------------
 gxmodule_configuration.js 2018-01-13
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2018 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

gx.controllers.module('gxmodule_configuration', ['modal'], function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES DEFINITION
    // ------------------------------------------------------------------------

    /**
     * Module Selector
     *
     * @type {jQuery}
     */

    var $this = $(this);

    /**
     * Standard button
     *
     * @type {jQuery}
     */
    var $button = $('.GXModuleConfigButton');

    /**
     * Button in modal dialog
     *
     * @type {jQuery}
     */
    var $modalButton = $('.GXModuleModalButton');

    /**
     * Modal dialog
     *
     * @type {jQuery}
     */
    var $modal = $('.modal');

    var $loadingSpinnder = $('.loading-spinner');

    /**
     * Default Options
     *
     * @type {object}
     */
    var defaults = {};

    /**
     * Final Options
     *
     * @type {object}
     */
    var options = $.extend(true, {}, defaults, data);

    /**
     * Module Object
     *
     * @type {object}
     */
    var module = {};

    // ------------------------------------------------------------------------
    // EVENT HANDLERS
    // ------------------------------------------------------------------------

    /**
     * Event handling of buttons
     */
    $button.on('click', function (event) {
        event.preventDefault();
        $loadingSpinnder.fadeIn();
        var action = $(this).data('action');
        var controller = $(this).data('controller');
        var message = $(this).data('message');
        var formData = $(this).closest('form').serialize();
        var request = $.ajax('admin.php?do=GXModuleCenterModuleButtonActionsAjax', {
            method: 'post',
            data: { action: action, controller: controller, formData: formData },
            dataType: "json"
        });

        request.done(function (response) {
            $loadingSpinnder.fadeOut();
            if (response.success) {

                if (!message) {
                    message = response.data;
                }

                jse.libs.info_box.addSuccessMessage(message);
            } else {
                jse.libs.modal.showMessage(jse.core.lang.translate('error', 'messages'), response.data);
            }
        }).fail(function (jqxhr, textStatus, errorThrown) {
            $('.loading-spinner').fadeOut();
            jse.libs.modal.showMessage(jse.core.lang.translate('error', 'messages'), errorThrown);
        });
    });

    /**
     * Event handling of buttons in modal dialogs
     */
    $modalButton.on('click', function (event) {
        event.preventDefault();
        var modal = $(this).data('target');
        $(modal).modal('show');
    });

    /**
     * Load HTML Code for modal dialog
     * on error show modal with error message
     */
    $modal.each(function () {
        var modalContent = $(this).data('content');
        var modalBody = $(this).find('.modal-body');
        if (modalContent) {
            $(modalBody).load('admin.php?do=GXModuleCenterModuleButtonActionsAjax/Modal', { content: modalContent }, function (response, status, xhr) {

                var IS_JSON = true;
                try {
                    var json = $.parseJSON(response);
                } catch (err) {
                    IS_JSON = false;
                }

                if (IS_JSON) {
                    jse.libs.modal.showMessage(jse.core.lang.translate('error', 'messages'), json.data);
                }
            });
        }
    });

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZV9jZW50ZXIvZ3htb2R1bGVfY29uZmlndXJhdGlvbi5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsIiRidXR0b24iLCIkbW9kYWxCdXR0b24iLCIkbW9kYWwiLCIkbG9hZGluZ1NwaW5uZGVyIiwiZGVmYXVsdHMiLCJvcHRpb25zIiwiZXh0ZW5kIiwib24iLCJldmVudCIsInByZXZlbnREZWZhdWx0IiwiZmFkZUluIiwiYWN0aW9uIiwiY29udHJvbGxlciIsIm1lc3NhZ2UiLCJmb3JtRGF0YSIsImNsb3Nlc3QiLCJzZXJpYWxpemUiLCJyZXF1ZXN0IiwiYWpheCIsIm1ldGhvZCIsImRhdGFUeXBlIiwiZG9uZSIsInJlc3BvbnNlIiwiZmFkZU91dCIsInN1Y2Nlc3MiLCJqc2UiLCJsaWJzIiwiaW5mb19ib3giLCJhZGRTdWNjZXNzTWVzc2FnZSIsIm1vZGFsIiwic2hvd01lc3NhZ2UiLCJjb3JlIiwibGFuZyIsInRyYW5zbGF0ZSIsImZhaWwiLCJqcXhociIsInRleHRTdGF0dXMiLCJlcnJvclRocm93biIsImVhY2giLCJtb2RhbENvbnRlbnQiLCJtb2RhbEJvZHkiLCJmaW5kIiwibG9hZCIsImNvbnRlbnQiLCJzdGF0dXMiLCJ4aHIiLCJJU19KU09OIiwianNvbiIsInBhcnNlSlNPTiIsImVyciIsImluaXQiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQUEsR0FBR0MsV0FBSCxDQUFlQyxNQUFmLENBQXNCLHdCQUF0QixFQUFnRCxDQUFDLE9BQUQsQ0FBaEQsRUFFSSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O0FBS0EsUUFBTUMsUUFBUUMsRUFBRSxJQUFGLENBQWQ7O0FBRUE7Ozs7O0FBS0EsUUFBTUMsVUFBVUQsRUFBRSx1QkFBRixDQUFoQjs7QUFFQTs7Ozs7QUFLQSxRQUFNRSxlQUFlRixFQUFFLHNCQUFGLENBQXJC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NEJDLEdBQTVCLEVBQWlDOztBQUVwSSxvQkFBSUMsVUFBVSxJQUFkO0FBQ0Esb0JBQUk7QUFDQSx3QkFBSUMsT0FBT2hELEVBQUVpRCxTQUFGLENBQVkxQixRQUFaLENBQVg7QUFDSCxpQkFGRCxDQUVFLE9BQU8yQixHQUFQLEVBQVk7QUFDVkgsOEJBQVUsS0FBVjtBQUNIOztBQUVELG9CQUFJQSxPQUFKLEVBQWE7QUFDVHJCLHdCQUFJQyxJQUFKLENBQVNHLEtBQVQsQ0FBZUMsV0FBZixDQUEyQkwsSUFBSU0sSUFBSixDQUFTQyxJQUFULENBQWNDLFNBQWQsQ0FBd0IsT0FBeEIsRUFBaUMsVUFBakMsQ0FBM0IsRUFDSWMsS0FBS2xELElBRFQ7QUFFSDtBQUNKLGFBYkQ7QUFjSDtBQUNKLEtBbkJEOztBQXFCQTtBQUNBO0FBQ0E7O0FBRUFELFdBQU9zRCxJQUFQLEdBQWMsVUFBVTdCLElBQVYsRUFBZ0I7QUFDMUJBO0FBQ0gsS0FGRDs7QUFJQSxXQUFPekIsTUFBUDtBQUNILENBakpMIiwiZmlsZSI6Im1vZHVsZV9jZW50ZXIvZ3htb2R1bGVfY29uZmlndXJhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gZ3htb2R1bGVfY29uZmlndXJhdGlvbi5qcyAyMDE4LTAxLTEzXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxOCBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuZ3guY29udHJvbGxlcnMubW9kdWxlKCdneG1vZHVsZV9jb25maWd1cmF0aW9uJywgWydtb2RhbCddLFxuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFUyBERUZJTklUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogU3RhbmRhcmQgYnV0dG9uXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkYnV0dG9uID0gJCgnLkdYTW9kdWxlQ29uZmlnQnV0dG9uJyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEJ1dHRvbiBpbiBtb2RhbCBkaWFsb2dcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICRtb2RhbEJ1dHRvbiA9ICQoJy5HWE1vZHVsZU1vZGFsQnV0dG9uJyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZGFsIGRpYWxvZ1xuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJG1vZGFsID0gJCgnLm1vZGFsJyk7XG5cbiAgICAgICAgY29uc3QgJGxvYWRpbmdTcGlubmRlciA9ICQoJy5sb2FkaW5nLXNwaW5uZXInKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGVmYXVsdCBPcHRpb25zXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBkZWZhdWx0cyA9IHt9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaW5hbCBPcHRpb25zXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIE9iamVjdFxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEVWRU5UIEhBTkRMRVJTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFdmVudCBoYW5kbGluZyBvZiBidXR0b25zXG4gICAgICAgICAqL1xuICAgICAgICAkYnV0dG9uLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICRsb2FkaW5nU3Bpbm5kZXIuZmFkZUluKCk7XG4gICAgICAgICAgICB2YXIgYWN0aW9uID0gJCh0aGlzKS5kYXRhKCdhY3Rpb24nKTtcbiAgICAgICAgICAgIHZhciBjb250cm9sbGVyID0gJCh0aGlzKS5kYXRhKCdjb250cm9sbGVyJyk7XG4gICAgICAgICAgICB2YXIgbWVzc2FnZSA9ICQodGhpcykuZGF0YSgnbWVzc2FnZScpO1xuICAgICAgICAgICAgdmFyIGZvcm1EYXRhID0gJCh0aGlzKS5jbG9zZXN0KCdmb3JtJykuc2VyaWFsaXplKCk7XG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9ICQuYWpheCgnYWRtaW4ucGhwP2RvPUdYTW9kdWxlQ2VudGVyTW9kdWxlQnV0dG9uQWN0aW9uc0FqYXgnLCB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgZGF0YToge2FjdGlvbiwgY29udHJvbGxlciwgZm9ybURhdGF9LFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIlxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZShmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAkbG9hZGluZ1NwaW5uZGVyLmZhZGVPdXQoKTtcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghbWVzc2FnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBqc2UubGlicy5pbmZvX2JveC5hZGRTdWNjZXNzTWVzc2FnZShcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGpzZS5saWJzLm1vZGFsLnNob3dNZXNzYWdlKGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdlcnJvcicsICdtZXNzYWdlcycpLCByZXNwb25zZS5kYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uIChqcXhociwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmxvYWRpbmctc3Bpbm5lcicpLmZhZGVPdXQoKTtcbiAgICAgICAgICAgICAgICAgICAganNlLmxpYnMubW9kYWwuc2hvd01lc3NhZ2UoanNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2Vycm9yJywgJ21lc3NhZ2VzJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvclRocm93bik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFdmVudCBoYW5kbGluZyBvZiBidXR0b25zIGluIG1vZGFsIGRpYWxvZ3NcbiAgICAgICAgICovXG4gICAgICAgICRtb2RhbEJ1dHRvbi5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB2YXIgbW9kYWwgPSAkKHRoaXMpLmRhdGEoJ3RhcmdldCcpO1xuICAgICAgICAgICAgJChtb2RhbCkubW9kYWwoJ3Nob3cnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvYWQgSFRNTCBDb2RlIGZvciBtb2RhbCBkaWFsb2dcbiAgICAgICAgICogb24gZXJyb3Igc2hvdyBtb2RhbCB3aXRoIGVycm9yIG1lc3NhZ2VcbiAgICAgICAgICovXG4gICAgICAgICRtb2RhbC5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBtb2RhbENvbnRlbnQgPSAkKHRoaXMpLmRhdGEoJ2NvbnRlbnQnKTtcbiAgICAgICAgICAgIHZhciBtb2RhbEJvZHkgPSAkKHRoaXMpLmZpbmQoJy5tb2RhbC1ib2R5Jyk7XG4gICAgICAgICAgICBpZiAobW9kYWxDb250ZW50KSB7XG4gICAgICAgICAgICAgICAgJChtb2RhbEJvZHkpLmxvYWQoJ2FkbWluLnBocD9kbz1HWE1vZHVsZUNlbnRlck1vZHVsZUJ1dHRvbkFjdGlvbnNBamF4L01vZGFsJywge2NvbnRlbnQ6IG1vZGFsQ29udGVudH0sIGZ1bmN0aW9uIChyZXNwb25zZSwgc3RhdHVzLCB4aHIpIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgSVNfSlNPTiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIganNvbiA9ICQucGFyc2VKU09OKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBJU19KU09OID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoSVNfSlNPTikge1xuICAgICAgICAgICAgICAgICAgICAgICAganNlLmxpYnMubW9kYWwuc2hvd01lc3NhZ2UoanNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2Vycm9yJywgJ21lc3NhZ2VzJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAganNvbi5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7Il19
