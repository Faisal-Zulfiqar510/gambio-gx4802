'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

components.widgets.module('array-to-table', [], function () {
	return {
		vue: true,
		name: 'gx-array-to-table',
		template: '#array-to-table',
		data: function data() {
			return {
				moreDetails: {}
			};
		},
		props: ['data'],
		methods: {
			showMoreDetails: function showMoreDetails(key) {
				this.moreDetails[key] = !this.moreDetails[key];
				this.$forceUpdate();
			},
			isObject: function isObject(data) {
				return data !== null && (typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object';
			},
			isCollapsible: function isCollapsible(object) {
				return this.isObject(object) && Object.keys(object).length > 0;
			}
		},
		init: function init(done) {
			return done();
		}
	};
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZ1ZS9jb21wb25lbnRzL2FycmF5LXRvLXRhYmxlLmpzIl0sIm5hbWVzIjpbImNvbXBvbmVudHMiLCJ3aWRnZXRzIiwibW9kdWxlIiwidnVlIiwibmFtZSIsInRlbXBsYXRlIiwiZGF0YSIsIm1vcmVEZXRhaWxzIiwicHJvcHMiLCJtZXRob2RzIiwic2hvd01vcmVEZXRhaWxzIiwia2V5IiwiJGZvcmNlVXBkYXRlIiwiaXNPYmplY3QiLCJpc0NvbGxhcHNpYmxlIiwib2JqZWN0IiwiT2JqZWN0Iiwia2V5cyIsImxlbmd0aCIsImluaXQiLCJkb25lIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUFBLFdBQVdDLE9BQVgsQ0FBbUJDLE1BQW5CLENBQTBCLGdCQUExQixFQUNDLEVBREQsRUFFQyxZQUFNO0FBQ0wsUUFBTztBQUNOQyxPQUFLLElBREM7QUFFTkMsUUFBTSxtQkFGQTtBQUdOQyxZQUFVLGlCQUhKO0FBSU5DLFFBQU07QUFBQSxVQUFPO0FBQ1pDLGlCQUFhO0FBREQsSUFBUDtBQUFBLEdBSkE7QUFPTkMsU0FBTyxDQUFDLE1BQUQsQ0FQRDtBQVFOQyxXQUFTO0FBQ1JDLGtCQURRLDJCQUNRQyxHQURSLEVBQ2E7QUFDcEIsU0FBS0osV0FBTCxDQUFpQkksR0FBakIsSUFBd0IsQ0FBQyxLQUFLSixXQUFMLENBQWlCSSxHQUFqQixDQUF6QjtBQUNBLFNBQUtDLFlBQUw7QUFDQSxJQUpPO0FBS1JDLFdBTFEsb0JBS0NQLElBTEQsRUFLTztBQUNkLFdBQU9BLFNBQVMsSUFBVCxJQUFpQixRQUFPQSxJQUFQLHlDQUFPQSxJQUFQLE9BQWdCLFFBQXhDO0FBQ0EsSUFQTztBQVFSUSxnQkFSUSx5QkFRTUMsTUFSTixFQVFjO0FBQ3JCLFdBQU8sS0FBS0YsUUFBTCxDQUFjRSxNQUFkLEtBQXlCQyxPQUFPQyxJQUFQLENBQVlGLE1BQVosRUFBb0JHLE1BQXBCLEdBQTZCLENBQTdEO0FBQ0E7QUFWTyxHQVJIO0FBb0JOQyxRQUFNO0FBQUEsVUFBUUMsTUFBUjtBQUFBO0FBcEJBLEVBQVA7QUFzQkEsQ0F6QkYiLCJmaWxlIjoidnVlL2NvbXBvbmVudHMvYXJyYXktdG8tdGFibGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb21wb25lbnRzLndpZGdldHMubW9kdWxlKCdhcnJheS10by10YWJsZScsXG5cdFtdLFxuXHQoKSA9PiB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHZ1ZTogdHJ1ZSxcblx0XHRcdG5hbWU6ICdneC1hcnJheS10by10YWJsZScsXG5cdFx0XHR0ZW1wbGF0ZTogJyNhcnJheS10by10YWJsZScsXG5cdFx0XHRkYXRhOiAoKSA9PiAoe1xuXHRcdFx0XHRtb3JlRGV0YWlsczoge30sXG5cdFx0XHR9KSxcblx0XHRcdHByb3BzOiBbJ2RhdGEnXSxcblx0XHRcdG1ldGhvZHM6IHtcblx0XHRcdFx0c2hvd01vcmVEZXRhaWxzKGtleSkge1xuXHRcdFx0XHRcdHRoaXMubW9yZURldGFpbHNba2V5XSA9ICF0aGlzLm1vcmVEZXRhaWxzW2tleV07XG5cdFx0XHRcdFx0dGhpcy4kZm9yY2VVcGRhdGUoKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0aXNPYmplY3QoZGF0YSkge1xuXHRcdFx0XHRcdHJldHVybiBkYXRhICE9PSBudWxsICYmIHR5cGVvZiBkYXRhID09PSAnb2JqZWN0Jztcblx0XHRcdFx0fSxcblx0XHRcdFx0aXNDb2xsYXBzaWJsZShvYmplY3QpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5pc09iamVjdChvYmplY3QpICYmIE9iamVjdC5rZXlzKG9iamVjdCkubGVuZ3RoID4gMDtcblx0XHRcdFx0fSxcblx0XHRcdH0sXG5cdFx0XHRpbml0OiBkb25lID0+IGRvbmUoKVxuXHRcdH1cblx0fSk7Il19
