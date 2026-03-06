'use strict';

cronjobs.controllers.module('miscellaneous', [], function () {
    return {
        vue: true,
        name: 'gx-cronjobs-miscellaneous',
        template: '#cronjobs-miscellaneous',
        parent: 'gx-cronjobs-overview',
        props: {
            meta: {
                required: true,
                type: Object
            }
        },
        data: function data() {
            return {
                lang: {
                    status_active: jse.core.lang.translate('status_active', 'cronjobs'),
                    sub_title_miscellaneous: jse.core.lang.translate('sub_title_miscellaneous', 'cronjobs'),
                    last_executed: jse.core.lang.translate('last_executed', 'cronjobs'),
                    status_inactive: jse.core.lang.translate('status_inactive', 'cronjobs'),
                    miscellaneous_cronjob_error: jse.core.lang.translate('miscellaneous_cronjob_error', 'cronjobs'),
                    copy_to_clipboard: jse.core.lang.translate('copy_to_clipboard', 'cronjobs'),
                    cronjob_setup_description: jse.core.lang.translate('cronjob_setup_description', 'cronjobs')
                }
            };
        },
        methods: {
            copyUrl: function copyUrl() {
                var cronUrlField = $('#cron-url');
                cronUrlField.focus();
                cronUrlField.select();
                document.execCommand('copy');

                // Add success message to admin info box.
                var message = jse.core.lang.translate('copy_success', 'cronjobs');
                jse.libs.info_box.addSuccessMessage(message);
            }
        },
        mounted: function mounted() {
            var $container = $('.element-container');

            gx.extensions.init($container);
            gx.widgets.init($container);
        },

        init: function init(done) {
            return done();
        }
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNyb25qb2JzL3Z1ZS9taXNjZWxsYW5lb3VzLmpzIl0sIm5hbWVzIjpbImNyb25qb2JzIiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJ2dWUiLCJuYW1lIiwidGVtcGxhdGUiLCJwYXJlbnQiLCJwcm9wcyIsIm1ldGEiLCJyZXF1aXJlZCIsInR5cGUiLCJPYmplY3QiLCJkYXRhIiwibGFuZyIsInN0YXR1c19hY3RpdmUiLCJqc2UiLCJjb3JlIiwidHJhbnNsYXRlIiwic3ViX3RpdGxlX21pc2NlbGxhbmVvdXMiLCJsYXN0X2V4ZWN1dGVkIiwic3RhdHVzX2luYWN0aXZlIiwibWlzY2VsbGFuZW91c19jcm9uam9iX2Vycm9yIiwiY29weV90b19jbGlwYm9hcmQiLCJjcm9uam9iX3NldHVwX2Rlc2NyaXB0aW9uIiwibWV0aG9kcyIsImNvcHlVcmwiLCJjcm9uVXJsRmllbGQiLCIkIiwiZm9jdXMiLCJzZWxlY3QiLCJkb2N1bWVudCIsImV4ZWNDb21tYW5kIiwibWVzc2FnZSIsImxpYnMiLCJpbmZvX2JveCIsImFkZFN1Y2Nlc3NNZXNzYWdlIiwibW91bnRlZCIsIiRjb250YWluZXIiLCJneCIsImV4dGVuc2lvbnMiLCJpbml0Iiwid2lkZ2V0cyIsImRvbmUiXSwibWFwcGluZ3MiOiI7O0FBQUFBLFNBQVNDLFdBQVQsQ0FBcUJDLE1BQXJCLENBQTRCLGVBQTVCLEVBQ0ksRUFESixFQUVJLFlBQU07QUFDRixXQUFPO0FBQ0hDLGFBQUssSUFERjtBQUVIQyxjQUFNLDJCQUZIO0FBR0hDLGtCQUFVLHlCQUhQO0FBSUhDLGdCQUFRLHNCQUpMO0FBS0hDLGVBQU87QUFDSEMsa0JBQU07QUFDRkMsMEJBQVUsSUFEUjtBQUVGQyxzQkFBTUM7QUFGSjtBQURILFNBTEo7QUFXSEMsY0FBTSxnQkFBTTtBQUNSLG1CQUFPO0FBQ0hDLHNCQUFNO0FBQ0ZDLG1DQUFlQyxJQUFJQyxJQUFKLENBQVNILElBQVQsQ0FBY0ksU0FBZCxDQUF3QixlQUF4QixFQUF5QyxVQUF6QyxDQURiO0FBRUZDLDZDQUF5QkgsSUFBSUMsSUFBSixDQUFTSCxJQUFULENBQWNJLFNBQWQsQ0FBd0IseUJBQXhCLEVBQW1ELFVBQW5ELENBRnZCO0FBR0ZFLG1DQUFlSixJQUFJQyxJQUFKLENBQVNILElBQVQsQ0FBY0ksU0FBZCxDQUF3QixlQUF4QixFQUF5QyxVQUF6QyxDQUhiO0FBSUZHLHFDQUFpQkwsSUFBSUMsSUFBSixDQUFTSCxJQUFULENBQWNJLFNBQWQsQ0FBd0IsaUJBQXhCLEVBQTJDLFVBQTNDLENBSmY7QUFLRkksaURBQTZCTixJQUFJQyxJQUFKLENBQVNILElBQVQsQ0FBY0ksU0FBZCxDQUF3Qiw2QkFBeEIsRUFBdUQsVUFBdkQsQ0FMM0I7QUFNRkssdUNBQW1CUCxJQUFJQyxJQUFKLENBQVNILElBQVQsQ0FBY0ksU0FBZCxDQUF3QixtQkFBeEIsRUFBNkMsVUFBN0MsQ0FOakI7QUFPRk0sK0NBQTJCUixJQUFJQyxJQUFKLENBQVNILElBQVQsQ0FBY0ksU0FBZCxDQUF3QiwyQkFBeEIsRUFBcUQsVUFBckQ7QUFQekI7QUFESCxhQUFQO0FBV0gsU0F2QkU7QUF3QkhPLGlCQUFTO0FBQ0xDLG1CQURLLHFCQUNLO0FBQ04sb0JBQUlDLGVBQWVDLEVBQUUsV0FBRixDQUFuQjtBQUNBRCw2QkFBYUUsS0FBYjtBQUNBRiw2QkFBYUcsTUFBYjtBQUNBQyx5QkFBU0MsV0FBVCxDQUFxQixNQUFyQjs7QUFFQTtBQUNBLG9CQUFNQyxVQUFVakIsSUFBSUMsSUFBSixDQUFTSCxJQUFULENBQWNJLFNBQWQsQ0FBd0IsY0FBeEIsRUFBd0MsVUFBeEMsQ0FBaEI7QUFDQUYsb0JBQUlrQixJQUFKLENBQVNDLFFBQVQsQ0FBa0JDLGlCQUFsQixDQUFvQ0gsT0FBcEM7QUFDSDtBQVZJLFNBeEJOO0FBb0NISSxlQXBDRyxxQkFvQ087QUFDTixnQkFBTUMsYUFBYVYsRUFBRSxvQkFBRixDQUFuQjs7QUFFQVcsZUFBR0MsVUFBSCxDQUFjQyxJQUFkLENBQW1CSCxVQUFuQjtBQUNBQyxlQUFHRyxPQUFILENBQVdELElBQVgsQ0FBZ0JILFVBQWhCO0FBQ0gsU0F6Q0U7O0FBMENIRyxjQUFNO0FBQUEsbUJBQVFFLE1BQVI7QUFBQTtBQTFDSCxLQUFQO0FBNENILENBL0NMIiwiZmlsZSI6ImNyb25qb2JzL3Z1ZS9taXNjZWxsYW5lb3VzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY3JvbmpvYnMuY29udHJvbGxlcnMubW9kdWxlKCdtaXNjZWxsYW5lb3VzJyxcbiAgICBbXSxcbiAgICAoKSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2dWU6IHRydWUsXG4gICAgICAgICAgICBuYW1lOiAnZ3gtY3JvbmpvYnMtbWlzY2VsbGFuZW91cycsXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJyNjcm9uam9icy1taXNjZWxsYW5lb3VzJyxcbiAgICAgICAgICAgIHBhcmVudDogJ2d4LWNyb25qb2JzLW92ZXJ2aWV3JyxcbiAgICAgICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgICAgICAgbWV0YToge1xuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogT2JqZWN0XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRhdGE6ICgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBsYW5nOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXNfYWN0aXZlOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnc3RhdHVzX2FjdGl2ZScsICdjcm9uam9icycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3ViX3RpdGxlX21pc2NlbGxhbmVvdXM6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdzdWJfdGl0bGVfbWlzY2VsbGFuZW91cycsICdjcm9uam9icycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdF9leGVjdXRlZDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2xhc3RfZXhlY3V0ZWQnLCAnY3JvbmpvYnMnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1c19pbmFjdGl2ZToganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ3N0YXR1c19pbmFjdGl2ZScsICdjcm9uam9icycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWlzY2VsbGFuZW91c19jcm9uam9iX2Vycm9yOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnbWlzY2VsbGFuZW91c19jcm9uam9iX2Vycm9yJywgJ2Nyb25qb2JzJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3B5X3RvX2NsaXBib2FyZDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2NvcHlfdG9fY2xpcGJvYXJkJywgJ2Nyb25qb2JzJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBjcm9uam9iX3NldHVwX2Rlc2NyaXB0aW9uOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnY3JvbmpvYl9zZXR1cF9kZXNjcmlwdGlvbicsICdjcm9uam9icycpLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1ldGhvZHM6IHtcbiAgICAgICAgICAgICAgICBjb3B5VXJsKCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY3JvblVybEZpZWxkID0gJCgnI2Nyb24tdXJsJyk7XG4gICAgICAgICAgICAgICAgICAgIGNyb25VcmxGaWVsZC5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICBjcm9uVXJsRmllbGQuc2VsZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdjb3B5Jyk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQWRkIHN1Y2Nlc3MgbWVzc2FnZSB0byBhZG1pbiBpbmZvIGJveC5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdjb3B5X3N1Y2Nlc3MnLCAnY3JvbmpvYnMnKTtcbiAgICAgICAgICAgICAgICAgICAganNlLmxpYnMuaW5mb19ib3guYWRkU3VjY2Vzc01lc3NhZ2UobWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1vdW50ZWQoKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgJGNvbnRhaW5lciA9ICQoJy5lbGVtZW50LWNvbnRhaW5lcicpO1xuXG4gICAgICAgICAgICAgICAgZ3guZXh0ZW5zaW9ucy5pbml0KCRjb250YWluZXIpO1xuICAgICAgICAgICAgICAgIGd4LndpZGdldHMuaW5pdCgkY29udGFpbmVyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbml0OiBkb25lID0+IGRvbmUoKVxuICAgICAgICB9XG4gICAgfSk7Il19
