<?php
/* --------------------------------------------------------------
   GoogleServicesApiClient.inc.php 2018-10-09
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

use GuzzleHttp\Client;
use GoogleConfigurationStorage as Storage;
use Psr\Http\Message\ResponseInterface;

/**
 * Class GoogleServicesApiClient
 */
class GoogleServicesApiClient
{
    /**
     * @var Client
     */
    protected $httpClient;
    
    /**
     * @var GoogleConfigurationStorage
     */
    protected $storage;
    
    
    /**
     * GoogleServicesApiClient constructor.
     *
     * @param Client                     $httpClient
     * @param GoogleConfigurationStorage $storage
     */
    public function __construct(Client $httpClient, Storage $storage)
    {
        $this->httpClient = $httpClient;
        $this->storage    = $storage;
    }
    
    
    /**
     * Performs a client call to the google services api.
     * All required headers will be set automatically.
     *
     * @param string $endpoint Endpoint url suffix after api version and /client/[clientCustomerId].
     * @param array  $options  Additional request options for the http client.
     *
     * @return ResponseInterface
     */
    public function clientCall($endpoint, array $options = [])
    {
        $apiUrl   = $this->storage->get('api-url', Storage::SCOPE_GENERAL);
        $endpoint = $apiUrl . '/client/' . $this->storage->getClientCustomerId() . '/' . $endpoint;
        
        return $this->httpClient->get($endpoint, $this->_getRequestOptions($options));
    }
    
    
    /**
     * Performs a patch client call to the google services api.
     * All required headers will be set automatically.
     *
     * @param string $endpoint Endpoint url suffix after api version and /client/[clientCustomerId].
     * @param array  $json     Data to send, will encoded into a json string.
     * @param array  $options  Additional request options for the http client.
     *
     * @return ResponseInterface
     */
    public function patchClientCall($endpoint, array $json, array $options = [])
    {
        $apiUrl   = $this->storage->get('api-url', Storage::SCOPE_GENERAL);
        $endpoint = $apiUrl . '/client/' . $this->storage->getClientCustomerId() . '/' . $endpoint;
        $options  = array_merge_recursive($options, ['json' => $json]);
        
        return $this->httpClient->patch($endpoint, $this->_getRequestOptions($options));
    }
    
    
    /**
     * Performs a client call to the google services api.
     * All required headers will be set automatically.
     *
     * @param string $endpoint Endpoint url suffix after api version.
     * @param array  $options  Additional request options for the http client.
     *
     * @return ResponseInterface
     */
    public function call($endpoint, array $options = [])
    {
        $apiUrl   = $this->storage->get('api-url', Storage::SCOPE_GENERAL);
        $endpoint = $apiUrl . '/' . $endpoint;
        
        return $this->httpClient->get($endpoint, $this->_getRequestOptions($options));
    }
    
    
    /**
     * Returns the request options.
     * All informative required headers will be added to the request options.
     *
     * @param array $options (Optional) Options to be merged.
     *
     * @return array Options for guzzle http request.
     */
    private function _getRequestOptions(array $options = [])
    {
        $headers = [
            'X-Refresh-Token'       => $this->storage->get('refresh-token', Storage::SCOPE_AUTH),
            'X-Origin'              => HTTP_SERVER . DIR_WS_CATALOG,
            'X-Shop-Version'        => $this->storage->getShopVersion(),
            'X-Shop-Google-Version' => $this->_getGoogleServiceVersion()
        ];
        
        return array_merge_recursive($options, ['headers' => $headers]);
    }
    
    
    /**
     * Returns the google services module version.
     *
     * @return string
     */
    private function _getGoogleServiceVersion()
    {
        $path    = DIR_FS_CATALOG . 'version_info' . DIRECTORY_SEPARATOR . 'google_services-';
        $matches = glob($path . '*.php');
        
        if (count($matches) === 0) {
            // use 1.0.5 to determine for the api that the legacy flow should be used.
            return '1.0.5';
        }
        sort($matches);
        $latestVersionPath = array_pop($matches);
        
        return str_replace('.php', '', str_replace($path, '', $latestVersionPath));
    }
}