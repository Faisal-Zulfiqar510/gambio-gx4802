<?php
/* --------------------------------------------------------------
   AdWordsCampaignsOverviewAjaxController.inc.php 2017-12-06
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2017 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

use GuzzleHttp\Client;

/**
 * Class AdWordsCampaignsOverviewAjaxController
 *
 * AJAX controller for the adwords campaigns main page.
 *
 * @category   System
 * @package    AdminHttpViewControllers
 * @extends    AdminHttpViewController
 */
class AdWordsCampaignsOverviewAjaxController extends AdminHttpViewController
{
    /**
     * @var array
     */
    protected $campaignData = [];
    
    /**
     * @var array
     */
    protected $sortOrderMapping = [
        '0' => 'status',
        '1' => 'name',
        '2' => 'dailyBudget',
        '3' => 'clicks',
        '4' => 'impressions',
        '5' => 'clickThroughRate',
        '6' => 'costPerClick',
        '7' => 'costs'
    ];
    
    /**
     * @var AdWordsCurl
     */
    protected $adsCurl;
    
    
    /**
     * Initialize Controller
     */
    public function init()
    {
        // Check page token validity.
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $this->_validatePageToken();
        }
        
        $httpClient = new Client();
        $storage    = MainFactory::create(GoogleConfigurationStorage::class,
                                          StaticGXCoreLoader::getDatabaseQueryBuilder());
        
