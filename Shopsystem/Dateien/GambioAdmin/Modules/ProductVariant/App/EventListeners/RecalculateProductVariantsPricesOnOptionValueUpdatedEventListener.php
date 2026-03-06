<?php
/*--------------------------------------------------------------
   RecalculateProductVariantsPricesOnOptionValueUpdatedEventListener.php 2022-02-22
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductVariant\App\EventListeners;

use Gambio\Admin\Modules\Option\Model\Events\OptionValueUpdated;
use Gambio\Admin\Modules\ProductVariant\Services\RecalculateProductVariantPriceService;
use Gambio\Core\Event\PrioritizedEventListener;

/**
 * Class RecalculateProductVariantPriceOnOptionValueUpdatedEventLister
 *
 * @package Gambio\Admin\Modules\ProductVariant\App\EventListeners
 */
class RecalculateProductVariantsPricesOnOptionValueUpdatedEventListener implements PrioritizedEventListener
{
    /**
     * @var RecalculateProductVariantPriceService
     */
    private $recalculateService;
    
    
    /**
     * RecalculateProductVariantsPricesOnOptionValueUpdatedEventListener constructor.
     */
    public function __construct(RecalculateProductVariantPriceService $recalculateService)
    {
        $this->recalculateService = $recalculateService;
    }
    
    
    /**
     * @param OptionValueUpdated $event
     */
    public function __invoke(OptionValueUpdated $event): void
    {
        $this->recalculateService->recalculateForVariantsWithOptionValue($event->id()->value(),
                                                                         $event->optionValue()->id());
    }
    
    
    /**
     * @inheritDoc
     */
    public function priority(): int
    {
        return self::PRIORITY_VERY_HIGH;
    }
}