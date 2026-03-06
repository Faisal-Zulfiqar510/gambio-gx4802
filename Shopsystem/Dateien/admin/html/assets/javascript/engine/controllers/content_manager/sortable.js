'use strict';

/* --------------------------------------------------------------
 sortable.js 2020-09-05
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2020 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Content manager controller to implement sortable functionality for pages.
 */
gx.controllers.module('sortable', [jse.source + '/vendor/jquery-ui-dist/jquery-ui.min.css', jse.source + '/vendor/jquery-ui-dist/jquery-ui.js'], function () {
    'use strict';

    var SORTING_ID_ATTRIBUTE = 'data-sorting-id';

    var SAVE_SORTING_REQUEST_URL = 'admin.php?do=ContentManagerPagesAjax/SavePagesSorting';
    var SAVE_SORTING_REQUEST_METHOD = 'POST';

    var $errorModal = $('.sorting-failed.modal');
    var $emptyListTemplate = $('#empty-list');
    var $lists = $('#pages_main, #pages_secondary, #pages_info, #pages_info_box, #pages_additional');

    var sortableOptions = {
        items: 'li.content-manager-element',
        axis: 'y',
        cursor: 'move',
        handle: '.sort-handle',
        containment: '#main-content',
        connectWith: '.content-manager-container',
        placeholder: 'col-md-12 content-manager-element sort-placeholder'
    };

    function init(done) {
        $lists.sortable(sortableOptions).on('sortupdate', saveSorting).disableSelection();

        done();
    }

    function handleError() {
        $errorModal.modal('show');
    }

    function handleResponses() {
        for (var _len = arguments.length, responses = Array(_len), _key = 0; _key < _len; _key++) {
            responses[_key] = arguments[_key];
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = responses[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var response = _step.value;

                var parsed = response[0];

                if (parsed[0] !== 'success') {
                    handleError();
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }

    function saveSorting(event, ui) {
        var _$;

        if (!ui.item.parent().is('ul')) {
            $lists.sortable('cancel');
        }

        var requests = [];

        function performRequest(index, element) {
            var $list = $(element);

            var ajaxOptions = {
                url: SAVE_SORTING_REQUEST_URL,
                method: SAVE_SORTING_REQUEST_METHOD,
                dataType: 'json',
                data: {
                    position: $list.prop('id'),
                    pages: $list.sortable('toArray', { attribute: SORTING_ID_ATTRIBUTE })
                }
            };

            var request = $.ajax(ajaxOptions);

            requests.push(request);

            updateEntryCount($list);
        }

        if (!ui.item.parents('.ui-sortable').is(this)) {
            return;
        }

        $lists.each(performRequest);

        (_$ = $).when.apply(_$, requests).then(handleResponses).fail(handleError);
    }

    function updateEntryCount($list) {
        var $container = $list.find('.content-manager-elements-list');
        var $entries = $container.find('.content-manager-element');
        var $emptyListElement = $entries.not('[' + SORTING_ID_ATTRIBUTE + ']');

        if ($entries.length - $emptyListElement.length === 0) {
            $container.empty().append($emptyListTemplate.clone().html());
        } else {
            $emptyListElement.remove();
        }
    }

    return { init: init };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRlbnRfbWFuYWdlci9zb3J0YWJsZS5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwianNlIiwic291cmNlIiwiU09SVElOR19JRF9BVFRSSUJVVEUiLCJTQVZFX1NPUlRJTkdfUkVRVUVTVF9VUkwiLCJTQVZFX1NPUlRJTkdfUkVRVUVTVF9NRVRIT0QiLCIkZXJyb3JNb2RhbCIsIiQiLCIkZW1wdHlMaXN0VGVtcGxhdGUiLCIkbGlzdHMiLCJzb3J0YWJsZU9wdGlvbnMiLCJpdGVtcyIsImF4aXMiLCJjdXJzb3IiLCJoYW5kbGUiLCJjb250YWlubWVudCIsImNvbm5lY3RXaXRoIiwicGxhY2Vob2xkZXIiLCJpbml0IiwiZG9uZSIsInNvcnRhYmxlIiwib24iLCJzYXZlU29ydGluZyIsImRpc2FibGVTZWxlY3Rpb24iLCJoYW5kbGVFcnJvciIsIm1vZGFsIiwiaGFuZGxlUmVzcG9uc2VzIiwicmVzcG9uc2VzIiwicmVzcG9uc2UiLCJwYXJzZWQiLCJldmVudCIsInVpIiwiaXRlbSIsInBhcmVudCIsImlzIiwicmVxdWVzdHMiLCJwZXJmb3JtUmVxdWVzdCIsImluZGV4IiwiZWxlbWVudCIsIiRsaXN0IiwiYWpheE9wdGlvbnMiLCJ1cmwiLCJtZXRob2QiLCJkYXRhVHlwZSIsImRhdGEiLCJwb3NpdGlvbiIsInByb3AiLCJwYWdlcyIsImF0dHJpYnV0ZSIsInJlcXVlc3QiLCJhamF4IiwicHVzaCIsInVwZGF0ZUVudHJ5Q291bnQiLCJwYXJlbnRzIiwiZWFjaCIsIndoZW4iLCJ0aGVuIiwiZmFpbCIsIiRjb250YWluZXIiLCJmaW5kIiwiJGVudHJpZXMiLCIkZW1wdHlMaXN0RWxlbWVudCIsIm5vdCIsImxlbmd0aCIsImVtcHR5IiwiYXBwZW5kIiwiY2xvbmUiLCJodG1sIiwicmVtb3ZlIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7OztBQUdBQSxHQUFHQyxXQUFILENBQWVDLE1BQWYsQ0FDSSxVQURKLEVB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LDBCQUFoQixDQUFqQjtBQUNBLFlBQU1FLG9CQUFvQkQsU0FBU0UsR0FBVCxPQUFpQjNELG9CQUFqQixPQUExQjs7QUFFQSxZQUFJeUQsU0FBU0csTUFBVCxHQUFrQkYsa0JBQWtCRSxNQUFwQyxLQUErQyxDQUFuRCxFQUFzRDtBQUNsREwsdUJBQ0tNLEtBREwsR0FFS0MsTUFGTCxDQUVZekQsbUJBQW1CMEQsS0FBbkIsR0FBMkJDLElBQTNCLEVBRlo7QUFHSCxTQUpELE1BSU87QUFDSE4sOEJBQWtCTyxNQUFsQjtBQUNIO0FBQ0o7O0FBRUQsV0FBTyxFQUFDbEQsVUFBRCxFQUFQO0FBQ0gsQ0ExR0wiLCJmaWxlIjoiY29udGVudF9tYW5hZ2VyL3NvcnRhYmxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBzb3J0YWJsZS5qcyAyMDIwLTA5LTA1XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAyMCBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiBDb250ZW50IG1hbmFnZXIgY29udHJvbGxlciB0byBpbXBsZW1lbnQgc29ydGFibGUgZnVuY3Rpb25hbGl0eSBmb3IgcGFnZXMuXG4gKi9cbmd4LmNvbnRyb2xsZXJzLm1vZHVsZShcbiAgICAnc29ydGFibGUnLFxuXG4gICAgW1xuICAgICAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3IvanF1ZXJ5LXVpLWRpc3QvanF1ZXJ5LXVpLm1pbi5jc3NgLFxuICAgICAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3IvanF1ZXJ5LXVpLWRpc3QvanF1ZXJ5LXVpLmpzYFxuICAgIF0sXG5cbiAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICBjb25zdCBTT1JUSU5HX0lEX0FUVFJJQlVURSA9ICdkYXRhLXNvcnRpbmctaWQnO1xuXG4gICAgICAgIGNvbnN0IFNBVkVfU09SVElOR19SRVFVRVNUX1VSTCA9ICdhZG1pbi5waHA/ZG89Q29udGVudE1hbmFnZXJQYWdlc0FqYXgvU2F2ZVBhZ2VzU29ydGluZyc7XG4gICAgICAgIGNvbnN0IFNBVkVfU09SVElOR19SRVFVRVNUX01FVEhPRCA9ICdQT1NUJztcblxuICAgICAgICBjb25zdCAkZXJyb3JNb2RhbCA9ICQoJy5zb3J0aW5nLWZhaWxlZC5tb2RhbCcpO1xuICAgICAgICBjb25zdCAkZW1wdHlMaXN0VGVtcGxhdGUgPSAkKCcjZW1wdHktbGlzdCcpO1xuICAgICAgICBjb25zdCAkbGlzdHMgPSAkKCcjcGFnZXNfbWFpbiwgI3BhZ2VzX3NlY29uZGFyeSwgI3BhZ2VzX2luZm8sICNwYWdlc19pbmZvX2JveCwgI3BhZ2VzX2FkZGl0aW9uYWwnKTtcblxuICAgICAgICBjb25zdCBzb3J0YWJsZU9wdGlvbnMgPSB7XG4gICAgICAgICAgICBpdGVtczogJ2xpLmNvbnRlbnQtbWFuYWdlci1lbGVtZW50JyxcbiAgICAgICAgICAgIGF4aXM6ICd5JyxcbiAgICAgICAgICAgIGN1cnNvcjogJ21vdmUnLFxuICAgICAgICAgICAgaGFuZGxlOiAnLnNvcnQtaGFuZGxlJyxcbiAgICAgICAgICAgIGNvbnRhaW5tZW50OiAnI21haW4tY29udGVudCcsXG4gICAgICAgICAgICBjb25uZWN0V2l0aDogJy5jb250ZW50LW1hbmFnZXItY29udGFpbmVyJyxcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOiAnY29sLW1kLTEyIGNvbnRlbnQtbWFuYWdlci1lbGVtZW50IHNvcnQtcGxhY2Vob2xkZXInXG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gaW5pdChkb25lKSB7XG4gICAgICAgICAgICAkbGlzdHNcbiAgICAgICAgICAgICAgICAuc29ydGFibGUoc29ydGFibGVPcHRpb25zKVxuICAgICAgICAgICAgICAgIC5vbignc29ydHVwZGF0ZScsIHNhdmVTb3J0aW5nKVxuICAgICAgICAgICAgICAgIC5kaXNhYmxlU2VsZWN0aW9uKCk7XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZUVycm9yKCkge1xuICAgICAgICAgICAgJGVycm9yTW9kYWwubW9kYWwoJ3Nob3cnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVJlc3BvbnNlcyguLi5yZXNwb25zZXMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcmVzcG9uc2Ugb2YgcmVzcG9uc2VzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGFyc2VkID0gcmVzcG9uc2VbMF07XG5cbiAgICAgICAgICAgICAgICBpZiAocGFyc2VkWzBdICE9PSAnc3VjY2VzcycpIHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlRXJyb3IoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzYXZlU29ydGluZyhldmVudCwgdWkpIHtcbiAgICAgICAgICAgIGlmICghdWkuaXRlbS5wYXJlbnQoKS5pcygndWwnKSkge1xuICAgICAgICAgICAgICAgICRsaXN0cy5zb3J0YWJsZSgnY2FuY2VsJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3RzID0gW107XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHBlcmZvcm1SZXF1ZXN0KGluZGV4LCBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgJGxpc3QgPSAkKGVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgYWpheE9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogU0FWRV9TT1JUSU5HX1JFUVVFU1RfVVJMLFxuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFNBVkVfU09SVElOR19SRVFVRVNUX01FVEhPRCxcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICRsaXN0LnByb3AoJ2lkJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlczogJGxpc3Quc29ydGFibGUoJ3RvQXJyYXknLCB7YXR0cmlidXRlOiBTT1JUSU5HX0lEX0FUVFJJQlVURX0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgY29uc3QgcmVxdWVzdCA9ICQuYWpheChhamF4T3B0aW9ucyk7XG5cbiAgICAgICAgICAgICAgICByZXF1ZXN0cy5wdXNoKHJlcXVlc3QpO1xuXG4gICAgICAgICAgICAgICAgdXBkYXRlRW50cnlDb3VudCgkbGlzdCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdWkuaXRlbS5wYXJlbnRzKCcudWktc29ydGFibGUnKS5pcyh0aGlzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJGxpc3RzLmVhY2gocGVyZm9ybVJlcXVlc3QpO1xuXG4gICAgICAgICAgICAkLndoZW4oLi4ucmVxdWVzdHMpXG4gICAgICAgICAgICAgICAgLnRoZW4oaGFuZGxlUmVzcG9uc2VzKVxuICAgICAgICAgICAgICAgIC5mYWlsKGhhbmRsZUVycm9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZUVudHJ5Q291bnQoJGxpc3QpIHtcbiAgICAgICAgICAgIGNvbnN0ICRjb250YWluZXIgPSAkbGlzdC5maW5kKCcuY29udGVudC1tYW5hZ2VyLWVsZW1lbnRzLWxpc3QnKTtcbiAgICAgICAgICAgIGNvbnN0ICRlbnRyaWVzID0gJGNvbnRhaW5lci5maW5kKCcuY29udGVudC1tYW5hZ2VyLWVsZW1lbnQnKTtcbiAgICAgICAgICAgIGNvbnN0ICRlbXB0eUxpc3RFbGVtZW50ID0gJGVudHJpZXMubm90KGBbJHtTT1JUSU5HX0lEX0FUVFJJQlVURX1dYCk7XG5cbiAgICAgICAgICAgIGlmICgkZW50cmllcy5sZW5ndGggLSAkZW1wdHlMaXN0RWxlbWVudC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyXG4gICAgICAgICAgICAgICAgICAgIC5lbXB0eSgpXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoJGVtcHR5TGlzdFRlbXBsYXRlLmNsb25lKCkuaHRtbCgpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJGVtcHR5TGlzdEVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge2luaXR9O1xuICAgIH0pO1xuIl19
