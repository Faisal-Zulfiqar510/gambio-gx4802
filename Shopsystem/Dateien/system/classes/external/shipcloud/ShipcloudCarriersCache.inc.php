<?php
/* --------------------------------------------------------------
	ShipcloudCarriersCache.inc.php 2018-09-24
	Gambio GmbH
	http://www.gambio.de
	Copyright (c) 2015 Gambio GmbH
	Released under the GNU General Public License (Version 2)
	[http://www.gnu.org/licenses/gpl-2.0.html]
	--------------------------------------------------------------
*/

class ShipcloudCarriersCache
{
	protected $shipcloudCarriers;
	protected $shipcloudLogger;
	protected $maxCacheAge = 600;

	public function __construct()
	{
		$this->shipcloudCarriers = null;
		$this->shipcloudLogger = MainFactory::create('ShipcloudLogger');
	}
	
	
	/**
	 * Returns list of carrier names.
	 *
	 * @return array|mixed|null|\stdClass
	 */
	public function getCarriers()
	{
		if($this->shipcloudCarriers === null)
		{
			$cacheFile   = DIR_FS_CATALOG . '/cache/shipcloud-carriers-' . LogControl::get_secure_token() . '.pdc';
			if(file_exists($cacheFile) && (int)filemtime($cacheFile) > (time() - $this->getMaxCacheAge()))
			{
				$this->shipcloudCarriers = unserialize(file_get_contents($cacheFile));
			}
			else
			{
				$this->shipcloudCarriers = $this->_retrieveShipcloudCarriers();
				if(!empty($this->shipcloudCarriers))
				{
					file_put_contents($cacheFile, serialize($this->shipcloudCarriers));
				}
			}
		}
		return $this->shipcloudCarriers;
	}

	protected function _retrieveShipcloudCarriers()
	{
		try
		{
			$restService = MainFactory::create('ShipcloudRestService');
			$carriersRequest = MainFactory::create('ShipcloudRestRequest', 'GET', '/v1/carriers');
			$carriersResponse = $restService->performRequest($carriersRequest);
			$carriers = $carriersResponse->getResponseObject();
		}
		catch (Exception $e)
		{
			$this->shipcloudLogger->notice('ERROR - could not retrieve list of carriers: '.$e->getMessage());
			$carriers = array();
		}
		return $carriers;
	}

	public function getCarrier($carrierName)
	{
		$carrier = null;
		foreach($this->getCarriers() as $shipcloudCarrier)
		{
			if($shipcloudCarrier->name === $carrierName)
			{
				$carrier = $shipcloudCarrier;
			}
		}
		return $carrier;
	}
	
	
	/**
	 * @return int
	 */
	public function getMaxCacheAge()
	{
		return $this->maxCacheAge;
	}
	
	
	/**
	 * @param int $maxCacheAge
	 */
	public function setMaxCacheAge($maxCacheAge)
	{
		$this->maxCacheAge = $maxCacheAge;
	}
}
