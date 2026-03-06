/* ------------------------------------------------------------
 auto_updater_backups_v2.1.js 2018-09-27
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2018 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * AutoUpdater Backups Controller
 */
(function() {
	'use strict';
	
	/**
	 * Main container
	 *
	 * @type {Object}
	 */
	const $this = $('.auto-updater-backups-container');
	
	/**
	 * URLs
	 *
	 * @type {{backupPage: string, restoreBackup: string, deleteBackup: string, checkFilePermission: string, checkFtpConnection: string}}
	 */
	const urls = {
		backupPage: 'admin.php?do=AutoUpdater/backups',
		restoreBackup: 'auto_updater.php?do=restoreBackup',
		deleteBackup: 'admin.php?do=AutoUpdaterAjax/deleteBackup',
		checkFilePermission: 'admin.php?do=AutoUpdaterAjax/checkPermissionForBackupRestore',
		checkFtpConnection: 'admin.php?do=AutoUpdaterAjax/checkFtpConnection'
	};
	
	
	/**
	 * Several modal objects
	 *
	 * @type {{backupDetails: (jQuery|HTMLElement), deleteBackup: (jQuery|HTMLElement), restoreBackup: (jQuery|HTMLElement)}}
	 */
	const $modal = {
		backupDetails: $('.backup-details.modal'),
		deleteBackup: $('.delete-backup.modal'),
		restoreBackup: $('.restore-backup.modal')
	};
	
	
	/**
	 * Backup ID
	 *
	 * @type {string}
	 */
	let backupId = '';
	
	
	/**
	 * Backup ID
	 *
	 * @type {int|null}
	 */
	let lastRestoredIndex = null;
	
	
	/**
	 * Status flag for file permission
	 *
	 * @type {boolean}
	 */
	let filePermissionOk = true;
	
	
	//
	// HANDLER FUNCTIONS
	//
	
	/**
	 * Click handler the "delete backup" action
	 *
	 * @param {MessageEvent} event
	 */
	function showDeleteBackupConfirmModal(event) {
		event.preventDefault();
		
		const backupId = $(this).data('backupId');
		const $backupDetails = $this.find('dl.backup-details[data-backup-id="' + backupId + '"]');
		
		$modal['deleteBackup'].find('.modal-body .details')
			.html($backupDetails.html())
			.find('dl.backup-details')
			.removeClass('hidden');
		$modal['deleteBackup'].find('.modal-footer .confirm-button').data('backupId', backupId);
		$modal['deleteBackup'].find('.modal-footer .confirm-button').on('click', deleteBackup);
		$modal['deleteBackup'].modal('show');
	}
	
	/**
	 * Click handler the "delete confirmed" action
	 *
	 * @param {MessageEvent} event
	 */
	function deleteBackup(event) {
		event.preventDefault();
		
		$.ajax({
			type: "POST",
			url: urls.deleteBackup,
			data: {
				'backupId': $(this).data('backupId')
			},
			success: function(response) {
				window.location.href = urls.backupPage;
			},
			error: function() {
				window.location.href = urls.backupPage;
			},
		});
	}
	
	/**
	 * Click handler the "show backup details" action
	 *
	 * @param {MessageEvent} event
	 */
	function showBackupDetails(event) {
		event.preventDefault();
		
		const backupId = $(this).data('backupId');
		const $backupDetails = $this.find('dl.backup-details[data-backup-id="' + backupId + '"]');
		
		$modal['backupDetails'].find('.modal-body')
			.html($backupDetails.html())
			.find('dl.backup-details')
			.removeClass('hidden');
		$modal['backupDetails'].modal('show');
	}
	
	/**
	 * Click handler the "restore backup" action
	 *
	 * @param {MessageEvent} event
	 */
	function initBackupRestore(event) {
		event.preventDefault();
		
		$modal['restoreBackup'].find('.permission-check-failed').hide();
		$modal['restoreBackup'].find('.processing').hide();
		$modal['restoreBackup'].find('.modal-footer .ftp-test').hide();
		$modal['restoreBackup'].find('.success').hide();
		$modal['restoreBackup'].find('.error').hide();
		$modal['restoreBackup'].modal('show');
		
		//backupId = $(this).data('backupId');
		//lastRestoredIndex = null;
		//
		//$modal['restoreBackup'].find('.modal-footer .ftp-test').hide();
		//$modal['restoreBackup'].find('.modal-footer .close-button').hide();
		//$modal['restoreBackup'].find('.modal-body .permission-check-failed').hide();
		//$modal['restoreBackup'].find('.modal-body p.processing').hide();
		//$modal['restoreBackup'].find('.modal-body .success').hide();
		//$modal['restoreBackup'].find('.modal-body .error').hide();
		//$modal['restoreBackup'].find('.modal-title')
		//	.text(jse.core.lang.translate('modal_restore_backup_title_permission_check', 'auto_updater'));
		//
		//$.ajax({
		//	type: "POST",
		//	url: urls.checkFilePermission,
		//	data: {
		//		'backupId': backupId
		//	},
		//	success: function(response) {
		//		try {
		//			response = JSON.parse(response);
		//		} catch (e) {
		//			response = {
		//				success: false,
		//				result: false
		//			};
		//		}
		//
		//		if (response.success === true && response.result === true) {
		//			$modal['restoreBackup'].find('.modal-body p.processing').show();
		//			restoreBackup();
		//			return;
		//		}
		//
		//		showFtpForm();
		//	},
		//	error: function() {
		//		$modal['restoreBackup'].find('.modal-body p.error').show();
		//		$modal['restoreBackup'].find('.modal-footer .close-button').show();
		//		$modal['restoreBackup'].modal('show');
		//	},
		//});
	}
	
	/**
	 * Handler for the switch event of the ftp protocols
	 *
	 * @param {MessageEvent} event
	 */
	function switchedFtpProtocol(event) {
		if ($(this).val() === 'ftp') {
			$modal['restoreBackup'].find('.ftp-passive').show();
			$modal['restoreBackup'].find('.ftp-port').hide();
			return;
		}
		$modal['restoreBackup'].find('.ftp-passive').hide();
		$modal['restoreBackup'].find('.ftp-port').show();
	}
	
	
	//
	// HELPER
	//
	
	/**
	 * Restoration of a backup after his initiation
	 */
	function restoreBackup() {
		$modal['restoreBackup'].find('.modal-body .permission-check-failed').hide();
		$modal['restoreBackup'].find('.modal-footer .ftp-test').hide();
		$modal['restoreBackup'].find('.modal-footer .close-button').show();
		$modal['restoreBackup'].find('.modal-title')
			.text(jse.core.lang.translate('modal_restore_backup_title_backup_restore', 'auto_updater'));
		$modal['restoreBackup'].modal('show');
		
		const formdata = $modal['restoreBackup'].find('.ftp-form').serializeArray();
		let data = {};
		$(formdata).each(function(index, obj) {
			data[obj.name] = obj.value;
		});
		data.backupId = backupId;
		data.lastRestoredIndex = lastRestoredIndex;
		
		$.ajax({
			type: "POST",
			url: urls.restoreBackup,
			data: data,
			success: function(response) {
				console.log(response);
				
				if (response.success === true && response.done === false) {
					lastRestoredIndex = response.lastRestoredIndex;
					restoreBackup();
					return;
				}else if (response.success === true && response.done === true) {
					$modal['restoreBackup'].find('.modal-body p.processing').hide();
					$modal['restoreBackup'].find('.modal-body p.success').show();
					return;
				}
				
				$modal['restoreBackup'].find('.modal-body p.processing').hide();
				$modal['restoreBackup'].find('.modal-body p.error').show();
			},
			error: function() {
				$modal['restoreBackup'].find('.modal-body p.processing').hide();
				$modal['restoreBackup'].find('.modal-body p.error').show();
			},
		});
	}
	
	/**
	 * Shows the ftp form after an backup initiation
	 */
	function showFtpForm() {
		$modal['restoreBackup'].find('.modal-footer .close-button').hide();
		$modal['restoreBackup'].find('.modal-footer .ftp-test').show();
		$modal['restoreBackup'].find('.permission-check-failed').show();
		$modal['restoreBackup'].find('.ftp-form-error').hide();
		$modal['restoreBackup'].find('.ftp-port').hide();
		
		$modal['restoreBackup'].find('input[name=ftp-protocol]').on('change', switchedFtpProtocol);
		$modal['restoreBackup'].find('.modal-footer .ftp-test').on('click', testFtpConnection);
		$modal['restoreBackup'].modal('show');
	}
	
	/**
	 * Tests the ftp connection and starts the backup restore in case of a success
	 */
	function testFtpConnection(event) {
		event.preventDefault();
		
		$.ajax({
			type: "POST",
			url: urls.checkFtpConnection,
			data: $modal['restoreBackup'].find('.ftp-form').serialize(),
			success: function(response) {
				try {
					response = JSON.parse(response);
				} catch (e) {
					response = {
						success: false
					};
				}
				
				if (response.success === false) {
					$modal['restoreBackup'].find('p.ftp-form-error').show();
					return;
				}
				
				restoreBackup();
			},
			error: function() {
				$modal['restoreBackup'].find('p.ftp-form-error').show();
			},
		});
	}
	
	
	//
	// INITIALISATION
	//
	
	/**
	 * Handles the module initialization.
	 */
	function onInit() {
		$this.find('a.backup-details').on('click', showBackupDetails);
		$this.find('a.delete-backup').on('click', showDeleteBackupConfirmModal);
		$this.find('a.restore-backup').on('click', initBackupRestore);
	}
	
	document.addEventListener('DOMContentLoaded', onInit);
})();