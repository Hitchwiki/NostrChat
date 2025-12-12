<?php
/**
 * Shared Nostr utilities for all extensions
 *
 * @file
 * @ingroup Extensions
 */

namespace NostrUtils;

class NostrUtils {
	// secp256k1 parameters (hex)
	private const SECP256K1_P = 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F';
	private const SECP256K1_N = 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141';
	private const SECP256K1_GX = '79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798';
	private const SECP256K1_GY = '483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8';

	/**
	 * Convert npub (bech32) to hex public key (32 bytes hex)
	 *
	 * @param string $npub Bech32 encoded public key
	 * @return string|null Hex public key or null on failure
	 */
	public function npubToHex( string $npub ): ?string {
		$decoded = $this->bech32Decode( $npub );
		if ( !$decoded || $decoded['hrp'] !== 'npub' ) {
			return null;
		}
		return bin2hex( $decoded['data'] );
	}

	/**
	 * Convert nsec (bech32) to hex private key (32 bytes hex)
	 *
	 * @param string $nsec Bech32 encoded private key
	 * @return string|null Hex private key or null on failure
	 */
	public function nsecToHex( string $nsec ): ?string {
		$decoded = $this->bech32Decode( $nsec );
		if ( !$decoded || $decoded['hrp'] !== 'nsec' ) {
			return null;
		}
		return bin2hex( $decoded['data'] );
	}

	/**
	 * Normalize a Nostr public key string to 32-byte hex.
	 * Accepts:
	 * - 64-char hex (NIP-07 getPublicKey())
	 * - npub bech32
	 *
	 * @param string $pubkey Public key (hex or npub)
	 * @return string|null 64-char lowercase hex
	 */
	public function normalizePubkeyToHex( string $pubkey ): ?string {
		$pubkey = trim( $pubkey );
		if ( preg_match( '/^[0-9a-fA-F]{64}$/', $pubkey ) ) {
			return strtolower( $pubkey );
		}
		if ( str_starts_with( strtolower( $pubkey ), 'npub1' ) ) {
			$hex = $this->npubToHex( $pubkey );
			return $hex ? strtolower( $hex ) : null;
		}
		return null;
	}

	/**
	 * Sign a Nostr event with nsec (BIP340 Schnorr, NIP-01 compatible)
	 *
	 * @param array $event Event data (without id, pubkey, sig)
	 * @param string $nsec Private key in bech32 format
	 * @return array|null Signed event or null on failure
	 */
	public function signEvent( array $event, string $nsec ): ?array {
		$privkeyHex = $this->nsecToHex( $nsec );
		if ( !$privkeyHex ) {
			return null;
		}

		$pubkeyHex = $this->deriveXOnlyPubkeyHexFromSeckeyHex( $privkeyHex );
		if ( !$pubkeyHex ) {
			return null;
		}

		$event['pubkey'] = $pubkeyHex;
		$event['id'] = $this->getEventId( $event );

		$sig = $this->schnorrSign( $event['id'], $privkeyHex );
		if ( !$sig ) {
			return null;
		}
		$event['sig'] = $sig;

		return $event;
	}

	/**
	 * Compute Nostr event id (sha256 of NIP-01 serialization).
	 *
	 * @param array $event Event data (must include pubkey, created_at, kind, tags, content)
	 * @return string 64-char lowercase hex
	 */
	public function getEventId( array $event ): string {
		$serialized = $this->serializeEvent( $event );
		return hash( 'sha256', $serialized );
	}

	/**
	 * Serialize event for signing (NIP-01 format)
	 *
	 * @param array $event Event data
	 * @return string Serialized event JSON
	 */
	public function serializeEvent( array $event ): string {
		// Format: [0, pubkey, created_at, kind, tags, content]
		$parts = [
			0,
			$event['pubkey'],
			$event['created_at'],
			$event['kind'],
			$event['tags'] ?? [],
			$event['content']
		];

		return json_encode( $parts, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE );
	}

