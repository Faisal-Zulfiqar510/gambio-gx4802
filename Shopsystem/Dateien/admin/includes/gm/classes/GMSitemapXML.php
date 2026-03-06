<?php
/* --------------------------------------------------------------
  GMSitemapXML.php 2023-04-18
  Gambio GmbH
  http://www.gambio.de
  Copyright (c) 2023 Gambio GmbH
  Released under the GNU General Public License (Version 2)
  [http://www.gnu.org/licenses/gpl-2.0.html]

   IMPORTANT! THIS FILE IS DEPRECATED AND WILL BE REPLACED IN THE FUTURE.
   MODIFY IT ONLY FOR FIXES. DO NOT APPEND IT WITH NEW FEATURES, USE THE
   NEW GX-ENGINE LIBRARIES INSTEAD.
  --------------------------------------------------------------
 */

require_once(DIR_FS_CATALOG . 'gm/inc/gm_get_language.inc.php');

/*
 * Class to create a google sitemaps
 * for all available languages
 */
class GMSitemapXML_ORIGIN
{
	/**
	 * list of all urls from products, that have already been exported
	 * @var array
	 */
	protected $exportedUrls = [];
	
	/**
	 * option to export a product url only once
	 * @var bool
	 */
	protected $exportUrlOnlyOnce = false;

	/*
	 * languages
	 */
	protected $languages;

	/*
	 * default changefreq
	 */
	protected $changefreq;

	/*
	 * default priority
	 */
	protected $priority;

	/*
	 * count generated links
	 */
	protected $link_counter;

	/*
	 * object for SEF Urls
	 */
	protected $coo_seo_boost;
	
	/*
	 * object for data caching
	 */
	protected $coo_data_cache;

	/*
	 * kind of xml encoding - e.g. 'UTF-8', 'ISO-8859-1', etc.
	 */
	protected $xml_encoding = 'UTF-8';

	/*
	 * kind of the xml version
	 */
	protected $xml_version = '1.0';

	/*
	 * export directory
	 */
	protected $path = 'public';

	/*
	 * filename
	 */
	protected $filename = 'sitemap-%s.xml';

	/*
	 * use language code in urls
	 */
	protected $useSeoBoostLanguageCode;

	/*
	 * suppress index.php in startpage url
	 */
	protected $suppressIndexInUrl;

	/*
	 * Default constructor
	 */
	public function __construct()
	{
		$this->_getLanguages();

		$this->changefreq 				= gm_get_conf('GM_SITEMAP_GOOGLE_CHANGEFREQ');
		$this->priority 				= gm_get_conf('GM_SITEMAP_GOOGLE_PRIORITY');
		$this->useSeoBoostLanguageCode 	= gm_get_conf('USE_SEO_BOOST_LANGUAGE_CODE');
		$this->suppressIndexInUrl 		= gm_get_conf('SUPPRESS_INDEX_IN_URL');

		$this->coo_seo_boost	 		= MainFactory::create_object('GMSEOBoost', [], true);
		$this->coo_data_cache 			= DataCache::get_instance();
	}
	
	
	/**
	 * Sets the value for the "export url only once" option
	 * @param $value
	 */
	public function setExportUrlOnlyOnce($value)
	{
		$this->exportUrlOnlyOnce = $value;
	}

