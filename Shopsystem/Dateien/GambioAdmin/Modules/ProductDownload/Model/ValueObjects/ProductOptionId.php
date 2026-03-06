<?php
/*--------------------------------------------------------------------
 ProductOptionId.php 2021-09-01
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductDownload\Model\ValueObjects;

use Webmozart\Assert\Assert;

/**
 * Class ProductOptionId
 * @package Gambio\Admin\Modules\ProductDownload\Model\ValueObjects
 */
class ProductOptionId
{
    /**
     * @var int
     */
    private $id;
    
    
    /**
     * ProductOptionId constructor.
     *
     * @param int $productOptionId
     */
    private function __construct(int $productOptionId)
    {
        $this->id = $productOptionId;
    }
    
    
    /**
     * @param int $productOptionId
     *
     * @return ProductOptionId
     */
    public static function create(int $productOptionId): ProductOptionId
    {
        Assert::greaterThan($productOptionId, 0, 'The product option ID must be a positive integer. Got: %s');
        
        return new self($productOptionId);
    }
    
    /**
     * @return int
     */
    public function value(): int
    {
        return $this->id;
    }
}