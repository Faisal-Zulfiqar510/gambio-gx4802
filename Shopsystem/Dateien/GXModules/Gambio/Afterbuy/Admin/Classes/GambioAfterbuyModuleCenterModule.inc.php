<?php
/* --------------------------------------------------------------
   GambioAfterbuyModuleCenterModule.inc.php 2023-04-06
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2023 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

class GambioAfterbuyModuleCenterModule extends AbstractModuleCenterModule
{
    protected function _init()
    {
        $this->title       = $this->languageTextManager->get_text('gambioafterbuy_title');
        $this->description = $this->languageTextManager->get_text('gambioafterbuy_description');
        $this->sortOrder   = 0.5;
    }
    
    
    /**
     * Installs the module
     */
    public function install()
    {
        parent::install();
        
        $storage        = MainFactory::create(GambioAfterbuyConfigurationStorage::class);
        $configurations = $storage->get_all();
        foreach ($configurations as $key => $value) {
            $storage->set($key, $value);
        }
    }
}