	/*
	 * Process sitemap creation
	 */
    public function generate($isCronJob = false)
    {
        $urls = [];
        $returnStr = '';
        $sitemaps = [];
        
        // Get data from cache
        if ($this->coo_data_cache->key_exists('sitemap_cache_data', true)) {
            $cache = $this->coo_data_cache->get_data('sitemap_cache_data', true);
        }
        
        // Loop thru languages and collect url data
        foreach ($cache['data'] as $languageId => $categoryUrls) {
            
            $this->exportedUrls = [];
            $urls = [];
            
            // Add Static pages
            $urls[] = $this->getStaticUrls($languageId);
            
            // Add Contents
            $urls[] = $this->getContentUrls($languageId);
            
            // Add products with no categorie
            $urls[] = $this->getProductUrls($languageId, 0);
            
            // Add Category tree with products
            $urls[] = $categoryUrls;

            $urls = array_merge(...$urls);
            
            
            // Split into chunks of 50000 URLs
            
            $urls = array_chunk($urls, 50000);
            
            $count = 1;
            foreach ($urls as $url) {
                // Generate xml from array
                $xml = $this->getXml($url);
                
                
                // Save sitemap file for each language
                $filename = sprintf($this->filename, $this->languages[$languageId]['code']);
                $pathinfo = pathinfo($filename);
                
                $filename = $pathinfo['filename'].'_'.$count.'.'.$pathinfo['extension'];
                
                $this->save($xml, $filename);
                
                // Count for alert message
                $sitemaps[$filename] = count($this->exportedUrls);
                
                $count++;
            }
            
            
            
        }
        
        // Clear cache data
        $this->coo_data_cache->clear_cache('sitemap_cache_data', true);
        
        $sitemap_index = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
        $sitemap_index .= "<sitemapindex xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n";
        
        foreach ($sitemaps as $key => $value) {
	        $sitemap_index .= "<sitemap>\n";
	        $sitemap_index .= "<loc>" . HTTP_SERVER . DIR_WS_CATALOG . 'public/' . $key . "</loc>\n";
	        $sitemap_index .= "<lastmod>" . date(DateTime::RFC3339, time()) . "</lastmod>\n";
	        $sitemap_index .= "</sitemap>\n";
        }
        
        $sitemap_index .= "</sitemapindex>";
        
        $fp = fopen(DIR_FS_CATALOG . $this->path . '/sitemap_index.xml', 'w+');
        fwrite($fp, $sitemap_index);
        fclose($fp);
        $sitemaps['sitemap_index.xml'] = count($this->exportedUrls);
        
        if(!$isCronJob)
        {
            // return alert message
            $returnStr = TITLE_SITEMAP_CREATED;
            foreach ($sitemaps as $file => $count) {
                $returnStr .=  sprintf(TITLE_SITEMAP_CREATED2, $count, '<a href="' . HTTP_SERVER . DIR_WS_CATALOG . $this->path . '/' . $file . '" target="_blank">' . $file . '</a><br />');
            }
        }
        
        
        return $returnStr;
    }

	/*
	 * Collect category urls with its
	 * subcategories and assigned products;
	 * Process one main category each call
	 */
	public function prepare()
	{

		// Get data from cache
		if($this->coo_data_cache->key_exists('sitemap_cache_data', true))
		{
			$cache = $this->coo_data_cache->get_data('sitemap_cache_data', true);
		}
		// Get data from cache
		if($this->coo_data_cache->key_exists('sitemap_cache_categories', true))
		{
			$categoriesList = $this->coo_data_cache->get_data('sitemap_cache_categories', true);
		} else {
            $categoriesList = $this->prepareCategoriesList();
            $this->coo_data_cache->set_data('sitemap_cache_categories', $categoriesList, true);
        }

		// Create data array if cache does not exist
		if(empty($cache) || empty($cache['offset']))
		{
			$this->coo_data_cache->clear_cache('sitemap_cache_data');
			$cache = [
				'data' => [],
				'offset' => 0
			];
		}
        $step = $this->_getCategoriesBatchSize();
		// Loop thru languages
		foreach($this->languages as $languageId => $language)
		{
		    if(!isset($cache['data'][$languageId])){
                $cache['data'][$languageId] = [];
            }
			// Get categories
            $urls = $this->getCategoryUrls($categoriesList[$languageId], $cache['offset'], $step);
            $cache['data'][$languageId] = array_merge($cache['data'][$languageId], $urls);
		}
        $cache['offset'] += $step;

		// Write cache
		$this->coo_data_cache->set_data('sitemap_cache_data', $cache, true);

		if(empty(end($urls))){
            $this->coo_data_cache->clear_cache('sitemap_cache_categories');
            return true;
        } else {
            return false;
        }
	}

	/*
	 * Save sitemap file in root directory
	 */
	protected function save($xml, $filename)
	{
		$fp = fopen(DIR_FS_CATALOG . $this->path . '/' . $filename, 'w');
		fwrite($fp, $xml);
		fclose($fp);
		return $filename;
	}

