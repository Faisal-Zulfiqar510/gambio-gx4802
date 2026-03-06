<?php
/* --------------------------------------------------------------
   ProductPreparedForImport.php 2023-01-25
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2023 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/
declare(strict_types=1);


namespace GXModules\Gambio\Afterbuy\Admin\Classes\Products\Events;

use GXEngineProduct;
use GXModules\Gambio\Afterbuy\Admin\Classes\Products\ValueObjects\AfterbuyProduct;

class ProductPreparedForImport
{
    private GXEngineProduct $product;
    private AfterbuyProduct $afterbuyProduct;
    
    
    private function __construct(GXEngineProduct $product, AfterbuyProduct $afterbuyProduct)
    {
        $this->product = $product;
        $this->afterbuyProduct = $afterbuyProduct;
    }
    
    public static function create(GXEngineProduct $product, AfterbuyProduct $afterbuyProduct)
    {
        return new static($product, $afterbuyProduct);
    }
    
    public function gxEngineProduct(): GXEngineProduct
    {
        return $this->product;
    }
    
    public function afterbuyProduct(): AfterbuyProduct
    {
        return $this->afterbuyProduct;
    }
}
