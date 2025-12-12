<?php
/**
 * Authentication provider for Nostr
 *
 * @file
 * @ingroup Extensions
 */

namespace NostrAuth;

use User;
use MediaWiki\MediaWikiServices;
use MediaWiki\Logger\LoggerFactory;

class AuthProvider {
	/** @var \Psr\Log\LoggerInterface */
	private $logger;

	public function __construct() {
		$this->logger = LoggerFactory::getInstance( 'NostrAuth' );
	}

	/**
	 * Authenticate a user with Nostr
	 *
	 * @param string $npub Public key (bech32)
	 * @param string $challenge Challenge string
	 * @param string $signedEventJson Signed event JSON
	 * @return array ['success' => bool, 'user' => User|null, 'error' => string|null]
	 */
	public function authenticate( string $npub, string $challenge, string $signedEventJson ): array {
		// Load utilities
		require_once __DIR__ . '/../../NostrUtils/includes/NostrUtils.php';
		$utils = new \NostrUtils\NostrUtils();

		// Verify npub format
		if ( !preg_match( '/^npub1[0-9a-z]{58}$/i', $npub ) ) {
			return [
				'success' => false,
				'user' => null,
				'error' => 'Invalid npub format'
			];
		}

		// Parse and verify signed event
		$signedEvent = json_decode( $signedEventJson, true );
		if ( !$signedEvent || !isset( $signedEvent['id'], $signedEvent['pubkey'], $signedEvent['sig'] ) ) {
			return [
				'success' => false,
				'user' => null,
				'error' => 'Invalid signed event'
			];
		}

		// Verify signature
		if ( !$utils->verifySignature( $signedEvent ) ) {
			return [
				'success' => false,
				'user' => null,
				'error' => 'Invalid signature'
			];
		}

		// Verify challenge matches
		if ( $signedEvent['content'] !== $challenge ) {
			return [
				'success' => false,
				'user' => null,
				'error' => 'Challenge mismatch'
			];
		}

		// Verify pubkey matches npub
		$pubkeyHex = $utils->npubToHex( $npub );
		if ( !$pubkeyHex || strtolower( $pubkeyHex ) !== strtolower( $signedEvent['pubkey'] ) ) {
			return [
				'success' => false,
				'user' => null,
				'error' => 'Public key mismatch'
			];
		}

		// Verify NIP-5 if domain restriction enabled
		global $wgNostrAllowedNIP5Domains;
		if ( $wgNostrAllowedNIP5Domains !== null && is_array( $wgNostrAllowedNIP5Domains ) ) {
			$verifier = new NIP5Verifier();
			$nip5Result = $verifier->verifyNIP5( $npub, $wgNostrAllowedNIP5Domains );
			if ( !$nip5Result['verified'] ) {
				return [
					'success' => false,
					'user' => null,
					'error' => $nip5Result['error'] ?? 'NIP-5 verification failed'
				];
			}
		}

		// Find or create user
		$user = $this->findOrCreateUser( $npub );

		if ( !$user ) {
			return [
				'success' => false,
				'user' => null,
				'error' => 'Failed to create user account'
			];
		}

		// Store npub in user preferences
		$user->setOption( 'nostr-npub', $npub );
		$user->saveSettings();

		return [
			'success' => true,
			'user' => $user,
			'error' => null
		];
	}

	/**
	 * Find existing user by npub or create new one
	 *
	 * @param string $npub Public key
	 * @return User|null
	 */
	private function findOrCreateUser( string $npub ): ?User {
		$dbr = wfGetDB( DB_REPLICA );

		// Try to find existing user with this npub
		$userId = $dbr->selectField(
			'user_properties',
			'up_user',
			[ 'up_property' => 'nostr-npub', 'up_value' => $npub ],
			__METHOD__
		);

		if ( $userId ) {
			return User::newFromId( $userId );
		}

		// Create new user
		// Generate username from npub (first 16 chars of hex)
		require_once __DIR__ . '/../../NostrUtils/includes/NostrUtils.php';
		$utils = new \NostrUtils\NostrUtils();
		$hex = $utils->npubToHex( $npub );
		$username = 'Nostr_' . substr( $hex, 0, 16 );

		// Check if username exists, append number if needed
		$originalUsername = $username;
		$counter = 1;
		while ( User::idFromName( $username ) !== null ) {
			$username = $originalUsername . '_' . $counter;
			$counter++;
		}

		$user = User::createNew( $username );
		if ( !$user ) {
			return null;
		}

		return $user;
	}
}