	/*
	 * Create XML code from url array
	 */
	protected function getXml($urls)
	{
		$xml  = '<?xml version="' . $this->xml_version . '" encoding="' . $this->xml_encoding . '"?>' . PHP_EOL;
		$xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" '
		          . 'xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" '
		          . 'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">' . PHP_EOL;

		foreach($urls as $url)
		{
			if(!in_array($url['link'], $this->exportedUrls) || !$this->exportUrlOnlyOnce)
			{
				$xml .= '<url>' . PHP_EOL;
				$xml .= '<loc>' . $url['link'] . '</loc>' . PHP_EOL;
				if(xtc_not_null($url['last_mod']) || xtc_not_null($url['date_added']))
				{
					$xml .= '<lastmod>' . $this->_getDate($url['last_mod'], $url['date_added'] ?? null) . '</lastmod>'
					        . PHP_EOL;
				}
				$xml .= '<changefreq>' . $this->_getChangefreq($url['changefreq']) . '</changefreq>' . PHP_EOL;
				$xml .= '<priority>' . $this->_getPriority($url['priority']) . '</priority>' . PHP_EOL;
                if(isset($url['images']))
                {
                    foreach($url['images'] as $image)
                    {
	                    $xml .= '<image:image>' . PHP_EOL;
	                    $xml .= '<image:loc>' . $image['url'] . '</image:loc>' . PHP_EOL;
	                    if(!empty($image['title']))
	                    {
		                    $xml .= '<image:title>' . htmlspecialchars_wrapper($image['title']) . '</image:title>' . PHP_EOL;
		                    $xml .= '<image:caption>' . htmlspecialchars_wrapper($image['title']) . '</image:caption>' . PHP_EOL;
	                    }
	                    $xml .= '</image:image>' . PHP_EOL;
                    }
                }
				$xml .= '</url>' . PHP_EOL;
				$this->exportedUrls[] = $url['link'];
			}
		}

		$xml .= '</urlset>';

		return $xml;
	}

