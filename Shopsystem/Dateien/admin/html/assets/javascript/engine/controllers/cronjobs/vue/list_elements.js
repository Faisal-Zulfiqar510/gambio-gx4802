'use strict';

cronjobs.controllers.module('list_elements', [], function () {
    return {
        vue: true,
        name: 'gx-cronjobs-list-elements',
        parent: 'gx-cronjobs-overview',
        template: '#cronjobs-list-elements',
        props: {
            cronjobs: {
                required: true,
                type: Array
            }
        },
        data: function data() {
            return {
                lang: {
                    sub_title_tasks: jse.core.lang.translate('sub_title_tasks', 'cronjobs'),
                    status_inactive_description: jse.core.lang.translate('status_inactive_description', 'cronjobs'),
                    status_inactive: jse.core.lang.translate('status_inactive', 'cronjobs'),
                    status_active_description: jse.core.lang.translate('status_active_description', 'cronjobs'),
                    status_active: jse.core.lang.translate('status_active', 'cronjobs'),
                    status_warning_description: jse.core.lang.translate('status_warning_description', 'cronjobs'),
                    status_error_description: jse.core.lang.translate('status_error_description', 'cronjobs'),
                    status_not_executed_description: jse.core.lang.translate('status_not_executed_description', 'cronjobs')
                }
            };
        },
        methods: {
            getPhrase: function getPhrase(title) {
                var phraseSection = title.split('.');
                var section = phraseSection[0];
                var phrase = phraseSection[1];

                return jse.core.lang.translate(phrase, section);
            },
            getInterval: function getInterval(title, interval) {
                var phraseSection = title.split('.');
                var section = phraseSection[0];

                return jse.core.lang.translate(interval, section);
            },
            openLogsModal: function openLogsModal(cronjob) {
                this.$emit('open-logs-modal', cronjob);
            },
            openConfigurationModal: function openConfigurationModal(cronjob) {
                this.$emit('open-configuration-modal', cronjob);
            }
        },
        init: function init(done) {
            return done();
        }
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNyb25qb2JzL3Z1ZS9saXN0X2VsZW1lbnRzLmpzIl0sIm5hbWVzIjpbImNyb25qb2JzIiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJ2dWUiLCJuYW1lIiwicGFyZW50IiwidGVtcGxhdGUiLCJwcm9wcyIsInJlcXVpcmVkIiwidHlwZSIsIkFycmF5IiwiZGF0YSIsImxhbmciLCJzdWJfdGl0bGVfdGFza3MiLCJqc2UiLCJjb3JlIiwidHJhbnNsYXRlIiwic3RhdHVzX2luYWN0aXZlX2Rlc2NyaXB0aW9uIiwic3RhdHVzX2luYWN0aXZlIiwic3RhdHVzX2FjdGl2ZV9kZXNjcmlwdGlvbiIsInN0YXR1c19hY3RpdmUiLCJzdGF0dXNfd2FybmluZ19kZXNjcmlwdGlvbiIsInN0YXR1c19lcnJvcl9kZXNjcmlwdGlvbiIsInN0YXR1c19ub3RfZXhlY3V0ZWRfZGVzY3JpcHRpb24iLCJtZXRob2RzIiwiZ2V0UGhyYXNlIiwidGl0bGUiLCJwaHJhc2VTZWN0aW9uIiwic3BsaXQiLCJzZWN0aW9uIiwicGhyYXNlIiwiZ2V0SW50ZXJ2YWwiLCJpbnRlcnZhbCIsIm9wZW5Mb2dzTW9kYWwiLCJjcm9uam9iIiwiJGVtaXQiLCJvcGVuQ29uZmlndXJhdGlvbk1vZGFsIiwiaW5pdCIsImRvbmUiXSwibWFwcGluZ3MiOiI7O0FBQUFBLFNBQVNDLFdBQVQsQ0FBcUJDLE1BQXJCLENBQTRCLGVBQTVCLEVBQ0ksRUFESixFQUVJLFlBQU07QUFDRixXQUFPO0FBQ0hDLGFBQUssSUFERjtBQUVIQyxjQUFNLDJCQUZIO0FBR0hDLGdCQUFRLHNCQUhMO0FBSUhDLGtCQUFVLHlCQUpQO0FBS0hDLGVBQU87QUFDSFAsc0JBQVU7QUFDTlEsMEJBQVUsSUFESjtBQUVOQyxzQkFBTUM7QUFGQTtBQURQLFNBTEo7QUFXSEMsY0FBTTtBQUFBLG1CQUFPO0FBQ1RDLHNCQUFNO0FBQ0ZDLHFDQUFpQkMsSUFBSUMsSUFBSixDQUFTSCxJQUFULENBQWNJLFNBQWQsQ0FBd0IsaUJBQXhCLEVBQTJDLFVBQTNDLENBRGY7QUFFRkMsaURBQTZCSCxJQUFJQyxJQUFKLENBQVNILElBQVQsQ0FBY0ksU0FBZCxDQUF3Qiw2QkFBeEIsRUFBdUQsVUFBdkQsQ0FGM0I7QUFHRkUscUNBQWlCSixJQUFJQyxJQUFKLENBQVNILElBQVQsQ0FBY0ksU0FBZCxDQUF3QixpQkFBeEIsRUFBMkMsVUFBM0MsQ0FIZjtBQUlGRywrQ0FBMkJMLElBQUlDLElBQUosQ0FBU0gsSUFBVCxDQUFjSSxTQUFkLENBQXdCLDJCQUF4QixFQUFxRCxVQUFyRCxDQUp6QjtBQUtGSSxtQ0FBZU4sSUFBSUMsSUFBSixDQUFTSCxJQUFULENBQWNJLFNBQWQsQ0FBd0IsZUFBeEIsRUFBeUMsVUFBekMsQ0FMYjtBQU1GSyxnREFBNEJQLElBQUlDLElBQUosQ0FBU0gsSUFBVCxDQUFjSSxTQUFkLENBQXdCLDRCQUF4QixFQUFzRCxVQUF0RCxDQU4xQjtBQU9GTSw4Q0FBMEJSLElBQUlDLElBQUosQ0FBU0gsSUFBVCxDQUFjSSxTQUFkLENBQXdCLDBCQUF4QixFQUFvRCxVQUFwRCxDQVB4QjtBQVFGTyxxREFBaUNULElBQUlDLElBQUosQ0FBU0gsSUFBVCxDQUFjSSxTQUFkLENBQXdCLGlDQUF4QixFQUEyRCxVQUEzRDtBQVIvQjtBQURHLGFBQVA7QUFBQSxTQVhIO0FBdUJIUSxpQkFBUztBQUNMQyxxQkFESyxxQkFDS0MsS0FETCxFQUNZO0FBQ2Isb0JBQU1DLGdCQUFnQkQsTUFBTUUsS0FBTixDQUFZLEdBQVosQ0FBdEI7QUFDQSxvQkFBTUMsVUFBVUYsY0FBYyxDQUFkLENBQWhCO0FBQ0Esb0JBQU1HLFNBQVNILGNBQWMsQ0FBZCxDQUFmOztBQUVBLHVCQUFPYixJQUFJQyxJQUFKLENBQVNILElBQVQsQ0FBY0ksU0FBZCxDQUF3QmMsTUFBeEIsRUFBZ0NELE9BQWhDLENBQVA7QUFDSCxhQVBJO0FBUUxFLHVCQVJLLHVCQVFPTCxLQVJQLEVBUWNNLFFBUmQsRUFRd0I7QUFDekIsb0JBQU1MLGdCQUFnQkQsTUFBTUUsS0FBTixDQUFZLEdBQVosQ0FBdEI7QUFDQSxvQkFBTUMsVUFBVUYsY0FBYyxDQUFkLENBQWhCOztBQUVBLHVCQUFPYixJQUFJQyxJQUFKLENBQVNILElBQVQsQ0FBY0ksU0FBZCxDQUF3QmdCLFFBQXhCLEVBQWtDSCxPQUFsQyxDQUFQO0FBQ0gsYUFiSTtBQWNMSSx5QkFkSyx5QkFjU0MsT0FkVCxFQWNrQjtBQUNuQixxQkFBS0MsS0FBTCxDQUFXLGlCQUFYLEVBQThCRCxPQUE5QjtBQUNILGFBaEJJO0FBaUJMRSxrQ0FqQkssa0NBaUJrQkYsT0FqQmxCLEVBaUIyQjtBQUM1QixxQkFBS0MsS0FBTCxDQUFXLDBCQUFYLEVBQXVDRCxPQUF2QztBQUNIO0FBbkJJLFNBdkJOO0FBNENIRyxjQUFNO0FBQUEsbUJBQVFDLE1BQVI7QUFBQTtBQTVDSCxLQUFQO0FBOENILENBakRMIiwiZmlsZSI6ImNyb25qb2JzL3Z1ZS9saXN0X2VsZW1lbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY3JvbmpvYnMuY29udHJvbGxlcnMubW9kdWxlKCdsaXN0X2VsZW1lbnRzJyxcbiAgICBbXSxcbiAgICAoKSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2dWU6IHRydWUsXG4gICAgICAgICAgICBuYW1lOiAnZ3gtY3JvbmpvYnMtbGlzdC1lbGVtZW50cycsXG4gICAgICAgICAgICBwYXJlbnQ6ICdneC1jcm9uam9icy1vdmVydmlldycsXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJyNjcm9uam9icy1saXN0LWVsZW1lbnRzJyxcbiAgICAgICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgICAgICAgY3JvbmpvYnM6IHtcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IEFycmF5XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRhdGE6ICgpID0+ICh7XG4gICAgICAgICAgICAgICAgbGFuZzoge1xuICAgICAgICAgICAgICAgICAgICBzdWJfdGl0bGVfdGFza3M6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdzdWJfdGl0bGVfdGFza3MnLCAnY3JvbmpvYnMnKSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzX2luYWN0aXZlX2Rlc2NyaXB0aW9uOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnc3RhdHVzX2luYWN0aXZlX2Rlc2NyaXB0aW9uJywgJ2Nyb25qb2JzJyksXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1c19pbmFjdGl2ZToganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ3N0YXR1c19pbmFjdGl2ZScsICdjcm9uam9icycpLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXNfYWN0aXZlX2Rlc2NyaXB0aW9uOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnc3RhdHVzX2FjdGl2ZV9kZXNjcmlwdGlvbicsICdjcm9uam9icycpLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXNfYWN0aXZlOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnc3RhdHVzX2FjdGl2ZScsICdjcm9uam9icycpLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXNfd2FybmluZ19kZXNjcmlwdGlvbjoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ3N0YXR1c193YXJuaW5nX2Rlc2NyaXB0aW9uJywgJ2Nyb25qb2JzJyksXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1c19lcnJvcl9kZXNjcmlwdGlvbjoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ3N0YXR1c19lcnJvcl9kZXNjcmlwdGlvbicsICdjcm9uam9icycpLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXNfbm90X2V4ZWN1dGVkX2Rlc2NyaXB0aW9uOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnc3RhdHVzX25vdF9leGVjdXRlZF9kZXNjcmlwdGlvbicsICdjcm9uam9icycpLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgbWV0aG9kczoge1xuICAgICAgICAgICAgICAgIGdldFBocmFzZSh0aXRsZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwaHJhc2VTZWN0aW9uID0gdGl0bGUuc3BsaXQoJy4nKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VjdGlvbiA9IHBocmFzZVNlY3Rpb25bMF07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBocmFzZSA9IHBocmFzZVNlY3Rpb25bMV07XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKHBocmFzZSwgc2VjdGlvbik7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXRJbnRlcnZhbCh0aXRsZSwgaW50ZXJ2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGhyYXNlU2VjdGlvbiA9IHRpdGxlLnNwbGl0KCcuJyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlY3Rpb24gPSBwaHJhc2VTZWN0aW9uWzBdO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZShpbnRlcnZhbCwgc2VjdGlvbik7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvcGVuTG9nc01vZGFsKGNyb25qb2IpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kZW1pdCgnb3Blbi1sb2dzLW1vZGFsJywgY3JvbmpvYik7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvcGVuQ29uZmlndXJhdGlvbk1vZGFsKGNyb25qb2IpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kZW1pdCgnb3Blbi1jb25maWd1cmF0aW9uLW1vZGFsJywgY3JvbmpvYilcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW5pdDogZG9uZSA9PiBkb25lKClcbiAgICAgICAgfVxuICAgIH0pOyJdfQ==
