<?php
/* --------------------------------------------------------------
   GoogleTrackingCheckoutSuccess.inc.php 2018-10-04
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class GoogleTrackingCheckoutSuccess
 */
class GoogleTrackingCheckoutSuccess extends GoogleTrackingCheckoutSuccess_parent
{
    /**
     * @var InstallationStatusInterface
     */
    protected $cookieConsentInstallationStatus;
    
    public function proceed()
    {
        parent::proceed();
        
        $trackingService = GoogleTrackingServiceFactory::trackingService();
        $orderId         = new IdType($this->v_data_array['orders_id']);
        
        try {
            $analyticsTrackingEnabled     = $trackingService->analyticsTrackingEnabled();
            $adsConversionTrackingEnabled = $trackingService->adsConversionTrackingEnabled();
            $html                         = '';
            
            if ($analyticsTrackingEnabled) {
                $html .= $this->tpl('purchase', json_encode($trackingService->analyticsPurchaseTrackingData($orderId)));
            }
            
            if ($adsConversionTrackingEnabled) {
                $html .= $this->tpl('conversion', json_encode($trackingService->adsConversionTrackingData($orderId)));
            }
            
            if ($html !== '') {
                $this->html_output_array[] = $html;
            }
        } catch (Exception $e) {
            LogControl::get_instance()->notice($e->getMessage(),
                                               'error_handler',
                                               'error_handler',
                                               'errors',
                                               'notice',
                                               $e->getCode(),
                                               $e->getTraceAsString());
        }
    }
    
    
    protected function tpl($event, $actionJson)
    {
        if ($this->cookieConsentInstallationStatus()->isInstalled() === true) {
            return '
                <script
                    data-managed="as-oil"
                    data-type="text/javascript"
                    data-purposes="4"
                    type="as-oil"
                >
                    gtag(\'event\', \'' . $event . '\', ' . $actionJson . ');
                </script>';
        }
        
        return '
            <script>
                gtag(\'event\', \'' . $event . '\', ' . $actionJson . ');
            </script>
        ';
    }
    
    
    /**
     * @return InstallationStatusInterface
     */
    protected function cookieConsentInstallationStatus(): InstallationStatusInterface
    {
        if ($this->cookieConsentInstallationStatus === null) {
    
            $this->cookieConsentInstallationStatus = CookieConsentPanelInstallationStatus::create();
        }
        
        return $this->cookieConsentInstallationStatus;
    }
}