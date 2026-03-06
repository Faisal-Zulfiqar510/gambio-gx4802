<?php
/*--------------------------------------------------------------------------------------------------
    ComponentOptionAttributeCollection.php 2022-08-05
    Gambio GmbH
    http://www.gambio.de
    Copyright (c) 2022 Gambio GmbH
    Released under the GNU General Public License (Version 2)
    [http://www.gnu.org/licenses/gpl-2.0.html]
    --------------------------------------------------------------------------------------------------
 */

namespace Gambio\StyleEdit\Core\Options\Entities;

use InvalidArgumentException;

/**
 * Class ComponentOptionAttributeCollection
 * @package Gambio\StyleEdit\Core\Options\Entities
 */
class ComponentOptionAttributeCollection extends \EditableKeyValueCollection implements \JsonSerializable
{
    
    /**
     * ComponentOptionAttributeCollection constructor.
     *
     * @param array|null $keyValueArray
     */
    public function __construct(array $keyValueArray = null)
    {
        parent::__construct($keyValueArray ?? []);
    }
    
    
    /**
     * Specify data which should be serialized to JSON
     * @link  https://php.net/manual/en/jsonserializable.jsonserialize.php
     * @return mixed data which can be serialized by <b>json_encode</b>,
     * which is a value of any type other than a resource.
     * @since 5.4.0
     */
    #[\ReturnTypeWillChange]
    public function jsonSerialize()
    {
        $result = new \stdClass();
        
        foreach ($this->collectionContentArray as $value) {
            $result->{$value->name()} = $value->value();
        }
        
        return $result;
    }
    
    
    /**
     * Set new key-value pair.
     *
     * @param string $p_keyName
     * @param mixed  $p_value
     */
    public function setValue($p_keyName, $p_value)
    {
        if ($this->_itemIsValid($p_value) === false) {
            $exceptionText = $this->_getExceptionText();
            throw new InvalidArgumentException($exceptionText);
        } else {
            $this->collectionContentArray[$p_keyName] = $p_value;
        }
    }
    
    
    /**
     * @param mixed $dataItem
     *
     * @return bool|void
     */
    protected function _itemIsValid($dataItem)
    {
        if (parent::_itemIsValid($dataItem)) {
            if (in_array(strtolower($dataItem->name()), ['id'])) {
                throw new \InvalidArgumentException('Invalid attribute name :' . $dataItem->name());
            }
            
            return true;
        } else {
            return false;
        }
    }
    
    
    /**
     * @return string
     */
    protected function _getValidType()
    {
        return ComponentOptionAttribute::class;
    }
}