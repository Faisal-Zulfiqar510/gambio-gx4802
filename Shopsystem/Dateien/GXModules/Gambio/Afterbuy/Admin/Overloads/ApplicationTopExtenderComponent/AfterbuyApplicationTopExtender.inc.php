<?php
/* --------------------------------------------------------------
   AfterbuyApplicationTopExtender.php 2022-11-25
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

declare(strict_types=1);

use GXModules\Gambio\Afterbuy\Admin\Module\AfterbuyServiceProvider;

/**
 * Class AfterbuyApplicationTopExtender
 *
 * @package GXModules\Gambio\Afterbuy\Admin\Overloads\ApplicationTopExtenderComponent
 */
class AfterbuyApplicationTopExtender extends AfterbuyApplicationTopExtender_parent
{
    /**
     * Registers the `AfterbuyServiceProvider` for the `LegacyDependencyContainer`.
     */
    public function proceed()
    {
        parent::proceed();
        
        LegacyDependencyContainer::getInstance()->registerProvider(AfterbuyServiceProvider::class);
    }
}