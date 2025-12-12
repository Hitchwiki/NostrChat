<?php
/**
 * Handler for .well-known/nostr.json requests
 *
 * @file
 * @ingroup Extensions
 */

namespace NostrNIP5;

use WebRequest;
use User;
use MediaWiki\MediaWikiServices;

class WellKnownHandler {
	/**
	 * Handle the .well-known/nostr.json request
	 *
	 * @param WebRequest $request
	 */
	public function handleRequest( WebRequest $request ) {
		$name = $request->getVal( 'name' );
		
		if ( !$name ) {
			$this->sendError( 400, 'Missing name parameter' );
			return;
		}

		// Sanitize username
		$name = preg_replace( '/[^a-zA-Z0-9_-]/', '', $name );
		if ( empty( $name ) || strlen( $name ) > 50 ) {
			$this->sendError( 400, 'Invalid name parameter' );
			return;
		}

		// Find user
		$user = User::newFromName( $name );
		if ( !$user || !$user->getId() ) {
			$this->sendError( 404, 'User not found' );
			return;
		}

		// Get npub from user preferences
		$npub = $user->getOption( 'nostr-npub' );
		if ( !$npub ) {
			// Return empty names object if no npub
			$this->sendResponse( [ 'names' => [] ] );
			return;
		}

		// Validate npub format
		if ( !preg_match( '/^npub1[0-9a-z]{58}$/i', $npub ) ) {
			$this->sendResponse( [ 'names' => [] ] );
			return;
		}

		// Convert npub to hex
		require_once __DIR__ . '/../../NostrUtils/includes/NostrUtils.php';
		$utils = new \NostrUtils\NostrUtils();
		$hex = $utils->npubToHex( $npub );

		if ( !$hex ) {
			$this->sendResponse( [ 'names' => [] ] );
			return;
		}

		// Return NIP-5 format response
		$this->sendResponse( [
			'names' => [
				$name => $hex
			]
		] );
	}

	/**
	 * Send JSON response
	 *
	 * @param array $data Response data
	 */
	private function sendResponse( array $data ) {
		header( 'Content-Type: application/json' );
		echo json_encode( $data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES );
		exit;
	}

	/**
	 * Send error response
	 *
	 * @param int $code HTTP status code
	 * @param string $message Error message
	 */
	private function sendError( int $code, string $message ) {
		http_response_code( $code );
		header( 'Content-Type: application/json' );
		echo json_encode( [ 'error' => $message ], JSON_PRETTY_PRINT );
		exit;
	}
}

