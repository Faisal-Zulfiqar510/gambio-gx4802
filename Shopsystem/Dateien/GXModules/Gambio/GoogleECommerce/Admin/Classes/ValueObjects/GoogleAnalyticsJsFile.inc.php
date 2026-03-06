<?php
/* --------------------------------------------------------------
   GoogleAnalyticsJsFile.inc.php 2018-06-15
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class GoogleAnalyticsJsFile
 */
class GoogleAnalyticsJsFile implements GoogleAnalyticsJsFileInterface
{
    /**
     * @var string
     */
    private $type;
    
    /**
     * @var string
     */
    private $scriptUrl;
    
    /**
     * @var array
     */
    private static $allowedTypes = ['gtag', 'analytics', 'ec-plugin'];
    
    
    /**
     * GoogleAnalyticsJsFile constructor.
     *
     * @param string $type      Google analytics js file type.
     * @param string $scriptUrl Url of js file source.
     *
     * @throws InvalidAnalyticsJsFileType If provided type is not allowed.
     */
    public function __construct($type, $scriptUrl)
    {
        if (!in_array($type, static::$allowedTypes, true)) {
            throw new InvalidAnalyticsJsFileType('Provided analytics js file type "' . $type
                                                 . '" is not allowed. Allowed types are "' . implode('", "',
                                                                                                     static::$allowedTypes)
                                                 . '".');
        }
        $this->type      = $type;
        $this->scriptUrl = $scriptUrl;
    }
    
    
    /**
     * Creates an gtag js file type.
     *
     * @param GoogleAnalyticsUaTrackingCode $trackingCode UA Tracking code, required to fetch js source.
     *
     * @return GoogleAnalyticsJsFile
     */
    public static function gtag(GoogleAnalyticsUaTrackingCode $trackingCode)
    {
        return MainFactory::create(static::class,
                                   'gtag',
                                   'https://www.googletagmanager.com/gtag/js?id=' . $trackingCode->code());
    }
    
    
    /**
     * Creates an analytics js file type.
     *
     * @return GoogleAnalyticsJsFile
     */
    public static function analytics()
    {
        return MainFactory::create(static::class, 'analytics', 'https://www.google-analytics.com/analytics.js');
    }
    
    
    /**
     * Creates an e-commerce plugin js file type.
     *
     * @return GoogleAnalyticsJsFile
     */
    public static function ecPlugin()
    {
        return MainFactory::create(static::class, 'ec-plugin', 'https://www.google-analytics.com/plugins/ua/ec.js');
    }
    
    
    /**
     * Returns the google analytics javascript file type (gtag, analytics, ec-plugin).
     *
     * @return string
     */
    public function type()
    {
        return $this->type;
    }
    
    
    /**
     * Returns the source url of the analytics file.
     *
     * @return string
     */
    public function sourceUrl()
    {
        return $this->scriptUrl;
    }
}