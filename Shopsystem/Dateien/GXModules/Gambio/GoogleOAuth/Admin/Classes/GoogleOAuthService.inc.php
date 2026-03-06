<?php
/* --------------------------------------------------------------
   GoogleOAuthService.inc.php 2018-05-25
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

use GuzzleHttp\Client;

/**
 * Class GoogleOAuthService
 */
class GoogleOAuthService
{
    /**
     * @var GoogleConfigurationStorage
     */
    protected $storage;
    
    /**
     * @var GoogleServicesApiClient
     */
    protected $apiClient;
    
    
    /**
     * GoogleOAuthService constructor.
     *
     * @param GoogleConfigurationStorage $storage   Access to google configurations.
     * @param GoogleServicesApiClient    $apiClient Http client to fetch new token if necessary.
     */
    public function __construct(GoogleConfigurationStorage $storage, GoogleServicesApiClient $apiClient)
    {
        $this->storage   = $storage;
        $this->apiClient = $apiClient;
    }
    
    
    /**
     * Named constructor of GoogleOAuthService.
     *
     * @param GoogleConfigurationStorage $storage   Access to google configurations.
     * @param GoogleServicesApiClient    $apiClient Api client.
     *
     * @return GoogleOAuthService New instance.
     */
    public static function create(GoogleConfigurationStorage $storage = null, GoogleServicesApiClient $apiClient = null)
    {
        $storage   = $storage ? : MainFactory::create(GoogleConfigurationStorage::class,
                                                      StaticGXCoreLoader::getDatabaseQueryBuilder());
        $apiClient = $apiClient ? : MainFactory::create(GoogleServicesApiClient::class, new Client(), $storage);
        
        return new static($storage, $apiClient);
    }
    
    
    /**
     * Returns the google oauth access token.
     * If the token is already expired, a new token is exchanged with the refresh token.
     *
     * @return string
     */
    public function getAccessToken()
    {
        $expirationTimestamp = $this->storage->get('expiration-timestamp', GoogleConfigurationStorage::SCOPE_AUTH);
        
        if ($expirationTimestamp <= time()) {
            $response  = $this->apiClient->call('auth/refresh_access_token');
            $tokenInfo = json_decode($response->getBody()->getContents(), true);
            
            $accessToken         = $tokenInfo['access_token'];
            $expirationTimestamp = time() + $tokenInfo['expires_in'];
            
            $this->storage->set('access-token', $accessToken, GoogleConfigurationStorage::SCOPE_AUTH);
            $this->storage->set('expiration-timestamp', $expirationTimestamp, GoogleConfigurationStorage::SCOPE_AUTH);
            
            return $accessToken;
        }
        
        return $this->storage->get('access-token', GoogleConfigurationStorage::SCOPE_AUTH);
    }
}
