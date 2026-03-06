<?php
/*--------------------------------------------------------------
   ProductIdentificationNumbers.php 2020-03-01
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductVariant\Model\ValueObjects;

/**
 * Class ProductIdentificationNumbers
 * @package Gambio\Admin\Modules\ProductVariant\Model\ValueObjects
 */
class ProductIdentificationNumbers
{
    /**
     * @var string
     */
    private $modelNumber;
    
    /**
     * @var string
     */
    private $ean;
    
    /**
     * @var string
     */
    private $gtin;
    
    /**
     * @var string
     */
    private $asin;
    
    
    /**
     * ProductIdentificationNumbers constructor.
     *
     * @param string $modelNumber
     * @param string $ean
     * @param string $gtin
     * @param string $asin
     */
    private function __construct(string $modelNumber, string $ean, string $gtin, string $asin)
    {
        $this->modelNumber = $modelNumber;
        $this->ean         = $ean;
        $this->gtin        = $gtin;
        $this->asin        = $asin;
    }
    
    
    /**
     * @param string $modelNumber
     * @param string $ean
     * @param string $gtin
     * @param string $asin
     *
     * @return ProductIdentificationNumbers
     */
    public static function create(
        string $modelNumber,
        string $ean,
        string $gtin,
        string $asin
    ): ProductIdentificationNumbers {
        return new self($modelNumber, $ean, $gtin, $asin);
    }
    
    
    /**
     * @return string
     */
    public function modelNumber(): string
    {
        return $this->modelNumber;
    }
    
    
    /**
     * @return string
     */
    public function ean(): string
    {
        return $this->ean;
    }
    
    
    /**
     * @return string
     */
    public function gtin(): string
    {
        return $this->gtin;
    }
    
    
    /**
     * @return string
     */
    public function asin(): string
    {
        return $this->asin;
    }
}