<?php
/**
 * Hook handlers for NostrAuth
 *
 * @file
 * @ingroup Extensions
 */

namespace NostrAuth;

use MediaWiki\Hook\GetPreferencesHook;
use User;

class Hooks implements GetPreferencesHook {
	/**
	 * Add Nostr npub preference field
	 *
	 * @param User $user
	 * @param array &$preferences
	 * @return bool|void
	 */
	public function onGetPreferences( $user, &$preferences ) {
		$preferences['nostr-npub'] = [
			'type' => 'text',
			'section' => 'personal/info',
			'label-message' => 'nostrauth-npub-label',
			'help-message' => 'nostrauth-npub-help',
			'validation-callback' => [ $this, 'validateNpub' ]
		];
	}

	/**
	 * Validate npub format
	 *
	 * @param string $value
	 * @param array $alldata
	 * @param User $user
	 * @return bool|string True on success, error message on failure
	 */
	public function validateNpub( $value, $alldata, $user ) {
		if ( empty( $value ) ) {
			return true; // Optional field
		}

		// Validate npub format: npub1 followed by 58 characters
		if ( !preg_match( '/^npub1[0-9a-z]{58}$/i', $value ) ) {
			return wfMessage( 'nostrauth-npub-invalid' )->text();
		}

		return true;
	}
}

