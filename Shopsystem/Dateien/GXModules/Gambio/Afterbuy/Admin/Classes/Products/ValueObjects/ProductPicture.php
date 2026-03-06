<?php
/* --------------------------------------------------------------
   ProductPicture.php 2022-09-20
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/
declare(strict_types=1);

namespace GXModules\Gambio\Afterbuy\Admin\Classes\Products\ValueObjects;

use GXModules\Gambio\Afterbuy\Admin\Classes\Products\Exceptions\InvalidPictureException;

class ProductPicture
{
    private int    $Typ     = 0;
    
    private int    $Nr      = 1;
    
    private string $Url     = '';
    
    private string $AltText = '';
    
    private array  $Childs; // sp!
    
    
    public function __construct()
    {
        
    }
    
    
    public function toArray(): array
    {
        $array = [
            'Nr'      => $this->Nr,
            'Url'     => $this->Url,
            'AltText' => $this->AltText,
            'Childs'  => [],
        ];
        
        foreach ($this->Childs as $child) {
            $child = [
                'Typ'     => $child->getTyp(),
                'Url'     => $child->getUrl(),
                'AltText' => $child->getAltText(),
            ];
            $array['Childs'][] = array_filter($child, static fn($e) => !empty($e));
        }
        
        return array_filter($array, static fn($x) => !empty($x));
    }
    
    
    /**
     * @return int
     */
    public function getTyp(): int
    {
        return $this->Typ;
    }
    
    
    /**
     * @param int $Typ
     */
    public function setTyp(int $Typ): void
    {
        if ($Typ < 0 || $Typ > 3) {
            throw new InvalidPictureException('Typ must be between 0 and 3');
        }
        $this->Typ = $Typ;
    }
    
    
    /**
     * @return int
     */
    public function getNr(): int
    {
        return $this->Nr;
    }
    
    
    /**
     * @param int $Nr
     */
    public function setNr(int $Nr): void
    {
        $this->Nr = $Nr;
    }
    
    
    /**
     * @return string
     */
    public function getUrl(): string
    {
        return $this->Url;
    }
    
    
    /**
     * @param string $Url
     */
    public function setUrl(string $Url): void
    {
        $this->Url = $Url;
    }
    
    
    /**
     * @return string
     */
    public function getAltText(): string
    {
        return $this->AltText;
    }
    
    
    /**
     * @param string $AltText
     */
    public function setAltText(string $AltText): void
    {
        $this->AltText = $AltText;
    }
    
    
    public function addChild(ProductPicture $childPicture): void
    {
        if ($this->Typ !== 0 || $childPicture->getTyp() === 0) {
            throw new InvalidPictureException("Invalid parent/child relation; mind the Typ {$this->Typ} / {$childPicture->getTyp()}");
        }
        $this->Childs[] = $childPicture;
    }
    
    
    /**
     * @return array
     */
    public function getChilds(): array
    {
        return $this->Childs;
    }
}