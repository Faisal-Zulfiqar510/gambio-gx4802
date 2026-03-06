<?php
/*--------------------------------------------------------------
   CustomerAddress.php 2022-10-28
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/
declare(strict_types=1);

namespace Gambio\Admin\Modules\Customer\Submodules\Address\Model;

use DateTimeImmutable;
use Gambio\Admin\Modules\Customer\Submodules\Address\Model\Events\CustomerAddressLocationInformationUpdated;
use Gambio\Admin\Modules\Customer\Submodules\Address\Model\Events\CustomerAddressPersonalInformationUpdated;
use Gambio\Admin\Modules\Customer\Submodules\Address\Model\ValueObjects\CustomerAddressCountry;
use Gambio\Admin\Modules\Customer\Submodules\Address\Model\ValueObjects\CustomerAddressId;
use Gambio\Admin\Modules\Customer\Submodules\Address\Model\ValueObjects\CustomerAddressState;
use Gambio\Admin\Modules\Customer\Submodules\Address\Model\ValueObjects\CustomerId;
use Gambio\Admin\Modules\Customer\Submodules\Address\Model\ValueObjects\LocationInformation;
use Gambio\Admin\Modules\Customer\Submodules\Address\Model\ValueObjects\PersonalInformation;
use Gambio\Core\Event\Abstracts\AbstractEventRaisingEntity;

/**
 * Class CustomerAddress
 *
 * @package Gambio\Admin\Modules\Customer\Submodules\Address
 */
