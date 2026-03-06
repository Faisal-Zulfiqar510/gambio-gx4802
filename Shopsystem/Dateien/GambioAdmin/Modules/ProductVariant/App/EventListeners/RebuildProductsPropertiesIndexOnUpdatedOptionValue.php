<?php
/*--------------------------------------------------------------
   RebuildProductsPropertiesIndexOnUpdatedOptionValue.php 2021-06-24
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductVariant\App\EventListeners;

use Gambio\Admin\Modules\Option\Model\Events\OptionValueUpdated;
use Gambio\Admin\Modules\ProductVariant\App\Data\ProductVariantsReader;
use Gambio\Admin\Modules\ProductVariant\App\Data\ProductVariantsUpdater;
use Gambio\Core\Event\PrioritizedEventListener;

/**
 * Class RebuildProductsPropertiesIndexOnUpdatedOptionValue
 *
 * @package Gambio\Admin\Modules\ProductVariant\App\EventListeners
 */
class RebuildProductsPropertiesIndexOnUpdatedOptionValue implements PrioritizedEventListener
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
     * RebuildProductsPropertiesIndexOnUpdatedOptionValue constructor.
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
     * @param OptionValueUpdated $event
     */
    public function __invoke(OptionValueUpdated $event)
    {
        $variantIds = $this->reader->variantsContainingOptionValues($event->optionValue()->id());
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