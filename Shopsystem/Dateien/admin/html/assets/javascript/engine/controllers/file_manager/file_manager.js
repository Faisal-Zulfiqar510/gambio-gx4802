'use strict';

/* --------------------------------------------------------------
 file_manager.js 2017-03-24
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 
 based on:
 (c) 2013 John Campbell (jcampbell1) - Simple PHP File Manager
 
 Released under the MIT License (MIT)
 
 Permission is hereby granted, free of charge, to any person obtaining a copy of
 this software and associated documentation files (the "Software"), to deal in
 the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 --------------------------------------------------------------
 */

gx.controllers.module('file_manager', [jse.source + '/vendor/qtip2/jquery.qtip.css', jse.source + '/vendor/qtip2/jquery.qtip.js', 'modal'], function (data) {

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
     * Default Options
     *
     * @type {Object}
     */
    var defaults = {};

    /**
     * Final Options
     *
     * @type {Object}
     */
    var options = $.extend(true, {}, defaults, data);

    /**
     * Module Object
     *
     * @type {Object}
     */
    var module = {};

    /**
     * @type int
     */
    var XSRF = (document.cookie.match('(^|; )_sfm_xsrf=([^;]*)') || 0)[2];

    /**
     * @type {string}
     */
    var url = jse.core.config.get('appUrl') + '/admin/admin.php';

    // ------------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------------

    function _tableSorter() {
        var $table = this;
        this.find('th:not(.no_sort)').click(function () {
            var idx = $(this).index();
            var direction = $(this).hasClass('sort_asc');
            $table.tablesortby(idx, direction);
        });
        return this;
    }

    function _tableSortBy(idx, direction) {
        var $rows = this.find('tbody tr');

        function elementToVal(a) {
            var $a_elem = $(a).find('td:nth-child(' + (idx + 1) + ')');
            var a_val = $a_elem.attr('data-sort') || $a_elem.text();
            return a_val == parseInt(a_val) ? parseInt(a_val) : a_val;
        }

        $rows.sort(function (a, b) {
            var a_val = elementToVal(a),
                b_val = elementToVal(b);
            return (a_val > b_val ? 1 : a_val == b_val ? 0 : -1) * (direction ? 1 : -1);
        });
        this.find('th').removeClass('sort_asc sort_desc');
        $(this).find('thead th:nth-child(' + (idx + 1) + ')').addClass(direction ? 'sort_desc' : 'sort_asc');
        for (var i = 0; i < $rows.length; i++) {
            this.append($rows[i]);
        }
        this.settablesortmarkers();
        return this;
    }

    function _tableReSort() {
        var $e = this.find('thead th.sort_asc, thead th.sort_desc');
        if ($e.length) {
            this.tablesortby($e.index(), $e.hasClass('sort_desc'));
        }

        return this;
    }

    function _setTableSortMarkers() {
        this.find('thead th span.indicator').remove();
        this.find('thead th.sort_asc').append('<span class="indicator"><i class="fa fa-caret-up"></i><span>');
        this.find('thead th.sort_desc').append('<span class="indicator"><i class="fa fa-caret-down"></i><span>');
        return this;
    }

    function _delete(data) {
        var _this = this;

        var modalTitle = jse.core.lang.translate('CONFIRM_DELETE_TITLE', 'file_manager');
        var modalMessage = jse.core.lang.translate('CONFIRM_DELETE_TEXT', 'file_manager');
        var modalButtons = [{
            title: jse.core.lang.translate('yes', 'buttons'),
            callback: function callback(event) {
                closeModal(event);
                $.post(url + '?do=FileManager/Delete&content=' + $this.data('content'), {
                    file: $(_this).attr('data-file'),
                    xsrf: XSRF
                }, function (response) {
                    _list();
                }, 'json');
                return false;
            }
        }, {
            title: jse.core.lang.translate('no', 'buttons'),
            callback: closeModal
        }];

        function closeModal(event) {
            $(event.target).parents('.modal').modal('hide');
        }

        jse.libs.modal.showMessage(modalTitle, modalMessage, modalButtons);
    }

    function _mkdir(e) {
        var hashval = decodeURIComponent(window.location.hash.substr(1)),
            $dir = $('#dirname');
        e.preventDefault();
        $dir.val().length && $.post(url + '?do=FileManager/Mkdir&content=' + $this.data('content') + '&file=' + hashval, {
            name: $dir.val(),
            xsrf: XSRF
        }, function (data) {
            _list();
        }, 'json');
        $dir.val('');
        return false;
    }

    function _uploadFile(file) {
        var folder = decodeURIComponent(window.location.hash.substr(1)),
            upload_progress = $('#upload_progress');

        if (file.size > $this.data('maxUploadSize')) {
            var $error_row = _renderFileSizeErrorRow(file, folder);
            upload_progress.append($error_row);
            window.setTimeout(function () {
                $error_row.fadeOut();
            }, 5000);
            return false;
        }

        var $row = _renderFileUploadRow(file, folder);
        upload_progress.append($row);
        var fd = new FormData();
        fd.append('file_data', file);
        fd.append('file', folder);
        fd.append('xsrf', XSRF);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url + '?do=FileManager/Upload&content=' + $this.data('content') + '&directory=' + folder);
        xhr.onload = function () {
            $row.remove();
            _list();
        };
        xhr.upload.onprogress = function (e) {
            if (e.lengthComputable) {
                $row.find('.progress').css('width', (e.loaded / e.total * 100 | 0) + '%');
            }
        };
        xhr.send(fd);
    }

    function _renderFileUploadRow(file, folder) {
        return $('<div/>').append($('<span class="fileuploadname" />').text((folder ? folder + '/' : '') + file.name)).append($('<div class="progress_track"><div class="progress"></div></div>')).append($('<span class="size" />').text(_formatFileSize(file.size)));
    }

    function _renderFileSizeErrorRow(file, folder) {
        return $('<div class="error" />').append($('<span class="fileuploadname" />').text('Error: ' + (folder ? folder + '/' : '') + file.name)).append($('<span/>').html(' file size - <b>' + _formatFileSize(file.size) + '</b>' + ' exceeds max upload size of <b>' + _formatFileSize($this.data('maxUploadSize')) + '</b>'));
    }

    function _fileUploadStuff() {
        $('#file_drop_target').bind('dragover', function () {
            $(this).addClass('drag_over');
            return false;
        }).bind('dragend', function () {
            $(this).removeClass('drag_over');
            return false;
        }).bind('drop', function (e) {
            e.preventDefault();
            var files = e.originalEvent.dataTransfer.files;
            $.each(files, function (k, file) {
                _uploadFile(file);
            });
            $(this).removeClass('drag_over');
        });
        $('input[type=file]').change(function (e) {
            e.preventDefault();
            $.each(this.files, function (k, file) {
                _uploadFile(file);
            });
        });
    }

    function _list() {
        var hashval = decodeURIComponent(window.location.hash.substr(1)),
            $list = $('#list'),
            $body = $('body');
        $.get(url, {
            'do': 'FileManager/List',
            'content': $this.data('content'),
            'file': hashval
        }, function (data) {
            $list.empty();
            $('#breadcrumb').empty().html(_renderBreadcrumbs(hashval));
            if (data.success) {
                if (hashval !== '') {
                    $list.append(_renderFileRow({
                        mtime: '',
                        name: '..',
                        path: hashval.substring(0, hashval.lastIndexOf('/')),
                        is_dir: true,
                        is_deleteable: false,
                        is_readable: true,
                        is_writable: true,
                        is_executable: true,
                        info_message: ''
                    }));
                }

                $.each(data.results, function (k, v) {
                    $list.append(_renderFileRow(v));
                });
                !data.results.length && $list.append('<tr><td class="empty" colspan="5">' + jse.core.lang.translate('EMPTY_DIRECTORY', 'file_manager') + '</td></tr>');
                data.is_writable ? $body.removeClass('no_write') : $body.addClass('no_write');
            } else {
                console.warn(data.error.msg);
            }
            $('.delete').on('click', _delete);
            $('#table').retablesort();
        }, 'json');
    }

    function _renderFileRow(data) {
        var data_path = data.path.indexOf('/') === 0 ? data.path.substring(1) : data.path,
            data_type = data_path.substring(data_path.lastIndexOf('.') + 1),
            image_file_extensions = ['jpg', 'jpeg', 'gif', 'png', 'bmp'],
            is_image = image_file_extensions.indexOf(data_type) > -1,
            thumb = is_image ? url + '?do=FileManager/Thumb&file=' + encodeURIComponent(data_path) + '&content=' + $this.data('content') : '',
            icon_src = is_image ? thumb : 'data:image/png;base64,' + (data.is_dir ? 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAADdgAAA3YBfdWCzAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAI0SURBVFiF7Vctb1RRED1nZu5977VQVBEQBKZ1GCDBEwy+ISgCBsMPwOH4CUXgsKQOAxq5CaKChEBqShNK222327f79n0MgpRQ2qC2twKOGjE352TO3Jl76e44S8iZsgOww+Dhi/V3nePOsQRFv679/qsnV96ehgAeWvBged3vXi+OJewMW/Q+T8YCLr18fPnNqQq4fS0/MWlQdviwVqNpp9Mvs7l8Wn50aRH4zQIAqOruxANZAG4thKmQA8D7j5OFw/iIgLXvo6mR/B36K+LNp71vVd1cTMR8BFmwTesc88/uLQ5FKO4+k4aarbuPnq98mbdo2q70hmU0VREkEeCOtqrbMprmFqM1psoYAsg0U9EBtB0YozUWzWpVZQgBxMm3YPoCiLpxRrPaYrBKRSUL5qn2AgFU0koMVlkMOo6G2SIymQCAGE/AGHRsWbCRKc8VmaBN4wBIwkZkFmxkWZDSFCwyommZSABgCmZBSsuiHahA8kA2iZYzSapAsmgHlgfdVyGLTFg3iZqQhAqZB923GGUgQhYRVElmAUXIGGVgedQ9AJJnAkqyClCEkkfdM1Pt13VHdxDpnof0jgxB+mYqO5PaCSDRIAbgDgdpKjtmwm13irsnq4ATdKeYcNvUZAt0dg5NVwEQFKrJlpn45lwh/LpbWdela4K5QsXEN61tytWr81l5YSY/n4wdQH84qjd2J6vEz+W0BOAGgLlE/AMAPQCv6e4gmWYC/QF3d/7zf8P/An4AWL/T1+B2nyIAAAAASUVORK5CYII=' : 'iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABAklEQVRIie2UMW6DMBSG/4cYkJClIhauwMgx8CnSC9EjJKcwd2HGYmAwEoMREtClEJxYakmcoWq/yX623veebZmWZcFKWZbXyTHeOeeXfWDN69/uzPP8x1mVUmiaBlLKsxACAC6cc2OPd7zYK1EUYRgGZFkG3/fPAE5fIjcCAJimCXEcGxKnAiICERkSIcQmeVoQhiHatoWUEkopJEkCAB/r+t0lHyVN023c9z201qiq6s2ZYA9jDIwx1HW9xZ4+Ihta69cK9vwLvsX6ivYf4FGIyJj/rg5uqwccd2Ar7OUdOL/kPyKY5/mhZJ53/2asgiAIHhLYMARd16EoCozj6EzwCYrrX5dC9FQIAAAAAElFTkSuQmCC'),
            link_href = data.is_dir ? _rebuildUrl() + '#' + encodeURIComponent(data_path) : jse.core.config.get('appUrl') + '/' + $this.data('subDirectory') + data_path;
        var $link = $('<a class="name"/>').attr('href', link_href).attr('target', !data.is_dir && !allow_direct_link ? '_blank' : '').text(data.name),
            allow_direct_link = $this.data('allowDirectLink'),
            $dl_icon = $('<i/>').addClass('fa fa-download'),
            $dl_link = $('<a/>').attr('href', url + '?do=FileManager/Download&content=' + $this.data('content') + '&file=' + encodeURIComponent(data_path)).attr('target', !data.is_dir && !allow_direct_link ? '_blank' : '').addClass('download').append($dl_icon),
            $delete_icon = $('<i/>').addClass('fa fa-trash-o'),
            $delete_link = $('<a/>').attr('data-file', data_path).addClass('delete').append($delete_icon),
            tooltip_options = {
            style: {
                classes: 'gx-container gx-qtip info large'
            },
            position: {
                my: 'right bottom',
                at: 'left top'
            }
        },
            $info_icon = $('<i/>').addClass('fa fa-info-circle'),
            $info_text = $('<span/>').attr('title', data.info_message !== '' ? jse.core.lang.translate(data.info_message, 'file_manager') : '').append($info_icon).qtip(tooltip_options),
            $thumb = $('<img style="vertical-align:middle"/>').attr('src', icon_src),
            $actions = $('<div/>').addClass('pull-right' + data.info_message ? '' : ' visible-on-hover').append($dl_link).append(data.is_deleteable ? $delete_link : '').append(data.info_message ? $info_text : '');

        if (!data.is_dir && !allow_direct_link) {
            $link.css('pointer-events', 'none');
        }

        return $('<tr />').addClass(data.is_dir ? 'is_dir' : '').append($('<td class="first" />').append($('<a />').attr('href', link_href).append($thumb))).append($('<td class="name" />').append($link)).append($('<td/>').attr('data-sort', data.is_dir ? -1 : data.size).html($('<span class="size" />').text(_formatFileSize(data.size)))).append($('<td/>').attr('data-sort', data.mtime).text(data.mtime !== '' ? _formatTimestamp(data.mtime) : '')).append($('<td/>').addClass('actions').addClass('action-list').append($actions));
    }

    function _renderBreadcrumbs(path) {
        var base = '';
        var data_path = $this.data('subDirectory').substring(0, $this.data('subDirectory').length - 1);
        var $html = $('<div/>').append($('<a href="' + _rebuildUrl() + '#">' + data_path + '</a></div>'));
        $.each(path.split('/'), function (k, v) {
            if (v) {
                $html.append($('<span/>').text(' ▸ ')).append($('<a/>').attr('href', _rebuildUrl() + '#' + encodeURIComponent(base + v)).text(v));
                base += v + '/';
            }
        });
        return $html;
    }

    function _rebuildUrl() {
        return url + '?do=FileManager&content=' + $this.data('content');
    }

    function _formatTimestamp(unix_timestamp) {
        var m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            d = new Date(unix_timestamp * 1000);
        return [m[d.getMonth()], ' ', d.getDate(), ', ', d.getFullYear(), " ", d.getHours() % 12 || 12, ":", (d.getMinutes() < 10 ? '0' : '') + d.getMinutes(), " ", d.getHours() >= 12 ? 'PM' : 'AM'].join('');
    }

    function _formatFileSize(bytes) {
        var s = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
        var pos = 0;
        for (; bytes >= 1000; pos++, bytes /= 1024) {
            ;
        }
        var d = Math.round(bytes * 10);
        return pos ? [parseInt(d / 10), ".", d % 10, " ", s[pos]].join('') : bytes + ' bytes';
    }

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $.data($this, 'content', $this.data('content') || 'images');
        $.fn.tablesorter = _tableSorter;
        $.fn.tablesortby = _tableSortBy;
        $.fn.retablesort = _tableReSort;
        $.fn.settablesortmarkers = _setTableSortMarkers;

        $(window).on('hashchange', _list).trigger('hashchange');
        $('#table').tablesorter();
        $('#do_mkdir').on('click', _mkdir);
        $('#mkdir').on('submit', _mkdir);

        // file upload stuff
        if ($this.data('allowUpload')) {
            _fileUploadStuff();
        }

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGVfbWFuYWdlci9maWxlX21hbmFnZXIuanMiXSwibmFtZXMiOlsiZ3giLCJjb250cm9sbGVycyIsIm1vZHVsZSIsImpzZSIsInNvdXJjZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJkZWZhdWx0cyIsIm9wdGlvbnMiLCJleHRlbmQiLCJYU1JGIiwiZG9jdW1lbnQiLCJjb29raWUiLCJtYXRjaCIsInVybCIsImNvcmUiLCJjb25maWciLCJnZXQiLCJfdGFibGVTb3J0ZXIiLCIkdGFibGUiLCJmaW5kIiwiY2xpY2siLCJpZHgiLCJpbmRleCIsImRpcmVjdGlvbiIsImhhc0NsYXNzIiwidGFibGVzb3J0YnkiLCJfdGFibGVTb3J0QnkiLCIkcm93cyIsImVsZW1lbnRUb1ZhbCIsImEiLCIkYV9lbGVtIiwiYV92YWwiLCJhdHRyIiwidGV4dCIsInBhcnNlSW50Iiwic29ydCIsImIiLCJiX3ZhbCIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJpIiwibGVuZ3RoIiwiYXBwZW5kIiwic2V0dGFibGVzb3J0bWFya2VycyIsIl90YWJsZVJlU29ydCIsIiRlIiwiX3NldFRhYmxlU29ydE1hcmtlcnMiLCJyZW1vdmUiLCJfZGVsZXRlIiwibW9kYWxUaXRsZSIsImxhbmciLCJ0cmFuc2xhdGUiLCJtb2RhbE1lc3NhZ2UiLCJtb2RhbEJ1dHRvbnMiLCJ0aXRsZSIsImNhbGxiYWNrIiwiY2xvc2VNb2RhbCIsImV2ZW50IiwicG9zdCIsImZpbGUiLCJ4c3JmIiwicmVzcG9uc2UiLCJfbGlzdCIsInRhcmdldCIsInBhcmVudHMiLCJtb2RhbCIsImxpYnMiLCJzaG93TWVzc2FnZSIsIl9ta2RpciIsImUiLCJoYXNodmFsIiwiZGVjb2RlVVJJQ29tcG9uZW50Iiwid2luZG93IiwibG9jYXRpb24iLCJoYXNoIiwic3Vic3RyIiwiJGRpciIsInByZXZlbnREZWZhdWx0IiwidmFsIiwibmFtZSIsIl91cGxvYWRGaWxlIiwiZm9sZGVyIiwidXBsb2FkX3Byb2dyZXNzIiwic2l6ZSIsIiRlcnJvcl9yb3ciLCJfcmVuZGVyRmlsZVNpemVFcnJvclJvdyIsInNldFRpbWVvdXQiLCJmYWRlT3V0IiwiJHJvdyIsIl9yZW5kZXJGaWxlVXBsb2FkUm93IiwiZmQiLCJGb3JtRGF0YSIsInhociIsIlhNTEh0dHBSZXF1ZXN0Iiwib3BlbiIsIm9ubG9hZCIsInVwbG9hZCIsIm9ucHJvZ3Jlc3MiLCJsZW5ndGhDb21wdXRhYmxlIiwiY3NzIiwibG9hZGVkIiwidG90YWwiLCJzZW5kIiwiX2Zvcm1hdEZpbGVTaXplIiwiaHRtbCIsIl9maWxlVXBsb2FkU3R1ZmYiLCJiaW5kIiwiZmlsZXMiLCJvcmlnaW5hbEV2ZW50IiwiZGF0YVRyYW5zZmVyIiwiZWFjaCIsImsiLCJjaGFuZ2UiLCIkbGlzdCIsIiRib2R5IiwiZW1wdHkiLCJfcmVuZGVyQnJlYWRjcnVtYnMiLCJzdWNjZXNzIiwiX3JlbmRlckZpbGVSb3ciLCJtdGltZSIsInBhdGgiLCJzdWJzdHJpbmciLCJsYXN0SW5kZXhPZiIsImlzX2RpciIsImlzX2RlbGV0ZWFibGUiLCJpc19yZWFkYWJsZSIsImlzX3dyaXRhYmxlIiwiaXNfZXhlY3V0YWJsZSIsImluZm9fbWVzc2FnZSIsInJlc3VsdHMiLCJ2IiwiY29uc29sZSIsIndhcm4iLCJlcnJvciIsIm1zZyIsIm9uIiwicmV0YWJsZXNvcnQiLCJkYXRhX3BhdGgiLCJpbmRleE9mIiwiZGF0YV90eXBlIiwiaW1hZ2VfZmlsZV9leHRlbnNpb25zIiwiaXNfaW1hZ2UiLCJ0aHVtYiIsImVuY29kZVVSSUNvbXBvbmVudCIsImljb25fc3JjIiwibGlua19ocmVmIiwiX3JlYnVpbGRVcmwiLCIkbGluayIsImFsbG93X2RpcmVjdF9saW5rIiwiJGRsX2ljb24iLCIkZGxfbGluayIsIiRkZWxldGVfaWNvbiIsIiRkZWxldGVfbGluayIsInRvb2x0aXBfb3B0aW9ucyIsInN0eWxlIiwiY2xhc3NlcyIsInBvc2l0aW9uIiwibXkiLCJhdCIsIiRpbmZvX2ljb24iLCIkaW5mb190ZXh0IiwicXRpcCIsIiR0aHVtYiIsIiRhY3Rpb25zIiwiX2Zvcm1hdFRpbWVzdGFtcCIsImJhc2UiLCIkaHRtbCIsInNwbGl0IiwidW5peF90aW1lc3RhbXAiLCJtIiwiZCIsIkRhdGUiLCJnZXRNb250aCIsImdldERhdGUiLCJnZXRGdWxsWWVhciIsImdldEhvdXJzIiwiZ2V0TWludXRlcyIsImpvaW4iLCJieXRlcyIsInMiLCJwb3MiLCJNYXRoIiwicm91bmQiLCJpbml0IiwiZG9uZSIsImZuIiwidGFibGVzb3J0ZXIiLCJ0cmlnZ2VyIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQ0FBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZixDQUNJLGNBREosRUFHSSxDQUNPQyxJQUFJQyxNQURYLG9DQUVPRCxJQUFJQyxNQUZYLG1DQUdJLE9BSEosQ0FISixFQVNJLFVBQVVDLElBQVYsRUFBZ0I7O0FBRVo7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7QUFLQSxRQUFNQyxRQUFRQyxFQUFFLElBQUYsQ0FBZDs7QUFFQTs7Ozs7QUFLQSxRQUFNQyxXQUFXLEVBQWpCOztBQUVBOzs7OztBQUtBLFFBQU1DLFVBQVVGLEVBQUVHLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQkYsUUFBbkIsRUFBNkJILElBQTdCLENBQWhCOztBQUVBOzs7OztBQUtBLFFBQU1ILFNBQVMsRUFBZjs7QUFFQTs7O0FBR0EsUUFBTVMsT0FBTyxDQUFDQyxTQUFTQyxNQUFULENBQWdCQyxLQUFoQixDQUFzQix5QkFBdEIsS0FBb0QsQ0FBckQsRUFBd0QsQ0FBeEQsQ0FBYjs7QUFFQTs7O0FBR0EsUUFBTUMsTUFBTVosSUFBSWEsSUFBSixDQUFTQyxNQUFULENBQWdCQyxHQUFoQixDQUFvQixRQUFwQixJQUFnQyxrQkFBNUM7O0FBR0E7QUFDQTtBQUNBOztBQUVBLGFBQVNDLFlBQVQsR0FBd0I7QUFDcEIsWUFBTUMsU0FBUyxJQUFmO0FBQ0EsYUFBS0MsSUFBTCxDQUFVLGtCQUFWLEVBQThCQyxLQUE5QixD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O0FBQzFCbkwsVUFBRUYsSUFBRixDQUFPQyxLQUFQLEVBQWMsU0FBZCxFQUEwQkEsTUFBTUQsSUFBTixDQUFXLFNBQVgsS0FBeUIsUUFBbkQ7QUFDQUUsVUFBRW9MLEVBQUYsQ0FBS0MsV0FBTCxHQUFtQnpLLFlBQW5CO0FBQ0FaLFVBQUVvTCxFQUFGLENBQUtoSyxXQUFMLEdBQW1CQyxZQUFuQjtBQUNBckIsVUFBRW9MLEVBQUYsQ0FBS2pELFdBQUwsR0FBbUI1RixZQUFuQjtBQUNBdkMsVUFBRW9MLEVBQUYsQ0FBSzlJLG1CQUFMLEdBQTJCRyxvQkFBM0I7O0FBRUF6QyxVQUFFbUUsTUFBRixFQUFVK0QsRUFBVixDQUFhLFlBQWIsRUFBMkJ6RSxLQUEzQixFQUFrQzZILE9BQWxDLENBQTBDLFlBQTFDO0FBQ0F0TCxVQUFFLFFBQUYsRUFBWXFMLFdBQVo7QUFDQXJMLFVBQUUsV0FBRixFQUFla0ksRUFBZixDQUFrQixPQUFsQixFQUEyQm5FLE1BQTNCO0FBQ0EvRCxVQUFFLFFBQUYsRUFBWWtJLEVBQVosQ0FBZSxRQUFmLEVBQXlCbkUsTUFBekI7O0FBRUE7QUFDQSxZQUFJaEUsTUFBTUQsSUFBTixDQUFXLGFBQVgsQ0FBSixFQUErQjtBQUMzQnNHO0FBQ0g7O0FBRUQrRTtBQUNILEtBbEJEOztBQW9CQSxXQUFPeEwsTUFBUDtBQUNILENBM1lMIiwiZmlsZSI6ImZpbGVfbWFuYWdlci9maWxlX21hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGZpbGVfbWFuYWdlci5qcyAyMDE3LTAzLTI0XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNyBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gXG4gYmFzZWQgb246XG4gKGMpIDIwMTMgSm9obiBDYW1wYmVsbCAoamNhbXBiZWxsMSkgLSBTaW1wbGUgUEhQIEZpbGUgTWFuYWdlclxuIFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZSAoTUlUKVxuIFxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHkgb2ZcbiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluXG4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0b1xuIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mXG4gdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuIFxuIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTXG4gRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SXG4gQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSXG4gSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU5cbiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuZ3guY29udHJvbGxlcnMubW9kdWxlKFxuICAgICdmaWxlX21hbmFnZXInLFxuXG4gICAgW1xuICAgICAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3IvcXRpcDIvanF1ZXJ5LnF0aXAuY3NzYCxcbiAgICAgICAgYCR7anNlLnNvdXJjZX0vdmVuZG9yL3F0aXAyL2pxdWVyeS5xdGlwLmpzYCxcbiAgICAgICAgJ21vZGFsJyxcbiAgICBdLFxuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERlZmF1bHQgT3B0aW9uc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgZGVmYXVsdHMgPSB7fTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmluYWwgT3B0aW9uc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBPYmplY3RcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAdHlwZSBpbnRcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IFhTUkYgPSAoZG9jdW1lbnQuY29va2llLm1hdGNoKCcoXnw7IClfc2ZtX3hzcmY9KFteO10qKScpIHx8IDApWzJdO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgdXJsID0ganNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJykgKyAnL2FkbWluL2FkbWluLnBocCc7XG5cblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gRlVOQ1RJT05TXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIGZ1bmN0aW9uIF90YWJsZVNvcnRlcigpIHtcbiAgICAgICAgICAgIGNvbnN0ICR0YWJsZSA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLmZpbmQoJ3RoOm5vdCgubm9fc29ydCknKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaWR4ID0gJCh0aGlzKS5pbmRleCgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9ICQodGhpcykuaGFzQ2xhc3MoJ3NvcnRfYXNjJyk7XG4gICAgICAgICAgICAgICAgJHRhYmxlLnRhYmxlc29ydGJ5KGlkeCwgZGlyZWN0aW9uKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBfdGFibGVTb3J0QnkoaWR4LCBkaXJlY3Rpb24pIHtcbiAgICAgICAgICAgIGNvbnN0ICRyb3dzID0gdGhpcy5maW5kKCd0Ym9keSB0cicpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBlbGVtZW50VG9WYWwoYSkge1xuICAgICAgICAgICAgICAgIGNvbnN0ICRhX2VsZW0gPSAkKGEpLmZpbmQoJ3RkOm50aC1jaGlsZCgnICsgKGlkeCArIDEpICsgJyknKTtcbiAgICAgICAgICAgICAgICBjb25zdCBhX3ZhbCA9ICRhX2VsZW0uYXR0cignZGF0YS1zb3J0JykgfHwgJGFfZWxlbS50ZXh0KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChhX3ZhbCA9PSBwYXJzZUludChhX3ZhbCkgPyBwYXJzZUludChhX3ZhbCkgOiBhX3ZhbCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRyb3dzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhX3ZhbCA9IGVsZW1lbnRUb1ZhbChhKSwgYl92YWwgPSBlbGVtZW50VG9WYWwoYik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChhX3ZhbCA+IGJfdmFsID8gMSA6IChhX3ZhbCA9PSBiX3ZhbCA/IDAgOiAtMSkpICogKGRpcmVjdGlvbiA/IDEgOiAtMSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuZmluZCgndGgnKS5yZW1vdmVDbGFzcygnc29ydF9hc2Mgc29ydF9kZXNjJyk7XG4gICAgICAgICAgICAkKHRoaXMpLmZpbmQoJ3RoZWFkIHRoOm50aC1jaGlsZCgnICsgKGlkeCArIDEpICsgJyknKS5hZGRDbGFzcyhkaXJlY3Rpb24gPyAnc29ydF9kZXNjJyA6ICdzb3J0X2FzYycpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAkcm93cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwZW5kKCRyb3dzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2V0dGFibGVzb3J0bWFya2VycygpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBfdGFibGVSZVNvcnQoKSB7XG4gICAgICAgICAgICBjb25zdCAkZSA9IHRoaXMuZmluZCgndGhlYWQgdGguc29ydF9hc2MsIHRoZWFkIHRoLnNvcnRfZGVzYycpO1xuICAgICAgICAgICAgaWYgKCRlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMudGFibGVzb3J0YnkoJGUuaW5kZXgoKSwgJGUuaGFzQ2xhc3MoJ3NvcnRfZGVzYycpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBfc2V0VGFibGVTb3J0TWFya2VycygpIHtcbiAgICAgICAgICAgIHRoaXMuZmluZCgndGhlYWQgdGggc3Bhbi5pbmRpY2F0b3InKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIHRoaXMuZmluZCgndGhlYWQgdGguc29ydF9hc2MnKS5hcHBlbmQoJzxzcGFuIGNsYXNzPVwiaW5kaWNhdG9yXCI+PGkgY2xhc3M9XCJmYSBmYS1jYXJldC11cFwiPjwvaT48c3Bhbj4nKTtcbiAgICAgICAgICAgIHRoaXMuZmluZCgndGhlYWQgdGguc29ydF9kZXNjJykuYXBwZW5kKCc8c3BhbiBjbGFzcz1cImluZGljYXRvclwiPjxpIGNsYXNzPVwiZmEgZmEtY2FyZXQtZG93blwiPjwvaT48c3Bhbj4nKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gX2RlbGV0ZShkYXRhKSB7XG4gICAgICAgICAgICBjb25zdCBtb2RhbFRpdGxlID0ganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0NPTkZJUk1fREVMRVRFX1RJVExFJywgJ2ZpbGVfbWFuYWdlcicpO1xuICAgICAgICAgICAgY29uc3QgbW9kYWxNZXNzYWdlID0ganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0NPTkZJUk1fREVMRVRFX1RFWFQnLCAnZmlsZV9tYW5hZ2VyJyk7XG4gICAgICAgICAgICBjb25zdCBtb2RhbEJ1dHRvbnMgPSBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZToganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ3llcycsICdidXR0b25zJyksXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBldmVudCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zZU1vZGFsKGV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQucG9zdCh1cmwgKyAnP2RvPUZpbGVNYW5hZ2VyL0RlbGV0ZSZjb250ZW50PScgKyAkdGhpcy5kYXRhKCdjb250ZW50JyksIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiAkKHRoaXMpLmF0dHIoJ2RhdGEtZmlsZScpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhzcmY6IFhTUkZcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9saXN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAnanNvbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnbm8nLCAnYnV0dG9ucycpLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogY2xvc2VNb2RhbFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNsb3NlTW9kYWwoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAkKGV2ZW50LnRhcmdldCkucGFyZW50cygnLm1vZGFsJykubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAganNlLmxpYnMubW9kYWwuc2hvd01lc3NhZ2UobW9kYWxUaXRsZSwgbW9kYWxNZXNzYWdlLCBtb2RhbEJ1dHRvbnMpXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBfbWtkaXIoZSkge1xuICAgICAgICAgICAgbGV0IGhhc2h2YWwgPSBkZWNvZGVVUklDb21wb25lbnQod2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyKDEpKSxcbiAgICAgICAgICAgICAgICAkZGlyID0gJCgnI2Rpcm5hbWUnKTtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICRkaXIudmFsKCkubGVuZ3RoICYmICQucG9zdCh1cmwgKyAnP2RvPUZpbGVNYW5hZ2VyL01rZGlyJmNvbnRlbnQ9JyArICR0aGlzLmRhdGEoJ2NvbnRlbnQnKSArICcmZmlsZT0nXG4gICAgICAgICAgICAgICAgKyBoYXNodmFsLCB7XG4gICAgICAgICAgICAgICAgbmFtZTogJGRpci52YWwoKSxcbiAgICAgICAgICAgICAgICB4c3JmOiBYU1JGXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIF9saXN0KCk7XG4gICAgICAgICAgICB9LCAnanNvbicpO1xuICAgICAgICAgICAgJGRpci52YWwoJycpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gX3VwbG9hZEZpbGUoZmlsZSkge1xuICAgICAgICAgICAgY29uc3QgZm9sZGVyID0gZGVjb2RlVVJJQ29tcG9uZW50KHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cigxKSksXG4gICAgICAgICAgICAgICAgdXBsb2FkX3Byb2dyZXNzID0gJCgnI3VwbG9hZF9wcm9ncmVzcycpO1xuXG4gICAgICAgICAgICBpZiAoZmlsZS5zaXplID4gJHRoaXMuZGF0YSgnbWF4VXBsb2FkU2l6ZScpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgJGVycm9yX3JvdyA9IF9yZW5kZXJGaWxlU2l6ZUVycm9yUm93KGZpbGUsIGZvbGRlcik7XG4gICAgICAgICAgICAgICAgdXBsb2FkX3Byb2dyZXNzLmFwcGVuZCgkZXJyb3Jfcm93KTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICRlcnJvcl9yb3cuZmFkZU91dCgpO1xuICAgICAgICAgICAgICAgIH0sIDUwMDApO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0ICRyb3cgPSBfcmVuZGVyRmlsZVVwbG9hZFJvdyhmaWxlLCBmb2xkZXIpO1xuICAgICAgICAgICAgdXBsb2FkX3Byb2dyZXNzLmFwcGVuZCgkcm93KTtcbiAgICAgICAgICAgIGxldCBmZCA9IG5ldyBGb3JtRGF0YSgpO1xuICAgICAgICAgICAgZmQuYXBwZW5kKCdmaWxlX2RhdGEnLCBmaWxlKTtcbiAgICAgICAgICAgIGZkLmFwcGVuZCgnZmlsZScsIGZvbGRlcik7XG4gICAgICAgICAgICBmZC5hcHBlbmQoJ3hzcmYnLCBYU1JGKTtcbiAgICAgICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgIHhoci5vcGVuKCdQT1NUJywgdXJsICsgJz9kbz1GaWxlTWFuYWdlci9VcGxvYWQmY29udGVudD0nICsgJHRoaXMuZGF0YSgnY29udGVudCcpICsgJyZkaXJlY3Rvcnk9JyArIGZvbGRlcik7XG4gICAgICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICRyb3cucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgX2xpc3QoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB4aHIudXBsb2FkLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGlmIChlLmxlbmd0aENvbXB1dGFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgJHJvdy5maW5kKCcucHJvZ3Jlc3MnKS5jc3MoJ3dpZHRoJywgKGUubG9hZGVkIC8gZS50b3RhbCAqIDEwMCB8IDApICsgJyUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgeGhyLnNlbmQoZmQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gX3JlbmRlckZpbGVVcGxvYWRSb3coZmlsZSwgZm9sZGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gJCgnPGRpdi8+JylcbiAgICAgICAgICAgICAgICAuYXBwZW5kKCQoJzxzcGFuIGNsYXNzPVwiZmlsZXVwbG9hZG5hbWVcIiAvPicpLnRleHQoKGZvbGRlciA/IGZvbGRlciArICcvJyA6ICcnKSArIGZpbGUubmFtZSkpXG4gICAgICAgICAgICAgICAgLmFwcGVuZCgkKCc8ZGl2IGNsYXNzPVwicHJvZ3Jlc3NfdHJhY2tcIj48ZGl2IGNsYXNzPVwicHJvZ3Jlc3NcIj48L2Rpdj48L2Rpdj4nKSlcbiAgICAgICAgICAgICAgICAuYXBwZW5kKCQoJzxzcGFuIGNsYXNzPVwic2l6ZVwiIC8+JykudGV4dChfZm9ybWF0RmlsZVNpemUoZmlsZS5zaXplKSkpXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBfcmVuZGVyRmlsZVNpemVFcnJvclJvdyhmaWxlLCBmb2xkZXIpIHtcbiAgICAgICAgICAgIHJldHVybiAkKCc8ZGl2IGNsYXNzPVwiZXJyb3JcIiAvPicpXG4gICAgICAgICAgICAgICAgLmFwcGVuZCgkKCc8c3BhbiBjbGFzcz1cImZpbGV1cGxvYWRuYW1lXCIgLz4nKVxuICAgICAgICAgICAgICAgICAgICAudGV4dCgnRXJyb3I6ICcgKyAoZm9sZGVyID8gZm9sZGVyICsgJy8nIDogJycpICsgZmlsZS5uYW1lKSlcbiAgICAgICAgICAgICAgICAuYXBwZW5kKCQoJzxzcGFuLz4nKS5odG1sKCcgZmlsZSBzaXplIC0gPGI+JyArIF9mb3JtYXRGaWxlU2l6ZShmaWxlLnNpemUpICsgJzwvYj4nXG4gICAgICAgICAgICAgICAgICAgICsgJyBleGNlZWRzIG1heCB1cGxvYWQgc2l6ZSBvZiA8Yj4nICsgX2Zvcm1hdEZpbGVTaXplKCR0aGlzLmRhdGEoJ21heFVwbG9hZFNpemUnKSkgKyAnPC9iPicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIF9maWxlVXBsb2FkU3R1ZmYoKSB7XG4gICAgICAgICAgICAkKCcjZmlsZV9kcm9wX3RhcmdldCcpLmJpbmQoJ2RyYWdvdmVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2RyYWdfb3ZlcicpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH0pLmJpbmQoJ2RyYWdlbmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnZHJhZ19vdmVyJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSkuYmluZCgnZHJvcCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVzID0gZS5vcmlnaW5hbEV2ZW50LmRhdGFUcmFuc2Zlci5maWxlcztcbiAgICAgICAgICAgICAgICAkLmVhY2goZmlsZXMsIGZ1bmN0aW9uIChrLCBmaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIF91cGxvYWRGaWxlKGZpbGUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2RyYWdfb3ZlcicpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCdpbnB1dFt0eXBlPWZpbGVdJykuY2hhbmdlKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICQuZWFjaCh0aGlzLmZpbGVzLCBmdW5jdGlvbiAoaywgZmlsZSkge1xuICAgICAgICAgICAgICAgICAgICBfdXBsb2FkRmlsZShmaWxlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gX2xpc3QoKSB7XG4gICAgICAgICAgICBjb25zdCBoYXNodmFsID0gZGVjb2RlVVJJQ29tcG9uZW50KHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cigxKSksXG4gICAgICAgICAgICAgICAgJGxpc3QgPSAkKCcjbGlzdCcpLFxuICAgICAgICAgICAgICAgICRib2R5ID0gJCgnYm9keScpO1xuICAgICAgICAgICAgJC5nZXQodXJsLCB7XG4gICAgICAgICAgICAgICAgJ2RvJzogJ0ZpbGVNYW5hZ2VyL0xpc3QnLFxuICAgICAgICAgICAgICAgICdjb250ZW50JzogJHRoaXMuZGF0YSgnY29udGVudCcpLFxuICAgICAgICAgICAgICAgICdmaWxlJzogaGFzaHZhbFxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAkbGlzdC5lbXB0eSgpO1xuICAgICAgICAgICAgICAgICQoJyNicmVhZGNydW1iJykuZW1wdHkoKS5odG1sKF9yZW5kZXJCcmVhZGNydW1icyhoYXNodmFsKSk7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaGFzaHZhbCAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRsaXN0LmFwcGVuZChfcmVuZGVyRmlsZVJvdyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbXRpbWU6ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICcuLicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogaGFzaHZhbC5zdWJzdHJpbmcoMCwgaGFzaHZhbC5sYXN0SW5kZXhPZignLycpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc19kaXI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNfZGVsZXRlYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNfcmVhZGFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNfd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNfZXhlY3V0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmZvX21lc3NhZ2U6ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAkLmVhY2goZGF0YS5yZXN1bHRzLCBmdW5jdGlvbiAoaywgdikge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGxpc3QuYXBwZW5kKF9yZW5kZXJGaWxlUm93KHYpKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICFkYXRhLnJlc3VsdHMubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgICYmICRsaXN0LmFwcGVuZCgnPHRyPjx0ZCBjbGFzcz1cImVtcHR5XCIgY29sc3Bhbj1cIjVcIj4nXG4gICAgICAgICAgICAgICAgICAgICAgICArIGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdFTVBUWV9ESVJFQ1RPUlknLCAnZmlsZV9tYW5hZ2VyJykgKyAnPC90ZD48L3RyPicpXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuaXNfd3JpdGFibGUgPyAkYm9keS5yZW1vdmVDbGFzcygnbm9fd3JpdGUnKSA6ICRib2R5LmFkZENsYXNzKCdub193cml0ZScpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihkYXRhLmVycm9yLm1zZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICQoJy5kZWxldGUnKS5vbignY2xpY2snLCBfZGVsZXRlKTtcbiAgICAgICAgICAgICAgICAkKCcjdGFibGUnKS5yZXRhYmxlc29ydCgpO1xuICAgICAgICAgICAgfSwgJ2pzb24nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIF9yZW5kZXJGaWxlUm93KGRhdGEpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFfcGF0aCA9IGRhdGEucGF0aC5pbmRleE9mKCcvJykgPT09IDAgPyBkYXRhLnBhdGguc3Vic3RyaW5nKDEpIDogZGF0YS5wYXRoLFxuICAgICAgICAgICAgICAgIGRhdGFfdHlwZSA9IGRhdGFfcGF0aC5zdWJzdHJpbmcoZGF0YV9wYXRoLmxhc3RJbmRleE9mKCcuJykgKyAxKSxcbiAgICAgICAgICAgICAgICBpbWFnZV9maWxlX2V4dGVuc2lvbnMgPSBbJ2pwZycsICdqcGVnJywgJ2dpZicsICdwbmcnLCAnYm1wJ10sXG4gICAgICAgICAgICAgICAgaXNfaW1hZ2UgPSBpbWFnZV9maWxlX2V4dGVuc2lvbnMuaW5kZXhPZihkYXRhX3R5cGUpID4gLTEsXG4gICAgICAgICAgICAgICAgdGh1bWIgPSBpc19pbWFnZSA/IHVybCArICc/ZG89RmlsZU1hbmFnZXIvVGh1bWImZmlsZT0nICsgZW5jb2RlVVJJQ29tcG9uZW50KGRhdGFfcGF0aCkgKyAnJmNvbnRlbnQ9J1xuICAgICAgICAgICAgICAgICAgICArICR0aGlzLmRhdGEoJ2NvbnRlbnQnKSA6ICcnLFxuICAgICAgICAgICAgICAgIGljb25fc3JjID0gaXNfaW1hZ2UgPyB0aHVtYiA6ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsJ1xuICAgICAgICAgICAgICAgICAgICArIChkYXRhLmlzX2RpciA/ICdpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ0FBQUFBZ0NBWUFBQUJ6ZW5yMEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUFBbHdTRmx6QUFBRGRnQUFBM1lCZmRXQ3pBQUFBQmwwUlZoMFUyOW1kSGRoY21VQWQzZDNMbWx1YTNOallYQmxMbTl5WjV2dVBCb0FBQUkwU1VSQlZGaUY3VmN0YjFSUkVEMW5adTU5NzdWUVZCRVFCS1oxR0NEQkV3eStJU2dDQnNNUHdPSDRDVVhnc0tRT0F4cTVDYUtDaEVCcVNoTksyMjIzMjdmNzluME1ncFJRMnFDMnR3S09HakUzNTJUTzNKbDc2ZTQ0UzhpWnNnT3d3K0RoaS9WM25lUE9zUVJGdjY3OS9xc25WOTZlaGdBZVd2QmdlZDN2WGkrT0pld01XL1ErVDhZQ0xyMThmUG5OcVFxNGZTMC9NV2xRZHZpd1ZxTnBwOU12czdsOFduNTBhUkg0elFJQXFPcnV4QU5aQUc0dGhLbVFBOEQ3ajVPRncvaUlnTFh2bzZtUi9CMzZLK0xOcDcxdlZkMWNUTVI4QkZtd1Rlc2M4OC91TFE1RktPNCtrNGFhcmJ1UG5xOThtYmRvMnE3MGhtVTBWUkVrRWVDT3RxcmJNcHJtRnFNMXBzb1lBc2cwVTlFQnRCMFlvelVXeldwVlpRZ0J4TW0zWVBvQ2lMcHhSclBhWXJCS1JTVUw1cW4yQWdGVTBrb01WbGtNT282RzJTSXltUUNBR0UvQUdIUnNXYkNSS2M4Vm1hQk40d0JJd2taa0ZteGtXWkRTRkN3eW9tbVpTQUJnQ21aQlNzdWlIYWhBOGtBMmlaWXpTYXBBc21nSGxnZmRWeUdMVEZnM2lacVFoQXFaQjkyM0dHVWdRaFlSVkVsbUFVWElHR1ZnZWRROUFKSm5Ba3F5Q2xDRWtrZmRNMVB0MTNWSGR4RHBub2Ywamd4QittWXFPNVBhQ1NEUklBYmdEZ2RwS2p0bXdtMTNpcnNucTRBVGRLZVljTnZVWkF0MGRnNU5Wd0VRRktySmxwbjQ1bHdoL0xwYldkZWxhNEs1UXNYRU42MXR5dFdyODFsNVlTWS9uNHdkUUg4NHFqZDJKNnZFeitXMEJPQUdnTGxFL0FNQVBRQ3Y2ZTRnbVdZQy9RRjNkLzd6ZjhQL0FuNEFXTC9UMStCMm55SUFBQUFBU1VWT1JLNUNZSUk9JyA6ICdpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQmdBQUFBWUNBWUFBQURnZHozNEFBQUJBa2xFUVZSSWllMlVNVzZETUJTRy80Y1lrSkNsSWhhdXdNZ3g4Q25TQzlFakpLY3dkMkhHWW1Bd0VvTVJFdENsRUp4WWFrbWNvV3EveVg2MjN2ZWViWm1XWmNGS1daYlh5VEhlT2VlWGZXRE42OS91elBQOHgxbVZVbWlhQmxMS3N4QUNBQzZjYzJPUGQ3ellLMUVVWVJnR1pGa0czL2ZQQUU1ZklqY0NBSmltQ1hFY0d4S25BaUlDRVJrU0ljUW1lVm9RaGlIYXRvV1VFa29wSkVrQ0FCL3IrdDBsSHlWTjAyM2M5ejIwMXFpcTZzMlpZQTlqREl3eDFIVzl4WjQrSWh0YTY5Y0s5dndMdnNYNml2WWY0RkdJeUpqL3JnNXVxd2NjZDJBcjdPVWRPTC9rUHlLWTUvbWhaSjUzLzJhc2dpQUlIaExZTUFSZDE2RW9Db3pqNkV6d0NZcnJYNWRDOUZRSUFBQUFBRWxGVGtTdVFtQ0MnKSxcbiAgICAgICAgICAgICAgICBsaW5rX2hyZWYgPSBkYXRhLmlzX2RpciA/IF9yZWJ1aWxkVXJsKCkgKyAnIydcbiAgICAgICAgICAgICAgICAgICAgKyBlbmNvZGVVUklDb21wb25lbnQoZGF0YV9wYXRoKSA6IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpICsgJy8nICsgJHRoaXMuZGF0YSgnc3ViRGlyZWN0b3J5JylcbiAgICAgICAgICAgICAgICAgICAgKyBkYXRhX3BhdGg7XG4gICAgICAgICAgICBjb25zdCAkbGluayA9ICQoJzxhIGNsYXNzPVwibmFtZVwiLz4nKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cignaHJlZicsIGxpbmtfaHJlZilcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ3RhcmdldCcsICghZGF0YS5pc19kaXIgJiYgIWFsbG93X2RpcmVjdF9saW5rKSA/ICdfYmxhbmsnIDogJycpXG4gICAgICAgICAgICAgICAgICAgIC50ZXh0KGRhdGEubmFtZSksXG4gICAgICAgICAgICAgICAgYWxsb3dfZGlyZWN0X2xpbmsgPSAkdGhpcy5kYXRhKCdhbGxvd0RpcmVjdExpbmsnKSxcbiAgICAgICAgICAgICAgICAkZGxfaWNvbiA9ICQoJzxpLz4nKS5hZGRDbGFzcygnZmEgZmEtZG93bmxvYWQnKSxcbiAgICAgICAgICAgICAgICAkZGxfbGluayA9ICQoJzxhLz4nKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cignaHJlZicsIHVybCArICc/ZG89RmlsZU1hbmFnZXIvRG93bmxvYWQmY29udGVudD0nICsgJHRoaXMuZGF0YSgnY29udGVudCcpICsgJyZmaWxlPSdcbiAgICAgICAgICAgICAgICAgICAgICAgICsgZW5jb2RlVVJJQ29tcG9uZW50KGRhdGFfcGF0aCkpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCd0YXJnZXQnLCAoIWRhdGEuaXNfZGlyICYmICFhbGxvd19kaXJlY3RfbGluaykgPyAnX2JsYW5rJyA6ICcnKVxuICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ2Rvd25sb2FkJylcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZCgkZGxfaWNvbiksXG4gICAgICAgICAgICAgICAgJGRlbGV0ZV9pY29uID0gJCgnPGkvPicpLmFkZENsYXNzKCdmYSBmYS10cmFzaC1vJyksXG4gICAgICAgICAgICAgICAgJGRlbGV0ZV9saW5rID0gJCgnPGEvPicpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCdkYXRhLWZpbGUnLCBkYXRhX3BhdGgpXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnZGVsZXRlJylcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZCgkZGVsZXRlX2ljb24pLFxuICAgICAgICAgICAgICAgIHRvb2x0aXBfb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzZXM6ICdneC1jb250YWluZXIgZ3gtcXRpcCBpbmZvIGxhcmdlJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbXk6ICdyaWdodCBib3R0b20nLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXQ6ICdsZWZ0IHRvcCdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJGluZm9faWNvbiA9ICQoJzxpLz4nKS5hZGRDbGFzcygnZmEgZmEtaW5mby1jaXJjbGUnKSxcbiAgICAgICAgICAgICAgICAkaW5mb190ZXh0ID0gJCgnPHNwYW4vPicpLmF0dHIoJ3RpdGxlJywgKGRhdGEuaW5mb19tZXNzYWdlICE9PSAnJyA/IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKGRhdGEuaW5mb19tZXNzYWdlLCAnZmlsZV9tYW5hZ2VyJykgOiAnJykpXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoJGluZm9faWNvbikucXRpcCh0b29sdGlwX29wdGlvbnMpLFxuXG4gICAgICAgICAgICAgICAgJHRodW1iID0gJCgnPGltZyBzdHlsZT1cInZlcnRpY2FsLWFsaWduOm1pZGRsZVwiLz4nKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cignc3JjJywgaWNvbl9zcmMpLFxuXG4gICAgICAgICAgICAgICAgJGFjdGlvbnMgPSAkKCc8ZGl2Lz4nKVxuICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3B1bGwtcmlnaHQnICsgZGF0YS5pbmZvX21lc3NhZ2UgPyAnJyA6ICcgdmlzaWJsZS1vbi1ob3ZlcicpXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoJGRsX2xpbmspXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoZGF0YS5pc19kZWxldGVhYmxlID8gJGRlbGV0ZV9saW5rIDogJycpXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoZGF0YS5pbmZvX21lc3NhZ2UgPyAkaW5mb190ZXh0IDogJycpO1xuXG5cbiAgICAgICAgICAgIGlmICghZGF0YS5pc19kaXIgJiYgIWFsbG93X2RpcmVjdF9saW5rKSB7XG4gICAgICAgICAgICAgICAgJGxpbmsuY3NzKCdwb2ludGVyLWV2ZW50cycsICdub25lJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAkKCc8dHIgLz4nKVxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhkYXRhLmlzX2RpciA/ICdpc19kaXInIDogJycpXG4gICAgICAgICAgICAgICAgLmFwcGVuZCgkKCc8dGQgY2xhc3M9XCJmaXJzdFwiIC8+JykuYXBwZW5kKCQoJzxhIC8+JykuYXR0cignaHJlZicsIGxpbmtfaHJlZikuYXBwZW5kKCR0aHVtYikpKVxuICAgICAgICAgICAgICAgIC5hcHBlbmQoJCgnPHRkIGNsYXNzPVwibmFtZVwiIC8+JykuYXBwZW5kKCRsaW5rKSlcbiAgICAgICAgICAgICAgICAuYXBwZW5kKCQoJzx0ZC8+JykuYXR0cignZGF0YS1zb3J0JywgZGF0YS5pc19kaXIgPyAtMSA6IGRhdGEuc2l6ZSlcbiAgICAgICAgICAgICAgICAgICAgLmh0bWwoJCgnPHNwYW4gY2xhc3M9XCJzaXplXCIgLz4nKS50ZXh0KF9mb3JtYXRGaWxlU2l6ZShkYXRhLnNpemUpKSkpXG4gICAgICAgICAgICAgICAgLmFwcGVuZCgkKCc8dGQvPicpLmF0dHIoJ2RhdGEtc29ydCcsIGRhdGEubXRpbWUpLnRleHQoZGF0YS5tdGltZSAhPT0gJycgPyBfZm9ybWF0VGltZXN0YW1wKGRhdGEubXRpbWUpIDogJycpKVxuICAgICAgICAgICAgICAgIC5hcHBlbmQoJCgnPHRkLz4nKS5hZGRDbGFzcygnYWN0aW9ucycpLmFkZENsYXNzKCdhY3Rpb24tbGlzdCcpLmFwcGVuZCgkYWN0aW9ucykpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gX3JlbmRlckJyZWFkY3J1bWJzKHBhdGgpIHtcbiAgICAgICAgICAgIGxldCBiYXNlID0gJyc7XG4gICAgICAgICAgICBjb25zdCBkYXRhX3BhdGggPSAkdGhpcy5kYXRhKCdzdWJEaXJlY3RvcnknKS5zdWJzdHJpbmcoMCwgJHRoaXMuZGF0YSgnc3ViRGlyZWN0b3J5JykubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICBjb25zdCAkaHRtbCA9ICQoJzxkaXYvPicpLmFwcGVuZCgkKCc8YSBocmVmPVwiJyArIF9yZWJ1aWxkVXJsKCkgKyAnI1wiPicgKyBkYXRhX3BhdGggKyAnPC9hPjwvZGl2PicpKTtcbiAgICAgICAgICAgICQuZWFjaChwYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uIChrLCB2KSB7XG4gICAgICAgICAgICAgICAgaWYgKHYpIHtcbiAgICAgICAgICAgICAgICAgICAgJGh0bWwuYXBwZW5kKCQoJzxzcGFuLz4nKS50ZXh0KCcg4pa4ICcpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZCgkKCc8YS8+JykuYXR0cignaHJlZicsIF9yZWJ1aWxkVXJsKCkgKyAnIycgKyBlbmNvZGVVUklDb21wb25lbnQoYmFzZSArIHYpKS50ZXh0KHYpKTtcbiAgICAgICAgICAgICAgICAgICAgYmFzZSArPSB2ICsgJy8nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuICRodG1sO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gX3JlYnVpbGRVcmwoKSB7XG4gICAgICAgICAgICByZXR1cm4gdXJsICsgJz9kbz1GaWxlTWFuYWdlciZjb250ZW50PScgKyAkdGhpcy5kYXRhKCdjb250ZW50Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBfZm9ybWF0VGltZXN0YW1wKHVuaXhfdGltZXN0YW1wKSB7XG4gICAgICAgICAgICBjb25zdCBtID0gWydKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsICdPY3QnLCAnTm92JywgJ0RlYyddLFxuICAgICAgICAgICAgICAgIGQgPSBuZXcgRGF0ZSh1bml4X3RpbWVzdGFtcCAqIDEwMDApO1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICBtW2QuZ2V0TW9udGgoKV0sICcgJywgZC5nZXREYXRlKCksICcsICcsIGQuZ2V0RnVsbFllYXIoKSwgXCIgXCIsXG4gICAgICAgICAgICAgICAgKGQuZ2V0SG91cnMoKSAlIDEyIHx8IDEyKSwgXCI6XCIsIChkLmdldE1pbnV0ZXMoKSA8IDEwID8gJzAnIDogJycpICsgZC5nZXRNaW51dGVzKCksXG4gICAgICAgICAgICAgICAgXCIgXCIsIGQuZ2V0SG91cnMoKSA+PSAxMiA/ICdQTScgOiAnQU0nXG4gICAgICAgICAgICBdLmpvaW4oJycpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gX2Zvcm1hdEZpbGVTaXplKGJ5dGVzKSB7XG4gICAgICAgICAgICBjb25zdCBzID0gWydieXRlcycsICdLQicsICdNQicsICdHQicsICdUQicsICdQQicsICdFQiddO1xuICAgICAgICAgICAgbGV0IHBvcyA9IDA7XG4gICAgICAgICAgICBmb3IgKDsgYnl0ZXMgPj0gMTAwMDsgcG9zKyssIGJ5dGVzIC89IDEwMjQpIHtcbiAgICAgICAgICAgICAgICA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBkID0gTWF0aC5yb3VuZChieXRlcyAqIDEwKTtcbiAgICAgICAgICAgIHJldHVybiBwb3MgPyBbcGFyc2VJbnQoZCAvIDEwKSwgXCIuXCIsIGQgJSAxMCwgXCIgXCIsIHNbcG9zXV0uam9pbignJykgOiBieXRlcyArICcgYnl0ZXMnO1xuICAgICAgICB9XG5cblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgJC5kYXRhKCR0aGlzLCAnY29udGVudCcsICgkdGhpcy5kYXRhKCdjb250ZW50JykgfHwgJ2ltYWdlcycpKTtcbiAgICAgICAgICAgICQuZm4udGFibGVzb3J0ZXIgPSBfdGFibGVTb3J0ZXI7XG4gICAgICAgICAgICAkLmZuLnRhYmxlc29ydGJ5ID0gX3RhYmxlU29ydEJ5O1xuICAgICAgICAgICAgJC5mbi5yZXRhYmxlc29ydCA9IF90YWJsZVJlU29ydDtcbiAgICAgICAgICAgICQuZm4uc2V0dGFibGVzb3J0bWFya2VycyA9IF9zZXRUYWJsZVNvcnRNYXJrZXJzO1xuXG4gICAgICAgICAgICAkKHdpbmRvdykub24oJ2hhc2hjaGFuZ2UnLCBfbGlzdCkudHJpZ2dlcignaGFzaGNoYW5nZScpO1xuICAgICAgICAgICAgJCgnI3RhYmxlJykudGFibGVzb3J0ZXIoKTtcbiAgICAgICAgICAgICQoJyNkb19ta2RpcicpLm9uKCdjbGljaycsIF9ta2Rpcik7XG4gICAgICAgICAgICAkKCcjbWtkaXInKS5vbignc3VibWl0JywgX21rZGlyKTtcblxuICAgICAgICAgICAgLy8gZmlsZSB1cGxvYWQgc3R1ZmZcbiAgICAgICAgICAgIGlmICgkdGhpcy5kYXRhKCdhbGxvd1VwbG9hZCcpKSB7XG4gICAgICAgICAgICAgICAgX2ZpbGVVcGxvYWRTdHVmZigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9XG4pOyJdfQ==
