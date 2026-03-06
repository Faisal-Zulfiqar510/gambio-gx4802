<?php
/* --------------------------------------------------------------
 AdWordsCurl.inc.php 2017-12-11
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

use Psr\Http\Message\ResponseInterface;

/**
 * Class AdWordsCurl
 */
class AdWordsCurl
{
    /**
     * @var GoogleServicesApiClient
     */
    protected $apiClient;
    
    
    /**
     * AdWordsCurl constructor.
     *
     * @param GoogleServicesApiClient $apiClient
     */
    public function __construct(GoogleServicesApiClient $apiClient)
    {
        $this->apiClient = $apiClient;
    }
    
    
    /**
     * Sends a cURL request to the Google AdWords API to fetch campaigns of client.
     *
     * @param string|null $dateRange (Optional) Date range for request.
     *
     * @return ResponseInterface
     */
    public function campaignsOverview($dateRange = null)
    {
        $endpoint = $dateRange ? 'campaigns/' . $dateRange : 'campaigns';
        
        return $this->apiClient->clientCall($endpoint);
    }
    
    
    /**
     * Sends a cURL request to the Google AdWords API to update the budget of an AdWords campaign.
     *
     * @param AdWordsCampaignId $campaignId Id of campaign to be updated.
     * @param AdWordsBudget     $budget     New budget value for campaign.
     *
     * @return ResponseInterface
     */
    public function updateBudget(AdWordsCampaignId $campaignId, AdWordsBudget $budget)
    {
        $endpoint = 'campaigns/' . $campaignId->id() . '/updateBudget';
        
        return $this->apiClient->patchClientCall($endpoint, ['budget' => $budget->budget()]);
    }
    
    
    /**
     * Sends a cURL request to the Google AdWords API to change the status of an AdWords campaign.
     *
     * @param AdWordsCampaignId     $campaignId Id of campaign to be updated.
     * @param AdWordsCampaignStatus $status     New campaign state.
     *
     * @return ResponseInterface
     */
    public function changeStatus(AdWordsCampaignId $campaignId, AdWordsCampaignStatus $status)
    {
        $endpoint = 'campaigns/' . $campaignId->id() . '/changeStatus';
        
        return $this->apiClient->patchClientCall($endpoint, ['status' => $status->active()]);
    }
}