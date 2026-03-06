'use strict';

/* --------------------------------------------------------------
 datatable_normalize_overflow.js 2016-06-09
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Normalize DataTable Text Overflow
 *
 * This extension works in cooperation with the _tables.scss file which will set the default styling of `tbody`
 * `td` elements to overflow: hidden and text-overflow: ellipsis. This can produce problems with `td` elements
 * that contain an `i` tag, by cutting the icon image in the middle. This module will reset the default styling of
 * _tables.scss for those columns.
 *
 * @module Admin/Extensions/datatable_normalize_overflow
 */
gx.extensions.module('datatable_normalize_overflow', [], function (data) {

  'use strict';

  // ------------------------------------------------------------------------
  // VARIABLES
  // ------------------------------------------------------------------------

  /**
   * Module Selector
   *
   * @type {jQuery}
   */

  var $this = $(this);

  /**
   * Module Instance
   *
   * @type {Object}
   */
  var module = {};

  // ------------------------------------------------------------------------
  // FUNCTIONS
  // ------------------------------------------------------------------------

  /**
   * Normalize the overflow of the table cells that contain an icon.
   */
  function _normalizeOverflow() {
    $this.find('tbody i').each(function (index, icon) {
      $(icon).parents('td').css({
        overflow: 'initial'
      });
    });
  }

  // ------------------------------------------------------------------------
  // INITIALIZATION
  // ------------------------------------------------------------------------

  module.init = function (done) {
    $this.on('draw.dt', _normalizeOverflow);
    done();
  };

  return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhdGF0YWJsZV9ub3JtYWxpemVfb3ZlcmZsb3cuanMiXSwibmFtZXMiOlsiZ3giLCJleHRlbnNpb25zIiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsIl9ub3JtYWxpemVPdmVyZmxvdyIsImZpbmQiLCJlYWNoIiwiaW5kZXgiLCJpY29uIiwicGFyZW50cyIsImNzcyIsIm92ZXJmbG93IiwiaW5pdCIsImRvbmUiLCJvbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7O0FBVUFBLEdBQUdDLFVBQUgsQ0FBY0MsTUFBZCxDQUFxQiw4QkFBckIsRUFBcUQsRUFBckQsRUFBeUQsVUFBVUMsSUFBVixFQUFnQjs7QUFFckU7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7QUFLQSxNQUFNQyxRQUFRQyxFQUFFLElBQUYsQ0FBZDs7QUFFQTs7Ozs7QUFLQSxNQUFNSCxTQUFTLEVBQWY7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7QUFHQSxXQUFTSSxrQkFBVCxHQUE4QjtBQUMxQkYsVUFBTUcsSUFBTixDQUFXLFNBQVgsRUFBc0JDLElBQXRCLENBQTJCLFVBQUNDLEtBQUQsRUFBUUMsSUFBUixFQUFpQjtBQUN4Q0wsUUFBRUssSUFBRixFQUFRQyxPQUFSLENBQWdCLElBQWhCLEVBQXNCQyxHQUF0QixDQUEwQjtBQUN0QkMsa0JBQVU7QUFEWSxPQUExQjtBQUdILEtBSkQ7QUFLSDs7QUFFRDtBQUNBO0FBQ0E7O0FBRUFYLFNBQU9ZLElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCO0FBQzFCWCxVQUFNWSxFQUFOLENBQVMsU0FBVCxFQUFvQlYsa0JBQXBCO0FBQ0FTO0FBQ0gsR0FIRDs7QUFLQSxTQUFPYixNQUFQO0FBRUgsQ0FoREQiLCJmaWxlIjoiZGF0YXRhYmxlX25vcm1hbGl6ZV9vdmVyZmxvdy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gZGF0YXRhYmxlX25vcm1hbGl6ZV9vdmVyZmxvdy5qcyAyMDE2LTA2LTA5XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNiBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBOb3JtYWxpemUgRGF0YVRhYmxlIFRleHQgT3ZlcmZsb3dcbiAqXG4gKiBUaGlzIGV4dGVuc2lvbiB3b3JrcyBpbiBjb29wZXJhdGlvbiB3aXRoIHRoZSBfdGFibGVzLnNjc3MgZmlsZSB3aGljaCB3aWxsIHNldCB0aGUgZGVmYXVsdCBzdHlsaW5nIG9mIGB0Ym9keWBcbiAqIGB0ZGAgZWxlbWVudHMgdG8gb3ZlcmZsb3c6IGhpZGRlbiBhbmQgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXMuIFRoaXMgY2FuIHByb2R1Y2UgcHJvYmxlbXMgd2l0aCBgdGRgIGVsZW1lbnRzXG4gKiB0aGF0IGNvbnRhaW4gYW4gYGlgIHRhZywgYnkgY3V0dGluZyB0aGUgaWNvbiBpbWFnZSBpbiB0aGUgbWlkZGxlLiBUaGlzIG1vZHVsZSB3aWxsIHJlc2V0IHRoZSBkZWZhdWx0IHN0eWxpbmcgb2ZcbiAqIF90YWJsZXMuc2NzcyBmb3IgdGhvc2UgY29sdW1ucy5cbiAqXG4gKiBAbW9kdWxlIEFkbWluL0V4dGVuc2lvbnMvZGF0YXRhYmxlX25vcm1hbGl6ZV9vdmVyZmxvd1xuICovXG5neC5leHRlbnNpb25zLm1vZHVsZSgnZGF0YXRhYmxlX25vcm1hbGl6ZV9vdmVyZmxvdycsIFtdLCBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gVkFSSUFCTEVTXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAvKipcbiAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgKlxuICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICovXG4gICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgLyoqXG4gICAgICogTW9kdWxlIEluc3RhbmNlXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIGNvbnN0IG1vZHVsZSA9IHt9O1xuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRlVOQ1RJT05TXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAvKipcbiAgICAgKiBOb3JtYWxpemUgdGhlIG92ZXJmbG93IG9mIHRoZSB0YWJsZSBjZWxscyB0aGF0IGNvbnRhaW4gYW4gaWNvbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfbm9ybWFsaXplT3ZlcmZsb3coKSB7XG4gICAgICAgICR0aGlzLmZpbmQoJ3Rib2R5IGknKS5lYWNoKChpbmRleCwgaWNvbikgPT4ge1xuICAgICAgICAgICAgJChpY29uKS5wYXJlbnRzKCd0ZCcpLmNzcyh7XG4gICAgICAgICAgICAgICAgb3ZlcmZsb3c6ICdpbml0aWFsJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICR0aGlzLm9uKCdkcmF3LmR0JywgX25vcm1hbGl6ZU92ZXJmbG93KTtcbiAgICAgICAgZG9uZSgpO1xuICAgIH07XG5cbiAgICByZXR1cm4gbW9kdWxlO1xuXG59KTsiXX0=
