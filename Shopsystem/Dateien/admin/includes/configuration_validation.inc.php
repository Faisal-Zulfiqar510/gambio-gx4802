<?php
/* --------------------------------------------------------------
   configuration_validation.inc.php 2020-09-21
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2020 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]

   IMPORTANT! THIS FILE IS DEPRECATED AND WILL BE REPLACED IN THE FUTURE. 
   MODIFY IT ONLY FOR FIXES. DO NOT APPEND IT WITH NEW FEATURES, USE THE
   NEW GX-ENGINE LIBRARIES INSTEAD.		
   --------------------------------------------------------------
*/

function validate_configuration_value($p_key, $p_value, $p_return_error_message = true)
{
	$t_validity = true;
	$t_error_message = '';
	
	switch($p_key)
	{
		case 'IMAGE_QUALITY':
			if (!is_numeric($p_value) || $p_value < 0 || $p_value > 100)
			{
				$t_validity = false;
				$t_error_message = ERROR_IMAGE_QUALITY;
			}
			break;
		case 'MO_PICS':
			if (!is_numeric($p_value) || $p_value < 0)
			{
				$t_validity = false;
				$t_error_message = ERROR_MO_PICS;
			}
			break;
		case 'PRODUCT_IMAGE_THUMBNAIL_WIDTH':
			if (!is_numeric($p_value) || $p_value < 0)
			{
				$t_validity = false;
				$t_error_message = ERROR_PRODUCT_IMAGE_THUMBNAIL_WIDTH;
			}
			break;
		case 'PRODUCT_IMAGE_THUMBNAIL_HEIGHT':
			if (!is_numeric($p_value) || $p_value < 0)
			{
				$t_validity = false;
				$t_error_message = ERROR_PRODUCT_IMAGE_THUMBNAIL_HEIGHT;
			}
			break;
		case 'PRODUCT_IMAGE_INFO_WIDTH':
			if (!is_numeric($p_value) || $p_value < 0)
			{
				$t_validity = false;
				$t_error_message = ERROR_PRODUCT_IMAGE_INFO_WIDTH;
			}
			break;
		case 'PRODUCT_IMAGE_INFO_HEIGHT':
			if (!is_numeric($p_value) || $p_value < 0)
			{
				$t_validity = false;
				$t_error_message = ERROR_PRODUCT_IMAGE_INFO_HEIGHT;
			}
			break;
		case 'PRODUCT_IMAGE_POPUP_WIDTH':
			if (!is_numeric($p_value) || $p_value < 0)
			{
				$t_validity = false;
				$t_error_message = ERROR_PRODUCT_IMAGE_POPUP_WIDTH;
			}
			break;
		case 'PRODUCT_IMAGE_POPUP_HEIGHT':
			if (!is_numeric($p_value) || $p_value < 0)
			{
				$t_validity = false;
				$t_error_message = ERROR_PRODUCT_IMAGE_POPUP_HEIGHT;
			}
			break;
		case 'PRODUCT_IMAGE_INFO_GREYSCALE':
			if (!empty($p_value) && !preg_match('/^\(\s*[0-9]{1,3}\s*,\s*[0-9]{1,3}\s*,\s*[0-9]{1,3}\s*\)$/', $p_value))
			{
				$t_validity = false;
				$t_error_message = ERROR_PRODUCT_IMAGE_INFO_GREYSCALE;
			}
			break;
		case 'SHIPPING_MAX_WEIGHT':
			if (!is_numeric($p_value) || $p_value < 0)
			{
				$t_validity = false;
				$t_error_message = ERROR_MO_PICS;
			}
			break;
		default:
			break;
	}
	
	if (!$t_validity)
	{
		$_SESSION['configuration_validation_error_values'][$p_key] = $p_value;
	}
	else
	{
		unset($_SESSION['configuration_validation_error_values'][$p_key]);
	}
	
	$t_error_message = ($p_return_error_message && !$t_validity) ? '<tr><td class="dataTableContent_gm error">' . $t_error_message . '</td></tr>' : '';
	
	return ($p_return_error_message) ? $t_error_message : $t_validity;
}