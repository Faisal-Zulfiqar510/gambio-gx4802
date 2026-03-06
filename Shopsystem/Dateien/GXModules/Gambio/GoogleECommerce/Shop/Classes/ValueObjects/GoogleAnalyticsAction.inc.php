<?php
/* --------------------------------------------------------------
   GoogleAnalyticsAction.inc.php 2018-04-19
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class GoogleAnalyticsAction
 *
 * @package GoogleAnalytics
 */
class GoogleAnalyticsAction implements GoogleAnalyticsActionInterface
{
    /**
     * @var string
     */
    protected $transactionId;
    
    /**
     * @var string
     */
    protected $affiliation;
    
    /**
     * @var float
     */
    protected $value;
    
    /**
     * @var string
     */
    protected $currency;
    
    /**
     * @var float
     */
    protected $tax;
    
    /**
     * @var float
     */
    protected $shippingCost;
    
    /**
     * @var GoogleAnalyticsProductCollection
     */
    protected $items;
    
    
    /**
     * GoogleAnalyticsAction constructor.
     * Protected to enforce usage of named constructor.
     *
     * @param NonEmptyStringType               $transactionId Unique ID for the transaction.
     * @param NonEmptyStringType               $affiliation   The store from which this transaction occurred.
     * @param DecimalType                      $value         Value (i.e. revenue) associated with the event.
     * @param CurrencyCode                     $currency      Currency value (i.e. USD or EUR).
     * @param DecimalType                      $tax           Tax amount.
     * @param DecimalType                      $shippingCost  Shipping cost.
     * @param GoogleAnalyticsProductCollection $items         The associated products.
     */
    protected function __construct(
        NonEmptyStringType $transactionId,
        NonEmptyStringType $affiliation,
        DecimalType $value,
        CurrencyCode $currency,
        DecimalType $tax,
        DecimalType $shippingCost,
        GoogleAnalyticsProductCollection $items
    ) {
        $this->transactionId = $transactionId->asString();
        $this->affiliation   = $affiliation->asString();
        $this->value         = $value->asDecimal();
        $this->currency      = $currency->getCode();
        $this->tax           = $tax->asDecimal();
        $this->shippingCost  = $shippingCost->asDecimal();
        $this->items         = $items;
    }
    
    
    /**
     * Named constructor of GoogleAnalyticsAction.
     *
     * @param string                           $transactionId Unique ID for the transaction.
     * @param string                           $affiliation   The affiliation from which this transaction occurred.
     * @param float                            $value         Value (i.e. revenue) associated with the event.
     * @param string                           $currency      Currency value (i.e. USD or EUR).
     * @param float                            $tax           Tax amount.
     * @param float                            $shippingCost  Shipping cost.
     * @param GoogleAnalyticsProductCollection $items         The associated products.
     *
     * @return GoogleAnalyticsAction New instance.
     */
    public static function create(
        $transactionId,
        $affiliation,
        $value,
        $currency,
        $tax,
        $shippingCost,
        GoogleAnalyticsProductCollection $items
    ) {
        $transactionId = new NonEmptyStringType($transactionId);
        $affiliation   = new NonEmptyStringType($affiliation);
        $value         = new DecimalType($value);
        $currency      = new CurrencyCode(new StringType($currency));
        $tax           = new DecimalType($tax);
        $shippingCost  = new DecimalType($shippingCost);
        
        return new static($transactionId, $affiliation, $value, $currency, $tax, $shippingCost, $items);
    }
    
    
    /**
     * Returns the Unique ID for the transaction.
     *
     * @return string Unique ID for the transaction.
     */
    public function transactionId()
    {
        return $this->transactionId;
    }
    
    
    /**
     * Returns the store or affiliation from which this transaction occurred.
     *
     * @return string The store or affiliation from which this transaction occurred.
     */
    public function affiliation()
    {
        return $this->affiliation;
    }
    
    
    /**
     * Returns the value associated with the event.
     *
     * @return float Value (i.e. revenue) associated with the event.
     */
    public function value()
    {
        return $this->value;
    }
    
    
    /**
     * Returns the currency value.
     *
     * @return string Currency value (i.e. USD or EUR).
     */
    public function currency()
    {
        return $this->currency;
    }
    
    
    /**
     * Returns the tax amount.
     *
     * @return float Tax amount.
     */
    public function tax()
    {
        return $this->tax;
    }
    
    
    /**
     * Returns the shipping cost.
     *
     * @return float Shipping cost.
     */
    public function shippingCost()
    {
        return $this->shippingCost;
    }
    
    
    /**
     * Returns the associated products.
     *
     * @return GoogleAnalyticsProductCollection The associated products.
     */
    public function items()
    {
        return $this->items;
    }
}