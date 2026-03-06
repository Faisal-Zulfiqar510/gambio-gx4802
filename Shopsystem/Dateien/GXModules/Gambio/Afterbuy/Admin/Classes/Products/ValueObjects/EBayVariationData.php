<?php
/* --------------------------------------------------------------
   EBayVariationData.php 2022-09-20
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/
declare(strict_types=1);

namespace GXModules\Gambio\Afterbuy\Admin\Classes\Products\ValueObjects;

class EBayVariationData
{
    private string $eBayVariationName;
    
    private string $eBayVariationValue;
    
    private int    $eBayVariationPosition;
    
    private string $eBayVariationUrls;
    
    
    public function __construct(
        string $eBayVariationName,
        string $eBayVariationValue,
        int    $eBayVariationPostition = 0,
        string $eBayVariationUrls = ''
    ) {
        
        $this->eBayVariationName     = $eBayVariationName;
        $this->eBayVariationValue    = $eBayVariationValue;
        $this->eBayVariationPosition = $eBayVariationPostition;
        $this->eBayVariationUrls     = $eBayVariationUrls;
    }
    
    
    public function toArray(): array
    {
        $array = [
            'eBayVariationName'     => $this->eBayVariationName,
            'eBayVariationValue'    => $this->eBayVariationValue,
            'eBayVariationPosition' => $this->eBayVariationPosition,
            'eBayVariationUrls'     => $this->eBayVariationUrls,
        ];
        
        return $array;
    }
    
    
    /**
     * @return string
     */
    public function getEBayVariationName(): string
    {
        return $this->eBayVariationName;
    }
    
    
    /**
     * @param string $eBayVariationName
     */
    public function setEBayVariationName(string $eBayVariationName): void
    {
        $this->eBayVariationName = $eBayVariationName;
    }
    
    
    /**
     * @return string
     */
    public function getEBayVariationValue(): string
    {
        return $this->eBayVariationValue;
    }
    
    
    /**
     * @param string $eBayVariationValue
     */
    public function setEBayVariationValue(string $eBayVariationValue): void
    {
        $this->eBayVariationValue = $eBayVariationValue;
    }
    
    
    /**
     * @return int
     */
    public function getEBayVariationPosition(): int
    {
        return $this->eBayVariationPosition;
    }
    
    
    /**
     * @param int $eBayVariationPosition
     */
    public function setEBayVariationPosition(int $eBayVariationPosition): void
    {
        $this->eBayVariationPosition = $eBayVariationPosition;
    }
    
    
    /**
     * @return string
     */
    public function getEBayVariationUrls(): string
    {
        return $this->eBayVariationUrls;
    }
    
    
    /**
     * @param string $eBayVariationUrls
     */
    public function setEBayVariationUrls(string $eBayVariationUrls): void
    {
        $this->eBayVariationUrls = $eBayVariationUrls;
    }
    
    
}