<?php
/*--------------------------------------------------------------
   ProductDownloadsImageListOperationPermitter.php 2021-09-01
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductDownload\App;

use Gambio\Admin\Modules\ImageList\Model\ImageList;
use Gambio\Admin\Modules\ImageList\Model\ValueObjects\ImageListId;
use Gambio\Admin\Modules\ImageList\Services\ImageListOperationPermitter;
use Gambio\Admin\Modules\ProductDownload\App\Data\ProductDownloadReader;

/**
 * Class ProductDownloadsImageListOperationPermitter
 * @package Gambio\Admin\Modules\ProductDownload\App
 */
class ProductDownloadsImageListOperationPermitter implements ImageListOperationPermitter
{
    
    /**
     * @var ProductDownloadReader
     */
    private $reader;
    
    
    /**
     * ProductDownloadsImageListOperationPermitter constructor.
     *
     * @param ProductDownloadReader $reader
     */
    public function __construct(ProductDownloadReader $reader)
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