<?php
/* --------------------------------------------------------------
   FeaturedProductRepository.inc.php 2019-09-04
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2019 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class FeaturedProductRepository
 */
class FeaturedProductRepository implements FeaturedProductRepositoryInterface
{
    /**
     * @var FeaturedProductReaderInterface
     */
    private $reader;
    
    
    /**
     * FeaturedProductRepository constructor.
     *
     * @param FeaturedProductReaderInterface $reader
     */
    public function __construct(FeaturedProductReaderInterface $reader)
    {
        $this->reader = $reader;
    }
    
    
    /**
     * Get Offers by given product id.
     *
     * @param FeaturedProductSettings $settings
     *
     * @return FeaturedProductCollection
     */
    public function getOfferedProducts(FeaturedProductSettings $settings)
    {
        return $this->reader->getOfferedProducts($settings);
    }
    
    
    /**
     * get top products by given product id.
     *
     * @param FeaturedProductSettings $settings
     *
     * @return FeaturedProductCollection
     */
    public function getTopProducts(FeaturedProductSettings $settings)
    {
        return $this->reader->getTopProducts($settings);
    }
    
    
    /**
     * get upcoming products by given id and date.
     *
     * @param FeaturedProductSettings $settings
     *
     * @return FeaturedProductCollection
     */
    public function getUpcomingProducts(FeaturedProductSettings $settings)
    {
        return $this->reader->getUpcomingProducts($settings);
    }
    
    
    /**
     * get new products by given id.
     *
     * @param FeaturedProductSettings $settings
     *
     * @return FeaturedProductCollection
     */
    public function getNewProducts(FeaturedProductSettings $settings)
    {
        return $this->reader->getNewProducts($settings);
    }
    
    
    /**
     * get products by category id.
     *
     * @param FeaturedProductSettings $settings
     *
     * @param IntType                 $categoryId
     *
     * @return FeaturedProductCollection
     */
    public function getProductsByCategoryId(FeaturedProductSettings $settings, IntType $categoryId)
    {
        return $this->reader->getProductsByCategoryId($settings, $categoryId);
    }
}