<?php
/* --------------------------------------------------------------
   GoogleAnalyticsTrackingRepository.inc.php 2018-04-20 
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class GoogleAnalyticsTrackingRepository
 *
 * @package GoogleAnalytics
 */
class GoogleAnalyticsTrackingRepository
{
    /**
     * @var GoogleAnalyticsTrackingRepositoryReader
     */
    protected $reader;
    
    
    /**
     * GoogleAnalyticsRepository constructor.
     *
     * @param GoogleAnalyticsTrackingRepositoryReader $reader
     */
    public function __construct(GoogleAnalyticsTrackingRepositoryReader $reader)
    {
        $this->reader = $reader;
    }
    
    
    /**
     * Returns a product impression model by the provided id, language id and optional list name.
     *
     * @param IdType                  $productId       Product id.
     * @param IdType                  $languageId      Language id.
     * @param IdType                  $customerGroupId Customer group Id.
     * @param NonEmptyStringType|null $listName        (Optional) List name.
     *
     * @return GoogleAnalyticsProductImpression Product impression model.
     */
    public function fetchImpressionByProductId(
        IdType $productId,
        IdType $languageId,
        IdType $customerGroupId,
        NonEmptyStringType $listName = null
    ) {
        $impression = $this->reader->fetchImpression($productId, $languageId, $customerGroupId);
        
        return GoogleAnalyticsProductImpression::create($impression['id'],
                                                        $impression['name'],
                                                        $listName ? $listName->asString() : null,
                                                        $impression['brand'],
                                                        $impression['category'],
                                                        $impression['variant'],
                                                        $impression['listPosition'],
                                                        $impression['price']);
    }
    
    
    /**
     * Returns a product impression model by the provided product ids, language id and optional list name.
     *
     * @param IdCollection            $productIds      Product ids.
     * @param IdType                  $languageId      Language id.
     * @param IdType                  $customerGroupId Customer group Id.
     * @param NonEmptyStringType|null $listName        (Optional) List name.
     *
     * @return GoogleAnalyticsProductImpressionCollection Product impression collection.
     */
    public function fetchImpressionsByProductIds(
        IdCollection $productIds,
        IdType $languageId,
        IdType $customerGroupId,
        NonEmptyStringType $listName = null
    ) {
        $impressions = $this->reader->fetchImpressions($productIds, $languageId, $customerGroupId);
        $data        = [];
        
        foreach ($impressions as $impression) {
            $data[] = GoogleAnalyticsProductImpression::create($impression['id'],
                                                               $impression['name'],
                                                               $listName ? $listName->asString() : null,
                                                               $impression['brand'],
                                                               $impression['category'],
                                                               $impression['variant'],
                                                               $impression['listPosition'],
                                                               $impression['price']);
        }
        
        return GoogleAnalyticsProductImpressionCollection::collect($data);
    }
    
    
    /**
     * Fetches products analytics data by the given product id and variants data.
     *
     * @param IdType                          $productId       Product Id.
     * @param IdType                          $languageId      Language Id.
     * @param IdType                          $customerGroupId Customer group Id.
     * @param DecimalType                     $quantity        Products quantity.
     * @param GoogleAnalyticsVariantInterface $variant         Variants information.
     *
     * @return GoogleAnalyticsProduct Google analytics product object.
     */
    public function fetchProductByVariant(
        IdType $productId,
        IdType $languageId,
        IdType $customerGroupId,
        DecimalType $quantity,
        GoogleAnalyticsVariantInterface $variant
    ) {
        $product = $this->reader->fetchProductByVariant($productId, $languageId, $customerGroupId, $variant);
        
        return GoogleAnalyticsProduct::create($product['id'],
                                              $product['name'],
                                              $product['brand'],
                                              $product['category'],
                                              $product['variant'],
                                              $product['price'],
                                              $quantity->asDecimal());
    }
    
    
    /**
     * Fetches products analytics data by the given combined product id.
     *
     * @param GoogleAnalyticsCombinedProductIdInterface $combinedProductId  Combination of product id, including
     *                                                                      attributes and properties.
     * @param IdType                                    $customerGroupId    Customer group id.
     * @param IdType                                    $languageId         Language id.
     * @param DecimalType                               $quantity           Products quantity.
     *
     * @return GoogleAnalyticsProduct Google analytics product object.
     */
    public function fetchProductByCombinedId(
        GoogleAnalyticsCombinedProductIdInterface $combinedProductId,
        IdType $languageId,
        IdType $customerGroupId,
        DecimalType $quantity = null
    ) {
        $data = $this->reader->fetchProductByCombinedId($combinedProductId, $languageId, $customerGroupId);
        
        return GoogleAnalyticsProduct::create($data['id'],
                                              $data['name'],
                                              $data['brand'],
                                              null,
                                              $data['variant'],
                                              $data['price'],
                                              $quantity ? $quantity->asDecimal() : null);
    }
    
    
    /**
     * Fetches purchase information by the given order id.
     *
     * @param IdType $orderId Order Id.
     *
     * @return GoogleAnalyticsAction Google analytics purchase action.
     */
    public function fetchPurchaseByOrderId(IdType $orderId)
    {
        $purchase = $this->reader->fetchPurchase($orderId);
        $items    = GoogleAnalyticsProductCollection::collectFromArray($purchase['items']);
        
        return GoogleAnalyticsAction::create($purchase['transactionId'],
                                             $purchase['affiliation'],
                                             $purchase['value'],
                                             $purchase['currency'],
                                             $purchase['tax'] ? : 0.0000,
                                             $purchase['shippingCost'] ? : 0.0000,
                                             $items);
    }
}