<?php
/* --------------------------------------------------------------
   gm_sitemap_publish_all.php 2017-04-27 gm
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2015 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]

   IMPORTANT! THIS FILE IS DEPRECATED AND WILL BE REPLACED IN THE FUTURE. 
   MODIFY IT ONLY FOR FIXES. DO NOT APPEND IT WITH NEW FEATURES, USE THE
   NEW GX-ENGINE LIBRARIES INSTEAD.
   --------------------------------------------------------------
*/
defined('_VALID_XTC') or die('Direct Access to this location is not allowed.');
?>

<div class="simple-container">
	<div class="span6">
		<label for="gm_publish_all"><?php echo PUBLISH_ALL_TEXT; ?></label>
		<a href="#" id="gm_generate"
		data-gx-compatibility="sitemap/sitemap_generator"
		data-sitemap_generator-url="gm_sitemap_creator.php"
		data-sitemap_generator-params="<?php echo 'action=publish_all&page_token='. $_SESSION['coo_page_token']->generate_token()?>"
		class="button pull-right">
			<?php echo PUBLISH_ALL; ?>
		</a>
	</div>
</div>
