<?php
/* --------------------------------------------------------------
   ProductImportRunnerStatus.php 2022-12-07
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/
declare(strict_types=1);

namespace GXModules\Gambio\Afterbuy\Admin\Classes\Products\ValueObjects;

class ProductImportRunnerStatus
{
    private \DateTimeInterface $since;
    private int                $lastProductId;
    private int                $currentPage;
    private int                $totalPages;
    
    
    public function __construct(\DateTimeInterface $since, int $lastProductId, int $currentPage = 0, int $totalPages = 0)
    {
    
        $this->since = $since;
        $this->lastProductId = $lastProductId;
        $this->currentPage = $currentPage;
        $this->totalPages = $totalPages;
    }
    
    
    /**
     * @return \DateTimeInterface
     */
    public function getSince(): \DateTimeInterface
    {
        return $this->since;
    }
    
    
    /**
     * @return int
     */
    public function getLastProductId(): int
    {
        return $this->lastProductId;
    }
    
    
    /**
     * @return int
     */
    public function getCurrentPage(): int
    {
        return $this->currentPage;
    }
    
    
    /**
     * @return int
     */
    public function getTotalPages(): int
    {
        return $this->totalPages;
    }
    
    
}