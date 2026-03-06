<?php
/* --------------------------------------------------------------
   SSOLoginContentView.inc.php 2018-11-15
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2017 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

class SSOLoginThemeContentView extends SSOLoginThemeContentView_parent
{
    public function prepare_data()
    {
        parent::prepare_data();
        
        $ssoData         = [];
        $moduleInstalled = (bool)gm_get_conf('MODULE_CENTER_SINGLESIGNON_INSTALLED');
        if ($moduleInstalled === true) {
            $ssoConfiguration = MainFactory::create('SingleSignonConfigurationStorage');
            $loginUrl         = xtc_href_link('shop.php',
                                              'do=SingleSignOn/Redirect',
                                              'SSL',
                                              false,
                                              false,
                                              false,
                                              true,
                                              true);
    
            $cookieConsentIsNotInstalled = !cookie_consent_panel_is_installed();
            if ((bool)$ssoConfiguration->get('services/google/active') === true && ($cookieConsentIsNotInstalled || CookiesConsentSsoStore::google()->isActive())) {
                $ssoData['googleLoginUrl'] = $loginUrl . '&amp;service=google';
            }
            if ((bool)$ssoConfiguration->get('services/facebook/active') === true && ($cookieConsentIsNotInstalled || CookiesConsentSsoStore::facebook()->isActive())) {
                $ssoData['facebookLoginUrl'] = $loginUrl . '&amp;service=facebook';
            }
            if ((bool)$ssoConfiguration->get('services/paypal/active') === true && ($cookieConsentIsNotInstalled || CookiesConsentSsoStore::payPal()->isActive())) {
                $ssoData['paypalLoginUrl'] = $loginUrl . '&amp;service=paypal';
            }
            if ((bool)$ssoConfiguration->get('services/amazon/active') === true && ($cookieConsentIsNotInstalled || CookiesConsentSsoStore::amazon()->isActive())) {
                $ssoData['amazonLoginUrl'] = $loginUrl . '&amp;service=amazon';
            }
        }
        $this->set_content_data('ssoData', $ssoData);
    }
}
