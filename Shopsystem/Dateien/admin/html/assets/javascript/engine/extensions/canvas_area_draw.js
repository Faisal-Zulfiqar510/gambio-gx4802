"use strict";

/* --------------------------------------------------------------
 canvas_area_draw.js 2016-10-27
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Canvas image map area draw plugin extension.
 *
 * Extension to initialize the jQuery plugin 'jquery-canvas-area-draw'.
 *
 * Options:
 *      - image-url {String} URL to image.
 *      - coordinates {String} Comma-separated coordinate values (optional).
 *
 * Events:
 *      - 'reset' to delete shape.
 *
 * @module Admin/Extensions/canvas_area_draw
 */
gx.extensions.module('canvas_area_draw', [], function (data) {
    "use strict";

    // Module element, which represents a form.

    var $this = $(this);

    // Module options.
    var options = $.extend(true, {}, data);

    // Module object.
    var module = {};

    // Module initialize function.
    module.init = function (done) {
        $this.canvasAreaDraw(options);
        done();
    };

    // Return data to module engine.
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhbnZhc19hcmVhX2RyYXcuanMiXSwibmFtZXMiOlsiZ3giLCJleHRlbnNpb25zIiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsIm9wdGlvbnMiLCJleHRlbmQiLCJpbml0IiwiY2FudmFzQXJlYURyYXciLCJkb25lIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7Ozs7O0FBY0FBLEdBQUdDLFVBQUgsQ0FBY0MsTUFBZCxDQUNJLGtCQURKLEVBR0ksRUFISixFQUtJLFVBQVVDLElBQVYsRUFBZ0I7QUFDWjs7QUFFQTs7QUFDQSxRQUFNQyxRQUFRQyxFQUFFLElBQUYsQ0FBZDs7QUFFQTtBQUNBLFFBQU1DLFVBQVVELEVBQUVFLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQkosSUFBbkIsQ0FBaEI7O0FBRUE7QUFDQSxRQUFNRCxTQUFTLEVBQWY7O0FBRUE7QUFDQUEsV0FBT00sSUFBUCxHQUFjLGdCQUFRO0FBQ2xCSixjQUFNSyxjQUFOLENBQXFCSCxPQUFyQjtBQUNBSTtBQUNILEtBSEQ7O0FBS0E7QUFDQSxXQUFPUixNQUFQO0FBQ0gsQ0F6QkwiLCJmaWxlIjoiY2FudmFzX2FyZWFfZHJhdy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gY2FudmFzX2FyZWFfZHJhdy5qcyAyMDE2LTEwLTI3XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNiBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiBDYW52YXMgaW1hZ2UgbWFwIGFyZWEgZHJhdyBwbHVnaW4gZXh0ZW5zaW9uLlxuICpcbiAqIEV4dGVuc2lvbiB0byBpbml0aWFsaXplIHRoZSBqUXVlcnkgcGx1Z2luICdqcXVlcnktY2FudmFzLWFyZWEtZHJhdycuXG4gKlxuICogT3B0aW9uczpcbiAqICAgICAgLSBpbWFnZS11cmwge1N0cmluZ30gVVJMIHRvIGltYWdlLlxuICogICAgICAtIGNvb3JkaW5hdGVzIHtTdHJpbmd9IENvbW1hLXNlcGFyYXRlZCBjb29yZGluYXRlIHZhbHVlcyAob3B0aW9uYWwpLlxuICpcbiAqIEV2ZW50czpcbiAqICAgICAgLSAncmVzZXQnIHRvIGRlbGV0ZSBzaGFwZS5cbiAqXG4gKiBAbW9kdWxlIEFkbWluL0V4dGVuc2lvbnMvY2FudmFzX2FyZWFfZHJhd1xuICovXG5neC5leHRlbnNpb25zLm1vZHVsZShcbiAgICAnY2FudmFzX2FyZWFfZHJhdycsXG5cbiAgICBbXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgICAgIC8vIE1vZHVsZSBlbGVtZW50LCB3aGljaCByZXByZXNlbnRzIGEgZm9ybS5cbiAgICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgIC8vIE1vZHVsZSBvcHRpb25zLlxuICAgICAgICBjb25zdCBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRhdGEpO1xuXG4gICAgICAgIC8vIE1vZHVsZSBvYmplY3QuXG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIE1vZHVsZSBpbml0aWFsaXplIGZ1bmN0aW9uLlxuICAgICAgICBtb2R1bGUuaW5pdCA9IGRvbmUgPT4ge1xuICAgICAgICAgICAgJHRoaXMuY2FudmFzQXJlYURyYXcob3B0aW9ucyk7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gUmV0dXJuIGRhdGEgdG8gbW9kdWxlIGVuZ2luZS5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9XG4pOyJdfQ==
