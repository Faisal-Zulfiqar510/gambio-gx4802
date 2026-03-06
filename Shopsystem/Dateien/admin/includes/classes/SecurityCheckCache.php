<?php
/* --------------------------------------------------------------
  SecurityCheckCache.php 2019-10-16
  Gambio GmbH
  http://www.gambio.de
  Copyright (c) 2019 Gambio GmbH
  Released under the GNU General Public License (Version 2)
  [http://www.gnu.org/licenses/gpl-2.0.html]
  --------------------------------------------------------------*/

/**
 * Class SecurityCheckCache
 */
class SecurityCheckCache
{
    /**
     * @var string
     */
    protected $cacheDirectory;
    
    /***
     * @var string
     */
    protected $cacheFile;
    
    /**
     * @var string
     */
    protected $userAgent;
    
    
    /**
     * SecurityCheckCache constructor.
     *
     * @param string $userAgent
     */
    public function __construct(string $userAgent)
    {
        $this->userAgent      = $userAgent;
        $this->cacheDirectory = dirname(__DIR__, 3) . DIRECTORY_SEPARATOR . 'cache';
        $this->cacheFile      = $this->cacheDirectory . DIRECTORY_SEPARATOR . md5($userAgent) . '.md5';
    }
    
    
    /**
     * @return bool
     * @throws Exception
     */
    public function validCacheFileExists(): bool
    {
        if (file_exists($this->cacheFile()) === false) {
            
            return false;
        }
        
        $cacheFileTimeStampUnix = filemtime($this->cacheFile());
        $cacheFileTime          = new DateTime(date('Y-m-d H:i:s', $cacheFileTimeStampUnix));
        $currentTime            = new DateTime;
        
        $interval = $cacheFileTime->diff($currentTime);
        
        //  The file is not 1 day or older
        return $interval->d === 0;
    }
    
    
    /**
     * creating a file in the cache directory so this security_check is only executed once a day
     * or only after executing an update
     */
    public function storeCacheFile(): void
    {
        file_put_contents($this->cacheFile(), md5(date('Y-m-d H:i:s')));
    }
    
    
    public function deleteCacheFile(): void
    {
        if (file_exists($this->cacheFile())) {
            
            unlink($this->cacheFile());
        }
    }
    
    
    /**
     * @return string
     */
    public function cacheFile(): string
    {
        return $this->cacheFile;
    }
}