<?php
/* --------------------------------------------------------------
   RecalculateProductVariantPriceService.php 2022-08-09
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductVariant\App;

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\FetchMode;
use Exception;
use Gambio\Admin\Modules\Price\Services\ProductPriceConversionService;
use Gambio\Admin\Modules\ProductVariant\Model\Exceptions\PriceRecalculationFailed;
use Gambio\Admin\Modules\ProductVariant\Services\RecalculateProductVariantPriceService as RecalculateProductVariantPriceServiceInterface;
use Gambio\Core\Configuration\Services\ConfigurationFinder;

/**
 * Class RecalculateProductVariantPriceService
 *
 * @package Gambio\Admin\Modules\ProductVariant\App
 */
class RecalculateProductVariantPriceService implements RecalculateProductVariantPriceServiceInterface
{
    /**
     * @var Connection
     */
    private $db;
    
    /**
     * @var ConfigurationFinder
     */
    private $configurationFinder;
    
    /**
     * @var ProductPriceConversionService
     */
    private $priceConversionService;
    
    
    /**
     * @param Connection                    $db
     * @param ConfigurationFinder           $configurationFinder
     * @param ProductPriceConversionService $priceConversionService
     */
    public function __construct(
        Connection                    $db,
        ConfigurationFinder           $configurationFinder,
        ProductPriceConversionService $priceConversionService
    ) {
        $this->db                     = $db;
        $this->configurationFinder    = $configurationFinder;
        $this->priceConversionService = $priceConversionService;
    }
    
    
    /**
     * @inheritDoc
     */
    public function recalculateForVariantsWithOptionValue(int $optionId, int $optionValueId): void
    {
        if ($this->configurationFinder->get('configuration/PRICE_IS_BRUTTO', 'true') === 'false') {
            $this->runQueriesForNetPriceAdmin($optionId, $optionValueId);
        } else {
            $this->runQueriesForGrossPriceAdmin($optionId, $optionValueId);
        }
    }
    
    
    /**
     * @param int $optionId
     * @param int $optionValueId
     *
     * @return void
     *
     * @throws PriceRecalculationFailed
     */
    private function runQueriesForNetPriceAdmin(int $optionId, int $optionValueId): void
    {
        try {
            $this->db->beginTransaction();
            
            $query = <<<QUERY
UPDATE `products_properties_combis` `ppc`
JOIN `products_properties_combis_values` `ppcv`
  ON `ppc`.`products_properties_combis_id` = `ppcv`.`products_properties_combis_id`
SET `ppc`.`combi_price` = (
  SELECT SUM(`pv`.`value_price`)
  FROM `properties_values` `pv`
  JOIN `products_properties_combis_values` `ppcv2`
    ON `pv`.`properties_id` = `ppcv2`.`options_id` AND `pv`.`properties_values_id` = `ppcv2`.`properties_values_id`
  WHERE `ppcv`.`products_properties_combis_id` = `ppcv2`.`products_properties_combis_id`
)
WHERE `ppc`.`combi_price_type` = "calc" AND `ppcv`.`options_id` = :optionId AND `ppcv`.`properties_values_id` = :optionValueId
QUERY;
            
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':optionId', $optionId);
            $stmt->bindValue(':optionValueId', $optionValueId);
            $stmt->execute();
            
            $this->db->commit();
        } catch (Exception $exception) {
            $this->db->rollBack();
            
            throw PriceRecalculationFailed::becauseOfException($exception);
        }
    }
    
    
    /**
     * @param int $optionId
     * @param int $optionValueId
     *
     * @return void
     *
     * @throws PriceRecalculationFailed
     */
    private function runQueriesForGrossPriceAdmin(int $optionId, int $optionValueId): void
    {
        try {
            $db2 = clone $this->db;
            $db2->beginTransaction();
            
            $query = <<<QUERY
SELECT `ppc`.`products_properties_combis_id`, `ppc`.`products_id`, (
  SELECT SUM(`pv`.`value_price`)
  FROM `properties_values` `pv`
  JOIN `products_properties_combis_values` `ppcv2`
    ON `pv`.`properties_id` = `ppcv2`.`options_id` AND `pv`.`properties_values_id` = `ppcv2`.`properties_values_id`
  WHERE `ppcv`.`products_properties_combis_id` = `ppcv2`.`products_properties_combis_id`
) as `new_price`
FROM `products_properties_combis` `ppc`
JOIN `products_properties_combis_values` `ppcv`
  ON `ppc`.`products_properties_combis_id` = `ppcv`.`products_properties_combis_id`
WHERE `ppc`.`combi_price_type` = "calc" AND `ppcv`.`options_id` = :optionId AND `ppcv`.`properties_values_id` = :optionValueId
QUERY;
            
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':optionId', $optionId);
            $stmt->bindValue(':optionValueId', $optionValueId);
            $stmt->execute();
            
            while ($row = $stmt->fetch(FetchMode::ASSOCIATIVE)) {
                $price = $this->priceConversionService->getNetPrice((float)$row['new_price'], (int)$row['products_id']);
                
                $db2->createQueryBuilder()
                    ->update('products_properties_combis')
                    ->set('combi_price', $price)
                    ->where('products_properties_combis_id = :combiId')
                    ->setParameter('combiId', $row['products_properties_combis_id'])
                    ->execute();
            }
            
            $db2->commit();
        } catch (Exception $exception) {
            $db2->rollBack();
            
            throw PriceRecalculationFailed::becauseOfException($exception);
        }
    }
}