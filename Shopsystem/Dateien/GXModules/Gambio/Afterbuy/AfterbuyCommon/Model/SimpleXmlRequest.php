<?php
/* --------------------------------------------------------------
   SimpleXmlRequest.php 2022-11-14
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

declare(strict_types=1);

namespace GXModules\Gambio\Afterbuy\AfterbuyCommon\Model;

/**
 * Class SimpleXmlRequest
 *
 * @package GXModules\Gambio\Afterbuy\AfterbuyCommon\Model
 */
class SimpleXmlRequest implements AfterbuyXmlRequest
{
    private string $xml;
    
    
    /**
     * SimpleXmlRequest constructor.
     *
     * @param string $xml
     */
    public function __construct(string $xml)
    {
        $this->xml = $xml;
    }
    
    
    /**
     * @inheritDoc
     */
    public function toXmlString(): string
    {
        return $this->xml;
    }
}