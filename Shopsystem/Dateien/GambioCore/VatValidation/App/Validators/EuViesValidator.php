<?php
/* --------------------------------------------------------------
   EuViesValidator.php 2022-04-21
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

declare(strict_types=1);

namespace Gambio\Core\VatValidation\App\Validators;

use Gambio\Core\Logging\LoggerBuilder;
use Gambio\Core\VatValidation\App\Exceptions\EuViesValidationFailedException;
use Psr\Log\LoggerInterface;
use SoapClient;
use SoapFault;

/**
 * Class EuViesValidator
 *
 * @package Gambio\Core\VatValidation\App\Validators
 */
class EuViesValidator
{
    private LoggerInterface $logger;
    
    
    /**
     * @param LoggerBuilder $loggerFactory
     */
    public function __construct(LoggerBuilder $loggerFactory)
    {
        $this->logger = $loggerFactory->changeNamespace('vat-validation')->omitRequestData()->build();
    }
    
    
    /**
     * @param string $vatId
     *
     * @return bool
     */
    public function validateVatId(string $vatId): bool
    {
        try {
            $client = new SoapClient("https://ec.europa.eu/taxation_customs/vies/checkVatService.wsdl");
            $result = $client->checkVat([
                                            'countryCode' => substr($vatId, 0, 2),
                                            'vatNumber'   => substr($vatId, 2),
                                        ]);
            
            return isset($result->valid) && $result->valid === true;
        } catch (SoapFault $exception) {
            $this->logger->warning('Soap client for EU Vies service failed.',
                                   ['vatId' => $vatId, 'reason' => $exception->getMessage()]);
            
            return false;
        }
    }
}