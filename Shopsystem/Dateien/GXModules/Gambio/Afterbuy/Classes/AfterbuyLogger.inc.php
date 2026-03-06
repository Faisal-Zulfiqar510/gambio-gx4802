<?php
/* --------------------------------------------------------------
   AfterbuyLogger.inc.php 2022-10-10
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

use Gambio\Core\Logging\LoggerBuilder;
use Psr\Log\LoggerInterface;

class AfterbuyLogger implements LoggerInterface
{
    public const LOGFILE = 'afterbuy';
    
    private string $minLogLevel;
    
    private const logLevels = ['debug', 'info', 'notice', 'warning', 'error', 'critical', 'alert', 'emergency'];
    
    /**
     * @var \Psr\Log\LoggerInterface
     */
    protected $logger;
    
    
    public function __construct(?string $minimumLogLevel = null)
    {
        $this->logger = static::makeLogger();
        if ($minimumLogLevel === null) {
            $configuration = new GambioAfterbuyConfigurationStorage();
            $this->minLogLevel = $configuration->get('minimum_log_level');
        } else {
            $this->minLogLevel = $minimumLogLevel;
        }
    }
    
    
    public static function createLogger(?string $minimumLogLevel = null): LoggerInterface
    {
        return new static($minimumLogLevel);
    }
    
    
    private static function makeLogger(): LoggerInterface
    {
        /** @var LoggerBuilder $loggerBuilder */
        $loggerBuilder = LegacyDependencyContainer::getInstance()->get(LoggerBuilder::class);
        
        return $loggerBuilder->omitRequestData()->changeNamespace(static::LOGFILE)->build();
    }
    
    
    public function notice($message, $context = [])
    {
        $this->log(__FUNCTION__, $message, $context);
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
        $messageLevel = (int)array_search($level, static::logLevels, true);
        $minLevel     = (int)array_search($this->minLogLevel, static::logLevels, true);
        //$message = "|$minLevel|$messageLevel|{$this->minLogLevel}| $message";
        if ($messageLevel >= $minLevel) {
            $this->logger->log($level, $message, $context);
        }
    }
}
