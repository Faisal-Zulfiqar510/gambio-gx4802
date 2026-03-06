<?php

/* --------------------------------------------------------------
   GoogleAnalyticsTrackingServiceInterface.inc.php 2018-04-23
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Interface GoogleAnalyticsTrackingServiceInterface
 *
 * @package GoogleAnalytics
 */
interface GoogleAnalyticsTrackingServiceInterface
{
    /**
     * Return the JSON encoded impressions by the product IDs
     *
     * @param IdCollection       $productIds       Product IDs.
     * @param IdType             $languageId       Language ID.
     * @param IdType             $customerStatusId Customer Status ID.
     * @param NonEmptyStringType $listName         List name.
     *
     * @return string JSON
     */
    public function encodedImpressionsByProductIds(
        IdCollection $productIds,
        IdType $languageId,
        IdType $customerStatusId,
        NonEmptyStringType $listName
    );
    
    
    /**
     * Return the JSON encoded impression by the product ID
     *
     * @param IdType             $productId        Product ID.
     * @param IdType             $languageId       Language ID.
     * @param IdType             $customerStatusId Customer status ID.
     * @param NonEmptyStringType $listName         List name.
     *
     * @return string JSON encoded impression data.
     */
    public function encodedImpressionByProductId(
        IdType $productId,
        IdType $languageId,
        IdType $customerStatusId,
        NonEmptyStringType $listName
    );
    
    
    /**
     * Return the JSON encoded product data with optional variant.
     *
     * @param IdType                          $productId        Product ID.
     * @param IdType                          $languageId       Language ID.
     * @param IdType                          $customerStatusId Customer status ID.
     * @param DecimalType                     $quantity         Item quantity.
     * @param GoogleAnalyticsVariantInterface $variant          Product variant.
     *
     * @return string JSON encoded product data.
     */
    public function encodedProductByVariant(
        IdType $productId,
        IdType $languageId,
        IdType $customerStatusId,
        DecimalType $quantity,
        GoogleAnalyticsVariantInterface $variant
    );
    
    
    /**
     * Return the JSON encoded product by the product ID
     *
     * @param IdType $productId       Product ID
     * @param IdType $languageId      Language ID
     * @param IdType $customerGroupId Customer Group ID.
     *
     * @return string JSON
     */
    public function encodedProductByProductId(IdType $productId, IdType $languageId, IdType $customerGroupId);
    
    
    /**
     * Return the JSON encoded purchase by the order ID
     *
     * @param IdType $orderId Order ID.
     *
     * @return string JSON encoded purchase data.
     */
    public function encodedPurchaseByOrderId(IdType $orderId);
    
    
    /**
     * Returns the JSON encoded product data by the given combined product id.
     *
     * @param GoogleAnalyticsCombinedProductIdInterface $productId       Combined product id.
     * @param IdType                                    $languageId      Language Id.
     * @param IdType                                    $customerGroupId Customer status ID.
     * @param DecimalType                               $quantity        Product quantity.
     *
     * @return string JSON encoded product data.
     */
    public function encodedProductByCombinedProductId(
        GoogleAnalyticsCombinedProductIdInterface $productId,
        IdType $languageId,
        IdType $customerGroupId,
        DecimalType $quantity
    );
}