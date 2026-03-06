<?php
/* --------------------------------------------------------------
   mpdf_csprng_polyfill.inc.php 2018-09-28
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * These functions are for use in mPDF _ONLY_! Do not use in any other context!
 *
 * This file MUST be removed as soon as the minimum system requirement is raised to PHP 7.x!
 *
 * @todo remove this file
 */

if(!function_exists('random_bytes'))
{
	function random_bytes($numBytes)
	{
		$bytes = false;
		if(function_exists('openssl_random_pseudo_bytes'))
		{
			$strongCrypto = false;
			$bytes        = openssl_random_pseudo_bytes($numBytes, $strongCrypto);
			if($strongCrypto === false)
			{
				$bytes = false;
			}
		}
		if($bytes === false)
		{
			$bytes = str_repeat("\0", $numBytes);
			for($i = 0; $i < $numBytes; $i++)
			{
				$bytes[$i] = chr(mt_rand(0, 254));
			}
		}
		
		return $bytes;
	}
}

if(!function_exists('random_int'))
{
	function random_int($min, $max)
	{
		$integer = false;
		if(function_exists('openssl_random_pseudo_bytes'))
		{
			do {
				$strongCrypto = false;
				$bytes        = openssl_random_pseudo_bytes(8, $strongCrypto);
				if($strongCrypto !== false && $bytes !== false)
				{
					$data         = unpack('qint', $bytes);
					$integer      = $data['int'];
					$integer      %= ($max + 1);
				}
			} while ($integer !== false && ($integer < $min || $integer > $max));
		}
		if(false === $integer)
		{
			$integer = mt_rand($min, $max);
		}
		return $integer;
	}
}

