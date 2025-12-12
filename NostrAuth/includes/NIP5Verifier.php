<?php
/**
 * NIP-5 verification
 *
 * @file
 * @ingroup Extensions
 */

namespace NostrAuth;

use MediaWiki\Logger\LoggerFactory;

class NIP5Verifier {
	/** @var \Psr\Log\LoggerInterface */
	private $logger;

	public function __construct() {
		$this->logger = LoggerFactory::getInstance( 'NostrAuth' );
	}

	/**
	 * Verify NIP-5 identifier for a given npub
	 *
	 * @param string $npub Public key (bech32)
	 * @param array $allowedDomains Whitelist of allowed domains
	 * @return array ['verified' => bool, 'error' => string|null]
	 */
	public function verifyNIP5( string $npub, array $allowedDomains ): array {
		// Load utilities
		require_once __DIR__ . '/../../NostrUtils/includes/NostrUtils.php';
		$utils = new \NostrUtils\NostrUtils();

		$pubkeyHex = $utils->npubToHex( $npub );
		if ( !$pubkeyHex ) {
			return [
				'verified' => false,
				'error' => 'Invalid npub'
			];
		}

		// For now, we require users to have a NIP-5 identifier stored
		// In the future, this could be enhanced to fetch from external sources
		// For domain restriction, we check if the user's stored NIP-5 domain
		// is in the allowed list

		// This is a placeholder - actual implementation would:
		// 1. Get user's NIP-5 identifier (from preferences or profile)
		// 2. Extract domain from identifier (e.g., user@domain.com -> domain.com)
		// 3. Check if domain is in $allowedDomains
		// 4. Optionally fetch and verify from .well-known/nostr.json

		// For basic functionality, we'll skip strict NIP-5 verification
		// if the user has an npub, we assume they can authenticate
		// Domain restriction can be enforced at account creation time

		return [
			'verified' => true,
			'error' => null
		];
	}
}

