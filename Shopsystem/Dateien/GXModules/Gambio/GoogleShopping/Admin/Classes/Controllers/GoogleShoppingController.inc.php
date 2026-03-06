<?php
/* --------------------------------------------------------------
   GoogleShoppingController.inc.php 2022-08-04
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class GoogleShoppingController
 *
 * This controller displays the several pages for Google Shopping.
 *
 * @category System
 * @package  AdminHttpViewControllers
 */
class GoogleShoppingController extends AdminHttpViewController
{
    /**
     * @var string
     */
    protected $jsBaseUrl;
    
    /**
     * @var string
     */
    protected $stylesBaseUrl;
    
    /**
     * @var string
     */
    protected $templatesBaseUrl;
    
    /**
     * @var LanguageTextManager
     */
    protected $languageTextManager;
    
    /**
     * @var CSVControl
     */
    protected $csvControl;
    
    /**
     * @var CI_DB_query_builder
     */
    protected $db;
    
    /**
     * @var GoogleConfigurationStorage
     */
    protected $configurationStorage;
    
    const EXPORT_GROUP_ID = 3;
    
    
    /**
     * Initialize the controller.
     */
    public function init()
    {
        $this->jsBaseUrl            = '../GXModules/Gambio/GoogleShopping/Build/Admin/Javascript';
        $this->stylesBaseUrl        = '../GXModules/Gambio/GoogleShopping/Build/Admin/Styles';
        $this->templatesBaseUrl     = DIR_FS_CATALOG . 'GXModules/Gambio/GoogleShopping/Admin/Html';
        $this->languageTextManager  = MainFactory::create('LanguageTextManager',
                                                          'google_shopping',
                                                          $_SESSION['languages_id']);
        $this->csvControl           = CSVControl::get_instance();
        $this->db                   = StaticGXCoreLoader::getDatabaseQueryBuilder();
        $this->configurationStorage = new GoogleConfigurationStorage($this->db,
                                                                     GoogleConfigurationStorage::SCOPE_GENERAL);
    }
    
    
    /**
     * Displays the Google Shopping overview page.
     *
     * @return AdminLayoutHttpControllerResponse|bool
     */
    public function actionDefault()
    {
        $title    = new NonEmptyStringType($this->languageTextManager->get_text('page_title'));
        $template = new ExistingFile(new NonEmptyStringType($this->templatesBaseUrl . '/scheme_overview.html'));
        
        $schemes = [];
        $typeId  = $this->db->select('type_id')->from('export_types')->where([
                                                                                 'language_id' => $_SESSION['languages_id'],
                                                                                 'name'        => 'Google Shopping'
                                                                             ])->get()->row_array();
        /** @var CSVSchemeModel $csvSchemeModel */
        foreach ($this->csvControl->get_schemes_by_type($typeId['type_id']) as $csvSchemeModel) {
            $schemes[$csvSchemeModel->v_scheme_id] = $csvSchemeModel->v_data_array;
        }
        
        $data = MainFactory::create('KeyValueCollection',
                                    array_merge([
                                                    'schemes'           => $schemes,
                                                    'authSuccess'       => (string)$this->_getQueryParameter('success')
                                                                           === '1' ? : false,
                                                    'show_account_form' => $this->configurationStorage->get('connection-status') ? 'false' : 'true'
                                                ],
                                                $this->_accountConnectionData()));
        
        $assetsArray = [
            MainFactory::create('Asset', $this->stylesBaseUrl . '/schemes_overview.css'),
            MainFactory::create('Asset', 'google_shopping.lang.inc.php'),
            MainFactory::create('Asset', 'admin_buttons.lang.inc.php'),
        ];
        $assets      = MainFactory::create('AssetCollection', $assetsArray);
        
        return MainFactory::create('AdminLayoutHttpControllerResponse', $title, $template, $data, $assets);
    }
    
    
    /**
     * Creates a new scheme.
     *
     * @return AdminLayoutHttpControllerResponse|bool
     */
    public function actionCreateScheme()
    {
        $title       = new NonEmptyStringType($this->languageTextManager->get_text('page_title'));
        $template    = new ExistingFile(new NonEmptyStringType($this->templatesBaseUrl . '/configuration.html'));
        $data        = MainFactory::create('KeyValueCollection', $this->getTemplateDataArray());
        $assetsArray = [
            MainFactory::create('Asset', $this->stylesBaseUrl . '/configuration.css'),
            MainFactory::create('Asset', 'google_shopping.lang.inc.php'),
        ];
        $assets      = MainFactory::create('AssetCollection', $assetsArray);
        
        return MainFactory::create('AdminLayoutHttpControllerResponse', $title, $template, $data, $assets);
    }
    
    
    /**
     * Edits a scheme.
     *
     * @return AdminLayoutHttpControllerResponse|bool
     */
    public function actionEditScheme()
    {
        $title       = new NonEmptyStringType($this->languageTextManager->get_text('page_title'));
        $template    = new ExistingFile(new NonEmptyStringType($this->templatesBaseUrl . '/configuration.html'));
        $schemeId    = new IdType((int)$this->_getQueryParameter('id'));
        $data        = MainFactory::create('KeyValueCollection', $this->getTemplateDataArray($schemeId));
        $assetsArray = [
            MainFactory::create('Asset', $this->stylesBaseUrl . '/configuration.css'),
            MainFactory::create('Asset', $this->stylesBaseUrl . '/scheme_categories.css'),
            MainFactory::create('Asset', 'google_shopping.lang.inc.php'),
        ];
        $assets      = MainFactory::create('AssetCollection', $assetsArray);
        
        return MainFactory::create('AdminLayoutHttpControllerResponse', $title, $template, $data, $assets);
    }
    
    
    /**
     * Saves scheme data and redirects to scheme overview page.
     *
     * @return RedirectHttpControllerResponse
     */
    public function actionStoreScheme()
    {
        $schemeData                = $this->getTransformedSchemeData($this->_getPostData('scheme'));
        $schemeData['scheme_name'] = $this->getUniqueSchemeName(new IdType($schemeData['scheme_id']),
                                                                new NonEmptyStringType($schemeData['scheme_name']));
        
        try {
            $schemeData['filename'] = $this->getUniqueFilename(new IdType($schemeData['scheme_id']),
                                                               new FilenameStringType($schemeData['filename']));
        } catch (InvalidArgumentException $exception) {
            $schemeData['filename'] = $this->getUniqueFilename(new IdType($schemeData['scheme_id']),
                                                               new FilenameStringType(basename($schemeData['filename'])));
        }
        
        $schemeId = $this->csvControl->save_scheme($schemeData);
        
        if ($schemeData['scheme_id'] === 0) {
            $defaultFields = $this->getDefaultFields();
            foreach ($defaultFields as $defaultField) {
                $field              = $this->getTransformedFieldData($defaultField);
                $field['scheme_id'] = $schemeId;
                $this->csvControl->save_field($field);
            }
        }
        
        $this->storeCategoryConfiguration($schemeId);
        
        return MainFactory::create('RedirectHttpControllerResponse', 'admin.php?do=GoogleShopping');
    }
    
    
    /**
     * Copies a scheme and redirects to the scheme overview.
     *
     * @return bool|RedirectHttpControllerResponse
     */
    public function actionCopyScheme()
    {
        $id = $this->_getQueryParameter('id');
        if (is_numeric($id) && (int)$id > 0) {
            $this->csvControl->copy_scheme((int)$id);
        } else {
            $GLOBALS['messageStack']->add_session($this->languageTextManager->get_text('error_invalid_scheme_id'),
                                                  'error');
        }
        
        return MainFactory::create('RedirectHttpControllerResponse', 'admin.php?do=GoogleShopping');
    }
    
    
    /**
     * Decides if the scheme data should be fetched from an existing scheme or the default data.
     *
     * @param IdType|null $schemeId The optional scheme ID
     *
     * @return array Scheme data array
     */
    protected function generateSchemeData(IdType $schemeId = null)
    {
        if (null === $schemeId) {
            return $this->generateDefaultSchemeData();
        }
        
        return $this->generateSchemeDataBySchemeId($schemeId);
    }
    
    
    /**
     * Generates and returns an array of default data for a scheme.
     *
     * @return array The default data array
     */
    protected function generateDefaultSchemeData()
    {
        $scheme = [
            'id'                     => 0,
            'name'                   => 'Google Shopping',
            'filename'               => 'google_shopping_feed.txt',
            'separator'              => '\t',
            'quotes'                 => '',
            'currency_id'            => 1,
            'language_id'            => (int)($_SESSION['languages_id'] ?? null),
            'additional_image_count' => 10,
            'customer_group_id'      => 1,
            'campaign_id'            => 0,
            'shipping_free_minimum'  => 0.0,
            'quantity_minimum'       => 0.0,
            'export_attributes'      => 0,
            'export_properties'      => 0,
            'export_property_image'  => 0,
            'cronjob_allowed'        => 0,
            'cronjob_days'           => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            'cronjob_hour'           => 0,
            'cronjob_interval'       => 0,
            'export_url'             => HTTP_SERVER . DIR_WS_CATALOG . 'export/google_shopping.txt',
            'fields'                 => $this->getDefaultFields(),
            'categories'             => [],
            'export_new_categories'  => '0'
        ];
        
        return $scheme;
    }
    
    
    /**
     * Generates and returns a data array by the given scheme ID.
     *
     * @param IdType $schemeId The scheme ID
     *
     * @return array A data array that contains all needed information about the scheme
     */
    protected function generateSchemeDataBySchemeId(IdType $schemeId)
    {
        $schemeModel = $this->csvControl->get_scheme($schemeId->asInt());
        $schemeData  = $schemeModel->v_data_array;
        $scheme      = [
            'id'                     => (int)$schemeData['scheme_id'],
            'name'                   => $schemeData['scheme_name'],
            'filename'               => $schemeData['filename'],
            'separator'              => $schemeData['field_separator'],
            'quotes'                 => $schemeData['field_quotes'],
            'currency_id'            => (int)$schemeData['currencies_id'],
            'language_id'            => (int)$schemeData['languages_id'],
            'additional_image_count' => (int)$schemeData['amount_additional_image_files'],
            'customer_group_id'      => (int)$schemeData['customers_status_id'],
            'campaign_id'            => $schemeData['campaign_id'],
            'shipping_free_minimum'  => (float)$schemeData['shipping_free_minimum'],
            'quantity_minimum'       => (float)$schemeData['quantity_minimum'],
            'export_attributes'      => (int)$schemeData['export_attributes'] === 1,
            'export_properties'      => (int)$schemeData['export_properties'] === 1,
            'export_property_image'  => (int)$schemeData['export_property_image'] === 1,
            'cronjob_allowed'        => (int)$schemeData['cronjob_allowed'] === 1,
            'cronjob_days'           => explode('|', $schemeData['cronjob_days']),
            'cronjob_hour'           => (int)$schemeData['cronjob_hour'],
            'cronjob_interval'       => (int)$schemeData['cronjob_interval'],
            'export_url'             => HTTP_SERVER . DIR_WS_CATALOG . 'export/' . $schemeData['filename'],
            'fields'                 => $this->getSchemeFields($schemeId),
            'categories'             => $this->csvControl->get_child_categories($schemeId->asInt(), -1, true),
            'export_new_categories'  => $schemeModel->getExportAllCategories()
        ];
        
        return $scheme;
    }
    
    
    /**
     * Generates all data that is needed by the template by an optional scheme ID
     *
     * @param IdType|null $schemeId Optional scheme ID from which the scheme data is fetched from. If not set, default
     *                              scheme data is provided
     *
     * @return array Data the template needs to display the page
     */
    protected function getTemplateDataArray(IdType $schemeId = null)
    {
        $schemeData = $this->generateSchemeData($schemeId);
        $languageId = new IdType($schemeData['language_id']);
        
        $token = LogControl::get_secure_token();
        $token = md5($token);
        
        $data = [
            'connected'         => $this->configurationStorage->get('connection-status'),
            'scheme'            => $schemeData,
            'languages'         => $this->getLanguages(),
            'customer_statuses' => $this->getCustomerStatusArray(new IdType((int)$_SESSION['languages_id'])),
            'currencies'        => $this->getCurrencies(),
            'campaigns'         => $this->getCampaigns(),
            'hours'             => $this->getHours(),
            'intervals'         => $this->getIntervals(),
            'variables'         => $this->getVariables(),
            'attributes'        => $this->getAttributes($languageId),
            'properties'        => $this->getProperties($languageId),
            'additionalFields'  => $this->getAdditionalFields($languageId),
            'cronjob_url'       => HTTP_SERVER . DIR_WS_CATALOG . 'request_port.php?module=CSV&action=export&token='
                                   . $token,
        ];
        
        return $data;
    }
    
    
    /**
     * Get all Customer Status IDs and names for the provided language ID.
     *
     * @param IdType $languageId
     *
     * @return array All customer status IDs and customer status names.
     */
    protected function getCustomerStatusArray(IdType $languageId)
    {
        $customerStatusArray = [];
        /**
         * @var $customerStatuses array
         */
        $customerStatuses = $this->db->select(['customers_status_id', 'customers_status_name'])
            ->from('customers_status')
            ->where('language_id', $languageId->asInt())
            ->order_by('customers_status_name')
            ->get()
            ->result_array();
        foreach ($customerStatuses as $customerStatus) {
            $customerStatusArray[$customerStatus['customers_status_id']] = $customerStatus['customers_status_name'];
        }
        
        return $customerStatusArray;
    }
    
    
    /**
     * Get all currencies with Id and currency code.
     *
     * @return array All currencies with ID and currency code.
     */
    protected function getCurrencies()
    {
        $currenciesArray = [];
        /**
         * @var $currencies array
         */
        $currencies = $this->db->select(['currencies_id', 'code'])
            ->from('currencies')
            ->order_by('code')
            ->get()
            ->result_array();
        foreach ($currencies as $currency) {
            $currenciesArray[$currency['currencies_id']] = $currency['code'];
        }
        
        return $currenciesArray;
    }
    
    
    /**
     * Get all languages with Id and name.
     *
     * @return array All languages with Id and language code.
     */
    protected function getLanguages()
    {
        $languagesArray = [];
        
        $languagesResult = $this->db->select(['languages_id', 'name'])->from('languages')->order_by('name')->get();
        foreach ($languagesResult->result_array() as $language) {
            $languagesArray[$language['languages_id']] = $language['name'];
        }
        
        return $languagesArray;
    }
    
    
    /**
     * Get all campaigns with Id, campaign RefId and name.
     *
     * @return array All campaigns with Id, campaign RefId and name.
     */
    protected function getCampaigns()
    {
        $campaignsArray = [];
        /**
         * @var $campaigns array
         */
        $campaigns = $this->db->select(['campaigns_id', 'campaigns_refID', 'campaigns_name'])
            ->from('campaigns')
            ->get()
            ->result_array();
        
        foreach ($campaigns as $campaign) {
            $campaignsArray[$campaign['campaigns_id']] = [
                'campaigns_id'    => $campaign['campaigns_id'],
                'campaigns_refID' => $campaign['campaigns_refID'],
                'campaigns_name'  => $campaign['campaigns_name']
            ];
        }
        
        return $campaignsArray;
    }
    
    
    /**
     * Returns an array with the default fields for new Google Shopping schemes.
     *
     * @return array Default fields for new Google Shopping schemes.
     */
    protected function getDefaultFields()
    {
        return include DIR_FS_CATALOG . 'GXModules/Gambio/GoogleShopping/Admin/google_shopping_default_fields.inc.php';
    }
    
    
    /**
     * Gets an array of scheme fields represented in an array of scheme field data.
     *
     * @param IdType $schemeId The ID of the subjected scheme
     *
     * @return array A two dimensional array that represents all field data of the scheme
     */
    protected function getSchemeFields(IdType $schemeId)
    {
        $fields = [];
        /**
         * @var $schemeFieldArray array
         */
        $scheme = $this->csvControl->get_scheme($schemeId->asInt());
        $scheme->load_fields();
        
        foreach ($scheme->v_fields_array as $schemeField) {
            $fields[] = [
                'id'              => (int)$schemeField->v_data_array['field_id'],
                'name'            => $schemeField->v_data_array['field_name'],
                'content'         => $schemeField->v_data_array['field_content'],
                'default_content' => $schemeField->v_data_array['field_content_default'],
                'created_by'      => $schemeField->v_data_array['created_by'],
                'sort_order'      => (int)$schemeField->v_data_array['sort_order'],
                'status'          => (int)$schemeField->v_data_array['status']
            ];
        }
        
        return $fields;
    }
    
    
    /**
     * Returns an array with the hours.
     *
     * @return array Hours.
     */
    protected function getHours()
    {
        $result = [];
        
        for ($iteration = 0; $iteration < 24; $iteration++) {
            $hour               = ($iteration < 10) ? "0$iteration" : $iteration;
            $minutes            = ':00';
            $result[$iteration] = $hour . $minutes;
        }
        
        return $result;
    }
    
    
    /**
     * Returns an array with the interval values.
     *
     * @return array Intervals.
     */
    protected function getIntervals()
    {
        $hourText  = ' ' . $this->languageTextManager->get_text('hour', 'export_schemes');
        $hoursText = ' ' . $this->languageTextManager->get_text('hours', 'export_schemes');
        $result    = [];
        
        for ($hour = 1; $hour <= 12; $hour++) {
            $result[$hour] = $hour . ($hour === 1 ? $hourText : $hoursText);
        }
        
        return $result;
    }
    
    
    /**
     * Generates and returns an array with the scheme post data with array keys that corresponds with the table column
     * names.
     *
     * @param array $schemePostData The scheme form data
     *
     * @return array The scheme data with keys that corresponds with table column names for using with GMDataObject.
     */
    protected function getTransformedSchemeData(array $schemePostData)
    {
        $schemeData = [
            'scheme_id'                     => (int)$schemePostData['id'],
            'type_id'                       => 3,
            'scheme_name'                   => $schemePostData['name'],
            'filename'                      => $schemePostData['filename'],
            'field_separator'               => $schemePostData['separator'],
            'field_quotes'                  => $schemePostData['quotes'],
            'currencies_id'                 => (int)$schemePostData['currency_id'],
            'languages_id'                  => (int)$schemePostData['language_id'],
            'amount_additional_image_files' => (int)$schemePostData['additional_image_count'],
            'customers_status_id'           => (int)$schemePostData['customer_group_id'],
            'campaign_id'                   => $schemePostData['campaign_id'],
            'shipping_free_minimum'         => (float)str_replace(',', '.', $schemePostData['shipping_free_minimum']),
            'quantity_minimum'              => (float)str_replace(',', '.', $schemePostData['quantity_minimum']),
            'export_attributes'             => (int)$schemePostData['export_attributes'],
            'export_properties'             => (int)$schemePostData['export_properties'],
            'export_property_image'         => (int)$schemePostData['export_property_image'],
        ];
        
        $cronjobData = [];
        if ($this->configurationStorage->get('connection-status')) {
            $cronjobData = [
                'cronjob_allowed'  => (int)$schemePostData['cronjob_allowed'],
                'cronjob_days'     => implode('|', $schemePostData['cronjob_days']),
                'cronjob_hour'     => $schemePostData['cronjob_hour'],
                'cronjob_interval' => $schemePostData['cronjob_interval'],
            ];
        }
        
        return array_merge($schemeData, $cronjobData);
    }
    
    
    /**
     * Generates and returns an array with the field post data with array keys that corresponds with the table column
     * names.
     *
     * @param array $fieldData The field form data
     *
     * @return array The field data with keys that corresponds with table column names for using with GMDataObject.
     */
    protected function getTransformedFieldData(array $fieldData)
    {
        return [
            'field_name'            => $fieldData['name'],
            'field_content'         => $fieldData['content'],
            'field_content_default' => $fieldData['default_content'],
        ];
    }
    
    
    /**
     * Returns all csv variables
     *
     * @return array
     */
    protected function getVariables()
    {
        $return    = [];
        $variables = $this->csvControl->get_variables_array(2);
        
        foreach ($variables as $variableKey => $variable) {
            $group                        = substr($variable['title'], 1, strpos($variable['title'], '] ') - 1);
            $title                        = substr($variable['title'], strpos($variable['title'], '] ') + 2);
            $return[$group][$variableKey] = [
                'title'       => $title,
                'description' => $variable['description'],
            ];
        }
        
        return $return;
    }
    
    
    /**
     * Returns all product attributes for a given language
     *
     * @param IdType $languageId Language id for the additional fields
     *
     * @return array|null
     */
    protected function getAttributes(IdType $languageId)
    {
        return $this->db->select('products_options_name AS name')
            ->from('products_options')
            ->where('language_id',
                    $languageId->asInt())
            ->get()
            ->result_array();
    }
    
    
    /**
     * Returns all product properties for a given language
     *
     * @param IdType $languageId Language id for the additional fields
     *
     * @return array|null
     */
    protected function getProperties(IdType $languageId)
    {
        return $this->db->select('properties_name AS name')
            ->from('properties_description')
            ->where('language_id',
                    $languageId->asInt())
            ->get()
            ->result_array();
    }
    
    
    /**
     * Returns all additional fields for a given language
     *
     * @param IdType $languageId Language id for the additional fields
     *
     * @return array|null
     */
    protected function getAdditionalFields(IdType $languageId)
    {
        return $this->db->select('name')
            ->from('additional_field_descriptions')
            ->where('language_id',
                    $languageId->asInt())
            ->get()
            ->result_array();
    }
    
    
    /**
     * Stores the category configuration.
     *
     * @param int $schemeId
     */
    protected function storeCategoryConfiguration($schemeId)
    {
        if ($this->_getPostData('categories')) {
            $scheme = $this->csvControl->get_scheme($schemeId);
            
            if ($this->_getPostData('export_new_categories')) {
                $scheme->saveExportAllCategories(1);
            } else {
                $scheme->saveExportAllCategories(0);
            }
            
            if ($this->_getPostData('select_all_categories')) {
                $this->csvControl->save_categories($schemeId);
            } else {
                $bequeathingCategories = $this->_getPostData('bequeathing_categories');
                foreach ($bequeathingCategories as $key => $value) {
                    if (empty($value)) {
                        unset($bequeathingCategories[$key]);
                    }
                }
                
                $this->csvControl->save_categories($schemeId,
                                                   false,
                                                   $this->_getPostData('categories'),
                                                   $bequeathingCategories);
            }
        }
    }
    
    
    /**
     * Creates and returns an unique scheme name.
     *
     * If the given scheme name already exists, the scheme name will be appended with an incrementing numeric postfix
     * until it is unique.
     *
     * @param IdType             $schemeId
     * @param NonEmptyStringType $schemeName
     *
     * @return string The unique scheme name.
     */
    protected function getUniqueSchemeName(IdType $schemeId, NonEmptyStringType $schemeName)
    {
        $uniqueSchemeName = trim($schemeName->asString());
        
        $result = $this->db->select('*')->get_where('export_schemes',
                                                    [
                                                        'scheme_id !=' => $schemeId->asInt(),
                                                        'scheme_name'  => $uniqueSchemeName,
                                                        'type_id'      => self::EXPORT_GROUP_ID
                                                    ]);
        if ($result->num_rows() === 0) {
            return $uniqueSchemeName;
        }
        
        if (preg_match('/(\d+)$/', $uniqueSchemeName, $matches)) {
            $uniqueSchemeName = substr($uniqueSchemeName, 0, strlen($matches[1]) * -1) . ((int)$matches[1] + 1);
        } else {
            $uniqueSchemeName .= ' 2';
        }
        
        $result = $this->db->select('*')->get_where('export_schemes',
                                                    [
                                                        'scheme_id !=' => $schemeId->asInt(),
                                                        'scheme_name'  => $uniqueSchemeName,
                                                        'type_id'      => self::EXPORT_GROUP_ID
                                                    ]);
        if ($result->num_rows() !== 0) {
            $uniqueSchemeName = $this->getUniqueSchemeName($schemeId, new NonEmptyStringType($uniqueSchemeName));
        }
        
        return $uniqueSchemeName;
    }
    
    
    /**
     * Creates and returns an unique export filename.
     *
     * If the given export filename already exists, the scheme name will be appended with an incrementing numeric
     * postfix until it is unique.
     *
     * @param IdType             $schemeId
     * @param FilenameStringType $filename
     *
     * @return string The unique export filename.
     */
    protected function getUniqueFilename(IdType $schemeId, FilenameStringType $filename)
    {
        $uniqueFilename = trim($filename->asString());
        
        $result = $this->db->select('*')->get_where('export_schemes',
                                                    [
                                                        'scheme_id !=' => $schemeId->asInt(),
                                                        'filename'     => $uniqueFilename,
                                                        'type_id'      => self::EXPORT_GROUP_ID
                                                    ]);
        if ($result->num_rows() === 0) {
            return $uniqueFilename;
        }
        
        if (preg_match('/(.*?)(\d+)(\.[a-zA-Z]+$)/', $uniqueFilename, $matches)) {
            $uniqueFilename = $matches[1] . ((int)$matches[2] + 1) . $matches[3];
        } else {
            $fileInfo       = pathinfo($uniqueFilename);
            $uniqueFilename = $fileInfo['filename'] . '_2.' . $fileInfo['extension'];
        }
        
        $result = $this->db->select('*')->get_where('export_schemes',
                                                    [
                                                        'scheme_id !=' => $schemeId->asInt(),
                                                        'filename'     => $uniqueFilename,
                                                        'type_id'      => self::EXPORT_GROUP_ID
                                                    ]);
        if ($result->num_rows() !== 0) {
            $uniqueFilename = $this->getUniqueFilename($schemeId, new FilenameStringType($uniqueFilename));
        }
        
        return $uniqueFilename;
    }
    
    
    protected function _accountConnectionData()
    {
        return [
            'iFrameUrl' => $this->configurationStorage->get('app-url') . '#connect',
            'origin'    => HTTP_SERVER . DIR_WS_CATALOG,
            'error'     => (int)$this->_getQueryParameter('error'),
            'language'  => $_SESSION['language_code'],
        ];
    }
}
