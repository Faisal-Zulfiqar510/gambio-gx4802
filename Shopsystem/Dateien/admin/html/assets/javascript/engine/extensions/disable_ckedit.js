'use strict';

/* --------------------------------------------------------------
 disable_ckedit.js 2016-09-09
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Disable CKEdit
 *
 * Extension to enable or disable (readonly) CKEditors corresponding to a checkbox value.
 *
 * **Important: This widget is not used anymore and will be removed in the future.**
 *
 * @deprecated Since v1.5 will be removed in v1.7
 *
 * @module Admin/Extensions/disable_ckedit
 * @ignore
 */
gx.extensions.module('disable_ckedit', [], function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLE INITIALIZATION
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
        'invert': false // if true, the checkbox has to be deselected to enable the ckeditor
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
     * Interval
     *
     * @type {number}
     */
    interval = null;

    // ------------------------------------------------------------------------
    // EVENT HANDLER
    // ------------------------------------------------------------------------

    /**
     * Switch CKEdit
     *
     * Function to detect if a CKEdit is bound to the target text field. If so,
     * set the readonly state of the box corresponding to the checkbox value.
     */
    var _switchCkEdit = function _switchCkEdit() {
        if (window.CKEDITOR && CKEDITOR.instances && CKEDITOR.instances[options.target]) {

            if (interval) {
                clearInterval(interval);
            }

            var checked = $this.prop('checked');
            checked = options.invert ? !checked : checked;
            try {
                CKEDITOR.instances[options.target].setReadOnly(!checked);
            } catch (err) {
                interval = setInterval(function () {
                    CKEDITOR.instances[options.target].setReadOnly(!checked);
                    clearInterval(interval);
                }, 100);
            }
        }
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    /**
     * Initialize function of the extension, called by the engine.
     */
    module.init = function (done) {
        $this.on('change', _switchCkEdit);
        _switchCkEdit();
        done();
    };

    // Return data to module engine.
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRpc2FibGVfY2tlZGl0LmpzIl0sIm5hbWVzIjpbImd4IiwiZXh0ZW5zaW9ucyIsIm1vZHVsZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJkZWZhdWx0cyIsIm9wdGlvbnMiLCJleHRlbmQiLCJpbnRlcnZhbCIsIl9zd2l0Y2hDa0VkaXQiLCJ3aW5kb3ciLCJDS0VESVRPUiIsImluc3RhbmNlcyIsInRhcmdldCIsImNsZWFySW50ZXJ2YWwiLCJjaGVja2VkIiwicHJvcCIsImludmVydCIsInNldFJlYWRPbmx5IiwiZXJyIiwic2V0SW50ZXJ2YWwiLCJpbml0IiwiZG9uZSIsIm9uIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7OztBQVlBQSxHQUFHQyxVQUFILENBQWNDLE1BQWQsQ0FDSSxnQkFESixFQUdJLEVBSEosRUFLSSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJOzs7OztBQUtBQyxZQUFRQyxFQUFFLElBQUYsQ0FOWjs7O0FBUUk7Ozs7O0FBS0FDLGVBQVc7QUFDUCxrQkFBVSxLQURILENBQ1M7QUFEVCxLQWJmOzs7QUFpQkk7Ozs7O0FBS0FDLGNBQVVGLEVBQUVHLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQkYsUUFBbkIsRUFBNkJILElBQTdCLENBdEJkOzs7QUF3Qkk7Ozs7O0FBS0FELGFBQVMsRUE3QmI7OztBQStCSTs7Ozs7QUFLQU8sZUFBVyxJQXBDZjs7QUFzQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7QUFNQSxRQUFJQyxnQkFBZ0IsU0FBaEJBLGFBQWdCLEdBQVk7QUFDNUIsWUFBSUMsT0FBT0MsUUFBUCxJQUFtQkEsU0FBU0MsU0FBNUIsSUFBeUNELFNBQVNDLFNBQVQsQ0FBbUJOLFFBQVFPLE1BQTNCLENBQTdDLEVBQWlGOztBQUU3RSxnQkFBSUwsUUFBSixFQUFjO0FBQ1ZNLDhCQUFjTixRQUFkO0FBQ0g7O0FBRUQsZ0JBQUlPLFVBQVVaLE1BQU1hLElBQU4sQ0FBVyxTQUFYLENBQWQ7QUFDQUQsc0JBQVdULFFBQVFXLE1BQVQsR0FBbUIsQ0FBQ0YsT0FBcEIsR0FBOEJBLE9BQXhDO0FBQ0EsZ0JBQUk7QUFDQUoseUJBQVNDLFNBQVQsQ0FBbUJOLFFBQVFPLE1BQTNCLEVBQW1DSyxXQUFuQyxDQUErQyxDQUFDSCxPQUFoRDtBQUNILGFBRkQsQ0FFRSxPQUFPSSxHQUFQLEVBQVk7QUFDVlgsMkJBQVdZLFlBQVksWUFBWTtBQUMvQlQsNkJBQVNDLFNBQVQsQ0FBbUJOLFFBQVFPLE1BQTNCLEVBQW1DSyxXQUFuQyxDQUErQyxDQUFDSCxPQUFoRDtBQUNBRCxrQ0FBY04sUUFBZDtBQUNILGlCQUhVLEVBR1IsR0FIUSxDQUFYO0FBSUg7QUFFSjtBQUNKLEtBbkJEOztBQXFCQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBUCxXQUFPb0IsSUFBUCxHQUFjLFVBQVVDLElBQVYsRUFBZ0I7QUFDMUJuQixjQUFNb0IsRUFBTixDQUFTLFFBQVQsRUFBbUJkLGFBQW5CO0FBQ0FBO0FBQ0FhO0FBQ0gsS0FKRDs7QUFNQTtBQUNBLFdBQU9yQixNQUFQO0FBRUgsQ0FsR0wiLCJmaWxlIjoiZGlzYWJsZV9ja2VkaXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGRpc2FibGVfY2tlZGl0LmpzIDIwMTYtMDktMDlcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqICMjIERpc2FibGUgQ0tFZGl0XG4gKlxuICogRXh0ZW5zaW9uIHRvIGVuYWJsZSBvciBkaXNhYmxlIChyZWFkb25seSkgQ0tFZGl0b3JzIGNvcnJlc3BvbmRpbmcgdG8gYSBjaGVja2JveCB2YWx1ZS5cbiAqXG4gKiAqKkltcG9ydGFudDogVGhpcyB3aWRnZXQgaXMgbm90IHVzZWQgYW55bW9yZSBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBmdXR1cmUuKipcbiAqXG4gKiBAZGVwcmVjYXRlZCBTaW5jZSB2MS41IHdpbGwgYmUgcmVtb3ZlZCBpbiB2MS43XG4gKlxuICogQG1vZHVsZSBBZG1pbi9FeHRlbnNpb25zL2Rpc2FibGVfY2tlZGl0XG4gKiBAaWdub3JlXG4gKi9cbmd4LmV4dGVuc2lvbnMubW9kdWxlKFxuICAgICdkaXNhYmxlX2NrZWRpdCcsXG5cbiAgICBbXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRSBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXJcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRXh0ZW5zaW9uIFJlZmVyZW5jZVxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBEZWZhdWx0IE9wdGlvbnMgZm9yIEV4dGVuc2lvblxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgICAgICdpbnZlcnQnOiBmYWxzZSAvLyBpZiB0cnVlLCB0aGUgY2hlY2tib3ggaGFzIHRvIGJlIGRlc2VsZWN0ZWQgdG8gZW5hYmxlIHRoZSBja2VkaXRvclxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBGaW5hbCBFeHRlbnNpb24gT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBPYmplY3RcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtb2R1bGUgPSB7fSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBJbnRlcnZhbFxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGludGVydmFsID0gbnVsbDtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gRVZFTlQgSEFORExFUlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU3dpdGNoIENLRWRpdFxuICAgICAgICAgKlxuICAgICAgICAgKiBGdW5jdGlvbiB0byBkZXRlY3QgaWYgYSBDS0VkaXQgaXMgYm91bmQgdG8gdGhlIHRhcmdldCB0ZXh0IGZpZWxkLiBJZiBzbyxcbiAgICAgICAgICogc2V0IHRoZSByZWFkb25seSBzdGF0ZSBvZiB0aGUgYm94IGNvcnJlc3BvbmRpbmcgdG8gdGhlIGNoZWNrYm94IHZhbHVlLlxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9zd2l0Y2hDa0VkaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAod2luZG93LkNLRURJVE9SICYmIENLRURJVE9SLmluc3RhbmNlcyAmJiBDS0VESVRPUi5pbnN0YW5jZXNbb3B0aW9ucy50YXJnZXRdKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoaW50ZXJ2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGNoZWNrZWQgPSAkdGhpcy5wcm9wKCdjaGVja2VkJyk7XG4gICAgICAgICAgICAgICAgY2hlY2tlZCA9IChvcHRpb25zLmludmVydCkgPyAhY2hlY2tlZCA6IGNoZWNrZWQ7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgQ0tFRElUT1IuaW5zdGFuY2VzW29wdGlvbnMudGFyZ2V0XS5zZXRSZWFkT25seSghY2hlY2tlZCk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgQ0tFRElUT1IuaW5zdGFuY2VzW29wdGlvbnMudGFyZ2V0XS5zZXRSZWFkT25seSghY2hlY2tlZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluaXRpYWxpemUgZnVuY3Rpb24gb2YgdGhlIGV4dGVuc2lvbiwgY2FsbGVkIGJ5IHRoZSBlbmdpbmUuXG4gICAgICAgICAqL1xuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICAkdGhpcy5vbignY2hhbmdlJywgX3N3aXRjaENrRWRpdCk7XG4gICAgICAgICAgICBfc3dpdGNoQ2tFZGl0KCk7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gUmV0dXJuIGRhdGEgdG8gbW9kdWxlIGVuZ2luZS5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcblxuICAgIH0pO1xuIl19
