'use strict';

/* --------------------------------------------------------------
 categories_goto_controller.js 2015-09-29 gm
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2015 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Categories Overview Goto
 *
 * @module Compatibility/categories_goto_controller
 */
gx.compatibility.module(
// Module name
'categories_goto_controller',

// Module dependencies
[],

/**  @lends module:Compatibility/categories_goto_controller */

function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES DEFINITION
    // ------------------------------------------------------------------------

    // Element: Module selector

    var $this = $(this);

    // Meta object
    var module = {};

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    var _createForm = function _createForm() {
        var $form = $('<form>');

        $form.attr({
            name: data.name,
            action: data.action,
            method: 'get'
        });

        return $form;
    };

    var _initialize = function _initialize() {
        // Create new form
        var $form = _createForm();

        // Save HTML content
        var html = $this.html();

        // Insert HTML into form and put form into this element
        $form.html(html);

        $this.empty().append($form);
    };

    module.init = function (done) {
        // Initialize
        _initialize();

        // Register as finished
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhdGVnb3JpZXMvY2F0ZWdvcmllc19nb3RvX2NvbnRyb2xsZXIuanMiXSwibmFtZXMiOlsiZ3giLCJjb21wYXRpYmlsaXR5IiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsIl9jcmVhdGVGb3JtIiwiJGZvcm0iLCJhdHRyIiwibmFtZSIsImFjdGlvbiIsIm1ldGhvZCIsIl9pbml0aWFsaXplIiwiaHRtbCIsImVtcHR5IiwiYXBwZW5kIiwiaW5pdCIsImRvbmUiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7QUFLQUEsR0FBR0MsYUFBSCxDQUFpQkMsTUFBakI7QUFDSTtBQUNBLDRCQUZKOztBQUlJO0FBQ0EsRUFMSjs7QUFPSTs7QUFFQSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFDQSxRQUFJQyxRQUFRQyxFQUFFLElBQUYsQ0FBWjs7QUFFQTtBQUNBLFFBQUlILFNBQVMsRUFBYjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsUUFBSUksY0FBYyxTQUFkQSxXQUFjLEdBQVk7QUFDMUIsWUFBSUMsUUFBUUYsRUFBRSxRQUFGLENBQVo7O0FBRUFFLGNBQU1DLElBQU4sQ0FBVztBQUNQQyxrQkFBTU4sS0FBS00sSUFESjtBQUVQQyxvQkFBUVAsS0FBS08sTUFGTjtBQUdQQyxvQkFBUTtBQUhELFNBQVg7O0FBTUEsZUFBT0osS0FBUDtBQUNILEtBVkQ7O0FBWUEsUUFBSUssY0FBYyxTQUFkQSxXQUFjLEdBQVk7QUFDMUI7QUFDQSxZQUFJTCxRQUFRRCxhQUFaOztBQUVBO0FBQ0EsWUFBSU8sT0FBT1QsTUFBTVMsSUFBTixFQUFYOztBQUVBO0FBQ0FOLGNBQU1NLElBQU4sQ0FBV0EsSUFBWDs7QUFFQVQsY0FDS1UsS0FETCxHQUVLQyxNQUZMLENBRVlSLEtBRlo7QUFHSCxLQWJEOztBQWVBTCxXQUFPYyxJQUFQLEdBQWMsVUFBVUMsSUFBVixFQUFnQjtBQUMxQjtBQUNBTDs7QUFFQTtBQUNBSztBQUNILEtBTkQ7O0FBUUEsV0FBT2YsTUFBUDtBQUNILENBL0RMIiwiZmlsZSI6ImNhdGVnb3JpZXMvY2F0ZWdvcmllc19nb3RvX2NvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGNhdGVnb3JpZXNfZ290b19jb250cm9sbGVyLmpzIDIwMTUtMDktMjkgZ21cbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE1IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqICMjIENhdGVnb3JpZXMgT3ZlcnZpZXcgR290b1xuICpcbiAqIEBtb2R1bGUgQ29tcGF0aWJpbGl0eS9jYXRlZ29yaWVzX2dvdG9fY29udHJvbGxlclxuICovXG5neC5jb21wYXRpYmlsaXR5Lm1vZHVsZShcbiAgICAvLyBNb2R1bGUgbmFtZVxuICAgICdjYXRlZ29yaWVzX2dvdG9fY29udHJvbGxlcicsXG5cbiAgICAvLyBNb2R1bGUgZGVwZW5kZW5jaWVzXG4gICAgW10sXG5cbiAgICAvKiogIEBsZW5kcyBtb2R1bGU6Q29tcGF0aWJpbGl0eS9jYXRlZ29yaWVzX2dvdG9fY29udHJvbGxlciAqL1xuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFUyBERUZJTklUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8vIEVsZW1lbnQ6IE1vZHVsZSBzZWxlY3RvclxuICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgIC8vIE1ldGEgb2JqZWN0XG4gICAgICAgIHZhciBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyIF9jcmVhdGVGb3JtID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyICRmb3JtID0gJCgnPGZvcm0+Jyk7XG5cbiAgICAgICAgICAgICRmb3JtLmF0dHIoe1xuICAgICAgICAgICAgICAgIG5hbWU6IGRhdGEubmFtZSxcbiAgICAgICAgICAgICAgICBhY3Rpb246IGRhdGEuYWN0aW9uLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ2dldCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gJGZvcm07XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIF9pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gQ3JlYXRlIG5ldyBmb3JtXG4gICAgICAgICAgICB2YXIgJGZvcm0gPSBfY3JlYXRlRm9ybSgpO1xuXG4gICAgICAgICAgICAvLyBTYXZlIEhUTUwgY29udGVudFxuICAgICAgICAgICAgdmFyIGh0bWwgPSAkdGhpcy5odG1sKCk7XG5cbiAgICAgICAgICAgIC8vIEluc2VydCBIVE1MIGludG8gZm9ybSBhbmQgcHV0IGZvcm0gaW50byB0aGlzIGVsZW1lbnRcbiAgICAgICAgICAgICRmb3JtLmh0bWwoaHRtbCk7XG5cbiAgICAgICAgICAgICR0aGlzXG4gICAgICAgICAgICAgICAgLmVtcHR5KClcbiAgICAgICAgICAgICAgICAuYXBwZW5kKCRmb3JtKTtcbiAgICAgICAgfTtcblxuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICAvLyBJbml0aWFsaXplXG4gICAgICAgICAgICBfaW5pdGlhbGl6ZSgpO1xuXG4gICAgICAgICAgICAvLyBSZWdpc3RlciBhcyBmaW5pc2hlZFxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7XG4iXX0=
