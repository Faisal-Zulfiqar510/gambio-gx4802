<?php
/* --------------------------------------------------------------
   GoogleAdWordsShopController.inc.php 2017-11-27
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2017 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class GoogleAdWordsShopController
 *
 * This controller stores the Google AdWords refresh token and client customer ids after a successful connection.
 *
 * @category System
 * @package  AdminHttpViewControllers
 */
class GoogleAdWordsShopController extends HttpViewController
{
    /**
     * @var CI_DB_query_builder
     */
    protected $db;
    
    
    /**
     * Initialize the controller.
     */
    public function init()
    {
        $this->db = StaticGXCoreLoader::getDatabaseQueryBuilder();
    }
    
    
    /**
     * Stores the Google AdWords client customers ids and the Google refresh token into the database.
     *
     * @return JsonHttpControllerResponse
     */
    public function actionStoreAdWordsConnection()
    {
        $secureToken     = $this->_getPostData('secureToken');
        $clientCustomers = $this->_getPostData('clients');
        $refreshToken    = new NonEmptyStringType($this->_getPostData('refreshToken'));
        
        if ($this->_checkSecureToken($secureToken) === false) {
            return MainFactory::create('JsonHttpControllerResponse',
                                       [
                                           'success' => false,
                                           'error'   => 'secureToken POST-parameter is missing or invalid'
                                       ]);
        }
        
        if (empty($clientCustomers) || count($clientCustomers) === 0) {
            return MainFactory::create('JsonHttpControllerResponse',
                                       [
                                           'success' => false,
                                           'error'   => 'clients POST-parameter is missing or invalid'
                                       ]);
        }
        
        if (empty($refreshToken)) {
            return MainFactory::create('JsonHttpControllerResponse',
                                       [
                                           'success' => false,
                                           'error'   => 'refreshToken POST-parameter is missing or invalid'
                                       ]);
        }
        
        $configurationStorage = new GoogleConfigurationStorage($this->db, GoogleConfigurationStorage::SCOPE_GENERAL);
        
        // Store refresh token in gm_configuration
        //gm_set_conf('GOOGLE_ADWORDS_REFRESH_TOKEN', $refreshToken->asString());
        $configurationStorage->set('refresh-token', $refreshToken->asString());
        
        // Store client customer ids in the DB
        foreach ($clientCustomers as $clientCustomer) {
            $clientCustomer = json_decode($clientCustomer, true);
            
            if ($this->_checkClientCustomerId($clientCustomer['clientCustomerId'])) {
                $this->db->replace('google_adwords_client_customers',
                                   [
                                       'client_customer_id' => $clientCustomer['clientCustomerId'],
                                   ]);
                
                if (!empty($clientCustomer['primary']) && $clientCustomer['primary'] === true) {
                    $this->db->set('primary', 0)->update('google_adwords_client_customers');
                    $this->db->set('primary', 1)
                        ->where('client_customer_id', $clientCustomer['clientCustomerId'])
                        ->update('google_adwords_client_customers');
                }
            }
        }
        
        // Set connected with Google Adwords flag to true
        //gm_set_conf('GOOGLE_ADWORDS_CONNECTION_STATUS', 'true');
        $configurationStorage->set('connection-status', true);
        
        return MainFactory::create('JsonHttpControllerResponse', ['success' => true]);
    }
    
    
    /**
     * Checks if the given secure token is valid.
     *
     * @param string $secureToken
     *
     * @return bool
     */
    protected function _checkSecureToken($secureToken)
    {
        return !empty($secureToken);
    }
    
    
    /**
     * Checks if the given secure token is valid.
     *
     * @param string $secureToken
     *
     * @return bool
     */
    protected function _checkClientCustomerId($clientCustomerId)
    {
        return preg_match('/^\d{3}-\d{3}-\d{4}$/', $clientCustomerId);
    }
}