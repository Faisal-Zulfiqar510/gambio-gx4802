<?php
/*--------------------------------------------------------------
   AbstractProductOptionAction.php 2021-09-13
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductOption\App\Actions\Json;

use Doctrine\DBAL\Connection;
use Gambio\Core\Application\Http\AbstractAction;

/**
 * Class AbstractProductOptionAction
 * @package Gambio\Admin\Modules\ProductOption\App\Actions\Json
 */
abstract class AbstractProductOptionAction extends AbstractAction
{
    /**
     * @var Connection
     */
    private $connection;
    
    
    /**
     * @param Connection $connection
     */
    protected function setConnection(Connection $connection): void
    {
        $this->connection = $connection;
    }
    
    
    /**
     * @return array
     */
    protected function downloadProductOptionIds(): array
    {
        $result = $this->connection->createQueryBuilder()
            ->select('products_attributes_id')
            ->distinct()
            ->from('products_attributes_download')
            ->execute()
            ->fetchAll();
        
        return array_map('intval', array_column($result, 'products_attributes_id'));
    }
}