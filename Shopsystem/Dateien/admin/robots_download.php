<?php
/* --------------------------------------------------------------
   robots_download.php 2017-05-29
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2017 Gambio GmbH
   Released under the GNU General Public License
   [http://www.gnu.org/licenses/gpl-2.0.html]

   IMPORTANT! THIS FILE IS DEPRECATED AND WILL BE REPLACED IN THE FUTURE. 
   MODIFY IT ONLY FOR FIXES. DO NOT APPEND IT WITH NEW FEATURES, USE THE
   NEW GX-ENGINE LIBRARIES INSTEAD.
   --------------------------------------------------------------

   based on:
   (c) 2000-2001 The Exchange Project
   (c) 2002-2003 osCommerce coding standards (a typical file) www.oscommerce.com
   (c) 2003      nextcommerce (start.php,1.5 2004/03/17); www.nextcommerce.org
   (c) 2003 XT-Commerce - community made shopping http://www.xt-commerce.com ($Id: start.php 1235 2005-09-21 19:11:43Z mz $)

   Released under the GNU General Public License
   --------------------------------------------------------------
*/

/*
 * needed functions
 */
require_once('includes/application_top.php');

AdminMenuControl::connect_with_page('gm_seo_boost.php');
/*
 * robots download
 */
require_once(DIR_FS_CATALOG.'gm/inc/get_robots.php');

// check if robots.txt obsolete
$check_robots_result = check_robots(DIR_WS_CATALOG);
if(!$check_robots_result)
{
	$messageStack->add(ROBOTS_OBSOLETE, 'warning');
}

// get robots directory (document root)
$robots_path = get_robots_path();

// generate robots.txt
if(isset($_POST['download_robots']) || isset($_POST['save_robots']))
{
	$save_robots = isset($_POST['save_robots']);
	$success = get_robots(DIR_WS_CATALOG, '', $save_robots);
	if($success)
	{
		$messageStack->add(ROBOTS_SAVE_SUCCESS, 'success');
	}
	else
	{
		$messageStack->add(ROBOTS_SAVE_ERROR, 'error');
	}
}

$adminMenuLang = MainFactory::create('LanguageTextManager', 'admin_menu', $_SESSION['languages_id']);
?>
	<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
	<html <?php echo HTML_PARAMS; ?>>
		<head>
			<meta http-equiv="x-ua-compatible" content="IE=edge">
			<meta http-equiv="Content-Type" content="text/html; charset=<?php echo $_SESSION['language_charset']; ?>">
			<title><?php echo TITLE; ?></title>
			<link rel="stylesheet" type="text/css" href="html/assets/styles/legacy/stylesheet.css">
			<style type="text/css">
				<!--
				.content_robot {
					height: 100px; border: 1px solid #DDDDDD; font-size: 12px; background-color: #F7F7F7; padding: 5px;
				}
				-->
			</style>
		</head>

		<body marginwidth="0" marginheight="0" topmargin="0" bottommargin="0" leftmargin="0" rightmargin="0" bgcolor="#FFFFFF">

			<!-- header //-->
			<?php require(DIR_WS_INCLUDES . 'header.php'); ?>
			<!-- header_eof //-->

			<!-- body //-->
			<table border="0" width="100%" cellspacing="2" cellpadding="2">
				<tr>
					<td class="columnLeft2" width="<?php echo BOX_WIDTH; ?>" valign="top">
						<table border="0" width="<?php echo BOX_WIDTH; ?>" cellspacing="1" cellpadding="1" class="columnLeft">
							<!-- left_navigation //-->
							<?php require(DIR_WS_INCLUDES . 'column_left.php'); ?>
							<!-- left_navigation_eof //-->
						</table>
					</td>
					<!-- body_text //-->
					<td class="boxCenter" width="100%" valign="top">
           <span class="main">
               <table border="0" width="100%" cellspacing="0" cellpadding="2" class="gx-container breakpoint-small">
	               <tr>
		               <td>
			               <div class="pageHeading" style="background-image:url(html/assets/images/legacy/gm_icons/gambio.png)">
				               SEO
			               </div>

			               <table>
				               <tr>
					               <td class="dataTableHeadingContent">
						               <a href="gm_meta.php">
							               <?php echo $adminMenuLang->get_text('BOX_GM_META'); ?>
						               </a>
					               </td>
					               <td class="dataTableHeadingContent">
						               <?php echo $adminMenuLang->get_text('BOX_ROBOTS'); ?>
					               </td>
					               <td class="dataTableHeadingContent">
						               <a href="gm_sitemap.php">
							               <?php echo $adminMenuLang->get_text('BOX_GM_SITEMAP'); ?>
						               </a>
					               </td>
					               <td class="dataTableHeadingContent">
									<?php
										echo '<a href="' . xtc_href_link('admin.php', 'do=StaticSeoUrl') . '">'
										     . $adminMenuLang->get_text('BOX_STATIC_SEO_URLS') . '</a>';
									?>
								</td>
					               <td class="dataTableHeadingContent">
						               <a href="<?= xtc_href_link('admin.php', 'do=TrackingCodes') ?>">
							               <?php echo $adminMenuLang->get_text('BOX_GM_ANALYTICS'); ?>
						               </a>
					               </td>
				               </tr>
			               </table>

			               <table border="0" cellpadding="0" cellspacing="0" class="gx-configuration">
				               <tr>
					               <th colspan="2" class="dataTableHeadingContent_gm">
						               <?php echo HEADING_SUB_TITLE; ?>
					               </th>
				               </tr>
				               <tr>
					               <td class="dataTableContent_gm configuration-label" style="width: 50%;">
						               <?php echo TEXT_ROBOTS_DOWNLOAD; ?>
					               </td>
					               <td class="dataTableContent_gm" style="width: 50%;">
						               <form name="robots_download" action="<?php echo xtc_href_link('robots_download.php'); ?>" method="post" target="_blank">
						               		<input type="submit" class="btn" name="download_robots" value="<?php echo ROBOTS_SUBMIT; ?>" style="min-width: 190px; float: right" />
						               </form>
					               </td>
				               </tr>
				               <tr>
					               <td class="dataTableContent_gm configuration-label" style="width: 50%;">
						               <?php echo TEXT_ROBOTS_SAVE; ?><br>
						               <strong><?php echo $robots_path; ?></strong>
					               </td>
					               <td class="dataTableContent_gm" style="width: 50%;">
						               <form name="robots_download" action="<?php echo xtc_href_link('robots_download.php'); ?>" method="post">
						               		<input type="submit" class="btn" name="save_robots" value="<?php echo ROBOTS_SAVE_SUBMIT; ?>" style="min-width: 190px; float: right" />
						               </form>
					               </td>
				               </tr>
			               </table>
		               </td>
	               </tr>
               </table>
            </span>
					</td>
					<!-- body_text_eof //-->
				</tr>
			</table>
			<!-- body_eof //-->

			<!-- footer //-->
			<?php require(DIR_WS_INCLUDES . 'footer.php'); ?>
			<!-- footer_eof //-->
			<br>
		</body>
	</html>
<?php require(DIR_WS_INCLUDES . 'application_bottom.php'); ?>
