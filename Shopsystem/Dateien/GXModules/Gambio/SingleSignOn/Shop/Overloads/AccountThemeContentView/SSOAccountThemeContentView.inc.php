<?php
/* --------------------------------------------------------------
   SSOAccountThemeContentView.inc.php 2023-02-08
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2023 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

class SSOAccountThemeContentView extends SSOAccountThemeContentView_parent
{
    public function prepare_data()
    {
        parent::prepare_data();
        
        $moduleInstalled = (bool)gm_get_conf('MODULE_CENTER_SINGLESIGNON_INSTALLED');
        if ($moduleInstalled === true
            && $_SESSION['customers_status']['customers_status_id'] !== DEFAULT_CUSTOMERS_STATUS_ID_GUEST) {
            $db               = StaticGXCoreLoader::getDatabaseQueryBuilder();
            $customerSSOQuery = $db->get_where('customers_sso', ['customers_id' => $_SESSION['customer_id']]);
            $connectedIssuers = [];
            foreach ($customerSSOQuery->result_array() as $ssoRow) {
                $connectedIssuers[] = $ssoRow['issuer'];
            }
            
            $ssoButtons       = [];
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
            if ((bool)$ssoConfiguration->get('services/google/active') === true
                && ($cookieConsentIsNotInstalled
                    || $this->isServiceActive('google'))) {
                $googleLoginUrl       = $loginUrl . '&amp;service=google';
                $ssoButtons['google'] = [
                    'loginUrl'  => $googleLoginUrl,
                    'connected' => in_array('https://accounts.google.com', $connectedIssuers, true),
                    'issuer'    => 'google',
                ];
            }
            if ((bool)$ssoConfiguration->get('services/facebook/active') === true
                && ($cookieConsentIsNotInstalled
                    || $this->isServiceActive('facebook'))) {
                $facebookLoginUrl       = $loginUrl . '&amp;service=facebook';
                $ssoButtons['facebook'] = [
                    'loginUrl'  => $facebookLoginUrl,
                    'connected' => in_array('facebook.com', $connectedIssuers, true),
                    'issuer'    => 'facebook',
                ];
            }
            if ((bool)$ssoConfiguration->get('services/paypal/active') === true
                && ($cookieConsentIsNotInstalled
                    || $this->isServiceActive('paypal'))) {
                $paypalLoginUrl       = $loginUrl . '&amp;service=paypal';
                $ssoButtons['paypal'] = [
                    'loginUrl'  => $paypalLoginUrl,
                    'connected' => in_array('paypal.com', $connectedIssuers, true),
                    'issuer'    => 'paypal',
                ];
            }
            if ((bool)$ssoConfiguration->get('services/amazon/active') === true
                && ($cookieConsentIsNotInstalled
                    || $this->isServiceActive('amazon'))) {
                $amazonLoginUrl       = $loginUrl . '&amp;service=amazon';
                $ssoButtons['amazon'] = [
                    'loginUrl'  => $amazonLoginUrl,
                    'connected' => in_array('amazon.com', $connectedIssuers, true),
                    'issuer'    => 'amazon',
                ];
            }
            
            $ssoData = [
                'issuers'                  => $connectedIssuers,
                'ssoButtons'               => $ssoButtons,
                'delete_connection_action' => xtc_href_link('shop.php', 'do=SingleSignOn/DeleteSsoConnection'),
            ];
            
            $this->set_content_data('ssoData', $ssoData);
        }
    }
    
    
    /**
     * @param string $serviceName
     *
     * @return bool
     */
    protected function isServiceActive(string $serviceName): bool
    {
        $isActive = false;
        
        switch ($serviceName) {
            case 'google':
                $isActive = CookiesConsentSsoStore::google() !== null && CookiesConsentSsoStore::google()->isActive();
                break;
            case 'facebook':
                $isActive = CookiesConsentSsoStore::facebook() !== null
                            && CookiesConsentSsoStore::facebook()
                                ->isActive();
                break;
            case 'paypal':
                $isActive = CookiesConsentSsoStore::payPal() !== null && CookiesConsentSsoStore::payPal()->isActive();
                break;
            case 'amazon':
                $isActive = CookiesConsentSsoStore::amazon() !== null && CookiesConsentSsoStore::amazon()->isActive();
                break;
        }
        
        return $isActive;
    }
}
