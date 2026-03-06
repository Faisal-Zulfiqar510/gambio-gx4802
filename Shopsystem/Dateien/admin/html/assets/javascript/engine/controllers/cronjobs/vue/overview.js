'use strict';

cronjobs.controllers.module('overview', ['xhr'], function () {
    return {
        vue: true,
        name: 'gx-cronjobs-overview',
        template: '#cronjobs-overview',
        data: function data() {
            return {
                cronjobs: [],
                logCronjob: {},
                configurationCronjob: {},
                meta: {},
                ready: false
            };
        },
        methods: {
            openLogsModal: function openLogsModal(cronjob) {
                var vm = this;
                var $logsModal = $('.logs');

                vm.logCronjob = cronjob;

                $logsModal.on('hidden.bs.modal', function () {
                    vm.logCronjob = {};
                });
            },
            openConfigurationModal: function openConfigurationModal(cronjob) {
                var vm = this;
                var $configurationModal = $('.configuration');

                vm.configurationCronjob = cronjob;

                $configurationModal.on('hidden.bs.modal', function () {
                    vm.configurationCronjob = {};
                });
            },
            sync: function sync() {
                var vm = this;

                var $target = $('.cronjob-list-elements');
                var spinner = jse.libs.loading_spinner.show($target);

                jse.libs.xhr.get({
                    url: './admin.php?do=CronjobAjax/getCronjobs'
                }).done(function (r) {
                    vm.cronjobs = r.cronjobs;
                    vm.meta = r.meta;

                    jse.libs.loading_spinner.hide(spinner);
                }).fail(function (r) {
                    return console.error(r);
                });
            }
        },
        mounted: function mounted() {
            var vm = this;

            vm.ready = false;
            jse.libs.xhr.get({
                url: './admin.php?do=CronjobAjax/getCronjobs'
            }).done(function (r) {
                vm.cronjobs = r.cronjobs;
                vm.meta = r.meta;
                vm.ready = true;
            }).fail(function (r) {
                return console.error(r);
            });
        },

        init: function init(done) {
            return done();
        }
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNyb25qb2JzL3Z1ZS9vdmVydmlldy5qcyJdLCJuYW1lcyI6WyJjcm9uam9icyIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwidnVlIiwibmFtZSIsInRlbXBsYXRlIiwiZGF0YSIsImxvZ0Nyb25qb2IiLCJjb25maWd1cmF0aW9uQ3JvbmpvYiIsIm1ldGEiLCJyZWFkeSIsIm1ldGhvZHMiLCJvcGVuTG9nc01vZGFsIiwiY3JvbmpvYiIsInZtIiwiJGxvZ3NNb2RhbCIsIiQiLCJvbiIsIm9wZW5Db25maWd1cmF0aW9uTW9kYWwiLCIkY29uZmlndXJhdGlvbk1vZGFsIiwic3luYyIsIiR0YXJnZXQiLCJzcGlubmVyIiwianNlIiwibGlicyIsImxvYWRpbmdfc3Bpbm5lciIsInNob3ciLCJ4aHIiLCJnZXQiLCJ1cmwiLCJkb25lIiwiciIsImhpZGUiLCJmYWlsIiwiY29uc29sZSIsImVycm9yIiwibW91bnRlZCIsImluaXQiXSwibWFwcGluZ3MiOiI7O0FBQUFBLFNBQVNDLFdBQVQsQ0FBcUJDLE1BQXJCLENBQTRCLFVBQTVCLEVBQ0ksQ0FBQyxLQUFELENBREosRUFFSSxZQUFNO0FBQ0YsV0FBTztBQUNIQyxhQUFLLElBREY7QUFFSEMsY0FBTSxzQkFGSDtBQUdIQyxrQkFBVSxvQkFIUDtBQUlIQyxjQUFNO0FBQUEsbUJBQU87QUFDVE4sMEJBQVUsRUFERDtBQUVUTyw0QkFBWSxFQUZIO0FBR1RDLHNDQUFzQixFQUhiO0FBSVRDLHNCQUFNLEVBSkc7QUFLVEMsdUJBQU87QUFMRSxhQUFQO0FBQUEsU0FKSDtBQVdIQyxpQkFBUztBQUNMQyx5QkFESyx5QkFDU0MsT0FEVCxFQUNrQjtBQUNuQixvQkFBTUMsS0FBSyxJQUFYO0FBQ0Esb0JBQU1DLGFBQWFDLEVBQUUsT0FBRixDQUFuQjs7QUFFQUYsbUJBQUdQLFVBQUgsR0FBZ0JNLE9BQWhCOztBQUVBRSwyQkFBV0UsRUFBWCxDQUFjLGlCQUFkLEVBQWlDLFlBQU07QUFDbkNILHVCQUFHUCxVQUFILEdBQWdCLEVBQWhCO0FBQ0gsaUJBRkQ7QUFHSCxhQVZJO0FBV0xXLGtDQVhLLGtDQVdrQkwsT0FYbEIsRUFXMkI7QUFDNUIsb0JBQU1DLEtBQUssSUFBWDtBQUNBLG9CQUFNSyxzQkFBc0JILEVBQUUsZ0JBQUYsQ0FBNUI7O0FBRUFGLG1CQUFHTixvQkFBSCxHQUEwQkssT0FBMUI7O0FBRUFNLG9DQUFvQkYsRUFBcEIsQ0FBdUIsaUJBQXZCLEVBQTBDLFlBQU07QUFDNUNILHVCQUFHTixvQkFBSCxHQUEwQixFQUExQjtBQUNILGlCQUZEO0FBR0gsYUFwQkk7QUFxQkxZLGdCQXJCSyxrQkFxQkU7QUFDSCxvQkFBTU4sS0FBSyxJQUFYOztBQUVBLG9CQUFNTyxVQUFVTCxFQUFFLHdCQUFGLENBQWhCO0FBQ0Esb0JBQU1NLFVBQVVDLElBQUlDLElBQUosQ0FBU0MsZUFBVCxDQUF5QkMsSUFBekIsQ0FBOEJMLE9BQTlCLENBQWhCOztBQUVBRSxvQkFBSUMsSUFBSixDQUFTRyxHQUFULENBQWFDLEdBQWIsQ0FBaUI7QUFDYkMseUJBQUs7QUFEUSxpQkFBakIsRUFFR0MsSUFGSCxDQUVRLGFBQUs7QUFDVGhCLHVCQUFHZCxRQUFILEdBQWMrQixFQUFFL0IsUUFBaEI7QUFDQWMsdUJBQUdMLElBQUgsR0FBVXNCLEVBQUV0QixJQUFaOztBQUVBYyx3QkFBSUMsSUFBSixDQUFTQyxlQUFULENBQXlCTyxJQUF6QixDQUE4QlYsT0FBOUI7QUFDSCxpQkFQRCxFQU9HVyxJQVBILENBT1E7QUFBQSwyQkFBS0MsUUFBUUMsS0FBUixDQUFjSixDQUFkLENBQUw7QUFBQSxpQkFQUjtBQVFIO0FBbkNJLFNBWE47QUFnREhLLGVBaERHLHFCQWdETztBQUNOLGdCQUFNdEIsS0FBSyxJQUFYOztBQUVBQSxlQUFHSixLQUFILEdBQVcsS0FBWDtBQUNBYSxnQkFBSUMsSUFBSixDQUFTRyxHQUFULENBQWFDLEdBQWIsQ0FBaUI7QUFDYkMscUJBQUs7QUFEUSxhQUFqQixFQUVHQyxJQUZILENBRVEsYUFBSztBQUNUaEIsbUJBQUdkLFFBQUgsR0FBYytCLEVBQUUvQixRQUFoQjtBQUNBYyxtQkFBR0wsSUFBSCxHQUFVc0IsRUFBRXRCLElBQVo7QUFDQUssbUJBQUdKLEtBQUgsR0FBVyxJQUFYO0FBQ0gsYUFORCxFQU1HdUIsSUFOSCxDQU1RO0FBQUEsdUJBQUtDLFFBQVFDLEtBQVIsQ0FBY0osQ0FBZCxDQUFMO0FBQUEsYUFOUjtBQU9ILFNBM0RFOztBQTRESE0sY0FBTTtBQUFBLG1CQUFRUCxNQUFSO0FBQUE7QUE1REgsS0FBUDtBQThESCxDQWpFTCIsImZpbGUiOiJjcm9uam9icy92dWUvb3ZlcnZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjcm9uam9icy5jb250cm9sbGVycy5tb2R1bGUoJ292ZXJ2aWV3JyxcbiAgICBbJ3hociddLFxuICAgICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZ1ZTogdHJ1ZSxcbiAgICAgICAgICAgIG5hbWU6ICdneC1jcm9uam9icy1vdmVydmlldycsXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJyNjcm9uam9icy1vdmVydmlldycsXG4gICAgICAgICAgICBkYXRhOiAoKSA9PiAoe1xuICAgICAgICAgICAgICAgIGNyb25qb2JzOiBbXSxcbiAgICAgICAgICAgICAgICBsb2dDcm9uam9iOiB7fSxcbiAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uQ3JvbmpvYjoge30sXG4gICAgICAgICAgICAgICAgbWV0YToge30sXG4gICAgICAgICAgICAgICAgcmVhZHk6IGZhbHNlXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIG1ldGhvZHM6IHtcbiAgICAgICAgICAgICAgICBvcGVuTG9nc01vZGFsKGNyb25qb2IpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCAkbG9nc01vZGFsID0gJCgnLmxvZ3MnKTtcblxuICAgICAgICAgICAgICAgICAgICB2bS5sb2dDcm9uam9iID0gY3JvbmpvYjtcblxuICAgICAgICAgICAgICAgICAgICAkbG9nc01vZGFsLm9uKCdoaWRkZW4uYnMubW9kYWwnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5sb2dDcm9uam9iID0ge307XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgb3BlbkNvbmZpZ3VyYXRpb25Nb2RhbChjcm9uam9iKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZtID0gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgJGNvbmZpZ3VyYXRpb25Nb2RhbCA9ICQoJy5jb25maWd1cmF0aW9uJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgdm0uY29uZmlndXJhdGlvbkNyb25qb2IgPSBjcm9uam9iO1xuXG4gICAgICAgICAgICAgICAgICAgICRjb25maWd1cmF0aW9uTW9kYWwub24oJ2hpZGRlbi5icy5tb2RhbCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmNvbmZpZ3VyYXRpb25Dcm9uam9iID0ge307XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3luYygpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgdm0gPSB0aGlzO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0ICR0YXJnZXQgPSAkKCcuY3JvbmpvYi1saXN0LWVsZW1lbnRzJyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNwaW5uZXIgPSBqc2UubGlicy5sb2FkaW5nX3NwaW5uZXIuc2hvdygkdGFyZ2V0KTtcblxuICAgICAgICAgICAgICAgICAgICBqc2UubGlicy54aHIuZ2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJy4vYWRtaW4ucGhwP2RvPUNyb25qb2JBamF4L2dldENyb25qb2JzJ1xuICAgICAgICAgICAgICAgICAgICB9KS5kb25lKHIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0uY3JvbmpvYnMgPSByLmNyb25qb2JzO1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0ubWV0YSA9IHIubWV0YTtcblxuICAgICAgICAgICAgICAgICAgICAgICAganNlLmxpYnMubG9hZGluZ19zcGlubmVyLmhpZGUoc3Bpbm5lcik7XG4gICAgICAgICAgICAgICAgICAgIH0pLmZhaWwociA9PiBjb25zb2xlLmVycm9yKHIpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbW91bnRlZCgpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB2bSA9IHRoaXM7XG5cbiAgICAgICAgICAgICAgICB2bS5yZWFkeSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGpzZS5saWJzLnhoci5nZXQoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6ICcuL2FkbWluLnBocD9kbz1Dcm9uam9iQWpheC9nZXRDcm9uam9icydcbiAgICAgICAgICAgICAgICB9KS5kb25lKHIgPT4ge1xuICAgICAgICAgICAgICAgICAgICB2bS5jcm9uam9icyA9IHIuY3JvbmpvYnM7XG4gICAgICAgICAgICAgICAgICAgIHZtLm1ldGEgPSByLm1ldGE7XG4gICAgICAgICAgICAgICAgICAgIHZtLnJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9KS5mYWlsKHIgPT4gY29uc29sZS5lcnJvcihyKSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW5pdDogZG9uZSA9PiBkb25lKClcbiAgICAgICAgfVxuICAgIH0pOyJdfQ==
