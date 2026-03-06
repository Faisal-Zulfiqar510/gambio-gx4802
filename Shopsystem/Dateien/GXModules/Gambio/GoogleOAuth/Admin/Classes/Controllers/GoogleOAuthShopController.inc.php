<?php
/* --------------------------------------------------------------
   GoogleOAuthShopController.inc.php 2018-05-24
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

use GoogleConfigurationStorage as ConfigStorage;

/**
 * Class GoogleOAuthShopController
 */
class GoogleOAuthShopController extends HttpViewController
{
    private static $adwordsClientsTable = 'google_adwords_client_customers';
    
    
    /**
     * Receives the oauth data from google and store them in the database.
     *
     * @return JsonHttpControllerResponse
     */
    public function actionReceiveOAuthData()
    {
        $db            = StaticGXCoreLoader::getDatabaseQueryBuilder();
        $configStorage = new ConfigStorage($db, ConfigStorage::SCOPE_AUTH);
        
        $configStorage->set('refresh-token', $this->_getPostData('refreshToken'))
            ->set('access-token',
                  $this->_getPostData('accessToken'))
            ->set('expiration-timestamp', $this->_getPostData('expirationTimestamp'));
        
        $clients = $this->_getPostData('clients');
        
        $db->truncate(static::$adwordsClientsTable);
        foreach ($clients as $client) {
            $db->insert(static::$adwordsClientsTable,
                        [
                            'client_customer_id' => $client['clientCustomerId'],
                            'primary'            => $client['primary']
                        ]);
        }
        $configStorage->set('connection-status', true, ConfigStorage::SCOPE_GENERAL);
        
        return MainFactory::create(JsonHttpControllerResponse::class, ['success' => true]);
    }
}