	/*
	 * Get Array with static urls for given language
	 */
	protected function getStaticUrls($language = 2)
	{
		$urls = [];

		// Add index to sitemap
		// Cannot use FILENAME_DEFAULT because it has another value in backend
		$urlParts = [];
		$trailingSlash = '/';
		if($this->useSeoBoostLanguageCode === 'true')
		{
			$urlParts[] = $this->languages[$language]['code'];
		}
		if($this->suppressIndexInUrl !== 'true')
		{
			$urlParts[] = 'index.php';
			$trailingSlash = '';
		}
		if(empty($urlParts))
		{
			$trailingSlash = '';
		}
		$startPageUrl = implode('/', $urlParts) . $trailingSlash;
		$urls[] = [
			'name' => 'Index',
			'link' => gm_xtc_href_link($startPageUrl,'','SSL',false,true,true),
			'last_mod' => time(),
			'changefreq' => $this->changefreq,
			'priority' => $this->priority
		];

		// Add static seo urls to sitemap
		$query = xtc_db_query('
			SELECT `name`, `changefreq`, `priority`
			FROM `static_seo_urls`
			WHERE `sitemap_entry` = 1
		');
		while($data = xtc_db_fetch_array($query))
		{
			$link = ($this->useSeoBoostLanguageCode === 'true')
				? gm_xtc_href_link(sprintf('%s/%s', $this->languages[$language]['code'], $data['name']),'','SSL',false,true,true)
				: gm_xtc_href_link($data['name'],'','SSL',false,true,true);
			$urls[] = [
				'name' => $data['name'],
				'link' => $link,
				'last_mod' => time(),
				'changefreq' => $this->_getChangefreq($data['changefreq']),
				'priority' => $this->_getPriority($data['priority'])
			];
		}

		return $urls;
	}

	/*
	 * Get urls from content manager for given language
	 */
	protected function getContentUrls($language = 2)
	{
		$urls = [];

		$query = xtc_db_query('
			SELECT
				' . ($this->coo_seo_boost->boost_content ? 'content_id' : 'content_group')  . ' AS id,
				gm_priority							AS priority,
				gm_changefreq						AS changefreq,
				content_title						AS heading,
				content_heading						AS name,
				gm_url_keywords						AS keyword,
				UNIX_TIMESTAMP(gm_last_modified)	AS last_mod
			FROM ' . TABLE_CONTENT_MANAGER . '
			WHERE
				languages_id = ' . $language . ' AND
				file_flag != 4 ' . $this->_getGroupCheck('content') . ' AND
				content_status = 1 AND
				gm_sitemap_entry = 1 AND
				content_position LIKE "pages_%" AND
				(gm_link = "" OR gm_link IS NULL)
			ORDER BY sort_order
		');

		while($data = xtc_db_fetch_array($query))
		{

			// Create link
			if($this->coo_seo_boost->boost_content)
			{
				$data['link'] = gm_xtc_href_link($this->coo_seo_boost->get_boosted_content_url($data['id'], $language),'','SSL',false,true,true);
			}
			else
			{
				if(defined('SEARCH_ENGINE_FRIENDLY_URLS') && SEARCH_ENGINE_FRIENDLY_URLS === 'true')
				{
					$seoParam = '&content=' . xtc_cleanName($data['name']);
				}
				
				$queryString = isset($seoParam) ? "coID={$data['id']}{$seoParam}" : "coID={$data['id']}";
				
				if ($this->_shopHasMultipleLanguages()) {
                    $queryString .= "&language={$this->languages[$language]['code']}";
                }
				$data['link'] = htmlspecialchars(gm_xtc_href_link('shop_content.php', $queryString));
			}
			$urls[] = $data;
		}

		return $urls;
	}

	public function prepareCategoriesList(){
        $query = xtc_db_query("SELECT
                                        c.categories_id                 AS id,
                                        c.gm_priority                   AS priority,
                                        c.gm_changefreq                 AS changefreq,
                                        c.categories_image              AS image,
                                        c.parent_id                     AS parent_id,
                                        UNIX_TIMESTAMP(c.last_modified) AS last_mod,
                                        UNIX_TIMESTAMP(c.date_added)    AS date_added,
                                        c.categories_name               AS name,
                                        c.gm_url_keywords               AS keyword,
                                        c.gm_alt_text                   AS image_alt_text,
                                        c.language_id
                                
                                FROM    (SELECT
                                             x.categories_id,
                                             x.gm_priority,
                                             x.gm_changefreq,
                                             x.categories_image,
                                             x.parent_id,
                                             x.last_modified,
                                             x.date_added,
                                             cd.categories_name,
                                             cd.gm_url_keywords,
                                             cd.gm_alt_text,
                                             cd.language_id
                                         FROM  categories x
                                         LEFT JOIN categories_description cd
                                         ON    x.categories_id = cd.categories_id
                                         WHERE x.categories_status = 1
                                         AND   x.gm_sitemap_entry  = 1
                                         ORDER BY x.parent_id, x.categories_id, cd.language_id
                                
                                ) c, (select @pv := '0') initialisation"
        );
        $data = [];

        while($record = xtc_db_fetch_array($query))
        {
            $data[$record['language_id']][] = $record;
        }
        return $data;
    }

	/*
	 * Get urls category and product urls recursively
	 * by given language and parent
	 */
	protected function getCategoryUrls($categories, $offset = 0, $limit = 5)
	{
		$urls = [];
		$last_index = count($categories) -1;
        $last_index = ($limit + $offset -1) > $last_index ? $last_index : $limit + $offset - 1;


		for ($i = $offset; $i <= $last_index; $i++){
		    $data = $categories[$i];
            // Add images
            if(!empty($data['image']))
            {
                $data['images'][] = [
                    'url'   => HTTP_SERVER . DIR_WS_CATALOG . 'images/categories/' . rawurlencode($data['image']),
                    'title' => $data['image_alt_text'],
                ];
            }

            // Create link
            if($this->coo_seo_boost->boost_categories)
            {
                $data['link'] = gm_xtc_href_link($this->coo_seo_boost->get_boosted_category_url($data['id'], $data['language_id']),'','SSL',false,true,true);
            }
            else
            {
                $data['link'] = gm_xtc_href_link('index.php', xtc_category_link($data['id'], ($data['keyword'] ?: $data['name'])),'SSL',false,true,true);
            }
            $urls[] = [$data];

            // Get nested products
            $urls[] = $this->getProductUrls($data['language_id'], $data['id']);

        }

	    return count($urls) ? array_merge(...$urls) : [];
	}

	/*
	 * Get product urls of given category and language
	 */
	protected function getProductUrls($language = 2, $parent_id = 0)
	{
		$urls = [];

		$query = xtc_db_query('
			SELECT
				p.products_id									AS id,
				p.gm_priority									AS priority,
				p.gm_changefreq									AS changefreq,
				p.products_image                                AS image,
				UNIX_TIMESTAMP(p.products_last_modified)		AS last_mod,
				UNIX_TIMESTAMP(p.products_date_added)			AS date_added,
				pd.products_name								AS name,
				pd.gm_url_keywords								AS keyword,
				pd.gm_alt_text								    AS image_alt_text
			FROM ' . TABLE_PRODUCTS . ' p
			LEFT JOIN ' . TABLE_PRODUCTS_DESCRIPTION . ' pd ON p.products_id = pd.products_id
			LEFT JOIN ' . TABLE_PRODUCTS_TO_CATEGORIES . ' ptc ON p.products_id = ptc.products_id
			WHERE
				pd.language_id = ' . $language . ' AND
				p.products_status = 1 AND
				ptc.categories_id = ' . $parent_id . ' AND
				p.gm_sitemap_entry = 1
				' .	$this->_getGroupCheck('p') . '
			ORDER BY p.products_sort, pd.products_name
		');

		while($data = xtc_db_fetch_array($query))
		{
			
			// Add images
			if(!empty($data['image']))
			{
				$first_image = [
					'url'   => HTTP_SERVER . DIR_WS_CATALOG . 'images/product_images/popup_images/' . rawurlencode($data['image']),
					'title' => $data['image_alt_text'],
				];
				$data['images'] = $this->_getFurtherProductImages($data['id'], $language);
				array_unshift($data['images'], $first_image);
			}
			
			// Create link
			if($this->coo_seo_boost->boost_products)
			{
				$data['link'] = gm_xtc_href_link($this->coo_seo_boost->get_boosted_product_url($data['id'], $data['name'], $language, $data['gm_url_keywords'] ?? ''),'','SSL',false,true,true);
			}
			else
			{
			    $queryString = xtc_product_link($data['id'], ($data['keyword'] ?: $data['name']));
			    
			    if ($this->_shopHasMultipleLanguages()) {
			        $queryString .= "&language={$this->languages[$language]['code']}";
                }
			    
			    $link = gm_xtc_href_link('product_info.php', $queryString,'SSL',false,true,true);
				$data['link'] = htmlentities($link);
			}
			$urls[] = $data;
		}

		return $urls;
	}
	
	/*
	 * Returns all images from the table product_images
	 */
	protected function _getFurtherProductImages($productId, $language = 2)
	{
		$images = [];
		$query  = xtc_db_query('
			SELECT
				pi.image_name       AS image,
				pia.gm_alt_text     AS image_alt_text
			FROM ' . TABLE_PRODUCTS_IMAGES. ' pi
			LEFT OUTER JOIN gm_prd_img_alt pia ON (pia.image_id = pi.image_id AND
													pia.products_id = ' . (int)$productId . ' AND
													pia.language_id = ' . (int)$language . ')
			WHERE
				pi.products_id = ' . (int)$productId
		);
		
		while($image = xtc_db_fetch_array($query))
		{
			$images[] = [
				'url'   => HTTP_SERVER . DIR_WS_CATALOG . 'images/product_images/popup_images/' . rawurlencode($image['image']),
				'title' => $image['image_alt_text'],
			];
		}
		
		return $images;
	}

	protected function _getChangefreq($changeFreq)
	{
		if(empty($changeFreq))
		{
			$changeFreq = $this->changefreq;
		}
		return $changeFreq;
	}

	protected function _getPriority($priority)
	{
		if(empty($priority))
		{
			$priority = $this->priority;
		}
		return $priority;
	}

	protected function _getGroupCheck($type)
	{
		$groupCheck = '';
		if(GROUP_CHECK == 'true')
		{
			if($type == 'content')
			{
				$groupCheck = " AND group_ids LIKE '%c_1_group%'";
			}
			else
			{
				$groupCheck = " AND " . $type . ".group_permission_1=1 ";
			}
		}
		return $groupCheck;
	}

	protected function _getDate($lastMod, $dateAdded)
	{
		if(!empty($lastMod))
		{
			return date('Y-m-d', $lastMod);
		}
		elseif(!empty($dateAdded))
		{
			return date('Y-m-d', $dateAdded);
		}
		else
		{
			return date('Y-m-d');
		}
	}
	
	
	protected function _getLanguages()
	{
		$languages = gm_get_language();
		foreach($languages as $language)
		{
			if($language['status'] !== '1')
			{
				continue;
			}
			
			$this->languages[$language['languages_id']] = $language;
		}
	}

    /**
     * @return int
     */
	protected function _getCategoriesBatchSize()
    {
        return 1;
    }
    
    /*
     * The check if the language is active it is already being made
     * by "_getLanguages()" method
     *
     * return bool
     */
    protected function _shopHasMultipleLanguages()
    {
        return count($this->languages) > 1;
    }
}

MainFactory::load_origin_class('GMSitemapXML');
