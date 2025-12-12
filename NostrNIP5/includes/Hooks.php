<?php
/**
 * Hook handlers for NostrNIP5
 *
 * @file
 * @ingroup Extensions
 */

namespace NostrNIP5;

use MediaWiki\Hook\BeforeInitializeHook;
use Title;
use WebRequest;

class Hooks implements BeforeInitializeHook {
	/**
	 * Handle .well-known/nostr.json requests
	 *
	 * @param Title $title
	 * @param mixed $unused
	 * @param \OutputPage $output
	 * @param \User $user
	 * @param WebRequest $request
	 * @param \MediaWiki $mediaWiki
	 * @return bool|void
	 */
	public function onBeforeInitialize( $title, $unused, $output, $user, $request, $mediaWiki ) {
		global $wgNostrNIP5Enabled;

		if ( !$wgNostrNIP5Enabled ) {
			return;
		}

		// Check if this is a .well-known/nostr.json request
		$path = $request->getRequestURL();
		if ( strpos( $path, '/.well-known/nostr.json' ) !== false || 
		     strpos( $path, '.well-known/nostr.json' ) !== false ) {
			$handler = new WellKnownHandler();
			$handler->handleRequest( $request );
			return false; // Stop further processing
		}
	}
}

