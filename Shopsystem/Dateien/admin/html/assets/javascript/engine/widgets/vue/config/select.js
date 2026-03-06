'use strict';

config.widgets.module('select', [], function () {
    return {
        vue: true,
        name: 'gx-config-select',
        template: '#config-select',
        props: {
            label: {
                required: true,
                type: String
            },
            values: {
                required: true,
                type: Array
            },
            defaultValue: {
                type: String
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
        methods: {
            getPhrase: function getPhrase(title) {
                var phraseSection = title.split('.');
                var section = phraseSection[0];
                var phrase = phraseSection[1];

                return jse.core.lang.translate(phrase, section);
            }
        },
        init: function init(done) {
            return done();
        }
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZ1ZS9jb25maWcvc2VsZWN0LmpzIl0sIm5hbWVzIjpbImNvbmZpZyIsIndpZGdldHMiLCJtb2R1bGUiLCJ2dWUiLCJuYW1lIiwidGVtcGxhdGUiLCJwcm9wcyIsImxhYmVsIiwicmVxdWlyZWQiLCJ0eXBlIiwiU3RyaW5nIiwidmFsdWVzIiwiQXJyYXkiLCJkZWZhdWx0VmFsdWUiLCJkYXRhIiwiaW5wdXQiLCJ3YXRjaCIsInZhbCIsIiRlbWl0IiwibWV0aG9kcyIsImdldFBocmFzZSIsInRpdGxlIiwicGhyYXNlU2VjdGlvbiIsInNwbGl0Iiwic2VjdGlvbiIsInBocmFzZSIsImpzZSIsImNvcmUiLCJsYW5nIiwidHJhbnNsYXRlIiwiaW5pdCIsImRvbmUiXSwibWFwcGluZ3MiOiI7O0FBQUFBLE9BQU9DLE9BQVAsQ0FBZUMsTUFBZixDQUFzQixRQUF0QixFQUNJLEVBREosRUFFSSxZQUFNO0FBQ0YsV0FBTztBQUNIQyxhQUFLLElBREY7QUFFSEMsY0FBTSxrQkFGSDtBQUdIQyxrQkFBVSxnQkFIUDtBQUlIQyxlQUFPO0FBQ0hDLG1CQUFPO0FBQ0hDLDBCQUFVLElBRFA7QUFFSEMsc0JBQU1DO0FBRkgsYUFESjtBQUtIQyxvQkFBUTtBQUNKSCwwQkFBVSxJQUROO0FBRUpDLHNCQUFNRztBQUZGLGFBTEw7QUFTSEMsMEJBQWM7QUFDVkosc0JBQU1DO0FBREk7QUFUWCxTQUpKO0FBaUJISSxZQWpCRyxrQkFpQkk7QUFDSCxtQkFBTztBQUNIQyx1QkFBTyxLQUFLRjtBQURULGFBQVA7QUFHSCxTQXJCRTs7QUFzQkhHLGVBQU87QUFDSEQsaUJBREcsaUJBQ0dFLEdBREgsRUFDUTtBQUNQLHFCQUFLQyxLQUFMLENBQVcsT0FBWCxFQUFvQkQsR0FBcEI7QUFDSDtBQUhFLFNBdEJKO0FBMkJIRSxpQkFBUztBQUNMQyxxQkFESyxxQkFDS0MsS0FETCxFQUNZO0FBQ2Isb0JBQU1DLGdCQUFnQkQsTUFBTUUsS0FBTixDQUFZLEdBQVosQ0FBdEI7QUFDQSxvQkFBTUMsVUFBVUYsY0FBYyxDQUFkLENBQWhCO0FBQ0Esb0JBQU1HLFNBQVNILGNBQWMsQ0FBZCxDQUFmOztBQUVBLHVCQUFPSSxJQUFJQyxJQUFKLENBQVNDLElBQVQsQ0FBY0MsU0FBZCxDQUF3QkosTUFBeEIsRUFBZ0NELE9BQWhDLENBQVA7QUFDSDtBQVBJLFNBM0JOO0FBb0NITSxjQUFNO0FBQUEsbUJBQVFDLE1BQVI7QUFBQTtBQXBDSCxLQUFQO0FBc0NILENBekNMIiwiZmlsZSI6InZ1ZS9jb25maWcvc2VsZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uZmlnLndpZGdldHMubW9kdWxlKCdzZWxlY3QnLFxuICAgIFtdLFxuICAgICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZ1ZTogdHJ1ZSxcbiAgICAgICAgICAgIG5hbWU6ICdneC1jb25maWctc2VsZWN0JyxcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnI2NvbmZpZy1zZWxlY3QnLFxuICAgICAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICAgICAgICBsYWJlbDoge1xuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB2YWx1ZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IEFycmF5XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRhdGEoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQ6IHRoaXMuZGVmYXVsdFZhbHVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHdhdGNoOiB7XG4gICAgICAgICAgICAgICAgaW5wdXQodmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgdmFsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWV0aG9kczoge1xuICAgICAgICAgICAgICAgIGdldFBocmFzZSh0aXRsZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwaHJhc2VTZWN0aW9uID0gdGl0bGUuc3BsaXQoJy4nKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VjdGlvbiA9IHBocmFzZVNlY3Rpb25bMF07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBocmFzZSA9IHBocmFzZVNlY3Rpb25bMV07XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKHBocmFzZSwgc2VjdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGluaXQ6IGRvbmUgPT4gZG9uZSgpXG4gICAgICAgIH1cbiAgICB9KTsiXX0=
