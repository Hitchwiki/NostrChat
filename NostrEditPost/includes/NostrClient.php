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
	 * @param array $tags Additional tags to include (e.g., ['t' => ['channel']])
	 * @return bool Success
	 */
	public function publishNote( string $content, ?string $nsec = null, array $tags = [] ): bool {
		// Load shared utilities
		require_once __DIR__ . '/../../NostrUtils/includes/NostrUtils.php';
		$utils = new \NostrUtils\NostrUtils();

		// Build tags array
		$eventTags = [];
		foreach ( $tags as $tagName => $tagValues ) {
			if ( is_array( $tagValues ) ) {
				foreach ( $tagValues as $tagValue ) {
					$eventTags[] = [ $tagName, $tagValue ];
				}
			} else {
				$eventTags[] = [ $tagName, $tagValues ];
			}
		}

		// Create event
		$event = [
			'kind' => 1,
			'content' => $content,
			'created_at' => time(),
			'tags' => $eventTags
		];

		// Sign if nsec provided
		if ( $nsec ) {
			$event = $utils->signEvent( $event, $nsec );
			if ( !$event ) {
				$this->logger->error( 'Failed to sign Nostr event' );
				return false;
			}
		} else {
			// Unsigned events are not valid in Nostr, and will be rejected by relays.
			$this->logger->error( 'Cannot post to Nostr without signing key (nsec)' );
			return false;
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
		$payload = json_encode( [ 'EVENT', $event ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE );
		if ( $payload === false ) {
			$this->logger->warning( "Failed to encode event JSON for relay: {$relayUrl}" );
			return false;
		}

		$result = $this->publishViaWebSocket( $relayUrl, $payload, $event['id'] ?? null );
		if ( $result['ok'] ) {
			$this->logger->info( "Successfully posted to relay: {$relayUrl}" );
			return true;
		}

		$this->logger->warning( "Relay rejected/failed: {$relayUrl} - " . ( $result['error'] ?? 'unknown error' ) );
		return false;
	}

	/**
	 * Publish a JSON message to a Nostr relay via WebSocket and wait briefly for an OK response.
	 *
	 * @param string $relayUrl ws:// or wss:// URL
	 * @param string $jsonPayload JSON string to send
	 * @param string|null $expectedEventId Expected event id to match in OK response
	 * @return array{ok:bool,error:?string}
	 */
	private function publishViaWebSocket( string $relayUrl, string $jsonPayload, ?string $expectedEventId ): array {
		$parts = parse_url( $relayUrl );
		if ( !$parts || empty( $parts['scheme'] ) || empty( $parts['host'] ) ) {
			return [ 'ok' => false, 'error' => 'Invalid relay URL' ];
		}

		$scheme = strtolower( $parts['scheme'] );
		if ( $scheme !== 'ws' && $scheme !== 'wss' ) {
			return [ 'ok' => false, 'error' => 'Relay URL must be ws:// or wss://' ];
		}

		$host = $parts['host'];
		$port = $parts['port'] ?? ( $scheme === 'wss' ? 443 : 80 );
		$path = $parts['path'] ?? '/';
		if ( $path === '' ) {
			$path = '/';
		}
		if ( !empty( $parts['query'] ) ) {
			$path .= '?' . $parts['query'];
		}

		$transport = $scheme === 'wss' ? 'tls' : 'tcp';
		$addr = "{$transport}://{$host}:{$port}";

		$ctx = stream_context_create( [
			'ssl' => [
				'verify_peer' => true,
				'verify_peer_name' => true,
				'SNI_enabled' => true,
				'peer_name' => $host
			]
		] );

		$fp = @stream_socket_client( $addr, $errno, $errstr, 10, STREAM_CLIENT_CONNECT, $ctx );
		if ( !$fp ) {
			return [ 'ok' => false, 'error' => "Socket connect failed: {$errstr} ({$errno})" ];
		}

		stream_set_timeout( $fp, 10 );

		$key = base64_encode( random_bytes( 16 ) );
		$headers = "GET {$path} HTTP/1.1\r\n" .
			"Host: {$host}:{$port}\r\n" .
			"Upgrade: websocket\r\n" .
			"Connection: Upgrade\r\n" .
			"Sec-WebSocket-Key: {$key}\r\n" .
			"Sec-WebSocket-Version: 13\r\n" .
			"User-Agent: MediaWiki-NostrEditPost/1.0\r\n" .
			"\r\n";

		fwrite( $fp, $headers );

		$response = '';
		while ( !str_contains( $response, "\r\n\r\n" ) ) {
			$chunk = fread( $fp, 1024 );
			if ( $chunk === '' || $chunk === false ) {
				fclose( $fp );
				return [ 'ok' => false, 'error' => 'WebSocket handshake failed (no response)' ];
			}
			$response .= $chunk;
			if ( strlen( $response ) > 8192 ) {
				fclose( $fp );
				return [ 'ok' => false, 'error' => 'WebSocket handshake response too large' ];
			}
		}

		if ( !preg_match( '#^HTTP/1\\.[01] 101#', $response ) ) {
			fclose( $fp );
			return [ 'ok' => false, 'error' => 'WebSocket upgrade not accepted' ];
		}

		// Send payload as a masked text frame
		$frame = $this->encodeWsTextFrame( $jsonPayload );
		fwrite( $fp, $frame );

		// Wait for an OK response briefly
		$deadline = microtime( true ) + 10;
		while ( microtime( true ) < $deadline ) {
			$msg = $this->readWsMessage( $fp );
			if ( $msg === null ) {
				// No complete message yet
				usleep( 100000 );
				continue;
			}
			$data = json_decode( $msg, true );
			if ( is_array( $data ) && isset( $data[0] ) && $data[0] === 'OK' ) {
				// Format: ["OK", <eventid>, <true|false>, <message>]
				if ( $expectedEventId !== null && isset( $data[1] ) && strtolower( (string)$data[1] ) !== strtolower( $expectedEventId ) ) {
					continue;
				}
				$ok = !empty( $data[2] );
				fclose( $fp );
				if ( $ok ) {
					return [ 'ok' => true, 'error' => null ];
				}
				return [ 'ok' => false, 'error' => isset( $data[3] ) ? (string)$data[3] : 'Relay returned OK=false' ];
			}
		}

		fclose( $fp );
		// Some relays won't send OK immediately; consider a timeout as inconclusive failure.
		return [ 'ok' => false, 'error' => 'Timed out waiting for relay OK' ];
	}

	private function encodeWsTextFrame( string $payload ): string {
		$finOpcode = 0x81; // FIN + text
		$len = strlen( $payload );
		$maskBit = 0x80;
		$header = chr( $finOpcode );

		if ( $len < 126 ) {
			$header .= chr( $maskBit | $len );
		} elseif ( $len < 65536 ) {
			$header .= chr( $maskBit | 126 ) . pack( 'n', $len );
		} else {
			// 64-bit length (network byte order). Payloads here should fit in 32-bit, so high word is 0.
			$header .= chr( $maskBit | 127 ) . pack( 'NN', 0, $len );
		}

		$mask = random_bytes( 4 );
		$masked = '';
		for ( $i = 0; $i < $len; $i++ ) {
			$masked .= $payload[$i] ^ $mask[$i % 4];
		}

		return $header . $mask . $masked;
	}

	/**
	 * Read a single (possibly fragmented) text message.
	 * This is a minimal WebSocket frame reader suitable for relay OK responses.
	 *
	 * @param resource $fp
	 * @return string|null
	 */
	private function readWsMessage( $fp ): ?string {
		$meta = stream_get_meta_data( $fp );
		if ( $meta['timed_out'] ?? false ) {
			return null;
		}

		$hdr = fread( $fp, 2 );
		if ( $hdr === '' || $hdr === false || strlen( $hdr ) < 2 ) {
			return null;
		}

		$b1 = ord( $hdr[0] );
		$b2 = ord( $hdr[1] );
		$opcode = $b1 & 0x0F;
		$masked = ( $b2 & 0x80 ) !== 0;
		$len = $b2 & 0x7F;

		if ( $len === 126 ) {
			$ext = fread( $fp, 2 );
			if ( $ext === false || strlen( $ext ) < 2 ) return null;
			$len = unpack( 'n', $ext )[1];
		} elseif ( $len === 127 ) {
			$ext = fread( $fp, 8 );
			if ( $ext === false || strlen( $ext ) < 8 ) return null;
			$arr = unpack( 'N2', $ext );
			$len = ( $arr[1] << 32 ) | $arr[2];
		}

		$mask = '';
		if ( $masked ) {
			$mask = fread( $fp, 4 );
			if ( $mask === false || strlen( $mask ) < 4 ) return null;
		}

		$payload = '';
		while ( strlen( $payload ) < $len ) {
			$chunk = fread( $fp, $len - strlen( $payload ) );
			if ( $chunk === '' || $chunk === false ) {
				return null;
			}
			$payload .= $chunk;
		}

		if ( $masked ) {
			$unmasked = '';
			for ( $i = 0; $i < $len; $i++ ) {
				$unmasked .= $payload[$i] ^ $mask[$i % 4];
			}
			$payload = $unmasked;
		}

		// Ignore non-text frames
		if ( $opcode !== 1 ) {
			return null;
		}

		return $payload;
	}
}

