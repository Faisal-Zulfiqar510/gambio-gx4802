<?php
/* --------------------------------------------------------------
 Environment.php 2021-05-14
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2020 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

declare(strict_types=1);

namespace Gambio\Core\Application\ValueObjects;

/**
 * Class Environment
 *
 * @package Gambio\Core\Application\ValueObjects
 */
class Environment
{
    /**
     * @var bool
     */
    private $isDev;
    
    /**
     * @var bool
     */
    private $isCloud;
    
    
    /**
     * Environment constructor.
     *
     * @param bool $isDev
     * @param bool $isCloud
     */
    public function __construct(bool $isDev, bool $isCloud)
    {
        $this->isDev   = $isDev;
        $this->isCloud = $isCloud;
    }
    
    
    /**
     * Return true if develop mode is active.
     *
     * @return bool
     */
    public function isDev(): bool
    {
        return $this->isDev;
    }
    
    
    /**
     * Return true if current environment is a cloud environment.
     * 
     * @return bool
     */
    public function isCloud(): bool
    {
        return $this->isCloud;
    }
}