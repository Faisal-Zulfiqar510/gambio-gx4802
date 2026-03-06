<?php
/* --------------------------------------------------------------
   GoogleAnalyticsProductCombination.inc.php 2018-04-23
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Interface GoogleAnalyticsProductCombinationInterface
 *
 * @package GoogleAnalytics
 */
abstract class GoogleAnalyticsProductCombination implements GoogleAnalyticsProductCombinationInterface
{
    /**
     * @var int
     */
    private $optionId;
    
    /**
     * @var int
     */
    private $valueId;
    
    
    /**
     * GoogleAnalyticsProductCombination constructor.
     * Protected to enforce usage of named constructor.
     *
     * @param IdType $optionId Option id.
     * @param IdType $valueId  Value id.
     */
    protected function __construct(IdType $optionId, IdType $valueId)
    {
        $this->optionId = $optionId->asInt();
        $this->valueId  = $valueId->asInt();
    }
    
    
    /**
     * Named constructor of GoogleAnalyticsProductCombination.
     *
     * @param int $optionId Option id.
     * @param int $valueId  Value id.
     *
     * @return GoogleAnalyticsProductCombination New instance.
     */
    public static function create($optionId, $valueId)
    {
        return new static(new IdType($optionId), new IdType($valueId));
    }
    
    
    /**
     * Returns the option id of the combination.
     *
     * @return int Option id.
     */
    public function optionId()
    {
        return $this->optionId;
    }
    
    
    /**
     * Returns the value id of the combination.
     *
     * @return int Value id.
     */
    public function valueId()
    {
        return $this->valueId;
    }
}