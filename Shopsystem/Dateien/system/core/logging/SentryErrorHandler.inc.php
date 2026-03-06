<?php
/* --------------------------------------------------------------
   SentryErrorHandler.inc.php 2021-07-21
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

require_once DIR_FS_CATALOG . 'GambioCore/Application/env.php';

$sentryDsn = Gambio\Core\Application\env('APP_SENTRY_DSN');

if (empty($sentryDsn)) {
	return;
}

Sentry\init([
                'dsn'           => $sentryDsn,
                'environment'   => file_exists(DIR_FS_CATALOG . '.dev-environment') ? 'development' : 'production',
                'release'       => include DIR_FS_CATALOG . 'release_info.php',
                'prefixes'      => [DIR_FS_CATALOG, DIR_FS_DOCUMENT_ROOT],
                'error_types'   => E_ALL & ~E_NOTICE & ~E_USER_NOTICE & ~E_CORE_ERROR & ~E_CORE_WARNING & ~E_STRICT
                                   & ~E_DEPRECATED,
                'send_attempts' => 1,
            ]);

