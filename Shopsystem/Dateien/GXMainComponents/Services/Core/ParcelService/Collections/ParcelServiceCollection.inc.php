<?php
/* --------------------------------------------------------------
   ParcelServiceCollection.inc.php 2022-08-05
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class ParcelServiceCollection
 */
class ParcelServiceCollection implements \Countable, \IteratorAggregate
{
    /**
     * @var array
     */
    private $parcelServices = [];
    
    
    /**
     * ParcelServiceCollection constructor.
     *
     * @param array $parcelServices
     */
    public function __construct(array $parcelServices)
    {
        foreach ($parcelServices as $parcelService) {
            $this->add($parcelService);
        }
    }
    
    
    /**
     * Returns a ParcelServiceCollection containing given parcel services.
     *
     * @param array $parcelServices
     *
     * @return \ParcelServiceCollection
     */
    public static function collect(array $parcelServices)
    {
        return MainFactory::create(static::class, $parcelServices);
    }
    
    
    /**
     * Returns the collection as an array.
     *
     * @return array
     */
    public function getArray()
    {
        return $this->parcelServices;
    }
    
    
    /**
     * @return \ArrayIterator|\Traversable
     */
    public function getIterator(): \Traversable
    {
        return new ArrayIterator($this->parcelServices);
    }
    
    
    /**
     * Returns the count of parcel services in the collection.
     *
     * @return int
     */
    public function count(): int
    {
        return count($this->parcelServices);
    }
    
    
    /**
     * Adds a parcel service to the collection.
     *
     * @param \ParcelServiceInterface $parcelService
     */
    protected function add(ParcelServiceInterface $parcelService)
    {
        $this->parcelServices[] = $parcelService;
    }
}
