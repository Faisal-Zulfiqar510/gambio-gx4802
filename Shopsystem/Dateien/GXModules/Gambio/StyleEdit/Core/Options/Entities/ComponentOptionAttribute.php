<?php
/*--------------------------------------------------------------------------------------------------
    ComponentOptionAttribute.php 2019-6-13
    Gambio GmbH
    http://www.gambio.de
    Copyright (c) 2016 Gambio GmbH
    Released under the GNU General Public License (Version 2)
    [http://www.gnu.org/licenses/gpl-2.0.html]
    -----------------------------------------------------------------------------------------------*/

namespace Gambio\StyleEdit\Core\Options\Entities;

/**
 * Class ComponentOptionAttribute
 * @package Gambio\StyleEdit\Core\Options\Entities
 */
class ComponentOptionAttribute
{
    protected $name;
    protected $value;
    
    
    /**
     * @return mixed
     */
    public function name()
    {
        return $this->name;
    }
    
    
    /**
     * @return mixed
     */
    public function value()
    {
        return $this->value;
    }
    
    
    /**
     * ComponentOptionAttribute constructor.
     *
     * @param string $name
     * @param string $value
     */
    private function __construct(string $name, string $value)
    {
        $this->value = $value;
        $this->name  = $name;
    }
    
    
    /**
     * @param string $name
     * @param string $value
     *
     * @return ComponentOptionAttribute
     */
    public static function create(string $name, string $value): ComponentOptionAttribute
    {
        return new static($name, $value);
    }
}