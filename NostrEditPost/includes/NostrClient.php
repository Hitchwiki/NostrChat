<?php
/**
 * NostrClient - Client for communicating with Nostr relays
 *
 * @file
 * @ingroup Extensions
 */

namespace NostrEditPost;

use MediaWiki\Logger\LoggerFactory;

class NostrClient {
	/** @var array */
	private $relays;

	/** @var \Psr\Log\LoggerInterface */
	private $logger;

	/**
	 * @param array $relays Array of relay URLs
	 */
	public function __construct( array $relays ) {
		$this->relays = $relays;
		$this->logger = LoggerFactory::getInstance( 'NostrEditPost' );
	}

	/**
	 * Publish a kind 1 note to Nostr relays
	 *
	 * @param string $content Note content
	 * @param string|null $nsec Private key (nsec) for signing, or null for unsigned
	 * @return bool Success
	 */
	public function publishNote( string $content, ?string $nsec = null ): bool {
		// Load shared utilities
		require_once __DIR__ . '/../../NostrUtils/includes/NostrUtils.php';
		$utils = new \NostrUtils\NostrUtils();

		// Create event
		$event = [
			'kind' => 1,
			'content' => $content,
			'created_at' => time(),
			'tags' => []
		];

		// Sign if nsec provided
		if ( $nsec ) {
			$event = $utils->signEvent( $event, $nsec );
			if ( !$event ) {
				$this->logger->error( 'Failed to sign Nostr event' );
				return false;
			}
		} else {
			// For unsigned events, we still need pubkey and id
			// This is a limitation - unsigned events aren't really valid in Nostr
			// But we'll try to post anyway
			$this->logger->warning( 'Posting unsigned Nostr event (may be rejected by relays)' );
		}

		// Post to all relays
		$success = false;
		foreach ( $this->relays as $relay ) {
			if ( $this->postToRelay( $relay, $event ) ) {
				$success = true;
			}
		}

		return $success;
	}

	/**
	 * Post event to a single relay
	 *
	 * @param string $relayUrl Relay URL
	 * @param array $event Event data
	 * @return bool Success
	 */
	private function postToRelay( string $relayUrl, array $event ): bool {
		// Convert WebSocket URL to HTTP if needed
		$httpUrl = $this->convertRelayUrl( $relayUrl );

		// Nostr relay HTTP API: POST with ["EVENT", event]
		$payload = json_encode( [ 'EVENT', $event ], JSON_UNESCAPED_SLASHES );

		$context = stream_context_create( [
			'http' => [
				'method' => 'POST',
				'header' => [
					'Content-Type: application/json',
					'Content-Length: ' . strlen( $payload ),
					'User-Agent: MediaWiki-NostrEditPost/1.0'
				],
				'content' => $payload,
				'timeout' => 10,
				'ignore_errors' => true
			]
		] );

		$result = @file_get_contents( $httpUrl, false, $context );

		if ( $result === false ) {
			$this->logger->warning( "Failed to post to relay: {$relayUrl}" );
			return false;
		}

		// Check response
		$response = json_decode( $result, true );
		if ( isset( $response[0] ) && $response[0] === 'OK' ) {
			$this->logger->info( "Successfully posted to relay: {$relayUrl}" );
			return true;
		}

		$this->logger->warning( "Relay rejected event: {$relayUrl} - {$result}" );
		return false;
	}

	/**
	 * Convert WebSocket URL to HTTP URL for relay
	 *
	 * @param string $url Original URL
	 * @return string HTTP URL
	 */
	private function convertRelayUrl( string $url ): string {
		// Most Nostr relays support HTTP POST at the same base URL
		// wss://relay.example.com -> https://relay.example.com
		// ws://relay.example.com -> http://relay.example.com
		$url = str_replace( 'wss://', 'https://', $url );
		$url = str_replace( 'ws://', 'http://', $url );
		return $url;
	}
}

