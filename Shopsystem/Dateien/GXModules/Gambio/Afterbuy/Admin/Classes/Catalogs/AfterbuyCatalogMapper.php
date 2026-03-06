<?php
/* --------------------------------------------------------------
   AfterbuyCatalogMapper.php 2022-10-06
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/
declare(strict_types=1);


namespace GXModules\Gambio\Afterbuy\Admin\Classes\Catalogs;

use GXModules\Gambio\Afterbuy\Admin\Classes\Catalogs\ValueObjects\AfterbuyCatalog;

class AfterbuyCatalogMapper
{
    public static function createAfterbuyCatalogFromXml(\SimpleXMLElement $catalogXml): AfterbuyCatalog
    {
        return new AfterbuyCatalog(
            (int)$catalogXml->CatalogID,
            (int)$catalogXml->ParentID,
            (string)$catalogXml->Name,
            (string)$catalogXml->Description,
            (int)$catalogXml->Level,
            (int)$catalogXml->Position,
            (string)$catalogXml->AdditionalText,
            ((int)$catalogXml->Show === 1),
            (string)$catalogXml->Picture1,
            (string)$catalogXml->Picture2,
            (string)$catalogXml->TitlePicture
        );
    }
}