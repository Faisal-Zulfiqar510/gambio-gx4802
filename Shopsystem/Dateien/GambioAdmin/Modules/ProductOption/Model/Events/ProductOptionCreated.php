<?php
/* --------------------------------------------------------------
   ProductOptionCreated.php 2021-06-22
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductOption\Model\Events;


use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\ProductOptionId;

/**
 * Class ProductOptionCreated
 * @package Gambio\Admin\Modules\ProductOption\Model\Events
 */
class ProductOptionCreated
{
    /**
     * @var ProductOptionId
     */
    private $id;
    
    
    /**
     * ProductOptionCreated constructor.
     *
     * @param ProductOptionId $id
     */
    private function __construct(ProductOptionId $id)
    {
        $this->id = $id;
    }
    
    
    /**
     * @param ProductOptionId $id
     *
     * @return ProductOptionCreated
     */
    public static function create(ProductOptionId $id): ProductOptionCreated
    {
        return new self($id);
    }
    
    
    /**
     * @return ProductOptionId
     */
    public function id(): ProductOptionId
    {
        return $this->id;
    }
}