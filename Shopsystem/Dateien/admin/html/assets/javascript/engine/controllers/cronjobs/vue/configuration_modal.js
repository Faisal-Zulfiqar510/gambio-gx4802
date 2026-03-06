'use strict';

cronjobs.controllers.module('configuration_modal', ['xhr'], function () {
    return {
        vue: true,
        name: 'gx-cronjobs-configuration-modal',
        parent: 'gx-cronjobs-overview',
        template: '#cronjobs-configuration-modal',
        props: {
            cronjob: {
                required: true,
                type: Object
            }
        },
        data: function data() {
            return {
                lang: {
                    title_configuration_modal: jse.core.lang.translate('title_configuration_modal', 'cronjobs'),
                    button_close: jse.core.lang.translate('BUTTON_CLOSE', 'admin_buttons'),
                    button_save: jse.core.lang.translate('BUTTON_SAVE', 'admin_buttons')
                },
                inProcess: false
            };
        },
        watch: {
            cronjob: function cronjob(_cronjob) {
                var $configurationModal = $('.configuration');

                if (Object.keys(_cronjob).length > 0) {
                    $configurationModal.modal('show');
                    return;
                }
            }
        },
        methods: {
            getPhrase: function getPhrase(title) {

                console.log(title);

                var phraseSection = title.split('.');
                var section = phraseSection[0];
                var phrase = phraseSection[1];

                return jse.core.lang.translate(phrase, section);
            },
            getConfigurationTitle: function getConfigurationTitle(cronjob) {
                if (undefined === cronjob.name) {
                    return '';
                }
                var section = 'cronjob_' + this.camelToSnake(cronjob.name);

                return jse.core.lang.translate('configuration', section);
            },
            camelToSnake: function camelToSnake(string) {
                var upperChars = string.match(/([A-Z])/g);
                if (!upperChars) {
                    return string;
                }

                var str = string.toString();
                for (var i = 0, n = upperChars.length; i < n; i++) {
                    str = str.replace(new RegExp(upperChars[i]), '_' + upperChars[i].toLowerCase());
                }

                if (str.slice(0, 1) === '_') {
                    str = str.slice(1);
                }

                return str;
            },
            saveConfiguration: function saveConfiguration() {
                var vm = this;
                var config = this.cronjob.configuration;
                var data = {};
                vm.inProcess = true;

                for (var i = 0, n = config.length; i < n; i++) {
                    if (config[i].type !== 'hidden') {
                        data[config[i].name] = config[i].value;
                    }
                }

                jse.libs.xhr.post({
                    url: './admin.php?do=CronjobAjax/saveConfiguration&task=' + this.cronjob.name,
                    data: data
                }, true).done(function (r) {
                    if (r.success) {
                        var $configurationModal = $('.configuration');

                        vm.$emit('updated');
                        vm.inProcess = false;
                        $configurationModal.modal('hide');
                    }
                }).fail(function (r) {
                    return console.error(r);
                });
            }
        },
        init: function init(done) {
            return done();
        }
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNyb25qb2JzL3Z1ZS9jb25maWd1cmF0aW9uX21vZGFsLmpzIl0sIm5hbWVzIjpbImNyb25qb2JzIiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJ2dWUiLCJuYW1lIiwicGFyZW50IiwidGVtcGxhdGUiLCJwcm9wcyIsImNyb25qb2IiLCJyZXF1aXJlZCIsInR5cGUiLCJPYmplY3QiLCJkYXRhIiwibGFuZyIsInRpdGxlX2NvbmZpZ3VyYXRpb25fbW9kYWwiLCJqc2UiLCJjb3JlIiwidHJhbnNsYXRlIiwiYnV0dG9uX2Nsb3NlIiwiYnV0dG9uX3NhdmUiLCJpblByb2Nlc3MiLCJ3YXRjaCIsIiRjb25maWd1cmF0aW9uTW9kYWwiLCIkIiwia2V5cyIsImxlbmd0aCIsIm1vZGFsIiwibWV0aG9kcyIsImdldFBocmFzZSIsInRpdGxlIiwiY29uc29sZSIsImxvZyIsInBocmFzZVNlY3Rpb24iLCJzcGxpdCIsInNlY3Rpb24iLCJwaHJhc2UiLCJnZXRDb25maWd1cmF0aW9uVGl0bGUiLCJ1bmRlZmluZWQiLCJjYW1lbFRvU25ha2UiLCJzdHJpbmciLCJ1cHBlckNoYXJzIiwibWF0Y2giLCJzdHIiLCJ0b1N0cmluZyIsImkiLCJuIiwicmVwbGFjZSIsIlJlZ0V4cCIsInRvTG93ZXJDYXNlIiwic2xpY2UiLCJzYXZlQ29uZmlndXJhdGlvbiIsInZtIiwiY29uZmlnIiwiY29uZmlndXJhdGlvbiIsInZhbHVlIiwibGlicyIsInhociIsInBvc3QiLCJ1cmwiLCJkb25lIiwiciIsInN1Y2Nlc3MiLCIkZW1pdCIsImZhaWwiLCJlcnJvciIsImluaXQiXSwibWFwcGluZ3MiOiI7O0FBQUFBLFNBQVNDLFdBQVQsQ0FBcUJDLE1BQXJCLENBQTRCLHFCQUE1QixFQUFtRCxDQUFDLEtBQUQsQ0FBbkQsRUFBNEQsWUFBTTtBQUM5RCxXQUFPO0FBQ0hDLGFBQUssSUFERjtBQUVIQyxjQUFNLGlDQUZIO0FBR0hDLGdCQUFRLHNCQUhMO0FBSUhDLGtCQUFVLCtCQUpQO0FBS0hDLGVB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Q0FBdkMsRUFBMENELEdBQTFDLEVBQStDO0FBQzNDLHdCQUFJUSxPQUFPUixDQUFQLEVBQVVsQyxJQUFWLEtBQW1CLFFBQXZCLEVBQWlDO0FBQzdCRSw2QkFBS3dDLE9BQU9SLENBQVAsRUFBVXhDLElBQWYsSUFBdUJnRCxPQUFPUixDQUFQLEVBQVVVLEtBQWpDO0FBQ0g7QUFDSjs7QUFFRHZDLG9CQUFJd0MsSUFBSixDQUFTQyxHQUFULENBQWFDLElBQWIsQ0FBa0I7QUFDZEMseUJBQUssdURBQXVELEtBQUtsRCxPQUFMLENBQWFKLElBRDNEO0FBRWRRLDBCQUFNQTtBQUZRLGlCQUFsQixFQUdHLElBSEgsRUFHUytDLElBSFQsQ0FHYyxhQUFLO0FBQ2Ysd0JBQUlDLEVBQUVDLE9BQU4sRUFBZTtBQUNYLDRCQUFNdkMsc0JBQXNCQyxFQUFFLGdCQUFGLENBQTVCOztBQUVBNEIsMkJBQUdXLEtBQUgsQ0FBUyxTQUFUO0FBQ0FYLDJCQUFHL0IsU0FBSCxHQUFlLEtBQWY7QUFDQUUsNENBQW9CSSxLQUFwQixDQUEwQixNQUExQjtBQUNIO0FBQ0osaUJBWEQsRUFXR3FDLElBWEgsQ0FXUTtBQUFBLDJCQUFLakMsUUFBUWtDLEtBQVIsQ0FBY0osQ0FBZCxDQUFMO0FBQUEsaUJBWFI7QUFhSDtBQTdESSxTQTdCTjtBQTRGSEssY0FBTTtBQUFBLG1CQUFRTixNQUFSO0FBQUE7QUE1RkgsS0FBUDtBQThGSCxDQS9GRCIsImZpbGUiOiJjcm9uam9icy92dWUvY29uZmlndXJhdGlvbl9tb2RhbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNyb25qb2JzLmNvbnRyb2xsZXJzLm1vZHVsZSgnY29uZmlndXJhdGlvbl9tb2RhbCcsIFsneGhyJ10sICgpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgICB2dWU6IHRydWUsXG4gICAgICAgIG5hbWU6ICdneC1jcm9uam9icy1jb25maWd1cmF0aW9uLW1vZGFsJyxcbiAgICAgICAgcGFyZW50OiAnZ3gtY3JvbmpvYnMtb3ZlcnZpZXcnLFxuICAgICAgICB0ZW1wbGF0ZTogJyNjcm9uam9icy1jb25maWd1cmF0aW9uLW1vZGFsJyxcbiAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICAgIGNyb25qb2I6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0eXBlOiBPYmplY3RcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZGF0YTogKCkgPT4gKHtcbiAgICAgICAgICAgIGxhbmc6IHtcbiAgICAgICAgICAgICAgICB0aXRsZV9jb25maWd1cmF0aW9uX21vZGFsOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgndGl0bGVfY29uZmlndXJhdGlvbl9tb2RhbCcsICdjcm9uam9icycpLFxuICAgICAgICAgICAgICAgIGJ1dHRvbl9jbG9zZToganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0JVVFRPTl9DTE9TRScsICdhZG1pbl9idXR0b25zJyksXG4gICAgICAgICAgICAgICAgYnV0dG9uX3NhdmU6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdCVVRUT05fU0FWRScsICdhZG1pbl9idXR0b25zJylcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpblByb2Nlc3M6IGZhbHNlXG4gICAgICAgIH0pLFxuICAgICAgICB3YXRjaDoge1xuICAgICAgICAgICAgY3JvbmpvYihjcm9uam9iKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgJGNvbmZpZ3VyYXRpb25Nb2RhbCA9ICQoJy5jb25maWd1cmF0aW9uJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMoY3JvbmpvYikubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAkY29uZmlndXJhdGlvbk1vZGFsLm1vZGFsKCdzaG93Jyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG1ldGhvZHM6IHtcbiAgICAgICAgICAgIGdldFBocmFzZSh0aXRsZSkge1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGl0bGUpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgcGhyYXNlU2VjdGlvbiA9IHRpdGxlLnNwbGl0KCcuJyk7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VjdGlvbiA9IHBocmFzZVNlY3Rpb25bMF07XG4gICAgICAgICAgICAgICAgY29uc3QgcGhyYXNlID0gcGhyYXNlU2VjdGlvblsxXTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZShwaHJhc2UsIHNlY3Rpb24pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldENvbmZpZ3VyYXRpb25UaXRsZShjcm9uam9iKSB7XG4gICAgICAgICAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gY3JvbmpvYi5uYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VjdGlvbiA9ICdjcm9uam9iXycgKyB0aGlzLmNhbWVsVG9TbmFrZShjcm9uam9iLm5hbWUpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdjb25maWd1cmF0aW9uJywgc2VjdGlvbik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2FtZWxUb1NuYWtlKHN0cmluZykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHVwcGVyQ2hhcnMgPSBzdHJpbmcubWF0Y2goLyhbQS1aXSkvZyk7XG4gICAgICAgICAgICAgICAgaWYgKCF1cHBlckNoYXJzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdHJpbmc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IHN0ciA9IHN0cmluZy50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBuID0gdXBwZXJDaGFycy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UobmV3IFJlZ0V4cCh1cHBlckNoYXJzW2ldKSwgJ18nICsgdXBwZXJDaGFyc1tpXS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoc3RyLnNsaWNlKDAsIDEpID09PSAnXycpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyID0gc3RyLnNsaWNlKDEpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBzdHI7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2F2ZUNvbmZpZ3VyYXRpb24oKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuY3JvbmpvYi5jb25maWd1cmF0aW9uO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB7fTtcbiAgICAgICAgICAgICAgICB2bS5pblByb2Nlc3MgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIG4gPSBjb25maWcubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb25maWdbaV0udHlwZSAhPT0gJ2hpZGRlbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbY29uZmlnW2ldLm5hbWVdID0gY29uZmlnW2ldLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAganNlLmxpYnMueGhyLnBvc3Qoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6ICcuL2FkbWluLnBocD9kbz1Dcm9uam9iQWpheC9zYXZlQ29uZmlndXJhdGlvbiZ0YXNrPScgKyB0aGlzLmNyb25qb2IubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICAgICAgICAgIH0sIHRydWUpLmRvbmUociA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0ICRjb25maWd1cmF0aW9uTW9kYWwgPSAkKCcuY29uZmlndXJhdGlvbicpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS4kZW1pdCgndXBkYXRlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0uaW5Qcm9jZXNzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAkY29uZmlndXJhdGlvbk1vZGFsLm1vZGFsKCdoaWRlJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KS5mYWlsKHIgPT4gY29uc29sZS5lcnJvcihyKSk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgaW5pdDogZG9uZSA9PiBkb25lKClcbiAgICB9XG59KTsiXX0=
