<?php

/* --------------------------------------------------------------
   GoogleAnalyticsTrackingService.inc.php 2018-04-19
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class GoogleAnalyticsTrackingService
 *
 * @package GoogleAnalytics
 */
class GoogleAnalyticsTrackingService implements GoogleAnalyticsTrackingServiceInterface
{
    private $repository;
    
    private $serializers;
    
    
    public function __construct(GoogleAnalyticsTrackingRepository $repository, GoogleAnalyticsSerializers $serializers)
    {
        $this->repository  = $repository;
        $this->serializers = $serializers;
    }
    
    
    /**
     * Return the JSON encoded impressions by the product IDs
     *
     * @param IdCollection       $productIds       Product IDs
     * @param IdType             $languageId       Language ID
     * @param IdType             $customerStatusId Customer Status ID.
     * @param NonEmptyStringType $listName         List name
     *
     * @return string JSON
     */
    public function encodedImpressionsByProductIds(
        IdCollection $productIds,
        IdType $languageId,
        IdType $customerStatusId,
        NonEmptyStringType $listName
    ) {
        $serializer = $this->serializers->impressionCollectionSerializer();
        
        return $serializer->encode($this->repository->fetchImpressionsByProductIds($productIds,
                                                                                   $languageId,
                                                                                   $customerStatusId,
                                                                                   $listName));
    }
    
    
    /**
     * Return the JSON encoded purchase by the order ID
     *
     * @param IdType $orderId Order ID
     *
     * @return string JSON
     */
    public function encodedPurchaseByOrderId(IdType $orderId)
    {
        $serializer = $this->serializers->actionSerializer();
        
        return $serializer->encode($this->repository->fetchPurchaseByOrderId($orderId));
    }
    
    
    /**
     * Return the JSON encoded impression by the product ID
     *
     * @param IdType             $productId        Product ID
     * @param IdType             $languageId       Language ID
     * @param IdType             $customerStatusId Customer status ID.
     * @param NonEmptyStringType $listName         List name
     *
     * @return string JSON
     */
    public function encodedImpressionByProductId(
        IdType $productId,
        IdType $languageId,
        IdType $customerStatusId,
        NonEmptyStringType $listName
    ) {
        $serializer = $this->serializers->impressionSerializer();
        
        return $serializer->encode($this->repository->fetchImpressionByProductId($productId,
                                                                                 $languageId,
                                                                                 $customerStatusId,
                                                                                 $listName));
    }
    
    
    /**
     * Return the JSON encoded product data with optional variant.
     *
     * @param IdType                          $productId        Product ID
     * @param IdType                          $languageId       Language ID
     * @param IdType                          $customerStatusId Customer status ID.
     * @param DecimalType                     $quantity         Item quantity.
     * @param GoogleAnalyticsVariantInterface $variant          Product variant
     *
     * @return string JSON
     */
    public function encodedProductByVariant(
        IdType $productId,
        IdType $languageId,
        IdType $customerStatusId,
        DecimalType $quantity,
        GoogleAnalyticsVariantInterface $variant
    ) {
        $serializer = $this->serializers->productSerializer();
        
        return $serializer->encode($this->repository->fetchProductByVariant($productId,
                                                                            $languageId,
                                                                            $customerStatusId,
                                                                            $quantity,
                                                                            $variant));
    }
    
    
    /**
     * Return the JSON encoded product by the product ID
     *
     * @param IdType $productId       Product ID
     * @param IdType $languageId      Language ID
     * @param IdType $customerGroupId Customer Group ID.
     *
     * @return string JSON
     */
    public function encodedProductByProductId(IdType $productId, IdType $languageId, IdType $customerGroupId)
    {
        $serializer = $this->serializers->productSerializer();
        $combinedId = GoogleAnalyticsCombinedProductId::create((string)$productId->asInt());
        
        return $serializer->encode($this->repository->fetchProductByCombinedId($combinedId,
                                                                               $languageId,
                                                                               $customerGroupId));
    }
    
    
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
    ) {
        $serializer = $this->serializers->productSerializer();
        
        return $serializer->encode($this->repository->fetchProductByCombinedId($productId,
                                                                               $languageId,
                                                                               $customerGroupId,
                                                                               $quantity));
    }
}