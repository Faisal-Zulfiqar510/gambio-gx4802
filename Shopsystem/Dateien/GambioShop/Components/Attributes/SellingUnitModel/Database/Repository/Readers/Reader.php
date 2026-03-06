<?php
/*------------------------------------------------------------------------------
 Reader.php 2021-07-16
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 -----------------------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Shop\Attributes\SellingUnitModel\Database\Repository\Readers;

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\FetchMode;
use Gambio\Shop\Attributes\ProductModifiers\Database\ValueObjects\AttributeModifierIdentifier;
use Gambio\Shop\Attributes\Representation\ValueObjects\AttributeModifierId;
use Gambio\Shop\Attributes\SellingUnitModel\Database\Exceptions\AttributeDoesNotExistsException;
use Gambio\Shop\Attributes\SellingUnitModel\Database\Repository\DTO\AttributesModelDto;
use Gambio\Shop\Product\ValueObjects\ProductId;

/**
 * Class Reader
 * @package Gambio\Shop\Attributes\SellingUnitModel\Database\Repository\Readers
 */
class Reader implements ReaderInterface
{
    /**
     * @var Connection
     */
    protected $connection;
    
    
    /**
     * Reader constructor.
     *
     * @param Connection $connection
     */
    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }
    
    
    /**
     * @inheritDoc
     */
    public function getAttributeModelBy(AttributeModifierIdentifier $attributeValueId, ProductId $productId): AttributesModelDto
    {
        $queryResult = $this->connection->createQueryBuilder()
            ->select('attributes_model')
            ->from('products_attributes')
            ->where('options_values_id = ' . $attributeValueId->value())
            ->andWhere('products_id = ' . $productId->value())
            ->execute();

        $result = $queryResult->fetchAll(FetchMode::ASSOCIATIVE);
        
        if (!$result) {
            throw new AttributeDoesNotExistsException($attributeValueId->value() . ' not linked to the product ' . $productId->value());
        }
        
        $model = $result[0]['attributes_model'];
        
        return new AttributesModelDto($model);
    }
}