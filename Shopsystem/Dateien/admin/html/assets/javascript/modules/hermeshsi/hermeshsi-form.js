'use strict';

/* --------------------------------------------------------------
   hermeshsi-form.js 2019-11-04
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2019 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

$(function () {
  $('button.hsi-preset').on('click', function (e) {
    e.preventDefault();
    $('#hsi-parcel-height').val(e.target.dataset.height);
    $('#hsi-parcel-width').val(e.target.dataset.width);
    $('#hsi-parcel-depth').val(e.target.dataset.depth);
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhlcm1lc2hzaS1mb3JtLmpzIl0sIm5hbWVzIjpbIiQiLCJvbiIsImUiLCJwcmV2ZW50RGVmYXVsdCIsInZhbCIsInRhcmdldCIsImRhdGFzZXQiLCJoZWlnaHQiLCJ3aWR0aCIsImRlcHRoIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUFBLEVBQUUsWUFBWTtBQUNiQSxJQUFFLG1CQUFGLEVBQXVCQyxFQUF2QixDQUEwQixPQUExQixFQUFtQyxVQUFTQyxDQUFULEVBQVk7QUFDOUNBLE1BQUVDLGNBQUY7QUFDQUgsTUFBRSxvQkFBRixFQUF3QkksR0FBeEIsQ0FBNEJGLEVBQUVHLE1BQUYsQ0FBU0MsT0FBVCxDQUFpQkMsTUFBN0M7QUFDQVAsTUFBRSxtQkFBRixFQUF1QkksR0FBdkIsQ0FBMkJGLEVBQUVHLE1BQUYsQ0FBU0MsT0FBVCxDQUFpQkUsS0FBNUM7QUFDQVIsTUFBRSxtQkFBRixFQUF1QkksR0FBdkIsQ0FBMkJGLEVBQUVHLE1BQUYsQ0FBU0MsT0FBVCxDQUFpQkcsS0FBNUM7QUFDQSxHQUxEO0FBTUEsQ0FQRCIsImZpbGUiOiJoZXJtZXNoc2ktZm9ybS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICBoZXJtZXNoc2ktZm9ybS5qcyAyMDE5LTExLTA0XG4gICBHYW1iaW8gR21iSFxuICAgaHR0cDovL3d3dy5nYW1iaW8uZGVcbiAgIENvcHlyaWdodCAoYykgMjAxOSBHYW1iaW8gR21iSFxuICAgUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gICBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4qL1xuXG4kKGZ1bmN0aW9uICgpIHtcblx0JCgnYnV0dG9uLmhzaS1wcmVzZXQnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdCQoJyNoc2ktcGFyY2VsLWhlaWdodCcpLnZhbChlLnRhcmdldC5kYXRhc2V0LmhlaWdodCk7XG5cdFx0JCgnI2hzaS1wYXJjZWwtd2lkdGgnKS52YWwoZS50YXJnZXQuZGF0YXNldC53aWR0aCk7XG5cdFx0JCgnI2hzaS1wYXJjZWwtZGVwdGgnKS52YWwoZS50YXJnZXQuZGF0YXNldC5kZXB0aCk7XG5cdH0pO1xufSk7XG4iXX0=
