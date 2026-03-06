<?php
/* --------------------------------------------------------------
   GoogleAnalyticsRefreshServiceOptions.inc.php 2018-06-19
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class GoogleAnalyticsRefreshServiceOptions
 */
class GoogleAnalyticsRefreshServiceOptions implements GoogleAnalyticsRefreshServiceOptionsInterface
{
    /**
     * @var string
     */
    protected $root;
    
    /**
     * @var string
     */
    protected $webServer;
    
    /**
     * @var string
     */
    protected $webServerWithoutProtocol;
    
    
    /**
     * GoogleAnalyticsRefreshServiceOptions constructor.
     *
     * @param ExistingDirectory  $root       Absolute path to the web servers root.
     * @param NonEmptyStringType $webServer  Web path to the server.
     * @param BoolType           $sslEnabled Is SSL enabled?
     */
    public function __construct(ExistingDirectory $root, NonEmptyStringType $webServer, BoolType $sslEnabled)
    {
        $this->root      = $root->getAbsolutePath();
        $this->webServer = $webServer->asString();
        
        $protocol                       = $sslEnabled ? 'https://' : 'http://';
        $this->webServerWithoutProtocol = str_replace($protocol, '', $this->webServer);
    }
    
    
    /**
     * Named constructor of google analytics refresh service options.
     *
     * @param string $root       Absolute path to the web servers root.
     * @param string $webServer  Web path to the server.
     * @param bool   $sslEnabled Is SSL enabled?
     *
     * @return GoogleAnalyticsRefreshServiceOptions New instance.
     */
    public static function create($root, $webServer, $sslEnabled)
    {
        return MainFactory::create(static::class,
                                   new ExistingDirectory($root),
                                   new NonEmptyStringType($webServer),
                                   new BoolType($sslEnabled));
    }
    
    
    /**
     * Returns the absolute path to the web servers root.
     *
     * @return string
     */
    public function root()
    {
        return $this->root;
    }
    
    
    /**
     * Returns the web path to the server.
     *
     * @return string
     */
    public function webServer()
    {
        return $this->webServer;
    }
    
    
    /**
     * Returns the web path to the server without the protocol (https:// or http://).
     *
     * @return string
     */
    public function webServerWithoutProtocol()
    {
        return $this->webServerWithoutProtocol;
    }
}