'use strict';

/* --------------------------------------------------------------
 auto_updater.js 2019-02-07
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2019 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

jse.libs.auto_updater = jse.libs.auto_updater || {};

(function (exports) {
	'use strict';

	// ------------------------------------------------------------------------
	// VARIABLES AND CONSTANTS
	// ------------------------------------------------------------------------

	/**
  * Default options for controller,
  *
  * @type {object}
  */

	var URLS = {
		processInstallation: '../gambio_store.php?do=processUpdate',
		permissionCheck: 'admin.php?do=AutoUpdaterAjax/checkPermission',
		uninstallTheme: 'admin.php?do=AutoUpdaterAjax/uninstallTheme'
	};

	// ------------------------------------------------------------------------
	// FUNCTIONS
	// ------------------------------------------------------------------------

	/**
  * Installs a given update.
  */
	exports.installGambioStorePackage = function (gambioStoreData, updateProgressCallback) {
		return new Promise(function (resolve, reject) {
			var request = {
				url: URLS.processInstallation,
				data: { gambioStoreData: JSON.stringify(gambioStoreData) }
			};

			jse.libs.xhr.post(request).done(function (response) {
				if (response.success !== true) {
					return reject('Unexpected error');
				}

				updateProgressCallback(response);

				if (response.done === true) {
					return resolve();
				}

				exports.installGambioStorePackage(gambioStoreData, updateProgressCallback).then(function () {
					resolve();
				}).catch(function (error) {
					reject('Unexpected error');
				});
			}).fail(function () {
				reject('Install processing request failed');
			});
		});
	};

	/**
  * Checks the file permissions for a given update.
  */
	exports.checkGambioStorePackageFilePermissions = function (gambioStoreData) {
		return new Promise(function (resolve, reject) {
			var request = {
				url: URLS.permissionCheck,
				data: { gambioStoreData: JSON.stringify(gambioStoreData) }
			};

			jse.libs.xhr.post(request).done(function (response) {
				if (response.success !== true || response.result !== true) {
					reject('Permission check failed');
				}
				resolve();
			}).fail(function () {
				reject('Permission check request failed');
			});
		});
	};

	/**
  * Checks the file permissions for a given update.
  */
	exports.uninstallTheme = function (themeName) {
		return new Promise(function (resolve, reject) {
			var request = {
				url: URLS.uninstallTheme,
				data: { themeName: themeName }
			};

			jse.libs.xhr.post(request).done(function (response) {
				if (response.success !== true) {
					reject('Uninstall failed');
				}
				resolve();
			}).fail(function (data) {
				reject(data);
			});
		});
	};
})(jse.libs.auto_updater);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF1dG9fdXBkYXRlci5qcyJdLCJuYW1lcyI6WyJqc2UiLCJsaWJzIiwiYXV0b191cGRhdGVyIiwiZXhwb3J0cyIsIlVSTFMiLCJwcm9jZXNzSW5zdGFsbGF0aW9uIiwicGVybWlzc2lvbkNoZWNrIiwidW5pbnN0YWxsVGhlbWUiLCJpbnN0YWxsR2FtYmlvU3RvcmVQYWNrYWdlIiwiZ2FtYmlvU3RvcmVEYXRhIiwidXBkYXRlUHJvZ3Jlc3NDYWxsYmFjayIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwicmVxdWVzdCIsInVybCIsImRhdGEiLCJKU09OIiwic3RyaW5naWZ5IiwieGhyIiwicG9zdCIsImRvbmUiLCJyZXNwb25zZSIsInN1Y2Nlc3MiLCJ0aGVuIiwiY2F0Y2giLCJmYWlsIiwiY2hlY2tHYW1iaW9TdG9yZVBhY2thZ2VGaWxlUGVybWlzc2lvbnMiLCJyZXN1bHQiLCJ0aGVtZU5hbWUiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQUEsSUFBSUMsSUFBSixDQUFTQyxZQUFULEdBQXdCRixJQUFJQyxJQUFKLENBQVNDLFlBQVQsSUFBeUIsRUFBakQ7O0FBRUEsQ0FBQyxVQUFTQyxPQUFULEVBQWtCO0FBQ2xCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O0FBS0EsS0FBTUMsT0FBTztBQUNaQyx1QkFBcUIsc0NBRFQ7QUFFWkMsbUJBQWlCLDhDQUZMO0FBR1pDLGtCQUFnQjtBQUhKLEVBQWI7O0FBTUE7QUFDQTtBQUNBOztBQUVBOzs7QUFHQUosU0FBUUsseUJBQVIsR0FBb0MsVUFBU0MsZUFBVCxFQUEwQkMsc0JBQTFCLEVBQWtEO0FBQ3JGLFNBQU8sSUFBSUMsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUN2QyxPQUFNQyxVQUFVO0FBQ2ZDLFNBQUtYLEtBQUtDLG1CQURLO0FBRWZXLFVBQU0sRUFBQ1AsaUJBQWlCUSxLQUFLQyxTQUFMLENBQWVULGVBQWYsQ0FBbEI7QUFGUyxJQUFoQjs7QUFLQVQsT0FBSUMsSUFBSixDQUFTa0IsR0FBVCxDQUFhQyxJQUFiLENBQWtCTixPQUFsQixFQUEyQk8sSUFBM0IsQ0FBZ0Msb0JBQVk7QUFDM0MsUUFBSUMsU0FBU0MsT0FBVCxLQUFxQixJQUF6QixFQUErQjtBQUM5QixZQUFPVixPQUFPLGtCQUFQLENBQVA7QUFDQTs7QUFFREgsMkJBQXVCWSxRQUF2Qjs7QUFFQSxRQUFJQSxTQUFTRCxJQUFULEtBQWtCLElBQXRCLEVBQTRCO0FBQzNCLFlBQU9ULFNBQVA7QUFDQTs7QUFFRFQsWUFBUUsseUJBQVIsQ0FBa0NDLGVBQWxDLEVBQW1EQyxzQkFBbkQsRUFBMkVjLElBQTNFLENBQWdGLFlBQU07QUFDckZaO0FBQ0EsS0FGRCxFQUVHYSxLQUZILENBRVMsaUJBQVM7QUFDakJaLFlBQU8sa0JBQVA7QUFDQSxLQUpEO0FBS0EsSUFoQkQsRUFnQkdhLElBaEJILENBZ0JRLFlBQU07QUFDYmIsV0FBTyxtQ0FBUDtBQUNBLElBbEJEO0FBbUJBLEdBekJNLENBQVA7QUEwQkEsRUEzQkQ7O0FBNkJBOzs7QUFHQVYsU0FBUXdCLHNDQUFSLEdBQWlELFVBQVNsQixlQUFULEVBQTBCO0FBQzFFLFNBQU8sSUFBSUUsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUN2QyxPQUFNQyxVQUFVO0FBQ2ZDLFNBQUtYLEtBQUtFLGVBREs7QUFFZlUsVUFBTSxFQUFDUCxpQkFBaUJRLEtBQUtDLFNBQUwsQ0FBZVQsZUFBZixDQUFsQjtBQUZTLElBQWhCOztBQUtBVCxPQUFJQyxJQUFKLENBQVNrQixHQUFULENBQWFDLElBQWIsQ0FBa0JOLE9BQWxCLEVBQTJCTyxJQUEzQixDQUFnQyxvQkFBWTtBQUMzQyxRQUFJQyxTQUFTQyxPQUFULEtBQXFCLElBQXJCLElBQTZCRCxTQUFTTSxNQUFULEtBQW9CLElBQXJELEVBQTJEO0FBQzFEZixZQUFPLHlCQUFQO0FBQ0E7QUFDREQ7QUFDQSxJQUxELEVBS0djLElBTEgsQ0FLUSxZQUFNO0FBQ2JiLFdBQU8saUNBQVA7QUFDQSxJQVBEO0FBUUEsR0FkTSxDQUFQO0FBZUEsRUFoQkQ7O0FBa0JBOzs7QUFHQVYsU0FBUUksY0FBUixHQUF5QixVQUFTc0IsU0FBVCxFQUFvQjtBQUM1QyxTQUFPLElBQUlsQixPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3ZDLE9BQU1DLFVBQVU7QUFDZkMsU0FBS1gsS0FBS0csY0FESztBQUVmUyxVQUFNLEVBQUNhLFdBQVdBLFNBQVo7QUFGUyxJQUFoQjs7QUFLQTdCLE9BQUlDLElBQUosQ0FBU2tCLEdBQVQsQ0FBYUMsSUFBYixDQUFrQk4sT0FBbEIsRUFBMkJPLElBQTNCLENBQWdDLG9CQUFZO0FBQzNDLFFBQUlDLFNBQVNDLE9BQVQsS0FBcUIsSUFBekIsRUFBK0I7QUFDOUJWLFlBQU8sa0JBQVA7QUFDQTtBQUNERDtBQUNBLElBTEQsRUFLR2MsSUFMSCxDQUtRLFVBQUNWLElBQUQsRUFBVTtBQUNqQkgsV0FBT0csSUFBUDtBQUNBLElBUEQ7QUFRQSxHQWRNLENBQVA7QUFlQSxFQWhCRDtBQWtCQSxDQWhHRCxFQWdHR2hCLElBQUlDLElBQUosQ0FBU0MsWUFoR1oiLCJmaWxlIjoiYXV0b191cGRhdGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBhdXRvX3VwZGF0ZXIuanMgMjAxOS0wMi0wN1xuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTkgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmpzZS5saWJzLmF1dG9fdXBkYXRlciA9IGpzZS5saWJzLmF1dG9fdXBkYXRlciB8fCB7fTtcblxuKGZ1bmN0aW9uKGV4cG9ydHMpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHRcblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIFZBUklBQkxFUyBBTkQgQ09OU1RBTlRTXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcblx0LyoqXG5cdCAqIERlZmF1bHQgb3B0aW9ucyBmb3IgY29udHJvbGxlcixcblx0ICpcblx0ICogQHR5cGUge29iamVjdH1cblx0ICovXG5cdGNvbnN0IFVSTFMgPSB7XG5cdFx0cHJvY2Vzc0luc3RhbGxhdGlvbjogJy4uL2dhbWJpb19zdG9yZS5waHA/ZG89cHJvY2Vzc1VwZGF0ZScsXG5cdFx0cGVybWlzc2lvbkNoZWNrOiAnYWRtaW4ucGhwP2RvPUF1dG9VcGRhdGVyQWpheC9jaGVja1Blcm1pc3Npb24nLFxuXHRcdHVuaW5zdGFsbFRoZW1lOiAnYWRtaW4ucGhwP2RvPUF1dG9VcGRhdGVyQWpheC91bmluc3RhbGxUaGVtZScsXG5cdH07XG5cdFxuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gRlVOQ1RJT05TXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcblx0LyoqXG5cdCAqIEluc3RhbGxzIGEgZ2l2ZW4gdXBkYXRlLlxuXHQgKi9cblx0ZXhwb3J0cy5pbnN0YWxsR2FtYmlvU3RvcmVQYWNrYWdlID0gZnVuY3Rpb24oZ2FtYmlvU3RvcmVEYXRhLCB1cGRhdGVQcm9ncmVzc0NhbGxiYWNrKSB7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdGNvbnN0IHJlcXVlc3QgPSB7XG5cdFx0XHRcdHVybDogVVJMUy5wcm9jZXNzSW5zdGFsbGF0aW9uLFxuXHRcdFx0XHRkYXRhOiB7Z2FtYmlvU3RvcmVEYXRhOiBKU09OLnN0cmluZ2lmeShnYW1iaW9TdG9yZURhdGEpfSxcblx0XHRcdH07XG5cdFx0XHRcblx0XHRcdGpzZS5saWJzLnhoci5wb3N0KHJlcXVlc3QpLmRvbmUocmVzcG9uc2UgPT4ge1xuXHRcdFx0XHRpZiAocmVzcG9uc2Uuc3VjY2VzcyAhPT0gdHJ1ZSkge1xuXHRcdFx0XHRcdHJldHVybiByZWplY3QoJ1VuZXhwZWN0ZWQgZXJyb3InKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0dXBkYXRlUHJvZ3Jlc3NDYWxsYmFjayhyZXNwb25zZSk7XG5cdFx0XHRcdFxuXHRcdFx0XHRpZiAocmVzcG9uc2UuZG9uZSA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdHJldHVybiByZXNvbHZlKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdGV4cG9ydHMuaW5zdGFsbEdhbWJpb1N0b3JlUGFja2FnZShnYW1iaW9TdG9yZURhdGEsIHVwZGF0ZVByb2dyZXNzQ2FsbGJhY2spLnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRcdHJlc29sdmUoKTtcblx0XHRcdFx0fSkuY2F0Y2goZXJyb3IgPT4ge1xuXHRcdFx0XHRcdHJlamVjdCgnVW5leHBlY3RlZCBlcnJvcicpO1xuXHRcdFx0XHR9KVxuXHRcdFx0fSkuZmFpbCgoKSA9PiB7XG5cdFx0XHRcdHJlamVjdCgnSW5zdGFsbCBwcm9jZXNzaW5nIHJlcXVlc3QgZmFpbGVkJyk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fTtcblx0XG5cdC8qKlxuXHQgKiBDaGVja3MgdGhlIGZpbGUgcGVybWlzc2lvbnMgZm9yIGEgZ2l2ZW4gdXBkYXRlLlxuXHQgKi9cblx0ZXhwb3J0cy5jaGVja0dhbWJpb1N0b3JlUGFja2FnZUZpbGVQZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKGdhbWJpb1N0b3JlRGF0YSkge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRjb25zdCByZXF1ZXN0ID0ge1xuXHRcdFx0XHR1cmw6IFVSTFMucGVybWlzc2lvbkNoZWNrLFxuXHRcdFx0XHRkYXRhOiB7Z2FtYmlvU3RvcmVEYXRhOiBKU09OLnN0cmluZ2lmeShnYW1iaW9TdG9yZURhdGEpfSxcblx0XHRcdH07XG5cdFx0XHRcblx0XHRcdGpzZS5saWJzLnhoci5wb3N0KHJlcXVlc3QpLmRvbmUocmVzcG9uc2UgPT4ge1xuXHRcdFx0XHRpZiAocmVzcG9uc2Uuc3VjY2VzcyAhPT0gdHJ1ZSB8fCByZXNwb25zZS5yZXN1bHQgIT09IHRydWUpIHtcblx0XHRcdFx0XHRyZWplY3QoJ1Blcm1pc3Npb24gY2hlY2sgZmFpbGVkJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0fSkuZmFpbCgoKSA9PiB7XG5cdFx0XHRcdHJlamVjdCgnUGVybWlzc2lvbiBjaGVjayByZXF1ZXN0IGZhaWxlZCcpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH07XG5cdFxuXHQvKipcblx0ICogQ2hlY2tzIHRoZSBmaWxlIHBlcm1pc3Npb25zIGZvciBhIGdpdmVuIHVwZGF0ZS5cblx0ICovXG5cdGV4cG9ydHMudW5pbnN0YWxsVGhlbWUgPSBmdW5jdGlvbih0aGVtZU5hbWUpIHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0Y29uc3QgcmVxdWVzdCA9IHtcblx0XHRcdFx0dXJsOiBVUkxTLnVuaW5zdGFsbFRoZW1lLFxuXHRcdFx0XHRkYXRhOiB7dGhlbWVOYW1lOiB0aGVtZU5hbWV9XG5cdFx0XHR9O1xuXHRcdFx0XG5cdFx0XHRqc2UubGlicy54aHIucG9zdChyZXF1ZXN0KS5kb25lKHJlc3BvbnNlID0+IHtcblx0XHRcdFx0aWYgKHJlc3BvbnNlLnN1Y2Nlc3MgIT09IHRydWUpIHtcblx0XHRcdFx0XHRyZWplY3QoJ1VuaW5zdGFsbCBmYWlsZWQnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHR9KS5mYWlsKChkYXRhKSA9PiB7XG5cdFx0XHRcdHJlamVjdChkYXRhKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9O1xuXHRcbn0pKGpzZS5saWJzLmF1dG9fdXBkYXRlcik7XG4iXX0=
