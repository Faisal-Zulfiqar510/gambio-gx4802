'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* --------------------------------------------------------------
 orders_edit_address_save_button.js 2019-05-09
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2019 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

$(function () {

	'use strict';

	$(document).ready(function () {

		// the button in the bottom save bar
		var edit_action_address = document.getElementById('edit_action_address');

		if (edit_action_address !== null) {

			edit_action_address.addEventListener('click', function (event) {

				var address_edit_form = document.getElementsByName('adress_edit');

				if (address_edit_form !== null && _typeof(address_edit_form[0]) === 'object') {

					// address_edit_form is a NodeList
					address_edit_form[0].submit();

					event.preventDefault();
					event.stopPropagation();
					return false;
				}
			});
		}
	});
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yZGVyc19lZGl0X2FkZHJlc3Nfc2F2ZV9idXR0b24uanMiXSwibmFtZXMiOlsiJCIsImRvY3VtZW50IiwicmVhZHkiLCJlZGl0X2FjdGlvbl9hZGRyZXNzIiwiZ2V0RWxlbWVudEJ5SWQiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJhZGRyZXNzX2VkaXRfZm9ybSIsImdldEVsZW1lbnRzQnlOYW1lIiwic3VibWl0IiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7Ozs7Ozs7OztBQVVBQSxFQUFFLFlBQVc7O0FBRVo7O0FBRUFBLEdBQUVDLFFBQUYsRUFBWUMsS0FBWixDQUFrQixZQUFXOztBQUU1QjtBQUNBLE1BQUlDLHNCQUFzQkYsU0FBU0csY0FBVCxDQUF3QixxQkFBeEIsQ0FBMUI7O0FBRUEsTUFBSUQsd0JBQXdCLElBQTVCLEVBQWtDOztBQUVqQ0EsdUJBQW9CRSxnQkFBcEIsQ0FBcUMsT0FBckMsRUFBOEMsVUFBU0MsS0FBVCxFQUFnQjs7QUFFN0QsUUFBSUMsb0JBQW9CTixTQUFTTyxpQkFBVCxDQUEyQixhQUEzQixDQUF4Qjs7QUFFQSxRQUFHRCxzQkFBc0IsSUFBdEIsSUFBOEIsUUFBT0Esa0JBQWtCLENBQWxCLENBQVAsTUFBZ0MsUUFBakUsRUFBMEU7O0FBRXpFO0FBQ0FBLHVCQUFrQixDQUFsQixFQUFxQkUsTUFBckI7O0FBRUFILFdBQU1JLGNBQU47QUFDQUosV0FBTUssZUFBTjtBQUNBLFlBQU8sS0FBUDtBQUNBO0FBRUQsSUFkRDtBQWVBO0FBQ0QsRUF2QkQ7QUF3QkEsQ0E1QkQiLCJmaWxlIjoib3JkZXJzX2VkaXRfYWRkcmVzc19zYXZlX2J1dHRvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gb3JkZXJzX2VkaXRfYWRkcmVzc19zYXZlX2J1dHRvbi5qcyAyMDE5LTA1LTA5XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxOSBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuJChmdW5jdGlvbigpIHtcblx0XG5cdCd1c2Ugc3RyaWN0Jztcblx0XG5cdCQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuXHRcdFxuXHRcdC8vIHRoZSBidXR0b24gaW4gdGhlIGJvdHRvbSBzYXZlIGJhclxuXHRcdGxldCBlZGl0X2FjdGlvbl9hZGRyZXNzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VkaXRfYWN0aW9uX2FkZHJlc3MnKTtcblx0XHRcblx0XHRpZiAoZWRpdF9hY3Rpb25fYWRkcmVzcyAhPT0gbnVsbCkge1xuXHRcdFx0XG5cdFx0XHRlZGl0X2FjdGlvbl9hZGRyZXNzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdFx0XG5cdFx0XHRcdGxldCBhZGRyZXNzX2VkaXRfZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCdhZHJlc3NfZWRpdCcpO1xuXHRcdFx0XHRcblx0XHRcdFx0aWYoYWRkcmVzc19lZGl0X2Zvcm0gIT09IG51bGwgJiYgdHlwZW9mIGFkZHJlc3NfZWRpdF9mb3JtWzBdID09PSAnb2JqZWN0Jyl7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Ly8gYWRkcmVzc19lZGl0X2Zvcm0gaXMgYSBOb2RlTGlzdFxuXHRcdFx0XHRcdGFkZHJlc3NfZWRpdF9mb3JtWzBdLnN1Ym1pdCgpO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcbn0pOyJdfQ==
