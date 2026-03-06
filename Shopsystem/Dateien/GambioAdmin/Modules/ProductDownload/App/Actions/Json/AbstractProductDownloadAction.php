<?php
/*--------------------------------------------------------------
   AbstractProductDownloadAction.php 2022-08-09
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductDownload\App\Actions\Json;

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\FetchMode;
use Gambio\Core\Application\Http\AbstractAction;

/**
 * Class AbstractProductDownloadAction
 * @package Gambio\Admin\Modules\ProductDownload\App\Actions\Json
 */
abstract class AbstractProductDownloadAction extends AbstractAction
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
     * @param int    $downloadId
     * @param string $filePath
     * @param int    $maxDays
     * @param int    $maxCount
     */
    protected function assignDownloadData(
        int $downloadId,
        string $filePath,
        int $maxDays,
        int $maxCount
    ): void {
        
        $query = '
                REPLACE INTO `products_attributes_download` (
                    `products_attributes_id`,
                    `products_attributes_filename`,
                    `products_attributes_maxdays`,
                    `products_attributes_maxcount`
                ) VALUES (
                    :product_option_id,
                    :products_attributes_filename,
                    :products_attributes_maxdays,
                    :products_attributes_maxcount
                )';
        $stmt  = $this->connection->prepare($query);
        $stmt->bindValue(':product_option_id', $downloadId);
        $stmt->bindValue(':products_attributes_filename', $filePath);
        $stmt->bindValue(':products_attributes_maxdays', $maxDays);
        $stmt->bindValue(':products_attributes_maxcount', $maxCount);
        $stmt->execute();
    }
    
    
    /**
     * @param array $downloadOption
     *
     * @return array
     */
    protected function addDownloadDataToArray(array $downloadOption): array
    {
        $query = "
                SELECT
                       `products_attributes_filename`,
                       `products_attributes_maxcount`,
                       `products_attributes_maxdays`
                FROM `products_attributes_download`
                WHERE `products_attributes_id` = :product_option_id";
        $stmt  = $this->connection->prepare($query);
        $stmt->bindValue(':product_option_id', $downloadOption['id']);
        $stmt->execute();
        
        $row = $stmt->fetch(FetchMode::ASSOCIATIVE);
        
        if ($stmt->rowCount() === 0) {
            
            return $downloadOption;
        }
        
        return array_merge($downloadOption, [
            'filePath' => $row['products_attributes_filename'],
            'maxCount' => (int)$row['products_attributes_maxcount'],
            'maxDays'  => (int)$row['products_attributes_maxdays'],
        ]);
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
        
        return array_map(function ($element) {
            return (int)$element['products_attributes_id'];
        }, $result);
    }
}