<?php
/* --------------------------------------------------------------
   OrderShippingOption.inc.php 2021-08-04
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/
declare(strict_types=1);

class OrderShippingOption
{
    /**
     * @var string
     */
    private $key;
    
    /**
     * @var string
     */
    private $value;
    
    
    public function __construct(string $key, string $value)
    {
        $this->key   = $key;
        $this->value = $value;
    }
    
    
    /**
     * @return string
     */
    public function getKey(): string
    {
        return $this->key;
    }
    
    
    /**
     * @param string $key
     */
    public function setKey(string $key): void
    {
        $this->key = $key;
    }
    
    
    /**
     * @return string
     */
    public function getValue(): string
    {
        return $this->value;
    }
    
    
    /**
     * @param string $value
     */
    public function setValue(string $value): void
    {
        $this->value = $value;
    }
   
}