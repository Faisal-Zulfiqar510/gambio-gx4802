'use strict';

/* --------------------------------------------------------------
  comma_to_dot.js 2019-06-19
  Gambio GmbH
  http://www.gambio.de
  Copyright (c) 2019 Gambio GmbH
  Released under the GNU General Public License (Version 2)
  [http://www.gnu.org/licenses/gpl-2.0.html]
  --------------------------------------------------------------*/

var numericRegularExpression = /^[0-9,.]+$/,
    commaRegularExpression = /,/g;

var addReplaceCommaToDotListener = function addReplaceCommaToDotListener() {

	var $formInputs = $('form[name="product_edit"] input[type="text"]');

	$formInputs.each(function () {
		this.addEventListener('keyup', replaceCommaToDot);
	});
},
    replaceCommaToDot = function replaceCommaToDot() {

	var content = $(this).val();

	if (content.match(numericRegularExpression) !== null && content.match(commaRegularExpression) !== null) {

		content = content.replace(commaRegularExpression, '.');

		$(this).val(content);
	}
};

if (document.readyState === "loading") {
	document.addEventListener('DOMContentLoaded', addReplaceCommaToDotListener);
} else {
	addReplaceCommaToDotListener();
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1hX3RvX2RvdC5qcyJdLCJuYW1lcyI6WyJudW1lcmljUmVndWxhckV4cHJlc3Npb24iLCJjb21tYVJlZ3VsYXJFeHByZXNzaW9uIiwiYWRkUmVwbGFjZUNvbW1hVG9Eb3RMaXN0ZW5lciIsIiRmb3JtSW5wdXRzIiwiJCIsImVhY2giLCJhZGRFdmVudExpc3RlbmVyIiwicmVwbGFjZUNvbW1hVG9Eb3QiLCJjb250ZW50IiwidmFsIiwibWF0Y2giLCJyZXBsYWNlIiwiZG9jdW1lbnQiLCJyZWFkeVN0YXRlIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7QUFTQSxJQUFJQSwyQkFBMkIsWUFBL0I7QUFBQSxJQUNDQyx5QkFBeUIsSUFEMUI7O0FBR0EsSUFBSUMsK0JBQStCLFNBQS9CQSw0QkFBK0IsR0FBVzs7QUFFNUMsS0FBSUMsY0FBY0MsRUFBRSw4Q0FBRixDQUFsQjs7QUFFQUQsYUFBWUUsSUFBWixDQUFpQixZQUFXO0FBQzNCLE9BQUtDLGdCQUFMLENBQXNCLE9BQXRCLEVBQStCQyxpQkFBL0I7QUFDQSxFQUZEO0FBR0EsQ0FQRjtBQUFBLElBUUNBLG9CQUFvQixTQUFwQkEsaUJBQW9CLEdBQVc7O0FBRTlCLEtBQUlDLFVBQVVKLEVBQUUsSUFBRixFQUFRSyxHQUFSLEVBQWQ7O0FBRUEsS0FBSUQsUUFBUUUsS0FBUixDQUFjVix3QkFBZCxNQUE0QyxJQUE1QyxJQUFvRFEsUUFBUUUsS0FBUixDQUFjVCxzQkFBZCxNQUEwQyxJQUFsRyxFQUF3Rzs7QUFFdkdPLFlBQVVBLFFBQVFHLE9BQVIsQ0FBZ0JWLHNCQUFoQixFQUF3QyxHQUF4QyxDQUFWOztBQUVBRyxJQUFFLElBQUYsRUFBUUssR0FBUixDQUFZRCxPQUFaO0FBQ0E7QUFDRCxDQWxCRjs7QUFvQkEsSUFBSUksU0FBU0MsVUFBVCxLQUF3QixTQUE1QixFQUF1QztBQUN0Q0QsVUFBU04sZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDSiw0QkFBOUM7QUFDQSxDQUZELE1BRU87QUFDTkE7QUFDQSIsImZpbGUiOiJjb21tYV90b19kb3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBjb21tYV90b19kb3QuanMgMjAxOS0wNi0xOVxuICBHYW1iaW8gR21iSFxuICBodHRwOi8vd3d3LmdhbWJpby5kZVxuICBDb3B5cmlnaHQgKGMpIDIwMTkgR2FtYmlvIEdtYkhcbiAgUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbmxldCBudW1lcmljUmVndWxhckV4cHJlc3Npb24gPSAvXlswLTksLl0rJC8sXG5cdGNvbW1hUmVndWxhckV4cHJlc3Npb24gPSAvLC9nO1xuXG5sZXQgYWRkUmVwbGFjZUNvbW1hVG9Eb3RMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuXHRcdFxuXHRcdGxldCAkZm9ybUlucHV0cyA9ICQoJ2Zvcm1bbmFtZT1cInByb2R1Y3RfZWRpdFwiXSBpbnB1dFt0eXBlPVwidGV4dFwiXScpO1xuXHRcdFxuXHRcdCRmb3JtSW5wdXRzLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgcmVwbGFjZUNvbW1hVG9Eb3QpO1xuXHRcdH0pO1xuXHR9LFxuXHRyZXBsYWNlQ29tbWFUb0RvdCA9IGZ1bmN0aW9uKCkge1xuXHRcdFxuXHRcdGxldCBjb250ZW50ID0gJCh0aGlzKS52YWwoKTtcblx0XHRcblx0XHRpZiAoY29udGVudC5tYXRjaChudW1lcmljUmVndWxhckV4cHJlc3Npb24pICE9PSBudWxsICYmIGNvbnRlbnQubWF0Y2goY29tbWFSZWd1bGFyRXhwcmVzc2lvbikgIT09IG51bGwpIHtcblx0XHRcdFxuXHRcdFx0Y29udGVudCA9IGNvbnRlbnQucmVwbGFjZShjb21tYVJlZ3VsYXJFeHByZXNzaW9uLCAnLicpO1xuXHRcdFx0XG5cdFx0XHQkKHRoaXMpLnZhbChjb250ZW50KTtcblx0XHR9XG5cdH07XG5cbmlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImxvYWRpbmdcIikge1xuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgYWRkUmVwbGFjZUNvbW1hVG9Eb3RMaXN0ZW5lcik7XG59IGVsc2Uge1xuXHRhZGRSZXBsYWNlQ29tbWFUb0RvdExpc3RlbmVyKCk7XG59Il19
