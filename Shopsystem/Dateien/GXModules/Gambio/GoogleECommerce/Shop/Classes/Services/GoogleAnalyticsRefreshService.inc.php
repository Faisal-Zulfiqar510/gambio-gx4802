<?php
/* --------------------------------------------------------------
   GoogleAnalyticsRefreshService.inc.php 2018-06-15
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

use GuzzleHttp\Client;

/**
 * Class GoogleAnalyticsRefreshService
 */
class GoogleAnalyticsRefreshService
{
    /**
     * @var Client
     */
    private $httpClient;
    
    /**
     * @var GoogleAnalyticsConfigurationReadServiceInterface
     */
    private $readService;
    
    /**
     * @var GoogleAnalyticsRefreshServiceOptionsInterface
     */
    private $options;
    
    /**
     * @var string
     */
    private $dataCacheKey = 'analytics_js_expires_at';
    
    
    /**
     * GoogleAnalyticsRefreshService constructor.
     *
     * @param GoogleAnalyticsRefreshServiceOptionsInterface    $options     Refresh service options.
     * @param Client                                           $httpClient  Http client.
     * @param GoogleAnalyticsConfigurationReadServiceInterface $readService GA config read service.
     */
    public function __construct(
        GoogleAnalyticsRefreshServiceOptionsInterface $options,
        Client $httpClient,
        GoogleAnalyticsConfigurationReadServiceInterface $readService
    ) {
        $this->httpClient  = $httpClient;
        $this->readService = $readService;
        $this->options     = $options;
    }
    
    
    /**
     * Named constructor of google analytics refresh service.
     *
     * @param GoogleAnalyticsRefreshServiceOptionsInterface         $options     Refresh service options.
     * @param Client|null                                           $httpClient  (Optional) Http client.
     * @param GoogleAnalyticsConfigurationReadServiceInterface|null $readService (Optional) GA config read service.
     *
     * @return GoogleAnalyticsRefreshService New instance.
     */
    public static function create(
        GoogleAnalyticsRefreshServiceOptionsInterface $options,
        Client $httpClient = null,
        GoogleAnalyticsConfigurationReadServiceInterface $readService = null
    ) {
        $httpClient  = $httpClient ? : new Client;
        $readService = $readService ? : GoogleAnalyticsConfigurationServiceFactory::readService();
        
        return MainFactory::create(static::class, $options, $httpClient, $readService);
    }
    
    
    /**
     * Updates the google analytics shop files, if they are older than one day.
     */
    public function updateAnalyticsIfNecessary()
    {
        if (!$this->readService->isInstalled()) {
            return;
        }
        $analyticsEnabled = $this->readService->enabled();
        $uaTrackingCode   = $this->readService->uaTrackingCode();
        
        if (!$analyticsEnabled || $uaTrackingCode === '') {
            return;
        }
        
        $dataCache = DataCache::get_instance();
        $expiresAt = $dataCache->get_persistent_data($this->dataCacheKey);
        
        if (!$expiresAt || $expiresAt <= time()) {
            $this->_downloadAnalyticsJs()
                ->_downloadGTagJs(GoogleAnalyticsUaTrackingCode::create($uaTrackingCode))
                ->_downloadECommercePlugin();
            
            $dataCache->write_persistent_data($this->dataCacheKey, strtotime('+1 day'));
        }
    }
    
    
    /**
     * Downloads and modifies the gtag javascript file.
     * After downloading the file, the https://www.google-analytics.com/ endpoints got modified and will be proxied
     * through the shop.
     *
     * @param GoogleAnalyticsUaTrackingCode $trackingCode UA-Tracking code (will be append to the gtag source).
     *
     * @return $this
     */
    private function _downloadGTagJs(GoogleAnalyticsUaTrackingCode $trackingCode)
    {
        $gTagFile = GoogleAnalyticsJsFile::gtag($trackingCode);
        @unlink($this->options->root() . '/public/' . $this->readService->analyticsFileName($gTagFile));
        
        $destination = $this->options->root() . '/public/' . $this->readService->newAnalyticsFileName($gTagFile);
        $this->httpClient->get($gTagFile->sourceUrl(),
                               [
                                   'sink' => $destination
                               ]);
        
        $content = file_get_contents($destination);
        $content = str_replace('https://www.google-analytics.com/analytics.js',
                               $this->options->webServer() . 'public/'
                               . $this->readService->analyticsFileName(GoogleAnalyticsJsFile::analytics()),
                               $content);
        file_put_contents($destination, $content);
        
        return $this;
    }
    
    
    /**
     * Downloads and modifies the google analytics javascript file.
     * After downloading the file, the https://www.google-analytics.com/ endpoints got modified and will be proxied
     * through the shop.
     *
     * @return $this Same instance for chained method calls.
     */
    private function _downloadAnalyticsJs()
    {
        $analyticsFile = GoogleAnalyticsJsFile::analytics();
        
        @unlink($this->options->root() . '/public/' . $this->readService->analyticsFileName($analyticsFile));
        @unlink($this->options->root() . '/analytics/analytics.js');
        
        $destinations = [
            $this->options->root() . '/analytics/analytics.js',
            $this->options->root() . '/public/' . $this->readService->newAnalyticsFileName($analyticsFile)
        ];
        
        foreach ($destinations as $destination) {
            $this->httpClient->get($analyticsFile->sourceUrl(), ['sink' => $destination]);
            
            $analyticsContent = file_get_contents($destination);
            $analyticsContent = str_replace('https://www.google-analytics.com',
                                            $this->options->webServer()
                                            . 'ec_proxy.php?prx=',
                                            $analyticsContent);
            $analyticsContent = str_replace('www.google-analytics.com',
                                            $this->options->webServerWithoutProtocol()
                                            . 'ec_proxy.php?prx=',
                                            $analyticsContent);
            file_put_contents($destination, $analyticsContent);
        }
        
        return $this;
    }
    
    
    /**
     * Downloads the google analytics e-commerce plugin file.
     *
     * @return $this Same instance for chained method calls.
     */
    private function _downloadECommercePlugin()
    {
        $eCommercePluginFile = GoogleAnalyticsJsFile::ecPlugin();
        @unlink($this->options->root() . '/public/' . $this->readService->analyticsFileName($eCommercePluginFile));
        $this->httpClient->get($eCommercePluginFile->sourceUrl(),
                               [
                                   'sink' => $this->options->root() . '/public/'
                                             . $this->readService->newAnalyticsFileName($eCommercePluginFile)
                               ]);
        
        return $this;
    }
}
