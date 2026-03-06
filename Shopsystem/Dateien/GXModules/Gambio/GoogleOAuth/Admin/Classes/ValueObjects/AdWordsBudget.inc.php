<?php
/* --------------------------------------------------------------
 AdWordsBudget.inc.php 2017-12-11
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Class AdWordsBudget
 *
 * Represents the budget value of an AdWords  campaign.
 */
class AdWordsBudget extends DecimalType
{
    /**
     * Returns the AdWords campaign budget value.
     *
     * @return float
     */
    public function budget()
    {
        return $this->asDecimal();
    }
}