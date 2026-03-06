<?php
/*--------------------------------------------------------------
   ProductOptionsImageListOperationPermitter.php 2021-06-23
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductOption\App;

use Gambio\Admin\Modules\ImageList\Model\ImageList;
use Gambio\Admin\Modules\ImageList\Model\ValueObjects\ImageListId;
use Gambio\Admin\Modules\ImageList\Services\ImageListOperationPermitter;
use Gambio\Admin\Modules\ProductOption\App\Data\ProductOptionReader;

/**
 * Class ProductOptionsImageListOperationPermitter
 * @package Gambio\Admin\Modules\ProductOption\App
 */
class ProductOptionsImageListOperationPermitter implements ImageListOperationPermitter
{
    
    /**
     * @var ProductOptionReader
     */
    private $reader;
    
    
    /**
     * ProductOptionsImageListOperationPermitter constructor.
     *
     * @param ProductOptionReader $reader
     */
    public function __construct(ProductOptionReader $reader)
    {
        $this->reader = $reader;
    }
    
    
    /**
     * @inheritDoc
     */
    public function permitsCreations(string ...$imageListNames): bool
    {
        return true;
    }
    
    
    /**
     * @inheritDoc
     */
    public function permitsStorages(ImageList ...$imageList): bool
    {
        return true;
    }
    
    
    /**
     * @inheritDoc
     */
    public function permitsDeletions(ImageListId ...$ids): bool
    {
        $ids = array_map(static function(ImageListId $id): int {
            return $id->value();
        }, $ids);
        
        return $this->reader->imageListsAreAssignedToAProductOption(...$ids) === false;
    }
}