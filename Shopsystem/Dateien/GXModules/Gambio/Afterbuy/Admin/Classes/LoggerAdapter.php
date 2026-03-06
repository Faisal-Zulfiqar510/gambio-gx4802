<?php
/* --------------------------------------------------------------
   LoggerAdapter.php 2022-04-21
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/
declare(strict_types=1);


namespace GXModules\Gambio\Afterbuy\Admin\Classes;

use Psr\Log\LoggerInterface;

/**
 * Builds a bridge between Psr\Log\LoggerInterface and AbtractCronjobLogger.
 * 
 * This allows the CronjobTask to hand its logger over to other classes from outside the Gambio Cronjobs domain which
 * implement LoggerAwareInterface.
 */
class LoggerAdapter implements LoggerInterface
{
    public function __construct(\AbstractCronjobLogger $cronjobLogger)
    {
        $this->cronjobLogger = $cronjobLogger;
    }
    
    
    public function emergency($message, array $context = [])
    {
        $this->log(__FUNCTION__, $message, $context);
    }
    
    
    public function alert($message, array $context = [])
    {
        $this->log(__FUNCTION__, $message, $context);
    }
    
    
    public function critical($message, array $context = [])
    {
        $this->log(__FUNCTION__, $message, $context);
    }
    
    
    public function error($message, array $context = [])
    {
        $this->log(__FUNCTION__, $message, $context);
    }
    
    
    public function warning($message, array $context = [])
    {
        $this->log(__FUNCTION__, $message, $context);
    }
    
    
    public function notice($message, array $context = [])
    {
        $this->log(__FUNCTION__, $message, $context);
    }
    
    
    public function info($message, array $context = [])
    {
        $this->log(__FUNCTION__, $message, $context);
    }
    
    
    public function debug($message, array $context = [])
    {
        $this->log(__FUNCTION__, $message, $context);
    }
    
    
    public function log($level, $message, array $context = [])
    {
        if ($level === 'error') {
            $this->cronjobLogger->logError(['message' => $message, 'level' => $level]);
        } else {
            $this->cronjobLogger->log(['message' => $message, 'level' => $level]);
        }
    }
}
