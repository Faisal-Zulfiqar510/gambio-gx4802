<?php
/* --------------------------------------------------------------
   StringHelper.inc.php 2015-12-14
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2015 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

MainFactory::load_class('StringHelperInterface');
MainFactory::load_class('CrossCuttingObjectInterface');

/**
 * Class StringHelper
 *
 * @category   System
 * @package    Extensions
 * @subpackage Helpers
 * @implements StringHelperInterface, CrossCuttingObjectInterface
 */
class StringHelper implements StringHelperInterface, CrossCuttingObjectInterface
{
    /**
     * Converts NULL values to empty string inside an array
     *
     * @param array $array
     *
     * @return array
     */
    public function convertNullValuesToStringInArray(array $array)
    {
        foreach ($array as $key => $value) {
            if ($value === null) {
                $array[$key] = (string)$value;
            }
        }
        
        return $array;
    }
    
    
    /**
     * Returns a cleaned filename by removing or replacing invalid characters.
     *
     * @param string $p_filename
     *
     * @return string cleaned filename
     * @throws InvalidArgumentException if $p_filename is not a string
     *
     */
    public function correctToValidFilename($p_filename)
    {
        if (!is_string($p_filename)) {
            throw new InvalidArgumentException('$p_filename is not a string (' . gettype($p_filename) . ')');
        }
        
        $search   = 'ÁáÉéÍíÓóÚúÇçÃãÀàÂâÊêÎîÔôÕõÛû&ŠŽšžŸÀÁÂÃÅÇÈÉÊËÌÍÎÏÑÒÓÔÕØÙÚÛÝàáâãåçèéêëìíîïñòóôõøùúûýÿ ';
        $replace  = 'AaEeIiOoUuCcAaAaAaEeIiOoOoUueSZszYAAAAACEEEEIIIINOOOOOUUUYaaaaaceeeeiiiinooooouuuyy_';
        $filename = strtr($p_filename, $search, $replace);
        
        $replacePairs = [
            'ä'       => 'ae',
            'Ä'       => 'Ae',
            'ö'       => 'oe',
            'Ö'       => 'Oe',
            'ü'       => 'ue',
            'Ü'       => 'Ue',
            '&auml;'  => 'ae',
            '&Auml;'  => 'Ae',
            '&ouml;'  => 'oe',
            '&Ouml;'  => 'Oe',
            '&uuml;'  => 'ue',
            '&Uuml;'  => 'Ue',
            'ß'       => 'ss',
            '&szlig;' => 'ss'
        ];
        $filename     = strtr($filename, $replacePairs);
        
        $filename = preg_replace('/[^\w\d_,\(\)\.\- ]+/', '', $filename);
        
        return $filename;
    }
}