class CustomerAddress extends AbstractEventRaisingEntity
{
    /**
     * @var CustomerAddressId
     */
    private CustomerAddressId $customerAddressId;
    
    
    /**
     * @var CustomerId
     */
    private CustomerId $customerId;
    
    
    /**
     * @var PersonalInformation
     */
    private PersonalInformation $personalInformation;
    
    
    /**
     * @var LocationInformation
     */
    private LocationInformation $locationInformation;
    
    
    /**
     * @var DateTimeImmutable
     */
    private DateTimeImmutable $creationTime;
    
    
    /**
     * @var DateTimeImmutable
     */
    private DateTimeImmutable $updatedAtTime;
    
    
    /**
     * @var bool
     */
    private bool $isDefaultForShipping;
    
    
    /**
     * @var bool
     */
    private bool $isDefaultForPayment;
    
    
    /**
     * @param CustomerAddressId   $customerAddressId
     * @param CustomerId          $customerId
     * @param PersonalInformation $personalInformation
     * @param LocationInformation $locationInformation
     * @param DateTimeImmutable   $creationTime
     * @param DateTimeImmutable   $updatedAtTime
     * @param bool                $isDefaultForShipping
     * @param bool                $isDefaultForPayment
     */
    private function __construct(
        CustomerAddressId   $customerAddressId,
        CustomerId          $customerId,
        PersonalInformation $personalInformation,
        LocationInformation $locationInformation,
        DateTimeImmutable   $creationTime,
        DateTimeImmutable   $updatedAtTime,
        bool                $isDefaultForShipping = false,
        bool                $isDefaultForPayment = false
    ) {
        $this->customerAddressId    = $customerAddressId;
        $this->customerId           = $customerId;
        $this->personalInformation  = $personalInformation;
        $this->locationInformation  = $locationInformation;
        $this->creationTime         = $creationTime;
        $this->updatedAtTime        = $updatedAtTime;
        $this->isDefaultForShipping = $isDefaultForShipping;
        $this->isDefaultForPayment  = $isDefaultForPayment;
    }
    
    
    /**
     * @param CustomerAddressId   $customerAddressId
     * @param CustomerId          $customerId
     * @param PersonalInformation $personalInformation
     * @param LocationInformation $locationInformation
     * @param DateTimeImmutable   $creationTime
     * @param DateTimeImmutable   $updatedAtTime
     * @param bool                $isDefaultForShipping
     * @param bool                $isDefaultForPayment
     *
     * @return CustomerAddress
     */
    public static function create(
        CustomerAddressId   $customerAddressId,
        CustomerId          $customerId,
        PersonalInformation $personalInformation,
        LocationInformation $locationInformation,
        DateTimeImmutable   $creationTime,
        DateTimeImmutable   $updatedAtTime,
        bool                $isDefaultForShipping = false,
        bool                $isDefaultForPayment = false
    ): CustomerAddress {
        
        return new self($customerAddressId,
                        $customerId,
                        $personalInformation,
                        $locationInformation,
                        $creationTime,
                        $updatedAtTime,
                        $isDefaultForShipping,
                        $isDefaultForPayment);
    }
    
    
    /**
     * @param string $datetimeFormat
     *
     * @return array
     */
    public function toArray(string $datetimeFormat = 'Y-m-d H:i:s'): array
    {
        return [
            'id'                    => $this->id(),
            'customerId'            => $this->customerId(),
            'gender'                => $this->gender(),
            'firstName'             => $this->firstName(),
            'lastName'              => $this->lastName(),
            'companyName'           => $this->companyName(),
            'streetName'            => $this->streetName(),
            'houseNumber'           => $this->houseNumber(),
            'postcode'              => $this->postcode(),
            'city'                  => $this->city(),
            'country'               => ['name' => $this->country()->name(), 'isoCode2' => $this->country()->isoCode2()],
            'additionalInformation' => $this->additionalInformation(),
            'suburb'                => $this->suburb(),
            'state'                 => ['id' => $this->stateId(), 'name' => $this->stateName()],
            'creationTime'          => $this->creationTime($datetimeFormat),
            'updatedAtTime'         => $this->updatedAtTime($datetimeFormat),
            'isDefaultForShipping'  => $this->isDefaultForShipping(),
            'isDefaultForPayment'   => $this->isDefaultForPayment(),
        ];
    }
    
    
    /**
     * @param PersonalInformation $personalInformation
     *
     * @return void
     */
    public function changePersonalInformation(PersonalInformation $personalInformation): void
    {
        $this->personalInformation = $personalInformation;
        $this->raiseEvent(CustomerAddressPersonalInformationUpdated::create($this->customerAddressId,
                                                                            $personalInformation));
    }
    
    
    /**
     * @param LocationInformation $locationInformation
     *
     * @return void
     */
    public function changeLocationInformation(LocationInformation $locationInformation): void
    {
        $this->locationInformation = $locationInformation;
        $this->raiseEvent(CustomerAddressLocationInformationUpdated::create($this->customerAddressId,
                                                                            $locationInformation));
    }
    
    
    /**
     * @return int
     */
    public function id(): int
    {
        return $this->customerAddressId->value();
    }
    
    
    /**
     * @return int
     */
    public function customerId(): int
    {
        return $this->customerId->value();
    }
    
    
    /**
     * @return string
     */
    public function gender(): string
    {
        return $this->personalInformation->gender();
    }
    
    
    /**
     * @return string
     */
    public function firstName(): string
    {
        return $this->personalInformation->firstName();
    }
    
    
    /**
     * @return string
     */
    public function lastName(): string
    {
        return $this->personalInformation->lastName();
    }
    
    
    /**
     * @return string
     */
    public function companyName(): string
    {
        return $this->personalInformation->companyName();
    }
    
    
    /**
     * @return string
     */
    public function streetName(): string
    {
        return $this->locationInformation->streetName();
    }
    
    
    /**
     * @return string
     */
    public function houseNumber(): string
    {
        return $this->locationInformation->houseNumber();
    }
    
    
    /**
     * @return string
     */
    public function postcode(): string
    {
        return $this->locationInformation->postcode();
    }
    
    
    /**
     * @return string
     */
    public function city(): string
    {
        return $this->locationInformation->city();
    }
    
    
    /**
     * @return CustomerAddressCountry
     */
    public function country(): CustomerAddressCountry
    {
        return $this->locationInformation->country();
    }
    
    
    /**
     * @return string
     */
    public function countryName(): string
    {
        return $this->locationInformation->country()->name();
    }
    
    
    /**
     * @return string
     */
    public function countryIsoCode2(): string
    {
        return $this->locationInformation->country()->isoCode2();
    }
    
    
    /**
     * @return string
     */
    public function additionalInformation(): string
    {
        return $this->locationInformation->additionalInformation();
    }
    
    
    /**
     * @return string
     */
    public function suburb(): string
    {
        return $this->locationInformation->suburb();
    }
    
    
    /**
     * @return CustomerAddressState
     */
    public function state(): CustomerAddressState
    {
        return $this->locationInformation->state();
    }
    
    
    /**
     * @return string
     */
    public function stateName(): string
    {
        return $this->locationInformation->state()->name();
    }
    
    
    /**
     * @return int
     */
    public function stateId(): int
    {
        return $this->locationInformation->state()->id();
    }
    
    
    /**
     * @param string $datetimeFormat
     *
     * @return string
     */
    public function creationTime(string $datetimeFormat = 'Y-m-d H:i:s'): string
    {
        return $this->creationTime->format($datetimeFormat);
    }
    
    
    /**
     * @param string $datetimeFormat
     *
     * @return string
     */
    public function updatedAtTime(string $datetimeFormat = 'Y-m-d H:i:s'): string
    {
        return $this->updatedAtTime->format($datetimeFormat);
    }
    
    
    /**
     * @return bool
     */
    public function isDefaultForShipping(): bool
    {
        return $this->isDefaultForShipping;
    }
    
    
    /**
     * @return bool
     */
    public function isDefaultForPayment(): bool
    {
        return $this->isDefaultForPayment;
    }
}