'use strict';

config.widgets.module('number', [], function () {
    return {
        vue: true,
        name: 'gx-config-number',
        template: '#config-number',
        props: {
            label: {
                required: true,
                type: String
            },
            defaultValue: {
                type: String
            }
        },
        methods: {
            getPhrase: function getPhrase(title) {
                var phraseSection = title.split('.');
                var section = phraseSection[0];
                var phrase = phraseSection[1];

                return jse.core.lang.translate(phrase, section);
            }
        },
        data: function data() {
            return {
                input: this.defaultValue
            };
        },

        watch: {
            input: function input(val) {
                this.$emit('input', val);
            }
        },
        init: function init(done) {
            return done();
        }
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZ1ZS9jb25maWcvbnVtYmVyLmpzIl0sIm5hbWVzIjpbImNvbmZpZyIsIndpZGdldHMiLCJtb2R1bGUiLCJ2dWUiLCJuYW1lIiwidGVtcGxhdGUiLCJwcm9wcyIsImxhYmVsIiwicmVxdWlyZWQiLCJ0eXBlIiwiU3RyaW5nIiwiZGVmYXVsdFZhbHVlIiwibWV0aG9kcyIsImdldFBocmFzZSIsInRpdGxlIiwicGhyYXNlU2VjdGlvbiIsInNwbGl0Iiwic2VjdGlvbiIsInBocmFzZSIsImpzZSIsImNvcmUiLCJsYW5nIiwidHJhbnNsYXRlIiwiZGF0YSIsImlucHV0Iiwid2F0Y2giLCJ2YWwiLCIkZW1pdCIsImluaXQiLCJkb25lIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxPQUFPQyxPQUFQLENBQWVDLE1BQWYsQ0FBc0IsUUFBdEIsRUFDSSxFQURKLEVBRUksWUFBTTtBQUNGLFdBQU87QUFDSEMsYUFBSyxJQURGO0FBRUhDLGNBQU0sa0JBRkg7QUFHSEMsa0JBQVUsZ0JBSFA7QUFJSEMsZUFBTztBQUNIQyxtQkFBTztBQUNIQywwQkFBVSxJQURQO0FBRUhDLHNCQUFNQztBQUZILGFBREo7QUFLSEMsMEJBQWM7QUFDVkYsc0JBQU1DO0FBREk7QUFMWCxTQUpKO0FBYUhFLGlCQUFTO0FBQ0xDLHFCQURLLHFCQUNLQyxLQURMLEVBQ1k7QUFDYixvQkFBTUMsZ0JBQWdCRCxNQUFNRSxLQUFOLENBQVksR0FBWixDQUF0QjtBQUNBLG9CQUFNQyxVQUFVRixjQUFjLENBQWQsQ0FBaEI7QUFDQSxvQkFBTUcsU0FBU0gsY0FBYyxDQUFkLENBQWY7O0FBRUEsdUJBQU9JLElBQUlDLElBQUosQ0FBU0MsSUFBVCxDQUFjQyxTQUFkLENBQXdCSixNQUF4QixFQUFnQ0QsT0FBaEMsQ0FBUDtBQUNIO0FBUEksU0FiTjtBQXNCSE0sWUF0Qkcsa0JBc0JJO0FBQ0gsbUJBQU87QUFDSEMsdUJBQU8sS0FBS2I7QUFEVCxhQUFQO0FBR0gsU0ExQkU7O0FBMkJIYyxlQUFPO0FBQ0hELGlCQURHLGlCQUNHRSxHQURILEVBQ1E7QUFDUCxxQkFBS0MsS0FBTCxDQUFXLE9BQVgsRUFBb0JELEdBQXBCO0FBQ0g7QUFIRSxTQTNCSjtBQWdDSEUsY0FBTTtBQUFBLG1CQUFRQyxNQUFSO0FBQUE7QUFoQ0gsS0FBUDtBQWtDSCxDQXJDTCIsImZpbGUiOiJ2dWUvY29uZmlnL251bWJlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbmZpZy53aWRnZXRzLm1vZHVsZSgnbnVtYmVyJyxcbiAgICBbXSxcbiAgICAoKSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2dWU6IHRydWUsXG4gICAgICAgICAgICBuYW1lOiAnZ3gtY29uZmlnLW51bWJlcicsXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJyNjb25maWctbnVtYmVyJyxcbiAgICAgICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgICAgICAgbGFiZWw6IHtcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFN0cmluZ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFN0cmluZ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtZXRob2RzOiB7XG4gICAgICAgICAgICAgICAgZ2V0UGhyYXNlKHRpdGxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBocmFzZVNlY3Rpb24gPSB0aXRsZS5zcGxpdCgnLicpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzZWN0aW9uID0gcGhyYXNlU2VjdGlvblswXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGhyYXNlID0gcGhyYXNlU2VjdGlvblsxXTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ganNlLmNvcmUubGFuZy50cmFuc2xhdGUocGhyYXNlLCBzZWN0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGF0YSgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dDogdGhpcy5kZWZhdWx0VmFsdWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgd2F0Y2g6IHtcbiAgICAgICAgICAgICAgICBpbnB1dCh2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCB2YWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbml0OiBkb25lID0+IGRvbmUoKVxuICAgICAgICB9XG4gICAgfSk7Il19
