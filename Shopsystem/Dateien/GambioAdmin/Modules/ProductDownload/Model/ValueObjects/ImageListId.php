<?php
/*--------------------------------------------------------------------
 ImageListId.php 2021-09-01
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
 * Class ImageListId
 * @package Gambio\Admin\Modules\ProductDownload\Model\ValueObjects
 */
class ImageListId
{
    /**
     * @var int|null
     */
    private $imageListId;
    
    
    /**
     * ImageListId constructor.
     *
     * @param int|null $imageListId
     */
    private function __construct(?int $imageListId)
    {
        $this->imageListId = $imageListId;
    }
    
    
    /**
     * @param int $id
     *
     * @return ImageListId
     */
    public static function createAsExisting(int $id): ImageListId
    {
        Assert::greaterThan($id, 0, 'The image list ID must be a positive integer. Got: %s');
        
        return new self($id);
    }
    
    
    /**
     * @return ImageListId
     */
    public static function createAsNonExistent(): ImageListId
    {
        return new self(null);
    }
    
    
    /**
     * @return int|null
     */
    public function value(): ?int
    {
        return $this->imageListId;
    }
}