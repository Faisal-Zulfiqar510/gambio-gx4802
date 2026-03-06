'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* --------------------------------------------------------------
  pie_chart_legend.js 2019-06-20
  Gambio GmbH
  http://www.gambio.de
  Copyright (c) 2019 Gambio GmbH
  Released under the GNU General Public License (Version 2)
  [http://www.gnu.org/licenses/gpl-2.0.html]
  --------------------------------------------------------------*/

(function () {

	'use strict';

	var legendId = 'pieChartLegend',
	    removePieChartLegend = function removePieChartLegend() {

		var legend = document.getElementById(legendId);

		if (legend !== null) {
			legend.remove();
		}
	},
	    getNextColor = function getNextColor(index, colors) {

		if (index < colors.length) {

			return colors[index];
		}

		while (index >= colors.length) {

			index -= colors.length;
		}

		return colors[index];
	},
	    buildLegendHtml = function buildLegendHtml(legendData, colors) {

		console.log(legendData.length, colors.length);

		var legend = document.createElement('div');
		legend.id = legendId;

		legendData.forEach(function (item, index) {
			var pageName = void 0,
			    visitorCount = void 0,
			    color = getNextColor(index, colors);

			var _item = _slicedToArray(item, 2);

			pageName = _item[0];
			visitorCount = _item[1];


			var colorTile = document.createElement('div');
			colorTile.className = 'pie-chart-color-tie';
			colorTile.style.backgroundColor = color;
			colorTile.innerHTML = '\xA0'; // &nbsp;

			var legendContent = document.createElement('span');
			legendContent.innerHTML = pageName + ' : ' + visitorCount;

			var row = document.createElement('div');
			row.appendChild(colorTile);
			row.appendChild(legendContent);

			legend.appendChild(row);
		});

		var $gm_box_content = $('#gm_box_content');

		legend.style.top = $gm_box_content.position().top + 50 + 'px';
		legend.style.left = $gm_box_content.position().left + $gm_box_content.width() + 50 + 'px';

		document.body.appendChild(legend);

		$(document).ajaxStart(removePieChartLegend);
	};

	buildLegendHtml(pieChartData, pieChartColors);
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpZV9jaGFydF9sZWdlbmQuanMiXSwibmFtZXMiOlsibGVnZW5kSWQiLCJyZW1vdmVQaWVDaGFydExlZ2VuZCIsImxlZ2VuZCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJyZW1vdmUiLCJnZXROZXh0Q29sb3IiLCJpbmRleCIsImNvbG9ycyIsImxlbmd0aCIsImJ1aWxkTGVnZW5kSHRtbCIsImxlZ2VuZERhdGEiLCJjb25zb2xlIiwibG9nIiwiY3JlYXRlRWxlbWVudCIsImlkIiwiZm9yRWFjaCIsIml0ZW0iLCJwYWdlTmFtZSIsInZpc2l0b3JDb3VudCIsImNvbG9yIiwiY29sb3JUaWxlIiwiY2xhc3NOYW1lIiwic3R5bGUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJpbm5lckhUTUwiLCJsZWdlbmRDb250ZW50Iiwicm93IiwiYXBwZW5kQ2hpbGQiLCIkZ21fYm94X2NvbnRlbnQiLCIkIiwidG9wIiwicG9zaXRpb24iLCJsZWZ0Iiwid2lkdGgiLCJib2R5IiwiYWpheFN0YXJ0IiwicGllQ2hhcnREYXRhIiwicGllQ2hhcnRDb2xvcnMiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7Ozs7Ozs7O0FBVUEsQ0FBQyxZQUFXOztBQUVYOztBQUVBLEtBQUlBLFdBQVcsZ0JBQWY7QUFBQSxLQUNDQyx1QkFBdUIsU0FBdkJBLG9CQUF1QixHQUFXOztBQUVqQyxNQUFJQyxTQUFTQyxTQUFTQyxjQUFULENBQXdCSixRQUF4QixDQUFiOztBQUVBLE1BQUlFLFdBQVcsSUFBZixFQUFxQjtBQUNwQkEsVUFBT0csTUFBUDtBQUNBO0FBQ0QsRUFSRjtBQUFBLEtBU0NDLGVBQWUsU0FBZkEsWUFBZSxDQUFVQyxLQUFWLEVBQWlCQyxNQUFqQixFQUF5Qjs7QUFFdkMsTUFBSUQsUUFBUUMsT0FBT0MsTUFBbkIsRUFBMkI7O0FBRTFCLFVBQU9ELE9BQU9ELEtBQVAsQ0FBUDtBQUNBOztBQUVELFNBQU9BLFNBQVNDLE9BQU9DLE1BQXZCLEVBQStCOztBQUU5QkYsWUFBU0MsT0FBT0MsTUFBaEI7QUFDQTs7QUFFRCxTQUFPRCxPQUFPRCxLQUFQLENBQVA7QUFDQSxFQXRCRjtBQUFBLEtBdUJDRyxrQkFBa0IsU0FBbEJBLGVBQWtCLENBQVNDLFVBQVQsRUFBcUJILE1BQXJCLEVBQTZCOztBQUU5Q0ksVUFBUUMsR0FBUixDQUFZRixXQUFXRixNQUF2QixFQUErQkQsT0FBT0MsTUFBdEM7O0FBRUEsTUFBSVAsU0FBU0MsU0FBU1csYUFBVCxDQUF1QixLQUF2QixDQUFiO0FBQ0FaLFNBQU9hLEVBQVAsR0FBWWYsUUFBWjs7QUFFQVcsYUFBV0ssT0FBWCxDQUFtQixVQUFTQyxJQUFULEVBQWVWLEtBQWYsRUFBc0I7QUFDeEMsT0FBSVcsaUJBQUo7QUFBQSxPQUNDQyxxQkFERDtBQUFBLE9BRUNDLFFBQVFkLGFBQWFDLEtBQWIsRUFBb0JDLE1BQXBCLENBRlQ7O0FBRHdDLDhCQUtiUyxJQUxhOztBQUt2Q0MsV0FMdUM7QUFLN0JDLGVBTDZCOzs7QUFPeEMsT0FBSUUsWUFBWWxCLFNBQVNXLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBaEI7QUFDQU8sYUFBVUMsU0FBVixHQUFzQixxQkFBdEI7QUFDQUQsYUFBVUUsS0FBVixDQUFnQkMsZUFBaEIsR0FBa0NKLEtBQWxDO0FBQ0FDLGFBQVVJLFNBQVYsR0FBc0IsTUFBdEIsQ0FWd0MsQ0FVUjs7QUFFaEMsT0FBSUMsZ0JBQWdCdkIsU0FBU1csYUFBVCxDQUF1QixNQUF2QixDQUFwQjtBQUNBWSxpQkFBY0QsU0FBZCxHQUEwQlAsV0FBVyxLQUFYLEdBQW1CQyxZQUE3Qzs7QUFFQSxPQUFJUSxNQUFNeEIsU0FBU1csYUFBVCxDQUF1QixLQUF2QixDQUFWO0FBQ0FhLE9BQUlDLFdBQUosQ0FBZ0JQLFNBQWhCO0FBQ0FNLE9BQUlDLFdBQUosQ0FBZ0JGLGFBQWhCOztBQUVBeEIsVUFBTzBCLFdBQVAsQ0FBbUJELEdBQW5CO0FBQ0EsR0FwQkQ7O0FBc0JBLE1BQUlFLGtCQUFrQkMsRUFBRSxpQkFBRixDQUF0Qjs7QUFFQTVCLFNBQU9xQixLQUFQLENBQWFRLEdBQWIsR0FBb0JGLGdCQUFnQkcsUUFBaEIsR0FBMkJELEdBQTNCLEdBQWlDLEVBQWxDLEdBQXdDLElBQTNEO0FBQ0E3QixTQUFPcUIsS0FBUCxDQUFhVSxJQUFiLEdBQXFCSixnQkFBZ0JHLFFBQWhCLEdBQTJCQyxJQUEzQixHQUFrQ0osZ0JBQWdCSyxLQUFoQixFQUFsQyxHQUE0RCxFQUE3RCxHQUFtRSxJQUF2Rjs7QUFFQS9CLFdBQVNnQyxJQUFULENBQWNQLFdBQWQsQ0FBMEIxQixNQUExQjs7QUFFQTRCLElBQUUzQixRQUFGLEVBQVlpQyxTQUFaLENBQXNCbkMsb0JBQXRCO0FBQ0EsRUE1REY7O0FBOERBUyxpQkFBZ0IyQixZQUFoQixFQUE4QkMsY0FBOUI7QUFFQSxDQXBFRCIsImZpbGUiOiJwaWVfY2hhcnRfbGVnZW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgcGllX2NoYXJ0X2xlZ2VuZC5qcyAyMDE5LTA2LTIwXG4gIEdhbWJpbyBHbWJIXG4gIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gIENvcHlyaWdodCAoYykgMjAxOSBHYW1iaW8gR21iSFxuICBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiAgW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXG4oZnVuY3Rpb24oKSB7XG5cdFxuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRsZXQgbGVnZW5kSWQgPSAncGllQ2hhcnRMZWdlbmQnLFxuXHRcdHJlbW92ZVBpZUNoYXJ0TGVnZW5kID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcblx0XHRcdGxldCBsZWdlbmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChsZWdlbmRJZCk7XG5cdFx0XHRcblx0XHRcdGlmIChsZWdlbmQgIT09IG51bGwpIHtcblx0XHRcdFx0bGVnZW5kLnJlbW92ZSgpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Z2V0TmV4dENvbG9yID0gZnVuY3Rpb24gKGluZGV4LCBjb2xvcnMpIHtcblx0XHRcblx0XHRcdGlmIChpbmRleCA8IGNvbG9ycy5sZW5ndGgpIHtcblx0XHRcdFx0XG5cdFx0XHRcdHJldHVybiBjb2xvcnNbaW5kZXhdO1xuXHRcdFx0fVxuXG5cdFx0XHR3aGlsZSAoaW5kZXggPj0gY29sb3JzLmxlbmd0aCkge1xuXG5cdFx0XHRcdGluZGV4IC09IGNvbG9ycy5sZW5ndGg7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBjb2xvcnNbaW5kZXhdO1xuXHRcdH0sXG5cdFx0YnVpbGRMZWdlbmRIdG1sID0gZnVuY3Rpb24obGVnZW5kRGF0YSwgY29sb3JzKSB7XG5cdFx0XHRcblx0XHRcdGNvbnNvbGUubG9nKGxlZ2VuZERhdGEubGVuZ3RoLCBjb2xvcnMubGVuZ3RoKTtcblx0XHRcblx0XHRcdGxldCBsZWdlbmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdGxlZ2VuZC5pZCA9IGxlZ2VuZElkO1xuXHRcdFx0XG5cdFx0XHRsZWdlbmREYXRhLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcblx0XHRcdFx0bGV0IHBhZ2VOYW1lLFxuXHRcdFx0XHRcdHZpc2l0b3JDb3VudCxcblx0XHRcdFx0XHRjb2xvciA9IGdldE5leHRDb2xvcihpbmRleCwgY29sb3JzKTtcblx0XHRcdFx0XG5cdFx0XHRcdFtwYWdlTmFtZSwgdmlzaXRvckNvdW50XSA9IGl0ZW07XG5cdFx0XHRcdFxuXHRcdFx0XHRsZXQgY29sb3JUaWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdGNvbG9yVGlsZS5jbGFzc05hbWUgPSAncGllLWNoYXJ0LWNvbG9yLXRpZSc7XG5cdFx0XHRcdGNvbG9yVGlsZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvcjtcblx0XHRcdFx0Y29sb3JUaWxlLmlubmVySFRNTCA9IFwiXFx1MDBBMFwiOyAvLyAmbmJzcDtcblx0XHRcdFx0XG5cdFx0XHRcdGxldCBsZWdlbmRDb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuXHRcdFx0XHRsZWdlbmRDb250ZW50LmlubmVySFRNTCA9IHBhZ2VOYW1lICsgJyA6ICcgKyB2aXNpdG9yQ291bnQ7XG5cdFx0XHRcdFxuXHRcdFx0XHRsZXQgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdHJvdy5hcHBlbmRDaGlsZChjb2xvclRpbGUpO1xuXHRcdFx0XHRyb3cuYXBwZW5kQ2hpbGQobGVnZW5kQ29udGVudCk7XG5cdFx0XHRcdFxuXHRcdFx0XHRsZWdlbmQuYXBwZW5kQ2hpbGQocm93KTtcblx0XHRcdH0pO1xuXHRcdFx0XG5cdFx0XHRsZXQgJGdtX2JveF9jb250ZW50ID0gJCgnI2dtX2JveF9jb250ZW50Jyk7XG5cdFx0XHRcblx0XHRcdGxlZ2VuZC5zdHlsZS50b3AgPSAoJGdtX2JveF9jb250ZW50LnBvc2l0aW9uKCkudG9wICsgNTApICsgJ3B4Jztcblx0XHRcdGxlZ2VuZC5zdHlsZS5sZWZ0ID0gKCRnbV9ib3hfY29udGVudC5wb3NpdGlvbigpLmxlZnQgKyAkZ21fYm94X2NvbnRlbnQud2lkdGgoKSArIDUwKSArICdweCc7XG5cdFx0XHRcblx0XHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGVnZW5kKTtcblx0XHRcdFxuXHRcdFx0JChkb2N1bWVudCkuYWpheFN0YXJ0KHJlbW92ZVBpZUNoYXJ0TGVnZW5kKTtcblx0XHR9O1xuXHRcblx0YnVpbGRMZWdlbmRIdG1sKHBpZUNoYXJ0RGF0YSwgcGllQ2hhcnRDb2xvcnMpXG5cdFxufSkoKTsiXX0=
