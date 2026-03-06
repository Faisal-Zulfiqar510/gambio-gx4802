<?php
/* --------------------------------------------------------------
   AfterbuyCronjobDependencies.inc.php 2022-11-15
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/
declare(strict_types=1);

use Gambio\Core\Configuration\Services\ConfigurationFinder;

class AfterbuyCronjobDependencies extends AbstractCronjobDependencies
{
    
    /**
     * @return array
     */
    public function getDependencies()
    {
        /** @var GambioAfterbuyConfigurationStorage $gambioAfterbuyConfigurationStorage */
        $gambioAfterbuyConfigurationStorage = MainFactory::create('GambioAfterbuyConfigurationStorage');
        $configurationFinder                = LegacyDependencyContainer::getInstance()->get(ConfigurationFinder::class);
        
        return [
            'ConfigurationStorage' => $gambioAfterbuyConfigurationStorage,
            'ConfigurationFinder'  => $configurationFinder,
            'active'               => $this->storage->get('Afterbuy', 'active'),
        ];
    }
}
