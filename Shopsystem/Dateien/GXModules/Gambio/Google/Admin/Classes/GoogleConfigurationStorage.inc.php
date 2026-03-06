<?php
/* --------------------------------------------------------------
   GoogleConfigurationStorage.inc.php 2021-07-26
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class GoogleConfigurationStorage
 */
class GoogleConfigurationStorage
{
    /**
     * Easy to use scopes.
     */
    const SCOPE_GENERAL   = 'general';
    const SCOPE_ADWORDS   = 'adwords';
    const SCOPE_SHOPPING  = 'shopping';
    const SCOPE_ANALYTICS = 'analytics';
    const SCOPE_AUTH      = 'auth';
    
    /**
     * @var CI_DB_query_builder
     */
    protected $db;
    
    /**
     * @var string
     */
    protected $table = 'google_configurations';
    
    /**
     * @var string
     */
    protected $scope;
    
    /**
     * @var array
     */
    protected $validScopes = ['general', 'auth', 'adwords', 'shopping', 'analytics'];
    
    /**
     * @var string
     */
    protected $clientCustomerId;
    
    
    /**
     * GoogleConfigurationStorage constructor.
     *
     * @param CI_DB_query_builder $db     Database component.
     * @param string              $scope  (Optional) Google config scope. It is recommended to use one of the class
     *                                    scope constants.
     */
    public function __construct(CI_DB_query_builder $db, $scope = null)
    {
        if ($scope) {
            $this->_checkScope($scope);
        }
        $this->db    = $db;
        $this->scope = $scope;
    }
    
    
    /**
     * Fetches a google configuration value.
     *
     * @param string $option Configuration option. "option" field in "google_configurations" table.
     * @param string $scope  (Optional) Google config scope. It is recommended to use one of the class scope constants.
     *
     * @return mixed
     */
    public function get($option, $scope = null)
    {
        if ($this->isInstalled()) {
            if ($scope) {
                $this->_checkScope($scope);
            }
            $where       = ['scope' => $scope ? : $this->scope, 'option' => $option];
            $resultJson  = $this->db->select('value')->where($where)->get($this->table)->row_array();
            
            if (empty($resultJson) === false) {
                
                $resultArray = json_decode($resultJson['value'], true);
                
                if ($resultArray && array_key_exists('value', $resultArray)) {
                    return $resultArray['value'];
                }
            }
            
            throw new InvalidArgumentException('Value for given option "' . $option . '" was not found!');
        }
    }
    
    
    /**
     * Changes the value of a google configuration option.
     *
     * @param string $option Name of configuration option.
     * @param mixed  $value  New value.
     * @param string $scope  (Optional) Google config scope. It is recommended to use one of the class scope constants.
     *
     * @return $this|GoogleConfigurationStorage Same instance for chained method calls.
     */
    public function set($option, $value, $scope = null)
    {
        if ($scope) {
            $this->_checkScope($scope);
        }
        $where = ['scope' => $scope ? : $this->scope, 'option' => $option];
        $data  = ['value' => json_encode(['value' => $value])];
        
        $this->db->update($this->table, $data, $where);
        
        return $this;
    }
    
    
    /**
     * Determines and returns the client customer id.
     *
     * @return string
     */
    public function getClientCustomerId()
    {
        if (null !== $this->clientCustomerId) {
            return $this->clientCustomerId;
        }
        $result = $this->db->from('google_adwords_client_customers')->where('primary', 1)->get()->row_array();
        
        if (empty($result)) {
            throw new UnexpectedValueException('Client customer id was not found');
        }
        $this->clientCustomerId = $result['client_customer_id'];
        
        return $this->clientCustomerId;
    }
    
    
    /**
     * Returns the current shop version.
     *
     * @return string
     */
    public function getShopVersion()
    {
        $version = $this->db->from('gx_configurations')->where('key', 'INSTALLED_VERSION')->get()->row_array();
        
        return $version['value'];
    }
    
    
    /**
     * Checks if the google_configurations table exists.
     *
     * @return bool
     */
    public function isInstalled()
    {
        return $this->db->table_exists('google_configurations');
    }
    
    
    /**
     * Checks if the given scope exists.
     *
     * @param string $scope Google config scope. Must be either "general", "adwords" or "analytics".
     *
     * @return $this Same instance for chained method calls.
     */
    protected function _checkScope($scope)
    {
        if (!in_array($scope, $this->validScopes, true)) {
            throw new InvalidArgumentException('Invalid scope value "' . $scope . '" provided! Allowed scopes are "'
                                               . implode('", "',
                                                         $this->validScopes)
                                               . '". It is recommended to use one of the GoogleConfigurationStorage::SCOPE_ constants');
        }
        
        return $this;
    }
}