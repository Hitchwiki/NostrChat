<?php
/**
 * NostrEditPost - Posts MediaWiki edits to Nostr
 *
 * @file
 * @ingroup Extensions
 */

if ( function_exists( 'wfLoadExtension' ) ) {
	wfLoadExtension( 'NostrEditPost' );
	// Keep i18n globals so mergeMessageFileList.php doesn't break
	$wgMessagesDirs['NostrEditPost'] = __DIR__ . '/../i18n';
	wfWarn(
		'Deprecated PHP entry point used for NostrEditPost extension. ' .
		'Please use wfLoadExtension instead, ' .
		'see https://www.mediawiki.org/wiki/Extension_registration for more details.'
	);
	return;
} else {
	die( 'This version of the NostrEditPost extension requires MediaWiki 1.42+' );
}

