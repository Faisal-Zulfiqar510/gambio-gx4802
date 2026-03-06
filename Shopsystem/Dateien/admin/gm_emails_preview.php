<?php
/* --------------------------------------------------------------
   gm_emails_preview.php 2021-07-20
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
 */

require_once('includes/application_top.php');

$emailPreview = MainFactory::create('EmailPreview');
echo $emailPreview->render($_GET['name'], $_POST['gm_emails_content'], $_GET['type']);