	/**
	 * Verify a Nostr event signature (BIP340 Schnorr)
	 *
	 * @param array $event Event with signature
	 * @return bool True if signature is valid and id matches payload
	 */
	public function verifySignature( array $event ): bool {
		if ( !isset( $event['id'], $event['pubkey'], $event['sig'] ) ) {
			return false;
		}

		// Ensure event id matches payload
		$expectedId = $this->getEventId( [
			'pubkey' => $event['pubkey'],
			'created_at' => $event['created_at'] ?? null,
			'kind' => $event['kind'] ?? null,
			'tags' => $event['tags'] ?? [],
			'content' => $event['content'] ?? '',
		] );
		if ( strtolower( $expectedId ) !== strtolower( $event['id'] ) ) {
			return false;
		}

		$pubkeyHex = $this->normalizePubkeyToHex( $event['pubkey'] );
		if ( !$pubkeyHex || !preg_match( '/^[0-9a-f]{64}$/', $pubkeyHex ) ) {
			return false;
		}
		$sig = strtolower( $event['sig'] );
		if ( !preg_match( '/^[0-9a-f]{128}$/', $sig ) ) {
			return false;
		}

		return $this->schnorrVerify( $sig, strtolower( $event['id'] ), $pubkeyHex );
	}

	/**
	 * BIP340 Schnorr sign (returns 64-byte signature hex).
	 *
	 * @param string $msg32Hex 32-byte message hex (64 chars)
	 * @param string $seckey32Hex 32-byte secret key hex (64 chars)
	 * @return string|null 64-byte signature hex (128 chars)
	 */
	public function schnorrSign( string $msg32Hex, string $seckey32Hex ): ?string {
		if ( !extension_loaded( 'gmp' ) ) {
			return null;
		}
		$msg32Hex = strtolower( $msg32Hex );
		$seckey32Hex = strtolower( $seckey32Hex );
		if ( !preg_match( '/^[0-9a-f]{64}$/', $msg32Hex ) || !preg_match( '/^[0-9a-f]{64}$/', $seckey32Hex ) ) {
			return null;
		}

		$n = $this->gmpFromHex( self::SECP256K1_N );
		$p = $this->gmpFromHex( self::SECP256K1_P );

		$d0 = $this->gmpFromHex( $seckey32Hex );
		if ( gmp_cmp( $d0, 0 ) <= 0 || gmp_cmp( $d0, $n ) >= 0 ) {
			return null;
		}

		$G = $this->G();
		$P = $this->pointMul( $d0, $G );
		if ( $P === null ) {
			return null;
		}

		$px = $P['x'];
		$py = $P['y'];

		// If y is odd, use d = n - d0
		$d = $d0;
		if ( gmp_intval( gmp_mod( $py, 2 ) ) === 1 ) {
			$d = gmp_sub( $n, $d0 );
		}

		$aux = random_bytes( 32 );
		$t = $this->xorBytes(
			$this->intToBytes32( $d ),
			$this->taggedHash( 'BIP0340/aux', $aux )
		);

		$nonceBytes = $t . $this->intToBytes32( $px ) . hex2bin( $msg32Hex );
		$k0 = gmp_mod( $this->gmpFromBin( $this->taggedHash( 'BIP0340/nonce', $nonceBytes ) ), $n );
		if ( gmp_cmp( $k0, 0 ) === 0 ) {
			return null;
		}

		$R = $this->pointMul( $k0, $G );
		if ( $R === null ) {
			return null;
		}

		$rx = $R['x'];
		$ry = $R['y'];

		$k = $k0;
		if ( gmp_intval( gmp_mod( $ry, 2 ) ) === 1 ) {
			$k = gmp_sub( $n, $k0 );
		}

		$eBytes = $this->taggedHash(
			'BIP0340/challenge',
			$this->intToBytes32( $rx ) . $this->intToBytes32( $px ) . hex2bin( $msg32Hex )
		);
		$e = gmp_mod( $this->gmpFromBin( $eBytes ), $n );

		$s = gmp_mod( gmp_add( $k, gmp_mul( $e, $d ) ), $n );

		return bin2hex( $this->intToBytes32( $rx ) . $this->intToBytes32( $s ) );
	}

