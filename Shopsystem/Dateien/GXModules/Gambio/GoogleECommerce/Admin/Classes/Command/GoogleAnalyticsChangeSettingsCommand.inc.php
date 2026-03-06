<?php
/* --------------------------------------------------------------
   GoogleAnalyticsChangeSettingsCommand.inc.php 2018-04-16
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class GoogleAnalyticsChangeSettingsCommand
 *
 * @package GoogleAnalytics
 */
class GoogleAnalyticsChangeSettingsCommand
{
    /**
     * @var KeyValueCollection
     */
    private $postData;
    
    
    /**
     * GoogleAnalyticsChangeSettingsCommand constructor.
     *
     * @param KeyValueCollection $postData
     */
    public function __construct(KeyValueCollection $postData)
    {
        $this->postData = $postData;
    }
    
    
    /**
     * Validates the command.
     * If invalid data was provided, the method will return false and set the 'ga_config_error' session key.
     *
     * @param LanguageTextManager $languageTextManager Text manager for language specific error messages.
     *
     * @return bool True if data is valid.
     */
    public function validate(LanguageTextManager $languageTextManager)
    {
        if (!(new GoogleConfigurationStorage(StaticGXCoreLoader::getDatabaseQueryBuilder(),
                                             GoogleConfigurationStorage::SCOPE_GENERAL))->get('connection-status')) {
            $_SESSION['ga_config_error'] = $languageTextManager->get_text('not_connected_error', 'google_analytics');
            
            return false;
        }
        
        try {
            $this->uaTrackingCode();
            $this->bestsellerBoxName();
            $this->specialsBoxName();
            $this->whatsNewBoxName();
            $this->bestsellerListName();
            $this->specialsListName();
            $this->whatsNewListName();
            $this->newProductsListName();
            $this->availableSoonListName();
        } catch (InvalidUaTrackingCodeFormatException $e) {
            $_SESSION['ga_config_error'] = $languageTextManager->get_text('invalid_ua_tracking_code_error',
                                                                          'google_analytics');
            
            return false;
        } catch (Exception $e) {
            
            $_SESSION['ga_config_error'] = $languageTextManager->get_text('invalid_names_error', 'google_analytics');
            
            return false;
        }
        
        return true;
    }
    
    
    /**
     * Returns the ua tracking code.
     *
     * @return GoogleAnalyticsUaTrackingCode|null Ua tracking code instance or null, if post data is empty.
     */
    public function uaTrackingCode()
    {
        $uaTrackingCode = $this->postData->getValue('ua_tracking_code');
        if ($uaTrackingCode === '') {
            return null;
        }
        
        return GoogleAnalyticsUaTrackingCode::create($uaTrackingCode);
    }
    
    
    /**
     * Returns true if google analytics should be enabled.
     *
     * @return bool True if google analytics should be enabled.
     */
    public function enableGoogleAnalytics()
    {
        return $this->postData->keyExists('enabled');
    }
    
    
    /**
     * Returns true the if ip anonymization is enabled.
     *
     * @return bool True if ip anonymization is enabled.
     */
    public function enableIpAnonymization()
    {
        return $this->postData->keyExists('anonymize_ip');
    }
    
    
    /**
     * Returns true prices should be tracked as net and false if they should be tracked as gross.
     *
     * @return bool True if prices should be tracked as net and false if they should be tracked as gross.
     */
    public function enableNetPriceTracking()
    {
        return $this->postData->keyExists('price_net');
    }
    
    
    /**
     * Returns true if box impression tracking should be enabled.
     *
     * @return bool True if box impression tracking should be enabled.
     */
    public function enableBoxImpression()
    {
        return $this->postData->keyExists('box_impression');
    }
    
    
    /**
     * Returns true if list impression tracking should be enabled.
     *
     * @return bool True if list impression tracking should be enabled.
     */
    public function enableListImpression()
    {
        return $this->postData->keyExists('list_impression');
    }
    
    
    /**
     * Returns true if product click tracking should be enabled.
     *
     * @return bool True if product click tracking should be enabled.
     */
    public function enableProductClick()
    {
        return $this->postData->keyExists('product_click');
    }
    
    
    /**
     * Returns true if product details tracking should be enabled.
     *
     * @return bool True if product details tracking should be enabled.
     */
    public function enableProductDetails()
    {
        return $this->postData->keyExists('product_details');
    }
    
    
    /**
     * Returns true if shopping cart tracking should be enabled.
     *
     * @return bool True if shopping cart tracking should be enabled.
     */
    public function enableShoppingCart()
    {
        return $this->postData->keyExists('shopping_cart');
    }
    
    
    /**
     * Returns true if checkout tracking should be enabled.
     *
     * @return bool True if checkout tracking should be enabled.
     */
    public function enableCheckout()
    {
        return $this->postData->keyExists('checkout');
    }
    
    
    /**
     * Returns the name of the bestseller box.
     *
     * @return NonEmptyStringType Name of bestseller box.
     */
    public function bestsellerBoxName()
    {
        return new NonEmptyStringType($this->postData->getValue('bestseller_box_configuration'));
    }
    
    
    /**
     * Returns the name of the specials box.
     *
     * @return NonEmptyStringType Name of specials box.
     */
    public function specialsBoxName()
    {
        return new NonEmptyStringType($this->postData->getValue('specials_box_configuration'));
    }
    
    
    /**
     * Returns the name of the whats new box.
     *
     * @return NonEmptyStringType Name of whats new box.
     */
    public function whatsNewBoxName()
    {
        return new NonEmptyStringType($this->postData->getValue('whats_new_box_configuration'));
    }
    
    
    /**
     * Returns the name of the bestseller list.
     *
     * @return NonEmptyStringType Name of bestseller list.
     */
    public function bestsellerListName()
    {
        return new NonEmptyStringType($this->postData->getValue('bestseller_list_configuration'));
    }
    
    
    /**
     * Returns the name of the specials list.
     *
     * @return NonEmptyStringType Name of specials list.
     */
    public function specialsListName()
    {
        return new NonEmptyStringType($this->postData->getValue('specials_list_configuration'));
    }
    
    
    /**
     * Returns the name of the whats new list.
     *
     * @return NonEmptyStringType Name of whats new list.
     */
    public function newProductsListName()
    {
        return new NonEmptyStringType($this->postData->getValue('new_products_list_configuration'));
    }
    
    
    /**
     * Returns the name of the whats new list.
     *
     * @return NonEmptyStringType Name of whats new list.
     */
    public function whatsNewListName()
    {
        return new NonEmptyStringType($this->postData->getValue('whats_new_list_configuration'));
    }
    
    
    /**
     * Returns the name of the available soon list.
     *
     * @return NonEmptyStringType Name of available soon list.
     */
    public function availableSoonListName()
    {
        return new NonEmptyStringType($this->postData->getValue('available_soon_list_configuration'));
    }
    
    
    /**
     * Returns the name of the top products list.
     *
     * @return NonEmptyStringType Name of top products list.
     */
    public function topProductsListName()
    {
        return new NonEmptyStringType($this->postData->getValue('top_products_list_configuration'));
    }
    
    
    /**
     * Returns true if the analytics dev mode should be enabled.
     *
     * @return bool
     */
    public function enableDevMode()
    {
        return $this->postData->keyExists('dev_mode_advanced_configuration');
    }
}