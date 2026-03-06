/* ClearCache.js <?php
#   --------------------------------------------------------------
#   ClearCache.js 2018-06-15
#   Gambio GmbH
#   http://www.gambio.de
#   Copyright (c) 2018 Gambio GmbH
#   Released under the GNU General Public License (Version 2)
#   [http://www.gnu.org/licenses/gpl-2.0.html]
#
#   IMPORTANT! THIS FILE IS DEPRECATED AND WILL BE REPLACED IN THE FUTURE. 
#   MODIFY IT ONLY FOR FIXES. DO NOT APPEND IT WITH NEW FEATURES, USE THE
#   NEW GX-ENGINE LIBRARIES INSTEAD.
#   --------------------------------------------------------------

#   based on:
#   (c) 2003	  nextcommerce (install_finished.php,v 1.5 2003/08/17); www.nextcommerce.org
#   (c) 2003 XT-Commerce - community made shopping http://www.xt-commerce.com ($Id: start.js 899 2011-01-24 02:40:57Z hhgag $)
#
#   Released under the GNU General Public License
#   --------------------------------------------------------------
?>*/

function ClearCache() {
    this.do_request = function () {
        jQuery.ajax(
            {
                url: 'request_port.php?module=ClearCache',
                type: "POST",
                async: true,
                success: function (t_log_html) {
                    if (t_log_html.length > 500) {
                        $('#top_notifier').html('Der Cache wurde NICHT gel�scht! Bitte loggen Sie sich neu ein.<br />The cache was NOT cleared! Please log in again.');
                    } else {
                        $('#top_notifier').html(t_log_html);
                        $('#top_notifier').css({'background-color': '#98FB98'})
                    }
                }
            }).html;
    }
}