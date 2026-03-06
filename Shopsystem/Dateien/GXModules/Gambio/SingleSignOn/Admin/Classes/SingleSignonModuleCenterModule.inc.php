<?php
/* --------------------------------------------------------------
   SingleSignonModuleCenterModule.inc.php 2017-09-25
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2017 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

class SingleSignonModuleCenterModule extends AbstractModuleCenterModule
{
    protected function _init()
    {
        $this->title       = $this->languageTextManager->get_text('singlesignon_title');
        $this->description = $this->languageTextManager->get_text('singlesignon_description');
        $this->sortOrder   = 59454;
    }
    
    
    /**
     * Installs the module
     */
    public function install()
    {
        $query = 'CREATE TABLE IF NOT EXISTS `customers_sso` (
  				`customers_sso_id` int(11) NOT NULL AUTO_INCREMENT,
  				`customers_id` int(11) NOT NULL,
  				`issuer` varchar(255) NOT NULL,
				`subject` varchar(255) NOT NULL,
  				PRIMARY KEY (`customers_sso_id`),
  				UNIQUE KEY `issuer_subject` (`issuer`,`subject`),
  				KEY `customers_id` (`customers_id`)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8';
        $this->db->query($query);
        
        parent::install();
    }
}
