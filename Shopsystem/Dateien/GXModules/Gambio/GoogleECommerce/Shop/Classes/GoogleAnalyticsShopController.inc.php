<?php

/* --------------------------------------------------------------
   GoogleAnalyticsShopController.inc.php 2018-04-23
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class representing the shop controller for Google Analytics
 */
class GoogleAnalyticsShopController extends HttpViewController
{
    /**
     * Return the encoded product for the add to cart action
     */
    public function actionAddToCart()
    {
        $isEnabled = GoogleAnalyticsConfigurationServiceFactory::readService()
            ->trackingEnabled(GoogleAnalyticsTracking::shoppingCart());
        
        $productId       = new IdType($this->_getPostData('id'));
        $languageId      = new IdType($_SESSION['languages_id']);
        $customerGroupId = new IdType($_SESSION['customers_status']['customers_status_id']);
        
        $quantity = str_replace(',', '.', $this->_getPostData('quantity'));
        $quantity = new DecimalType($quantity);
        
        $properties = $this->_getPostData('properties') ? : [];
        $attributes = $this->_getPostData('attributes') ? : [];
        $variant    = GoogleAnalyticsVariant::collectFromArrays($properties, $attributes);
        
        $encodedProduct = GoogleAnalyticsServiceFactory::trackingService()->encodedProductByVariant($productId,
                                                                                                    $languageId,
                                                                                                    $customerGroupId,
                                                                                                    $quantity,
                                                                                                    $variant);
        
        $data = [
            'enabled' => $isEnabled,
            'item'    => $encodedProduct
        ];
        
        return MainFactory::create(JsonHttpControllerResponse::class, $data);
    }
    
    
    /**
     * Return the encoded product for the remove from cart action
     */
    public function actionRemoveFromCart()
    {
        $isEnabled = GoogleAnalyticsConfigurationServiceFactory::readService()
            ->trackingEnabled(GoogleAnalyticsTracking::shoppingCart());
        
        $productId       = new GoogleAnalyticsCombinedProductId(new NonEmptyStringType($this->_getPostData('id')));
        $quantity        = new DecimalType($this->_getPostData('quantity'));
        $languageId      = new IdType($_SESSION['languages_id']);
        $customerGroupId = new IdType($_SESSION['customers_status']['customers_status_id']);
        $encodedProduct  = GoogleAnalyticsServiceFactory::trackingService()
            ->encodedProductByCombinedProductId($productId,
                                                $languageId,
                                                $customerGroupId,
                                                $quantity);
        
        $data = [
            'enabled' => $isEnabled,
            'item'    => $encodedProduct
        ];
        
        return MainFactory::create(JsonHttpControllerResponse::class, $data);
    }
    
    
    public function actionTrackBeginCheckout()
    {
        return MainFactory::create(JsonHttpControllerResponse::class, []);
    }
    
    
    public function actionTrackCheckoutProgress()
    {
        return MainFactory::create(JsonHttpControllerResponse::class, []);
    }
}