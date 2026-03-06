'use strict';

parcel_services.controllers.module('edit-modal', ['xhr', gx.source + '/libs/info_messages'], function () {
    return {
        vue: true,
        name: 'gx-edit-modal',
        template: '#edit-modal',
        parent: 'gx-parcel-services-overview',
        props: ['languages'],
        data: function data() {
            return {
                lang: {
                    title: jse.core.lang.translate('edit_modal_title', 'parcel_services'),
                    close: jse.core.lang.translate('cancel', 'buttons'),
                    confirm: jse.core.lang.translate('save', 'buttons'),
                    labels: {
                        name: jse.core.lang.translate('label_name', 'parcel_services'),
                        isDefault: jse.core.lang.translate('label_set_as_default', 'parcel_services'),
                        shipmentType: jse.core.lang.translate('label_shipment_type', 'parcel_services'),
                        comment: jse.core.lang.translate('label_comment', 'parcel_services'),
                        url: jse.core.lang.translate('label_url', 'parcel_services'),
                        placeholder: jse.core.lang.translate('label_tracking_number_placeholder', 'parcel_services')
                    }
                },
                validFormData: {
                    name: true
                },
                selectedLanguage: '',
                details: {
                    name: '',
                    isDefault: false,
                    shipmentType: '',
                    descriptions: []
                }
            };
        },
        methods: {
            confirm: function confirm() {
                var _this = this;

                if (this.checkFormData() === false) {
                    return;
                }

                jse.libs.xhr.put({
                    url: './api/parcel-services',
                    data: this.details
                }).done(function (response) {
                    _this.$emit('reload-overview');
                }).fail(function (response) {
                    console.error('Could not update parcel service.', response);
                    jse.libs.info_messages.addError(jse.core.lang.translate('error_could_not_update_parcel_service', 'parcel_services'));
                });
                $('.edit-modal.modal').modal('hide');
            },
            checkFormData: function checkFormData() {
                this.validFormData.name = this.details.name.trim().length !== 0;

                return this.validFormData.name;
            },
            changeLanguage: function changeLanguage(languageCode) {
                this.selectedLanguage = languageCode;
                if (this.details.descriptions[languageCode] === undefined) {
                    this.details.descriptions[languageCode] = {
                        languageCode: languageCode,
                        url: '',
                        comment: ''
                    };
                }
            },
            openModal: function openModal(details) {
                this.selectedLanguage = this.languages[0].code;
                this.details = {
                    id: details.id,
                    name: details.name,
                    isDefault: details.isDefault,
                    shipmentType: details.shipmentType,
                    descriptions: {}
                };
                for (var i in details.descriptions) {
                    var languageCode = details.descriptions[i].languageCode;
                    this.details.descriptions[languageCode] = details.descriptions[i];
                }

                if (this.$children[0] !== undefined) {
                    this.$children[0].input = this.details.isDefault;
                }
                gx.widgets.init($('.edit-modal.modal'));
                $('.edit-modal.modal').modal('show');
            }
        },
        init: function init(done) {
            return done();
        }
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhcmNlbF9zZXJ2aWNlcy9lZGl0LW1vZGFsLmpzIl0sIm5hbWVzIjpbInBhcmNlbF9zZXJ2aWNlcyIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwiZ3giLCJzb3VyY2UiLCJ2dWUiLCJuYW1lIiwidGVtcGxhdGUiLCJwYXJlbnQiLCJwcm9wcyIsImRhdGEiLCJsYW5nIiwidGl0bGUiLCJqc2UiLCJjb3JlIiwidHJhbnNsYXRlIiwiY2xvc2UiLCJjb25maXJtIiwibGFiZWxzIiwiaXNEZWZhdWx0Iiwic2hpcG1lbnRUeXBlIiwiY29tbWVudCIsInVybCIsInBsYWNlaG9sZGVyIiwidmFsaWRGb3JtRGF0YSIsInNlbGVjdGVkTGFuZ3VhZ2UiLCJkZXRhaWxzIiwiZGVzY3JpcHRpb25zIiwibWV0aG9kcyIsImNoZWNrRm9ybURhdGEiLCJsaWJzIiwieGhyIiwicHV0IiwiZG9uZSIsIiRlbWl0IiwiZmFpbCIsInJlc3BvbnNlIiwiY29uc29sZSIsImVycm9yIiwiaW5mb19tZXNzYWdlcyIsImFkZEVycm9yIiwiJCIsIm1vZGFsIiwidHJpbSIsImxlbmd0aCIsImNoYW5nZUxhbmd1YWdlIiwibGFuZ3VhZ2VDb2RlIiwidW5kZWZpbmVkIiwib3Blbk1vZGFsIiwibGFuZ3VhZ2VzIiwiY29kZSIsImlkIiwiaSIsIiRjaGlsZHJlbiIsImlucHV0Iiwid2lkZ2V0cyIsImluaXQiXSwibWFwcGluZ3MiOiI7O0FBQUFBLGdCQUFnQkMsV0FBaEIsQ0FBNEJDLE1BQTVCLENBQW1DLFlBQW5DLEVBQ0ksQ0FBQyxLQUFELEVBQVdDLEdBQUdDLE1BQWQseUJBREosRUFFSSxZQUFNO0FBQ0YsV0FBTztBQUNIQyxhQUFLLElBREY7QUFFSEMsY0FBTSxlQUZIO0FBR0hDLGtCQUFVLGFBSFA7QUFJSEMsZ0JBQVEsNkJBSkw7QUFLSEMsZUFBTyxDQUFDLFdBQUQsQ0FMSjtBQU1IQyxjQUFNO0FBQUEsbUJBQU87QUFDVEMsc0JBQU07QUFDRkMsMkJBQU9DLElBQUlDLElBQUosQ0FBU0gsSUFBVCxDQUFjSSxTQUFkLENBQXdCLGtCQUF4QixFQUE0QyxpQkFBNUMsQ0FETDtBQUVGQywyQkFBT0gsSUFBSUMsSUFBSixDQUFTSCxJQUFULENBQWNJLFNBQWQsQ0FBd0IsUUFBeEIsRUFBa0MsU0FBbEMsQ0FGTDtBQUdGRSw2QkFBU0osSUFBSUMsSUFBSixDQUFTSCxJQUFULENBQWNJLFNBQWQsQ0FBd0IsTUFBeEIsRUFBZ0MsU0FBaEMsQ0FIUDtBQUlGRyw0QkFBUTtBQUNKWiw4QkFBTU8sSUFBSUMsSUFBSixDQUFTSCxJQUFULENBQWNJLFNBQWQsQ0FBd0IsWUFBeEIsRUFBc0MsaUJBQXRDLENBREY7QUFFSkksbUNBQVdOLElBQUlDLElBQUosQ0FBU0gsSUFBVCxDQUFjSSxTQUFkLENBQXdCLHNCQUF4QixFQUFnRCxpQkFBaEQsQ0FGUDtBQUdKSyxzQ0FBY1AsSUFBSUMsSUFBSixDQUFTSCxJQUFULENBQWNJLFNBQWQsQ0FBd0IscUJBQXhCLEVBQStDLGlCQUEvQyxDQUhWO0FBSUpNLGlDQUFTUixJQUFJQyxJQUFKLENBQVNILElBQVQsQ0FBY0ksU0FBZCxDQUF3QixlQUF4QixFQUF5QyxpQkFBekMsQ0FKTDtBQUtKTyw2QkFBS1QsSUFBSUMsSUFBSixDQUFTSCxJQUFULENBQWNJLFNBQWQsQ0FBd0IsV0FBeEIsRUFBcUMsaUJBQXJDLENBTEQ7QUFNSlEscUNBQWFWLElBQUlDLElBQUosQ0FBU0gsSUFBVCxDQUFjSSxTQUFkLENBQXdCLG1DQUF4QixFQUE2RCxpQkFBN0Q7QUFOVDtBQUpOLGlCQURHO0FBY1RTLCtCQUFlO0FBQ1hsQiwwQkFBTTtBQURLLGlCQWROO0FBaUJUbUIsa0NBQWtCLEVBakJUO0FBa0JUQyx5QkFBUztBQUNMcEIsMEJBQU0sRUFERDtBQUVMYSwrQkFBVyxLQUZOO0FBR0xDLGtDQUFjLEVBSFQ7QUFJTE8sa0NBQWM7QUFKVDtBQWxCQSxhQUFQO0FBQUEsU0FOSDtBQStCSEMsaUJBQVM7QUFDTFgsbUJBREsscUJBQ0s7QUFBQTs7QUFDTixvQkFBSSxLQUFLWSxhQUFMLE9BQXlCLEtBQTdCLEVBQW9DO0FBQ2hDO0FBQ0g7O0FBRURoQixvQkFBSWlCLElBQUosQ0FBU0MsR0FBVCxDQUFhQyxHQUFiLENBQWlCO0FBQ2JWLHlCQUFLLHVCQURRO0FBRWJaLDBCQUFNLEtBQUtnQjtBQUZFLGlCQUFqQixFQUdHTyxJQUhILENBR1Esb0JBQVk7QUFDaEIsMEJBQUtDLEtBQUwsQ0FBVyxpQkFBWDtBQUNILGlCQUxELEVBS0dDLElBTEgsQ0FLUSxVQUFDQyxRQUFELEVBQWM7QUFDbEJDLDRCQUFRQyxLQUFSLENBQWMsa0NBQWQsRUFBa0RGLFFBQWxEO0FBQ0F2Qix3QkFBSWlCLElBQUosQ0FBU1MsYUFBVCxDQUF1QkMsUUFBdkIsQ0FBZ0MzQixJQUFJQyxJQUFKLENBQVNILElBQVQsQ0FBY0ksU0FBZCxDQUF3Qix1Q0FBeEIsRUFBaUUsaUJBQWpFLENBQWhDO0FBQ0gsaUJBUkQ7QUFTQTBCLGtCQUFFLG1CQUFGLEVBQXVCQyxLQUF2QixDQUE2QixNQUE3QjtBQUNILGFBaEJJO0FBaUJMYix5QkFqQkssMkJBaUJXO0FBQ1oscUJBQUtMLGFBQUwsQ0FBbUJsQixJQUFuQixHQUEwQixLQUFLb0IsT0FBTCxDQUFhcEIsSUFBYixDQUFrQnFDLElBQWxCLEdBQXlCQyxNQUF6QixLQUFvQyxDQUE5RDs7QUFFQSx1QkFBTyxLQUFLcEIsYUFBTCxDQUFtQmxCLElBQTFCO0FBQ0gsYUFyQkk7QUFzQkx1QywwQkF0QkssMEJBc0JVQyxZQXRCVixFQXNCd0I7QUFDekIscUJBQUtyQixnQkFBTCxHQUF3QnFCLFlBQXhCO0FBQ0Esb0JBQUksS0FBS3BCLE9BQUwsQ0FBYUMsWUFBYixDQUEwQm1CLFlBQTFCLE1BQTRDQyxTQUFoRCxFQUEyRDtBQUN2RCx5QkFBS3JCLE9BQUwsQ0FBYUMsWUFBYixDQUEwQm1CLFlBQTFCLElBQTBDO0FBQ3RDQSxzQ0FBY0EsWUFEd0I7QUFFdEN4Qiw2QkFBSyxFQUZpQztBQUd0Q0QsaUNBQVM7QUFINkIscUJBQTFDO0FBS0g7QUFDSixhQS9CSTtBQWdDTDJCLHFCQWhDSyxxQkFnQ0t0QixPQWhDTCxFQWdDYztBQUNmLHFCQUFLRCxnQkFBTCxHQUF3QixLQUFLd0IsU0FBTCxDQUFlLENBQWYsRUFBa0JDLElBQTFDO0FBQ0EscUJBQUt4QixPQUFMLEdBQWU7QUFDWHlCLHdCQUFJekIsUUFBUXlCLEVBREQ7QUFFWDdDLDBCQUFNb0IsUUFBUXBCLElBRkg7QUFHWGEsK0JBQVdPLFFBQVFQLFNBSFI7QUFJWEMsa0NBQWNNLFFBQVFOLFlBSlg7QUFLWE8sa0NBQWM7QUFMSCxpQkFBZjtBQU9BLHFCQUFLLElBQU15QixDQUFYLElBQWdCMUIsUUFBUUMsWUFBeEIsRUFBc0M7QUFDbEMsd0JBQU1tQixlQUFlcEIsUUFBUUMsWUFBUixDQUFxQnlCLENBQXJCLEVBQXdCTixZQUE3QztBQUNBLHlCQUFLcEIsT0FBTCxDQUFhQyxZQUFiLENBQTBCbUIsWUFBMUIsSUFBMENwQixRQUFRQyxZQUFSLENBQXFCeUIsQ0FBckIsQ0FBMUM7QUFDSDs7QUFFRCxvQkFBSSxLQUFLQyxTQUFMLENBQWUsQ0FBZixNQUFzQk4sU0FBMUIsRUFBcUM7QUFDakMseUJBQUtNLFNBQUwsQ0FBZSxDQUFmLEVBQWtCQyxLQUFsQixHQUEwQixLQUFLNUIsT0FBTCxDQUFhUCxTQUF2QztBQUNIO0FBQ0RoQixtQkFBR29ELE9BQUgsQ0FBV0MsSUFBWCxDQUFnQmYsRUFBRSxtQkFBRixDQUFoQjtBQUNBQSxrQkFBRSxtQkFBRixFQUF1QkMsS0FBdkIsQ0FBNkIsTUFBN0I7QUFDSDtBQW5ESSxTQS9CTjtBQW9GSGMsY0FBTTtBQUFBLG1CQUFRdkIsTUFBUjtBQUFBO0FBcEZILEtBQVA7QUFzRkgsQ0F6RkwiLCJmaWxlIjoicGFyY2VsX3NlcnZpY2VzL2VkaXQtbW9kYWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJwYXJjZWxfc2VydmljZXMuY29udHJvbGxlcnMubW9kdWxlKCdlZGl0LW1vZGFsJyxcbiAgICBbJ3hocicsIGAke2d4LnNvdXJjZX0vbGlicy9pbmZvX21lc3NhZ2VzYCxdLFxuICAgICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZ1ZTogdHJ1ZSxcbiAgICAgICAgICAgIG5hbWU6ICdneC1lZGl0LW1vZGFsJyxcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnI2VkaXQtbW9kYWwnLFxuICAgICAgICAgICAgcGFyZW50OiAnZ3gtcGFyY2VsLXNlcnZpY2VzLW92ZXJ2aWV3JyxcbiAgICAgICAgICAgIHByb3BzOiBbJ2xhbmd1YWdlcyddLFxuICAgICAgICAgICAgZGF0YTogKCkgPT4gKHtcbiAgICAgICAgICAgICAgICBsYW5nOiB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnZWRpdF9tb2RhbF90aXRsZScsICdwYXJjZWxfc2VydmljZXMnKSxcbiAgICAgICAgICAgICAgICAgICAgY2xvc2U6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdjYW5jZWwnLCAnYnV0dG9ucycpLFxuICAgICAgICAgICAgICAgICAgICBjb25maXJtOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnc2F2ZScsICdidXR0b25zJyksXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZToganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2xhYmVsX25hbWUnLCAncGFyY2VsX3NlcnZpY2VzJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0RlZmF1bHQ6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdsYWJlbF9zZXRfYXNfZGVmYXVsdCcsICdwYXJjZWxfc2VydmljZXMnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoaXBtZW50VHlwZToganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2xhYmVsX3NoaXBtZW50X3R5cGUnLCAncGFyY2VsX3NlcnZpY2VzJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tZW50OiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnbGFiZWxfY29tbWVudCcsICdwYXJjZWxfc2VydmljZXMnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2xhYmVsX3VybCcsICdwYXJjZWxfc2VydmljZXMnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnbGFiZWxfdHJhY2tpbmdfbnVtYmVyX3BsYWNlaG9sZGVyJywgJ3BhcmNlbF9zZXJ2aWNlcycpLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdmFsaWRGb3JtRGF0YToge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiB0cnVlLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRMYW5ndWFnZTogJycsXG4gICAgICAgICAgICAgICAgZGV0YWlsczoge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgaXNEZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgc2hpcG1lbnRUeXBlOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb25zOiBbXSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIG1ldGhvZHM6IHtcbiAgICAgICAgICAgICAgICBjb25maXJtKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGVja0Zvcm1EYXRhKCkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGpzZS5saWJzLnhoci5wdXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnLi9hcGkvcGFyY2VsLXNlcnZpY2VzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRoaXMuZGV0YWlsc1xuICAgICAgICAgICAgICAgICAgICB9KS5kb25lKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJGVtaXQoJ3JlbG9hZC1vdmVydmlldycpO1xuICAgICAgICAgICAgICAgICAgICB9KS5mYWlsKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignQ291bGQgbm90IHVwZGF0ZSBwYXJjZWwgc2VydmljZS4nLCByZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBqc2UubGlicy5pbmZvX21lc3NhZ2VzLmFkZEVycm9yKGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdlcnJvcl9jb3VsZF9ub3RfdXBkYXRlX3BhcmNlbF9zZXJ2aWNlJywgJ3BhcmNlbF9zZXJ2aWNlcycpKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICQoJy5lZGl0LW1vZGFsLm1vZGFsJykubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNoZWNrRm9ybURhdGEoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFsaWRGb3JtRGF0YS5uYW1lID0gdGhpcy5kZXRhaWxzLm5hbWUudHJpbSgpLmxlbmd0aCAhPT0gMDtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnZhbGlkRm9ybURhdGEubmFtZTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNoYW5nZUxhbmd1YWdlKGxhbmd1YWdlQ29kZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkTGFuZ3VhZ2UgPSBsYW5ndWFnZUNvZGU7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRldGFpbHMuZGVzY3JpcHRpb25zW2xhbmd1YWdlQ29kZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXRhaWxzLmRlc2NyaXB0aW9uc1tsYW5ndWFnZUNvZGVdID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhbmd1YWdlQ29kZTogbGFuZ3VhZ2VDb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbWVudDogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvcGVuTW9kYWwoZGV0YWlscykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkTGFuZ3VhZ2UgPSB0aGlzLmxhbmd1YWdlc1swXS5jb2RlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRldGFpbHMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogZGV0YWlscy5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGRldGFpbHMubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVmYXVsdDogZGV0YWlscy5pc0RlZmF1bHQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGlwbWVudFR5cGU6IGRldGFpbHMuc2hpcG1lbnRUeXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb25zOiB7fSxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBpIGluIGRldGFpbHMuZGVzY3JpcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsYW5ndWFnZUNvZGUgPSBkZXRhaWxzLmRlc2NyaXB0aW9uc1tpXS5sYW5ndWFnZUNvZGU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRldGFpbHMuZGVzY3JpcHRpb25zW2xhbmd1YWdlQ29kZV0gPSBkZXRhaWxzLmRlc2NyaXB0aW9uc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuJGNoaWxkcmVuWzBdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJGNoaWxkcmVuWzBdLmlucHV0ID0gdGhpcy5kZXRhaWxzLmlzRGVmYXVsdDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBneC53aWRnZXRzLmluaXQoJCgnLmVkaXQtbW9kYWwubW9kYWwnKSk7XG4gICAgICAgICAgICAgICAgICAgICQoJy5lZGl0LW1vZGFsLm1vZGFsJykubW9kYWwoJ3Nob3cnKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGluaXQ6IGRvbmUgPT4gZG9uZSgpXG4gICAgICAgIH1cbiAgICB9KTsiXX0=
