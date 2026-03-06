'use strict';

components.widgets.module('switcher', [], function () {
    return {
        vue: true,
        name: 'gx-switcher',
        template: '#gx-switcher',
        props: {
            title: {
                type: String,
                default: ''
            },
            value: {
                type: Boolean,
                default: false
            },
            onState: {
                type: String,
                default: '<span class="fa fa-check"></span>'
            },
            offState: {
                type: String,
                default: '<span class="fa fa-times"></span>'
            }
        },
        data: function data() {
            return {
                input: this.value
            };
        },

        watch: {
            input: function input(val) {
                this.$emit('input', val);
            }
        },
        methods: {
            clickSwitcher: function clickSwitcher() {
                this.input = !this.input;
            }
        },
        init: function init(done) {
            return done();
        }
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZ1ZS9jb21wb25lbnRzL3N3aXRjaGVyLmpzIl0sIm5hbWVzIjpbImNvbXBvbmVudHMiLCJ3aWRnZXRzIiwibW9kdWxlIiwidnVlIiwibmFtZSIsInRlbXBsYXRlIiwicHJvcHMiLCJ0aXRsZSIsInR5cGUiLCJTdHJpbmciLCJkZWZhdWx0IiwidmFsdWUiLCJCb29sZWFuIiwib25TdGF0ZSIsIm9mZlN0YXRlIiwiZGF0YSIsImlucHV0Iiwid2F0Y2giLCJ2YWwiLCIkZW1pdCIsIm1ldGhvZHMiLCJjbGlja1N3aXRjaGVyIiwiaW5pdCIsImRvbmUiXSwibWFwcGluZ3MiOiI7O0FBQUFBLFdBQVdDLE9BQVgsQ0FBbUJDLE1BQW5CLENBQTBCLFVBQTFCLEVBQ0ksRUFESixFQUVJLFlBQU07QUFDRixXQUFPO0FBQ0hDLGFBQUssSUFERjtBQUVIQyxjQUFNLGFBRkg7QUFHSEMsa0JBQVUsY0FIUDtBQUlIQyxlQUFPO0FBQ0hDLG1CQUFPO0FBQ0hDLHNCQUFNQyxNQURIO0FBRUhDLHlCQUFTO0FBRk4sYUFESjtBQUtIQyxtQkFBTztBQUNISCxzQkFBTUksT0FESDtBQUVIRix5QkFBUztBQUZOLGFBTEo7QUFTSEcscUJBQVM7QUFDTEwsc0JBQU1DLE1BREQ7QUFFTEM7QUFGSyxhQVROO0FBYUhJLHNCQUFVO0FBQ05OLHNCQUFNQyxNQURBO0FBRU5DO0FBRk07QUFiUCxTQUpKO0FBc0JISyxZQXRCRyxrQkFzQkk7QUFDSCxtQkFBTztBQUNIQyx1QkFBTyxLQUFLTDtBQURULGFBQVA7QUFHSCxTQTFCRTs7QUEyQkhNLGVBQU87QUFDSEQsaUJBREcsaUJBQ0dFLEdBREgsRUFDUTtBQUNQLHFCQUFLQyxLQUFMLENBQVcsT0FBWCxFQUFvQkQsR0FBcEI7QUFDSDtBQUhFLFNBM0JKO0FBZ0NIRSxpQkFBUztBQUNMQyx5QkFESywyQkFDVztBQUNaLHFCQUFLTCxLQUFMLEdBQWEsQ0FBQyxLQUFLQSxLQUFuQjtBQUNIO0FBSEksU0FoQ047QUFxQ0hNLGNBQU07QUFBQSxtQkFBUUMsTUFBUjtBQUFBO0FBckNILEtBQVA7QUF1Q0gsQ0ExQ0wiLCJmaWxlIjoidnVlL2NvbXBvbmVudHMvc3dpdGNoZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb21wb25lbnRzLndpZGdldHMubW9kdWxlKCdzd2l0Y2hlcicsXG4gICAgW10sXG4gICAgKCkgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdnVlOiB0cnVlLFxuICAgICAgICAgICAgbmFtZTogJ2d4LXN3aXRjaGVyJyxcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnI2d4LXN3aXRjaGVyJyxcbiAgICAgICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiAnJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9uU3RhdGU6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiBgPHNwYW4gY2xhc3M9XCJmYSBmYS1jaGVja1wiPjwvc3Bhbj5gXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvZmZTdGF0ZToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IGA8c3BhbiBjbGFzcz1cImZhIGZhLXRpbWVzXCI+PC9zcGFuPmBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGF0YSgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dDogdGhpcy52YWx1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB3YXRjaDoge1xuICAgICAgICAgICAgICAgIGlucHV0KHZhbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIHZhbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1ldGhvZHM6IHtcbiAgICAgICAgICAgICAgICBjbGlja1N3aXRjaGVyKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0ID0gIXRoaXMuaW5wdXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGluaXQ6IGRvbmUgPT4gZG9uZSgpXG4gICAgICAgIH1cbiAgICB9KTsiXX0=
