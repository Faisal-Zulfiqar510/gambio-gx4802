<?php
/* --------------------------------------------------------------
   SpecialOfferCollectionSerializer.inc.php 2018-07-04
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class SpecialOfferCollectionSerializer
 */
class SpecialOfferCollectionSerializer
{
    private $specialOfferSerializer;
    
    
    public function __construct(SpecialOfferSerializer $specialOfferSerializer)
    {
        $this->specialOfferSerializer = $specialOfferSerializer;
    }
    
    
    public function serialize(SpecialOfferCollection $collection)
    {
        $specialOffers = [];
        
        foreach ($collection as $specialOffer) {
            $specialOffers[] = $this->specialOfferSerializer->serialize($specialOffer);
        }
        
        return $specialOffers;
    }
}