	/**
	 * BIP340 Schnorr verify.
	 *
	 * @param string $sig64Hex 64-byte signature hex (128 chars)
	 * @param string $msg32Hex 32-byte message hex (64 chars)
	 * @param string $pubkey32Hex x-only public key hex (64 chars)
	 * @return bool
	 */
	public function schnorrVerify( string $sig64Hex, string $msg32Hex, string $pubkey32Hex ): bool {
		if ( !extension_loaded( 'gmp' ) ) {
			return false;
		}
		$sig64Hex = strtolower( $sig64Hex );
		$msg32Hex = strtolower( $msg32Hex );
		$pubkey32Hex = strtolower( $pubkey32Hex );
		if (
			!preg_match( '/^[0-9a-f]{128}$/', $sig64Hex ) ||
			!preg_match( '/^[0-9a-f]{64}$/', $msg32Hex ) ||
			!preg_match( '/^[0-9a-f]{64}$/', $pubkey32Hex )
		) {
			return false;
		}

		$p = $this->gmpFromHex( self::SECP256K1_P );
		$n = $this->gmpFromHex( self::SECP256K1_N );

		$r = $this->gmpFromHex( substr( $sig64Hex, 0, 64 ) );
		$s = $this->gmpFromHex( substr( $sig64Hex, 64, 64 ) );
		if ( gmp_cmp( $r, $p ) >= 0 || gmp_cmp( $s, $n ) >= 0 ) {
			return false;
		}

		$P = $this->liftX( $this->gmpFromHex( $pubkey32Hex ) );
		if ( $P === null ) {
			return false;
		}

		$eBytes = $this->taggedHash(
			'BIP0340/challenge',
			$this->intToBytes32( $r ) . $this->intToBytes32( $P['x'] ) . hex2bin( $msg32Hex )
		);
		$e = gmp_mod( $this->gmpFromBin( $eBytes ), $n );

		$G = $this->G();
		$sG = $this->pointMul( $s, $G );
		$neP = $this->pointMul( gmp_mod( gmp_sub( $n, $e ), $n ), $P );
		$R = $this->pointAdd( $sG, $neP );

		if ( $R === null ) {
			return false;
		}

		// R must have even y and x == r
		if ( gmp_intval( gmp_mod( $R['y'], 2 ) ) === 1 ) {
			return false;
		}
		return gmp_cmp( $R['x'], $r ) === 0;
	}

	/**
	 * Derive x-only pubkey hex from secret key hex.
	 *
	 * @param string $seckey32Hex 64 hex
	 * @return string|null 64 hex x-only pubkey
	 */
	public function deriveXOnlyPubkeyHexFromSeckeyHex( string $seckey32Hex ): ?string {
		if ( !extension_loaded( 'gmp' ) ) {
			return null;
		}
		$seckey32Hex = strtolower( $seckey32Hex );
		if ( !preg_match( '/^[0-9a-f]{64}$/', $seckey32Hex ) ) {
			return null;
		}
		$n = $this->gmpFromHex( self::SECP256K1_N );
		$d = $this->gmpFromHex( $seckey32Hex );
		if ( gmp_cmp( $d, 0 ) <= 0 || gmp_cmp( $d, $n ) >= 0 ) {
			return null;
		}
		$P = $this->pointMul( $d, $this->G() );
		if ( $P === null ) {
			return null;
		}
		return strtolower( $this->gmpToHexPadded( $P['x'], 64 ) );
	}

	// ---------------------------------------------------------------------
	// Bech32 (BIP173) decoding (for npub/nsec)
	// ---------------------------------------------------------------------

	/**
	 * @param string $bech Bech32 string
	 * @return array{hrp:string,data:string}|null data returned as raw bytes
	 */
	private function bech32Decode( string $bech ): ?array {
		$bech = strtolower( trim( $bech ) );
		$pos = strrpos( $bech, '1' );
		if ( $pos === false || $pos < 1 || $pos + 7 > strlen( $bech ) ) {
			return null;
		}

		$hrp = substr( $bech, 0, $pos );
		$dataPart = substr( $bech, $pos + 1 );
		$charset = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';

		$data = [];
		for ( $i = 0; $i < strlen( $dataPart ); $i++ ) {
			$idx = strpos( $charset, $dataPart[$i] );
			if ( $idx === false ) {
				return null;
			}
			$data[] = $idx;
		}

		if ( !$this->bech32VerifyChecksum( $hrp, $data ) ) {
			return null;
		}

		// Drop 6 checksum values
		$values = array_slice( $data, 0, -6 );
		$bytes = $this->convertBits( $values, 5, 8, false );
		if ( $bytes === null || strlen( $bytes ) !== 32 ) {
			return null;
		}

		return [
			'hrp' => $hrp,
			'data' => $bytes,
		];
	}

	private function bech32HrpExpand( string $hrp ): array {
		$ret = [];
		for ( $i = 0; $i < strlen( $hrp ); $i++ ) {
			$ret[] = ord( $hrp[$i] ) >> 5;
		}
		$ret[] = 0;
		for ( $i = 0; $i < strlen( $hrp ); $i++ ) {
			$ret[] = ord( $hrp[$i] ) & 31;
		}
		return $ret;
	}

