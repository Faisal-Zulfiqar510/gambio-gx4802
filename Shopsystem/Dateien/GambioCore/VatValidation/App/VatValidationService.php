<?php
/* --------------------------------------------------------------
   VatValidationService.php 2022-09-01
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

declare(strict_types=1);

namespace Gambio\Core\VatValidation\App;

use Gambio\Core\Configuration\Services\ConfigurationFinder;
use Gambio\Core\Logging\LoggerBuilder;
use Gambio\Core\VatValidation\App\Validators\EuViesValidator;
use Gambio\Core\VatValidation\App\Validators\ManualVatIdValidator;
use Gambio\Core\VatValidation\Services\Exceptions\UnknownCountryException;
use Gambio\Core\VatValidation\Services\VatValidationService as VatValidationServiceInterface;
use Psr\Log\LoggerInterface;
use SoapClient;

/**
 * Class VatValidationService
 *
 * @package Gambio\Core\VatValidation\App
 */
class VatValidationService implements VatValidationServiceInterface
{
    private bool            $liveCheckEnabled;
    private EuViesValidator $euViesValidator;
    private LoggerInterface $logger;
    
    /**
     * @var ManualVatIdValidator[]
     */
    private array $manualValidators;
    
    
    /**
     * @param ConfigurationFinder $configurationFinder
     * @param EuViesValidator     $euViesValidator
     * @param LoggerBuilder       $loggerFactory
     */
    public function __construct(
        ConfigurationFinder $configurationFinder,
        EuViesValidator     $euViesValidator,
        LoggerBuilder       $loggerFactory
    ) {
        $this->liveCheckEnabled = class_exists(SoapClient::class)
                                  && $configurationFinder->get('configuration/ACCOUNT_COMPANY_VAT_LIVE_CHECK', 'true')
                                     === 'true';
        $this->euViesValidator  = $euViesValidator;
        $this->logger           = $loggerFactory->changeNamespace('vat-validation')->omitRequestData()->build();
        $this->manualValidators = [];
    }
    
    
    /**
     * @inheritDoc
     */
    public function validateVatId(string $vatId): bool
    {
        if (($vatId = $this->cleanupVatId($vatId)) === '') {
            
            return false;
        }
        
        $countryIsoCode = strtolower(substr($vatId, 0, 2));
        
        if ($this->liveCheckEnabled) {
            return $this->euViesValidator->validateVatId($vatId);
        }
        
        if (array_key_exists($countryIsoCode, $this->manualValidators) === false) {
            $this->logger->warning('No validator available for given country.',
                                   ['vatId' => $vatId, 'countryIsoCode' => $countryIsoCode]);
            
            return false;
        }
        
        return $this->manualValidators[$countryIsoCode]->validateVatId($vatId);
    }
    
    
    /**
     * @param string $vatId
     *
     * @return string
     */
    private function cleanupVatId(string $vatId): string
    {
        return trim(str_replace([' ', '-', '/', '\\', '.', ':', ','], '', $vatId));
    }
    
    
    /**
     * @param ManualVatIdValidator $manualVatIdValidator
     *
     * @return void
     */
    public function registerVatIdValidator(ManualVatIdValidator $manualVatIdValidator): void
    {
        $countryIsoCode = trim(strtolower($manualVatIdValidator->validatedCountryIsoCode()));
        
        $this->manualValidators[$countryIsoCode] = $manualVatIdValidator;
    }
}