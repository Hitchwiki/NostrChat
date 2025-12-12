<?php
/**
 * NostrAuth - Nostr authentication for MediaWiki
 *
 * @file
 * @ingroup Extensions
 */

if ( function_exists( 'wfLoadExtension' ) ) {
	wfLoadExtension( 'NostrAuth' );
	// Keep i18n globals so mergeMessageFileList.php doesn't break
	$wgMessagesDirs['NostrAuth'] = __DIR__ . '/../i18n';
	wfWarn(
		'Deprecated PHP entry point used for NostrAuth extension. ' .
		'Please use wfLoadExtension instead, ' .
		'see https://www.mediawiki.org/wiki/Extension_registration for more details.'
	);
	return;
} else {
	die( 'This version of the NostrAuth extension requires MediaWiki 1.42+' );
}

