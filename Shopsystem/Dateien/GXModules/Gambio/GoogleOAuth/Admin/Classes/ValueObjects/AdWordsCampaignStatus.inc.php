<?php
/* --------------------------------------------------------------
 AdWordsCampaignStatus.inc.php 2017-12-11
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Class AdWordsCampaignStatus
 *
 * Represents the status of an AdWords campaign.
 */
class AdWordsCampaignStatus extends BoolType
{
    /**
     * Returns the current state of the campaign status.
     *
     * @return bool
     */
    public function active()
    {
        return $this->asBool();
    }
}