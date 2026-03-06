<?php
/*--------------------------------------------------------------
   FormattedNumberStringType.php 2020-10-09
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2020 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

/**
 * Class FormattedNumberStringType
 */
class FormattedNumberStringType extends StringType
{
    /**
     * FormattedNumberStringType constructor.
     *
     * @param string $value
     */
    public function __construct(string $value)
    {
        $containsDot = strpos($value, '.') !== false;
        $containsComma = strpos($value, ',') !== false;
        
        if ($containsComma === true && $containsDot === true) {
    
            $value       = str_replace('.', '', $value);
            $containsDot = false;
        }
        
        if ($containsComma === true && $containsDot === false) {
    
            $value = str_replace(',', '.', $value);
        }
        
        parent::__construct($value);
    }
}