	private function bech32Polymod( array $values ): int {
		$gen = [ 0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3 ];
		$chk = 1;
		foreach ( $values as $v ) {
			$top = $chk >> 25;
			$chk = ( ( $chk & 0x1ffffff ) << 5 ) ^ $v;
			for ( $i = 0; $i < 5; $i++ ) {
				if ( ( ( $top >> $i ) & 1 ) === 1 ) {
					$chk ^= $gen[$i];
				}
			}
		}
		return $chk;
	}

	private function bech32VerifyChecksum( string $hrp, array $data ): bool {
		$values = array_merge( $this->bech32HrpExpand( $hrp ), $data );
		return $this->bech32Polymod( $values ) === 1;
	}

	/**
	 * Convert between bit groups (from/to), as per BIP173.
	 *
	 * @param array $data int[]
	 * @param int $fromBits
	 * @param int $toBits
	 * @param bool $pad
	 * @return string|null raw bytes
	 */
	private function convertBits( array $data, int $fromBits, int $toBits, bool $pad ): ?string {
		$acc = 0;
		$bits = 0;
		$ret = [];
		$maxv = ( 1 << $toBits ) - 1;
		foreach ( $data as $value ) {
			if ( $value < 0 || ( $value >> $fromBits ) !== 0 ) {
				return null;
			}
			$acc = ( $acc << $fromBits ) | $value;
			$bits += $fromBits;
			while ( $bits >= $toBits ) {
				$bits -= $toBits;
				$ret[] = ( $acc >> $bits ) & $maxv;
			}
		}
		if ( $pad ) {
			if ( $bits > 0 ) {
				$ret[] = ( $acc << ( $toBits - $bits ) ) & $maxv;
			}
		} else {
			if ( $bits >= $fromBits ) {
				return null;
			}
			if ( ( ( $acc << ( $toBits - $bits ) ) & $maxv ) !== 0 ) {
				return null;
			}
		}
		return pack( 'C*', ...$ret );
	}

	// ---------------------------------------------------------------------
	// secp256k1 + BIP340 helpers (GMP)
	// ---------------------------------------------------------------------

	private function G(): array {
		return [
			'x' => $this->gmpFromHex( self::SECP256K1_GX ),
			'y' => $this->gmpFromHex( self::SECP256K1_GY ),
		];
	}

	private function gmpFromHex( string $hex ): \GMP {
		return gmp_init( $hex, 16 );
	}

	/**
	 * @param string $bin 32-byte string
	 * @return \GMP
	 */
	private function gmpFromBin( string $bin ): \GMP {
		return gmp_import( $bin, 1, GMP_MSW_FIRST | GMP_BIG_ENDIAN );
	}

	private function gmpToHexPadded( \GMP $x, int $len ): string {
		$hex = gmp_strval( $x, 16 );
		return str_pad( $hex, $len, '0', STR_PAD_LEFT );
	}

	private function modP( \GMP $x ): \GMP {
		$p = $this->gmpFromHex( self::SECP256K1_P );
		$r = gmp_mod( $x, $p );
		if ( gmp_cmp( $r, 0 ) < 0 ) {
			$r = gmp_add( $r, $p );
		}
		return $r;
	}

	private function modInvP( \GMP $x ): ?\GMP {
		$p = $this->gmpFromHex( self::SECP256K1_P );
		$inv = gmp_invert( $x, $p );
		return $inv === false ? null : $inv;
	}

	private function pointAdd( ?array $P, ?array $Q ): ?array {
		if ( $P === null ) return $Q;
		if ( $Q === null ) return $P;

		$p = $this->gmpFromHex( self::SECP256K1_P );
		$x1 = $P['x']; $y1 = $P['y'];
		$x2 = $Q['x']; $y2 = $Q['y'];

		if ( gmp_cmp( $x1, $x2 ) === 0 ) {
			// P == Q or P == -Q
			if ( gmp_cmp( $this->modP( gmp_add( $y1, $y2 ) ), 0 ) === 0 ) {
				return null; // infinity
			}
			return $this->pointDouble( $P );
		}

		$lambdaNum = $this->modP( gmp_sub( $y2, $y1 ) );
		$lambdaDen = $this->modP( gmp_sub( $x2, $x1 ) );
		$inv = $this->modInvP( $lambdaDen );
		if ( $inv === null ) return null;
		$lambda = $this->modP( gmp_mul( $lambdaNum, $inv ) );

		$x3 = $this->modP( gmp_sub( gmp_sub( gmp_powm( $lambda, 2, $p ), $x1 ), $x2 ) );
		$y3 = $this->modP( gmp_sub( gmp_mul( $lambda, gmp_sub( $x1, $x3 ) ), $y1 ) );
		return [ 'x' => $x3, 'y' => $y3 ];
	}

