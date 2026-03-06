<?php
/* --------------------------------------------------------------
   GoogleAnalyticsTrackingRepositoryReaderInterface.inc.php 2018-05-02 
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Interface GoogleAnalyticsTrackingRepositoryReaderInterface
 *
 * @package GoogleAnalytics
 */
interface GoogleAnalyticsTrackingRepositoryReaderInterface
{
    /**
     * Fetches impression data by the given product id.
     *
     * @param IdType $productId       Product id.
     * @param IdType $languageId      Language id.
     * @param IdType $customerGroupId Customer group id.
     *
     * @return array Data that contains impression information.
     */
    public function fetchImpression(
        IdType $productId,
        IdType $languageId,
        IdType $customerGroupId
    );
    
    
    /**
     * Fetches impressions data by the given product ids.
     *
     * @param IdCollection $productIds      Product ids.
     * @param IdType       $languageId      Language id.
     * @param IdType       $customerGroupId Customer group id.
     *
     * @return array Data that contains impressions information.
     */
    public function fetchImpressions(
        IdCollection $productIds,
        IdType $languageId,
        IdType $customerGroupId
    );
    
    
    /**
     * Fetches product data by the given product id and optional variants.
     *
     * @param IdType                          $productId       Product Id.
     * @param IdType                          $languageId      Language Id.
     * @param IdType                          $customerGroupId Customer group Id.
     * @param GoogleAnalyticsVariantInterface $variant         Variants data if exists.
     *
     * @return array Data that contains product information.
     */
    public function fetchProductByVariant(
        IdType $productId,
        IdType $languageId,
        IdType $customerGroupId,
        GoogleAnalyticsVariantInterface $variant
    );
    
    
    /**
     * Fetches product data by the given combined product id.
     *
     * @param GoogleAnalyticsCombinedProductIdInterface $combinedProductId  Id combination of product, attribute and
     *                                                                      property combination ids.
     * @param IdType                                    $languageId         Language Id.
     * @param IdType                                    $customerGroupId    Customer group Id.
     *
     * @return array Data that contains product information.
     */
    public function fetchProductByCombinedId(
        GoogleAnalyticsCombinedProductIdInterface $combinedProductId,
        IdType $languageId,
        IdType $customerGroupId
    );
    
    
    /**
     * Fetches purchase data by the given order id.
     *
     * @param IdType $orderId Order Id.
     *
     * @return array Data that contains purchase information.
     */
    public function fetchPurchase(IdType $orderId);
}
