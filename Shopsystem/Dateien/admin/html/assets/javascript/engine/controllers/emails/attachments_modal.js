'use strict';

/* --------------------------------------------------------------
 emails_modal.js 2022-05-14
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2022 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 ----------------------------------------------------------------
 */

/**
 * ## Attachments Modal Controller
 *
 * This controller will handle the attachments modal dialog operations of the admin/emails page.
 *
 * @module Controllers/attachments_modal
 */
gx.controllers.module('attachments_modal', ['modal', gx.source + '/libs/emails', jse.source + '/vendor/DateJS/date'],

/** @lends module:Controllers/attachments_modal */

function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLE DEFINITION
    // ------------------------------------------------------------------------

    var
    /**
     * Module Reference
     *
     * @type {object}
     */
    $this = $(this),


    /**
     * Emails Main Table Selector
     *
     * @type {object}
     */
    $table = $('#emails-table'),


    /**
     * Default Module Options
     *
     * @type {object}
     */
    defaults = {},


    /**
     * Final Module Options
     *
     * @type {object}
     */
    options = $.extend(true, {}, defaults, data),


    /**
     * Module Object
     *
     * @type {object}
     */
    module = {};

    // ------------------------------------------------------------------------
    // EVENT HANDLERS
    // ------------------------------------------------------------------------

    /**
     * Delete old attachments request.
     *
     * @param {object} event Contains the event information.
     */
    var _onDeleteOldAttachments = function _onDeleteOldAttachments(event) {
        // Validate selected date before making the request.
        if ($this.find('#removal-date').val() === '') {
            return; // do not proceed
        }

        // Display confirmation modal before proceeding.
        var modalOptions = {
            title: jse.core.lang.translate('delete', 'buttons') + ' - ' + $this.find('#removal-date').datepicker('getDate').toString('dd.MM.yyyy'),
            content: jse.core.lang.translate('prompt_delete_old_attachments', 'emails'),
            buttons: [{
                text: jse.core.lang.translate('no', 'lightbox_buttons'),
                click: function click() {
                    $(this).dialog('close');
                }
            }, {
                text: jse.core.lang.translate('yes', 'lightbox_buttons'),
                click: function click() {
                    jse.libs.emails.deleteOldAttachments($('#removal-date').datepicker('getDate').toString('yyyy-MM-dd HH:mm:ss')).done(function (response) {
                        var size = response.size.megabytes !== 0 ? response.size.megabytes + ' Megabytes' : response.size.bytes + ' Bytes';

                        var message = jse.core.lang.translate('message_delete_old_attachments_success', 'emails') + '<br/>' + jse.core.lang.translate('count', 'admin_labels') + ': ' + response.count + ', ' + jse.core.lang.translate('size', 'db_backup') + ': ' + size;

                        jse.libs.modal.message({
                            title: 'Info',
                            content: message
                        });

                        $table.DataTable().ajax.reload();
                        $this.dialog('close');
                    }).fail(function (response) {
                        var title = jse.core.lang.translate('error', 'messages');

                        jse.libs.modal.message({
                            title: title,
                            content: response.message
                        });
                    });

                    $(this).dialog('close');
                }
            }]
        };

        jse.libs.modal.message(modalOptions);
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    /**
     * Initialize method of the module, called by the engine.
     */
    module.init = function (done) {
        $this.on('click', '#delete-old-attachments', _onDeleteOldAttachments);
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVtYWlscy9hdHRhY2htZW50c19tb2RhbC5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwic291cmNlIiwianNlIiwiZGF0YSIsIiR0aGlzIiwiJCIsIiR0YWJsZSIsImRlZmF1bHRzIiwib3B0aW9ucyIsImV4dGVuZCIsIl9vbkRlbGV0ZU9sZEF0dGFjaG1lbnRzIiwiZXZlbnQiLCJmaW5kIiwidmFsIiwibW9kYWxPcHRpb25zIiwidGl0bGUiLCJjb3JlIiwibGFuZyIsInRyYW5zbGF0ZSIsImRhdGVwaWNrZXIiLCJ0b1N0cmluZyIsImNvbnRlbnQiLCJidXR0b25zIiwidGV4dCIsImNsaWNrIiwiZGlhbG9nIiwibGlicyIsImVtYWlscyIsImRlbGV0ZU9sZEF0dGFjaG1lbnRzIiwiZG9uZSIsInJlc3BvbnNlIiwic2l6ZSIsIm1lZ2FieXRlcyIsImJ5dGVzIiwibWVzc2FnZSIsImNvdW50IiwibW9kYWwiLCJEYXRhVGFibGUiLCJhamF4IiwicmVsb2FkIiwiZmFpbCIsImluaXQiLCJvbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7O0FBT0FBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZixDQUNJLG1CQURKLEVBR0ksQ0FDSSxPQURKLEVBRUlGLEdBQUdHLE1BQUgsR0FBWSxjQUZoQixFQUdJQyxJQUFJRCxNQUFKLEdBQWEscUJBSGpCLENBSEo7O0FBU0k7O0FBRUEsVUFBVUUsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7Ozs7QUFLQUMsWUFBUUMsRUFBRSxJQUFGLENBTlo7OztBQVFJOzs7OztBQUtBQyxhQUFTRCxFQUFFLGVBQUYsQ0FiYjs7O0FBZUk7Ozs7O0FBS0FFLGVBQVcsRUFwQmY7OztBQXNCSTs7Ozs7QUFLQUMsY0FBVUgsRUFBRUksTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CRixRQUFuQixFQUE2QkosSUFBN0IsQ0EzQmQ7OztBQTZCSTs7Ozs7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QUFULENBQWVGLE9BQWYsQ0FBdUJwQixZQUF2QjtBQUNILEtBMUREOztBQTREQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBZCxXQUFPeUMsSUFBUCxHQUFjLFVBQVVaLElBQVYsRUFBZ0I7QUFDMUJ6QixjQUFNc0MsRUFBTixDQUFTLE9BQVQsRUFBa0IseUJBQWxCLEVBQTZDaEMsdUJBQTdDO0FBQ0FtQjtBQUNILEtBSEQ7O0FBS0EsV0FBTzdCLE1BQVA7QUFDSCxDQXpJTCIsImZpbGUiOiJlbWFpbHMvYXR0YWNobWVudHNfbW9kYWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGVtYWlsc19tb2RhbC5qcyAyMDIyLTA1LTE0XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAyMiBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqICMjIEF0dGFjaG1lbnRzIE1vZGFsIENvbnRyb2xsZXJcbiAqXG4gKiBUaGlzIGNvbnRyb2xsZXIgd2lsbCBoYW5kbGUgdGhlIGF0dGFjaG1lbnRzIG1vZGFsIGRpYWxvZyBvcGVyYXRpb25zIG9mIHRoZSBhZG1pbi9lbWFpbHMgcGFnZS5cbiAqXG4gKiBAbW9kdWxlIENvbnRyb2xsZXJzL2F0dGFjaG1lbnRzX21vZGFsXG4gKi9cbmd4LmNvbnRyb2xsZXJzLm1vZHVsZShcbiAgICAnYXR0YWNobWVudHNfbW9kYWwnLFxuXG4gICAgW1xuICAgICAgICAnbW9kYWwnLFxuICAgICAgICBneC5zb3VyY2UgKyAnL2xpYnMvZW1haWxzJyxcbiAgICAgICAganNlLnNvdXJjZSArICcvdmVuZG9yL0RhdGVKUy9kYXRlJ1xuICAgIF0sXG5cbiAgICAvKiogQGxlbmRzIG1vZHVsZTpDb250cm9sbGVycy9hdHRhY2htZW50c19tb2RhbCAqL1xuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFIERFRklOSVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBSZWZlcmVuY2VcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkdGhpcyA9ICQodGhpcyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRW1haWxzIE1haW4gVGFibGUgU2VsZWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkdGFibGUgPSAkKCcjZW1haWxzLXRhYmxlJyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRGVmYXVsdCBNb2R1bGUgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRlZmF1bHRzID0ge30sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRmluYWwgTW9kdWxlIE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEVWRU5UIEhBTkRMRVJTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWxldGUgb2xkIGF0dGFjaG1lbnRzIHJlcXVlc3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCBDb250YWlucyB0aGUgZXZlbnQgaW5mb3JtYXRpb24uXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX29uRGVsZXRlT2xkQXR0YWNobWVudHMgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIC8vIFZhbGlkYXRlIHNlbGVjdGVkIGRhdGUgYmVmb3JlIG1ha2luZyB0aGUgcmVxdWVzdC5cbiAgICAgICAgICAgIGlmICgkdGhpcy5maW5kKCcjcmVtb3ZhbC1kYXRlJykudmFsKCkgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuOyAvLyBkbyBub3QgcHJvY2VlZFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBEaXNwbGF5IGNvbmZpcm1hdGlvbiBtb2RhbCBiZWZvcmUgcHJvY2VlZGluZy5cbiAgICAgICAgICAgIHZhciBtb2RhbE9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgdGl0bGU6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdkZWxldGUnLCAnYnV0dG9ucycpICsgJyAtICdcbiAgICAgICAgICAgICAgICAgICAgKyAkdGhpcy5maW5kKCcjcmVtb3ZhbC1kYXRlJykuZGF0ZXBpY2tlcignZ2V0RGF0ZScpLnRvU3RyaW5nKCdkZC5NTS55eXl5JyksXG4gICAgICAgICAgICAgICAgY29udGVudDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ3Byb21wdF9kZWxldGVfb2xkX2F0dGFjaG1lbnRzJywgJ2VtYWlscycpLFxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ25vJywgJ2xpZ2h0Ym94X2J1dHRvbnMnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5kaWFsb2coJ2Nsb3NlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCd5ZXMnLCAnbGlnaHRib3hfYnV0dG9ucycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc2UubGlicy5lbWFpbHMuZGVsZXRlT2xkQXR0YWNobWVudHMoJCgnI3JlbW92YWwtZGF0ZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kYXRlcGlja2VyKCdnZXREYXRlJykudG9TdHJpbmcoJ3l5eXktTU0tZGQgSEg6bW06c3MnKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2l6ZSA9IChyZXNwb25zZS5zaXplLm1lZ2FieXRlcyAhPT0gMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHJlc3BvbnNlLnNpemUubWVnYWJ5dGVzICsgJyBNZWdhYnl0ZXMnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiByZXNwb25zZS5zaXplLmJ5dGVzICsgJyBCeXRlcyc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnbWVzc2FnZV9kZWxldGVfb2xkX2F0dGFjaG1lbnRzX3N1Y2Nlc3MnLCAnZW1haWxzJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArICc8YnIvPicgKyBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnY291bnQnLCAnYWRtaW5fbGFiZWxzJykgKyAnOiAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyByZXNwb25zZS5jb3VudCArICcsICcgKyBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnc2l6ZScsICdkYl9iYWNrdXAnKSArICc6ICdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIHNpemU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzZS5saWJzLm1vZGFsLm1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnSW5mbycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogbWVzc2FnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0YWJsZS5EYXRhVGFibGUoKS5hamF4LnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMuZGlhbG9nKCdjbG9zZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmFpbChmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aXRsZSA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdlcnJvcicsICdtZXNzYWdlcycpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc2UubGlicy5tb2RhbC5tZXNzYWdlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogdGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogcmVzcG9uc2UubWVzc2FnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5kaWFsb2coJ2Nsb3NlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBqc2UubGlicy5tb2RhbC5tZXNzYWdlKG1vZGFsT3B0aW9ucyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0aWFsaXplIG1ldGhvZCBvZiB0aGUgbW9kdWxlLCBjYWxsZWQgYnkgdGhlIGVuZ2luZS5cbiAgICAgICAgICovXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgICR0aGlzLm9uKCdjbGljaycsICcjZGVsZXRlLW9sZC1hdHRhY2htZW50cycsIF9vbkRlbGV0ZU9sZEF0dGFjaG1lbnRzKTtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
