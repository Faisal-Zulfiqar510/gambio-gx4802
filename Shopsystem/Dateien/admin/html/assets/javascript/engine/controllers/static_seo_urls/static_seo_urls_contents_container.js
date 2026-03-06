'use strict';

/* --------------------------------------------------------------
 static_seo_urls_contents_container.js 2017-05-24
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Controller Module For Static Seo Url Content Container (Tabs)
 *
 * Handles the static seo url content container functionality in the static seo url details page.
 */
gx.controllers.module('static_seo_urls_contents_container', [jse.source + '/vendor/jquery-ui-dist/jquery-ui.min.css', jse.source + '/vendor/jquery-ui-dist/jquery-ui.min.js', 'modal'], function (data) {

    'use strict';

    // --------------------------------------------------------------------
    // VARIABLES
    // --------------------------------------------------------------------

    /**
     * Module Selector
     *
     * @type {jQuery}
     */

    var $this = $(this);

    /**
     * Save Bar
     * @type {jQuery}
     */
    var saveBar = $('.bottom-save-bar');

    /**
     * Elements
     *
     * @type {Object}
     */
    var elements = {
        // Buttons.
        buttons: {

            // Submit button group.
            submit: saveBar.find('.submit-button-group'),

            // Submit button for save static seo url
            submitSave: saveBar.find('.save'),

            // Submit button for save and refresh static seo url
            submitRefresh: saveBar.find('.refresh')
        },

        // Template.
        templates: {},

        // Modals.
        modals: {},

        // Tabs.
        tabHeader: $this.find('.nav-tabs'),

        // Form.
        form: $('.static-seo-urls-details > form')
    };

    /**
     * Selector Strings
     *
     * @type {Object}
     */
    var selectors = {
        // Icon selector strings.
        icons: {
            // Delete button on the panel header.
            delete: '.icon.delete',

            // Drag button on the panel header.
            drag: '.drag-handle',

            // Collapser button on the panel header.
            collapser: '.collapser',

            // Image delete button.
            imageDelete: '.action-icon.delete',

            // Image map edit button.
            imageMap: '.action-icon.image-map',

            // Upload image button.
            upload: '.action-icon.upload'
        },

        // Inputs selector strings.
        inputs: {
            // General image select dropdowns.
            dropdown: '.dropdown-input',

            // Thumbnail dropdown.
            thumbnailImageDropdown: '[name="thumbnail"]',

            // Title.
            title: 'input[name="title"]',

            // File.
            file: '.file-input'
        },

        // Static seo url content panel.
        staticSeoUrlContentPanel: '.panel',

        // Tab body.
        tabBody: '.tab-pane',

        // Static seo url content panel title.
        staticSeoUrlContentPanelTitle: '.staticSeoUrlContent-title',

        // Setting row (form group).
        configurationRow: '.row.form-group',

        // Data list container for image map.
        imageMapDataList: '.image-map-data-list'
    };

    /**
     * Module Instance
     *
     * @type {Object}
     */
    var module = {};

    // --------------------------------------------------------------------
    // FUNCTIONS
    // --------------------------------------------------------------------

    /**
     * Handles the key-up event on the staticSeoUrlContent title input field.
     *
     * @param {jQuery.Event} event Triggered event.
     */
    function _onTitleKeyup(event) {
        // Title input field.
        var $input = $(event.target);

        // Static seo url content panel title element.
        var $title = $input.parents(selectors.staticSeoUrlContentPanel).find(selectors.staticSeoUrlContentPanelTitle);

        // Transfer input value to staticSeoUrlContent panel title.
        $title.text($input.val());
    }

    /**
     * Handles the mouse-enter event on a configuration row.
     *
     * @param {jQuery.Event} event Triggered event.
     */
    function _onConfigRowMouseEnter(event) {
        // Configuration row element.
        var $row = $(event.target);

        // Image map edit icon.
        var $imageMapIcon = $row.find(selectors.icons.imageMap);

        // Image map data container list element.
        var $list = $row.find(selectors.imageMapDataList);

        // Return immediately, if the image map edit icon does not exist.
        if (!$imageMapIcon.length || !$list.length) {
            return;
        }

        if ($list.children().length) {
            $imageMapIcon.removeClass('fa-external-link').addClass('fa-external-link-square');
        } else {
            $imageMapIcon.removeClass('fa-external-link-square').addClass('fa-external-link');
        }
    }

    /**
     * Handles the click event on the save button.
     */
    function _onSubmitSave() {
        elements.form.trigger('submit');
    }

    /**
     * Handles the click event on the refresh list item in the submit button group.
     */
    function _onSubmitRefresh() {
        elements.form.trigger('submit', { refresh: true });
    }

    // --------------------------------------------------------------------
    // INITIALIZATION
    // --------------------------------------------------------------------

    module.init = function (done) {

        // Attach event handlers to sort actions, static seo url content panel delete button and inputs fields.
        $this.on('keyup', selectors.inputs.title, _onTitleKeyup).on('mouseenter', selectors.configurationRow, _onConfigRowMouseEnter);

        // Attach event listeners to submit buttons.
        elements.buttons.submitSave.on('click', _onSubmitSave);
        elements.buttons.submitRefresh.on('click', _onSubmitRefresh);

        // Activate first tab.
        elements.tabHeader.children().first().addClass('active');

        // Activate first tab content.
        $this.find(selectors.tabBody).first().addClass('active in');

        // Trigger dropdown change event to hide the remove icon, if 'do not use' is selected.
        $this.find(selectors.inputs.dropdown).trigger('change', [false]);

        // Finish initialization.
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0YXRpY19zZW9fdXJscy9zdGF0aWNfc2VvX3VybHNfY29udGVudHNfY29udGFpbmVyLmpzIl0sIm5hbWVzIjpbImd4IiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJqc2UiLCJzb3VyY2UiLCJkYXRhIiwiJHRoaXMiLCIkIiwic2F2ZUJhciIsImVsZW1lbnRzIiwiYnV0dG9ucyIsInN1Ym1pdCIsImZpbmQiLCJzdWJtaXRTYXZlIiwic3VibWl0UmVmcmVzaCIsInRlbXBsYXRlcyIsIm1vZGFscyIsInRhYkhlYWRlciIsImZvcm0iLCJzZWxlY3RvcnMiLCJpY29ucyIsImRlbGV0ZSIsImRyYWciLCJjb2xsYXBzZXIiLCJpbWFnZURlbGV0ZSIsImltYWdlTWFwIiwidXBsb2FkIiwiaW5wdXRzIiwiZHJvcGRvd24iLCJ0aHVtYm5haWxJbWFnZURyb3Bkb3duIiwidGl0bGUiLCJmaWxlIiwic3RhdGljU2VvVXJsQ29udGVudFBhbmVsIiwidGFiQm9keSIsInN0YXRpY1Nlb1VybENvbnRlbnRQYW5lbFRpdGxlIiwiY29uZmlndXJhdGlvblJvdyIsImltYWdlTWFwRGF0YUxpc3QiLCJfb25UaXRsZUtleXVwIiwiZXZlbnQiLCIkaW5wdXQiLCJ0YXJnZXQiLCIkdGl0bGUiLCJwYXJlbnRzIiwidGV4dCIsInZhbCIsIl9vbkNvbmZpZ1Jvd01vdXNlRW50ZXIiLCIkcm93IiwiJGltYWdlTWFwSWNvbiIsIiRsaXN0IiwibGVuZ3RoIiwiY2hpbGRyZW4iLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwiX29uU3VibWl0U2F2ZSIsInRyaWdnZXIiLCJfb25TdWJtaXRSZWZyZXNoIiwicmVmcmVzaCIsImluaXQiLCJvbiIsImZpcnN0IiwiZG9uZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7OztBQUtBQSxHQUFHQyxXQUFILENBQWVDLE1BQWYsQ0FDSSxvQ0FESixFQUdJLENBQ09DLElBQUlDLE1BRFgsK0NBRU9ELElBQUlDLE1BRlgsOENBR0ksT0FI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S29DLE9BRkwsQ0FFYSxRQUZiLEVBRXVCLEVBQUNFLFNBQVMsSUFBVixFQUZ2QjtBQUdIOztBQUVEO0FBQ0E7QUFDQTs7QUFFQXRELFdBQU91RCxJQUFQLEdBQWMsZ0JBQVE7O0FBRWxCO0FBQ0FuRCxjQUNLb0QsRUFETCxDQUNRLE9BRFIsRUFDaUJ2QyxVQUFVUSxNQUFWLENBQWlCRyxLQURsQyxFQUN5Q08sYUFEekMsRUFFS3FCLEVBRkwsQ0FFUSxZQUZSLEVBRXNCdkMsVUFBVWdCLGdCQUZoQyxFQUVrRFUsc0JBRmxEOztBQUlBO0FBQ0FwQyxpQkFBU0MsT0FBVCxDQUFpQkcsVUFBakIsQ0FBNEI2QyxFQUE1QixDQUErQixPQUEvQixFQUF3Q0wsYUFBeEM7QUFDQTVDLGlCQUFTQyxPQUFULENBQWlCSSxhQUFqQixDQUErQjRDLEVBQS9CLENBQWtDLE9BQWxDLEVBQTJDSCxnQkFBM0M7O0FBRUE7QUFDQTlDLGlCQUFTUSxTQUFULENBQ0tpQyxRQURMLEdBRUtTLEtBRkwsR0FHS1AsUUFITCxDQUdjLFFBSGQ7O0FBS0E7QUFDQTlDLGNBQ0tNLElBREwsQ0FDVU8sVUFBVWMsT0FEcEIsRUFFSzBCLEtBRkwsR0FHS1AsUUFITCxDQUdjLFdBSGQ7O0FBS0E7QUFDQTlDLGNBQ0tNLElBREwsQ0FDVU8sVUFBVVEsTUFBVixDQUFpQkMsUUFEM0IsRUFFSzBCLE9BRkwsQ0FFYSxRQUZiLEVBRXVCLENBQUMsS0FBRCxDQUZ2Qjs7QUFJQTtBQUNBTTtBQUNILEtBOUJEOztBQWdDQSxXQUFPMUQsTUFBUDtBQUNILENBdk9MIiwiZmlsZSI6InN0YXRpY19zZW9fdXJscy9zdGF0aWNfc2VvX3VybHNfY29udGVudHNfY29udGFpbmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBzdGF0aWNfc2VvX3VybHNfY29udGVudHNfY29udGFpbmVyLmpzIDIwMTctMDUtMjRcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE3IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqIENvbnRyb2xsZXIgTW9kdWxlIEZvciBTdGF0aWMgU2VvIFVybCBDb250ZW50IENvbnRhaW5lciAoVGFicylcbiAqXG4gKiBIYW5kbGVzIHRoZSBzdGF0aWMgc2VvIHVybCBjb250ZW50IGNvbnRhaW5lciBmdW5jdGlvbmFsaXR5IGluIHRoZSBzdGF0aWMgc2VvIHVybCBkZXRhaWxzIHBhZ2UuXG4gKi9cbmd4LmNvbnRyb2xsZXJzLm1vZHVsZShcbiAgICAnc3RhdGljX3Nlb191cmxzX2NvbnRlbnRzX2NvbnRhaW5lcicsXG5cbiAgICBbXG4gICAgICAgIGAke2pzZS5zb3VyY2V9L3ZlbmRvci9qcXVlcnktdWktZGlzdC9qcXVlcnktdWkubWluLmNzc2AsXG4gICAgICAgIGAke2pzZS5zb3VyY2V9L3ZlbmRvci9qcXVlcnktdWktZGlzdC9qcXVlcnktdWkubWluLmpzYCxcbiAgICAgICAgJ21vZGFsJ1xuICAgIF0sXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNhdmUgQmFyXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBzYXZlQmFyID0gJCgnLmJvdHRvbS1zYXZlLWJhcicpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFbGVtZW50c1xuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgZWxlbWVudHMgPSB7XG4gICAgICAgICAgICAvLyBCdXR0b25zLlxuICAgICAgICAgICAgYnV0dG9uczoge1xuXG4gICAgICAgICAgICAgICAgLy8gU3VibWl0IGJ1dHRvbiBncm91cC5cbiAgICAgICAgICAgICAgICBzdWJtaXQ6IHNhdmVCYXIuZmluZCgnLnN1Ym1pdC1idXR0b24tZ3JvdXAnKSxcblxuICAgICAgICAgICAgICAgIC8vIFN1Ym1pdCBidXR0b24gZm9yIHNhdmUgc3RhdGljIHNlbyB1cmxcbiAgICAgICAgICAgICAgICBzdWJtaXRTYXZlOiBzYXZlQmFyLmZpbmQoJy5zYXZlJyksXG5cbiAgICAgICAgICAgICAgICAvLyBTdWJtaXQgYnV0dG9uIGZvciBzYXZlIGFuZCByZWZyZXNoIHN0YXRpYyBzZW8gdXJsXG4gICAgICAgICAgICAgICAgc3VibWl0UmVmcmVzaDogc2F2ZUJhci5maW5kKCcucmVmcmVzaCcpLFxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8gVGVtcGxhdGUuXG4gICAgICAgICAgICB0ZW1wbGF0ZXM6IHt9LFxuXG4gICAgICAgICAgICAvLyBNb2RhbHMuXG4gICAgICAgICAgICBtb2RhbHM6IHt9LFxuXG4gICAgICAgICAgICAvLyBUYWJzLlxuICAgICAgICAgICAgdGFiSGVhZGVyOiAkdGhpcy5maW5kKCcubmF2LXRhYnMnKSxcblxuICAgICAgICAgICAgLy8gRm9ybS5cbiAgICAgICAgICAgIGZvcm06ICQoJy5zdGF0aWMtc2VvLXVybHMtZGV0YWlscyA+IGZvcm0nKVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZWxlY3RvciBTdHJpbmdzXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBzZWxlY3RvcnMgPSB7XG4gICAgICAgICAgICAvLyBJY29uIHNlbGVjdG9yIHN0cmluZ3MuXG4gICAgICAgICAgICBpY29uczoge1xuICAgICAgICAgICAgICAgIC8vIERlbGV0ZSBidXR0b24gb24gdGhlIHBhbmVsIGhlYWRlci5cbiAgICAgICAgICAgICAgICBkZWxldGU6ICcuaWNvbi5kZWxldGUnLFxuXG4gICAgICAgICAgICAgICAgLy8gRHJhZyBidXR0b24gb24gdGhlIHBhbmVsIGhlYWRlci5cbiAgICAgICAgICAgICAgICBkcmFnOiAnLmRyYWctaGFuZGxlJyxcblxuICAgICAgICAgICAgICAgIC8vIENvbGxhcHNlciBidXR0b24gb24gdGhlIHBhbmVsIGhlYWRlci5cbiAgICAgICAgICAgICAgICBjb2xsYXBzZXI6ICcuY29sbGFwc2VyJyxcblxuICAgICAgICAgICAgICAgIC8vIEltYWdlIGRlbGV0ZSBidXR0b24uXG4gICAgICAgICAgICAgICAgaW1hZ2VEZWxldGU6ICcuYWN0aW9uLWljb24uZGVsZXRlJyxcblxuICAgICAgICAgICAgICAgIC8vIEltYWdlIG1hcCBlZGl0IGJ1dHRvbi5cbiAgICAgICAgICAgICAgICBpbWFnZU1hcDogJy5hY3Rpb24taWNvbi5pbWFnZS1tYXAnLFxuXG4gICAgICAgICAgICAgICAgLy8gVXBsb2FkIGltYWdlIGJ1dHRvbi5cbiAgICAgICAgICAgICAgICB1cGxvYWQ6ICcuYWN0aW9uLWljb24udXBsb2FkJ1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8gSW5wdXRzIHNlbGVjdG9yIHN0cmluZ3MuXG4gICAgICAgICAgICBpbnB1dHM6IHtcbiAgICAgICAgICAgICAgICAvLyBHZW5lcmFsIGltYWdlIHNlbGVjdCBkcm9wZG93bnMuXG4gICAgICAgICAgICAgICAgZHJvcGRvd246ICcuZHJvcGRvd24taW5wdXQnLFxuXG4gICAgICAgICAgICAgICAgLy8gVGh1bWJuYWlsIGRyb3Bkb3duLlxuICAgICAgICAgICAgICAgIHRodW1ibmFpbEltYWdlRHJvcGRvd246ICdbbmFtZT1cInRodW1ibmFpbFwiXScsXG5cbiAgICAgICAgICAgICAgICAvLyBUaXRsZS5cbiAgICAgICAgICAgICAgICB0aXRsZTogJ2lucHV0W25hbWU9XCJ0aXRsZVwiXScsXG5cbiAgICAgICAgICAgICAgICAvLyBGaWxlLlxuICAgICAgICAgICAgICAgIGZpbGU6ICcuZmlsZS1pbnB1dCdcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIFN0YXRpYyBzZW8gdXJsIGNvbnRlbnQgcGFuZWwuXG4gICAgICAgICAgICBzdGF0aWNTZW9VcmxDb250ZW50UGFuZWw6ICcucGFuZWwnLFxuXG4gICAgICAgICAgICAvLyBUYWIgYm9keS5cbiAgICAgICAgICAgIHRhYkJvZHk6ICcudGFiLXBhbmUnLFxuXG4gICAgICAgICAgICAvLyBTdGF0aWMgc2VvIHVybCBjb250ZW50IHBhbmVsIHRpdGxlLlxuICAgICAgICAgICAgc3RhdGljU2VvVXJsQ29udGVudFBhbmVsVGl0bGU6ICcuc3RhdGljU2VvVXJsQ29udGVudC10aXRsZScsXG5cbiAgICAgICAgICAgIC8vIFNldHRpbmcgcm93IChmb3JtIGdyb3VwKS5cbiAgICAgICAgICAgIGNvbmZpZ3VyYXRpb25Sb3c6ICcucm93LmZvcm0tZ3JvdXAnLFxuXG4gICAgICAgICAgICAvLyBEYXRhIGxpc3QgY29udGFpbmVyIGZvciBpbWFnZSBtYXAuXG4gICAgICAgICAgICBpbWFnZU1hcERhdGFMaXN0OiAnLmltYWdlLW1hcC1kYXRhLWxpc3QnLFxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgSW5zdGFuY2VcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEZVTkNUSU9OU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVzIHRoZSBrZXktdXAgZXZlbnQgb24gdGhlIHN0YXRpY1Nlb1VybENvbnRlbnQgdGl0bGUgaW5wdXQgZmllbGQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5LkV2ZW50fSBldmVudCBUcmlnZ2VyZWQgZXZlbnQuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25UaXRsZUtleXVwKGV2ZW50KSB7XG4gICAgICAgICAgICAvLyBUaXRsZSBpbnB1dCBmaWVsZC5cbiAgICAgICAgICAgIGNvbnN0ICRpbnB1dCA9ICQoZXZlbnQudGFyZ2V0KTtcblxuICAgICAgICAgICAgLy8gU3RhdGljIHNlbyB1cmwgY29udGVudCBwYW5lbCB0aXRsZSBlbGVtZW50LlxuICAgICAgICAgICAgY29uc3QgJHRpdGxlID0gJGlucHV0XG4gICAgICAgICAgICAgICAgLnBhcmVudHMoc2VsZWN0b3JzLnN0YXRpY1Nlb1VybENvbnRlbnRQYW5lbClcbiAgICAgICAgICAgICAgICAuZmluZChzZWxlY3RvcnMuc3RhdGljU2VvVXJsQ29udGVudFBhbmVsVGl0bGUpO1xuXG4gICAgICAgICAgICAvLyBUcmFuc2ZlciBpbnB1dCB2YWx1ZSB0byBzdGF0aWNTZW9VcmxDb250ZW50IHBhbmVsIHRpdGxlLlxuICAgICAgICAgICAgJHRpdGxlLnRleHQoJGlucHV0LnZhbCgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVzIHRoZSBtb3VzZS1lbnRlciBldmVudCBvbiBhIGNvbmZpZ3VyYXRpb24gcm93LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gZXZlbnQgVHJpZ2dlcmVkIGV2ZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uQ29uZmlnUm93TW91c2VFbnRlcihldmVudCkge1xuICAgICAgICAgICAgLy8gQ29uZmlndXJhdGlvbiByb3cgZWxlbWVudC5cbiAgICAgICAgICAgIGNvbnN0ICRyb3cgPSAkKGV2ZW50LnRhcmdldCk7XG5cbiAgICAgICAgICAgIC8vIEltYWdlIG1hcCBlZGl0IGljb24uXG4gICAgICAgICAgICBjb25zdCAkaW1hZ2VNYXBJY29uID0gJHJvdy5maW5kKHNlbGVjdG9ycy5pY29ucy5pbWFnZU1hcCk7XG5cbiAgICAgICAgICAgIC8vIEltYWdlIG1hcCBkYXRhIGNvbnRhaW5lciBsaXN0IGVsZW1lbnQuXG4gICAgICAgICAgICBjb25zdCAkbGlzdCA9ICRyb3cuZmluZChzZWxlY3RvcnMuaW1hZ2VNYXBEYXRhTGlzdCk7XG5cbiAgICAgICAgICAgIC8vIFJldHVybiBpbW1lZGlhdGVseSwgaWYgdGhlIGltYWdlIG1hcCBlZGl0IGljb24gZG9lcyBub3QgZXhpc3QuXG4gICAgICAgICAgICBpZiAoISRpbWFnZU1hcEljb24ubGVuZ3RoIHx8ICEkbGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgkbGlzdC5jaGlsZHJlbigpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICRpbWFnZU1hcEljb24ucmVtb3ZlQ2xhc3MoJ2ZhLWV4dGVybmFsLWxpbmsnKS5hZGRDbGFzcygnZmEtZXh0ZXJuYWwtbGluay1zcXVhcmUnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJGltYWdlTWFwSWNvbi5yZW1vdmVDbGFzcygnZmEtZXh0ZXJuYWwtbGluay1zcXVhcmUnKS5hZGRDbGFzcygnZmEtZXh0ZXJuYWwtbGluaycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXMgdGhlIGNsaWNrIGV2ZW50IG9uIHRoZSBzYXZlIGJ1dHRvbi5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vblN1Ym1pdFNhdmUoKSB7XG4gICAgICAgICAgICBlbGVtZW50c1xuICAgICAgICAgICAgICAgIC5mb3JtXG4gICAgICAgICAgICAgICAgLnRyaWdnZXIoJ3N1Ym1pdCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXMgdGhlIGNsaWNrIGV2ZW50IG9uIHRoZSByZWZyZXNoIGxpc3QgaXRlbSBpbiB0aGUgc3VibWl0IGJ1dHRvbiBncm91cC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vblN1Ym1pdFJlZnJlc2goKSB7XG4gICAgICAgICAgICBlbGVtZW50c1xuICAgICAgICAgICAgICAgIC5mb3JtXG4gICAgICAgICAgICAgICAgLnRyaWdnZXIoJ3N1Ym1pdCcsIHtyZWZyZXNoOiB0cnVlfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZG9uZSA9PiB7XG5cbiAgICAgICAgICAgIC8vIEF0dGFjaCBldmVudCBoYW5kbGVycyB0byBzb3J0IGFjdGlvbnMsIHN0YXRpYyBzZW8gdXJsIGNvbnRlbnQgcGFuZWwgZGVsZXRlIGJ1dHRvbiBhbmQgaW5wdXRzIGZpZWxkcy5cbiAgICAgICAgICAgICR0aGlzXG4gICAgICAgICAgICAgICAgLm9uKCdrZXl1cCcsIHNlbGVjdG9ycy5pbnB1dHMudGl0bGUsIF9vblRpdGxlS2V5dXApXG4gICAgICAgICAgICAgICAgLm9uKCdtb3VzZWVudGVyJywgc2VsZWN0b3JzLmNvbmZpZ3VyYXRpb25Sb3csIF9vbkNvbmZpZ1Jvd01vdXNlRW50ZXIpO1xuXG4gICAgICAgICAgICAvLyBBdHRhY2ggZXZlbnQgbGlzdGVuZXJzIHRvIHN1Ym1pdCBidXR0b25zLlxuICAgICAgICAgICAgZWxlbWVudHMuYnV0dG9ucy5zdWJtaXRTYXZlLm9uKCdjbGljaycsIF9vblN1Ym1pdFNhdmUpO1xuICAgICAgICAgICAgZWxlbWVudHMuYnV0dG9ucy5zdWJtaXRSZWZyZXNoLm9uKCdjbGljaycsIF9vblN1Ym1pdFJlZnJlc2gpO1xuXG4gICAgICAgICAgICAvLyBBY3RpdmF0ZSBmaXJzdCB0YWIuXG4gICAgICAgICAgICBlbGVtZW50cy50YWJIZWFkZXJcbiAgICAgICAgICAgICAgICAuY2hpbGRyZW4oKVxuICAgICAgICAgICAgICAgIC5maXJzdCgpXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICAgICAgLy8gQWN0aXZhdGUgZmlyc3QgdGFiIGNvbnRlbnQuXG4gICAgICAgICAgICAkdGhpc1xuICAgICAgICAgICAgICAgIC5maW5kKHNlbGVjdG9ycy50YWJCb2R5KVxuICAgICAgICAgICAgICAgIC5maXJzdCgpXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCdhY3RpdmUgaW4nKTtcblxuICAgICAgICAgICAgLy8gVHJpZ2dlciBkcm9wZG93biBjaGFuZ2UgZXZlbnQgdG8gaGlkZSB0aGUgcmVtb3ZlIGljb24sIGlmICdkbyBub3QgdXNlJyBpcyBzZWxlY3RlZC5cbiAgICAgICAgICAgICR0aGlzXG4gICAgICAgICAgICAgICAgLmZpbmQoc2VsZWN0b3JzLmlucHV0cy5kcm9wZG93bilcbiAgICAgICAgICAgICAgICAudHJpZ2dlcignY2hhbmdlJywgW2ZhbHNlXSk7XG5cbiAgICAgICAgICAgIC8vIEZpbmlzaCBpbml0aWFsaXphdGlvbi5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH1cbik7XG4iXX0=
