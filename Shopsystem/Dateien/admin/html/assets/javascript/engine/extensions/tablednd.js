'use strict';

/* --------------------------------------------------------------
 tablednd.js 2015-09-17 gm
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2015 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Table Dnd Extension
 *
 * Sorts lines in connected tables.
 *
 * @module Admin/Extensions/tablednd
 * @ignore
 */
gx.extensions.module('tablednd', [jse.source + '/vendor/jquery-ui-dist/jquery-ui.min.css', jse.source + '/vendor/jquery-ui-dist/jquery-ui.min.js'], function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLE DEFINITION
    // ------------------------------------------------------------------------

    var
    /**
     * Extension Reference
     *
     * @type {object}
     */
    $this = $(this),


    /**
     * Table Body Selector
     *
     * @type {object}
     */
    $tbody = null,


    /**
     * Default Options for Extension
     *
     * @type {object}
     */
    defaults = {
        'addclass': 'clsDnd', // classname added to body
        'disabledclass': 'sort-disabled', // classname added to body
        'handle': false // handler which enables the sortable
    },


    /**
     * Final Extension Options
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
    // INITIALIZATION
    // ------------------------------------------------------------------------

    /**
     * Setup Dummies
     */
    var setupDummies = function setupDummies() {
        // On drag stop, update dummy line visibility
        $tbody.each(function () {
            var $self = $(this),
                $sortDisabled = $self.find('.' + options.disabledclass);

            if ($self.children().length > 1) {
                $sortDisabled.hide();
            } else {
                $sortDisabled.show();
            }

            var rowHidden = $sortDisabled.clone();
            $sortDisabled.remove();
            $self.prepend(rowHidden);
        });
    };

    /**
     * Initialize method of the extension, called by the engine.
     */
    module.init = function (done) {
        $tbody = $this.find('tbody');
        var strTimestamp = parseInt(new Date().getTime() * Math.random(), 10),
            strClsDnd = options.addclass + '_' + strTimestamp,
            config = {
            'handle': options.handle,
            'connectWith': '.' + strClsDnd,
            'containment': $this,
            'sort': function sort(event, ui) {
                $(event.target).each(function () {
                    var $self = $(this),
                        $sortDisabled = $self.find('.' + options.disabledclass);

                    if ($self.children().length > 2) {
                        $sortDisabled.hide();
                    } else {
                        $sortDisabled.show();
                        var rowHidden = $sortDisabled.clone();
                        $sortDisabled.remove();
                        $self.append(rowHidden);
                    }
                });
            },
            'stop': function stop(event, ui) {
                setupDummies();
                // Trigger an update event on table
                $this.trigger('tablednd.update', []);
            }
        };

        // Add a special class and start the sortable plugin.
        $tbody.addClass(strClsDnd).sortable(config);

        setupDummies();

        done();
    };

    // Return data to module engine.
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRhYmxlZG5kLmpzIl0sIm5hbWVzIjpbImd4IiwiZXh0ZW5zaW9ucyIsIm1vZHVsZSIsImpzZSIsInNvdXJjZSIsImRhdGEiLCIkdGhpcyIsIiQiLCIkdGJvZHkiLCJkZWZhdWx0cyIsIm9wdGlvbnMiLCJleHRlbmQiLCJzZXR1cER1bW1pZXMiLCJlYWNoIiwiJHNlbGYiLCIkc29ydERpc2FibGVkIiwiZmluZCIsImRpc2FibGVkY2xhc3MiLCJjaGlsZHJlbiIsImxlbmd0aCIsImhpZGUiLCJzaG93Iiwicm93SGlkZGVuIiwiY2xvbmUiLCJyZW1vdmUiLCJwcmVwZW5kIiwiaW5pdCIsImRvbmUiLCJzdHJUaW1lc3RhbXAiLCJwYXJzZUludCIsIkRhdGUiLCJnZXRUaW1lIiwiTWF0aCIsInJhbmRvbSIsInN0ckNsc0RuZCIsImFkZGNsYXNzIiwiY29uZmlnIiwiaGFuZGxlIiwiZXZlbnQiLCJ1aSIsInRhcmdldCIsImFwcGVuZCIsInRyaWdnZXIiLCJhZGRDbGFzcyIsInNvcnRhYmxlIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7O0FBUUFBLEdBQUdDLFVBQUgsQ0FBY0MsTUFBZCxDQUNJLFVBREosRUFHSSxDQUNJQyxJQUFJQyxNQUFKLEdBQWEsMENBRGpCLEVBRUlELElBQUlDLE1BQUosR0FBYSx5Q0FGakIsQ0FISixFQVFJLFVBQVVDLElBQVYsRUFBZ0I7O0FBRVo7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0k7Ozs7O0FBS0FDLFlBQVFDLEVBQUUsSUFBRixDQU5aOzs7QUFRSTs7Ozs7QUFLQUMsYUFBUyxJQWJiOzs7QUFlSTs7Ozs7QUFLQUMsZUFBVztBQUNQLG9CQUFZLFFBREwsRUFDZTtBQUN0Qix5QkFBaUIsZUFGVixFQUUyQjtBQUNsQyxrQkFBVSxLQUhILENBR1M7QUFIVCxLQXBCZjs7O0FBMEJJOzs7OztBQUtBQyxjQUFVSCxFQUFFSSxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJGLFFBQW5CLEVBQTZCSixJQUE3QixDQS9CZDs7O0FBaUNJOzs7OztBQUtBSCxhQUFTLEVBdENiOztBQXdDQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBLFFBQUlVLGVBQWUsU0FBZkEsWUFBZSxHQUFZO0FBQzNCO0FBQ0FKLGVBQU9LLElBQVAsQ0FBWSxZQUFZO0FBQ3BCLGdCQUFJQyxRQUFRUCxFQUFFLElBQUYsQ0FBWjtBQUFBLGdCQUNJUSxnQkFBZ0JELE1BQU1FLElBQU4sQ0FBVyxNQUFNTixRQUFRTyxhQUF6QixDQURwQjs7QUFHQSxnQkFBSUgsTUFBTUksUUFBTixHQUFpQkMsTUFBakIsR0FBMEIsQ0FBOUIsRUFBaUM7QUFDN0JKLDhCQUFjSyxJQUFkO0FBQ0gsYUFGRCxNQUVPO0FBQ0hMLDhCQUFjTSxJQUFkO0FBQ0g7O0FBRUQsZ0JBQUlDLFlBQVlQLGNBQWNRLEtBQWQsRUFBaEI7QUFDQVIsMEJBQWNTLE1BQWQ7QUFDQVYsa0JBQU1XLE9BQU4sQ0FBY0gsU0FBZDtBQUVILFNBZEQ7QUFlSCxLQWpCRDs7QUFtQkE7OztBQUdBcEIsV0FBT3dCLElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCO0FBQzFCbkIsaUJBQVNGLE1BQU1VLElBQU4sQ0FBVyxPQUFYLENBQVQ7QUFDQSxZQUFJWSxlQUFlQyxTQUFTLElBQUlDLElBQUosR0FBV0MsT0FBWCxLQUF1QkMsS0FBS0MsTUFBTCxFQUFoQyxFQUErQyxFQUEvQyxDQUFuQjtBQUFBLFlBQ0lDLFlBQVl4QixRQUFReUIsUUFBUixHQUFtQixHQUFuQixHQUF5QlAsWUFEekM7QUFBQSxZQUVJUSxTQUFTO0FBQ0wsc0JBQVUxQixRQUFRMkIsTUFEYjtBQUVMLDJCQUFlLE1BQU1ILFNBRmhCO0FBR0wsMkJBQWU1QixLQUhWO0FBSUwsb0JBQVEsY0FBVWdDLEtBQVYsRUFBaUJDLEVBQWpCLEVBQXFCO0FBQ3pCaEMsa0JBQUUrQixNQUFNRSxNQUFSLEVBQWdCM0IsSUFBaEIsQ0FBcUIsWUFBWTtBQUM3Qix3QkFBSUMsUUFBUVAsRUFBRSxJQUFGLENBQVo7QUFBQSx3QkFDSVEsZ0JBQWdCRCxNQUFNRSxJQUFOLENBQVcsTUFBTU4sUUFBUU8sYUFBekIsQ0FEcEI7O0FBR0Esd0JBQUlILE1BQU1JLFFBQU4sR0FBaUJDLE1BQWpCLEdBQTBCLENBQTlCLEVBQWlDO0FBQzdCSixzQ0FBY0ssSUFBZDtBQUNILHFCQUZELE1BRU87QUFDSEwsc0NBQWNNLElBQWQ7QUFDQSw0QkFBSUMsWUFBWVAsY0FBY1EsS0FBZCxFQUFoQjtBQUNBUixzQ0FBY1MsTUFBZDtBQUNBViw4QkFBTTJCLE1BQU4sQ0FBYW5CLFNBQWI7QUFDSDtBQUNKLGlCQVpEO0FBY0gsYUFuQkk7QUFvQkwsb0JBQVEsY0FBVWdCLEtBQVYsRUFBaUJDLEVBQWpCLEVBQXFCO0FBQ3pCM0I7QUFDQTtBQUNBTixzQkFBTW9DLE9BQU4sQ0FBYyxpQkFBZCxFQUFpQyxFQUFqQztBQUNIO0FBeEJJLFNBRmI7O0FBNkJBO0FBQ0FsQyxlQUNLbUMsUUFETCxDQUNjVCxTQURkLEVBRUtVLFFBRkwsQ0FFY1IsTUFGZDs7QUFJQXhCOztBQUVBZTtBQUNILEtBdkNEOztBQXlDQTtBQUNBLFdBQU96QixNQUFQO0FBQ0gsQ0FoSUwiLCJmaWxlIjoidGFibGVkbmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIHRhYmxlZG5kLmpzIDIwMTUtMDktMTcgZ21cbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE1IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqICMjIFRhYmxlIERuZCBFeHRlbnNpb25cbiAqXG4gKiBTb3J0cyBsaW5lcyBpbiBjb25uZWN0ZWQgdGFibGVzLlxuICpcbiAqIEBtb2R1bGUgQWRtaW4vRXh0ZW5zaW9ucy90YWJsZWRuZFxuICogQGlnbm9yZVxuICovXG5neC5leHRlbnNpb25zLm1vZHVsZShcbiAgICAndGFibGVkbmQnLFxuXG4gICAgW1xuICAgICAgICBqc2Uuc291cmNlICsgJy92ZW5kb3IvanF1ZXJ5LXVpLWRpc3QvanF1ZXJ5LXVpLm1pbi5jc3MnLFxuICAgICAgICBqc2Uuc291cmNlICsgJy92ZW5kb3IvanF1ZXJ5LXVpLWRpc3QvanF1ZXJ5LXVpLm1pbi5qcydcbiAgICBdLFxuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFIERFRklOSVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEV4dGVuc2lvbiBSZWZlcmVuY2VcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkdGhpcyA9ICQodGhpcyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogVGFibGUgQm9keSBTZWxlY3RvclxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0Ym9keSA9IG51bGwsXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRGVmYXVsdCBPcHRpb25zIGZvciBFeHRlbnNpb25cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgICAgICAnYWRkY2xhc3MnOiAnY2xzRG5kJywgLy8gY2xhc3NuYW1lIGFkZGVkIHRvIGJvZHlcbiAgICAgICAgICAgICAgICAnZGlzYWJsZWRjbGFzcyc6ICdzb3J0LWRpc2FibGVkJywgLy8gY2xhc3NuYW1lIGFkZGVkIHRvIGJvZHlcbiAgICAgICAgICAgICAgICAnaGFuZGxlJzogZmFsc2UgLy8gaGFuZGxlciB3aGljaCBlbmFibGVzIHRoZSBzb3J0YWJsZVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBGaW5hbCBFeHRlbnNpb24gT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBPYmplY3RcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldHVwIER1bW1pZXNcbiAgICAgICAgICovXG4gICAgICAgIHZhciBzZXR1cER1bW1pZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBPbiBkcmFnIHN0b3AsIHVwZGF0ZSBkdW1teSBsaW5lIHZpc2liaWxpdHlcbiAgICAgICAgICAgICR0Ym9keS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgJHNlbGYgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICAkc29ydERpc2FibGVkID0gJHNlbGYuZmluZCgnLicgKyBvcHRpb25zLmRpc2FibGVkY2xhc3MpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCRzZWxmLmNoaWxkcmVuKCkubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICAkc29ydERpc2FibGVkLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkc29ydERpc2FibGVkLnNob3coKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgcm93SGlkZGVuID0gJHNvcnREaXNhYmxlZC5jbG9uZSgpO1xuICAgICAgICAgICAgICAgICRzb3J0RGlzYWJsZWQucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgJHNlbGYucHJlcGVuZChyb3dIaWRkZW4pO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5pdGlhbGl6ZSBtZXRob2Qgb2YgdGhlIGV4dGVuc2lvbiwgY2FsbGVkIGJ5IHRoZSBlbmdpbmUuXG4gICAgICAgICAqL1xuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICAkdGJvZHkgPSAkdGhpcy5maW5kKCd0Ym9keScpO1xuICAgICAgICAgICAgdmFyIHN0clRpbWVzdGFtcCA9IHBhcnNlSW50KG5ldyBEYXRlKCkuZ2V0VGltZSgpICogTWF0aC5yYW5kb20oKSwgMTApLFxuICAgICAgICAgICAgICAgIHN0ckNsc0RuZCA9IG9wdGlvbnMuYWRkY2xhc3MgKyAnXycgKyBzdHJUaW1lc3RhbXAsXG4gICAgICAgICAgICAgICAgY29uZmlnID0ge1xuICAgICAgICAgICAgICAgICAgICAnaGFuZGxlJzogb3B0aW9ucy5oYW5kbGUsXG4gICAgICAgICAgICAgICAgICAgICdjb25uZWN0V2l0aCc6ICcuJyArIHN0ckNsc0RuZCxcbiAgICAgICAgICAgICAgICAgICAgJ2NvbnRhaW5tZW50JzogJHRoaXMsXG4gICAgICAgICAgICAgICAgICAgICdzb3J0JzogZnVuY3Rpb24gKGV2ZW50LCB1aSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJChldmVudC50YXJnZXQpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkc2VsZiA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzb3J0RGlzYWJsZWQgPSAkc2VsZi5maW5kKCcuJyArIG9wdGlvbnMuZGlzYWJsZWRjbGFzcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJHNlbGYuY2hpbGRyZW4oKS5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzb3J0RGlzYWJsZWQuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzb3J0RGlzYWJsZWQuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcm93SGlkZGVuID0gJHNvcnREaXNhYmxlZC5jbG9uZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc29ydERpc2FibGVkLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2VsZi5hcHBlbmQocm93SGlkZGVuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnc3RvcCc6IGZ1bmN0aW9uIChldmVudCwgdWkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldHVwRHVtbWllcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVHJpZ2dlciBhbiB1cGRhdGUgZXZlbnQgb24gdGFibGVcbiAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLnRyaWdnZXIoJ3RhYmxlZG5kLnVwZGF0ZScsIFtdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIEFkZCBhIHNwZWNpYWwgY2xhc3MgYW5kIHN0YXJ0IHRoZSBzb3J0YWJsZSBwbHVnaW4uXG4gICAgICAgICAgICAkdGJvZHlcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3Moc3RyQ2xzRG5kKVxuICAgICAgICAgICAgICAgIC5zb3J0YWJsZShjb25maWcpO1xuXG4gICAgICAgICAgICBzZXR1cER1bW1pZXMoKTtcblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFJldHVybiBkYXRhIHRvIG1vZHVsZSBlbmdpbmUuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7XG4iXX0=
