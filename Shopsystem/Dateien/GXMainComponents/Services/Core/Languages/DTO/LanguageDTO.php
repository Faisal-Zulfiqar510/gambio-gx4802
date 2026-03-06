<?php
/*--------------------------------------------------------------
   LanguageDTO.php 2022-08-05
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

/**
 * Class LanguageDTO
 */
class LanguageDTO implements JsonSerializable
{
    /**
     * @var int
     */
    private $id;
    
    /**
     * @var string
     */
    private $name;
    
    /**
     * @var string
     */
    private $code;
    
    /**
     * @var string
     */
    private $image;
    
    /**
     * @var string
     */
    private $directory;
    
    /**
     * @var int
     */
    private $sortOrder;
    
    /**
     * @var bool
     */
    private $status;
    
    /**
     * @var bool
     */
    private $statusAdmin;
    
    /**
     * @var string
     */
    private $currency;
    
    /**
     * @var int
     */
    private $currencyId;
    
    
    /**
     * LanguageDTO constructor.
     *
     * @param int    $id
     * @param string $name
     * @param string $code
     * @param string $image
     * @param string $directory
     * @param int    $sortOrder
     * @param bool   $status
     * @param bool   $statusAdmin
     * @param string $currency
     * @param int    $currencyId
     */
    public function __construct(
        int $id,
        string $name,
        string $code,
        string $image,
        string $directory,
        int $sortOrder,
        bool $status,
        bool $statusAdmin,
        string $currency,
        int $currencyId
    ) {
        $this->id          = $id;
        $this->name        = $name;
        $this->code        = $code;
        $this->image       = $image;
        $this->directory   = $directory;
        $this->sortOrder   = $sortOrder;
        $this->status      = $status;
        $this->statusAdmin = $statusAdmin;
        $this->currency    = $currency;
        $this->currencyId  = $currencyId;
    }
    
    
    /**
     * @return int
     */
    public function id(): int
    {
        return $this->id;
    }
    
    
    /**
     * @return string
     */
    public function name(): string
    {
        return $this->name;
    }
    
    
    /**
     * @return string
     */
    public function code(): string
    {
        return $this->code;
    }
    
    
    /**
     * @return string
     */
    public function image(): string
    {
        return $this->image;
    }
    
    
    /**
     * @return string
     */
    public function directory(): string
    {
        return $this->directory;
    }
    
    
    /**
     * @return int
     */
    public function sortOrder(): int
    {
        return $this->sortOrder;
    }
    
    
    /**
     * @return bool
     */
    public function status(): bool
    {
        return $this->status;
    }
    
    
    /**
     * @return bool
     */
    public function statusAdmin(): bool
    {
        return $this->statusAdmin;
    }
    
    
    /**
     * @return string
     */
    public function currency(): string
    {
        return $this->currency;
    }
    
    
    /**
     * @return int
     */
    public function currencyId(): int
    {
        return $this->currencyId;
    }
    
    
    /**
     * @return array
     */
    public function toArray(): array
    {
        return [
            'id'          => $this->id(),
            'name'        => $this->name(),
            'code'        => $this->code(),
            'image'       => $this->image(),
            'directory'   => $this->directory(),
            'sortOrder'   => $this->sortOrder(),
            'status'      => $this->status(),
            'statusAdmin' => $this->statusAdmin(),
            'currency'    => $this->currency(),
            'currencyId'  => $this->currencyId()
        ];
    }
    
    
    /**
     * @inheritDoc
     */
    #[\ReturnTypeWillChange]
    public function jsonSerialize()
    {
        return $this->toArray();
    }
}