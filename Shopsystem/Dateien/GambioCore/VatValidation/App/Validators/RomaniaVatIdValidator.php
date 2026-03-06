<?php
/* --------------------------------------------------------------
   RomaniaVatIdValidator.php 2022-04-21
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

declare(strict_types=1);

namespace Gambio\Core\VatValidation\App\Validators;

/**
 * Class RomaniaVatIdValidator
 *
 * @package Gambio\Core\VatValidation\App\Validators
 */
class RomaniaVatIdValidator implements ManualVatIdValidator
{
    /**
     * @inheritDoc
     */
    public function validatedCountryIsoCode(): string
    {
        return 'ro';
    }
    
    
    /**
     * @inheritDoc
     */
    public function validateVatId(string $vatId): bool
    {
        $number = str_replace('ro', '', strtolower($vatId));
        
        if (strlen($vatId) > 1 && strlen($vatId) < 11) {
            if (is_numeric($number)) {
                return true;
            }
            
            return false;
        }
        
        return false;
    }
}