<?php
/* --------------------------------------------------------------
   AfterbuyStockupdateCronjobLogger.inc.php 2022-11-25
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/
declare(strict_types=1);

use Psr\Log\LoggerInterface;

class AfterbuyStockupdateCronjobLogger extends AbstractCronjobLogger
{
    /**
     * @param array $context
     */
    public function log(array $context = [])
    {
        if (!empty($context['message']) && !empty($context['level'])) {
            $this->logger->log($context['level'], $context['message']);
        } else {
            $this->logger->info('Afterbuy Stock sync', $context);
        }
    }
    
    
    /**
     * @param array $context
     */
    public function logError(array $context = [])
    {
        if (!empty($context['message'])) {
            $this->logger->error($context['message']);
        } else {
            $this->logger->error('Afterbuy Stock sync error', $context);
        }
    }
}
