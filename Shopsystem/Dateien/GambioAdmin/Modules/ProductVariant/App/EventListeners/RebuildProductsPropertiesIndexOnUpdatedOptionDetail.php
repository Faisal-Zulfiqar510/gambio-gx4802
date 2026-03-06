<?php
/*--------------------------------------------------------------
   RebuildProductsPropertiesIndexOnUpdatedOptionDetail.php 2021-06-24
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductVariant\App\EventListeners;

use Gambio\Admin\Modules\Option\Model\Events\OptionDetailsUpdated;
use Gambio\Admin\Modules\ProductVariant\App\Data\ProductVariantsReader;
use Gambio\Admin\Modules\ProductVariant\App\Data\ProductVariantsUpdater;
use Gambio\Core\Event\PrioritizedEventListener;

/**
 * Class RebuildProductsPropertiesIndexOnUpdatedOptionDetail
 *
 * @package Gambio\Admin\Modules\ProductVariant\App\EventListeners
 */
class RebuildProductsPropertiesIndexOnUpdatedOptionDetail implements PrioritizedEventListener
{
    /**
     * @var ProductVariantsReader
     */
    private $reader;
    
    /**
     * @var ProductVariantsUpdater
     */
    private $updater;
    
    
    /**
     * RebuildProductsPropertiesIndexOnUpdatedOptionDetail constructor.
     *
     * @param ProductVariantsReader  $reader
     * @param ProductVariantsUpdater $updater
     */
    public function __construct(
        ProductVariantsReader  $reader,
        ProductVariantsUpdater $updater
    ) {
        $this->reader  = $reader;
        $this->updater = $updater;
    }
    
    
    /**
     * @param OptionDetailsUpdated $event
     */
    public function __invoke(OptionDetailsUpdated $event): void
    {
        $variantIds = $this->reader->variantsContainingOptions($event->id()->value());
        $this->updater->indexCombiAndOptions(...$variantIds);
    }
    
    
    /**
     * @inheritDoc
     */
    public function priority(): int
    {
        return self::PRIORITY_NORMAL;
    }
}