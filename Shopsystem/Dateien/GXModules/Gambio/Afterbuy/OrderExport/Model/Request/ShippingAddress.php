<?php
/* --------------------------------------------------------------
   ShippingAddress.php 2023-01-13
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2023 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

declare(strict_types=1);

namespace GXModules\Gambio\Afterbuy\OrderExport\Model\Request;

use GXModules\Gambio\Afterbuy\AfterbuyCommon\Model\XmlSerializable;

/**
 * Class ShippingAddress
 *
 * @package GXModules\Gambio\Afterbuy\OrderExport\Model
 */
class ShippingAddress implements XmlSerializable
{
    use EscapeXmlTrait;
    
    private string  $firstName;
    private string  $lastName;
    private string  $street;
    private string  $postalCode;
    private string  $city;
    private string  $country;
    private ?string $stateOfProvince;
    private ?string $company;
    private ?string $street2;
    private ?string $phone;
    
    
    public function __construct(
        string $firstName,
        string $lastName,
        string $street,
        string $postalCode,
        string $city,
        string $country,
        string $stateOfProvince = null,
        string $company = null,
        string $street2 = null,
        string $phone = null
    ) {
        $this->firstName       = $this->escapeForXml($firstName);
        $this->lastName        = $this->escapeForXml($lastName);
        $this->street          = $this->escapeForXml($street);
        $this->postalCode      = $this->escapeForXml($postalCode);
        $this->city            = $this->escapeForXml($city);
        $this->country         = $this->escapeForXml($country);
        $this->stateOfProvince = $this->escapeForXml($stateOfProvince);
        $this->company         = $this->escapeForXml($company);
        $this->street2         = $this->escapeForXml($street2);
        $this->phone           = $this->escapeForXml($phone);
    }
    
    
    /**
     * @inheritDoc
     */
    public function toXmlString(): string
    {
        $indent    = $this->indent();
        $optionals = $this->optionalsAsXml();
        
        if (empty($optionals)) {
            return <<<XML
$indent<ShippingAddress>
$indent    <FirstName>$this->firstName</FirstName>
$indent    <LastName>$this->lastName</LastName>
$indent    <Street>$this->street</Street>
$indent    <PostalCode>$this->postalCode</PostalCode>
$indent    <City>$this->city</City>
$indent    <Country>$this->country</Country>
$indent</ShippingAddress>
XML;
        }
        
        return <<<XML
$indent<ShippingAddress>
$indent    <FirstName>$this->firstName</FirstName>
$indent    <LastName>$this->lastName</LastName>
$indent    <Street>$this->street</Street>
$indent    <PostalCode>$this->postalCode</PostalCode>
$indent    <City>$this->city</City>
$indent    <Country>$this->country</Country>
$optionals
$indent</ShippingAddress>
XML;
    }
    
    
    /**
     * Creates a xml string of the optional values, if they are available.
     *
     * @return string
     */
    private function optionalsAsXml(): string
    {
        $indent = str_repeat(' ', strlen($this->indent()) + 4);
        
        $optionals = '';
        if ($this->stateOfProvince) {
            $optionals .= "$indent<StateOfProvince>$this->stateOfProvince</StateOfProvince>\n";
        }
        if ($this->company) {
            $optionals .= "$indent<Company>$this->company</Company>\n";
        }
        if ($this->street2) {
            $optionals .= "$indent<Street2>$this->street2</Street2>\n";
        }
        if ($this->phone) {
            $optionals .= "$indent<Phone>$this->phone</Phone>\n";
        }
        
        return rtrim($optionals);
    }
    
    
    /**
     * @inheritDoc
     */
    public function indent(): string
    {
        return str_repeat(' ', 16);
    }
}
