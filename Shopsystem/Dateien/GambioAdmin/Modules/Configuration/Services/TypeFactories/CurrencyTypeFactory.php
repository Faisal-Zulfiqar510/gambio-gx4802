<?php
/* --------------------------------------------------------------
   CurrencyTypeFactory.php 2020-08-18
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2020 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\Configuration\Services\TypeFactories;

use Doctrine\DBAL\Connection;
use Gambio\Admin\Modules\Configuration\Model\Entities\Type;

/**
 * Class CurrencyTypeFactory
 *
 * @package Gambio\Admin\Modules\Configuration\Services\TypeFactories
 */
class CurrencyTypeFactory implements TypeFactory
{
    /**
     * @var Connection
     */
    private $db;
    
    
    /**
     * CurrencyTypeFactory constructor.
     *
     * @param Connection $db
     */
    public function __construct(Connection $db)
    {
        $this->db = $db;
    }
    
    
    /**
     * @param array $params
     *
     * @return Type
     */
    public function createType(array $params): Type
    {
        $id              = (isset($params['multiSelect']) && $params['multiSelect']) ? 'multi-select' : 'dropdown';
        $params['items'] = $this->getCurrencies();
        unset($params['multiSelect']);
        
        return Type::create($id, $params);
    }
    
    
    /**
     * @return array
     */
    private function getCurrencies(): array
    {
        return $this->db->createQueryBuilder()
            ->select('`code` as `value`, `title` as `text`')
            ->from('`currencies`')
            ->orderBy('`text`')
            ->execute()
            ->fetchAll();
    }
}