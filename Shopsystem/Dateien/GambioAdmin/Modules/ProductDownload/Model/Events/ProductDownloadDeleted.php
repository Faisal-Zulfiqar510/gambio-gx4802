<?php
/*--------------------------------------------------------------
   ProductDownloadDeleted.php 2021-09-01
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductDownload\Model\Events;

use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\ProductOptionId;

/**
 * Class ProductDownloadDeleted
 * @package Gambio\Admin\Modules\ProductDownload\Model\Events
 */
class ProductDownloadDeleted
{
    /**
     * @var ProductOptionId
     */
    private $id;
    
    
    /**
     * ProductDownloadDeleted constructor.
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
     * @return ProductDownloadDeleted
     */
    public static function create(ProductOptionId $id): ProductDownloadDeleted
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