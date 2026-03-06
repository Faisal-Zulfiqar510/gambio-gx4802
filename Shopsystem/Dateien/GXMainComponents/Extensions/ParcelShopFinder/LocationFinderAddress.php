<?php
/* --------------------------------------------------------------
   LocationFinderAddress.php 2022-08-09
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/
declare(strict_types=1);

class LocationFinderAddress
{
    /**
     * @var string
     */
    private $countryCode;
    
    /**
     * @var string
     */
    private $addressLocality;
    
    /**
     * @var string
     */
    private $postalCode;
    
    /**
     * @var string
     */
    private $streetAddress;
    
    
    public function __construct(
        string $countryCode = 'DE',
        string $addressLocality = '',
        string $postalCode = '',
        string $streetAddress = ''
    ) {
        
        $this->countryCode     = $countryCode;
        $this->addressLocality = $addressLocality;
        $this->postalCode      = $postalCode;
        $this->streetAddress   = $streetAddress;
    }
    
    
    public function asArray(): array
    {
        return [
            'streetAddress'   => $this->streetAddress,
            'postalCode'      => $this->postalCode,
            'addressLocality' => $this->addressLocality,
            'countryCode'     => $this->countryCode,
        ];
    }
}
