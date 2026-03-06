<?php
/**
 * ImageListImageDto.php 2020-2-5
 * Last Modified: 2/5/20, 12:14 PM
 * Gambio GmbH
 * http://www.gambio.de
 * Copyright (c) 2020 Gambio GmbH
 * Released under the GNU General Public License (Version 2)
 * [http://www.gnu.org/licenses/gpl-2.0.html]
 */

namespace Gambio\ProductImageList\CreateService\Dtos;

use Gambio\ProductImageList\CreateService\Interfaces\ImageListImageDtoInterface;

class ImageListImageDto implements ImageListImageDtoInterface
{
    
    
    /**
     * @var int
     */
    private $listId;
    
    /**
     * @var string
     */
    private $localPath;
    
    
    public function __construct(int $listId, string $localPath)
    {
        $this->listId    = $listId;
        $this->localPath = $localPath;
    }
    
    
    /**
     * @inheritDoc
     */
    public function listId() : int
    {
        return $this->listId;
    }
    
    
    /**
     * @inheritDoc
     */
    public function localPath() : string
    {
        return $this->localPath;
    }
}