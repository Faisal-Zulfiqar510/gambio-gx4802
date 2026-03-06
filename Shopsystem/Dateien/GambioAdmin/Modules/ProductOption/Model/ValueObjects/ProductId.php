<?php
/*--------------------------------------------------------------------
 ProductId.php 2021-04-09
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductOption\Model\ValueObjects;

use Webmozart\Assert\Assert;

/**
 * Class ProductId
 * @package Gambio\Admin\Modules\ProductOption\Model\ValueObjects
 */
class ProductId
{
    /**
     * @var int
     */
    protected $productId;
    
    
    /**
     * ProductId constructor.
     *
     * @param int $productId
     */
    private function __construct(int $productId)
    {
        $this->productId = $productId;
    }
    
    
    /**
     * @param int $productId
     *
     * @return ProductId
     */
    public static function create(int $productId): ProductId
    {
        Assert::greaterThan($productId, 0, 'The product ID must be a positive integer. Got: %s');
        
        return new self($productId);
    }
    
    
    /**
     * @return int
     */
    public function value(): int
    {
        return $this->productId;
    }
}