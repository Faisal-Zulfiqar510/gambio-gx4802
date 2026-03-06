'use strict';

/* --------------------------------------------------------------
 module_center.js 2020-06-05
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2020 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Module Center
 *
 * This module will handle the click events on the module center page
 *
 * @module Controllers/module_center
 */
gx.controllers.module('module_center', [jse.source + '/vendor/datatables/jquery.dataTables.min.css', jse.source + '/vendor/datatables/jquery.dataTables.min.js', 'datatable'],

/**  @lends module:Controllers/module_center */

function (data) {

	'use strict';

	// ------------------------------------------------------------------------
	// VARIABLES DEFINITION
	// ------------------------------------------------------------------------

	var
	/**
  * Module Selector
  *
  * @var {object}
  */
	$this = $(this),


	/**
  * Default Options
  *
  * @type {object}
  */
	defaults = {},


	/**
  * Elements
  *
  * @type {object}
  */
	elements = {

		form: $('.bottom-save-bar form'),

		/**
   * Install Button
   *
   * @type {jQuery}
   */
		installButton: $('.bottom-save-bar form button[name="install"]'),

		/**
   * Uninstall Button
   *
   * @type {jQuery}
   */
		uninstallButton: $('.bottom-save-bar form button[name="uninstall"]'),

		/**
   * Edit Button
   *
   * @type {jQuery}
   */
		editButton: $('.bottom-save-bar form a.btn'),

		/**
   * Module Hidden Field
   *
   * @type {jQuery}
   */
		hiddenModule: $('.bottom-save-bar form input[name="module"]')
	},


	/**
  * Final Options
  *
  * @var {object}
  */
	options = $.extend(true, {}, defaults, data),


	/**
  * Module Object
  *
  * @type {object}
  */
	module = {};

	// ------------------------------------------------------------------------
	// PRIVATE METHODS
	// ------------------------------------------------------------------------

	var _loadModuleData = function _loadModuleData(module) {

		$.ajax({
			url: 'admin.php?do=ModuleCenter/GetData&module=' + module,
			type: 'GET',
			dataType: 'json'
		}).done(function (data) {
			if (data.success) {
				$('.configuration-box-header h2').html(data.payload.title);
				$('.configuration-box-description p').html(data.payload.description);

				elements.editButton.attr('href', 'admin.php?do=' + data.payload.name + 'ModuleCenterModule');

				if (data.payload.isInstalled) {
					//$('.gx-configuration-box form').attr('action', 'admin.php?do=ModuleCenter/Destroy');
					elements.uninstallButton.show();
					elements.editButton.show();
					elements.installButton.hide();
				} else {
					elements.form.attr('action', 'admin.php?do=ModuleCenter/Store');
					elements.uninstallButton.hide();
					elements.editButton.hide();
					elements.installButton.show();
				}

				if (!data.payload.isEditable) {
					elements.editButton.hide();
				}

				elements.hiddenModule.val(data.payload.name);
				$('.gx-configuration-box').css('visibility', 'visible');
				$('.gx-configuration-box').css('height', $('#gx-main').innerHeight() - $('.content-header').innerHeight() - 1);
			}
		});
	};

	var _openUninstallDialog = function _openUninstallDialog(event) {
		event.preventDefault();
		var $dialog = $('#module-center-confirmation-dialog'),
		    module = elements.hiddenModule.val();

		$dialog.find('.modal-info-text').html(jse.core.lang.translate('text_uninstall_confirmation', 'module_center'));
		$dialog.find('input[name="module"]').val(module);

		$dialog.dialog({
			'title': jse.core.lang.translate('uninstall_confirmation_title', 'module_center').replace('%s', module),
			'modal': true,
			'dialogClass': 'gx-container',
			'buttons': [{
				'text': jse.core.lang.translate('close', 'buttons'),
				'class': 'btn',
				'click': function click() {
					$(this).dialog('close');
				}
			}, {
				'text': jse.core.lang.translate('uninstall', 'buttons'),
				'class': 'btn btn-primary',
				'click': function click() {
					$dialog.find('form').submit();
				}
			}]
		});
	};

	var queryString = function (a) {
		if (a === '') {
			return {};
		}
		var b = {};
		for (var i = 0; i < a.length; ++i) {
			var p = a[i].split('=', 2);
			if (p.length === 1) {
				b[p[0]] = '';
			} else {
				b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, ' '));
			}
		}
		return b;
	}(window.location.search.substr(1).split('&'));

	// ------------------------------------------------------------------------
	// EVENT HANDLERS
	// ------------------------------------------------------------------------

	var _hashChange = function _hashChange() {
		var module = window.location.hash.substring(1);

		if (module !== '') {
			_loadModuleData(module);
		}
	};

	var _setRowActive = function _setRowActive() {
		$('.gx-modules-table .dataTableRow.active').removeClass('active');

		$(this).addClass('active');

		$('html, body').animate({
			scrollTop: 0
		});
	};

	var _removeParam = function _removeParam(key, sourceURL) {
		var URL = sourceURL.split("?")[0];
		var params = [];
		var queryString = sourceURL.indexOf("?") !== -1 ? sourceURL.split("?")[1] : "";

		if (queryString !== "") {
			params = queryString.split("&");
			for (var i = params.length - 1; i >= 0; i -= 1) {
				var param = params[i].split("=")[0];
				if (param === key) {
					params.splice(i, 1);
				}
			}
			URL = URL + "?" + params.join("&");
		}
		window.history.pushState({}, document.title, URL);
	};

	// ------------------------------------------------------------------------
	// INITIALIZATION
	// ------------------------------------------------------------------------

	module.init = function (done) {
		jse.libs.datatable.create($this.find('.gx-modules-table'), {
			'dom': 't',
			'autoWidth': false,
			'pageLength': 1000,
			'columnDefs': [{
				'targets': [1, 2],
				'orderable': false
			}],
			'order': []
		});

		if (typeof queryString.module !== 'undefined') {
			_loadModuleData(queryString.module);
		} else {
			$('.gx-configuration-box').css('visibility', 'hidden');
			$('.bottom-save-bar .btn-edit').hide();
			$('.bottom-save-bar .btn-uninstall').hide();
			$('.bottom-save-bar .btn-install').hide();
		}

		_hashChange();

		$(window).on('hashchange', _hashChange);
		$('.gx-modules-table .dataTableRow').on('click', _setRowActive);
		elements.uninstallButton.on('click', _openUninstallDialog);

		_removeParam('module', window.location.href);

		done();
	};

	return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZV9jZW50ZXIvbW9kdWxlX2NlbnRlci5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwianNlIiwic291cmNlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImRlZmF1bHRzIiwiZWxlbWVudHMiLCJmb3JtIiwiaW5zdGFsbEJ1dHRvbiIsInVuaW5zdGFsbEJ1dHRvbiIsImVkaXRCdXR0b24iLCJoaWRkZW5Nb2R1bGUiLCJvcHRpb25zIiwiZXh0ZW5kIiwiX2xvYWRNb2R1bGVEYXRhIiwiYWpheCIsInVybCIsInR5cGUiLCJkYXRhVHlwZSIsImRvbmUiLCJzdWNjZXNzIiwiaHRtbCIsInBheWxvYWQiLCJ0aXRsZSIsImRlc2NyaXB0aW9uIiwiYXR0ciIsIm5hbWUiLCJpc0luc3RhbGxlZCIsInNob3ciLCJoaWRlIiwiaXNFZGl0YWJsZSIsInZhbCIsImNzcyIsImlubmVySGVpZ2h0IiwiX29wZW5Vbmluc3RhbGxEaWFsb2ciLCJldmVudCIsInByZXZlbnREZWZhdWx0IiwiJGRpYWxvZyIsImZpbmQiLCJjb3JlIiwibGFuZyIsInRyYW5zbGF0ZSIsImRpYWxvZyIsInJlcGxhY2UiLCJzdWJtaXQiLCJxdWVyeVN0cmluZyIsImEiLCJiIiwiaSIsImxlbmd0aCIsInAiLCJzcGxpdCIsImRlY29kZVVSSUNvbXBvbmVudCIsIndpbmRvdyIsImxvY2F0aW9uIiwic2VhcmNoIiwic3Vic3RyIiwiX2hhc2hDaGFuZ2UiLCJoYXNoIiwic3Vic3RyaW5nIiwiX3NldFJvd0FjdGl2ZSIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJhbmltYXRlIiwic2Nyb2xsVG9wIiwiX3JlbW92ZVBhcmFtIiwia2V5Iiwic291cmNlVVJMIiwiVVJMIiwicGFyYW1zIiwiaW5kZXhPZiIsInBhcmFtIiwic3BsaWNlIiwiam9pbiIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJkb2N1bWVudCIsImluaXQiLCJsaWJzIiwiZGF0YXRhYmxlIiwiY3JlYXRlIiwib24i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QUFVMUQsWUFBUztBQVZpRCxHQUEzRDs7QUFhQSxNQUFJLE9BQU9PLFlBQVk5QyxNQUFuQixLQUE4QixXQUFsQyxFQUErQztBQUM5Q2UsbUJBQWdCK0IsWUFBWTlDLE1BQTVCO0FBQ0EsR0FGRCxNQUVPO0FBQ05LLEtBQUUsdUJBQUYsRUFBMkI0QixHQUEzQixDQUErQixZQUEvQixFQUE2QyxRQUE3QztBQUNBNUIsS0FBRSw0QkFBRixFQUFnQ3lCLElBQWhDO0FBQ0F6QixLQUFFLGlDQUFGLEVBQXFDeUIsSUFBckM7QUFDQXpCLEtBQUUsK0JBQUYsRUFBbUN5QixJQUFuQztBQUNBOztBQUVENEI7O0FBRUFyRCxJQUFFaUQsTUFBRixFQUFVNEIsRUFBVixDQUFhLFlBQWIsRUFBMkJ4QixXQUEzQjtBQUNBckQsSUFBRSxpQ0FBRixFQUFxQzZFLEVBQXJDLENBQXdDLE9BQXhDLEVBQWlEckIsYUFBakQ7QUFDQXRELFdBQVNHLGVBQVQsQ0FBeUJ3RSxFQUF6QixDQUE0QixPQUE1QixFQUFxQy9DLG9CQUFyQzs7QUFFQStCLGVBQWEsUUFBYixFQUF1QlosT0FBT0MsUUFBUCxDQUFnQjRCLElBQXZDOztBQUVBL0Q7QUFDQSxFQWhDRDs7QUFrQ0EsUUFBT3BCLE1BQVA7QUFDQSxDQWxRRiIsImZpbGUiOiJtb2R1bGVfY2VudGVyL21vZHVsZV9jZW50ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIG1vZHVsZV9jZW50ZXIuanMgMjAyMC0wNi0wNVxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMjAgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgTW9kdWxlIENlbnRlclxuICpcbiAqIFRoaXMgbW9kdWxlIHdpbGwgaGFuZGxlIHRoZSBjbGljayBldmVudHMgb24gdGhlIG1vZHVsZSBjZW50ZXIgcGFnZVxuICpcbiAqIEBtb2R1bGUgQ29udHJvbGxlcnMvbW9kdWxlX2NlbnRlclxuICovXG5neC5jb250cm9sbGVycy5tb2R1bGUoXG5cdCdtb2R1bGVfY2VudGVyJyxcblx0XG5cdFtcblx0XHRgJHtqc2Uuc291cmNlfS92ZW5kb3IvZGF0YXRhYmxlcy9qcXVlcnkuZGF0YVRhYmxlcy5taW4uY3NzYCxcblx0XHRgJHtqc2Uuc291cmNlfS92ZW5kb3IvZGF0YXRhYmxlcy9qcXVlcnkuZGF0YVRhYmxlcy5taW4uanNgLFxuXHRcdCdkYXRhdGFibGUnXG5cdF0sXG5cdFxuXHQvKiogIEBsZW5kcyBtb2R1bGU6Q29udHJvbGxlcnMvbW9kdWxlX2NlbnRlciAqL1xuXHRcblx0ZnVuY3Rpb24oZGF0YSkge1xuXHRcdFxuXHRcdCd1c2Ugc3RyaWN0Jztcblx0XHRcblx0XHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHQvLyBWQVJJQUJMRVMgREVGSU5JVElPTlxuXHRcdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdFxuXHRcdHZhclxuXHRcdFx0LyoqXG5cdFx0XHQgKiBNb2R1bGUgU2VsZWN0b3Jcblx0XHRcdCAqXG5cdFx0XHQgKiBAdmFyIHtvYmplY3R9XG5cdFx0XHQgKi9cblx0XHRcdCR0aGlzID0gJCh0aGlzKSxcblx0XHRcdFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBEZWZhdWx0IE9wdGlvbnNcblx0XHRcdCAqXG5cdFx0XHQgKiBAdHlwZSB7b2JqZWN0fVxuXHRcdFx0ICovXG5cdFx0XHRkZWZhdWx0cyA9IHt9LFxuXHRcdFx0XG5cdFx0XHQvKipcblx0XHRcdCAqIEVsZW1lbnRzXG5cdFx0XHQgKlxuXHRcdFx0ICogQHR5cGUge29iamVjdH1cblx0XHRcdCAqL1xuXHRcdFx0ZWxlbWVudHMgPSB7XG5cdFx0XHRcdFxuXHRcdFx0XHRmb3JtOiAkKCcuYm90dG9tLXNhdmUtYmFyIGZvcm0nKSxcblx0XHRcdFx0XG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiBJbnN0YWxsIEJ1dHRvblxuXHRcdFx0XHQgKlxuXHRcdFx0XHQgKiBAdHlwZSB7alF1ZXJ5fVxuXHRcdFx0XHQgKi9cblx0XHRcdFx0aW5zdGFsbEJ1dHRvbjogJCgnLmJvdHRvbS1zYXZlLWJhciBmb3JtIGJ1dHRvbltuYW1lPVwiaW5zdGFsbFwiXScpLFxuXHRcdFx0XHRcblx0XHRcdFx0LyoqXG5cdFx0XHRcdCAqIFVuaW5zdGFsbCBCdXR0b25cblx0XHRcdFx0ICpcblx0XHRcdFx0ICogQHR5cGUge2pRdWVyeX1cblx0XHRcdFx0ICovXG5cdFx0XHRcdHVuaW5zdGFsbEJ1dHRvbjogJCgnLmJvdHRvbS1zYXZlLWJhciBmb3JtIGJ1dHRvbltuYW1lPVwidW5pbnN0YWxsXCJdJyksXG5cdFx0XHRcdFxuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogRWRpdCBCdXR0b25cblx0XHRcdFx0ICpcblx0XHRcdFx0ICogQHR5cGUge2pRdWVyeX1cblx0XHRcdFx0ICovXG5cdFx0XHRcdGVkaXRCdXR0b246ICQoJy5ib3R0b20tc2F2ZS1iYXIgZm9ybSBhLmJ0bicpLFxuXHRcdFx0XHRcblx0XHRcdFx0LyoqXG5cdFx0XHRcdCAqIE1vZHVsZSBIaWRkZW4gRmllbGRcblx0XHRcdFx0ICpcblx0XHRcdFx0ICogQHR5cGUge2pRdWVyeX1cblx0XHRcdFx0ICovXG5cdFx0XHRcdGhpZGRlbk1vZHVsZTogJCgnLmJvdHRvbS1zYXZlLWJhciBmb3JtIGlucHV0W25hbWU9XCJtb2R1bGVcIl0nKVxuXHRcdFx0fSxcblx0XHRcdFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBGaW5hbCBPcHRpb25zXG5cdFx0XHQgKlxuXHRcdFx0ICogQHZhciB7b2JqZWN0fVxuXHRcdFx0ICovXG5cdFx0XHRvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcblx0XHRcdFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBNb2R1bGUgT2JqZWN0XG5cdFx0XHQgKlxuXHRcdFx0ICogQHR5cGUge29iamVjdH1cblx0XHRcdCAqL1xuXHRcdFx0bW9kdWxlID0ge307XG5cdFx0XG5cdFx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0Ly8gUFJJVkFURSBNRVRIT0RTXG5cdFx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0XG5cdFx0dmFyIF9sb2FkTW9kdWxlRGF0YSA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuXHRcdFx0XG5cdFx0XHQkLmFqYXgoe1xuXHRcdFx0XHR1cmw6ICdhZG1pbi5waHA/ZG89TW9kdWxlQ2VudGVyL0dldERhdGEmbW9kdWxlPScgKyBtb2R1bGUsXG5cdFx0XHRcdHR5cGU6ICdHRVQnLFxuXHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nXG5cdFx0XHR9KVxuXHRcdFx0XHQuZG9uZShmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0aWYgKGRhdGEuc3VjY2Vzcykge1xuXHRcdFx0XHRcdFx0JCgnLmNvbmZpZ3VyYXRpb24tYm94LWhlYWRlciBoMicpLmh0bWwoZGF0YS5wYXlsb2FkLnRpdGxlKTtcblx0XHRcdFx0XHRcdCQoJy5jb25maWd1cmF0aW9uLWJveC1kZXNjcmlwdGlvbiBwJykuaHRtbChkYXRhLnBheWxvYWQuZGVzY3JpcHRpb24pO1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRlbGVtZW50cy5lZGl0QnV0dG9uLmF0dHIoJ2hyZWYnLCAnYWRtaW4ucGhwP2RvPScgKyBkYXRhLnBheWxvYWQubmFtZSArXG5cdFx0XHRcdFx0XHRcdCdNb2R1bGVDZW50ZXJNb2R1bGUnKTtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0aWYgKGRhdGEucGF5bG9hZC5pc0luc3RhbGxlZCkge1xuXHRcdFx0XHRcdFx0XHQvLyQoJy5neC1jb25maWd1cmF0aW9uLWJveCBmb3JtJykuYXR0cignYWN0aW9uJywgJ2FkbWluLnBocD9kbz1Nb2R1bGVDZW50ZXIvRGVzdHJveScpO1xuXHRcdFx0XHRcdFx0XHRlbGVtZW50cy51bmluc3RhbGxCdXR0b24uc2hvdygpO1xuXHRcdFx0XHRcdFx0XHRlbGVtZW50cy5lZGl0QnV0dG9uLnNob3coKTtcblx0XHRcdFx0XHRcdFx0ZWxlbWVudHMuaW5zdGFsbEJ1dHRvbi5oaWRlKCk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRlbGVtZW50cy5mb3JtLmF0dHIoJ2FjdGlvbicsICdhZG1pbi5waHA/ZG89TW9kdWxlQ2VudGVyL1N0b3JlJyk7XG5cdFx0XHRcdFx0XHRcdGVsZW1lbnRzLnVuaW5zdGFsbEJ1dHRvbi5oaWRlKCk7XG5cdFx0XHRcdFx0XHRcdGVsZW1lbnRzLmVkaXRCdXR0b24uaGlkZSgpO1xuXHRcdFx0XHRcdFx0XHRlbGVtZW50cy5pbnN0YWxsQnV0dG9uLnNob3coKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0aWYgKCFkYXRhLnBheWxvYWQuaXNFZGl0YWJsZSkge1xuXHRcdFx0XHRcdFx0XHRlbGVtZW50cy5lZGl0QnV0dG9uLmhpZGUoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0ZWxlbWVudHMuaGlkZGVuTW9kdWxlLnZhbChkYXRhLnBheWxvYWQubmFtZSk7XG5cdFx0XHRcdFx0XHQkKCcuZ3gtY29uZmlndXJhdGlvbi1ib3gnKS5jc3MoJ3Zpc2liaWxpdHknLCAndmlzaWJsZScpO1xuXHRcdFx0XHRcdFx0JCgnLmd4LWNvbmZpZ3VyYXRpb24tYm94Jylcblx0XHRcdFx0XHRcdFx0LmNzcygnaGVpZ2h0JywgJCgnI2d4LW1haW4nKS5pbm5lckhlaWdodCgpIC0gJCgnLmNvbnRlbnQtaGVhZGVyJykuaW5uZXJIZWlnaHQoKSAtMSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHR9O1xuXHRcdFxuXHRcdHZhciBfb3BlblVuaW5zdGFsbERpYWxvZyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0dmFyICRkaWFsb2cgPSAkKCcjbW9kdWxlLWNlbnRlci1jb25maXJtYXRpb24tZGlhbG9nJyksXG5cdFx0XHRcdG1vZHVsZSA9IGVsZW1lbnRzLmhpZGRlbk1vZHVsZS52YWwoKTtcblx0XHRcdFxuXHRcdFx0JGRpYWxvZy5maW5kKCcubW9kYWwtaW5mby10ZXh0JykuaHRtbChqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgndGV4dF91bmluc3RhbGxfY29uZmlybWF0aW9uJyxcblx0XHRcdFx0J21vZHVsZV9jZW50ZXInKSk7XG5cdFx0XHQkZGlhbG9nLmZpbmQoJ2lucHV0W25hbWU9XCJtb2R1bGVcIl0nKS52YWwobW9kdWxlKTtcblx0XHRcdFxuXHRcdFx0JGRpYWxvZy5kaWFsb2coe1xuXHRcdFx0XHQndGl0bGUnOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgndW5pbnN0YWxsX2NvbmZpcm1hdGlvbl90aXRsZScsICdtb2R1bGVfY2VudGVyJylcblx0XHRcdFx0XHQucmVwbGFjZSgnJXMnLFxuXHRcdFx0XHRcdFx0bW9kdWxlKSxcblx0XHRcdFx0J21vZGFsJzogdHJ1ZSxcblx0XHRcdFx0J2RpYWxvZ0NsYXNzJzogJ2d4LWNvbnRhaW5lcicsXG5cdFx0XHRcdCdidXR0b25zJzogW1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdCd0ZXh0JzoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2Nsb3NlJywgJ2J1dHRvbnMnKSxcblx0XHRcdFx0XHRcdCdjbGFzcyc6ICdidG4nLFxuXHRcdFx0XHRcdFx0J2NsaWNrJzogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdCQodGhpcykuZGlhbG9nKCdjbG9zZScpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0J3RleHQnOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgndW5pbnN0YWxsJywgJ2J1dHRvbnMnKSxcblx0XHRcdFx0XHRcdCdjbGFzcyc6ICdidG4gYnRuLXByaW1hcnknLFxuXHRcdFx0XHRcdFx0J2NsaWNrJzogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdCRkaWFsb2cuZmluZCgnZm9ybScpLnN1Ym1pdCgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XVxuXHRcdFx0fSk7XG5cdFx0fTtcblx0XHRcblx0XHR2YXIgcXVlcnlTdHJpbmcgPSAoZnVuY3Rpb24oYSkge1xuXHRcdFx0aWYgKGEgPT09ICcnKSB7XG5cdFx0XHRcdHJldHVybiB7fTtcblx0XHRcdH1cblx0XHRcdHZhciBiID0ge307XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGEubGVuZ3RoOyArK2kpIHtcblx0XHRcdFx0dmFyIHAgPSBhW2ldLnNwbGl0KCc9JywgMik7XG5cdFx0XHRcdGlmIChwLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0XHRcdGJbcFswXV0gPSAnJztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRiW3BbMF1dID0gZGVjb2RlVVJJQ29tcG9uZW50KHBbMV0ucmVwbGFjZSgvXFwrL2csICcgJykpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gYjtcblx0XHR9KSh3aW5kb3cubG9jYXRpb24uc2VhcmNoLnN1YnN0cigxKS5zcGxpdCgnJicpKTtcblx0XHRcblx0XHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHQvLyBFVkVOVCBIQU5ETEVSU1xuXHRcdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdFxuXHRcdHZhciBfaGFzaENoYW5nZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG1vZHVsZSA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cmluZygxKTtcblx0XHRcdFxuXHRcdFx0aWYgKG1vZHVsZSAhPT0gJycpIHtcblx0XHRcdFx0X2xvYWRNb2R1bGVEYXRhKG1vZHVsZSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRcblx0XHR2YXIgX3NldFJvd0FjdGl2ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0JCgnLmd4LW1vZHVsZXMtdGFibGUgLmRhdGFUYWJsZVJvdy5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHRcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0XG5cdFx0XHQkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XG5cdFx0XHRcdHNjcm9sbFRvcDogMFxuXHRcdFx0fSk7XG5cdFx0fTtcblx0XHRcblx0XHR2YXIgX3JlbW92ZVBhcmFtID0gZnVuY3Rpb24oa2V5LCBzb3VyY2VVUkwpIHtcblx0XHRcdHZhciBVUkwgPSBzb3VyY2VVUkwuc3BsaXQoXCI/XCIpWzBdO1xuXHRcdFx0dmFyIHBhcmFtcyA9IFtdO1xuXHRcdFx0dmFyIHF1ZXJ5U3RyaW5nID0gKHNvdXJjZVVSTC5pbmRleE9mKFwiP1wiKSAhPT0gLTEpID8gc291cmNlVVJMLnNwbGl0KFwiP1wiKVsxXSA6IFwiXCI7XG5cdFx0XHRcblx0XHRcdGlmIChxdWVyeVN0cmluZyAhPT0gXCJcIikge1xuXHRcdFx0XHRwYXJhbXMgPSBxdWVyeVN0cmluZy5zcGxpdChcIiZcIik7XG5cdFx0XHRcdGZvciAodmFyIGkgPSBwYXJhbXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpIC09IDEpIHtcblx0XHRcdFx0XHR2YXIgcGFyYW0gPSBwYXJhbXNbaV0uc3BsaXQoXCI9XCIpWzBdO1xuXHRcdFx0XHRcdGlmIChwYXJhbSA9PT0ga2V5KSB7XG5cdFx0XHRcdFx0XHRwYXJhbXMuc3BsaWNlKGksIDEpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRVUkwgPSBVUkwgKyBcIj9cIiArIHBhcmFtcy5qb2luKFwiJlwiKTtcblx0XHRcdH1cblx0XHRcdHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7fSwgZG9jdW1lbnQudGl0bGUsIFVSTCk7XG5cdFx0fVxuXHRcdFxuXHRcdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdC8vIElOSVRJQUxJWkFUSU9OXG5cdFx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0XG5cdFx0bW9kdWxlLmluaXQgPSBmdW5jdGlvbihkb25lKSB7XG5cdFx0XHRqc2UubGlicy5kYXRhdGFibGUuY3JlYXRlKCR0aGlzLmZpbmQoJy5neC1tb2R1bGVzLXRhYmxlJyksIHtcblx0XHRcdFx0J2RvbSc6ICd0Jyxcblx0XHRcdFx0J2F1dG9XaWR0aCc6IGZhbHNlLFxuXHRcdFx0XHQncGFnZUxlbmd0aCc6IDEwMDAsXG5cdFx0XHRcdCdjb2x1bW5EZWZzJzogW1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdCd0YXJnZXRzJzogWzEsIDJdLFxuXHRcdFx0XHRcdFx0J29yZGVyYWJsZSc6IGZhbHNlXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRdLFxuXHRcdFx0XHQnb3JkZXInOiBbXVxuXHRcdFx0fSk7XG5cdFx0XHRcblx0XHRcdGlmICh0eXBlb2YgcXVlcnlTdHJpbmcubW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRfbG9hZE1vZHVsZURhdGEocXVlcnlTdHJpbmcubW9kdWxlKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoJy5neC1jb25maWd1cmF0aW9uLWJveCcpLmNzcygndmlzaWJpbGl0eScsICdoaWRkZW4nKTtcblx0XHRcdFx0JCgnLmJvdHRvbS1zYXZlLWJhciAuYnRuLWVkaXQnKS5oaWRlKCk7XG5cdFx0XHRcdCQoJy5ib3R0b20tc2F2ZS1iYXIgLmJ0bi11bmluc3RhbGwnKS5oaWRlKCk7XG5cdFx0XHRcdCQoJy5ib3R0b20tc2F2ZS1iYXIgLmJ0bi1pbnN0YWxsJykuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRfaGFzaENoYW5nZSgpO1xuXHRcdFx0XG5cdFx0XHQkKHdpbmRvdykub24oJ2hhc2hjaGFuZ2UnLCBfaGFzaENoYW5nZSk7XG5cdFx0XHQkKCcuZ3gtbW9kdWxlcy10YWJsZSAuZGF0YVRhYmxlUm93Jykub24oJ2NsaWNrJywgX3NldFJvd0FjdGl2ZSk7XG5cdFx0XHRlbGVtZW50cy51bmluc3RhbGxCdXR0b24ub24oJ2NsaWNrJywgX29wZW5Vbmluc3RhbGxEaWFsb2cpO1xuXHRcdFx0XG5cdFx0XHRfcmVtb3ZlUGFyYW0oJ21vZHVsZScsIHdpbmRvdy5sb2NhdGlvbi5ocmVmKVxuXHRcdFx0XG5cdFx0XHRkb25lKCk7XG5cdFx0fTtcblx0XHRcblx0XHRyZXR1cm4gbW9kdWxlO1xuXHR9KTtcbiJdfQ==
