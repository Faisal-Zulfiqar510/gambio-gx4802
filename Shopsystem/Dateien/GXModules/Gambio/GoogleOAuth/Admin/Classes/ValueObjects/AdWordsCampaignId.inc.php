<?php
/* --------------------------------------------------------------
 AdWordsCampaignId.inc.php 2017-12-11
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Class AdWordsCampaignId
 *
 * Represents the id of an AdWords campaign.
 */
class AdWordsCampaignId extends IntType
{
    /**
     * Returns the id value.
     *
     * @return int
     */
    public function id()
    {
        return $this->asInt();
    }
}