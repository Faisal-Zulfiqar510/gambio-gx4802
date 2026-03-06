<?php
/* --------------------------------------------------------------
   SSOLoginBoxThemeContentView.inc.php 2018-11-15
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2017 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

class SSOLoginBoxThemeContentView extends SSOLoginBoxThemeContentView_parent
{
    public function prepare_data()
    {
        parent::prepare_data();
        
        $ssoServices     = [];
        $moduleInstalled = (bool)gm_get_conf('MODULE_CENTER_SINGLESIGNON_INSTALLED');
        if ($moduleInstalled === true) {
            $ssoConfiguration          = MainFactory::create('SingleSignonConfigurationStorage');
            $afterLoginReturnUrlParams = http_build_query([
                                                              'return_url'      => GM_HTTP_SERVER
                                                                                   . gm_get_env_info('REQUEST_URI'),
                                                              'return_url_hash' => hash('sha256',
                                                                                        GM_HTTP_SERVER
                                                                                        . gm_get_env_info('REQUEST_URI')
                                                                                        . LogControl::get_secure_token()),
                                                          ],
                                                          '',
                                                          '&');
            $loginUrl                  = xtc_href_link('shop.php',
                                                       'do=SingleSignOn/Redirect&' . $afterLoginReturnUrlParams,
                                                       'SSL',
                                                       false,
                                                       false,
                                                       false,
                                                       true,
                                                       true);
            $cookieConsentIsNotInstalled = !cookie_consent_panel_is_installed();
            if ((bool)$ssoConfiguration->get('services/google/active') === true && ($cookieConsentIsNotInstalled || CookiesConsentSsoStore::google()->isActive())) {
                $ssoServices['googleLoginUrl'] = $loginUrl . '&amp;service=google';
            }
            if ((bool)$ssoConfiguration->get('services/facebook/active') === true && ($cookieConsentIsNotInstalled || CookiesConsentSsoStore::facebook()->isActive())) {
                $ssoServices['facebookLoginUrl'] = $loginUrl . '&amp;service=facebook';
            }
            if ((bool)$ssoConfiguration->get('services/paypal/active') === true && ($cookieConsentIsNotInstalled || CookiesConsentSsoStore::payPal()->isActive())) {
                $ssoServices['paypalLoginUrl'] = $loginUrl . '&amp;service=paypal';
            }
            if ((bool)$ssoConfiguration->get('services/amazon/active') === true && ($cookieConsentIsNotInstalled || CookiesConsentSsoStore::amazon()->isActive())) {
                $ssoServices['amazonLoginUrl'] = $loginUrl . '&amp;service=amazon';
            }
            
            $this->set_content_data('sso', $ssoServices);
        }
    }
}
