<?php
/* --------------------------------------------------------------
   GoogleAnalyticsUaTrackingCode.inc.php 2018-04-05
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

class GoogleAnalyticsUaTrackingCode
{
    private $code;
    
    
    private function __construct($code)
    {
        $this->validateTrackingCode($code);
        $this->code = $code;
    }
    
    
    public static function create($code)
    {
        return new static($code);
    }
    
    
    public function code()
    {
        return $this->code;
    }
    
    
    protected function validateTrackingCode($code)
    {
        $regex = '/^ua-\d{4,9}-\d{1,4}$/i';
        
        if (!preg_match($regex, strval($code))) {
            throw new InvalidUaTrackingCodeFormatException('Format of provided UA Tracking Code "' . $code
                                                           . '" is invalid!');
        }
    }
}