<?php
/* --------------------------------------------------------------
   GoogleShoppingAjaxController.inc.php 2021-07-20
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class GoogleShoppingAjaxController
 *
 * Ajax controller for Google Shopping
 *
 * @category   System
 * @package    AdminHttpViewControllers
 * @extends    AdminHttpViewController
 */
class GoogleShoppingAjaxController extends AdminHttpViewController
{
    /**
     * @var CSVControl
     */
    protected $csvControl;
    
    /**
     * @var LanguageTextManager
     */
    protected $languageTextManager;
    
    /**
     * @var CI_DB_query_builder
     */
    protected $db;
    
    /**
     * @var GoogleConfigurationStorage
     */
    protected $configurationStorage;
    
    
    /**
     * GoogleShoppingAjaxController constructor.
     *
     * @param HttpContextReaderInterface     $httpContextReader
     * @param HttpResponseProcessorInterface $httpResponseProcessor
     * @param ContentViewInterface           $defaultContentView
     */
    public function __construct(
        HttpContextReaderInterface $httpContextReader,
        HttpResponseProcessorInterface $httpResponseProcessor,
        ContentViewInterface $defaultContentView
    ) {
        parent::__construct($httpContextReader, $httpResponseProcessor, $defaultContentView);
        
        $this->csvControl           = CSVControl::get_instance();
        $this->languageTextManager  = MainFactory::create('LanguageTextManager',
                                                          'google_shopping',
                                                          $_SESSION['languages_id']);
        $this->db                   = StaticGXCoreLoader::getDatabaseQueryBuilder();
        $this->configurationStorage = new GoogleConfigurationStorage($this->db,
                                                                     GoogleConfigurationStorage::SCOPE_GENERAL);
        
        $this->csvControl->setExportTimeout(1);
        $this->csvControl->setLimitRowCount(100);
    }
    
    
    /**
     * Deletes a scheme by schemeId from POST data.
     *
     * @return JsonHttpControllerResponse
     */
    public function actionDeleteScheme()
    {
        $success  = false;
        $schemeId = (int)$this->_getPostData('schemeId');
        
        if (!empty($schemeId)) {
            $this->csvControl->delete_scheme($schemeId);
            $success = true;
        }
        
        return MainFactory::create('JsonHttpControllerResponse', ['success' => $success]);
    }
    
    
    /**
     * Deletes a scheme field by schemeId and fieldId from POST data.
     *
     * @return JsonHttpControllerResponse
     */
    public function actionDeleteSchemeField()
    {
        $success  = false;
        $schemeId = (int)$this->_getPostData('schemeId');
        $fieldId  = (int)$this->_getPostData('fieldId');
        
        if (!empty($fieldId)) {
            $this->csvControl->delete_fields_by_fields_array($schemeId, [$fieldId], $invert = true);
            $success = true;
        }
        
        return MainFactory::create('JsonHttpControllerResponse', ['success' => $success]);
    }
    
    
    /**
     * Saves scheme fields sort order.
     *
     * @return JsonHttpControllerResponse
     */
    public function actionSaveSchemeFieldsSorting()
    {
        $success            = true;
        $schemeFieldSorting = $this->_getPostData('sorting');
        
        foreach ($schemeFieldSorting as $key => $fieldId) {
            $fieldData = [
                'field_id'   => (int)$fieldId,
                'sort_order' => $key + 1
            ];
            $success   &= (bool)$this->csvControl->save_field($fieldData);
        }
        
        return MainFactory::create('JsonHttpControllerResponse', ['success' => (bool)$success]);
    }
    
    
    /**
     * Downloads a scheme export file identified by its scheme ID.
     *
     * @return JsonHttpControllerResponse if error occurs, otherwise download of file starts
     */
    public function actionDownloadSchemeExport()
    {
        if ($this->configurationStorage->get('connection-status')) {
            $schemeId = (int)$this->_getQueryParameter('schemeId');
            
            if (empty($schemeId)) {
                return MainFactory::create('JsonHttpControllerResponse',
                                           ['success' => false, 'error' => 'schemeId GET-parameter is missing']);
            }
            
            $scheme = $this->csvControl->get_scheme((int)$this->_getQueryParameter('schemeId'));
            
            if ($scheme === null) {
                return MainFactory::create('JsonHttpControllerResponse',
                                           [
                                               'success' => false,
                                               'error'   => "'scheme with ID $schemeId does not exist"
                                           ]);
            }
            
            $filename = basename($scheme->v_data_array['filename']);
            $filepath = DIR_FS_CATALOG . 'export/' . $filename;
            
            if (!file_exists($filepath) || !is_readable($filepath)) {
                return MainFactory::create('JsonHttpControllerResponse',
                                           ['success' => false, 'error' => 'no export file']);
            }
            
            xtc_session_close();
            
            header("Content-Type: application/force-download");
            header("Content-Type: application/octet-stream");
            header('Content-Disposition: attachment; filename="' . $filename . '"');
            header("Content-Transfer-Encoding: binary");
            header('Expires: 0');
            header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
            header('Pragma: public');
            header('Content-Length: ' . filesize($filepath));
            echo file_get_contents($filepath);
            exit(0);
        }
        
        return MainFactory::create('JsonHttpControllerResponse',
                                   ['success' => false, 'error' => 'no google shopping connection']);
    }
    
    
    /**
     * Exports a scheme by schemeId from POST data.
     *
     * @return JsonHttpControllerResponse
     */
    public function actionRunExport()
    {
        $schemeId = (int)$this->_getPostData('schemeId');
        $response = [
            'success'   => true,
            'error'     => '',
            'repeat'    => false,
            'progress'  => 0,
            'scheme_id' => $schemeId,
        ];
        
        if (!$this->configurationStorage->get('connection-status')) {
            $response['success'] = false;
            $response['error']   = $this->languageTextManager->get_text('error_no_connection_with_google');
        } elseif (!is_numeric($schemeId) || (int)$schemeId <= 0) {
            $response['success'] = false;
            $response['error']   = $this->languageTextManager->get_text('error_invalid_scheme_id');
        } else {
            $response['repeat'] = $this->csvControl->export($schemeId);
            
            $csvSource    = MainFactory::create_object('CSVSource', [], true);
            $exportStatus = $csvSource->get_export_status($schemeId);
            if ($exportStatus['offset'] > 0) {
                $progress = (int)(($exportStatus['offset'] / $exportStatus['products_count']) * 100);
                if ($progress > 100) {
                    $progress = 100;
                }
                if ($progress < 1) {
                    $progress = 1;
                }
            }
            
            $response['progress'] = $progress;
        }
        
        return MainFactory::create('JsonHttpControllerResponse', $response);
    }
    
    
    /**
     * Returns html of a subcategories tree in a JSON response.
     *
     * @return JsonHttpControllerResponse
     */
    public function actionGetSubcategories()
    {
        $schemeId = (int)$this->_getQueryParameter('schemeId');
        
        if (empty($schemeId)) {
            return MainFactory::create('JsonHttpControllerResponse',
                                       ['success' => false, 'error' => 'schemeId GET-parameter is missing']);
        }
        
        $categoryId = (int)$this->_getQueryParameter('categoryId');
        
        if (empty($categoryId)) {
            return MainFactory::create('JsonHttpControllerResponse',
                                       ['success' => false, 'error' => 'categoryId GET-parameter is missing']);
        }
        
        $categories = $this->csvControl->get_child_categories($schemeId, $categoryId, true);
        
        $contentView = MainFactory::create('ContentView');
        $contentView->set_escape_html(true);
        $contentView->set_flat_assigns(true);
        $contentView->set_template_dir(DIR_FS_CATALOG . 'GXModules/Gambio/GoogleShopping/Admin/Html/');
        $contentView->set_content_template('configuration/child_categories.html');
        
        $contentView->set_content_data('categories', $categories);
        
        return MainFactory::create('JsonHttpControllerResponse',
                                   ['success' => true, 'html' => $contentView->build_html()]);
    }
    
    
    /**
     * Returns the field data by a given field id in a JSON response.
     *
     * @return JsonHttpControllerResponse
     */
    public function actionGetSchemeFieldData()
    {
        $fieldId = (int)$this->_getQueryParameter('fieldId');
        
        if (empty($fieldId) || $fieldId <= 0) {
            return MainFactory::create('JsonHttpControllerResponse',
                                       ['success' => false, 'error' => 'fieldId GET-parameter is missing or invalid']);
        }
        
        $fieldData = $this->db->select('*')
            ->from('export_scheme_fields')
            ->where('field_id', $fieldId)
            ->get()
            ->row_array();
        
        return MainFactory::create('JsonHttpControllerResponse', ['success' => true, 'data' => $fieldData]);
    }
    
    
    /**
     * Updates the status of a scheme field by its fieldId and newSatus value from POST data.
     *
     * @return JsonHttpControllerResponse
     */
    public function actionSetSchemeFieldStatus()
    {
        $fieldId   = (int)$this->_getPostData('fieldId');
        $newStatus = $this->_getPostData('newStatus');
        
        if (empty($fieldId) || $fieldId <= 0) {
            return MainFactory::create('JsonHttpControllerResponse',
                                       ['success' => false, 'error' => 'fieldId POST-parameter is missing or invalid']);
        }
        
        $this->csvControl->save_field([
                                          'field_id' => $fieldId,
                                          'status'   => $newStatus,
                                      ]);
        
        return MainFactory::create('JsonHttpControllerResponse', ['success' => true]);
    }
    
    
    /**
     * Updates the data of a scheme field from POST data.
     *
     * @return JsonHttpControllerResponse
     */
    public function actionStoreSchemeField()
    {
        $schemeId     = (int)$this->_getPostData('schemeId');
        $fieldId      = (int)$this->_getPostData('fieldId');
        $fieldName    = $this->_getPostData('fieldName');
        $fieldValue   = $this->_getPostData('fieldValue');
        $fieldDefault = $this->_getPostData('fieldDefault');
        
        if (empty($schemeId) || $schemeId <= 0) {
            return MainFactory::create('JsonHttpControllerResponse',
                                       [
                                           'success' => false,
                                           'error'   => 'schemeId POST-parameter is missing or invalid'
                                       ]);
        }
        
        if (empty($fieldId) || $fieldId <= 0) {
            $maxSortOrder = $this->db->select_max('sort_order')
                ->from('export_scheme_fields')
                ->where('scheme_id',
                        $schemeId)
                ->get()
                ->row_array();
            
            $fieldId = $this->csvControl->save_field([
                                                         'scheme_id'             => $schemeId,
                                                         'field_name'            => $fieldName,
                                                         'field_content'         => $fieldValue,
                                                         'field_content_default' => $fieldDefault,
                                                         'sort_order'            => $maxSortOrder['sort_order'] + 1,
                                                     ]);
        }
        
        $fieldId = $this->csvControl->save_field([
                                                     'scheme_id'             => $schemeId,
                                                     'field_id'              => $fieldId,
                                                     'field_name'            => $fieldName,
                                                     'field_content'         => $fieldValue,
                                                     'field_content_default' => $fieldDefault,
                                                 ]);
        
        return MainFactory::create('JsonHttpControllerResponse', ['success' => true, 'fieldId' => $fieldId]);
    }
    
    
    /**
     * Clears the cache and temporary data of an exported scheme.
     *
     * @return JsonHttpControllerResponse
     */
    public function actionClearExport()
    {
        $success  = false;
        $schemeId = (int)$this->_getPostData('schemeId');
        
        if (empty($schemeId)) {
            return MainFactory::create('JsonHttpControllerResponse',
                                       ['success' => false, 'error' => 'schemeId GET-parameter is missing']);
        }
        
        $this->csvControl->clean_export($schemeId);
        
        return MainFactory::create('JsonHttpControllerResponse', ['success' => $success]);
    }
}