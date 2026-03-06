'use strict';

parcel_services.controllers.module('create-modal', ['xhr', gx.source + '/libs/info_messages'], function () {
    return {
        vue: true,
        name: 'gx-create-modal',
        template: '#create-modal',
        parent: 'gx-parcel-services-overview',
        props: ['languages'],
        data: function data() {
            return {
                lang: {
                    title: jse.core.lang.translate('create_modal_title', 'parcel_services'),
                    close: jse.core.lang.translate('cancel', 'buttons'),
                    confirm: jse.core.lang.translate('create', 'buttons'),
                    labels: {
                        name: jse.core.lang.translate('label_name', 'parcel_services'),
                        isDefault: jse.core.lang.translate('label_set_as_default', 'parcel_services'),
                        shipmentType: jse.core.lang.translate('label_shipment_type', 'parcel_services'),
                        comment: jse.core.lang.translate('label_comment', 'parcel_services'),
                        url: jse.core.lang.translate('label_url', 'parcel_services'),
                        placeholder: jse.core.lang.translate('label_tracking_number_placeholder', 'parcel_services')
                    }
                },
                details: {
                    name: '',
                    isDefault: false,
                    shipmentType: '',
                    descriptions: {}
                },
                validFormData: {
                    name: true
                },
                selectedLanguage: ''
            };
        },
        methods: {
            resetModal: function resetModal() {
                this.details.name = '';
                this.details.isDefault = false;
                this.details.shipmentType = '';
                this.descriptions = [];
                for (var i in this.languages) {
                    this.details.descriptions[this.languages[i].code] = {
                        languageCode: this.languages[i].code,
                        url: '',
                        comment: ''
                    };
                }
                this.validFormData.name = true;
                if (this.$children[0] !== undefined) {
                    this.$children[0].input = this.details.isDefault;
                }
            },
            confirm: function confirm() {
                var _this = this;

                if (this.checkFormData() === false) {
                    return;
                }

                jse.libs.xhr.post({
                    url: './api/parcel-services',
                    data: this.details
                }).done(function (response) {
                    _this.$emit('reload-overview');
                }).fail(function (response) {
                    console.error('Could not create parcel service.', response);
                    jse.libs.info_messages.addError(jse.core.lang.translate('error_could_not_create_parcel_service', 'parcel_services'));
                });
                $('.create-modal.modal').modal('hide');
            },
            checkFormData: function checkFormData() {
                this.validFormData.name = this.details.name.trim().length !== 0;

                return this.validFormData.name;
            },
            changeLanguage: function changeLanguage(code) {
                this.selectedLanguage = code;
                if (this.details.descriptions[code] === undefined) {
                    this.details.descriptions[code] = {
                        languageCode: code,
                        url: '',
                        comment: ''
                    };
                }
            },
            openModal: function openModal(details) {
                this.selectedLanguage = this.languages[0].code;
                this.resetModal();
                gx.widgets.init($('.create-modal.modal'));
                $('.create-modal.modal').modal('show');
            }
        },
        init: function init(done) {
            return done();
        }
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhcmNlbF9zZXJ2aWNlcy9jcmVhdGUtbW9kYWwuanMiXSwibmFtZXMiOlsicGFyY2VsX3NlcnZpY2VzIiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJneCIsInNvdXJjZSIsInZ1ZSIsIm5hbWUiLCJ0ZW1wbGF0ZSIsInBhcmVudCIsInByb3BzIiwiZGF0YSIsImxhbmciLCJ0aXRsZSIsImpzZSIsImNvcmUiLCJ0cmFuc2xhdGUiLCJjbG9zZSIsImNvbmZpcm0iLCJsYWJlbHMiLCJpc0RlZmF1bHQiLCJzaGlwbWVudFR5cGUiLCJjb21tZW50IiwidXJsIiwicGxhY2Vob2xkZXIiLCJkZXRhaWxzIiwiZGVzY3JpcHRpb25zIiwidmFsaWRGb3JtRGF0YSIsInNlbGVjdGVkTGFuZ3VhZ2UiLCJtZXRob2RzIiwicmVzZXRNb2RhbCIsImkiLCJsYW5ndWFnZXMiLCJjb2RlIiwibGFuZ3VhZ2VDb2RlIiwiJGNoaWxkcmVuIiwidW5kZWZpbmVkIiwiaW5wdXQiLCJjaGVja0Zvcm1EYXRhIiwibGlicyIsInhociIsInBvc3QiLCJkb25lIiwiJGVtaXQiLCJmYWlsIiwicmVzcG9uc2UiLCJjb25zb2xlIiwiZXJyb3IiLCJpbmZvX21lc3NhZ2VzIiwiYWRkRXJyb3IiLCIkIiwibW9kYWwiLCJ0cmltIiwibGVuZ3RoIiwiY2hhbmdlTGFuZ3VhZ2UiLCJvcGVuTW9kYWwiLCJ3aWRnZXRzIiwiaW5pdCJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsZ0JBQWdCQyxXQUFoQixDQUE0QkMsTUFBNUIsQ0FBbUMsY0FBbkMsRUFDSSxDQUFDLEtBQUQsRUFBV0MsR0FBR0MsTUFBZCx5QkFESixFQUVJLFlBQU07QUFDRixXQUFPO0FBQ0hDLGFBQUssSUFERjtBQUVIQyxjQUFNLGlCQUZIO0FBR0hDLGtCQUFVLGVBSFA7QUFJSEMsZ0JBQVEsNkJBSkw7QUFLSEMsZUFBTyxDQUFDLFdBQUQsQ0FMSjtBQU1IQyxjQUFNO0FBQUEsbUJBQU87QUFDVEMsc0JBQU07QUFDRkMsMkJBQU9DLElBQUlD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b250ZW50IjpbInBhcmNlbF9zZXJ2aWNlcy5jb250cm9sbGVycy5tb2R1bGUoJ2NyZWF0ZS1tb2RhbCcsXG4gICAgWyd4aHInLCBgJHtneC5zb3VyY2V9L2xpYnMvaW5mb19tZXNzYWdlc2AsXSxcbiAgICAoKSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2dWU6IHRydWUsXG4gICAgICAgICAgICBuYW1lOiAnZ3gtY3JlYXRlLW1vZGFsJyxcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnI2NyZWF0ZS1tb2RhbCcsXG4gICAgICAgICAgICBwYXJlbnQ6ICdneC1wYXJjZWwtc2VydmljZXMtb3ZlcnZpZXcnLFxuICAgICAgICAgICAgcHJvcHM6IFsnbGFuZ3VhZ2VzJ10sXG4gICAgICAgICAgICBkYXRhOiAoKSA9PiAoe1xuICAgICAgICAgICAgICAgIGxhbmc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdjcmVhdGVfbW9kYWxfdGl0bGUnLCAncGFyY2VsX3NlcnZpY2VzJyksXG4gICAgICAgICAgICAgICAgICAgIGNsb3NlOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnY2FuY2VsJywgJ2J1dHRvbnMnKSxcbiAgICAgICAgICAgICAgICAgICAgY29uZmlybToganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2NyZWF0ZScsICdidXR0b25zJyksXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZToganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2xhYmVsX25hbWUnLCAncGFyY2VsX3NlcnZpY2VzJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0RlZmF1bHQ6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdsYWJlbF9zZXRfYXNfZGVmYXVsdCcsICdwYXJjZWxfc2VydmljZXMnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoaXBtZW50VHlwZToganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2xhYmVsX3NoaXBtZW50X3R5cGUnLCAncGFyY2VsX3NlcnZpY2VzJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tZW50OiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnbGFiZWxfY29tbWVudCcsICdwYXJjZWxfc2VydmljZXMnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2xhYmVsX3VybCcsICdwYXJjZWxfc2VydmljZXMnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnbGFiZWxfdHJhY2tpbmdfbnVtYmVyX3BsYWNlaG9sZGVyJywgJ3BhcmNlbF9zZXJ2aWNlcycpLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGV0YWlsczoge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgaXNEZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgc2hpcG1lbnRUeXBlOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb25zOiB7fVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdmFsaWRGb3JtRGF0YToge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiB0cnVlLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRMYW5ndWFnZTogJycsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIG1ldGhvZHM6IHtcbiAgICAgICAgICAgICAgICByZXNldE1vZGFsKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRldGFpbHMubmFtZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRldGFpbHMuaXNEZWZhdWx0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGV0YWlscy5zaGlwbWVudFR5cGUgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBpIGluIHRoaXMubGFuZ3VhZ2VzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRldGFpbHMuZGVzY3JpcHRpb25zW3RoaXMubGFuZ3VhZ2VzW2ldLmNvZGVdID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhbmd1YWdlQ29kZTogdGhpcy5sYW5ndWFnZXNbaV0uY29kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1lbnQ6ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbGlkRm9ybURhdGEubmFtZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLiRjaGlsZHJlblswXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiRjaGlsZHJlblswXS5pbnB1dCA9IHRoaXMuZGV0YWlscy5pc0RlZmF1bHQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNvbmZpcm0oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrRm9ybURhdGEoKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAganNlLmxpYnMueGhyLnBvc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnLi9hcGkvcGFyY2VsLXNlcnZpY2VzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRoaXMuZGV0YWlsc1xuICAgICAgICAgICAgICAgICAgICB9KS5kb25lKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJGVtaXQoJ3JlbG9hZC1vdmVydmlldycpO1xuICAgICAgICAgICAgICAgICAgICB9KS5mYWlsKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignQ291bGQgbm90IGNyZWF0ZSBwYXJjZWwgc2VydmljZS4nLCByZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBqc2UubGlicy5pbmZvX21lc3NhZ2VzLmFkZEVycm9yKGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdlcnJvcl9jb3VsZF9ub3RfY3JlYXRlX3BhcmNlbF9zZXJ2aWNlJywgJ3BhcmNlbF9zZXJ2aWNlcycpKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICQoJy5jcmVhdGUtbW9kYWwubW9kYWwnKS5tb2RhbCgnaGlkZScpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY2hlY2tGb3JtRGF0YSgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52YWxpZEZvcm1EYXRhLm5hbWUgPSB0aGlzLmRldGFpbHMubmFtZS50cmltKCkubGVuZ3RoICE9PSAwO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsaWRGb3JtRGF0YS5uYW1lO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY2hhbmdlTGFuZ3VhZ2UoY29kZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkTGFuZ3VhZ2UgPSBjb2RlO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kZXRhaWxzLmRlc2NyaXB0aW9uc1tjb2RlXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRldGFpbHMuZGVzY3JpcHRpb25zW2NvZGVdID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhbmd1YWdlQ29kZTogY29kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1lbnQ6ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgb3Blbk1vZGFsKGRldGFpbHMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZExhbmd1YWdlID0gdGhpcy5sYW5ndWFnZXNbMF0uY29kZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNldE1vZGFsKCk7XG4gICAgICAgICAgICAgICAgICAgIGd4LndpZGdldHMuaW5pdCgkKCcuY3JlYXRlLW1vZGFsLm1vZGFsJykpO1xuICAgICAgICAgICAgICAgICAgICAkKCcuY3JlYXRlLW1vZGFsLm1vZGFsJykubW9kYWwoJ3Nob3cnKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGluaXQ6IGRvbmUgPT4gZG9uZSgpXG4gICAgICAgIH1cbiAgICB9KTsiXX0=
