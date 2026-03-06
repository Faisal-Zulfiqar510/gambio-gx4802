'use strict';

cronjobs.controllers.module('logs_modal', ['xhr', 'loading_spinner'], function () {
    return {
        vue: true,
        name: 'gx-cronjobs-logs-modal',
        parent: 'gx-cronjobs-overview',
        template: '#cronjobs-logs-modal',
        props: {
            cronjob: {
                required: true,
                type: Object
            }
        },
        data: function data() {
            return {
                lang: {
                    title_log_modal: jse.core.lang.translate('title_log_modal', 'cronjobs'),
                    log_modal_last_messages: jse.core.lang.translate('log_modal_last_messages', 'cronjobs'),
                    button_close: jse.core.lang.translate('BUTTON_CLOSE', 'admin_buttons')
                },
                success: null,
                log: '',
                error: ''
            };
        },
        watch: {
            cronjob: function cronjob(newVal) {
                if (Object.keys(newVal).length > 0) {
                    this.fetchLogs();
                }
            }
        },
        computed: {
            modalSize: function modalSize() {
                var vm = this;

                return {
                    'modal-lg': vm.success,
                    'modal-md': !vm.success
                };
            }
        },
        methods: {
            fetchLogs: function fetchLogs() {
                var vm = this;
                var $logsModal = $('.logs');

                var $target = $('.cronjob-list-elements');
                var spinner = jse.libs.loading_spinner.show($target);

                jse.libs.xhr.get({
                    url: './admin.php?do=CronjobAjax/getLogs&task=' + vm.cronjob.name
                }, true).done(function (r) {
                    vm.success = r.success;
                    vm.log = r.log || '';
                    vm.error = r.error || '';

                    jse.libs.loading_spinner.hide(spinner);
                    $logsModal.modal('show');
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNyb25qb2JzL3Z1ZS9sb2dzX21vZGFsLmpzIl0sIm5hbWVzIjpbImNyb25qb2JzIiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJ2dWUiLCJuYW1lIiwicGFyZW50IiwidGVtcGxhdGUiLCJwcm9wcyIsImNyb25qb2IiLCJyZXF1aXJlZCIsInR5cGUiLCJPYmplY3QiLCJkYXRhIiwibGFuZyIsInRpdGxlX2xvZ19tb2RhbCIsImpzZSIsImNvcmUiLCJ0cmFuc2xhdGUiLCJsb2dfbW9kYWxfbGFzdF9tZXNzYWdlcyIsImJ1dHRvbl9jbG9zZSIsInN1Y2Nlc3MiLCJsb2ciLCJlcnJvciIsIndhdGNoIiwibmV3VmFsIiwia2V5cyIsImxlbmd0aCIsImZldGNoTG9ncyIsImNvbXB1dGVkIiwibW9kYWxTaXplIiwidm0iLCJtZXRob2RzIiwiJGxvZ3NNb2RhbCIsIiQiLCIkdGFyZ2V0Iiwic3Bpbm5lciIsImxpYnMiLCJsb2FkaW5nX3NwaW5uZXIiLCJzaG93IiwieGhyIiwiZ2V0IiwidXJsIiwiZG9uZSIsInIiLCJoaWRlIiwibW9kYWwiLCJmYWlsIiwiY29uc29sZSIsImluaXQiXSwibWFwcGluZ3MiOiI7O0FBQUFBLFNBQVNDLFdBQVQsQ0FBcUJDLE1BQXJCLENBQTRCLFlBQTVCLEVBQ0ksQ0FBQyxLQUFELEVBQVEsaUJBQVIsQ0FESixFQUVJLFlBQU07QUFDRixXQUFPO0FBQ0hDLGFBQUssSUFERjtBQUVIQyxjQUFNLHdCQUZIO0FBR0hDLGdCQUFRLHNCQUhMO0FBSUhDLGtCQUFVLHNCQUpQO0FBS0hDLGVBQU87QUFDSEMscUJBQVM7QUFDTEMsMEJBQVUsSUFETDtBQUVMQyxzQkFBTUM7QUFGRDtBQUROLFNBTEo7QUFXSEMsY0FBTTtBQUFBLG1CQUFPO0FBQ1RDLHNCQUFNO0FBQ0ZDLHFDQUFpQkMsSUFBSUMsSUFBSixDQUFTSCxJQUFULENBQWNJLFNBQWQsQ0FBd0IsaUJBQXhCLEVBQTJDLFVBQTNDLENBRGY7QUFFRkMsNkNBQXlCSCxJQUFJQyxJQUFKLENBQVNILElBQVQsQ0FBY0ksU0FBZCxDQUF3Qix5QkFBeEIsRUFBbUQsVUFBbkQsQ0FGdkI7QUFHRkUsa0NBQWNKLElBQUlDLElBQUosQ0FBU0gsSUFBVCxDQUFjSSxTQUFkLENBQXdCLGNBQXhCLEVBQXdDLGVBQXhDO0FBSFosaUJBREc7QUFNVEcseUJBQVMsSUFOQTtBQU9UQyxxQkFBSyxFQVBJO0FBUVRDLHVCQUFPO0FBUkUsYUFBUDtBQUFBLFNBWEg7QUFxQkhDLGVBQU87QUFDSGYsbUJBREcsbUJBQ0tnQixNQURMLEVBQ2E7QUFDWixvQkFBSWIsT0FBT2MsSUFBUCxDQUFZRCxNQUFaLEVBQW9CRSxNQUFwQixHQUE2QixDQUFqQyxFQUFvQztBQUNoQyx5QkFBS0MsU0FBTDtBQUNIO0FBQ0o7QUFMRSxTQXJCSjtBQTRCSEMsa0JBQVU7QUFDTkMscUJBRE0sdUJBQ007QUFDUixvQkFBTUMsS0FBSyxJQUFYOztBQUVBLHVCQUFPO0FBQ0gsZ0NBQVlBLEdBQUdWLE9BRFo7QUFFSCxnQ0FBWSxDQUFDVSxHQUFHVjtBQUZiLGlCQUFQO0FBSUg7QUFSSyxTQTVCUDtBQXNDSFcsaUJBQVM7QUFDTEoscUJBREssdUJBQ087QUFDUixvQkFBTUcsS0FBSyxJQUFYO0FBQ0Esb0JBQU1FLGFBQWFDLEVBQUUsT0FBRixDQUFuQjs7QUFFQSxvQkFBTUMsVUFBVUQsRUFBRSx3QkFBRixDQUFoQjtBQUNBLG9CQUFNRSxVQUFVcEIsSUFBSXFCLElBQUosQ0FBU0MsZUFBVCxDQUF5QkMsSUFBekIsQ0FBOEJKLE9BQTlCLENBQWhCOztBQUVBbkIsb0JBQUlxQixJQUFKLENBQVNHLEdBQVQsQ0FBYUMsR0FBYixDQUFpQjtBQUNiQyx5QkFBSyw2Q0FBNkNYLEdBQUd0QixPQUFILENBQVdKO0FBRGhELGlCQUFqQixFQUVHLElBRkgsRUFFU3NDLElBRlQsQ0FFYyxhQUFLO0FBQ2ZaLHVCQUFHVixPQUFILEdBQWF1QixFQUFFdkIsT0FBZjtBQUNBVSx1QkFBR1QsR0FBSCxHQUFTc0IsRUFBRXRCLEdBQUYsSUFBUyxFQUFsQjtBQUNBUyx1QkFBR1IsS0FBSCxHQUFXcUIsRUFBRXJCLEtBQUYsSUFBVyxFQUF0Qjs7QUFFQVAsd0JBQUlxQixJQUFKLENBQVNDLGVBQVQsQ0FBeUJPLElBQXpCLENBQThCVCxPQUE5QjtBQUNBSCwrQkFBV2EsS0FBWCxDQUFpQixNQUFqQjtBQUNILGlCQVRELEVBU0dDLElBVEgsQ0FTUTtBQUFBLDJCQUFLQyxRQUFRekIsS0FBUixDQUFjcUIsQ0FBZCxDQUFMO0FBQUEsaUJBVFI7QUFVSDtBQWxCSSxTQXRDTjtBQTBESEssY0FBTTtBQUFBLG1CQUFRTixNQUFSO0FBQUE7QUExREgsS0FBUDtBQTRESCxDQS9ETCIsImZpbGUiOiJjcm9uam9icy92dWUvbG9nc19tb2RhbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNyb25qb2JzLmNvbnRyb2xsZXJzLm1vZHVsZSgnbG9nc19tb2RhbCcsXG4gICAgWyd4aHInLCAnbG9hZGluZ19zcGlubmVyJ10sXG4gICAgKCkgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdnVlOiB0cnVlLFxuICAgICAgICAgICAgbmFtZTogJ2d4LWNyb25qb2JzLWxvZ3MtbW9kYWwnLFxuICAgICAgICAgICAgcGFyZW50OiAnZ3gtY3JvbmpvYnMtb3ZlcnZpZXcnLFxuICAgICAgICAgICAgdGVtcGxhdGU6ICcjY3JvbmpvYnMtbG9ncy1tb2RhbCcsXG4gICAgICAgICAgICBwcm9wczoge1xuICAgICAgICAgICAgICAgIGNyb25qb2I6IHtcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IE9iamVjdFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkYXRhOiAoKSA9PiAoe1xuICAgICAgICAgICAgICAgIGxhbmc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGVfbG9nX21vZGFsOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgndGl0bGVfbG9nX21vZGFsJywgJ2Nyb25qb2JzJyksXG4gICAgICAgICAgICAgICAgICAgIGxvZ19tb2RhbF9sYXN0X21lc3NhZ2VzOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnbG9nX21vZGFsX2xhc3RfbWVzc2FnZXMnLCAnY3JvbmpvYnMnKSxcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uX2Nsb3NlOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnQlVUVE9OX0NMT1NFJywgJ2FkbWluX2J1dHRvbnMnKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3VjY2VzczogbnVsbCxcbiAgICAgICAgICAgICAgICBsb2c6ICcnLFxuICAgICAgICAgICAgICAgIGVycm9yOiAnJ1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB3YXRjaDoge1xuICAgICAgICAgICAgICAgIGNyb25qb2IobmV3VmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhuZXdWYWwpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmV0Y2hMb2dzKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29tcHV0ZWQ6IHtcbiAgICAgICAgICAgICAgICBtb2RhbFNpemUoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZtID0gdGhpcztcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ21vZGFsLWxnJzogdm0uc3VjY2VzcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdtb2RhbC1tZCc6ICF2bS5zdWNjZXNzXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWV0aG9kczoge1xuICAgICAgICAgICAgICAgIGZldGNoTG9ncygpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCAkbG9nc01vZGFsID0gJCgnLmxvZ3MnKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCAkdGFyZ2V0ID0gJCgnLmNyb25qb2ItbGlzdC1lbGVtZW50cycpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzcGlubmVyID0ganNlLmxpYnMubG9hZGluZ19zcGlubmVyLnNob3coJHRhcmdldCk7XG5cbiAgICAgICAgICAgICAgICAgICAganNlLmxpYnMueGhyLmdldCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcuL2FkbWluLnBocD9kbz1Dcm9uam9iQWpheC9nZXRMb2dzJnRhc2s9JyArIHZtLmNyb25qb2IubmFtZVxuICAgICAgICAgICAgICAgICAgICB9LCB0cnVlKS5kb25lKHIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0uc3VjY2VzcyA9IHIuc3VjY2VzcztcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmxvZyA9IHIubG9nIHx8ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZXJyb3IgPSByLmVycm9yIHx8ICcnO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBqc2UubGlicy5sb2FkaW5nX3NwaW5uZXIuaGlkZShzcGlubmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2dzTW9kYWwubW9kYWwoJ3Nob3cnKTtcbiAgICAgICAgICAgICAgICAgICAgfSkuZmFpbChyID0+IGNvbnNvbGUuZXJyb3IocikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbml0OiBkb25lID0+IGRvbmUoKVxuICAgICAgICB9XG4gICAgfSk7Il19