	private function pointDouble( array $P ): ?array {
		$p = $this->gmpFromHex( self::SECP256K1_P );
		$x1 = $P['x']; $y1 = $P['y'];
		if ( gmp_cmp( $y1, 0 ) === 0 ) {
			return null;
		}

		$three = gmp_init( 3, 10 );
		$two = gmp_init( 2, 10 );

		$lambdaNum = $this->modP( gmp_mul( $three, gmp_powm( $x1, 2, $p ) ) );
		$lambdaDen = $this->modP( gmp_mul( $two, $y1 ) );
		$inv = $this->modInvP( $lambdaDen );
		if ( $inv === null ) return null;
		$lambda = $this->modP( gmp_mul( $lambdaNum, $inv ) );

		$x3 = $this->modP( gmp_sub( gmp_powm( $lambda, 2, $p ), gmp_mul( $two, $x1 ) ) );
		$y3 = $this->modP( gmp_sub( gmp_mul( $lambda, gmp_sub( $x1, $x3 ) ), $y1 ) );

		return [ 'x' => $x3, 'y' => $y3 ];
	}

	private function pointMul( \GMP $k, array $P ): ?array {
		$n = $this->gmpFromHex( self::SECP256K1_N );
		$k = gmp_mod( $k, $n );
		if ( gmp_cmp( $k, 0 ) === 0 ) {
			return null;
		}
		$result = null;
		$addend = $P;

		while ( gmp_cmp( $k, 0 ) > 0 ) {
			if ( gmp_testbit( $k, 0 ) ) {
				$result = $this->pointAdd( $result, $addend );
			}
			$addend = $this->pointDouble( $addend );
			if ( $addend === null ) {
				// doubling went to infinity, remaining bits won't help
				break;
			}
			$k = gmp_div_q( $k, 2 );
		}

		return $result;
	}

	/**
	 * Lift x to curve point with even y (BIP340 lift_x).
	 *
	 * @param \GMP $x
	 * @return array|null point {x,y}
	 */
	private function liftX( \GMP $x ): ?array {
		$p = $this->gmpFromHex( self::SECP256K1_P );
		if ( gmp_cmp( $x, 0 ) < 0 || gmp_cmp( $x, $p ) >= 0 ) {
			return null;
		}
		// y^2 = x^3 + 7 mod p
		$y2 = $this->modP( gmp_add( gmp_powm( $x, 3, $p ), 7 ) );
		$y = $this->modSqrt( $y2 );
		if ( $y === null ) {
			return null;
		}
		// Ensure even y
		if ( gmp_intval( gmp_mod( $y, 2 ) ) === 1 ) {
			$y = gmp_sub( $p, $y );
		}
		return [ 'x' => $x, 'y' => $y ];
	}

	/**
	 * Modular square root for secp256k1 field (p % 4 == 3 => sqrt(a) = a^((p+1)/4)).
	 *
	 * @param \GMP $a
	 * @return \GMP|null
	 */
	private function modSqrt( \GMP $a ): ?\GMP {
		$p = $this->gmpFromHex( self::SECP256K1_P );
		$exp = gmp_div_q( gmp_add( $p, 1 ), 4 );
		$y = gmp_powm( $a, $exp, $p );
		// Check solution
		if ( gmp_cmp( $this->modP( gmp_powm( $y, 2, $p ) ), $this->modP( $a ) ) !== 0 ) {
			return null;
		}
		return $y;
	}

	/**
	 * Tagged hash (BIP340).
	 *
	 * @param string $tag
	 * @param string $msg raw bytes
	 * @return string raw bytes (32)
	 */
	private function taggedHash( string $tag, string $msg ): string {
		$tagHash = hash( 'sha256', $tag, true );
		return hash( 'sha256', $tagHash . $tagHash . $msg, true );
	}

	private function intToBytes32( \GMP $x ): string {
		$bin = gmp_export( $x, 1, GMP_MSW_FIRST | GMP_BIG_ENDIAN );
		if ( $bin === false ) {
			$bin = '';
		}
		return str_pad( $bin, 32, "\0", STR_PAD_LEFT );
	}

	private function xorBytes( string $a, string $b ): string {
		return $a ^ $b;
	}
}