        $apiClient     = MainFactory::create(GoogleServicesApiClient::class, $httpClient, $storage);
        $this->adsCurl = MainFactory::create(AdWordsCurl::class, $apiClient);
    }
    
    
    /**
     * DataTable Instance Callback
     *
     * Provides the data for the DataTables instance of the orders main view.
     */
    public function actionDataTable()
    {
        try {
            $this->_setCampaignData();
            
            $response = [
                'draw'            => (int)$_REQUEST['draw'],
                'data'            => $this->_getTableData(),
                'recordsTotal'    => count($this->campaignData['data']),
                'recordsFiltered' => count($this->campaignData['data'])
            ];
        } catch (UnexpectedValueException $ex) {
            $response = [
                'draw'            => (int)$_REQUEST['draw'],
                'data'            => [],
                'recordsTotal'    => 0,
                'recordsFiltered' => 0
            ];
        } catch (Exception $ex) {
            $response = AjaxException::response($ex);
        }
        
        return MainFactory::create('JsonHttpControllerResponse', $response);
    }
    
    
    /**
     * Update daily budget
     */
    public function actionUpdateDailyBudget()
    {
        $campaignId = new AdWordsCampaignId((int)$this->_getPostData('id'));
        $budget     = new AdWordsBudget((double)str_replace(',', '.', $this->_getPostData('dailyBudget')));
        
        $httpResponse = $this->adsCurl->updateBudget($campaignId, $budget);
        
        if ($httpResponse->getStatusCode() === 200) {
            $parsedResponseBody = json_decode($httpResponse->getBody(), true);
            
            $responseData = [
                'success' => $parsedResponseBody['successful'],
                'data'    => [
                    'dailyBudget'     => $budget->budget(),
                    'dailyBudgetHtml' => $this->_formatPrice($budget->budget())
                ]
            ];
            
            return MainFactory::create('JsonHttpControllerResponse', $responseData);
        }
        
        throw new UnexpectedValueException('Unable to update budget for campaign! Status code: '
                                           . $httpResponse->getStatusCode() . ' Response body: '
                                           . $httpResponse->getBody());
    }
    
    
    /**
     * Changes the status of an campaign.
     */
    public function actionUpdateStatus()
    {
        $campaignId = new AdWordsCampaignId($this->_getPostData('id'));
        $status     = new AdWordsCampaignStatus((bool)$this->_getPostData('status'));
        
        $this->adsCurl->changeStatus($campaignId, $status);
        
        return MainFactory::create('JsonHttpControllerResponse', ['success' => true]);
    }
    
    
    /**
     * Returns total data as a JSON response.
     *
     * @return JsonHttpControllerResponse
     */
    public function actionGetTotals()
    {
        try {
            $this->_setCampaignData();
            
            $totals = $this->campaignData['total'];
            
            $budget = ((int)$totals['budget']) / 1000000;
            $cpc    = ((int)$totals['avg.CPC']) / 1000000;
            $cost   = ((int)$totals['cost']) / 1000000;
            
            $totals['dailyBudget']      = $this->_formatPrice($budget);
            $totals['clickThroughRate'] = $totals['cTR'];
            $totals['costPerClick']     = $this->_formatPrice($cpc);
            $totals['costs']            = $this->_formatPrice($cost);
            
            $response = ['success' => true, 'data' => $totals];
        } catch (UnexpectedValueException $ex) {
            $response = ['success' => '', 'data' => []];
        } catch (Exception $ex) {
            $response = AjaxException::response($ex);
        }
        
        return MainFactory::create('JsonHttpControllerResponse', $response);
    }
    
    
    /**
     * Get the table data.
     *
     * This method will generate the data of the datatable instance. It can be overloaded in order to contain extra
     * data e.g. for a new column. The filtering of custom columns must be also done manually.
     *
     * @return array
     */
    protected function _getTableData()
    {
        $tableData = [];
        
        foreach ($this->campaignData['data'] as $campaign) {
            $budget = ((int)$campaign['budget']) / 1000000;
            $status = $campaign['campaignState'] === 'enabled';
            $cpc    = ((int)$campaign['avg.CPC']) / 1000000;
            $cost   = ((int)$campaign['cost']) / 1000000;
            
            $tableData[] = [
                'DT_RowId'         => $campaign['campaignID'],
                'DT_RowData'       => [
                    'id'          => $campaign['campaignID'],
                    'dailyBudget' => number_format($budget, 2)
                ],
                'status'           => $status,
                'name'             => $campaign['campaign'],
                'dailyBudget'      => $this->_formatPrice($budget),
                'clicks'           => $campaign['clicks'],
                'impressions'      => $campaign['impressions'],
                'clickThroughRate' => $campaign['cTR'],
                'costPerClick'     => $this->_formatPrice($cpc),
                'costs'            => $this->_formatPrice($cost)
            ];
        }
        
        $this->_sortTableData($tableData);
        
        return $tableData;
    }
    
    
    /**
     * Sort table data by REQUEST criteria
     *
     * @param array $tableData
     */
    protected function _sortTableData(array &$tableData)
    {
        if (!isset($_REQUEST['order'][0]['column'], $_REQUEST['order'][0]['dir'])) {
            return;
        }
        
        $column = $this->sortOrderMapping[$_REQUEST['order'][0]['column']];
        
        if ($_REQUEST['order'][0]['dir'] === 'asc') {
            usort($tableData,
                function ($elem1, $elem2) use ($column) {
                    if ($column === 'name') {
                        return strcmp(strtolower($elem1[$column]), strtolower($elem2[$column])) >= 0;
                    }
                    
                    $elem1[$column] = filter_var($elem1[$column], FILTER_SANITIZE_NUMBER_INT);
                    $elem2[$column] = filter_var($elem2[$column], FILTER_SANITIZE_NUMBER_INT);
                    
                    return (int)$elem1[$column] > (int)$elem2[$column];
                });
        } else {
            usort($tableData,
                function ($elem1, $elem2) use ($column) {
                    if ($column === 'name') {
                        return strcmp(strtolower($elem1[$column]), strtolower($elem2[$column])) < 0;
                    }
                    
                    $elem1[$column] = filter_var($elem1[$column], FILTER_SANITIZE_NUMBER_INT);
                    $elem2[$column] = filter_var($elem2[$column], FILTER_SANITIZE_NUMBER_INT);
                    
                    return (int)$elem1[$column] < (int)$elem2[$column];
                });
        }
    }
    
    
    /**
     * Formats a price.
     *
     * @param double $number
     * @param string $decPoint
     * @param string $thousandsSeparator
     * @param string $currency
     *
     * @return string
     */
    protected function _formatPrice($number, $decPoint = ',', $thousandsSeparator = '.', $currency = '€')
    {
        return number_format((double)$number, 2, $decPoint, $thousandsSeparator) . ' ' . $currency;
    }
    
    
    /**
     * Formats a number.
     *
     * @param double $number
     * @param int    $decimals
     * @param string $decPoint
     * @param string $thousandsSeparator
     *
     * @return string
     */
    protected function _formatNumber($number, $decimals = 2, $decPoint = ',', $thousandsSeparator = '.')
    {
        return number_format((double)$number, $decimals, $decPoint, $thousandsSeparator);
    }
    
    
    /**
     * Load campaign data from dummy json file
     */
    protected function _setCampaignData()
    {
        $dateRange    = $this->_getQueryParameter('dateRange');
        $httpResponse = $this->adsCurl->campaignsOverview($dateRange);
        
        if ($httpResponse->getStatusCode() === 200) {
            $this->campaignData = json_decode($httpResponse->getBody()->getContents(), true);
            
            return;
        }
        
        throw new UnexpectedValueException('Campaigns could not be loaded. Url: "' . $apiUrl . '".<br> Status code: '
                                           . $httpResponse->getStatusCode() . ' Response body: '
                                           . $httpResponse->getBody());
    }
}