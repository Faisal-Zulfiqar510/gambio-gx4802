<?php
/*--------------------------------------------------------------------------------------------------
    ContentSortOrder.inc.php 2021-02-16
    Gambio GmbH
    http://www.gambio.de
    Copyright (c) 2021 Gambio GmbH
    Released under the GNU General Public License (Version 2)
    [http://www.gnu.org/licenses/gpl-2.0.html]
    --------------------------------------------------------------------------------------------------
 */


declare(strict_types=1);


class ContentSortOrder implements ContentSortOrderInterface
{
    
    /**
     * @var int
     */
    private $sortOrder;
    
    
    public function __construct(int $sortOrder = 0)
    {
        $this->sortOrder = $sortOrder;
    }
    
    
    /**
     * @inheritDoc
     */
    public function order(): int
    {
        return $this->sortOrder;
    }
}
